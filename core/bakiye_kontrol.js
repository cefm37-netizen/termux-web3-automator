const fs = require('fs');
const path = require('path');

// keys.json dosyasını bul (core'un bir üst dizininde)
const keysPath = path.join(__dirname, '..', 'keys.json');

if (!fs.existsSync(keysPath)) {
  console.log("keys.json bulunamadı. Bakiye kontrolü yapılamadı.");
  process.exit(1);
}

const keys = JSON.parse(fs.readFileSync(keysPath, 'utf-8'));
console.log(`Toplam cüzdan sayısı: ${Object.keys(keys).length}`);
console.log("Not: Gerçek bakiye sorgusu için RPC bağlantısı gerekir. Bu script şu an sadece cüzdan sayısını gösterir.");
