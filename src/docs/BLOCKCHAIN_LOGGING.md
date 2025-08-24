# Blockchain Logging Guide

This guide explains how to check API usage logs on the Ethereum Sepolia testnet using Etherscan.

## 🔗 Sepolia Etherscan

The application logs all API usage to the **Sepolia testnet** blockchain. You can view these logs at:
**https://sepolia.etherscan.io/**

## 📋 Prerequisites

Before checking blockchain logs, ensure you have:

1. **Contract Address**: The deployed `UsageLogger` contract address
2. **Transaction Hash**: From API responses (included in the `audit.txHash` field)
3. **API Key Hash**: The hashed version of your API key
4. **Request Hash**: The SHA-256 hash of the request parameters

## 🔍 How to Check API Logs

### Method 1: Using Transaction Hash (Recommended)

1. **Get Transaction Hash**: After making an API request, the response includes:
   ```json
   {
     "success": true,
     "data": { /* API response data */ },
     "audit": {
       "txHash": "0x1234...",
       "apiKeyHash": "0x5678...",
       "requestHash": "abcd...",
       "timestamp": 1234567890,
       "tag": "weather:v1"
     }
   }
   ```

2. **View on Etherscan**: Navigate to:
   ```
   https://sepolia.etherscan.io/tx/{txHash}
   ```

3. **Check Event Logs**: Scroll down to the "Logs" section to see the `ApiUsageLogged` event.

### Method 2: Using Contract Address

1. **Find Contract**: Go to:
   ```
   https://sepolia.etherscan.io/address/{contractAddress}
   ```

2. **View Events**: Click on the "Events" tab to see all `ApiUsageLogged` events.

3. **Filter Events**: Use the filter options to search by:
   - **Submitter**: The address that submitted the transaction
   - **API Key Hash**: The hashed API key
   - **Time Range**: Specific date/time periods

### Method 3: Using API Key Hash

1. **Generate API Key Hash**: The API key is hashed using Keccak256:
   ```javascript
   const apiKeyHash = ethers.keccak256(ethers.toUtf8Bytes(apiKey));
   ```

2. **Search Events**: On the contract page, filter events by your API key hash.

## 📊 Understanding Event Data

The `ApiUsageLogged` event contains the following indexed and non-indexed parameters:

### Indexed Parameters (Searchable)
- **submitter**: The address that submitted the transaction
- **apiKeyHash**: The Keccak256 hash of the API key
- **timestamp**: Unix timestamp of the request

### Non-Indexed Parameters
- **requestHash**: SHA-256 hash of the request parameters
- **tag**: User-defined tag for categorization (e.g., "weather:v1", "proxy:v1")

### Example Event
```
Event: ApiUsageLogged
Topics:
  0: 0x1234567890abcdef... (event signature)
  1: 0x0000000000000000000000001234567890abcdef... (submitter)
  2: 0x567890abcdef1234567890abcdef1234567890... (apiKeyHash)
  3: 0x000000000000000000000000000000000000000000000000000000006789abcd (timestamp)

Data:
  0x: 0000000000000000000000000000000000000000000000000000000000000040
     0000000000000000000000000000000000000000000000000000000000000080
     0000000000000000000000000000000000000000000000000000000000000009
     776561746865723a763100000000000000000000000000000000000000000000
     0000000000000000000000000000000000000000000000000000000000000040
     0000000000000000000000000000000000000000000000000000000000000020
     abcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab
```

## 🔧 Smart Contract Details

### UsageLogger Contract
```solidity
contract UsageLogger {
    event ApiUsageLogged(
        address indexed submitter,
        bytes32 indexed apiKeyHash,
        uint256 timestamp,
        bytes32 requestHash,
        string tag
    );
    
    mapping(bytes32 => uint256) public lastSeenAt;

    function logUsage(
        bytes32 apiKeyHash,
        uint256 timestamp,
        bytes32 requestHash,
        string calldata tag
    ) external {
        uint256 prev = lastSeenAt[apiKeyHash];
        if (timestamp > prev) {
            lastSeenAt[apiKeyHash] = timestamp;
        }
        
        emit ApiUsageLogged(msg.sender, apiKeyHash, timestamp, requestHash, tag);
    }
}
```

### Key Functions
- **logUsage**: Records API usage with all relevant parameters
- **lastSeenAt**: Mapping to track the last timestamp for each API key

## 🛠️ Verification Tools

### 1. Verify Request Hash
You can verify the request hash locally:
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
```

### 2. Verify API Key Hash
```javascript
const { ethers } = require('ethers');

function verifyApiKeyHash(apiKey) {
  return ethers.keccak256(ethers.toUtf8Bytes(apiKey));
}
```

### 3. Decode Event Data
Use Etherscan's built-in decoder or decode manually:
```javascript
// Event signature
const eventSignature = 'ApiUsageLogged(address,bytes32,uint256,bytes32,string)';
const eventTopic = ethers.keccak256(ethers.toUtf8Bytes(eventSignature));
```

## 📈 Analytics and Monitoring

### 1. Usage Patterns
- **Frequency**: Track how often each API key is used
- **Peak Times**: Identify high-usage periods
- **Endpoint Usage**: See which endpoints are most popular

### 2. Security Monitoring
- **Unauthorized Usage**: Detect API key abuse
- **Request Patterns**: Identify suspicious request patterns
- **Rate Limiting**: Monitor for potential rate limit violations

### 3. Cost Tracking
- **Gas Costs**: Monitor blockchain transaction costs
- **Storage Costs**: Track event storage costs
- **Optimization**: Identify opportunities for cost reduction

## 🔍 Advanced Queries

### 1. Filter by Time Range
```sql
-- Example: Events from last 24 hours
timestamp >= (UNIX_TIMESTAMP() - 86400)
```

### 2. Filter by API Key
```sql
-- Example: All events for specific API key hash
apiKeyHash = '0x567890abcdef1234567890abcdef1234567890...'
```

### 3. Filter by Tag
```sql
-- Example: All weather API calls
tag = 'weather:v1'
```

## 🚨 Troubleshooting

### Common Issues

1. **Transaction Not Found**
   - Check if you're on the correct network (Sepolia)
   - Verify the transaction hash is correct
   - Wait a few minutes for transaction confirmation

2. **Event Not Visible**
   - Ensure the transaction was successful
   - Check if the event was emitted correctly
   - Verify the contract address is correct

3. **Hash Mismatch**
   - Verify the API key hash calculation
   - Check the request hash generation
   - Ensure consistent hashing algorithms

### Debugging Steps

1. **Check Transaction Status**: Verify the transaction was successful
2. **Review Event Logs**: Look for the `ApiUsageLogged` event
3. **Verify Parameters**: Compare expected vs actual event parameters
4. **Check Gas Usage**: Ensure sufficient gas was provided

## 📚 Related Resources

- [Sepolia Etherscan](https://sepolia.etherscan.io/) - Main explorer
- [Ethereum Sepolia Faucet](https://sepoliafaucet.com/) - Get test ETH
- [Solidity Documentation](https://docs.soliditylang.org/) - Smart contract development
- [Ethers.js Documentation](https://docs.ethers.org/) - JavaScript library for Ethereum

## 🔗 Quick Links

- **Contract Address**: `{YOUR_CONTRACT_ADDRESS}`
- **Sepolia Etherscan**: https://sepolia.etherscan.io/
- **Network Details**: 
  - Network Name: Sepolia
  - RPC URL: https://sepolia.infura.io/v3/{YOUR_PROJECT_ID}
  - Chain ID: 11155111
  - Currency Symbol: ETH
