import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Workflow, Plus, Clock, ExternalLink, Play, Loader2, CheckCircle2 } from 'lucide-react';
import { api, getStoredToken } from '../services/api';
import { AutomationDefinition } from '@spotflow/shared';

export const AutomationsPage: React.FC = () => {
  const [automations, setAutomations] = useState<AutomationDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const loadAutomations = async () => {
    setIsLoading(true);
    try {
      if (!getStoredToken()) {
        await api.loginDemo();
      }
      const data = await api.getAutomations();
      setAutomations(data);
    } catch {
      // Fallback gracioso
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAutomations();
  }, []);

  const handleTrigger = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTriggeringId(id);
    setFeedbackMsg(null);
    try {
      const res = await api.triggerAutomation(id, true);
      setFeedbackMsg(`Automação executada com sucesso em modo Dry-Run! (Idempotência: ${res.idempotencyKey.slice(0, 18)}...)`);
      await loadAutomations();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na execução';
      setFeedbackMsg(`Erro: ${msg}`);
    } finally {
      setTriggeringId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Workflow className="w-7 h-7 text-teal-400" />
            <span>Automation Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Orquestração de rotinas automatizadas com n8n, agendamentos cron e webhooks protegidos por idempotência.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Criação de novos workflows disponível via import de JSON em automation/workflows')}
          className="inline-flex items-center gap-2 bg-flowgreen-500 hover:bg-flowgreen-400 text-charcoal-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Automação</span>
        </button>
      </div>

      {/* Feedback banner */}
      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Integration Status Pill */}
      <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-flowgreen-400"></span>
          <span className="text-xs text-slate-300">
            Motor de Automações: <strong className="text-white font-semibold">Ativo & Operacional</strong> (Workflows A, B, C e D em JSON)
          </span>
        </div>
        <a
          href="http://localhost:5678"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-flowgreen-400 hover:underline flex items-center gap-1"
        >
          Abrir n8n <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Workflows List */}
      {isLoading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-flowgreen-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {automations.map((auto) => (
            <div
              key={auto.id}
              className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 flex flex-col justify-between hover:border-charcoal-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-flowgreen-400 bg-flowgreen-500/10 px-2.5 py-1 rounded-full">
                    {auto.action.type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {auto.trigger.cronExpression || 'Manual / Webhook'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-2">{auto.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {auto.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-charcoal-800 flex items-center justify-between">
                <button
                  type="button"
                  disabled={triggeringId === auto.id}
                  onClick={(e) => handleTrigger(auto.id, e)}
                  className="inline-flex items-center gap-1.5 text-xs bg-charcoal-850 hover:bg-charcoal-800 text-flowgreen-400 font-semibold px-3 py-1.5 rounded-lg border border-charcoal-700 transition-colors"
                >
                  {triggeringId === auto.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  <span>Testar (Dry-Run)</span>
                </button>

                <Link
                  to={`/app/automations/${auto.id}`}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Detalhes do Fluxo →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
