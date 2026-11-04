// Example configuration file
// Copy this to contract.js and fill in your values

export const CONTRACT_ADDRESS = '0xYourContractAddressHere'; // Replace with your deployed contract address

export const CONTRACT_ABI = [
  // Your contract ABI here
  // See contract.js for example structure
];

// IPFS Configuration
// For LOCAL/OFFLINE use (recommended):
export const USE_LOCAL_IPFS = true;
export const IPFS_GATEWAY = 'http://localhost:8080/ipfs/';
export const IPFS_API_URL = 'http://localhost:5001/api/v0';
export const IPFS_PROJECT_ID = '';
export const IPFS_PROJECT_SECRET = '';

// For ONLINE use (requires internet):
// export const USE_LOCAL_IPFS = false;
// export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
// export const IPFS_API_URL = 'https://ipfs.infura.io:5001/api/v0';
// export const IPFS_PROJECT_ID = 'your-infura-project-id';
// export const IPFS_PROJECT_SECRET = 'your-infura-project-secret';

// Blockchain Configuration
// For LOCAL blockchain (recommended for offline use):
export const USE_LOCAL_BLOCKCHAIN = true;
// Ganache default port: 7545, Hardhat default port: 8545
export const LOCAL_RPC_URL = 'http://localhost:7545'; // Change to 8545 for Hardhat

// Ganache Account Configuration (optional - for reference)
// export const GANACHE_ACCOUNT = {
//   address: '0xYourAccountAddress',
//   privateKey: '0xYourPrivateKey'
// };

// For ONLINE testnets:
// export const USE_LOCAL_BLOCKCHAIN = false;
// Then configure MetaMask to use Sepolia, Mumbai, etc.

