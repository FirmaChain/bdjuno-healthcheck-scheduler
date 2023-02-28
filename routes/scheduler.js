const SchedulerSerivce = require("../services/schedulerService")

async function startScheduler(req, res) {
  const result = await SchedulerSerivce.startScheduler();
  res.send(result);
}

async function stopScheduler(req, res) {
  const result = await SchedulerSerivce.stopScheduler()
  res.send(result);
}

module.exports = {
  startScheduler, stopScheduler
}