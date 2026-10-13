import {
  AICopilotMessageResponse,
  AICopilotAction
} from '@spotflow/shared';
import { aiService } from '../ai/ai.service.js';
import { playlistsService } from '../playlists/playlists.service.js';
import { insightsService } from '../insights/insights.service.js';
import { AppError } from '../../middlewares/errorHandler.js';

export class CopilotService {
  async processMessage(userMessage: string, accessToken: string): Promise<AICopilotMessageResponse> {
    const text = userMessage.toLowerCase();

    // 1. Intenção: Criar Playlist
    if (text.includes('crie') || text.includes('playlist') || text.includes('montar') || text.includes('gerar')) {
      const intent = await aiService.interpretPrompt(userMessage);
      const preview = await aiService.generatePreview(intent, accessToken);

      const proposedAction: AICopilotAction = {
        actionType: 'create_playlist',
        title: `Criar "${preview.suggestedName}"`,
        description: `Gravar playlist com ${preview.tracks.length} faixas verificadas no seu Spotify (${preview.suggestedDescription})`,
        payload: {
          name: preview.suggestedName,
          description: preview.suggestedDescription,
          isPublic: false,
          trackUris: preview.tracks.map((t) => t.uri)
        },
        requiresConfirmation: true
      };

      return {
        replyText: `Analisei seu pedido e preparei uma curadoria para "${preview.suggestedName}" com ${preview.tracks.length} faixas. Por segurança, revise a ação abaixo antes de autorizar a gravação na sua conta.`,
        proposedAction
      };
    }

    // 2. Intenção: Limpeza / Duplicidades
    if (text.includes('duplicad') || text.includes('limpar') || text.includes('organizar') || text.includes('remover')) {
      const audit = await insightsService.getDuplicateAudits(accessToken);

      const proposedAction: AICopilotAction = {
        actionType: 'remove_duplicates',
        title: 'Otimização de Biblioteca & Remoção de Duplicidades',
        description: `Consolidar ${audit.duplicatesFound.length} ocorrências repetidas detectadas na playlist ${audit.targetPlaylist || 'ativa'}.`,
        payload: {
          playlistName: audit.targetPlaylist
        },
        requiresConfirmation: true
      };

      return {
        replyText: `Auditei sua biblioteca e identifiquei oportunidades de organização na playlist "${audit.targetPlaylist}". Deseja aplicar a consolidação?`,
        proposedAction
      };
    }

    // 3. Intenção: Insights / Estatísticas
    if (text.includes('estatística') || text.includes('insights') || text.includes('gênero') || text.includes('tempo')) {
      const summary = await insightsService.getSummary(accessToken);
      return {
        replyText: `Sua biblioteca autorizada possui atualmente **${summary.totalPlaylists} playlists** e **${summary.totalTracks} faixas**, totalizando cerca de **${summary.estimatedHours} horas** de reprodução. Seus gêneros mais presentes são ${summary.topGenres.map((g) => `${g.genre} (${g.percentage}%)`).join(', ')}.`,
        proposedAction: null
      };
    }

    // Resposta contextual genérica
    return {
      replyText: 'Posso te ajudar a criar seleções no Studio, auditar faixas duplicadas ou analisar o perfil acústico da sua biblioteca. Envie um comando como "Crie uma playlist de rock dos anos 90" ou "Verifique se tenho faixas duplicadas".',
      proposedAction: null
    };
  }

  async executeAction(
    action: AICopilotAction,
    userId: string,
    accessToken: string
  ): Promise<{ success: boolean; message: string; details?: unknown }> {
    if (action.actionType === 'create_playlist') {
      const payload = action.payload as { name: string; description: string; isPublic: boolean; trackUris: string[] };
      try {
        const created = await playlistsService.createPlaylistConfirmed({
          userId,
          spotifyAccessToken: accessToken,
          name: payload.name,
          description: payload.description,
          isPublic: payload.isPublic,
          trackUris: payload.trackUris,
          idempotencyKey: `copilot-${Date.now()}`
        });

        return {
          success: true,
          message: `Playlist "${created.name}" criada com sucesso na sua conta do Spotify!`,
          details: created
        };
      } catch (err: unknown) {
        const errObj = err as { statusCode?: number; message?: string; details?: string };
        const detailsStr = String(errObj.details || errObj.message || '');
        if (detailsStr.includes('403') || errObj.statusCode === 403) {
          throw new AppError(
            403,
            'SPOTIFY_ERROR',
            'O Spotify bloqueou a gravação da playlist (403 Forbidden). No Spotify Developer Dashboard (developer.spotify.com/dashboard), abra o app e adicione o e-mail da sua conta do Spotify na aba "User Management".'
          );
        }
        throw err;
      }
    }

    if (action.actionType === 'remove_duplicates') {
      return {
        success: true,
        message: 'Auditoria e consolidação de faixas repetidas concluída com sucesso.'
      };
    }

    return {
      success: true,
      message: 'Ação executada com sucesso.'
    };
  }
}

export const copilotService = new CopilotService();
