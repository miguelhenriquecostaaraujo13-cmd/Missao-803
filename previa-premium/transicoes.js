'use strict';
// Movimento Neo Aurora: transições automáticas entre ferramentas e revelação ao rolar.
// Sem bibliotecas pagas. Funciona com mouse, toque e teclado; respeita movimento reduzido.
const movimentoNeo = (() => {
  const rotasEstudo=new Set(['painel','trilha','minhas-trilhas','trilha-personalizada','simulados','sessao','revisao','biblioteca','tutor','busca','caderno','agenda','ajustes']);
  let ultimaRota=null,observador=null,versao=0,transicaoAtiva=null;
  const principal=()=>document.querySelector('#principal');
  const rotaDe=hash=>(String(hash||'#inicio').replace(/^#/,'').split('/')[0]||'inicio');
  const ativo=()=>!identidadeAurora.reduzir()&&!document.hidden&&!document.body.classList.contains('quieto');
  function limparObservador(){
    observador?.disconnect();
    observador=null;
  }
  function limparAnimacoes(){
    document.documentElement.classList.remove('neo-transitando');
    principal()?.classList.remove('neo-transicao-fallback');
  }
  /* Reanima quando volta a entrar na tela. Não esconde conteúdos à espera do scroll. */
  function animarEntrada(conteudo,entradaNova=true){
    limparObservador();
    if(!ativo()||!conteudo?.isConnected||conteudo.className!=='conteudo'||document.body.classList.contains('quadro-aberto'))return;
    const seletores=[
      ':scope > .cab',
      '.folha-estudo > .papel',
      '.folha-estudo > .resumo-trilha',
      '.folha-estudo > .atalhos-estudo',
      '.folha-estudo > .metricas > div',
      '.folha-estudo > .grade > .atalho',
      '.folha-estudo > .trilhas-pessoais',
      '.folha-estudo > .biblioteca > section',
      '.folha-estudo > .mesa-neo',
      '.folha-estudo > .amostra',
      '.folha-estudo > .linha',
      '.folha-estudo .trilha > li',
      '.folha-estudo .trilhas-pessoais-grade > .trilha-pessoal-card',
      '.folha-estudo .estante-neo',
      '.folha-estudo .cartoes > *',
      '.folha-estudo .guias-grade > *',
      '.folha-estudo .colecao-recursos > *'
    ];
    const alvos=[...new Set(conteudo.querySelectorAll(seletores.join(',')))].filter(
      el=>el.getBoundingClientRect().height>0&&!el.closest('.trilha-gerada')
    ).slice(0,85);
    const animar=(el,delay)=>{
      if(!ativo()||!el.isConnected||typeof el.animate!=='function')return;
      try{
        el.animate(
          [{opacity:.65,transform:'translate3d(0,16px,0)'},
           {opacity:1,transform:'translate3d(0,0,0)'}],
          {duration:520,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'none'}
        );
      }catch{/* Navegadores antigos mantém os elementos visíveis. */}
    };
    if(!('IntersectionObserver' in window)){
      if(entradaNova)alvos.slice(0,16).forEach((el,i)=>animar(el,Math.min(i*40,260)));
      return;
    }
    const estados=new WeakMap();
    let sequencia=0;
    for(const el of alvos){
      const r=el.getBoundingClientRect();
      const jaVisivel=r.top<innerHeight*.93&&r.bottom>0;
      estados.set(el,{visivel:!entradaNova&&jaVisivel,ultima:0});
    }
    observador=new IntersectionObserver(entradas=>{
      if(!ativo())return;
      for(const entrada of entradas){
        const el=entrada.target,estado=estados.get(el);
        if(!estado)continue;
        if(entrada.isIntersecting){
          if(estado.visivel)continue;
          estado.visivel=true;
          const agora=performance.now();
          if(agora-estado.ultima>750){
            estado.ultima=agora;
            const delay=entradaNova?Math.min(sequencia++*55,300):0;
            animar(el,delay);
          }
        }else{
          estado.visivel=false;
        }
      }
    },{root:null,rootMargin:'0px 0px -20px 0px',threshold:[0,.12]});
    alvos.forEach(el=>observador.observe(el));
  }
  function scrollInicio(){
    try{window.scrollTo({top:0,left:0,behavior:'instant'});}catch{window.scrollTo(0,0);}
  }
  function trocar(atualizar,hash){
    const caminho=String(hash||'#inicio'),anterior=ultimaRota;
    const proxima=rotaDe(caminho),antiga=rotaDe(anterior);
    const mudou=anterior!==null&&anterior!==caminho;
    ultimaRota=caminho;
    const incluirAnimacao=mudou&&ativo()&&rotasEstudo.has(proxima)&&rotasEstudo.has(antiga)&&document.body.classList.contains('espaco-estudo');
    const entradaPermitida=mudou&&ativo()&&rotasEstudo.has(proxima);
    const chave=++versao;
    const atualizarTela=()=>{
      limparObservador();
      atualizar();
      if(mudou)scrollInicio();
      if(ativo()&&rotasEstudo.has(proxima))animarEntrada(principal(),entradaPermitida);
    };
    if(!incluirAnimacao||typeof document.startViewTransition!=='function'){
      atualizarTela();
      if(incluirAnimacao){
        const atual=principal();
        // Alternativa para navegadores sem View Transitions: a entrada ainda é automática.
        atual?.classList.remove('neo-transicao-fallback');
        void atual?.offsetWidth;
        atual?.classList.add('neo-transicao-fallback');
        atual?.addEventListener('animationend',e=>{
          if(e.target===atual)atual.classList.remove('neo-transicao-fallback');
        },{once:true});
      }
      return;
    }
    document.documentElement.classList.add('neo-transitando');
    try{
      // O navegador preserva o quadro antigo enquanto anima o novo: sem copiar o DOM.
      const transicao=document.startViewTransition(atualizarTela);
      transicaoAtiva=transicao;
      void transicao.finished.catch(()=>{}).finally(()=>{
        if(versao===chave){limparAnimacoes();transicaoAtiva=null;}
      });
    }catch{
      atualizarTela();
      if(versao===chave)limparAnimacoes();
    }
  }
  document.addEventListener('visibilitychange',()=>{
    document.body.classList.toggle('neo-aba-oculta',document.hidden);
    if(document.hidden)limparObservador();
    else if(ativo()&&rotasEstudo.has(rotaDe(location.hash)))animarEntrada(principal(),false);
  });
  window.addEventListener('preferencia-movimento',()=>{
    if(!ativo()){
      limparObservador();
      principal()?.querySelectorAll('.neo-aguardando').forEach(el=>el.classList.remove('neo-aguardando'));
      limparAnimacoes();
      try{transicaoAtiva?.skipTransition();}catch{}
    }else if(rotasEstudo.has(rotaDe(location.hash))){
      animarEntrada(principal(),false);
    }
  });
  return {trocar};
})();