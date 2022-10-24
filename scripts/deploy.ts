import { ethers } from "hardhat";

async function main() {


  const MemorialWallContract = await ethers.getContractFactory("MemorialWallet");
  const memwall = await MemorialWallContract.deploy();

  await memwall.deployed();

  console.log(`Mem wall deployed to ${memwall.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
