# Vercel Deployment Guide

This guide explains the optimized project structure for deploying the Decentralized API Usage Tracker on Vercel.

## 🏗️ Optimized Structure

The project has been reorganized for optimal Vercel deployment:

```
├── api/                    # Vercel API routes (serverless functions)
│   ├── register.ts        # API key registration
│   ├── proxy.ts           # API proxy with usage tracking
│   └── usage.ts           # Usage statistics
├── src/                   # Source code and assets
│   ├── blockchain/        # Smart contracts and deployment
│   ├── scripts/           # Database setup and utilities
│   └── docs/              # Documentation
├── App.tsx               # React main component
├── main.tsx              # React entry point
├── index.html            # HTML entry point
├── index.css             # Global styles
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
├── vercel.json           # Vercel deployment configuration
└── package.json          # Dependencies and scripts
```

## 🚀 Why This Structure?

### Frontend at Root Level
- **Vercel Standard**: Vercel expects frontend files at the root level
- **Automatic Detection**: Vercel automatically detects Vite/React projects
- **Simplified Build**: No need for complex build configurations

### API Functions in `/api`
- **Serverless Functions**: Vercel automatically deploys these as serverless functions
- **Direct Access**: Functions are available at `/api/function-name`
- **TypeScript Support**: Full TypeScript support without additional configuration

### Source Code in `/src`
- **Organization**: Keeps non-deployment files organized
- **Documentation**: All docs in one place
- **Blockchain**: Smart contracts and deployment scripts
- **Scripts**: Database setup and utilities

## 📦 Package.json Structure

The `package.json` has been unified to handle both frontend and backend:

```json
{
  "scripts": {
    "dev": "vercel dev",           # Development server
    "build": "tsc && vite build",  # Build frontend
    "preview": "vite preview",     # Preview build
    "deploy": "vercel --prod",     # Deploy to production
    "setup": "node src/scripts/setup-mongodb.js"
  }
}
```

## 🔧 Vercel Configuration

The `vercel.json` is configured for optimal deployment:

```json
{
  "version": 2,
  "functions": {
    "api/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## 🚀 Deployment Steps

### 1. Local Development
```bash
npm install
npm run dev
```

### 2. Deploy to Vercel
```bash
npm run deploy
```

### 3. Environment Variables
Set these in your Vercel dashboard:
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `BLOCKCHAIN_RPC`
- `BLOCKCHAIN_PRIVATE_KEY`
- `BLOCKCHAIN_CONTRACT_ADDRESS`
- `PROXY_TARGET_BASE`

## 📁 File Organization Benefits

### For Development
- **Clear Separation**: API functions vs frontend code
- **Easy Navigation**: Related files are grouped together
- **TypeScript Support**: Unified TypeScript configuration

### For Deployment
- **Vercel Optimization**: Structure matches Vercel's expectations
- **Automatic Detection**: Vercel detects framework and builds accordingly
- **Serverless Ready**: API functions are automatically deployed as serverless

### For Maintenance
- **Documentation**: All docs in one place
- **Scripts**: Database and blockchain scripts organized
- **Version Control**: Clean git history with logical structure

## 🔄 Migration from Old Structure

If you're migrating from the old structure:

1. **Frontend Files**: Moved from `frontend/` to root level
2. **Documentation**: Moved from `docs/` to `src/docs/`
3. **Scripts**: Moved from `scripts/` to `src/scripts/`
4. **Blockchain**: Moved from `blockchain/` to `src/blockchain/`
5. **Package.json**: Merged frontend and backend dependencies

## 📚 Related Documentation

- [Vercel Migration Guide](VERCEL_MIGRATION.md) - Complete migration from Firebase
- [Quick Start Guide](QUICK_START.md) - Get up and running quickly
- [API Examples](API_EXAMPLES.md) - API usage examples 