import { Router, Request, Response, NextFunction } from 'express';
import { copilotService } from './copilot.service.js';
import { authGuard } from '../../middlewares/authGuard.js';
import {
  ApiResponse,
  AICopilotMessageResponse,
  AICopilotActionSchema
} from '@spotflow/shared';

export const copilotRouter = Router();

copilotRouter.use(authGuard);

copilotRouter.post('/message', async (req: Request, res: Response<ApiResponse<AICopilotMessageResponse>>, next: NextFunction) => {
  try {
    const userMessage = String(req.body.message || '');
    if (!userMessage.trim()) {
      res.status(200).json({
        success: true,
        data: {
          replyText: 'Como posso ajudar você com suas músicas hoje?',
          proposedAction: null
        }
      });
      return;
    }

    const response = await copilotService.processMessage(userMessage, req.user!.spotifyAccessToken);

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (err) {
    next(err);
  }
});

copilotRouter.post('/execute-action', async (req: Request, res: Response<ApiResponse<{ message: string; details?: unknown }>>, next: NextFunction) => {
  try {
    const validatedAction = AICopilotActionSchema.parse(req.body.action);
    const result = await copilotService.executeAction(validatedAction, req.user!.userId, req.user!.spotifyAccessToken);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});
