# Contratos da API — SpotFlow AI

Todos os endpoints da API respondem no prefixo `/api` e seguem o padrão padronizado de resposta `ApiResponse<T>`:

```typescript
// Sucesso
{
  "success": true,
  "data": T,
  "meta"?: { "page"?: number, "limit"?: number, "total"?: number }
}

// Erro
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST" | "UNAUTHORIZED" | "NOT_FOUND" | "RATE_LIMITED" | "INTERNAL_ERROR",
    "message": string,
    "details"?: unknown
  }
}
```

---

## 1. Módulo de Autenticação (`/api/auth`)

- **`GET /api/auth/spotify/login`**: Inicia o fluxo OAuth 2.0. Gera parâmetro `state` criptográfico e redireciona para a URL de autorização do Spotify.
- **`GET /api/auth/spotify/callback`**: Recebe o código de autorização e o `state`, troca pelo par `access_token` e `refresh_token`, cria ou atualiza o usuário no banco de dados e redireciona para o frontend com sessão estabelecida.
- **`GET /api/auth/me`**: Retorna dados do usuário autenticado e status da conexão com Spotify.
- **`POST /api/auth/logout`**: Encerra a sessão do usuário.
- **`POST /api/auth/disconnect`**: Revoga tokens armazenados e desconecta a integração Spotify.

---

## 2. Módulo Spotify (`/api/spotify`)

- **`GET /api/spotify/status`**: Retorna status da conexão, expiração do token e escopos concedidos.
- **`GET /api/spotify/playlists`**: Retorna as playlists do usuário autenticado (paginado).
- **`GET /api/spotify/playlists/:id`**: Retorna detalhes e faixas de uma playlist específica.
- **`GET /api/spotify/search`**: Executa busca no catálogo oficial do Spotify (`track`, `artist`, `album`).

---

## 3. Módulo AI Playlist Studio (`/api/studio`)

- **`POST /api/studio/interpret`**: Recebe prompt em linguagem natural e preferências; a IA analisa e retorna parâmetros estruturados validados (`AIParsedIntent`).
- **`POST /api/studio/preview`**: Com base nos parâmetros estruturados, busca faixas reais no Spotify e monta a lista de prévia antes de qualquer gravação.
- **`POST /api/studio/confirm`**: Recebe a lista confirmada de faixas (após possíveis edições pelo usuário), cria a playlist no Spotify e registra a operação no banco.

---

## 4. Módulo de Automações (`/api/automations`)

- **`GET /api/automations`**: Lista as definições de automação do usuário.
- **`POST /api/automations`**: Cria uma nova automação (gatilho, condições, ações).
- **`GET /api/automations/:id`**: Retorna detalhes da automação e histórico recente.
- **`PATCH /api/automations/:id`**: Atualiza status (ativo/pausado) ou configurações da automação.
- **`DELETE /api/automations/:id`**: Remove a automação.
- **`POST /api/automations/:id/trigger`**: Dispara manualmente a automação (dry-run ou execução real).
- **`POST /api/automations/webhook`**: Endpoint de callback para o n8n com verificação de assinatura HMAC.

---

## 5. Módulo de Insights (`/api/insights`)

- **`GET /api/insights/summary`**: Retorna métricas agregadas da biblioteca e histórico disponível.

---

## 6. Módulo Copilot (`/api/copilot`)

- **`POST /api/copilot/message`**: Envia mensagem conversacional para o Copilot; retorna resposta em texto + ação proposta estruturada para confirmação.
- **`POST /api/copilot/execute-action`**: Executa uma ação proposta que foi confirmada pelo usuário.
