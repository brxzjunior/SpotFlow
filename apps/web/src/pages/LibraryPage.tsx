import React, { useEffect, useState } from 'react';
import { Music, Search, Disc, Loader2, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api, getStoredToken } from '../services/api';
import { SpotifyPlaylist, SpotifyPlaylistWithTracks } from '@spotflow/shared';
import { TrackCard } from '../components/TrackCard';

export const LibraryPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Playlist Selecionada para Inspeção de Faixas
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylistWithTracks | null>(null);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true);
      try {
        if (!getStoredToken()) {
          await api.loginDemo();
        }
        const list = await api.getPlaylists();
        setPlaylists(list);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handleSelectPlaylist = async (playlistId: string) => {
    setIsLoadingTracks(true);
    setAuditFeedback(null);
    try {
      const details = await api.getPlaylistDetails(playlistId);
      setSelectedPlaylist(details);
    } catch {
      // Fallback
    } finally {
      setIsLoadingTracks(false);
    }
  };

  const handleAuditDuplicates = () => {
    if (!selectedPlaylist) return;
    const seen = new Set<string>();
    let duplicatesCount = 0;
    for (const t of selectedPlaylist.tracks) {
      if (seen.has(t.id)) duplicatesCount++;
      else seen.add(t.id);
    }

    if (duplicatesCount === 0) {
      setAuditFeedback('Auditoria concluída: nenhuma faixa duplicada detectada nesta playlist!');
    } else {
      setAuditFeedback(`Auditoria concluída: ${duplicatesCount} faixas duplicadas encontradas.`);
    }
  };

  const filteredPlaylists = playlists.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Music className="w-7 h-7 text-emerald-400" />
          <span>Music Organizer</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore suas playlists autorizadas no Spotify, audite faixas e aplique regras de organização.
        </p>
      </div>

      {/* Playlist Inspector View */}
      {selectedPlaylist ? (
        isLoadingTracks ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
          <button
            type="button"
            onClick={() => setSelectedPlaylist(null)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para todas as playlists</span>
          </button>

          {/* Header of selected playlist */}
          <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Playlist Selecionada
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1">
                {selectedPlaylist.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedPlaylist.description || 'Sem descrição cadastrada'} • {selectedPlaylist.tracks.length} faixas
              </p>
            </div>

            <button
              type="button"
              onClick={handleAuditDuplicates}
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-charcoal-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Auditar Duplicidades</span>
            </button>
          </div>

          {auditFeedback && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{auditFeedback}</span>
            </div>
          )}

          {/* Tracks list */}
          <div className="space-y-2">
            {selectedPlaylist.tracks.map((track, idx) => (
              <TrackCard key={track.id} track={track} index={idx} />
            ))}
          </div>
        </div>
      )) : (
        <>
          {/* Filter / Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar nas suas playlists autorizadas..."
              className="w-full bg-charcoal-900 border border-charcoal-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Playlists Grid */}
          {isLoading ? (
            <div className="p-16 flex justify-center">
              <Loader2 className="w-8 h-8 text-flowgreen-400 animate-spin" />
            </div>
          ) : filteredPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaylists.map((pl) => {
                const cover = pl.images?.[0]?.url;
                return (
                  <div
                    key={pl.id}
                    onClick={() => handleSelectPlaylist(pl.id)}
                    className="group cursor-pointer p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-charcoal-800 shrink-0 shadow">
                        {cover ? (
                          <img src={cover} alt={pl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Disc className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                          {pl.name}
                        </h3>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {pl.tracksTotal} faixas
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold self-end">
                      Ver faixas & Organizar →
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-charcoal-900 border border-charcoal-800 text-center">
              <p className="text-sm text-slate-400">Nenhuma playlist encontrada com o termo pesquisado.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
