/* Arcade Educativo Neo v31 — três minijogos reais em canvas.
 * Matemática: plataforma física e coleta de frações.
 * Ciências: exploração e entrega de organelas num labirinto.
 * Português: arcade de reflexos em três pistas.
 * Sem API paga, sem rede, sem anúncios, sem placar público.
 */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const cv=$("neoArcadeCanvas"); // initialized after DOM ready
const W=900,H=500;
let canvas=null,ctx=null,active=null,paused=true,finished=false,raf=0,prev=0,seed=1;
const keys={left:false,right:false,up:false,down:false,jump:false};
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const rand=(a,b)=>a+Math.random()*(b-a);
const hit=(x,y,w,h,X,Y,R)=>X+R>x&&X-R<x+w&&Y+R>y&&Y-R<y+h;
const distance=(x,y,X,Y)=>Math.hypot(x-X,y-Y);
const PALETTE={blue:"#143d6a",sea:"#0c879e",cyan:"#95eefa",cream:"#fff8de",gold:"#ffce69",pink:"#f995a7",green:"#66d5ae",white:"#ffffff"};
const games={
 fractions:{name:"Corrida das Frações",tag:"Matemática • Plataforma",help:"Corra, pule entre plataformas e colete SOMENTE a fração equivalente ao alvo. Frações erradas tiram um coração. Meta: 6 acertos.",keys:"← → para andar • ↑ ou Espaço para pular"},
 cell:{name:"Missão Célula",tag:"Ciências • Exploração",help:"Explore a célula, desvie dos vírus e leve cada organela ao lugar correto do laboratório. Colete uma por vez. Entregue as três.",keys:"← → ↑ ↓ para se movimentar"},
 words:{name:"Ritmo dos Conectivos",tag:"Português • Reflexos",help:"Mude de pista para pegar conectivos que combinem com a missão (oposição, adição ou conclusão). Desvie dos outros! Faça 10 acertos.",keys:"← → para mudar de pista"}
};
let game=null;
const STAGES={
 explorador:{name:"Explorador",fractions:3,cell:2,words:6,lives:4,speed:.92},
 missao:{name:"Missão",fractions:6,cell:3,words:10,lives:3,speed:1},
 desafio:{name:"Desafio",fractions:9,cell:3,words:15,lives:3,speed:1.08}
};
const stage=()=>STAGES[$("neoArcadeChallenge")?.value]||STAGES.missao;
function updateMission(){
 const progress=$("neoArcadeProgress"),label=$("neoArcadeMissionProgress");
 if(!progress||!game||!active)return;
 const total=game.goal||1;
 const done=active==="fractions"?game.done:active==="cell"?game.delivered:game.caught;
 progress.max=total;progress.value=Math.min(total,done);
 const sentence=stage().name+" · "+Math.min(total,done)+"/"+total+" objetivos";
 if(label&&label.textContent!==sentence)label.textContent=sentence;
}
function pill(text,x,y,bg="#ffffff",color="#153c5f",font="bold 17px system-ui"){
 ctx.font=font;const width=Math.min(500,ctx.measureText(text).width+27);
 ctx.fillStyle=bg;round(x-width/2,y-16,width,33,13);ctx.fill();
 ctx.fillStyle=color;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(text,x,y+1);
}
function round(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function text(str,x,y,size=20,color="#fff",weight=800,align="left"){
 ctx.fillStyle=color;ctx.font=weight+" "+size+"px system-ui";ctx.textAlign=align;ctx.textBaseline="middle";ctx.fillText(str,x,y);
}
function bg(top="#082d56",bottom="#105c88"){
 const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,top);grad.addColorStop(1,bottom);
 ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
 for(let i=0;i<16;i++){ctx.fillStyle="rgba(255,255,255,.065)";ctx.beginPath();ctx.arc((i*137+59)%W,(i*81+45)%H,(i%4)*14+6,0,Math.PI*2);ctx.fill()}
}
function avatar(x,y,size=18,color="#ffd77d"){
 ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#184a75";ctx.beginPath();ctx.arc(x-6,y-4,2.6,0,Math.PI*2);ctx.arc(x+6,y-4,2.6,0,Math.PI*2);ctx.fill();
 ctx.beginPath();ctx.arc(x,y+3,7,0,Math.PI);ctx.strokeStyle="#184a75";ctx.lineWidth=2.3;ctx.stroke();
}
function hud(title,score,lives,level){
 ctx.fillStyle="#062849df";round(15,13,870,57,13);ctx.fill();
 text(title,31,40,19,PALETTE.white);
 text("⭐ "+score,535,40,18,PALETTE.gold);
 text("❤ "+Math.max(0,lives),659,40,18,PALETTE.pink);
 text(level,778,40,15,PALETTE.cyan);
}
function status(msg){
 const status=$("neoArcadeStatus");if(status)status.textContent=msg;
}
function setActive(name){
 if(!games[name])return;
 active=name;game=create(name);paused=false;finished=false;clearKeys();prev=0;
 const stageInfo=stage();
 window.neoGameBrain?.start(name);
 $("neoArcadePause").textContent="⏸ Pausar";
 $("neoArcadeTitle").textContent=games[name].name;
 $("neoArcadeInstructions").textContent=games[name].help+" "+games[name].keys+" · Fase "+stageInfo.name+"."; 
 updateMission();
 try{$("neoArcadeBest").textContent="Seu recorde nesta fase: "+(Number(localStorage.getItem("neo-arcade-best-v2-"+name+"-"+$("neoArcadeChallenge").value))||0)+" pontos"}catch(_){} 
 document.querySelectorAll("[data-neo-game]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.neoGame===name)));
 status("Jogo iniciado! Use os controles do teclado ou os botões na tela.");
 $("neoArcadeCanvas").focus({preventScroll:true});
 if(!raf)raf=requestAnimationFrame(frame);
}
function clearKeys(){Object.keys(keys).forEach(x=>keys[x]=false)}
function create(name){
 if(name==="fractions")return new Fractions();
 if(name==="cell")return new Cell();
 return new Words();
}
function saveBest(){
 try{
  const key="neo-arcade-best-v2-"+active+"-"+($("neoArcadeChallenge")?.value||"missao");const best=Number(localStorage.getItem(key))||0;
  if(game.score>best)localStorage.setItem(key,String(game.score));
  const el=$("neoArcadeBest");el.textContent="Recorde neste aparelho: "+Math.max(best,game.score)+" pontos";
 }catch(_){}
}
function end(won,message){
 if(finished)return;
 paused=true;finished=true;clearKeys();
 if(won)game.score+=20;
 saveBest();updateMission();
 status((won?"🏆 Vitória! ":"Fim de partida. ")+message+" Você pode jogar novamente.");
 $("neoArcadePause").textContent="▶ Jogar novamente";
}
function frame(t){
 raf=0;
 if(!active||!document.getElementById("arcadeNeo")?.classList.contains("active")){
  if(active&&!paused){paused=true;clearKeys();status("Jogo pausado ao sair da ferramenta.")}
  draw();
  return;
 }
 const dt=prev?Math.min(.035,(t-prev)/1000):0;prev=t;
 if(!paused&&!finished){game.update(dt); }
 updateMission();draw();
 if(!paused&&!finished)raf=requestAnimationFrame(frame);
}
function draw(){
 if(!ctx)return;
 if(!game){bg();text("🎮 Escolha um jogo acima para começar",450,240,25,"#ffffff",800,"center");return}
 game.draw();
 if(paused||finished){
  ctx.fillStyle="#042847ad";ctx.fillRect(0,0,W,H);
  ctx.fillStyle="#fff";round(225,178,450,143,22);ctx.fill();
  text(finished?(game.won?"🏆 Missão cumprida!":"🎮 Tente outra vez"):"⏸ Jogo pausado",450,222,27,"#12456d",900,"center");
  text(finished?"Clique em Jogar novamente":"Clique em Continuar",450,267,17,"#426579",700,"center");
 }
}
class Fractions{
 constructor(){
  this.goal=stage().fractions;this.score=0;this.lives=stage().lives;this.won=false;this.done=0;this.inv=0;this.p={x:65,y:404,vx:0,vy:0,w:29,h:36};
  this.platforms=[{x:0,y:449,w:900,h:51},{x:91,y:351,w:181,h:20},{x:351,y:282,w:205,h:20},{x:634,y:351,w:178,h:20}];
  this.spots=[{x:171,y:318},{x:442,y:249},{x:717,y:318},{x:836,y:414}];this.next();
 }
 next(){
  const pool=[{goal:"1/2",right:["2/4","3/6","4/8"],bad:["1/3","2/3","1/4","3/4"]},
   {goal:"1/3",right:["2/6","3/9","4/12"],bad:["1/2","2/5","3/4","2/3"]},
   {goal:"2/3",right:["4/6","6/9","8/12"],bad:["3/5","2/4","1/3","3/4"]},
   {goal:"3/4",right:["6/8","9/12","12/16"],bad:["2/3","1/2","4/5","3/6"]},
   {goal:"2/5",right:["4/10","6/15","8/20"],bad:["3/5","1/2","4/8","2/3"]}];
  this.round=pool[(this.done+Math.floor(rand(0,pool.length)))%pool.length];
  const correct=this.round.right[Math.floor(rand(0,this.round.right.length))];
  const distract=this.round.bad.slice().sort(()=>Math.random()-.5).slice(0,3);
  const options=[{label:correct,correct:true},...distract.map(label=>({label,correct:false}))].sort(()=>Math.random()-.5);
  this.orbs=this.spots.map((p,i)=>({...p,...options[i],used:false}));
 }
 update(dt){
  if(this.inv>0)this.inv-=dt;
  const p=this.p;
  p.vx=(Number(keys.right)-Number(keys.left))*252;
  const grounded=this.platforms.some(q=>Math.abs(p.y+p.h-q.y)<3&&p.x+p.w>q.x&&p.x<q.x+q.w);
  if(keys.jump&&grounded){p.vy=-565*((window.neoGameBrain?.multiplier()||1)<1?1.08:1);keys.jump=false}
  const oldY=p.y,oldBottom=p.y+p.h;
  p.x=clamp(p.x+p.vx*dt,5,W-p.w-5);p.vy+=1450*dt;p.y+=p.vy*dt;
  for(const platform of this.platforms){
   if(p.vy>=0&&oldBottom<=platform.y+9&&p.y+p.h>=platform.y&&p.x+p.w>platform.x&&p.x<platform.x+platform.w){
    p.y=platform.y-p.h;p.vy=0;
   }
  }
  if(p.y>H){this.p.x=45;this.p.y=405;this.p.vy=0;this.lives--;this.inv=1;window.neoGameBrain?.miss();if(this.lives<=0)end(false,"Faltaram corações.");}
  for(const orb of this.orbs){
   if(orb.used||this.inv>0)continue;
   if(hit(p.x,p.y,p.w,p.h,orb.x,orb.y,21)){
    orb.used=true;this.inv=.42;
    if(orb.correct){
     this.done++;this.score+=10;window.neoGameBrain?.good();
     status("✅ Fração equivalente! "+this.done+" de "+this.goal+" acertos.");
     if(this.done>=this.goal){this.won=true;end(true,"Você dominou as equivalências de frações!");return}
     this.next();
    }else{this.lives--;window.neoGameBrain?.miss();status("Essa fração não é equivalente a "+this.round.goal+". Experimente outra.");
     if(this.lives<=0)end(false,"Revise equivalências e tente novamente.");
    }
   }
  }
 }
 draw(){
  bg("#06396e","#0c81aa");
  for(let i=0;i<9;i++){ctx.fillStyle="#a6e1f019";ctx.fillRect(i*125,110+(i%2)*15,90,400)}
  ctx.fillStyle="#bce2fa";for(const p of this.platforms){round(p.x,p.y,p.w,p.h,8);ctx.fill();ctx.fillStyle="#65caab";ctx.fillRect(p.x,p.y,p.w,5);ctx.fillStyle="#bce2fa";}
  for(const o of this.orbs){if(o.used)continue;ctx.fillStyle=o.correct?"#fff1a9":"#e5f7ff";ctx.beginPath();ctx.arc(o.x,o.y,23,0,7);ctx.fill();
   ctx.lineWidth=3;ctx.strokeStyle="#1790b3";ctx.stroke();text(o.label,o.x,o.y,16,"#163b60",900,"center");}
  if(this.inv<=0||Math.floor(this.inv*10)%2===0)avatar(this.p.x+15,this.p.y+15,18);
  hud("🏃 Corrida das Frações",this.score,this.lives,this.done+"/"+this.goal);
  pill("Colete uma fração equivalente a "+this.round.goal,450,103,"#fff8dd","#123c63");
 }
}
class Cell{
 constructor(){
  this.goal=stage().cell;this.score=0;this.lives=stage().lives;this.won=false;this.delivered=0;this.inv=0;this.p={x:80,y:267,r:17};this.carry=null;
  this.walls=[{x:285,y:124,w:35,h:255},{x:584,y:75,w:35,h:295}];
  this.items=[{name:"Mitocôndria",role:"ENERGIA",x:130,y:135,color:"#ffd175",taken:false,done:false},
   {name:"Ribossomo",role:"PROTEÍNAS",x:116,y:304,color:"#e2a9ff",taken:false,done:false},
   {name:"Núcleo",role:"COMANDO",x:392,y:430,color:"#a4edcb",taken:false,done:false}];
  this.stations=[{role:"ENERGIA",y:132,color:"#ffd175"},{role:"PROTEÍNAS",y:270,color:"#e2a9ff"},{role:"COMANDO",y:408,color:"#a4edcb"}];
  this.viruses=[{x:438,y:194,dy:120},{x:535,y:388,dy:-100}];
 }
 moveCollide(x,y){
  if(x<35||x>865||y<99||y>471)return true;
  return this.walls.some(w=>hit(w.x,w.y,w.w,w.h,x,y,17));
 }
 update(dt){
  this.inv=Math.max(0,this.inv-dt);
  let dx=Number(keys.right)-Number(keys.left),dy=Number(keys.down)-Number(keys.up);
  const mag=Math.hypot(dx,dy)||1;dx=dx/mag*215*dt;dy=dy/mag*215*dt;
  if(!this.moveCollide(this.p.x+dx,this.p.y))this.p.x+=dx;
  if(!this.moveCollide(this.p.x,this.p.y+dy))this.p.y+=dy;
  for(const v of this.viruses){
   v.y+=v.dy*dt*stage().speed*(window.neoGameBrain?.multiplier()||1);if(v.y<125||v.y>435)v.dy*=-1;
   if(this.inv<=0&&distance(v.x,v.y,this.p.x,this.p.y)<30){
    this.lives--;this.inv=1.4;window.neoGameBrain?.miss();status("⚠️ Vírus encontrado! Desvie e continue o transporte.");
    if(this.lives<=0){end(false,"Sua célula precisa de proteção.");return}
   }
  }
  if(!this.carry){
   for(const item of this.items)if(!item.done&&!item.taken&&distance(item.x,item.y,this.p.x,this.p.y)<35){
    this.carry=item;item.taken=true;status("📦 Pegou "+item.name+". Leve ao setor "+item.role+".");break;
   }
  }else{
   for(const station of this.stations)if(distance(770,station.y,this.p.x,this.p.y)<64){
    if(this.carry.role===station.role){
     this.carry.done=true;this.score+=20;this.delivered++;window.neoGameBrain?.good();
     status("✅ "+this.carry.name+" entregue! "+this.delivered+"/"+this.goal+". ");
     this.carry=null;
     if(this.delivered>=this.goal){this.won=true;end(true,"Você organizou a célula!");return}
    }else if(!this.hintCooldown||this.hintCooldown<=0){
     status("Este setor é "+station.role+". Sua organela pertence ao setor "+this.carry.role+".");this.hintCooldown=1.2;
    }
   }
  }
  this.hintCooldown=Math.max(0,(this.hintCooldown||0)-dt);
 }
 draw(){
  bg("#0c465c","#207b82");
  ctx.strokeStyle="#8bdfd3";ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(450,285,423,194,0,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle="#14536e";for(const w of this.walls){round(w.x,w.y,w.w,w.h,11);ctx.fill()}
  this.stations.forEach(s=>{ctx.fillStyle="#e8f9fb";round(684,s.y-43,173,86,16);ctx.fill();
   ctx.fillStyle=s.color;round(692,s.y-34,157,68,11);ctx.fill();text(s.role,770,s.y,17,"#163e55",900,"center")});
  for(const item of this.items){if(item.done)continue;
   if(!item.taken){ctx.fillStyle=item.color;ctx.beginPath();ctx.arc(item.x,item.y,23,0,7);ctx.fill();text(item.name,item.x,item.y-37,14,"#fff",800,"center");}
  }
  for(const v of this.viruses){ctx.fillStyle="#e988a8";ctx.beginPath();ctx.arc(v.x,v.y,19,0,7);ctx.fill();
   text("✦",v.x,v.y,25,"#793a59",800,"center");}
  if(this.inv<=0||Math.floor(this.inv*8)%2===0)avatar(this.p.x,this.p.y,17,this.carry?"#ffe19d":"#acf2ed");
  if(this.carry)pill("📦 "+this.carry.name,this.p.x,this.p.y-37,"#fffbef","#123c5a","bold 13px system-ui");
  hud("🧬 Missão Célula",this.score,this.lives,this.delivered+"/"+this.goal);
  pill("Leve cada organela ao setor de sua função",440,103,"#ffffff","#164a61","bold 14px system-ui");
 }
}
class Words{
 constructor(){
  this.goal=stage().words;this.score=0;this.lives=stage().lives;this.won=false;this.caught=0;this.lane=1;this.falling=[];this.clock=0;this.tick=0;this.prevL=false;this.prevR=false;
  this.categories=[
   {name:"OPOSIÇÃO",words:["mas","porém","contudo","entretanto"]},
   {name:"ADIÇÃO",words:["também","além disso","e","ainda"]},
   {name:"CONCLUSÃO",words:["portanto","logo","assim","por isso"]}
  ];
  this.target=this.categories[0];this.nextTarget();
 }
 nextTarget(){this.target=this.categories[Math.floor(this.caught/3)%this.categories.length]}
 spawn(){
  const category=Math.random()<.58?this.target:this.categories[Math.floor(rand(0,3))];
  const word=category.words[Math.floor(rand(0,category.words.length))];
  this.falling.push({lane:Math.floor(rand(0,3)),y:120,word,category:category.name,passed:false});
 }
 update(dt){
  if(keys.left&&!this.prevL){this.lane=clamp(this.lane-1,0,2)}
  if(keys.right&&!this.prevR){this.lane=clamp(this.lane+1,0,2)}
  this.prevL=keys.left;this.prevR=keys.right;
  this.clock+=dt;this.tick+=dt;
  if(this.clock>Math.max(.67,1.2-this.caught*.03)/(window.neoGameBrain?.multiplier()||1)){this.clock=0;this.spawn()}
  const speed=(135+Math.min(115,this.caught*9))*stage().speed*(window.neoGameBrain?.multiplier()||1);
  for(const o of this.falling){
   o.y+=dt*speed;
   if(!o.passed&&o.y>418){o.passed=true;
    if(o.lane===this.lane){
     if(o.category===this.target.name){
      this.score+=10;this.caught++;window.neoGameBrain?.good();status("✅ Boa combinação! "+this.caught+"/"+this.goal+" conectivos.");
      if(this.caught>=this.goal){this.won=true;end(true,"Você dominou os conectivos em movimento!");return}
      this.nextTarget();
     }else{this.lives--;window.neoGameBrain?.miss();status("O conectivo '"+o.word+"' não expressa "+this.target.name+".");
      if(this.lives<=0){end(false,"Continue treinando os tipos de conectivos.");return}}
    }else if(o.category===this.target.name&&this.caught>0){/* outros objetos não punem o jogador */ }
   }
  }
  this.falling=this.falling.filter(o=>o.y<490);
 }
 shift(dir){if(paused||finished)return;this.lane=clamp(this.lane+dir,0,2)}
 draw(){
  bg("#1b356c","#4d2785");
  for(let i=0;i<3;i++){const x=166+i*195;
   ctx.fillStyle=i%2?"#ffffff0d":"#ffffff19";round(x,108,183,372,18);ctx.fill();
   ctx.strokeStyle="#ffffff30";ctx.lineWidth=2;ctx.stroke();
  }
  for(const o of this.falling){const x=255+o.lane*195;pill(o.word,x,o.y,o.category===this.target.name?"#c6f4dd":"#fff0b8","#153d57","bold 19px system-ui")}
  ctx.fillStyle="#ffffff";round(215+this.lane*195,420,80,45,13);ctx.fill();
  avatar(255+this.lane*195,431,17,"#f8d28a");
  hud("📝 Ritmo dos Conectivos",this.score,this.lives,this.caught+"/"+this.goal);
  pill("Pegue apenas conectivos de "+this.target.name,450,102,"#fff","#133866","bold 18px system-ui");
  text("← Mude de pista →",450,484,16,"#f8f2ff",700,"center");
 }
}
function press(name,pressed){
 if(!active||paused||finished)return;
 if(name==="jump"){if(pressed)keys.jump=true;return}
 if(active==="words"&&pressed&&(name==="left"||name==="right")){
  game.shift(name==="left"?-1:1);draw();return;
 }
 if(name in keys)keys[name]=pressed;
}
function toggle(){
 if(!active){setActive("fractions");return}
 if(finished){setActive(active);return}
 paused=!paused;clearKeys();prev=0;
 $("neoArcadePause").textContent=paused?"▶ Continuar":"⏸ Pausar";
 status(paused?"Jogo pausado.":"Jogo retomado.");
 if(!paused&&!raf)raf=requestAnimationFrame(frame);else draw();
}
function init(){
 canvas=$("neoArcadeCanvas");if(!canvas)return;
 ctx=canvas.getContext("2d");if(!ctx){status("Este navegador não suporta o recurso de desenho necessário.");return}
 canvas.width=W;canvas.height=H;
 document.querySelectorAll("[data-neo-game]").forEach(b=>b.addEventListener("click",()=>setActive(b.dataset.neoGame)));
 $("neoArcadePause")?.addEventListener("click",toggle);
 $("neoArcadeRestart")?.addEventListener("click",()=>setActive(active||"fractions"));
 $("neoArcadeChallenge")?.addEventListener("change",()=>{if(active)setActive(active)});
 const map={ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right",ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down"," ":"jump"};
 document.addEventListener("keydown",e=>{
  if(!active||!$("arcadeNeo")?.classList.contains("active"))return;
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||""))return;
  if(e.key==="Escape"){if(!e.repeat)toggle();return}
  const key=map[e.key];if(!key)return;
  e.preventDefault();
  if(active==="words"&&e.repeat)return;
  if(active==="words"&&(key==="left"||key==="right")){if(!e.repeat)game.shift(key==="left"?-1:1);return}
  press(key,true);
 });
 document.addEventListener("keyup",e=>{const key=map[e.key];if(key&&active!=="words")keys[key]=false});
 document.querySelectorAll("[data-arcade-control]").forEach(b=>{
  const key=b.dataset.arcadeControl;
  b.addEventListener("pointerdown",e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){};press(key,true)});
  for(const event of ["pointerup","pointercancel","lostpointercapture","pointerleave"])b.addEventListener(event,()=>press(key,false));
 });
 document.addEventListener("portal8:viewchange",e=>{
  if(e.detail?.id!=="arcadeNeo"){if(active&&!paused){paused=true;clearKeys();$("neoArcadePause").textContent="▶ Continuar";status("Jogo pausado ao sair da ferramenta.");}if(raf){cancelAnimationFrame(raf);raf=0}}
  else{draw();if(active&&!paused&&!raf)raf=requestAnimationFrame(frame)}
 });
 document.addEventListener("visibilitychange",()=>{if(document.hidden&&active&&!paused){paused=true;clearKeys();if(raf)cancelAnimationFrame(raf);raf=0;$("neoArcadePause").textContent="▶ Continuar";status("Jogo pausado enquanto a página ficou em segundo plano.");draw()}});
 draw();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();