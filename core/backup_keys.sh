#!/bin/bash
mkdir -p /data/data/com.termux/files/home/storage/shared/backup_keys
cp /data/data/com.termux/files/home/termux-web3-automator/keys.json.enc /data/data/com.termux/files/home/storage/shared/backup_keys/keys.json.enc
echo "[$(date)] Yedek alındı" >> ~/backup.log
