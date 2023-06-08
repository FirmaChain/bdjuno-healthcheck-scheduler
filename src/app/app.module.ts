import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import {
  initLogDir,
  winstonOptions
} from '../utils/logger.util';
import { HealthSchedulerModule } from 'src/health-scheduler/health-scheduler.module';
import { NotificationSchedulerModule } from 'src/notification-scheduler/notification-scheduler.module';

initLogDir();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.production'
    }),
    WinstonModule.forRoot(winstonOptions),
    HealthSchedulerModule,
    NotificationSchedulerModule,
  ],
  controllers: [],
})
export class AppModule {}
