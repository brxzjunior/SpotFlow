import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Workflow, ArrowLeft, Play, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';
import { api, getStoredToken } from '../services/api';
import { AutomationDefinition, AutomationExecution } from '@spotflow/shared';

export const AutomationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [automation, setAutomation] = useState<AutomationDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [lastExecution, setLastExecution] = useState<AutomationExecution | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        if (!getStoredToken()) {
          await api.loginDemo();
        }
        if (id) {
          const data = await api.getAutomationDetails(id);
          setAutomation(data);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleTrigger = async () => {
    if (!id) return;
    setIsTriggering(true);
    try {
      const exec = await api.triggerAutomation(id, true);
      setLastExecution(exec);
    } catch {
      // Tratar
    } finally {
      setIsTriggering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 flex justify-center">
        <Loader2 className="w-8 h-8 text-flowgreen-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        to="/app/automations"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Automações</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Workflow className="w-6 h-6 text-flowgreen-400" />
            <span>{automation?.name || `Detalhes da Automação (${id})`}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {automation?.description || 'Configuração de fluxo, gatilhos e histórico sanitizado.'}
          </p>
        </div>

        <button
          type="button"
          disabled={isTriggering}
          onClick={handleTrigger}
          className="inline-flex items-center gap-2 bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl transition-all self-start sm:self-auto"
        >
          {isTriggering ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 text-flowgreen-400" />
          )}
          <span>Executar Dry-Run Agora</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Configuração do Workflow</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-charcoal-950 border border-charcoal-800">
            <span className="text-slate-500 font-medium block mb-1">Gatilho (Trigger)</span>
            <span className="text-slate-200 font-mono">
              {automation?.trigger.cronExpression || 'Webhook / Manual'}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-charcoal-950 border border-charcoal-800">
            <span className="text-slate-500 font-medium block mb-1">Ação (Action)</span>
            <span className="text-slate-200 font-mono">
              {automation?.action.type || 'generate_smart_playlist'}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-charcoal-950 border border-charcoal-800">
            <span className="text-slate-500 font-medium block mb-1">Idempotência</span>
            <span className="text-emerald-400 font-mono font-semibold">Garantida (SHA-256)</span>
          </div>
        </div>

        <div className="pt-4 border-t border-charcoal-800 flex items-center gap-2 text-xs text-slate-400">
          <ShieldAlert className="w-4 h-4 text-flowgreen-400" />
          <span>O teste em dry-run simula a execução completa sem realizar mutações reais na sua conta do Spotify.</span>
        </div>
      </div>

      {/* Execution Logs Feedback */}
      {lastExecution && (
        <div className="p-6 rounded-2xl bg-charcoal-900 border border-flowgreen-500/30 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-flowgreen-400" />
              <span>Resultado da Execução ({lastExecution.id})</span>
            </h4>
            <span className="text-[10px] bg-flowgreen-500/10 text-flowgreen-400 font-mono px-2 py-0.5 rounded">
              status: {lastExecution.status}
            </span>
          </div>

          <div className="bg-charcoal-950 p-4 rounded-xl border border-charcoal-800 font-mono text-xs text-slate-300 space-y-1">
            {lastExecution.logs.map((log, idx) => (
              <p key={idx} className="leading-relaxed">
                {log}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
