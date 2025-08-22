# Quick Start Guide

Get your decentralized API usage tracker running with Vercel and MongoDB in minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB (local or Atlas account)
- Vercel account (free)

## 1. Clone and Install

```bash
# Install dependencies
npm install
```

## 2. Set Up MongoDB

### Option A: MongoDB Atlas (Recommended for production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (free tier is fine)
3. Get your connection string from the "Connect" button
4. Add your IP address to the whitelist

### Option B: Local MongoDB

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongod
```

## 3. Configure Environment

```bash
# Copy environment template
cp env.example .env.local
```

Edit `.env.local` with your settings:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=api-usage-tracker

# For MongoDB Atlas, use your connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Blockchain Configuration (optional for testing)
BLOCKCHAIN_RPC=https://your-rpc-endpoint
BLOCKCHAIN_PRIVATE_KEY=your-private-key
BLOCKCHAIN_CONTRACT_ADDRESS=0xYourContractAddress

# Proxy Configuration
PROXY_TARGET_BASE=https://api.open-meteo.com/v1
```

## 4. Initialize Database

```bash
# Set up collections and indexes
npm run setup
```

You should see:
```
✅ MongoDB setup completed successfully!

Collections created:
- apiKeys (with indexes: apiKey, userId, active)
- usageLogs (with indexes: apiKey, createdAt, userId, requestHash)
- usageCounters (with indexes: apiKey)
```

## 5. Test Locally

```bash
# Start development server
npm run dev
```

Your API will be available at `http://localhost:3000`

## 6. Test the API

### Register a new API key

```bash
curl -X POST "http://localhost:3000/api/register?userId=testuser"
```

Response:
```json
{
  "success": true,
  "apiKey": "your-generated-api-key",
  "userId": "testuser",
  "message": "API key generated successfully"
}
```

### Use the proxy

```bash
curl "http://localhost:3000/api/proxy?key=YOUR_API_KEY&endpoint=/forecast&latitude=52.52&longitude=13.41"
```

### Check usage stats

```bash
curl "http://localhost:3000/api/usage?key=YOUR_API_KEY"
```

## 7. Deploy to Vercel

### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npm run deploy
```

### Option B: Git-based Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

## Environment Variables for Production

Set these in your Vercel dashboard:

- `MONGODB_URI` - Your MongoDB connection string
- `MONGODB_DB_NAME` - Database name (e.g., `api-usage-tracker`)
- `BLOCKCHAIN_RPC` - Your blockchain RPC endpoint
- `BLOCKCHAIN_PRIVATE_KEY` - Your private key for blockchain transactions
- `BLOCKCHAIN_CONTRACT_ADDRESS` - Your smart contract address
- `PROXY_TARGET_BASE` - Base URL for proxied APIs

## API Endpoints

After deployment, your endpoints will be at:
- `https://your-project.vercel.app/api/register`
- `https://your-project.vercel.app/api/proxy`
- `https://your-project.vercel.app/api/usage`

## What's Next?

1. **Customize**: Modify the proxy target API
2. **Monitor**: Set up monitoring and alerts
3. **Scale**: Optimize for your traffic patterns
4. **Secure**: Add authentication and rate limiting
5. **Document**: Create API documentation for your users

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Check your connection string format
- Verify network connectivity
- Ensure MongoDB is running

**Environment Variables Not Working**
- Check variable names match exactly
- Redeploy after adding new variables
- Use `.env.local` for local development

**API Key Not Found**
- Run the setup script: `npm run setup`
- Check MongoDB collections exist
- Verify API key format

### Getting Help

- Check the [MongoDB Migration Guide](MONGODB_MIGRATION.md)
- Check the [Vercel Migration Guide](VERCEL_MIGRATION.md)
- Review the [API Examples](docs/API_EXAMPLES.md)

## Support

- **Issues**: Create an issue in the repository
- **Documentation**: Check the guides in this repository
- **Community**: Join our discussions 