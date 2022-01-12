const bashCommand = require('../../components/bashCommand');
const sendTelegramBotMsg = require('../../components/telegramBot');

let prevProcessStatus = false;
let nextProcessStatus = false;
let warningStack = 0;

let bashInfo = {
  isStarted: false,
  interval: null
};

function startScheduleForBash(req, res) {
  if (bashInfo.isStarted) {
    res.send({
      code: 201,
      type: "bash",
      message: "already started"
    });
    
		return ;
  }

  bashInfo.isStarted = true;
  bashInfo.interval = setInterval(async () => {
    bashCommand.execCommand((processStatus) => {
      checkProcessStatus(processStatus);
    });
  }, 10000);

  res.send({
    code: 200,
    type: "bash",
    message: "scheduling start"
  });
}

function stopScheduleForBash(req, res) {
  if (!bashInfo.isStarted) {
    res.send({
      code: 201,
      type: "hash",
      message: "already stoped"
    });
    
		return ;
  }
  
  bashInfo.isStarted = false;
  clearInterval(bashInfo.interval);
  res.send({
    code: 200,
    type: "bash",
    message: "scheduling stop"});
}

function checkProcessStatus(processStatus) {
  if (warningStack === 5) {
    sendTelegramBotMsg('bash', processStatus);
    warningStack = 0;
    bashInfo.isStarted = false;
		console.log("[warning] send noti telegram bot message at bash schedule");
    return ;
  }

  prevProcessStatus = nextProcessStatus;
  nextProcessStatus = processStatus;

  if (prevProcessStatus === nextProcessStatus) {
    warningStack++;
    console.log(`[warn] prevStatus: ${prevProcessStatus} | nextStatus: ${nextProcessStatus}`);
  }
}

function startBDJunoService(req, res) {
  bashCommand.execBDJunoCommand((result) => {
    if (result)
      res.send({
        code: 200,
        type: "service",
        message: result
      });
  });
}

module.exports = {
  startScheduleForBash,
  stopScheduleForBash,

  startBDJunoService
}