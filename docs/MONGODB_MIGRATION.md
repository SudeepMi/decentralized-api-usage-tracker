# Migration from Firebase to MongoDB

This guide explains how to migrate your decentralized API usage tracker from Firebase to MongoDB for data storage.

## Why MongoDB?

- **Flexibility**: Schema-less document storage allows for easy data structure changes
- **Scalability**: Horizontal scaling with sharding capabilities
- **Performance**: Excellent read/write performance with proper indexing
- **Cost Effective**: More predictable pricing compared to Firebase
- **Self-Hosted Option**: Can run on your own infrastructure or use MongoDB Atlas
- **Rich Query Language**: Powerful aggregation and querying capabilities

## Migration Overview

### What's Changed

1. **Database**: 
   - Firebase Firestore → MongoDB
   - Real-time listeners → Polling or WebSocket connections (if needed)

2. **Authentication**: 
   - Firebase Auth → Custom authentication or third-party providers
   - API key validation remains the same

3. **Configuration**:
   - Firebase config → MongoDB connection string
   - Environment variables updated

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
   
   # Windows
   # MongoDB runs as a service automatically
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add your IP address to the whitelist

### 3. Configure Environment Variables

Create a `.env.local` file:

```bash
# Copy the example file
cp env.example .env.local
```

Fill in your MongoDB connection details:

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

This will create the necessary collections and indexes for optimal performance.

### 5. Local Development

```bash
# Start local development server
npm run dev
```

### 6. Deploy to Vercel

```bash
# Deploy to production
npm run deploy
```

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

### Indexes

The setup script creates the following indexes for optimal performance:

- `apiKeys.apiKey` (unique) - Fast API key lookups
- `apiKeys.userId` - User-based queries
- `apiKeys.active` - Filter active keys
- `usageLogs.apiKey` - API key-based queries
- `usageLogs.createdAt` - Time-based sorting
- `usageLogs.userId` - User-based queries
- `usageLogs.requestHash` - Duplicate detection
- `usageCounters.apiKey` (unique) - Fast counter updates

## Key Differences from Firebase

### 1. Connection Management

**Firebase:**
```typescript
// Automatic connection management
const db = admin.firestore();
```

**MongoDB:**
```typescript
// Manual connection management
const client = new MongoClient(uri);
await client.connect();
// ... use database
await client.close();
```

### 2. Data Operations

**Firebase:**
```typescript
// Document operations
await db.collection('apiKeys').doc(apiKey).set(data);
const doc = await db.collection('apiKeys').doc(apiKey).get();
```

**MongoDB:**
```typescript
// Collection operations
await apiKeysCollection.insertOne(data);
const doc = await apiKeysCollection.findOne({ apiKey });
```

### 3. Transactions

**Firebase:**
```typescript
const batch = db.batch();
batch.set(ref1, data1);
batch.set(ref2, data2);
await batch.commit();
```

**MongoDB:**
```typescript
const session = client.startSession();
await session.withTransaction(async () => {
  await collection1.insertOne(data1);
  await collection2.updateOne(filter, update);
});
```

### 4. Queries

**Firebase:**
```typescript
const snapshot = await db.collection('logs')
  .where('apiKey', '==', apiKey)
  .orderBy('createdAt', 'desc')
  .limit(10)
  .get();
```

**MongoDB:**
```typescript
const logs = await logsCollection
  .find({ apiKey })
  .sort({ createdAt: -1 })
  .limit(10)
  .toArray();
```

## Performance Optimizations

### 1. Connection Pooling

MongoDB automatically handles connection pooling, but you can configure it:

```typescript
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000
});
```

### 2. Indexing Strategy

- **Compound Indexes**: For queries with multiple filters
- **Covered Queries**: Use indexes that include all required fields
- **TTL Indexes**: For automatic document expiration

### 3. Aggregation Pipeline

For complex analytics:

```typescript
const pipeline = [
  { $match: { apiKey } },
  { $group: { _id: "$method", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
];
const results = await usageLogsCollection.aggregate(pipeline).toArray();
```

## Monitoring and Maintenance

### 1. MongoDB Atlas Monitoring

If using MongoDB Atlas:
- Built-in monitoring dashboard
- Performance advisor
- Query analyzer
- Alerting system

### 2. Local MongoDB Monitoring

```bash
# Check database stats
mongo --eval "db.stats()"

# Check collection stats
mongo --eval "db.apiKeys.stats()"

# Monitor slow queries
mongo --eval "db.setProfilingLevel(1, 100)"
```

### 3. Backup Strategy

#### MongoDB Atlas
- Automatic daily backups
- Point-in-time recovery
- Cross-region backup copies

#### Local MongoDB
```bash
# Create backup
mongodump --db api-usage-tracker --out /backup/path

# Restore backup
mongorestore --db api-usage-tracker /backup/path/api-usage-tracker
```

## Security Considerations

### 1. Authentication

```typescript
// MongoDB Atlas with authentication
const uri = 'mongodb+srv://username:password@cluster.mongodb.net/database';
```

### 2. Network Security

- **MongoDB Atlas**: IP whitelist, VPC peering
- **Local MongoDB**: Firewall rules, VPN access

### 3. Data Encryption

- **At Rest**: MongoDB Atlas provides automatic encryption
- **In Transit**: TLS/SSL encryption

## Migration Checklist

- [ ] Install MongoDB (local or Atlas)
- [ ] Set up environment variables
- [ ] Run database setup script
- [ ] Test local development
- [ ] Deploy to Vercel
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all functionality
- [ ] Update documentation
- [ ] Monitor performance

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Check MongoDB URI format
   - Verify network connectivity
   - Check authentication credentials

2. **Performance Issues**
   - Review query patterns
   - Check index usage
   - Monitor connection pool

3. **Data Consistency**
   - Use transactions for multi-document operations
   - Implement proper error handling
   - Add retry logic for failed operations

### Debugging

```typescript
// Enable MongoDB debug logging
const client = new MongoClient(uri, {
  loggerLevel: 'debug'
});

// Log slow queries
await db.command({ profile: 1, slowms: 100 });
```

## Cost Comparison

### MongoDB Atlas Pricing (as of 2024)

- **Free Tier**: 512MB storage, shared clusters
- **Shared Clusters**: $9/month for 2GB storage
- **Dedicated Clusters**: $57/month and up

### Firebase Firestore Pricing

- **Free Tier**: 1GB storage, 50K reads/day, 20K writes/day
- **Pay-as-you-go**: $0.18/GB storage, $0.06/100K reads, $0.18/100K writes

MongoDB Atlas typically offers better value for high-volume applications.

## Next Steps

After successful migration:

1. **Performance Tuning**: Optimize queries and indexes
2. **Monitoring Setup**: Implement comprehensive monitoring
3. **Backup Strategy**: Set up automated backups
4. **Security Review**: Audit access controls and encryption
5. **Documentation**: Update API documentation
6. **Testing**: Implement comprehensive test suite

## Support

- **MongoDB Documentation**: https://docs.mongodb.com
- **MongoDB Atlas**: https://www.mongodb.com/atlas
- **MongoDB Community**: https://community.mongodb.com
- **Vercel MongoDB Integration**: https://vercel.com/docs/integrations/mongodb 