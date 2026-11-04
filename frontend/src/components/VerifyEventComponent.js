import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Hash, QrCode, Loader2, CheckCircle, XCircle, AlertCircle, Camera, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { eventService } from '../services/api';

const VerifyEventComponent = () => {
  const [hash, setHash] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const qrCodeRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
    if (newValue === 0 && scanning) {
      stopScanning();
    }
    setHash('');
    setResult(null);
    setError(null);
  };

  const handleVerify = async () => {
    if (!hash.trim()) {
      setError('Please enter a hash to verify');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await eventService.verifyHash(hash.trim());
      setResult(response);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to verify hash'
      );
    } finally {
      setLoading(false);
    }
  };

  const stopScanning = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          html5QrCodeRef.current.clear();
          html5QrCodeRef.current = null;
        })
        .catch((err) => {
          console.error('Error stopping QR scanner:', err);
        });
    }
    setScanning(false);
  };

  const startScanning = async () => {
    try {
      setError(null);
      setScanning(true);

      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setHash(decodedText);
          stopScanning();
          setTabValue(0);
          setTimeout(() => {
            handleVerify();
          }, 500);
        },
        (errorMessage) => {
          // Ignore scanning errors
        }
      );
    } catch (err) {
      console.error('QR Scan Error:', err);
      setError('Error starting QR scanner. Please ensure camera permissions are granted.');
      setScanning(false);
      html5QrCodeRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        stopScanning();
      }
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Verify Event
        </h1>
        <p className="text-gray-600">
          Verify the authenticity of an event by entering its IPFS hash or scanning a QR code
        </p>
      </div>

      <div className="card">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => handleTabChange(0)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all ${
              tabValue === 0
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Hash className="h-5 w-5" />
            <span>Enter Hash</span>
          </button>
          <button
            onClick={() => handleTabChange(1)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all ${
              tabValue === 1
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <QrCode className="h-5 w-5" />
            <span>Scan QR Code</span>
          </button>
        </div>

        {/* Hash Input Tab */}
        {tabValue === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                IPFS Hash
              </label>
              <input
                type="text"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="Enter IPFS hash (e.g., QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco)"
                className="input-field"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={loading || !hash.trim()}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  <span>Verify Hash</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* QR Scanner Tab */}
        {tabValue === 1 && (
          <div className="space-y-4">
            {scanning ? (
              <div>
                <div id="qr-reader" className="w-full max-w-md mx-auto mb-4 rounded-lg overflow-hidden"></div>
                <button
                  onClick={() => {
                    stopScanning();
                    setTabValue(0);
                  }}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <X className="h-5 w-5" />
                  <span>Cancel Scan</span>
                </button>
              </div>
            ) : (
              <button
                onClick={startScanning}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Camera className="h-5 w-5" />
                <span>Start QR Scanner</span>
              </button>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-slide-up">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Verification Result */}
        {result && (
          <div className="mt-6 card animate-slide-up">
            <div className="flex items-center space-x-3 mb-4">
              {result.exists ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              <h3 className="text-xl font-bold text-gray-800">Verification Result</h3>
            </div>
            <div className={`p-4 rounded-lg mb-4 ${
              result.exists ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <p className={`font-semibold ${
                result.exists ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {result.message || (result.exists ? 'Hash verified and exists on-chain' : 'Hash not found on-chain')}
              </p>
            </div>
            {result.exists && result.index !== null && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Event Index:</span>
                  <span className="font-mono text-gray-900">{result.index?.toString()}</span>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700">Status: Verified</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEventComponent;
