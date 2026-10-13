import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Play
} from 'lucide-react';
import { api, getStoredToken } from '../services/api';
import { AICopilotAction } from '@spotflow/shared';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  proposedAction?: AICopilotAction | null;
  actionExecuted?: boolean;
}

export const CopilotPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'copilot',
      text: 'Olá! Sou seu copiloto de música do **SpotFlow AI**. Posso preparar playlists temáticas no Studio, auditar faixas duplicadas ou analisar suas estatísticas. Nenhuma alteração externa será feita sem sua confirmação explícita.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    'Crie uma playlist relaxante de synthwave para programar',
    'Verifique se tenho faixas duplicadas na minha biblioteca',
    'Qual é o resumo estatístico das minhas playlists?'
  ];

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!getStoredToken()) {
        await api.loginDemo();
      }

      const res = await api.sendCopilotMessage(trimmed);

      const copilotMsg: ChatMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: res.replyText,
        proposedAction: res.proposedAction || null
      };

      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao processar mensagem';
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'copilot',
          text: `Desculpe, ocorreu um erro ao consultar o motor de IA: ${msg}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = async (messageId: string, action: AICopilotAction) => {
    setExecutingActionId(messageId);
    try {
      const res = await api.executeCopilotAction(action);

      // Marca a ação como executada
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, actionExecuted: true } : m))
      );

      // Adiciona resposta de confirmação no chat
      setMessages((prev) => [
        ...prev,
        {
          id: `confirm-${Date.now()}`,
          sender: 'copilot',
          text: `✅ ${res.message}`
        }
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao executar ação';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'copilot',
          text: `Falha ao executar ação: ${msg}`
        }
      ]);
    } finally {
      setExecutingActionId(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto space-y-4">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Bot className="w-7 h-7 text-flowgreen-400" />
          <span>Music Copilot</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Assistente de orquestração musical. Mutações e ações com efeitos externos sempre exigem sua autorização explícita.
        </p>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.sender === 'user'
                  ? 'bg-slate-700 text-white'
                  : 'bg-flowgreen-500/10 text-flowgreen-400'
              }`}
            >
              {m.sender === 'user' ? 'Você' : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`rounded-2xl p-4 text-xs max-w-lg space-y-3 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-charcoal-800 text-white rounded-tr-sm'
                  : 'bg-charcoal-850 border border-charcoal-800 text-slate-200 rounded-tl-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>

              {/* Proposed Action Card */}
              {m.proposedAction && (
                <div className="p-3.5 rounded-xl bg-charcoal-950 border border-flowgreen-500/30 space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-flowgreen-400" />
                    <span className="font-bold text-white text-[11px] uppercase tracking-wider">
                      Ação Proposta Requer Confirmação
                    </span>
                  </div>

                  <p className="font-semibold text-slate-200">{m.proposedAction.title}</p>
                  <p className="text-[11px] text-slate-400">{m.proposedAction.description}</p>

                  <div className="pt-2 flex items-center gap-2">
                    {m.actionExecuted ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-flowgreen-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Ação Autorizada & Executada
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={executingActionId === m.id}
                        onClick={() => handleExecuteAction(m.id, m.proposedAction!)}
                        className="inline-flex items-center gap-1.5 bg-flowgreen-500 hover:bg-flowgreen-400 disabled:opacity-50 text-charcoal-950 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all"
                      >
                        {executingActionId === m.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Play className="w-3 h-3 fill-current" />
                        )}
                        <span>Aprovar & Executar</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-flowgreen-400" />
            <span>Copilot está analisando sua biblioteca...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(p)}
            className="text-[11px] bg-charcoal-900 hover:bg-charcoal-850 border border-charcoal-800 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-flowgreen-400" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Envie uma instrução ou pergunta para o Copilot..."
          className="flex-1 bg-charcoal-900 border border-charcoal-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-flowgreen-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-flowgreen-500 hover:bg-flowgreen-400 disabled:opacity-50 disabled:cursor-not-allowed text-charcoal-950 font-bold px-5 py-3 rounded-xl transition-all flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
