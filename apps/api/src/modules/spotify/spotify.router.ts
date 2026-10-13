import { Router, Request, Response, NextFunction } from 'express';
import { spotifyService } from './spotify.service.js';
import { authGuard } from '../../middlewares/authGuard.js';
import { ApiResponse, SpotifyPlaylist, SpotifyPlaylistWithTracks, SpotifyTrack } from '@spotflow/shared';

export const spotifyRouter = Router();

// Todas as rotas de Spotify exigem autenticação do usuário
spotifyRouter.use(authGuard);

spotifyRouter.get('/status', (req: Request, res: Response<ApiResponse<{ isConnected: boolean; spotifyUserId: string }>>) => {
  res.status(200).json({
    success: true,
    data: {
      isConnected: true,
      spotifyUserId: req.user!.userId
    }
  });
});

spotifyRouter.get('/playlists', async (req: Request, res: Response<ApiResponse<SpotifyPlaylist[]>>, next: NextFunction) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const result = await spotifyService.getUserPlaylists(req.user!.spotifyAccessToken, limit, offset);

    res.status(200).json({
      success: true,
      data: result.items,
      meta: {
        total: result.total,
        page: Math.floor(offset / limit) + 1,
        limit
      }
    });
  } catch (err) {
    next(err);
  }
});

spotifyRouter.get('/playlists/:id', async (req: Request, res: Response<ApiResponse<SpotifyPlaylistWithTracks>>, next: NextFunction) => {
  try {
    const playlistId = req.params.id!;
    const playlist = await spotifyService.getPlaylistDetails(req.user!.spotifyAccessToken, playlistId);

    res.status(200).json({
      success: true,
      data: playlist
    });
  } catch (err) {
    next(err);
  }
});

spotifyRouter.get('/search', async (req: Request, res: Response<ApiResponse<SpotifyTrack[]>>, next: NextFunction) => {
  try {
    const query = String(req.query.q || '');
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 10);

    if (!query.trim()) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    const tracks = await spotifyService.searchTracks(req.user!.spotifyAccessToken, query, limit);

    res.status(200).json({
      success: true,
      data: tracks
    });
  } catch (err) {
    next(err);
  }
});
