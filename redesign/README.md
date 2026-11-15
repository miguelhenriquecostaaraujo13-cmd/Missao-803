# Missão 803 — nova experiência de estudos

Interface nova para o portal Missão Paz do 8º ano. Base original: `miguelhenriquecostaaraujo13-cmd/Missao-803`, commit `42175b296027d95fffb6a08e42f55541b320e251`. O HTML publicado em `?versao=5` foi consultado em 15/11/2026.

## 1. Análise e melhorias

O documento original tem cerca de 356 KB, 43 scripts externos, 21 folhas de estilo, estilos inline e várias gerações de componentes sobrepostas. A página inicial repete apresentações, banners e atalhos. Isso aumenta o custo inicial, a cascata de CSS e a dificuldade para encontrar recursos.

A nova entrada organiza as ações em painel, matérias, ferramentas, caderno, agenda, jogos, tutor e comunidade. A busca normaliza acentos. Os módulos avançados são carregados apenas quando abertos. As rotas usam fragmentos compatíveis com GitHub Pages; voltar/avançar funcionam sem configuração de servidor. Não foram medidos Core Web Vitals em produção; a redução do carregamento inicial é arquitetural, não uma promessa de pontuação Lighthouse.

## 2. Design

Identidade própria com verde sálvia, tons pastéis, tipografia Manrope/DM Sans com fallback local e cards consistentes. Grid/Flexbox, menu recolhível no celular, temas claro/escuro, estados de foco, labels, status acessíveis, menor movimento quando solicitado e controle do foco no menu móvel. Os módulos preservados recebem uma camada visual de compatibilidade; alguns componentes avançados ainda mantêm o design original.

## 3. Arquitetura

- `dist/index.html`: estrutura semântica da aplicação.
- `dist/styles.css`: tokens, componentes, temas e responsividade.
- `dist/js/app.js`: roteador, painel, busca, metas e timer persistente.
- `dist/js/data.js`: catálogo de ferramentas, matérias e datas do original.
- `dist/js/storage.js`: persistência e contadores compatíveis com o portal.
- `dist/js/study.js`: simulados e flashcards, correções, rodadas embaralhadas.
- `dist/js/questions.json`: 243 questões do banco complementar existente, em oito matérias; não é conteúdo novo nem certificação de currículo completo.
- `dist/modules/`: motores, banco completo, jogos, tutor e integrações do site anterior.
- `dist/js/bridge.js` e `dist/module-theme.css`: adaptação dos módulos ao novo shell.
- `.openai/hosting.json`: configuração da publicação no Sites.

Migração incremental: o shell e a prática rápida foram modularizados; os motores avançados continuam em um iframe da mesma origem, com rotas explícitas. O isolamento evita conflito entre versões de CSS e preserva a lógica existente. Não é uma reescrita integral do backend ou de todos os jogos.

Para executar: sirva `dist/` com qualquer servidor HTTP estático. Por exemplo, `python3 -m http.server 8000 --directory dist`. Não abra via `file://`: os módulos ES e o banco JSON exigem HTTP. Para GitHub Pages, publique o conteúdo de `dist/` na raiz configurada do Pages. O ZIP no menu Sobre contém esses arquivos e este README.

## Funcionalidades

Painel com contadores reais do armazenamento original, oito matérias, assuntos, simulados com correção e explicação, alternativas aleatórias e prevenção de repetição até esgotar o conjunto. Flashcards guardam a avaliação e priorizam revisões mais antigas. Metas diárias são separadas por turma; timer usa horário absoluto e continua após recarregar.

O catálogo mantém acesso aos 35 módulos originais, além de atalhos explícitos para simulado clássico e flashcards com revisão espaçada. Jogos 3D, arcade, mapas, caderno, biblioteca, professor, administração, offline, acessibilidade e tutor são preservados. Permissões administrativas continuam a cargo do serviço original.

## GitHub e Supabase

O repositório foi confirmado pelo conector GitHub. O Supabase `Missão803` (`mbltrucgwqozrujxifcx`) foi identificado pelo endpoint existente e confirmado ativo. As 17 tabelas públicas consultadas têm RLS habilitado. Não foram feitas alterações em dados, políticas, usuários ou autenticação.

O novo endereço tem armazenamento local separado do GitHub Pages. Exporte/importe a trilha e o caderno se desejar transferir o progresso. Nenhum dado é migrado automaticamente. O tutor é um motor local, não um modelo de IA generativa. O serviço externo Supabase JS mantém a versão original fixada 2.105.0.

URLs de retorno do e-mail/Google precisam admitir o novo endereço para esses fluxos funcionarem nele. Não houve login com uma conta real nem teste de escrita nas tabelas coletivas. A consulta de metadados não comprova o fluxo autenticado completo. Para continuidade imediata do login, o endereço original permanece disponível.

Os advisors existentes apontam funções agregadoras SECURITY DEFINER expostas, acesso anônimo em políticas específicas, uma tabela de cotas sem política e proteção de senhas vazadas desativada. Esses avisos não comprovam uma falha por si só; não foram alteradas regras potencialmente intencionais do portal. Referências: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable e https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection .

## Validação

Checagem de sintaxe dos novos módulos JS; validação de estrutura e unicidade do banco; conferência das rotas originais e dos arquivos locais. Verificação em navegador do painel, simulado com resposta e explicação, caderno com salvamento local e layout de 390 px. As integrações autenticadas, cada fase de cada jogo e o comportamento offline completo não foram validados de ponta a ponta.

Datas de prova vêm do portal original e devem ser confirmadas com os professores. Projeto independente, não oficial da escola.
