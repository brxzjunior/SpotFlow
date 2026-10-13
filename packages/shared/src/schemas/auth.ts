import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const SpotifyConnectionStatusSchema = z.object({
  isConnected: z.boolean(),
  spotifyUserId: z.string().nullable().optional(),
  displayName: z.string().nullable().optional(),
  product: z.enum(['premium', 'free', 'open', 'unknown']).default('unknown'),
  scopes: z.array(z.string()).default([]),
  expiresAt: z.string().datetime().nullable().optional(),
  isExpired: z.boolean().default(false)
});

export type SpotifyConnectionStatus = z.infer<typeof SpotifyConnectionStatusSchema>;

export const AuthStateResponseSchema = z.object({
  user: UserProfileSchema.nullable(),
  spotify: SpotifyConnectionStatusSchema
});

export type AuthStateResponse = z.infer<typeof AuthStateResponseSchema>;
