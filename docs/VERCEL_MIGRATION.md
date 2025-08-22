# Migration from Firebase Functions to Vercel with MongoDB

This guide explains how to migrate your decentralized API usage tracker from Firebase Functions to Vercel's serverless computing platform with MongoDB for data storage.

## Why Vercel + MongoDB?

- **Better Performance**: Vercel's edge network provides faster response times globally
- **Simpler Deployment**: Git-based deployments with automatic previews
- **Cost Effective**: More predictable pricing than Firebase
- **Better Developer Experience**: Local development with `vercel dev`
- **TypeScript Support**: Native TypeScript support without additional configuration
- **Flexible Database**: MongoDB provides schema flexibility and better scaling options
- **Self-Hosted Option**: MongoDB can run on your own infrastructure or use MongoDB Atlas

## Migration Overview

### What's Changed

1. **File Structure**: 
   - Firebase Functions: `functions/src/index.ts`
   - Vercel: `api/register.ts`, `api/proxy.ts`, `api/usage.ts`

2. **Database**:
   - Firebase Firestore → MongoDB
   - Real-time listeners → Polling or WebSocket connections (if needed)

3. **Configuration**:
   - Firebase: `functions.config()` and `firebase.json`
   - Vercel: Environment variables and `vercel.json`

4. **Deployment**:
   - Firebase: `firebase deploy --only functions`
   - Vercel: `vercel --prod` or Git-based deployment

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

#### Option A: Local MongoDB

1. Install MongoDB locally:
   ```bash
   # macOS (using Homebrew)
   brew install mongodb-community
   
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add your IP address to the whitelist

### 3. Configure Environment Variables

Create a `.env.local` file (for local development) or set environment variables in Vercel dashboard:

```bash
# Copy the example file
cp env.example .env.local
```

Fill in your actual values:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=api-usage-tracker

# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
# MONGODB_DB_NAME=api-usage-tracker

# Blockchain Configuration
BLOCKCHAIN_RPC=https://your-rpc-endpoint
BLOCKCHAIN_PRIVATE_KEY=your-private-key
BLOCKCHAIN_CONTRACT_ADDRESS=0xYourContractAddress

# Proxy Configuration
PROXY_TARGET_BASE=https://api.open-meteo.com/v1
```

### 4. Initialize MongoDB Database

```bash
# Set up database collections and indexes
npm run setup
```

### 5. Local Development

```bash
# Start local development server
npm run dev
```

This will start the Vercel development server at `http://localhost:3000`

### 6. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy to production
npm run deploy
```

#### Option B: Git-based Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Vercel will automatically deploy on every push

## API Endpoints

After deployment, your API endpoints will be available at:

- **Register**: `https://your-project.vercel.app/api/register`
- **Proxy**: `https://your-project.vercel.app/api/proxy`
- **Usage**: `https://your-project.vercel.app/api/usage`

## Key Differences from Firebase Functions

### 1. Request/Response Handling

**Firebase Functions:**
```typescript
export const register = functions.https.onRequest(async (req, res) => {
  // Your code here
});
```

**Vercel:**
```typescript
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Your code here
}
```

### 2. Database Operations

**Firebase Functions:**
```typescript
const CFG = functions.config();
const db = admin.firestore();
await db.collection('apiKeys').doc(apiKey).set(data);
```

**Vercel + MongoDB:**
```typescript
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB_NAME);
await apiKeysCollection.insertOne(data);
```

### 3. Configuration

**Firebase Functions:**
```typescript
const CFG = functions.config();
const rpcUrl = CFG.blockchain?.rpc;
```

**Vercel:**
```typescript
const rpcUrl = process.env.BLOCKCHAIN_RPC;
```

### 4. CORS Handling

Both platforms handle CORS similarly, but Vercel provides more flexibility:

```typescript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

## Environment Variables in Vercel

### Setting Environment Variables

1. **Via Vercel Dashboard:**
   - Go to your project dashboard
   - Navigate to Settings → Environment Variables
   - Add each variable with appropriate values

2. **Via Vercel CLI:**
   ```bash
   vercel env add MONGODB_URI
   vercel env add BLOCKCHAIN_RPC
   # ... repeat for all variables
   ```

### Environment Variable Security

- **Production**: Set in Vercel dashboard (encrypted)
- **Preview**: Can inherit from production or be set separately
- **Development**: Use `.env.local` file (never commit this file)

## Database Schema

### Collections

#### 1. `apiKeys`
```javascript
{
  _id: ObjectId,
  apiKey: String,        // Unique API key
  userId: String,        // User identifier
  createdAt: Date,       // Creation timestamp
  active: Boolean,       // Whether key is active
  usageCount: Number     // Total usage count
}
```

#### 2. `usageLogs`
```javascript
{
  _id: ObjectId,
  apiKey: String,        // API key used
  userId: String,        // User identifier
  method: String,        // HTTP method
  endpoint: String,      // API endpoint
  params: Object,        // Request parameters
  status: Number,        // Response status
  createdAt: Date,       // Request timestamp
  requestHash: String,   // SHA256 hash of request
  tag: String           // Request tag
}
```

#### 3. `usageCounters`
```javascript
{
  _id: ObjectId,
  apiKey: String,        // API key
  total: Number,         // Total usage count
  updatedAt: Date        // Last update timestamp
}
```

## Performance Optimizations

### 1. Cold Start Reduction

Vercel functions have faster cold starts than Firebase Functions, but you can optimize further:

- Keep dependencies minimal
- Use connection pooling for MongoDB
- Implement proper error handling

### 2. Memory and Timeout

- **Memory**: Vercel provides up to 3008MB RAM
- **Timeout**: Maximum 10 seconds for Hobby plan, 60 seconds for Pro

### 3. MongoDB Connection Optimization

```typescript
// Use connection pooling
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000
});
```

### 4. Edge Functions

For even better performance, consider using Vercel Edge Functions:

```typescript
// api/edge-example.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({ message: 'Hello from the edge!' })
}

export const config = {
  runtime: 'edge'
}
```

## Monitoring and Logs

### Vercel Analytics

- **Function Logs**: Available in Vercel dashboard
- **Performance Metrics**: Automatic monitoring
- **Error Tracking**: Built-in error reporting

### MongoDB Monitoring

#### MongoDB Atlas
- Built-in monitoring dashboard
- Performance advisor
- Query analyzer
- Alerting system

#### Local MongoDB
```bash
# Check database stats
mongo --eval "db.stats()"

# Monitor slow queries
mongo --eval "db.setProfilingLevel(1, 100)"
```

### Custom Monitoring

You can integrate with external monitoring services:

```typescript
// Example: Sentry integration
import * as Sentry from '@sentry/nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Your code here
  } catch (error) {
    Sentry.captureException(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

## Cost Comparison

### Vercel Pricing (as of 2024)

- **Hobby**: Free tier with generous limits
- **Pro**: $20/month with increased limits
- **Enterprise**: Custom pricing

### MongoDB Atlas Pricing (as of 2024)

- **Free Tier**: 512MB storage, shared clusters
- **Shared Clusters**: $9/month for 2GB storage
- **Dedicated Clusters**: $57/month and up

### Firebase Functions + Firestore Pricing

- **Spark Plan**: Free tier (limited)
- **Blaze Plan**: Pay-per-use

Vercel + MongoDB typically offers better value for serverless functions, especially for low to medium traffic applications.

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure variables are set in Vercel dashboard
   - Check variable names match exactly
   - Redeploy after adding new variables

2. **MongoDB Connection Issues**
   - Check MongoDB URI format
   - Verify network connectivity
   - Check authentication credentials

3. **CORS Errors**
   - Verify CORS headers are set correctly
   - Check if preflight requests are handled

4. **Function Timeouts**
   - Optimize your code for faster execution
   - Consider breaking large operations into smaller chunks

5. **Memory Issues**
   - Monitor function memory usage
   - Optimize data processing

### Debugging

```bash
# View function logs
vercel logs

# View specific function logs
vercel logs api/proxy

# Tail logs in real-time
vercel logs --follow

# MongoDB debugging
mongo --eval "db.setProfilingLevel(1, 100)"
```

## Migration Checklist

- [ ] Install Vercel CLI
- [ ] Set up MongoDB (local or Atlas)
- [ ] Set up environment variables
- [ ] Run database setup script
- [ ] Test locally with `vercel dev`
- [ ] Deploy to Vercel
- [ ] Update frontend API endpoints
- [ ] Test all functionality
- [ ] Update documentation
- [ ] Monitor performance
- [ ] Set up monitoring/alerting

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **MongoDB Documentation**: https://docs.mongodb.com
- **MongoDB Atlas**: https://www.mongodb.com/atlas
- **Migration Help**: Check Vercel's migration guides

## Next Steps

After successful migration:

1. **Performance Monitoring**: Set up monitoring for your new Vercel functions
2. **Database Optimization**: Optimize MongoDB queries and indexes
3. **Caching Strategy**: Implement caching strategies and optimizations
4. **Scaling**: Plan for increased traffic and usage
5. **Backup Strategy**: Ensure your data is properly backed up
6. **Documentation**: Update your API documentation with new endpoints
7. **Testing**: Implement comprehensive test suite 