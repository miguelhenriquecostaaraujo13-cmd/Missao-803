'use strict';
const apresentacaoAurora = (function(){
  const item=estudos.porId.get('3637784d4fdae555');
  const etapas=['Questão','Explicação','Flashcard'];
  function neoMinimo(){
    try{return localStorage.getItem('missao803.neo')==='minimo';}catch{return false;}
  }
  function ajustarNeo(minimo){
    document.body.classList.toggle('neo-minimo',minimo);
    try{localStorage.setItem('missao803.neo',minimo?'minimo':'normal');}catch{}
  }
  function tela(robo,temPerfil){
    const acesso=temPerfil?'<a class="acao-aurora" href="#painel">Voltar ao meu painel <b>↗</b></a>':'<a class="acao-aurora" href="#conta/criar">Criar conta <b aria-hidden="true">↗</b></a>';
    return `<section class="palco" aria-labelledby="titulo-aurora">
    <div class="cinema"><i class="limite-cabecalho" aria-hidden="true"></i><video class="filme-aurora" aria-hidden="true" tabindex="-1" autoplay muted playsinline loop preload="none" poster="estudo/midia/aurora.webp"></video>
    <div class="abertura"><button class="vidro-etiqueta selo-neo" aria-controls="apresentar-neo" aria-expanded="false"><i aria-hidden="true"><b></b><b></b></i> Neo Aurora <span>·</span> Estudos do 8º ano</button>
    <h1 id="titulo-aurora">Aprender começa<br><em>com uma pergunta.</em></h1><p id="apresentar-neo" aria-live="polite">Explore as matérias do 8º ano, pratique no seu ritmo e volte ao que quer lembrar. O Neo acompanha você.</p>
    <div class="chamadas">${acesso}${temPerfil?'':'<a class="acao-vidro" href="#conta/entrar">Entrar</a>'}</div>${temPerfil?'':'<button class="visitante-discreto" data-act="começar">Continuar como visitante</button>'}</div></div>
</section>
<section class="historia-entrada"><div><p class="rotulo">Nossa história</p><h2>Da turma 803<br>ao <em>8º ano.</em></h2></div><p>O Missão 803 começou como um espaço de estudos para a turma. Esta edição reúne questões, revisões e explicações no mesmo lugar para ajudar estudantes do 8º ano a praticar entre as aulas.</p></section>
<section class="guias-entrada"><h2>Por onde começar?</h2><div class="guias-grade">${[['trilha','Trilhas','Escolha um assunto e pratique uma etapa por vez.'],['revisao','Flashcards','Reencontre os cartões na hora de revisar.'],['tutor','Tutor Neo','Procure uma explicação no material da sua matéria.']].map(([id,nome,desc])=>`<a href="${temPerfil?'#'+id:'#conta/criar'}" data-destino="${id}">${identidadeAurora.icone(id)}<strong>${nome}</strong><span>${desc}</span></a>`).join('')}</div></section>
<section class="entardecer"><div class="horizonte" aria-hidden="true"></div><div class="paisagem" aria-hidden="true"></div><div class="encerrar-estudo"><h2>Uma pausa entre ideias.</h2><button type="button" class="alternar-luz" aria-pressed="false">Apagar a luz da cena</button></div></section>`;
  }
  function pratica(robo){
    return `<section class="palco pratica-interna"><div class="pratica-aurora"><div class="intro-pratica"><p class="rotulo">Matemática · Atividade guiada</p><h2>Quatro fatores, uma potência.</h2><p>Experimente o raciocínio com o Neo e leve um cartão para a sua próxima revisão.</p></div><div class="laboratorio"><div class="bancada"><div class="folha-tras f1"></div><div class="folha-tras f2"></div>
    <section class="ficha-ativa" aria-label="Atividade interativa de matemática" tabindex="-1"><div class="ficha-top"><span>Matemática <i> / </i> Potenciação</span><button class="recolher-neo" aria-pressed="false">Minimizar Neo</button></div>
    <div class="instrumentos"><div class="doca-neo">${robo()}</div><div class="regua"><div class="trilho-luz"></div><ol>${etapas.map((p,i)=>`<li data-marca="${i}">${p}</li>`).join('')}</ol></div></div>
    <div class="microaula"></div><p class="fala-aurora" id="dica" role="status" hidden></p></section></div></div></div></section>`;
  }
  function filmeDaEntrada(cena, movimentoReduzido, signal){
    const video=cena.querySelector('video');
    const compacto=matchMedia('(max-width: 680px)');
    let visivel=false;
    const permitido=()=>visivel && !document.hidden && !movimentoReduzido();
    function alternativa(){
      if(!signal.aborted && permitido())cena.dataset.fundo='luz';
    }
    function sincronizar(){
      if(!permitido()){cena.dataset.fundo='poster';video.pause();return;}
      alternativa();
      if(navigator.connection?.saveData || !video.canPlayType('video/webm; codecs="vp8"'))return;
      if(!video.getAttribute('src'))video.src='estudo/midia/'+(compacto.matches?'aurora-compacta':'aurora')+'.webm';
      video.muted=true;
      video.play().then(()=>{if(!signal.aborted && permitido() && !video.paused)cena.dataset.fundo='filme';}).catch(alternativa);
    }
    video.addEventListener('playing',()=>{if(permitido())cena.dataset.fundo='filme';},{signal});
    for(const evento of ['error','waiting','stalled'])video.addEventListener(evento,alternativa,{signal});
    const intersecao=new IntersectionObserver(([entrada])=>{visivel=entrada.isIntersecting;sincronizar();});
    intersecao.observe(cena);
    const preferencia=matchMedia('(prefers-reduced-motion: reduce)');
    preferencia.addEventListener('change',sincronizar,{signal});
    document.addEventListener('visibilitychange',sincronizar,{signal});
    window.addEventListener('preferencia-movimento',sincronizar,{signal});
    const mudanca=new MutationObserver(sincronizar);
    mudanca.observe(document.body,{attributes:true,attributeFilter:['class']});
    signal.addEventListener('abort',()=>{intersecao.disconnect();mudanca.disconnect();video.pause();video.removeAttribute('src');video.load();},{once:true});
  }
  let encerrar=()=>{};
  function montar(){
    encerrar();const palco=document.querySelector('.palco');if(!palco)return;
    const card=palco.querySelector('.ficha-ativa'),micro=palco.querySelector('.microaula');
    const fala=palco.querySelector('.fala-aurora'),neo=palco.querySelector('.neo'),minimo=palco.querySelector('.recolher-neo');
    const controlador=new AbortController(),op={signal:controlador.signal};
    let etapa=0,resposta=null,virado=false,gravando=false,quadro=0;
    const reduz=identidadeAurora.reduzir;
    if(palco.querySelector('.cinema')){
      filmeDaEntrada(palco.querySelector('.cinema'),reduz,controlador.signal);
      const cabecalho=new IntersectionObserver(([entrada])=>{
        document.body.classList.toggle('com-rolagem',!entrada.isIntersecting&&entrada.boundingClientRect.top<0);
      });
      cabecalho.observe(palco.querySelector('.limite-cabecalho'));
      controlador.signal.addEventListener('abort',()=>{cabecalho.disconnect();document.body.classList.remove('com-rolagem');},{once:true});
      const selo=palco.querySelector('.selo-neo'),apresentar=palco.querySelector('#apresentar-neo');
      const descricao=apresentar.textContent;
      selo.addEventListener('click',()=>{
        const abrir=selo.getAttribute('aria-expanded')!=='true';
        selo.setAttribute('aria-expanded',String(abrir));
        apresentar.textContent=abrir?'Sou o Neo. Vou acompanhar suas questões e revisões, uma etapa de cada vez.':descricao;
      },op);
      const interruptor=document.querySelector('.alternar-luz');
      interruptor.addEventListener('click',()=>{
        const noite=interruptor.closest('.entardecer').classList.toggle('noite');
        interruptor.setAttribute('aria-pressed',String(noite));
        interruptor.textContent=noite?'Acender a luz da cena':'Apagar a luz da cena';
      },op);
      encerrar=()=>controlador.abort();
      return;
    }
    function encolher(sim){
      palco.classList.toggle('neo-recolhido',sim);neo.hidden=sim;minimo.setAttribute('aria-pressed',String(sim));minimo.textContent=sim?'Mostrar Neo':'Minimizar Neo';if(sim){fala.hidden=true;neo.setAttribute('aria-expanded','false');}
    }
    encolher(neoMinimo());
    function mensagem(texto){fala.textContent=texto;fala.hidden=neo.hidden;neo.setAttribute('aria-expanded',String(!fala.hidden));}
    function mostrar(foco=false){
      palco.dataset.etapa=String(etapa);
      for(const marca of card.querySelectorAll('[data-marca]')){
        if(Number(marca.dataset.marca)===etapa)marca.setAttribute('aria-current','step');else marca.removeAttribute('aria-current');
      }
      if(etapa===0)micro.innerHTML=`<div class="formula-hero"><span>3<sup>4</sup></span><h2>${item.pergunta}</h2></div><div class="opcoes-hero">${[2,0,3,1].map(i=>`<button data-escolha="${i}">${item.alternativas[i]}</button>`).join('')}</div>`;
      if(etapa===1)micro.innerHTML=`<p class="fracao">${resposta===item.correta?'Você acertou':'Vamos conferir'} · Sua resposta foi ${item.alternativas[resposta]}</p><h2>Quatro fatores iguais</h2><p>${item.explicacao}</p><button class="passo-hero" data-acao-hero="cartao">Criar flashcard →</button>`;
      if(etapa===2){const salvo=Boolean(estudos.dados.revisoes[item.id]);micro.innerHTML=`<button class="viravel" data-acao-hero="virar" aria-label="Virar flashcard"><span>${virado?'Resposta':'Pergunta'}</span><strong>${virado?item.explicacao:item.pergunta}</strong><small>Virar ↻</small></button><button class="passo-hero" data-acao-hero="salvar" ${salvo?'disabled':''}>${salvo?'Guardado para revisão ✓':'Guardar para revisar'}</button><button class="reiniciar-hero" data-acao-hero="repetir">Recomeçar</button>`;}
      if(!reduz() && foco)micro.animate([{opacity:.3,transform:etapa===2?'perspective(700px) rotateY(-18deg)':'translateY(8px)'},{opacity:1,transform:'none'}],{duration:310,easing:'cubic-bezier(.2,.8,.2,1)'});
      if(foco)card.focus({preventScroll:true});
    }
    palco.addEventListener('click',async e=>{
      const b=e.target.closest('button');if(!b)return;
      if(b===neo){e.stopPropagation();if(fala.hidden)mensagem(['Leia a potência como uma multiplicação.','Compare a quantidade de fatores com o expoente.','Tente lembrar antes de virar o cartão.'][etapa]);else{fala.hidden=true;neo.setAttribute('aria-expanded','false');}return;}
      if(b===minimo){const sim=!neo.hidden;encolher(sim);ajustarNeo(sim);return;}
      if(b.dataset.escolha!==undefined){resposta=Number(b.dataset.escolha);etapa=1;palco.dataset.humor=resposta===item.correta?'alegre':'pensando';mostrar(true);mensagem(resposta===item.correta?'Isso! Agora explique como chegou a 81.':'O expoente conta os fatores. Vamos multiplicar juntos.');return;}
      switch(b.dataset.acaoHero){
        case 'cartao': etapa=2;mostrar(true);mensagem('Este cartão pode entrar na sua próxima revisão.');break;
        case 'virar':virado=!virado;mostrar(true);micro.querySelector('.viravel').focus();break;
        case 'salvar':if(!gravando){gravando=true;b.setAttribute('aria-busy','true');try{await estudos.guardarCard(item.id);mostrar(true);mensagem(estudos.mensagem||'Guardado. Você vai encontrá-lo em Flashcards neste navegador.');}finally{b.removeAttribute('aria-busy');gravando=false;}}break;
        case 'repetir':etapa=0;resposta=null;virado=false;delete palco.dataset.humor;fala.hidden=true;neo.setAttribute('aria-expanded','false');mostrar(true);break;
      }
    },op);
    palco.addEventListener('pointermove',e=>{
      if(e.pointerType!=='mouse'||reduz()||quadro)return;
      quadro=requestAnimationFrame(()=>{quadro=0;const r=palco.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;
        neo.style.setProperty('--olhar',x*6+'px');});
    },op);
    mostrar();encerrar=()=>{controlador.abort();cancelAnimationFrame(quadro);encerrar=()=>{};};
  }
  return {tela,pratica,montar,neoMinimo,ajustarNeo,fechar:()=>encerrar()};
})();
