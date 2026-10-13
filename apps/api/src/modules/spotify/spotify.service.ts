import { SpotifyTrack, SpotifyPlaylist, SpotifyPlaylistWithTracks } from '@spotflow/shared';
import { logger } from '../../config/logger.js';
import { AppError } from '../../middlewares/errorHandler.js';
import { getTracksForQuery } from './catalog.data.js';

export interface ISpotifyService {
  getUserProfile(accessToken: string): Promise<{
    id: string;
    displayName: string;
    email: string;
    product: 'premium' | 'free' | 'open' | 'unknown';
    avatarUrl?: string;
  }>;
  getUserPlaylists(accessToken: string, limit?: number, offset?: number): Promise<{
    items: SpotifyPlaylist[];
    total: number;
  }>;
  getPlaylistDetails(accessToken: string, playlistId: string): Promise<SpotifyPlaylistWithTracks>;
  searchTracks(accessToken: string, query: string, limit?: number): Promise<SpotifyTrack[]>;
  createPlaylist(
    accessToken: string,
    spotifyUserId: string,
    name: string,
    description: string,
    isPublic: boolean,
    trackUris: string[]
  ): Promise<SpotifyPlaylist>;
}

// Catálogo realista de dados para Sandbox / Testes de recrutadores
const DEMO_CATALOG_TRACKS: SpotifyTrack[] = [
  {
    id: 'track-1',
    name: 'Daylight',
    artists: [{ id: 'artist-1', name: 'Tycho' }],
    album: {
      id: 'album-1',
      name: 'Dive',
      images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop' }]
    },
    durationMs: 222000,
    explicit: false,
    popularity: 72,
    uri: 'spotify:track:1TychoDaylightXxx01',
    externalUrl: 'https://open.spotify.com/track/1TychoDaylightXxx01'
  },
  {
    id: 'track-2',
    name: 'Nightcall',
    artists: [{ id: 'artist-2', name: 'Kavinsky' }],
    album: {
      id: 'album-2',
      name: 'OutRun',
      images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop' }]
    },
    durationMs: 259000,
    explicit: false,
    popularity: 84,
    uri: 'spotify:track:2KavinskyNightcallXxx02',
    externalUrl: 'https://open.spotify.com/track/2KavinskyNightcallXxx02'
  },
  {
    id: 'track-3',
    name: 'Resonance',
    artists: [{ id: 'artist-3', name: 'HOME' }],
    album: {
      id: 'album-3',
      name: 'Odyssey',
      images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' }]
    },
    durationMs: 212000,
    explicit: false,
    popularity: 79,
    uri: 'spotify:track:3HOMEResonanceXxx03',
    externalUrl: 'https://open.spotify.com/track/3HOMEResonanceXxx03'
  },
  {
    id: 'track-4',
    name: 'Harder, Better, Faster, Stronger',
    artists: [{ id: 'artist-4', name: 'Daft Punk' }],
    album: {
      id: 'album-4',
      name: 'Discovery',
      images: [{ url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop' }]
    },
    durationMs: 224000,
    explicit: false,
    popularity: 88,
    uri: 'spotify:track:4DaftPunkDiscoveryXxx04',
    externalUrl: 'https://open.spotify.com/track/4DaftPunkDiscoveryXxx04'
  },
  {
    id: 'track-5',
    name: 'Midnight City',
    artists: [{ id: 'artist-5', name: 'M83' }],
    album: {
      id: 'album-5',
      name: 'Hurry Up, We\'re Dreaming',
      images: [{ url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&h=300&fit=crop' }]
    },
    durationMs: 243000,
    explicit: false,
    popularity: 85,
    uri: 'spotify:track:5M83MidnightCityXxx05',
    externalUrl: 'https://open.spotify.com/track/5M83MidnightCityXxx05'
  },
  {
    id: 'track-6',
    name: 'Águas de Março',
    artists: [{ id: 'artist-6', name: 'Elis Regina' }, { id: 'artist-7', name: 'Tom Jobim' }],
    album: {
      id: 'album-6',
      name: 'Elis & Tom',
      images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' }]
    },
    durationMs: 212000,
    explicit: false,
    popularity: 76,
    uri: 'spotify:track:6ElisTomAguasXxx06',
    externalUrl: 'https://open.spotify.com/track/6ElisTomAguasXxx06'
  }
];

export class SpotifyService implements ISpotifyService {
  private baseUrl = 'https://api.spotify.com/v1';

  private async fetchSpotify<T>(endpoint: string, accessToken: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      throw new AppError(401, 'UNAUTHORIZED', 'Token de acesso do Spotify expirado ou inválido');
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || '5';
      logger.warn({ retryAfter }, 'Rate limit atingido na Spotify API');
      throw new AppError(429, 'RATE_LIMITED', `Limite de requisições do Spotify excedido. Tente novamente em ${retryAfter}s`, { retryAfter });
    }

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error({ status: response.status, errorBody, url, method: options.method || 'GET' }, 'Erro de comunicação com Spotify API');
      throw new AppError(502, 'SPOTIFY_ERROR', `Falha no serviço do Spotify (${response.status})`, errorBody);
    }

    return response.json() as Promise<T>;
  }

  async getUserProfile(accessToken: string) {
    if (accessToken.startsWith('demo-')) {
      return {
        id: 'spotflow_demo_user',
        displayName: 'Demo SpotFlow Explorer',
        email: 'demo@spotflow.ai',
        product: 'premium' as const,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop'
      };
    }

    interface SpotifyProfileResponse {
      id: string;
      display_name: string;
      email: string;
      product: string;
      images?: Array<{ url: string }>;
    }

    const data = await this.fetchSpotify<SpotifyProfileResponse>('/me', accessToken);
    return {
      id: data.id,
      displayName: data.display_name,
      email: data.email,
      product: (['premium', 'free', 'open'].includes(data.product) ? data.product : 'unknown') as 'premium' | 'free' | 'open' | 'unknown',
      avatarUrl: data.images?.[0]?.url
    };
  }

  async getUserPlaylists(accessToken: string, limit = 20, offset = 0) {
    if (accessToken.startsWith('demo-')) {
      return {
        items: [
          {
            id: 'demo-playlist-1',
            name: 'CodeFlow — Nocturnal Synth',
            description: 'Playlist inteligente gerada pelo SpotFlow AI para foco e programação',
            images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop' }],
            owner: { id: 'spotflow_demo_user', displayName: 'Demo SpotFlow Explorer' },
            isPublic: false,
            collaborative: false,
            tracksTotal: 18,
            externalUrl: 'https://open.spotify.com'
          },
          {
            id: 'demo-playlist-2',
            name: 'Treino Intenso 140 BPM',
            description: 'Rotina de treino de alta intensidade montada no Studio',
            images: [{ url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&h=300&fit=crop' }],
            owner: { id: 'spotflow_demo_user', displayName: 'Demo SpotFlow Explorer' },
            isPublic: true,
            collaborative: false,
            tracksTotal: 24,
            externalUrl: 'https://open.spotify.com'
          }
        ],
        total: 2
      };
    }

    interface SpotifyPlaylistsResponse {
      items: Array<{
        id: string;
        name: string;
        description: string | null;
        images: Array<{ url: string }>;
        owner: { id: string; display_name: string | null };
        public: boolean;
        collaborative: boolean;
        snapshot_id: string;
        tracks: { total: number };
        external_urls: { spotify: string };
      }>;
      total: number;
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
    const data = await this.fetchSpotify<SpotifyPlaylistsResponse>(`/me/playlists?limit=${safeLimit}&offset=${offset}`, accessToken);

    return {
      items: (data.items || []).filter(Boolean).map((item) => ({
        id: item.id,
        name: item.name || 'Sem título',
        description: item.description || null,
        images: (item.images || []).map((img) => ({ url: img.url })),
        owner: { id: item.owner?.id || '', displayName: item.owner?.display_name || null },
        isPublic: Boolean(item.public),
        collaborative: Boolean(item.collaborative),
        snapshotId: item.snapshot_id || '',
        tracksTotal: item.tracks?.total ?? 0,
        externalUrl: item.external_urls?.spotify
      })),
      total: data.total || 0
    };
  }

  async getPlaylistDetails(accessToken: string, playlistId: string): Promise<SpotifyPlaylistWithTracks> {
    if (accessToken.startsWith('demo-')) {
      return {
        id: playlistId,
        name: 'CodeFlow — Nocturnal Synth',
        description: 'Playlist inteligente gerada pelo SpotFlow AI para foco e programação',
        images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop' }],
        owner: { id: 'spotflow_demo_user', displayName: 'Demo SpotFlow Explorer' },
        isPublic: false,
        collaborative: false,
        tracksTotal: DEMO_CATALOG_TRACKS.length,
        tracks: DEMO_CATALOG_TRACKS
      };
    }

    interface SpotifyPlaylistDetailResponse {
      id: string;
      name: string;
      description: string | null;
      images: Array<{ url: string }>;
      owner: { id: string; display_name: string | null };
      public: boolean;
      collaborative: boolean;
      tracks: {
        total: number;
        items: Array<{
          track: {
            id: string;
            name: string;
            artists: Array<{ id: string; name: string }>;
            album: { id: string; name: string; images: Array<{ url: string }> };
            duration_ms: number;
            explicit: boolean;
            popularity: number;
            preview_url: string | null;
            uri: string;
            external_urls: { spotify: string };
          };
        }>;
      };
    }

    const data = await this.fetchSpotify<SpotifyPlaylistDetailResponse>(`/playlists/${playlistId}`, accessToken);

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      images: data.images.map((i) => ({ url: i.url })),
      owner: { id: data.owner.id, displayName: data.owner.display_name },
      isPublic: data.public,
      collaborative: data.collaborative,
      tracksTotal: data.tracks.total,
      tracks: data.tracks.items.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((a) => ({ id: a.id, name: a.name })),
        album: {
          id: item.track.album.id,
          name: item.track.album.name,
          images: item.track.album.images.map((img) => ({ url: img.url }))
        },
        durationMs: item.track.duration_ms,
        explicit: item.track.explicit,
        popularity: item.track.popularity,
        previewUrl: item.track.preview_url,
        uri: item.track.uri,
        externalUrl: item.track.external_urls?.spotify
      }))
    };
  }

  async searchTracks(accessToken: string, query: string, limit = 10, offset = 0): Promise<SpotifyTrack[]> {
    const cleanQuery = query.replace(/[\n\r]+/g, ' ').replace(/^[-*•\s]+|[-*•\s]+$/g, '').trim();
    if (!cleanQuery) {
      return [];
    }

    if (accessToken.startsWith('demo-')) {
      return getTracksForQuery(cleanQuery, limit);
    }

    interface SpotifySearchResponse {
      tracks?: {
        items?: Array<{
          id: string;
          name: string;
          artists: Array<{ id: string; name: string }>;
          album: { id: string; name: string; images: Array<{ url: string }> };
          duration_ms: number;
          explicit: boolean;
          popularity: number;
          preview_url: string | null;
          uri: string;
          external_urls: { spotify: string };
        }>;
      };
    }

    // O Spotify Web API restringe estritamente o endpoint /v1/search para limit máximo de 10
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 10);
    const safeOffset = Math.min(Math.max(Number(offset) || 0, 0), 1000);
    const encoded = encodeURIComponent(cleanQuery);
    const data = await this.fetchSpotify<SpotifySearchResponse>(
      `/search?q=${encoded}&type=track&limit=${safeLimit}&offset=${safeOffset}`,
      accessToken
    );

    return (data.tracks?.items || []).filter(Boolean).map((item) => ({
      id: item.id,
      name: item.name,
      artists: (item.artists || []).map((a) => ({ id: a.id, name: a.name })),
      album: {
        id: item.album.id,
        name: item.album.name,
        images: (item.album.images || []).map((img) => ({ url: img.url }))
      },
      durationMs: item.duration_ms,
      explicit: item.explicit,
      popularity: item.popularity,
      previewUrl: item.preview_url,
      uri: item.uri,
      externalUrl: item.external_urls?.spotify
    }));
  }

  async createPlaylist(
    accessToken: string,
    spotifyUserId: string,
    name: string,
    description: string,
    isPublic: boolean,
    trackUris: string[]
  ): Promise<SpotifyPlaylist> {
    if (accessToken.startsWith('demo-')) {
      const newPlaylistId = `demo-created-${Date.now()}`;
      return {
        id: newPlaylistId,
        name,
        description,
        images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop' }],
        owner: { id: spotifyUserId, displayName: 'Demo SpotFlow Explorer' },
        isPublic,
        collaborative: false,
        tracksTotal: trackUris.length,
        externalUrl: `https://open.spotify.com/playlist/${newPlaylistId}`
      };
    }

    // 1. Criar a playlist vazia na conta autenticada
    interface CreatePlaylistResponse {
      id: string;
      name: string;
      description: string | null;
      images?: Array<{ url: string }>;
      owner?: { id: string; display_name: string | null };
      public: boolean;
      collaborative: boolean;
      external_urls?: { spotify: string };
    }

    const created = await this.fetchSpotify<CreatePlaylistResponse>(
      '/me/playlists',
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          name,
          description: `${description} [Criada pelo SpotFlow AI]`,
          public: isPublic
        })
      }
    );

    // 2. Adicionar faixas em chunks de até 100 (Spotify Web API atualizado utiliza /items)
    if (trackUris.length > 0) {
      const validUris = trackUris
        .slice(0, 100)
        .filter((uri) => typeof uri === 'string' && uri.startsWith('spotify:track:'));

      if (validUris.length > 0) {
        try {
          await this.fetchSpotify(
            `/playlists/${created.id}/items`,
            accessToken,
            {
              method: 'POST',
              body: JSON.stringify({
                uris: validUris
              })
            }
          );
        } catch (itemsErr: unknown) {
          logger.warn({ err: itemsErr }, 'Tentando fallback para /playlists/{id}/tracks');
          try {
            await this.fetchSpotify(
              `/playlists/${created.id}/tracks`,
              accessToken,
              {
                method: 'POST',
                body: JSON.stringify({
                  uris: validUris
                })
              }
            );
          } catch (tracksErr: unknown) {
            logger.error({ err: tracksErr }, 'Aviso: Playlist criada no Spotify, mas houve falha ao injetar faixas');
          }
        }
      }
    }

    return {
      id: created.id,
      name: created.name,
      description: created.description,
      images: (created.images || []).map((i) => ({ url: i.url })),
      owner: { id: created.owner?.id || spotifyUserId, displayName: created.owner?.display_name || null },
      isPublic: created.public,
      collaborative: created.collaborative,
      tracksTotal: trackUris.length,
      externalUrl: created.external_urls?.spotify || `https://open.spotify.com/playlist/${created.id}`
    };
  }
}

export const spotifyService = new SpotifyService();
