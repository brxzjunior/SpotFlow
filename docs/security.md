# Diretrizes e Modelo de Segurança — SpotFlow AI

## 1. Princípios de Segurança

A segurança é tratada como requisito arquitetural primário no **SpotFlow AI**:

1. **Confidencialidade de Segredos:**
   - O `SPOTIFY_CLIENT_SECRET`, chaves de IA e segredos de webhook nunca são expostos ao bundle do cliente (`apps/web`).
   - Todos os segredos residem exclusivamente no ambiente do servidor (`apps/api`).
2. **Sessões e Tokens:**
   - O backend armazena o `refresh_token` do Spotify criptografado em repouso no banco de dados.
   - A comunicação entre o frontend e a API utiliza tokens de sessão com assinatura criptográfica ou cookies `HttpOnly`, `SameSite=Lax` e `Secure` em produção.
   - Tokens expirados do Spotify são renovados proativamente pelo backend usando o fluxo padrão de refresh token do OAuth 2.0.
3. **Prevenção de Vulnerabilidades Comuns:**
   - **XSS:** Content Security Policy configurada via Helmet, sanitização de inputs com Zod.
   - **CSRF:** Tokens de estado com entropia criptográfica (`state` parameter) no fluxo OAuth e validação de `SameSite`.
   - **SSRF:** Validação estrita de URLs de webhooks permitidas no n8n contra whitelists configuradas.
   - **Rate Limiting:** Middleware de taxa de requisições por IP e por usuário para prevenir abuso de endpoints e proteger a cota da API do Spotify.
4. **Sanitização de Logs:**
   - O logger Pino possui filtros automáticos de mascaramento para campos sensíveis: `authorization`, `cookie`, `access_token`, `refresh_token`, `client_secret`, `password`.
5. **Autenticação de Webhooks do n8n:**
   - Webhooks recebidos do n8n devem conter assinatura HMAC (`X-SpotFlow-Signature`) verificada contra o segredo compartilhado antes de qualquer processamento.
6. **Desconexão e Limpeza de Dados (LGPD/GDPR):**
   - Na tela de configurações, o usuário pode desconectar a conta e solicitar a exclusão imediata de todos os tokens e registros armazenados.
