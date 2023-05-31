import { BDJUNO_START_COMMAND, BDJUNO_STOP_COMMAND } from "../constants/commands";
import { execCommand } from "src/utils/bashCommand";
import { ErrorLog, InfoLog } from "src/utils/logger";

export const restartBDJunoProcess = (callback: () => void) => {
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

export const stopBDJunoProcess = (callback: () => void) => {
  execCommand(BDJUNO_STOP_COMMAND, async () => {
    InfoLog(`Success kill the bdjuno service`);

    callback();
  });
}