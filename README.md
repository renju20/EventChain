# EventChain – Universal Verifiable Event Ledger

A full-stack blockchain application that provides a verifiable, append-only event ledger using Solidity smart contracts, IPFS for decentralized storage, and a Java Spring Boot backend.

## 🏗️ Architecture

### Smart Contract Layer (Solidity)
- **Contract**: `EventChain.sol`
- **Network**: Ethereum/Polygon (EVM-compatible chains)
- **Features**:
  - Append-only event storage
  - Event verification by hash
  - Query events by index or get all events

### Backend Layer (Java Spring Boot)
- **Framework**: Spring Boot 3.2.0
- **Blockchain Integration**: Web3j 4.9.8
- **IPFS Integration**: IPFS HTTP Client
- **QR Code Generation**: ZXing

## 📋 Prerequisites

1. **Java 17+** installed
2. **Maven 3.6+** installed
3. **IPFS Node** running (default: localhost:5001)
   - Install from: https://docs.ipfs.tech/install/
   - Start IPFS: `ipfs daemon`
4. **Ethereum/Polygon Node** or RPC endpoint
   - Polygon RPC: https://polygon-rpc.com (public)
   - Or use a local node like Ganache for testing

## 🚀 Getting Started

### Option A: Local Test Setup (Recommended for Education/Testing - No Real Crypto!)

**Perfect for learning and testing without spending real money!**

1. **Install Ganache** (Local blockchain):
   - Download: https://trufflesuite.com/ganache/
   - Install and click "Quickstart"
   - Ganache runs on `http://127.0.0.1:7545` with 10 test accounts (100 fake ETH each)

2. **Deploy Contract to Ganache**:
   - See `DEPLOY_TO_GANACHE.md` for detailed step-by-step instructions
   - Or use Remix IDE: https://remix.ethereum.org
   - Connect to Ganache and deploy
   - Copy the contract address

3. **Configure Application**:
   - Update `src/main/resources/application.properties`:
   ```properties
   blockchain.network.url=http://127.0.0.1:7545
   blockchain.contract.address=YOUR_DEPLOYED_CONTRACT_ADDRESS
   blockchain.private.key=YOUR_GANACHE_PRIVATE_KEY
   ```

4. **Connect MetaMask to Ganache**:
   - Add network: `http://127.0.0.1:7545`, Chain ID: `1337`
   - Import a Ganache account to MetaMask
   - You now have 100 fake ETH for testing!

**See `QUICK_TEST_SETUP.md` for a 5-minute setup guide!**

### Option B: Production Setup (Real Blockchain)

### 1. Deploy Smart Contract

1. Install Solidity compiler and deploy tools (Hardhat, Truffle, or Remix)
2. Compile `contracts/EventChain.sol`
3. Deploy to your target network (Polygon recommended for low gas fees)
4. Save the contract address

**Using Remix IDE (Easiest)**:
- Go to https://remix.ethereum.org
- Create a new file `EventChain.sol` and paste the contract code
- Compile with Solidity 0.8.19
- Deploy to Polygon (or testnet)
- Copy the deployed contract address

### 2. Configure Application

Edit `src/main/resources/application.properties`:

```properties
# Blockchain Configuration
blockchain.network.url=https://polygon-rpc.com
blockchain.contract.address=YOUR_CONTRACT_ADDRESS_HERE
blockchain.private.key=YOUR_PRIVATE_KEY_HERE

# IPFS Configuration
ipfs.host=127.0.0.1
ipfs.port=5001
ipfs.protocol=http
```

**⚠️ Security Note**: In production, use environment variables or a secrets manager for the private key.

### 3. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## 📡 API Endpoints

### POST /events
Create a new event by uploading metadata to IPFS and storing it on-chain.

**Request Body**:
```json
{
  "eventType": "certificate",
  "metadata": "{\"name\":\"John Doe\",\"degree\":\"Computer Science\"}"
}
```

**Response**:
```json
{
  "index": 0,
  "actor": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "eventType": "certificate",
  "metadataHash": "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
  "timestamp": 1702809540,
  "transactionHash": "0xabc123...",
  "proofJson": "{\n  \"eventHash\" : \"0x...\",\n  \"actor\" : \"0x...\",\n  \"timestamp\" : \"2025-12-17T09:39:00Z\",\n  \"txHash\" : \"0x...\"\n}",
  "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

### GET /events
Retrieve all events from the blockchain.

**Response**: Array of event objects (same structure as POST response)

### GET /events/{id}
Get a single event by its index.

**Path Parameters**:
- `id`: Event index (BigInteger)

**Response**: Single event object

### GET /verify/{hash}
Verify if an event hash exists on-chain.

**Path Parameters**:
- `hash`: IPFS metadata hash to verify

**Response**:
```json
{
  "exists": true,
  "index": 0,
  "message": "Hash verified and exists on-chain"
}
```

## 🔧 Development

### Project Structure

```
EventChain/
├── contracts/
│   └── EventChain.sol          # Solidity smart contract
├── src/main/java/com/eventchain/
│   ├── EventChainApplication.java
│   ├── config/
│   │   └── BlockchainConfig.java
│   ├── controller/
│   │   ├── EventController.java
│   │   └── GlobalExceptionHandler.java
│   ├── dto/
│   │   ├── EventRequest.java
│   │   ├── EventResponse.java
│   │   ├── ProofJson.java
│   │   └── VerifyResponse.java
│   ├── model/
│   │   └── Event.java
│   └── service/
│       ├── BlockchainService.java
│       ├── IpfsService.java
│       ├── ProofService.java
│       └── QRCodeService.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

### Testing

1. **Test IPFS Connection**:
   ```bash
   curl http://127.0.0.1:5001/api/v0/version
   ```

2. **Test Blockchain Connection**:
   - Ensure your RPC endpoint is accessible
   - Check contract address is correct
   - Verify private key has gas funds

3. **Test API**:
   ```bash
   # Create an event
   curl -X POST http://localhost:8080/events \
     -H "Content-Type: application/json" \
     -d '{
       "eventType": "test",
       "metadata": "{\"test\":\"data\"}"
     }'
   
   # Get all events
   curl http://localhost:8080/events
   
   # Verify a hash
   curl http://localhost:8080/events/verify/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco
   ```

## 🔐 Security Considerations

1. **Private Key Management**: Never commit private keys to version control. Use environment variables or secure vaults.
2. **IPFS Public Access**: IPFS content is publicly accessible by hash. Don't store sensitive data without encryption.
3. **Gas Fees**: Ensure the wallet has sufficient funds for transactions.
4. **Input Validation**: Always validate user inputs before processing.

## 📝 Proof JSON Format

Each event generates a verifiable proof JSON:

```json
{
  "eventHash": "0xabc123...",
  "actor": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "timestamp": "2025-12-17T09:39:00Z",
  "txHash": "0xdef456..."
}
```

This JSON is:
- Stored in the response
- Encoded as a QR code (base64 PNG)
- Verifiable on-chain using the transaction hash

## 🌐 Network Options

### Polygon (Recommended)
- Low gas fees
- Fast transactions
- EVM-compatible
- RPC: https://polygon-rpc.com

### Ethereum Mainnet
- Higher gas fees
- Most secure
- RPC: Use Infura, Alchemy, or own node

### Test Networks
- Polygon Mumbai: https://rpc-mumbai.maticvigil.com
- Goerli: Use Infura/Alchemy

## 📦 Dependencies

- **Spring Boot 3.2.0**: Web framework
- **Web3j 4.9.8**: Ethereum/Polygon integration
- **IPFS HTTP Client 1.4.4**: IPFS file operations
- **ZXing 3.5.2**: QR code generation
- **Lombok**: Boilerplate reduction

## 🐛 Troubleshooting

### IPFS Connection Error
- Ensure IPFS daemon is running: `ipfs daemon`
- Check IPFS port in application.properties matches your node

### Blockchain Transaction Fails
- Verify contract address is correct
- Ensure wallet has sufficient funds for gas
- Check RPC endpoint is accessible

### Contract Call Errors
- Verify contract is deployed to the configured network
- Ensure contract address matches deployed address
- Check network RPC URL is correct

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

Built with ❤️ using Solidity, Spring Boot, Web3j, and IPFS


## Local configuration
- Backend: copy `src/main/resources/application.properties.example` to `application.properties` and fill in your Ganache values.
- React app: copy `event-chain-react/src/config/contract.example.js` to `contract.js` and fill in your values.

## Project structure
- `src/`, `pom.xml`: Spring Boot backend
- `contracts/`: Solidity smart contracts
- `frontend/`: React (Create React App) frontend
- `event-chain-react/`: React (Vite) frontend
