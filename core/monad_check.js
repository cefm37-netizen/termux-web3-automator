const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'monad_status.log');

try {
  const response = execSync(
    `curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' https://rpc.monad.xyz/ -m 10`,
    { timeout: 15000 }
  ).toString();

  if (response.includes('"result"')) {
    fs.appendFileSync(logFile, `[${new Date().toLocaleString('tr-TR')}] Monad RPC aktif ✅\n`);
  } else {
    fs.appendFileSync(logFile, `[${new Date().toLocaleString('tr-TR')}] Monad RPC yanıt vermiyor ❌\n`);
  }
} catch (e) {
  fs.appendFileSync(logFile, `[${new Date().toLocaleString('tr-TR')}] Monad RPC bağlantı hatası ❌\n`);
}
