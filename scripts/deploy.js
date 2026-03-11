const hre = require("hardhat");

async function main() { // Funzione principale che esegue il processo di deploy del contratto
  console.log("Deploying SanitizationTracker...");

  const SanitizationTracker = await hre.ethers.getContractFactory("SanitizationTracker"); // Ottiene il factory del contratto SanitizationTracker, che permette di creare nuove istanze del contratto
  const contract = await SanitizationTracker.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress(); // Ottiene l'indirizzo del contratto appena distribuito sulla blockchain
  console.log("SanitizationTracker deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
