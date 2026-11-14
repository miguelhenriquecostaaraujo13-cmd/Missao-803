/* Mapa Mental Neo — gera mapa visual somente com material escolar cadastrado
 * ou com tópicos inseridos pelo aluno. Sem IA externa, sem envio de dados. */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const ns="http://www.w3.org/2000/svg";
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const short=(s,n=64)=>String(s||"").trim().slice(0,n);
let last=null;
function element(parent,tag,attrs={},text){
 const node=document.createElementNS(ns,tag);
 for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));
 if(text!==undefined)node.textContent=text;
 parent.append(node);return node;
}
function wrap(s,length=25){
 const words=String(s).split(/\s+/);let lines=[""];
 for(const word of words){
  const i=lines.length-1;
  if((lines[i]+" "+word).trim().length>length&&lines[i])lines.push(word);
  else lines[i]=(lines[i]+" "+word).trim();
 }
 return lines.slice(0,4);
}
function svgText(parent,x,y,label,width,color,size=14,weight=750){
 const lines=wrap(label,width);
 const text=element(parent,"text",{"x":x,"y":y-(lines.length-1)*9,"font-family":"Arial, sans-serif","font-size":size,"font-weight":weight,"fill":color,"text-anchor":"middle"});
 lines.forEach((line,i)=>element(text,"tspan",{x:x,dy:i?"19":"0"},line));
}
function compute(subject,topic,extra){
 const branches=[];
 const course=(typeof subjects!=="undefined"&&Array.isArray(subjects))?subjects.find(s=>s.name===subject):null;
 let chapter=null,found=null;
 if(course){
  for(const group of course.topics||[]){
   for(const item of group[1]||[]){
    if(norm(item)===norm(topic)){chapter=group;found=item;break}
   }
   if(found)break;
  }
  if(!found&&topic){
   for(const group of course.topics||[]){
    const possible=(group[1]||[]).find(x=>norm(x).includes(norm(topic))||norm(topic).includes(norm(x)));
    if(possible&&norm(topic).length>=5){found=possible;chapter=group;break}
   }
  }
 }
 if(chapter){
  branches.push({label:"Capítulo",detail:short(chapter[0],85)});
  (chapter[1]||[]).filter(x=>x!==found).slice(0,3).forEach((s,i)=>branches.push({label:"Assunto relacionado "+(i+1),detail:short(s,95)}));
 }
 const cards=(typeof flashcards==="object"&&flashcards)?(flashcards[subject]||[]):[];
 const matched=cards.filter(c=>{
  const hay=norm(c[0]+" "+c[1]);const t=norm(found||topic);
  const important=t.split(/[^a-z0-9]+/).filter(w=>w.length>5);
  return important.some(w=>hay.includes(w));
 }).slice(0,2);
 matched.forEach((c,i)=>branches.push({label:"Cartão "+(i+1),detail:short(c[0],95)}));
 const typed=extra.split(/\n|;/).map(s=>s.trim()).filter(Boolean).slice(0,6);
 typed.forEach((text,i)=>branches.push({label:"Minha ideia "+(i+1),detail:short(text,95)}));
 if(!branches.length&&course){
  branches.push({label:"Resumo da matéria",detail:short(course.summary||"Consulte sua trilha para encontrar os conceitos.",100)});
  (course.topics||[]).slice(0,4).forEach(g=>branches.push({label:"Capítulo de estudo",detail:short(g[0],80)}));
 }
 if(!branches.length)branches.push({label:"Sua ideia",detail:"Escreva ramificações para personalizar este mapa."});
 return {subject,topic:short(topic,100)||"Meu assunto",branches:branches.slice(0,8),found:!!found,manual:!!typed.length};
}
function buildSvg(d){
 const w=900,h=540,svg=document.createElementNS(ns,"svg");
 svg.setAttribute("viewBox","0 0 900 540");svg.setAttribute("width",String(w));svg.setAttribute("height",String(h));svg.setAttribute("xmlns",ns);
 svg.setAttribute("role","img");svg.setAttribute("aria-label","Mapa mental de "+d.topic);
 element(svg,"rect",{x:0,y:0,width:w,height:h,rx:24,fill:"#eff8fb"});
 element(svg,"circle",{cx:445,cy:265,r:178,fill:"none",stroke:"#ccebf3","stroke-width":2,"stroke-dasharray":"7 10"});
 const cx=445,cy=265,N=d.branches.length;
 const colors=["#0a88ae","#1d5aa3","#3e8b73","#ae7835","#735aa9","#3675aa","#b05f7a","#407e8d"];
 const positions=[];
 for(let i=0;i<N;i++){
  const angle=2*Math.PI*i/N-Math.PI/2;
  const x=cx+Math.cos(angle)*340, y=cy+Math.sin(angle)*206;
  positions.push({x,y,angle});
  element(svg,"path",{d:"M "+cx+" "+cy+" Q "+(cx+x)/2+" "+(cy+y)/2+" "+x+" "+y,fill:"none",stroke:colors[i], "stroke-width":4, "stroke-linecap":"round"});
 }
 element(svg,"rect",{x:cx-133,y:cy-58,width:266,height:116,rx:25,fill:"#0d456e",stroke:"#79d6e7","stroke-width":4});
 svgText(svg,cx,cy-16,d.subject,26,"#b6e9f6",13,700);
 svgText(svg,cx,cy+16,d.topic,24,"#fff",20,850);
 positions.forEach(({x,y},i)=>{
  const item=d.branches[i];
  element(svg,"rect",{x:x-111,y:y-43,width:222,height:86,rx:17,fill:"#fff",stroke:colors[i],"stroke-width":3});
  svgText(svg,x,y-13,item.label,27,colors[i],13,800);
  svgText(svg,x,y+14,item.detail,29,"#243e54",12,650);
 });
 element(svg,"text",{x:22,y:513,"font-family":"Arial, sans-serif","font-size":12,fill:"#527489"},"Portal 8º Ano Missão Paz · Neo · mapa baseado em materiais cadastrados e/ou suas ideias");
 return svg;
}
function generate(){
 const subject=$("neoMapSubject")?.value;
 const manual=($("neoMapCustom")?.value||"").trim();
 const chosen=$("neoMapTopic")?.value||"";
 const topic=manual||(chosen!=="__custom__"?chosen:"");
 if(!subject||!topic){$("neoMapStatus").textContent="Escolha a matéria e um assunto ou digite um assunto específico.";return}
 last=compute(subject,topic,$("neoMapBranches")?.value||"");
 const root=$("neoMapCanvas");root.replaceChildren(buildSvg(last));
 const lines=last.branches.map(x=>x.label+": "+x.detail);
 $("neoMapOutline").textContent=last.topic+"\n"+lines.join("\n");
 $("neoMapStatus").textContent=last.found?"✅ Mapa criado com assuntos do mesmo capítulo, cartões relacionados e suas ideias, quando adicionadas.":"✅ Mapa criado. Como não há correspondência exata, use as ramificações manuais para completar o assunto.";
}
function download(){
 if(!last)return $("neoMapStatus").textContent="Gere o mapa antes de salvar.";
 const svg=$("neoMapCanvas").querySelector("svg");if(!svg)return;
 const data=new XMLSerializer().serializeToString(svg);
 const blob=new Blob([data],{type:"image/svg+xml;charset=utf-8"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="mapa-mental-neo.svg";a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function subjectTopics(){
 const s=$("neoMapSubject").value;
 const selected=(typeof subjects!=="undefined"&&Array.isArray(subjects))?subjects.find(x=>x.name===s):null;
 const menu=$("neoMapTopic");menu.replaceChildren();
 menu.append(new Option("Escolha um assunto cadastrado",""));
 for(const group of selected?.topics||[]){
  const optgroup=document.createElement("optgroup");optgroup.label=short(group[0],100);
  for(const item of group[1]||[])optgroup.append(new Option(short(item,115),item));
  menu.append(optgroup);
 }
 menu.append(new Option("Outro assunto (digitar abaixo)","__custom__"));
}
function init(){
 if(!$("neoMapSubject"))return;
 const names=(typeof subjects!=="undefined"&&Array.isArray(subjects))?subjects.map(s=>s.name):[];
 names.forEach(name=>$("neoMapSubject").append(new Option(name,name)));
 if(!names.length){$("neoMapStatus").textContent="Os conteúdos de matérias ainda não carregaram. Você pode escrever seu assunto manualmente.";return}
 $("neoMapSubject").addEventListener("change",subjectTopics);
 $("neoMapTopic").addEventListener("change",()=>{if($("neoMapTopic").value!=="__custom__")$("neoMapCustom").value=""});
 $("neoMapGenerate").addEventListener("click",generate);
 $("neoMapDownload").addEventListener("click",download);
 $("neoMapCopy").addEventListener("click",()=>{
  const text=$("neoMapOutline").textContent;
  if(!text)return;
  navigator.clipboard?.writeText(text).then(()=>$("neoMapStatus").textContent="✅ Estrutura copiada para a área de transferência.").catch(()=>$("neoMapStatus").textContent="Selecione e copie o esquema abaixo.");
 });
 subjectTopics();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();