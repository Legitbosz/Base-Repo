const hre = require("hardhat");

async function main() {
  console.log("Deploying TipEscrow...");
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const TipEscrow = await hre.ethers.getContractFactory("TipEscrow");
  const contract = await TipEscrow.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TipEscrow deployed to:", address);
}

main().catch((err) => { console.error(err); process.exit(1); });
