const bashCommand = require('./bashCommand');
const sendTelegramBotMessage = require('./telegramBot');

const { RESTART_BDJUNO_SERVICE } = require('../constants/messages');

function restartBDJunoService() {
  bashCommand.execBDJunoCommand((result) => {
    if (result) {
      sendTelegramBotMessage(RESTART_BDJUNO_SERVICE());
    }
  });
}

module.exports = restartBDJunoService;