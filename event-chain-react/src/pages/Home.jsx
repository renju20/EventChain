import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnector from '../components/WalletConnector';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              EventChain
            </h1>
            <p className="text-2xl text-gray-700 mb-2">
              Universal Verifiable Event Ledger
            </p>
            <p className="text-gray-600 mt-4">
              A decentralized, immutable ledger for recording and verifying events on the blockchain
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <WalletConnector />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Add Events</h3>
              <p className="text-gray-600 mb-4">
                Record events with metadata and files stored on IPFS
              </p>
              <Link
                to="/add-event"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Add Event →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">View Timeline</h3>
              <p className="text-gray-600 mb-4">
                Browse all events in chronological order
              </p>
              <Link
                to="/timeline"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Timeline →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Verify Events</h3>
              <p className="text-gray-600 mb-4">
                Verify event authenticity using hash or QR code
              </p>
              <Link
                to="/verify"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Verify Event →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Connect Your Wallet</h3>
                  <p className="text-gray-600">
                    Connect your MetaMask wallet to interact with the EventChain smart contract
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Upload Event Data</h3>
                  <p className="text-gray-600">
                    Upload event files to IPFS and record event metadata on the blockchain
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Verify & Track</h3>
                  <p className="text-gray-600">
                    Verify event authenticity and track all events in the immutable timeline
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

