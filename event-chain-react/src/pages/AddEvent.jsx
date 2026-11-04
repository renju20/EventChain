import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { uploadToIPFS } from '../utils/ipfs';
import { addEvent } from '../utils/contract';
import WalletConnector from '../components/WalletConnector';

const AddEvent = () => {
  const { provider, isConnected } = useWallet();
  const [eventType, setEventType] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [ipfsHash, setIpfsHash] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    if (!eventType.trim()) {
      setMessage({ type: 'error', text: 'Please enter an event type' });
      return;
    }

    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file to upload' });
      return;
    }

    try {
      setIsUploading(true);
      setMessage({ type: 'info', text: 'Uploading file to IPFS...' });

      // Upload file to IPFS
      const hash = await uploadToIPFS(file);
      setIpfsHash(hash);
      setMessage({ type: 'info', text: `File uploaded! IPFS Hash: ${hash}. Submitting to blockchain...` });

      setIsUploading(false);
      setIsSubmitting(true);

      // Submit to blockchain
      const tx = await addEvent(provider, eventType, hash);
      setMessage({ type: 'info', text: 'Transaction submitted! Waiting for confirmation...' });

      await tx.wait();
      setMessage({ type: 'success', text: 'Event successfully added to blockchain!' });

      // Reset form
      setEventType('');
      setFile(null);
      setIpfsHash('');
      e.target.reset();

    } catch (error) {
      console.error('Error adding event:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to add event. Please try again.'
      });
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Add New Event
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <WalletConnector />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <input
                  type="text"
                  id="eventType"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  placeholder="e.g., Certificate, Document, Receipt"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isUploading || isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Event File *
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isUploading || isSubmitting}
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {message.text && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === 'error'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {ipfsHash && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">IPFS Hash:</p>
                  <p className="text-xs font-mono text-gray-600 break-all">{ipfsHash}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!isConnected || isUploading || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isUploading
                  ? 'Uploading to IPFS...'
                  : isSubmitting
                  ? 'Submitting to Blockchain...'
                  : 'Add Event'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;

