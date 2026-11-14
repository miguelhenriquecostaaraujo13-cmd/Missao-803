# Portal 8º Ano Missão Paz 🎓💙

**Conecte seu conhecimento. Evolua a cada missão!**

Plataforma independente e gratuita de estudos para as turmas **801, 802, 803 e 804 (manhã)** e **806 e 807 (tarde)** do 8º ano.

## Funcionalidades

- Painel, metas semanais, conquistas e trilha de conteúdos
- Simulados com correção, rodada concluída e painel de desempenho por matéria
- Gerador de questões a partir de banco de perguntas e regras matemáticas
- Laboratório de questões a partir de textos colados pelo aluno, com lacunas e alternativas
- Flashcards, Pomodoro, métodos de estudo e missões de revisão
- Arena 803, calendário, videoaulas, caderno e tutor local
- Biblioteca colaborativa, espaço informativo para professores e modo offline básico
- **Acesso rápido**: seletor no topo para navegar pelas áreas sem precisar arrastar o menu

## Modo Proprietário — acesso seguro

A aba **🔒 Modo Proprietário** agora usa **Supabase Auth** para login por e-mail e senha. A autorização real é verificada no **PostgreSQL por RLS**, não por uma senha escrita no HTML.

- Usuários comuns e sessões anônimas não podem publicar, alterar ou excluir avisos/provas oficiais.
- O administrador pode criar ou excluir anúncios e provas, escolhendo uma turma específica ou o 8º ano inteiro; o mural mostra as publicações pertinentes à turma selecionada.
- As três tabelas são `public.portal803_admins`, `public.portal803_announcements` e `public.portal803_exams`.
- Ninguém vira proprietário apenas por se cadastrar; o acesso depende da aprovação segura da conta no Supabase.
- Para habilitar o proprietário, a pessoa cria uma conta (e confirma o e-mail, se necessário), entra no site e copia o UUID exibido. O administrador do projeto pode então autorizar o UUID com:

```sql
insert into public.portal803_admins (user_id)
values ('UUID-COPIADO-DO-PORTAL')
on conflict (user_id) do nothing;
```

Execute o comando **somente no SQL Editor autenticado do projeto Supabase**, depois de verificar a titularidade da conta. Nunca cole senha, token nem chave secreta no HTML ou no chat. A conta precisa estar confirmada e não pode ser anônima.

**Configuração de confirmação do e-mail:** em Supabase → Authentication → URL Configuration, adicione `https://miguelhenriquecostaaraujo13-cmd.github.io/Missao-803/` à lista de URLs de redirecionamento. O formulário também orienta o usuário quando a verificação de e-mail é necessária.

O login do proprietário é independente do editor de rascunhos antigo, que foi substituído. Os avisos/provas são publicados no Supabase sem modificar os arquivos do GitHub. Alterações no código continuam pelo GitHub. As datas existentes no HTML são referências iniciais; novas informações oficiais aparecem no mural de atualizações.

## Lembretes e notificações

Na aba **🔔 Lembretes**, o aluno escolhe voluntariamente lembrete diário (horário padrão 19h), alerta sobre provas do dia seguinte e aviso quando surgem novos comunicados oficiais. As preferências e o histórico são guardados apenas no navegador, sem identificar ou rastrear estudantes. Há controles para desativar e limpar a caixa de lembretes.

O botão **Permitir notificações** solicita autorização expressa do navegador; o site pode mostrar alertas do sistema quando a página estiver aberta, com suporte variando conforme sistema e navegador. O service worker também permite abrir a página ao tocar num aviso. **Não há Web Push com o site totalmente fechado**: isso dependeria de assinaturas de dispositivo, VAPID, servidor de envio e agendamento, ainda não implementados. Os lembretes não são garantidos em horário exato se o navegador suspender a página; são verificados ao abrir, ao voltar para a aba e periodicamente enquanto o site está em execução.

## Evolução do Portal 8º Ano — etapas

### Etapa 1: organização e navegação (implementada)
- Página inicial com pesquisa de ferramentas por nome ou categoria, inclusive com pesquisa sem acentos.
- Atalhos rápidos para trilha, simulados, calendário, caderno, biblioteca e lembretes.
- Ferramentas favoritas (até 12) e botão para retomar a última área utilizada.
- Preferências guardadas **somente no navegador** em `portal803-favorite-tools-v1` e `portal803-last-tool-v1`.
- As 22 áreas originais e os três temas de visual foram preservados. As chaves de progresso e do Supabase não foram alteradas.

### Etapas 2, 3 e 4 (implementadas)
- **Etapa 2:** níveis de compreensão por tópico (🟢 Entendi, 🔵 Quase entendi, 🩷 Preciso revisar), checklist por matéria e caderno privado de erros dos simulados na aba **Revisão para provas**.
- **Etapa 3:** gráfico do histórico diário de acertos nos simulados a partir desta atualização, e calendário mensal mostrando tarefas locais, cronograma inicial e datas oficiais cadastradas no Supabase.
- **Etapa 4:** controles locais de tamanho da fonte, alto contraste e animações, além de formulário opt-in de relatos privados de problemas/sugestões. O proprietário aprovado acessa esses relatos pelo Modo Proprietário.
- O histórico, os checklists e os níveis de compreensão ficam apenas no armazenamento local do aluno. Os relatos enviados são armazenados no Supabase, protegidos por políticas RLS que limitam a leitura ao autor e aos administradores autorizados. Relatos podem ser marcados como resolvidos pelo administrador autorizado.
- A plataforma foi ampliada de 26 para 28 áreas, mantendo os temas e as chaves de armazenamento antigas da 803. Testar no celular e em diferentes navegadores após publicação.


## Expansão para o 8º ano (novembro de 2026)

- **Turmas da manhã:** 801, 802, 803, 804. **Turmas da tarde:** 806, 807.
- O seletor de turma fica na capa e no topo do site. A escolha é autodeclarada e não comprova matrícula, identidade nem vínculo oficial.
- Página de abertura com logomarca **alternativa, não oficial**, inspirada nas cores e na pomba da Missão Paz, em `assets/missao-paz-logo-portal.svg`.
- Ilustração cartoon **genérica e não identificável** de estudantes com o uniforme azul e branco, em `assets/turmas-cartoon.svg`. Não publica fotografias reais de alunos.
- Avisos, provas e biblioteca são apresentados para a turma escolhida e para o escopo `geral`. Publicações anteriores continuam vinculadas à 803.
- Administradores autorizados escolhem a turma ou `geral` antes de publicar avisos e provas, e podem revisar materiais pendentes e relatos privados.
- Progresso antigo da 803 permanece na chave `missao803-v1`; o estado básico de outras turmas usa `portal8-state-<turma>`. Preferências de estudo e histórico adicionais usam chaves separadas por turma, preservando a 803.
- A trilha e os simulados inicialmente reaproveitam conteúdos da 803 como **material de estudo introdutório**. Não são roteiros oficiais das outras turmas; cada sala deve confirmar com seus professores o conteúdo e as datas.
- A publicação das médias de notas exige ao menos cinco participantes para uma mesma prova e fica no agregado, sem lista pública de notas individuais. Os dados individuais são protegidos por RLS e exigem sessão autenticada (inclusive a anônima do Supabase, se estiver habilitada).
- Missões semanais são voluntárias e por turma. O contador coletivo só aparece após pelo menos cinco participações; não existem rankings de alunos.
- Novas turmas podem sincronizar contadores agregados sem acessar os dados individuais de outras sessões. A 803 preserva o painel histórico anterior.
- **Limitação:** a seleção de turma no navegador não é autenticação de matrícula. A instituição não foi formalmente envolvida no projeto e não deve ser apresentada como autora ou responsável sem autorização.

## Identidade visual animada e ilustração aprovada

- A página inicial utiliza a ilustração cartoon aprovada pelo criador, em `assets/estudantes-cartoon-aprovado.png` (imagem criada a partir da referência fornecida).
- Novo banner panorâmico com **animação automática de entrada**, efeito de brilho, leve aproximação da imagem e ícones flutuantes; letreiro de ferramentas com movimento contínuo.
- Há um botão **“✨ Reproduzir animações”**, além de três passos claros para começar: escolha uma matéria, pratique questões e revise.
- A página inicial também mostra um carrossel de avisos e provas filtrados pela turma selecionada, com controles **Anterior**, **Próximo** e **Pausar**. A rotação automática é desativada quando o usuário ou sistema solicita redução de movimento.
- As animações são CSS leves (sem vídeos, APIs pagas nem rastreamento). Respeitam `prefers-reduced-motion` e a preferência **Reduzir animações** do aluno.
- O service worker contém o cartoon e os recursos atuais no cache offline atualizado para acesso após a primeira visita online.
- Preservadas as 27 seções e os registros locais existentes, inclusive os resultados históricos da 803.

## Neo — livrinho interativo

- Ao trocar entre as **27 ferramentas**, o Neo aparece no canto inferior direito e mostra um **balão de fala com dica específica** da área aberta.
- Cada área tem duas frases que se alternam. Clique no mascote ou no botão **✨ Outra dica** para ver mais uma. O balão fecha automaticamente após cerca de 5 segundos ou pelo botão ×.
- A primeira visita da sessão também mostra uma saudação. O mascote continua disponível no cantinho, sem bloquear o uso da página.
- Em **Acessibilidade** há a opção **Mostrar o Neo e suas dicas ao abrir ferramentas**. Ela pode ser desativada e a escolha fica apenas no dispositivo (`portal8-pazinho-enabled-v1`).
- A entrada tem movimento suave e respeita as preferências de redução de movimento. Não há voz, rastreamento, cookies adicionais nem API paga.
- A ilustração de estudantes cartoon aprovada permanece **inalterada**. O mascote agora é o livrinho azul com braços, pernas, olhos e sorriso, fiel ao desenho enviado pelo criador, em `assets/pazinho.svg`.
- Componentes independentes: `assets/portal8-pazinho.css` e `assets/portal8-pazinho.js`; a função `showView` emite `portal8:viewchange` após a navegação.

## Contas e perfis privados (novembro de 2026)

- Nova aba **👤 Meu perfil** e atalho no cabeçalho para **Entrar / Criar conta**.
- Login/cadastro com Supabase Auth por e-mail e senha (mínimo 12 caracteres), aproveitando a conexão já usada pelo Modo Proprietário. A confirmação por e-mail depende das configurações do Auth.
- O perfil de cada aluno fica na tabela **`public.portal8_profiles`** com nome de exibição, turma, apresentação curta, avatar privado e data de criação. **RLS** limita leitura/escrita à própria conta real; sessões anônimas não acessam esses perfis.
- A foto é convertida no navegador em WebP 320×320 e enviada ao bucket **privado** `portal8-avatars`. Políticas restringem cada usuário ao arquivo `<user-id>/avatar.webp`. A foto é baixada autenticada, e seu URL local em memória é descartado ao sair da conta.
- A indicação **Proprietário autorizado** só aparece se a conta estiver cadastrada em `public.portal803_admins`, com verificação de RLS. Ela não depende de texto ou papel escrito pelo aluno. Nenhuma conta nova ganha poderes administrativos automaticamente.
- O indicador **Nível de estudos** é ilustrativo e calculado somente a partir dos dados locais do navegador. Não é ranking entre colegas nem histórico sincronizado.
- Dados de estudo antigos permanecem locais por padrão e não são transferidos automaticamente para uma conta online. O projeto permanece utilizável sem login.
- **Atenção:** confirmação por e-mail requer autorizar o URL do GitHub Pages no Supabase Auth → URL Configuration. Links de e-mail só levam ao site; depois da confirmação pode ser necessário entrar manualmente.
- Os arquivos do recurso são `assets/portal8-perfil.css` e `assets/portal8-perfil.js`. O cache offline foi atualizado, mas cadastro, login e upload de imagem dependem de conexão.
- Para proteção de menores, fotos e apresentações são **privadas**. Não há busca pública de alunos, chat nem lista de perfis.

### Emblema de administrador e nome de exibição

- O campo **Meu nome no portal** permite escrever nome ou apelido, independentemente do tipo da conta.
- O nome fica separado do selo **👑 Administrador autorizado**, que só é exibido após consultar `portal803_admins` com a sessão autenticada (RLS).
- Contas administrativas verificadas recebem, por padrão, o emblema azul/dourado `assets/avatar-administrador.svg` se ainda não tiverem foto própria.
- O botão **Usar emblema de administrador** aparece somente para contas autorizadas; é possível continuar usando uma foto ou avatar pessoal, protegido pelo bucket privado.
- O desenho do emblema é público como recurso visual do site; o selo visual **não concede permissões** nem modifica o Modo Proprietário.
- Versão do cache offline: `portal8-recursos-aprovados-v21`.

## Novidades automáticas e nome do mascote

- **Entrada do mascote corrigida:** a função `showView` chama `window.portal8MascotNavigate` diretamente depois de exibir cada ferramenta. O livro aparece com movimento curto no centro e depois permanece no canto com seu balão.
- **Teste da animação:** na área Acessibilidade há um botão **▶ Testar animação do mascote**. O comportamento respeita a preferência de redução de movimento do sistema e a configuração de transições do portal.
- **Renomear para toda a escola:** um administrador aprovado acessa **Modo Proprietário → Renomear o mascote do portal** e escolhe um nome com 2–24 caracteres. A configuração fica na tabela `public.portal8_site_settings`; RLS só permite a edição pela conta presente em `public.portal803_admins`. O nome padrão do mascote atualmente é **Neo**, e o administrador pode personalizá-lo.
- **Mural de novidades:** `assets/portal8-updates.json` mostra mudanças importantes do **site** no quadro **Avisos e provas** e no carrossel da página inicial, claramente separadas dos comunicados oficiais no Supabase.
- **Registro automático:** o workflow `.github/workflows/publicar-atualizacoes.yml` publica no JSON quando a alteração enviada ao GitHub na branch `main` tem `[importante]` na mensagem do commit. Ele usa apenas o `GITHUB_TOKEN` do repositório, sem chaves do Supabase. Modificações pequenas sem essa marcação não são anunciadas.
- Esta regra não consegue avaliar sozinha o significado de toda mudança; **é quem publica que marca as versões relevantes**. A publicação na web depende da conclusão do GitHub Pages.
- Nenhum aviso é inserido automaticamente na tabela de comunicados oficiais da escola, e a alteração do nome do mascote não muda permissões dos alunos.

## Identidade Horizonte Missão Paz — versão 23

- **Nova apresentação original da página inicial** com azul profundo, turquesa, dourado suave, cantos alternados e padrão gráfico próprio. A referência de estudo foi apenas inspiração de usabilidade; a marca, textos, cores, composição e ilustrações são do Portal Missão Paz.
- O bloco **Bem-vindo** apresenta o nome da conta (quando houver) e mantém dois atalhos funcionais para Trilha e Tutor.
- Os números de trilha, questões e acertos espelham o **painel local existente**, não simulam módulos ou sincronização na nuvem; o cálculo dos acertos só aparece após responder questões.
- O livro mascote ganhou **capelo azul e cordão dourado** sem mudar rosto, corpo, olhos, braços ou pernas. A animação anterior e o nome editável pelo Proprietário foram mantidos.
- O cartoon aprovado permanece na capa, agora numa faixa editorial mais compacta; todo conteúdo antigo da página inicial continua abaixo do resumo.
- As **28 ferramentas**, seis turmas, histórico, alertas, login, perfil privado, dados de Supabase, conteúdo oficial e permissões administrativas permanecem no código.
- Arquivos dedicados: `assets/portal8-horizonte.css` e `assets/portal8-horizonte.js`. Cache offline atualizado para `portal8-recursos-aprovados-v23`; o novo painel funciona com dados locais e não exige login.
- Testado por verificação estática das 28 rotas, IDs únicos, existência de todos os indicadores, sintaxe dos scripts e referências dos novos arquivos. A validação visual no navegador deve ser feita após GitHub Pages concluir o deploy.

## Menu harmonizado e calendário escolar restante de 2026 (versão 25)

- A correção de paleta passou a ser aplicada **depois dos estilos anteriores, em todos os temas (Aurora, Noite e Papel)**, com azul-marinho, azul médio, turquesa suave e seleção azul-claro. A alteração é estritamente visual; os 28 destinos de navegação permanecem inalterados.
- A foto enviada pelo usuário mostra o **Calendário 2026 do Instituto Educacional Missão Paz**, incluindo legenda de feriados, sábado letivo, término do ano letivo, planejamento e recesso.
- Apenas marcações **a partir de segunda-feira, 16/11/2026**, foram transcritas para `assets/calendario-escolar-2026-restante.json`.
- Eventos incluídos: **20/11** feriado (Consciência Negra); **28/11** sábado letivo; **07/12** recesso; **08/12** feriado (Aniversário de Belo Horizonte); **14/12** fim da 3ª etapa; **15/12** término do ano letivo; **16–18/12** e **21–23/12** planejamento; **25/12** Natal; **28–31/12** recesso.
- Esses eventos aparecem na página inicial e na seção **Calendário e horários**, com cópia de segurança no script `assets/portal8-calendario-final2026.js` para uso offline. As provas existentes e os horários da 803 não foram removidos ou modificados.
- Os registros são baseados na folha impressa fotografada; eventuais alterações devem ser confirmadas com a secretaria. Nada foi incluído retroativamente antes de 16/11.

## Neo Tutor Local gratuito (versão 26)

- O chat da seção **Tutor grátis** continua sendo uma das **28 ferramentas** e agora tem motor próprio em `assets/neo-tutor-local.js`. O nome Neo é o escolhido pelo administrador; a configuração de nome do mascote no Supabase permanece independente.
- Funciona sem chave de API, sem assinatura e sem custo de inferência, após a primeira carga do site. Não é a API OpenAI/ChatGPT nem um modelo generativo treinado do zero. **Não promete respostas ilimitadas para todo conhecimento humano:** as capacidades são determinadas por regras e conteúdos escolares já registrados.
- Agora oferece contexto de uma pergunta anterior, pedidos como **“mais simples”**, exemplos ligados ao resumo, **cartões de revisão com resposta** e operações matemáticas verificáveis (aritmética de dois números, percentuais e equações lineares de um único x).
- O modo de perguntas sobre os cartões não dá nota a respostas abertas; a comparação é feita pelo estudante. Quando um assunto não existe no acervo, o tutor informa a limitação em vez de produzir fatos inventados.
- O chat não usa `fetch`, não transmite as perguntas e não grava o histórico no banco nem no `localStorage`. O botão **Limpar conversa** apaga o histórico na tela e o contexto mantido na memória da aba.
- Os simulados, cartões antigos, conteúdo aprovado, controle de acesso, perfis, dados armazenados e demais ferramentas foram preservados.
- Atualização do cache: `portal8-recursos-aprovados-v26`.

## Ateliê Neo e nove melhorias complementares (versão 27)

A lista original de 20 propostas não foi preservada integralmente nas fontes recuperáveis. O autor do portal havia selecionado 11 funcionalidades: **01, 05, 06, 07, 08, 10, 12, 13, 15, 16 e 19**, que continuam implementadas. Os números não selecionados eram **02, 03, 04, 09, 11, 14, 17, 18 e 20**, mas seus títulos originais não foram verificados. Os nove recursos abaixo são **melhorias novas e complementares**, identificadas de **A a I** na interface para não confundir com os números da lista antiga. Não são apresentados como reconstrução literal da proposta original.

- **A Planejador semanal:** campos para todos os dias com salvamento local por turma
- **B Checklist de materiais:** marcações privadas e botão de reiniciar
- **C Glossário escolar:** busca entre definições curtas de várias matérias
- **D Calculadora de média:** valores de exemplo de 0 a 12, sem alterar boletim
- **E Mapa de ideias:** tema central e quatro ramificações, com opção de copiar
- **F Pergunta-surpresa:** perguntas de revisão, filtradas por matéria, com resposta para conferir
- **G Leitura em voz alta:** síntese de voz fornecida pelo navegador, sem upload do texto
- **H Busca de ferramentas:** pesquisa entre as opções existentes do menu
- **I Microplano de revisão:** proposta curta com três blocos flexíveis

Uma nova área **🧰 Ferramentas extras → ⭐ Ateliê Neo** foi adicionada ao menu sem excluir ou alterar os 28 destinos anteriores; agora são 29 áreas navegáveis. O painel inclui também uma lista **nova** de 12 ideias futuras, com ⭐⭐⭐ prioridade alta, ⭐⭐ média e ⭐ opcional, e checkboxes que registram as preferências neste navegador. Marcar ideias **não** cria, publica ou instala funcionalidades.

Os arquivos são `assets/neo-lab.js` e `assets/neo-lab.css`; o cache offline foi atualizado para `portal8-recursos-aprovados-v27`. Não há novas tabelas, APIs pagas, exigência de login ou coleta de dados nesta versão. O histórico de outras áreas, permissões Supabase, dados escolares e o mascote Neo foram preservados.

## Versão 28 — Ateliê Neo visível e favicon da marca

- O Ateliê Neo já estava publicado, mas era pouco visível: estava escondido numa categoria de menu recolhida. Agora a categoria **✨ Novidade: Ateliê Neo** fica logo depois de Início, e há um cartão e botão de acesso direto na página inicial.
- Link direto para abrir a ferramenta: `?ferramenta=neoLab&versao=28`, interpretado por `assets/neo-acesso-rapido.js`. O atalho só permite abrir a área pública `neoLab`.
- O navegador passa a exibir o favicon `assets/icone-portal-missao-paz.svg`, inspirado na pomba azul do recurso existente `assets/missao-paz-logo-portal.svg`, no lugar do ícone genérico. Não é apresentado como logotipo oficial da escola.
- O novo CSS `assets/neo-acesso-rapido.css` destaca o recurso sem alterar as 29 áreas, a aparência do Neo, o login, as políticas do banco ou os estudos armazenados.
- Cache offline atualizado para `portal8-recursos-aprovados-v28`. O ícone pode demorar a mudar em navegadores que mantenham um cache separado para favicons; uma aba nova ou recarregamento completo pode ajudar.

## Versão 29 — Mapas Mentais Neo e Ateliê administrativo

- **Nova aba pública 🧠 Mapas Mentais Neo**, na categoria Aprender: o aluno escolhe matéria, capítulo/assunto específico, acrescenta ramificações próprias e gera um diagrama SVG; pode baixar o mapa e copiar seu esquema textual. O gerador busca assuntos e cartões locais existentes, sem API ou custo, e não inventa explicações onde faltam dados.
- **Ateliê Neo removido do destaque da página inicial** e do menu público. O botão **🧪 Ateliê Neo** aparece exclusivamente dentro do **Modo Proprietário**, após login autorizado. Existe também um item escondido sob Administração, revelado somente após consulta autenticada à tabela `portal803_admins` no Supabase.
- **Bloqueio direto de navegação:** a função `showView('neoLab')` recusa a abertura sem autorização confirmada e redireciona para Modo Proprietário, inclusive quando é chamada por um endereço antigo. Mudanças de autenticação removem o acesso quando a sessão é encerrada.
- **Importante sobre segurança:** GitHub Pages é um serviço estático e seus arquivos JavaScript são publicamente acessíveis; esconder a interface e validar o login **não mantém o código-fonte dos protótipos secreto**. Nenhum dado administrativo secreto foi incluído no Ateliê. Qualquer dado administrativo real continua protegido pelas regras RLS do Supabase.
- **12 ideias adicionadas como protótipos experimentais:** banco de questões por dificuldade, revisão por matéria com referência a provas, backup local (simulação de sincronização), opções de acessibilidade, exemplos resolvidos do acervo, cartões personalizados locais, apresentação de resumos, trilha de recuperação, temas decorativos, animação do Neo, cartaz imprimível e atalhos favoritos. Não são funcionalidades publicadas aos alunos. A sincronização real na nuvem **não está ativada**.
- **Novas ideias derivadas do mapa mental:** gerar perguntas a partir de ramificações, comparar mapas, histórico de mapas, ligações entre conceitos e apresentação animada. Estão registradas apenas como sugestões futuras.
- **Todos os 29 destinos anteriores permanecem no código**; a aba Mapas Mentais Neo é a 30ª. Login, calendário, provas, avatar, nome do Neo, tutoria e seis turmas mantidos.
- Arquivos: `assets/neo-mapas-mentais.js`, `assets/neo-mapas-mentais.css`, `assets/neo-prototipos-admin.js` e `assets/neo-admin-gate.js`. O cache offline foi renovado para `portal8-recursos-aprovados-v29`.
- Testes estáticos: 30 rotas verificadas; referências DOM resolvidas; sem IDs duplicados; sintaxe de JavaScript validada. O uso no navegador publicado e um login real de administrador ainda precisam ser conferidos depois do deploy.

## Versão 30 — Cards, mapas avançados e invenções no Ateliê Neo

- **Mapas Mentais Neo** mantém sua aba pública na área Aprender e passa a incluir: (1) cards de estudo com quatro visuais (Azul Neo, Menta, Dourado e Caderno), (2) cartões derivados do acervo e das próprias ideias com aviso claro quando a resposta não foi verificada, (3) mapas favoritos locais, (4) comparação lado a lado de dois assuntos, (5) conexões criadas entre conceitos, (6) apresentação sequencial de ramos, (7) desafios de recordação e (8) checklist e exportação de esquema em texto. Arquivos novos: `assets/neo-ideias-mapas.js` e `assets/neo-ideias.css`.
- **Ateliê Neo** continua apenas na área de administração, com interface disponível somente após login autorizado via `portal803_admins` e bloqueio de navegação. Os arquivos-fonte do site estático permanecem publicamente acessíveis; não há dados secretos no laboratório. O nome e as permissões do Neo não foram alterados.
- Foram adicionados **nove novos protótipos interativos** no Ateliê: linha do tempo ordenada, quadro Kanban de tarefas, roleta de assuntos cadastrados, jogo de associação com flashcards, bingo pessoal de revisão, estúdio de cards com quatro temas, criador de roteiros de perguntas, painel de revisão e diário local de descobertas. Arquivo novo: `assets/neo-estudio-inovacoes.js`. Todos são protótipos locais, ainda não liberados aos alunos.
- As cinco ideias anteriores de mapas — perguntas por ramificação, comparação, histórico/favoritos, ligações e apresentação sequencial — foram incorporadas. A versão também inclui opções adicionais de cards, checklist e exportação.
- **Privacidade:** informações dos cartões personalizados, mapas favoritos e experimentos são guardadas somente no dispositivo; não são sincronizadas nem publicadas para outros alunos. Exemplos programáticos não constituem correção de respostas abertas por IA.
- As **30 áreas existentes** e a infraestrutura do Supabase permaneceram sem alterações. Novo cache offline `portal8-recursos-aprovados-v30`.
- Verificação estática: 30 rotas de navegação, IDs únicos, referências de DOM, presença dos arquivos e sintaxe de todos os scripts atualizados. O comportamento visual e a autenticação em navegador real ainda precisam de teste após publicação.

## Versão 31 — Arcade Educativo Neo: minijogos reais

- Nova aba **🕹️ Arcade Educativo Neo** em **Praticar**: três jogos completos em Canvas, com movimento, colisões, objetivos, vidas, pontuação, reinício, pausa, feedback e controles para teclado e celular. Não são perguntas com botões decorativos.
- **🏃 Corrida das Frações (Matemática):** jogo de plataformas com velocidade horizontal, gravidade, pulo, plataformas em diferentes alturas, coleta de frações equivalentes, erros que descontam corações e missão de seis coletas corretas.
- **🧬 Missão Célula (Ciências):** exploração de um cenário com obstáculos, deslocamento em duas dimensões, transporte de organelas até setores funcionais (mitocôndria/energia, ribossomo/proteínas e núcleo/comando), obstáculos móveis e vitória ao completar as três entregas.
- **📝 Ritmo dos Conectivos (Português):** jogo de reflexos com três pistas, movimento lateral, palavras em queda, seleção de conectivos de oposição, adição e conclusão, progressão de velocidade e dez acertos para concluir.
- **Gratuito e privado:** não utiliza API, serviço pago, contas externas, anúncios ou ranking público. Salva apenas os recordes no `localStorage` deste dispositivo. Não altera pontuação das provas ou notas escolares.
- **Responsividade:** canvas em proporção 9:5, setas digitais e controle de pulo para dispositivos de toque. Pausa ao sair da ferramenta ou colocar a página em segundo plano.
- Os arquivos são `assets/neo-arcade.js` e `assets/neo-arcade.css`; o cache offline foi atualizado para `portal8-recursos-aprovados-v31`. As 30 áreas anteriores permanecem intactas, totalizando 31.
- Os scripts passaram por validação de sintaxe e integração de arquivos. A jogabilidade, visual final e performance em aparelhos reais exigem teste no site publicado.

## Versão 32 — Neo Mapas Inteligentes e nome correto do mascote

- Corrigido o nome falado no balão do mascote: a saudação não contém mais o nome antigo como texto fixo. O nome apresentado vem de `portal8_site_settings` (Supabase) e é guardado em cache local para funcionar na próxima abertura e offline. **Neo** é apenas o nome padrão; renomeações legítimas feitas em Modo Proprietário continuam prevalecendo. Também foram atualizados os rótulos de acessibilidade do mascote e adicionadas dicas nas abas Mapas, Arcade e Ateliê.
- `assets/neo-mapas-mentais.js` foi recriado como **motor especializado local** (não é um modelo generativo nem um serviço ChatGPT) com seleção por relevância dos conteúdos existentes: capítulos/tópicos e cartões da própria matéria, além das anotações fornecidas pelo aluno. Ele não inventa conceitos quando não encontra correspondências.
- Mapas SVG reorganizados em **duas colunas, tema central em destaque, ramificações em caixas de largura fixa, curvas de ligação e espaçamento estável**. Quatro paletas: Oceano Neo, Aurora, Natureza e Caderno. O mapa pode ser baixado em SVG ou copiado como esquema de texto. As opções de cards e favoritos anteriores permanecem no site.
- `assets/neo-mapas-mentais.css` foi aprimorado para telas pequenas e espaços de prévia.
- Cache offline atualizado para `portal8-recursos-aprovados-v32` e as referências dos arquivos receberam `?v=32` para evitar uso da versão antiga.
- Validação: todas as 31 rotas preservadas e sem identificadores duplicados; scripts sintaticamente corretos; teste simulado gerou seis ramificações em posições sem sobreposição. A renderização real deve ser conferida após a publicação no GitHub Pages.

## Versão 33 — Diretor Neo, flashcards inteligentes e ideias inovadoras

- A ferramenta **Aprender → Memorização** já continha flashcards com pergunta e resposta por matéria. Eles foram mantidos, e ganharam uma seção de **revisão inteligente**, com indicação de facilidade para lembrar, seleção de cartões devidos, revisão espaçada, modo de treino livre e botão de limpar o histórico da matéria. O estado é mantido somente no navegador. Não há correção automática de respostas abertas.
- A página inicial ganhou **Neo recomenda: meu próximo estudo**, um roteiro de leitura, cartões, mapas mentais e prática formado a partir do acervo disponível e de cartões que o aluno escolheu para revisar. Trata-se de sugestão flexível; não atribui notas nem impõe metas.
- O **Diretor de Desafios Neo** em `assets/neo-game-brain.js` acompanha acertos e erros *durante a partida atual* e ajusta suavemente a velocidade nos jogos Ciências e Português, além de oferecer ajuda ao salto em Matemática após dificuldades. Oferece dicas de conteúdo já preparadas e controles para adaptação equilibrada, leve ou desativada. Os dados de partida não são enviados nem gravados em servidor. Também foi aumentada a frequência de conectivos corretos para tornar o minijogo mais justo.
- Estes sistemas são **motores de regras adaptativas locais**, sem LLM ou API generativa. Não devem ser apresentados aos alunos como ChatGPT ou como sistemas capazes de compreender qualquer resposta.
- O **Ateliê Neo administrativo** ganhou mais quatro protótipos: missões interdisciplinares com tópicos do currículo, radar de revisão escolhido pelo estudante, cápsula de aprendizagem para comparar anotações, e campanhas de cartões em três etapas. São testes locais e não estão liberados ao público.
- Arquivos novos: `assets/neo-study-brain.js`, `assets/neo-game-brain.js`, `assets/neo-inteligencia.css`, `assets/neo-inovacoes-v33.js`. `assets/neo-arcade.js` recebeu os pontos de integração. Cache offline: `portal8-recursos-aprovados-v33`.
- Todas as **31 ferramentas** anteriores, o login Supabase, o mascote Neo, os mapas mentais e dados de aulas foram preservados. Testes estáticos e simulação dos flashcards e da lógica adaptativa foram realizados; a verificação visual em dispositivos reais requer validação após a publicação.

## Versão 34 — Ateliê separado e upgrade das 31 ferramentas

- **Separação do Ateliê:** a bancada de experiências com mapas mentais e cards avançados (`neoIdeasPanel`) foi movida para dentro de `neoLab`, que já é protegido na interface por autenticação administrativa do Supabase. A aba pública **Mapas Mentais Neo** agora mantém o gerador de mapas, sem o laboratório experimental. Os flashcards escolares aprovados continuam públicos em **Aprender → Memorização**. Ferramentas experimentais não foram apagadas.
- **Upgrade transversal de interface:** todas as 31 áreas receberam barra de ações contextual, busca rápida de ferramentas, favoritos locais, atalho de retorno ao painel e cópia de link direto. Use **Ctrl+K** ou **⌘+K** para encontrar ferramentas pelo nome ou categoria.
- A busca e os links só oferecem ferramentas que podem ser abertas no menu: o Ateliê exige permissão administrativa verificada e não é liberado pela nova busca. Os links de áreas públicas usam `?ferramenta=<id>`; a checagem de `neoLab` segue exclusiva do Modo Proprietário.
- **Acessibilidade e layout geral:** foco visível com teclado, alvos maiores de toque, tratamento de textos longos, campos responsivos e suporte a preferências de movimento reduzido. Não foram modificados os registros escolares, as 31 rotas, o login Supabase ou as fórmulas das ferramentas.
- Novos arquivos `assets/portal-ux-v34.css` e `assets/portal-ux-v34.js`. Cache offline alterado para `portal8-recursos-aprovados-v34`.
- Validação estática: 31 ferramentas presentes, identificadores HTML exclusivos, scripts com sintaxe correta e bancada experimental confirmada fora da área pública de mapas. A usabilidade e o visual precisam de teste real no navegador depois da publicação.

## Versão 35 — experiências aprovadas disponíveis a todos na Oficina Criativa Neo

- O usuário aprovou todas as ideias que estavam no Ateliê. Para não expor o painel administrativo, o conteúdo funcional foi promovido para uma nova **área pública separada**, `neoOficina`, acessível em **🎨 Criar e explorar → ✨ Oficina Criativa Neo**. A página inicial ganhou botão direto.
- A Oficina reúne os **9 utilitários A–I** (planejamento, checklist, glossário, média, mapas de ideias em texto, pergunta-surpresa, leitura em voz alta, pesquisa de ferramentas, microplano); os **8 recursos de mapas e cards** (cards em estilos, favoritos locais, comparação, conexões, apresentação, perguntas, checklist, exportação); os **12 protótipos de revisão/organização**; os **9 experimentos de criação e jogos**; e as **4 inovações interdisciplinares**. São **42 experiências/controles** agrupados, com recursos de escopo variado. Muitas são atividades guiadas e outras são prévias locais, não produtos generativos completos.
- Recursos já públicos como Flashcards em Memorização, Arcade, Mapas Mentais e Tutor foram preservados e não duplicados como novas rotas. A Oficina é a 32ª área do portal; as 31 anteriores continuam no menu.
- O **Ateliê Neo** permanece no **Modo Proprietário** com autenticação administrativa e agora se destina a decidir futuras melhorias e acompanhar ideias. A remoção do conteúdo experimental foi feita sem apagá-lo: os mesmos elementos e IDs estão na Oficina pública.
- O antigo botão de “sincronização opcional” foi renomeado para **Backup local de preferências**. Exporta/importa dados locais do planejador e checklist, corrigindo o armazenamento usado pelo botão. **Não há sincronização na nuvem**, nem backup de contas Supabase. Conteúdos dos alunos continuam no próprio dispositivo, a menos que outra ferramenta previamente existente já utilize banco de dados.
- Os textos das experiências publicadas foram atualizados para explicar se são atividades, protótipos ou funções locais. Nenhuma opção de demonstração é anunciada como serviço completo, e nenhuma nova política de acesso ao Supabase foi criada.
- Novo arquivo `assets/neo-oficina-v35.css` e cache `portal8-recursos-aprovados-v35`. Scripts das experiências receberam versão `?v=35` para expirar cache antigo.
- Testes estáticos: scripts atualizados compilam, 32 rotas se correspondem, IDs não duplicados, todos os grupos e bancadas estão na Oficina, e navegação para Ateliê continua sob validação administrativa. Verificação visual e funcional de cada experiência em aparelho real ainda é recomendada depois do deploy.

## Versão 36 — nome Neo em todas as apresentações do mascote

- Corrigidos textos históricos ainda exibidos em recursos de estudo, inclusive a seção de mascote experimental, que agora se apresenta como **Neo**.
- Atualizados os títulos acessíveis do SVG do mascote e do avatar administrativo para usar **Neo**.
- O texto do balão utiliza o nome cadastrado em `portal8_site_settings`, com **Neo** como nome padrão. A configuração do administrador foi preservada.
- Os nomes de arquivos antigos, classes CSS e identificadores internos permanecem inalterados para garantir compatibilidade com o site, caches e progressos já salvos. Esses identificadores técnicos não aparecem nos textos para alunos.
- Cache offline `portal8-recursos-aprovados-v36` com nova versão de imagem e scripts para os navegadores carregarem a correção.

## Versão 37 — três pontinhos do Daniel e Arcade por fases

- **Organização sugerida pelo Daniel:** controles repetidos das 32 ferramentas agora ficam num menu acessível de **três pontinhos (⋯)**. A barra de navegação principal também ganhou menu compacto, com busca, início, jogos, mapas, flashcards e Oficina Criativa. Mantidos atalhos `Ctrl+K`/`⌘+K`, favoritos, links e permissões administrativas.
- **Página inicial mais limpa:** os avisos antigos sobre mapas e Oficina foram agrupados num painel recolhível **Outras novidades do portal**. O Arcade e o roteiro de estudos continuam fáceis de localizar.
- **Arcade Educativo Neo melhorado:** o catálogo dos três jogos ganhou cartões visuais originais e responsivos. Cada jogo agora possui três missões selecionáveis: **Explorador**, **Missão** e **Desafio**, com metas e vidas adequadas. Uma barra de progresso mostra a evolução de cada fase; trocar de fase reinicia a partida. Os recordes são pessoais e separados por fase, sem ranking público. O Diretor Neo adaptativo e as opções de toque permanecem ativos.
- **Metas por jogo:** Frações com 3/6/9 coletas, Célula com 2/3/3 entregas, Conectivos com 6/10/15 acertos (Explorador/Missão/Desafio, respectivamente). Observar o desafio não muda notas nem boletins.
- **Referências conceituais públicas:** Meu Bernoulli (organização de conteúdos e progresso), Geppetto (missões e adaptação de desafios), Escola Games (jogos de interação direta e objetivos claros). Foram usados apenas conceitos gerais; o visual, os textos, os jogos, os personagens e o código são originais do Missão Paz. Não há parceria nem integração com essas plataformas.
  - Meu Bernoulli: https://www.bernoulli.com.br/sistema-de-ensino/diferenciais/tecnologias-educacionais/
  - Geppetto: https://www.geppetto.com.br/
  - Escola Games: https://www.escolagames.com.br/
- **Novos arquivos:** `assets/portal-tres-pontinhos-v37.js`, `assets/portal-tres-pontinhos-v37.css`, `assets/neo-arcade-missoes-v37.css`. Atualizado `assets/neo-arcade.js`. Cache offline `portal8-recursos-aprovados-v37`.
- **Validação:** 32 rotas preservadas, IDs únicos, scripts sintaticamente corretos. Início e desenho das nove combinações de jogo e fase validados em uma simulação de navegador. Não houve validação visual real em dispositivos físicos; jogos e menus devem ser testados no site publicado.

## Versão 38 — minijogos Visual 2.0 (teste)

- **Arcade Educativo Neo — teste de visual completo:** o aluno pode alternar entre `✨ Visual 2.0 — personagens e cenários (TESTE)` e `⚪ Visual clássico` diretamente no Arcade. O novo visual é escolhido por padrão; a preferência é mantida apenas no navegador. A lógica anterior permanece acessível para comparação.
- **🏃 Corrida das Frações:** o jogador agora aparece como um aventureiro 2D com cabeça, boné, corpo, mochila, pernas e braços animados, em cenário com céu, montanhas, nuvens e plataformas com textura. As bolinhas de frações viraram **cartas retangulares ilustradas** com valores e estrelas. O pulo ganhou pequenas janelas de tolerância na saída e chegada a plataformas.
- **🧬 Missão Célula:** o jogador se transforma em **explorador de laboratório** com jaleco e capacete. Mitocôndrias, ribossomos e núcleo têm ilustrações próprias; vírus são inimigos com espinhos animados; paredes e estações receberam cenário celular colorido.
- **🛹 Ritmo dos Conectivos:** as pistas se tornaram uma cena com iluminação; o jogador é um corredor sobre prancha com corpo, cabeça, braços e botas. As palavras aparecem em **placas retangulares** no lugar de objetos redondos.
- **Efeitos leves de comemoração** aparecem em acertos e falhas; respeitam a preferência do sistema operacional por movimento reduzido. Os desenhos usam canvas, sem imagens importadas, downloads de recursos externos ou API paga.
- Os jogos mantêm as três fases (Explorador, Missão, Desafio), controles de teclado e toque, progresso e recordes locais, além do Diretor Neo de ajuda. Os gráficos não afetam notas escolares ou acesso administrativo.
- **Arquivos novos:** `assets/neo-arcade-arte-v38.js` e `assets/neo-arcade-arte-v38.css`. `assets/neo-arcade.js` ganhou integração de arte com fallback para o modo clássico. O cache foi atualizado para `portal8-recursos-aprovados-v38`.
- **Validação:** os 18 cenários de inicialização/desenho (3 jogos × 3 fases × 2 estilos) passaram em simulação com canvas substituto; 32 áreas, navegação e IDs preservados. Teste visual e de desempenho em navegador/dispositivo real ainda necessário.

## Publicação

Publicação atual pelo GitHub Pages: https://miguelhenriquecostaaraujo13-cmd.github.io/Missao-803/

Para publicar também no Netlify, entre em https://app.netlify.com, importe o repositório `miguelhenriquecostaaraujo13-cmd/Missao-803`, use a branch `main`, deixe o comando de build vazio e o diretório de publicação como `.` (raiz). Escolha um nome relacionado ao Portal 8º Ano se estiver disponível. A URL `portal803.netlify.app` só pode ser confirmada no painel Netlify, após criá-la. Não é necessário plano pago.

**Importante:** O histórico salvo no navegador sob o endereço do GitHub Pages não é automaticamente transferido para o novo domínio do Netlify. Exporte seus dados antes da mudança, quando possível.

O repositório permanece com o nome `Missao-803`, mas o nome público da plataforma é **Portal 8º Ano Missão Paz**.

## Gratuidade e limitações

- Não usa OpenAI nem outra API generativa paga; o tutor usa respostas locais e as questões por texto são criadas por regras, não por uma IA generativa.
- As metas, simulados, progresso e anotações pessoais ficam salvos principalmente **no navegador e dispositivo de cada aluno**. Limpar os dados do navegador pode apagar registros locais. Quando disponível, use a exportação de progresso/caderno.
- A biblioteca colaborativa usa Supabase e precisa de internet, conexão de usuário, permissões adequadas e **aprovação dos materiais por um responsável** antes de ser liberada para a turma.
- O espaço do professor é informativo e **não** concede acesso administrativo nem aprovação direta pelo site.
- O modo offline faz cache de arquivos principais após ativação, mas deve ser testado no navegador e **não** permite acesso aos recursos colaborativos sem internet.
- Evite incluir dados pessoais, senhas, contatos, fotos de colegas ou informações privadas em publicações.

**Projeto independente, não oficial da escola.**
