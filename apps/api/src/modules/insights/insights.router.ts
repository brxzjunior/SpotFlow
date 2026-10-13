import { Router, Request, Response, NextFunction } from 'express';
import { insightsService } from './insights.service.js';
import { authGuard } from '../../middlewares/authGuard.js';
import { ApiResponse } from '@spotflow/shared';

export const insightsRouter = Router();

insightsRouter.use(authGuard);

insightsRouter.get('/summary', async (req: Request, res: Response<ApiResponse<unknown>>, next: NextFunction) => {
  try {
    const summary = await insightsService.getSummary(req.user!.spotifyAccessToken);
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (err) {
    next(err);
  }
});

insightsRouter.get('/duplicates', async (req: Request, res: Response<ApiResponse<unknown>>, next: NextFunction) => {
  try {
    const result = await insightsService.getDuplicateAudits(req.user!.spotifyAccessToken);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});
