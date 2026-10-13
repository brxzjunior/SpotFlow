import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { env } from '../../config/env.js';
import { spotifyService } from '../spotify/spotify.service.js';
import { AppError } from '../../middlewares/errorHandler.js';
import { logger } from '../../config/logger.js';

export interface AuthSession {
  userId: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  spotifyAccessToken: string;
  scopes?: string;
}

// Armazenamento em memória para estados e sessões durante o ciclo de vida
const stateStore = new Map<string, { createdAt: number }>();
export const sessionStore = new Map<string, AuthSession>();

export class AuthService {
  private clientId = env.SPOTIFY_CLIENT_ID || '';
  private clientSecret = env.SPOTIFY_CLIENT_SECRET || '';
  
  getRedirectUri(): string {
    const raw = process.env.SPOTIFY_REDIRECT_URI || env.SPOTIFY_REDIRECT_URI;
    if (raw && raw.includes('localhost:3001')) {
      return raw.replace('localhost:3001', '127.0.0.1:3001');
    }
    return raw || 'http://127.0.0.1:3001/api/auth/spotify/callback';
  }

  private scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-read'
  ].join(' ');

  isConfigured(): boolean {
    return Boolean(
      this.clientId &&
      this.clientSecret &&
      this.clientId.length >= 20 &&
      this.clientSecret.length >= 20 &&
      !this.clientId.includes('placeholder') &&
      !this.clientId.includes('seu_spotify_client_id')
    );
  }

  getRawClientId(): string {
    return this.clientId;
  }

  updateCredentials(clientId: string, clientSecret: string): void {
    this.clientId = clientId.trim();
    this.clientSecret = clientSecret.trim();

    // Salvar ou atualizar arquivo .env na raiz do projeto
    try {
      const rootEnvPath = path.resolve(process.cwd(), '../../.env');
      let currentContent = '';
      if (fs.existsSync(rootEnvPath)) {
        currentContent = fs.readFileSync(rootEnvPath, 'utf8');
      } else {
        const examplePath = path.resolve(process.cwd(), '../../.env.example');
        if (fs.existsSync(examplePath)) {
          currentContent = fs.readFileSync(examplePath, 'utf8');
        }
      }

      // Substitui ou anexa SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET
      if (currentContent.includes('SPOTIFY_CLIENT_ID=')) {
        currentContent = currentContent.replace(/SPOTIFY_CLIENT_ID=.*/g, `SPOTIFY_CLIENT_ID=${this.clientId}`);
      } else {
        currentContent += `\nSPOTIFY_CLIENT_ID=${this.clientId}`;
      }

      if (currentContent.includes('SPOTIFY_CLIENT_SECRET=')) {
        currentContent = currentContent.replace(/SPOTIFY_CLIENT_SECRET=.*/g, `SPOTIFY_CLIENT_SECRET=${this.clientSecret}`);
      } else {
        currentContent += `\nSPOTIFY_CLIENT_SECRET=${this.clientSecret}`;
      }

      fs.writeFileSync(rootEnvPath, currentContent, 'utf8');
    } catch {
      // Ignora erro de escrita de arquivo caso permissão seja restrita
    }
  }

  getClientId(): string | null {
    return this.isConfigured() ? this.clientId : null;
  }

  generateAuthorizationUrl(): { url: string; state: string } {
    if (!this.isConfigured()) {
      throw new AppError(
        400,
        'BAD_REQUEST',
        'As credenciais SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET não estão configuradas'
      );
    }

    const state = crypto.randomBytes(16).toString('hex');
    stateStore.set(state, { createdAt: Date.now() });

    // Limpeza de states com mais de 10 minutos
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    for (const [st, data] of stateStore.entries()) {
      if (data.createdAt < tenMinutesAgo) stateStore.delete(st);
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scopes,
      redirect_uri: this.getRedirectUri(),
      show_dialog: 'true',
      state
    });

    return {
      url: `https://accounts.spotify.com/authorize?${params.toString()}`,
      state
    };
  }

  async handleCallback(code: string, state: string): Promise<{ sessionToken: string; user: AuthSession }> {
    if (!stateStore.has(state)) {
      throw new AppError(400, 'BAD_REQUEST', 'Parâmetro state inválido ou expirado (CSRF Protection)');
    }
    stateStore.delete(state);

    if (!this.isConfigured()) {
      throw new AppError(
        500,
        'SPOTIFY_ERROR',
        'Credenciais SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET não configuradas no servidor'
      );
    }

    // Troca de código por tokens
    const bodyParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.getRedirectUri()
    });

    const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyParams.toString()
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new AppError(401, 'UNAUTHORIZED', 'Falha ao autenticar código com o Spotify', errorText);
    }

    interface SpotifyTokenPayload {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      scope: string;
    }

    const tokenData = (await tokenResponse.json()) as SpotifyTokenPayload;
    logger.info({ grantedScopes: tokenData.scope }, 'Spotify OAuth Scopes Concedidos com Sucesso');

    // Buscar perfil do usuário no Spotify
    const profile = await spotifyService.getUserProfile(tokenData.access_token);

    const sessionToken = crypto.randomUUID();
    const userSession: AuthSession = {
      userId: profile.id,
      email: profile.email,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      spotifyAccessToken: tokenData.access_token,
      scopes: tokenData.scope
    };

    sessionStore.set(sessionToken, userSession);

    return { sessionToken, user: userSession };
  }

  createDemoSession(): { sessionToken: string; user: AuthSession } {
    const sessionToken = 'demo-session-token-' + crypto.randomUUID();
    const userSession: AuthSession = {
      userId: 'spotflow_demo_user',
      email: 'recrutador@spotflow.ai',
      displayName: 'Avaliador SpotFlow (Demo)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
      spotifyAccessToken: 'demo-access-token-spotflow-valid'
    };

    sessionStore.set(sessionToken, userSession);
    return { sessionToken, user: userSession };
  }

  getSession(sessionToken: string): AuthSession | null {
    return sessionStore.get(sessionToken) || null;
  }

  invalidateSession(sessionToken: string): void {
    sessionStore.delete(sessionToken);
  }
}

export const authService = new AuthService();
