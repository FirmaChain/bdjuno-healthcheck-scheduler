const route = require('express').Router();

const hasuraSchedule = require('./schedule/hasuraSchedule');

route.get('/health', (req, res) => {
    res.send('healthcheck');
});

route.get('/hasura/schedule/start', hasuraSchedule.startScheduleForHasura);
route.get('/hasura/schedule/stop', hasuraSchedule.stopScheduleForHasura);

module.exports = route;