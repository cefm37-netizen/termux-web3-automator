const ethers = require("ethers");
const { safeEstimateGas } = require("./utils");

class EVMAutomator {
  // Constructor artık doğrudan provider nesnesi alır
  constructor(provider, privateKey) {
    this.provider = provider;
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async getBalance() {
    return await this.wallet.getBalance();
  }

  async deployContract(bytecode, abi = [], deployArgs = []) {
    const factory = new ethers.ContractFactory(abi, bytecode, this.wallet);
    const tx = await factory.deploy(...deployArgs, { gasLimit: 800000 });
    await tx.deployTransaction.wait();
    return tx.address;
  }

  async wrapETH(wethAddress, amountInWei) {
    const abi = ["function deposit() public payable"];
    const contract = new ethers.Contract(wethAddress, abi, this.wallet);
    const txData = await contract.populateTransaction.deposit({ value: amountInWei });
    txData.gasLimit = await safeEstimateGas(txData, this.provider);
    const tx = await contract.deposit({ value: amountInWei, gasLimit: txData.gasLimit });
    return await tx.wait();
  }

  async unwrapETH(wethAddress, amountInWei) {
    const abi = ["function withdraw(uint256) external"];
    const contract = new ethers.Contract(wethAddress, abi, this.wallet);
    const txData = await contract.populateTransaction.withdraw(amountInWei);
    txData.gasLimit = await safeEstimateGas(txData, this.provider);
    const tx = await contract.withdraw(amountInWei, { gasLimit: txData.gasLimit });
    return await tx.wait();
  }

  async sendETH(toAddress, amountInWei) {
    const txData = { to: toAddress, value: amountInWei, gasLimit: 100000 };
    txData.gasLimit = await safeEstimateGas(txData, this.provider);
    const tx = await this.wallet.sendTransaction(txData);
    return await tx.wait();
  }

  async swapExactInputSingle(routerAddress, tokenIn, tokenOut, fee, amountIn) {
    const abi = ["function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) calldata params) external payable returns (uint256 amountOut)"];
    const router = new ethers.Contract(routerAddress, abi, this.wallet);
    const params = {
      tokenIn, tokenOut, fee,
      recipient: this.wallet.address,
      deadline: Math.floor(Date.now() / 1000) + 600,
      amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    };
    const txData = await router.populateTransaction.exactInputSingle(params, {
      value: tokenIn === ethers.constants.AddressZero ? amountIn : 0
    });
    txData.gasLimit = await safeEstimateGas(txData, this.provider);
    const tx = await router.exactInputSingle(params, {
      value: tokenIn === ethers.constants.AddressZero ? amountIn : 0,
      gasLimit: txData.gasLimit
    });
    return await tx.wait();
  }
}

module.exports = EVMAutomator;
