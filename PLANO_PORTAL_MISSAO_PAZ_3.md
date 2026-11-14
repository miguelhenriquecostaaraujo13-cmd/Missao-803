# PORTAL MISSÃO PAZ 3.0 — Plano oficial de produto e execução

**Objetivo:** transformar o site em uma plataforma de estudos inovadora, que integre a trilha escolar, os jogos existentes, o calendário, as ferramentas de criação e o perfil em uma experiência divertida, inclusiva e segura.

**Identidade visual:** game educativo cartoon com elementos isométricos, mapas por matéria, progressos, edifícios, personagens, animações suaves e interface responsiva. Reaproveitar e preservar os minijogos que já funcionam; não copiar artes protegidas de outros jogos. Oferecer redução de movimento.

## Estágio 1 — núcleo funcional publicado no repositório

1. **Central Neo 3.0:** acesso via página inicial e novo grupo do menu.
2. **Mundo do Conhecimento:** ilhas das matérias com progresso real dos tópicos marcados na trilha.
3. **GPS dos estudos:** sugere o próximo tópico não concluído e abre sua matéria.
4. **Modo estudar sem escolher:** sorteia um tópico ainda não concluído.
5. **Missão do dia:** leitura, prática e revisão; marcação voluntária; recompensa de XP somente uma vez por dia.
6. **Chefão das Matérias:** perguntas do banco real do portal; resposta comentada, barra de energia e recompensa limitada por matéria/dia.
7. **Flashcards Evolutivos:** revisões com intervalos de 1, 3, 7, 15 ou 30 dias; feedback de lembrança; armazenamento local.
8. **Cidade do Aprendizado:** edifícios surgem conforme XP ganho.
9. **Conquistas:** primeiros tópicos, dez tópicos, primeiro chefão, revisão de cartões e construtor.
10. **Radar escolar pessoal:** mostra próximos eventos cadastrados no calendário do navegador.
11. **Mochila do Estudante:** notas rápidas salvas localmente e atalhos para caderno, foco e mapas mentais.
12. **Integração com ferramentas existentes:** acesso direto ao arcade, oficina, laboratório, perfil, tutor e metas.

**Limitações declaradas:** XP e notas rápidas são dados locais; não sincronizam entre aparelhos. O módulo de revisão usa regras simples e o banco de flashcards do portal, não é inteligência artificial generativa. O radar não inventa datas de prova: utiliza tarefas digitadas no calendário do usuário.

## Estágio 2 — conteúdo e jogos avançados (planejado, NÃO implementado)

- **Mistérios do Saber:** histórias interativas de investigação e pistas por resposta correta.
- **Laboratório 360:** experiências ilustradas de ciências e matemática com ações, variáveis e explicações.
- **Campanha dos Mundos:** missões sequenciais, passagem entre ilhas, guardiões e conquistas por matéria.
- **Árvore de Habilidades:** domínio de conteúdos mapeado a exercícios e revisões reais.
- **Jogo de ritmo:** sílabas, sequências, tabuada e ortografia com acessibilidade sem áudio.
- **Construção educativa:** pontes e máquinas montadas pela resolução de problemas.
- **Cidade 2.0:** itens visuais desbloqueáveis e personalização sem microtransações.
- **Avatar Companheiro:** mascote neutro personalizável, sem comentários sobre aparência física.
- **Biblioteca viva 2.0:** filtros, coleções, leitura guiada e envio de materiais para moderação.
- **Oficina 2.0:** criador de desafios, flashcards, resumos e infográficos exportáveis.
- **Temas expandíveis:** oceano, espaço, floresta, castelo e neon com acessibilidade.
- **Memorização integrada:** flashcards criados a partir de conteúdo curado e revisados segundo necessidade.
- **Modo turbo:** rotinas de 5/10/15 minutos com timer e exercícios curtos.
- **Sessões de foco:** integração do cronômetro já existente com objetivos voluntários.
- **Recompensas cosméticas:** títulos, molduras e decorações por atividades concluídas.
- **Histórias educativas:** escolhas narrativas para história, português e ciências.

## Estágio 3 — inteligência escolar e recursos coletivos (planejado, NÃO implementado)

- **Mentor Neo adaptativo:** recomendações por erros e acertos observados, com explicações transparentes e sem prometer ser IA generativa.
- **Painel de reforço:** mapa de habilidades a praticar, sem rótulos depreciativos.
- **Home adaptável:** módulos em destaque conforme calendário e revisões pendentes.
- **Trilha inteligente:** sequenciamento de objetivos por disciplina, progresso e calendário.
- **Radar de prova completo:** checklists por prova, plano de revisão e materiais ligados à matéria.
- **Calendário de estudo assistido:** blocos sugeridos para tarefas escolares.
- **Central de reforço:** lembretes locais opcionais e configuráveis.
- **Meu método de estudar:** comparação de estratégias de prática com orientação educativa.
- **Mural de desafios coletivos:** métricas agregadas, sem expor notas individuais.
- **Campeonatos e duelos educativos:** participação facultativa, moderação e antiabuso.
- **Temporadas e eventos:** atividades temáticas acessíveis, sem pressão por permanência.
- **Modo professor:** atividades liberadas apenas por pessoa previamente autorizada; banco e permissões conferidos por políticas.
- **Trilhas cooperativas:** participação em grupo com mediação de responsáveis.
- **Painel de acessibilidade aprimorado:** atalhos de teclado, contraste e suporte a leitor de tela.

## Mais 12 ideias inéditas — foco no site como um todo

1. **Leitor com perguntas:** fragmenta textos em pequenas partes com perguntas de compreensão.
2. **Semáforo da revisão:** permite sinalizar clareza sobre um assunto sem expor o aluno.
3. **Biblioteca de exemplos:** explicações com exemplos do dia a dia organizados por capítulo.
4. **Estudo em camadas:** versão rápida, guiada e aprofundada da mesma lição.
5. **Caderno de erros útil:** registra por que uma alternativa não funcionou, sem nota pública.
6. **Plano para ausência:** ajuda a retomar aulas perdidas com conteúdo curado.
7. **Conexões entre matérias:** mostra como matemática, ciências, arte e geografia se relacionam.
8. **Perguntas criadas pelo estudante:** montagem de questões para estudo pessoal.
9. **Detector de pré-requisitos:** sugere revisar um conteúdo básico antes de começar um avançado.
10. **Modo rede lenta:** carregar rapidamente recursos essenciais e explicar o que precisa de internet.
11. **Guia de primeira visita:** mostra 3 ações para começar sem cadastro obrigatório.
12. **Painel de privacidade:** informa claramente quais recursos ficam no dispositivo e quais usam serviços externos.

## Princípios de implementação

- Não mexer em permissões de administrador sem revisar autenticação e RLS.
- Permitir uso como visitante e respeitar sessões existentes.
- Evitar publicar nomes, fotos ou notas em rankings.
- Preservar recursos atuais e integrar novas ferramentas gradualmente.
- Priorizar o celular, teclado, contraste e movimento reduzido.
- Fazer testes de navegação, estado local, entrada/saída de conta, erros de conexão e versão em cache.
- Não afirmar que recursos planejados já estão prontos.
- Projetar minijogos com artes próprias e mecânicas variadas, sem duplicar somente jogos de bolinhas.

## Checklist de aceitação da versão 3.0 inicial

- [x] Nova Central aparece na home e no menu.
- [x] Acesso à central mantém o sistema anterior de login/visitante.
- [x] Mundos usam tópicos reais da trilha.
- [x] Chefão utiliza banco de questões do portal.
- [x] Flashcards têm agendamento de revisão.
- [x] Missões, recompensas e notas têm armazenamento local.
- [x] Central mantém as ferramentas atuais como atalhos.
- [x] Recursos futuros estão identificados como planejados.
- [ ] Teste completo em dispositivos móveis reais.
- [ ] Testes integrados automatizados em navegador.
- [ ] Recurso de sincronização de progresso do módulo 3.0 entre dispositivos.
- [ ] Conteúdos e jogos planejados nas fases 2 e 3.

**Status:** implementação inicial commitada no repositório. O plano é um backlog e não equivale a todas as futuras funcionalidades já existentes.
