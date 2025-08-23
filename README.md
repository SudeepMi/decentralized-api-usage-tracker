# Decentralized API Usage Tracker

A decentralized API usage tracking system built with Vercel serverless functions and MongoDB, featuring blockchain logging for immutable audit trails.

## 🚀 Features

- **API Key Management**: Generate and manage API keys for users
- **Usage Tracking**: Monitor API usage with detailed analytics
- **Blockchain Logging**: Immutable audit trails on the blockchain
- **Proxy Functionality**: Route API requests through a secure proxy
- **Real-time Analytics**: Track usage patterns and statistics
- **Scalable Architecture**: Built on Vercel's serverless platform
- **Flexible Database**: MongoDB for schema flexibility and performance

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB (local or Atlas)
- **Blockchain**: Ethereum smart contracts for audit logging
- **Deployment**: Vercel platform

## 📁 Project Structure

```
├── api/                    # Vercel API routes
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

**Note**: This structure is optimized for Vercel deployment with frontend files at the root level and API functions in the `api/` directory.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas account)
- Vercel account

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up MongoDB**
   - Local: Install MongoDB locally
   - Atlas: Create a free MongoDB Atlas account

3. **Configure environment**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your settings
   ```

4. **Initialize database**
   ```bash
   npm run setup
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Deploy to Vercel**
   ```bash
   npm run deploy
   ```

For detailed setup instructions, see the [Quick Start Guide](QUICK_START.md).

## 📚 Documentation

- [Quick Start Guide](src/docs/QUICK_START.md) - Get up and running in minutes
- [Deployment Guide](src/docs/DEPLOYMENT_GUIDE.md) - Optimized structure for Vercel deployment
- [Vercel Migration Guide](src/docs/VERCEL_MIGRATION.md) - Firebase Functions to Vercel migration
- [MongoDB Migration Guide](src/docs/MONGODB_MIGRATION.md) - Complete Firebase to MongoDB migration
- [API Examples](src/docs/API_EXAMPLES.md) - API usage examples and documentation
- [Setup Guide](src/docs/SETUP.md) - Detailed setup instructions

## 🔧 API Endpoints

### Register API Key
```bash
POST /api/register?userId=your-user-id
```

### Proxy API Requests
```bash
GET /api/proxy?key=YOUR_API_KEY&endpoint=/forecast&latitude=52.52&longitude=13.41
```

### Get Usage Statistics
```bash
GET /api/usage?key=YOUR_API_KEY
```

## 🗄️ Database Schema

### Collections

- **apiKeys**: Store API keys and user information
- **usageLogs**: Track individual API requests
- **usageCounters**: Maintain usage statistics

### Indexes

Optimized indexes for fast queries on:
- API key lookups
- User-based queries
- Time-based sorting
- Request hash detection

## 🔗 Blockchain Integration

The system logs usage data to the Ethereum blockchain for immutable audit trails:

- **Smart Contract**: `UsageLogger.sol`
- **Functions**: 
  - `logUsage()` - Log API usage events
  - `lastSeenAt()` - Query last usage timestamp

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   vercel
   ```

2. **Set environment variables**
   - `MONGODB_URI` - MongoDB connection string
   - `MONGODB_DB_NAME` - Database name
   - `BLOCKCHAIN_RPC` - Ethereum RPC endpoint
   - `BLOCKCHAIN_PRIVATE_KEY` - Private key for transactions
   - `BLOCKCHAIN_CONTRACT_ADDRESS` - Deployed contract address

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `MONGODB_DB_NAME` | Database name | Yes |
| `BLOCKCHAIN_RPC` | Ethereum RPC endpoint | Yes |
| `BLOCKCHAIN_PRIVATE_KEY` | Private key for transactions | Yes |
| `BLOCKCHAIN_CONTRACT_ADDRESS` | Smart contract address | Yes |
| `PROXY_TARGET_BASE` | Base URL for proxied APIs | No |

## 🔍 Monitoring

### Vercel Analytics
- Function performance metrics
- Error tracking and logging
- Real-time monitoring

### MongoDB Monitoring
- Query performance analysis
- Connection pool monitoring
- Index usage statistics

## 🛠️ Development

### Local Development
```bash
npm run dev          # Start development server
npm run setup        # Initialize database
npm run build        # Build for production
```

### Testing
```bash
# Test API endpoints
curl -X POST "http://localhost:3000/api/register?userId=testuser"
curl "http://localhost:3000/api/proxy?key=API_KEY&endpoint=/test"
curl "http://localhost:3000/api/usage?key=API_KEY"
```

## 📊 Performance

- **Cold Start**: ~100-200ms (Vercel)
- **Database**: Optimized MongoDB queries with indexes
- **Caching**: Connection pooling for MongoDB
- **Scalability**: Automatic scaling with Vercel

## 🔒 Security

- **API Key Validation**: Secure API key verification
- **Request Hashing**: SHA256 hashing for request integrity
- **Blockchain Audit**: Immutable audit trails
- **CORS Protection**: Proper CORS headers
- **Input Validation**: Request parameter validation

## 💰 Cost Optimization

### Vercel Pricing
- **Hobby**: Free tier with generous limits
- **Pro**: $20/month with increased limits

### MongoDB Pricing
- **Atlas Free**: 512MB storage, shared clusters
- **Atlas Shared**: $9/month for 2GB storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the guides in this repository
- **Issues**: Create an issue for bugs or feature requests
- **Community**: Join discussions and get help

## 🔄 Migration from Firebase

This project has been migrated from Firebase Functions + Firestore to Vercel + MongoDB. See the migration guides for details:

- [MongoDB Migration Guide](MONGODB_MIGRATION.md)
- [Vercel Migration Guide](VERCEL_MIGRATION.md)

## 🎯 Roadmap

- [ ] Real-time WebSocket connections
- [ ] Advanced analytics dashboard
- [ ] Rate limiting and quotas
- [ ] Multi-chain support
- [ ] API documentation generator
- [ ] User authentication system
- [ ] Advanced monitoring and alerting 