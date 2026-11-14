/* Neo Aprendizagem v33 — repetição espaçada e roteiros de estudo locais.
 * Não é IA generativa: organiza conteúdos cadastrados usando histórico de revisão.
 * Sem rede, classificação de corpos ou notas oficiais, sem API paga.
 */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const PREFIX="neo-flash-review-v33";
const DAY=86400000;
let current=null,subject="",session=0,mode="devidos";
const all=()=>typeof flashcards!=="undefined"&&flashcards&&typeof flashcards==="object"?flashcards:{};
const courses=()=>typeof subjects!=="undefined"&&Array.isArray(subjects)?subjects:[];
const k=(s,question)=>s+"\n"+question;
function load(){
 try{
  const data=JSON.parse(localStorage.getItem(PREFIX));
  return data&&typeof data==="object"&&!Array.isArray(data)?data:{};
 }catch(_){return {}}
}
function save(data){try{localStorage.setItem(PREFIX,JSON.stringify(data));return true}catch(_){return false}}
const label=(id,t)=>{const el=$(id);if(el)el.textContent=t};
function dueCards(){
 const deck=all()[subject]||[],mem=load(),now=Date.now();
 return deck.map((pair,i)=>({pair,i,record:mem[k(subject,pair[0])]||null}))
  .sort((a,b)=>(a.record?.next||0)-(b.record?.next||0));
}
function next(){
 const pool=dueCards();
 if(!pool.length){current=null;label("neoSmartFront","Não há cartões disponíveis nesta matéria.");label("neoSmartBack","");return}
 const now=Date.now();
 const due=pool.filter(x=>!x.record||x.record.next<=now);
 let candidates=mode==="devidos"&&due.length?due:pool;
 const choice=candidates[session%candidates.length];
 current=choice;
 label("neoSmartFront",choice.pair[0]);
 label("neoSmartBack",choice.pair[1]);
 $("neoSmartBack").hidden=true;
 $("neoFlashRate").hidden=true;
 $("neoSmartReveal").hidden=false;
 const totalDue=due.length;
 label("neoSmartCount",totalDue+" para revisar agora · "+pool.length+" cartões na matéria"+(totalDue===0?" (treino antecipado)":""));
}
function rate(mark){
 if(!current||$("neoSmartBack").hidden)return;
 const data=load(),key=k(subject,current.pair[0]),last=data[key]||{level:0};
 const level=mark==="again"?0:Math.min(6,(last.level||0)+(mark==="easy"?2:1));
 const days=mark==="again"?0:mark==="hard"?1:Math.min(21,Math.pow(2,Math.max(1,level-1)));
 const wait=mark==="again"?30000:days*DAY;
 data[key]={level,next:Date.now()+wait,last:Date.now(),feedback:mark};
 if(!save(data)){label("neoSmartStatus","O navegador não permitiu salvar seu progresso. A sessão atual continua.");}
 else label("neoSmartStatus",mark==="again"?"Tudo bem revisar novamente. Você verá esse cartão em breve.":mark==="hard"?"Esse cartão volta mais cedo para reforçar o conteúdo.":"Cartão programado para uma revisão futura.");
 session++;next();
}
function reveal(){
 if(!current)return;
 $("neoSmartBack").hidden=false;$("neoFlashRate").hidden=false;$("neoSmartReveal").hidden=true;
}
function chosenSubject(){
 subject=$("neoSmartSubject")?.value||Object.keys(all())[0]||"";
 session=0;next();
}
function clear(){
 const data=load();
 for(const key of Object.keys(data))if(key.startsWith(subject+"\n"))delete data[key];
 save(data);session=0;chosenSubject();
 label("neoSmartStatus","Histórico local dessa matéria reiniciado.");
}
function suggestions(){
 const pick=$("neoRouteSubject")?.value||"Matemática";
 const course=courses().find(x=>x.name===pick),cards=all()[pick]||[],log=load();
 const due=cards.filter(c=>!log[k(pick,c[0])]||log[k(pick,c[0])].next<=Date.now()).length;
 const topics=(course?.topics||[]).flatMap(group=>group[1]||[]).slice(0,3);
 const text="🧭 Roteiro sugerido para "+pick+"\n\n1. Revise um assunto da Trilha: "+(topics[0]||"escolha um tema")+
 "\n2. Treine "+Math.min(3,Math.max(1,due))+" cartão(ões) usando a revisão inteligente ("+due+" aguardam revisão nesta matéria)."+
 "\n3. Faça um mapa mental com os conceitos que conseguiu explicar."+
 (pick==="Matemática"||pick==="Língua Portuguesa"?"\n4. Experimente o Arcade Educativo Neo para praticar de outra forma.":"\n4. Consulte uma atividade ou revisão da matéria.");
 label("neoRouteOutput",text);
}
function init(){
 const smart=$("neoSmartSubject");
 if(smart){
  for(const name of Object.keys(all()))smart.append(new Option(name,name));
  smart.addEventListener("change",chosenSubject);
  $("neoSmartReveal")?.addEventListener("click",reveal);
  document.querySelectorAll("[data-neo-rating]").forEach(b=>b.addEventListener("click",()=>rate(b.dataset.neoRating)));
  $("neoFlashReset")?.addEventListener("click",clear);
  $("neoFlashSkip")?.addEventListener("click",()=>{session++;next()});
  $("neoFlashMode")?.addEventListener("change",e=>{mode=e.target.value;session=0;next()});
  chosenSubject();
 }
 const route=$("neoRouteSubject");
 if(route){
  for(const c of courses())route.append(new Option(c.name,c.name));
  $("neoRouteCreate")?.addEventListener("click",suggestions);
  $("neoRouteFlash")?.addEventListener("click",()=>{if(typeof showView==="function")showView("cartoes")});
  $("neoRouteMap")?.addEventListener("click",()=>{if(typeof showView==="function")showView("mapasNeo")});
  suggestions();
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();