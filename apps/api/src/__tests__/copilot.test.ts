import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Music Copilot Endpoints', () => {
  const app = createApp();
  let token: string;

  it('deve autenticar sessão de demonstração', async () => {
    const demoRes = await request(app).post('/api/auth/demo');
    expect(demoRes.status).toBe(200);
    token = demoRes.body.data.token;
  });

  it('deve interpretar intenção e retornar ação proposta com confirmação obrigatória', async () => {
    const res = await request(app)
      .post('/api/copilot/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Crie uma playlist de synthwave para programar' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.replyText).toBeDefined();
    expect(res.body.data.proposedAction).toBeDefined();
    expect(res.body.data.proposedAction.requiresConfirmation).toBe(true);
    expect(res.body.data.proposedAction.actionType).toBe('create_playlist');
  });

  it('deve executar uma ação proposta aprovada via /api/copilot/execute-action', async () => {
    const actionPayload = {
      action: {
        actionType: 'create_playlist',
        title: 'Criar Playlist Teste Copilot',
        description: 'Descrição aprovada pelo usuário',
        payload: {
          name: 'Copilot Approved Playlist',
          description: 'Aprovada no chat',
          isPublic: false,
          trackUris: ['spotify:track:1TychoDaylightXxx01']
        },
        requiresConfirmation: true
      }
    };

    const res = await request(app)
      .post('/api/copilot/execute-action')
      .set('Authorization', `Bearer ${token}`)
      .send(actionPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.success).toBe(true);
  });
});
