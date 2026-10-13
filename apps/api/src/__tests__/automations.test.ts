import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Automations and n8n Integration Endpoints', () => {
  const app = createApp();
  let token: string;

  it('deve obter token de demonstração', async () => {
    const demoRes = await request(app).post('/api/auth/demo');
    expect(demoRes.status).toBe(200);
    token = demoRes.body.data.token;
  });

  it('deve listar as automações do usuário via /api/automations', async () => {
    const res = await request(app)
      .get('/api/automations')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('deve executar uma automação em modo Dry-Run via /api/automations/:id/trigger', async () => {
    const listRes = await request(app)
      .get('/api/automations')
      .set('Authorization', `Bearer ${token}`);

    const targetId = listRes.body.data[0].id;

    const triggerRes = await request(app)
      .post(`/api/automations/${targetId}/trigger`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isDryRun: true });

    expect(triggerRes.status).toBe(200);
    expect(triggerRes.body.success).toBe(true);
    expect(triggerRes.body.data.status).toBe('success');
    expect(triggerRes.body.data.resultPayload.mode).toBe('dry_run');
    expect(triggerRes.body.data.idempotencyKey).toBeDefined();
    expect(Array.isArray(triggerRes.body.data.logs)).toBe(true);
  });

  it('deve criar uma nova automação personalizada via /api/automations', async () => {
    const newAuto = {
      name: 'Curadoria Mensal de Clássicos',
      description: 'Gera playlist no primeiro dia de cada mês',
      trigger: {
        type: 'scheduled_cron',
        cronExpression: '0 0 1 * *'
      },
      action: {
        type: 'generate_smart_playlist',
        parameters: { era: '80s' }
      }
    };

    const res = await request(app)
      .post('/api/automations')
      .set('Authorization', `Bearer ${token}`)
      .send(newAuto);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(newAuto.name);
    expect(res.body.data.trigger.cronExpression).toBe('0 0 1 * *');
  });

  it('deve processar webhook recebido via /api/automations/webhook', async () => {
    const webhookRes = await request(app)
      .post('/api/automations/webhook')
      .set('x-spotflow-signature', process.env.N8N_WEBHOOK_SECRET || 'segredo_compartilhado_para_validar_assinatura_de_webhooks')
      .send({
        event: 'execution_completed',
        execution_id: 'n8n_test_123'
      });

    expect(webhookRes.status).toBe(200);
    expect(webhookRes.body.success).toBe(true);
    expect(webhookRes.body.data.received).toBe(true);
  });

});
