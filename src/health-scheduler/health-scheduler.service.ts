import { Injectable } from '@nestjs/common';

import {
  COMMAND_CLEAN_QUEUE,
  COMMAND_HEALTH_JOB_NAME,
  COMMAND_HEALTH_NOTI_START,
  COMMAND_HEALTH_NOTI_STOP,
  COMMAND_HEALTH_RESTART,
  COMMAND_HEALTH_START,
  COMMAND_HEALTH_STOP,
  COMMAND_LIST,
  GUIDE_DESC
} from '../constants/telegraf.constant';
import { HealthBotService } from '../health-bot/health-bot.service';
import { HealthSchedulerTaskService } from '../health-scheduler-task/health-scheduler-task.service';
import { NotificationBotService } from 'src/notification-bot/notification-bot.service';

@Injectable()
export class HealthSchedulerService {
  constructor(
    private readonly healthBotService: HealthBotService,
    private readonly notificationBotService: NotificationBotService,
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
      });
    });

    this.healthBotService.addHearsListener(COMMAND_CLEAN_QUEUE, async () => {
      this.healthSchedulerTaskService.cleanQueue(async (message) => {
        await this.healthBotService.sendMessage(message);
      });
    });

    this.healthBotService.addHearsListener(COMMAND_HEALTH_NOTI_START, async () => {
      this.healthSchedulerTaskService.startNotiScheduler(async (message) => {
        await this.notificationBotService.sendMessage(message);
      });
    });

    this.healthBotService.addHearsListener(COMMAND_HEALTH_NOTI_STOP, async () => {
      this.healthSchedulerTaskService.stopNotiScheduler(async (message) => {
        await this.healthBotService.sendMessage(message);
      })
    })
  }
}
