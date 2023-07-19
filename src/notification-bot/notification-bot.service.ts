import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class NotificationBotService {
  private bot: Telegraf;
  private chatId: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.bot = new Telegraf(this.configService.get<string>('NOTIFICATION_BOT_TOKEN'));
    this.chatId = this.configService.get<string>('NOTIFICATION_BOT_CHATID');

    // Start bot
    this.bot.launch();
  }

  async sendMessage(message: string) {
    try {
      await this.bot.telegram.sendMessage(this.chatId, message, { disable_web_page_preview: true });
      this.logger.info(`✅ [NotificationBot] Success sendMessage : ${message}`);
    } catch (e) {
      this.logger.error(`❌ [NotificationBot] Error sendMessage : ${message}`);
    }
  }
}
