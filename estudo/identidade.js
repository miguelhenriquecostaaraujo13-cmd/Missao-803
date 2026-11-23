'use strict';
const identidadeAurora = (() => {
  const sistemaMovimento=matchMedia('(prefers-reduced-motion: reduce)');
  let preferencia='sistema';
  function lerMovimento(){
    try{const modo=localStorage.getItem('missao803.movimento');preferencia=['animar','reduzido'].includes(modo)?modo:'sistema';}catch{}
  }
  lerMovimento();
  function aplicarMovimento(){
    document.documentElement.classList.toggle('animar-fundo',preferencia==='animar');
    document.body.classList.toggle('quieto',reduzir());
    window.dispatchEvent(new Event('preferencia-movimento'));
  }
  function reduzir(){return preferencia==='reduzido'||(preferencia==='sistema'&&sistemaMovimento.matches);}
  function definirMovimento(valor){
    if(!['animar','reduzido','sistema'].includes(valor))return;
    preferencia=valor;
    try{localStorage.setItem('missao803.movimento',valor);}catch{}
    aplicarMovimento();
  }
  sistemaMovimento.addEventListener('change',aplicarMovimento);
  window.addEventListener('storage',e=>{if(e.key==='missao803.movimento'||e.key===null){lerMovimento();aplicarMovimento();}});
  aplicarMovimento();
  const caminhos = {
    painel:'M3 11l9-8 9 8 M5 10v10h5v-6h4v6h5V10',
    trilha:'M5 18h10a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h10 M16 3l3 3-3 3',
    atlas:'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z M9 3v15 M15 6v15',
    simulados:'M6 4h12v16H6z M9 9h6 M9 13h4',
    revisao:'M6 7h14v12H6z M3 16V4h13',
    biblioteca:'M3 5c3-1 6-1 9 1 3-2 6-2 9-1v13c-3-1-6-1-9 1-3-2-6-2-9-1z M12 6v13',
    tutor:'M4 7h16v10H9l-4 3v-3H4z M9 11v2 M15 11v2',
    quadro:'M3 4h18v13H3z M12 17v4 M7 13l4-4 3 2 3-4',
    busca:'M15 15l6 6 M17 10a7 7 0 1 1-14 0 7 7 0 1 1 14 0',
    caderno:'M5 3h13a2 2 0 0 1 2 2v16H5z M9 3v18 M12 8h5 M12 12h4',
    agenda:'M4 5h16v15H4z M4 10h16 M8 3v4 M16 3v4 M8 14h4',
    ajustes:'M3 7h6m5 0h7 M3 17h10m5 0h3 M9 4h5v6H9z M13 14h5v6h-5z',
    salvar:'M6 3h12v18l-6-4-6 4z'
  };
  function icone(chave) {
    return `<svg class="icone-aurora" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><path d="${caminhos[chave]||caminhos.biblioteca}"/></svg>`;
  }
  function organizarArea(main){
    const cab=main.querySelector('.cab');
    if(!cab)return;
    cab.remove();
    const folha=document.createElement('div');
    folha.className='folha-estudo';
    folha.append(...main.childNodes);
    main.replaceChildren(cab,folha);
  }
  const rodape=document.querySelector('.rodape-aurora');
  if(rodape){
    const inicio=rodape.dataset.inicio;
    rodape.innerHTML=`<a class="assinatura" href="${inicio}"><span class="marca-icone" aria-hidden="true">✦</span>Missão <strong>8º Ano</strong></a><a class="preferencias-rodape" href="${inicio.split('#')[0]}#preferencias">Preferências</a><button type="button">Voltar ao topo ↑</button>`;
    rodape.querySelector('button').onclick=()=>{
      const primeiro=document.querySelector('header a,header button');
      primeiro?.focus({preventScroll:true});
      const quieto=document.querySelector('.quieto')||matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({top:0,behavior:quieto?'instant':'smooth'});
    };
  }
  return {icone,organizarArea,reduzir,definirMovimento,sistemaMovimento,get preferencia(){return preferencia;}};
})();
