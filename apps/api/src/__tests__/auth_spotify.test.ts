import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Auth & Spotify Integration Endpoints', () => {
  const app = createApp();

  it('deve retornar isConnected: false quando não houver sessão ativa', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeNull();
    expect(res.body.data.spotify.isConnected).toBe(false);
  });

  it('deve bloquear acesso a rotas do Spotify sem autorização com HTTP 401', async () => {
    const res = await request(app).get('/api/spotify/playlists');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('deve criar uma sessão de demonstração via /api/auth/demo e permitir acesso aos dados', async () => {
    // 1. Obter sessão demo
    const demoRes = await request(app).post('/api/auth/demo');
    expect(demoRes.status).toBe(200);
    expect(demoRes.body.success).toBe(true);
    const token = demoRes.body.data.token;
    expect(token).toBeDefined();

    // 2. Verificar /api/auth/me com token
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.spotify.isConnected).toBe(true);
    expect(meRes.body.data.user.email).toBe('recrutador@spotflow.ai');

    // 3. Consultar playlists via /api/spotify/playlists
    const playlistsRes = await request(app)
      .get('/api/spotify/playlists')
      .set('Authorization', `Bearer ${token}`);

    expect(playlistsRes.status).toBe(200);
    expect(playlistsRes.body.success).toBe(true);
    expect(Array.isArray(playlistsRes.body.data)).toBe(true);
    expect(playlistsRes.body.data.length).toBeGreaterThan(0);

    // 4. Buscar faixas via /api/spotify/search
    const searchRes = await request(app)
      .get('/api/spotify/search?q=synthwave')
      .set('Authorization', `Bearer ${token}`);

    expect(searchRes.status).toBe(200);
    expect(searchRes.body.success).toBe(true);
    expect(Array.isArray(searchRes.body.data)).toBe(true);
    expect(searchRes.body.data.length).toBeGreaterThan(0);
    expect(searchRes.body.data[0]).toHaveProperty('uri');
  });
});
