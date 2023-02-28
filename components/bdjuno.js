const { execCommand } = require("../utils/bashCommand");
const { ErrorLog, InfoLog } = require("../utils/logger");
const {
  BDJUNO_START_COMMAND,
  BDJUNO_STOP_COMMAND
} = require("../constants/commands");

async function restartBDJunoProcess(callback) {
  InfoLog(`Kill and restart the bdjuno service`);
  try {
    execCommand(BDJUNO_STOP_COMMAND, async () => {
      InfoLog(`Success kill the bdjuno service`);
      setTimeout(() => {
        execCommand(BDJUNO_START_COMMAND, async () => {
          InfoLog(`Success restart the bdjuno service`);

          callback();
        });
      }, 3000);
    });
  } catch (e) {
    ErrorLog(`Failed restart BDJuno service`);
    throw JSON.stringify(e);
  }
}

async function stopBDJunoProcess(callback) {
  execCommand(BDJUNO_STOP_COMMAND, async (result) => {
    InfoLog(`Success kill the bdjuno service`);

    callback();
  });
}

module.exports = {
  restartBDJunoProcess,
  stopBDJunoProcess
}