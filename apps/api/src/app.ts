import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { healthRouter } from './modules/health/health.router.js';
import { authRouter } from './modules/auth/auth.router.js';
import { spotifyRouter } from './modules/spotify/spotify.router.js';
import { studioRouter } from './modules/playlists/playlists.router.js';
import { automationsRouter } from './modules/automations/automations.router.js';
import { insightsRouter } from './modules/insights/insights.router.js';
import { copilotRouter } from './modules/copilot/copilot.router.js';

export function createApp() {
  const app = express();

  // Segurança e utilitários
  app.use(helmet());
  app.use(
    cors({
      origin: [env.WEB_URL, 'http://localhost:5173'],
      credentials: true
    })
  );
  app.use(express.json());

  // Logging de requisições
  if (env.NODE_ENV !== 'test') {
    app.use(requestLogger);
  }

  // Rotas da API
  app.use('/health', healthRouter);
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/spotify', spotifyRouter);
  app.use('/api/studio', studioRouter);
  app.use('/api/automations', automationsRouter);
  app.use('/api/insights', insightsRouter);
  app.use('/api/copilot', copilotRouter);

  // Tratador global de erros
  app.use(errorHandler);

  return app;
}
