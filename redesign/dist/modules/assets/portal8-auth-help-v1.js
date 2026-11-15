/* Mensagens claras e ajuda de confirmação do Supabase; sem expor dados de conta. */
(() => {
  "use strict";
  function emailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  }
  function errorMessage(error, action) {
    const code = String(error?.code || "").toLowerCase();
    const message = String(error?.message || "").toLowerCase();
    if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
      return "📩 Seu e-mail ainda não foi confirmado. Abra o e-mail de confirmação, verifique também o Spam e clique no link. Se precisar, use Reenviar confirmação.";
    }
    if (code === "over_email_send_rate_limit" || message.includes("email rate limit")) {
      return "⏳ O serviço de e-mails atingiu seu limite de envios. Tente novamente mais tarde ou peça ajuda ao responsável pelo portal.";
    }
    if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit" || error?.status === 429 || message.includes("after ") && message.includes("seconds")) {
      return "⏳ Muitas tentativas em pouco tempo. Aguarde um pouco antes de tentar de novo. Evite clicar várias vezes.";
    }
    if (code === "email_address_not_authorized" || message.includes("email address not authorized")) {
      return "📧 O servidor do portal ainda não está autorizado a enviar confirmações para este endereço. O administrador precisa configurar o envio de e-mails no Supabase.";
    }
    if (code === "weak_password" || message.includes("password should") || message.includes("password is too weak")) {
      return "🔒 A senha não atende aos requisitos de segurança. Para criar uma conta, use pelo menos 12 caracteres e siga os requisitos informados.";
    }
    if (code === "signup_disabled" || message.includes("signup is disabled")) {
      return "🔒 O cadastro de novas contas está temporariamente desativado pelo servidor.";
    }
    if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
      return "🔐 Não foi possível entrar. Confira o e-mail e a senha; se acabou de criar a conta, verifique se confirmou o e-mail.";
    }
    if (code === "user_already_exists" || message.includes("already registered")) {
      return "📩 Já pode existir uma conta com esse e-mail. Use Entrar ou confirme o e-mail recebido.";
    }
    if (code === "validation_failed" && message.includes("redirect")) {
      return "⚠️ O endereço público do portal precisa ser autorizado nas configurações de redirecionamento do Supabase.";
    }
    if (message.includes("provider is not enabled") || message.includes("provider not enabled") || code === "provider_disabled" || message.includes("unsupported provider")) {
      return "🔧 Entrar com Google ainda precisa ser ativado nas configurações de autenticação do portal. Continue usando e-mail e senha por enquanto.";
    }
    if (code === "email_provider_disabled") {
      return "O login por e-mail está indisponível no servidor do portal.";
    }
    if (message.includes("failed to fetch") || message.includes("network") || message.includes("sem conexão")) {
      return "📶 Não foi possível conectar ao servidor. Confira a internet e tente novamente.";
    }
    if (action === "signup") {
      return "Não foi possível concluir o cadastro agora. Confira os campos, tente novamente mais tarde ou peça ajuda ao responsável pelo portal.";
    }
    return "Não foi possível entrar agora. Confira suas credenciais, a confirmação do e-mail e a conexão.";
  }
  // A URL deve ser pública: links para localhost não abrem em outros celulares.
  const PUBLIC_PORTAL_URL="https://miguelhenriquecostaaraujo13-cmd.github.io/Missao-803/";
  function publicRedirectURL() { return PUBLIC_PORTAL_URL; }
  async function signInWithGoogle(client) {
    if(!client?.auth?.signInWithOAuth)throw new Error("A conexão segura não está disponível.");
    return client.auth.signInWithOAuth({
      provider:"google",
      options:{redirectTo:publicRedirectURL()}
    });
  }
  async function resendConfirmation(client, email, redirectTo) {
    if (!emailValid(email)) return {error: {code: "invalid_email", message: "invalid email"}};
    return client.auth.resend({
      type: "signup",
      email: String(email).trim(),
      options: {emailRedirectTo: redirectTo}
    });
  }
  function linkErrorMessage(info) {
    const code=String(info?.errorCode||"").toLowerCase();
    const error=String(info?.errorType||"").toLowerCase();
    if(code==="otp_expired"||code==="otp_disabled"||code==="token_expired"||
       error==="access_denied"||code==="invalid_token") {
      return "⚠️ Este link de verificação expirou ou já foi utilizado. Primeiro tente Entrar com seu e-mail e senha: a conta talvez já esteja confirmada. Se ainda precisar, solicite um novo e-mail e abra somente o link mais recente. Não compartilhe esse link.";
    }
    return "⚠️ Não foi possível usar o link do e-mail. Ele pode ter expirado ou já ter sido usado. Tente fazer login e, se necessário, solicite outro e-mail de confirmação.";
  }
  window.portal8AuthHelp = Object.freeze({
    emailValid, errorMessage, resendConfirmation, linkErrorMessage, publicRedirectURL, signInWithGoogle,
    confirmationMessage: "📩 Cadastro recebido! Verifique sua caixa de entrada e o Spam, abra o e-mail de confirmação e clique no link. Depois, faça login. Se não receber, toque em Reenviar confirmação.",
  });
})();