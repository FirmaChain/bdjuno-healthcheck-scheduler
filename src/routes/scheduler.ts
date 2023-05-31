import { Request, Response } from "express";
import { SchedulerSerivce } from "../services/schedulerService";

const schedulerService: SchedulerSerivce = new SchedulerSerivce();

export const startScheduler = async (req: Request, res: Response) => {
  const result = await schedulerService.startScheduler();
  res.send(result);
}

export const stopScheduler = async (req: Request, res: Response) => {
  const result = await schedulerService.stopScheduler()
  res.send(result);
}