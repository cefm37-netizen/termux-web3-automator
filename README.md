![Termux Screenshot](assets/screenshot.jpg)
## 🛠️ Termux-Specific Installation

pkg install nodejs git -y
git clone https://github.com/cefm37-netizen/termux-web3-automator.git
cd termux-web3-automator
npm install
cp config.example.json config.json
# Edit config.json with your RPC URLs

## 🔒 Security Warning

This framework interacts with EVM networks. Never commit config.json or keys.json to public repositories. The .gitignore file is pre-configured to block these files. Use strong passwords for encrypted key files.


---

## 📈 Proje Etki Metrikleri (Grant Committees)

| Kriter | Değer | Açıklama |
|--------|-------|----------|
| **Hedef Kitle** | Gelişmekte olan ülkelerdeki mobil geliştiriciler | Proje, masaüstü bilgisayara erişimi olmayanlara Web3 kapısı açar |
| **İşlem Hacmi** | 4.500+ tx (Base Sepolia) | Testnet stress test ve eğitim amaçlı kullanımı kanıtlar |
| **Kaynak Verimliliği** | ~290 MB RAM, 0$ maliyet | Düşük kaynaklı, sürdürülebilir altyapı |
| **Açık Kaynak Lisans** | MIT | Herkesin kullanımına ve katkısına açık |
| **Topluluk Katkısı** | Açık issue'lar, PR'lara açık | Başkalarının da projeye katkı yapması teşvik ediliyor |

