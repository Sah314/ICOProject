
const {ethers} = require("hardhat");
const{CRYPTO_NFT_CONTRACT_ADDRESS} = require("../constants");
require("dotenv").config({path:".env"});

async function main() {

const cryptoNFTContract = CRYPTO_NFT_CONTRACT_ADDRESS;
const crpytoTokenContract = await ethers.getContractFactory("CryptoToken");

const deployedCryptoContract = await crpytoTokenContract.deploy(cryptoNFTContract)
await deployedCryptoContract.deployed();
console.log("Crypto Token Contract Address: ",deployedCryptoContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });