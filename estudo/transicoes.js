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
  function animarEntrada(conteudo){
    limparObservador();
    if(!ativo()||!conteudo?.isConnected||conteudo.className!=='conteudo'||document.body.classList.contains('quadro-aberto'))return;
    const alvos=[
      ...conteudo.querySelectorAll([
        ':scope > .cab',
        ':scope > .folha-estudo > .papel',
        ':scope > .folha-estudo > .resumo-trilha',
        ':scope > .folha-estudo > .atalhos-estudo',
        ':scope > .folha-estudo > .trilhas-pessoais',
        ':scope > .folha-estudo > .metricas',
        ':scope > .folha-estudo > .biblioteca',
        ':scope > .folha-estudo > .estante-neo',
        ':scope > .folha-estudo > .mesa-neo',
        ':scope > .folha-estudo > .agenda',
        ':scope > .folha-estudo > .config',
        ':scope > .folha-estudo > .trilha',
        ':scope > .folha-estudo > .cartoes',
        ':scope > .folha-estudo > .resposta-neo',
        '.trilha > li',
        '.trilhas-pessoais-grade > .trilha-pessoal-card',
        '.etapas-personais > li',
        '.guias-grade > *',
        '.biblioteca-grade > *',
        '.colecao-recursos > *'
      ].join(','))].filter((item,i,todos)=>todos.indexOf(item)===i).slice(0,48);
    if(!alvos.length)return;
    const animaveis=alvos.filter(el=>el.getBoundingClientRect().width>0 &&el.getBoundingClientRect().height>0);
    const atualizar=(el,delay)=>{
      el.style.setProperty('--neo-demora',delay+'ms');
      el.classList.remove('neo-aguardando');
      el.classList.add('neo-revelado');
      el.addEventListener('animationend',evento=>{
        if(evento.target!==el)return;
        el.classList.remove('neo-revelado');
        el.style.removeProperty('--neo-demora');
      },{once:true});
    };
    const disponivel='IntersectionObserver' in window;
    if(disponivel){
      observador=new IntersectionObserver(entradas=>{
        for(const entrada of entradas)if(entrada.isIntersecting){
          observador?.unobserve(entrada.target);
          atualizar(entrada.target,0);
        }
      },{root:null,rootMargin:'0px 0px -16px 0px',threshold:0.035});
    }
    let sequencia=0;
    for(const el of animaveis){
      const limite=el.getBoundingClientRect().top;
      if(limite<window.innerHeight*.92||!disponivel){
        atualizar(el,Math.min(sequencia++*65,390));
      }else{
        el.classList.add('neo-aguardando');
        observador.observe(el);
      }
    }
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
      if(entradaPermitida)animarEntrada(principal());
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
  });
  window.addEventListener('preferencia-movimento',()=>{
    if(!ativo()){
      limparObservador();
      principal()?.querySelectorAll('.neo-aguardando').forEach(el=>el.classList.remove('neo-aguardando'));
      limparAnimacoes();
      try{transicaoAtiva?.skipTransition();}catch{}
    }
  });
  return {trocar};
})();