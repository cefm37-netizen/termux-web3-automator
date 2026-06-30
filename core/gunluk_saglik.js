const { execSync } = require("child_process");
const fs = require("fs");

console.log("===== GÜNLÜK SAĞLIK RAPORU =====\n");
console.log("Tarih:", new Date().toLocaleString("tr-TR"));

// PM2 durumu
const pm2 = execSync("pm2 status").toString();
console.log("\n--- PM2 ---\n", pm2.split("\n").slice(0, 20).join("\n"));

// Son loglar
if (fs.existsSync("gercek_sepolia_log.txt")) {
  const log = execSync("tail -20 gercek_sepolia_log.txt").toString();
  console.log("--- Sepolia Log (son 20 satır) ---\n", log);
}

// Bakiye
const bakiye = execSync("node core/bakiye_kontrol.js").toString();
console.log("--- Sepolia Bakiye ---\n", bakiye.split("\n").slice(1, 15).join("\n"));
