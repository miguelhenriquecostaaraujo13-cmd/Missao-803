# Correção de autenticação — Portal Missão Paz

## Diagnóstico confirmado pela captura enviada

O link de confirmação foi aberto como **http://localhost:3000/** no celular. Isso não é o site público; é endereço de desenvolvimento. O erro *ERR_CONNECTION_REFUSED* não é prova de senha incorreta.

As páginas de login e criação de conta usam o Supabase Auth. O navegador guarda apenas o token da sessão pelo mecanismo do Supabase (`persistSession: true`), não a senha. A conta fica no Auth do Supabase; dados personalizados ficam em `portal8_profiles` e são associados ao `auth.uid()`.

## O que foi implementado no código

- Links de confirmação e recuperação passam o endereço público fixo `https://miguelhenriquecostaaraujo13-cmd.github.io/Missao-803/` como destino solicitado, sem usar localhost.
- A tela informa se o servidor está exigindo confirmação ou se a conta já entrou.
- Mantidos **Entrar** com e-mail/senha, **Esqueci minha senha** e **Reenviar confirmação**.
- Nova alternativa **Entrar com Google** (`signInWithOAuth({provider:"google",options:{redirectTo:...}})`): uma forma de autenticar com identidade verificada pelo Google sem pedir um código por e-mail enviado pelo portal, disponível após o responsável configurar o provedor.
- Sessões autenticadas continuam preservadas entre visitas com `persistSession:true` e `autoRefreshToken:true`.
- Acesso administrativo continua condicionado ao registro por `user_id` e às políticas do banco; nenhum privilégio é concedido pela interface.

## Configurações do servidor que precisam ser feitas pelo administrador do Supabase

**As ferramentas conectadas não permitem modificar essas opções administrativas. O código do GitHub não pode substituir esses ajustes.**

### 1. Corrigir URL que provoca localhost:3000

Abra o projeto Supabase e siga:

1. **Authentication → URL Configuration**
2. **Site URL:** `https://miguelhenriquecostaaraujo13-cmd.github.io/Missao-803/`
3. Em **Redirect URLs**, inclua exatamente `https://miguelhenriquecostaaraujo13-cmd.github.io/Missao-803/`.
4. Salve. Na configuração de produção, não use `http://localhost:3000` como endereço principal.
5. Teste novamente o envio de um e-mail de recuperação ou confirmação, verificando a URL de destino **sem publicar tokens privados**.

Painel: https://supabase.com/dashboard/project/mbltrucgwqozrujxifcx/auth/url-configuration

Documentação oficial: https://supabase.com/docs/guides/auth/redirect-urls

### 2. Habilitar login sem link de e-mail pelo Google

1. Em Google Auth Platform, crie um cliente OAuth para aplicação web, configurando origens autorizadas e a tela de consentimento. Escolha o público apropriado e somente os escopos básicos exigidos pelo Supabase.
2. Origem JavaScript do portal: `https://miguelhenriquecostaaraujo13-cmd.github.io`
3. URI de retorno OAuth no Google: copie o **Callback URL** mostrado em **Authentication → Providers → Google** no painel do Supabase; ele terá a forma `https://<project-ref>.supabase.co/auth/v1/callback`.
4. No painel do Supabase, ative o provedor **Google** e configure o Client ID e Client Secret **somente no servidor do Supabase**, nunca no `index.html` ou em arquivos públicos.
5. Confirme que a URL de retorno pública do item 1 está autorizada. Teste o botão **Entrar com Google** em um navegador privado.

Painel: https://supabase.com/dashboard/project/mbltrucgwqozrujxifcx/auth/providers?provider=Google

Documentação oficial: https://supabase.com/docs/guides/auth/social-sign-in/auth-google

**Importante:** entrar com Google pode criar uma identidade separada de uma conta anterior de e-mail/senha caso as identidades não estejam vinculadas. Não apague nenhuma conta existente; verifique o perfil antes de mudar de método. O provedor externo oferece autenticação sem código de verificação enviado pelo portal, mas ainda verifica a identidade da pessoa.

## Verificações depois da configuração

- [ ] Ao clicar no link de verificação, o endereço público do GitHub Pages abre, e não localhost
- [ ] Com Google habilitado, o botão inicia o login Google e retorna ao portal autenticado
- [ ] Ao voltar ao site no mesmo navegador, a conta permanece conectada
- [ ] Perfil privado carrega e permite atualizar nome/turma
- [ ] E-mail/senha antigo continua funcionando
- [ ] Contas de usuários não recebem acesso administrativo inesperado
- [ ] Recuperação de senha continua disponível
- [ ] Notas e progresso que eram locais não são descritos como sincronizados entre dispositivos

## Segurança

Não compartilhe senhas, códigos, links com tokens, Client Secret ou credenciais do Supabase. Não transforme contas visitantes ou cadastros não validados em administradores. Para uma escola, mantenha controles de identidade e moderação apropriados.
