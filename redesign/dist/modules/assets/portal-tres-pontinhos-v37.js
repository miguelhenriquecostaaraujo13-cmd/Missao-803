/* Portal 8º Ano Missão Paz v37 — menus compactos do portal.
 * Três pontinhos acessíveis por ferramenta e na barra de navegação.
 * Não altera autorizações, pontuação, conteúdo ou armazenamento escolar.
 */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const menus=new Set();
const element=(tag,cls,text)=>{
 const n=document.createElement(tag);
 if(cls)n.className=cls;
 if(text!==undefined)n.textContent=text;
 return n;
};
function createMenu(label){
 const details=element("details","neo-more");
 const summary=element("summary","neo-more-trigger","⋯");
 summary.setAttribute("aria-label",label);
 summary.title=label;
 summary.setAttribute("aria-haspopup","true");
 const panel=element("div","neo-more-panel");
 panel.setAttribute("role","group");
 panel.setAttribute("aria-label",label);
 details.append(summary,panel);
 menus.add(details);
 details.addEventListener("toggle",()=>{
  if(details.open){
   for(const other of menus)if(other!==details)other.open=false;
  }
 });
 return {details,panel};
}
function addButton(panel,label,fn){
 const button=element("button","neo-more-item",label);
 button.type="button";
 button.addEventListener("click",()=>{
  panel.parentElement.open=false;
  fn();
 });
 panel.append(button);
 return button;
}
function visit(id){
 const b=document.querySelector('.navbtn[data-view="'+id+'"]');
 if(!b||b.hidden)return;
 if(id==="neoLab"&&!window.neoAdminGate?.isAuthorized?.())return;
 window.showView?.(id);
}
function compactToolbars(){
 document.querySelectorAll(".neo-global-bar").forEach(bar=>{
  if(bar.querySelector(".neo-more"))return;
  const head=bar.querySelector(".neo-tool-heading");
  const feedback=bar.querySelector(".neo-bar-feedback");
  const buttons=[...bar.querySelectorAll(":scope > .neo-bar-action")];
  if(!buttons.length)return;
  const menu=createMenu("Mais opções desta ferramenta");
  buttons.forEach(button=>{
   button.classList.remove("neo-bar-action");
   button.classList.add("neo-more-item");
   menu.panel.append(button);
   button.addEventListener("click",()=>{menu.details.open=false});
  });
  if(feedback)menu.panel.append(feedback);
  bar.replaceChildren(head,menu.details);
 });
}
function quickMenu(){
 const nav=document.querySelector("nav .navquick");
 if(!nav||nav.querySelector(".neo-more"))return;
 const menu=createMenu("Menu de três pontinhos do portal");
 menu.details.classList.add("neo-more-nav");
 const find=addButton(menu.panel,"🔎 Buscar ferramentas",()=>{
  const searchBtn=document.querySelector('.neo-global-bar .neo-more-panel button');
  if(searchBtn)searchBtn.click();
  else $("neoToolSearch34")?.showModal?.();
 });
 addButton(menu.panel,"🏠 Meu painel",()=>visit("inicio"));
 addButton(menu.panel,"🕹️ Arcade Educativo",()=>visit("arcadeNeo"));
 addButton(menu.panel,"🧠 Mapas Mentais",()=>visit("mapasNeo"));
 addButton(menu.panel,"🗂️ Flashcards",()=>visit("cartoes"));
 addButton(menu.panel,"🎨 Oficina Criativa",()=>visit("neoOficina"));
 const userMenu=element("p","neo-more-hint","Acesso rápido às principais áreas");
 menu.panel.prepend(userMenu);
 nav.append(menu.details);
}
function init(){
 compactToolbars();quickMenu();
 document.addEventListener("pointerdown",event=>{
  for(const menu of menus)if(menu.open&&!menu.contains(event.target))menu.open=false;
 });
 document.addEventListener("keydown",event=>{
  if(event.key==="Escape")for(const menu of menus)menu.open=false;
 });
 document.addEventListener("portal8:viewchange",()=>{
  for(const menu of menus)menu.open=false;
 });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
else init();
})();