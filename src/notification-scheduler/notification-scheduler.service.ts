import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HealthSchedulerTaskService } from 'src/health-scheduler-task/health-scheduler-task.service';

import { NotificationBotService } from 'src/notification-bot/notification-bot.service';
import Queue from 'src/utils/queue.utils';

@Injectable()
export class NotificationSchedulerService {
  private queue: Queue<number>;
  
  constructor(
    private readonly configService: ConfigService,
    private readonly notificationBotService: NotificationBotService,
    private readonly healthSchedulerTaskService: HealthSchedulerTaskService
  ) {
    this.queue = new Queue<number>(this.configService.get<string>('QUEUE_FILE_NAME'));
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    if (!this.queue.isEmpty()) {
      const height = this.queue.decueue();
      
      await this.notificationBotService.sendMessage(`❌ Not update block height : ${height}`);

      await this.healthSchedulerTaskService.restartScheduler(async (message) => {
        await this.notificationBotService.sendMessage(`✅ [Automatically] - ${message}`);
        this.queue.clean();
      });

    } else {
      await this.notificationBotService.sendMessage(`✅ Queue has no hieght list`);
    }
  }
}
