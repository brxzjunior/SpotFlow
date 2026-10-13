import { describe, it, expect } from 'vitest';
import {
  AIParsedIntentSchema,
  CreatePlaylistRequestSchema,
  AutomationDefinitionSchema
} from '../index.js';

describe('Shared Schemas Validation', () => {
  it('deve validar um objeto AIParsedIntent válido', () => {
    const validIntent = {
      intent: 'create_playlist',
      summary: 'Playlist de synthwave relaxante para programar à noite',
      genres: ['synthwave', 'chillwave'],
      context: 'coding',
      mood: 'focado',
      energy_preference: 'medium',
      era: 'modern',
      duration_minutes: 90,
      target_track_count: 25,
      explicit_content: 'allowed',
      seed_artists: ['Tycho', 'Kavinsky'],
      search_queries: ['synthwave chill', 'coding chillwave'],
      suggested_playlist_name: 'CodeFlow — Nocturnal Synth',
      suggested_description: 'Batidas sintéticas relaxantes para foco profundo.',
      requires_confirmation: true
    };

    const parsed = AIParsedIntentSchema.safeParse(validIntent);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.target_track_count).toBe(25);
      expect(parsed.data.requires_confirmation).toBe(true);
    }
  });

  it('deve rejeitar uma solicitação de criação de playlist sem faixas válidas', () => {
    const invalidPayload = {
      name: 'Minha Playlist',
      isPublic: false,
      trackUris: ['uri-invalida-sem-formato-spotify']
    };

    const parsed = CreatePlaylistRequestSchema.safeParse(invalidPayload);
    expect(parsed.success).toBe(false);
  });

  it('deve validar uma definição de automação completa', () => {
    const validAutomation = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      userId: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Resumo Semanal de Descobertas',
      description: 'Gera playlist toda sexta com base nas músicas curtidas da semana',
      isEnabled: true,
      trigger: {
        type: 'scheduled_cron',
        cronExpression: '0 18 * * 5'
      },
      action: {
        type: 'generate_smart_playlist',
        parameters: { genre: 'electronic' }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const parsed = AutomationDefinitionSchema.safeParse(validAutomation);
    expect(parsed.success).toBe(true);
  });
});
