import { NewMemoryMessageEventObject} from '../typechain-types/MemorialWall';

const hre = require("hardhat");
const getProvider = () => hre.waffle.provider;

// return the balances for a given address
async function getBalances(address: string) {
    const provider = getProvider();
    const balances = await provider.getBalance(address);
    return hre.ethers.utils.formatEther(balances);
}

// logs the ether balances for a list of addressses
async function logBalances(addresses: string[]) {
    for (const address of addresses) {
        const balances = await getBalances(address);
        console.log(`${address} has ${balances} wei`);
    }
}

// print individual memory
async function printMemory(memory: NewMemoryMessageEventObject) {
    console.log(`Message: ${memory.message}`);
    console.log(`Name: ${memory.name}`);
    console.log(`Author: ${memory.author}`);
    console.log(`Timestamp: ${memory.timestamp}`);
}

// print the memories stored on the memorial wall
async function printMemories(memories: NewMemoryMessageEventObject[]) {
    for (const memory of memories) {
        await printMemory(memory);
    }
}

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const deployerBalances = await getBalances(deployerAddress);

    console.log(`Deploying contracts with the account: ${deployerAddress}`);
    console.log(`Account balance: ${deployerBalances}`);

    const MemorialWall = await hre.ethers.getContractFactory("MemorialWall");
    const memorialWall = await MemorialWall.deploy();

    await memorialWall.deployed();

    console.log(`MemorialWall deployed to: ${memorialWall.address}`);

    // add a memory
    const memory = {
        message: "This is a message",
        name: "John Doe",
}