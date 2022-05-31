const { exec } = require('child_process');

function execCommand(callback) {
	exec("ps -ef | grep 'bdjuno parse'", (error, stdout, stderr) => {
		const splitData = stdout.split('\n')
		for (let i = 0; i < splitData.length; i++) {
			const convertData = splitData[i].replace(/ +/g, " ");
			const psinfo = convertData.split(' ');
			const psname = psinfo[7] + ' ' + psinfo[8];

			if (psname === '/usr/local/bin/bdjuno parse') {
				callback(true);
			}
		}
		callback(false);
	});
}

function execBDJunoCommand(callback) {
	execCommand((isRunning) => {
		if (isRunning) {
			callback(false);
		} else {
			try {
				exec("sudo systemctl restart bdjuno.service", (error, stdout, stderr) => {
					console.log(error);
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
	});
}
module.exports = {
	execCommand,
	execBDJunoCommand
}