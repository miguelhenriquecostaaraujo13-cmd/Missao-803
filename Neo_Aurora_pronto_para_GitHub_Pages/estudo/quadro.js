'use strict';

const quadroLivre = (function() {
  const W=960,H=540;
  const vazio=()=>({elementos:[],refazer:[]});
  const estado=()=>estudos.dados.quadro || vazio();
  const blocos=()=>estado().elementos.filter(e=>e.tipo==='bloco');
  const cor='#52387b';
  let pincel='#52387b';
  let pontos=null;
  let canvasAtivo;
  let identificador;
  let aoSalvar;
  const limite=350;
  function avisar(msg){ const el=document.querySelector('#aviso-desenho');if(el)el.textContent=msg; }
  function redesenhar() {
    if(!canvasAtivo?.isConnected)return;
    const c=canvasAtivo.getContext('2d');
    c.clearRect(0,0,W,H);
    c.lineWidth=4;c.lineCap='round';c.lineJoin='round';
    function linha(pontos,cores) {
      if(!pontos?.length)return;
      c.strokeStyle=cores;c.fillStyle=cores;
      c.beginPath();c.moveTo(...pontos[0]);
      for(const p of pontos.slice(1))c.lineTo(...p);
      if(pontos.length===1){c.arc(...pontos[0],2,0,Math.PI*2);c.fill();}else c.stroke();
    }
    const nodes=blocos();
    const el=estado().elementos;
    for(const e of el.filter(e=>e.tipo==='seta')){
      const a=nodes.find(b=>b.id===e.de), b=nodes.find(b=>b.id===e.para);
      if(!a||!b)continue;
      const dx=b.x-a.x,dy=b.y-a.y;
      const ajuste=Math.min(87/Math.max(1,Math.abs(dx)),31/Math.max(1,Math.abs(dy)));
      const x=b.x-dx*ajuste,y=b.y-dy*ajuste,ang=Math.atan2(dy,dx);
      linha([[a.x,a.y],[x,y]],cor);
      linha([[x-14*Math.cos(ang-.48),y-14*Math.sin(ang-.48)],[x,y],[x-14*Math.cos(ang+.48),y-14*Math.sin(ang+.48)]],cor);
    }
    for(const e of el){
      if(e.tipo==='traco')linha(e.pontos,e.cor);
      if(e.tipo==='bloco'){
        c.fillStyle='#efe7fb';c.fillRect(e.x-82,e.y-27,164,54);c.strokeStyle=cor;c.lineWidth=2;c.strokeRect(e.x-82,e.y-27,164,54);
        c.fillStyle='#282139';c.font='600 20px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText(e.texto,e.x,e.y,145);c.lineWidth=4;
      }
    }
    linha(pontos,pincel);
  }
  async function adicionar(e) {
    const ok=await estudos.alterar(d=>{
      const q=d.quadro || (d.quadro=vazio());
      if(q.elementos.length>=limite)return false;
      if(e.tipo==='seta'&&(![e.de,e.para].every(id=>q.elementos.some(n=>n.id===id&&n.tipo==='bloco'))||q.elementos.some(n=>n.tipo==='seta'&&n.de===e.de&&n.para===e.para)))return false;
      if(e.tipo==='bloco'){
        const n=q.elementos.filter(n=>n.tipo==='bloco').length;
        if(n>=16)return false;
        e.x=125+(n%4)*235;e.y=76+Math.floor(n/4)*128;
      }
      q.elementos.push(e);q.refazer=[];return true;
    });
    if(!ok){avisar('O quadro atingiu o limite ou essa ligação já existe.');return;}
    if(canvasAtivo?.isConnected){aoSalvar();avisar(estudos.mensagem || 'Desenho salvo neste navegador.');}
  }
  function tela(esc) {
    const q=estado(),nos=blocos();
    const opcoes=nos.map(n=>`<option value="${esc(n.id)}">${esc(n.texto)}</option>`).join('');
    const resumo=q.elementos.filter(e=>e.tipo==='bloco'||e.tipo==='seta').map(e=>{
      if(e.tipo==='bloco')return `<li>Bloco · ${esc(e.texto)}</li>`;
      const nome=id=>esc(nos.find(n=>n.id===id)?.texto||'');
      return `<li>${nome(e.de)} → ${nome(e.para)}</li>`;
    }).join('');
    return `<section class="papel oficina-quadro"><div class="barra-desenho" role="group" aria-label="Ferramentas de desenho"><label>Cor do traço <select id="pincel">${[['#52387b','Violeta'],['#195b57','Verde'],['#993a26','Terracota']].map(([c,n])=>`<option value="${c}" ${c===pincel?'selected':''}>${n}</option>`).join('')}</select></label><button data-quadro="desfazer" ${q.elementos.length?'':'disabled'}>Desfazer</button><button data-quadro="refazer" ${q.refazer.length?'':'disabled'}>Refazer</button><button id="exportar-quadro" ${q.elementos.length?'':'disabled'}>Baixar quadro em HTML</button></div>
      <div class="folha-desenho">${q.elementos.length?'':'<p class="dica-quadro">Desenhe com o dedo ou o mouse. Para montar um fluxograma, adicione a primeira ideia abaixo.</p>'}<canvas id="desenho" width="${W}" height="${H}" aria-label="Área de desenho livre. Os formulários abaixo permitem criar fluxogramas pelo teclado."></canvas></div><p id="aviso-desenho" role="status"></p></section>
      <div class="grade"><form id="bloco" class="papel"><h2>Blocos</h2><label>Ideia ou etapa<input name="nome" maxlength="36" required></label><button>Adicionar bloco</button></form><form id="seta" class="papel"><h2>Conectar ideias</h2><label>De<select name="de">${opcoes}</select></label><label>Para<select name="para">${opcoes}</select></label><button ${nos.length<2?'disabled':''}>Conectar</button></form></div>
      <details id="leitura-quadro"><summary>Ler elementos do quadro</summary><p>${q.elementos.filter(e=>e.tipo==='traco').length} traços livres</p><ol>${resumo}</ol></details>`;
  }
  function exportarLeitura(){
    const doc=document.implementation.createHTMLDocument('Meu quadro de estudos');
    doc.documentElement.lang='pt-BR';
    const meta=doc.createElement('meta');
    meta.name='viewport';meta.content='width=device-width,initial-scale=1';doc.head.append(meta);
    const politica=doc.createElement('meta');
    politica.httpEquiv='Content-Security-Policy';
    politica.content="default-src 'none'; img-src data:; style-src 'unsafe-inline'";
    const charset=doc.createElement('meta');charset.setAttribute('charset','utf-8');doc.head.prepend(charset,politica);
    const estilo=doc.createElement('style');
    estilo.textContent='body{max-width:60rem;margin:auto;padding:1rem;color:#282139;background:white;font:1rem/1.6 system-ui}img{width:100%;height:auto;border:1px solid #9c91aa}h1{line-height:1.2}';
    doc.head.append(estilo);
    const titulo=doc.createElement('h1');titulo.textContent=doc.title;
    const figura=doc.createElement('img');figura.src=canvasAtivo.toDataURL('image/png');figura.alt='Desenho e fluxograma do quadro. Os blocos e suas conexões estão descritos a seguir.';
    const leitura=document.querySelector('#leitura-quadro').cloneNode(true);leitura.removeAttribute('id');leitura.open=true;
    doc.body.append(titulo,figura,leitura);
    const arquivo=new Blob(['<!doctype html>',doc.documentElement.outerHTML],{type:'text/html;charset=utf-8'});
    const url=URL.createObjectURL(arquivo),link=document.createElement('a');
    link.href=url;link.download='meu-quadro-missao-803.html';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
    avisar('Arquivo de leitura preparado para download.');
  }
  function montar(recarregar) {
    aoSalvar=recarregar;canvasAtivo=document.querySelector('#desenho');pontos=null;identificador=null;
    const canvas=canvasAtivo;
    const pos=e=>{const r=canvas.getBoundingClientRect();return [Math.round(Math.max(0,Math.min(W,(e.clientX-r.left)*W/r.width))),Math.round(Math.max(0,Math.min(H,(e.clientY-r.top)*H/r.height)))];};
    canvas.onpointerdown=e=>{if(identificador!=null||e.button!==0)return;identificador=e.pointerId;canvas.setPointerCapture(e.pointerId);pontos=[pos(e)];redesenhar();};
    canvas.onpointermove=e=>{if(e.pointerId!==identificador||!pontos)return;const p=pos(e),ultima=pontos.at(-1);if(Math.hypot(p[0]-ultima[0],p[1]-ultima[1])<3)return;if(pontos.length>=640)pontos=pontos.filter((_,i)=>i%2===0);pontos.push(p);redesenhar();};
    canvas.onpointerup=async e=>{if(e.pointerId!==identificador)return;const traco=pontos;identificador=null;pontos=null;if(traco)await adicionar({tipo:'traco',id:estudos.uid(),cor:pincel,pontos:traco});};
    canvas.onpointercancel=()=>{pontos=null;identificador=null;redesenhar();};
    document.querySelector('#exportar-quadro').onclick=exportarLeitura;
    document.querySelector('#pincel').onchange=e=>{pincel=e.target.value;};
    document.querySelector('#bloco').onsubmit=async e=>{e.preventDefault();const texto=e.target.elements.nome.value.trim();if(texto)await adicionar({tipo:'bloco',id:estudos.uid(),texto});document.querySelector('#bloco input')?.focus();};
    document.querySelector('#seta').onsubmit=async e=>{e.preventDefault();const de=e.target.elements.de.value,para=e.target.elements.para.value;if(de===para){avisar('Escolha dois blocos diferentes.');return;}await adicionar({tipo:'seta',id:estudos.uid(),de,para});};
    for(const b of document.querySelectorAll('[data-quadro]'))b.onclick=async ()=>{
      const undo=b.dataset.quadro==='desfazer';
      const origem=undo?'elementos':'refazer',alvo=undo?'refazer':'elementos', esperado=estado()[origem].at(-1)?.id;
      await estudos.alterar(d=>{const q=d.quadro;if(q && esperado && q[origem].at(-1)?.id===esperado) q[alvo].push(q[origem].pop());});
      if(canvas.isConnected)recarregar();
    };
    redesenhar();
  }
  return { tela,montar };
})();
