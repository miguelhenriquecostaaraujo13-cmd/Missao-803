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
- A plataforma foi ampliada de 26 para 27 áreas, mantendo os temas e as chaves de armazenamento antigas da 803. Testar no celular e em diferentes navegadores após publicação.


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
- O service worker contém o cartoon no cache offline da versão `portal8-missao-paz-animado-v9` para acesso após a primeira visita online.
- Preservadas as 27 seções e os registros locais existentes, inclusive os resultados históricos da 803.

## Pazinho — mascote interativo

- Ao trocar entre as **27 ferramentas**, o Pazinho aparece no canto inferior direito e mostra um **balão de fala com dica específica** da área aberta.
- Cada área tem duas frases que se alternam. Clique no mascote ou no botão **✨ Outra dica** para ver mais uma. O balão fecha automaticamente após cerca de 5 segundos ou pelo botão ×.
- A primeira visita da sessão também mostra uma saudação. O mascote continua disponível no cantinho, sem bloquear o uso da página.
- Em **Acessibilidade** há a opção **Mostrar o Pazinho e suas dicas ao abrir ferramentas**. Ela pode ser desativada e a escolha fica apenas no dispositivo (`portal8-pazinho-enabled-v1`).
- A entrada tem movimento suave e respeita as preferências de redução de movimento. Não há voz, rastreamento, cookies adicionais nem API paga.
- A ilustração de estudantes cartoon aprovada permanece **inalterada**. O mascote usa uma nova pombinha azul inspirada nas cores da identidade alternativa do próprio portal, em `assets/pazinho.svg`.
- Componentes independentes: `assets/portal8-pazinho.css` e `assets/portal8-pazinho.js`; a função `showView` emite `portal8:viewchange` após a navegação.

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
