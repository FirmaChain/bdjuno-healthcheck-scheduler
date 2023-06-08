import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { NotificationSchedulerService } from './notification-scheduler.service';
import { NotificationBotModule } from 'src/notification-bot/notification-bot.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotificationBotModule
  ],
  providers: [
    NotificationSchedulerService,
    ConfigService
  ]
})
export class NotificationSchedulerModule {}
