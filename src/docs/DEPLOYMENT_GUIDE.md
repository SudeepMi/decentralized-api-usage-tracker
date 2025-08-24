# Vercel Deployment Guide

This guide explains the optimized project structure for deploying the Decentralized API Usage Tracker on Vercel.

## 🏗️ Current Project Structure

The project is organized for optimal Vercel deployment:

```
├── api/                    # Vercel API routes (serverless functions)
│   ├── register.ts        # API key registration
│   ├── proxy.ts           # API proxy with usage tracking
│   ├── usage.ts           # Usage statistics
│   └── tsconfig.json      # TypeScript config for API functions
├── src/                   # Source code and assets
│   ├── blockchain/        # Smart contracts and deployment
│   │   ├── contracts/
│   │   │   └── UsageLogger.sol  # Solidity contract for logging
│   │   ├── scripts/
│   │   │   └── deploy.js  # Deployment script
│   │   └── hardhat.config.js
│   ├── scripts/           # Database setup and utilities
│   │   └── setup-mongodb.js
│   └── docs/              # Documentation
├── App.tsx               # React main component
├── main.tsx              # React entry point
├── index.html            # HTML entry point
├── index.css             # Global styles
├── vite.config.ts        # Vite configuration
├── tailwind.config.mjs   # Tailwind CSS configuration
├── postcss.config.mjs    # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
├── vercel.json           # Vercel deployment configuration
└── package.json          # Dependencies and scripts
```

## 🚀 Key Features

### API Proxy with Blockchain Logging
- **Secure API Key Management**: Generate and validate API keys
- **Request Forwarding**: Proxy requests to external APIs (default: Open-Meteo weather API)
- **Dual Logging**: Log usage to both MongoDB and Ethereum blockchain
- **Audit Trail**: Each request includes blockchain transaction hash for verification

### Smart Contract Integration
- **UsageLogger Contract**: Solidity contract deployed on Sepolia testnet
- **Event Emission**: `ApiUsageLogged` events for transparent tracking
- **Request Hashing**: SHA-256 hashing of requests for integrity verification

### Frontend Dashboard
- **API Key Generation**: User-friendly interface for creating API keys
- **Usage Statistics**: Real-time usage tracking and analytics
- **Blockchain Verification**: Direct links to Etherscan for transaction verification
- **Test Interface**: Built-in API testing functionality

## 📦 Package.json Structure

The `package.json` has been unified to handle both frontend and backend:

```json
{
  "scripts": {
    "dev": "vercel dev",           # Development server
    "build": "tsc && vite build",  # Build frontend
    "build:api": "tsc --project api/tsconfig.json",  # Build API functions
    "preview": "vite preview",     # Preview build
    "deploy": "vercel --prod",     # Deploy to production
    "start": "vercel dev",         # Start development server
    "setup": "node src/scripts/setup-mongodb.js",  # Database setup
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

## 🔧 Vercel Configuration

The `vercel.json` is configured with specific runtime versions:

```json
{
  "version": 2,
  "functions": {
    "api/register.ts": {
      "runtime": "@vercel/node@5.3.13"
    },
    "api/usage.ts": {
      "runtime": "@vercel/node@5.3.13"
    },
    "api/proxy.ts": {
      "runtime": "@vercel/node@5.3.13"
    }
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

## 🚀 Deployment Steps

### 1. Prerequisites
- Node.js 18+ installed
- Vercel CLI installed (`npm i -g vercel`)
- MongoDB database (Atlas recommended)
- Ethereum wallet with Sepolia testnet ETH
- Smart contract deployed on Sepolia

### 2. Local Development
```bash
npm install
npm run dev
```

### 3. Environment Variables
Set these in your Vercel dashboard:

**Database Configuration:**
- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB_NAME` - Database name (default: api-usage-tracker)

**Blockchain Configuration:**
- `BLOCKCHAIN_RPC` - Sepolia RPC endpoint (e.g., Infura, Alchemy)
- `BLOCKCHAIN_PRIVATE_KEY` - Private key for transaction signing
- `BLOCKCHAIN_CONTRACT_ADDRESS` - Deployed UsageLogger contract address

**API Configuration:**
- `PROXY_TARGET_BASE` - Base URL for proxied API (default: https://api.open-meteo.com/v1)

### 4. Deploy to Vercel
```bash
npm run deploy
```

## 🔗 API Endpoints

### `/api/register`
- **Method**: GET
- **Purpose**: Generate new API key
- **Parameters**: `userId` (required)
- **Response**: `{ success: true, apiKey: string, userId: string }`

### `/api/proxy`
- **Method**: GET, POST, PUT, DELETE
- **Purpose**: Proxy requests to external APIs with usage tracking
- **Parameters**: 
  - `key` or `x-api-key` header (required)
  - `endpoint` (required)
  - `tag` (optional, for categorization)
  - Any other parameters passed to target API
- **Response**: Target API response + audit information

### `/api/usage`
- **Method**: GET
- **Purpose**: Get usage statistics
- **Parameters**: `key` (required)
- **Response**: `{ success: true, data: { totalUsage, recentLogs, apiKey } }`

## 📁 File Organization Benefits

### For Development
- **Clear Separation**: API functions vs frontend code
- **Easy Navigation**: Related files are grouped together
- **TypeScript Support**: Unified TypeScript configuration
- **Hot Reload**: Vite provides fast development experience

### For Deployment
- **Vercel Optimization**: Structure matches Vercel's expectations
- **Automatic Detection**: Vercel detects framework and builds accordingly
- **Serverless Ready**: API functions are automatically deployed as serverless
- **Edge Functions**: Optimized for global performance

### For Maintenance
- **Documentation**: All docs in one place
- **Scripts**: Database and blockchain scripts organized
- **Version Control**: Clean git history with logical structure
- **Monitoring**: Built-in Vercel analytics and logging

## 🔄 Migration from Old Structure

If you're migrating from the old structure:

1. **Frontend Files**: Moved from `frontend/` to root level
2. **Documentation**: Moved from `docs/` to `src/docs/`
3. **Scripts**: Moved from `scripts/` to `src/scripts/`
4. **Blockchain**: Moved from `blockchain/` to `src/blockchain/`
5. **Package.json**: Merged frontend and backend dependencies
6. **Runtime Versions**: Updated to use specific Vercel Node.js runtime versions

## 📚 Related Documentation

- [Blockchain Logging Guide](BLOCKCHAIN_LOGGING.md) - How to check API logs on Sepolia Etherscan
- [Vercel Migration Guide](VERCEL_MIGRATION.md) - Complete migration from Firebase
- [MongoDB Migration Guide](MONGODB_MIGRATION.md) - Database setup and migration
- [Quick Start Guide](QUICK_START.md) - Get up and running quickly
- [API Examples](API_EXAMPLES.md) - API usage examples 