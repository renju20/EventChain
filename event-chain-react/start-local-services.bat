@echo off
echo ========================================
echo   Starting Local Services for EventChain
echo ========================================
echo.

REM Check if IPFS is running
echo Checking IPFS...
curl -s -X POST http://127.0.0.1:5001/api/v0/version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] IPFS is not running on 127.0.0.1:5001
    echo To start IPFS, run: ipfs daemon
    echo If IPFS is running but shows 405 error, enable CORS (see IPFS_CORS_FIX.md)
    echo.
) else (
    echo [OK] IPFS is running
)

REM Check if local blockchain is running (Ganache: 7545, Hardhat: 8545)
echo Checking local blockchain...
curl -s http://localhost:7545 >nul 2>&1
if errorlevel 1 (
    curl -s http://localhost:8545 >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] Local blockchain is not running
        echo Ganache should run on localhost:7545
        echo Hardhat should run on localhost:8545
        echo Start Ganache GUI or run: npx hardhat node
        echo.
    ) else (
        echo [OK] Local blockchain is running on port 8545 (Hardhat)
    )
) else (
    echo [OK] Local blockchain is running on port 7545 (Ganache)
)

echo.
echo ========================================
echo   Starting EventChain Application
echo ========================================
echo.

REM Start the app
call npm run dev

pause

