import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Sliders,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Flame,
  ArrowRight
} from 'lucide-react';
import { api, getStoredToken } from '../services/api';
import { AIPlaylistPreview, SpotifyTrack } from '@spotflow/shared';
import { TrackCard } from '../components/TrackCard';
import { StagingConfirmationModal } from '../components/StagingConfirmationModal';

export const StudioPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [energy, setEnergy] = useState<'low' | 'medium' | 'high' | 'any'>('medium');
  const [allowExplicit, setAllowExplicit] = useState(true);

  // Estados de Operação
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [preview, setPreview] = useState<AIPlaylistPreview | null>(null);
  const [previewTracks, setPreviewTracks] = useState<SpotifyTrack[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados do Modal de Confirmação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPlaylistUrl, setCreatedPlaylistUrl] = useState<string | null>(null);
  const [createdPlaylistName, setCreatedPlaylistName] = useState<string | null>(null);

  const quickPrompts = [
    'Sessão de Synthwave retrô para 2 horas de programação à noite',
    'Treino intenso de academia com hip-hop dos anos 2000 em ritmo acelerado',
    'Domingo à tarde acústico com Bossa Nova e MPB relaxante'
  ];

  const handleGeneratePreview = async () => {
    if (!prompt.trim()) return;

    setErrorMsg(null);
    setIsLoadingPreview(true);
    setCreatedPlaylistUrl(null);

    try {
      // Se não houver token armazenado, inicializa a sessão de demonstração transparente
      if (!getStoredToken()) {
        await api.loginDemo();
      }

      const res = await api.generateStudioPreview({
        prompt,
        preferredEnergy: energy,
        allowExplicit
      });

      setPreview(res);
      setPreviewTracks(res.tracks);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao gerar prévia da playlist';
      setErrorMsg(msg);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleRemoveTrack = (trackId: string) => {
    setPreviewTracks((prev) => prev.filter((t) => t.id !== trackId));
  };

  const handleConfirmCreation = async (payload: { name: string; description: string; isPublic: boolean }) => {
    if (previewTracks.length === 0) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const idempotencyKey = crypto.randomUUID();
      const created = await api.confirmCreatePlaylist(
        {
          name: payload.name,
          description: payload.description,
          isPublic: payload.isPublic,
          trackUris: previewTracks.map((t) => t.uri)
        },
        idempotencyKey
      );

      setIsModalOpen(false);
      setCreatedPlaylistUrl(created.externalUrl || null);
      setCreatedPlaylistName(created.name);
      setPreview(null);
      setPreviewTracks([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar playlist no Spotify';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalDurationMs = previewTracks.reduce((acc, t) => acc + t.durationMs, 0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-flowgreen-400" />
          <span>AI Playlist Studio</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Descreva em linguagem natural o que deseja ouvir. A IA infere parâmetros de energia, era e gênero para montar uma seleção auditável no Spotify.
        </p>
      </div>

      {/* Success Notification Banner */}
      {createdPlaylistUrl && (
        <div className="p-5 rounded-2xl bg-flowgreen-500/10 border border-flowgreen-500/40 flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-flowgreen-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">Playlist Criada com Sucesso no Spotify!</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                "{createdPlaylistName}" já está disponível na sua conta oficial.
              </p>
            </div>
          </div>
          <a
            href={createdPlaylistUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-flowgreen-500 hover:bg-flowgreen-400 text-charcoal-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shrink-0"
          >
            <span>Abrir no Spotify</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Prompt Form */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="prompt" className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Descreva sua playlist desejada
            </label>
            <span className="text-[11px] text-slate-500">Linguagem natural</span>
          </div>
          <textarea
            id="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Uma sessão de synthwave retrô com ritmo constante e sem vocais, ideal para 2 horas de programação à noite..."
            className="w-full bg-charcoal-950 border border-charcoal-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-flowgreen-500 focus:ring-1 focus:ring-flowgreen-500 transition-colors"
          />

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 mt-3">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(qp)}
                className="text-[11px] bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700/70 text-slate-400 hover:text-slate-200 px-3 py-1 rounded-lg transition-colors text-left"
              >
                + {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Fine Tuning Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-charcoal-800">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Nível de Energia Musical</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['any', 'low', 'medium', 'high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setEnergy(lvl)}
                  className={`py-2 text-xs font-semibold rounded-lg capitalize border transition-all ${
                    energy === lvl
                      ? 'bg-flowgreen-500/10 text-flowgreen-400 border-flowgreen-500/50'
                      : 'bg-charcoal-850 text-slate-400 border-charcoal-700 hover:text-slate-200'
                  }`}
                >
                  {lvl === 'any' ? 'Qualquer' : lvl === 'low' ? 'Baixa' : lvl === 'medium' ? 'Média' : 'Alta'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end sm:gap-4 self-center pt-4 sm:pt-0">
            <span className="text-xs font-medium text-slate-400">Conteúdo Explícito</span>
            <button
              type="button"
              onClick={() => setAllowExplicit(!allowExplicit)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                allowExplicit
                  ? 'bg-charcoal-800 text-slate-200 border-charcoal-700'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {allowExplicit ? 'Permitido' : 'Filtrado (Clean)'}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-charcoal-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-flowgreen-400" />
            <span>Nenhuma música será gravada sem sua confirmação prévia</span>
          </div>
          <button
            type="button"
            disabled={!prompt.trim() || isLoadingPreview}
            onClick={handleGeneratePreview}
            className="inline-flex items-center gap-2 bg-flowgreen-500 hover:bg-flowgreen-400 disabled:opacity-50 disabled:cursor-not-allowed text-charcoal-950 font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md shadow-flowgreen-500/10"
          >
            {isLoadingPreview ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Interpretando & Buscando Faixas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Interpretar & Gerar Prévia</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Staged Preview Section */}
      {preview && previewTracks.length > 0 && (
        <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-5 animate-fade-in">
          {/* Header of Staged Playlist */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-flowgreen-400">
                  Prévia Verificada
                </span>
                <span className="text-[10px] bg-charcoal-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                  {previewTracks.length} faixas
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {preview.suggestedName}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                {preview.suggestedDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-flowgreen-500 hover:bg-flowgreen-400 text-charcoal-950 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-flowgreen-500/20 shrink-0 self-start sm:self-auto"
            >
              <span>Aprovar & Criar Playlist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Track List */}
          <div className="space-y-2">
            {previewTracks.map((track, idx) => (
              <TrackCard
                key={track.id}
                track={track}
                index={idx}
                showRemoveButton={true}
                onRemove={handleRemoveTrack}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State when no preview */}
      {!preview && !createdPlaylistUrl && (
        <div className="p-12 rounded-2xl bg-charcoal-900 border border-charcoal-800 text-center">
          <div className="w-12 h-12 rounded-2xl bg-charcoal-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Flame className="w-6 h-6 text-flowgreen-400" />
          </div>
          <h3 className="text-base font-bold text-white">Nenhuma prévia ativa no momento</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Preencha o campo de texto acima e clique em "Interpretar & Gerar Prévia" para visualizar a lista de faixas reais selecionadas antes de criá-la.
          </p>
        </div>
      )}

      {/* Modal de Confirmação */}
      {preview && (
        <StagingConfirmationModal
          isOpen={isModalOpen}
          playlistName={preview.suggestedName}
          description={preview.suggestedDescription}
          trackCount={previewTracks.length}
          totalDurationMs={totalDurationMs}
          isSubmitting={isSubmitting}
          onConfirm={handleConfirmCreation}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
