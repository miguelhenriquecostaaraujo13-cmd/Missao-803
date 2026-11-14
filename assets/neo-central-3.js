/* Portal Missão Paz — Central Neo 3.0. Recursos locais e honestos, sem IA paga. */
(() => {
"use strict";
const $ = id => document.getElementById(id);
const canStudy = typeof subjects !== "undefined" && typeof quizzes !== "undefined" && typeof flashcards !== "undefined";
if (!canStudy || !$("neoCentral30")) return;
const classNow = () => typeof portal8Turma !== "undefined" ? portal8Turma : "803";
let loadedClass = classNow();
const key = () => "neo-central-3-v1-" + loadedClass;
const DAY = () => {
 const d = new Date();
 return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
};
const escapeText = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function load(){
 try{
  const raw=JSON.parse(localStorage.getItem(key())||"{}");
  if(!raw||typeof raw!=="object"||Array.isArray(raw))return {};
  return raw;
 }catch(_){return {}}
}
let data=load();
const write=()=>{try{localStorage.setItem(key(),JSON.stringify(data))}catch(_){msg("O navegador não conseguiu guardar a alteração. Verifique o armazenamento disponível.")}};
const safeArray=v=>Array.isArray(v)?v:[];
const safeMap=v=>v&&typeof v==="object"&&!Array.isArray(v)?v:{};
const msg=s=>{const n=$("n3Message");if(n)n.textContent=s};
let chosenSubject=subjects[0].name;
let boss={questions:[],position:0,correct:0,answered:false,active:false};
let currentFlash=null,flashShown=false;
function cards(subject){return safeArray(flashcards[subject])}
function questionPool(subject){return quizzes.filter(q=>q.s===subject && Array.isArray(q.o)&&Number.isInteger(q.a)&&q.a>=0&&q.a<q.o.length)}
function currentDone(){return typeof state!=="undefined"&&Array.isArray(state.done)?state.done:[]}
function worldProgress(sub){
 const topics=sub.topics.flatMap(group=>group[1]);
 const done=currentDone().filter(t=>t.startsWith(sub.name+"|")).length;
 return {done,total:topics.length,percent:topics.length?Math.round(100*done/topics.length):0};
}
function unfinished(prefer){
 const ss=[...subjects];
 if(prefer){const i=ss.findIndex(s=>s.name===prefer);if(i>0)ss.unshift(ss.splice(i,1)[0])}
 for(const s of ss){
  for(const chapter of s.topics){
   for(const topic of chapter[1]){
    const key=s.name+"|"+topic;
    if(!currentDone().includes(key))return {subject:s.name,chapter:chapter[0],topic,key};
   }
  }
 }
 return null;
}
function selectOptions(){
 return subjects.map(s=>'<option value="'+escapeText(s.name)+'">'+escapeText(s.icon+" "+s.name)+'</option>').join("");
}
$("neoCentral30").innerHTML=[
'<div class="n3-hero"><span class="n3-kicker">✦ MISSÃO PAZ • PLATAFORMA 3.0</span>',
'<h2>Bem-vindo ao seu universo de estudos! 🚀</h2>',
'<p>Explore os mundos do conhecimento, organize suas revisões, enfrente um chefão educativo e faça o Neo trabalhar como seu guia de estudos.</p>',
'<div class="n3-hero-actions"><button type="button" class="n3-button primary" data-n3="random">🎲 Estudar sem escolher</button><button type="button" class="n3-button secondary" data-n3-go="neoGames40">🌌 Games 3D + Pixel</button><button type="button" class="n3-button secondary" data-n3-go="neoIAs40">🤖 Minhas IAs Neo</button><button type="button" class="n3-button secondary" data-n3-go="arcadeNeo">🎮 Arcade clássico</button><button type="button" class="n3-button secondary" data-n3-go="neoOficina">🎨 Oficina Criativa</button></div></div>',
'<div class="n3-stats"><div class="n3-stat"><strong id="n3XP">0 XP</strong><small>Experiência local</small></div>',
'<div class="n3-stat"><strong id="n3Topics">0</strong><small>Tópicos concluídos</small></div><div class="n3-stat"><strong id="n3FlashDue">0</strong><small>Cartões para revisar</small></div></div>',
'<div id="n3Message" role="status" aria-live="polite" class="n3-info" style="margin:10px 1px 0"></div>',
'<div class="n3-grid">',
'<article class="n3-panel full"><h3>🌎 Mundo do Conhecimento</h3><p>Escolha uma ilha para abrir a trilha da matéria. Cada ilha evolui conforme seus tópicos são marcados como estudados.</p><div class="n3-worlds" id="n3Worlds"></div></article>',
'<article class="n3-panel"><h3>🧭 Seu GPS de estudos</h3><p>Próximo tópico ainda não concluído na sua trilha.</p><div class="n3-lesson" id="n3Route"></div><div class="n3-actions"><button type="button" class="n3-button primary" data-n3="next">📘 Ir para a trilha</button><button type="button" class="n3-button light" data-n3-go="assistente">✨ Perguntar ao Neo</button></div></article>',
'<article class="n3-panel"><h3>🎯 Missão do dia</h3><p>Três passos curtos para organizar seus estudos. Marque somente depois de realizar cada atividade.</p><div id="n3Mission"></div><div class="n3-progress"><i id="n3MissionBar" style="width:0%"></i></div><span id="n3MissionStatus" class="n3-muted"></span></article>',
'<article class="n3-panel"><h3>⚔️ Chefão das Matérias</h3><p>Uma batalha de perguntas com visual de jogo. Você vence usando seus conhecimentos.</p><div class="n3-controls"><label>Matéria<select id="n3BossSubject">'+selectOptions()+'</select></label><button type="button" class="n3-button primary" data-n3="bossStart">⚔️ Nova batalha</button></div>',
'<div class="n3-boss-stage" aria-label="Arena ilustrada do chefão"><span id="n3Monster" class="n3-monster" aria-hidden="true">🐉</span></div>',
'<div class="n3-progress" aria-label="Força restante do chefão"><i id="n3BossBar" style="width:100%"></i></div>',
'<div id="n3BossTitle" class="n3-boss-title">O Guardião dos Desafios aguarda!</div><div id="n3BossQuestion" class="n3-muted">Escolha sua matéria e inicie a batalha.</div><div id="n3BossAnswers"></div><p id="n3BossFeedback" class="n3-muted" aria-live="polite"></p><button type="button" class="n3-button light" data-n3="bossNext" id="n3BossNext" hidden>Próxima questão →</button></article>',
'<article class="n3-panel"><h3>🃏 Flashcards Evolutivos</h3><p>Revise cartões com intervalos crescentes. O que você lembra volta menos vezes; o que precisa treinar reaparece antes.</p>',
'<div class="n3-controls"><label>Matéria<select id="n3FlashSubject">'+selectOptions()+'</select></label><button type="button" class="n3-button light" data-n3-go="cartoes">Abrir cartões clássicos</button></div>',
'<button type="button" class="n3-flash" id="n3FlashCard" data-n3="flashFlip" aria-label="Virar cartão de revisão">Toque para começar</button>',
'<p id="n3FlashStatus" class="n3-muted" aria-live="polite"></p><div class="n3-actions"><button type="button" class="n3-button light" data-n3="flashAgain" id="n3FlashAgain">🔁 Preciso revisar</button><button type="button" class="n3-button primary" data-n3="flashGood" id="n3FlashGood">✅ Lembrei!</button></div></article>',
'<article class="n3-panel"><h3>🏙️ Cidade do Aprendizado</h3><p>O cenário ganha construções conforme você acumula XP com missões e desafios educativos.</p>',
'<div id="n3City" class="n3-city" aria-label="Cidade virtual em construção"></div><p id="n3CityStatus" class="n3-muted"></p>',
'<h3 style="margin-top:18px">🏅 Conquistas</h3><div id="n3Badges" class="n3-badges"></div></article>',
'<article class="n3-panel"><h3>🛰️ Radar de estudos e provas</h3><p>Veja suas próximas tarefas do calendário pessoal. Confira sempre as datas oficiais com a escola.</p><div id="n3Radar"></div><button type="button" class="n3-button light" data-n3-go="calendario">📅 Abrir calendário</button></article>',
'<article class="n3-panel"><h3>🎒 Mochila do Estudante</h3><p>Guarde lembretes rápidos neste navegador e acesse suas ferramentas favoritas.</p>',
'<label for="n3NoteInput">Guardar lembrete</label><div class="n3-save-note"><input type="text" id="n3NoteInput" maxlength="120" placeholder="Ex.: revisar crase amanhã"><button type="button" class="n3-button light" data-n3="addNote">+ Guardar</button></div>',
'<ul id="n3Notes" class="n3-note-list"></ul><div class="n3-actions"><button type="button" class="n3-button light" data-n3-go="caderno">📒 Meu caderno</button><button type="button" class="n3-button light" data-n3-go="mapasNeo">🧠 Mapas mentais</button><button type="button" class="n3-button light" data-n3-go="foco">⏱️ Modo foco</button></div></article>',
'<article class="n3-panel full"><h3>🛠️ Projeto oficial • Portal Missão Paz 3.0</h3><p>Os recursos abaixo são separados por fase para ninguém confundir funcionalidades prontas com propostas em desenvolvimento.</p>',
'<div class="n3-roadmap"><article><b>✅ Fase 1 • Disponível</b><small>Central Neo, mundos por matéria, GPS da trilha, missão diária, flashcards evolutivos, chefão de questões, cidade, conquistas, radar e mochila.</small></article>',
'<article><b>🧩 Fase 2 • Planejada</b><small>Histórias de investigação, laboratório visual ampliado, novas campanhas de minijogos, árvore de habilidades, personagens personalizáveis e eventos educativos.</small></article>',
'<article><b>🌟 Fase 3 • Planejada</b><small>Jornadas cooperativas mediadas, roteiros para professores, temporadas temáticas e relatórios adaptativos com segurança e privacidade.</small></article></div>',
'<div class="n3-actions"><button type="button" class="n3-button light" data-n3-go="laboratorio">🔬 Laboratório atual</button><button type="button" class="n3-button light" data-n3-go="perfil">👤 Meu perfil</button><button type="button" class="n3-button light" data-n3-go="metas803">📈 Metas existentes</button></div>',
'<p class="n3-info" style="margin-top:14px">Os recursos 3.0 funcionam neste dispositivo, sem criar conta e sem publicar notas. Os dados não são sincronizados automaticamente entre navegadores.</p></article>',
'</div>'
].join("");
const storedMission=()=>safeMap(data.missions)[DAY()]||[];
const storedFlash=()=>safeMap(data.flash);
function renderStats(){
 $("n3XP").textContent=Math.max(0,Number(data.xp)||0)+" XP";
 $("n3Topics").textContent=currentDone().length;
 const now=Date.now();
 let due=0;
 for(const s of subjects)for(const [index] of cards(s).entries()){
  const f=storedFlash()[s+"|"+index];
  if(!f||!f.next||Number(f.next)<=now)due++;
 }
 $("n3FlashDue").textContent=due;
}
function renderWorlds(){
 const target=$("n3Worlds");target.replaceChildren();
 for(const sub of subjects){
  const progress=worldProgress(sub),b=document.createElement("button");
  b.type="button";b.className="n3-world";
  b.innerHTML='<span class="n3-world-icon" aria-hidden="true">'+escapeText(sub.icon)+'</span><strong>'+escapeText(sub.name)+'</strong><small>'+progress.done+" de "+progress.total+' tópicos • '+progress.percent+'%</small><div class="n3-progress"><i style="width:'+progress.percent+'%"></i></div>';
  b.addEventListener("click",()=>openSubject(sub.name));target.append(b);
 }
}
function openSubject(subject){
 chosenSubject=subject;
 if($("subjectFilter")){
  $("subjectFilter").value=subject;
  $("subjectFilter").dispatchEvent(new Event("change",{bubbles:true}));
 }
 if(typeof showView==="function")showView("trilha");
}
function renderRoute(){
 const next=unfinished(chosenSubject)||unfinished();
 const root=$("n3Route");
 if(!next){root.innerHTML='<strong>🏆 Sua trilha está completa!</strong><p>Explore o arcade ou revise seus cartões.</p>';return}
 root.innerHTML='<small class="n3-muted">'+escapeText(next.subject)+' • '+escapeText(next.chapter)+'</small><strong>'+escapeText(next.topic)+'</strong><p>Estude este assunto e marque como concluído na trilha.</p>';
}
function missionLabels(){
 const next=unfinished(chosenSubject)||unfinished();
 return [next?"Ler e praticar: "+next.topic:"Revisar algum tópico já estudado",
 "Resolver questões na aba Simulados ou Arena",
 "Revisar cartões de memória ou criar um resumo"];
}
function renderMission(){
 const root=$("n3Mission");root.replaceChildren();
 const completed=safeArray(storedMission());
 const labels=missionLabels();
 labels.forEach((title,i)=>{
  const label=document.createElement("label");label.className="n3-task";
  const input=document.createElement("input");input.type="checkbox";input.checked=completed.includes(i);
  input.addEventListener("change",()=>{
   const missions=safeMap(data.missions);
   let done=safeArray(missions[DAY()]).filter(x=>Number.isInteger(x)&&x>=0&&x<3);
   if(input.checked&&!done.includes(i))done.push(i);
   if(!input.checked)done=done.filter(x=>x!==i);
   missions[DAY()]=done;data.missions=missions;
   if(done.length===3){
    const rewarded=safeMap(data.dailyRewards);
    if(!rewarded[DAY()]){
     rewarded[DAY()]=true;data.dailyRewards=rewarded;
     data.xp=Math.max(0,Number(data.xp)||0)+30;
     msg("🌟 Missão concluída! Você ganhou 30 XP pela primeira conclusão de hoje.");
    }
   }
   write();renderMission();renderStats();renderCity();renderBadges();
  });
  const text=document.createElement("span");text.textContent=title;
  label.append(input,text);root.append(label);
 });
 const percent=Math.round(completed.length/3*100);
 $("n3MissionBar").style.width=percent+"%";
 $("n3MissionStatus").textContent=completed.length+" de 3 etapas realizadas hoje"+(safeMap(data.dailyRewards)[DAY()]?" • +30 XP conquistados":"");
}
function renderRadar(){
 const root=$("n3Radar");root.replaceChildren();
 let events=[];
 try{if(typeof calendarLoad==="function")events=calendarLoad()}catch(_){}
 const today=DAY();const next=safeArray(events).filter(e=>typeof e.date==="string"&&e.date>=today&&typeof e.task==="string").sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);
 if(!next.length){const p=document.createElement("p");p.className="n3-muted";p.textContent="Nenhuma tarefa futura cadastrada. Adicione suas próximas provas e atividades ao calendário.";root.append(p);return}
 const ul=document.createElement("ul");ul.className="n3-note-list";
 next.forEach(e=>{const li=document.createElement("li");li.textContent=e.date.split("-").reverse().join("/")+" • "+e.task;ul.append(li)});root.append(ul);
}
function renderNotes(){
 const ul=$("n3Notes");ul.replaceChildren();
 const notes=safeArray(data.notes).filter(n=>typeof n==="string").slice(-8);
 if(!notes.length){const li=document.createElement("li");li.className="n3-muted";li.textContent="Sua mochila está vazia.";ul.append(li);return}
 notes.forEach((note,index)=>{
  const li=document.createElement("li");li.textContent=note;
  const b=document.createElement("button");b.type="button";b.textContent="✕";b.setAttribute("aria-label","Excluir lembrete: "+note);
  b.addEventListener("click",()=>{data.notes=notes.filter((_,i)=>i!==index);write();renderNotes()});
  li.append(b);ul.append(li);
 });
}
function renderCity(){
 const buildings=[["🏠",0,"Casa"],["🏫",30,"Escola"],["🌳",60,"Parque"],["🏰",100,"Castelo"],["🚀",160,"Centro espacial"]];
 const xp=Math.max(0,Number(data.xp)||0);
 $("n3City").replaceChildren();
 buildings.forEach(([icon,min,label])=>{
  const b=document.createElement("span");b.className="n3-building"+(xp>=min?" unlocked":"");b.textContent=icon;b.title=label+" • "+min+" XP";$("n3City").append(b);
 });
 const next=buildings.find(b=>xp<b[1]);
 $("n3CityStatus").textContent=next?("Próxima construção: "+next[2]+" com "+next[1]+" XP. Faltam "+(next[1]-xp)+" XP."):"Sua cidade está completa! Continue estudando por você.";
}
function renderBadges(){
 const root=$("n3Badges");root.replaceChildren();
 const done=currentDone().length;
 const wins=Object.keys(safeMap(data.bossRewards)).length;
 const reviews=Object.values(storedFlash()).filter(x=>x&&Number(x.box)>0).length;
 const badges=[["🌱 Primeiros passos",done>=1],["📚 10 tópicos",done>=10],["⚔️ Primeiro chefão",wins>=1],["🃏 Memória em dia",reviews>=4],["🏡 Construtor",Number(data.xp)>=60]];
 badges.forEach(([title,on])=>{const n=document.createElement("span");n.className="n3-medal"+(on?" unlocked":"");n.textContent=(on?"✓ ":"🔒 ")+title;root.append(n)});
}
function shuffled(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function bossStart(){
 const s=$("n3BossSubject").value,pool=shuffled(questionPool(s)).slice(0,5);
 if(!pool.length){msg("Ainda não há perguntas cadastradas para esta matéria.");return}
 boss={questions:pool,position:0,correct:0,answered:false,active:true};
 $("n3Monster").textContent="🐉";$("n3BossBar").style.width="100%";renderBoss();
}
function renderBoss(){
 const root=$("n3BossAnswers");root.replaceChildren();
 const done=boss.position>=boss.questions.length;
 $("n3BossNext").hidden=true;
 if(!boss.active&&!boss.questions.length)return;
 if(done){
  boss.active=false;
  $("n3BossTitle").textContent="🏆 Batalha encerrada!";
  $("n3BossQuestion").textContent="Você acertou "+boss.correct+" de "+boss.questions.length+" questões.";
  $("n3BossFeedback").textContent=boss.correct>=3?"Missão cumprida!":"Você pode tentar de novo e revisar os conteúdos.";
  $("n3Monster").textContent=boss.correct>=3?"🏆":"🐉";
  const key=DAY()+"|"+$("n3BossSubject").value;
  const rewards=safeMap(data.bossRewards);
  if(boss.correct>=3&&!rewards[key]){rewards[key]=true;data.bossRewards=rewards;data.xp=Math.max(0,Number(data.xp)||0)+20;write();renderStats();renderCity();renderBadges();msg("⚔️ Você conquistou 20 XP nesta batalha!")}
  return;
 }
 const q=boss.questions[boss.position];
 $("n3BossTitle").textContent="⚔️ Rodada "+(boss.position+1)+" de "+boss.questions.length+" • "+boss.correct+" acertos";
 $("n3BossQuestion").textContent=q.q;
 $("n3BossFeedback").textContent="Escolha a resposta. Cada acerto diminui a força do chefão.";
 q.o.forEach((option,i)=>{
  const button=document.createElement("button");button.type="button";button.className="n3-answer";button.textContent=String(i+1)+". "+option;
  button.addEventListener("click",()=>bossAnswer(i));
  root.append(button);
 });
}
function bossAnswer(index){
 if(!boss.active||boss.answered)return;
 boss.answered=true;
 const q=boss.questions[boss.position],right=index===q.a;
 if(right)boss.correct++;
 $("n3BossBar").style.width=(100-100*boss.correct/boss.questions.length)+"%";
 $("n3BossFeedback").textContent=(right?"✅ Resposta correta! ":"💡 Continue tentando! ")+(q.e||"");
 [...$("n3BossAnswers").querySelectorAll("button")].forEach((b,i)=>{b.disabled=true;if(i===q.a)b.classList.add("correct");else if(i===index)b.classList.add("wrong")});
 $("n3BossNext").hidden=false;
 $("n3BossNext").textContent=boss.position===boss.questions.length-1?"Ver resultado →":"Próxima questão →";
}
function bossNext(){if(!boss.active||!boss.answered)return;boss.position++;boss.answered=false;renderBoss()}
function selectFlash(){
 const subject=$("n3FlashSubject").value;
 const bank=cards(subject),mem=storedFlash(),now=Date.now();
 const due=bank.map((row,index)=>({row,index,key:subject+"|"+index,meta:mem[subject+"|"+index]})).filter(c=>!c.meta?.next||Number(c.meta.next)<=now);
 if(!due.length){currentFlash=null;flashShown=false;$("n3FlashCard").textContent="🎉 Tudo revisado por enquanto!";$("n3FlashStatus").textContent="Você terminou os cartões desta matéria. Volte na próxima revisão.";return}
 currentFlash=due[0];flashShown=false;
 $("n3FlashCard").textContent=currentFlash.row[0];$("n3FlashStatus").textContent=due.length+" cartão(ões) para revisar agora • toque para ver a resposta.";
}
function flashFlip(){if(!currentFlash)return;flashShown=true;$("n3FlashCard").textContent=currentFlash.row[1];$("n3FlashStatus").textContent="Você lembrou a resposta sem olhar? Escolha uma avaliação."}
function flashRate(good){
 if(!currentFlash){msg("Todos os cartões dessa matéria já foram revisados.");return}
 if(!flashShown){msg("Vire o cartão antes de avaliar sua lembrança.");return}
 const nextMem=storedFlash();
 const old=safeMap(nextMem[currentFlash.key]);
 const box=good?Math.min(5,(Number(old.box)||0)+1):0;
 const intervals=[1,3,7,15,30];
 const days=good?intervals[box-1]:1;
 nextMem[currentFlash.key]={box,next:Date.now()+days*86400000};
 data.flash=nextMem;write();
 selectFlash();renderStats();renderBadges();
 msg(good?"🃏 Muito bem! Este cartão será revisado em "+days+" dia(s).":"🔁 Cartão agendado para rever amanhã.");
}
function randomStudy(){
 const incomplete=[];
 subjects.forEach(s=>s.topics.forEach(g=>g[1].forEach(topic=>{
  if(!currentDone().includes(s.name+"|"+topic))incomplete.push({subject:s.name,topic});
 })));
 if(!incomplete.length){msg("Você já concluiu a trilha! Que tal revisar os flashcards?");return}
 const random=incomplete[Math.floor(Math.random()*incomplete.length)];
 msg("🎲 O Neo escolheu: "+random.subject+" • "+random.topic);
 openSubject(random.subject);
}
function refresh(){
 if(!$("neoCentral30"))return;
 if(classNow()!==loadedClass){loadedClass=classNow();data=load();chosenSubject=subjects[0].name;boss={questions:[],position:0,correct:0,answered:false,active:false};$("n3BossAnswers").replaceChildren();$("n3BossTitle").textContent="O Guardião dos Desafios aguarda!";$("n3BossQuestion").textContent="Inicie uma batalha para esta matéria.";$("n3BossNext").hidden=true;$("n3BossFeedback").textContent="";$("n3BossBar").style.width="100%";$("n3Monster").textContent="🐉";}
 renderStats();renderWorlds();renderRoute();renderMission();renderRadar();renderNotes();renderCity();renderBadges();
}
$("neoCentral30").addEventListener("click",e=>{
 const go=e.target.closest("[data-n3-go]");if(go){if(typeof showView==="function")showView(go.dataset.n3Go);return}
 const button=e.target.closest("button[data-n3]");if(!button)return;
 switch(button.dataset.n3){
  case "random":randomStudy();break;
  case "next":{const t=unfinished(chosenSubject)||unfinished();if(t)openSubject(t.subject);else msg("Sua trilha está completa.");break}
  case "bossStart":bossStart();break;
  case "bossNext":bossNext();break;
  case "flashFlip":flashFlip();break;
  case "flashAgain":flashRate(false);break;
  case "flashGood":flashRate(true);break;
  case "addNote":{
   const input=$("n3NoteInput"),value=input.value.trim().replace(/\s+/g," ");
   if(!value){msg("Escreva um lembrete antes de guardar.");return}
   data.notes=safeArray(data.notes).filter(x=>typeof x==="string").slice(-7).concat(value);
   input.value="";write();renderNotes();msg("🎒 Lembrete guardado neste navegador.");break
  }
 }
});
$("n3NoteInput").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();$("neoCentral30").querySelector('[data-n3="addNote"]').click()}});
$("n3FlashSubject").addEventListener("change",selectFlash);
$("n3BossSubject").addEventListener("change",()=>{boss={questions:[],position:0,correct:0,answered:false,active:false};$("n3BossAnswers").replaceChildren();$("n3BossTitle").textContent="O Guardião dos Desafios aguarda!";$("n3BossQuestion").textContent="Inicie uma batalha para esta matéria.";$("n3BossFeedback").textContent="";$("n3BossNext").hidden=true;$("n3BossBar").style.width="100%";$("n3Monster").textContent="🐉"});
document.addEventListener("portal8:viewchange",e=>{if(e.detail?.id==="neoCentral30"){refresh();selectFlash()}});
refresh();selectFlash();
window.neoCentral30={refresh};
})();
