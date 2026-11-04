import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Navbar = () => {
  const location = useLocation();
  const { account, connect, disconnect, isConnected } = useWallet();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              EventChain
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                Home
              </Link>
              <Link
                to="/add-event"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/add-event') ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                Add Event
              </Link>
              <Link
                to="/timeline"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/timeline') ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                Timeline
              </Link>
              <Link
                to="/verify"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/verify') ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                Verify Event
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <>
                <span className="text-sm bg-blue-700 px-3 py-1 rounded">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
                <button
                  onClick={disconnect}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={connect}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

