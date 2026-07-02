import time
import random
import requests
import json
import os

# ==================== AYARLAR ====================
FAUCET_URL = "https://faucet.monad.xyz/claim"

# 24 cüzdan adresini keys.json'dan oku
def load_wallets():
    try:
        with open(os.path.expanduser("~/termux-web3-automator/keys.json"), 'r') as f:
            keys = json.load(f)
        return list(keys.values())  # adresleri döndür
    except:
        print("keys.json okunamadı.")
        return []

WALLETS = load_wallets()

MIN_SLEEP = 600
MAX_SLEEP = 3600
# =================================================

def claim_from_faucet(address):
    payload = {"address": address}
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Android 14; Mobile) Termux-Web3-Automator"
    }
    try:
        response = requests.post(FAUCET_URL, json=payload, headers=headers, timeout=30)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {address}: Başarılı - {data.get('message', 'Token gönderildi')}")
            return True
        else:
            print(f"❌ {address}: Hata {response.status_code} - {response.text[:100]}")
            return False
    except Exception as e:
        print(f"⚠️ {address}: Bağlantı hatası - {str(e)[:80]}")
        return False

def main():
    if not WALLETS:
        print("Cüzdan listesi boş!")
        return
    print(f"🚀 Faucet Collector başladı. {len(WALLETS)} cüzdan işlenecek.")
    random.shuffle(WALLETS)
    
    for i, wallet in enumerate(WALLETS, 1):
        print(f"\n[{i}/{len(WALLETS)}] İşleniyor: {wallet[:10]}...")
        claim_from_faucet(wallet)
        if i < len(WALLETS):
            sleep_time = random.randint(MIN_SLEEP, MAX_SLEEP)
            print(f"⏳ Sybil koruması: {sleep_time // 60} dakika bekleniyor...")
            time.sleep(sleep_time)

    print("\n✅ Tüm cüzdanlar işlendi.")

if __name__ == "__main__":
    main()
