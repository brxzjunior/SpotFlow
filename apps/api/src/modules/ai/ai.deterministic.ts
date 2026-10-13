import { IAIEngineProvider } from './ai.interface.js';
import { AIParsedIntent, AIParsedIntentSchema } from '@spotflow/shared';

export class DeterministicAIProvider implements IAIEngineProvider {
  name = 'deterministic_heuristic_engine';

  async parsePrompt(
    prompt: string,
    options?: {
      preferredEnergy?: 'low' | 'medium' | 'high' | 'any';
      approximateDurationMinutes?: number;
      allowExplicit?: boolean;
    }
  ): Promise<AIParsedIntent> {
    const text = prompt.toLowerCase();

    // 1. Detecção de Gêneros
    const genres: string[] = [];
    const genreMap: Record<string, string[]> = {
      synthwave: ['synthwave', 'retrowave', 'chillwave'],
      eletrônica: ['eletrônica', 'electronic', 'edm', 'house', 'techno'],
      lofi: ['lofi', 'lo-fi', 'chillhop'],
      rock: ['rock', 'indie', 'metal', 'punk', 'guitarra'],
      'hip-hop': ['hip-hop', 'hip hop', 'rap', 'trap'],
      funk: ['funk', 'baile', 'favela', '150bpm'],
      pagode: ['pagode', 'samba', 'churrasco'],
      sertanejo: ['sertanejo', 'modão', 'sofrência'],
      mpb: ['mpb', 'bossa nova', 'bossa', 'brasileira', 'acústico'],
      pop: ['pop', 'dance pop', 'hits'],
      jazz: ['jazz', 'blues', 'soul'],
      clássica: ['clássica', 'classical', 'orquestral'],
      anime: ['anime', 'j-pop', 'j-rock', 'jpop']
    };

    for (const [canonical, keywords] of Object.entries(genreMap)) {
      if (keywords.some((k) => text.includes(k))) {
        genres.push(canonical);
      }
    }

    if (genres.length === 0) {
      genres.push('variado');
    }

    // 2. Detecção de Contexto
    let context = 'dia a dia';
    if (text.includes('programar') || text.includes('código') || text.includes('coding') || text.includes('foco')) {
      context = 'coding / foco profundo';
    } else if (text.includes('treino') || text.includes('academia') || text.includes('musculação') || text.includes('gym')) {
      context = 'treino / fitness';
    } else if (text.includes('dormir') || text.includes('relax') || text.includes('descanso') || text.includes('domingo')) {
      context = 'relaxamento';
    } else if (text.includes('festa') || text.includes('balada') || text.includes('comemoração')) {
      context = 'festa';
    }

    // 3. Nível de Energia
    let energy: 'low' | 'medium' | 'high' | 'any' = options?.preferredEnergy || 'any';
    if (energy === 'any') {
      if (text.includes('alta') || text.includes('pesado') || text.includes('agitado') || text.includes('rápido')) {
        energy = 'high';
      } else if (text.includes('calmo') || text.includes('suave') || text.includes('relaxante') || text.includes('lento')) {
        energy = 'low';
      } else {
        energy = 'medium';
      }
    }

    // 4. Era Musical
    let era: '70s' | '80s' | '90s' | '2000s' | '2010s' | 'modern' | 'all' = 'all';
    if (text.includes('80') || text.includes('oitenta')) era = '80s';
    else if (text.includes('90') || text.includes('noventa')) era = '90s';
    else if (text.includes('2000') || text.includes('anos 2000')) era = '2000s';
    else if (text.includes('moderno') || text.includes('atual') || text.includes('recente')) era = 'modern';

    const cleanedPrompt = prompt
      .replace(/^playlist\s+(de\s+|do\s+|da\s+)?/i, '')
      .replace(/[\n\r]+/g, ' ')
      .replace(/^[-*•\s]+|[-*•\s]+$/g, '')
      .trim();

    // 5. Search queries para o catálogo oficial do Spotify
    const searchQueries: string[] = [];
    if (cleanedPrompt) {
      searchQueries.push(cleanedPrompt.slice(0, 40));
    }
    if (genres[0] && genres[0] !== 'variado') {
      searchQueries.push(`${genres[0]}`);
      if (context !== 'dia a dia') {
        searchQueries.push(`${genres[0]} ${context}`.trim());
      }
    }
    if (searchQueries.length === 0) {
      searchQueries.push('top hits');
    }

    // 6. Geração do Nome e Descrição da Playlist
    const displayName = cleanedPrompt ? cleanedPrompt.slice(0, 25).toUpperCase() : (genres[0] ? genres[0].toUpperCase() : 'FLOW');
    const suggestedPlaylistName = `SpotFlow — ${displayName}`;
    const suggestedDescription = `Curadoria musical gerada pelo SpotFlow AI. Tema: ${cleanedPrompt || genres.join(', ')} • Contexto: ${context} • Energia: ${energy}.`;

    const rawResult = {
      intent: 'create_playlist' as const,
      summary: `Solicitação interpretada: seleção musical temática para ${context} baseada em ${genres.join(', ')}.`,
      genres,
      context,
      mood: energy === 'high' ? 'eufórico' : energy === 'low' ? 'contemplativo' : 'focado',
      energy_preference: energy,
      era,
      duration_minutes: options?.approximateDurationMinutes || 60,
      target_track_count: 20,
      explicit_content: options?.allowExplicit ? ('allowed' as const) : ('prohibited' as const),
      seed_artists: [],
      search_queries: searchQueries,
      suggested_playlist_name: suggestedPlaylistName,
      suggested_description: suggestedDescription,
      requires_confirmation: true as const
    };

    return AIParsedIntentSchema.parse(rawResult);
  }
}

export const deterministicAIProvider = new DeterministicAIProvider();
