import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { ApiResponse } from '@spotflow/shared';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'RATE_LIMITED' | 'SPOTIFY_ERROR' | 'AI_PROVIDER_ERROR' | 'AUTOMATION_ERROR' | 'INTERNAL_ERROR',
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ApiResponse<never>>,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Falha de validação dos dados de entrada',
        details: err.format()
      }
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
    return;
  }

  logger.error({ err }, 'Erro não tratado no servidor');

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ocorreu um erro interno no processamento do servidor'
    }
  });
}
