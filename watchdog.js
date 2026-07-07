const { execSync } = require('child_process');

const CHECK_INTERVAL = 2 * 60 * 1000; // 2 dakika
const CRITICAL_BOTS = ['dex-bot', 'super-dev', 'demo-live', 'monad-check', 'nft-bot', 'backup', 'report'];
const AUTO_RESTART = true; // hatalı botları otomatik yeniden başlat

async function check() {
  try {
    const output = execSync('pm2 jlist', { encoding: 'utf8' });
    const list = JSON.parse(output);
    const now = new Date().toISOString();
    
    for (const proc of list) {
      if (!CRITICAL_BOTS.includes(proc.name)) continue;
      
      if (proc.pm2_env.status === 'errored' || proc.pm2_env.status === 'stopped') {
        console.log(`[${now}] ⚠️ ${proc.name} durumu: ${proc.pm2_env.status}`);
        
        if (AUTO_RESTART) {
          execSync(`pm2 restart ${proc.name}`, { encoding: 'utf8' });
          console.log(`[${now}] 🔄 ${proc.name} yeniden başlatıldı`);
        }
      }
    }
    
    // Sağlıklı durumda da kısa bir heartbeat logu
    console.log(`[${now}] ✅ Tüm kritik botlar çalışıyor`);
    
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Watchdog hatası:`, err.message);
  }
}

// İlk kontrol hemen, sonra periyodik
check();
setInterval(check, CHECK_INTERVAL);
