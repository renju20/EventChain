import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, getCurrentAccount } from '../utils/contract';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const { ethers } = await import('ethers');
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const prov = new ethers.BrowserProvider(window.ethereum);
            setProvider(prov);
            const addr = await getCurrentAccount(prov);
            setAccount(addr);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setProvider(null);
        } else {
          checkConnection();
        }
      });
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const prov = await connectWallet();
      setProvider(prov);
      const addr = await getCurrentAccount(prov);
      setAccount(addr);
    } catch (err) {
      setError(err.message);
      console.error('Error connecting wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setError(null);
  };

  const value = {
    account,
    provider,
    isConnecting,
    error,
    connect,
    disconnect,
    isConnected: !!account
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

