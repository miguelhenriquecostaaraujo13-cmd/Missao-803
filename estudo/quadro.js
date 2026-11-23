'use strict';
// Quadro automático do Neo: não é uma área de desenho manual.
// O aluno escolhe o tema; os elementos surgem progressivamente, com narração local.
const quadroLivre=(()=>{
  let assuntoEscolhido='', controle=null;
  const textoSeguro=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const simplificar=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
  const limpar=s=>String(s||'').replace(/\s+/g,' ').trim();
  function trilhaOrigem(){
    const id=location.hash.startsWith('#quadro/')?location.hash.slice(8).split('/')[0]:'';
    return id?trilhasPersonalizadas.lista.find(t=>t.id===id):null;
  }
  function temas(materia){
    return [...new Set(questoes.filter(q=>q.materia===materia).map(q=>q.assunto))].slice(0,90);
  }
  function preparar(){
    const propria=trilhaOrigem();
    if(propria){
      const etapas=propria.etapas.slice(0,12);
      return {
        titulo:propria.titulo,
        materia:propria.materia,
        voltar:'#trilha-personalizada/'+propria.id,
        cenas:etapas.map((e,i)=>({
           titulo:e.titulo||'Etapa '+(i+1),
           explicacao:limpar(e.texto).slice(0,520),
           rotulo:'ETAPA '+(i+1)+' · SUA TRILHA',
           tipo:i===0?'abertura':i===etapas.length-1?'conclusao':'explicacao'
        }))
      };
    }
    const materia=estudos.materias.includes(estudos.dados.materia)?estudos.dados.materia:estudos.materias[0];
    const assuntos=temas(materia);
    if(!assuntos.includes(assuntoEscolhido))assuntoEscolhido=assuntos[0]||'';
    const exemplos=questoes.filter(q=>q.materia===materia&&q.assunto===assuntoEscolhido).slice(0,4);
    const primeiro=exemplos[0];
    if(!primeiro)return {titulo:'Estude com o Neo',materia,voltar:'#trilha',cenas:[{titulo:'Escolha um assunto',explicacao:'Selecione um tema para abrir uma explicação do conteúdo da plataforma.',tipo:'abertura',rotulo:'AULA DO NEO'}]};
    const cenas=[
      {titulo:assuntoEscolhido,explicacao:'Vamos entender '+assuntoEscolhido+'. Primeiro, observe a ideia principal; depois, um exemplo resolvido.',tipo:'abertura',rotulo:'AULA DO NEO'},
      {titulo:'Entenda a ideia',explicacao:limpar(primeiro.explicacao).slice(0,520),tipo:'explicacao',rotulo:'CONCEITO'},
      {titulo:'Vamos pensar',explicacao:limpar(primeiro.pergunta).slice(0,340),tipo:'pergunta',rotulo:'EXEMPLO'},
      {titulo:'Resposta explicada',explicacao:limpar(primeiro.alternativas?.[primeiro.correta]||'')+'. '+limpar(primeiro.explicacao),tipo:'resposta',rotulo:'RESOLUÇÃO'}
    ];
    if(exemplos[1]){
      cenas.push({titulo:'Mais um exemplo',explicacao:limpar(exemplos[1].pergunta),tipo:'pergunta',rotulo:'PRATIQUE'});
      cenas.push({titulo:'Como resolver',explicacao:limpar(exemplos[1].alternativas?.[exemplos[1].correta]||'')+'. '+limpar(exemplos[1].explicacao),tipo:'resposta',rotulo:'REVISÃO'});
    }
    cenas.push({titulo:'Agora é sua vez',explicacao:'Você pode responder questões dessa matéria, anotar suas dúvidas e revisar as explicações quantas vezes quiser.',tipo:'conclusao',rotulo:'PRÓXIMO PASSO'});
    return {titulo:assuntoEscolhido,materia,voltar:'#trilha',cenas};
  }
  function tela(){
    const aula=preparar(), propria=trilhaOrigem(),materia=aula.materia;
    const opcoes=temas(materia).map(a=>'<option value="'+textoSeguro(a)+'"'+(a===assuntoEscolhido?' selected':'')+'>'+textoSeguro(a)+'</option>').join('');
    return '<div class="quadro-fullscreen quadro-aula" id="quadro-aula">'+
      '<header class="quadro-barra aula-barra">'+
        '<a class="quadro-sair" href="'+textoSeguro(aula.voltar)+'">← Voltar</a>'+
        '<div class="quadro-identidade"><small>NEO · AULA ANIMADA</small><h1>Quadro branco</h1></div>'+
        (propria?'<span class="aula-origem">Trilha personalizada</span>':
          '<label class="aula-assunto">Assunto<select id="aula-assunto" aria-label="Escolher assunto da aula">'+opcoes+'</select></label>')+
        '<div class="aula-botoes">'+
          '<button id="aula-anterior" type="button" aria-label="Etapa anterior">↶ Anterior</button>'+
          '<button id="aula-play" type="button">▶ Assistir aula</button>'+
          '<button id="aula-proxima" type="button" aria-label="Próxima etapa">Próxima ↷</button>'+
          '<button id="aula-reiniciar" type="button" aria-label="Reiniciar explicação">Reiniciar</button>'+
        '</div>'+
      '</header>'+
      '<section class="quadro-palco palco-automatico" aria-label="Quadro animado que se desenha automaticamente">'+
        '<canvas id="desenho" role="img" aria-label="Animação automática de textos, setas e exemplos do assunto"></canvas>'+
        '<div class="indicador-neo-aula" aria-hidden="true"><span>✦</span> NEO</div>'+
      '</section>'+
      '<footer class="aula-rodape">'+
        '<div class="aula-andamento"><span id="aula-etapa">Etapa 1 de '+aula.cenas.length+'</span><progress id="aula-progresso" value="1" max="'+aula.cenas.length+'" aria-label="Etapas da aula"></progress></div>'+
        '<div class="aula-legenda" aria-live="polite"><strong id="aula-titulo"></strong><p id="aula-texto"></p></div>'+
        '<p id="aula-aviso" class="aula-aviso" role="status">O Neo desenha automaticamente. Toque em “Assistir aula” para ouvir a explicação.</p>'+
      '</footer>'+
    '</div>';
  }
  function montar(){
    if(controle)controle.fechar();
    const canvas=document.getElementById('desenho'), raiz=document.getElementById('quadro-aula');
    if(!canvas||!raiz)return;
    let aula=preparar(),indice=0,ativo=false,pausado=false, vozAtiva=false, utter=null,raf=0;
    let inicio=0,deslocamento=0,duracao=9000,progresso=0,terminado=false;
    const reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const play=document.getElementById('aula-play'),aviso=document.getElementById('aula-aviso');
    const ctx=canvas.getContext('2d');
    const falaPossivel='speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    const encerrarFala=()=>{if(falaPossivel){speechSynthesis.cancel();utter=null;}vozAtiva=false;};
    const gestoPalavra=texto=>String(texto||'').split(/\s+/).filter(Boolean).length;
    const cenaAtual=()=>aula.cenas[indice];
    const rotulo=(c,i)=>c.rotulo||'ETAPA '+(i+1);
    function estilos(w){
      return {margin:Math.max(22,Math.min(64,w*.055)),pequeno:w<650,
        titulo:Math.max(25,Math.min(56,w*.052)),
        corpo:Math.max(17,Math.min(29,w*.025)),
        subtitulo:Math.max(13,Math.min(20,w*.022))};
    }
    function textoQuebra(texto,maxW,font){
      ctx.font=font;
      const linhas=[],palavras=limpar(texto).split(' ');let linha='';
      for(const palavra of palavras){
        const novo=(linha?linha+' ':'')+palavra;
        if(linha&&ctx.measureText(novo).width>maxW){linhas.push(linha);linha=palavra;}
        else linha=novo;
      }
      if(linha)linhas.push(linha);
      return linhas;
    }
    function linhaAnimada(x1,y1,x2,y2,t){
      if(t<=0)return;
      ctx.save();ctx.strokeStyle='#986bd1';ctx.lineWidth=4;ctx.lineCap='round';
      const k=Math.max(0,Math.min(1,t)),ex=x1+(x2-x1)*k,ey=y1+(y2-y1)*k;
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(ex,ey);ctx.stroke();
      if(k>.95){
        const a=Math.atan2(y2-y1,x2-x1);
        ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-14*Math.cos(a-.48),y2-14*Math.sin(a-.48));
        ctx.moveTo(x2,y2);ctx.lineTo(x2-14*Math.cos(a+.48),y2-14*Math.sin(a+.48));ctx.stroke();
      }
      ctx.restore();
    }
    function desenhar(p=1){
      if(!canvas.isConnected)return;
      const r=canvas.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);
      const dpr=Math.min(devicePixelRatio||1,2);
      const width=Math.round(w*dpr),height=Math.round(h*dpr);
      if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle='#fffdf9';ctx.fillRect(0,0,w,h);
      ctx.fillStyle='#efe9f3';
      for(let x=15;x<w;x+=24)for(let y=15;y<h;y+=24){ctx.beginPath();ctx.arc(x,y,1,0,Math.PI*2);ctx.fill();}
      const {margin:margin0,pequeno,titulo,corpo,subtitulo}=estilos(w);
      const m=margin0,limite=w-2*m,c=cenaAtual();
      ctx.fillStyle='#8d67b3';ctx.font='700 '+subtitulo+'px system-ui';ctx.textBaseline='alphabetic';
      ctx.fillText(rotulo(c,indice),m,Math.max(m,37));
      ctx.fillStyle='#3a224d';ctx.font='700 '+titulo+'px system-ui';
      const linhasTitulo=textoQuebra(c.titulo,limite,'700 '+titulo+'px system-ui').slice(0,2);
      const passoTitulo=titulo*1.17,topTitulo=m+Math.max(48,titulo*.95);
      for(let i=0;i<linhasTitulo.length;i++){
        const fracao=Math.max(0,Math.min(1,(p-.04-i*.07)/.2));
        ctx.fillText(linhasTitulo[i].slice(0,Math.round(linhasTitulo[i].length*fracao)),m,topTitulo+i*passoTitulo);
      }
      const abaixo=topTitulo+linhasTitulo.length*passoTitulo+Math.max(13,h*.017);
      ctx.fillStyle='#7041a2';ctx.fillRect(m,abaixo,Math.max(8,Math.min(limite*.8,limite*p)),3);
      const corpoY=abaixo+Math.max(30,h*.065),fontCorpo='500 '+corpo+'px system-ui';
      const maxLinhas=Math.max(2,Math.floor((h-corpoY-(pequeno?120:130))/(corpo*1.5)));
      const textoCompleto=limpar(c.explicacao);
      const textoVisible=textoCompleto.slice(0,Math.round(textoCompleto.length*Math.max(0,Math.min(1,(p-.2)/.62))));
      const linhas=textoQuebra(textoVisible,limite,fontCorpo).slice(0,maxLinhas);
      ctx.font=fontCorpo;ctx.fillStyle='#382840';
      linhas.forEach((linha,i)=>ctx.fillText(linha,m,corpoY+i*corpo*1.5));
      const base=h-(pequeno?86:95),larguraCaixa=Math.min(215,limite*.33),alvo=Math.max(0,Math.min(1,(p-.66)/.3));
      if(alvo>0){
        const n=3,espaco=(limite-3*larguraCaixa)/2;
        const nomes=['IDEIA','EXEMPLO','REVISÃO'];
        for(let i=0;i<n;i++){
          const x=m+i*(larguraCaixa+espaco);
          ctx.save();ctx.globalAlpha=Math.min(1,alvo*3-i*.2);
          ctx.strokeStyle='#9465c9';ctx.fillStyle=i===1?'#eee0fc':'#f3eafd';ctx.lineWidth=2;
          ctx.beginPath();ctx.roundRect(x,base,larguraCaixa,48,9);ctx.fill();ctx.stroke();
          ctx.font='700 '+Math.max(10,Math.min(15,w*.017))+'px system-ui';ctx.fillStyle='#553071';ctx.textAlign='center';
          ctx.fillText(nomes[i],x+larguraCaixa/2,base+29);ctx.restore();
          if(i<n-1)linhaAnimada(x+larguraCaixa+5,base+24,x+larguraCaixa+espaco-5,base+24,alvo);
        }
      }
      ctx.fillStyle='#9a7cba';ctx.font='600 '+Math.max(11,Math.min(16,subtitulo*.75))+'px system-ui';
      ctx.textAlign='right';ctx.fillText((indice+1)+' / '+aula.cenas.length,w-m,Math.max(m,37));
      ctx.textAlign='left';
    }
    function informar(){
      const c=cenaAtual();
      document.getElementById('aula-etapa').textContent='Etapa '+(indice+1)+' de '+aula.cenas.length;
      document.getElementById('aula-progresso').value=indice+1;
      document.getElementById('aula-titulo').textContent=c.titulo;
      document.getElementById('aula-texto').textContent=c.explicacao;
      document.getElementById('aula-anterior').disabled=indice===0;
      document.getElementById('aula-proxima').disabled=indice===aula.cenas.length-1;
    }
    const leitura=()=>cenaAtual().titulo+'. '+cenaAtual().explicacao;
    function duracaoCena(){
      const palavras=gestoPalavra(leitura());
      return Math.min(24000,Math.max(6000,palavras*420));
    }
    function narrar(){
      if(!falaPossivel)return false;
      try{
        const u=new SpeechSynthesisUtterance(leitura());
        const vozes=speechSynthesis.getVoices().filter(v=>/^pt(-|$)/i.test(v.lang));
        u.voice=vozes.find(v=>v.lang==='pt-BR')||vozes[0]||null;
        u.lang=u.voice?.lang||'pt-BR';u.rate=.94;u.pitch=1.03;u.volume=1;
        u.onend=()=>{if(utter===u&&ativo&&!pausado){utter=null;passar();}};
        u.onerror=()=>{if(utter===u){utter=null;vozAtiva=false;aviso.textContent='A voz do navegador não está disponível. A animação continua sem narração.';}};
        utter=u;speechSynthesis.speak(u);vozAtiva=true;return true;
      }catch{return false;}
    }
    function passar(){
      if(indice>=aula.cenas.length-1){
        ativo=false;pausado=false;play.textContent='↻ Repetir aula';progresso=1;desenhar(1);
        aviso.textContent='Aula concluída. Você pode repetir a explicação ou voltar à sua trilha.';
        return;
      }
      indice++;progresso=0;deslocamento=0;inicio=performance.now();informar();duracao=duracaoCena();
      if(vozAtiva)narrar();
      if(reduz)desenhar(1);
    }
    function quadroLoop(agora){
      if(!canvas.isConnected)return;
      if(ativo&&!pausado&&!reduz){
        if(!inicio)inicio=agora;
        const decorrido=deslocamento+agora-inicio;
        const max=utter?duracao*1.9:duracao;
        progresso=Math.max(0,Math.min(1,decorrido/duracao));
        desenhar(progresso);
        if(decorrido>=max){if(utter)encerrarFala();passar();}
        else if(decorrido>=duracao&&!utter)passar();
      }
      raf=requestAnimationFrame(quadroLoop);
    }
    function iniciar(voz=false){
      encerrarFala();indice=Math.min(indice,aula.cenas.length-1);
      ativo=true;pausado=false;progresso=0;deslocamento=0;inicio=performance.now();
      duracao=duracaoCena();informar();
      play.textContent='⏸ Pausar';
      if(voz){const ok=narrar();aviso.textContent=ok?'O Neo está explicando enquanto o quadro se desenha.':'A animação está funcionando; a voz não pôde ser iniciada.';}
      else aviso.textContent='O quadro está desenhando automaticamente. Toque em “Assistir aula” para ativar a voz.';
      if(reduz)desenhar(1);
    }
    function pular(ind){
      const continuar=ativo&&!pausado,comVoz=vozAtiva;
      encerrarFala();indice=Math.max(0,Math.min(aula.cenas.length-1,ind));
      inicio=0;deslocamento=0;progresso=0;informar();desenhar(reduz?1:0);
      if(continuar)iniciar(comVoz);
      else{ativo=false;pausado=false;play.textContent='▶ Assistir aula';}
    }
    function fechar(){
      cancelAnimationFrame(raf);encerrarFala();ativo=false;obs.disconnect();controle=null;
    }
    const obs=new ResizeObserver(()=>desenhar(reduz?1:progresso));
    obs.observe(canvas);
    controle={fechar};
    raiz.querySelector('.quadro-sair').addEventListener('click',fechar);
    play.addEventListener('click',()=>{
      if(!ativo || (indice===aula.cenas.length-1&&progresso>=1)){
        if(progresso>=1&&indice===aula.cenas.length-1)indice=0;
        iniciar(true);
      }else if(pausado){
        pausado=false;inicio=performance.now();if(utter)speechSynthesis.resume();
        play.textContent='⏸ Pausar';aviso.textContent='Aula retomada.';
      }else{
        pausado=true;deslocamento+=performance.now()-inicio;
        if(utter)speechSynthesis.pause();
        play.textContent='▶ Continuar';aviso.textContent='Aula pausada.';
      }
    });
    document.getElementById('aula-anterior').addEventListener('click',()=>pular(indice-1));
    document.getElementById('aula-proxima').addEventListener('click',()=>pular(indice+1));
    document.getElementById('aula-reiniciar').addEventListener('click',()=>{pular(0);iniciar(true);});
    document.getElementById('aula-assunto')?.addEventListener('change',e=>{
      encerrarFala();assuntoEscolhido=e.target.value;aula=preparar();indice=0;ativo=false;pausado=false;
      informar();desenhar(1);iniciar(true);
    });
    informar();desenhar(1);
    // Autoplay visual sem voz, conforme políticas de reprodução dos navegadores.
    iniciar(false);raf=requestAnimationFrame(quadroLoop);
    window.addEventListener('pagehide',fechar,{once:true});
  }
  return {tela,montar,fechar:()=>controle?.fechar()};
})();