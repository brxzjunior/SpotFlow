import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('AI Playlist Studio Endpoints', () => {
  const app = createApp();
  let token: string;

  it('deve obter token de demonstração', async () => {
    const demoRes = await request(app).post('/api/auth/demo');
    expect(demoRes.status).toBe(200);
    token = demoRes.body.data.token;
    expect(token).toBeDefined();
  });

  it('deve interpretar prompt com IA via /api/studio/interpret', async () => {
    const res = await request(app)
      .post('/api/studio/interpret')
      .set('Authorization', `Bearer ${token}`)
      .send({
        prompt: 'Uma seleção de synthwave para programar durante a noite',
        preferredEnergy: 'medium',
        allowExplicit: true
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.intent).toBe('create_playlist');
    expect(res.body.data.requires_confirmation).toBe(true);
    expect(Array.isArray(res.body.data.search_queries)).toBe(true);
  });

  it('deve gerar prévia estruturada de playlist com faixas oficiais via /api/studio/preview', async () => {
    const res = await request(app)
      .post('/api/studio/preview')
      .set('Authorization', `Bearer ${token}`)
      .send({
        prompt: 'Synthwave relaxante para programar',
        preferredEnergy: 'medium'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.suggestedName).toBeDefined();
    expect(Array.isArray(res.body.data.tracks)).toBe(true);
    expect(res.body.data.tracks.length).toBeGreaterThan(0);
    expect(res.body.data.estimatedDurationMs).toBeGreaterThan(0);
    expect(res.body.data.isVerified).toBe(true);
  });

  it('deve confirmar e criar playlist no Spotify com garantia de idempotência via /api/studio/confirm', async () => {
    const idempotencyKey = 'test-idempotency-key-' + Date.now();
    const payload = {
      name: 'SpotFlow Test Playlist',
      description: 'Criada via teste automatizado',
      isPublic: false,
      trackUris: ['spotify:track:1TychoDaylightXxx01', 'spotify:track:2KavinskyNightcallXxx02']
    };

    // 1. Primeira chamada de criação
    const res1 = await request(app)
      .post('/api/studio/confirm')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Idempotency-Key', idempotencyKey)
      .send(payload);

    expect(res1.status).toBe(201);
    expect(res1.body.success).toBe(true);
    expect(res1.body.data.name).toBe(payload.name);
    const createdId = res1.body.data.id;

    // 2. Segunda chamada idêntica com a mesma idempotency key deve retornar a mesma playlist sem duplicar
    const res2 = await request(app)
      .post('/api/studio/confirm')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Idempotency-Key', idempotencyKey)
      .send(payload);

    expect(res2.status).toBe(201);
    expect(res2.body.data.id).toBe(createdId);
  });
});
