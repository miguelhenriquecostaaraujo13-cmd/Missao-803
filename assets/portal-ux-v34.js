/* Upgrade global v34 — ferramentas existentes, busca acessível e atalhos.
   Não altera conteúdo, notas, permissões ou registros da escola. */
(() => {
 "use strict";
 const $=id=>document.getElementById(id);
 const STORE="portal803-ux34-starred";
 let starred=new Set(),queryInput=null,results=null,dialog=null,lastFocus=null;
 const labels=new Map();
 function read(){
  try{const data=JSON.parse(localStorage.getItem(STORE)||"[]");starred=new Set(Array.isArray(data)?data.filter(x=>typeof x==="string").slice(0,31):[])}catch(e){starred=new Set()}
 }
 function save(){try{localStorage.setItem(STORE,JSON.stringify([...starred]))}catch(e){}}
 function allowed(id){
  if(id==="neoLab"&&!window.neoAdminGate?.isAuthorized?.())return false;
  const button=document.querySelector('.navbtn[data-view="'+CSS.escape(id)+'"]');
  if(!button||button.hidden||button.closest("[hidden]"))return false;
  return true;
 }
 function go(id){
  if(!allowed(id))return;
  if(typeof window.showView==="function")window.showView(id);
  if(dialog?.open)dialog.close();
 }
 function nameOf(id){
  const item=labels.get(id);
  return item?.name||id;
 }
 function createDialog(){
  dialog=document.createElement("dialog");dialog.className="neo-tool-search";dialog.id="neoToolSearch34";
  dialog.setAttribute("aria-labelledby","neoSearchTitle34");
  const head=document.createElement("div");head.className="neo-search-header";
  const heading=document.createElement("h2");heading.id="neoSearchTitle34";heading.textContent="🔎 Encontrar ferramenta";
  const close=document.createElement("button");close.type="button";close.className="neo-search-close";close.textContent="×";close.setAttribute("aria-label","Fechar busca");close.addEventListener("click",()=>dialog.close());
  head.append(heading,close);
  const label=document.createElement("label");label.htmlFor="neoToolQuery34";label.textContent="Nome, matéria ou categoria";
  queryInput=document.createElement("input");queryInput.type="search";queryInput.id="neoToolQuery34";queryInput.placeholder="Ex.: Matemática, tutor, mapa, jogos";queryInput.autocomplete="off";queryInput.maxLength=90;
  results=document.createElement("div");results.id="neoToolResults34";results.className="neo-search-results";results.setAttribute("role","list");
  const foot=document.createElement("div");foot.className="neo-search-foot";foot.textContent="Atalho: Ctrl + K ou ⌘ + K. Aperte Esc para fechar.";
  dialog.append(head,label,queryInput,results,foot);
  document.body.append(dialog);
  queryInput.addEventListener("input",renderSearch);
  queryInput.addEventListener("keydown",event=>{
   if(event.key==="Enter"){
    const first=results.querySelector("button");if(first){event.preventDefault();first.click()}
   }
  });
  dialog.addEventListener("close",()=>lastFocus?.focus?.());
 }
 const normalize=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 function renderSearch(){
  if(!results)return;
  results.replaceChildren();
  const value=normalize(queryInput.value).trim();
  const items=[...labels.values()].filter(entry=>allowed(entry.id));
  const ranked=items.map(entry=>({
   ...entry,score:value?normalize(entry.name+" "+entry.group).includes(value)?10:normalize(entry.name).split(/[^a-z0-9]+/).some(t=>t.startsWith(value))?5:0:(starred.has(entry.id)?5:1)
  })).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,"pt-BR")).slice(0,13);
  if(!ranked.length){const p=document.createElement("p");p.textContent="Nenhuma ferramenta encontrada. Tente outra palavra.";results.append(p);return}
  for(const item of ranked){
   const button=document.createElement("button");button.type="button";
   const title=document.createElement("span");title.textContent=(starred.has(item.id)?"⭐ ":"")+item.name;
   const category=document.createElement("small");category.textContent=item.group;
   button.append(title,category);button.addEventListener("click",()=>go(item.id));results.append(button);
  }
 }
 function showSearch(){
  if(!dialog?.showModal)return;
  lastFocus=document.activeElement;
  queryInput.value="";renderSearch();dialog.showModal();queryInput.focus();
 }
 function currentPage(){return document.querySelector(".view.active")}
 function createToolbar(view){
  const id=view.id;
  if(!id||view.querySelector(".neo-global-bar"))return;
  const bar=document.createElement("div");bar.className="neo-global-bar";bar.setAttribute("aria-label","Atalhos desta ferramenta");
  const heading=document.createElement("div");heading.className="neo-tool-heading";
  const strong=document.createElement("strong");strong.textContent=nameOf(id);
  const sub=document.createElement("small");sub.textContent="Atalhos rápidos desta ferramenta";
  heading.append(strong,sub);
  const shortcut=(text,fn)=>{
   const button=document.createElement("button");button.type="button";button.className="neo-bar-action";button.textContent=text;button.addEventListener("click",fn);return button;
  };
  const find=shortcut("🔎 Buscar",showSearch);
  const favorite=shortcut("☆ Favoritar",()=>{
   if(starred.has(id))starred.delete(id);else starred.add(id);save();refreshToolbar(view);renderSearch();
  });favorite.classList.add("neo-fav-action");
  const copy=shortcut("🔗 Link",async()=>{
   if(!allowed(id))return;
   const url=new URL(window.location.href);url.searchParams.set("ferramenta",id);
   const feedback=bar.querySelector(".neo-bar-feedback");
   try{if(!navigator.clipboard?.writeText)throw Error("clipboard");await navigator.clipboard.writeText(url.toString());feedback.textContent="Link copiado";}catch(e){feedback.textContent="Copie o endereço da barra do navegador";}
  });
  const back=shortcut("🏠 Início",()=>go("inicio"));
  const feedback=document.createElement("span");feedback.className="neo-bar-feedback";feedback.setAttribute("role","status");
  bar.append(heading,find,favorite,copy,back,feedback);
  view.insertBefore(bar,view.firstChild);
  refreshToolbar(view);
 }
 function refreshToolbar(view){
  const button=view.querySelector(".neo-fav-action");if(!button)return;
  const active=starred.has(view.id);
  button.setAttribute("aria-pressed",String(active));button.textContent=active?"★ Favorito":"☆ Favoritar";
 }
 function init(){
  read();
  document.querySelectorAll('.navbtn[data-view]').forEach(btn=>{
   const group=btn.closest(".navgroup")?.querySelector("summary")?.childNodes[0]?.textContent?.trim()||"Portal";
   labels.set(btn.dataset.view,{id:btn.dataset.view,name:btn.textContent.trim(),group});
  });
  createDialog();
  document.querySelectorAll(".view").forEach(createToolbar);
  document.addEventListener("keydown",event=>{
   if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){
    event.preventDefault();if(dialog.open)dialog.close();else showSearch();
   }
  });
  document.addEventListener("portal8:viewchange",event=>{
   const page=$(event.detail?.id);if(page)refreshToolbar(page);
  });
  // A área de testes só pode ser aberta quando a autorização do Supabase permite.
  // Não criamos atalhos que contornem o bloqueio do menu existente.
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();