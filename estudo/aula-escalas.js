
'use strict';
if (new URLSearchParams(location.search).get('origem') === 'estudo') {
 const marcar=document.getElementById('favoritar-aula');
 function atualizarMarcador(){
   const salvo=estudos.favoritos().includes('escalas');
   marcar.setAttribute('aria-pressed',String(salvo));marcar.textContent=salvo?'Salvo nos favoritos':'Salvar nos favoritos';
 }
 marcar.hidden=false;atualizarMarcador();estudos.lembrarArea('escalas');
 window.addEventListener('estudos-atualizados',atualizarMarcador);
 marcar.onclick=async()=>{marcar.disabled=true;try{await estudos.salvarDestino('escalas',marcar.getAttribute('aria-pressed')==='false');atualizarMarcador();}finally{marcar.disabled=false;}};
}
let aulaVista=false, desafioCorreto=false;
async function registrarAula(){
 if(!aulaVista||!desafioCorreto||new URLSearchParams(location.search).get('origem')!=='estudo')return;
 celebracoes.mostrar(await estudos.concluirEscalas());
 document.getElementById('registro').textContent=estudos.mensagem || 'Aula de escalas concluída e registrada no painel.';
}
const segments=[
 ['Ler a escala','1 cm → 200 cm → 2 m','Na planta, um centímetro representa duzentos centímetros no pátio. Isso equivale a dois metros.', 'M12 30 H155 M146 22 L155 30 L146 38 M162 30 H288'],
 ['Converter o comprimento','6 × 2 m = 12 m','O comprimento ocupa seis centímetros no papel. Multiplique seis por dois para obter doze metros reais.','M14 37 V20 H280 V37 M58 20 V29 M102 20 V29 M146 20 V29 M190 20 V29 M234 20 V29'],
 ['Converter a largura','4 × 2 m = 8 m','Na outra direção, quatro centímetros correspondem a oito metros. Agora conhecemos as duas dimensões reais.','M14 40 V12 H188 V40 H14 M57 12 V40 M101 12 V40 M145 12 V40'],
 ['Calcular a área','12 m × 8 m = 96 m²','Multiplique o comprimento pela largura. Doze metros vezes oito metros resultam em noventa e seis metros quadrados.','M14 42 V9 H267 V42 H14 M14 25 H267 M79 9 V42 M141 9 V42 M204 9 V42']
];
const $=s=>document.getElementById(s), board=$('board'), synth=window.speechSynthesis;
const sistemaReduz=matchMedia('(prefers-reduced-motion: reduce)');
let preferenciaReduzida=false;
try {preferenciaReduzida=localStorage.getItem('missao803.movimento')==='reduzido';}catch{}
document.documentElement.classList.toggle('quieto',preferenciaReduzida);
const reduce={get matches(){return preferenciaReduzida||sistemaReduz.matches;}};
let index=0, fraction=0, mode='idle', raf=0, last=0, token=0, spoken=true, utterance=null, watchdog=0, voiceChoice=null;
const rows=segments.map(([label,formula,caption,path],i)=>{
 const row=document.createElement('section');row.className='unit';
 row.innerHTML='<h3></h3><svg class="trace" viewBox="0 0 312 54" preserveAspectRatio="xMinYMid meet" aria-hidden="true"><path class="ink"/><circle class="tip" r="4"/></svg><p class="formula" aria-hidden="true"></p>';
 row.querySelector('h3').textContent=(i+1)+'. '+label;const line=row.querySelector('path');line.setAttribute('d',path);$('superficie').append(row);
 const li=document.createElement('li');li.textContent=label+'. '+caption+' '+formula;$('transcript').append(li);
 return {row,line,len:line.getTotalLength(),dot:row.querySelector('circle'),formula:row.querySelector('p')};
});
function render(){
 rows.forEach(({row,line,len,dot,formula},i)=>{
  const n=i<index?1:i===index?fraction:0;
  const shown=reduce.matches&&n>0?1:n;line.style.strokeDasharray=len+' '+len;line.style.strokeDashoffset=len*(1-shown);line.style.opacity=shown===0?'0':'1';
  const at=line.getPointAtLength(shown*len);dot.setAttribute('cx',at.x);dot.setAttribute('cy',at.y);dot.style.visibility=(i===index&&n>0&&n<1&&!reduce.matches)?'visible':'hidden';
  formula.textContent=segments[i][1].slice(0,Math.ceil(segments[i][1].length*shown));
  if(i===index)row.setAttribute('aria-current','step');else row.removeAttribute('aria-current');
 });
}
function follow(instant=false){
 if(!$('follow').checked)return;
 const box=board.getBoundingClientRect(), row=rows[index].row.getBoundingClientRect(), delta=row.top-box.top-12;
 if(row.bottom>box.bottom-8||row.top<box.top+4)board.scrollTo({top:board.scrollTop+delta,behavior:instant||reduce.matches?'instant':'smooth'});
}
let ultimoPan=0;
function acompanharPonta(){
 if(!$('follow').checked || Number($('zoom').value)===1)return;
 const ponto=rows[index].dot.getBoundingClientRect(), janela=board.getBoundingClientRect();
 if(ponto.left<janela.left+16 || ponto.right>janela.right-28)
   board.scrollBy({left:ponto.left-janela.left-board.clientWidth*.45,behavior:reduce.matches?'instant':'smooth'});
}
function ajustarSuperficie(){
 const estilo=getComputedStyle(board);
 $('superficie').style.width=Math.max(1,board.clientWidth-parseFloat(estilo.paddingLeft)-parseFloat(estilo.paddingRight))+'px';
 $('superficie').style.zoom=$('zoom').value;
}
new ResizeObserver(ajustarSuperficie).observe(board);
$('zoom').onchange=()=>{ajustarSuperficie();follow(true);acompanharPonta();};
function stopVoice(){
 const pausedHere = utterance && synth?.paused;
 token++;
 clearTimeout(watchdog);
 if(utterance)synth?.cancel();
 if(pausedHere)synth.resume();
 utterance=null;
 spoken=true;
}
function updateVoices(){
 const locais=(synth?.getVoices() || []).filter(v=>v.localService&&/^pt(?:-|$)/i.test(v.lang));
 let preferida='';
 try{preferida=JSON.parse(contas.armazenamento.getItem(contas.chave('missao803.previa.visitante.v1')))?.perfil?.voz || ''}catch{}
 const selecao=$('voz-aula'), escolha=estudos.dados.vozQuadro || '';
 const padrao=locais.find(v=>v.voiceURI===preferida) || locais.find(v=>/^pt[-_]BR$/i.test(v.lang)) || locais[0];
 selecao.replaceChildren(new Option('Usar voz do perfil',''),...locais.map(v=>new Option((v.name||'Português')+' · '+v.lang,v.voiceURI||v.name||v.lang)));
 voiceChoice=locais.find(v=>(v.voiceURI||v.name||v.lang)===escolha) || padrao;
 selecao.value=locais.some(v=>(v.voiceURI||v.name||v.lang)===escolha)?escolha:'';
 selecao.disabled=!locais.length;
 $('voice').disabled=!voiceChoice;
 if(!voiceChoice){$('voice').checked=false;stopVoice()}
 $('voiceStatus').textContent=voiceChoice?'Voz disponível: '+(voiceChoice.name || 'Português')+' ('+voiceChoice.lang+').':'A voz local em português está indisponível. A explicação acompanha a escrita em texto.';
}
function narrate(){
 stopVoice();if(!$('voice').checked||!voiceChoice||mode!=='playing')return;
 const run=token;spoken=false;utterance=new SpeechSynthesisUtterance(segments[index][2]);utterance.voice=voiceChoice;utterance.lang=voiceChoice.lang;utterance.rate=Number($('speed').value);
 utterance.onend=()=>{if(run===token){clearTimeout(watchdog);spoken=true;utterance=null}};
 const fallback=()=>{if(run!==token)return;stopVoice();$('voiceStatus').textContent='A reprodução de voz falhou. A aula continua com legenda.'};
 utterance.onerror=fallback;watchdog=setTimeout(()=>{if(mode==='playing')fallback()},18000);try{synth.speak(utterance)}catch{fallback()}
}
function state(){
 $('play').textContent=({idle:'Iniciar',playing:'Pausar',paused:'Retomar',done:'Repetir aula'})[mode];
 $('prev').disabled=index===0;
 $('numero-etapa').textContent='Etapa '+(index+1)+' de '+segments.length+' · '+segments[index][0];
 $('progresso-aula').value=mode==='done'?segments.length:index;
 $('caption').textContent=mode==='idle'?'O quadro está pronto. Ative a narração se quiser ouvir o Neo.': mode==='done'?'Aula concluída. A área do pátio é 96 m².':segments[index][2];
}
function startStep(i){stopVoice();index=i;fraction=0;last=0;render();state();follow();narrate()}
function frame(now){
 if(mode!=='playing')return;
 if(last)fraction=Math.min(1,fraction+Math.min(now-last,100)*Number($('speed').value)/3800);
 last=now;render();if(now-ultimoPan>250){acompanharPonta();ultimoPan=now;}
 if(fraction===1&&spoken){if(index===segments.length-1){mode='done';aulaVista=true;state();registrarAula();return}startStep(index+1)}
 raf=requestAnimationFrame(frame);
}
function restart(){cancelAnimationFrame(raf);mode='playing';startStep(0);raf=requestAnimationFrame(frame)}
$('play').onclick=()=>{
 if(mode==='idle'||mode==='done'){restart();return}
 if(mode==='playing'){cancelAnimationFrame(raf);mode='paused';last=0;if(utterance){synth.pause();clearTimeout(watchdog)}}
 else {mode='playing';last=0;if(utterance){synth.resume();const run=token;watchdog=setTimeout(()=>{if(run===token){stopVoice();$('voiceStatus').textContent='Aula retomada com legenda.'}},18000)}else if(fraction===0)narrate();raf=requestAnimationFrame(frame)}
 state();
};
$('voz-aula').onchange=async e=>{
 const escolha=e.target.value;
 await estudos.alterar(d=>{d.vozQuadro=escolha});
 updateVoices();
 if($('voice').checked&&mode==='playing')startStep(index);
};
$('repetir-etapa').onclick=()=>{cancelAnimationFrame(raf);mode='playing';startStep(index);raf=requestAnimationFrame(frame);};
$('prev').onclick=()=>{if(mode==='done')mode='paused';startStep(Math.max(0,index-1))};
$('restart').onclick=restart;
$('voice').onchange=()=>{if($('voice').checked)narrate();else stopVoice()};
$('speed').onchange=()=>{if(utterance){stopVoice();fraction=0;last=0;render();narrate()}};
$('follow').onchange=()=>{follow(true);acompanharPonta();};
for(const type of ['wheel','touchmove','pointerdown'])board.addEventListener(type,()=>{$('follow').checked=false},{passive:true});
board.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End','PageDown','PageUp',' '].includes(e.key))$('follow').checked=false});
synth?.addEventListener('voiceschanged',updateVoices);
window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);stopVoice();if(mode==='playing')mode='paused';state()});
$('exercise').onsubmit=e=>{e.preventDefault();const certo=new FormData(e.target).get('q')==='6';desafioCorreto ||= certo;registrarAula();$('feedback').textContent=certo?'Correto. Três centímetros representam 3 × 2 m, ou 6 metros.':'Multiplique 3 por 200 para obter 600 centímetros. Cada 100 centímetros formam um metro. Tente novamente.'};
updateVoices();state();render();
