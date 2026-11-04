# 🏠 Quick Local Setup Guide

This is a quick reference for running EventChain **without internet**.

## ✅ Prerequisites Checklist

- [ ] Node.js installed (`node --version`)
- [ ] IPFS installed and running
- [ ] Local blockchain (Hardhat or Ganache) running
- [ ] MetaMask configured for local network
- [ ] Smart contract deployed locally

---

## 🚀 Quick Start (3 Steps)

### 1. Start IPFS
```bash
ipfs daemon
```
✅ Verify: Open http://localhost:5001/webui

### 2. Start Local Blockchain

**Option A - Hardhat:**
```bash
npx hardhat node
```

**Option B - Ganache:**
- Open Ganache Desktop app
- Click "Quickstart"

✅ Verify: Check http://localhost:7545 (Ganache) or http://localhost:8545 (Hardhat)

### 3. Start the App
```bash
run.bat
```
Or:
```bash
npm run dev
```

✅ Open: http://localhost:5173

---

## ⚙️ Configuration

The app is **already configured for local mode** in `src/config/contract.js`:

```javascript
USE_LOCAL_IPFS = true          // ✅ Local IPFS
USE_LOCAL_BLOCKCHAIN = true    // ✅ Local blockchain
```

**To switch to online mode:**
- Set both to `false`

---

## 🔧 MetaMask Setup

1. Open MetaMask
2. Add Network → Add manually
3. Enter:
   - **Network Name:** `Ganache Local` (or `Localhost 8545` for Hardhat)
   - **RPC URL:** `http://localhost:7545` (Ganache) or `http://localhost:8545` (Hardhat)
   - **Chain ID:** `1337` (check your Ganache/Hardhat settings)
   - **Currency:** `ETH`
4. Import account from Hardhat/Ganache (copy private key)

---

## 📝 Deploy Contract

```bash
# In your Hardhat project:
npx hardhat run scripts/deploy.js --network localhost
```

Copy the contract address and update `src/config/contract.js`:
```javascript
CONTRACT_ADDRESS = '0xYourAddressHere'
```

---

## 🐛 Troubleshooting

**IPFS not working?**
- Check: `ipfs daemon` is running
- Test: http://localhost:5001/webui
- Restart IPFS if needed

**Blockchain not connecting?**
- Check: Hardhat/Ganache is running
- Verify: MetaMask is on local network
- Test: http://localhost:7545 (Ganache) or http://localhost:8545 (Hardhat)

**Contract not found?**
- Verify contract address in `src/config/contract.js`
- Make sure contract is deployed to local blockchain
- Check MetaMask is on correct network

---

## 📚 Full Documentation

See `README.md` for complete setup instructions.

---

**That's it! You're running offline! 🎉**

