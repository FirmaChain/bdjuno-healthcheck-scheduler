const TelegramBot = require('node-telegram-bot-api');
const config = require('../config.json');
const { InfoLog, ErrorLog } = require('../utils/logger');

const HEALTH = {
	token: process.env.HEALTH_BOT_TOKEN || config.HEALTH_BOT.TOKEN || undefined,
	chatId: process.env.HEALTH_BOT_CHAT_ID || config.HEALTH_BOT.CHAT_ID || undefined
}

const NOTIFICATION = {
	token: process.env.NOTIFICATION_BOT_TOKEN || config.NOTIFICATION_BOT.TOKEN || undefined,
	chatId: process.env.NOTIFICATION_BOT_CHAT_ID || config.NOTIFICATION_BOT.CHAT_ID || undefined
}

const HEALTH_BOT = new TelegramBot(HEALTH.token, { polling: true });
const NOTIFICATION_BOT = new TelegramBot(NOTIFICATION.token, { polling: true });

HEALTH_BOT.on('polling_error', (error) => {
	ErrorLog(error);
});

NOTIFICATION_BOT.on('polling_error', (error) => {
	ErrorLog(error);
});

async function sendHealthBotMessage(message) {
	try {
		await HEALTH_BOT.sendMessage(HEALTH.chatId, message, { disable_web_page_preview: true });
		InfoLog(message);
	} catch (e) {
		ErrorLog({ func: `sendHealthBotMessage`, message: message });
		throw e;
	}
}

async function sendNotificationBotMessage(message) {
	try {
		await NOTIFICATION_BOT.sendMessage(NOTIFICATION.chatId, message, { disable_web_page_preview: true });
		InfoLog(message);
	} catch (e) {
		ErrorLog({ func: `sendNotificationBotMessage`, message: message });
		throw e;
	}
}

module.exports = {
	sendHealthBotMessage,
	sendNotificationBotMessage
}