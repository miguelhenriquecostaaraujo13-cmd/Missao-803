# PROGRESSO — Neo Aurora Premium (23/11/2026)

## Contexto e segurança
- Projeto original preservado: raiz do repositório `Missao-803`; não é o diretório legado `Neo_Aurora_pronto_para_GitHub_Pages`.
- Desenvolvimento em `feat/neo-aurora-premium-internal-20261123`, criado a partir de `main`. A produção permanece intacta até revisão e merge.
- Cinco referências enviadas pelo criador: interfaces escuras, roxo/lilás, iluminação difusa, Bento Grid, desktop e celular.
- **Não foram alterados** login, autenticação, banco de dados, RLS, chaves, sincronização, cadastro, funções de IA, lógica do quadro e mecanismo de confetes.
- Não executar testes autenticados nem consumir cotas de IA sem sessão autorizada.

## Implementado na ramificação
1. `estudo/premium-2026.css`: camada de design transversal para painel, trilhas, simulados, flashcards, biblioteca, caderno, agenda, busca, ajustes e Tutor Neo. Inclui tokens próprios, fundos premium, botões, campos, bento cards, responsividade, estados de acerto/erro e movimento ambiental.
2. `estudo/premium-2026.js`: revelação de elementos via IntersectionObserver, contadores de estatísticas reais, sugestões de perguntas do Neo (sem envio automático) e apresentação em cinco marcos após criar com sucesso uma trilha.
3. `index.html`: liga os novos arquivos à entrada **ativa** do site. A apresentação inicial não foi reescrita.
4. `sw.js`: inclui os recursos novos no cache offline e atualiza a versão, sem apagar dados do usuário.

## Conclusões da auditoria
- O site já implementa View Transitions com fallback, entrada escalonada, progresso, trilhas e quadro branco com escrita progressiva e síntese de voz.
- `PROGRESSO.md` não existia antes desta etapa. Há uma cópia antiga do projeto na pasta `Neo_Aurora_pronto_para_GitHub_Pages`, que não foi editada.
- Supabase: projeto ativo; funções `missao803-tutor-ia`, `neo-ia-gratis` e `neo-voice` ativas. O código da função `neo-ia-gratis` contém referência a `GROQ_API_KEY`, mas a presença do Secret no painel não pôde ser confirmada sem acesso apropriado ao inventário de secrets.
- Os avisos do Security Advisor merecem revisão independente e cautelosa; sem migrações nesta tarefa.

## Verificações concluídas
- Referências aos novos arquivos conferidas em `index.html` e `sw.js`.
- Sintaxe JavaScript dos dois arquivos novos/alterados testados por compilação estática (`new Function`): válida.
- Integridade de chaves de CSS e presença dos blocos responsivos e `prefers-reduced-motion` conferidas.
- Materiais oficiais do Não Codei e bibliotecas de animação consultados. A análise visual completa do vídeo do YouTube não foi possível na ferramenta de acesso utilizada.

## Pendente antes de publicar
- Abrir a ramificação em navegador real e comparar visualmente as telas com as cinco referências.
- Validar desktop, Android, tablet, teclado, leitor de tela, modo reduzido, formulário e seleção de matéria.
- Exercitar criar, editar e excluir trilha com conta de teste; conferir sincronização após sair/entrar.
- Verificar o quadro branco (narração, pausa, continuação) e Neo IA com conta autorizada e pergunta curta.
- Validar service worker novo, funcionamento offline e possíveis conflitos entre CSS existente e camada premium.
- Corrigir regressões encontradas. Publicar somente após aprovação nesses testes.

## Referências de pesquisa
- https://naocodei.com/free-code-css/
- https://naocodei.com/free-code/
- https://naocodei.com/prompt-astra/
- https://reactbits.dev/
- https://uiverse.io/
- https://motion.dev/
- https://gsap.com/

Esta etapa é uma melhoria real e incremental, não uma certificação de conclusão de toda a atualização.

## Correção de regressões da prévia (23/11/2026)
- Recuperado o contorno roxo e o fundo ativo das escolhas de turma, matéria e preferências; o estilo premium antes podia neutralizar o estado `aria-pressed`.
- Corrigida a hierarquia de camadas para manter o menu acima dos cards e dos efeitos ambientais.
- Eliminada a animação de montagem de página causada por pequenos rerenders (escolha de turma, alternativa, preferências); transição completa agora ocorre apenas com troca de rota.
- Scroll reveal reapresenta os cartões quando saem e voltam à área visível (em ambos os sentidos), sem deixar conteúdos invisíveis permanentemente.
- Observadores são restaurados quando o app retorna à tela ou a preferência de animação volta a ser permitida.
- A prévia em `/previa-premium.html` usa agora `previa-premium/transicoes.js` isolado, sem editar o motor de animações publicado em `main`.
- A marca "PRÉVIA" identifica a versão experimental. O `index.html` da versão oficial em `main` continua no SHA `b3b9a853634511611ed863916dfa9bf688f0abc2`.
- Verificações estáticas: JS compila, CSS com chaves equilibradas, regras de acessibilidade e de seleção presentes. Testes visuais reais em dispositivo Android ainda necessários.
