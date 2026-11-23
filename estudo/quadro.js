'use strict';
// Quadro Neo: implementação autoral inspirada na experiência de aula desenhada.
// Nenhum script, logo ou recurso interno de plataformas de terceiros é utilizado.
const quadroLivre=(()=>{
  const q=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normal=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const limpar=s=>String(s||'').replace(/\s+/g,' ').trim();
  const letra=(c)=>Math.max(16,Math.min(23,c*.047));
  const pontos=s=>String(s||'').split(/(?<=[.!?])\s+/).map(limpar).filter(Boolean);
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  let controle=null,assuntoSelecionado='',historico=[],plano=null;
  const chave=()=>contas.chave('missao803.quadros.2');
  function trilha(){
    const id=location.hash.startsWith('#quadro/')?location.hash.slice(8).split('/')[0]:'';
    return id?trilhasPersonalizadas.lista.find(t=>t.id===id):null;
  }
  function materia(){
    return estudos.materias.includes(estudos.dados.materia)?estudos.dados.materia:estudos.materias[0];
  }
  const temas=m=>[...new Set(questoes.filter(q=>q.materia===m).map(q=>q.assunto))].slice(0,90);
  function cena(titulo,texto,tipo='destaque',extra=null,rotulo='EXPLICAÇÃO'){
    return {titulo:limpar(titulo).slice(0,100),texto:limpar(texto).slice(0,600),tipo,extra,rotulo};
  }
  // Aulas autorais com operações verificáveis. O material do aluno permanece como fonte na sua trilha.
  function modeloMatematico(titulo){
    const key=normal(titulo);
    if(/porcent|acresc|decresc|desconto/.test(key))return [
      cena('Porcentagem no dia a dia','Vamos acompanhar o preço de um livro que custa cento e cinquenta reais.','destaque','R$ 150,00','COMEÇANDO'),
      cena('Quanto é 20% de 150?','Vinte por cento significa vinte centésimos. Multiplicamos 150 por 0,20 e encontramos 30 reais.','formula','150 × 0,20 = 30','CÁLCULO'),
      cena('Aplicando o desconto','Subtraímos o desconto do valor inicial: 150 menos 30 é igual a 120 reais.','formula','150 − 30 = 120','DESCONTO'),
      cena('E se aumentar 20% depois?','O novo aumento será calculado sobre 120 reais, e não sobre o valor original.','tabela',[['Etapa','Valor'],['Inicial','R$ 150'],['Desconto','R$ 120'],['Aumento de 20%','R$ 144']],'COMPARE'),
      cena('Por que não voltou a 150?','Vinte por cento de 120 é 24. Logo, 120 mais 24 é 144, não 150.','comparar',['R$ 150','R$ 144'],'CONCLUSÃO'),
      cena('Sua vez de pensar','Se o preço mudar novamente, sempre calcule a porcentagem sobre o valor atual.','passos',['Valor inicial','Calcular taxa','Novo valor'],'REVISÃO')
    ];
    if(/potenci/.test(key))return [
      cena('Potenciação','Potências representam multiplicações de fatores iguais.','destaque','2³ = 2 × 2 × 2','CONCEITO'),
      cena('Base e expoente','Em dois elevado a três, a base é dois e o expoente é três.','comparar',['Base: 2','Expoente: 3'],'IDENTIFIQUE'),
      cena('Vamos desenhar os fatores','Três fatores dois multiplicados em sequência formam o produto oito.','passos',['2','× 2','× 2'],'MULTIPLICAÇÃO'),
      cena('Resultado','Dois vezes dois é quatro; quatro vezes dois é oito.','formula','2³ = 8','RESOLUÇÃO'),
      cena('Agora pratique','Compare dois ao cubo com três ao quadrado: oito e nove são resultados diferentes.','comparar',['2³ = 8','3² = 9'],'COMPARAÇÃO')
    ];
    if(/equac|expressao algebr/.test(key))return [
      cena('Equações do 1º grau','Resolver é descobrir qual valor de x torna a igualdade verdadeira.','destaque','2x + 6 = 18','INTRODUÇÃO'),
      cena('Isolando a incógnita','Subtraímos seis dos dois lados para manter a igualdade.','formula','2x = 18 − 6','PRIMEIRO PASSO'),
      cena('Dividindo os dois lados','Com dois x igual a doze, basta dividir por dois.','formula','x = 12 ÷ 2 = 6','SEGUNDO PASSO'),
      cena('Conferindo','Substituindo x por seis: duas vezes seis mais seis resulta em dezoito.','formula','2 × 6 + 6 = 18','VERIFICAÇÃO'),
      cena('Ordem do raciocínio','A regra é preservar a igualdade e conferir o resultado encontrado.','passos',['Isolar x','Calcular','Conferir'],'REVISÃO')
    ];
    if(/frac|numero racional/.test(key))return [
      cena('Frações','Uma fração representa partes iguais de um inteiro.','destaque','3/4','INTRODUÇÃO'),
      cena('Numerador e denominador','Em três quartos, o denominador quatro indica o total de partes iguais; o numerador três indica quantas foram consideradas.','comparar',['3 partes','4 no total'],'PARTES'),
      cena('Visualizando três quartos','Imagine um inteiro dividido em quatro partes iguais, com três destacadas.','fracao',[3,4],'DESENHO'),
      cena('Frações equivalentes','Multiplicar numerador e denominador pelo mesmo número mantém o valor da fração.','formula','3/4 = 6/8','COMPARAÇÃO'),
      cena('Revise','Divida o inteiro em partes iguais e conte quantas partes foram consideradas.','passos',['Dividir','Contar','Representar'],'PRATIQUE')
    ];
    return null;
  }
  function usandoBanco(titulo,mat){
    const chaveTema=normal(titulo),list=questoes.filter(x=>x.materia===mat);
    let fontes=list.filter(x=>normal(x.assunto)===chaveTema);
    if(!fontes.length)fontes=list.filter(x=>normal(x.assunto).includes(chaveTema)||chaveTema.includes(normal(x.assunto))).slice(0,4);
    if(!fontes.length)fontes=list.filter(x=>chaveTema.split(/\s+/).filter(w=>w.length>4).some(w=>normal(x.assunto+' '+x.pergunta).includes(w))).slice(0,3);
    if(!fontes.length)return [
      cena(titulo,'Ainda não encontrei uma explicação deste assunto no banco de conteúdos. Você pode criar uma trilha e enviar seu próprio material.','destaque','Material não encontrado','BUSCA LOCAL'),
      cena('Como continuar','Adicione um material com texto legível à sua trilha ou escolha um assunto do banco para assistir a uma aula.','passos',['Escolha tema','Envie material','Estude'],'PRÓXIMO PASSO')
    ];
    const cenas=[cena(titulo,'Vamos estudar '+titulo+'. A explicação será construída com base no conteúdo já disponível na plataforma.','destaque',titulo,'INÍCIO')];
    for(const [i,f] of fontes.slice(0,3).entries()){
      cenas.push(cena(i===0?'Entenda a ideia':'Outro ponto importante',f.explicacao,'destaque',null,'CONCEITO'));
      cenas.push(cena('Vamos pensar',f.pergunta,'pergunta',null,'EXEMPLO'));
      cenas.push(cena('Resposta e explicação',(f.alternativas?.[f.correta]||'')+'. '+f.explicacao,'formula',f.alternativas?.[f.correta]||'','RESOLUÇÃO'));
    }
    cenas.push(cena('Hora de revisar','Explique o assunto com suas próprias palavras e pratique as questões do Missão 8º Ano.','passos',['Ler','Resolver','Revisar'],'CONCLUÍDO'));
    return cenas;
  }
  function criarPlano(topico,mat,origem=null,cenasFornecidas=null){
    const personalizada=origem?.etapas?.length;
    const cenas=cenasFornecidas|| (personalizada?origem.etapas.slice(0,12).map((e,i)=>cena(e.titulo,e.texto,
      i===0?'destaque':i%3===0?'passos':'destaque',
      i%3===0?['Ler','Entender','Revisar']:null,'ETAPA '+(i+1))):
      modeloMatematico(topico)||usandoBanco(topico,mat));
    return {id:crypto.randomUUID(),titulo:topico,materia:mat,origem:origem?.id||null,cenas:cenas.slice(0,15),criado:Date.now(),voltar:origem?'#trilha-personalizada/'+origem.id:'#trilha'};
  }
  function buscarHistorico(){
    try{const v=JSON.parse(contas.armazenamento.getItem(chave())||'[]');historico=Array.isArray(v)?v.filter(a=>a&&typeof a.titulo==='string'&&Array.isArray(a.cenas)&&a.cenas.length<=15).slice(0,14):[];}catch{historico=[];}
  }
  function salvarHistorico(p){
    historico=[{...p},...historico.filter(h=>h.id!==p.id)].slice(0,14);
    try{contas.armazenamento.setItem(chave(),JSON.stringify(historico));}catch{}
  }
  async function salvarNuvem(p){
    if(!contas.usuario||!contas.cliente)return;
    const turma=String(visitante.perfil?.turma||'803');
    const {error}=await contas.cliente.from('portal8_whiteboards').upsert({
      id:p.id,owner_id:contas.usuario,title:p.titulo.slice(0,120),
      turma:['801','802','803','804','806','807'].includes(turma)?turma:'803',
      content:{tipo:'neo_quadro_vivo_v2',materia:p.materia,cenas:p.cenas,origem:p.origem,criado:p.criado},
      version:2,updated_at:new Date().toISOString()
    },{onConflict:'id'});
    if(error)throw error;
  }
  async function carregarNuvem(){
    if(!contas.usuario||!contas.cliente)return;
    const res=await contas.cliente.from('portal8_whiteboards').select('id,title,content,created_at').eq('owner_id',contas.usuario).limit(25);
    if(res.error)return;
    for(const r of res.data||[]){
      if(r.content?.tipo!=='neo_quadro_vivo_v2'||!Array.isArray(r.content.cenas)||r.content.cenas.length>15)continue;
      if(historico.some(h=>h.id===r.id))continue;
      historico.push({id:r.id,titulo:r.title,materia:r.content.materia,origem:r.content.origem,
         cenas:r.content.cenas,criado:Date.parse(r.created_at)||Date.now(),voltar:'#trilha'});
    }
    historico=historico.slice(0,14);
  }
  function tela(){
    buscarHistorico();
    const base=trilha(),mat=base?.materia||materia(),temasDisponiveis=temas(mat);
    if(!temasDisponiveis.includes(assuntoSelecionado))assuntoSelecionado=temasDisponiveis[0]||'';
    plano=criarPlano(base?.titulo||assuntoSelecionado||mat,mat,base);
    return '<div class="quadro-fullscreen quadro-vivo" id="neo-quadro">'+
      '<header class="quadro-vivo-topo">'+
       '<a class="quadro-vivo-sair" href="'+q(plano.voltar)+'" aria-label="Sair do quadro branco">✕</a>'+
       '<div class="quadro-vivo-marca"><span class="quadro-vivo-mascote">✦</span><span><small>NEO AURORA</small><strong>Quadro branco</strong></span></div>'+
       '<div class="quadro-vivo-controles">'+
        '<button id="vivo-seguir" type="button" aria-pressed="true" title="Seguir a escrita">◎ Seguir</button>'+
        '<button id="vivo-mudo" type="button" aria-pressed="true" title="Ativar ou desativar narração">🔈 Voz</button>'+
        '<button id="vivo-play" type="button" title="Pausar ou retomar">⏸ Pausar</button>'+
        '<button id="vivo-baixar" type="button" title="Baixar o quadro em imagem">↓ Salvar</button>'+
       '</div>'+
      '</header>'+
      '<section id="vivo-viewport" class="quadro-vivo-area" aria-label="Quadro com escrita automática acompanhando a explicação" tabindex="0">'+
         '<div id="vivo-folha" class="quadro-vivo-folha"></div>'+
      '</section>'+
      '<footer class="quadro-vivo-rodape">'+
        '<div class="quadro-vivo-andamento">'+
          '<span id="vivo-etapa">Etapa 1 de '+plano.cenas.length+'</span>'+
          '<progress id="vivo-progresso" max="'+plano.cenas.length+'" value="1" aria-label="Progresso da aula"></progress>'+
          '<button id="vivo-anterior" type="button" title="Voltar uma explicação">↶</button>'+
          '<button id="vivo-proximo" type="button" title="Avançar explicação">↷</button>'+
          '<button id="vivo-menos" type="button" title="Diminuir zoom">−</button>'+
          '<button id="vivo-mais" type="button" title="Aumentar zoom">＋</button>'+
          '<label class="quadro-vivo-velocidade">Velocidade<select id="vivo-velocidade" aria-label="Velocidade da explicação"><option value="0.8">0,8×</option><option value="1" selected>1×</option><option value="1.25">1,25×</option></select></label>'+
        '</div>'+
        '<div class="quadro-vivo-legenda" aria-live="polite"><strong id="vivo-titulo"></strong><p id="vivo-texto"></p></div>'+
        '<form id="vivo-pergunta" class="quadro-vivo-pergunta">'+
         '<input id="vivo-entrada" name="pergunta" maxlength="400" placeholder="Pergunte um assunto ou peça outra explicação..." aria-label="Perguntar ao Neo no quadro branco" required>'+
         '<button type="button" id="vivo-microfone" title="Perguntar por voz" aria-label="Ditar pergunta">🎙</button>'+
         '<button type="submit" id="vivo-enviar" title="Enviar pergunta">➤</button>'+
        '</form>'+
        '<div class="quadro-vivo-extra"><span id="vivo-aviso" role="status">O desenho começa sozinho. Toque em Voz para ouvir a explicação.</span>'+
          '<select id="vivo-historico" aria-label="Aulas salvas"><option value="">Aulas anteriores</option></select></div>'+
      '</footer>'+
     '</div>';
  }
  function montar(){
    if(controle)controle.fechar();
    const raiz=document.getElementById('neo-quadro'),area=document.getElementById('vivo-viewport'),folha=document.getElementById('vivo-folha');
    if(!raiz||!area||!folha)return;
    let atual=plano,indice=0,progress=0,rodando=true,pausado=false,usarVoz=false,terminouFala=true,utter=null,
        tempoInicial=performance.now(),tempoPausado=0,duracao=6500,raf=0,seguir=true,velocidade=1,zoom=1,
        fechado=false,movimentoPrograma=0,novoCiclo=0;
    const animar=!(matchMedia('(prefers-reduced-motion: reduce)').matches || identidadeAurora?.reduzir?.());
    const podeFalar='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
    const canvasPorCena=[];
    const aviso=raiz.querySelector('#vivo-aviso'),status=raiz.querySelector('#vivo-etapa'),botaoPlay=raiz.querySelector('#vivo-play');
    const avisar=s=>{if(!fechado)aviso.textContent=s;};
    const contexto=c=>c.getContext('2d');
    const simplificarTexto=(s,max=260)=>limpar(s).slice(0,max);
    const pesosFonte=w=>w<500?18:w<850?20:23;
    function palavras(ctx,txt,max,fonte){
      ctx.font=fonte;
      const partes=String(txt||'').split(/\s+/),linhas=[];let linha='';
      for(const palavra of partes){
        const proximo=(linha?linha+' ':'')+palavra;
        if(linha&&ctx.measureText(proximo).width>max){linhas.push(linha);linha=palavra;}
        else linha=proximo;
      }
      if(linha)linhas.push(linha);
      return linhas;
    }
    function tinta(ctx,x,y,conteudo,t,fonte,cor,maxL=3,esp=1.32){
      ctx.font=fonte;ctx.fillStyle=cor;ctx.textBaseline='alphabetic';ctx.textAlign='left';
      const largura=ctx.canvas.clientWidth-48;
      const linhas=palavras(ctx,conteudo,largura,fonte).slice(0,maxL);
      const total=linhas.reduce((n,l)=>n+l.length,0),limite=Math.floor(total*clamp(t));
      let usados=0,ultimoX=x,ultimoY=y;
      for(let i=0;i<linhas.length;i++){
        const l=linhas[i],visivel=l.slice(0,clamp(limite-usados,0,l.length));
        if(visivel){const yy=y+i*parseFloat(fonte.match(/(\d+)px/)?.[1]||'22')*esp;ctx.fillText(visivel,x,yy);ultimoX=x+ctx.measureText(visivel).width;ultimoY=yy;}
        usados+=l.length;
      }
      if(t>0&&t<1 && ultimoX<x+largura){
        ctx.save();ctx.translate(ultimoX+4,ultimoY-12);ctx.rotate(-.25);
        ctx.strokeStyle='#a44fc7';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(7,-12);ctx.stroke();ctx.restore();
      }
      return y+linhas.length*parseFloat(fonte.match(/(\d+)px/)?.[1]||'22')*esp;
    }
    function riscar(ctx,x1,y1,x2,y2,p,cor='#8651bc',esp=3){
      const t=clamp(p);if(!t)return;
      ctx.strokeStyle=cor;ctx.lineWidth=esp;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);
      ctx.lineTo(x1+(x2-x1)*t,y1+(y2-y1)*t);ctx.stroke();
    }
    function desenharVisual(ctx,w,h,c,p,y,fs){
      const m=24,l=w-48,b=Math.min(h-30,y+12),t=clamp((p-.50)/.42);
      if(!t)return;
      const fonte='italic 600 '+Math.min(36,Math.max(20,fs*1.25))+'px "Segoe Print","Comic Sans MS",cursive';
      if(c.tipo==='formula'||c.tipo==='destaque'){
        const frase=String(c.extra||c.texto.split(/[.!?]/)[0]||'').slice(0,100);
        ctx.save();ctx.font=fonte;ctx.fillStyle=c.tipo==='formula'?'#394d79':'#62368c';
        const linhas=palavras(ctx,frase,l,fonte).slice(0,2);
        linhas.forEach((line,i)=>tinta(ctx,m+6,b+33+i*40,line,clamp((t-i*.15)/(.7-i*.1)),fonte,'#583b8a',1));
        if(t>.8)riscar(ctx,m+4,b+44,m+Math.min(l*.8,ctx.measureText(frase).width+24),b+44,(t-.8)*5,'#b47ae3',2.7);
        ctx.restore();return;
      }
      if(c.tipo==='tabela'){
        const linhas=Array.isArray(c.extra)?c.extra.slice(0,5):[];
        const x=m,y0=b,largura=l,altura=Math.min(134,Math.max(90,h-y0-10)),n=Math.max(1,linhas.length),row=altura/n;
        ctx.save();ctx.strokeStyle='#765195';ctx.lineWidth=2;ctx.fillStyle='#eee5f9';
        ctx.beginPath();ctx.roundRect(x,y0,largura,altura,6);ctx.stroke();
        riscar(ctx,x+largura*.46,y0,x+largura*.46,y0+altura,t,'#8663af',1.7);
        for(let i=1;i<n;i++)riscar(ctx,x,y0+row*i,x+largura,y0+row*i,clamp(t*1.6-i*.12),'#8663af',1.4);
        linhas.forEach((linha,i)=>{const a=Array.isArray(linha)?linha:[String(linha),''];if(t<(i*.11))return;
          ctx.fillStyle=i===0?'#543178':'#42344c';ctx.font='500 '+Math.max(12,Math.min(17,fs*.82))+'px "Segoe Print",system-ui';
          ctx.fillText(String(a[0]).slice(0,24),x+9,y0+row*i+row*.68);
          ctx.fillText(String(a[1]).slice(0,21),x+largura*.49,y0+row*i+row*.68);
        });ctx.restore();return;
      }
      if(c.tipo==='passos'){
        const items=Array.isArray(c.extra)?c.extra.slice(0,3):[];
        const gap=Math.max(7,Math.min(20,l*.03)),bw=(l-2*gap)/3,bh=Math.min(88,h-b-6);
        items.forEach((item,i)=>{const frac=clamp((t-i*.23)*2);
          if(!frac)return;const x=m+i*(bw+gap);
          ctx.save();ctx.globalAlpha=frac;ctx.strokeStyle='#8a62ba';ctx.fillStyle=i===1?'#e6d5f6':'#f2ebfa';ctx.lineWidth=2;
          ctx.beginPath();ctx.roundRect(x,b,bw,bh,12);ctx.fill();ctx.stroke();
          ctx.fillStyle='#573277';ctx.font='700 '+Math.max(12,Math.min(18,fs*.8))+'px system-ui';ctx.textAlign='center';
          const parts=palavras(ctx,String(item),Math.max(30,bw-12),ctx.font).slice(0,2);
          parts.forEach((part,j)=>ctx.fillText(part,x+bw/2,b+bh/2+(j-(parts.length-1)/2)*20+6));ctx.restore();
          if(i<2)riscar(ctx,x+bw+2,b+bh*.5,x+bw+gap-2,b+bh*.5,frac,'#8a5dc3',2);
        });return;
      }
      if(c.tipo==='comparar'){
        const items=Array.isArray(c.extra)?c.extra.slice(0,2):[];
        const gap=22,bw=(l-gap)/2,bh=Math.min(112,h-b-4);
        items.forEach((item,i)=>{
          const x=m+i*(bw+gap),f=clamp(t*2-i*.42);
          if(f<=0)return;
          ctx.save();ctx.globalAlpha=f;ctx.strokeStyle=i===0?'#77549e':'#31957a';
          ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect(x,b,bw,bh,14);ctx.stroke();
          tinta(ctx,x+10,b+bh*.55,String(item),f,'600 '+Math.max(15,Math.min(22,fs))+'px "Segoe Print",cursive',i===0?'#5b3c87':'#1f8067',2);
          ctx.restore();
        });return;
      }
      if(c.tipo==='fracao'){
        const numer=Array.isArray(c.extra)?Number(c.extra[0]):3,denom=Array.isArray(c.extra)?Number(c.extra[1]):4;
        const n=Math.min(12,Math.max(2,denom)),bw=Math.min(360,l),x=m+(l-bw)/2,cell=bw/n;
        for(let i=0;i<n;i++){
          const parte=clamp((t-i/n)*n);
          if(!parte)return;
          ctx.save();ctx.fillStyle=i<numer?'#ad87df':'#f7efff';ctx.strokeStyle='#65408b';ctx.lineWidth=2;
          ctx.globalAlpha=parte;ctx.fillRect(x+i*cell,b,cell,70);ctx.strokeRect(x+i*cell,b,cell,70);ctx.restore();
        }return;
      }
      // Questões e outras explicações continuam sendo escritas progressivamente no corpo.
      riscar(ctx,m,b+12,m+Math.min(l*.75,380),b+12,t,'#9272c0',2);
    }
    function desenhar(i,p=1){
      const canvas=canvasPorCena[i];if(!canvas?.isConnected)return;
      const rect=canvas.getBoundingClientRect(),w=Math.max(200,rect.width),h=Math.max(200,rect.height),dpr=Math.min(devicePixelRatio||1,2);
      const cw=Math.round(w*dpr),ch=Math.round(h*dpr);
      if(canvas.width!==cw||canvas.height!==ch){canvas.width=cw;canvas.height=ch;}
      const ctx=contexto(canvas);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      const c=atual.cenas[i],f=pesosFonte(w),fonteTitulo='italic 700 '+Math.min(36,f*1.35)+'px "Segoe Print","Comic Sans MS",cursive';
      const m=24;
      ctx.fillStyle='#875caa';ctx.font='700 '+Math.max(11,f*.62)+'px system-ui';ctx.fillText(c.rotulo||'APRENDIZAGEM',m,26);
      let y=tinta(ctx,m,65,c.titulo,clamp((p-.03)/.28),fonteTitulo,'#302040',2,1.22);
      riscar(ctx,m,y-6,m+Math.min(w*.7,w-60),y-6,clamp((p-.23)/.22),'#9270ba',2.5);
      const corpoFonte='500 '+f+'px "Segoe Print","Comic Sans MS",system-ui';
      y=tinta(ctx,m,y+20,simplificarTexto(c.texto,210),clamp((p-.3)/.47),corpoFonte,'#42354c',w<500?3:3,1.24);
      desenharVisual(ctx,w,h,c,p,y+2,f);
    }
    function inserir(i){
      if(canvasPorCena[i])return;
      const el=document.createElement('section');el.className='vivo-parte';el.dataset.cena=String(i);
      const c=document.createElement('canvas');c.className='vivo-canvas';c.setAttribute('role','img');
      c.setAttribute('aria-label',atual.cenas[i].titulo+'. '+atual.cenas[i].texto);
      el.append(c);folha.append(el);canvasPorCena[i]=c;desenhar(i,0);
    }
    function foco(){
      if(!seguir)return;
      const el=canvasPorCena[indice]?.parentElement;if(!el)return;
      movimentoPrograma=performance.now()+950;
      area.scrollTo({top:Math.max(0,el.offsetTop-folha.offsetTop-30),behavior:animar?'smooth':'instant'});
    }
    function atualizar(){
      status.textContent='Etapa '+(indice+1)+' de '+atual.cenas.length;
      raiz.querySelector('#vivo-progresso').max=atual.cenas.length;
      raiz.querySelector('#vivo-progresso').value=indice+1;
      raiz.querySelector('#vivo-titulo').textContent=atual.cenas[indice].titulo;
      raiz.querySelector('#vivo-texto').textContent=atual.cenas[indice].texto;
      raiz.querySelector('#vivo-anterior').disabled=indice===0;
      raiz.querySelector('#vivo-proximo').disabled=indice===atual.cenas.length-1;
      if(canvasPorCena[indice])foco();
    }
    function cancelarVoz(){
      if(podeFalar){try{speechSynthesis.cancel();}catch{}}
      utter=null;terminouFala=true;
    }
    function duracaoCena(){
      return clamp((atual.cenas[indice].titulo+' '+atual.cenas[indice].texto).split(/\s+/).length*350+2000,4500,17500)/velocidade;
    }
    function narrar(){
      if(!podeFalar||!usarVoz){terminouFala=true;return;}
      const frase=atual.cenas[indice].titulo+'. '+atual.cenas[indice].texto;
      try{
        const u=new SpeechSynthesisUtterance(frase);
        const voces=speechSynthesis.getVoices().filter(v=>/^pt(-|$)/i.test(v.lang));
        u.voice=voces.find(v=>v.lang==='pt-BR')||voces[0]||null;u.lang=u.voice?.lang||'pt-BR';
        u.rate=.95*velocidade;u.pitch=1.02;u.volume=1;
        terminouFala=false;utter=u;
        u.onend=()=>{if(utter!==u)return;utter=null;terminouFala=true;if(progress>=1&&rodando&&!pausado)avancar();};
        u.onerror=()=>{if(utter!==u)return;utter=null;terminouFala=true;usarVoz=false;atualizarVoz();avisar('A narração não está disponível neste navegador. O quadro continua desenhando.');};
        speechSynthesis.speak(u);
      }catch{terminouFala=true;usarVoz=false;atualizarVoz();}
    }
    function iniciarCena(som=false){
      cancelarVoz();duracao=duracaoCena();tempoInicial=performance.now();tempoPausado=0;progress=animar?0:1;rodando=true;pausado=false;
      botaoPlay.textContent='⏸ Pausar';atualizar();desenhar(indice,progress);
      if(som)narrar();
    }
    function avancar(){
      if(indice>=atual.cenas.length-1){
        rodando=false;progress=1;desenhar(indice,1);botaoPlay.textContent='↻ Repetir';
        avisar('Aula concluída. Você pode perguntar algo novo ou repetir a explicação.');
        salvarHistorico(atual);void salvarNuvem(atual).catch(()=>{avisar('Aula salva neste navegador; sincronização na nuvem indisponível.');});
        atualizarHistorico();return;
      }
      desenhar(indice,1);indice++;inserir(indice);iniciarCena(usarVoz);avisar(usarVoz?'O Neo está explicando enquanto escreve.':'O Neo está desenhando automaticamente. Ative a voz se quiser ouvir.');foco();
    }
    function repetir(i){
      cancelarVoz();
      indice=clamp(i,0,atual.cenas.length-1);
      for(let j=0;j<indice;j++){inserir(j);desenhar(j,1);}
      for(let j=canvasPorCena.length-1;j>indice;j--){canvasPorCena[j]?.parentElement.remove();canvasPorCena.pop();}
      inserir(indice);iniciarCena(usarVoz);
    }
    function loop(now){
      if(fechado)return;
      if(rodando&&!pausado){
        const gasto=tempoPausado+now-tempoInicial;
        progress=animar?clamp(gasto/duracao):1;
        desenhar(indice,progress);
        if(progress>=1&&(animar||gasto>=duracao)&&(terminouFala||!usarVoz))avancar();
        else if(gasto>=duracao*2.4){cancelarVoz();avancar();}
      }
      raf=requestAnimationFrame(loop);
    }
    function atualizarVoz(){
      const b=raiz.querySelector('#vivo-mudo');b.textContent=usarVoz?'🔊 Voz ligada':'🔈 Voz desligada';b.setAttribute('aria-pressed',String(usarVoz));
    }
    function atualizarHistorico(){
      const select=raiz.querySelector('#vivo-historico');
      select.innerHTML='<option value="">Aulas anteriores</option>'+historico.map(h=>'<option value="'+q(h.id)+'">'+q(h.titulo).slice(0,90)+'</option>').join('');
      select.value='';
    }
    function carregarPlano(p){
      cancelarVoz();atual=p;indice=0;canvasPorCena.length=0;folha.textContent='';
      inserir(0);salvarHistorico(atual);atualizarHistorico();iniciarCena(usarVoz);area.scrollTop=0;foco();
    }
    function exportar(){
      if(!canvasPorCena.length)return;
      const width=canvasPorCena[0].width,height=canvasPorCena.reduce((sum,cv)=>sum+cv.height,0);
      const off=document.createElement('canvas');off.width=width;off.height=Math.min(height,18000);
      const ctx=off.getContext('2d');ctx.fillStyle='#fffefa';ctx.fillRect(0,0,width,off.height);
      let y=0;
      for(let i=0;i<canvasPorCena.length;i++){desenhar(i,1);ctx.drawImage(canvasPorCena[i],0,y);y+=canvasPorCena[i].height;}
      off.toBlob(blob=>{
        if(!blob)return avisar('Não foi possível exportar a aula.');
        const url=URL.createObjectURL(blob),a=document.createElement('a');
        a.href=url;a.download='quadro-neo-'+atual.titulo.toLowerCase().replace(/[^a-z0-9-]/g,'-').slice(0,40)+'.png';
        a.click();setTimeout(()=>URL.revokeObjectURL(url),15000);avisar('Quadro exportado como imagem.');
      },'image/png');
    }
    async function enviarPergunta(form){
      const input=form.elements.pergunta,pergunta=limpar(input.value).slice(0,400);
      if(!pergunta)return;
      const enviar=form.querySelector('[type=submit]');enviar.disabled=true;
      avisar('Organizando uma explicação para sua pergunta…');
      try{
        let novo=null;
        if(contas.usuario&&contas.cliente){
          try{
            const resposta=await tutorNeo.perguntarIA(pergunta,atual.materia);
            const partes=pontos(resposta).slice(0,6);
            if(partes.length)novo=[
              cena(pergunta,'O Neo IA organizou estes pontos para você estudar.','destaque',pergunta,'PERGUNTA'),
              ...partes.map((s,i)=>cena('Passo '+(i+1),s,i%2?'destaque':'formula',null,'EXPLICAÇÃO DO NEO IA')),
              cena('Retome o raciocínio','Releia os passos, confira os exemplos com seu material e faça uma nova pergunta.','passos',['Entender','Praticar','Revisar'],'REVISÃO')
            ];
          }catch{
            avisar('IA generativa não disponível; procurando explicações no conteúdo local.');
          }
        }
        const planoNovo=criarPlano(pergunta,atual.materia,null,novo||modeloMatematico(pergunta)||usandoBanco(pergunta,atual.materia));
        carregarPlano(planoNovo);input.value='';
      }finally{enviar.disabled=false;}
    }
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    const microfone=raiz.querySelector('#vivo-microfone');
    if(!SpeechRecognition)microfone.hidden=true;
    else microfone.addEventListener('click',()=>{
      try{
        const rec=new SpeechRecognition();rec.lang='pt-BR';rec.interimResults=false;rec.maxAlternatives=1;
        rec.onresult=e=>{raiz.querySelector('#vivo-entrada').value=e.results[0][0].transcript;};
        rec.onerror=()=>avisar('Reconhecimento de voz indisponível. Digite sua pergunta.');
        rec.start();avisar('Pode falar. Sua pergunta será colocada no campo de texto.');
      }catch{avisar('Microfone indisponível neste navegador.');}
    });
    const form=raiz.querySelector('#vivo-pergunta');form.addEventListener('submit',e=>{e.preventDefault();void enviarPergunta(form);});
    raiz.querySelector('#vivo-play').addEventListener('click',()=>{
      if(!rodando){repetir(0);return;}
      if(pausado){
        pausado=false;tempoInicial=performance.now();if(utter)try{speechSynthesis.resume();}catch{}
        botaoPlay.textContent='⏸ Pausar';avisar('Explicação retomada.');
      }else{
        pausado=true;tempoPausado+=performance.now()-tempoInicial;
        if(utter)try{speechSynthesis.pause();}catch{}
        botaoPlay.textContent='▶ Continuar';avisar('Explicação pausada.');
      }
    });
    raiz.querySelector('#vivo-mudo').addEventListener('click',()=>{
      usarVoz=!usarVoz;atualizarVoz();
      if(usarVoz){
        if(!podeFalar){usarVoz=false;atualizarVoz();avisar('Este navegador não oferece narração por voz.');return;}
        if(rodando&&!pausado){cancelarVoz();narrar();avisar('Voz ligada.');}
      }else{cancelarVoz();avisar('Voz desligada; a escrita continua automaticamente.');}
    });
    raiz.querySelector('#vivo-anterior').addEventListener('click',()=>repetir(indice-1));
    raiz.querySelector('#vivo-proximo').addEventListener('click',()=>{cancelarVoz();indice<atual.cenas.length-1?avancar():repetir(0);});
    raiz.querySelector('#vivo-baixar').addEventListener('click',exportar);
    raiz.querySelector('#vivo-seguir').addEventListener('click',()=>{
      seguir=!seguir;const b=raiz.querySelector('#vivo-seguir');b.setAttribute('aria-pressed',String(seguir));b.textContent=seguir?'◎ Seguindo':'◎ Seguir';
      if(seguir)foco();
    });
    function desligarSeguir(){
      if(!seguir||performance.now()<movimentoPrograma)return;
      seguir=false;const b=raiz.querySelector('#vivo-seguir');b.setAttribute('aria-pressed','false');b.textContent='◎ Seguir';
    }
    area.addEventListener('wheel',desligarSeguir,{passive:true});
    area.addEventListener('touchstart',desligarSeguir,{passive:true});
    area.addEventListener('pointerdown',desligarSeguir,{passive:true});
    raiz.querySelector('#vivo-menos').addEventListener('click',()=>{zoom=clamp(zoom-.1,.75,1.5);folha.style.zoom=zoom;foco();});
    raiz.querySelector('#vivo-mais').addEventListener('click',()=>{zoom=clamp(zoom+.1,.75,1.5);folha.style.zoom=zoom;foco();});
    raiz.querySelector('#vivo-velocidade').addEventListener('change',e=>{
      const velocidadeNova=Number(e.target.value)||1;
      if(rodando&&!pausado){tempoPausado+=performance.now()-tempoInicial;tempoInicial=performance.now();}
      velocidade=velocidadeNova;duracao=duracaoCena();
      if(utter)avisar('A nova velocidade será aplicada à voz na próxima etapa.');
    });
    raiz.querySelector('#vivo-historico').addEventListener('change',e=>{
      const item=historico.find(h=>h.id===e.target.value);
      if(item)carregarPlano(item);
    });
    function fechar(){
      if(fechado)return;
      fechado=true;cancelAnimationFrame(raf);cancelarVoz();obs.disconnect();
      if(controle?.fechar===fechar)controle=null;
    }
    const obs=new ResizeObserver(()=>{for(let i=0;i<canvasPorCena.length;i++)desenhar(i,i<indice?1:i===indice?progress:0);});
    obs.observe(area);controle={fechar};
    raiz.querySelector('.quadro-vivo-sair')?.addEventListener('click',fechar);
    window.addEventListener('pagehide',fechar,{once:true});
    void carregarNuvem().then(atualizarHistorico).catch(()=>{});
    atualizarVoz();inserir(0);atualizar();iniciarCena(false);raf=requestAnimationFrame(loop);
    avisar('O desenho começa sozinho. Toque em Voz para ouvir a explicação.');
  }
  return {tela,montar,fechar:()=>controle?.fechar()};
})();