import { spotifyService } from '../spotify/spotify.service.js';
import { SpotifyPlaylist } from '@spotflow/shared';
import { logger } from '../../config/logger.js';

export interface CreatePlaylistInput {
  userId: string;
  spotifyAccessToken: string;
  name: string;
  description?: string;
  isPublic?: boolean;
  trackUris: string[];
  idempotencyKey?: string;
}

// Cache de idempotência em memória para prevenir duplicações de gravação
const idempotencyCache = new Map<string, SpotifyPlaylist>();

export class PlaylistsService {
  async createPlaylistConfirmed(input: CreatePlaylistInput): Promise<SpotifyPlaylist> {
    const { userId, spotifyAccessToken, name, description, isPublic, trackUris, idempotencyKey } = input;

    // Verificação de Idempotência
    if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
      logger.info({ idempotencyKey }, 'Retornando playlist já gravada anteriormente (Idempotência)');
      return idempotencyCache.get(idempotencyKey)!;
    }

    const playlist = await spotifyService.createPlaylist(
      spotifyAccessToken,
      userId,
      name,
      description || 'Playlist curada pelo SpotFlow AI',
      isPublic ?? false,
      trackUris
    );

    if (idempotencyKey) {
      idempotencyCache.set(idempotencyKey, playlist);
    }

    return playlist;
  }
}

export const playlistsService = new PlaylistsService();
