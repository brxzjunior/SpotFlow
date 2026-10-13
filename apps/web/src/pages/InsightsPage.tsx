import React, { useEffect, useState } from 'react';
import { BarChart2, Info, Disc, Clock, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { api, getStoredToken } from '../services/api';

interface InsightsData {
  periodReference: string;
  lastUpdatedAt: string;
  totalPlaylists: number;
  totalTracks: number;
  estimatedHours: number;
  potentialDuplicatesCount: number;
  topGenres: Array<{ genre: string; percentage: number }>;
  acousticProfile: {
    energyDistribution: string;
    explicitTracksPercentage: number;
  };
}

export const InsightsPage: React.FC = () => {
  const [data, setData] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        if (!getStoredToken()) {
          await api.loginDemo();
        }
        const summary = await api.getInsightsSummary();
        setData(summary);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart2 className="w-7 h-7 text-indigo-400" />
          <span>Listening Insights</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Métricas calculadas exclusivamente com base nos dados autorizados da sua biblioteca e histórico real.
        </p>
      </div>

      {/* Info Notice com data e origem */}
      <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate-300 leading-relaxed">
              O SpotFlow AI respeita os dados autorizados pela API do Spotify. Métricas de reprodução e afinidade são calculadas conforme os escopos permitidos.
            </p>
            {data && (
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Referência: {data.periodReference} • Atualizado em:{' '}
                {new Date(data.lastUpdatedAt).toLocaleTimeString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-flowgreen-400 animate-spin" />
        </div>
      ) : data ? (
        <div className="space-y-6 animate-fade-in">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Playlists Salvas</span>
                <Disc className="w-4 h-4 text-flowgreen-400" />
              </div>
              <span className="text-3xl font-extrabold text-white">{data.totalPlaylists}</span>
              <span className="block text-[11px] text-slate-500 mt-1">No catálogo autorizado</span>
            </div>

            <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Total de Músicas</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-3xl font-extrabold text-white">{data.totalTracks}</span>
              <span className="block text-[11px] text-slate-500 mt-1">Faixas indexadas</span>
            </div>

            <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Tempo de Reprodução</span>
                <Clock className="w-4 h-4 text-teal-400" />
              </div>
              <span className="text-3xl font-extrabold text-white">{data.estimatedHours}h</span>
              <span className="block text-[11px] text-slate-500 mt-1">Estimativa de acervo</span>
            </div>

            <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Duplicidades</span>
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-3xl font-extrabold text-white">{data.potentialDuplicatesCount}</span>
              <span className="block text-[11px] text-slate-500 mt-1">Faixas passíveis de dedup</span>
            </div>
          </div>

          {/* Top Genres Breakdown */}
          <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
            <h3 className="text-base font-bold text-white">Distribuição Temática & Gêneros Frequentes</h3>
            <div className="space-y-3">
              {data.topGenres.map((g, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{g.genre}</span>
                    <span className="text-slate-400 font-mono">{g.percentage}%</span>
                  </div>
                  <div className="w-full bg-charcoal-950 h-2 rounded-full overflow-hidden border border-charcoal-800">
                    <div
                      className="bg-gradient-to-r from-flowgreen-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${g.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-charcoal-900 border border-charcoal-800 text-center">
          <p className="text-sm text-slate-400">Nenhum dado analítico disponível.</p>
        </div>
      )}
    </div>
  );
};
