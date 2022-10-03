import { ethers } from 'hardhat';

interface Memo {
  timestamp: any;
  name: string;
  from: string;
  message: string;
}

async function getBalance(address: string) {
  const balance = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(balance);
}

async function printBalances(addresses: string[]) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx}:`, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos: Memo[]) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const buyer = memo.name;
    const buyerAddress = memo.from;
    const message = memo.message;
    console.log(
      `Timestamp: ${timestamp}, Buyer: ${buyer}, Address: ${buyerAddress}, Message: ${message}`
    );
  }
}

async function main() {
  //Get example accounts
  const [owner, buyer, buyer2, buyer3] = await ethers.getSigners();
  //Get the contract to deploy
  const BuyMeCoffee = await ethers.getContractFactory('BuyMeCoffee');
  const buyMeCoffee = await BuyMeCoffee.deploy();
  await buyMeCoffee.deployed();
  console.log('BuyMeCoffee deployed to:', buyMeCoffee.address);

  //Check the balances before the coffee purchase
  const addresses = [
    owner.address,
    buyer.address,
    buyer2.address,
    buyer3.address,
    buyMeCoffee.address,
  ];
  console.log('Balances before the coffee purchase:');
  await printBalances(addresses);

  //Buy the owner a few coffees
  const coffeePrice = { value: ethers.utils.parseEther('1') };

  buyMeCoffee.connect(buyer).buyCoffee('Buyer 1', 'Thanks for the great content!', coffeePrice);
  buyMeCoffee
    .connect(buyer2)
    .buyCoffee('Buyer 2', "Wow! I'm buying you another coffee!", coffeePrice);
  buyMeCoffee
    .connect(buyer3)
    .buyCoffee('Buyer 3', "Amazing! I'm buying you a third coffee!", coffeePrice);

  //Check the balances after the coffee purchase
  console.log('____________________________________________________');
  console.log('Balances after the coffee purchase:');
  await printBalances(addresses);

  //Withdraw the coffee funds
  console.log('____________________________________________________');
  console.log('Withdraw the coffee funds:');
  await buyMeCoffee.connect(owner).withdraw();
  console.log('Balances after the withdrawal:');
  await printBalances(addresses);

  //Get the memos
  console.log('____________________________________________________');
  console.log('Get the memos:');
  const memos: Memo[] = await buyMeCoffee.getMemos();
  await printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
