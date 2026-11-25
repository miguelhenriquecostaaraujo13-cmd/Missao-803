/* Estúdio de Inovações Neo — ferramentas locais e sem nuvem da Oficina pública */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const make=(tag,parent,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;parent?.append(node);return node};
const btn=(p,t,cb)=>{const b=make("button",p,t,"btn light");b.type="button";b.addEventListener("click",cb);return b};
const inp=(p,title,placeholder,max=130)=>{const l=make("label",p,title);const i=make("input",l);i.placeholder=placeholder||"";i.maxLength=max;return i};
const area=(p,title,placeholder,max=2000)=>{const l=make("label",p,title);const el=make("textarea",l);el.maxLength=max;el.placeholder=placeholder||"";return el};
const box=(p,title,description)=>{
 const c=make("section",p,undefined,"neo-tool neo-innovation");
 make("h3",c,title);make("p",c,description);return c;
};
const results=p=>make("div",p,"Pronto para experimentar.","neo-output");
const store=(key,val)=>{try{localStorage.setItem("neo-studio-v30-"+key,JSON.stringify(val));return true}catch{return false}};
const load=(key,def)=>{try{return JSON.parse(localStorage.getItem("neo-studio-v30-"+key))??def}catch{return def}};
const fmt=s=>String(s||"").trim().slice(0,180);
const bank=()=>typeof subjects!=="undefined"&&Array.isArray(subjects)?subjects:[];
function timeline(root){
 const p=box(root,"⭐⭐⭐ Linha do tempo interativa","Crie uma sequência de eventos para História, Ciências ou outra matéria; ordene por data ou ano.");
 const year=inp(p,"Ano ou data","Ex.: 1822 / 15-11-1889");
 const topic=inp(p,"Acontecimento","Ex.: Independência do Brasil");
 const entries=load("timeline",[]);const view=results(p);
 const draw=()=>{view.replaceChildren();const sorted=[...entries].sort((a,b)=>a.year.localeCompare(b.year,undefined,{numeric:true}));sorted.forEach((x,i)=>{
  const row=make("p",view,undefined,"neo-studio-item");make("strong",row,x.year+" — ");make("span",row,x.topic);
  btn(row,"Excluir",()=>{const ix=entries.findIndex(v=>v.year===x.year&&v.topic===x.topic);if(ix>=0){entries.splice(ix,1);store("timeline",entries);draw()}});
 });if(!entries.length)view.textContent="Adicione um acontecimento para montar a linha do tempo."};
 btn(p,"Adicionar evento",()=>{if(!year.value.trim()||!topic.value.trim())return;
  entries.push({year:fmt(year.value).slice(0,32),topic:fmt(topic.value)});entries.splice(32);store("timeline",entries);year.value="";topic.value="";draw()});
 draw();
}
function kanban(root){
 const p=box(root,"⭐⭐⭐ Quadro de estudos Kanban","Organize tarefas em A fazer, Em andamento e Concluído. Tudo permanece neste navegador.");
 const title=inp(p,"Nova tarefa","Ex.: revisar frações");
 const status=make("select",p);["A fazer","Em andamento","Concluído"].forEach(x=>status.append(new Option(x,x)));
 const tasks=load("kanban",[]);const view=results(p);
 const draw=()=>{view.replaceChildren();const columns=make("div",view,undefined,"neo-studio-columns");
  for(const name of ["A fazer","Em andamento","Concluído"]){const col=make("div",columns,undefined,"neo-studio-column");
   make("strong",col,name);for(const task of tasks.filter(x=>x.status===name)){
    const row=make("div",col,undefined,"neo-studio-item");make("span",row,task.title);
    btn(row,"Avançar",()=>{task.status=name==="A fazer"?"Em andamento":name==="Em andamento"?"Concluído":"A fazer";store("kanban",tasks);draw()});
    btn(row,"×",()=>{tasks.splice(tasks.indexOf(task),1);store("kanban",tasks);draw()});
   }
  }
 };
 btn(p,"Adicionar tarefa",()=>{if(title.value.trim().length<3)return;tasks.push({title:fmt(title.value),status:status.value});if(tasks.length>35)tasks.shift();store("kanban",tasks);title.value="";draw()});
 draw();
}
function wheel(root){
 const p=box(root,"⭐⭐ Roleta de assuntos","Sorteie um capítulo que já está no Portal para uma revisão espontânea.");
 const subject=make("select",p);
 for(const s of bank())subject.append(new Option(s.name,s.name));
 const output=results(p);
 btn(p,"🎲 Sortear assunto",()=>{const chosen=bank().find(x=>x.name===subject.value);const all=(chosen?.topics||[]).flatMap(g=>g[1]||[]);
 output.textContent=all.length?"🎯 Tema sorteado: "+all[Math.floor(Math.random()*all.length)]:"Não há temas cadastrados para essa matéria."});
}
function connectGame(root){
 const p=box(root,"⭐⭐⭐ Jogo de associação","Identifique qual resposta corresponde à pergunta de um cartão do acervo escolar.");
 const subject=make("select",p);for(const s of bank())subject.append(new Option(s.name,s.name));
 const output=results(p);
 btn(p,"Novo desafio",()=>{
  const available=(typeof flashcards!=="undefined"?flashcards[subject.value]||[]:[]).filter(x=>x[0]&&x[1]);
  if(available.length<3)return output.textContent="A matéria precisa de pelo menos três cartões para este jogo.";
  const correct=available[Math.floor(Math.random()*available.length)];
  const distractors=available.filter(c=>c!==correct&&c[1]!==correct[1]).sort(()=>Math.random()-.5).slice(0,2);
  const options=[correct,...distractors].sort(()=>Math.random()-.5);
  output.replaceChildren();make("strong",output,correct[0]);
  for(const item of options){
   btn(output,item[1],()=>{
    output.replaceChildren();make("p",output,item===correct?"✅ Correspondência correta!":"Tente novamente na próxima rodada.");
    make("p",output,"Resposta do material escolar: "+correct[1]);
   });
  }
 });
}
function bingo(root){
 const p=box(root,"⭐⭐ Bingo de revisão","Marque nove ações simples de estudo. É uma brincadeira pessoal, sem competição e sem ranking.");
 const tasks=["Expliquei um conceito","Revi um cartão","Fiz uma pergunta","Li um resumo","Anotei uma dúvida","Conferi uma resposta","Organizei a mochila","Estudei um exemplo","Preparei uma pausa"];
 const checked=new Set(load("bingo",[]));
 const grid=make("div",p,undefined,"neo-studio-bingo");
 const draw=()=>{grid.replaceChildren();tasks.forEach((t,i)=>{
  const b=btn(grid,(checked.has(i)?"✓ ":"")+t,()=>{checked.has(i)?checked.delete(i):checked.add(i);store("bingo",[...checked]);draw()});
  b.setAttribute("aria-pressed",String(checked.has(i)));if(checked.has(i))b.classList.add("neo-selected");
 })};
 btn(p,"Reiniciar cartela",()=>{checked.clear();store("bingo",[]);draw()});draw();
}
function cardsDesign(root){
 const p=box(root,"⭐⭐⭐ Estúdio de cards personalizados","Crie uma prévia de cartões com frente, verso e cores diferentes, sem publicar seus textos.");
 const front=inp(p,"Frente do card","Ex.: O que é democracia?");
 const back=area(p,"Verso do card","Escreva a resposta do material estudado.");
 const style=make("select",p);["azul","menta","dourado","caderno"].forEach(x=>style.append(new Option(x[0].toUpperCase()+x.slice(1),x)));
 const card=make("button",p,"Seu card aparece aqui.","neo-idea-flashcard neo-card-azul");
 card.type="button";let flipped=false;
 const repaint=()=>{card.className="neo-idea-flashcard neo-card-"+style.value;card.textContent=flipped?(back.value||"Verso vazio"):(front.value||"Frente vazia")};
 btn(p,"Visualizar frente e verso",()=>{flipped=false;repaint()});
 card.addEventListener("click",()=>{flipped=!flipped;repaint()});
 style.addEventListener("change",repaint);
}
function questionMaker(root){
 const p=box(root,"⭐⭐⭐ Criador de perguntas a partir de conceitos","Transforme seus próprios tópicos em cartões de recordação, sem afirmar respostas que o sistema não verificou.");
 const concept=inp(p,"Conceito central","Ex.: biodiversidade");
 const ideas=area(p,"Ideias relacionadas (uma por linha)","Ecossistemas\nEspécies\nConservação");
 const result=results(p);
 btn(p,"Criar roteiro",()=>{const words=ideas.value.split(/\n|;/).map(fmt).filter(Boolean).slice(0,10);
 if(!concept.value.trim()||!words.length)return result.textContent="Escreva um conceito e pelo menos uma ideia relacionada.";
 result.textContent=words.map((x,i)=>(i+1)+". Como '"+x+"' se conecta com '"+fmt(concept.value)+"'?\nResposta: escreva uma justificativa apoiada no material da aula.").join("\n\n");
 });
}
function revisionMatrix(root){
 const p=box(root,"⭐⭐ Painel de assuntos para revisar","Agrupe assuntos conforme sua vontade de revisá-los. Não calcula notas ou desempenho.");
 const item=inp(p,"Assunto","Ex.: frações");
 const group=make("select",p);["Quero rever","Quero praticar","Já revisei"].forEach(x=>group.append(new Option(x,x)));
 const arr=load("matrix",[]);const result=results(p);
 const draw=()=>{result.replaceChildren();for(const category of ["Quero rever","Quero praticar","Já revisei"]){
  const section=make("div",result);make("strong",section,category);
  for(const x of arr.filter(x=>x.group===category)){
   const line=make("p",section,undefined,"neo-studio-item");make("span",line,"• "+x.topic);
   btn(line,"Excluir",()=>{arr.splice(arr.indexOf(x),1);store("matrix",arr);draw()});
  }
 }};
 btn(p,"Adicionar ao painel",()=>{if(!item.value.trim())return;arr.push({topic:fmt(item.value),group:group.value});if(arr.length>40)arr.shift();store("matrix",arr);item.value="";draw()});draw();
}
function journal(root){
 const p=box(root,"⭐⭐ Diário de descobertas","Registre uma descoberta da semana, sem dados pessoais. O texto fica somente neste aparelho.");
 const note=area(p,"O que aprendi?","Hoje entendi melhor...");
 const result=results(p);
 const entries=load("journal",[]);
 const draw=()=>{result.replaceChildren();for(const x of entries){make("p",result,x.date+" · "+x.text)}if(!entries.length)result.textContent="Nenhuma descoberta registrada."};
 btn(p,"Guardar descoberta",()=>{
  if(note.value.trim().length<4)return;
  entries.unshift({date:new Date().toLocaleDateString("pt-BR"),text:note.value.trim().slice(0,500)});entries.splice(14);
  store("journal",entries);note.value="";draw();
 });
 btn(p,"Limpar registros",()=>{entries.length=0;store("journal",[]);draw()});draw();
}
function init(){
 const root=$("neoCreativePrototypes");if(!root)return;
 make("h3",root,"🚀 Estúdio de invenções — novas experiências");
 make("p",root,"Nove recursos educativos disponíveis para estudantes. Os registros ficam no navegador, não em um perfil público.");
 const grid=make("div",root,undefined,"neo-lab-grid");
 [timeline,kanban,wheel,connectGame,bingo,cardsDesign,questionMaker,revisionMatrix,journal].forEach(fn=>fn(grid));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();