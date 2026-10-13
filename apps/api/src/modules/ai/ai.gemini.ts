import { IAIEngineProvider } from './ai.interface.js';
import { AIParsedIntent, AIParsedIntentSchema } from '@spotflow/shared';
import { deterministicAIProvider } from './ai.deterministic.js';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

export class GeminiAIProvider implements IAIEngineProvider {
  name = 'gemini_generative_engine';

  async parsePrompt(
    prompt: string,
    options?: {
      preferredEnergy?: 'low' | 'medium' | 'high' | 'any';
      approximateDurationMinutes?: number;
      allowExplicit?: boolean;
    }
  ): Promise<AIParsedIntent> {
    if (!env.GEMINI_API_KEY) {
      logger.info('Chave GEMINI_API_KEY não configurada. Utilizando mecanismo heurístico determinístico');
      return deterministicAIProvider.parsePrompt(prompt, options);
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

      const systemPrompt = `Você é o orquestrador musical do SpotFlow AI. Sua função é analisar o pedido do usuário e retornar EXCLUSIVAMENTE um objeto JSON estritamente compatível com a estrutura especificada.
Estrutura JSON obrigatória:
{
  "intent": "create_playlist",
  "summary": string,
  "genres": string[],
  "context": string,
  "mood": string,
  "energy_preference": "low" | "medium" | "high" | "any",
  "era": "70s" | "80s" | "90s" | "2000s" | "2010s" | "modern" | "all",
  "duration_minutes": number,
  "target_track_count": number,
  "explicit_content": "allowed" | "prohibited" | "neutral",
  "seed_artists": string[],
  "search_queries": string[],
  "suggested_playlist_name": string,
  "suggested_description": string,
  "requires_confirmation": true
}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nPedido do usuário: "${prompt}"\nPreferências: ${JSON.stringify(options || {})}` }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        logger.warn({ status: response.status }, 'Falha na resposta da API Gemini. Ativando fallback determinístico');
        return deterministicAIProvider.parsePrompt(prompt, options);
      }

      interface GeminiApiResponse {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      }

      const data = (await response.json()) as GeminiApiResponse;
      const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!jsonText) {
        return deterministicAIProvider.parsePrompt(prompt, options);
      }

      const parsedJson = JSON.parse(jsonText);
      return AIParsedIntentSchema.parse(parsedJson);
    } catch (err) {
      logger.error({ err }, 'Erro ao consultar provedor Gemini. Ativando fallback determinístico');
      return deterministicAIProvider.parsePrompt(prompt, options);
    }
  }
}

export const geminiAIProvider = new GeminiAIProvider();
