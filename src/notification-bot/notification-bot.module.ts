import { Module } from '@nestjs/common';
import { NotificationBotService } from './notification-bot.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    NotificationBotService,
    ConfigService
  ],
  exports: [NotificationBotService]
})
export class NotificationBotModule {}
