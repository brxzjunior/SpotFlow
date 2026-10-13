import { Router, Request, Response, NextFunction } from 'express';
import { aiService } from '../ai/ai.service.js';
import { playlistsService } from './playlists.service.js';
import { authGuard } from '../../middlewares/authGuard.js';
import {
  ApiResponse,
  AIStudioPromptRequestSchema,
  CreatePlaylistRequestSchema,
  AIParsedIntent,
  AIPlaylistPreview,
  SpotifyPlaylist
} from '@spotflow/shared';

export const studioRouter = Router();

// Todas as rotas do Studio exigem autenticação do usuário
studioRouter.use(authGuard);

studioRouter.post('/interpret', async (req: Request, res: Response<ApiResponse<AIParsedIntent>>, next: NextFunction) => {
  try {
    const validatedBody = AIStudioPromptRequestSchema.parse(req.body);

    const intent = await aiService.interpretPrompt(validatedBody.prompt, {
      preferredEnergy: validatedBody.preferredEnergy,
      approximateDurationMinutes: validatedBody.approximateDurationMinutes,
      allowExplicit: validatedBody.allowExplicit
    });

    res.status(200).json({
      success: true,
      data: intent
    });
  } catch (err) {
    next(err);
  }
});

studioRouter.post('/preview', async (req: Request, res: Response<ApiResponse<AIPlaylistPreview>>, next: NextFunction) => {
  try {
    const validatedBody = AIStudioPromptRequestSchema.parse(req.body);

    // 1. Interpretar prompt com IA
    const intent = await aiService.interpretPrompt(validatedBody.prompt, {
      preferredEnergy: validatedBody.preferredEnergy,
      approximateDurationMinutes: validatedBody.approximateDurationMinutes,
      allowExplicit: validatedBody.allowExplicit
    });

    // 2. Montar prévia com catálogo oficial do Spotify
    const preview = await aiService.generatePreview(intent, req.user!.spotifyAccessToken);

    res.status(200).json({
      success: true,
      data: preview
    });
  } catch (err) {
    next(err);
  }
});

studioRouter.post('/confirm', async (req: Request, res: Response<ApiResponse<SpotifyPlaylist>>, next: NextFunction) => {
  try {
    const validatedBody = CreatePlaylistRequestSchema.parse(req.body);
    const idempotencyKey = req.headers['x-idempotency-key'] ? String(req.headers['x-idempotency-key']) : undefined;

    const playlist = await playlistsService.createPlaylistConfirmed({
      userId: req.user!.userId,
      spotifyAccessToken: req.user!.spotifyAccessToken,
      name: validatedBody.name,
      description: validatedBody.description,
      isPublic: validatedBody.isPublic,
      trackUris: validatedBody.trackUris,
      idempotencyKey
    });

    res.status(201).json({
      success: true,
      data: playlist
    });
  } catch (err) {
    next(err);
  }
});
