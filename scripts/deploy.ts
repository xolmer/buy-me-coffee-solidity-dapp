import { ethers } from 'hardhat';

async function main() {
  //Get the contract to deploy
  const BuyMeCoffee = await ethers.getContractFactory('BuyMeCoffee');
  const buyMeCoffee = await BuyMeCoffee.deploy();
  await buyMeCoffee.deployed();
  console.log('BuyMeCoffee deployed to:', buyMeCoffee.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
