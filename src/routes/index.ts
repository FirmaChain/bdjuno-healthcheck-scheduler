import { Router, Request, Response } from 'express';
import { startScheduler, stopScheduler } from './scheduler';

export const routes = () => {
	const route = Router();

	route.get('/health', (req: Request, res: Response) => {
		res.send('healthcheck');
	});
	
	route.get('/schedule/start', startScheduler);
	route.get('/schedule/stop', stopScheduler);

	return route;
}