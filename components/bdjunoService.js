const { execBDJunoCommand } = require("./bashCommand");

function restartBDJunoService(callback) {
  execBDJunoCommand((result) => {
		callback(result);
  });
}

module.exports = {
  restartBDJunoService
}