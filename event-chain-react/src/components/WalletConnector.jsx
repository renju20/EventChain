import React from 'react';
import { useWallet } from '../context/WalletContext';

const WalletConnector = () => {
  const { account, connect, disconnect, isConnecting, error, isConnected } = useWallet();

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-800 font-medium">Wallet Connected</p>
            <p className="text-xs text-green-600 mt-1 font-mono">{account}</p>
          </div>
          <button
            onClick={disconnect}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p className="text-sm text-yellow-800 mb-3">
        Please connect your MetaMask wallet to continue.
      </p>
      <button
        onClick={connect}
        disabled={isConnecting}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded font-medium transition-colors"
      >
        {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default WalletConnector;

