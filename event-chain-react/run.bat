@echo off
echo ========================================
echo   EventChain React - Starting Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo Using --legacy-peer-deps to resolve dependency conflicts...
    echo.
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
)

REM Check configuration for local mode
findstr /C:"USE_LOCAL_IPFS = true" src\config\contract.js >nul 2>&1
if %errorlevel% == 0 (
    echo Checking local services...
    echo.
    
    REM Check if IPFS is running
    curl -s -X POST http://127.0.0.1:5001/api/v0/version >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] IPFS is not running on 127.0.0.1:5001
        echo To start IPFS, open a new terminal and run: ipfs daemon
        echo If IPFS is running but shows 405 error, enable CORS (see IPFS_CORS_FIX.md)
        echo.
    ) else (
        echo [OK] IPFS is running
    )
    
    REM Check if local blockchain is running (Ganache: 7545, Hardhat: 8545)
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
    echo Note: If services are not running, some features may not work.
    echo See README.md for setup instructions.
    echo.
    timeout /t 3 >nul
)

REM Start the development server
echo ========================================
echo Starting development server...
echo ========================================
echo.
echo The app will open at: http://localhost:5173
echo.
call npm run dev

pause

