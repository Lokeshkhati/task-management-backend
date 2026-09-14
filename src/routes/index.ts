import express from "express";
import { config } from '../config/index.js';

const indexRouter : express.Router = express.Router();

indexRouter.get('/', async (req, res): Promise<any> => {
  return res.json({ service: config.SERVICE_NAME, status: 'running' });
});

indexRouter.get('/health', async (req, res): Promise<any> => {
  return res.json({ service: config.SERVICE_NAME, status: 'ok' });
});

export { indexRouter };