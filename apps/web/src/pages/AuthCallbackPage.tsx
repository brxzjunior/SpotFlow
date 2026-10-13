import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setStatus('error');
      setErrorMessage(`O Spotify retornou um erro na autorização: ${errorParam}`);
      return;
    }

    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      localStorage.setItem('spotflow_token', tokenParam);
    }

    // Sucesso ou redirecionamento do backend
    setStatus('success');
    const timer = setTimeout(() => {
      navigate('/app', { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-8 rounded-2xl bg-charcoal-900 border border-charcoal-800 max-w-md w-full space-y-4">
        {status === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 text-flowgreen-400 animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-white">Processando Autorização...</h2>
            <p className="text-xs text-slate-400">
              Validando credenciais com o servidor do SpotFlow AI.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-flowgreen-400 mx-auto" />
            <h2 className="text-lg font-bold text-white">Conta Conectada com Sucesso!</h2>
            <p className="text-xs text-slate-400">
              Redirecionando para o seu painel de controle...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h2 className="text-lg font-bold text-white">Falha na Conexão</h2>
            <p className="text-xs text-red-400/90">{errorMessage}</p>
            <button
              onClick={() => navigate('/app/settings')}
              className="mt-4 bg-charcoal-800 hover:bg-charcoal-750 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
            >
              Voltar para Configurações
            </button>
          </>
        )}
      </div>
    </div>
  );
};
