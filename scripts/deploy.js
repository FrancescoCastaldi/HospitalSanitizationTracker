const hre = require("hardhat");

async function main() {
  console.log("Deploying SanitizationTracker...");

  const SanitizationTracker = await hre.ethers.getContractFactory("SanitizationTracker");
  const contract = await SanitizationTracker.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("SanitizationTracker deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
