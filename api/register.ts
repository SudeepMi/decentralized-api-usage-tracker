const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || 'api-usage-tracker');
    const apiKeysCollection = db.collection('apiKeys');

    const userId = req.query.userId?.toString() || req.body?.userId || 'anonymous';
    const apiKey = uuidv4().replace(/-/g, ''); // 32 hex characters

    // Store API key in MongoDB
    await apiKeysCollection.insertOne({
      apiKey,
      userId,
      createdAt: new Date(),
      active: true,
      usageCount: 0
    });

    res.status(200).json({
      success: true,
      apiKey,
      userId,
      message: 'API key generated successfully'
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error.message
    });
  } finally {
    await client.close();
  }
} 