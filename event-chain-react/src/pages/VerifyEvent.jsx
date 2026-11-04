import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { verifyEvent } from '../utils/contract';
import { getIPFSURL } from '../utils/ipfs';
import WalletConnector from '../components/WalletConnector';
import QrReader from 'react-qr-reader';

const VerifyEvent = () => {
  const { provider, isConnected } = useWallet();
  const [hash, setHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleVerify = async (hashToVerify) => {
    if (!isConnected || !provider) {
      setError('Please connect your wallet to verify events');
      return;
    }

    if (!hashToVerify.trim()) {
      setError('Please enter or scan an event hash');
      return;
    }

    setIsVerifying(true);
    setError(null);
    setVerificationResult(null);

    try {
      const isValid = await verifyEvent(provider, hashToVerify.trim());
      setVerificationResult({
        hash: hashToVerify.trim(),
        isValid,
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Error verifying event:', err);
      setError(err.message || 'Failed to verify event');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify(hash);
  };

  const handleScan = (data) => {
    if (data) {
      setHash(data);
      setShowScanner(false);
      handleVerify(data);
    }
  };

  const handleScanError = (err) => {
    console.error('QR Scan Error:', err);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Verify Event
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <WalletConnector />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="hash" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Hash (IPFS Hash)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="hash"
                    value={hash}
                    onChange={(e) => setHash(e.target.value)}
                    placeholder="Enter IPFS hash to verify"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isVerifying}
                  />
                  <button
                    type="button"
                    onClick={() => setShowScanner(!showScanner)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {showScanner ? 'Close Scanner' : '📷 Scan QR'}
                  </button>
                </div>
              </div>

              {showScanner && (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Scan QR Code:</p>
                  <QrReader
                    delay={300}
                    onError={handleScanError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {verificationResult && (
                <div
                  className={`rounded-lg p-6 border-2 ${
                    verificationResult.isValid
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-center mb-4">
                    {verificationResult.isValid ? (
                      <>
                        <div className="text-4xl mr-3">✅</div>
                        <div>
                          <h3 className="text-xl font-semibold text-green-800">
                            Event Verified
                          </h3>
                          <p className="text-sm text-green-600">
                            This event hash exists in the blockchain
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-4xl mr-3">❌</div>
                        <div>
                          <h3 className="text-xl font-semibold text-red-800">
                            Event Not Found
                          </h3>
                          <p className="text-sm text-red-600">
                            This event hash does not exist in the blockchain
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <p className="text-sm font-medium text-gray-700 mb-2">Hash:</p>
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded block break-all">
                      {verificationResult.hash}
                    </code>
                    <a
                      href={getIPFSURL(verificationResult.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                    >
                      View on IPFS →
                    </a>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Verified at: {verificationResult.timestamp.toLocaleString()}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={!isConnected || isVerifying || !hash.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isVerifying ? 'Verifying...' : 'Verify Event'}
              </button>
            </form>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <h3 className="font-semibold text-blue-900 mb-2">How to Verify</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Enter the IPFS hash of the event you want to verify</li>
              <li>Or scan a QR code containing the event hash</li>
              <li>The system will check if the hash exists in the blockchain</li>
              <li>If verified, you can view the event file on IPFS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEvent;

