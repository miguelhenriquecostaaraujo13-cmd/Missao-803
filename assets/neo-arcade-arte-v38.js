/* Arcade Neo • Arte 2D experimental v38
 * Personagens, cenários e objetos originais desenhados por canvas.
 * Renderização local. Não altera colisões, respostas, notas nem contas.
 */
(() => {
"use strict";
const W=900,H=500;
const $=id=>document.getElementById(id);
const PI=Math.PI;
const reduced=()=>!!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
const tt=()=>reduced()?0:performance.now()/1000;
function rect(c,x,y,w,h,fill,r=0,stroke=null,line=1){
 c.beginPath();if(r)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);
 c.fillStyle=fill;c.fill();
 if(stroke){c.lineWidth=line;c.strokeStyle=stroke;c.stroke()}
}
function circle(c,x,y,r,fill,stroke=null,line=1){
 c.beginPath();c.arc(x,y,r,0,2*PI);c.fillStyle=fill;c.fill();
 if(stroke){c.lineWidth=line;c.strokeStyle=stroke;c.stroke()}
}
function line(c,x,y,X,Y,color,width=2){
 c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.lineWidth=width;c.strokeStyle=color;c.lineCap="round";c.stroke()
}
function polygon(c,points,fill,stroke=null,lw=1){
 c.beginPath();c.moveTo(...points[0]);for(const point of points.slice(1))c.lineTo(...point);c.closePath();
 c.fillStyle=fill;c.fill();if(stroke){c.lineWidth=lw;c.strokeStyle=stroke;c.stroke()}
}
function label(c,str,x,y,size=16,color="#fff",weight=800,align="center"){
 c.font=weight+" "+size+"px system-ui,Arial";c.fillStyle=color;c.textAlign=align;c.textBaseline="middle";c.fillText(String(str),x,y);
}
function gradient(c,top,bottom){
 const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,top);g.addColorStop(1,bottom);c.fillStyle=g;c.fillRect(0,0,W,H);
}
function hud(c,name,score,lives,progress){
 rect(c,14,14,872,62,"#09283dcf",16,"#ffffff25",2);
 label(c,name,32,43,19,"#fff",900,"left");
 label(c,"★ "+score,526,43,20,"#ffe28d",900);
 label(c,"♥ "+Math.max(0,lives),665,43,20,"#ff9db2",900);
 label(c,progress,815,43,18,"#b6f7ec",900);
}
function banner(c,s,color="#e7f9ff"){
 rect(c,220,82,460,42,color,14,"#ffffffaa",1.5);
 label(c,s,450,103,16,"#174663",850);
}
function cloud(c,x,y,z=1){
 c.save();c.translate(x,y);c.scale(z,z);
 rect(c,-45,-5,94,23,"#ffffffb8",14);
 circle(c,-22,-12,17,"#ffffffb8");circle(c,7,-20,23,"#ffffffb8");circle(c,32,-12,15,"#ffffffb8");
 c.restore();
}
function star(c,x,y,r=8,color="#ffe4a0"){
 const points=[];for(let i=0;i<10;i++){const a=i*PI/5-PI/2;const rr=i%2?r*.45:r;points.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr])}
 polygon(c,points,color);
}
function mountain(c,offset,ground,fill){
 const points=[[0,H],[0,ground-15]];
 for(let x=0;x<=W+100;x+=95){points.push([x,ground-35-Math.sin(x*.012+offset)*34],[x+52,ground-10-Math.cos(x*.009+offset)*20])}
 points.push([W,H]);polygon(c,points,fill);
}
function sceneryMath(c){
 gradient(c,"#247eae","#8fe0db");
 circle(c,760,153,58,"#ffe5a0");
 cloud(c,155+(Math.sin(tt()*.15)*10),163,.9);cloud(c,505,185,.65);
 mountain(c,0,410,"#5db4bb");mountain(c,2,448,"#398c9f");
 rect(c,0,447,W,53,"#1e6375");
 for(let x=18;x<W;x+=52){star(c,x,453+(x%3)*6,4,"#b7eabb")}
}
function platform(c,p){
 rect(c,p.x,p.y+7,p.w,p.h+7,"#4d6481",7);
 rect(c,p.x,p.y,p.w,12,"#84e0ac",5,"#e5ffe7",1);
 rect(c,p.x,p.y+11,p.w,p.h-4,"#628399",3);
 for(let x=p.x+19;x<p.x+p.w-10;x+=41){
  rect(c,x,p.y+16,19,8,"#94b7c1",2);
  circle(c,x+4,p.y+31,2,"#e8f6ee");
 }
}
function runner(c,x,y,vx=0,jumping=false,flash=false){
 // (x,y) is top-left of the physical collider: 29×36.
 const step=reduced()?0:Math.sin(tt()*17)*Math.min(3.8,Math.abs(vx)/60);
 const bob=jumping?0:Math.sin(tt()*12)*Math.min(1.8,Math.abs(vx)/100);
 c.save();c.translate(x+14.5,y+bob);
 c.fillStyle="#102b43a1";c.beginPath();c.ellipse(0,39,17,5,0,0,2*PI);c.fill();
 // Legs and shoes
 line(c,-5,25,-6+step,34,"#203c67",7);line(c,6,25,6-step,34,"#203c67",7);
 rect(c,-14+step,30,12,7,"#162947",3);rect(c,1-step,30,12,7,"#162947",3);
 // Backpack, arms, jumper
 rect(c,-15,0,9,25,"#f7a85a",5);
 line(c,-10,6,-13-step*.7,19,"#f4c198",6);line(c,11,6,13+step*.7,19,"#f4c198",6);
 rect(c,-10,-1,20,29,flash?"#f5b8d1":"#2262aa",7,"#142d59",2);
 rect(c,-10,9,20,5,"#fbd87d",2);
 rect(c,-6,12,12,6,"#b6eaf2",2);
 // Head with cap and bright face
 rect(c,-11,-22,22,22,"#f9cd9c",7,"#74435d",1);
 rect(c,-12,-26,24,9,"#173d73",4);
 rect(c,-1,-19,19,4,"#307fb5",2);
 circle(c,-5,-11,1.6,"#273754");circle(c,5,-11,1.6,"#273754");
 line(c,-4,-5,4,-5,"#a45f5f",1.7);
 c.restore();
}
function fractionCard(c,o,correct,now){
 const bob=reduced()?0:Math.sin(now*3+o.x*.03)*3;
 const y=o.y+bob;
 c.save();c.translate(o.x,y);
 rect(c,-27,-25,54,51,correct?"#fff5be":"#e7f7ff",11,correct?"#ffc96b":"#a3d4e5",3);
 rect(c,-23,-22,46,8,correct?"#fac769":"#7ec3dd",5);
 star(c,0,-16,5,correct?"#fff":"#e5f8ff");
 label(c,o.label,0,8,18,"#173b5b",950);
 c.restore();
}
function drawFractions(c,g){
 const now=tt();sceneryMath(c);
 for(const p of g.platforms)platform(c,p);
 for(const o of g.orbs)if(!o.used)fractionCard(c,o,false,now);
 if(g.inv<=0||Math.floor(g.inv*10)%2===0)runner(c,g.p.x,g.p.y,g.p.vx,g.p.vy<0,g.inv>0);
 hud(c,"🏃 Corrida das Frações",g.score,g.lives,g.done+"/"+g.goal);
 banner(c,"ENCONTRE UMA FRAÇÃO EQUIVALENTE A "+g.round.goal,"#fff1ca");
 drawEffects(c);
}
function cellScenery(c){
 gradient(c,"#17495d","#1b827c");
 // Cell membrane and organelles in the distant background
 c.save();c.translate(450,285);
 c.beginPath();c.ellipse(0,0,425,194,0,0,2*PI);c.fillStyle="#72d5ba25";c.fill();
 c.lineWidth=8;c.strokeStyle="#a5f3d0";c.stroke();
 c.beginPath();c.ellipse(0,0,410,182,0,0,2*PI);c.lineWidth=2;c.strokeStyle="#d4ffe277";c.stroke();
 c.restore();
 for(let i=0;i<24;i++){
  const x=75+(i*137)%750,y=121+(i*79)%333;
  if(Math.hypot(x-450,(y-285)*1.6)<355){
   rect(c,x,y,6,3,i%2?"#d4fff555":"#c3f7ff33",2);
  }
 }
}
function wall(c,p){
 rect(c,p.x+5,p.y+4,p.w,p.h,"#0d4050",10);
 rect(c,p.x,p.y,p.w,p.h,"#206c75",10,"#7be4d4",2);
 for(let y=p.y+15;y<p.y+p.h-10;y+=24){
  rect(c,p.x+7,y,p.w-14,3,"#8bdcd077",2);
 }
}
function scientist(c,x,y,carrying=false,inv=0){
 c.save();c.translate(x,y);
 if(inv>0&&Math.floor(inv*8)%2===1)c.globalAlpha=.48;
 const step=reduced()?0:Math.sin(tt()*12)*2;
 // body with coat and small boots
 rect(c,-10,8,8,13,"#21456c",3);rect(c,2,8,8,13,"#21456c",3);
 rect(c,-15,-2,30,25,"#eefaff",10,"#2f6b91",2);
 rect(c,-7,4,14,16,"#57bad0",4);
 rect(c,-17,-3,8,16,"#eaf7fc",4);rect(c,9,-3,8,16,"#eaf7fc",4);
 rect(c,-12,-24,24,25,"#f5d2ad",9,"#254a67",1);
 rect(c,-15,-27,30,10,"#394f89",6);
 circle(c,-5,-14,2,"#243e5b");circle(c,5,-14,2,"#243e5b");
 line(c,-5,-7,5,-7,"#8e5e6a",2);
 if(carrying){rect(c,-8,-35,16,12,"#f4d98c",4,"#735e2e",2)}
 c.restore();
}
function mitochondrion(c,x,y){
 c.save();c.translate(x,y);c.rotate(-.4);
 c.beginPath();c.ellipse(0,0,22,14,0,0,2*PI);c.fillStyle="#f7af83";c.fill();c.lineWidth=3;c.strokeStyle="#ffdfb2";c.stroke();
 c.beginPath();c.moveTo(-14,0);c.bezierCurveTo(-6,-17,-2,14,7,0);c.bezierCurveTo(12,-12,17,8,18,1);
 c.strokeStyle="#9e5d5b";c.lineWidth=3;c.stroke();
 c.restore();
}
function ribosome(c,x,y){
 for(let i=0;i<6;i++){const ang=2*PI*i/6;
  rect(c,x+Math.cos(ang)*13-7,y+Math.sin(ang)*9-6,15,12,"#a78cdd",6,"#ece5ff",1);
 }
 rect(c,x-8,y-7,16,14,"#7555af",6);
}
function nucleus(c,x,y){
 circle(c,x,y,23,"#a9c9f4","#f2edff",3);
 circle(c,x,y,12,"#8f77d1","#645aa9",2);
 circle(c,x+5,y-3,5,"#f6df9f");
 for(let i=0;i<5;i++)circle(c,x-14+i*7,y+(i%2?12:-9),2,"#dff7ff");
}
function virus(c,x,y){
 c.save();c.translate(x,y);c.rotate(tt()*.6);
 for(let i=0;i<9;i++){
  const a=i*2*PI/9;line(c,Math.cos(a)*11,Math.sin(a)*11,Math.cos(a)*21,Math.sin(a)*21,"#fb8ca2",4);
  circle(c,Math.cos(a)*22,Math.sin(a)*22,3.5,"#ffc0d2");
 }
 circle(c,0,0,13,"#d95e83","#ffa7bf",2);
 circle(c,-4,-2,2,"#502c64");circle(c,5,-2,2,"#502c64");
 c.restore();
}
function station(c,s){
 rect(c,684,s.y-43,175,85,"#d4f4f5",13,"#8de3d9",3);
 rect(c,694,s.y-34,155,68,s.color,12,"#ecfffb",2);
 const icon=s.role==="ENERGIA"?"⚡":s.role==="PROTEÍNAS"?"✦":"⌘";
 label(c,icon,770,s.y-10,26,"#23465c",850);
 label(c,s.role,770,s.y+17,17,"#1a4560",900);
}
function drawCell(c,g){
 cellScenery(c);
 for(const s of g.stations)station(c,s);
 for(const w of g.walls)wall(c,w);
 for(const v of g.viruses)virus(c,v.x,v.y);
 for(const item of g.items){
  if(item.done||item.taken)continue;
  if(item.name==="Mitocôndria")mitochondrion(c,item.x,item.y);
  else if(item.name==="Ribossomo")ribosome(c,item.x,item.y);
  else nucleus(c,item.x,item.y);
  label(c,item.name,item.x,item.y-35,14,"#fff",800);
 }
 scientist(c,g.p.x,g.p.y,!!g.carry,g.inv);
 if(g.carry){
  rect(c,g.p.x-70,g.p.y-55,140,24,"#fff5cb",8);
  label(c,"📦 "+g.carry.name,g.p.x,g.p.y-43,13,"#164459",850);
 }
 hud(c,"🧬 Missão Célula",g.score,g.lives,g.delivered+"/"+g.goal);
 banner(c,"ENTREGUE CADA ORGANELA NO SETOR CERTO");
 drawEffects(c);
}
function languageScene(c){
 gradient(c,"#242351","#4f3287");
 // Ceiling lights and stage backdrop
 for(let i=0;i<7;i++){star(c,60+i*125,107+(i%3)*11,3,"#faf0d0a0")}
 for(let i=0;i<3;i++){
  const x=166+i*195;
  rect(c,x,115,183,354,i===1?"#483b86":"#403378",13,"#9a91d47a",3);
  for(let y=150;y<435;y+=65)rect(c,x+85,y,14,28,"#ffffff35",4);
  rect(c,x+4,409,175,8,"#bbadf37a",4);
 }
 rect(c,149,452,608,18,"#1d1b47",8);
 for(let i=0;i<3;i++)rect(c,167+i*195,468,183,5,"#bcb5ef77",3);
}
function wordTile(c,o,target){
 const x=255+o.lane*195,y=o.y;
 c.save();c.translate(x,y);
 const good=o.category===target;
 rect(c,-76,-23,152,48,good?"#d0ffe2":"#ffe9bc",9,good?"#69c59d":"#dcaa77",2);
 rect(c,-72,-19,7,40,good?"#39a87b":"#e7b65f",4);
 label(c,o.word,6,2,18,"#233954",850);
 c.restore();
}
function trackHero(c,lane){
 const x=255+lane*195,y=420;
 c.save();c.translate(x,y);
 // A little skateboard-riding human runner rather than a circular token.
 rect(c,-33,20,66,9,"#70c7df",5,"#dcf7ff",2);
 circle(c,-21,30,6,"#242344","#b5ddeb",2);circle(c,21,30,6,"#242344","#b5ddeb",2);
 rect(c,-6,-9,12,26,"#273a8c",4);
 rect(c,-18,-14,36,19,"#e9a85b",9,"#ffdbac",2);
 line(c,-15,-6,-24,4,"#eecfa8",5);line(c,15,-6,24,4,"#eecfa8",5);
 rect(c,-13,-40,26,25,"#f3c9a8",9);
 rect(c,-16,-45,31,12,"#2764a0",7);
 rect(c,-17,-38,35,5,"#19427d",4);
 circle(c,-5,-29,2,"#273756");circle(c,6,-29,2,"#273756");
 line(c,-5,-23,6,-23,"#a57573",2);
 c.restore();
}
function drawWords(c,g){
 languageScene(c);
 for(const item of g.falling)wordTile(c,item,g.target.name);
 trackHero(c,g.lane);
 hud(c,"📝 Ritmo dos Conectivos",g.score,g.lives,g.caught+"/"+g.goal);
 banner(c,"COLETE PALAVRAS DE "+g.target.name,"#f5edff");
 label(c,"← ESCOLHA UMA PISTA →",450,489,15,"#f9eeff",800);
 drawEffects(c);
}
const effects=[];
function pop(x,y,color="#ffdf8d",msg="+10"){
 if(reduced())return;
 const now=performance.now();
 for(let i=0;i<9;i++){
  const a=i*PI*2/9;
  effects.push({x,y,vx:Math.cos(a)*60,vy:Math.sin(a)*65-28,born:now,color,msg:i===0?msg:""});
 }
 if(effects.length>100)effects.splice(0,effects.length-100);
}
function drawEffects(c){
 if(!effects.length||reduced())return;
 const now=performance.now();
 for(let i=effects.length-1;i>=0;i--){
  const e=effects[i],age=(now-e.born)/1000;
  if(age>.62){effects.splice(i,1);continue}
  c.save();c.globalAlpha=Math.max(0,1-age/.62);
  const x=e.x+e.vx*age,y=e.y+e.vy*age+45*age*age;
  star(c,x,y,6,e.color);
  if(e.msg)label(c,e.msg,x,y-17-age*16,17,"#fff",950);
  c.restore();
 }
}
function active(){return $("neoArcadeLook")?.value!=="classic"}
window.neoArcadeArt={isActive:active,drawFractions,drawCell,drawWords,pop};
})();