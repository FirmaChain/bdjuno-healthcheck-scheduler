import { exec } from 'child_process';
import { ErrorLog } from './logger.util';

export const execCommand = async (cmd: string, callback: () => void) => {
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				ErrorLog(JSON.stringify(error));
				reject(error);
			}
			else if (stderr) reject(new Error(stderr));
			else resolve(stdout);
		});
	});
}