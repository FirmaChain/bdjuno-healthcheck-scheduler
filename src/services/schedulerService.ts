import { restartBDJunoProcess, stopBDJunoProcess } from "../components/bdjuno";
import { getBlockFromHasura } from "../components/graphql";
import { ErrorLog, InfoLog } from "../utils/logger";

import {
  sendHealthBotMessage,
  sendNotificationBotMessage
} from "../components/telegramBot";
import { 
  MSG_BLOCK_HEIGHT,
  MSG_ERROR_NOT_UPDATE,
  MSG_RESTART_BDJUNO,
  MSG_START_SCHEDULING,
  MSG_STOP_SCHEDULING,
  MSG_WARNING_NOT_UPDATE
} from "../constants/messages";

const MAX_WARNING_STACK = 5;

export class SchedulerSerivce {
  prevBlockHeight = 0;
  nowBlockHeight = 0;
  warningStack = 0;

  schedulerInterval: NodeJS.Timer | undefined;
  isStarted = false;
  intervalTime = 15;

  async startScheduler() {
    if (this.isStarted) {
      InfoLog(`Already started bdjuno healthcheck scheduling`);
      return `[INFO] Already started`;
    }

    try {
      this.isStarted = true;
      // print console log & telegram message
      await sendHealthBotMessage(MSG_START_SCHEDULING);
      // start scheduler
      this.schedulerInterval = setInterval(this.start, 1000 * this.intervalTime);
      return { success: true, message: `[INFO] Start scheduler` };
    } catch (e) {
      ErrorLog(e);
      throw JSON.stringify(e);
    }
  }

  async start() {
    try {
      this.nowBlockHeight = await getBlockFromHasura();

      if (this.prevBlockHeight === this.nowBlockHeight) {
        // send telegram message
        this.warningStack++;
        await sendHealthBotMessage(MSG_WARNING_NOT_UPDATE(this.nowBlockHeight, this.warningStack));

        if (this.warningStack > MAX_WARNING_STACK) {
          this.warningStack = 0;

          await sendNotificationBotMessage(MSG_ERROR_NOT_UPDATE(this.nowBlockHeight));

          restartBDJunoProcess(async () => {
            await sendNotificationBotMessage(MSG_RESTART_BDJUNO);
          });
        }
      } else {
        this.prevBlockHeight = this.nowBlockHeight;
        this.warningStack = 0;

        await sendHealthBotMessage(MSG_BLOCK_HEIGHT(this.nowBlockHeight));
      }
    } catch (e) {
      ErrorLog(e);
    }
  }

  async stopScheduler() {
    if (!this.isStarted) {
      InfoLog(`Already started bdjuno healthcheck scheduling`);
      return `[INFO] Already stoped`;
    }

    try {
      this.isStarted = false;
      clearInterval(this.schedulerInterval);

      stopBDJunoProcess(async () => {
        await sendHealthBotMessage(MSG_STOP_SCHEDULING);
      });
    } catch (e) {
      throw JSON.stringify(e);
    }
  }
}