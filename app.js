const express = require('express');
const compression = require('compression');

const routes = require('./routes');

const app = express();
const port = 4000;

app.use(express.json());
app.use(compression());
app.use('/', routes);

app.listen(port, () => {
    console.log('server is running');
});