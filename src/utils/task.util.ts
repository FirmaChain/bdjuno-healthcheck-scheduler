import { exec } from "child_process";

export const executeCommand = (command: string, callback: ({ isSuccess, message }: { isSuccess: boolean, message: string }) => void) => {
  try {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        callback({ isSuccess: false, message: JSON.stringify(error) });
        return;
      } else if (stderr) {
        callback({ isSuccess: false, message: JSON.stringify(stderr) });
        return;
      } else {
        callback({ isSuccess: true, message: "" });
        return;
      }
    });
  } catch (e) {
    callback({ isSuccess: false, message: JSON.stringify(e)});
  }
};