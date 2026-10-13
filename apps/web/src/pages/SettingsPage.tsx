import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Settings,
  Shield,
  KeyRound,
  Trash2,
  CheckCircle2,
  Play,
  Loader2,
  ExternalLink,
  AlertTriangle,
  Save
} from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isConnected, setIsConnected] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [savedClientId, setSavedClientId] = useState<string | null>(null);

  // Formulário de credenciais
  const [clientIdInput, setClientIdInput] = useState('');
  const [clientSecretInput, setClientSecretInput] = useState('');
  const [isSavingCreds, setIsSavingCreds] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('error') === 'spotify_credentials_missing') {
      setFeedback(
        'Aviso: Para conectar com sua conta real do Spotify via OAuth, você precisa fornecer o Client ID e Client Secret do seu aplicativo registrado no Spotify Developer Dashboard abaixo.'
      );
    }
  }, [searchParams]);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const [auth, config] = await Promise.all([
        api.getAuthStatus(),
        api.getSpotifyConfig()
      ]);

      if (auth.spotify?.isConnected) {
        setIsConnected(true);
        setUserEmail(auth.user?.email || null);
      } else {
        setIsConnected(false);
        setUserEmail(null);
      }

      setIsConfigured(config.isConfigured);
      setSavedClientId(config.clientId);
      if (config.clientId) {
        setClientIdInput(config.clientId);
      }
    } catch {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientIdInput.trim() || !clientSecretInput.trim()) {
      setFeedback('Preencha tanto o Client ID quanto o Client Secret.');
      return;
    }

    setIsSavingCreds(true);
    try {
      const res = await api.saveSpotifyCredentials(clientIdInput.trim(), clientSecretInput.trim());
      setFeedback(res.message || 'Credenciais salvas com sucesso!');
      await checkStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar credenciais';
      setFeedback(`Erro ao salvar: ${msg}`);
    } finally {
      setIsSavingCreds(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await api.loginDemo();
      setFeedback('Sessão de demonstração ativada! Catálogo completo multi-gênero disponível para teste imediato.');
      await checkStatus();
    } catch {
      setFeedback('Falha ao ativar sessão de demonstração.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await api.logout();
      setFeedback('Conta desconectada e todos os tokens foram removidos do armazenamento.');
      await checkStatus();
    } catch {
      setFeedback('Falha ao desconectar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRealSpotifyLogin = () => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    window.location.href = `${apiBase}/api/auth/spotify/login`;
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-slate-400" />
          <span>Configurações & Conexões</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Gerencie suas credenciais do Spotify Developer, modos de uso e preferências de inteligência artificial.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-300 flex items-start gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400 mt-0.5" />
          <span className="leading-relaxed">{feedback}</span>
        </div>
      )}

      {/* Spotify Developer Credentials Setup Form */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-flowgreen-400" />
              <span>Chaves do Spotify Developer (Para Login Real via OAuth)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Para logar diretamente com sua conta pessoal do Spotify e gravar playlists reais na sua conta, configure suas chaves oficiais do dashboard do Spotify.
            </p>
          </div>
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
              isConfigured
                ? 'bg-flowgreen-500/10 text-flowgreen-400 border border-flowgreen-500/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isConfigured ? 'Chaves Configuradas' : 'Pendente de Configuração'}
          </span>
        </div>

        {/* Step-by-step helper */}
        <div className="p-4 rounded-xl bg-charcoal-950 border border-charcoal-800 text-xs text-slate-300 space-y-3">
          <p className="font-semibold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-flowgreen-400" />
            <span>Como obter suas chaves oficiais no Spotify Developer:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
            <li>
              Acesse o{' '}
              <a
                href="https://developer.spotify.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-flowgreen-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                Spotify Developer Dashboard <ExternalLink className="w-3 h-3" />
              </a>{' '}
              e abra o seu aplicativo (ex: <strong>brxz</strong>).
            </li>
            <li>
              Clique em <strong>Settings</strong> (Basic Information) no canto superior.
            </li>
            <li>
              Em <strong>Redirect URIs</strong>, adicione exatamente o endereço IP de loopback (o Spotify bloqueia a palavra <em>localhost</em>):{' '}
              <code className="text-flowgreen-400 bg-charcoal-900 px-1.5 py-0.5 rounded font-mono select-all">
                http://127.0.0.1:3001/api/auth/spotify/callback
              </code>{' '}
              e clique no botão roxo <strong>Add</strong> e depois em <strong>Save</strong>.
            </li>
            <li>
              Copie o <strong>Client ID</strong> (é um código de 32 caracteres, <em>não o nome do app</em>) e clique em <strong>View client secret</strong> para copiar o segredo de 32 caracteres.
            </li>
          </ol>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Spotify Client ID (32 caracteres)
              </label>
              <input
                type="text"
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                placeholder="Ex: 8f4e2b1a9c3d4e5f6a7b8c9d0e1f2a3b"
                className={`w-full bg-charcoal-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors font-mono ${
                  clientIdInput.trim().length > 0 && clientIdInput.trim().length < 20
                    ? 'border-amber-500/80 focus:border-amber-400'
                    : 'border-charcoal-700/80 focus:border-flowgreen-500'
                }`}
              />
              {clientIdInput.trim().length > 0 && clientIdInput.trim().length < 20 && (
                <div className="flex items-start gap-1.5 text-[11px] text-amber-400 mt-1.5 leading-tight">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    Atenção: Você digitou apenas {clientIdInput.trim().length} caracteres ({clientIdInput.trim()}). O Client ID do Spotify tem 32 caracteres hexadecimais gerados na aba Settings do painel.
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Spotify Client Secret (32 caracteres)
              </label>
              <input
                type="password"
                value={clientSecretInput}
                onChange={(e) => setClientSecretInput(e.target.value)}
                placeholder="Ex: 7c3d1a8e5b2f4c6a9e0d1b3f5a7c9e1b"
                className={`w-full bg-charcoal-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors font-mono ${
                  clientSecretInput.trim().startsWith('spak_') ||
                  (clientSecretInput.trim().length > 0 && clientSecretInput.trim().length < 20)
                    ? 'border-amber-500/80 focus:border-amber-400'
                    : 'border-charcoal-700/80 focus:border-flowgreen-500'
                }`}
              />
              {clientSecretInput.trim().startsWith('spak_') && (
                <div className="flex items-start gap-1.5 text-[11px] text-amber-400 mt-1.5 leading-tight">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    Chaves iniciadas com &apos;spak_&apos; são tokens SPAK/Partner. O Client Secret do app tem 32 caracteres e fica sob &apos;View client secret&apos;.
                  </span>
                </div>
              )}
              {clientSecretInput.trim().length > 0 &&
                !clientSecretInput.trim().startsWith('spak_') &&
                clientSecretInput.trim().length < 20 && (
                  <div className="flex items-start gap-1.5 text-[11px] text-amber-400 mt-1.5 leading-tight">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      O Client Secret possui 32 caracteres gerados pelo Spotify.
                    </span>
                  </div>
                )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              {savedClientId
                ? savedClientId.length >= 20
                  ? `ID salvo: ${savedClientId.slice(0, 8)}...`
                  : `ID salvo atual: "${savedClientId}" (inválido — precisa ter 32 dígitos)`
                : 'Nenhum ID salvo ainda'}
            </span>
            <button
              type="submit"
              disabled={
                isSavingCreds ||
                clientIdInput.trim().length < 20 ||
                clientSecretInput.trim().length < 20 ||
                clientSecretInput.trim().startsWith('spak_')
              }
              className="inline-flex items-center gap-1.5 bg-flowgreen-500 hover:bg-flowgreen-400 disabled:opacity-40 disabled:cursor-not-allowed text-charcoal-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-flowgreen-500/10"
            >
              {isSavingCreds ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Salvar Credenciais</span>
            </button>
          </div>
        </form>
      </div>


      {/* Spotify Connection & Demo Mode Action Card */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isConnected ? 'bg-flowgreen-400' : 'bg-amber-400 animate-pulse'
                }`}
              ></span>
              <span>Status da Conexão</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {isConnected
                ? `Conectado como ${userEmail || 'Usuário Ativo'}. Você pode gerar prévias e gravar playlists diretamente.`
                : 'Você pode conectar com sua conta real do Spotify usando as chaves acima, ou usar o modo demonstração imediato com catálogo completo multi-gênero.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isConnected ? (
              <>
                <button
                  type="button"
                  onClick={handleRealSpotifyLogin}
                  disabled={!isConfigured}
                  title={!isConfigured ? 'Configure o Client ID e Secret acima primeiro' : 'Conectar via OAuth oficial'}
                  className="bg-flowgreen-500 hover:bg-flowgreen-400 disabled:opacity-40 disabled:cursor-not-allowed text-charcoal-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-flowgreen-500/10 shrink-0"
                >
                  Conectar OAuth Real
                </button>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="bg-charcoal-800 hover:bg-charcoal-750 border border-charcoal-700 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 text-flowgreen-400" />}
                  <span>Entrar em Modo Demo</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleDisconnect}
                className="bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
              >
                Desconectar
              </button>
            )}
          </div>
        </div>

        {!isConfigured && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>
              O botão "Conectar OAuth Real" só pode ser utilizado após salvar seu Client ID e Client Secret. Enquanto isso, o <strong>Modo Demo</strong> está 100% liberado com suporte a múltiplos gêneros (Rock, Pop, Funk, Pagode, Sertanejo, MPB, Eletrônica, etc.).
            </span>
          </div>
        )}
      </div>

      {/* AI Provider Section */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
        <h3 className="text-base font-bold text-white">Provedor de Inteligência Artificial</h3>
        <p className="text-xs text-slate-400">
          O SpotFlow AI utiliza saídas estruturadas validadas com schemas Zod para interpretar seus pedidos de forma determinística.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-charcoal-950 border border-flowgreen-500/30 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Motor Generativo & Fallback</span>
              <span className="text-slate-400">Suporte a múltiplos gêneros com extração NLP</span>
            </div>
            <span className="text-[11px] bg-flowgreen-500/20 text-flowgreen-400 font-semibold px-2 py-0.5 rounded">Ativo</span>
          </div>
          <div className="p-3.5 rounded-xl bg-charcoal-950 border border-charcoal-800 flex items-center justify-between opacity-60">
            <div>
              <span className="font-bold text-white block">Gemini / OpenAI API</span>
              <span className="text-slate-400">Configurável via .env</span>
            </div>
            <span className="text-[11px] bg-charcoal-800 text-slate-400 font-semibold px-2 py-0.5 rounded">Configurável</span>
          </div>
        </div>
      </div>

      {/* Privacy and Data Removal (LGPD/GDPR) */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-red-500/20 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          <span>Privacidade & Exclusão de Dados</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Você tem controle total sobre suas credenciais. Ao desconectar, todos os tokens de autorização e registros da sua sessão serão permanentemente removidos.
        </p>
        <button
          type="button"
          onClick={handleDisconnect}
          className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
        >
          <Trash2 className="w-4 h-4" />
          <span>Revogar Permissões e Limpar Sessão</span>
        </button>
      </div>
    </div>
  );
};
