import React, { useState } from 'react';
import { ShieldCheck, Music2, Globe, Lock, AlertTriangle, Loader2 } from 'lucide-react';

interface StagingConfirmationModalProps {
  isOpen: boolean;
  playlistName: string;
  description: string;
  trackCount: number;
  totalDurationMs: number;
  isPublicDefault?: boolean;
  isSubmitting?: boolean;
  onConfirm: (payload: { name: string; description: string; isPublic: boolean }) => void;
  onCancel: () => void;
}

export const StagingConfirmationModal: React.FC<StagingConfirmationModalProps> = ({
  isOpen,
  playlistName,
  description,
  trackCount,
  totalDurationMs,
  isPublicDefault = false,
  isSubmitting = false,
  onConfirm,
  onCancel,
}) => {
  const [name, setName] = useState(playlistName);
  const [desc, setDesc] = useState(description);
  const [isPublic, setIsPublic] = useState(isPublicDefault);

  if (!isOpen) return null;

  const formatTotalTime = (ms: number): string => {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes} minutos`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-charcoal-950/50 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-flowgreen-500/10 text-flowgreen-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-flowgreen-400">
              Etapa de Confirmação Obrigatória
            </span>
            <h3 className="text-xl font-extrabold text-white">Criar Playlist no Spotify</h3>
            <p className="text-xs text-slate-400 mt-1">
              Revise os metadados abaixo antes de autorizar a gravação direta na sua conta oficial.
            </p>
          </div>
        </div>

        {/* Playlist Summary Pills */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-charcoal-950 border border-charcoal-800 text-xs">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300 font-medium">
              <strong className="text-white">{trackCount}</strong> faixas verificadas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-flowgreen-400"></span>
            <span className="text-slate-300 font-medium">
              Duração: <strong className="text-white">{formatTotalTime(totalDurationMs)}</strong>
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nome da Playlist
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-charcoal-950 border border-charcoal-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-flowgreen-500 transition-colors"
              placeholder="Nome da playlist..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Descrição
            </label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-charcoal-950 border border-charcoal-700/80 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-flowgreen-500 transition-colors"
              placeholder="Descrição personalizada..."
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Visibilidade no Spotify
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  !isPublic
                    ? 'bg-charcoal-800 border-flowgreen-500 text-white shadow-sm'
                    : 'bg-charcoal-950 border-charcoal-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-flowgreen-400" />
                <span>Privada (Recomendado)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  isPublic
                    ? 'bg-charcoal-800 border-flowgreen-500 text-white shadow-sm'
                    : 'bg-charcoal-950 border-charcoal-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-flowgreen-400" />
                <span>Pública</span>
              </button>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="flex items-center gap-2.5 text-xs text-amber-400/90 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>A playlist será criada diretamente no seu catálogo autenticado do Spotify.</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isSubmitting || !name.trim()}
            onClick={() => onConfirm({ name, description: desc, isPublic })}
            className="inline-flex items-center gap-2 bg-flowgreen-500 hover:bg-flowgreen-400 disabled:opacity-50 text-charcoal-950 font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-flowgreen-500/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Gravando no Spotify...</span>
              </>
            ) : (
              <span>Confirmar & Gravar no Spotify</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
