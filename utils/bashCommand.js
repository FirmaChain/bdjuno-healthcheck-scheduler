const { exec } = require('child_process');
const { ErrorLog } = require('./logger');

function execCommand(cmd, callback) {
	try {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				ErrorLog(error);
				throw error;
			}
			callback();
		});
	} catch (e) {
		throw e;
	}
}

module.exports = {
	execCommand
}