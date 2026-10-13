import { z } from 'zod';

export const SpotifyImageSchema = z.object({
  url: z.string().url(),
  height: z.number().nullable().optional(),
  width: z.number().nullable().optional()
});

export type SpotifyImage = z.infer<typeof SpotifyImageSchema>;

export const SpotifyArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  uri: z.string().optional(),
  href: z.string().optional()
});

export type SpotifyArtist = z.infer<typeof SpotifyArtistSchema>;

export const SpotifyAlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(SpotifyImageSchema).default([]),
  releaseDate: z.string().optional(),
  uri: z.string().optional()
});

export type SpotifyAlbum = z.infer<typeof SpotifyAlbumSchema>;

export const SpotifyTrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(SpotifyArtistSchema),
  album: SpotifyAlbumSchema,
  durationMs: z.number().int().nonnegative(),
  explicit: z.boolean().default(false),
  popularity: z.number().int().min(0).max(100).optional(),
  previewUrl: z.string().url().nullable().optional(),
  uri: z.string(),
  externalUrl: z.string().url().optional()
});

export type SpotifyTrack = z.infer<typeof SpotifyTrackSchema>;

export const SpotifyPlaylistSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  images: z.array(SpotifyImageSchema).default([]),
  owner: z.object({
    id: z.string(),
    displayName: z.string().nullable().optional()
  }),
  isPublic: z.boolean().default(false),
  collaborative: z.boolean().default(false),
  snapshotId: z.string().optional(),
  tracksTotal: z.number().int().nonnegative().default(0),
  uri: z.string().optional(),
  externalUrl: z.string().url().optional()
});

export type SpotifyPlaylist = z.infer<typeof SpotifyPlaylistSchema>;

export const SpotifyPlaylistWithTracksSchema = SpotifyPlaylistSchema.extend({
  tracks: z.array(SpotifyTrackSchema).default([])
});

export type SpotifyPlaylistWithTracks = z.infer<typeof SpotifyPlaylistWithTracksSchema>;

export const CreatePlaylistRequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(300).optional(),
  isPublic: z.boolean().default(false),
  trackUris: z.array(z.string().regex(/^spotify:track:[a-zA-Z0-9]+$/)).min(1).max(100)
});

export type CreatePlaylistRequest = z.infer<typeof CreatePlaylistRequestSchema>;
