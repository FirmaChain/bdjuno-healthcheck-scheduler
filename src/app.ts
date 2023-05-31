import express, { Express } from 'express';
import compression from 'compression';
import { routes } from './routes/index';

const app: Express = express();
const port = 4000;

app.use(express.json());
app.use(compression());
app.use('/', routes);

app.listen(port, () => {
	console.log(`server is running | listen port : ${port}`);
});