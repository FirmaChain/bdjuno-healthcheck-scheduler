import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HealthBotService } from './health-bot.service';

@Module({
  providers: [
    HealthBotService,
    ConfigService,
  ],
  exports: [HealthBotService]
})
export class HealthBotModule {}
