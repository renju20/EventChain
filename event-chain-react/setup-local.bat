@echo off
echo ========================================
echo   EventChain - Local Setup Script
echo ========================================
echo.
echo This script will help you set up EventChain to run offline.
echo.
echo Prerequisites:
echo   1. Node.js installed
echo   2. IPFS installed (optional, for file storage)
echo   3. Hardhat or Ganache (optional, for local blockchain)
echo.
pause

echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed

echo.
echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)
echo [OK] npm is installed

echo.
echo Installing project dependencies...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo [OK] Dependencies installed

echo.
echo ========================================
echo   Setup Instructions
echo ========================================
echo.
echo 1. IPFS SETUP (for file storage):
echo    - Download IPFS from https://dist.ipfs.io/#go-ipfs
echo    - Install and run: ipfs daemon
echo    - IPFS will run on http://localhost:5001
echo.
echo 2. LOCAL BLOCKCHAIN SETUP (for smart contracts):
echo    Option A - Hardhat:
echo      - Install: npm install -g hardhat
echo      - Create a new Hardhat project
echo      - Run: npx hardhat node
echo      - This starts a local blockchain on http://localhost:8545
echo.
echo    Option B - Ganache:
echo      - Download from https://trufflesuite.com/ganache/
echo      - Install and start Ganache
echo      - Default RPC: http://localhost:8545
echo.
echo 3. CONFIGURE METAMASK:
echo    - Open MetaMask
echo    - Add Network: Localhost 8545
echo    - RPC URL: http://localhost:8545
echo    - Chain ID: 1337 (for Hardhat) or 5777 (for Ganache)
echo    - Currency Symbol: ETH
echo.
echo 4. DEPLOY CONTRACT:
echo    - Deploy your contract to local blockchain
echo    - Update src/config/contract.js with contract address
echo.
echo 5. START THE APP:
echo    - Run: run.bat
echo    - Or: npm run dev
echo.
echo ========================================
echo.
echo Setup complete! Follow the instructions above to start local services.
pause

