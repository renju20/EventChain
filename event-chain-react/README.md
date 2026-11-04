# EventChain – Universal Verifiable Event Ledger

## 📖 What is This Project?

This is a **React website** that lets you:
- 📝 Add events (like certificates or documents) to the blockchain
- 📊 See all events in a timeline
- ✅ Verify if an event is real or fake

Think of it like a digital diary that can't be changed once you write in it!

---

## 🎯 What You Need Before Starting

### Step 1: Install Node.js
**What is Node.js?** It's a tool that lets you run JavaScript on your computer.

**How to install:**
1. Go to https://nodejs.org/
2. Download the LTS version (the green button)
3. Install it (just click "Next" on everything)
4. **Check if it worked:** Open your terminal/command prompt and type:
   ```bash
   node --version
   ```
   You should see a number like `v18.17.0` or higher ✅

**What if it doesn't work?**
- Make sure you restarted your computer after installing
- Try downloading again from the website

### Step 2: Install MetaMask
**What is MetaMask?** It's like a digital wallet for your browser.

**How to install:**
1. Go to https://metamask.io/
2. Click "Download" and choose your browser (Chrome, Firefox, etc.)
3. Click "Install MetaMask" in your browser's extension store
4. Create a new wallet (write down your password and secret words!)
5. **For offline mode:** Configure local network (see Step 3 in offline setup)
6. **For online mode:** Add a test network (like Sepolia or Mumbai)

---

## 🚀 How to Run This Project

### ⚡ Quick Start (Using Batch File)

**Windows Users - Easiest Method:**
1. Double-click `run.bat` in the project folder
2. The script will automatically install dependencies and start the server
3. Open your browser to `http://localhost:5173`

---

## 🏠 Running Locally WITHOUT Internet (Offline Mode)

This project can run completely offline using local services. Perfect for:
- 🚫 No internet connection
- 🔒 Private/secure environments
- 🎓 Learning and development
- 🧪 Testing without using real networks

### Prerequisites for Offline Mode

1. **Node.js** (already installed if you followed Step 1 above)
2. **IPFS** - For local file storage
3. **Local Blockchain** - Hardhat or Ganache for smart contracts
4. **MetaMask** - Browser wallet extension

---

### 📦 Step 1: Install IPFS (For File Storage)

**What is IPFS?** It's like a local file storage system that works without internet.

**Windows Installation:**
1. Download IPFS from: https://dist.ipfs.io/#go-ipfs
2. Extract the ZIP file
3. Add IPFS to your PATH (or use full path)
4. Open a new terminal and run:
   ```bash
   ipfs init
   ipfs daemon
   ```
5. Keep this terminal open - IPFS is now running on `http://localhost:5001`

**Verify IPFS is running:**
- Open browser: http://localhost:5001/webui
- You should see the IPFS web interface

---

### ⛓️ Step 2: Set Up Local Blockchain

You need a local blockchain to deploy and interact with smart contracts.

#### Option A: Using Hardhat (Recommended)

1. **Install Hardhat globally:**
   ```bash
   npm install -g hardhat
   ```

2. **Create a new Hardhat project** (in a separate folder):
   ```bash
   mkdir eventchain-contracts
   cd eventchain-contracts
   npx hardhat init
   # Choose: Create a JavaScript project
   ```

3. **Start local blockchain:**
   ```bash
   npx hardhat node
   ```
   - This starts a local blockchain on `http://localhost:8545`
   - Keep this terminal open
   - You'll see 20 test accounts with fake ETH

#### Option B: Using Ganache (Easier GUI)

1. **Download Ganache:**
   - Go to: https://trufflesuite.com/ganache/
   - Download and install Ganache Desktop

2. **Start Ganache:**
   - Open Ganache application
   - Click "New Workspace" → "Quickstart"
   - Ganache runs on `http://localhost:8545`

---

### 🔧 Step 3: Configure MetaMask for Local Blockchain

1. **Open MetaMask** in your browser
2. **Click the network dropdown** (top of MetaMask)
3. **Click "Add Network" → "Add a network manually"**
4. **Enter these details:**

   **For Hardhat:**
   - Network Name: `Hardhat Local`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
   - Block Explorer: (leave empty)

   **For Ganache:**
   - Network Name: `Ganache Local`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `5777`
   - Currency Symbol: `ETH`
   - Block Explorer: (leave empty)

5. **Import test account:**
   - Copy a private key from Hardhat/Ganache terminal
   - In MetaMask: Click account icon → "Import Account"
   - Paste the private key
   - You now have test ETH! 🎉

---

### 📝 Step 4: Deploy Smart Contract to Local Blockchain

1. **Create your contract** (or use existing EventChain contract)
2. **Deploy using Hardhat:**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
3. **Copy the contract address** from the output
4. **Update `src/config/contract.js`:**
   ```javascript
   export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress';
   ```

---

### ⚙️ Step 5: Configure App for Local Mode

The app is already configured for local mode! Check `src/config/contract.js`:

```javascript
export const USE_LOCAL_IPFS = true;        // Use local IPFS
export const USE_LOCAL_BLOCKCHAIN = true;  // Use local blockchain
```

**If you want to switch back to online mode:**
- Set both to `false` in `src/config/contract.js`

---

### 🚀 Step 6: Start the Application

**Method 1: Using Batch File (Easiest)**
```bash
# Double-click or run:
run.bat
```

**Method 2: Using Command Line**
```bash
npm install --legacy-peer-deps
npm run dev
```

**Method 3: Check Services First**
```bash
# This checks if IPFS and blockchain are running:
start-local-services.bat
```

**What to expect:**
- App starts on `http://localhost:5173`
- Open in browser
- Connect MetaMask (select local network)
- Everything works offline! 🎉

---

## 🌐 Running WITH Internet (Online Mode)

If you have internet and want to use public services:

1. **Update `src/config/contract.js`:**
   ```javascript
   export const USE_LOCAL_IPFS = false;
   export const USE_LOCAL_BLOCKCHAIN = false;
   ```

2. **Configure IPFS (optional):**
   - Get Infura IPFS credentials
   - Update `IPFS_PROJECT_ID` and `IPFS_PROJECT_SECRET`

3. **Use public testnet:**
   - Deploy contract to Sepolia, Mumbai, etc.
   - Update `CONTRACT_ADDRESS`
   - Configure MetaMask for testnet

4. **Run the app:**
   ```bash
   npm run dev
   ```

---

## 📋 Quick Setup Checklist

### For Offline/Local Setup:
- [ ] Node.js installed
- [ ] IPFS installed and running (`ipfs daemon`)
- [ ] Hardhat or Ganache installed
- [ ] Local blockchain running (`npx hardhat node` or Ganache)
- [ ] MetaMask configured for local network
- [ ] Smart contract deployed to local blockchain
- [ ] Contract address updated in `src/config/contract.js`
- [ ] `USE_LOCAL_IPFS = true` in config
- [ ] `USE_LOCAL_BLOCKCHAIN = true` in config
- [ ] Run `run.bat` or `npm run dev`

---

## 📱 How to Use the Website

### Page 1: Home
- This is the welcome page
- Click "Connect Wallet" to connect your MetaMask
- Read about what the project does

### Page 2: Add Event
**How to add an event:**
1. Click "Add Event" in the menu
2. Click "Connect MetaMask" (if not connected)
3. Type an event name (like "My Certificate")
4. Choose a file to upload (PDF, image, etc.)
5. Click "Add Event"
6. **Wait for 2 confirmations:**
   - First: File uploads to IPFS (takes 5-10 seconds)
   - Second: Transaction appears in MetaMask - click "Confirm"

**What happens?**
- Your file goes to IPFS (like cloud storage)
- The website saves the file's address on the blockchain
- You can't change or delete it later!

### Page 3: Timeline
**How to see all events:**
1. Click "Timeline" in the menu
2. Make sure your wallet is connected
3. Click "Refresh Events"
4. You'll see all events that were added!

**What you'll see:**
- Event name
- Who added it (wallet address)
- When it was added
- A link to view the file

### Page 4: Verify Event
**How to check if an event is real:**
1. Click "Verify Event" in the menu
2. Connect your wallet
3. Paste an IPFS hash (the long code from an event)
   - OR click "Scan QR" to scan a QR code
4. Click "Verify Event"
5. You'll see ✅ (valid) or ❌ (invalid)

---

## 🐛 Common Problems & How to Fix Them

### Problem 1: "npm install" doesn't work
**Solution:**
```bash
# Delete the node_modules folder (if it exists)
# Then try again:
npm install
```

### Problem 2: Website won't start
**Solution:**
```bash
# Make sure you're in the right folder
cd Event-React

# Try starting again
npm start
```

### Problem 3: MetaMask won't connect
**Solutions:**
- Make sure MetaMask is unlocked (you entered your password)
- Refresh the webpage
- Make sure you're on the right network (check MetaMask)
- Try disconnecting and connecting again

### Problem 4: "Contract not found" error
**Solution:**
- Check that you updated the contract address in `src/config/contract.js`
- Make sure you're on the same network as your contract
- Ask your teacher for the correct contract address

### Problem 5: File won't upload to IPFS
**For Local IPFS:**
- Make sure IPFS is running: `ipfs daemon`
- Check http://localhost:5001/webui works
- Verify `USE_LOCAL_IPFS = true` in config

**For Public IPFS:**
- Check your internet connection
- Try a smaller file (under 10MB)
- Make sure the IPFS settings in `src/config/contract.js` are correct
- Check the browser console (F12) for error messages

### Problem 6: "Module not found" errors
**Solution:**
```bash
# Delete everything and start fresh
rm -rf node_modules
npm install
```

---

## 📂 What's Inside This Project?

```
Event-React/
├── src/
│   ├── pages/          ← The different pages (Home, Add Event, etc.)
│   ├── components/     ← Reusable pieces (like buttons)
│   ├── config/         ← Settings (contract address, etc.)
│   └── utils/          ← Helper functions
├── package.json        ← List of all code libraries needed
└── README.md           ← This file!
```

**You don't need to understand all of this to use it!** Just know where to change the contract address.

---

## 💡 Tips for Students

1. **Start Simple:** First, just get the website running. Don't worry about the contract yet.

2. **Read Error Messages:** When something breaks, the error message usually tells you what's wrong!

3. **Use Test Networks:** Don't use real money! Use test networks like Sepolia or Mumbai.

4. **Ask for Help:** If you're stuck, ask your teacher or classmates!

5. **Save Your Work:** If you change code, save the files before testing.

---

## ✅ Quick Checklist

Before you start, make sure you have:
- [ ] Node.js installed (`node --version` works)
- [ ] npm installed (`npm --version` works)
- [ ] MetaMask installed in your browser
- [ ] MetaMask wallet created
- [ ] Project folder open in terminal
- [ ] Run `npm install` successfully
- [ ] Updated contract address (if you have one)

---

## 🎓 What You'll Learn

By using this project, you'll learn about:
- **React** - How to build websites
- **Blockchain** - How blockchains store data
- **IPFS** - How to store files on the internet
- **Web3** - How websites talk to blockchains
- **Smart Contracts** - Programs that run on blockchains

---

## 🆘 Still Stuck?

1. **Check the error message** - It usually tells you what's wrong
2. **Check the browser console** - Press F12, click "Console" tab
3. **Ask your teacher** - They can help with contract addresses and setup
4. **Google the error** - Copy the error message and search online

---

## 📝 Notes for Teachers

- Students need a deployed smart contract to use all features
- The contract should have: `addEvent()`, `getAllEvents()`, and `verifyEvent()` functions
- **For offline classrooms:** Use local IPFS and Hardhat/Ganache - no internet needed!
- **Setup script:** Run `setup-local.bat` to guide students through local setup
- Local blockchain provides free test ETH - no real money needed
- All services run on localhost - completely private and secure

---

**Good luck! You've got this! 🚀**

If you get the website running, you're already doing great! Don't worry if everything doesn't work perfectly at first - that's how learning works! 💪
