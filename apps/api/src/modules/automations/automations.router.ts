import { Router, Request, Response, NextFunction } from 'express';
import { automationsService } from './automations.service.js';
import { authGuard } from '../../middlewares/authGuard.js';
import { AppError } from '../../middlewares/errorHandler.js';
import {
  ApiResponse,
  AutomationDefinition,
  AutomationExecution,
  CreateAutomationRequestSchema
} from '@spotflow/shared';

export const automationsRouter = Router();

// Webhook seguro recebido do n8n (validação via header X-SpotFlow-Signature)
automationsRouter.post('/webhook', (req: Request, res: Response<ApiResponse<{ received: boolean; timestamp: string }>>, next: NextFunction) => {
  try {
    const signature = req.headers['x-spotflow-signature'] as string | undefined;
    if (!automationsService.verifyWebhookSignature(signature)) {
      throw new AppError(401, 'UNAUTHORIZED', 'Assinatura inválida no webhook do n8n (X-SpotFlow-Signature)');
    }

    res.status(200).json({
      success: true,
      data: {
        received: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
});

// Todas as rotas abaixo requerem usuário logado
automationsRouter.use(authGuard);

automationsRouter.get('/', async (req: Request, res: Response<ApiResponse<AutomationDefinition[]>>, next: NextFunction) => {
  try {
    const list = await automationsService.listAutomations(req.user!.userId);
    res.status(200).json({
      success: true,
      data: list
    });
  } catch (err) {
    next(err);
  }
});

automationsRouter.post('/', async (req: Request, res: Response<ApiResponse<AutomationDefinition>>, next: NextFunction) => {
  try {
    const validatedBody = CreateAutomationRequestSchema.parse(req.body);
    const created = await automationsService.createAutomation(req.user!.userId, validatedBody);

    res.status(201).json({
      success: true,
      data: created
    });
  } catch (err) {
    next(err);
  }
});

automationsRouter.get('/:id', async (req: Request, res: Response<ApiResponse<AutomationDefinition>>, next: NextFunction) => {
  try {
    const auto = await automationsService.getAutomationById(req.user!.userId, req.params.id!);
    res.status(200).json({
      success: true,
      data: auto
    });
  } catch (err) {
    next(err);
  }
});

automationsRouter.patch('/:id', async (req: Request, res: Response<ApiResponse<AutomationDefinition>>, next: NextFunction) => {
  try {
    const isEnabled = Boolean(req.body.isEnabled);
    const updated = await automationsService.updateAutomationStatus(req.user!.userId, req.params.id!, isEnabled);

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

automationsRouter.delete('/:id', async (req: Request, res: Response<ApiResponse<{ message: string }>>, next: NextFunction) => {
  try {
    await automationsService.deleteAutomation(req.user!.userId, req.params.id!);
    res.status(200).json({
      success: true,
      data: { message: 'Automação excluída com sucesso' }
    });
  } catch (err) {
    next(err);
  }
});

automationsRouter.post('/:id/trigger', async (req: Request, res: Response<ApiResponse<AutomationExecution>>, next: NextFunction) => {
  try {
    const isDryRun = Boolean(req.body.isDryRun ?? false);
    const execution = await automationsService.triggerAutomation(req.user!.userId, req.params.id!, isDryRun);

    res.status(200).json({
      success: true,
      data: execution
    });
  } catch (err) {
    next(err);
  }
});

automationsRouter.get('/:id/executions', async (req: Request, res: Response<ApiResponse<AutomationExecution[]>>, next: NextFunction) => {
  try {
    const executions = await automationsService.getExecutions(req.user!.userId, req.params.id!);
    res.status(200).json({
      success: true,
      data: executions
    });
  } catch (err) {
    next(err);
  }
});
