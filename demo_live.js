const fs = require('fs');
const { ethers } = require('ethers');

const wallets = JSON.parse(fs.readFileSync('demo_wallets.json', 'utf8'));
const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
const provider = ethers.getDefaultProvider(RPC_URL);

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function startAutonomousEdgeNode() {
    console.log("🚀 MOBİL NODE BAŞLADI - Otonom Rastgele Dağılım Modu");
    
    while (true) {
        try {
            let activeQueue = shuffle([...wallets]);
            
            for (let i = 0; i < activeQueue.length; i++) {
                const sourceWallet = new ethers.Wallet(activeQueue[i].privateKey, provider);
                const targetWallets = wallets.filter(w => w.address !== sourceWallet.address);
                const randomTarget = targetWallets[Math.floor(Math.random() * targetWallets.length)];
                
                const payloadData = ethers.hexlify(ethers.toUtf8Bytes("Mobile Edge State Simulation V1"));
                console.log(`📡 [Edge Log] ${sourceWallet.address.slice(0,6)}... -> DATA PAYLOAD -> ${randomTarget.address.slice(0,6)}...`);
                
                try {
                    const tx = await sourceWallet.sendTransaction({
                        to: randomTarget.address,
                        value: ethers.parseEther("0"),
                        data: payloadData,
                        gasLimit: 50000
                    });
                    console.log(`✅ Payload Başarılı! Hash: ${tx.hash.slice(0,10)}...`);
                } catch (txError) {
                    console.error(`⚠️ Payload hatası: ${txError.message.substring(0,50)}...`);
                }
                
                const randomWait = Math.floor(Math.random() * (180000 - 45000 + 1)) + 45000;
                console.log(`💤 ${Math.round(randomWait / 1000)} saniye bekleniyor...`);
                await delay(randomWait);
            }
        } catch (error) {
            console.error("⚠️ Döngü hatası:", error.message);
            await delay(30000);
        }
    }
}

startAutonomousEdgeNode();
