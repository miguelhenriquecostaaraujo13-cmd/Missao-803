/* Portal Missão Paz v5 — navegação principal simples, sem remover ferramentas. */
(() => {
"use strict";
const $=id=>document.getElementById(id);
function setup(){
 const drawer=$("mp5ToolsDrawer");
 const routes=[...document.querySelectorAll(".mp5-primary-routes [data-mp5-go]")];
 if(!drawer||!routes.length)return;
 const groups={
  trilha:["trilha","revisoes","cartoes","quiz","metodos","videoaulas","assistente","mapasNeo"],
  neoEstudio8:["neoEstudio8"],
  neoGames40:["neoGames40","arcadeNeo","arena","desafio8ano"],
  neoIAs40:["neoIAs40","neoCentral30"],
  neoOficina:["neoOficina","gerador","laboratorio","caderno","biblioteca"],
  calendario:["calendario","metas803","foco","lembretes","revisao803"]
 };
 const groupOf=id=>{
  if(id==="inicio")return "inicio";
  for(const [group,ids] of Object.entries(groups))if(ids.includes(id))return group;
  return "";
 };
 function setActive(id){
  const active=groupOf(id);
  routes.forEach(b=>{
   const current=b.dataset.mp5Go===active;
   b.classList.toggle("is-active",current);
   if(current)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");
  });
 }
 document.addEventListener("portal8:viewchange",event=>{
  const id=event.detail?.id||"inicio";
  setActive(id);drawer.open=false;
 });
 // Ao clicar dentro das ferramentas, fechar somente a gaveta externa.
 drawer.addEventListener("click",e=>{if(e.target.closest(".navbtn[data-view]"))drawer.open=false});
 const q=$("nexoNavJump");
 if(q)q.addEventListener("change",()=>{drawer.open=false});
 const windowDoc=document.documentElement;
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&drawer.open){drawer.open=false;drawer.querySelector("summary")?.focus()}});
 // Evita que o banner de novidades volte a sobrecarregar a tela ao navegar.
 setActive(document.querySelector(".view.active")?.id||"inicio");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup,{once:true});else setup();
})();