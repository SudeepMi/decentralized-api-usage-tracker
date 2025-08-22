const { MongoClient } = require('mongodb');

async function setupMongoDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(process.env.MONGODB_DB_NAME || 'api-usage-tracker');
    
    // Create collections
    const apiKeysCollection = db.collection('apiKeys');
    const usageLogsCollection = db.collection('usageLogs');
    const usageCountersCollection = db.collection('usageCounters');

    // Create indexes for better performance
    console.log('Creating indexes...');

    // Index for API keys lookup
    await apiKeysCollection.createIndex({ apiKey: 1 }, { unique: true });
    await apiKeysCollection.createIndex({ userId: 1 });
    await apiKeysCollection.createIndex({ active: 1 });

    // Index for usage logs
    await usageLogsCollection.createIndex({ apiKey: 1 });
    await usageLogsCollection.createIndex({ createdAt: -1 });
    await usageLogsCollection.createIndex({ userId: 1 });
    await usageLogsCollection.createIndex({ requestHash: 1 });

    // Index for usage counters
    await usageCountersCollection.createIndex({ apiKey: 1 }, { unique: true });

    console.log('✅ MongoDB setup completed successfully!');
    console.log('\nCollections created:');
    console.log('- apiKeys (with indexes: apiKey, userId, active)');
    console.log('- usageLogs (with indexes: apiKey, createdAt, userId, requestHash)');
    console.log('- usageCounters (with indexes: apiKey)');

  } catch (error) {
    console.error('❌ Error setting up MongoDB:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupMongoDB();
}

module.exports = { setupMongoDB }; 