const TelegramBot = require('node-telegram-bot-api');
const config = require('../config.json');

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
	console.log(error);
});

NOTIFICATION_BOT.on('polling_error', (error) => {
	console.log(error);
});

async function sendHealthBotMessage (message) {
	return await HEALTH_BOT.sendMessage(HEALTH.chatId, message);
};

async function sendNotificationBotMessage (message) {
	return await NOTIFICATION_BOT.sendMessage(NOTIFICATION.chatId, message);
}

module.exports = {
	sendHealthBotMessage,
	sendNotificationBotMessage
}