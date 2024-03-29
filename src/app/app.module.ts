import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import {
  initLogDir,
  winstonOptions
} from '../utils/logger.util';
import { HealthSchedulerModule } from '../health-scheduler/health-scheduler.module';
import { AppController } from './app.controller';

initLogDir();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.production'
    }),
    WinstonModule.forRoot(winstonOptions),
    HealthSchedulerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
