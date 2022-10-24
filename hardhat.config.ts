import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'solidity-coverage';
import '@nomiclabs/hardhat-ethers';
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.ACCOUNT_KEY || '']
    }
  }
};

export default config;
