/* Jornada Neo v39 — sequência de estudo por matéria e 3 etapas.
 * Conteúdo baseado na Trilha cadastrada; progresso autodeclarado e local.
 * Não modifica notas, aulas, arquivos nem perfil Supabase.
 */
(() => {
 "use strict";
 const $=id=>document.getElementById(id);
 const KEY="neo-jornada-pessoal-v39";
 let db={};
 const today=()=>{
  const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
 };
 const courses=()=>typeof subjects!=="undefined"&&Array.isArray(subjects)?subjects:[];
 function load(){
  try{const v=JSON.parse(localStorage.getItem(KEY)||"{}");db=v&&typeof v==="object"&&!Array.isArray(v)?v:{}}catch(_){db={}}
 }
 function save(){
  try{localStorage.setItem(KEY,JSON.stringify(db));return true}catch(_){return false}
 }
 function topics(name){
  const course=courses().find(s=>s.name===name);
  return (course?.topics||[]).flatMap(g=>(g[1]||[]).map(item=>({chapter:String(g[0]),topic:String(item)}))).slice(0,80);
 }
 function key(subject){return today()+"|"+subject}
 function state(subject){
  const id=key(subject);
  const v=db[id];
  if(!v||!Array.isArray(v.done)||v.done.length!==3){
   db[id]={done:[false,false,false],index:0,updated:Date.now()};
  }
  return db[id];
 }
 function viewName(subject){
  if(subject==="Matemática"||subject==="Língua Portuguesa"||subject==="Ciências")return "arcadeNeo";
  return "quiz";
 }
 function steps(subject){
  return [
   {name:"Explorar o conteúdo",tool:"trilha",verb:"Ler o resumo e identificar o assunto central"},
   {name:"Memorizar",tool:"cartoes",verb:"Revisar cartões e explicar um conceito em voz alta"},
   {name:"Criar e praticar",tool:viewName(subject),verb:viewName(subject)==="arcadeNeo"?"Completar uma missão do Arcade Neo":"Resolver uma atividade da matéria"}
  ];
 }
 function chooseSubject(){
  const input=$("neoJourneySubject");
  const picked=input?.value||courses()[0]?.name||"";
  if(!picked)return;
  const record=state(picked);
  record.index=Math.max(0,Math.min(topics(picked).length-1,Number(record.index)||0));
  render();
 }
 function openTool(id,subject){
  if(id==="neoLab")return;
  window.showView?.(id);
  if(id==="cartoes"){
   const picker=$("neoSmartSubject");
   if([...picker?.options||[]].some(o=>o.value===subject)){
    picker.value=subject;picker.dispatchEvent(new Event("change",{bubbles:true}));
   }
  }
 }
 function createRow(root,subject,item,i,checked){
  const row=document.createElement("div");row.className="neo-journey-step";
  const check=document.createElement("input");check.type="checkbox";check.id="neoJStep"+i;
  check.checked=checked;check.setAttribute("aria-label","Concluí: "+item.name);
  const detail=document.createElement("div");detail.className="neo-journey-step-info";
  const label=document.createElement("label");label.htmlFor=check.id;label.textContent=(i+1)+". "+item.name;
  const info=document.createElement("p");info.textContent=item.verb;
  detail.append(label,info);
  const go=document.createElement("button");go.type="button";go.className="btn light";go.textContent="Abrir";
  go.setAttribute("aria-label","Abrir "+item.name);
  go.addEventListener("click",()=>openTool(item.tool,subject));
  check.addEventListener("change",()=>{
   const record=state(subject);record.done[i]=check.checked;record.updated=Date.now();
   save();render();
  });
  row.append(check,detail,go);root.append(row);
 }
 function render(){
  const picker=$("neoJourneySubject");if(!picker)return;
  const subject=picker.value||courses()[0]?.name||"",record=state(subject),list=topics(subject);
  if(!subject)return;
  const topic=list[record.index]||{chapter:"Sua matéria",topic:"Escolha um assunto da Trilha"};
  $("neoJourneyTopic").textContent=topic.topic;
  $("neoJourneyChapter").textContent=topic.chapter;
  const root=$("neoJourneySteps");root.replaceChildren();
  steps(subject).forEach((step,i)=>createRow(root,subject,step,i,record.done[i]));
  const completed=record.done.filter(Boolean).length;
  const progress=$("neoJourneyProgress");progress.max=3;progress.value=completed;
  $("neoJourneyCounter").textContent=completed+" de 3 etapas marcadas";
  $("neoJourneyFeedback").textContent=completed===3
    ?"🏁 Jornada concluída por você! Escolha outro assunto para continuar aprendendo."
    :completed===0?"Comece pela Trilha e marque cada etapa conforme terminar."
    :"⭐ Você já marcou "+completed+" etapa(s). Continue no seu ritmo!";
  const fresh=completed===3;
  $("neoJourneySurprise").textContent=fresh?"✨ Próximo assunto":"🎲 Trocar assunto";
 }
 function cycle(){
  const subject=$("neoJourneySubject")?.value||"";
  const list=topics(subject);if(!list.length)return;
  const record=state(subject);
  record.index=(record.index+1)%list.length;
  record.done=[false,false,false];record.updated=Date.now();save();render();
 }
 function reset(){
  const subject=$("neoJourneySubject")?.value||"";
  const record=state(subject);record.done=[false,false,false];record.updated=Date.now();save();render();
 }
 function init(){
  const picker=$("neoJourneySubject");if(!picker)return;
  load();
  courses().forEach(s=>picker.append(new Option(s.name,s.name)));
  if(!picker.options.length){$("neoJourneyFeedback").textContent="As matérias da Trilha não foram carregadas.";return}
  picker.addEventListener("change",chooseSubject);
  $("neoJourneySurprise")?.addEventListener("click",cycle);
  $("neoJourneyReset")?.addEventListener("click",reset);
  chooseSubject();
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();