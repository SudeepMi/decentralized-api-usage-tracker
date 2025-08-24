# API Examples

Complete guide to using the Decentralized API Usage Tracker endpoints with practical examples.

## 🔑 Base URL

Replace `{YOUR_APP_URL}` with your deployed Vercel application URL:
```
https://your-app.vercel.app/api
```

## 📝 API Key Registration

### Generate New API Key

**Endpoint**: `GET /api/register`

**Parameters**:
- `userId` (required): Unique identifier for the user

**Example**:
```bash
curl "https://your-app.vercel.app/api/register?userId=john-doe"
```

**Response**:
```json
{
  "success": true,
  "apiKey": "ak_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "userId": "john-doe"
}
```

**JavaScript Example**:
```javascript
const response = await fetch('https://your-app.vercel.app/api/register?userId=john-doe');
const data = await response.json();
console.log('API Key:', data.apiKey);
```

## 🔄 API Proxy

### Basic Weather API Call

**Endpoint**: `GET /api/proxy`

**Parameters**:
- `key` (required): Your API key
- `endpoint` (required): Target API endpoint
- `tag` (optional): Category tag for the request

**Example**:
```bash
curl "https://your-app.vercel.app/api/proxy?key=ak_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef&endpoint=/forecast&latitude=52.52&longitude=13.41&hourly=temperature_2m&tag=weather:v1"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "latitude": 52.52,
    "longitude": 13.41,
    "hourly": {
      "time": ["2024-01-01T00:00", "2024-01-01T01:00"],
      "temperature_2m": [5.2, 4.8]
    }
  },
  "audit": {
    "txHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "apiKeyHash": "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
    "requestHash": "abcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    "timestamp": 1704067200,
    "tag": "weather:v1"
  }
}
```

### POST Request Example

**Example**:
```bash
curl -X POST "https://your-app.vercel.app/api/proxy?key=ak_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef&endpoint=/users&tag=api:v1" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Custom API Proxy

**Example** (proxying to a different API):
```bash
curl "https://your-app.vercel.app/api/proxy?key=ak_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef&endpoint=/posts&userId=123&tag=blog:v1"
```

**JavaScript Example**:
```javascript
const apiKey = 'ak_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

// Weather API call
const weatherResponse = await fetch(`https://your-app.vercel.app/api/proxy?key=${apiKey}&endpoint=/forecast&latitude=40.7128&longitude=-74.0060&hourly=temperature_2m&tag=weather:v1`);
const weatherData = await weatherResponse.json();

// Check blockchain transaction
if (weatherData.audit?.txHash) {
  console.log('Blockchain TX:', weatherData.audit.txHash);
  console.log('View on Etherscan:', `https://sepolia.etherscan.io/tx/${weatherData.audit.txHash}`);
}
```

## 📊 Usage Statistics

### Get Usage Data

**Endpoint**: `GET /api/usage`

**Parameters**:
- `key` (required): Your API key

**Example**:
```bash
curl "https://your-app.vercel.app/api/usage?key=ak_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalUsage": 15,
    "apiKey": "ak_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "recentLogs": [
      {
        "apiKey": "ak_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "userId": "john-doe",
        "method": "GET",
        "endpoint": "/forecast",
        "params": {
          "latitude": "52.52",
          "longitude": "13.41",
          "hourly": "temperature_2m"
        },
        "status": 200,
        "createdAt": "2024-01-01T12:00:00.000Z",
        "requestHash": "abcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
        "tag": "weather:v1",
        "audit": {
          "txHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        }
      }
    ]
  }
}
```

**JavaScript Example**:
```javascript
const response = await fetch(`https://your-app.vercel.app/api/usage?key=${apiKey}`);
const data = await response.json();

console.log('Total Usage:', data.data.totalUsage);
console.log('Recent Logs:', data.data.recentLogs);

// Display recent activity
data.data.recentLogs.forEach(log => {
  console.log(`${log.method} ${log.endpoint} - ${log.status} - ${log.tag}`);
  if (log.audit?.txHash) {
    console.log(`Blockchain: https://sepolia.etherscan.io/tx/${log.audit.txHash}`);
  }
});
```

## 🔐 Authentication

### Using API Key in Headers

**Example**:
```bash
curl "https://your-app.vercel.app/api/proxy?endpoint=/forecast&latitude=52.52&longitude=13.41" \
  -H "x-api-key: ak_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
```

### Using API Key in Query Parameters

**Example**:
```bash
curl "https://your-app.vercel.app/api/proxy?key=ak_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef&endpoint=/forecast&latitude=52.52&longitude=13.41"
```

## 🏷️ Request Tagging

### Using Tags for Categorization

**Example**:
```bash
# Weather API calls
curl "https://your-app.vercel.app/api/proxy?key=${apiKey}&endpoint=/forecast&latitude=52.52&longitude=13.41&tag=weather:v1"

# User API calls
curl "https://your-app.vercel.app/api/proxy?key=${apiKey}&endpoint=/users&tag=user:v1"

# Payment API calls
curl "https://your-app.vercel.app/api/proxy?key=${apiKey}&endpoint=/payments&tag=payment:v1"
```

## 🔍 Error Handling

### Invalid API Key

**Response**:
```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "API key not found or inactive"
}
```

### Missing Parameters

**Response**:
```json
{
  "success": false,
  "error": "Missing endpoint",
  "message": "Please specify an endpoint parameter"
}
```

### Blockchain Logging Failed

**Response**:
```json
{
  "success": true,
  "data": { /* API response data */ },
  "audit": {
    "error": "Blockchain logging failed",
    "apiKeyHash": "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
    "requestHash": "abcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    "timestamp": 1704067200,
    "tag": "weather:v1"
  }
}
```

## 📱 Complete Integration Example

```javascript
class ApiUsageTracker {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async makeRequest(endpoint, params = {}, tag = 'api:v1') {
    const url = new URL(`${this.baseUrl}/proxy`);
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('endpoint', endpoint);
    url.searchParams.set('tag', tag);
    
    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url);
    const data = await response.json();

    if (data.success && data.audit?.txHash) {
      console.log(`Request logged to blockchain: ${data.audit.txHash}`);
    }

    return data;
  }

  async getUsageStats() {
    const response = await fetch(`${this.baseUrl}/usage?key=${this.apiKey}`);
    return await response.json();
  }

  async generateApiKey(userId) {
    const response = await fetch(`${this.baseUrl}/register?userId=${userId}`);
    return await response.json();
  }
}

// Usage
const tracker = new ApiUsageTracker(
  'https://your-app.vercel.app/api',
  'ak_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
);

// Make a weather API call
const weather = await tracker.makeRequest('/forecast', {
  latitude: '52.52',
  longitude: '13.41',
  hourly: 'temperature_2m'
}, 'weather:v1');

// Get usage statistics
const stats = await tracker.getUsageStats();
console.log('Total usage:', stats.data.totalUsage);
```

## 🔗 Blockchain Verification

### View Transaction on Etherscan

After each API call, you can verify the transaction on Sepolia Etherscan:

```javascript
function viewOnEtherscan(txHash) {
  const url = `https://sepolia.etherscan.io/tx/${txHash}`;
  window.open(url, '_blank');
}

// Usage
if (response.audit?.txHash) {
  viewOnEtherscan(response.audit.txHash);
}
```

### Verify Request Hash

```javascript
const crypto = require('crypto');

function verifyRequestHash(method, endpoint, params, body) {
  const requestShape = JSON.stringify({
    method,
    endpoint,
    params: params || {},
    body: body || {}
  });
  return crypto.createHash('sha256').update(requestShape).digest('hex');
}

// Verify the request hash from response
const expectedHash = verifyRequestHash('GET', '/forecast', {
  latitude: '52.52',
  longitude: '13.41'
});
console.log('Hash matches:', expectedHash === response.audit.requestHash);
```

## 📊 Rate Limiting

The API includes built-in rate limiting to prevent abuse:

- **Default Limit**: 100 requests per minute per API key
- **Headers**: Rate limit information included in response headers
- **Blockchain**: All requests are logged regardless of rate limiting

## 🔒 Security Best Practices

1. **Keep API Keys Secure**: Never expose API keys in client-side code
2. **Use HTTPS**: Always use HTTPS for API calls
3. **Validate Responses**: Check the `success` field in all responses
4. **Monitor Usage**: Regularly check usage statistics
5. **Verify Blockchain**: Use transaction hashes to verify request integrity

## 📚 Related Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - How to deploy the application
- [Blockchain Logging Guide](BLOCKCHAIN_LOGGING.md) - How to check logs on Etherscan
- [Quick Start Guide](QUICK_START.md) - Get up and running quickly
