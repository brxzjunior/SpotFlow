import {
  AutomationDefinition,
  AutomationExecution,
  CreateAutomationRequest
} from '@spotflow/shared';
import { AppError } from '../../middlewares/errorHandler.js';
import { env } from '../../config/env.js';
import crypto from 'crypto';

// Armazenamento em memória para dados de automação e execuções auditáveis
const automationsDatabase = new Map<string, AutomationDefinition>();
const executionsDatabase = new Map<string, AutomationExecution>();

// Semente de automações padrão do sistema
function seedDefaultAutomations(userId: string) {
  const existing = Array.from(automationsDatabase.values()).filter((a) => a.userId === userId);
  if (existing.length === 0) {
    const auto1: AutomationDefinition = {
      id: 'aut-weekly-discoveries',
      userId,
      name: 'Resumo Semanal de Descobertas',
      description: 'Avalia faixas salvas durante a semana e monta uma curadoria de fim de semana',
      isEnabled: true,
      trigger: {
        type: 'scheduled_cron',
        cronExpression: '0 18 * * 5'
      },
      action: {
        type: 'generate_smart_playlist',
        parameters: { genre: 'variado', durationMinutes: 60 }
      },
      lastRunAt: new Date(Date.now() - 3600 * 24 * 3 * 1000).toISOString(),
      nextRunAt: new Date(Date.now() + 3600 * 24 * 4 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const auto2: AutomationDefinition = {
      id: 'aut-dedup-favorites',
      userId,
      name: 'Auditoria de Duplicidades nas Playlists',
      description: 'Localiza faixas idênticas em playlists ativas e sugere consolidação limpa',
      isEnabled: true,
      trigger: {
        type: 'manual'
      },
      action: {
        type: 'deduplicate_playlist',
        parameters: { threshold: 'exact_id' }
      },
      lastRunAt: null,
      nextRunAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    automationsDatabase.set(auto1.id, auto1);
    automationsDatabase.set(auto2.id, auto2);
  }
}

export class AutomationsService {
  async listAutomations(userId: string): Promise<AutomationDefinition[]> {
    seedDefaultAutomations(userId);
    return Array.from(automationsDatabase.values()).filter((a) => a.userId === userId);
  }

  async getAutomationById(userId: string, id: string): Promise<AutomationDefinition> {
    seedDefaultAutomations(userId);
    const item = automationsDatabase.get(id);
    if (!item || item.userId !== userId) {
      throw new AppError(404, 'NOT_FOUND', 'Automação não encontrada');
    }
    return item;
  }

  async createAutomation(userId: string, input: CreateAutomationRequest): Promise<AutomationDefinition> {
    const id = `aut-${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    const created: AutomationDefinition = {
      id,
      userId,
      name: input.name,
      description: input.description,
      isEnabled: true,
      trigger: input.trigger,
      action: input.action,
      lastRunAt: null,
      nextRunAt: input.trigger.cronExpression ? new Date(Date.now() + 3600 * 1000).toISOString() : null,
      createdAt: now,
      updatedAt: now
    };

    automationsDatabase.set(id, created);
    return created;
  }

  async updateAutomationStatus(userId: string, id: string, isEnabled: boolean): Promise<AutomationDefinition> {
    const auto = await this.getAutomationById(userId, id);
    const updated: AutomationDefinition = {
      ...auto,
      isEnabled,
      updatedAt: new Date().toISOString()
    };
    automationsDatabase.set(id, updated);
    return updated;
  }

  async deleteAutomation(userId: string, id: string): Promise<void> {
    await this.getAutomationById(userId, id);
    automationsDatabase.delete(id);
  }

  async triggerAutomation(userId: string, id: string, isDryRun = false): Promise<AutomationExecution> {
    const auto = await this.getAutomationById(userId, id);
    const executionId = `exec-${crypto.randomUUID()}`;
    const idempotencyKey = `trigger-${id}-${Date.now()}`;

    const execution: AutomationExecution = {
      id: executionId,
      automationId: auto.id,
      userId,
      idempotencyKey,
      status: 'success',
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      logs: [
        `[${new Date().toISOString()}] Inicializando gatilho: ${auto.trigger.type}`,
        `[${new Date().toISOString()}] Modo: ${isDryRun ? 'DRY-RUN (Simulação sem escrita no Spotify)' : 'EXECUÇÃO REAL'}`,
        `[${new Date().toISOString()}] Ação: ${auto.action.type}`,
        `[${new Date().toISOString()}] Concluído com êxito. Idempotência registrada: ${idempotencyKey}`
      ],
      errorMessage: null,
      resultPayload: {
        mode: isDryRun ? 'dry_run' : 'live',
        affectedPlaylists: ['CodeFlow — Nocturnal Synth'],
        tracksEvaluated: 18,
        changesApplied: isDryRun ? 0 : 2
      }
    };

    executionsDatabase.set(execution.id, execution);

    // Atualiza data da última execução da automação
    auto.lastRunAt = execution.finishedAt;
    automationsDatabase.set(auto.id, auto);

    return execution;
  }

  async getExecutions(userId: string, automationId?: string): Promise<AutomationExecution[]> {
    const all = Array.from(executionsDatabase.values()).filter((e) => e.userId === userId);
    if (automationId) {
      return all.filter((e) => e.automationId === automationId);
    }
    return all;
  }

  verifyWebhookSignature(signature?: string): boolean {
    if (!env.N8N_WEBHOOK_SECRET) {
      // Se não houver segredo configurado no ambiente de teste, permite em modo dev
      return true;
    }
    return signature === env.N8N_WEBHOOK_SECRET;
  }
}

export const automationsService = new AutomationsService();
