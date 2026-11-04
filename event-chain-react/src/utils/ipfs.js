import { create } from 'ipfs-http-client';
import { IPFS_API_URL, IPFS_PROJECT_ID, IPFS_PROJECT_SECRET, IPFS_GATEWAY, USE_LOCAL_IPFS } from '../config/contract';

// Helper function to create base64 auth string
const createAuth = (projectId, projectSecret) => {
  if (!projectId || !projectSecret) return '';
  const credentials = `${projectId}:${projectSecret}`;
  // Use btoa for browser environment
  if (typeof btoa !== 'undefined') {
    return `Basic ${btoa(credentials)}`;
  }
  // Fallback for Node.js environment
  if (typeof Buffer !== 'undefined') {
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
  }
  return '';
};

// Create IPFS client
const auth = createAuth(IPFS_PROJECT_ID, IPFS_PROJECT_SECRET);

let ipfs;
try {
  ipfs = create({
    url: IPFS_API_URL,
    headers: auth ? {
      authorization: auth
    } : {},
    // For local IPFS, we might need to handle CORS
    // The IPFS daemon must have CORS enabled
  });
} catch (error) {
  console.error('Failed to create IPFS client:', error);
  ipfs = null;
}

// Check if local IPFS is running
export const checkLocalIPFS = async () => {
  if (!USE_LOCAL_IPFS) return true; // Skip check for public IPFS
  
  try {
    // IPFS API requires POST for most endpoints, but version can work with GET
    // Try using the IPFS client directly instead of fetch
    if (ipfs) {
      const version = await ipfs.version();
      return !!version;
    }
    // Fallback: try POST request (IPFS API requires POST for most endpoints)
    const response = await fetch('http://127.0.0.1:5001/api/v0/version', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.ok;
  } catch (error) {
    // Check if it's a CORS error
    if (error.message && (error.message.includes('CORS') || error.message.includes('NetworkError'))) {
      console.error('IPFS CORS Error: IPFS is running but CORS is not enabled.');
      console.error('Run: enable-ipfs-cors.bat (Windows) or see IPFS_CORS_FIX.md for manual setup');
    } else {
      console.warn('IPFS check failed:', error);
    }
    return false;
  }
};

/**
 * Upload file to IPFS
 * @param {File} file - File to upload
 * @returns {Promise<string>} IPFS hash
 */
export const uploadToIPFS = async (file) => {
  if (!ipfs) {
    throw new Error('IPFS client not initialized. Make sure IPFS is running.');
  }

  // Check if local IPFS is running
  if (USE_LOCAL_IPFS) {
    const isRunning = await checkLocalIPFS();
    if (!isRunning) {
      throw new Error('Local IPFS node is not accessible. Make sure: 1) IPFS daemon is running (ipfs daemon), 2) CORS is enabled (run enable-ipfs-cors.bat). See IPFS_CORS_FIX.md for details.');
    }
  }

  try {
    const fileBuffer = await file.arrayBuffer();
    const result = await ipfs.add(fileBuffer);
    return result.path; // Returns the IPFS hash (CID)
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    if (USE_LOCAL_IPFS) {
      throw new Error('Failed to upload to local IPFS. Make sure IPFS is running on 127.0.0.1:5001 and CORS is enabled. See IPFS_CORS_FIX.md');
    }
    throw new Error('Failed to upload file to IPFS. Check your internet connection.');
  }
};

/**
 * Get IPFS gateway URL
 * @param {string} hash - IPFS hash
 * @returns {string} Full IPFS gateway URL
 */
export const getIPFSURL = (hash) => {
  return `${IPFS_GATEWAY}${hash}`;
};

