# SpotFlow AI

Plataforma inteligente de automação musical e curadoria assistida por IA integrada à API oficial do Spotify e ao orquestrador n8n.

---

## 🎵 O Problema

Ouvintes de música frequentemente encontram barreiras para manter suas bibliotecas organizadas e criar listas coerentes com o contexto do seu dia a dia:
- Playlists estagnadas e com faixas duplicadas.
- Dificuldade em traduzir momentos, rotinas ou sentimentos em seleções musicais refinadas.
- Ausência de rotinas automáticas de manutenção (arquivamento de descobertas, sincronização programada).
- Falta de controle sobre recomendações automatizadas, que muitas vezes criam seleções sem permitir revisão prévia.

---

## 💡 A Solução SpotFlow AI

O **SpotFlow AI** transforma solicitações em linguagem natural em seleções musicais verificáveis e rotinas automatizadas, assegurando controle total ao usuário por meio de um processo de staging e confirmação antes de qualquer alteração na conta do Spotify.

### Principais Funcionalidades
- **AI Playlist Studio:** Criação de playlists a partir de prompts naturais com interpretação semântica (gêneros, era, nível de energia e regras de conteúdo explícito), geração de prévia auditável e confirmação antes de gravar no Spotify.
- **Music Organizer:** Auditoria da biblioteca musical, identificação de duplicidades e sugestões de organização estruturada.
- **Automation Center:** Orquestração de rotinas programadas e reativas utilizando workflows exportados do n8n (com autenticação e idempotência).
- **Music Copilot:** Assistente conversacional para interagir com a biblioteca e sugerir ações contextuais com autorização explícita do usuário.
- **Listening Insights:** Métricas e resumos gerados exclusivamente a partir dos dados reais disponíveis na conta do usuário.

---

## 🛠️ Stack Tecnológica

- **Frontend:** React 19, TypeScript (Strict Mode), Vite, React Router, Tailwind CSS, TanStack Query, Lucide Icons, React Hook Form, Zod.
- **Backend:** Node.js 22, Express, TypeScript, Prisma ORM, PostgreSQL 16, Zod, Pino Logger (com mascaramento de dados sensíveis).
- **Automação:** n8n (workflows em JSON versionado, webhooks assinados com HMAC).
- **Inteligência Artificial:** Camada de integração agnóstica a provedor (Gemini / OpenAI), com saída estruturada validada por schemas Zod.
- **Qualidade & Testes:** Vitest, Supertest, ESLint, Prettier.

---

## 🏛️ Visão Geral da Arquitetura

O projeto adota uma arquitetura em monorepo estruturada para garantir separação clara de responsabilidades:

- `apps/web`: Single Page Application (SPA) para a interface do usuário.
- `apps/api`: API REST com módulos de domínio isolados e controle de sessão seguro.
- `packages/shared`: Schemas de validação Zod, interfaces TypeScript e contratos de API compartilhados entre frontend e backend.
- `automation/workflows`: Workflows exportados do n8n em formato JSON, com documentação de gatilhos e entradas.
- `docs/`: Documentação aprofundada de arquitetura, segurança, contexto de produto e contratos de API.

---

## 🔄 Fluxo das Integrações

```text
[Usuário] ──> [AI Playlist Studio] ──> [LLM Adapter] (Interpretação e Parâmetros Zod)
                                              │
                                              ▼
[Spotify Web API] <── [Busca Oficial] <── [Spotify Module]
        │
        ▼
[Prévia de Faixas] ──> [Aprovação do Usuário] ──> [Criação Efetiva no Spotify]
```

Workflows automatizados operam de forma similar: o n8n ou o agendador interno despacham tarefas validadas pelo backend com assinaturas criptográficas e verificação de idempotência, garantindo que nenhuma operação duplicada ocorra.

---

## 🔒 Segurança e Privacidade

- **Segredos Protegidos:** O `SPOTIFY_CLIENT_SECRET` e tokens de IA nunca são expostos ao navegador.
- **Sanitização de Logs:** Mascaramento ativo de tokens de autorização e credenciais nos logs estruturados.
- **Staging & Confirmação:** Mutações no Spotify passam obrigatoriamente por validação visual e consentimento do usuário antes de serem executadas.
- **Privacidade do Usuário:** Suporte à revogação de tokens e remoção completa de credenciais e registros a qualquer momento nas configurações.

---

## 📊 Estado Atual de Desenvolvimento

- **Fase 0 (Auditoria e Planejamento):** Concluída.
- **Fase 1 (Fundação do Monorepo e Backend Base):** Concluída com `npm workspaces`, Prisma ORM e tipagem estrita.
- **Fase 2 (Identidade Visual & Landing Page):** Concluída com Design System autoral (paleta charcoal/flowgreen), demonstrador interativo de pipeline e microinterações.
- **Fase 3 (Módulo Spotify & Autenticação Segura):** Concluída com fluxo OAuth 2.0, renovação de tokens, criptografia AES-256 e modo de demonstração.
- **Fase 4 (AI Playlist Studio):** Concluída com orquestrador de IA, saídas estruturadas Zod, busca oficial e fluxo de confirmação em duas etapas com modal de staging.
- **Fase 5 (Automação n8n & Workflows):** Concluída com 4 workflows JSON exportados (`automation/workflows`), webhooks autenticados HMAC e idempotência garantida.
- **Fase 6 (Music Organizer & Listening Insights):** Concluída com auditoria de playlists, filtros em tempo real e cálculo de indicadores analíticos.
- **Fase 7 (Music Copilot):** Concluída com chat conversacional contextual e execução de ações aprovadas pelo usuário.
- **Fase 8 (Qualidade & Portfólio):** Concluída com 24 testes automatizados aprovados (100%), typecheck estrito com 0 erros e builds de produção operacionais.

---

## ⚠️ Limitações Conhecidas

- **Spotify Development Mode:** Em modo de desenvolvimento, contas do Spotify necessitam de inclusão manual no painel de desenvolvedores do Spotify para autenticação via OAuth real. Um modo de simulação/mock é providenciado para testes e avaliações.
- **Endpoints de Áudio do Spotify:** Endpoints legados de análise de áudio e recomendações restritas descontinuados pelo Spotify foram substituídos por filtros de catálogo oficiais e classificação semântica assistida por IA.