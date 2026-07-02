#!/bin/bash
TEMP=$(termux-battery-status | jq '.temperature | floor')
if [ "$TEMP" -gt 45 ]; then
  pm2 stop all
  echo "[$(date)] Botlar durduruldu - Sıcaklık: $TEMP" >> ~/temp_guard.log
fi
