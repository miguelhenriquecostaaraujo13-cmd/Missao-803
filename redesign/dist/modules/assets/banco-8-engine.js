/* Questões 8º ano — seleção por assunto sem repetir partidas recentes.
 * Salva histórico mínimo no próprio navegador; não publica notas.
 */
(() => {
 "use strict";
 const storageKey=()=> "p8-questoes-historico-v1-"+(typeof portal8Turma!=="undefined"?portal8Turma:"803");
 const normal=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
 const key=q=>{let v=String(q?.s||"")+"|"+String(q?.q||""),h=2166136261;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)};
 const valid=q=>q&&typeof q.q==="string"&&typeof q.s==="string"&&Array.isArray(q.o)&&q.o.length>=3&&Number.isInteger(q.a)&&q.a>=0&&q.a<q.o.length;
 const cache={};
 function state(){
  const k=storageKey();
  if(!cache[k]){
   try{const data=JSON.parse(localStorage.getItem(k)||"{}");cache[k]=data&&typeof data==="object"&&!Array.isArray(data)?data:{}}
   catch(_){cache[k]={}}
  }
  return cache[k];
 }
 function save(){try{localStorage.setItem(storageKey(),JSON.stringify(state()))}catch(_){}}
 function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
 function all(){return typeof quizzes!=="undefined"?quizzes.filter(valid):[]}
 function subjects(){return [...new Set(all().map(q=>q.s))]}
 function topics(subject){return [...new Set(all().filter(q=>q.s===subject).map(q=>q.t||"Questões gerais"))].sort((a,b)=>a.localeCompare(b,"pt-BR"))}
 function stats(){const by={};for(const q of all()){let v=by[q.s]||(by[q.s]={questions:0,topics:new Set()});v.questions++;v.topics.add(q.t||"Questões gerais")}return Object.fromEntries(Object.entries(by).map(([name,d])=>[name,{questions:d.questions,topics:d.topics.size}]))}
 function pick(subject,count=5,topic=""){
  const n=Math.max(1,Math.min(40,Number(count)||5));
  let pool=all().filter(q=>subject==="Todas"||q.s===subject);
  if(topic)pool=pool.filter(q=>normal(q.t||"Questões gerais")===normal(topic));
  if(!pool.length)return [];
  const group=subject+"|"+(topic||"*"),saved=state();
  let history=Array.isArray(saved[group])?saved[group].filter(x=>typeof x==="string").slice(-400):[];
  const keys=new Set(pool.map(key));
  history=history.filter(id=>keys.has(id));
  const seen=new Set(history);
  let unasked=shuffle(pool.filter(q=>!seen.has(key(q))));
  if(unasked.length<Math.min(n,pool.length)){
   // Inicia um novo ciclo quando terminam as inéditas, preservando as últimas perguntas.
   const avoid=new Set(history.slice(-Math.min(12,Math.floor(pool.length/3))));
   const replay=shuffle(pool.filter(q=>!avoid.has(key(q))));
   const used=new Set(unasked.map(key));
   unasked=unasked.concat(replay.filter(q=>!used.has(key(q))));
   history=[];
  }
  const chosen=[],topicSet=new Set();
  for(const q of unasked)if(chosen.length<n&&!topicSet.has(q.t||"Questões gerais")){chosen.push(q);topicSet.add(q.t||"Questões gerais")}
  for(const q of unasked)if(chosen.length<n&&!chosen.includes(q))chosen.push(q);
  history=history.concat(chosen.map(key)).slice(-400);
  saved[group]=history;save();
  return chosen;
 }
 function record(q,right){
  if(!valid(q))return;
  const k="wrongByTopic",saved=state(),map=saved[k]&&typeof saved[k]==="object"&&!Array.isArray(saved[k])?saved[k]:{};
  const topic=q.s+"|"+(q.t||"Questões gerais");
  const old=map[topic]&&typeof map[topic]==="object"?map[topic]:{attempts:0,correct:0};
  map[topic]={attempts:Math.min(100000,(Number(old.attempts)||0)+1),correct:Math.min(100000,(Number(old.correct)||0)+(right?1:0))};
  saved[k]=map;save();
 }
 function practice(){const d=state().wrongByTopic||{};return Object.entries(d).filter(([k,v])=>v&&Number(v.attempts)>=2).map(([k,v])=>({key:k,subject:k.split("|")[0],topic:k.split("|").slice(1).join("|"),attempts:v.attempts,percent:Math.round(100*v.correct/v.attempts)})).sort((a,b)=>a.percent-b.percent||b.attempts-a.attempts)}
 window.portal8Q8=Object.freeze({all,subjects,topics,stats,pick,record,practice,shuffle});
})();
