# Portal Missão Paz 4.0 — Plano de IAs, Renderização e Games

**Status do código (novembro de 2026):** primeira etapa publicada no repositório. O portal não depende de serviço pago de IA para esta versão; os módulos especializados são **motores locais adaptativos**, e o Neo Render usa um **motor gráfico procedural**, não um modelo generativo de imagem.

## 1. Visão do produto

- Visual: arquitetura organizada por **Aprender, Jogar, Criar e Organizar**, com área independente de assistentes Neo.
- Games: misturar jogos **3D WebGL reais**, **arcade pixel art** e os jogos 2D existentes, sem destruir progresso ou recursos.
- Inteligência: módulos locais separados por objetivo que leem apenas dados necessários para apresentar sugestões, mantendo dados locais e privilégios administrativos isolados.
- Acessibilidade: interface de teclado e toque, pausa, modo econômico, controle de animações e alternativas legíveis às formas de jogar.

## 2. Sete assistentes especializados

| Assistente | Responsabilidade | Estado |
| --- | --- | --- |
| Neo Tutor | Ajudar a compreender e acessar o tutor do portal | Interface e recomendação local adicionadas |
| Neo Review | Indicar revisão espaçada e flashcards | Interface e orientação local adicionadas |
| Neo Planner | Sugerir organização usando calendário existente | Interface e orientação local adicionadas |
| Neo Game Master | Ajustar velocidade conforme acertos/erros da partida | Implementado como regras adaptativas |
| Neo Render | Controlar tema de cenário e nível de detalhe | Implementado como motor gráfico procedural |
| Neo Progress | Ler métricas locais da trilha e recomendar evolução | Interface e recomendação local adicionadas |
| Neo Creator | Direcionar para ferramentas criativas já existentes | Interface e recomendação local adicionadas |

**Não implementado:** conexão a modelos de linguagem, geração automática de novos modelos 3D, geração de imagens por IA, chat generativo universal ou treinamento de modelos privados. Isso exigiria backend, APIs, custos e políticas específicas de privacidade para estudantes. Não armazenar chaves secretas no navegador.

## 3. Jogos realmente implementados

### Guardião dos Portais — 3D WebGL

- Renderização 3D nativa: WebGL 1, geometria de malhas (cubos, octaedros, pirâmides), câmera em perspectiva, iluminação por shader e efeito de neblina/distância.
- Cenários procedurais por matéria: neon, floresta e pôr do sol.
- Gameplay: personagem em três pistas e três portais por rodada; o aluno escolhe uma pista para responder.
- Cinco questões do banco do site por partida, com embaralhamento de alternativas.
- Ajuste do ritmo pelo Neo Game Master e do número de objetos de cenário pelo Neo Render.
- Teclado, toque/clique, pausa, redução de movimentos decorativos.
- Se WebGL não for suportado, aviso honesto e sugestão do jogo 2D pixelado.

### Pixel Invaders do Saber — arcade retrô

- Canvas 2D em **320 × 180 pixels reais**, escalado com *image-rendering: pixelated*.
- Sprites feitos por matrizes de pixels (nave e inimigos), estrelas, varredura e cores retrô.
- Atirar no alvo A/B/C responde a questões escolares, cinco ondas por rodada.
- Controles no teclado, botões e toque/clique na tela.
- Temas e ajustes de detalhes do Neo Render.

### Arcade original

- Preservadas as três experiências existentes: Corrida das Frações, Missão Célula e Ritmo dos Conectivos.
- O novo estúdio tem botão para voltar ao arcade anterior.

## 4. Melhorias visuais e de organização implementadas

- Atalhos principais na home: **Aprender, Jogar, Criar, Organizar**.
- Nova categoria **Jogar** no menu para experiências 3D e pixel.
- Nova categoria **IAs Neo** no menu para os sete assistentes.
- Cartões ilustrados para escolha de games; HUD de fase, pontos e ritmo; controles legíveis e responsivos.
- Regras CSS isoladas nos módulos novos para reduzir conflitos com páginas antigas.
- Adaptação automática de qualidade em dispositivos mais lentos e botão para forçar o modo econômico.

## 5. Próximas etapas planejadas, ainda não realizadas

1. Expandir o 3D para aventuras com exploração e câmera controlável, checkpoints e novos cenários.
2. Criar sprites pixel art desenhados à mão e novos gêneros: plataformas, puzzles e batalhas de ritmo.
3. Criar progressão de chefões e campanhas com níveis elaborados por matéria.
4. Fazer testes de performance com GPU real de computadores e celulares variados.
5. Criar um serviço seguro de IA generativa opcional, sujeito a autorização, orçamento, moderação e backend para proteção de credenciais.
6. Integrar recomendações entre perfil e dispositivos somente com autenticação e controles de privacidade.
7. Ampliar central de temas, configurações de acessibilidade e personalização.

## 6. Critérios de verificação

- [x] Novos arquivos CSS e JavaScript no repositório.
- [x] Central de assistentes no menu.
- [x] Jogos 3D/pixel no menu.
- [x] Botões de acesso direto na home.
- [x] Código com WebGL, shader 3D e geometria explícita.
- [x] Código com sprites pixel art desenhados em Canvas de baixa resolução.
- [x] Perguntas reutilizadas do banco de questões do portal.
- [x] Módulos de IA local denominados corretamente.
- [ ] Testes completos com navegador e GPU real.
- [ ] Testes manuais em celular real e uso por leitor de tela.
- [ ] Modelo de IA generativa remoto com backend de segurança.

**Notas de segurança:** Sem compartilhamento de resultados por aluno, sem monetização, sem anúncios ou compras no jogo; seleções de renderização ficam no navegador. Alterar privilégios de conta requer verificação no backend. Não interpretar acertos como diagnóstico de aprendizagem.
