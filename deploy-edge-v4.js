const fs = require('fs');
const solc = require('solc');
const { ethers } = require('ethers');

// Alternatif Base Sepolia RPC
const RPC_URL = "https://base-sepolia-rpc.publicnode.com";
const PRIVATE_KEY = "0x47310926e347299a54ddd2a6fcc8e2c8bba960e556d2defc1c060e61d483e8d7";

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const source = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract L2EdgeResilience {
    uint256 public stateTransitions;
    event StateChanged(address indexed node, uint256 timestamp, uint256 totalTransitions);
    function simulateStateChange() public {
        stateTransitions += 1;
        emit StateChanged(msg.sender, block.timestamp, stateTransitions);
    }
}
`;

const input = {
    language: 'Solidity',
    sources: { 'L2EdgeResilience.sol': { content: source } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
};

console.log("🔨 Derleniyor...");
const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contract = output.contracts['L2EdgeResilience.sol']['L2EdgeResilience'];

async function deploy() {
    const nonce = await wallet.getTransactionCount("pending");
    console.log("Nonce: " + nonce);
    const balance = await provider.getBalance(wallet.address);
    console.log("Bakiye: " + ethers.utils.formatEther(balance) + " ETH");

    console.log("🚀 Deploy ediliyor (manuel gas: 500,000)...");
    const factory = new ethers.ContractFactory(contract.abi, contract.evm.bytecode.object, wallet);
    const deployedContract = await factory.deploy({ gasLimit: 500000 });
    await deployedContract.waitForDeployment();
    const address = await deployedContract.getAddress();
    
    console.log("✅ BAŞARILI! Kontrat Adresi: " + address);
    fs.writeFileSync('edge-config.json', JSON.stringify({ address: address, abi: contract.abi }, null, 2));
    console.log("💾 edge-config.json oluşturuldu.");
}

deploy().catch(console.error);
