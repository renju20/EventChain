# EventChain – Universal Verifiable Event Ledger

EventChain is a full-stack blockchain application that records events (such as certificates or documents) on an **append-only on-chain ledger**, so anyone can later check that a record is genuine and has not been altered.

Event metadata is stored on **IPFS**, its hash is written to a **Solidity smart contract**, and each event produces a **proof JSON and QR code** that can be verified against the blockchain.

## Why this project

Paper and PDF certificates are easy to fake. EventChain makes a record tamper-evident: once an event is on-chain it cannot be edited, and verification only needs the metadata hash.

## Features

- Add events (type + metadata) to the blockchain through a REST API or a React web app
- Metadata stored on IPFS, hash stored on-chain
- Timeline view of every recorded event
- Verify any event by its hash
- Proof JSON and QR code generated for each event
- MetaMask wallet connection in the web frontends

## Architecture

| Layer | Technology | Location |
|---|---|---|
| Smart contract | Solidity ^0.8.19 | `contracts/EventChain.sol` |
| Backend API | Java 17, Spring Boot 3.2, Web3j, ZXing | `src/`, `pom.xml` |
| Frontend (CRA) | React, ethers.js, Tailwind CSS | `frontend/` |
| Frontend (Vite) | React, ethers.js, Tailwind CSS | `event-chain-react/` |
| Storage | IPFS | external node |
| Local chain | Ganache | external tool |

## Project structure

```
EventChain/
├── contracts/            # Solidity smart contracts (EventChain.sol)
├── src/main/java/        # Spring Boot backend
│   └── com/eventchain/   # config, controller, dto, model, service
├── src/main/resources/   # application.properties.example
├── frontend/             # React (Create React App) frontend
├── event-chain-react/    # React (Vite) frontend
├── scripts/              # Deployment scripts
├── tests/                # Contract tests
├── Dockerfile, docker-compose.yml
└── pom.xml
```

## Prerequisites

1. Java 17+
2. Maven 3.6+
3. Node.js 18+ (for the React frontends)
4. An IPFS node (`ipfs daemon`, default `localhost:5001`) – https://docs.ipfs.tech/install/
5. A blockchain: Ganache for local testing, or a testnet RPC such as Sepolia

## Local configuration

Real keys are never committed. Create your own config files from the examples:

- **Backend:** copy `src/main/resources/application.properties.example` to `src/main/resources/application.properties` and fill in your values.
- **Vite frontend:** copy `event-chain-react/src/config/contract.example.js` to `event-chain-react/src/config/contract.js` and fill in your values.

## Getting started (local test setup, no real crypto)

1. **Start Ganache** (https://trufflesuite.com/ganache/) and click *Quickstart*. It runs on `http://127.0.0.1:7545` with 10 test accounts.
2. **Deploy the contract** `contracts/EventChain.sol` with Remix (https://remix.ethereum.org) connected to Ganache. Compile with Solidity 0.8.19 and copy the deployed contract address. See `QUICK_TEST_SETUP.md` for a step-by-step guide.
3. **Configure the backend** in `application.properties`:
   ```properties
   blockchain.network.url=http://127.0.0.1:7545
   blockchain.contract.address=YOUR_DEPLOYED_CONTRACT_ADDRESS
   blockchain.private.key=YOUR_GANACHE_PRIVATE_KEY
   ipfs.host=127.0.0.1
   ipfs.port=5001
   ipfs.protocol=http
   ```
4. **Run the backend:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   The API is available at `http://localhost:8080`.
5. **Run a frontend** (pick one):
   ```bash
   cd event-chain-react   # or: cd frontend
   npm install
   npm run dev            # CRA frontend: npm start
   ```
6. **Connect MetaMask** to Ganache (`http://127.0.0.1:7545`, Chain ID `1337`) and import a Ganache account.

For a public network, deploy the contract to a testnet such as **Sepolia** or **Polygon Amoy**, point `blockchain.network.url` at an RPC endpoint, and supply the private key through the `BLOCKCHAIN_PRIVATE_KEY` environment variable instead of a file.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/events` | Upload metadata to IPFS and store the event on-chain |
| GET | `/events` | Get all events |
| GET | `/events/{id}` | Get one event by index |
| GET | `/events/verify/{hash}` | Check whether a metadata hash exists on-chain |

**Create an event**
```bash
curl -X POST http://localhost:8080/events \
  -H "Content-Type: application/json" \
  -d '{"eventType":"certificate","metadata":"{\"name\":\"John Doe\",\"degree\":\"Computer Science\"}"}'
```

**Example response**
```json
{
  "index": 0,
  "actor": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "eventType": "certificate",
  "metadataHash": "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
  "timestamp": 1702809540,
  "transactionHash": "0xabc123...",
  "proofJson": "...",
  "qrCodeBase64": "iVBORw0KGgo..."
}
```

**Verify a hash**
```bash
curl http://localhost:8080/events/verify/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco
```
```json
{ "exists": true, "index": 0, "message": "Hash verified and exists on-chain" }
```

## Proof JSON

Each event generates a proof that is returned in the response and encoded as a QR code:

```json
{
  "eventHash": "0xabc123...",
  "actor": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "timestamp": "2025-12-17T09:39:00Z",
  "txHash": "0xdef456..."
}
```

## Docker

See `DOCKER.md` for running the backend with Docker and `docker-compose.yml`.

## Security notes

- Never commit private keys. Use environment variables or a secrets manager.
- IPFS content is public by hash, so do not store sensitive data without encryption.
- The wallet needs enough funds to pay gas fees on real networks.

## Troubleshooting

- **IPFS connection error:** make sure `ipfs daemon` is running and the port matches your config.
- **Transaction fails:** check the contract address, the RPC URL, and that the wallet has funds for gas.
- **Contract call errors:** confirm the contract is deployed on the same network the backend points to.

## License

MIT License

---

Built with Solidity, Spring Boot, Web3j, React and IPFS.
