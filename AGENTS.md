# Diretrizes para Agentes de Desenvolvimento — SpotFlow AI

Este documento estabelece as regras permanentes e obrigatórias para qualquer agente ou engenheiro que atue no repositório **SpotFlow AI**.

---

## 1. Princípios Inegociáveis

1. **Código Funcional e Testável**: Nunca considere uma tarefa concluída com meros mocks estáticos ou respostas fictícias quando um endpoint ou integração puder ser validado.
2. **Sem Vazamento de Segredos**: Nunca exponha credenciais, chaves de API, `client_secret` ou tokens brutos de autorização no frontend, em commits, em logs estruturados ou na documentação.
3. **Respeito aos Contratos e Tipagem**: Toda troca de mensagens entre o cliente (`apps/web`), o servidor (`apps/api`) e o orquestrador (`automation/`) deve ser regida pelos schemas Zod e tipos TypeScript definidos em `packages/shared`.
4. **Idempotência em Mutações**: Mutações em playlists e rotinas de automação devem sempre conter chaves de idempotência (`idempotency_key`) para prevenir duplicidades.
5. **Confirmação Prévia para Ações Externas**: Operações de escrita no Spotify (criação, edição ou exclusão de faixas) devem sempre passar pelo fluxo em duas etapas: **Prévia/Staging** seguido de **Confirmação Explícita do Usuário**.
6. **Evolução Incremental**: Trabalhe estritamente fase a fase, testando e validando a compilação a cada etapa.

---

## 2. Padrões de Código

### Monorepo & Pacotes
- Frontend: `apps/web` (React, TypeScript strict, Vite, Tailwind CSS, TanStack Query, React Router).
- Backend: `apps/api` (Node.js, Express, TypeScript, Prisma ORM, Pino Logger, Zod).
- Compartilhado: `packages/shared` (Schemas Zod, Types DTO, Event Contracts).
- Automação: `automation/workflows` (Workflows JSON do n8n com documentação).

### Segurança e Tratamento de Erros
- Use sempre o middleware de sanitização do Pino Logger para mascarar headers de autorização e campos como `password`, `token`, `secret`.
- Em caso de falha de API de terceiros (Spotify ou LLM), retorne códigos HTTP semânticos (401, 403, 429, 502) com mensagem clara e código de erro interno mapeado em `packages/shared`.
- Valide rigorosamente todos os payloads de entrada via Zod antes de qualquer processamento de negócio.

### Mudanças na API do Spotify
- Respeite as restrições vigentes do Spotify Developer Mode.
- Não assuma a existência de endpoints restritos de áudio (`audio-features`) ou recomendações não autenticadas.
- Utilize a busca oficial de catálogo (`/v1/search`) com filtros de gênero, artista e ano, complementada pela inferência estruturada da IA.
