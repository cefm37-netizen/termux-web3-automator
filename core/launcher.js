const { execSync } = require('child_process');
const path = require('path');

// Çalıştırılacak botun yolu argüman olarak alınır: node launcher.js <bot_yolu>
const botPath = process.argv[2];

if (!botPath) {
  console.error("Kullanım: node launcher.js <bot_dosyası>");
  process.exit(1);
}

// Rastgele çalışma olasılığı: %70
const CALISMA_ORANI = 0.70;
const rastgeleSayi = Math.random();

if (rastgeleSayi > CALISMA_ORANI) {
  console.log(`[Launcher] Bu tur atlandı (${(rastgeleSayi * 100).toFixed(0)}% > %70).`);
  process.exit(0);
}

// 0 ile 20 dakika arasında rastgele bir gecikme (saniye cinsinden)
const gecikmeSaniye = Math.floor(Math.random() * 20 * 60); // 0 - 1200 saniye
console.log(`[Launcher] Bot ${gecikmeSaniye} saniye sonra başlatılacak...`);

setTimeout(() => {
  console.log(`[Launcher] ${botPath} başlatılıyor...`);
  try {
    // stdin'i devral, stdout ve stderr'i konsola yaz
    execSync(`node "${botPath}"`, { stdio: 'inherit', timeout: 0 });
  } catch (err) {
    console.error(`[Launcher] Hata: ${err.message}`);
    process.exit(1);
  }
}, gecikmeSaniye * 1000);
