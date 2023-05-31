import TelegramBot from 'node-telegram-bot-api';
import config from '../../config.json';
import { ErrorLog, InfoLog } from 'src/utils/logger';

const HEALTH = {
	token: process.env.HEALTH_BOT_TOKEN || config.HEALTH_BOT.TOKEN || undefined,
	chatId: process.env.HEALTH_BOT_CHAT_ID || config.HEALTH_BOT.CHAT_ID || undefined
}

const NOTIFICATION = {
	token: process.env.NOTIFICATION_BOT_TOKEN || config.NOTIFICATION_BOT.TOKEN || undefined,
	chatId: process.env.NOTIFICATION_BOT_CHAT_ID || config.NOTIFICATION_BOT.CHAT_ID || undefined
}

const HEALTH_BOT: TelegramBot = new TelegramBot(HEALTH.token!, { polling: true });
const NOTIFICATION_BOT: TelegramBot = new TelegramBot(NOTIFICATION.token!, { polling: true });

HEALTH_BOT.on('polling_error', (error) => {
	ErrorLog(error);
});

NOTIFICATION_BOT.on('polling_error', (error) => {
	ErrorLog(error);
});

export const sendHealthBotMessage = async (message: string) => {
	try {
		await HEALTH_BOT.sendMessage(HEALTH.chatId!, message, { disable_web_page_preview: true });
		InfoLog(message);
	} catch (e) {
		ErrorLog({ func: `sendHealthBotMessage`, message: message });
		throw e;
	}
}

export const sendNotificationBotMessage = async (message: string) => {
	try {
		await NOTIFICATION_BOT.sendMessage(NOTIFICATION.chatId!, message, { disable_web_page_preview: true });
		InfoLog(message);
	} catch (e) {
		ErrorLog({ func: `sendNotificationBotMessage`, message: message });
		throw e;
	}
}