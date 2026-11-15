/* Atalho direto para funções existentes; sem coleta de dados nem contas externas. */
(() => {
 "use strict";
 function openSelected(){
  const params=new URLSearchParams(location.search);
  const requested=params.get("ferramenta")||(location.hash==="#neoLab"?"neoLab":null);
  if(requested!=="neoLab")return;
  if(typeof window.showView!=="function")return;
  const page=document.getElementById(requested);
  if(!page?.classList.contains("view"))return;
  window.showView(requested);
  document.querySelector('nav .navgroup[data-category="extras"]')?.setAttribute("open","");
  if(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)page.scrollIntoView({block:"start",behavior:"instant"});
  else page.scrollIntoView({block:"start",behavior:"smooth"});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(openSelected,0),{once:true});
 else setTimeout(openSelected,0);
})();
