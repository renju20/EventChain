import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { eventService } from '../services/api';

const EventForm = () => {
  const { isConnected } = useWallet();
  const [eventType, setEventType] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [eventResponse, setEventResponse] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setEventResponse(null);

    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!eventType.trim()) {
      setError('Event type is required');
      return;
    }

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);

    try {
      let metadata;
      
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        const fileContent = await readFileAsText(file);
        metadata = JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          content: fileContent,
          size: file.size,
        });
      } else {
        const base64Content = await readFileAsBase64(file);
        metadata = JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          content: base64Content,
          size: file.size,
        });
      }

      const response = await eventService.createEvent(eventType, metadata);
      setEventResponse(response);
      setSuccess('Event created successfully!');
      setEventType('');
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to create event'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <div className="card">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Add New Event
          </h1>
          <p className="text-gray-600">
            Upload a file and specify an event type. The file will be stored on IPFS
            and the event will be recorded on the blockchain.
          </p>
        </div>

        {!isConnected && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              Please connect your wallet to add events.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Type
            </label>
            <input
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="e.g., certificate, document, transaction"
              className="input-field"
              required
              disabled={loading || !isConnected}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              File Upload
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
              <div className="space-y-1 text-center">
                {file ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          disabled={loading || !isConnected}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">Any file type supported</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isConnected || !eventType || !file}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating Event...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Create Event</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-slide-up">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3 animate-slide-up">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {eventResponse && (
          <div className="mt-6 card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Event Created Successfully</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Index:</span>
                <span className="font-mono text-gray-900">{eventResponse.index?.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">IPFS Hash:</span>
                <span className="font-mono text-xs text-gray-900 break-all">{eventResponse.metadataHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Transaction Hash:</span>
                <span className="font-mono text-xs text-gray-900 break-all">{eventResponse.transactionHash}</span>
              </div>
            </div>
            {eventResponse.qrCodeBase64 && (
              <div className="mt-4 flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={`data:image/png;base64,${eventResponse.qrCodeBase64}`}
                    alt="Event QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventForm;
