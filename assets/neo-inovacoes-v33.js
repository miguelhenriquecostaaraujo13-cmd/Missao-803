/* Ateliê Neo: quatro invenções pedagógicas prototipadas, sem API ou dados externos. */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const mk=(tag,parent,contents,cls)=>{const el=document.createElement(tag);if(contents!==undefined)el.textContent=contents;if(cls)el.className=cls;parent?.append(el);return el};
const bt=(p,title,fn)=>{const b=mk("button",p,title,"btn light");b.type="button";b.addEventListener("click",fn);return b};
const sel=(p,title,values)=>{mk("label",p,title);const s=mk("select",p);values.forEach(x=>s.append(new Option(x,x)));return s};
const inp=(p,title,placeholder)=>{mk("label",p,title);const field=mk("input",p);field.placeholder=placeholder;field.maxLength=140;return field};
const out=p=>mk("div",p,"Escolha uma opção para experimentar.","neo-output");
const school=()=>typeof subjects!=="undefined"&&Array.isArray(subjects)?subjects:[];
const stored=(key,defaultValue)=>{try{return JSON.parse(localStorage.getItem("neo-innovation-v33-"+key))??defaultValue}catch(_){return defaultValue}};
const save=(key,data)=>{try{localStorage.setItem("neo-innovation-v33-"+key,JSON.stringify(data));return true}catch(_){return false}};
function panel(root,title,desc){
 const el=mk("section",root,undefined,"neo-tool");mk("h3",el,title);mk("p",el,desc);return el;
}
function interdisciplinary(root){
 const p=panel(root,"⭐⭐⭐ Missões interdisciplinares","Relacione dois conteúdos do currículo em uma mesma investigação criativa. A conexão é proposta pelo estudante e deve ser conferida com o professor.");
 const subjects=school().map(x=>x.name);const one=sel(p,"Primeira matéria",subjects),two=sel(p,"Segunda matéria",subjects);
 const result=out(p);
 bt(p,"Criar investigação",()=>{
  const a=school().find(s=>s.name===one.value),b=school().find(s=>s.name===two.value);
  if(!a||!b||a===b){result.textContent="Escolha duas matérias diferentes.";return}
  const A=(a.topics||[]).flatMap(g=>g[1]||[]),B=(b.topics||[]).flatMap(g=>g[1]||[]);
  if(!A.length||!B.length){result.textContent="Não há tópicos cadastrados suficientes.";return}
  const x=A[Math.floor(Math.random()*A.length)],y=B[Math.floor(Math.random()*B.length)];
  result.textContent="🔎 INVESTIGAÇÃO NE0\n\n"+a.name+": "+x+"\n"+b.name+": "+y+
  "\n\nMissão: crie uma pergunta que ligue os dois assuntos. Pesquise nas suas anotações, anote duas evidências e explique a relação. O sistema não afirma que os assuntos estão relacionados.";
 });
}
function knowledge(root){
 const p=panel(root,"⭐⭐⭐ Radar de revisão por assunto","Marque quais tópicos quer revisitar. O radar não mede capacidade, notas ou desempenho: você escolhe as prioridades.");
 const s=sel(p,"Matéria",school().map(x=>x.name)),result=out(p);
 const draw=()=>{
  result.replaceChildren();
  const course=school().find(x=>x.name===s.value),topics=(course?.topics||[]).flatMap(g=>g[1]||[]).slice(0,16);
  const seen=stored("radar-"+s.value,[]);
  if(!topics.length){result.textContent="Não há tópicos disponíveis.";return}
  const pending=[];
  for(const name of topics){
   const label=mk("label",result,undefined,"neo-check-row");const c=mk("input",label);c.type="checkbox";c.checked=seen.includes(name);
   mk("span",label,"Quero revisar: "+name);
   c.addEventListener("change",()=>{
    const a=stored("radar-"+s.value,[]);
    save("radar-"+s.value,c.checked?[...new Set([...a,name])]:a.filter(x=>x!==name));
  });
  }
 };
 s.addEventListener("change",draw);draw();
}
function memoryCapsule(root){
 const p=panel(root,"⭐⭐ Cápsula do aprendizado","Compare como explicaria um tema antes e depois de estudar, sem mostrar ou publicar o texto para outros alunos.");
 const title=inp(p,"Assunto","Ex.: Revolução Industrial");
 mk("label",p,"Minha explicação atual");const note=mk("textarea",p);note.maxLength=700;
 const result=out(p);
 bt(p,"Guardar primeira explicação",()=>{
  if(title.value.trim().length<3||note.value.trim().length<10)return result.textContent="Escreva o assunto e uma explicação de ao menos dez caracteres.";
  save("capsule",{topic:title.value.trim().slice(0,90),text:note.value.trim().slice(0,700)});
  result.textContent="✅ Primeira explicação guardada neste aparelho. Revise o assunto e volte quando quiser.";
 });
 bt(p,"Comparar com a primeira",()=>{
  const earlier=stored("capsule",null);
  result.textContent=earlier?"📘 "+earlier.topic+"\n\nAntes: "+earlier.text+"\n\nAgora: "+(note.value.trim()||"Escreva sua explicação atual acima.")+"\n\nCompare as duas versões com seu material escolar.":"Não há cápsula salva neste dispositivo.";
 });
}
function miniCampaign(root){
 const p=panel(root,"⭐⭐⭐ Campanha de revisão em três fases","Crie uma sequência de cartões do currículo como pequenas missões. É uma atividade de revisão, não um jogo de movimentação.");
 const subjects=school().map(x=>x.name),s=sel(p,"Matéria",subjects),result=out(p);
 let phase=0,sequence=[];
 function render(){
  result.replaceChildren();const item=sequence[phase];
  if(!item){result.textContent="Campanha concluída! Você pode começar outra.";return}
  mk("strong",result,"FASE "+(phase+1)+" / "+sequence.length);
  mk("p",result,item[0]);
  bt(result,"Revelar o cartão",()=>{result.replaceChildren();mk("strong",result,"FASE "+(phase+1)+": "+item[0]);mk("p",result,item[1]);
   bt(result,"Próxima fase",()=>{phase++;render()});
  });
 }
 bt(p,"Iniciar campanha",()=>{
  const cardSet=typeof flashcards!=="undefined"&&flashcards?flashcards[s.value]||[]:[];
  if(!cardSet.length)return result.textContent="Esta matéria não tem cartões cadastrados.";
  sequence=[...cardSet].sort(()=>Math.random()-.5).slice(0,Math.min(3,cardSet.length));phase=0;render();
 });
}
function init(){
 const target=$("neoNewExperiments");if(!target)return;
 mk("h3",target,"🚀 Ideias inovadoras do Neo — novos protótipos");
 mk("p",target,"Quatro experiências de organização e revisão para avaliar antes de liberar aos alunos. Elas não enviam respostas à nuvem.");
 const grid=mk("div",target,undefined,"neo-lab-grid");
 [interdisciplinary,knowledge,memoryCapsule,miniCampaign].forEach(x=>x(grid));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();