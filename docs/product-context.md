# Contexto do Produto — SpotFlow AI

## 1. O Problema

Os ouvintes de música no Spotify enfrentam desafios recorrentes na gestão de sua experiência auditiva:
- **Sobrecarga de Conteúdo:** Dificuldade em montar playlists contextualizadas para momentos específicos (ex: "foco profundo para programar sem vocais", "treino de alta intensidade com synthwave").
- **Bibliotecas Desorganizadas:** Playlists antigas com faixas duplicadas, desatualizadas ou fora de coerência temática.
- **Falta de Automação:** Ausência de rotinas nativas para arquivar faixas descobertas, sincronizar listas baseadas em clima, rotina diária ou agendamentos temporais.
- **Opacidade dos Algoritmos Tradicionais:** Recomendações genéricas que não explicam o motivo da seleção ou que não permitem ajuste fino antes da gravação na conta.

---

## 2. A Solução SpotFlow AI

O **SpotFlow AI** combina a inteligência de linguagem natural com a precisão de automações programáveis:

1. **AI Playlist Studio:** O usuário descreve em linguagem natural o que deseja ouvir. A IA decompõe o pedido em parâmetros sonoros (gêneros, energia, era, restrições explícitas), busca faixas no catálogo real do Spotify e apresenta uma **prévia interativa** antes de criar a playlist na conta do usuário.
2. **Music Organizer:** Auditoria visual das playlists do usuário, permitindo detectar duplicidades, reorganizar faixas por parâmetros sonoros e consolidar coleções.
3. **Automation Center (n8n):** Workflows automatizados disparados por eventos ou horários (ex.: arquivar faixas curtidas da semana, gerar nova playlist toda sexta-feira às 18h).
4. **Music Copilot:** Assistente conversacional contextual para interagir com a biblioteca de maneira conversacional, sempre solicitando confirmação antes de executar ações de escrita.
5. **Listening Insights:** Análise transparente das preferências reais com base nos dados acessíveis da conta do usuário.

---

## 3. Filosofia de Design e UX

- **Tema Noturno Sofisticado:** Paleta de carvão profundo (`#121214`), tons escuros neutros e acentos em verde musical autoral (`#10B981` / `#059669`).
- **Verificabilidade e Transparência:** Zero simulações enganosas. Cada faixa apresentada exibe nome do artista, duração, capa oficial e link direto.
- **Controle Total do Usuário:** Nenhuma playlist é alterada ou criada sem a revisão e o clique explícito de confirmação do usuário.
