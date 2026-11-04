import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { getAllEvents } from '../utils/contract';
import { getIPFSURL } from '../utils/ipfs';
import WalletConnector from '../components/WalletConnector';

const Timeline = () => {
  const { provider, isConnected } = useWallet();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    if (!isConnected || !provider) {
      setError('Please connect your wallet to view events');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allEvents = await getAllEvents(provider);
      
      // Convert events to a more usable format
      const formattedEvents = allEvents.map((event, index) => ({
        id: index,
        actor: event.actor,
        eventType: event.eventType,
        timestamp: new Date(Number(event.timestamp) * 1000),
        ipfsHash: event.ipfsHash
      }));

      // Sort by timestamp (newest first)
      formattedEvents.sort((a, b) => b.timestamp - a.timestamp);
      
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && provider) {
      fetchEvents();
    }
  }, [isConnected, provider]);

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (date) => {
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Event Timeline
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <WalletConnector />
          </div>

          {!isConnected ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">Please connect your wallet to view events</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <button
                  onClick={fetchEvents}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  {loading ? 'Loading...' : 'Refresh Events'}
                </button>
              </div>

              {loading && (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <p className="text-gray-600">Loading events...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {!loading && !error && events.length === 0 && (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <p className="text-gray-600">No events found. Add your first event to get started!</p>
                </div>
              )}

              {!loading && !error && events.length > 0 && (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {event.eventType}
                          </h3>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Actor:</span>{' '}
                            <span className="font-mono">{formatAddress(event.actor)}</span>
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0 text-right">
                          <p className="text-sm text-gray-600">
                            {formatDate(event.timestamp)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">IPFS Hash:</span>
                        </p>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded break-all">
                            {event.ipfsHash}
                          </code>
                          <a
                            href={getIPFSURL(event.ipfsHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View on IPFS →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;

