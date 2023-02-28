
const getBlockFromHasura = require("../components/graphql");
const {
  sendHealthBotMessage,
  sendNotificationBotMessage
} = require("../components/telegramBot");

const {
  MSG_BLOCK_HEIGHT,
  MSG_ERROR_NOT_UPDATE,
  MSG_WARNING_NOT_UPDATE,
  MSG_START_SCHEDULING,
  MSG_STOP_SCHEDULING,
  MSG_RESTART_BDJUNO
} = require("../constants/messages");
const { ErrorLog, InfoLog } = require("../utils/logger");
const { restartBDJunoProcess } = require("../components/bdjuno");

const MAX_WARNING_STACK = 5;

class SchedulerSerivce {
  prevBlockHeight = 0;
  nowBlockHeight = 0;
  warningStack = 0;

  isStarted = false;
  schedulerInterval;
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
    // try {
    this.nowBlockHeight = await getBlockFromHasura();

    if (this.prevBlockHeight === this.nowBlockHeight) {
      this.warningStack++;
      // send telegram message
      await sendHealthBotMessage(MSG_WARNING_NOT_UPDATE(this.nowBlockHeight, this.warningStack));

      if (this.warningStack > MAX_WARNING_STACK) {
        this.warningStack = 0;

        await sendNotificationBotMessage(MSG_ERROR_NOT_UPDATE(this.nowBlockHeight));

        await restartBDJunoProcess(async () => {
          await sendNotificationBotMessage(MSG_RESTART_BDJUNO);
        });
      }
    } else {
      this.prevBlockHeight = this.nowBlockHeight;
      this.warningStack = 0;

      await sendHealthBotMessage(MSG_BLOCK_HEIGHT(this.nowBlockHeight));
    }
    // } catch (e) {
    //   console.log(111);
    //   throw JSON.stringify(e);
    // }
  }

  async stopScheduler() {
    if (!this.isStarted) {
      InfoLog(`Already started bdjuno healthcheck scheduling`);
      return `[INFO] Already stoped`;
    }

    try {
      this.isStarted = false;
      clearInterval(this.schedulerInterval);

      await stopBDJunoProcess(async () => {
        await sendHealthBotMessage(MSG_STOP_SCHEDULING);
      });
    } catch (e) {
      throw JSON.stringify(e);
    }
  }
}

module.exports = new SchedulerSerivce();