import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import { HealthSchedulerTaskService } from './health-scheduler-task.service';
import { HasuraModule } from 'src/hasura/hasura.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HasuraModule,
  ],
  providers: [
    HealthSchedulerTaskService,
    ConfigService,
  ],
  exports: [
    HealthSchedulerTaskService
  ]
})
export class HealthSchedulerTaskModule {}
