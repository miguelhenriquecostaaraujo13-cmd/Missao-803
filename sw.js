'use strict';
const escopo=self.registration.scope;
const prefixo='missao8-publico-'+new URL(escopo).pathname+'-';
const versao=prefixo+'20261123-premium-internas-v1';
const arquivos=['index.html','offline.html','estudo/trilhas.js','estudo/melhorias.css','estudo/transicoes.js','estudo/transicoes.css','estudo/premium-2026.css','estudo/premium-2026.js','manifest.webmanifest','icons/neo-192.png','icons/neo-512.png','estudo/instalacao.js','estudo/instalacao.css','conteudos/banco.js','propostas/visitante.js','propostas/QUADRO-NEO-AURORA.html',
 ...['app','identidade','contas','dados','aula-escalas','apresentacao','atlas','celebracoes','tutor','quadro','ilustracoes','conexao'].map(n=>'estudo/'+n+'.js'),
 ...['apresentacao','atlas','aurora','controles','identidade','manual','entrada'].map(n=>'estudo/'+n+'.css'),
 'estudo/midia/aurora.webp',
 ...['arte','ciencias','geografia','historia','ingles','matematica','movimento','portugues','observatorio'].map(n=>'estudo/ilustracoes/'+n+'.svg')];
const urls=new Set(arquivos.map(f=>new URL(f,escopo).href));
self.addEventListener('install',evento=>evento.waitUntil((async()=>{
 const cache=await caches.open(versao);
 await cache.addAll([...urls].map(url=>new Request(url,{cache:'reload'})));
})()));
self.addEventListener('activate',evento=>evento.waitUntil((async()=>{
 for(const nome of await caches.keys())if(nome.startsWith(prefixo)&&nome!==versao)await caches.delete(nome);
 await self.clients.claim();
})()));
self.addEventListener('fetch',evento=>{
 const req=evento.request,url=new URL(req.url);
 if(req.method!=='GET'||!req.url.startsWith(escopo))return;
 const endereco=new URL(url.pathname,escopo).href;
 const raiz=endereco===escopo||endereco===escopo+'index.html';
 const quadro=endereco===escopo+'propostas/QUADRO-NEO-AURORA.html';
 if(req.mode==='navigate'&&(raiz||quadro)){
   if([...url.searchParams.keys()].some(k=>!['estudo-local','origem'].includes(k)))return;
   evento.respondWith(fetch(req).catch(async()=>{
     const cache=await caches.open(versao);
     return await cache.match(quadro?endereco:escopo+(url.searchParams.has('estudo-local')?'index.html':'offline.html'))||Response.error();
   }));
 } else if(!url.search&&urls.has(endereco)){
   evento.respondWith(fetch(req).catch(async()=>await (await caches.open(versao)).match(endereco)||Response.error()));
 }
});
