const TelegramBot = require('node-telegram-bot-api');
const config = require('../config.json');

/*
 * Live mode
 */
const token = process.env.TELEGRAM_BOT_TOKEN || config.TOKEN || undefined;
const chatId = process.env.CHAT_ID || config.CHAT_ID || undefined;

const bot = new TelegramBot(token, {
    polling: true
});

async function sendTelegramBotMsg(type, value) {
    if (token === undefined) {
        throw new Error("not found telegram bot token at env");
    }

    if (type === 'hasura')
        await bot.sendMessage(chatId, `[ERROR] Block height is stop at ${value}`);
    else if (type === 'bash')
        await bot.sendMessage(chatId, `[ERROR] BDJuno process status is ${value}`);
}

module.exports = sendTelegramBotMsg;