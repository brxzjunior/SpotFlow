import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Listening Insights Endpoints', () => {
  const app = createApp();
  let token: string;

  it('deve autenticar sessão de demonstração', async () => {
    const demoRes = await request(app).post('/api/auth/demo');
    expect(demoRes.status).toBe(200);
    token = demoRes.body.data.token;
  });

  it('deve retornar métricas agregadas da biblioteca via /api/insights/summary', async () => {
    const res = await request(app)
      .get('/api/insights/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalPlaylists).toBeGreaterThan(0);
    expect(res.body.data.periodReference).toBeDefined();
    expect(res.body.data.lastUpdatedAt).toBeDefined();
    expect(Array.isArray(res.body.data.topGenres)).toBe(true);
  });

  it('deve retornar auditoria de duplicidades via /api/insights/duplicates', async () => {
    const res = await request(app)
      .get('/api/insights/duplicates')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.duplicatesFound)).toBe(true);
  });
});
