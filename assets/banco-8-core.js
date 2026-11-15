/* Portal 8º ano — base curricular complementar, questões autorais curadas. */
(() => {
 "use strict";
 const normalize=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR").trim();
 const seen=new Set((typeof quizzes!=="undefined"?quizzes:[]).map(x=>normalize(x.q)));
 const bank={added:0,topics:{},bySubject:{},duplicates:0,invalid:0};
 window.portal8BancoCurricular=bank;
 function append(subject,text){
  if(typeof quizzes==="undefined")return;
  let count=0;const topics=new Set();
  for(const line of text.trim().split(/\r?\n/).filter(Boolean)){
   const f=line.split("|").map(x=>x.trim());
   if(f.length!==7){bank.invalid++;continue}
   const [t,q,right,w1,w2,w3,e]=f;
   const key=normalize(q);
   if(seen.has(key)){bank.duplicates++;continue}
   const uniq=new Set([right,w1,w2,w3].map(normalize));
   if(uniq.size!==4||!t||!q||!e){bank.invalid++;continue}
   const source=[right,w1,w2,w3];
   let hash=0;for(let i=0;i<q.length;i++)hash=(hash*31+q.charCodeAt(i))>>>0;
   const offset=hash%4;
   const o=source.slice(offset).concat(source.slice(0,offset));
   quizzes.push({s:subject,t,q,o,a:(4-offset)%4,e,origin:"banco-8ano"});
   seen.add(key);topics.add(t);bank.added++;count++;
  }
  bank.bySubject[subject]=(bank.bySubject[subject]||0)+count;
  bank.topics[subject]=[...new Set([...(bank.topics[subject]||[]),...topics])];
 }
 window.portal8AppendCurriculum=append;
 window.portal8CurriculumNormalize=normalize;
})();
