(function(){
"use strict";
const el=id=>document.getElementById(id);
const turma=()=>portal8Turma;
const message=(id,value)=>{const node=el(id);if(node)node.textContent=value;};
async function send(){
 const question=el("p8xDoubtQuestion").value.trim();
 const subject=el("p8xDoubtSubject").value;
 if(!el("p8xDoubtConsent").checked)return message("p8xDoubtStatus","Confirme que não colocou dados pessoais.");
 if(question.length<15||question.length>600)return message("p8xDoubtStatus","Escreva uma dúvida de 15 a 600 caracteres.");
 if(/https?:\/\/|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(question))return message("p8xDoubtStatus","Não inclua links ou e-mails.");
 if(!confirm("Enviar esta dúvida para moderação privada?"))return;
 message("p8xDoubtStatus","Enviando...");
 try{
  const session=await portalGradeSession();
  const result=await session.client.from("portal8_duvidas").insert({
   autor_id:session.user.id,turma:turma(),materia:subject,pergunta:question,situacao:"pendente"
  });
  if(result.error)throw result.error;
  el("p8xDoubtQuestion").value="";el("p8xDoubtConsent").checked=false;
  message("p8xDoubtStatus","✅ Dúvida enviada. Só aparecerá após revisão e resposta.");
 }catch(e){message("p8xDoubtStatus","Não foi possível enviar. Verifique sua conexão ou sessão.");}
}
async function published(){
 const root=el("p8xPublicDoubts");if(!root)return;
 message("p8xDoubtClass","Turma "+turma());root.replaceChildren();
 try{
  const r=await ensureCloudClient().from("portal8_duvidas_publicas")
   .select("materia,pergunta,resposta").eq("publicada",true).eq("turma",turma())
   .order("criado_em",{ascending:false}).limit(20);
  if(r.error)throw r.error;
  if(!r.data||!r.data.length){root.textContent="Nenhuma pergunta respondida nesta turma.";return;}
  for(const q of r.data){
   const card=document.createElement("article");card.className="p8x-board-card";
   const title=document.createElement("b");title.textContent=q.pergunta;
   const sub=document.createElement("small");sub.textContent=q.materia+" • Pergunta revisada";
   const body=document.createElement("p");body.textContent="💡 "+q.resposta;
   card.append(title,sub,body);root.append(card);
  }
 }catch(e){root.textContent="Perguntas respondidas indisponíveis.";}
}
async function moderate(q,cleanText,answer,approve){
 if(!portalIsOwner)return;
 const revised=String(cleanText||"").trim(),reply=String(answer||"").trim();
 if(approve&&(revised.length<15||revised.length>600||reply.length<10||reply.length>1200))return alert("Revise a pergunta e escreva uma resposta de 10 a 1200 caracteres.");
 if(!confirm(approve?"Publicar versão revisada e resposta sem identificação?":"Arquivar dúvida sem publicar?"))return;
 try{
  const client=ensureCloudClient();
  if(approve){
   const r=await client.from("portal8_duvidas_publicas").upsert({
    origem_id:q.id,turma:q.turma,materia:q.materia,pergunta:revised,resposta:reply,publicada:true
   },{onConflict:"origem_id"});
   if(r.error)throw r.error;
  }
  const r=await client.from("portal8_duvidas").update({situacao:approve?"publicada":"arquivada"}).eq("id",q.id);
  if(r.error)throw r.error;
  await pending();await published();
 }catch(e){alert("Não foi possível concluir a moderação. Verifique as permissões.");}
}
async function pending(){
 const root=el("p8xPendingDoubts");if(!root)return;root.replaceChildren();
 if(!portalIsOwner){root.textContent="Disponível apenas ao administrador autorizado.";return;}
 try{
  const r=await ensureCloudClient().from("portal8_duvidas")
   .select("id,turma,materia,pergunta").eq("situacao","pendente")
   .order("criado_em",{ascending:true}).limit(30);
  if(r.error)throw r.error;
  if(!r.data||!r.data.length){root.textContent="Nenhuma dúvida pendente.";return;}
  for(const q of r.data){
   const card=document.createElement("article");card.className="p8x-board-card p8x-moderation";
   const title=document.createElement("b");title.textContent=q.materia+" • Turma "+q.turma;
   const raw=document.createElement("p");raw.textContent=q.pergunta;
   const revised=document.createElement("textarea");revised.className="p8x-entry";revised.rows=3;revised.maxLength=600;revised.value=q.pergunta;revised.setAttribute("aria-label","Pergunta revisada sem informações pessoais");
   const answer=document.createElement("textarea");answer.className="p8x-entry";answer.rows=4;answer.maxLength=1200;answer.placeholder="Resposta educativa (10 a 1200 caracteres)";
   const actions=document.createElement("div");actions.className="p8x-actions";
   const ok=document.createElement("button");ok.className="btn orange";ok.type="button";ok.textContent="✅ Responder e publicar";ok.onclick=()=>moderate(q,revised.value,answer.value,true);
   const no=document.createElement("button");no.className="btn light";no.type="button";no.textContent="Arquivar";no.onclick=()=>moderate(q,"","",false);
   actions.append(ok,no);card.append(title,raw,revised,answer,actions);root.append(card);
  }
 }catch(e){root.textContent="Não foi possível carregar a fila de moderação.";}
}
function init(){
 const select=el("p8xDoubtSubject");
 if(select){
  select.replaceChildren();
  subjects.forEach(s=>{const opt=document.createElement("option");opt.value=s.name;opt.textContent=s.name;select.append(opt);});
 }
 published();
 if(portalIsOwner)pending();
 const choose=window.portal8Choose;
 window.portal8Choose=function(v){const r=choose(v);published();return r;};
 const show=window.showView;
 window.showView=function(v){const r=show(v);if(v==="biblioteca")published();if(v==="admin"||v==="painel")if(portalIsOwner)pending();return r;};
 const check=window.portalOwnerCheck;
 window.portalOwnerCheck=async function(){const r=await check();if(portalIsOwner)await pending();return r;};
}
window.portal8Doubts={send,published,pending};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();