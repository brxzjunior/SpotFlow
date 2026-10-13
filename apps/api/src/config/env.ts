import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Carrega .env da raiz ou local
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  API_URL: z.string().url().default('http://localhost:3001'),
  WEB_URL: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z.string().default('postgresql://spotflow:spotflow_secret@localhost:5432/spotflow_db?schema=public'),
  JWT_SECRET: z.string().min(16).default('spotflow_development_secret_key_minimum_length_32'),
  SPOTIFY_CLIENT_ID: z.string().optional(),
  SPOTIFY_CLIENT_SECRET: z.string().optional(),
  SPOTIFY_REDIRECT_URI: z.string().url().default('http://127.0.0.1:3001/api/auth/spotify/callback'),
  AI_PROVIDER: z.enum(['gemini', 'openai']).default('gemini'),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  N8N_BASE_URL: z.string().url().default('http://localhost:5678'),
  N8N_WEBHOOK_SECRET: z.string().optional()
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Erro de validação das variáveis de ambiente:', parsedEnv.error.format());
  throw new Error('Configuração de ambiente inválida');
}

export const env = parsedEnv.data;
