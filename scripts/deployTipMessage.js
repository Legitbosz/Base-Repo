const hre = require("hardhat");

async function main() {
  console.log("Deploying TipMessage...");
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const TipMessage = await hre.ethers.getContractFactory("TipMessage");
  const contract = await TipMessage.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TipMessage deployed to:", address);
}

main().catch((err) => { console.error(err); process.exit(1); });
