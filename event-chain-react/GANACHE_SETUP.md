# 🎯 Ganache Setup for EventChain

## Your Ganache Configuration

**Ganache Port:** `7545`  
**Account Address:** `0x12e4d4db5C06A7d519c8a5c5DF21b97A467fFFD6`  
**Private Key:** `<YOUR_GANACHE_PRIVATE_KEY>`

---

## ✅ Quick Setup Steps

### 1. Start Ganache
- Open Ganache Desktop
- Make sure it's running on port **7545**
- Your account should be visible with test ETH

### 2. Configure MetaMask

1. **Open MetaMask** in your browser
2. **Click network dropdown** → **Add Network** → **Add a network manually**
3. **Enter these details:**
   - **Network Name:** `Ganache Local`
   - **RPC URL:** `http://localhost:7545`
   - **Chain ID:** `1337` (or check Ganache for actual Chain ID)
   - **Currency Symbol:** `ETH`
   - **Block Explorer:** (leave empty)
4. **Click Save**

### 3. Import Your Account to MetaMask

1. In MetaMask, click **account icon** (top right)
2. Click **Import Account**
3. Select **Private Key**
4. Paste: `<YOUR_GANACHE_PRIVATE_KEY>`
5. Click **Import**

✅ You should now see your account with test ETH!

### 4. Deploy Contract to Ganache

If you haven't deployed the contract yet:

```bash
# Using Hardhat (if you have a Hardhat project)
npx hardhat run scripts/deploy.js --network ganache

# Or use Remix IDE:
# 1. Go to https://remix.ethereum.org
# 2. Connect to Ganache: http://localhost:7545
# 3. Deploy your contract
# 4. Copy the contract address
```

### 5. Update Contract Address

Update `src/config/contract.js`:
```javascript
export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress';
```

### 6. Start the App

```bash
run.bat
```

Or:
```bash
npm run dev
```

Open: http://localhost:5173

---

## 🔍 Verify Everything is Working

1. **Ganache is running** → Check Ganache Desktop shows accounts
2. **MetaMask connected** → Should show "Ganache Local" network
3. **Account imported** → Should show your account with ETH
4. **Contract deployed** → Address updated in `contract.js`
5. **App running** → http://localhost:5173 opens

---

## 🐛 Troubleshooting

**MetaMask won't connect?**
- Make sure Ganache is running
- Check RPC URL is exactly: `http://localhost:7545`
- Verify Chain ID matches Ganache (usually 1337)

**No ETH in account?**
- Check Ganache - accounts should have 100 ETH each
- Make sure you imported the correct private key

**Contract not found?**
- Verify contract is deployed to Ganache
- Check contract address in `src/config/contract.js`
- Make sure MetaMask is on "Ganache Local" network

**Port 7545 not working?**
- Check Ganache settings - port should be 7545
- If using different port, update `LOCAL_RPC_URL` in `contract.js`

---

## 📝 Notes

- **Ganache default port:** 7545
- **Hardhat default port:** 8545
- The app is configured for **port 7545** (Ganache)
- All transactions use test ETH - no real money!

---

**You're all set! 🚀**

