import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

/**
 * Get contract instance
 * @param {ethers.BrowserProvider} provider - Web3 provider
 * @returns {Promise<ethers.Contract>} Contract instance
 */
export const getContract = async (provider) => {
  if (!provider) {
    throw new Error('Provider is required. Please connect your wallet.');
  }
  
  try {
    // In ethers v6, getSigner() is async and must be awaited
    const signer = await provider.getSigner();
    if (!signer) {
      throw new Error('Unable to get signer. Make sure MetaMask is connected and unlocked.');
    }
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } catch (error) {
    console.error('Error getting contract:', error);
    throw new Error(`Failed to get contract signer: ${error.message}`);
  }
};

/**
 * Connect to MetaMask
 * @returns {Promise<ethers.BrowserProvider>} Web3 provider
 */
export const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      return provider;
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw new Error('User rejected the request');
    }
  } else {
    throw new Error('MetaMask is not installed');
  }
};

/**
 * Get current account
 * @param {ethers.BrowserProvider} provider - Web3 provider
 * @returns {Promise<string>} Account address
 */
export const getCurrentAccount = async (provider) => {
  const accounts = await provider.listAccounts();
  return accounts[0]?.address || null;
};

/**
 * Add event to blockchain
 * @param {ethers.BrowserProvider} provider - Web3 provider
 * @param {string} eventType - Event type
 * @param {string} ipfsHash - IPFS hash
 * @returns {Promise<ethers.ContractTransactionResponse>} Transaction
 */
export const addEvent = async (provider, eventType, ipfsHash) => {
  if (!provider) {
    throw new Error('Provider is required. Please connect your wallet.');
  }
  
  const contract = await getContract(provider);
  const tx = await contract.addEvent(eventType, ipfsHash);
  return tx;
};

/**
 * Get all events from blockchain
 * @param {ethers.BrowserProvider} provider - Web3 provider
 * @returns {Promise<Array>} Array of events
 */
export const getAllEvents = async (provider) => {
  if (!provider) {
    throw new Error('Provider is required. Please connect your wallet.');
  }
  
  const contract = await getContract(provider);
  const events = await contract.getAllEvents();
  return events;
};

/**
 * Verify event hash
 * @param {ethers.BrowserProvider} provider - Web3 provider
 * @param {string} hash - Event hash to verify
 * @returns {Promise<boolean>} True if event exists
 */
export const verifyEvent = async (provider, hash) => {
  if (!provider) {
    throw new Error('Provider is required. Please connect your wallet.');
  }
  
  const contract = await getContract(provider);
  const isValid = await contract.verifyEvent(hash);
  return isValid;
};

