/* Portal 8º Ano — contas pessoais privadas. Reutiliza a conexão Supabase existente. */
(() => {
 "use strict";
 const $=id=>document.getElementById(id);
 const BUCKET="portal8-avatars";
 const PLACEHOLDER="👤";
 const CLASSES=["801","802","803","804","806","807"];
 let client=null,user=null,profile=null,avatarObjectURL=null,busy=false,refreshCount=0,isAdmin=false;
 function message(text){const node=$("p8ProfileStatus");if(node)node.textContent=text}
 function validUser(u){return !!(u?.id&&u.email&&u.is_anonymous!==true)}
 function getClient(){if(typeof ensureCloudClient!=="function")throw new Error("A conexão com o portal não está disponível.");client=ensureCloudClient();return client}
 function setBusy(value){busy=value;document.querySelectorAll("#portal8Profile button[data-profile-action]").forEach(b=>b.disabled=value)}
 function initials(name){return (name||"Estudante").split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]?.toUpperCase()).join("")||"👤"}
 function clearAvatar(){
  if(avatarObjectURL){URL.revokeObjectURL(avatarObjectURL);avatarObjectURL=null}
  for(const id of ["p8ProfileAvatar","p8HeaderAvatar"]){const el=$(id);if(el){el.removeAttribute("src");el.hidden=true}}
  const fallback=$("p8ProfileAvatarFallback");if(fallback)fallback.hidden=false;
  const topFallback=$("p8HeaderAvatarFallback");if(topFallback)topFallback.hidden=false;
 }
 function showAvatar(url){
  for(const id of ["p8ProfileAvatar","p8HeaderAvatar"]){const img=$(id);if(img){img.src=url;img.hidden=false}}
  $("p8ProfileAvatarFallback").hidden=true;$("p8HeaderAvatarFallback").hidden=true;
 }
 function showAdminAvatar(){
  if(isAdmin&&validUser(user)&&!avatarObjectURL)showAvatar("./assets/avatar-administrador.svg?v=21");
 }
 function levelText(){
  const progress=typeof state!=="undefined"?state:null;
  const xp=Math.min(100000,(progress?.done?.length||0)*15+(Number(progress?.correct)||0)*2);
  const level=Math.min(10,1+Math.floor(xp/125));
  return "Nível "+level+" de estudos • "+xp+" pontos neste navegador";
 }
 function render(){
  const logged=validUser(user);
  $("p8ProfileAuth").hidden=logged;
  $("p8ProfileEditor").hidden=!logged;
  $("p8ProfilePrivate").hidden=!logged;
  $("p8ProfileGuest").hidden=logged;
  $("p8HeaderText").textContent=logged?(profile?.display_name||"Meu perfil")+(isAdmin?" 👑":""):"Entrar / Criar conta";
  $("p8ProfileNameView").textContent=logged?(profile?.display_name||"Escolha seu nome"):"Bem-vindo ao Portal!";
  $("p8ProfileClassView").textContent=logged?(profile?.turma?"Turma "+profile.turma:"Escolha sua turma"):"Faça login para personalizar seu espaço.";
  $("p8ProfileAccountType").textContent=logged?(isAdmin?"👑 Administrador autorizado":"Conta de estudante"):"Visitante";
  $("p8ProfileAccountType").classList.toggle("p8-admin-role",logged&&isAdmin);
  $("p8ProfileAdminOption").hidden=!(logged&&isAdmin);
  $("p8ProfileEmailView").textContent=logged?(user.email||"—"):"—";
  $("p8ProfileCreated").textContent=logged&&user.created_at?new Date(user.created_at).toLocaleDateString("pt-BR"):"—";
  $("p8ProfileProgressLevel").textContent=levelText();
  $("p8ProfileAvatarFallback").textContent=initials(profile?.display_name);
  $("p8HeaderAvatarFallback").textContent=logged?initials(profile?.display_name):PLACEHOLDER;
  if(logged){
    $("p8ProfileName").value=profile?.display_name||"";
    $("p8ProfileClass").value=profile?.turma||"";
    $("p8ProfileBio").value=profile?.bio||"";
    $("p8ProfileBioCount").textContent=($("p8ProfileBio").value.length)+" / 120";
    $("p8ProfileRoleDescription").textContent=isAdmin?"Permissão de administrador confirmada pelo Supabase.":"O acesso administrativo depende de autorização separada.";
  }
 }
 async function loadAvatar(path,token){
  if(!validUser(user)||!path||path!==user.id+"/avatar.webp")return;
  try{
    const {data,error}=await getClient().storage.from(BUCKET).download(path);
    if(error)throw error;
    if(token!==refreshCount)return;
    clearAvatar();avatarObjectURL=URL.createObjectURL(data);showAvatar(avatarObjectURL);
  }catch(e){if(token===refreshCount)message("Não consegui carregar a foto privada agora. Você pode enviá-la novamente.")}
 }
 // A conta Auth e o perfil são registros separados. Um novo login cria o
 // perfil básico da própria pessoa, respeitando a autorização RLS pelo user_id.
 async function loadOrCreateProfile(c,uid){
  const read=()=>c.from("portal8_profiles")
   .select("user_id,display_name,turma,bio,avatar_path,created_at")
   .eq("user_id",uid).maybeSingle();
  let {data:p,error}=await read();
  if(error)throw error;
  if(p)return p;
  // Nunca escreve em perfis de outras contas nem concede papel administrativo.
  const created=await c.from("portal8_profiles").insert({user_id:uid,display_name:"Estudante"});
  // Um segundo refresh pode ter criado a mesma linha simultaneamente.
  if(created.error&&String(created.error.code)!=="23505")throw created.error;
  const saved=await read();
  if(saved.error)throw saved.error;
  if(!saved.data)throw new Error("O perfil ainda não está disponível.");
  return saved.data;
 }
 async function refresh(){
  const token=++refreshCount;
  try{
    const c=getClient();
    const {data,error}=await c.auth.getUser();
    if(error)throw error;
    const next=data?.user||null;
    if(!validUser(next)){
      user=null;profile=null;isAdmin=false;clearAvatar();render();
      return;
    }
    const changed=user?.id!==next.id;
    user=next;
    if(changed){profile=null;isAdmin=false;clearAvatar()}
    // Mostra a conta autenticada mesmo se a busca do perfil falhar.
    render();
    const loaded=await loadOrCreateProfile(c,next.id);
    if(token!==refreshCount||user?.id!==next.id)return;
    profile=loaded;
    render();
    if(profile?.avatar_path&&(changed||!avatarObjectURL))await loadAvatar(profile.avatar_path,token);
    if(isAdmin&&!avatarObjectURL)showAdminAvatar();
    if(changed&&typeof portalOwnerCheck==="function")portalOwnerCheck().catch(()=>{});
  }catch(e){
    if(token!==refreshCount)return;
    if(validUser(user)){
      render();
      message("Sua conta está conectada, mas não consegui carregar ou salvar seu perfil. Confira a internet e tente Salvar perfil.");
    }else message("Não consegui atualizar sua conta. Verifique a conexão e tente de novo.");
  }
 }
 async function signAction(mode){
  if(busy)return;
  const email=$("p8ProfileEmail").value.trim();
  const password=$("p8ProfilePassword").value;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    message("Informe um e-mail válido.");return;
  }
  if(!password.length){message("Digite sua senha para continuar.");return}
  if(mode==="signup"&&password.length<12){
    message("Para criar uma conta, escolha uma senha com pelo menos 12 caracteres.");return;
  }
  setBusy(true);message(mode==="signup"?"Criando conta…":"Entrando…");
  try{
    const c=getClient();
    const result=mode==="signup"
     ?await c.auth.signUp({email,password,options:{emailRedirectTo:window.portal8AuthHelp?.publicRedirectURL()||location.origin+location.pathname}})
     :await c.auth.signInWithPassword({email,password});
    $("p8ProfilePassword").value="";
    if(result.error)throw result.error;
    if(mode==="signup"&&!result.data?.session){
      $("p8ProfileResend").hidden=false;
      message(window.portal8AuthHelp?.confirmationMessage||"Confira seu e-mail e confirme o cadastro antes de entrar.");
    }else{
      $("p8ProfileResend").hidden=true;
      await refresh();
      message(profile?"✅ Login confirmado e perfil recuperado! Você pode personalizar seu nome e turma.":"✅ Login realizado, mas ainda não foi possível recuperar o perfil. Tente Salvar perfil.");
    }
  }catch(e){
    $("p8ProfilePassword").value="";
    const errcode=String(e?.code||"");
    if(errcode==="email_not_confirmed"||/email not confirmed/i.test(String(e?.message||"")))$("p8ProfileResend").hidden=false;
    message(window.portal8AuthHelp?.errorMessage(e,mode)||"Não foi possível autenticar. Verifique e-mail, senha e confirmação.");
  }finally{setBusy(false)}
 }
 async function resendSignupConfirmation(){
  if(busy)return;
  const email=$("p8ProfileEmail").value.trim();
  if(!window.portal8AuthHelp?.emailValid(email)){message("Informe seu e-mail para reenviar a confirmação.");return}
  setBusy(true);message("Solicitando novo e-mail de confirmação…");
  try{
    const c=getClient();
    const {error}=await window.portal8AuthHelp.resendConfirmation(c,email,window.portal8AuthHelp.publicRedirectURL());
    if(error)throw error;
    message("📩 Se houver um cadastro pendente, um novo e-mail de confirmação será enviado. Confira também o Spam.");
  }catch(e){message(window.portal8AuthHelp?.errorMessage(e,"resend")||"Não foi possível reenviar agora.");}
  finally{setBusy(false)}
 }
 async function logout(){
  if(busy)return;
  setBusy(true);message("Saindo da conta…");
  try{
    const {error}=await getClient().auth.signOut();
    if(error)throw error;
    user=null;profile=null;isAdmin=false;clearAvatar();render();
    if(typeof portalOwnerCheck==="function")portalOwnerCheck().catch(()=>{});
    message("Você saiu da conta neste navegador.");
  }catch(e){message("Não foi possível encerrar sua sessão. Tente novamente.");}
  finally{setBusy(false)}
 }
 function values(){
  const display_name=$("p8ProfileName").value.trim().replace(/\s+/g," ");
  const turma=$("p8ProfileClass").value||null;
  const bio=$("p8ProfileBio").value.trim();
  if(display_name.length<2||display_name.length>40)throw new Error("Use um nome de exibição entre 2 e 40 caracteres.");
  if(turma&&!CLASSES.includes(turma))throw new Error("Selecione uma turma válida.");
  if(bio.length>120)throw new Error("A bio pode ter no máximo 120 caracteres.");
  return {display_name,turma,bio};
 }
 async function writeProfile(values){
  const c=getClient();
  const q=profile
   ?c.from("portal8_profiles").update(values).eq("user_id",user.id)
   :c.from("portal8_profiles").insert({user_id:user.id,...values});
  const {data,error}=await q.select("user_id,display_name,turma,bio,avatar_path,created_at").single();
  if(error)throw error;
  profile=data;render();
 }
 async function save(){
  if(busy||!validUser(user))return;
  try{
    const next=values();setBusy(true);message("Salvando as alterações…");
    await writeProfile(next);
    message("✅ Perfil atualizado. Suas informações só ficam visíveis nesta conta.");
  }catch(e){message(e.message?.startsWith("Use ")||e.message?.startsWith("A bio")||e.message?.startsWith("Selecione")?e.message:"Não consegui salvar. Verifique a conexão e tente novamente.");}
  finally{setBusy(false)}
 }
 function resizedWebp(file){
  return new Promise((resolve,reject)=>{
    if(!["image/png","image/jpeg","image/webp"].includes(file.type))return reject(new Error("Escolha uma imagem JPG, PNG ou WebP."));
    if(file.size>8*1024*1024)return reject(new Error("Escolha uma imagem de até 8 MB."));
    const temporary=URL.createObjectURL(file);
    const img=new Image();
    img.onerror=()=>{URL.revokeObjectURL(temporary);reject(new Error("Não consegui abrir essa imagem."))};
    img.onload=()=>{
      URL.revokeObjectURL(temporary);
      try{
        const size=320;
        const canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;
        const ctx=canvas.getContext("2d");
        if(!ctx)throw new Error("Este navegador não conseguiu preparar a imagem.");
        const scale=Math.max(size/img.naturalWidth,size/img.naturalHeight);
        const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
        ctx.drawImage(img,(size-w)/2,(size-h)/2,w,h);
        canvas.toBlob(blob=>{
          if(!blob||blob.size>2097152)return reject(new Error("Não consegui preparar sua foto. Escolha outra imagem."));
          resolve(blob);
        },"image/webp",.82);
      }catch(err){reject(err)}
    };
    img.src=temporary;
  });
 }
 async function upload(){
  if(busy||!validUser(user))return;
  const file=$("p8ProfileFile").files?.[0];if(!file){message("Escolha uma foto primeiro.");return}
  setBusy(true);message("Preparando sua foto com privacidade…");
  try{
    const blob=await resizedWebp(file);
    const path=user.id+"/avatar.webp";
    const {error}=await getClient().storage.from(BUCKET).upload(path,blob,{contentType:"image/webp",upsert:true,cacheControl:"60"});
    if(error)throw error;
    // O perfil não concede acesso administrativo e só salva o caminho privado.
    await writeProfile({...(profile?{}:{display_name:"Estudante",turma:null,bio:""}),avatar_path:path});
    clearAvatar();avatarObjectURL=URL.createObjectURL(blob);showAvatar(avatarObjectURL);
    $("p8ProfileFile").value="";
    message("✅ Foto de perfil salva! Apenas você pode acessar esse arquivo.");
  }catch(e){message(e.message?.startsWith("Escolha ")||e.message?.startsWith("Não consegui preparar")?e.message:"Não foi possível enviar sua foto. Confira sua conexão e tente novamente.");}
  finally{setBusy(false)}
 }
 async function checkRole(){
  if(!validUser(user)){isAdmin=false;render();return}
  const checkedId=user.id;
  try{
    const {data,error}=await getClient().from("portal803_admins")
      .select("user_id").eq("user_id",checkedId).maybeSingle();
    if(error)throw error;
    if(user?.id!==checkedId)return;
    isAdmin=!!data;
  }catch(_){
    if(user?.id!==checkedId)return;
    isAdmin=false;
  }
  render();
  if(isAdmin&&!avatarObjectURL)showAdminAvatar();
  else if(!isAdmin&&!avatarObjectURL)clearAvatar();
 }
 async function chooseAdminAvatar(){
  if(busy||!validUser(user)||!isAdmin)return;
  setBusy(true);message("Selecionando o emblema de administrador…");
  try{
    const oldPath=profile?.avatar_path;
    if(oldPath)await writeProfile({avatar_path:null});
    if(oldPath)await getClient().storage.from(BUCKET).remove([oldPath]);
    clearAvatar();showAdminAvatar();
    message("✅ Emblema de administrador ativado. Você ainda pode enviar uma foto personalizada!");
  }catch(e){message("Não consegui trocar o avatar agora. Tente novamente.")}
  finally{setBusy(false)}
 }
 function init(){
  if(!$("portal8Profile"))return;
  $("p8ProfileLogin").addEventListener("click",()=>signAction("signin"));
  $("p8ProfileSignup").addEventListener("click",()=>signAction("signup"));
  $("p8ProfileResend").addEventListener("click",resendSignupConfirmation);
  $("p8ProfileGoogle").addEventListener("click",async()=>{
    if(busy)return;
    setBusy(true);message("Redirecionando para o login seguro do Google…");
    try{
      const response=await window.portal8AuthHelp.signInWithGoogle(getClient());
      if(response.error)throw response.error;
    }catch(err){
      message(window.portal8AuthHelp?.errorMessage(err,"google")||"Não foi possível iniciar o login com Google.");
    }finally{setBusy(false)}
  });
  $("p8ProfileLogout").addEventListener("click",logout);
  $("p8ProfileSave").addEventListener("click",save);
  $("p8ProfileUpload").addEventListener("click",upload);
  $("p8ProfileChooseAdmin").addEventListener("click",chooseAdminAvatar);
  $("p8ProfilePassword").addEventListener("keydown",e=>{if(e.key==="Enter")signAction("signin")});
  $("p8ProfileBio").addEventListener("input",()=>{$("p8ProfileBioCount").textContent=$("p8ProfileBio").value.length+" / 120"});
  document.addEventListener("portal8:viewchange",e=>{
    if(e.detail?.id==="perfil"){refresh().then(checkRole)}
  });
  try{
    const c=getClient();
    c.auth.onAuthStateChange((event)=>{
      if(["SIGNED_IN","SIGNED_OUT","USER_UPDATED","TOKEN_REFRESHED"].includes(event)){
        setTimeout(()=>{refresh().then(checkRole)},0);
      }
    });
  }catch(e){message("Este recurso precisa de internet e da conexão do portal.");}
  render();refresh().then(checkRole);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
 else init();
})();
