import { Request, Response, NextFunction } from 'express';
import { authService, AuthSession } from '../modules/auth/auth.service.js';
import { AppError } from './errorHandler.js';

// Extensão de tipos do Express para acoplar req.user
declare global {
  namespace Express {
    interface Request {
      user?: AuthSession;
    }
  }
}

export function authGuard(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Autenticação necessária para acessar este recurso'));
  }

  const session = authService.getSession(token);
  if (!session) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Sessão inválida ou expirada. Faça login novamente'));
  }

  req.user = session;
  next();
}
