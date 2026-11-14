# Portal 803 🎓⚡

**Conecte seu conhecimento. Evolua a cada missão!**

Plataforma independente e gratuita de estudos para a turma 803.

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
- O administrador pode criar ou excluir anúncios e provas; o mural da página inicial mostra as publicações para todos.
- As três tabelas são `public.portal803_admins`, `public.portal803_announcements` e `public.portal803_exams`.
- A tabela de proprietários começa **vazia**; ninguém vira dono apenas por se cadastrar.
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

## Evolução do Portal 803 — etapas

### Etapa 1: organização e navegação (implementada)
- Página inicial com pesquisa de ferramentas por nome ou categoria, inclusive com pesquisa sem acentos.
- Atalhos rápidos para trilha, simulados, calendário, caderno, biblioteca e lembretes.
- Ferramentas favoritas (até 12) e botão para retomar a última área utilizada.
- Preferências guardadas **somente no navegador** em `portal803-favorite-tools-v1` e `portal803-last-tool-v1`.
- Todas as 22 ferramentas e os três temas de visual preservados. As chaves de progresso e do Supabase não foram alteradas.

### Etapas 2, 3 e 4 (implementadas)
- **Etapa 2:** níveis de compreensão por tópico (🟢 Entendi, 🔵 Quase entendi, 🩷 Preciso revisar), checklist por matéria e caderno privado de erros dos simulados na aba **Revisão para provas**.
- **Etapa 3:** gráfico do histórico diário de acertos nos simulados a partir desta atualização, e calendário mensal mostrando tarefas locais, cronograma inicial e datas oficiais cadastradas no Supabase.
- **Etapa 4:** controles locais de tamanho da fonte, alto contraste e animações, além de formulário opt-in de relatos privados de problemas/sugestões. O proprietário aprovado acessa esses relatos pelo Modo Proprietário.
- O histórico, os checklists e os níveis de compreensão ficam apenas no armazenamento local do aluno. Os relatos enviados são armazenados no Supabase, protegidos por políticas RLS que limitam a leitura ao autor e aos administradores autorizados. Ações de exclusão e resolução de relatos não estão disponíveis na interface nesta versão.
- As 26 áreas continuam usando o mesmo login, autenticação, dados de estudo e temas preexistentes. Testar no celular e em diferentes navegadores após publicação.


## Publicação

Publicação atual pelo GitHub Pages: https://miguelhenriquecostaaraujo13-cmd.github.io/Missao-803/

Para publicar também no Netlify, entre em https://app.netlify.com, importe o repositório `miguelhenriquecostaaraujo13-cmd/Missao-803`, use a branch `main`, deixe o comando de build vazio e o diretório de publicação como `.` (raiz). Escolha o nome do projeto `portal803` se estiver disponível. A URL `portal803.netlify.app` só pode ser confirmada no painel Netlify, após criá-la. Não é necessário plano pago.

**Importante:** O histórico salvo no navegador sob o endereço do GitHub Pages não é automaticamente transferido para o novo domínio do Netlify. Exporte seus dados antes da mudança, quando possível.

O repositório permanece com o nome `Missao-803`, mas o nome público da plataforma é **Portal 803**.

## Gratuidade e limitações

- Não usa OpenAI nem outra API generativa paga; o tutor usa respostas locais e as questões por texto são criadas por regras, não por uma IA generativa.
- As metas, simulados, progresso e anotações pessoais ficam salvos principalmente **no navegador e dispositivo de cada aluno**. Limpar os dados do navegador pode apagar registros locais. Quando disponível, use a exportação de progresso/caderno.
- A biblioteca colaborativa usa Supabase e precisa de internet, conexão de usuário, permissões adequadas e **aprovação dos materiais por um responsável** antes de ser liberada para a turma.
- O espaço do professor é informativo e **não** concede acesso administrativo nem aprovação direta pelo site.
- O modo offline faz cache de arquivos principais após ativação, mas deve ser testado no navegador e **não** permite acesso aos recursos colaborativos sem internet.
- Evite incluir dados pessoais, senhas, contatos, fotos de colegas ou informações privadas em publicações.

**Projeto independente, não oficial da escola.**
