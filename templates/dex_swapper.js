const ethers = require("ethers");
const fs = require("fs");
const { execSync } = require("child_process");

const keys = JSON.parse(fs.readFileSync("keys.json", "utf8"));
const cuzdanlar = [];
for (let i = 1; i <= 24; i++) {
  const pk = keys["cuzdan" + String(i).padStart(2, '0')];
  if (pk) cuzdanlar.push({ isim: "cuzdan" + String(i).padStart(2, '0'), privateKey: pk });
}
console.log(`Yüklendi: ${cuzdanlar.length} cüzdan\n`);

const RPC_LIST = [
  "https://sepolia.base.org",
  "https://base-sepolia.g.alchemy.com/v2/demo",
  "https://base-sepolia.blockpi.network/v1/rpc/public",
  "https://base-sepolia.public.blastapi.io"
];

const WETH = "0x4200000000000000000000000000000000000006";
const USDC = "0x036CbD53842c5426634e792954e1eC2318f3dCF7";
const UNISWAP_ROUTER = "0x1689E7B1F57000AeEeEe6D7e5b8D1c6c7e1f2a3B";

const CONTRACT_BYTECODE = "0x6080604052348015600f57600080fd5b5060f78061001e6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80633fb5c1cb1460415780638381f58a146057578063d09de08a14606d575b600080fd5b6055604c3660046083565b600055565b005b60005460405190815260200160405180910390f35b6055600080549080607c83609b565b9190505550565b600060208284031215609457600080fd5b5035919050565b60006001820160ba57634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220e4a6f0c0b4c0e8f0c0b4c0e8f0c0b4c0e8f0c0b4c0e8f0c0b4c0e8f0c0b4c064736f6c63430008130033";

async function getProvider() {
  for (const rpc of RPC_LIST) {
    try {
      const p = new ethers.providers.JsonRpcProvider(rpc);
      await p.getNetwork();
      console.log(`✅ RPC: ${rpc}`);
      return p;
    } catch (e) {}
  }
  throw new Error("RPC başarısız");
}

function ipDegistir() {
  try { execSync("cmd connectivity airplane-mode enable"); } catch (e) {}
  try { execSync("sleep 5"); } catch (e) {}
  try { execSync("cmd connectivity airplane-mode disable"); } catch (e) {}
  try { execSync("sleep 10"); } catch (e) {}
  console.log("📡 IP değiştirildi\n");
}

async function simuleEt(txRequest, provider) {
  try {
    await provider.estimateGas(txRequest);
    return true;
  } catch (e) {
    return false;
  }
}

async function islemYap(cuzdan, provider) {
  try {
    const wallet = new ethers.Wallet(cuzdan.privateKey, provider);
    const balance = await wallet.getBalance();
    
    if (balance.lt(ethers.utils.parseEther("0.005"))) {
      console.log(`${cuzdan.isim}: ${ethers.utils.formatEther(balance)} ETH - Az, atlandı.`);
      return;
    }

    const tip = Math.random();
    
    if (tip < 0.25) {
      // Kontrat deploy
      console.log(`${cuzdan.isim}: Kontrat deploy`);
      const factory = new ethers.ContractFactory([], CONTRACT_BYTECODE, wallet);
      const tx = await factory.deploy({ gasLimit: 800000 });
      console.log(`  TX: ${tx.deployTransaction.hash}`);
      await tx.deployTransaction.wait();
      console.log(`  ✅ Kontrat: ${tx.address}`);
      
    } else if (tip < 0.45) {
      // WETH wrap (ETH → WETH)
      const miktar = ethers.utils.parseEther("0.0003");
      console.log(`${cuzdan.isim}: WETH wrap ${ethers.utils.formatEther(miktar)} ETH → WETH`);
      const weth = new ethers.Contract(WETH, ["function deposit() external payable"], wallet);
      const tx = await weth.deposit({ value: miktar, gasLimit: 200000 });
      console.log(`  TX: ${tx.hash}`);
      await tx.wait();
      console.log(`  ✅ WETH alındı`);
      
    } else if (tip < 0.60) {
      // WETH unwrap (WETH → ETH)
      console.log(`${cuzdan.isim}: WETH unwrap`);
      const weth = new ethers.Contract(WETH, ["function withdraw(uint256) external"], wallet);
      const tx = await weth.withdraw(ethers.utils.parseEther("0.0001"), { gasLimit: 200000 });
      console.log(`  TX: ${tx.hash}`);
      await tx.wait();
      console.log(`  ✅ ETH geri alındı`);
      
    } else if (tip < 0.75) {
      // ETH → USDC swap
      const miktar = ethers.utils.parseEther("0.0001");
      console.log(`${cuzdan.isim}: Swap ${ethers.utils.formatEther(miktar)} ETH → USDC`);
      const router = new ethers.Contract(UNISWAP_ROUTER, [
        "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) calldata params) external payable returns (uint256 amountOut)"
      ], wallet);
      const txRequest = {
        to: UNISWAP_ROUTER,
        data: router.interface.encodeFunctionData("exactInputSingle", [{
          tokenIn: WETH,
          tokenOut: USDC,
          fee: 3000,
          recipient: wallet.address,
          deadline: Math.floor(Date.now() / 1000) + 600,
          amountIn: miktar,
          amountOutMinimum: 0,
          sqrtPriceLimitX96: 0
        }]),
        value: miktar,
        gasLimit: 400000
      };
      if (await simuleEt(txRequest, provider)) {
        const tx = await wallet.sendTransaction(txRequest);
        console.log(`  TX: ${tx.hash}`);
        await tx.wait();
        console.log(`  ✅ Swap yapıldı`);
      } else {
        console.log(`  ❌ Swap simülasyon başarısız, atlandı.`);
      }
      
    } else if (tip < 0.88) {
      // USDC → ETH swap (YENİ)
      const miktar = ethers.utils.parseEther("0.00005"); // 0.00005 ETH değerinde USDC
      console.log(`${cuzdan.isim}: Swap ${ethers.utils.formatEther(miktar)} USDC → ETH`);
      const router = new ethers.Contract(UNISWAP_ROUTER, [
        "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) calldata params) external payable returns (uint256 amountOut)"
      ], wallet);
      
      // Önce USDC kontratına approval ver
      const usdcKontrat = new ethers.Contract(USDC, ["function approve(address spender, uint256 amount) external returns (bool)"], wallet);
      const approveTx = await usdcKontrat.approve(UNISWAP_ROUTER, miktar, { gasLimit: 100000 });
      await approveTx.wait();
      
      const txRequest = {
        to: UNISWAP_ROUTER,
        data: router.interface.encodeFunctionData("exactInputSingle", [{
          tokenIn: USDC,
          tokenOut: WETH,
          fee: 3000,
          recipient: wallet.address,
          deadline: Math.floor(Date.now() / 1000) + 600,
          amountIn: miktar,
          amountOutMinimum: 0,
          sqrtPriceLimitX96: 0
        }]),
        gasLimit: 400000
      };
      if (await simuleEt(txRequest, provider)) {
        const tx = await wallet.sendTransaction(txRequest);
        console.log(`  TX: ${tx.hash}`);
        await tx.wait();
        console.log(`  ✅ Ters swap yapıldı`);
      } else {
        console.log(`  ❌ Ters swap simülasyon başarısız, atlandı.`);
      }
      
    } else {
      // Rastgele transfer
      const rastgele = ethers.Wallet.createRandom();
      const miktar = ethers.utils.parseEther("0.0001");
      console.log(`${cuzdan.isim}: Transfer ${ethers.utils.formatEther(miktar)}`);
      const tx = await wallet.sendTransaction({ to: rastgele.address, value: miktar, gasLimit: 100000 });
      console.log(`  TX: ${tx.hash}`);
      await tx.wait();
      console.log(`  ✅ Gönderildi`);
    }
  } catch (e) {
    console.error(`${cuzdan.isim}: ❌ ${e.message.slice(0, 80)}`);
  }
}

(async () => {
  try {
    ipDegistir();
    const provider = await getProvider();
    const karistir = [...cuzdanlar].sort(() => Math.random() - 0.5).slice(0, 12 + Math.floor(Math.random() * 7));
    console.log(`Tur: ${karistir.length} cüzdan\n`);
    
    for (const c of karistir) {
      await islemYap(c, provider);
      const beklemeSuresi = 15 * 60 * 1000 + Math.random() * 5 * 60 * 1000;
      console.log(`⏳ Bekleniyor: ${Math.round(beklemeSuresi / 60000)} dakika...\n`);
      await new Promise(r => setTimeout(r, beklemeSuresi));
    }
    console.log("\n✅ Tur tamamlandı.");
  } catch (e) {
    console.error("Başlatılamadı:", e.message);
  }
})();
