const ethers = require('ethers');
const fs = require('fs');

const RPC = 'https://ethereum-sepolia.publicnode.com';
const provider = new ethers.JsonRpcProvider(RPC);

const demoWallets = JSON.parse(fs.readFileSync('demo_wallets.json', 'utf8'));
const LOG_FILE = 'demo_live_log.json';

function logYaz(mesaj) {
  const kayit = { zaman: new Date().toISOString(), mesaj };
  console.log(`[${kayit.zaman}] ${mesaj}`);
  try {
    const loglar = fs.existsSync(LOG_FILE) ? JSON.parse(fs.readFileSync(LOG_FILE)) : [];
    loglar.push(kayit);
    fs.writeFileSync(LOG_FILE, JSON.stringify(loglar, null, 2));
  } catch(e) {}
}

function poissonBekleme(ortalamaSn) {
  return new Promise(resolve => {
    const lambda = 1 / ortalamaSn;
    const sure = Math.min(-Math.log(Math.random()) / lambda * 1000, ortalamaSn * 2000);
    setTimeout(resolve, sure);
  });
}

async function demoBaslat() {
  logYaz('🚀 DEMO BAŞLADI - 5 cüzdan, Sepolia Testnet');
  
  const wallets = demoWallets.map(w => new ethers.Wallet(w.privateKey, provider));
  const hedefler = demoWallets.map(w => w.address);
  
  for (let tur = 0; tur < 10; tur++) {
    for (let i = 0; i < wallets.length; i++) {
      const sender = wallets[i];
      let aliciIndex;
      do { aliciIndex = Math.floor(Math.random() * wallets.length); } while (aliciIndex === i);
      const alici = hedefler[aliciIndex];
      
      const miktarETH = (Math.random() * 0.0004 + 0.0001).toFixed(6);
      const miktarWei = ethers.parseEther(miktarETH);
      
      try {
        const tx = await sender.sendTransaction({
          to: alici,
          value: miktarWei
        });
        logYaz(`✅ Cüzdan${demoWallets[i].no} -> Cüzdan${demoWallets[aliciIndex].no}: ${miktarETH} ETH | Hash: ${tx.hash}`);
        await tx.wait();
      } catch(e) {
        logYaz(`❌ Cüzdan${demoWallets[i].no} hatası: ${e.message.substring(0, 80)}`);
      }
      
      await poissonBekleme(60);
    }
  }
  
  logYaz('✅ DEMO TAMAMLANDI');
}

demoBaslat().catch(e => logYaz('💥 KRİTİK HATA: ' + e.message));
