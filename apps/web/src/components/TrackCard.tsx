import React, { useState, useRef } from 'react';
import { SpotifyTrack } from '@spotflow/shared';
import { Play, Pause, Trash2, ExternalLink, Music2 } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';

interface TrackCardProps {
  track: SpotifyTrack;
  index?: number;
  onRemove?: (trackId: string) => void;
  showRemoveButton?: boolean;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  index,
  onRemove,
  showRemoveButton = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlayPreview = () => {
    if (!track.previewUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(track.previewUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const albumImage = track.album?.images?.[0]?.url;
  const artistsNames = track.artists?.map((a) => a.name).join(', ') || 'Artista Desconhecido';

  return (
    <div className="group flex items-center justify-between p-3 rounded-xl bg-charcoal-900 hover:bg-charcoal-850 border border-charcoal-800 hover:border-charcoal-700 transition-all duration-200">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Index number */}
        {index !== undefined && (
          <span className="text-xs font-semibold text-slate-500 w-5 text-right shrink-0">
            {index + 1}
          </span>
        )}

        {/* Album Artwork with Play Overlay */}
        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-charcoal-800 shrink-0 shadow-inner group/cover">
          {albumImage ? (
            <img
              src={albumImage}
              alt={track.album?.name || track.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <Music2 className="w-5 h-5" />
            </div>
          )}

          {track.previewUrl && (
            <button
              type="button"
              onClick={togglePlayPreview}
              className="absolute inset-0 bg-charcoal-950/70 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity"
              title={isPlaying ? 'Pausar prévia' : 'Ouvir prévia'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-flowgreen-400 fill-current" />
              ) : (
                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
              )}
            </button>
          )}
        </div>

        {/* Track Metadata */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white truncate group-hover:text-flowgreen-400 transition-colors">
              {track.name}
            </h4>
            {track.explicit && (
              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-charcoal-800 text-slate-400 border border-charcoal-700 shrink-0">
                E
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {artistsNames}
            {track.album?.name && (
              <span className="text-slate-500"> • {track.album.name}</span>
            )}
          </p>
        </div>
      </div>

      {/* Trailing Controls */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        {isPlaying && <AudioWaveform isPlaying={true} />}

        <span className="text-xs font-mono text-slate-500">
          {formatDuration(track.durationMs)}
        </span>

        {track.externalUrl && (
          <a
            href={track.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-charcoal-800 transition-colors"
            title="Abrir no Spotify"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {showRemoveButton && onRemove && (
          <button
            type="button"
            onClick={() => onRemove(track.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Remover faixa da prévia"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
