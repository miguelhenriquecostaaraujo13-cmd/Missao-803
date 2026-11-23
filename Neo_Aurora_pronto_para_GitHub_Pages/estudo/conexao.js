'use strict';
(async()=>{
  if(!/^https?:$/.test(location.protocol))return;
  const pagina=document.body.classList.contains('pagina-offline');
  if(!pagina){
    if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
    const aviso=document.createElement('p');
    aviso.className='estado-rede';aviso.setAttribute('role','status');document.body.prepend(aviso);
    const atualizar=()=>{aviso.hidden=navigator.onLine;aviso.textContent=navigator.onLine?'':'Sem conexão. Você pode continuar a atividade aberta neste navegador.';};
    window.addEventListener('online',atualizar);window.addEventListener('offline',atualizar);atualizar();return;
  }
  const tentar=document.querySelector('#tentar'),status=document.querySelector('#situacao'),local=document.querySelector('#local');
  const destino=new URL('index.html',location.href);destino.hash=location.hash;
  async function verificar(){
    tentar.disabled=true;
    try{
      const res=await fetch(new URL('index.html?verificar=1',destino),{method:'HEAD',cache:'no-store',signal:AbortSignal.timeout(4500)});
      if(!res.ok)throw Error();
      if(location.href.split('#')[0]===destino.href.split('#')[0])location.reload();
      else location.replace(destino.href);
    }catch{status.textContent='O servidor continua fora de alcance. Você pode tentar de novo.';}
    finally{tentar.disabled=false;}
  }
  tentar.onclick=verificar;window.addEventListener('online',verificar);
  if(navigator.serviceWorker?.controller && 'caches' in window){
    const raiz=new URL('./',destino), cachePrefix='missao8-publico-'+raiz.pathname+'-';
    const nomes=(await caches.keys()).filter(nome=>nome.startsWith(cachePrefix));
    for(const nome of nomes){const cache=await caches.open(nome);
      if((await Promise.all(['index.html','conteudos/banco.js','estudo/app.js'].map(recurso=>cache.match(new URL(recurso,raiz))))).every(Boolean)){
        const url=new URL(destino);url.searchParams.set('estudo-local','1');local.href=url.href;local.hidden=false;break;
      }
    }
  }
})().catch(()=>{});
