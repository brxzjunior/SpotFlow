import { IAIEngineProvider } from './ai.interface.js';
import { geminiAIProvider } from './ai.gemini.js';
import { deterministicAIProvider } from './ai.deterministic.js';
import { spotifyService } from '../spotify/spotify.service.js';
import {
  AIParsedIntent,
  AIPlaylistPreview,
  AIPlaylistPreviewSchema,
  SpotifyTrack
} from '@spotflow/shared';
import { env } from '../../config/env.js';

export class AIService {
  private provider: IAIEngineProvider;

  constructor() {
    this.provider = env.AI_PROVIDER === 'gemini' ? geminiAIProvider : deterministicAIProvider;
  }

  async interpretPrompt(
    prompt: string,
    options?: {
      preferredEnergy?: 'low' | 'medium' | 'high' | 'any';
      approximateDurationMinutes?: number;
      allowExplicit?: boolean;
    }
  ): Promise<AIParsedIntent> {
    return this.provider.parsePrompt(prompt, options);
  }

  async generatePreview(intent: AIParsedIntent, accessToken: string): Promise<AIPlaylistPreview> {
    // Coleta faixas reais através das search queries geradas pela IA
    const candidateTracks: SpotifyTrack[] = [];
    const seenUris = new Set<string>();

    for (const query of intent.search_queries) {
      const cleanQ = query.replace(/[\n\r]+/g, ' ').replace(/^[-*•\s]+|[-*•\s]+$/g, '').trim();
      if (!cleanQ) continue;

      // Página 1 (Spotify search restringe limit máximo a 10)
      const resultsPage1 = await spotifyService.searchTracks(accessToken, cleanQ, 10, 0);
      for (const track of resultsPage1) {
        if (!seenUris.has(track.uri)) {
          seenUris.add(track.uri);
          candidateTracks.push(track);
        }
        if (candidateTracks.length >= intent.target_track_count) break;
      }

      // Se ainda precisamos de faixas e essa query tiver mais resultados, busca página 2
      if (candidateTracks.length < intent.target_track_count && resultsPage1.length >= 10) {
        const resultsPage2 = await spotifyService.searchTracks(accessToken, cleanQ, 10, 10);
        for (const track of resultsPage2) {
          if (!seenUris.has(track.uri)) {
            seenUris.add(track.uri);
            candidateTracks.push(track);
          }
          if (candidateTracks.length >= intent.target_track_count) break;
        }
      }

      if (candidateTracks.length >= intent.target_track_count) break;
    }

    // Filtrar explícito se o intent proibir
    const finalTracks =
      intent.explicit_content === 'prohibited'
        ? candidateTracks.filter((t) => !t.explicit)
        : candidateTracks;

    const estimatedDurationMs = finalTracks.reduce((acc, t) => acc + t.durationMs, 0);

    const rawPreview = {
      intent,
      suggestedName: intent.suggested_playlist_name,
      suggestedDescription: intent.suggested_description,
      tracks: finalTracks,
      estimatedDurationMs,
      isVerified: true
    };

    return AIPlaylistPreviewSchema.parse(rawPreview);
  }
}

export const aiService = new AIService();
