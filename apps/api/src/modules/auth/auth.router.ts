import { Router, Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { authGuard } from '../../middlewares/authGuard.js';
import { env } from '../../config/env.js';
import { ApiResponse, AuthStateResponse } from '@spotflow/shared';

export const authRouter = Router();

authRouter.get('/spotify/config', (_req: Request, res: Response<ApiResponse<{ isConfigured: boolean; clientId: string | null }>>) => {
  res.status(200).json({
    success: true,
    data: {
      isConfigured: authService.isConfigured(),
      clientId: authService.getClientId()
    }
  });
});

authRouter.post('/spotify/credentials', (req: Request, res: Response<ApiResponse<{ message: string }>>) => {
  const { clientId, clientSecret } = req.body;
  if (!clientId || !clientSecret || typeof clientId !== 'string' || typeof clientSecret !== 'string') {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Client ID e Client Secret são campos obrigatórios'
      }
    });
    return;
  }

  const cleanId = clientId.trim();
  const cleanSecret = clientSecret.trim();

  if (cleanId.length < 20) {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'O Spotify Client ID possui exatamente 32 caracteres hexadecimais (ex: 8f4e2b1a9c...). Não utilize o nome do aplicativo (ex: brxz).'
      }
    });
    return;
  }

  if (cleanSecret.startsWith('spak_')) {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Chaves iniciadas com "spak_" são tokens de acesso (SPAK), não o Client Secret da aplicação. No Spotify Developer Dashboard, acesse Settings > Basic Information e copie o Client Secret de 32 caracteres.'
      }
    });
    return;
  }

  authService.updateCredentials(cleanId, cleanSecret);

  res.status(200).json({
    success: true,
    data: { message: 'Credenciais do Spotify salvas com sucesso no servidor!' }
  });
});


authRouter.get('/spotify/login', (_req: Request, res: Response) => {
  if (!authService.isConfigured()) {
    res.redirect(`${env.WEB_URL}/app/settings?error=spotify_credentials_missing`);
    return;
  }
  const { url } = authService.generateAuthorizationUrl();
  res.redirect(url);
});

authRouter.get('/spotify/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      res.redirect(`${env.WEB_URL}/auth/callback?error=${encodeURIComponent(String(error))}`);
      return;
    }

    if (!code || !state) {
      res.redirect(`${env.WEB_URL}/auth/callback?error=missing_parameters`);
      return;
    }

    const { sessionToken } = await authService.handleCallback(String(code), String(state));
    res.redirect(`${env.WEB_URL}/auth/callback?token=${sessionToken}`);
  } catch (err) {
    next(err);
  }
});

// Endpoint especial para demonstração imediata de recrutadores e testes rápidos
authRouter.post('/demo', (_req: Request, res: Response<ApiResponse<{ token: string; user: unknown }>>) => {
  const { sessionToken, user } = authService.createDemoSession();
  res.status(200).json({
    success: true,
    data: {
      token: sessionToken,
      user
    }
  });
});

authRouter.get('/me', (req: Request, res: Response<ApiResponse<AuthStateResponse>>) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const session = token ? authService.getSession(token) : null;

  if (!session) {
    res.status(200).json({
      success: true,
      data: {
        user: null,
        spotify: {
          isConnected: false,
          spotifyUserId: null,
          displayName: null,
          product: 'unknown',
          scopes: [],
          expiresAt: null,
          isExpired: false
        }
      }
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: session.userId,
        email: session.email,
        displayName: session.displayName || null,
        avatarUrl: session.avatarUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      spotify: {
        isConnected: true,
        spotifyUserId: session.userId,
        displayName: session.displayName || null,
        product: 'premium',
        scopes: session.scopes ? session.scopes.split(' ') : ['playlist-modify-public', 'playlist-modify-private', 'user-read-private'],
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
        isExpired: false
      }
    }
  });
});

authRouter.post('/logout', authGuard, (req: Request, res: Response<ApiResponse<{ message: string }>>) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
  authService.invalidateSession(token);

  res.status(200).json({
    success: true,
    data: { message: 'Sessão encerrada com sucesso' }
  });
});

authRouter.post('/disconnect', authGuard, (req: Request, res: Response<ApiResponse<{ message: string }>>) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
  authService.invalidateSession(token);

  res.status(200).json({
    success: true,
    data: { message: 'Conta desconectada e tokens revogados' }
  });
});
