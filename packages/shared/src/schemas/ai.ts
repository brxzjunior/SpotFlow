import { z } from 'zod';
import { SpotifyTrackSchema } from './spotify.js';

export const AIIntentTypeSchema = z.enum([
  'create_playlist',
  'organize_library',
  'recommend_tracks',
  'query_insights',
  'unknown'
]);

export type AIIntentType = z.infer<typeof AIIntentTypeSchema>;

export const EnergyPreferenceSchema = z.enum(['low', 'medium', 'high', 'any']);
export type EnergyPreference = z.infer<typeof EnergyPreferenceSchema>;

export const ExplicitContentSchema = z.enum(['allowed', 'prohibited', 'neutral']);
export type ExplicitContent = z.infer<typeof ExplicitContentSchema>;

export const AIParsedIntentSchema = z.object({
  intent: AIIntentTypeSchema,
  summary: z.string().describe('Explicação concisa do que o usuário solicitou'),
  genres: z.array(z.string()).default([]),
  context: z.string().optional().describe('Ex: coding, gaming, gym, relax'),
  mood: z.string().optional().describe('Ex: melancólico, eufórico, focado'),
  energy_preference: EnergyPreferenceSchema.default('any'),
  era: z.enum(['70s', '80s', '90s', '2000s', '2010s', 'modern', 'all']).default('all'),
  duration_minutes: z.number().int().min(10).max(480).default(60),
  target_track_count: z.number().int().min(5).max(100).default(20),
  explicit_content: ExplicitContentSchema.default('allowed'),
  seed_artists: z.array(z.string()).default([]),
  search_queries: z.array(z.string()).min(1).describe('Termos de busca gerados para o catálogo oficial do Spotify'),
  suggested_playlist_name: z.string().min(1).max(100),
  suggested_description: z.string().max(300),
  requires_confirmation: z.literal(true).default(true)
});

export type AIParsedIntent = z.infer<typeof AIParsedIntentSchema>;

export const AIStudioPromptRequestSchema = z.object({
  prompt: z.string().min(3).max(500),
  preferredEnergy: EnergyPreferenceSchema.optional(),
  approximateDurationMinutes: z.number().int().min(10).max(480).optional(),
  allowExplicit: z.boolean().default(true)
});

export type AIStudioPromptRequest = z.infer<typeof AIStudioPromptRequestSchema>;

export const AIPlaylistPreviewSchema = z.object({
  intent: AIParsedIntentSchema,
  suggestedName: z.string(),
  suggestedDescription: z.string(),
  tracks: z.array(SpotifyTrackSchema),
  estimatedDurationMs: z.number().int().nonnegative(),
  isVerified: z.boolean().default(true)
});

export type AIPlaylistPreview = z.infer<typeof AIPlaylistPreviewSchema>;

export const AICopilotMessageRequestSchema = z.object({
  message: z.string().min(1).max(500),
  conversationId: z.string().uuid().optional()
});

export type AICopilotMessageRequest = z.infer<typeof AICopilotMessageRequestSchema>;

export const AICopilotActionSchema = z.object({
  actionType: z.enum(['create_playlist', 'remove_duplicates', 'archive_favorites']),
  title: z.string(),
  description: z.string(),
  payload: z.record(z.unknown()),
  requiresConfirmation: z.literal(true).default(true)
});

export type AICopilotAction = z.infer<typeof AICopilotActionSchema>;

export const AICopilotMessageResponseSchema = z.object({
  replyText: z.string(),
  proposedAction: AICopilotActionSchema.nullable().optional()
});

export type AICopilotMessageResponse = z.infer<typeof AICopilotMessageResponseSchema>;
