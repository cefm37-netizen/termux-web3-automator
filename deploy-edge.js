const fs = require('fs');
const solc = require('solc');
const { ethers } = require('ethers');

const RPC_URL = "https://sepolia.base.org";
const PRIVATE_KEY = process.env.DEPLOY_KEY;

if (!PRIVATE_KEY || PRIVATE_KEY === "BURAYA_PRIVATE_KEY_GELECEK") {
    console.error("❌ Lütfen DEPLOY_KEY değerini scripti çalıştırmadan önce girin.");
    process.exit(1);
}

const provider = ethers.getDefaultProvider(RPC_URL);
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

console.log("🔨 L2EdgeResilience kontratı derleniyor...");
const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contract = output.contracts['L2EdgeResilience.sol']['L2EdgeResilience'];

async function deploy() {
    console.log("🚀 Base Sepolia ağına deploy ediliyor...");
    const factory = new ethers.ContractFactory(contract.abi, contract.evm.bytecode.object, wallet);
    const deployedContract = await factory.deploy();
    await deployedContract.waitForDeployment();
    const address = await deployedContract.getAddress();
    
    console.log("✅ BAŞARILI! Kontrat Adresi: " + address);
    
    fs.writeFileSync('edge-config.json', JSON.stringify({ address: address, abi: contract.abi }, null, 2));
    console.log("💾 edge-config.json dosyası oluşturuldu. Botumuz bu kontratı kullanacak.");
}

deploy().catch(console.error);
