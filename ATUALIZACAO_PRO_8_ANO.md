# Portal Missão Paz — Atualização profissional do 8º ano

## Estado da versão

**Implementado no repositório:** melhorias de navegação e interface, banco curricular ampliado, Estúdio de Estudos e atualizações de jogos pixelados e tridimensionais.

**Base anterior:** 24 questões fixas, três de cada uma das oito matérias.

**Conteúdo original acrescentado:** 243 questões autorais com assunto e explicação, distribuídas entre:
- Matemática — 35
- Língua Portuguesa — 34
- Ciências — 32
- História — 30
- Geografia — 30
- Inglês — 29
- Arte — 27
- Educação Física — 26

**Total:** 267 questões (incluindo as 24 anteriores). O teste do banco não encontrou perguntas duplicadas nem registros inválidos. A cobertura é ampla para revisão do 8º ano, **mas não representa a totalidade de todo o currículo de cada escola**. Algumas escolas incluem disciplinas adicionais e diferentes sequências de capítulos.

Referências curriculares gerais: Base Nacional Comum Curricular (MEC), https://downloadbncc.mec.gov.br/ e https://basenacionalcomum.mec.gov.br/

## Ferramentas de estudo

Novo **Estúdio de Estudos**, com interface própria e link na navegação, na home e no menu de ferramentas:

1. Simulados por matéria e assunto, em blocos de até 15 questões.
2. Histórico local de perguntas já mostradas — as partidas priorizam perguntas ainda não usadas e variam os temas.
3. Revisão orientada por erros e percentual de acertos por assunto, sem ranking de colegas.
4. Biblioteca local de até 20 anotações, editáveis, de até 14 mil caracteres por nota.
5. Importação local de arquivos .txt ou .md de até 100 KB.
6. Resumos **extrativos** que selecionam frases do conteúdo fornecido.
7. Flashcards criados a partir de anotações que usam o formato `termo: definição`.
8. Busca de trechos relevantes do material que informa claramente qual texto contém a passagem.
9. Interface responsiva com etiquetas, progressos, estados, ajuda contextual e contraste.

**Transparência:** essa versão não integra um modelo generativo. A busca faz correspondência de palavras e resumos selecionam trechos, não interpretam documentos como uma IA multimodal. O site ainda não oferece ingestão nativa de PDF, chat generativo sobre fontes ou visão em tempo real. Não afirmar equivalência funcional a Knowunity ou ao Project Astra.

A plataforma Knowunity apresenta assistência generativa e trabalho com arquivos; o Project Astra é uma iniciativa de pesquisa do Google DeepMind. Esses produtos serviram somente de referência conceitual, não foram copiados nem integrados.

Referências: https://knowunity.com.br/ai/studio e https://deepmind.google/models/project-astra/

## Jogos

**Guardião dos Portais 3D:** substituído o antigo personagem semelhante a mascote por **pessoa humana estilizada em low-poly** com cabelo, rosto, casaco, pernas, braços e animação de caminhada. Cenários com ilhas e portais continuam em WebGL.

**Pixel Invaders do Saber:** novos céus pixelados, planetas, cenários paralaxe, sprites de adversários variados, efeitos de partículas, indicação de rodada e combos.

**Labirinto dos Cristais:** cinco mapas temáticos, mais detalhes de cenário e questões alternadas com o banco ampliado; todas as gemas e saídas foram verificadas quanto à acessibilidade por caminho.

**Arena e Quiz clássico:** novos dados disponíveis e seleção de perguntas que tenta evitar repetição entre visitas.

Os jogos antigos não foram removidos.

## Política de dados e segurança

- Perguntas curriculares estão nos **arquivos JavaScript do repositório**, disponíveis sem login. Elas não foram copiadas para tabelas do Supabase.
- Materiais, notas, métricas de revisão e perguntas já respondidas são salvos **localmente no navegador**, não sincronizados automaticamente entre dispositivos.
- Os alunos podem continuar como visitantes e as contas existentes não foram alteradas.
- Não há novas permissões administrativas nem inclusão de chaves secretas.
- O site deve informar limitações de IA e incentivar a conferência dos materiais com professor e fontes confiáveis.

## Validação já realizada

- [x] Banco completo testado: 267 perguntas, sem duplicatas e sem registros inválidos.
- [x] Seleção do motor de questões: 25 perguntas consecutivas de Matemática sem repetições.
- [x] Scripts do Estúdio e jogos passaram na checagem de sintaxe.
- [x] Simulação do Estúdio: simulado, resposta, notas, flashcards, resumo e busca de fonte.
- [x] WebGL simulado do personagem humano: modo detalhado e econômico.
- [x] Pixel Invaders simulado com desenho Canvas e inicialização de rodada.
- [x] Labirinto: cinco mapas com caminhos até todas as gemas e saídas.
- [x] Cache dos arquivos alterados atualizado nos links HTML.
- [ ] Validar aparência, GPU WebGL e desempenho em celulares reais.
- [ ] Conferir manualmente cada item do planejamento curricular da escola e acrescentar exercícios correspondentes.
- [ ] Testar comunicação real de login por e-mail e Google (não faz parte desta atualização).

## Próximas melhorias sugeridas

Priorizar auditoria de respostas com professores, acessibilidade com leitores de tela, suporte seguro a PDFs, armazenamento sincronizado de materiais entre dispositivos autenticados, mais gêneros de jogos e IA generativa opcional com segurança, privacidade e orçamento definidos.
