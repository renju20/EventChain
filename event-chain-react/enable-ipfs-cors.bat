@echo off
echo ========================================
echo   Enabling CORS for IPFS
echo ========================================
echo.
echo This script will configure IPFS to allow requests from your browser.
echo.
echo IMPORTANT: Make sure IPFS daemon is STOPPED before running this!
echo (Press Ctrl+C in the IPFS terminal if it's running)
echo.
pause

echo.
echo Configuring CORS headers...
echo.

REM Enable CORS for localhost and 127.0.0.1 on common ports
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"http://localhost:5173\", \"http://127.0.0.1:5173\", \"http://localhost:3000\", \"http://127.0.0.1:3000\", \"http://localhost:5174\", \"http://127.0.0.1:5174\"]"

if errorlevel 1 (
    echo ERROR: Failed to set Access-Control-Allow-Origin
    echo Make sure IPFS is installed and ipfs command is available.
    pause
    exit /b 1
)

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\", \"OPTIONS\"]"

if errorlevel 1 (
    echo ERROR: Failed to set Access-Control-Allow-Methods
    pause
    exit /b 1
)

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"

if errorlevel 1 (
    echo ERROR: Failed to set Access-Control-Allow-Credentials
    pause
    exit /b 1
)

echo.
echo [OK] CORS configuration updated successfully!
echo.
echo Verifying configuration...
ipfs config API.HTTPHeaders
echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo.
echo 1. Start IPFS daemon:
echo    ipfs daemon
echo.
echo 2. Keep the IPFS terminal open
echo.
echo 3. Start your EventChain app:
echo    run.bat
echo.
echo ========================================
pause

