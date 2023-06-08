import { Module } from '@nestjs/common';

import { HealthSchedulerTaskService } from './health-scheduler-task.service';
import { HasuraService } from 'src/hasura/hasura.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  providers: [
    HealthSchedulerTaskService,
    ConfigService,
    HasuraService,
  ],
  exports: [
    HealthSchedulerTaskService
  ]
})
export class HealthSchedulerTaskModule {}
