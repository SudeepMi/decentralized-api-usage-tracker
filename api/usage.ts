const { MongoClient } = require('mongodb');

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || 'api-usage-tracker');
    const usageCountersCollection = db.collection('usageCounters');
    const usageLogsCollection = db.collection('usageLogs');

    const apiKey = (req.query.key || req.headers['x-api-key'])?.toString();
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'Missing API key'
      });
    }

    // Get usage counter
    const counterDoc = await usageCountersCollection.findOne({ apiKey });
    const totalUsage = counterDoc ? counterDoc.total || 0 : 0;

    // Get recent usage logs (last 10)
    const recentLogs = await usageLogsCollection
      .find({ apiKey })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    res.status(200).json({
      success: true,
      data: {
        totalUsage,
        recentLogs,
        apiKey: apiKey.substring(0, 8) + '...' // Partial key for display
      }
    });
  } catch (error: any) {
    console.error('Usage stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get usage statistics',
      message: error.message
    });
  } finally {
    await client.close();
  }
} 