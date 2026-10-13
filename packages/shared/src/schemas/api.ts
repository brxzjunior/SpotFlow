import { z } from 'zod';

export const ApiErrorCodeSchema = z.enum([
  'BAD_REQUEST',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'UNPROCESSABLE_ENTITY',
  'RATE_LIMITED',
  'SPOTIFY_ERROR',
  'AI_PROVIDER_ERROR',
  'AUTOMATION_ERROR',
  'INTERNAL_ERROR'
]);

export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>;

export const ApiErrorSchema = z.object({
  code: ApiErrorCodeSchema,
  message: z.string(),
  details: z.unknown().optional()
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const PaginationMetaSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  total: z.number().int().nonnegative().optional(),
  hasMore: z.boolean().optional()
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional()
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export function createSuccessResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: PaginationMetaSchema.optional()
  });
}

export function createErrorResponseSchema() {
  return z.object({
    success: z.literal(false),
    error: ApiErrorSchema
  });
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}
