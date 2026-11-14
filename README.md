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

## Pazinho — livrinho interativo

- Ao trocar entre as **27 ferramentas**, o Pazinho aparece no canto inferior direito e mostra um **balão de fala com dica específica** da área aberta.
- Cada área tem duas frases que se alternam. Clique no mascote ou no botão **✨ Outra dica** para ver mais uma. O balão fecha automaticamente após cerca de 5 segundos ou pelo botão ×.
- A primeira visita da sessão também mostra uma saudação. O mascote continua disponível no cantinho, sem bloquear o uso da página.
- Em **Acessibilidade** há a opção **Mostrar o Pazinho e suas dicas ao abrir ferramentas**. Ela pode ser desativada e a escolha fica apenas no dispositivo (`portal8-pazinho-enabled-v1`).
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
- **Renomear para toda a escola:** um administrador aprovado acessa **Modo Proprietário → Renomear o mascote do portal** e escolhe um nome com 2–24 caracteres. A configuração fica na tabela `public.portal8_site_settings`; RLS só permite a edição pela conta presente em `public.portal803_admins`. Até que seja alterado, o nome continua `Pazinho`.
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
