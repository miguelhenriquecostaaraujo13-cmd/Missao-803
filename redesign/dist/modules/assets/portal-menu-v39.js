/* Portal Missão Paz v39 — menu ⋯ confiável e acessível.
 * Um único painel na raiz do documento evita cortes por overflow:hidden
 * nas ferramentas, no menu lateral e nos layouts de celular.
 */
(() => {
 "use strict";
 const $=id=>document.getElementById(id);
 const LAST="portal803-last-tool-v1";
 const FAV="portal803-favorite-tools-v1";
 let panel=null,origin=null,openId=null,focusOnExit=null,help=null,focusExit=null;
 const safeRead=(key,def)=>{
  try{const data=JSON.parse(localStorage.getItem(key));return data??def}catch(_){return def}
 };
 const toolButtons=()=>[...document.querySelectorAll('.navbtn[data-view]')];
 const tool=id=>toolButtons().find(b=>b.dataset.view===id);
 const permitted=id=>{
  const b=tool(id);
  return !!(b&&!b.hidden&&!b.closest("[hidden]")&&(id!=="neoLab"||window.neoAdminGate?.isAuthorized?.()));
 };
 const name=id=>tool(id)?.textContent.trim()||id;
 function el(tag,cls,text){
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(text!==undefined)node.textContent=text;
  return node;
 }
 function close(returnFocus=false){
  if(panel)panel.hidden=true;
  if(origin){origin.setAttribute("aria-expanded","false");if(returnFocus)origin.focus();}
  origin=null;openId=null;
 }
 function add(label,fn,options={}){
  const b=el("button","neo-popup-option",label);
  b.type="button";b.setAttribute("role","menuitem");
  if(options.pressed!==undefined)b.setAttribute("aria-pressed",String(options.pressed));
  b.addEventListener("click",()=>{
   close(false);
   try{fn()}catch(_){}
  });
  panel.append(b);
  return b;
 }
 function section(text){
  const label=el("div","neo-popup-section",text);label.setAttribute("role","presentation");panel.append(label);
 }
 function route(id){
  if(!permitted(id))return;
  window.showView?.(id);
 }
 function showSearch(){
  if(window.neoPortalUX?.openSearch){window.neoPortalUX.openSearch();return}
  const existing=document.querySelector('.neo-global-bar > .neo-bar-action');
  if(existing){existing.click();return}
  const dialog=$("neoToolSearch34");
  if(dialog&&!dialog.open)dialog.showModal?.();
 }
 function getFavorites(){
  const native=safeRead(FAV,[]);
  return Array.isArray(native)?[...new Set(native)].filter(permitted).slice(0,12):[];
 }
 function toggleFavorite(id){
  if(!permitted(id))return;
  if(typeof window.portalToggleFavorite==="function"){window.portalToggleFavorite(id)}
  else{
   const current=getFavorites(),index=current.indexOf(id);
   if(index>=0)current.splice(index,1);
   else if(current.length<12)current.push(id);
   try{localStorage.setItem(FAV,JSON.stringify(current))}catch(_){}
  }
  const source=$(id)?.querySelector(".neo-fav-action");
  if(source&&window.neoPortalUX?.refreshToolbar)window.neoPortalUX.refreshToolbar($(id));
 }
 function helpFor(id){
  const view=$(id);
  const title=view?.querySelector("h2")?.textContent?.trim()||name(id);
  const para=view?.querySelector(".sub")?.textContent?.trim()||
   "Abra a ferramenta e siga as instruções. Seus dados escolares originais permanecem nas ferramentas correspondentes.";
  return {title,para:para.slice(0,900)};
 }
 function showHelp(id){
  if(!help)return;
  const copy=helpFor(id);
  help.querySelector("h2").textContent="Como usar: "+copy.title;
  help.querySelector("p").textContent=copy.para;
  if(!help.open)help.showModal?.();
 }
 function setFocus(on){
  document.body.classList.toggle("neo-portal-focus",on);
  focusExit.hidden=!on;
  try{sessionStorage.setItem("neo-portal-focus-v39",on?"1":"0")}catch(_){}
  if(on)focusExit.focus();
 }
 function itemsFor(id,isNav){
  panel.replaceChildren();
  section(isNav?"Acesso rápido":"Ações da ferramenta");
  if(!isNav){
   add("🔎 Buscar ferramenta",showSearch);
   add(getFavorites().includes(id)?"★ Remover favorito":"☆ Adicionar aos favoritos",()=>toggleFavorite(id),{pressed:getFavorites().includes(id)});
   add("🔗 Copiar link",async()=>{
    const u=new URL(location.href);u.searchParams.set("ferramenta",id);
    try{
     if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(u.toString());
     else throw Error("sem clipboard");
    }catch(_){
     if(typeof window.prompt==="function")window.prompt("Copie este link:",u.toString());
    }
   });
   add("❔ Como usar esta ferramenta",()=>showHelp(id));
   add("🏠 Voltar ao início",()=>route("inicio"));
   add(document.body.classList.contains("neo-portal-focus")?"👁️ Sair do modo foco":"🎯 Modo foco",()=>setFocus(!document.body.classList.contains("neo-portal-focus")));
  }else{
   add("🔎 Procurar ferramenta",showSearch);
   add("🏠 Meu painel",()=>route("inicio"));
   section("Continuar");
   const last=safeRead(LAST,"trilha");
   if(permitted(last))add("▶ "+name(last),()=>route(last));
   section("Favoritos");
   const favs=getFavorites();
   if(!favs.length)section("Marque ☆ em uma ferramenta para aparecer aqui");
   else favs.forEach(f=>add("⭐ "+name(f),()=>route(f)));
   section("Explorar");
   for(const key of ["arcadeNeo","mapasNeo","cartoes","neoOficina"]){
    if(permitted(key))add(name(key),()=>route(key));
   }
   add(document.body.classList.contains("neo-portal-focus")?"👁️ Sair do modo foco":"🎯 Modo foco",()=>setFocus(!document.body.classList.contains("neo-portal-focus")));
  }
 }
 function place(button){
  panel.hidden=false;
  panel.style.width=Math.min(300,Math.max(200,window.innerWidth-24))+"px";
  const rect=button.getBoundingClientRect();
  const width=panel.offsetWidth||280,height=panel.offsetHeight||320;
  const x=Math.max(12,Math.min(window.innerWidth-width-12,rect.right-width));
  const below=rect.bottom+8;
  const top=below+height<window.innerHeight-8?below:Math.max(8,rect.top-height-8);
  panel.style.left=x+"px";panel.style.top=top+"px";
 }
 function open(button,id,isNav){
  if(origin===button&&!panel.hidden){close(true);return}
  close();
  origin=button;openId=id||"inicio";
  itemsFor(openId,isNav);
  button.setAttribute("aria-expanded","true");
  place(button);
  panel.querySelector("button")?.focus();
 }
 function trigger(id,isNav){
  const b=el("button","neo-more-trigger-v39","⋯");
  b.type="button";b.setAttribute("aria-haspopup","menu");
  b.setAttribute("aria-expanded","false");
  b.setAttribute("aria-controls","neoPopupV39");
  b.setAttribute("aria-label",isNav?"Mais opções do portal":"Mais opções de "+name(id));
  b.title="Mais opções";
  b.addEventListener("click",()=>open(b,id,isNav));
  return b;
 }
 function init(){
  panel=el("div","neo-popup-v39");panel.id="neoPopupV39";panel.hidden=true;
  panel.setAttribute("role","menu");panel.setAttribute("aria-label","Opções do portal");
  document.body.append(panel);
  help=el("dialog","neo-help-v39");
  help.setAttribute("aria-label","Ajuda da ferramenta");
  help.append(el("h2",null,"Como usar"),el("p",null,""),el("button","neo-help-close-v39","Fechar"));
  help.querySelector("button").type="button";
  help.querySelector("button").addEventListener("click",()=>help.close());
  document.body.append(help);
  focusExit=el("button","neo-focus-exit-v39","✕ Sair do modo foco");
  focusExit.type="button";focusExit.hidden=true;
  focusExit.addEventListener("click",()=>setFocus(false));
  document.body.append(focusExit);
  const quick=document.querySelector("nav .navquick");
  if(quick)quick.append(trigger("inicio",true));
  document.querySelectorAll(".view").forEach(view=>{
   let bar=view.querySelector(".neo-global-bar");
   if(!bar){
    bar=el("div","neo-global-bar");
    const heading=el("div","neo-tool-heading");
    heading.append(el("strong",null,name(view.id)));
    bar.append(heading);
    view.insertBefore(bar,view.firstChild);
   }
   const old=bar.querySelectorAll(":scope > .neo-bar-action");
   old.forEach(button=>{button.hidden=true;button.setAttribute("aria-hidden","true");button.tabIndex=-1});
   const feedback=bar.querySelector(".neo-bar-feedback");
   if(feedback)feedback.hidden=true;
   bar.append(trigger(view.id,false));
  });
  try{if(sessionStorage.getItem("neo-portal-focus-v39")==="1")setFocus(true)}catch(_){}
  document.addEventListener("pointerdown",event=>{
   if(panel.hidden||panel.contains(event.target)||origin?.contains(event.target))return;
   close();
  });
  document.addEventListener("keydown",event=>{
   if(event.key==="Escape"&&!panel.hidden){event.preventDefault();close(true);return}
   if(event.key==="Escape"&&document.body.classList.contains("neo-portal-focus")&&!help.open){setFocus(false);return}
   if(panel.hidden)return;
   const buttons=[...panel.querySelectorAll("button")];
   const current=buttons.indexOf(document.activeElement);
   if(event.key==="ArrowDown"||event.key==="ArrowUp"){
    event.preventDefault();
    buttons[(current+buttons.length+(event.key==="ArrowDown"?1:-1))%buttons.length]?.focus();
   }
  });
  document.addEventListener("portal8:viewchange",()=>close());
  window.addEventListener("resize",()=>close());
  document.addEventListener("scroll",event=>{if(!panel.hidden&&!panel.contains(event.target))close()},true);
  window.neoMoreMenu={openSearch:showSearch,openCurrent:()=>{
   const id=document.querySelector(".view.active")?.id||"inicio";
   const button=$(id)?.querySelector(".neo-more-trigger-v39");
   if(button)open(button,id,false);
  }};
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
 else init();
})();