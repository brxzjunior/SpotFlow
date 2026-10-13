# Workflows n8n — SpotFlow AI

Este diretório contém as exportações JSON dos workflows do **n8n** utilizados pelo SpotFlow AI para orquestração assíncrona e rotinas automatizadas.

## Workflows Mapeados

### 1. Workflow A — Playlist Request (`workflow-a-playlist-request.json`)
- **Gatilho:** Webhook HTTP POST autenticado (`X-SpotFlow-Signature`).
- **Função:** Validação da carga útil, verificação de chave de idempotência (`idempotency_key`), persistência de execução inicial e retorno do identificador de execução (`execution_id`).
- **Segurança:** Não armazena nem repassa credenciais do Spotify.

### 2. Workflow B — Playlist Processing (`workflow-b-playlist-processing.json`)
- **Gatilho:** Execução agendada ou chamada de fila interna.
- **Função:** Consulta aos serviços autorizados, geração da lista de faixas em staging e solicitação de consentimento no backend antes da criação real.

### 3. Workflow C — Automation Scheduler (`workflow-c-automation-scheduler.json`)
- **Gatilho:** Gatilho agendado Cron (ex: semanalmente).
- **Função:** Avalia automações ativas, verifica critérios de tempo e dispara tarefas de manutenção.

### 4. Workflow D — Error Handling (`workflow-d-error-handling.json`)
- **Gatilho:** Sub-workflow de tratamento de erros global do n8n.
- **Função:** Captura incidentes, sanitiza dados confidenciais e registra o status `failed` no backend do SpotFlow.

## Como Importar no n8n

1. Acesse sua instância do n8n (ex.: `http://localhost:5678`).
2. Clique em **Workflows** > **Import from File**.
3. Selecione o arquivo JSON correspondente deste diretório.
4. Configure as variáveis de credenciais do webhook apontando para o seu segredo compartilhado (`N8N_WEBHOOK_SECRET`).
