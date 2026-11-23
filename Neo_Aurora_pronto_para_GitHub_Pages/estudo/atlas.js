'use strict';
const atlasAurora = (function(){
  // Coordinates on the map are normalized; the projected coordinates also position the keyboard controls.
  const locais=[[-.62,.52],[.02,-.34],[.62,.48]];
  const passos=[
    {nome:'Escalas',materia:'Matemática',rotulo:'Vale das escalas',dica:'Uma medida no papel pode representar um caminho inteiro.',pergunta:'Na escala 1 para 200, quanto representam 3 cm no mapa?',opcoes:['60 cm','6 m','600 m'],correta:1,resposta:'3 × 200 = 600 centímetros. Dividindo por 100, chegamos a 6 metros.'},
    {nome:'Relevo',materia:'Geografia',rotulo:'Cume do relevo',dica:'Observe as linhas que contornam as encostas.',pergunta:'Num mapa com a mesma equidistância, curvas de nível bem próximas indicam o quê?',opcoes:['Encosta íngreme','Terreno plano','Maior distância'],correta:0,resposta:'A altitude varia mais em uma distância horizontal menor. Por isso a encosta é mais íngreme.'},
    {nome:'Energia',materia:'Ciências',rotulo:'Estação das águas',dica:'Siga a água pelo vale e imagine o que ela é capaz de mover.',pergunta:'Em uma usina hidrelétrica, o que faz as pás da turbina girarem?',opcoes:['A luz do Sol','O som do gerador','A água em movimento'],correta:2,resposta:'O movimento da água gira a turbina. O gerador transforma esse movimento em energia elétrica.'}
  ];
  function altura(u,v){
    const sino=(x,y,a,k)=>a*Math.exp(-k*((u-x)**2+(v-y)**2));
    return .1+sino(.08,-.52,1.12,6)+sino(-.65,-.52,.72,9)+sino(.68,-.36,.76,10)+sino(-.72,.48,.25,12)
      +.085*Math.sin(u*13+v*7)*Math.cos(v*9)+.038*Math.cos(u*24-v*17);
  }
  function projetar(u,v,h=altura(u,v)){return [315+u*177+v*110,238+v*58-u*36-h*104];}
  function desenhar(canvas){
    const c=canvas.getContext('2d');if(!c)return;
    const dpr=Math.min(window.devicePixelRatio||1,1.6);
    canvas.width=Math.round(630*dpr);canvas.height=Math.round(370*dpr);
    c.setTransform(dpr,0,0,dpr,0,0);
    const faces=[],objetos=[],m=matchMedia('(max-width: 650px)').matches ? 22 : 36;
    const vert=(i,j)=>{
      let u=i/m*2-1,v=j/m*2-1;
      // Smooth the coastline where boundary lattice vertices meet the exposed rock.
      const raio=Math.sqrt(u*u*.86+v*v*.93+.12*Math.sin(u*7+v*5)+.07*Math.sin(u*13-v*8));
      if(raio>.95 && raio<1.1){const fator=1+(1-raio)*.62;u*=fator;v*=fator;}
      return {u,v,h:altura(u,v)};
    };
    const dentro=(u,v)=>u*u*.86+v*v*.93+.12*Math.sin(u*7+v*5)+.07*Math.sin(u*13-v*8)<1;
    const chao=c.createRadialGradient(326,277,10,326,274,227);
    chao.addColorStop(0,'rgba(23,16,46,.89)');chao.addColorStop(.7,'rgba(103,58,140,.22)');chao.addColorStop(1,'rgba(37,26,61,0)');
    c.save();c.translate(0,163);c.scale(1,.45);c.fillStyle=chao;c.fillRect(0,0,630,520);c.restore();
    function poligono(p,cor){c.beginPath();for(const [i,[x,y]] of p.entries())i?c.lineTo(x,y):c.moveTo(x,y);c.closePath();c.fillStyle=cor;c.fill();c.strokeStyle=cor;c.lineWidth=.48;c.stroke();}
    for(let i=0;i<m;i++)for(let j=0;j<m;j++){
      const a=vert(i,j),b=vert(i+1,j),d=vert(i,j+1),e=vert(i+1,j+1);
      const u=(a.u+e.u)/2,v=(a.v+e.v)/2;
      if(!dentro(u,v))continue;
      for(const [p,q,dx,dy] of [[a,b,0,-1],[b,e,1,0],[e,d,0,1],[d,a,-1,0]]){
        if(i+dx>=0&&i+dx<m&&j+dy>=0&&j+dy<m&&dentro(u+2*dx/m,v+2*dy/m))continue;
        const A=projetar(p.u,p.v,p.h),B=projetar(q.u,q.v,q.h);
        const base=30+5*Math.sin(u*11+v*5),ton=Math.round(28+4*Math.sin(i*3+j*7));
        faces.push({depth:v-u*.62+.01,draw(){
          poligono([A,B,[B[0]-6,B[1]+base],[A[0]-6,A[1]+base]],`hsl(${258+ton/4} 23% ${ton}%)`);
          for(const k of [.22,.61]){c.beginPath();c.moveTo(A[0]-k*6,A[1]+base*k);c.lineTo(B[0]-k*6,B[1]+base*k);c.strokeStyle='#bb9abe60';c.lineWidth=1;c.stroke();}
        }});
      }
      for(const tri of [[a,b,d],[b,e,d]]){
        const h=tri.reduce((s,t)=>s+t.h,0)/3, luz=(altura(u-.035,v-.04)-altura(u+.035,v+.04))*70;
        const agua=v>.34 && Math.abs(u-.20-.50*Math.sin(v*4))<.15;
        let color=agua?`hsl(176 43% ${50+luz/3}%)`:`hsl(${165-53*h} ${23+5*h}% ${Math.max(22,Math.min(77,36+25*h+luz*1.35))}%)`;
        if(h>.76)color=`hsl(${290-h*28} ${15+5*h}% ${Math.max(41,Math.min(93,53+28*h+luz))}%)`;
        const pt=tri.map(t=>projetar(t.u,t.v,t.h));
        faces.push({depth:v-u*.62,draw(){
          poligono(pt,color);
          for(let level=.12;level<1.4;level+=.12){
            const cortes=[];for(let k=0;k<3;k++){const t=tri[k],r=tri[(k+1)%3];if((t.h>level)===(r.h>level))continue;const f=(level-t.h)/(r.h-t.h);cortes.push(projetar(t.u+(r.u-t.u)*f,t.v+(r.v-t.v)*f,level));}
            if(cortes.length===2){c.beginPath();c.moveTo(...cortes[0]);c.lineTo(...cortes[1]);c.strokeStyle='rgba(246,243,215,.46)';c.lineWidth=.77;c.stroke();}
          }
        }});
      }
      if((i*31+j*17)%13===0&&altura(u,v)<.65&&v<.35)objetos.push({u,v});
    }
    faces.sort((a,b)=>a.depth-b.depth).forEach(f=>f.draw());
    for(const {u,v} of objetos){
      const [x,y]=projetar(u,v);poligono([[x-2.9,y],[x,y-10],[x+3.7,y-1]],'#355d56');poligono([[x,y-10],[x+3.7,y-1],[x+1,y]],'#719786');
    }
    // The trail interpolates elevation so the route follows the relief itself.
    c.beginPath();for(let k=0;k<=88;k++){
      const t=k/44,i=Math.min(1,Math.floor(t)),f=t-i;
      const u=locais[i][0]*(1-f)+locais[i+1][0]*f+.055*Math.sin(f*Math.PI*2);
      const v=locais[i][1]*(1-f)+locais[i+1][1]*f+.09*Math.sin(f*Math.PI);
      const p=projetar(u,v);k?c.lineTo(...p):c.moveTo(...p);
    }
    c.lineWidth=4.5;c.strokeStyle='#705b64';c.stroke();c.lineWidth=2;c.strokeStyle='#fff2b3';c.setLineDash([4,2]);c.stroke();c.setLineDash([]);
  }
  function tela(robo,temPerfil){
    return `<section class="atlas-hero" aria-labelledby="atlas-titulo"><div class="atlas-cosmos" aria-hidden="true"></div><div class="atlas-aurora" aria-hidden="true"></div>
    <div class="atlas-copy"><p class="atlas-tag"><i></i> Atlas de estudos · 8º ano</p><h1 id="atlas-titulo">Explore o<br><em>mundo.</em></h1><p>Explore um território de ideias com o Neo. Cada parada abre uma pergunta para você resolver.</p><div class="acoes">${temPerfil?'<a class="principal" href="#painel">Voltar ao meu painel →</a>':'<button class="principal" data-act="começar">Começar como visitante →</button>'}<a class="atlas-link" href="propostas/QUADRO-NEO-AURORA.html?origem=estudo">Quadro do Neo ↗</a></div></div>
    <div class="atlas-instrumento"><div class="atlas-carta"><span class="orientacao" aria-hidden="true">N</span><canvas aria-hidden="true"></canvas><div class="atlas-alvos" role="group" aria-label="Estações do atlas">${passos.map((p,i)=>`<button data-estacao="${i}" aria-label="${p.rotulo}" aria-pressed="${i===0}"><b>${i+1}</b></button>`).join('')}</div><div class="atlas-guia">${robo()}</div></div>
    <div class="atlas-legenda"><div><small id="atlas-materia"></small><h2 id="atlas-nome"></h2></div><button class="atlas-desafio">Abrir desafio ↗</button></div><p id="dica" role="status" hidden></p></div>
    <div class="atlas-rodape"><span>Escolha uma estação</span><nav aria-label="Assuntos do atlas">${passos.map((p,i)=>`<button data-estacao="${i}" aria-pressed="${i===0}">${p.nome}</button>`).join('')}</nav></div></section>
    <section class="papel desafio-atlas" id="desafio-atlas" hidden tabindex="-1"><p class="rotulo"></p><h2></h2><div class="acoes"></div><p role="status"></p></section>`;
  }
  let desmontar=()=>{};
  function montar(){
    desmontar();
    const hero=document.querySelector('.atlas-hero');if(!hero)return;
    const carta=hero.querySelector('.atlas-carta'),guia=hero.querySelector('.atlas-guia'),dica=hero.querySelector('#dica'),neo=hero.querySelector('.neo'),desafio=document.querySelector('#desafio-atlas');
    let atual=0,raf=0;
    const reduz=()=>document.body.classList.contains('quieto')||matchMedia('(prefers-reduced-motion: reduce)').matches;
    desenhar(carta.querySelector('canvas'));
    for(const el of hero.querySelectorAll('.atlas-alvos button')){
      const [x,y]=projetar(...locais[Number(el.dataset.estacao)]);el.style.left=x/630*100+'%';el.style.top=y/370*100+'%';
    }
    function selecionar(i,anunciar){
      atual=i;const p=passos[i], [x,y]=projetar(...locais[i]);
      hero.dataset.estacao=i;delete hero.dataset.reacao;guia.style.left=(x/630*100)+'%';guia.style.top=(y/370*100)+'%';
      for(const el of hero.querySelectorAll('[data-estacao]'))el.setAttribute('aria-pressed',String(el.dataset.estacao===String(i)));
      hero.querySelector('#atlas-materia').textContent=p.materia;hero.querySelector('#atlas-nome').textContent=p.rotulo;
      dica.hidden=!anunciar;neo.setAttribute('aria-expanded',String(anunciar));dica.textContent=p.dica;
      desafio.hidden=true;
    }
    hero.onclick=e=>{
      const estacao=e.target.closest('button[data-estacao]');if(estacao){selecionar(Number(estacao.dataset.estacao),true);return;}
      if(e.target.closest('.neo')){e.stopPropagation();dica.hidden=!dica.hidden;neo.setAttribute('aria-expanded',String(!dica.hidden));return;}
      if(e.target.closest('.atlas-desafio')){
        const p=passos[atual];desafio.hidden=false;desafio.querySelector('.rotulo').textContent=p.materia+' · '+p.nome;desafio.querySelector('h2').textContent=p.pergunta;
        desafio.querySelector('.acoes').replaceChildren(...p.opcoes.map((op,j)=>{const b=document.createElement('button');b.textContent=op;b.onclick=async()=>{
          const certo=j===p.correta;desafio.querySelector('[role=status]').textContent=certo?'Você acertou. '+p.resposta:'Tente novamente. '+p.dica;
          for(const op of desafio.querySelectorAll('button'))op.setAttribute('aria-pressed',String(op===b));if(certo)for(const bot of desafio.querySelectorAll('button'))bot.disabled=true;
          hero.dataset.reacao=certo?'alegre':'pensando';
          if(certo){
            const indice=passos.indexOf(p);
            await estudos.alterar(d=>{d.estacoesAtlas=[...new Set([...(d.estacoesAtlas||[]),indice])];});
            const marca=hero.querySelector('.atlas-rodape [data-estacao="'+indice+'"]');
            if(!marca.textContent.includes('✓'))marca.append(' ✓');
          }
        };return b;}));desafio.querySelector('[role=status]').textContent='';desafio.focus();desafio.scrollIntoView({block:'center',behavior:reduz()?'instant':'smooth'});
      }
    };
    const mover=e=>{
      if(e.pointerType!=='mouse'||reduz()||raf)return;
      raf=requestAnimationFrame(()=>{raf=0;const r=carta.getBoundingClientRect(),x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1)),y=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));
        carta.style.setProperty('--virar',x*3.5+'deg');carta.style.setProperty('--inclinar',-y*2+'deg');neo.style.setProperty('--olhar',x*3+'px');
      });
    };
    hero.addEventListener('pointermove',mover);hero.onpointerleave=()=>{carta.style.removeProperty('--virar');carta.style.removeProperty('--inclinar');};
    selecionar(0,false);
    for(const el of hero.querySelectorAll('.atlas-rodape [data-estacao]')){
      if(estudos.dados.estacoesAtlas?.includes(Number(el.dataset.estacao)))el.append(' ✓');
    }
    desmontar=()=>{cancelAnimationFrame(raf);hero.removeEventListener('pointermove',mover);hero.onclick=null;desmontar=()=>{};};
  }
  return {tela,montar,fechar:()=>desmontar()};
})();
