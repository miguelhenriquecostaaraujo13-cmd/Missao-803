'use strict';
(() => {
 let convite=null;
 const emApp=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const ehIOS=()=>/iPad|iPhone|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 function ajuda(){
  const dialogo=document.getElementById('ajuda-instalar');if(!dialogo)return;
  dialogo.querySelector('#passos-instalar').textContent=ehIOS()
   ? 'No Safari, toque em Compartilhar e escolha “Adicionar à Tela de Início”. Depois confirme.'
   : /Android/i.test(navigator.userAgent)
   ? 'No Chrome, toque no menu ⋮ e escolha “Instalar app” ou “Adicionar à tela inicial”. Depois confirme.'
   : 'Abra o menu do navegador e procure “Instalar aplicativo” ou o ícone de instalação na barra de endereços.';
  if(typeof dialogo.showModal==='function')dialogo.showModal();else dialogo.hidden=false;
 }
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();convite=e;});
 window.addEventListener('appinstalled',()=>{convite=null;document.getElementById('instalar-missao')?.setAttribute('hidden','');});
 function montar(){
  const topo=document.querySelector('.topo');if(!topo||document.getElementById('instalar-missao'))return;
  const botao=document.createElement('button');botao.type='button';botao.id='instalar-missao';botao.className='instalar-missao';
  botao.textContent='↓ Baixar app';botao.setAttribute('aria-label','Instalar o Missão 8º Ano neste dispositivo');botao.hidden=emApp();topo.append(botao);
  const d=document.createElement('dialog');d.id='ajuda-instalar';d.className='ajuda-instalar';
  d.innerHTML='<h2>Instale o Missão 8º Ano</h2><p>Tenha o Neo Aurora na sua tela inicial, como um aplicativo, sem pagar nada.</p><p id="passos-instalar"></p><button type="button" class="fechar-instalar">Entendi</button>';
  document.body.append(d);d.querySelector('button').addEventListener('click',()=>{if(d.open)d.close();else d.hidden=true;});
  d.addEventListener('click',e=>{if(e.target===d&&d.open)d.close();});
  botao.addEventListener('click',async()=>{
   if(emApp())return;
   if(convite){const pedido=convite;convite=null;try{await pedido.prompt();await pedido.userChoice;}catch{ajuda();}}
   else ajuda();
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montar,{once:true});else montar();
})();
