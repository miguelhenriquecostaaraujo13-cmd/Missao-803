/* Neo 4.0: jogo WebGL tridimensional + jogo pixel arcade; arte procedural original. */
(() => {
"use strict";
const $=id=>document.getElementById(id),root=$("neoGames40");if(!root)return;
const engine=()=>window.neoAgentCore;
const reduced=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches||document.documentElement.dataset.phaseMotion==="reduce";
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const paletteSet={
 neon:{sky:"#102443",fog:"#18375b",ground:"#2a456f",road:"#172849",tower:"#786dc3",edge:"#54e8ef",gem:"#f2c96e"},
 forest:{sky:"#173d4c",fog:"#295957",ground:"#39745d",road:"#204738",tower:"#639f86",edge:"#d3f3a3",gem:"#ffe18e"},
 sunset:{sky:"#4b2857",fog:"#604168",ground:"#ae6d8e",road:"#423353",tower:"#c47cbe",edge:"#ffb97e",gem:"#ffe59f"}
};
const col=h=>[0,2,4].map(i=>parseInt(h.slice(i+1,i+3),16)/255);
const pal=()=>paletteSet[engine()?.themeFor($("n4Subject")?.value)]||paletteSet.neon;
const adaptive=()=>engine()?.difficulty()||1;
const quality=()=>engine()?.quality()||"auto";
const questions=()=>typeof quizzes!=="undefined"?quizzes:[];
const subjectsList=()=>typeof subjects!=="undefined"?subjects:[];
let mode="three",game=null,raf=0,last=0,economy=false,slow=0,glscene=null,glFailed=false;
let keys={left:false,right:false,fire:false};
root.innerHTML=[
'<div class="n4-game-header"><span class="n4-label">🎮 STUDIO NEO 4.0 • NOVOS JOGOS</span><h2>Games com mundos que ganham vida</h2><p>Escolha uma corrida em <strong>3D WebGL real</strong> ou um fliperama <strong>pixel art</strong>. Neo Render cuida dos cenários e Game Master ajusta o ritmo de cada partida.</p></div>',
'<div class="n4-game-grid"><button type="button" class="n4-game-card selected" data-mode="three" aria-pressed="true"><span class="n4-game-picture n4-cover-3d" aria-hidden="true"><i class="n4-orb"></i><i class="n4-castle"></i><i class="n4-path"></i></span><strong>🌌 Guardião dos Portais</strong><small>3D verdadeiro • três pistas e portais de respostas</small></button>',
'<button type="button" class="n4-game-card" data-mode="pixel" aria-pressed="false"><span class="n4-game-picture n4-cover-pixel" aria-hidden="true"><b>👾</b><i>✦ · ✦ · ✦</i><em>8-BIT ARCADE</em></span><strong>🕹️ Pixel Invaders do Saber</strong><small>Arte pixelada • naves, lasers e desafios</small></button></div>',
'<div class="n4-game-controls"><label>📚 Matéria <select id="n4Subject"></select></label><label>🎨 Neo Render <select id="n4Theme"><option value="auto">Tema automático</option><option value="neon">🌌 Neon espacial</option><option value="forest">🌳 Floresta</option><option value="sunset">🌇 Pôr do sol</option></select></label><label>✨ Qualidade <select id="n4Quality"><option value="auto">Automática</option><option value="high">Detalhada</option><option value="economy">Econômica</option></select></label><label>🤖 Game Master <select id="n4Assist"><option value="normal">Adaptativo</option><option value="light">Suave</option><option value="off">Desligado</option></select></label></div>',
'<div class="n4-game-shell"><div class="n4-game-toolbar"><div><strong id="n4GameTitle">🌌 Guardião dos Portais 3D</strong><small id="n4GameSub">WebGL • escolha a pista da resposta</small></div><div class="n4-hud"><span id="n4Level">Fase 1/5</span><span id="n4Score">⭐ 0 pontos</span><span id="n4Skill">Ritmo equilibrado</span></div></div>',
'<div class="n4-canvas-wrap" id="n4ThreeWrap"><canvas id="n4Canvas3D" width="960" height="520" tabindex="0" aria-label="Jogo tridimensional de três pistas. Use as setas e escolha o portal correto.">Seu navegador não oferece Canvas.</canvas><div id="n4NoWebGL" class="n4-graphics-warning" hidden>O WebGL não está disponível. Tente ativar a aceleração gráfica ou jogue Pixel Invaders.</div><span class="n4-stage-stamp">3D WEBGL</span><div class="n4-lane-labels" aria-hidden="true"><span>A • ESQUERDA</span><span>B • CENTRO</span><span>C • DIREITA</span></div></div>',
'<div class="n4-canvas-wrap" id="n4PixelWrap" hidden><canvas id="n4CanvasPixel" width="320" height="180" tabindex="0" aria-label="Jogo pixel art com nave: use esquerda, direita e atirar para escolher a resposta.">Canvas não disponível.</canvas><span class="n4-stage-stamp pixel">8-BIT PIXEL</span></div>',
'<div class="n4-question-zone"><strong id="n4Question" aria-live="polite">Selecione uma matéria e clique em Jogar.</strong><div class="n4-answers" id="n4Answers"></div><p id="n4Feedback" class="n4-feedback" role="status" aria-live="polite">Use teclado, clique nas respostas ou toque nos controles.</p></div>',
'<div class="n4-play-actions"><button type="button" class="n4-action primary" id="n4Start">▶ Jogar</button><button type="button" class="n4-action" id="n4Pause" disabled>⏸ Pausar</button><button type="button" class="n4-action" id="n4Hint">💡 Dica</button><button type="button" class="n4-action" id="n4Classic">🕹️ Arcade antigo</button></div>',
'<div class="n4-touch-controls"><button type="button" id="n4Left" aria-label="Esquerda">◀</button><button type="button" id="n4Fire" aria-label="Atirar">⚡ ATIRAR</button><button type="button" id="n4Right" aria-label="Direita">▶</button></div></div>',
'<div class="n4-info-grid"><article><h3>🎨 Neo Render</h3><p>Gera cenários e iluminação com geometria e materiais, em tempo real. O 3D usa WebGL; o retrô usa Canvas com pixels desenhados. Não é um modelo gerador de imagens.</p></article><article><h3>🧠 Neo Game Master</h3><p>Motor adaptativo local: depois de acertos ou erros ele altera o ritmo, sem comparar alunos ou publicar notas.</p></article><article><h3>♿ Acessibilidade</h3><p>Botões, teclado, seleção direta de respostas e pausa ao sair do jogo. O modo econômico ajuda computadores mais simples.</p></article></div>'
].join("");
subjectsList().forEach(s=>{const op=document.createElement("option");op.value=s.name;op.textContent=s.icon+" "+s.name;$("n4Subject").append(op)});
if([...$("n4Subject").options].some(o=>o.value==="Matemática"))$("n4Subject").value="Matemática";
for(const [id,name] of [["n4Theme","theme"],["n4Quality","quality"],["n4Assist","assist"]]){if(engine()?.config[name])$(id).value=engine().config[name];$(id).addEventListener("change",e=>{engine()?.set(name,e.target.value);if(!raf)draw()})}
const c3=$("n4Canvas3D"),cp=$("n4CanvasPixel"),answers=$("n4Answers");
const status=s=>{$("n4Feedback").textContent=s};
const bank=()=>{
 const selected=$("n4Subject").value;
 const items=questions().filter(q=>q.s===selected&&Array.isArray(q.o)&&q.o.length>=3&&q.a>=0&&q.a<q.o.length);
 return items.sort(()=>Math.random()-.5).slice(0,5).map(q=>{
  const distractors=q.o.map((v,i)=>({v,i})).filter(o=>o.i!==q.a).sort(()=>Math.random()-.5).slice(0,2);
  const options=[{v:q.o[q.a],i:q.a},...distractors].sort(()=>Math.random()-.5);
  return {q:q.q,opts:options.map(x=>x.v),correct:options.findIndex(x=>x.i===q.a),explain:q.e||"Revise o conteúdo da questão."};
 });
};
function currentQuestion(){return game?.items[game.index]}
function present(q){
 $("n4Question").textContent=q?.q||"Partida concluída!";
 answers.replaceChildren();if(!q)return;
 q.opts.forEach((opt,i)=>{
  const b=document.createElement("button");b.type="button";b.className="n4-answer";b.textContent="ABC"[i]+". "+opt;
  b.addEventListener("click",()=>{
   if(!game?.running||game.paused||game.delay>0)return;
   game.pick(i);draw();(mode==="three"?c3:cp).focus({preventScroll:true});
  });answers.append(b);
 });
}
function mark(selected=-1,correct=-1){
 [...answers.children].forEach((b,i)=>{b.classList.toggle("active",i===selected);b.classList.toggle("correct",i===correct)});
}
function hud(){
 if(!game)return;
 $("n4Level").textContent="Fase "+Math.min(5,game.index+1)+"/5";
 $("n4Score").textContent="⭐ "+game.score+" pontos";
 const d=adaptive();$("n4Skill").textContent=d<.95?"Ritmo tranquilo":d>1.05?"Desafio avançado":"Ritmo equilibrado";
}
function grade(choice){
 const q=currentQuestion();if(!q)return;
 const good=choice===q.correct;
 engine()?.record(good);if(good)game.score+=20;
 status((good?"✅ Correto! ":"💡 Continue aprendendo! ")+q.explain);
 mark(-1,q.correct);game.index++;hud();game.delay=2.2;
}
function stopLoop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0}
function pause(value){
 if(!game?.running)return;
 game.paused=value===undefined?!game.paused:!!value;
 $("n4Pause").textContent=game.paused?"▶ Continuar":"⏸ Pausar";
 if(game.paused){stopLoop();status("Jogo pausado. Continue quando quiser.")}else loop();
}
function finish(){
 game.running=false;game.paused=true;
 $("n4Start").textContent="↻ Jogar de novo";$("n4Pause").disabled=true;
 present(null);status("🏆 Você concluiu a partida com "+game.score+" pontos. Sua evolução não é um ranking público.");stopLoop();
}
function next(){
 if(game.index>=game.items.length){finish();return}
 game.delay=0;game.resetWave();present(currentQuestion());
 status(mode==="three"?"Mude para a pista da resposta certa antes do portal chegar.":"Use as setas e atire na nave com a letra correta.");
}
function begin(){
 stopLoop();const items=bank();
 if(!items.length){status("Ainda não há questões cadastradas para esta matéria. Selecione outra.");return}
 engine()?.start();
 game=mode==="three"?new Runner(items):new Pixel(items);
 $("n4Start").textContent="↻ Reiniciar";$("n4Pause").disabled=false;$("n4Pause").textContent="⏸ Pausar";
 next();hud();draw();loop();(mode==="three"?c3:cp).focus({preventScroll:true});
}
function loop(){
 if(raf||!game?.running||game.paused||document.hidden||!root.classList.contains("active"))return;
 raf=requestAnimationFrame(frame);last=0;
}
function frame(t){
 raf=0;if(!game?.running||game.paused||document.hidden||!root.classList.contains("active"))return;
 const dt=last?Math.min(.06,(t-last)/1000):.016;last=t;
 if(quality()==="auto"){slow=dt>.032?Math.min(100,slow+2):Math.max(0,slow-1);if(slow>55)economy=true}else economy=quality()==="economy";
 game.step(dt);draw();
 if(game?.running&&!game.paused)raf=requestAnimationFrame(frame);
}
// Math for native WebGL 1, column-major matrices.
const rad=v=>v*Math.PI/180;
function persp(f,aspect,n,F){const q=1/Math.tan(f/2);return [q/aspect,0,0,0,0,q,0,0,0,0,(F+n)/(n-F),-1,0,0,2*F*n/(n-F),0]}
function norm(v){const l=Math.hypot(...v)||1;return v.map(x=>x/l)}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function view(eye,to){
 const z=norm(eye.map((v,i)=>v-to[i])),x=norm(cross([0,1,0],z)),y=cross(z,x);
 const dot=a=>a.reduce((s,v,i)=>s+v*eye[i],0);
 return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x),-dot(y),-dot(z),1];
}
function matrix(x,y,z,sx,sy,sz,r=0){const c=Math.cos(r),s=Math.sin(r);return [c*sx,0,-s*sx,0,0,sy,0,0,s*sz,0,c*sz,0,x,y,z,1]}
function geometries(){
 const cube=[],oct=[],pyramid=[];
 const quad=(out,a,b,c,d,n)=>[a,b,c,a,c,d].forEach(v=>out.push(...v,...n));
 const p=.5;
 quad(cube,[-p,-p,p],[p,-p,p],[p,p,p],[-p,p,p],[0,0,1]);
 quad(cube,[p,-p,-p],[-p,-p,-p],[-p,p,-p],[p,p,-p],[0,0,-1]);
 quad(cube,[p,-p,p],[p,-p,-p],[p,p,-p],[p,p,p],[1,0,0]);
 quad(cube,[-p,-p,-p],[-p,-p,p],[-p,p,p],[-p,p,-p],[-1,0,0]);
 quad(cube,[-p,p,p],[p,p,p],[p,p,-p],[-p,p,-p],[0,1,0]);
 quad(cube,[-p,-p,-p],[p,-p,-p],[p,-p,p],[-p,-p,p],[0,-1,0]);
 const top=[0,.8,0],bottom=[0,-.8,0],poles=[[0,0,.6],[.6,0,0],[0,0,-.6],[-.6,0,0]];
 for(let i=0;i<4;i++)for(const apex of [top,bottom]){
  const a=poles[i],b=poles[(i+1)%4],face=apex===top?[apex,a,b]:[apex,b,a];
  const n=norm(cross(face[1].map((v,j)=>v-face[0][j]),face[2].map((v,j)=>v-face[0][j])));
  face.forEach(v=>oct.push(...v,...n));
 }
 const A=[-.5,-.5,-.5],B=[.5,-.5,-.5],C=[.5,-.5,.5],D=[-.5,-.5,.5],T=[0,.7,0];
 for(const face of [[A,B,T],[B,C,T],[C,D,T],[D,A,T]]){
  const n=norm(cross(face[1].map((v,j)=>v-face[0][j]),face[2].map((v,j)=>v-face[0][j])));face.forEach(v=>pyramid.push(...v,...n));
 }
 quad(pyramid,A,D,C,B,[0,-1,0]);
 return {cube,oct,pyramid};
}
class Scene{
 constructor(){
  const g=c3.getContext("webgl",{alpha:false,antialias:true})||c3.getContext("experimental-webgl",{alpha:false,antialias:true});
  if(!g)throw Error("WebGL indisponível");this.g=g;
  const vert="attribute vec3 aPos,aNorm; uniform mat4 uP,uV,uM; varying vec3 n,w; void main(){vec4 p=uM*vec4(aPos,1.);w=p.xyz;n=mat3(uM)*aNorm;gl_Position=uP*uV*p;}";
  const frag="precision mediump float; varying vec3 n,w;uniform vec3 uColor,uFog;void main(){float d=.43+.57*max(dot(normalize(n),normalize(vec3(-.5,.9,.6))),0.);float fog=clamp((length(w-vec3(6.,8.,13.))-12.)/40.,0.,.8);gl_FragColor=vec4(mix(uColor*d+uColor*.09,uFog,fog),1.);}";
  const compile=(type,source)=>{const s=g.createShader(type);g.shaderSource(s,source);g.compileShader(s);if(!g.getShaderParameter(s,g.COMPILE_STATUS))throw Error(g.getShaderInfoLog(s));return s};
  const prog=g.createProgram();g.attachShader(prog,compile(g.VERTEX_SHADER,vert));g.attachShader(prog,compile(g.FRAGMENT_SHADER,frag));g.linkProgram(prog);if(!g.getProgramParameter(prog,g.LINK_STATUS))throw Error(g.getProgramInfoLog(prog));this.prog=prog;
  g.useProgram(prog);g.enable(g.DEPTH_TEST);g.depthFunc(g.LEQUAL);g.disable(g.CULL_FACE);
  this.loc={p:g.getUniformLocation(prog,"uP"),v:g.getUniformLocation(prog,"uV"),m:g.getUniformLocation(prog,"uM"),color:g.getUniformLocation(prog,"uColor"),fog:g.getUniformLocation(prog,"uFog")};
  this.attr={p:g.getAttribLocation(prog,"aPos"),n:g.getAttribLocation(prog,"aNorm")};this.geo={};
  for(const [id,raw] of Object.entries(geometries())){
   const buffer=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,buffer);g.bufferData(g.ARRAY_BUFFER,new Float32Array(raw),g.STATIC_DRAW);
   this.geo[id]={buffer,count:raw.length/6};
  }
  g.uniformMatrix4fv(this.loc.p,false,new Float32Array(persp(rad(49),c3.width/c3.height,.2,100)));
  g.uniformMatrix4fv(this.loc.v,false,new Float32Array(view([6.2,8.4,13.7],[0,.7,-7])));
 }
 begin(p){
  const g=this.g;g.viewport(0,0,c3.width,c3.height);g.clearColor(...col(p.sky),1);g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);
  g.uniform3fv(this.loc.fog,new Float32Array(col(p.fog)));
 }
 draw(kind,x,y,z,sx,sy,sz,tint,r=0){
  const g=this.g,v=this.geo[kind];g.bindBuffer(g.ARRAY_BUFFER,v.buffer);
  g.enableVertexAttribArray(this.attr.p);g.enableVertexAttribArray(this.attr.n);
  g.vertexAttribPointer(this.attr.p,3,g.FLOAT,false,24,0);g.vertexAttribPointer(this.attr.n,3,g.FLOAT,false,24,12);
  g.uniformMatrix4fv(this.loc.m,false,new Float32Array(matrix(x,y,z,sx,sy,sz,r)));
  g.uniform3fv(this.loc.color,new Float32Array(col(tint)));g.drawArrays(g.TRIANGLES,0,v.count);
 }
}
function getScene(){
 if(glscene)return glscene;if(glFailed)return null;
 try{glscene=new Scene();return glscene}catch(e){glFailed=true;$("n4NoWebGL").hidden=false;status("Este navegador não iniciou WebGL. O jogo Pixel Invaders continua disponível.");return null}
}
function draw3D(){
 const s=getScene();if(!s)return;
 const p=pal(),time=game?.clock||0,lane=game?.lane??1,gate=game?.gate??-13;
 const eco=quality()==="economy"||(quality()==="auto"&&economy),N=eco?6:14;
 const d=(...a)=>s.draw(...a);
 s.begin(p);
 d("cube",0,-.75,-6,8,.7,39,p.ground);d("cube",0,-.31,-6,7,.19,39,p.road);
 for(const n of [-1,1]){
  d("cube",n*1.08,-.2,-6,.05,.05,37,p.edge);
  d("cube",n*3.52,-.13,-6,.14,.12,39,p.gem);
 }
 for(let i=0;i<N;i++)for(const side of [-1,1]){
  const x=side*(4.85+(i%3)*.45),z=5-i*3.1,h=1.1+(i%4)*.4;
  d("cube",x,-.06,z,1.5,.55,1.5,p.ground);
  d("cube",x,.25+h/2,z,.75,h,.75,p.tower);
  d("pyramid",x,h+.67,z,1.35,1.1,1.35,p.gem);
  if(!eco&&i%3===0)d("oct",x+.55,h+1.7,z,.6,.75,.6,p.edge,time*.5);
 }
 for(let i=0;i<6;i++)d("pyramid",(i-2.5)*4,1.7,-20-i*3,4,6,4,i%2?p.ground:p.tower);
 d("oct",0,7.0,-28,5,5,5,p.gem,time*.03);
 for(let i=0;i<3;i++){
  const x=(i-1)*2.2;
  d("cube",x-.69,1.25,gate,.26,2.8,.4,p.tower);
  d("cube",x+.69,1.25,gate,.26,2.8,.4,p.tower);
  d("cube",x,2.70,gate,1.66,.32,.55,p.edge);
  d("oct",x,3.27,gate,.52,.71,.52,p.gem,time*.4);
  d("cube",x,-.10,gate,1.45,.11,.8,p.edge);
 }
 const x=(lane-1)*2.2,b=reduced()?0:Math.sin(time*7)*.06;
 d("cube",x,-.19,2.2,1.4,.05,1.3,"#0b2038");
 d("cube",x,.66+b,2.1,.80,1.02,.65,"#e7f9ff");
 d("cube",x,1.39+b,2.15,.9,.75,.75,"#7ddde9");
 d("cube",x-.2,1.45+b,2.55,.15,.13,.06,"#1a3a59");
 d("cube",x+.2,1.45+b,2.55,.15,.13,.06,"#1a3a59");
 d("cube",x-.52,.8+b,2.1,.22,.75,.3,p.gem);
 d("cube",x+.52,.8+b,2.1,.22,.75,.3,p.gem);
 d("cube",x-.22,.02,2.1,.22,.5,.3,"#abc6ff");
 d("cube",x+.22,.02,2.1,.22,.5,.3,"#abc6ff");
 d("oct",x,1.95+b,2.1,.3,.33,.3,p.edge,time);
}
class Runner{
 constructor(items){this.items=items;this.index=0;this.score=0;this.lane=1;this.gate=-23;this.delay=0;this.clock=0;this.running=true;this.paused=false}
 resetWave(){this.gate=-23;mark(this.lane)}
 pick(i){this.lane=clamp(i,0,2);mark(this.lane)}
 step(dt){
  this.clock+=dt;
  if(this.delay>0){this.delay-=dt;if(this.delay<=0)next();return}
  this.gate+=dt*(reduced()?2.9:3.9)*adaptive();
  if(this.gate>=2.0)grade(this.lane);
 }
}
const pcolors=()=>{const t=engine()?.themeFor($("n4Subject").value);
 return t==="forest"?{bg:"#091e29",star:"#beeea0",ship:"#adfc85",foe:"#8affdb",shot:"#fff6b9"}:t==="sunset"?{bg:"#2a173c",star:"#f0a3dc",ship:"#ffa0d9",foe:"#ffe27d",shot:"#fff6d5"}:{bg:"#11142f",star:"#b5baff",ship:"#43dfe9",foe:"#eb9cfc",shot:"#fff3a5"};
};
function sprite(ctx,x,y,z,color,ship=false){
 const rows=ship?["000010000","000111000","001111100","011111110","111111111","111101111","110000011","100000001"]:
 ["001111100","011111110","111111111","110110011","111111111","011001110","101001101","010000010"];
 ctx.fillStyle=color;rows.forEach((row,j)=>{for(let i=0;i<row.length;i++)if(row[i]==="1")ctx.fillRect(Math.round(x+(i-4)*z),Math.round(y+j*z),z,z)});
}
function drawPixel(){
 const ctx=cp.getContext("2d");if(!ctx)return;
 ctx.imageSmoothingEnabled=false;
 const c=pcolors(),time=game?.clock||0,low=quality()==="economy"||(quality()==="auto"&&economy);
 ctx.fillStyle=c.bg;ctx.fillRect(0,0,320,180);
 for(let i=0;i<(low?50:110);i++){
  ctx.fillStyle=i%3?"#7581b2":c.star;
  const x=(i*97+23)%320,y=((i*53+17+(reduced()?0:time*(1+i%3)*5))%178)|0;
  ctx.fillRect(x,y,i%8?1:2,i%8?1:2);
 }
 ctx.fillStyle="#263265";ctx.fillRect(0,154,320,26);
 for(let x=0;x<320;x+=20){ctx.fillStyle="#42508b";ctx.fillRect(x,154,15,2)}
 const xs=[65,160,255];
 xs.forEach((x,i)=>{
  const bob=reduced()?0:Math.sin(time*3+i)*2;
  sprite(ctx,x,42+bob,3.5,c.foe);
  ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="bold 12px monospace";ctx.fillText("ABC"[i],x,34+bob);
  ctx.fillStyle="#52618f";ctx.fillRect(x-23,77,46,6);
 });
 const player=game?.player||160;sprite(ctx,player,124,3,c.ship,true);
 ctx.fillStyle="#ffbe6c";ctx.fillRect(player-5,147,4,5);ctx.fillRect(player+1,147,4,5);
 for(const b of game?.bullets||[]){ctx.fillStyle=c.shot;ctx.fillRect(Math.round(b.x)-1,Math.round(b.y),3,10)}
 ctx.font="bold 9px monospace";ctx.fillStyle="#fff";ctx.textAlign="left";ctx.fillText("NEO "+(game?.score||0)+" PTS",7,10);
 ctx.textAlign="right";ctx.fillText("WAVE "+Math.min(5,(game?.index||0)+1)+"/5",313,10);
 for(let y=4;y<180;y+=4){ctx.fillStyle="#03051d14";ctx.fillRect(0,y,320,1)}
}
class Pixel{
 constructor(items){this.items=items;this.index=0;this.score=0;this.player=160;this.bullets=[];this.clock=0;this.delay=0;this.cooldown=0;this.running=true;this.paused=false}
 resetWave(){this.bullets=[];mark()}
 pick(i){this.player=[65,160,255][clamp(i,0,2)];mark(i)}
 fire(){if(this.cooldown||this.delay>0||this.bullets.length>=2)return;this.cooldown=.30;this.bullets.push({x:this.player,y:120})}
 step(dt){
  this.clock+=dt;this.cooldown=Math.max(0,this.cooldown-dt);
  if(this.delay>0){this.delay-=dt;if(this.delay<=0)next();return}
  if(keys.left)this.player-=155*dt;if(keys.right)this.player+=155*dt;
  this.player=clamp(this.player,15,305);if(keys.fire)this.fire();
  this.bullets.forEach(b=>b.y-=250*dt);
  for(const b of [...this.bullets])if(b.y<70){
   this.bullets.splice(this.bullets.indexOf(b),1);
   const i=[65,160,255].findIndex(x=>Math.abs(b.x-x)<29);
   if(i!==-1){grade(i);this.bullets=[];return}
  }
  this.bullets=this.bullets.filter(b=>b.y>0);
 }
}
function draw(){if(mode==="three")draw3D();else drawPixel()}
function switchMode(nextMode){
 if(!["three","pixel"].includes(nextMode))return;
 stopLoop();mode=nextMode;game=null;keys={left:false,right:false,fire:false};
 $("n4ThreeWrap").hidden=mode!=="three";$("n4PixelWrap").hidden=mode!=="pixel";$("n4Fire").hidden=mode!=="pixel";
 root.querySelectorAll("[data-mode]").forEach(b=>{b.classList.toggle("selected",b.dataset.mode===mode);b.setAttribute("aria-pressed",String(b.dataset.mode===mode))});
 $("n4GameTitle").textContent=mode==="three"?"🌌 Guardião dos Portais 3D":"🕹️ Pixel Invaders do Saber";
 $("n4GameSub").textContent=mode==="three"?"WebGL 3D • portais e três pistas":"Arte pixelada 8-bit • naves e lasers";
 $("n4Start").textContent="▶ Jogar";$("n4Pause").disabled=true;$("n4Level").textContent="Fase 1/5";$("n4Score").textContent="⭐ 0 pontos";
 $("n4Question").textContent="Escolha uma matéria e clique em Jogar.";answers.replaceChildren();
 status(mode==="three"?"Use ◀ ▶ para escolher a pista do portal certo.":"Use ◀ ▶ para mover a nave e Espaço/ATIRAR para responder.");
 root.style.setProperty("--n4-accent",pal().edge);draw();
}
function input(type,pressed){
 if(mode==="three"){
  if(pressed&&game?.running&&!game.paused&&game.delay<=0){
   if(type==="left")game.pick(game.lane-1);
   if(type==="right")game.pick(game.lane+1);
  }
 }else{
  keys[type]=pressed;
  if(pressed&&type==="fire"&&game?.running&&!game.paused)game.fire();
 }
}
function keydown(e){
 if(!root.classList.contains("active")||!game?.running||game.paused)return;
 if(document.activeElement?.matches?.("input,select,textarea,[contenteditable]"))return;
 const key=e.key.toLowerCase();
 if(["arrowleft","arrowright"," ","enter","a","d"].includes(key))e.preventDefault();
 if((key==="arrowleft"||key==="a")&&!e.repeat)input("left",true);
 if((key==="arrowright"||key==="d")&&!e.repeat)input("right",true);
 if((key===" "||key==="enter")&&!e.repeat)input("fire",true);
 if(["1","2","3"].includes(key))game.pick(Number(key)-1);
}
function keyup(e){const k=e.key.toLowerCase();if(["arrowleft","a"].includes(k))input("left",false);if(["arrowright","d"].includes(k))input("right",false);if([" ","enter"].includes(k))input("fire",false)}
document.addEventListener("keydown",keydown);document.addEventListener("keyup",keyup);
for(const [id,dir] of [["n4Left","left"],["n4Right","right"],["n4Fire","fire"]]){
 const b=$(id);b.addEventListener("pointerdown",e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){}input(dir,true)});
 for(const event of ["pointerup","pointercancel","lostpointercapture","pointerleave"])b.addEventListener(event,()=>input(dir,false));
}
root.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>switchMode(b.dataset.mode)));
$("n4Start").addEventListener("click",begin);
$("n4Pause").addEventListener("click",()=>pause());
$("n4Classic").addEventListener("click",()=>{if(typeof showView==="function")showView("arcadeNeo")});
$("n4Hint").addEventListener("click",()=>{
 const q=currentQuestion();
 const subject=$("n4Subject").value;
 const hint=/matemát/i.test(subject)?"Procure a operação, teste os valores e confira a unidade.":/português|língua|gramát/i.test(subject)?"Observe o sentido da frase, os conectivos e a função das palavras.":/ciênc/i.test(subject)?"Relacione cada conceito à sua função e elimine alternativas incompatíveis.":"Encontre as palavras-chave e elimine as opções que contradizem o enunciado.";
 status(q?"💡 "+hint:"Inicie uma partida para receber orientações.");
});
$("n4Subject").addEventListener("change",()=>{if(game?.running)pause(true);root.style.setProperty("--n4-accent",pal().edge);draw();status("Matéria alterada. Reinicie a partida para usar as perguntas desta matéria.")});
document.addEventListener("neo4:config",()=>{root.style.setProperty("--n4-accent",pal().edge);if(!raf)draw();if(game)hud()});
document.addEventListener("portal8:viewchange",e=>{if(e.detail?.id!=="neoGames40"){if(game?.running)pause(true);stopLoop();keys={left:false,right:false,fire:false}}else{draw();if(game?.running&&!game.paused)loop()}});
document.addEventListener("visibilitychange",()=>{if(document.hidden){if(game?.running)pause(true);stopLoop();keys={left:false,right:false,fire:false}}});
cp.addEventListener("pointerdown",e=>{if(mode!=="pixel"||!game?.running||game.paused)return;const rect=cp.getBoundingClientRect();game.player=clamp((e.clientX-rect.left)*320/rect.width,15,305);game.fire()});
c3.addEventListener("pointerdown",e=>{if(mode!=="three"||!game?.running||game.paused)return;const rect=c3.getBoundingClientRect();game.pick(Math.floor(clamp((e.clientX-rect.left)/rect.width,0,.999)*3))});
c3.addEventListener("webglcontextlost",e=>{e.preventDefault();if(game?.running)pause(true);stopLoop();glscene=null;glFailed=true;$("n4NoWebGL").hidden=false;status("A conexão com o renderizador 3D foi interrompida. Experimente o arcade pixelado.")});
switchMode("three");
window.neoGames40={switchMode,stop:()=>{if(game?.running)pause(true);stopLoop()}};
})();