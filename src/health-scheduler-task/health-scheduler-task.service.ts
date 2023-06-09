import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

import { HasuraService } from 'src/hasura/hasura.service';
import Queue from 'src/utils/queue.utils';
import { BDJUNO_RESTART_COMMAND, BDJUNO_START_COMMAND, BDJUNO_STOP_COMMAND } from 'src/constants/bdjuno.constant';
import { executeCommand } from 'src/utils/task.util';

@Injectable()
export class HealthSchedulerTaskService {
  private queue: Queue<number>;

  private jobName: string = "HEIGHT_JOB";

  private intervalSeconds: number = 0;
  private maxWarningStack: number = 0;
  private nowWarningStack: number = 0;

  constructor(
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly hasuraService: HasuraService,
  ) {
    this.maxWarningStack = this.configService.get<number>('WARNING_STACK');
    this.intervalSeconds = this.configService.get<number>('INTERVAL_SECONDS');
    this.queue = new Queue<number>(this.configService.get<string>('QUEUE_FILE_NAME'));
  }

  async startScheduler(callback: (message: string) => void) {
    const isRunInterval = this.schedulerRegistry.getIntervals().includes(this.jobName);
    if (isRunInterval) {
      callback(`❎ Interval is already running : ${this.jobName}`);
    }

    try {
      executeCommand(BDJUNO_START_COMMAND, async ({ isSuccess, message }) => {
        if (isSuccess) {
          this.schedulerRegistry.addInterval(this.jobName, setInterval(async () => {
            const { isSame, height } = await this.hasuraService.isSameHeight();
            if (isSame) {
              this.nowWarningStack++;
      
              if (this.nowWarningStack > this.maxWarningStack) {
                this.nowWarningStack = 0;
                this.queue.enqueue(height);
                callback(`✅ Saved height in queue. : ${height}`);
              } else {
                callback(`❎ Height is not updated : ${height}, warning count : ${this.nowWarningStack}`);
              }
            } else {
              if (height === 0) {
                callback(`✅ First parsing. prev height is 0`);
              } else {
                callback(`✅ NOW BLOCK HEIGHT - ${height}`);
              }
            }
          }, this.intervalSeconds * 1000));
          callback(`✅ Success start BDJuno Service`);
        } else {
          callback(`❌ Failed start BDJuno Service - ${message}`);
        }
      });
    } catch (e) {
      callback(`❌ Failed add interval(start) : ${e}`);
    }
  }

  async stopScheduler(callback: (message: string) => void) {
    const isRunInterval = this.schedulerRegistry.getIntervals().includes(this.jobName);
    if (!isRunInterval) {
      callback(`✅ Interval is no running : ${this.jobName}`);
    }

    try {
      this.schedulerRegistry.deleteInterval(this.jobName);
      executeCommand(BDJUNO_STOP_COMMAND, async ({ isSuccess, message }) => {
        if (isSuccess) {
          callback(`✅ Success stop BDJuno Service`);
        } else {
          callback(`❌ Failed stop BDJuno Service - ${message}`);
        }
      });
    } catch (e) {
      callback(`❌ Failed delete interval : ${e}`);
    }
  }

  async restartScheduler(callback: (message: string) => void) {
    const isRunInterval = this.schedulerRegistry.getIntervals().includes(this.jobName);
    if (isRunInterval) {
      this.schedulerRegistry.deleteInterval(this.jobName);
      callback(`❎ Interval is delete : ${this.jobName}`);
    }

    try {
      executeCommand(BDJUNO_RESTART_COMMAND, async ({ isSuccess, message }) => {
        if (isSuccess) {
          this.schedulerRegistry.addInterval(this.jobName, setInterval(async () => {
            const { isSame, height } = await this.hasuraService.isSameHeight();
            if (isSame) {
              this.nowWarningStack++;
      
              if (this.nowWarningStack > this.maxWarningStack) {
                this.nowWarningStack = 0;
                this.queue.enqueue(height);
                callback(`✅ Saved height in queue. : ${height}`);
              } else {
                callback(`❎ Height is not updated : ${height}, warning count : ${this.nowWarningStack}`);
              }
            } else {
              if (height === 0) {
                callback(`✅ First parsing. prev height is 0`);
              } else {
                callback(`✅ NOW BLOCK HEIGHT - ${height}`);
              }
            }
          }, this.intervalSeconds * 1000));
          callback(`✅ Success restart BDJuno Service`);
        } else {
          callback(`❌ Failed restart BDJuno Service - ${message}`);
        }
      });
    } catch (e) {
      callback(`❌ Failed add interval(restart) : ${e}`);
    }
  }

  async getIntervalName(callback: (message: string) => void) {
    const intervals = this.schedulerRegistry.getIntervals();
    callback(`interval name array : ${JSON.stringify(intervals)}`);
  }

  cleanQueue(callback: (message: string) => void) {
    const isEmpty = this.queue.isEmpty();
    if (isEmpty) {
      callback(`Queue is empty`);
    } else {
      this.queue.clean();
      callback(`Queue cleaned`);
    }
  }
}