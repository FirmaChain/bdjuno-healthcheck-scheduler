import { Injectable } from '@nestjs/common';

import {
  COMMAND_CLEAN_QUEUE,
  COMMAND_HEALTH_JOB_NAME,
  COMMAND_HEALTH_RESTART,
  COMMAND_HEALTH_START,
  COMMAND_HEALTH_STOP,
  COMMAND_LIST,
  GUIDE_DESC
} from 'src/constants/telegraf.constant';
import { HealthBotService } from 'src/health-bot/health-bot.service';
import { HealthSchedulerTaskService } from 'src/health-scheduler-task/health-scheduler-task.service';

@Injectable()
export class HealthSchedulerService {
  constructor(
    private readonly healthBotService: HealthBotService,
    private readonly healthSchedulerTaskService: HealthSchedulerTaskService,
  ) {
    this.initializeHealthCheck();
  }

  initializeHealthCheck() {
    this.healthBotService.addHearsListener(COMMAND_LIST, async () => {
      await this.healthBotService.sendMessage(GUIDE_DESC);
    });

    this.healthBotService.addHearsListener(COMMAND_HEALTH_START, async () => {
      await this.healthSchedulerTaskService.startScheduler(async (message) => {
        await this.healthBotService.sendMessage(message);
      });
    });

    this.healthBotService.addHearsListener(COMMAND_HEALTH_STOP, async () => {
      await this.healthSchedulerTaskService.stopScheduler(async (message) => {
        await this.healthBotService.sendMessage(message);
      });
    });

    this.healthBotService.addHearsListener(COMMAND_HEALTH_RESTART, async () => {
      await this.healthSchedulerTaskService.restartScheduler(async (message) => {
        await this.healthBotService.sendMessage(message);
      });
    });

    this.healthBotService.addHearsListener(COMMAND_HEALTH_JOB_NAME, async () => {
      await this.healthSchedulerTaskService.getIntervalName(async (message) => {
        await this.healthBotService.sendMessage(message);
      })
    });

    this.healthBotService.addHearsListener(COMMAND_CLEAN_QUEUE, async () => {
      this.healthSchedulerTaskService.cleanQueue(async (message) => {
        await this.healthBotService.sendMessage(message);
      });
    });
  }
}
