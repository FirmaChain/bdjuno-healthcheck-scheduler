import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HealthSchedulerTaskService } from 'src/health-scheduler-task/health-scheduler-task.service';

import { NotificationBotService } from 'src/notification-bot/notification-bot.service';
import Queue from 'src/utils/queue.utils';
import { Logger } from 'winston';

@Injectable()
export class NotificationSchedulerService {
  private queue: Queue<number>;
  
  constructor(
    private readonly configService: ConfigService,
    private readonly notificationBotService: NotificationBotService,
    private readonly healthSchedulerTaskService: HealthSchedulerTaskService,

    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.queue = new Queue<number>(this.configService.get<string>('QUEUE_FILE_NAME'));
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    if (!this.queue.isEmpty()) {
      const height = this.queue.decueue();
      
      await this.notificationBotService.sendMessage(`❌ Not update block height : ${height}`);

      await this.healthSchedulerTaskService.restartScheduler(async (message) => {
        await this.notificationBotService.sendMessage(`✅ [Automatically] - ${message}`);
        this.queue.clean();
      });
    } else {
      this.logger.info(`✅ Queue has no hieght list`);
    }
  }
}
