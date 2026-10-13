import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Music, Workflow, AlertCircle, ArrowUpRight, CheckCircle2, Play, Disc } from 'lucide-react';
import { api, getStoredToken } from '../services/api';
import { SpotifyPlaylist } from '@spotflow/shared';

export const OverviewPage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);

  useEffect(() => {
    const checkState = async () => {
      try {
        if (!getStoredToken()) {
          await api.loginDemo();
        }
        const auth = await api.getAuthStatus();
        setIsConnected(auth.spotify?.isConnected || false);

        const list = await api.getPlaylists(5);
        setPlaylists(list);
      } catch {
        // Fallback
      }
    };

    checkState();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Painel de Controle
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Visão geral da sua integração musical, automações ativas e rotinas inteligentes.
        </p>
      </div>

      {/* Spotify Connection Notice Card */}
      <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isConnected
                ? 'bg-flowgreen-500/10 text-flowgreen-400'
                : 'bg-amber-500/10 text-amber-400'
            }`}
          >
            {isConnected ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              {isConnected ? 'Spotify Conectado com Sucesso' : 'Integração com Spotify Pendente'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isConnected
                ? `${playlists.length} playlists disponíveis para leitura, auditoria e curadoria assistida por IA.`
                : 'Conecte sua conta do Spotify ou ative o modo demonstração para carregar sua biblioteca.'}
            </p>
          </div>
        </div>
        <Link
          to="/app/settings"
          className="inline-flex items-center justify-center gap-1.5 bg-flowgreen-500 hover:bg-flowgreen-400 text-charcoal-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shrink-0"
        >
          {isConnected ? 'Ver Conexão' : 'Configurar Conexão'} <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/app/studio"
          className="group p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-flowgreen-500/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-flowgreen-500/10 text-flowgreen-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-flowgreen-400 transition-colors">
              AI Playlist Studio
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Crie seleções temáticas em segundos com interpretação de linguagem natural e prévia auditável.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs text-flowgreen-400 font-semibold gap-1">
            <span>Iniciar Curadoria</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/app/library"
          className="group p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Music className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              Music Organizer
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Consulte suas playlists autorizadas, filtre por gênero e detecte duplicidades com segurança.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs text-emerald-400 font-semibold gap-1">
            <span>Explorar Biblioteca</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/app/automations"
          className="group p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-teal-500/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">
              Automation Center
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Gerencie workflows orquestrados no n8n para manter suas faixas organizadas automaticamente.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs text-teal-400 font-semibold gap-1">
            <span>Ver Automações</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Recent Playlists Preview */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Playlists na sua Biblioteca</h2>
          <Link to="/app/library" className="text-xs text-flowgreen-400 hover:underline">
            Ver todas →
          </Link>
        </div>

        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="p-3.5 rounded-xl bg-charcoal-950 border border-charcoal-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-charcoal-800 flex items-center justify-center text-slate-400">
                    <Disc className="w-5 h-5 text-flowgreen-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{pl.name}</h4>
                    <p className="text-[11px] text-slate-400">{pl.tracksTotal} faixas</p>
                  </div>
                </div>
                <Link
                  to="/app/library"
                  className="text-xs text-slate-400 hover:text-white p-1"
                >
                  <Play className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-slate-400">Nenhuma playlist sincronizada ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
};
