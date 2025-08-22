# 📚 API Usage Examples

This document provides examples of how to use the Decentralized API Usage Tracker.

## API Endpoints

### Base URL
```
https://your-project.cloudfunctions.net
```

## 1. Generate API Key

**Endpoint:** `GET /register`

**Parameters:**
- `userId` (string): Unique identifier for the user

**Example:**
```bash
curl "https://your-project.cloudfunctions.net/register?userId=john_doe"
```

**Response:**
```json
{
  "success": true,
  "apiKey": "a1b2c3d4e5f678901234567890123456",
  "userId": "john_doe",
  "message": "API key generated successfully"
}
```

## 2. Make API Request (Proxy)

**Endpoint:** `GET /proxy`

**Parameters:**
- `key` (string): Your API key
- `endpoint` (string): Target API endpoint
- `tag` (optional): Category tag for the request
- Additional parameters are forwarded to the target API

**Example - Weather API:**
```bash
curl "https://your-project.cloudfunctions.net/proxy?key=YOUR_API_KEY&endpoint=/forecast&latitude=52.52&longitude=13.41&hourly=temperature_2m&tag=weather:v1"
```

**Example - Jokes API:**
```bash
curl "https://your-project.cloudfunctions.net/proxy?key=YOUR_API_KEY&endpoint=/jokes/random&tag=jokes:v1"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "latitude": 52.52,
    "longitude": 13.41,
    "hourly": {
      "temperature_2m": [20.5, 19.8, 18.2]
    }
  },
  "audit": {
    "txHash": "0x1234567890abcdef...",
    "apiKeyHash": "0xabcdef1234567890...",
    "requestHash": "f3e9a1b2c3d4e5f6...",
    "timestamp": 1724300000,
    "tag": "weather:v1"
  }
}
```

## 3. Get Usage Statistics

**Endpoint:** `GET /usage`

**Parameters:**
- `key` (string): Your API key

**Example:**
```bash
curl "https://your-project.cloudfunctions.net/usage?key=YOUR_API_KEY"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsage": 15,
    "recentLogs": [
      {
        "id": "log_123",
        "apiKey": "a1b2c3d4e5f678901234567890123456",
        "method": "GET",
        "endpoint": "/forecast",
        "status": 200,
        "createdAt": "2024-01-15T10:30:00Z",
        "requestHash": "f3e9a1b2c3d4e5f6..."
      }
    ],
    "apiKey": "a1b2c3d4..."
  }
}
```

## JavaScript Examples

### Using Fetch API

```javascript
// Generate API key
async function generateApiKey(userId) {
  const response = await fetch(`https://your-project.cloudfunctions.net/register?userId=${userId}`);
  const data = await response.json();
  return data.apiKey;
}

// Make API request
async function makeApiRequest(apiKey, endpoint, params = {}) {
  const url = new URL('https://your-project.cloudfunctions.net/proxy');
  url.searchParams.set('key', apiKey);
  url.searchParams.set('endpoint', endpoint);
  
  // Add additional parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  
  const response = await fetch(url);
  return await response.json();
}

// Get usage statistics
async function getUsageStats(apiKey) {
  const response = await fetch(`https://your-project.cloudfunctions.net/usage?key=${apiKey}`);
  return await response.json();
}

// Usage example
const apiKey = await generateApiKey('john_doe');
const weatherData = await makeApiRequest(apiKey, '/forecast', {
  latitude: '52.52',
  longitude: '13.41',
  hourly: 'temperature_2m',
  tag: 'weather:v1'
});
const stats = await getUsageStats(apiKey);
```

### Using Axios

```javascript
import axios from 'axios';

const API_BASE = 'https://your-project.cloudfunctions.net';

// Generate API key
const generateApiKey = async (userId) => {
  const response = await axios.get(`${API_BASE}/register`, {
    params: { userId }
  });
  return response.data.apiKey;
};

// Make API request
const makeApiRequest = async (apiKey, endpoint, params = {}) => {
  const response = await axios.get(`${API_BASE}/proxy`, {
    params: {
      key: apiKey,
      endpoint,
      ...params
    }
  });
  return response.data;
};

// Get usage statistics
const getUsageStats = async (apiKey) => {
  const response = await axios.get(`${API_BASE}/usage`, {
    params: { key: apiKey }
  });
  return response.data;
};
```

## Python Examples

```python
import requests

API_BASE = "https://your-project.cloudfunctions.net"

def generate_api_key(user_id):
    response = requests.get(f"{API_BASE}/register", params={"userId": user_id})
    return response.json()["apiKey"]

def make_api_request(api_key, endpoint, **params):
    params["key"] = api_key
    params["endpoint"] = endpoint
    response = requests.get(f"{API_BASE}/proxy", params=params)
    return response.json()

def get_usage_stats(api_key):
    response = requests.get(f"{API_BASE}/usage", params={"key": api_key})
    return response.json()

# Usage example
api_key = generate_api_key("john_doe")
weather_data = make_api_request(
    api_key, 
    "/forecast", 
    latitude="52.52", 
    longitude="13.41", 
    hourly="temperature_2m",
    tag="weather:v1"
)
stats = get_usage_stats(api_key)
```

## Blockchain Verification

Every API request is logged to the blockchain. You can verify the transaction using the `txHash` from the response:

1. **Polygon Mumbai Explorer:** `https://mumbai.polygonscan.com/tx/{txHash}`
2. **Sepolia Explorer:** `https://sepolia.etherscan.io/tx/{txHash}`

The transaction will contain:
- `apiKeyHash`: Hash of your API key (for privacy)
- `requestHash`: Hash of the request payload
- `timestamp`: Unix timestamp of the request
- `tag`: Category tag for the request

## Error Handling

**Common Error Responses:**

```json
{
  "success": false,
  "error": "Missing API key",
  "message": "Please provide an API key via 'key' query parameter or 'x-api-key' header"
}
```

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "API key not found or inactive"
}
```

```json
{
  "success": false,
  "error": "Proxy failed",
  "message": "Target API returned an error"
}
```

## Rate Limiting

Currently, there are no rate limits implemented. For production use, consider implementing:
- Per-user rate limiting
- Per-endpoint rate limiting
- Burst protection

## Security Notes

- API keys are hashed before being stored on the blockchain
- Request payloads are hashed for integrity verification
- Use HTTPS for all API calls
- Store API keys securely in your applications 