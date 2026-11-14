/* Autorização para interface de testes do Ateliê Neo.
 * O HTML/JS estático do GitHub Pages é público: jamais armazenar segredos nele.
 * Os dados administrativos reais continuam protegidos por RLS no Supabase.
 */
(() => {
 "use strict";
 const $=id=>document.getElementById(id);
 let approved=false,checking=null,sequence=0;
 function render(){
  const tab=document.querySelector('nav .navbtn[data-view="neoLab"]');
  const page=$("neoLab"),card=$("neoOwnerCard");
  if(tab)tab.hidden=!approved;
  if(page)page.hidden=!approved;
  if(card)card.hidden=!approved;
  const menu=document.getElementById("nexoNavJump");
  const opt=menu?.querySelector('option[value="neoLab"]');
  if(opt){opt.hidden=!approved;opt.disabled=!approved}
  const group=document.querySelector('nav .navgroup[data-category="administracao"] .navcount');
  if(group)group.textContent=approved?"6":"5";
  if(!approved&&page?.classList.contains("active")&&typeof window.showView==="function")window.showView("criador");
 }
 async function refresh(){
  if(checking)return checking;
  const token=++sequence;
  checking=(async()=>{
   let ok=false;
   try{
    if(typeof ensureCloudClient!=="function")throw Error("Sem cliente");
    const client=ensureCloudClient();
    const {data:auth,error:authError}=await client.auth.getUser();
    if(authError)throw authError;
    if(auth?.user?.id&&auth.user.email&&auth.user.is_anonymous!==true){
     const {data,error}=await client.from("portal803_admins").select("user_id").eq("user_id",auth.user.id).maybeSingle();
     if(error)throw error;
     ok=!!data;
    }
   }catch(_){ok=false}
   if(token===sequence){approved=ok;render()}
   return ok;
  })();
  try{return await checking}finally{checking=null}
 }
 function isAuthorized(){return approved===true}
 async function open(){
  const ok=await refresh();
  if(ok&&typeof window.showView==="function"){
   window.showView("neoLab");
  }else{
   if(typeof window.showView==="function")window.showView("criador");
   const status=$("portalOwnerStatus");
   if(status)status.textContent="🔒 O Ateliê Neo só aparece para contas administradoras confirmadas. Faça login no Modo Proprietário.";
  }
 }
 window.neoAdminGate={isAuthorized,refresh,open};
 function init(){
  approved=false;render();
  try{
   const client=ensureCloudClient();
   client.auth.onAuthStateChange((event)=>{
    if(event==="SIGNED_OUT"){sequence++;approved=false;render();}
    else if(["SIGNED_IN","TOKEN_REFRESHED","USER_UPDATED","INITIAL_SESSION"].includes(event))setTimeout(refresh,0);
   });
  }catch(_){}
  refresh();
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();