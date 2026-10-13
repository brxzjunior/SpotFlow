import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`🚀 SpotFlow API ativa e operando em ${env.API_URL} no ambiente [${env.NODE_ENV}]`);
});
