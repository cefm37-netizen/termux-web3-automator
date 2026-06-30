const ethers = require("ethers");
const fs = require("fs");
const { execSync } = require("child_process");

const keys = JSON.parse(fs.readFileSync("keys.json", "utf8"));
const cuzdanlar = [];
for (let i = 1; i <= 24; i++) {
  const pk = keys["cuzdan" + String(i).padStart(2, '0')];
  if (pk) cuzdanlar.push({ isim: "cuzdan" + String(i).padStart(2, '0'), privateKey: pk });
}
console.log(`Yüklendi: ${cuzdanlar.length} cüzdan\n`);

const baseProvider = new ethers.providers.JsonRpcProvider("https://sepolia.base.org");
const LZ_ENDPOINT = "0x6EDCE65403992e310A62460808c4b910D972f10f";
const GAS_LIMIT = 350000;
const MIN_BAKIYE = ethers.utils.parseEther("0.005");
let basarisizSayaci = 0;
const MAX_BASARISIZ = 5;

// Daha önce deploy edilmiş kontrat adresleri (Sepolia + Base)
const KONTRATLAR = [
  "0x03a58783dE4B954B892436F77D28D21136755643",
  "0x4fa00C1E476B9fA1F631e9f3fEFf1DBDa1FC242d",
  "0xb5652fDF6CcAbDD6FD6De51aeA1fB4cF00613C69",
  "0x89057DAa614B0A15882Da7FC12d33Aee78Bcd844"
];

function ipDegistir() {
  try { execSync("cmd connectivity airplane-mode enable"); } catch (e) {}
  try { execSync("sleep 5"); } catch (e) {}
  try { execSync("cmd connectivity airplane-mode disable"); } catch (e) {}
  try { execSync("sleep 10"); } catch (e) {}
  console.log("📡 IP değiştirildi\n");
}

async function simuleEt(txRequest, provider) {
  try {
    await provider.estimateGas(txRequest);
    return true;
  } catch (e) {
    return false;
  }
}

async function kontratCanlandir(wallet) {
  const rastgeleAdres = KONTRATLAR[Math.floor(Math.random() * KONTRATLAR.length)];
  console.log(`  Kontrat canlandırma: ${rastgeleAdres.slice(0, 10)}...`);
  
  const canlandirmaABI = ["function increment() external"];
  const kontrat = new ethers.Contract(rastgeleAdres, canlandirmaABI, wallet);
  
  const txRequest = {
    to: rastgeleAdres,
    data: kontrat.interface.encodeFunctionData("increment"),
    gasLimit: 100000
  };

  if (await simuleEt(txRequest, baseProvider)) {
    const tx = await wallet.sendTransaction(txRequest);
    console.log(`  Canlandırma TX: ${tx.hash}`);
    await tx.wait();
    console.log("  ✅ Kontrat canlandı");
    return true;
  } else {
    console.log("  ❌ Canlandırma simülasyonu başarısız, atlandı.");
    return false;
  }
}

async function superGorev(cuzdan) {
  if (basarisizSayaci >= MAX_BASARISIZ) {
    console.log("⛔ Başarısızlık limiti aşıldı, tur sonlandırılıyor.");
    process.exit(0);
  }

  try {
    const wallet = new ethers.Wallet(cuzdan.privateKey, baseProvider);
    const balance = await wallet.getBalance();
    
    if (balance.lt(MIN_BAKIYE)) {
      console.log(`${cuzdan.isim}: ${ethers.utils.formatEther(balance)} ETH - Yetersiz.`);
      return;
    }

    console.log(`${cuzdan.isim}: ${ethers.utils.formatEther(balance)} ETH`);

    // 1. LayerZero Görevi
    const lzTxRequest = {
      to: LZ_ENDPOINT,
      value: ethers.utils.parseEther("0.0001"),
      gasLimit: GAS_LIMIT
    };
    
    if (await simuleEt(lzTxRequest, baseProvider)) {
      const tx = await wallet.sendTransaction(lzTxRequest);
      console.log(`  LayerZero TX: ${tx.hash}`);
      await tx.wait();
      console.log("  ✅ LayerZero");
      basarisizSayaci = 0;
    } else {
      console.log("  ❌ LayerZero simülasyon başarısız, atlandı.");
      basarisizSayaci++;
      return;
    }

    await new Promise(r => setTimeout(r, 3000 + Math.random() * 7000));

    // 2. EigenLayer Görevi
    const eigenAddr = "0x3B78576F7D6837500bA3D9d7B6d6d4A5F937c7E2";
    const eigenABI = ["function deposit() external payable"];
    const eigenKontrat = new ethers.Contract(eigenAddr, eigenABI, wallet);
    const eigenTxRequest = {
      to: eigenAddr,
      data: eigenKontrat.interface.encodeFunctionData("deposit", []),
      value: ethers.utils.parseEther("0.0001"),
      gasLimit: GAS_LIMIT
    };
    
    if (await simuleEt(eigenTxRequest, baseProvider)) {
      const tx = await wallet.sendTransaction(eigenTxRequest);
      console.log(`  EigenLayer TX: ${tx.hash}`);
      await tx.wait();
      console.log("  ✅ EigenLayer");
    } else {
      console.log("  ❌ EigenLayer simülasyon başarısız, atlandı.");
    }

    // 3. Kontrat Canlandırma Görevi (%40 ihtimalle)
    if (Math.random() < 0.4) {
      await kontratCanlandir(wallet);
    }
    
    console.log("");
  } catch (e) {
    console.error(`${cuzdan.isim}: ❌ ${e.message.slice(0, 80)}\n`);
    basarisizSayaci++;
  }
}

(async () => {
  ipDegistir();
  
  const karistir = [...cuzdanlar].sort(() => Math.random() - 0.5).slice(0, 10 + Math.floor(Math.random() * 6));
  console.log(`Tur: ${karistir.length} cüzdan\n`);
  
  for (const c of karistir) {
    await superGorev(c);
    await new Promise(r => setTimeout(r, 5000 + Math.random() * 15000));
  }
  console.log("✅ Süper Geliştirici turu tamamlandı.");
})();
