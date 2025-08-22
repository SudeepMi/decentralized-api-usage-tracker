# 🚀 Setup Guide

This guide will walk you through setting up the Decentralized API Usage Tracker project.

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- MetaMask or Web3 wallet with testnet ETH
- Git

## Step 1: Project Setup

1. **Clone and install dependencies**
   ```bash
   npm run setup
   ```

2. **Initialize Firebase project**
   ```bash
   firebase login
   firebase init
   ```
   
   Select:
   - Functions (TypeScript)
   - Firestore
   - Hosting

## Step 2: Blockchain Setup

1. **Navigate to blockchain directory**
   ```bash
   cd blockchain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file:
   ```
   RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID
   DEPLOYER_KEY=your_private_key_here
   ```

5. **Deploy smart contract**
   ```bash
   npm run deploy:testnet
   ```
   
   **Save the contract address** - you'll need it for Firebase config.

## Step 3: Firebase Configuration

1. **Set Firebase Functions configuration**
   ```bash
   firebase functions:config:set \
     blockchain.rpc="YOUR_RPC_URL" \
     blockchain.pk="YOUR_PRIVATE_KEY" \
     blockchain.address="CONTRACT_ADDRESS" \
     proxy.target_base="https://api.open-meteo.com/v1"
   ```

2. **Deploy Firebase Functions**
   ```bash
   npm run deploy:functions
   ```

3. **Update frontend API URL**
   Edit `frontend/src/App.tsx`:
   ```typescript
   const API_BASE_URL = 'https://your-project.cloudfunctions.net'
   ```

## Step 4: Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Step 5: Testing

1. **Open the application** at `http://localhost:3000`

2. **Generate an API key**
   - Enter a user ID
   - Click "Generate API Key"

3. **Test API request**
   - Click "Test Request" to make a weather API call
   - Check the usage statistics
   - Verify on blockchain using the transaction hash

## Configuration Details

### Environment Variables

- `RPC_URL`: Your blockchain RPC endpoint (Infura, Alchemy, etc.)
- `DEPLOYER_KEY`: Private key for contract deployment (test wallet only)
- `FIREBASE_CONFIG`: Firebase project configuration

### API Endpoints

- `POST /register`: Generate new API key
- `GET /proxy`: Proxy API requests with logging
- `GET /usage`: Get usage statistics

### Supported Networks

- Polygon Mumbai (recommended for testing)
- Sepolia Testnet
- Local Hardhat network

## Troubleshooting

### Common Issues

1. **Contract deployment fails**
   - Check RPC URL and private key
   - Ensure you have testnet ETH

2. **Firebase Functions fail to deploy**
   - Verify Firebase project is selected
   - Check billing is enabled

3. **Frontend can't connect to API**
   - Update API_BASE_URL in App.tsx
   - Check CORS settings

### Getting Help

- Check Firebase Functions logs: `firebase functions:log`
- Verify contract deployment on blockchain explorer
- Check browser console for frontend errors

## Next Steps

- Add authentication to the frontend
- Implement rate limiting
- Add more API endpoints
- Deploy to mainnet (with proper security measures) 