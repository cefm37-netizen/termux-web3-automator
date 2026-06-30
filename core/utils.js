const ethers = require("ethers");

function sleep(seconds) {
  return new Promise(r => setTimeout(r, seconds * 1000));
}

async function randomSleep(minMinutes, maxMinutes) {
  const ms = (minMinutes + Math.random() * (maxMinutes - minMinutes)) * 60 * 1000;
  console.log(`⏳ Bekleniyor: ${Math.round(ms / 60000)} dakika...`);
  return new Promise(r => setTimeout(r, ms));
}

async function safeEstimateGas(txRequest, provider) {
  try {
    const estimated = await provider.estimateGas(txRequest);
    return estimated.mul(120).div(100);
  } catch (error) {
    throw new Error(`Gas estimation failed: ${error.message}`);
  }
}

// Artık URL değil, doğrudan provider nesnesi döndürür
async function getWorkingProvider(rpcList) {
  for (const rpc of rpcList) {
    try {
      const p = new ethers.providers.JsonRpcProvider(rpc);
      await p.getNetwork();
      console.log(`✅ RPC bağlandı: ${rpc}`);
      return p; // Provider nesnesi döndür
    } catch (e) {}
  }
  throw new Error("Hiçbir RPC çalışmıyor");
}

module.exports = { sleep, randomSleep, safeEstimateGas, getWorkingProvider };
