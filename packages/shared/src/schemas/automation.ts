import { z } from 'zod';

export const AutomationTriggerTypeSchema = z.enum([
  'scheduled_cron',
  'webhook',
  'manual'
]);

export type AutomationTriggerType = z.infer<typeof AutomationTriggerTypeSchema>;

export const AutomationActionTypeSchema = z.enum([
  'generate_smart_playlist',
  'deduplicate_playlist',
  'archive_liked_tracks',
  'n8n_custom_workflow'
]);

export type AutomationActionType = z.infer<typeof AutomationActionTypeSchema>;

export const AutomationTriggerConfigSchema = z.object({
  type: AutomationTriggerTypeSchema,
  cronExpression: z.string().optional(), // ex: "0 18 * * 5" (sexta às 18h)
  webhookPath: z.string().optional()
});

export type AutomationTriggerConfig = z.infer<typeof AutomationTriggerConfigSchema>;

export const AutomationActionConfigSchema = z.object({
  type: AutomationActionTypeSchema,
  targetPlaylistId: z.string().optional(),
  promptTemplate: z.string().optional(),
  n8nWorkflowId: z.string().optional(),
  parameters: z.record(z.unknown()).default({})
});

export type AutomationActionConfig = z.infer<typeof AutomationActionConfigSchema>;

export const AutomationDefinitionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(300).optional(),
  isEnabled: z.boolean().default(true),
  trigger: AutomationTriggerConfigSchema,
  action: AutomationActionConfigSchema,
  lastRunAt: z.string().datetime().nullable().optional(),
  nextRunAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type AutomationDefinition = z.infer<typeof AutomationDefinitionSchema>;

export const ExecutionStatusSchema = z.enum([
  'pending',
  'running',
  'success',
  'failed',
  'cancelled'
]);

export type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>;

export const AutomationExecutionSchema = z.object({
  id: z.string().uuid(),
  automationId: z.string().uuid(),
  userId: z.string().uuid(),
  idempotencyKey: z.string(),
  status: ExecutionStatusSchema,
  startedAt: z.string().datetime(),
  finishedAt: z.string().datetime().nullable().optional(),
  logs: z.array(z.string()).default([]),
  errorMessage: z.string().nullable().optional(),
  resultPayload: z.record(z.unknown()).nullable().optional()
});

export type AutomationExecution = z.infer<typeof AutomationExecutionSchema>;

export const CreateAutomationRequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(300).optional(),
  trigger: AutomationTriggerConfigSchema,
  action: AutomationActionConfigSchema
});

export type CreateAutomationRequest = z.infer<typeof CreateAutomationRequestSchema>;
