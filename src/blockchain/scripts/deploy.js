const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying UsageLogger contract...");

  // Get the contract factory
  const UsageLogger = await hre.ethers.getContractFactory("UsageLogger");
  
  // Deploy the contract
  const usageLogger = await UsageLogger.deploy();
  
  // Wait for deployment to complete
  await usageLogger.waitForDeployment();
  
  const address = await usageLogger.getAddress();
  
  console.log("✅ UsageLogger deployed to:", address);
  console.log("📝 Contract address for Firebase config:", address);
  
  // Verify the deployment
  console.log("🔍 Verifying deployment...");
  const deployedCode = await hre.ethers.provider.getCode(address);
  if (deployedCode === "0x") {
    console.error("❌ Contract deployment failed - no code at address");
    process.exit(1);
  }
  
  console.log("✅ Contract verification successful");
  console.log("\n📋 Next steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update your Firebase Functions config");
  console.log("3. Deploy your Firebase Functions");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 