#!/data/data/com.termux/files/usr/bin/bash
RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://rpc.monad.xyz/ -m 10 2>&1)

if echo "$RESPONSE" | grep -q "result"; then
  echo "[$(date)] Monad RPC aktif ✅" >> ~/termux-web3-automator/monad_status.log
else
  echo "[$(date)] Monad RPC yanıt vermiyor ❌" >> ~/termux-web3-automator/monad_status.log
fi
