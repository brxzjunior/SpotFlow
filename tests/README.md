# Testes Transversais de Integração — SpotFlow AI

Este diretório contém suites de teste de integração transversais, fixtures e mocks para validar o comportamento de ponta a ponta do SpotFlow AI sem depender de contas pessoais reais do Spotify ou provedores pagos em ambiente de CI.

## Estrutura
- `fixtures/`: Amostras de payloads oficiais da API do Spotify (perfil, playlists, faixas).
- `mocks/`: Servidores simulados com contratos idênticos aos da API do Spotify e endpoints de LLM.
- `e2e/`: Testes automatizados do fluxo completo (quando aplicável).
