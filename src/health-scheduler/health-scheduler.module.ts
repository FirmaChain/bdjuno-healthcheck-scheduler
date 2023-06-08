import { Module } from '@nestjs/common';

import { HealthSchedulerService } from './health-scheduler.service';
import { HealthBotModule } from 'src/health-bot/health-bot.module';
import { HealthSchedulerTaskModule } from 'src/health-scheduler-task/health-scheduler-task.module';

@Module({
  imports: [
    HealthBotModule,
    HealthSchedulerTaskModule,
  ],
  providers: [HealthSchedulerService]
})
export class HealthSchedulerModule {}
