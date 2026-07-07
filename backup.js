const fs = require('fs');
const path = require('path');

const SOURCE = path.join(__dirname, 'keys.json.enc');
const BACKUP_DIR = path.join(__dirname, 'backups');

async function main() {
  try {
    if (!fs.existsSync(SOURCE)) {
      throw new Error(`${SOURCE} bulunamadı!`);
    }

    await fs.promises.mkdir(BACKUP_DIR, { recursive: true });

    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const dest = path.join(BACKUP_DIR, `keys.json.enc.${dateStr}`);

    await fs.promises.copyFile(SOURCE, dest);
    console.log(`✅ Yedekleme başarılı: ${dest}`);

    const files = await fs.promises.readdir(BACKUP_DIR);
    const now = Date.now();
    let deleted = 0;
    for (const file of files) {
      if (!file.startsWith('keys.json.enc.')) continue;
      const filePath = path.join(BACKUP_DIR, file);
      const stat = await fs.promises.stat(filePath);
      if (now - stat.mtimeMs > 7 * 24 * 60 * 60 * 1000) {
        await fs.promises.unlink(filePath);
        deleted++;
      }
    }
    if (deleted > 0) console.log(`🗑️ ${deleted} eski yedek silindi.`);
  } catch (err) {
    console.error('❌ Yedekleme hatası:', err.message);
    process.exit(1);
  }
}

main();
