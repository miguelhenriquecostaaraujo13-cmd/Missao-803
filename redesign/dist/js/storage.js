export const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
export function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{window.dispatchEvent(new Event('storage-failed'));return false}}
export const turma=()=>{try{return localStorage.getItem('portal8-turma-escolhida-v1')||'803'}catch{return '803'}};
export const key=()=>turma()==='803'?'missao803-v1':'portal8-state-'+turma();
export const progress=()=>read(key(),{done:[],answered:0,correct:0,scoreBySubject:{},seenQuiz:[],flashIndex:0});
export function record(q,correct){const p=progress();p.answered=(p.answered||0)+1;p.correct=(p.correct||0)+(correct?1:0);p.scoreBySubject??={};const sc=p.scoreBySubject[q.subject]||{c:0,n:0};sc.n++;if(correct)sc.c++;p.scoreBySubject[q.subject]=sc;write(key(),p);const results=read('missao-modern-results-'+turma(),[]);results.push({subject:q.subject,topic:q.topic,question:q.question,correct,date:new Date().toISOString()});write('missao-modern-results-'+turma(),results.slice(-2000))}
export function shuffle(items){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
