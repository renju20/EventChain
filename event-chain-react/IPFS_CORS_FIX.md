# 🔧 Fix IPFS CORS Error (403/405)

## Problem
You're getting a CORS error when trying to access IPFS:
- `CORS Missing Allow Origin`
- `Cross-Origin Request Blocked`
- `Status code: 403` or `405`

This happens because IPFS daemon blocks browser requests by default for security.

## ⚡ Quick Fix (Windows)

**Easiest method - Use the batch file:**
1. **Stop IPFS daemon** (Ctrl+C in the terminal where it's running)
2. **Double-click:** `enable-ipfs-cors.bat`
3. **Restart IPFS:** `ipfs daemon`
4. **Done!** Try your app again

---

## 🔧 Manual Fix (All Platforms)

**If the batch file doesn't work, follow these steps:**

---

## ✅ Solution: Enable CORS in IPFS

### Step 1: Stop IPFS Daemon
If IPFS is running, stop it (Ctrl+C in the terminal where `ipfs daemon` is running).

### Step 2: Configure CORS
Open a new terminal and run these commands:

**Windows (PowerShell or CMD):**
```bash
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"http://localhost:5173\", \"http://127.0.0.1:5173\", \"http://localhost:3000\", \"http://127.0.0.1:3000\"]"

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
```

**Linux/Mac:**
```bash
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"]'

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
```

### Step 3: Verify CORS Configuration
```bash
ipfs config API.HTTPHeaders
```

You should see the CORS headers configured.

### Step 4: Restart IPFS Daemon
```bash
ipfs daemon
```

### Step 5: Test IPFS API
Open your browser and go to:
- **Web UI:** http://127.0.0.1:5001/webui
- **API Test:** http://127.0.0.1:5001/api/v0/version

Or test with curl:
```bash
curl -X POST http://127.0.0.1:5001/api/v0/version
```

---

## 🔍 Alternative: Quick CORS Fix (All Origins)

If you want to allow all origins (less secure, but easier for development):

```bash
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
```

**⚠️ Warning:** Only use this for local development, not production!

---

## 🐛 Troubleshooting

### IPFS daemon won't start?
- Check if port 5001 is already in use
- Try: `ipfs daemon --offline` to start without network

### Still getting 405 error?
1. **Check IPFS is running:**
   ```bash
   curl http://127.0.0.1:5001/api/v0/version
   ```

2. **Verify API address:**
   ```bash
   ipfs config Addresses.API
   ```
   Should show: `/ip4/127.0.0.1/tcp/5001`

3. **Check API gateway:**
   ```bash
   ipfs config Addresses.Gateway
   ```
   Should show: `/ip4/127.0.0.1/tcp/8080`

### Browser CORS errors?
- Make sure you're accessing the app from `http://localhost:5173` or `http://127.0.0.1:5173`
- Check browser console (F12) for specific CORS errors
- Try using `127.0.0.1` instead of `localhost` (or vice versa)

---

## 📝 Verify Everything Works

1. **IPFS daemon running:** Check terminal shows "Daemon is ready"
2. **Web UI accessible:** http://127.0.0.1:5001/webui opens
3. **API responds:** `curl -X POST http://127.0.0.1:5001/api/v0/version` returns version
4. **App can connect:** Try uploading a file in the EventChain app

---

## 💡 Additional IPFS Configuration

If you want to configure IPFS to use specific ports:

```bash
# Set API port (default: 5001)
ipfs config Addresses.API /ip4/127.0.0.1/tcp/5001

# Set Gateway port (default: 8080)
ipfs config Addresses.Gateway /ip4/127.0.0.1/tcp/8080

# Restart daemon after changes
ipfs daemon
```

---

**After enabling CORS, restart your EventChain app and try again!** 🚀

