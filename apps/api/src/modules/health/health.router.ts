import { Router, Request, Response } from 'express';
import { ApiResponse } from '@spotflow/shared';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response<ApiResponse<{ status: string; uptime: number; timestamp: string }>>) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});
