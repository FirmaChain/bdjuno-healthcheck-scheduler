import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import { NotificationSchedulerService } from './notification-scheduler.service';
import { NotificationBotModule } from 'src/notification-bot/notification-bot.module';
import { HealthSchedulerTaskModule } from 'src/health-scheduler-task/health-scheduler-task.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotificationBotModule,
    HealthSchedulerTaskModule
  ],
  providers: [
    NotificationSchedulerService,
    ConfigService
  ]
})
export class NotificationSchedulerModule {}
