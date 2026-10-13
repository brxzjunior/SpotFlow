import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Workflow,
  ShieldCheck,
  ArrowRight,
  Radio,
  PlayCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);

  const demoScenarios = [
    {
      prompt: 'Playlist instrumental de Synthwave retrô para 2 horas de programação à noite',
      intent: 'Foco Profundo • Eletrônica Instrumental • Energia Média',
      sampleTracks: [
        { name: 'Daylight', artist: 'Tycho', duration: '3:42' },
        { name: 'Nightcall', artist: 'Kavinsky', duration: '4:19' },
        { name: 'Resonance', artist: 'HOME', duration: '3:32' },
      ],
      outputName: 'SpotFlow — Nocturnal Coding Synth',
      tag: 'Desenvolvedor'
    },
    {
      prompt: 'Treino de musculação com hip-hop anos 90 e 2000 em ritmo acelerado',
      intent: 'Alta Intensidade • Hip-Hop Clássico • Batidas Marcantes',
      sampleTracks: [
        { name: 'Till I Collapse', artist: 'Eminem, Nate Dogg', duration: '4:57' },
        { name: 'X Gon\' Give It To Ya', artist: 'DMX', duration: '3:38' },
        { name: 'In Da Club', artist: '50 Cent', duration: '3:13' },
      ],
      outputName: 'SpotFlow — Golden Era Heavy Lifting',
      tag: 'Fitness'
    },
    {
      prompt: 'Jantar tranquilo acústico para relaxar no domingo com MPB e Bossa Nova suave',
      intent: 'Relaxamento • Acústico / Orgânico • Baixa Energia',
      sampleTracks: [
        { name: 'Águas de Março', artist: 'Elis Regina, Tom Jobim', duration: '3:32' },
        { name: 'Chega de Saudade', artist: 'João Gilberto', duration: '2:01' },
        { name: 'Samba de Verão', artist: 'Marcos Valle', duration: '3:05' },
      ],
      outputName: 'SpotFlow — Domingo Acústico & Bossa',
      tag: 'Lazer'
    }
  ];

  const currentScenario = demoScenarios[selectedDemoIndex]!;

  return (
    <div className="min-h-screen bg-charcoal-950 text-slate-100 flex flex-col selection:bg-flowgreen-500 selection:text-charcoal-950">
      {/* Top Navbar */}
      <header className="border-b border-charcoal-800/80 bg-charcoal-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-flowgreen-400 to-flowgreen-600 flex items-center justify-center shadow-lg shadow-flowgreen-600/20">
              <Radio className="w-5 h-5 text-charcoal-950 font-bold" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              SpotFlow <span className="text-flowgreen-400">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/app"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Abrir App
            </Link>
            <Link
              to="/app/studio"
              className="inline-flex items-center gap-2 bg-flowgreen-500 hover:bg-flowgreen-400 text-charcoal-950 font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-md shadow-flowgreen-500/10"
            >
              Experimentar Studio
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 sm:py-24 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-charcoal-850 border border-charcoal-700/80 text-xs font-semibold text-flowgreen-400 mb-8 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-flowgreen-400" />
          <span>Curadoria Musical com Inteligência Artificial + n8n Orchestrator</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight sm:leading-tight text-white mb-6">
          Transforme comandos em linguagem natural em{' '}
          <span className="bg-gradient-to-r from-flowgreen-400 via-emerald-300 to-flowgreen-500 bg-clip-text text-transparent">
            playlists reais verificáveis
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          O SpotFlow AI integra a API oficial do Spotify, inteligência artificial generativa e automações n8n para organizar sua biblioteca, com fluxo em duas etapas de staging e confirmação antes de qualquer alteração na sua conta.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full sm:w-auto">
          <Link
            to="/app/studio"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-flowgreen-500 hover:bg-flowgreen-400 text-charcoal-950 font-bold text-base px-6 py-3.5 rounded-xl transition-all shadow-xl shadow-flowgreen-500/20"
          >
            <span>Iniciar no AI Playlist Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-charcoal-850 hover:bg-charcoal-800 text-slate-200 border border-charcoal-700 font-semibold text-base px-6 py-3.5 rounded-xl transition-all"
          >
            <PlayCircle className="w-4 h-4 text-slate-400" />
            <span>Ver Painel do App</span>
          </Link>
        </div>

        {/* Interactive Pipeline Visualizer */}
        <div className="w-full max-w-4xl bg-charcoal-900 border border-charcoal-800 rounded-3xl p-6 sm:p-8 text-left shadow-2xl mb-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-flowgreen-400">
                Pipeline Verificável em 4 Etapas
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">Como o SpotFlow opera</h3>
            </div>

            {/* Scenario Selector */}
            <div className="flex gap-2">
              {demoScenarios.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDemoIndex(idx)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    selectedDemoIndex === idx
                      ? 'bg-flowgreen-500/10 text-flowgreen-400 border border-flowgreen-500/40'
                      : 'bg-charcoal-800 text-slate-400 hover:text-white border border-charcoal-700'
                  }`}
                >
                  {s.tag}
                </button>
              ))}
            </div>
          </div>

          {/* Steps visualization */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-charcoal-800 text-flowgreen-400 font-bold text-xs flex items-center justify-center">1</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Prompt</span>
              </div>
              <p className="text-xs text-slate-300 font-medium italic">
                "{currentScenario.prompt}"
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-charcoal-800 text-emerald-400 font-bold text-xs flex items-center justify-center">2</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Zod Schema</span>
              </div>
              <p className="text-xs text-emerald-400 font-medium">
                {currentScenario.intent}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-charcoal-800 text-teal-400 font-bold text-xs flex items-center justify-center">3</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Spotify Search</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1">
                {currentScenario.sampleTracks.map((t, i) => (
                  <li key={i} className="truncate">
                    • {t.name} <span className="text-slate-500">({t.artist})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-charcoal-950 border border-flowgreen-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-flowgreen-500 text-charcoal-950 font-bold text-xs flex items-center justify-center">4</span>
                <span className="text-[10px] text-flowgreen-400 uppercase font-semibold">Confirmação</span>
              </div>
              <p className="text-xs font-bold text-white">
                {currentScenario.outputName}
              </p>
              <span className="inline-block text-[10px] bg-flowgreen-500/10 text-flowgreen-400 font-semibold px-2 py-0.5 rounded">
                Pronta para gravar
              </span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-charcoal-900/80 border border-charcoal-800 backdrop-blur-sm hover:border-charcoal-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-flowgreen-500/10 text-flowgreen-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Studio com Staging</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Descreva sua vibe ou momento. A IA infere parâmetros, busca no catálogo oficial do Spotify e monta uma prévia editável antes de qualquer criação.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-charcoal-900/80 border border-charcoal-800 backdrop-blur-sm hover:border-charcoal-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automação com n8n</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dispare rotinas agendadas com idempotência rigorosa. Workflows exportáveis em JSON com webhooks autenticados.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-charcoal-900/80 border border-charcoal-800 backdrop-blur-sm hover:border-charcoal-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Segurança & Privacidade</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tokens de autorização criptografados em repouso no backend. Zero segredos expostos no frontend e total conformidade com dados do Spotify.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-charcoal-800/80 bg-charcoal-900/40 py-8 px-6 text-center text-xs text-slate-500">
        <p>SpotFlow AI — Projeto de Engenharia de Software Full Stack & Curadoria Musical.</p>
        <p className="mt-1">Não afiliado oficialmente ao Spotify AB. Integração via Spotify Web API oficial.</p>
      </footer>
    </div>
  );
};
