# 📱 Mobile-Edge Network Simulation & RPC Stress Framework
### Engineering Portfolio — Not a Product, Not a Grant Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Platform](https://img.shields.io/badge/platform-Android%20%2B%20Termux-brightgreen)

> **This is a portfolio piece. It exists to demonstrate real engineering skills — not to raise money.**
> Below is the story of a project that was publicly criticized by an Ethereum core developer, completely rewritten, and emerged stronger.

## 🎯 What This Is (Honestly)
A mobile-first automation framework that runs **24 autonomous wallets** on a single Android phone via Termux. Built for **continuous, low-frequency on-chain activity** from real mobile edge conditions — dynamic CGNAT IPs, thermal throttling (42°C), and zero cloud cost.

## 🔥 The Story
I opened an issue on ethPandaOps/Spamoor, pitching this as a "stress testing tool." A core developer reviewed my repo in detail and told me:
- "The anti-Sybil system doesn't really exist"
- "Round-robin ordering is trivially fingerprintable"
- "This looks like airdrop farming infrastructure"

He was right. So I:
1. Removed the faucet collector
2. Replaced fixed wallet loops with Fisher-Yates shuffle
3. Pivoted from value transfers to zero-value "Ghost Payload" data simulation
4. Rewrote all documentation to be honest and verifiable

## 🛠️ Technical Skills Demonstrated
- **Process Orchestration:** 13 Node.js bots managed by PM2 on Android
- **Network Manipulation:** CGNAT IP rotation, airplane mode cycling
- **Hardware Constraints:** Thermal protection at 42°C, ~300MB RAM ceiling
- **Crisis Response:** Public code review → honest pivot → clean rewrite

## 📜 License
MIT © 2026 [cefm37-netizen](https://github.com/cefm37-netizen)

---
*"A good engineer documents their failures as thoroughly as their successes."*

---

## 📦 Project Status: Archived (July 2026)

This project is no longer actively developed. It served its purpose:
- Demonstrated mobile process orchestration under hardware constraints
- Survived a public code review by an Ethereum core developer
- Taught crisis management, honest documentation, and technical pivoting

**What's next?** The skills learned here — Linux, PM2, log management, network manipulation, crisis response — are now being applied to [Rust / Docker / Cloud infrastructure / your next adventure].

