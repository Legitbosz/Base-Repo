const hre = require("hardhat");

async function main() {
  console.log("Deploying TipVault...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Lock tips for 7 days before withdrawal
  const lockDays = 7;

  const TipVault = await hre.ethers.getContractFactory("TipVault");
  const contract = await TipVault.deploy(lockDays);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TipVault deployed to:", address);
  console.log("Locked for:", lockDays, "days");
}

main().catch((err) => { console.error(err); process.exit(1); });
