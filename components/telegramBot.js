const TelegramBot = require('node-telegram-bot-api');
const config = require('../config.json');
const { RESTART_BDJUNO_SERVICE } = require('../constants/messages');
const { restartBDJunoService } = require('./bdjunoService');

const token = process.env.TELEGRAM_BOT_TOKEN || config.TOKEN || undefined;
const chatId = process.env.CHAT_ID || config.CHAT_ID || undefined;

const BOT = new TelegramBot(token, { polling: true });

BOT.onText(/\/command (.+)/, (message, match) => {
	switch (match[1]) {
		case 'restart':
			restartBDJunoService((result) => {
				if (result) {
					sendTelegramBotMessage(RESTART_BDJUNO_SERVICE());
				}
			});
			break;

		case 'getid':
			console.log(message.chat.id);
			break;
	}
});

BOT.on('polling_error', (error) => {
	console.log(error);
});

async function sendTelegramBotMessage (message) {
	return await BOT.sendMessage(chatId, message);
};

module.exports = sendTelegramBotMessage;