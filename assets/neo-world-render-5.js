/* Neo World v5 — fantasia 3D procedural. WebGL 1 sem dependências externas. */
(() => {
"use strict";
const PI=Math.PI, norm=v=>{let l=Math.hypot(...v)||1;return v.map(x=>x/l)};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const rgb=s=>[0,2,4].map(i=>parseInt(s.slice(i+1,i+3),16)/255);
const matrix=(x,y,z,sx,sy,sz,r=0)=>{let a=Math.cos(r),b=Math.sin(r);return [a*sx,0,-b*sx,0,0,sy,0,0,b*sz,0,a*sz,0,x,y,z,1]};
const perspective=(f,aspect,n,far)=>{let q=1/Math.tan(f/2);return [q/aspect,0,0,0,0,q,0,0,0,0,(far+n)/(n-far),-1,0,0,2*far*n/(n-far),0]};
function look(eye,at){
 let z=norm(eye.map((x,i)=>x-at[i])),x=norm(cross([0,1,0],z)),y=cross(z,x);
 const dot=v=>v.reduce((s,a,i)=>s+a*eye[i],0);
 return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x),-dot(y),-dot(z),1];
}
function meshes(){
 const m={},tri=(v,a,b,c)=>{
  let n=norm(cross(b.map((x,i)=>x-a[i]),c.map((x,i)=>x-a[i])));
  [a,b,c].forEach(p=>v.push(...p,...n));
 },quad=(v,a,b,c,d)=>{tri(v,a,b,c);tri(v,a,c,d)};
 let v=[],p=.5;
 quad(v,[-p,-p,p],[p,-p,p],[p,p,p],[-p,p,p]);
 quad(v,[p,-p,-p],[-p,-p,-p],[-p,p,-p],[p,p,-p]);
 quad(v,[p,-p,p],[p,-p,-p],[p,p,-p],[p,p,p]);
 quad(v,[-p,-p,-p],[-p,-p,p],[-p,p,p],[-p,p,-p]);
 quad(v,[-p,p,p],[p,p,p],[p,p,-p],[-p,p,-p]);
 quad(v,[-p,-p,-p],[p,-p,-p],[p,-p,p],[-p,-p,p]);
 m.box=v;
 v=[];
 let pt=(a,b)=>[.5*Math.sin(a)*Math.cos(b),.5*Math.cos(a),.5*Math.sin(a)*Math.sin(b)];
 for(let i=0;i<11;i++)for(let j=0;j<17;j++){
  let a=i*PI/11,b=(i+1)*PI/11,c=j*2*PI/17,d=(j+1)*2*PI/17;
  quad(v,pt(a,c),pt(b,c),pt(b,d),pt(a,d));
 }
 m.sphere=v;
 const cyl=(top,bottom)=>{
  const out=[],N=18;
  for(let i=0;i<N;i++){
   const a=i*2*PI/N,b=(i+1)*2*PI/N;
   const A=[Math.cos(a)*bottom,-.5,Math.sin(a)*bottom],B=[Math.cos(b)*bottom,-.5,Math.sin(b)*bottom],
    C=[Math.cos(b)*top,.5,Math.sin(b)*top],D=[Math.cos(a)*top,.5,Math.sin(a)*top];
   quad(out,A,B,C,D);
   if(top>0)tri(out,[0,.5,0],D,C);
   if(bottom>0)tri(out,[0,-.5,0],B,A);
  }return out;
 };
 m.cylinder=cyl(.5,.5);m.cone=cyl(0,.5);
 v=[];const point=(a,b)=>{let r=.40+.1*Math.cos(b);return [r*Math.cos(a),r*Math.sin(a),.1*Math.sin(b)]};
 for(let i=0;i<28;i++)for(let j=0;j<9;j++){
  let a=i*2*PI/28,b=(i+1)*2*PI/28,c=j*2*PI/9,d=(j+1)*2*PI/9;
  quad(v,point(a,c),point(b,c),point(b,d),point(a,d));
 }m.torus=v;return m;
}
class World{
 constructor(canvas){
  this.canvas=canvas;
  const g=canvas.getContext("webgl",{alpha:false,antialias:true})||canvas.getContext("experimental-webgl",{alpha:false,antialias:true});
  if(!g)throw Error("GPU WebGL indisponível");
  this.g=g;
  const vs="attribute vec3 aPos,aNormal; uniform mat4 uP,uV,uM; varying vec3 n,w; void main(){vec4 pos=uM*vec4(aPos,1.);w=pos.xyz;n=mat3(uM)*aNormal;gl_Position=uP*uV*pos;}";
  const fs="precision mediump float;varying vec3 n,w;uniform vec3 uColor,uFog;uniform float uGlow;void main(){vec3 nor=normalize(n);vec3 sun=normalize(vec3(-.42,.90,.58));float light=.58+.43*max(dot(nor,sun),0.);vec3 eye=normalize(vec3(0.,8.,17.)-w);float rim=pow(1.-max(dot(nor,eye),0.),2.5);float spec=pow(max(dot(reflect(-sun,nor),eye),0.),18.);vec3 c=uColor*(light+.19*rim)+vec3(.95,.86,.7)*spec*.14;c=mix(c,uColor*1.5,uGlow);float fog=clamp((length(w-vec3(0.,4.,15.))-17.)/44.,0.,.76);gl_FragColor=vec4(clamp(mix(c,uFog,fog),0.,1.),1.);}";
  const shader=(kind,source)=>{let s=g.createShader(kind);g.shaderSource(s,source);g.compileShader(s);if(!g.getShaderParameter(s,g.COMPILE_STATUS))throw Error(g.getShaderInfoLog(s));return s};
  let program=g.createProgram();g.attachShader(program,shader(g.VERTEX_SHADER,vs));g.attachShader(program,shader(g.FRAGMENT_SHADER,fs));g.linkProgram(program);
  if(!g.getProgramParameter(program,g.LINK_STATUS))throw Error(g.getProgramInfoLog(program));
  g.useProgram(program);g.enable(g.DEPTH_TEST);g.depthFunc(g.LEQUAL);g.disable(g.CULL_FACE);
  this.pos=g.getAttribLocation(program,"aPos");this.normal=g.getAttribLocation(program,"aNormal");
  this.loc={p:g.getUniformLocation(program,"uP"),v:g.getUniformLocation(program,"uV"),m:g.getUniformLocation(program,"uM"),
   color:g.getUniformLocation(program,"uColor"),fog:g.getUniformLocation(program,"uFog"),glow:g.getUniformLocation(program,"uGlow")};
  this.mesh={};
  for(const [name,arr] of Object.entries(meshes())){
   let buffer=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,buffer);g.bufferData(g.ARRAY_BUFFER,new Float32Array(arr),g.STATIC_DRAW);
   this.mesh[name]={buffer,count:arr.length/6};
  }
  g.uniformMatrix4fv(this.loc.p,false,new Float32Array(perspective(48*PI/180,canvas.width/canvas.height,.1,120)));
  g.uniformMatrix4fv(this.loc.v,false,new Float32Array(look([0,8.7,17.7],[0,1.1,-7.3])));
 }
 draw(type,x,y,z,sx,sy,sz,color,r=0,glow=0){
  const g=this.g,m=this.mesh[type];if(!m)return;
  g.bindBuffer(g.ARRAY_BUFFER,m.buffer);
  g.enableVertexAttribArray(this.pos);g.enableVertexAttribArray(this.normal);
  g.vertexAttribPointer(this.pos,3,g.FLOAT,false,24,0);g.vertexAttribPointer(this.normal,3,g.FLOAT,false,24,12);
  g.uniformMatrix4fv(this.loc.m,false,new Float32Array(matrix(x,y,z,sx,sy,sz,r)));
  g.uniform3fv(this.loc.color,new Float32Array(rgb(color)));
  g.uniform1f(this.loc.glow,glow);
  g.drawArrays(g.TRIANGLES,0,m.count);
 }
 render({palette:p,time=0,lane=1,gate=-16,eco=false,reduced=false,theme="neon"}){
  const g=this.g;g.viewport(0,0,this.canvas.width,this.canvas.height);
  const sky=rgb(p.sky);g.clearColor(sky[0]*1.18,sky[1]*1.18,sky[2]*1.18,1);
  g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);g.uniform3fv(this.loc.fog,new Float32Array(rgb(p.fog)));
  const d=(...v)=>this.draw(...v);
  const mint=theme==="forest"?"#a5ffcf":theme==="sunset"?"#ffd3d4":"#a6f6fc";
  const grass=theme==="forest"?"#51bc83":theme==="sunset"?"#c777aa":"#59a7d4";
  const rock=theme==="forest"?"#2e5e59":theme==="sunset"?"#865d89":"#49699f";
  const pastel=theme==="sunset"?"#ffdeea":"#e6f9ff";
  const bright="#fff8e8",navy="#243451";
  // Sky: volumetric sun and big fluffy cloud forms.
  d("sphere",-14,15,-49,12,12,12,p.gem,0,.85);
  for(let i=0;i<(eco?3:7);i++){
   const x=((i*13+3)%42)-21,z=-36-(i%4)*6,y=8.6+(i%3)*2.1,sway=reduced?0:Math.sin(time*.13+i)*.17;
   d("sphere",x+sway,y,z,4.5,1.3,2.2,pastel);
   d("sphere",x-1.8+sway,y-.24,z+.3,3.1,1.0,2.1,bright);
   d("sphere",x+1.4+sway,y+.2,z-.3,3.1,1.45,2.2,pastel);
  }
  // Floating side islands, tree canopies and crystal towers.
  for(const side of [-1,1])for(let i=0;i<(eco?4:8);i++){
   const z=7-i*5.7,x=side*(7.6+(i%3)*.9),y=-2.2+(i%3)*.3,r=2.6+(i%2)*.35;
   d("cone",x,y-1.25,z,r*1.6,3.2,r*1.6,rock);
   d("cylinder",x,y,z,r*2,.54,r*2,grass);
   d("cylinder",x,y+.34,z,r*1.8,.14,r*1.8,mint);
   if(i%2===0){
    d("cylinder",x,y+1.2,z,.4,2.2,.4,"#85615c");
    d("cone",x,y+3.0,z,2.4,3.8,2.4,"#2bb48f");
    d("cone",x,y+4,z,1.8,2.9,1.8,"#51c7ac");
    d("sphere",x,y+5.05,z,.68,.68,.68,mint,0,.6);
   }else{
    d("cylinder",x,y+.8,z,.85,1.5,.85,p.tower);
    d("cone",x,y+2.2,z,1.7,2.4,1.7,p.gem);
    d("sphere",x,y+3.4,z,.3,.3,.3,mint,0,.8);
   }
  }
  // Floating layered road with lane markings.
  d("box",0,-2,-9,9.8,2.45,51,rock);
  d("box",0,-.85,-9,9.4,.40,51,p.ground);
  d("box",0,-.56,-9,8.7,.17,51,grass);
  d("box",0,-.42,-9,7.7,.16,51,p.road);
  d("box",0,-.3,-9,7.25,.05,51,"#213b60");
  for(const side of [-1,1]){
   d("box",side*3.6,-.14,-9,.1,.13,51,p.edge,0,.65);
   for(let z=10;z>-32;z-=5)d("sphere",side*3.6,0,z,.19,.19,.19,mint,0,.9);
  }
  for(const x of [-1.19,1.19])for(let z=11;z>-32;z-=2.7)
   d("box",x,-.22,z,.06,.025,1.01,pastel);
  // Fantasy castle at end of track.
  d("box",0,1.85,-34,8.3,4.3,2.4,p.tower);
  for(const [x,h] of [[-3.4,5.3],[0,7],[3.4,5.3]]){
   d("cylinder",x,h/2-.2,-34,2.25,h,2.25,p.tower);
   d("cylinder",x,h+.25,-34,2.6,.45,2.6,pastel);
   d("cone",x,h+2.2,-34,3.5,3.5,3.5,p.gem);
   d("sphere",x,h+4,-34,.47,.47,.47,mint,0,.9);
  }
  // Luminous 3D torus portals instead of block gates.
  for(let i=0;i<3;i++){
   const x=(i-1)*2.35;
   d("cylinder",x,-.14,gate,1.55,.15,1.55,p.gem,0,.2);
   d("torus",x,1.78,gate,2.4,2.85,.37,p.tower,0,.18);
   d("torus",x,1.78,gate+.11,2.22,2.66,.25,p.edge,0,.96);
   d("torus",x,1.78,gate-.14,1.7,2.13,.12,mint,0,.68);
   d("sphere",x,3.39,gate,.52,.52,.52,p.gem,0,.84);
   if(!eco)for(let j=0;j<4;j++){
    const a=j*PI/2+(reduced?0:time*.56);
    d("sphere",x+Math.cos(a)*1.26,1.78+Math.sin(a)*1.43,gate+.2,.23,.23,.23,mint,0,.9);
   }
  }
  // Exploradora ou explorador humano estilizado: proporções humanas, sem orelhas de mascote.
  // Modelagem low-poly autoral: cabelo, rosto, pescoço, casaco, braços e pernas com animação.
  const x=(lane-1)*2.35;
  const bob=reduced?0:Math.sin(time*7)*.038;
  const b=bob;
  const stride=reduced?0:Math.sin(time*7)*.16;
  const skin="#deb08c",skinLight="#f1c6a0",hair="#433150",hairLight="#634268";
  const jacket="#3978df",jacketLight="#55b8ec",pants="#2c395f",shoe="#f7edf2";
  // Sombra e pernas com alternância discreta, lembrando passos de uma pessoa.
  d("sphere",x,-.16,3.65,1.28,.11,.91,"#1b2853");
  for(const side of [-1,1]){
   const legZ=3.55+side*stride*.27;
   d("cylinder",x+side*.27,.20+b,legZ,.31,.87,.33,pants);
   d("sphere",x+side*.27,-.25+b,legZ+.22,.45,.23,.64,shoe);
   d("sphere",x+side*.27,-.14+b,legZ+.49,.42,.10,.35,p.edge);
  }
  // Corpo: torso alongado, gola e cinto tornam a silhueta claramente humana.
  d("cylinder",x,1.10+b,3.56,1.23,1.30,.74,jacket);
  d("sphere",x,1.73+b,3.55,1.22,.40,.78,jacketLight);
  d("cylinder",x,.47+b,3.56,1.02,.22,.65,pants);
  d("cylinder",x,1.85+b,3.55,.30,.33,.30,skin);
  d("cylinder",x,1.78+b,3.55,.55,.16,.56,shoe);
  // Braços compridos com mãos e movimento suave de caminhada.
  for(const side of [-1,1]){
   const armZ=3.55-side*stride*.20;
   d("sphere",x+side*.73,1.55+b,armZ,.42,.42,.50,jacketLight);
   d("cylinder",x+side*.79,1.02+b,armZ,.32,.83,.35,jacket);
   d("cylinder",x+side*.78,.54+b,armZ+.04,.27,.18,.28,shoe);
   d("sphere",x+side*.78,.38+b,armZ+.09,.28,.29,.30,skin);
  }
  // Cabeça humana: cabelo curto arredondado, testa, nariz e sorriso.
  d("sphere",x,2.35+b,3.60,1.05,1.14,1.00,skin);
  d("sphere",x,2.78+b,3.48,1.10,.48,1.03,hair);
  d("sphere",x-.28,2.70+b,4.02,.40,.20,.21,hairLight);
  d("sphere",x+.28,2.70+b,4.02,.40,.20,.21,hair);
  d("sphere",x-.25,2.34+b,4.08,.13,.15,.09,"#24304d");
  d("sphere",x+.25,2.34+b,4.08,.13,.15,.09,"#24304d");
  d("sphere",x-.29,2.39+b,4.13,.045,.045,.04,shoe);
  d("sphere",x+.21,2.39+b,4.13,.045,.045,.04,shoe);
  d("sphere",x,2.15+b,4.15,.19,.18,.16,skinLight);
  // Sorriso e detalhes de equipamento de aventureiro.
  d("torus",x,1.93+b,4.11,.27,.10,.11,"#9e566c");
  d("sphere",x-.32,1.98+b,4.06,.10,.07,.055,"#ec9d8d");
  d("sphere",x+.32,1.98+b,4.06,.10,.07,.055,"#ec9d8d");
  for(const side of [-1,1])
   d("cylinder",x+side*.36,1.27+b,3.94,.10,.82,.10,"#b8e9ff");
  d("sphere",x,1.14+b,4.01,.38,.34,.12,p.gem,0,.25);
  d("torus",x,1.12+b,4.11,.35,.31,.12,shoe,0,.2);
  // Energia do portal em torno do personagem, sem alterar o formato humano.
  d("sphere",x,3.20+b,3.55,.14,.14,.14,bright,0,.95);
  if(!eco)for(let i=0;i<14;i++){
   const z=8-(i%7)*5,xx=((i%5)-2)*1.4,y=1.5+(i%3)*1.1+(reduced?0:Math.sin(time*.9+i)*.27);
   d("sphere",xx,y,z,.10,.10,.10,i%2?mint:p.gem,0,.9);
  }
 }
}
let world=null,failed=false;
window.NeoWorldRenderer={
 render(canvas,options){
  if(failed)return false;
  try{if(!world||world.canvas!==canvas)world=new World(canvas);world.render(options);return true}
  catch(err){console.warn("Neo World v5:",err);failed=true;return false}
 },
 reset(){world=null;failed=false}
};
})();