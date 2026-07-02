import subprocess
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

BOT_TOKEN = "8874261604:AAH29BB7R_Bp98MVgcyx1XwnO1qwC4MxJJE"
AUTHORIZED_USERS = [8918239180]

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id not in AUTHORIZED_USERS:
        await update.message.reply_text("⛔ Yetkisiz erişim!")
        return
    await update.message.reply_text(
        "🤖 **Termux-Web3-Automator**\n\n"
        "/status - Bot durumu\n"
        "/logs - Son loglar\n"
        "/restart - Botları yeniden başlat\n"
        "/bakiye - Cüzdan bakiyeleri",
        parse_mode="Markdown"
    )

async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id not in AUTHORIZED_USERS:
        return
    result = subprocess.run(["pm2", "jlist"], capture_output=True, text=True)
    processes = eval(result.stdout) if result.stdout else []
    msg = "📊 **Bot Durumu**\n\n"
    for p in processes:
        emoji = "🟢" if p['pm2_env']['status'] == 'online' else "🔴"
        msg += f"{emoji} {p['name']}: {p['pm2_env']['status']}\n"
    await update.message.reply_text(msg, parse_mode="Markdown")

async def logs(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id not in AUTHORIZED_USERS:
        return
    result = subprocess.run(["pm2", "logs", "--lines", "5", "--nostream"], capture_output=True, text=True, timeout=10)
    log_text = result.stdout[-500:] if len(result.stdout) > 500 else result.stdout
    await update.message.reply_text(f"📋 **Son Loglar**\n\n```\n{log_text}\n```", parse_mode="Markdown")

async def restart(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id not in AUTHORIZED_USERS:
        return
    subprocess.run(["pm2", "restart", "all"])
    await update.message.reply_text("✅ Tüm botlar yeniden başlatıldı.")

async def bakiye(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id not in AUTHORIZED_USERS:
        return
    try:
        result = subprocess.run(
            ["node", "-e", """
                const ethers = require('ethers');
                const keys = require('./keys.json');
                const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
                (async () => {
                    let output = '';
                    for (const [name, pkey] of Object.entries(keys)) {
                        const wallet = new ethers.Wallet(pkey, provider);
                        const balance = await wallet.getBalance();
                        output += name + ': ' + Number(ethers.utils.formatEther(balance)).toFixed(4) + ' ETH\\n';
                    }
                    console.log(output);
                })();
            """],
            cwd="/data/data/com.termux/files/home/termux-web3-automator",
            capture_output=True, text=True, timeout=30
        )
        await update.message.reply_text(f"💰 **Bakiyeler**\n\n```\n{result.stdout}\n```", parse_mode="Markdown")
    except Exception as e:
        await update.message.reply_text(f"❌ Hata: {str(e)[:100]}")

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("status", status))
    app.add_handler(CommandHandler("logs", logs))
    app.add_handler(CommandHandler("restart", restart))
    app.add_handler(CommandHandler("bakiye", bakiye))
    print("Bot başlatıldı...")
    app.run_polling()

if __name__ == "__main__":
    main()
