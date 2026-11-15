/* Neo Labirinto v5 — game de exploração pixel art original, 5 mapas. */
(() => {
"use strict";
const root=document.getElementById("neoGames40");if(!root)return;
const $=id=>document.getElementById(id);
const levels=[
 {rocks:[[4,1],[4,2],[4,3],[4,4],[7,5],[8,5],[9,5],[12,4],[12,5]],gems:[[2,2],[6,3],[11,7]],name:"Bosque dos Cristais"},
 {rocks:[[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[7,3],[8,3],[9,3],[10,3],[10,4],[10,5],[12,6],[12,7]],gems:[[2,6],[7,7],[12,2]],name:"Ruínas do Mistério"},
 {rocks:[[3,2],[3,3],[3,4],[6,1],[6,2],[6,3],[6,4],[6,5],[8,6],[9,6],[10,6],[11,6],[11,2],[11,3],[11,4],[13,5],[13,6]],gems:[[2,7],[8,2],[13,3]],name:"Castelo dos Portais"},
 {rocks:[[2,3],[3,3],[4,3],[5,3],[6,3],[9,2],[9,3],[9,4],[9,5],[11,5],[12,5],[13,5],[5,7],[6,7]],gems:[[2,6],[7,1],[12,7]],name:"Cidade Neon"},
 {rocks:[[3,1],[3,2],[3,3],[3,5],[3,6],[5,4],[6,4],[7,4],[8,4],[9,4],[11,2],[11,3],[11,4],[11,6],[12,6],[13,6]],gems:[[2,7],[8,6],[13,2]],name:"Jardim das Descobertas"}
];
const size=32,W=16,H=10,exit={x:14,y:8};
const html=[
'<section class="mp5-puzzle" id="neoPuzzle5" aria-label="Labirinto pixelado de exploração">',
'<div class="mp5-puzzle-header"><div><span class="mp5-puzzle-tag">✨ NOVA AVENTURA • PIXEL ART</span><h3>🗝️ Labirinto dos Cristais</h3><p>Explore cinco mundos pixelados, encontre cristais e resolva enigmas para abrir portais. Cenários variados, exploração e progressão educativa.</p></div><button type="button" id="mp5PuzzleStart" class="mp5-puzzle-main">▶ Começar aventura</button></div>',
'<div class="mp5-puzzle-shell"><div class="mp5-puzzle-hud"><strong id="mp5PuzzleLevel">Bosque dos Cristais</strong><span id="mp5PuzzleGems">💎 0/3</span><span id="mp5PuzzleStep">Mapa 1/5</span></div>',
'<canvas id="mp5PuzzleCanvas" width="512" height="320" tabindex="0" aria-label="Mapa pixelado de labirinto. Mova o explorador com as setas ou botões na tela.">Seu navegador não oferece Canvas.</canvas>',
'<div class="mp5-puzzle-question" id="mp5PuzzleQuestion" hidden><strong id="mp5PuzzlePrompt">Enigma do portal</strong><div id="mp5PuzzleAnswers" class="mp5-puzzle-answers"></div></div>',
'<div id="mp5PuzzleMessage" role="status" aria-live="polite" class="mp5-puzzle-message">Colete os cristais para abrir a porta encantada.</div>',
'<div class="mp5-puzzle-controls" aria-label="Controles do labirinto"><div><button type="button" data-move="up" aria-label="Mover para cima">▲</button></div><div><button type="button" data-move="left" aria-label="Mover para esquerda">◀</button><button type="button" data-move="down" aria-label="Mover para baixo">▼</button><button type="button" data-move="right" aria-label="Mover para direita">▶</button></div></div>',
'<small>💡 Dica: quando reunir três cristais, aparece uma pergunta da matéria selecionada no Studio Neo. Você também pode responder pelos botões, sem precisar usar os movimentos.</small>',
'</div></section>'
].join("");
root.insertAdjacentHTML("beforeend",html);
const cv=$("mp5PuzzleCanvas"),ctx=cv.getContext("2d");if(!ctx)return;
let level=0,player={x:1,y:1},gems=new Set(),unlocked=false,active=false,question=null,tick=0,raf=0,score=0,alreadyWrong=false;
const status=s=>{$("mp5PuzzleMessage").textContent=s};
const key=(x,y)=>x+"|"+y;
function inRock(x,y){return levels[level].rocks.some(p=>p[0]===x&&p[1]===y)}
function subjectsQuestions(){
 const s=$("n4Subject")?.value||"Matemática",bank=typeof quizzes!=="undefined"?quizzes:[];
 const valid=bank.filter(q=>Array.isArray(q.o)&&Number.isInteger(q.a)&&q.a>=0&&q.a<q.o.length);
 const chosen=valid.filter(q=>q.s===s);
 return chosen.length?chosen:valid.filter(q=>q.s==="Matemática").length?valid.filter(q=>q.s==="Matemática"):valid;
}
function selectQuestion(){
 const bank=subjectsQuestions();
 if(!bank.length){question=null;status("Ainda não há perguntas cadastradas. Escolha outra matéria.");return}
 const requested=$("n4Subject")?.value||"Matemática";
 question=window.portal8Q8?.pick(requested,1)?.[0]||bank[(level*3+score)%bank.length];
 alreadyWrong=false;
 $("mp5PuzzleQuestion").hidden=false;$("mp5PuzzlePrompt").textContent="🔮 Enigma do portal • "+question.s+": "+question.q;
 const target=$("mp5PuzzleAnswers");target.replaceChildren();
 question.o.forEach((option,index)=>{
  const b=document.createElement("button");b.type="button";b.textContent=String.fromCharCode(65+index)+". "+option;
  b.addEventListener("click",()=>{
   if(!active||unlocked)return;
   if(index===question.a){
    unlocked=true;score+=10;window.portal8Q8?.record?.(question,true);$("mp5PuzzleQuestion").hidden=true;
    status("✅ Resposta correta! A porta brilhante se abriu. Encontre a saída à direita do mapa.");
    draw();
   }else{
    if(!alreadyWrong){window.portal8Q8?.record?.(question,false);alreadyWrong=true}
    status("💡 Ainda não! Reveja o conceito e tente outra vez. "+(question.e||"Leia o enunciado com calma."));
   }
  });target.append(b);
 });
 status("🔮 Três cristais coletados! "+(question.s!==($("n4Subject")?.value||"Matemática")?"Não havia questões disponíveis da matéria escolhida; este enigma usa "+question.s+". ":"")+"Responda para liberar a porta.");
}
function setup(n){
 level=n;player={x:1,y:1};gems=new Set();unlocked=false;question=null;alreadyWrong=false;
 $("mp5PuzzleQuestion").hidden=true;$("mp5PuzzleLevel").textContent=levels[level].name;
 $("mp5PuzzleStep").textContent="Mapa "+(level+1)+"/3";
 $("mp5PuzzleGems").textContent="💎 0/3";
 status("Explore o mapa e encontre os três cristais.");
 draw();
}
function start(){
 if(window.neoGames40?.stop)window.neoGames40.stop();
 if(raf)cancelAnimationFrame(raf);raf=0;active=true;score=0;tick=0;
 $("mp5PuzzleStart").textContent="↻ Reiniciar aventura";
 setup(0);loop();
 cv.focus({preventScroll:true});
}
function walk(dx,dy){
 if(!active)return;
 const x=player.x+dx,y=player.y+dy;
 if(x<1||y<1||x>=W-1||y>=H-1||inRock(x,y))return;
 if(x===exit.x&&y===exit.y){
  if(!unlocked){status("🔒 A porta está fechada. Junte os cristais e resolva o enigma.");return}
  if(level===levels.length-1){
   active=false;if(raf)cancelAnimationFrame(raf);raf=0;
   $("mp5PuzzleQuestion").hidden=true;
   status("🏆 Você terminou os três labirintos! Pontuação: "+score+". Parabéns pela exploração!");
  }else{
   setup(level+1);score+=15;status("🌟 Novo território desbloqueado! Explore e recolha mais cristais.");
  }return;
 }
 player={x,y};
 const found=levels[level].gems.findIndex(g=>g[0]===x&&g[1]===y);
 if(found!==-1){
  const id=key(x,y);
  if(!gems.has(id)){
   gems.add(id);score+=5;$("mp5PuzzleGems").textContent="💎 "+gems.size+"/3";
   status("💎 Cristal encontrado! Você já recolheu "+gems.size+" de 3.");
   if(gems.size===3)selectQuestion();
  }
 }
 draw();
}
const themes=[
 {ground:"#315b69",ground2:"#3e6771",wall:"#214153",edge:"#6b98a2",detail:"#81c99d"},
 {ground:"#55445d",ground2:"#614c68",wall:"#352849",edge:"#9980b5",detail:"#ffd08a"},
 {ground:"#354f7c",ground2:"#395a82",wall:"#29365d",edge:"#88b0dc",detail:"#d5e1fb"},
 {ground:"#1b416c",ground2:"#234b76",wall:"#172e58",edge:"#7476ce",detail:"#7ef6e6"},
 {ground:"#456a59",ground2:"#527660",wall:"#314e42",edge:"#9dcc96",detail:"#ecdb90"}
];
function tile(x,y){
 const px=x*size,py=y*size,t=themes[level];
 ctx.fillStyle=(x+y)%2?t.ground:t.ground2;ctx.fillRect(px,py,size,size);
 ctx.fillStyle="#ffffff16";ctx.fillRect(px+1,py+1,30,1);
 if((x*11+y*7+level)%6===0){
  ctx.fillStyle=t.detail;ctx.fillRect(px+7,py+7,3,5);ctx.fillRect(px+4,py+10,9,2);
 }
 if((x+2*y+level)%7===0){
  ctx.fillStyle="#ffffff49";ctx.fillRect(px+21,py+23,2,3);
 }
 if(x===0||y===0||x===W-1||y===H-1||inRock(x,y)){
  ctx.fillStyle=t.wall;ctx.fillRect(px,py,size,size);
  ctx.fillStyle=t.edge;ctx.fillRect(px+2,py+2,28,5);
  ctx.fillStyle="#111c396c";ctx.fillRect(px+3,py+10,24,17);
  ctx.fillStyle=t.edge;ctx.fillRect(px+5,py+13,2,4);
 }
}
function draw(){
 if(!ctx)return;
 ctx.imageSmoothingEnabled=false;
 ctx.fillStyle="#17264a";ctx.fillRect(0,0,cv.width,cv.height);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)tile(x,y);
 // decorative animated particles in each pixel world, kept clear of navigation.
 if(!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches){
  for(let i=0;i<13;i++){
   const px=(i*59+level*27)%500,py=(i*37+tick*(i%3+1)*.15)%295;
   ctx.fillStyle=themes[level].detail;
   ctx.fillRect(px,py,2,2);
  }
 }

 for(const [x,y] of levels[level].gems){
  if(gems.has(key(x,y)))continue;
  const px=x*size+16,py=y*size+16+(Math.sin(tick*.07+x)*2)|0;
  ctx.fillStyle="#bcefff";ctx.fillRect(px-5,py-10,10,18);
  ctx.fillStyle="#e3ffff";ctx.fillRect(px-3,py-13,6,5);
  ctx.fillStyle="#55d7ed";ctx.fillRect(px-10,py-2,20,7);
  ctx.fillStyle="#0b607a";ctx.fillRect(px-3,py+8,6,4);
 }
 const px=exit.x*size,py=exit.y*size;
 ctx.fillStyle=unlocked?"#32ddbb":"#b95b95";ctx.fillRect(px+6,py+3,20,27);
 ctx.fillStyle="#142b4a";ctx.fillRect(px+10,py+7,12,20);
 ctx.fillStyle=unlocked?"#b5ffe3":"#f8c3e8";ctx.fillRect(px+14,py+10,4,13);
 ctx.fillStyle="#fff";ctx.font="bold 8px monospace";ctx.textAlign="center";ctx.fillText(unlocked?"OPEN":"LOCK",px+16,py+2);
 const meX=player.x*size,meY=player.y*size;
 // Mascote pixel original com rosto e mochila.
 ctx.fillStyle="#10243d";ctx.fillRect(meX+7,meY+25,18,4);
 ctx.fillStyle="#ffd29b";ctx.fillRect(meX+10,meY+6,15,17);
 ctx.fillStyle="#fff2db";ctx.fillRect(meX+8,meY+4,17,10);
 ctx.fillStyle="#48e0cd";ctx.fillRect(meX+9,meY+15,15,10);
 ctx.fillStyle="#313b70";ctx.fillRect(meX+10,meY+24,5,5);ctx.fillRect(meX+19,meY+24,5,5);
 ctx.fillStyle="#182f57";ctx.fillRect(meX+13,meY+11,3,3);ctx.fillRect(meX+20,meY+11,3,3);
 ctx.fillStyle="#ffb56e";ctx.fillRect(meX+6,meY+17,4,8);
 ctx.fillStyle="#89edff";ctx.fillRect(meX+5,meY+15,3,7);
}
function loop(){
 if(raf||!active||document.hidden||!root.classList.contains("active"))return;
 const frame=()=>{raf=0;if(!active||document.hidden||!root.classList.contains("active"))return;
  tick++;if(!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)draw();
  raf=requestAnimationFrame(frame);
 };
 raf=requestAnimationFrame(frame);
}
$("mp5PuzzleStart").addEventListener("click",start);
root.querySelectorAll("[data-move]").forEach(b=>b.addEventListener("click",()=>{
 const dirs={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]},v=dirs[b.dataset.move];walk(...v);cv.focus({preventScroll:true});
}));
document.addEventListener("keydown",e=>{
 if(!active||!root.classList.contains("active")||$("mp5PuzzleQuestion").hidden===false)return;
 if(document.activeElement?.matches?.("input,textarea,select,[contenteditable]"))return;
 const moves={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};
 const m=moves[e.key];if(!m)return;e.preventDefault();if(e.repeat)return;walk(...m);
});
document.addEventListener("portal8:viewchange",e=>{
 if(e.detail?.id!=="neoGames40"){if(raf)cancelAnimationFrame(raf);raf=0}
 else if(active)loop();
});
document.addEventListener("visibilitychange",()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0}else if(active)loop()});
draw();
})();