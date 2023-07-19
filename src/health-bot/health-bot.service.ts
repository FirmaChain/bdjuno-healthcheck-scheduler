import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class HealthBotService {
  private bot: Telegraf;
  private chatId: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.bot = new Telegraf(this.configService.get<string>('HEALTH_BOT_TOKEN'));
    this.chatId = this.configService.get<string>('HEALTH_BOT_CHATID');

    // Start bot
    this.bot.launch();
  }

  addHearsListener(command: string, callback: () => Promise<void>) {
    this.bot.hears(command, async () => {
      return await callback();
    })
  }

  async sendMessage(message: string) {
    try {
      await this.bot.telegram.sendMessage(this.chatId, message, { disable_web_page_preview: true });
      this.logger.info(`✅ [HealthBot] Success sendMessage : ${message}`);
    } catch (e) {
      this.logger.error(`❌ [HealthBot] Error sendMessage : ${message}`);
    }
  }
}
