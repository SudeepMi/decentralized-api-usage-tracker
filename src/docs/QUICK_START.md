# Quick Start Guide

Get up and running with the Decentralized API Usage Tracker in minutes.

## 🚀 Prerequisites

1. **Node.js 18+** installed
2. **MongoDB** database (Atlas recommended)
3. **Ethereum wallet** with Sepolia testnet ETH
4. **Vercel account** (free tier works)

## ⚡ Quick Setup

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd decentralized-api-usage-tracker
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
MONGODB_DB_NAME=api-usage-tracker

# Blockchain (Sepolia)
BLOCKCHAIN_RPC=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
BLOCKCHAIN_CONTRACT_ADDRESS=your_deployed_contract_address

# API Configuration
PROXY_TARGET_BASE=https://api.open-meteo.com/v1
```

### 3. Deploy Smart Contract
```bash
cd src/blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. Deploy to Vercel
```bash
npm run deploy
```

## 🎯 First Steps

### 1. Generate API Key
1. Open your deployed application
2. Enter a user ID (e.g., "test-user")
3. Click "Generate API Key"
4. Copy the generated API key

### 2. Test API Request
1. Click "Test Request" to make a sample weather API call
2. Check the response for blockchain transaction details
3. Click the blockchain icon to view on Etherscan

### 3. Check Usage Statistics
1. View your usage statistics in the dashboard
2. See recent activity with blockchain verification links
3. Monitor your API usage patterns

## 🔗 API Usage Examples

### Basic Weather API Call
```bash
curl "https://your-app.vercel.app/api/proxy?key=YOUR_API_KEY&endpoint=/forecast&latitude=52.52&longitude=13.41&hourly=temperature_2m&tag=weather:v1"
```

### Custom API Proxy
```bash
curl "https://your-app.vercel.app/api/proxy?key=YOUR_API_KEY&endpoint=/your-endpoint&param1=value1&tag=custom:v1"
```

### Get Usage Statistics
```bash
curl "https://your-app.vercel.app/api/usage?key=YOUR_API_KEY"
```

## 🔍 Verify on Blockchain

1. **Get Transaction Hash**: From API response `audit.txHash`
2. **View on Etherscan**: https://sepolia.etherscan.io/tx/{txHash}
3. **Check Event Logs**: Look for `ApiUsageLogged` event

## 📊 Monitor Usage

### Dashboard Features
- **Real-time Statistics**: Total API calls and usage patterns
- **Recent Activity**: Latest requests with blockchain links
- **API Key Management**: Generate and manage multiple keys
- **Test Interface**: Built-in API testing functionality

### Blockchain Verification
- **Transaction History**: All API calls logged to Sepolia
- **Event Logs**: Detailed request information on-chain
- **Audit Trail**: Immutable record of all usage

## 🛠️ Development

### Local Development
```bash
npm run dev
```

### Build and Preview
```bash
npm run build
npm run preview
```

### Database Setup
```bash
npm run setup
```

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `MONGODB_DB_NAME` | Database name | No (default: api-usage-tracker) |
| `BLOCKCHAIN_RPC` | Sepolia RPC endpoint | Yes |
| `BLOCKCHAIN_PRIVATE_KEY` | Wallet private key | Yes |
| `BLOCKCHAIN_CONTRACT_ADDRESS` | Deployed contract address | Yes |
| `PROXY_TARGET_BASE` | Target API base URL | No (default: Open-Meteo) |

### Smart Contract Configuration
- **Network**: Sepolia testnet
- **Gas Limit**: 300,000 (recommended)
- **Gas Price**: Auto (recommended)

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid API Key"**
   - Ensure the API key is correct
   - Check if the key is active in the database

2. **"Blockchain logging failed"**
   - Verify Sepolia RPC endpoint
   - Check wallet has sufficient ETH
   - Ensure contract address is correct

3. **"MongoDB connection failed"**
   - Verify connection string
   - Check network access
   - Ensure database exists

### Debug Steps
1. Check Vercel function logs
2. Verify environment variables
3. Test blockchain connection
4. Check MongoDB connectivity

## 📚 Next Steps

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [Blockchain Logging Guide](BLOCKCHAIN_LOGGING.md) - How to check logs on Etherscan
- [API Documentation](API_EXAMPLES.md) - Complete API reference
- [MongoDB Migration](MONGODB_MIGRATION.md) - Database setup guide

## 🆘 Support

- **Issues**: Create a GitHub issue
- **Documentation**: Check the docs folder
- **Community**: Join our Discord/Telegram
- **Email**: support@yourdomain.com
