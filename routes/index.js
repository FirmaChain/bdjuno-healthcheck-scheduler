const route = require('express').Router();

const hasuraSchedule = require('./schedule/hasuraSchedule');
const bashSchedule = require('./schedule/bashSchdule');

route.get('/health', (req, res) => {
    res.send('healthcheck');
});

route.get('/hasura/schedule/start', hasuraSchedule.startScheduleForHasura);
route.get('/hasura/schedule/stop', hasuraSchedule.stopScheduleForHasura);

route.get('/bash/schedule/start', bashSchedule.startScheduleForBash);
route.get('/bash/schedule/stop', bashSchedule.stopScheduleForBash);

route.get('/bash/service/restart', bashSchedule.startBDJunoService);

module.exports = route;