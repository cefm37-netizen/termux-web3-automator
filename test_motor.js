const EVMAutomator = require("./core/automator");
const { getWorkingProvider } = require("./core/utils");
const ethers = require("ethers");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const keys = JSON.parse(fs.readFileSync("../airdrop/keys.json", "utf8"));

async function test() {
  // Artık provider nesnesi alıyoruz
  const provider = await getWorkingProvider(config.NETWORK_SETTINGS.BASE_SEPOLIA_RPC_URLS);

  const pk = keys["cuzdan01"] || keys["cuzdan1"];
  if (!pk) {
    console.log("cuzdan01 bulunamadı!");
    return;
  }

  const bot = new EVMAutomator(provider, pk);
  const balance = await bot.getBalance();
  console.log(`cuzdan01 Base Sepolia bakiyesi: ${ethers.utils.formatEther(balance)} ETH`);

  if (balance.gte(ethers.utils.parseEther("0.005"))) {
    const WETH = "0x4200000000000000000000000000000000000006";
    console.log("Test: WETH wrap 0.0001 ETH...");
    const receipt = await bot.wrapETH(WETH, ethers.utils.parseEther("0.0001"));
    console.log(`✅ Başarılı! TX: ${receipt.transactionHash}`);
  } else {
    console.log("⚠️ Yetersiz bakiye, test atlandı.");
  }
}

test().catch(console.error);
