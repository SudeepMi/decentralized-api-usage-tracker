// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
    
    function getLastSeenAt(bytes32 apiKeyHash) external view returns (uint256) {
        return lastSeenAt[apiKeyHash];
    }
} 