import { Module } from '@nestjs/common';

import { HealthSchedulerService } from './health-scheduler.service';
import { HealthBotModule } from 'src/health-bot/health-bot.module';
import { HealthSchedulerTaskModule } from 'src/health-scheduler-task/health-scheduler-task.module';
import { NotificationBotModule } from 'src/notification-bot/notification-bot.module';

@Module({
  imports: [
    HealthBotModule,
    NotificationBotModule,
    HealthSchedulerTaskModule,
  ],
  providers: [HealthSchedulerService]
})
export class HealthSchedulerModule {}
