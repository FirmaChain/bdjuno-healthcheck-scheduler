const route = require('express').Router();
const schedulerRoute = require('./scheduler');

route.get('/health', (req, res) => {
	res.send('healthcheck');
});

route.get('/schedule/start', schedulerRoute.startScheduler);
route.get('/schedule/stop', schedulerRoute.stopScheduler);

module.exports = route;