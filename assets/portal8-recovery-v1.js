/* Recuperação por e-mail, usando o Supabase Auth e nunca solicitando senhas por mensagens. */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const base=()=>location.origin+location.pathname;
const notice=window.portal8AuthLinkNotice||{};
const root=document.createElement("div");
root.id="p8RecoveryOverlay";root.hidden=true;
root.setAttribute("role","dialog");root.setAttribute("aria-modal","true");
root.setAttribute("aria-labelledby","p8RecoveryTitle");
root.innerHTML=[
'<div class="p8-recovery-card">',
'<span class="p8-recovery-brand">🔐 PORTAL MISSÃO PAZ</span>',
'<h2 id="p8RecoveryTitle">Esqueci minha senha</h2>',
'<p id="p8RecoveryIntro">Informe o e-mail cadastrado. Você receberá um link para escolher uma nova senha.</p>',
'<form id="p8RecoveryRequest">',
'<label for="p8RecoveryEmail">E-mail da conta</label>',
'<input type="email" id="p8RecoveryEmail" maxlength="254" autocomplete="email" placeholder="seuemail@exemplo.com" required>',
'<button class="p8-recovery-primary" type="submit" id="p8RecoverySend">📩 Enviar link de recuperação</button>',
'<small>Confira a caixa de entrada e o Spam. Abra apenas o link mais recente e nunca o compartilhe.</small>',
'</form>',
'<form id="p8RecoveryChange" hidden>',
'<label for="p8RecoveryNew">Nova senha (mínimo de 12 caracteres)</label>',
'<input id="p8RecoveryNew" type="password" autocomplete="new-password" minlength="12" maxlength="128" required>',
'<label for="p8RecoveryRepeat">Confirme sua nova senha</label>',
'<input id="p8RecoveryRepeat" type="password" autocomplete="new-password" minlength="12" maxlength="128" required>',
'<button class="p8-recovery-primary" type="submit" id="p8RecoverySave">🔒 Salvar nova senha</button>',
'<small>Não compartilhe senhas nem códigos de segurança, inclusive com administradores.</small>',
'</form>',
'<p id="p8RecoveryMessage" role="status" aria-live="polite"></p>',
'<button type="button" id="p8RecoveryBack">← Voltar ao login</button>',
'</div>'
].join("");
document.body.appendChild(root);
const request=$("p8RecoveryRequest"),change=$("p8RecoveryChange");
const status=$("p8RecoveryMessage");
let busy=false,fromEntry=false,recoveryReady=false,finished=false;
const client=()=>{if(typeof ensureCloudClient!=="function")throw Error("Sem conexão de autenticação.");return ensureCloudClient()};
function visible(on){
 root.hidden=!on;
 if(on){const welcome=$("p8FirstVisit");if(welcome)welcome.hidden=true;document.documentElement.classList.remove("p8-entry-check")}
}
function open(email="",origin=false){
 fromEntry=origin;finished=false;
 request.hidden=false;change.hidden=true;
 $("p8RecoveryTitle").textContent="Esqueci minha senha";
 $("p8RecoveryIntro").textContent="Informe o e-mail usado no cadastro para receber um link seguro. Não precisa criar outra conta.";
 $("p8RecoveryEmail").value=String(email||"").trim();
 status.textContent="";
 $("p8RecoveryBack").textContent="← Voltar ao login";
 visible(true);$("p8RecoveryEmail").focus();
}
function showChange(){
 recoveryReady=true;finished=false;
 request.hidden=true;change.hidden=false;
 $("p8RecoveryTitle").textContent="Escolha sua nova senha";
 $("p8RecoveryIntro").textContent="O link foi reconhecido. Defina uma senha nova e confirme.";
 status.textContent="✅ Link de recuperação validado.";
 visible(true);$("p8RecoveryNew").focus();
}
function invalid(){
 recoveryReady=false;
 open("",true);
 $("p8RecoveryTitle").textContent="Link expirado ou inválido";
 $("p8RecoveryIntro").textContent="O link pode ter sido utilizado ou expirado. Peça outro link usando o e-mail cadastrado.";
 status.textContent="⚠️ Confira a mensagem mais recente e tente novamente.";
}
function back(){
 if(busy)return;
 visible(false);
 try{if(notice.recovery||notice.errorCode||notice.errorType)history.replaceState(null,document.title,base())}catch(_){}
 if(!finished&&typeof window.portal8OpenWelcome==="function")window.portal8OpenWelcome("signin");
 else if(typeof showView==="function")showView("perfil");
}
window.portal8Recovery=Object.freeze({open});
$("p8WelcomeForgot")?.addEventListener("click",()=>open($("p8WelcomeEmail")?.value||"",true));
$("p8ProfileForgot")?.addEventListener("click",()=>open($("p8ProfileEmail")?.value||"",false));
$("p8RecoveryBack").addEventListener("click",back);
request.addEventListener("submit",async e=>{
 e.preventDefault();if(busy)return;
 const email=$("p8RecoveryEmail").value.trim();
 if(!window.portal8AuthHelp?.emailValid(email)){status.textContent="Informe um e-mail válido.";return}
 busy=true;$("p8RecoverySend").disabled=true;status.textContent="📨 Solicitando link ao serviço de autenticação…";
 try{
  const {error}=await client().auth.resetPasswordForEmail(email,{redirectTo:base()});
  if(error)throw error;
  status.textContent="📩 Solicitação recebida. Se o endereço pertencer a uma conta e o envio estiver disponível, você receberá um link. Veja também o Spam.";
 }catch(err){status.textContent=window.portal8AuthHelp?.errorMessage(err,"recovery")||"Não foi possível enviar agora. Tente novamente mais tarde."}
 finally{busy=false;$("p8RecoverySend").disabled=false}
});
change.addEventListener("submit",async e=>{
 e.preventDefault();if(busy)return;
 const password=$("p8RecoveryNew").value,repeat=$("p8RecoveryRepeat").value;
 if(password.length<12){status.textContent="A senha nova precisa ter pelo menos 12 caracteres.";return}
 if(password!==repeat){status.textContent="As duas senhas não coincidem.";return}
 if(!recoveryReady){status.textContent="Abra um link válido de recuperação antes de alterar a senha.";return}
 busy=true;$("p8RecoverySave").disabled=true;status.textContent="🔒 Atualizando sua senha…";
 try{
  const c=client();const {data,error:sessionError}=await c.auth.getSession();
  if(sessionError||!data?.session?.user?.email)throw sessionError||new Error("Sessão de recuperação indisponível");
  const {error}=await c.auth.updateUser({password});
  if(error)throw error;
  $("p8RecoveryNew").value="";$("p8RecoveryRepeat").value="";
  change.hidden=true;finished=true;recoveryReady=false;
  $("p8RecoveryTitle").textContent="Senha atualizada!";
  $("p8RecoveryIntro").textContent="A nova senha foi salva. Você pode voltar ao portal.";
  status.textContent="✅ Senha alterada com sucesso. Não foi necessário criar outra conta.";
  $("p8RecoveryBack").textContent="Continuar para o portal";
  try{history.replaceState(null,document.title,base())}catch(_){}
 }catch(err){status.textContent=window.portal8AuthHelp?.errorMessage(err,"recovery")||"Falha ao atualizar a senha. Solicite outro link."}
 finally{busy=false;$("p8RecoverySave").disabled=false}
});
// O evento PASSWORD_RECOVERY indica que o link retornou autenticado.
try{
 const c=client();
 c.auth.onAuthStateChange(event=>{
  if(event==="PASSWORD_RECOVERY")queueMicrotask(()=>showChange());
 });
 if(notice.recovery){
  c.auth.getSession().then(({data,error})=>{
   if(error||!data?.session?.user?.email){invalid();return}
   if(!recoveryReady)showChange();
  }).catch(invalid);
 }
}catch(_){if(notice.recovery)invalid()}
})();