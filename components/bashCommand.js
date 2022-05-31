const { exec } = require('child_process');

function execCommand(cmd, callback) {
	try {
		exec(cmd, (error, stdout, stderr) => {
			if (!error) {
				callback(true);
			} else {
				callback(false);
			}
		});
	} catch (e) {
		callback(false);
	}
}

module.exports = {
	execCommand
}