/* Neo Mapas Inteligentes v32 — organização local baseada no acervo; sem API paga. */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const ns="http://www.w3.org/2000/svg";
const clean=(v,n=140)=>String(v||"").replace(/\s+/g," ").trim().slice(0,n);
const norm=v=>clean(v,400).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const ignore=new Set(["uma","para","sobre","como","quais","qual","mais","tema","exemplo","estudo","assunto","primeiro","minha"]);
const words=v=>[...new Set(norm(v).split(/[^a-z0-9]+/).filter(w=>w.length>=4&&!ignore.has(w)))];
const node=(parent,tag,attrs={},content)=>{
 const el=document.createElementNS(ns,tag);
 for(const [key,value] of Object.entries(attrs))el.setAttribute(key,String(value));
 if(content!==undefined)el.textContent=content;
 parent.append(el);return el;
};
function wrap(v,max=35,count=3){
 const text=clean(v,180),parts=text.split(/\s+/),lines=[];let line="";
 for(let word of parts){
  if(word.length>max)word=word.slice(0,max-1)+"…";
  if((line+" "+word).trim().length>max&&line){lines.push(line);line=word}else line=(line+" "+word).trim();
  if(lines.length>=count)break;
 }
 if(line&&lines.length<count)lines.push(line);
 if(text.length>lines.join(" ").length&&lines.length)lines[lines.length-1]=lines[lines.length-1].replace(/…?$/,"")+"…";
 return lines;
}
function text(parent,x,y,content,opts={}){
 const lines=wrap(content,opts.max||35,opts.count||3);
 const item=node(parent,"text",{x,y:y-(lines.length-1)*10,"text-anchor":"middle","font-size":opts.size||17,"font-family":"Arial, sans-serif","font-weight":opts.weight||700,fill:opts.color||"#153d5b"});
 lines.forEach((v,i)=>node(item,"tspan",{x,dy:i?22:0},v));
}
function relevance(s,terms){
 const t=words(s);let score=0;
 for(const w of terms)for(const c of t){if(c===w){score+=5;break}if(c.length>5&&w.length>5&&(c.includes(w)||w.includes(c))){score+=2;break}}
 return score;
}
const courses=()=>typeof subjects!=="undefined"&&Array.isArray(subjects)?subjects:[];
const deck=s=>typeof flashcards!=="undefined"&&flashcards&&typeof flashcards==="object"?flashcards[s]||[]:[];
function plan(subject,topic,manual){
 const course=courses().find(c=>c.name===subject);
 const terms=words(topic),list=[];
 function add(heading,detail,origin){
  const d=clean(detail,125);if(!d||list.some(x=>norm(x.detail)===norm(d)))return;
  list.push({heading,detail:d,origin});
 }
 if(course&&terms.length){
  const groups=(course.topics||[]).map(g=>({title:g[0],topics:g[1]||[],score:Math.max(relevance(g[0],terms),...(g[1]||[]).map(x=>relevance(x,terms)),0)})).sort((a,b)=>b.score-a.score);
  const best=groups[0];
  if(best&&best.score>0){
   add("UNIDADE DA TRILHA",best.title,"material");
   const similar=best.topics.map(t=>({t,score:relevance(t,terms)})).sort((a,b)=>b.score-a.score);
   similar.filter(x=>x.score>0).slice(0,2).forEach(x=>add("ASSUNTO DO MATERIAL",x.t,"material"));
   similar.filter(x=>x.score===0).slice(0,2).forEach(x=>add("PARA APROFUNDAR",x.t,"material"));
  }
  const found=deck(subject).filter(c=>c&&c[0]&&c[1]).map(c=>({q:c[0],a:c[1],score:relevance(c[0]+" "+c[1],terms)}))
   .filter(c=>c.score>0).sort((a,b)=>b.score-a.score).slice(0,2);
  found.forEach(c=>add("CARTÃO DE ESTUDO",c.q+" — "+c.a,"material"));
 }
 String(manual||"").split(/[\n;]+/).map(x=>clean(x,120)).filter(Boolean).slice(0,8).forEach(x=>add("MINHA IDEIA",x,"manual"));
 if(!list.length){
  add("CONCEITO","Anote a definição encontrada na sua aula.","orientação");
  add("EXEMPLO","Inclua um exemplo relacionado ao tema.","orientação");
  add("REVISÃO","Compare seu esquema com o material escolar.","orientação");
 }
 return {subject,topic:clean(topic,85),items:list.slice(0,8),grounded:list.some(x=>x.origin==="material")};
}
const palettes={
 oceano:{bg:"#eef9fd",hub:"#134c79",ink:"#153d5d",line:"#4baac1",tiles:["#dff5fa","#e9efff","#e2f5eb","#fff1d9"]},
 aurora:{bg:"#f5f1fd",hub:"#5c4aa5",ink:"#3d3365",line:"#9281cf",tiles:["#eae4ff","#e1f2ff","#fceaf4","#fff1e0"]},
 natureza:{bg:"#f0f9f2",hub:"#246e55",ink:"#215543",line:"#5aab88",tiles:["#e1f7eb","#e1f3f7","#f4f5dc","#fff1d9"]},
 caderno:{bg:"#f5f8fd",hub:"#23577e",ink:"#244b69",line:"#86b3cf",tiles:["#ffffff","#eef5ff","#ffffff","#eef5ff"]}
};
let last=null;
function render(model){
 const colors=palettes[$("neoMapStyle")?.value]||palettes.oceano,items=model.items;
 const rows=Math.ceil(items.length/2),w=1260,h=Math.max(540,160+rows*146),cy=h/2,cx=630;
 const root=document.createElementNS(ns,"svg");
 for(const [key,value] of Object.entries({viewBox:"0 0 "+w+" "+h,width:w,height:h,xmlns:ns,role:"img","aria-label":"Mapa mental sobre "+model.topic}))root.setAttribute(key,value);
 node(root,"desc",{},"Esquema de "+model.subject+" organizado em duas colunas, com "+items.length+" ramificações.");
 node(root,"rect",{width:w,height:h,rx:24,fill:colors.bg});
 for(let x=25;x<w;x+=35)for(let y=25;y<h;y+=35)node(root,"circle",{cx:x,cy:y,r:1.25,fill:colors.line,opacity:.12});
 const positions=[];
 for(let i=0;i<items.length;i++){
  const left=i%2===0,row=Math.floor(i/2),x=left?28:840,y=113+row*146;
  positions.push({x,y,left,item:items[i],i});
  const endpoint=left?x+392:x,start=left?cx-174:cx+174,by=y+57;
  node(root,"path",{d:"M "+start+" "+cy+" C "+((start+endpoint)/2)+" "+cy+", "+((start+endpoint)/2)+" "+by+", "+endpoint+" "+by,stroke:colors.line,"stroke-width":3.3,fill:"none","stroke-linecap":"round"});
 }
 node(root,"rect",{x:cx-174,y:cy-75,width:348,height:150,rx:24,fill:colors.hub,stroke:colors.line,"stroke-width":4});
 text(root,cx,cy-18,model.subject,{size:17,color:"#c9f3ff",count:1});
 text(root,cx,cy+18,model.topic,{size:23,max:25,count:2,color:"#fff",weight:850});
 positions.forEach(p=>{
  node(root,"rect",{x:p.x,y:p.y,width:392,height:114,rx:18,fill:colors.tiles[p.i%4],stroke:colors.line,"stroke-width":2});
  node(root,"rect",{x:p.x+13,y:p.y+12,width:7,height:90,rx:4,fill:colors.hub});
  text(root,p.x+196,p.y+34,p.item.heading,{size:15,max:31,count:1,color:colors.hub,weight:900});
  text(root,p.x+196,p.y+78,p.item.detail,{size:17,max:38,count:3,color:colors.ink,weight:650});
 });
 node(root,"text",{x:35,y:h-17,"font-size":13,fill:colors.ink,"font-family":"Arial, sans-serif"},"NEO • MAPAS INTELIGENTES | conteúdo escolar e anotações pessoais");
 return root;
}
function choose(){
 const value=$("neoMapSubject").value,select=$("neoMapTopic");
 select.replaceChildren(new Option("Escolha um assunto cadastrado",""));
 const course=courses().find(x=>x.name===value);
 for(const g of course?.topics||[]){
  const group=document.createElement("optgroup");group.label=clean(g[0],100);
  for(const topic of g[1]||[])group.append(new Option(clean(topic,110),topic));
  select.append(group);
 }
 select.append(new Option("Outro assunto (digitar abaixo)","__custom__"));
}
function generate(){
 const subject=$("neoMapSubject")?.value||"",typed=($("neoMapCustom")?.value||"").trim(),selected=$("neoMapTopic")?.value||"";
 const topic=typed||(selected==="__custom__"?"":selected);
 if(!subject||!topic)return $("neoMapStatus").textContent="Escolha uma matéria e um assunto para criar o mapa.";
 last=plan(subject,topic,$("neoMapBranches")?.value||"");
 $("neoMapCanvas").replaceChildren(render(last));
 $("neoMapOutline").textContent=last.subject+" — "+last.topic+"\n\n"+last.items.map((x,i)=>(i+1)+". "+x.heading+": "+x.detail).join("\n");
 $("neoMapStatus").textContent=last.grounded?"✅ Mapa organizado com conteúdos cadastrados. Revise e personalize as ramificações.":"✅ Mapa de estudo criado. Não encontrei conteúdo específico para esse tema: complete-o com informações da aula.";
}
function save(){
 const image=$("neoMapCanvas").querySelector("svg");
 if(!image)return $("neoMapStatus").textContent="Gere o mapa antes de salvar.";
 const blob=new Blob([new XMLSerializer().serializeToString(image)],{type:"image/svg+xml;charset=utf-8"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="mapa-mental-neo.svg";a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function copy(){
 if(!last)return;
 const data=$("neoMapOutline").textContent;
 if(!navigator.clipboard?.writeText)return $("neoMapStatus").textContent="Selecione o esquema para copiar.";
 navigator.clipboard.writeText(data).then(()=>$("neoMapStatus").textContent="✅ Esquema copiado.").catch(()=>$("neoMapStatus").textContent="Selecione o texto para copiar.");
}
function init(){
 const s=$("neoMapSubject");if(!s)return;
 for(const c of courses())s.append(new Option(c.name,c.name));
 s.addEventListener("change",choose);
 $("neoMapTopic").addEventListener("change",()=>{if($("neoMapTopic").value!=="__custom__")$("neoMapCustom").value=""});
 $("neoMapGenerate").addEventListener("click",generate);
 $("neoMapDownload").addEventListener("click",save);
 $("neoMapCopy").addEventListener("click",copy);
 $("neoMapStyle")?.addEventListener("change",()=>{if(last)$("neoMapCanvas").replaceChildren(render(last))});
 if(s.options.length)choose();
 window.neoMapIntelligence={generate,render};
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();