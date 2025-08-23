import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import crypto from 'crypto';
import { ethers } from 'ethers';
import { MongoClient } from 'mongodb';

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Ethers setup for blockchain interaction
const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC || '');
const wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY || '', provider);

// Contract ABI for UsageLogger
const usageLoggerAbi = [
  'function logUsage(bytes32 apiKeyHash, uint256 timestamp, bytes32 requestHash, string tag) external',
  'function lastSeenAt(bytes32) view returns (uint256)'
];

const usageLogger = new ethers.Contract(
  process.env.BLOCKCHAIN_CONTRACT_ADDRESS || '',
  usageLoggerAbi,
  wallet
);

// Helper functions
const sha256Hex = (s: string): string =>
  crypto.createHash('sha256').update(s).digest('hex');

const keccakBytes32 = (s: string): string =>
  ethers.keccak256(ethers.toUtf8Bytes(s));

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || 'api-usage-tracker');
    const apiKeysCollection = db.collection('apiKeys');
    const usageLogsCollection = db.collection('usageLogs');
    const usageCountersCollection = db.collection('usageCounters');

    // Validate API key
    const apiKey = (req.query.key || req.headers['x-api-key'])?.toString();
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'Missing API key',
        message: 'Please provide an API key via \'key\' query parameter or \'x-api-key\' header'
      });
    }

    // Check if API key exists and is active
    const keyDoc = await apiKeysCollection.findOne({ apiKey, active: true });
    if (!keyDoc) {
      return res.status(403).json({
        success: false,
        error: 'Invalid API key',
        message: 'API key not found or inactive'
      });
    }

    // Get endpoint from query parameters
    const endpoint = req.query.endpoint?.toString() || '';
    if (!endpoint) {
      return res.status(400).json({
        success: false,
        error: 'Missing endpoint',
        message: 'Please specify an endpoint parameter'
      });
    }

    // Prepare request to target API
    const method = (req.method || 'GET').toUpperCase();
    const targetBase = process.env.PROXY_TARGET_BASE || 'https://api.open-meteo.com/v1';
    const targetUrl = `${targetBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    // Build request configuration
    const forwardConfig: any = {
      method,
      url: targetUrl,
      params: Object.fromEntries(
        Object.entries(req.query as Record<string, any>)
          .filter(([k]) => !['key', 'endpoint', 'tag'].includes(k))
      ),
      data: ['POST', 'PUT', 'PATCH'].includes(method) ? req.body : undefined,
      headers: {
        'User-Agent': 'usage-proxy/1.0',
        'Accept': 'application/json'
      },
      timeout: 10000
    };

    // Compute request hash for blockchain logging
    const requestShape = JSON.stringify({
      method,
      endpoint,
      params: forwardConfig.params || {},
      body: forwardConfig.data || {}
    });
    const requestHashHex = sha256Hex(requestShape);
    const requestHashBytes32 = ethers.hexlify(ethers.zeroPadValue('0x' + requestHashHex, 32));

    const apiKeyHashBytes32 = keccakBytes32(apiKey);
    const timestampSec = Math.floor(Date.now() / 1000);
    const tag = req.query.tag?.toString() || 'proxy:v1';

    // Forward request to target API
    const apiResp = await axios(forwardConfig);

    // Log to MongoDB
    const session = client.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Add usage log
        await usageLogsCollection.insertOne({
          apiKey,
          userId: keyDoc.userId || null,
          method,
          endpoint,
          params: forwardConfig.params || {},
          status: apiResp.status,
          createdAt: new Date(),
          requestHash: requestHashHex,
          tag
        });

        // Update usage counter
        await usageCountersCollection.updateOne(
          { apiKey },
          { 
            $inc: { total: 1 },
            $set: { updatedAt: new Date() }
          },
          { upsert: true }
        );
      });
    } finally {
      await session.endSession();
    }

    // Log to blockchain (fire and forget for performance)
    try {
      const tx = await usageLogger.logUsage(
        apiKeyHashBytes32,
        timestampSec,
        requestHashBytes32,
        tag
      );
      const receipt = await tx.wait();

      // Return response with audit information
      res.status(apiResp.status).json({
        success: true,
        data: apiResp.data,
        audit: {
          txHash: receipt?.hash,
          apiKeyHash: apiKeyHashBytes32,
          requestHash: requestHashHex,
          timestamp: timestampSec,
          tag
        }
      });
    } catch (blockchainError: any) {
      console.error('Blockchain logging failed:', blockchainError);
      
      // Still return the API response even if blockchain logging fails
      res.status(apiResp.status).json({
        success: true,
        data: apiResp.data,
        audit: {
          error: 'Blockchain logging failed',
          apiKeyHash: apiKeyHashBytes32,
          requestHash: requestHashHex,
          timestamp: timestampSec,
          tag
        }
      });
    }
  } catch (error: any) {
    console.error('Proxy error:', error?.response?.data || error?.message || error);
    const status = error?.response?.status || 500;
    res.status(status).json({
      success: false,
      error: 'Proxy failed',
      message: error?.message || 'Unknown error occurred'
    });
  } finally {
    await client.close();
  }
} 