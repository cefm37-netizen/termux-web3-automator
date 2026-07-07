# TÜBİTAK BİGG – İş Planı ve Proje Tanımı Taslağı

**Proje Adı:** Mobil Tabanlı Web3 Otomasyon ve Finansal Kapsayıcılık Platformu (Termux-Web3-Automator)  
**Başvuru Sahibi:** [Adın Soyadın]  
**Tarih:** 04 Temmuz 2026  
**Tema:** Finansal Kapsayıcılık / Yapay Zeka ve Dijital Teknolojiler  

---

## 1. Yönetici Özeti

Bu proje, yalnızca bir Android telefon ve internet bağlantısı kullanarak, blok zinciri (Web3) ekosisteminde otonom işlem yapabilen, açık kaynak kodlu bir otomasyon sistemidir. Proje, yüksek donanım maliyetleri ve teknik bilgi eksikliği nedeniyle Web3'ün dışında kalan bireyleri ve geliştiricileri hedefler. Şu anda 7 aktif yazılım botu, 24 şifrelenmiş cüzdan ve Base Sepolia test ağında kanıtlanmış bir demo ile canlı olarak çalışmaktadır.

**Temel Değer Önerisi:** Düşük gelirli bölgelerdeki yetenekli geliştiricilerin, sıfır donanım maliyetiyle Web3 ekonomisine katılmasını sağlamak.

---

## 2. Problem Tanımı

- **Donanım Engeli:** Web3 geliştiriciliği için güçlü bilgisayarlar veya bulut sunucular gereklidir. Bu, özellikle gelişmekte olan ülkelerdeki gençler için büyük bir giriş engelidir.
- **Altyapı Eksikliği:** Kesintili elektrik ve pahalı internet, sürekli çevrimiçi kalması gereken bot ve düğümlerin çalıştırılmasını zorlaştırır.
- **Eğitim ve Erişim Eksikliği:** Uygulamalı, düşük maliyetli Web3 eğitim araçları neredeyse yoktur.

---

## 3. Çözüm ve Teknoloji

Termux-Web3-Automator, bu sorunları şu şekilde çözer:

- **Mobil Uyumluluk:** Node.js ve ethers.js kullanarak tüm Ethereum Sanal Makinesi (EVM) uyumlu ağlarda sözleşme dağıtımı, token transferi ve DeFi etkileşimlerini doğrudan bir Android telefonun terminalinden yürütür.
- **Kaynak Verimliliği:** Tüm sistem (7 bot + izleme + raporlama) yalnızca ~300 MB RAM kullanır. Pil ve sıcaklık koruma modülleri, cihazın donanımını güvende tutar.
- **Anti-Sybil Mimarisi:** Poisson dağılımı kullanan işlem zamanlaması sayesinde, botlar gerçek insan davranışını taklit eder. Bu, test ağlarındaki projeler için paha biçilmez bir test verisi sağlar.
- **Finansal Kapsayıcılık:** Kullanıcıların airdrop'lardan, merkeziyetsiz finans (DeFi) protokollerinden ve test ağı ödüllerinden gelir elde etmesini mümkün kılarak yeni bir mikro-girişimcilik modeli sunar.

---

## 4. Pazar Analizi ve İş Modeli

**Hedef Pazar:**
1.  **B2B (Projeler):** Yeni nesil blok zinciri projeleri, test ağlarını gerçekçi senaryolarla test etmek için kullanıcı havuzu kiralar. (Hedef: Berachain, Monad, EigenLayer vb.)
2.  **B2C (Geliştiriciler):** Açık kaynak topluluk aracılığıyla bireysel geliştiricilere ücretsiz eğitim ve otomasyon araçları sunulur.

**Gelir Modeli (Hibrit):**
- **Ücretsiz Katman:** Açık kaynak çekirdek kütüphane (MIT Lisansı).
- **Premium Hizmet (SaaS):** Projelere özel, yönetilen test kullanıcı havuzları ve detaylı analiz raporları. (Paket başı 200-400 USD).

---

## 5. Proje Ekibi

- **[Adın Soyadın]:** Kurucu, Tam Yığın (Full Stack) Blok Zinciri Geliştiricisi. Projenin tüm mimarisi, bot yazılımları ve güvenlik altyapısı şahsım tarafından geliştirilmiştir.

---

## 6. Bütçe ve Kullanım Planı (450.000 TL)

| Gider Kalemi | Tutar (TL) | Açıklama |
|:---|:---|:---|
| **Personel Giderleri (1 Kişi, 12 Ay)** | 240.000 | Tam zamanlı geliştirici maaşı |
| **Altyapı ve RPC Sunucuları (12 Ay)** | 60.000 | Yedekli ve hızlı RPC hizmetleri |
| **Güvenlik Denetimi (Akıllı Sözleşme)** | 50.000 | Bağımsız bir siber güvenlik firması tarafından kod denetimi |
| **Pazarlama ve Topluluk Yönetimi** | 50.000 | Açık kaynak tanıtımı, eğitim videoları, hackathon sponsorlukları |
| **Genel Yönetim Giderleri** | 50.000 | Ekipman, yazılım lisansları, ofis malzemeleri |
| **Toplam** | **450.000** | |

---

## 7. Çıktılar ve Başarı Kriterleri (6 Aylık)

- En az **3** büyük blok zinciri projesiyle test kullanıcı havuzu sözleşmesi imzalamak.
- GitHub'da **100+ yıldız** ve **20+ aktif katkıcıya** ulaşmak.
- **3 yeni test ağı** entegrasyonu tamamlamak.
- Üniversitelerle işbirliği yaparak **2 açık kaynak Web3 eğitim atölyesi** düzenlemek.

> **Bu iş planı, 04.07.2026 itibarıyla canlı ve çalışan bir prototipin gerçek verilerine dayanmaktadır.**
