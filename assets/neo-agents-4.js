/* Neo 4.0 — agentes locais especializados. Não são modelos generativos.
   Sem coleta de nomes, sem requisições de IA, sem acesso administrativo. */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const classNow=()=>typeof portal8Turma!=="undefined"?portal8Turma:"803";
const key=()=> "neo-agents-4-v1-"+classNow();
const defaultConfig={theme:"auto",quality:"auto",assist:"normal"};
let config=read(),round={correct:0,wrong:0,streak:0,rounds:0},loadedClass=classNow();
function read(){try{return {...defaultConfig,...JSON.parse(localStorage.getItem(key())||"{}")}}catch(_){return {...defaultConfig}}}
function syncClass(){if(loadedClass!==classNow()){loadedClass=classNow();config=read();round={correct:0,wrong:0,streak:0,rounds:0}}}
function save(){try{localStorage.setItem(key(),JSON.stringify(config))}catch(_){}}
function topics(){return typeof subjects!=="undefined"?subjects:[]}
function exams(){try{return typeof calendarLoad==="function"?calendarLoad():[]}catch(_){return []}}
function done(){return typeof state!=="undefined"&&Array.isArray(state.done)?state.done:[]}
function pending(){for(const s of topics())for(const g of s.topics)for(const t of g[1])if(!done().includes(s.name+"|"+t))return {subject:s.name,topic:t};return null}
function accuracy(){return typeof state!=="undefined"&&Number(state.answered)>0?Math.round(100*Math.max(0,Number(state.correct)||0)/state.answered):null}
function subjectNames(){return topics().map(s=>s.name)}
function nextExam(){const today=new Date().toISOString().slice(0,10);return exams().filter(e=>e&&e.date>=today&&typeof e.task==="string").sort((a,b)=>a.date.localeCompare(b.date))[0]||null}
const specialists=[
 {id:"tutor",icon:"🎓",title:"Neo Tutor",caption:"Explicações e exercícios",tool:"assistente"},
 {id:"review",icon:"🧠",title:"Neo Review",caption:"Revisão espaçada",tool:"cartoes"},
 {id:"planner",icon:"📅",title:"Neo Planner",caption:"Planejamento de estudos",tool:"calendario"},
 {id:"game",icon:"🎮",title:"Neo Game Master",caption:"Dificuldade das partidas",tool:"neoGames40"},
 {id:"render",icon:"🎨",title:"Neo Render",caption:"Visual dos jogos",tool:"neoGames40"},
 {id:"progress",icon:"🏆",title:"Neo Progress",caption:"Evolução e metas",tool:"neoCentral30"},
 {id:"creator",icon:"🪄",title:"Neo Creator",caption:"Criação de materiais",tool:"neoOficina"}
];
function recommendation(agent){
 syncClass();
 const p=pending(),acc=accuracy(),exam=nextExam(),total=done().length;
 switch(agent){
 case "tutor":return p?{title:"Vamos entender "+p.subject,body:"Próximo conteúdo da trilha: "+p.topic+". Você pode abrir o tutor para receber explicações sobre conteúdos já cadastrados.",tool:"assistente"}:{title:"Aprendizagem em dia",body:"Explore uma dúvida no tutor ou faça uma atividade para encontrar seu próximo desafio.",tool:"assistente"};
 case "review":return {title:"Revisão que acompanha você",body:"Os flashcards da Central Neo 3.0 já usam intervalos de revisão. Comece pelos cartões que estão disponíveis e marque o que lembrou.",tool:"neoCentral30"};
 case "planner":return exam?{title:"Próxima tarefa: "+exam.task,body:"Você registrou esta atividade para "+exam.date.split("-").reverse().join("/")+". Divida sua preparação em pequenos blocos de estudo.",tool:"calendario"}:{title:"Monte sua próxima semana",body:"Registre provas e tarefas no calendário e reserve sessões curtas para leitura, questões e revisão.",tool:"calendario"};
 case "game":return {title:round.wrong>round.correct?"Modo apoio sugerido":round.streak>=3?"Desafio avançado sugerido":"Jogue no seu ritmo",body:"O Game Master usa acertos e erros da partida atual para ajustar o desafio. "+(p?"Matéria sugerida: "+p.subject+". ":"")+"Nenhuma nota individual é publicada.",tool:"neoGames40"};
 case "render":return {title:"Cenários renderizados em tempo real",body:"No estúdio de jogos, Neo Render controla cenário temático, efeitos, paleta e nível de detalhes. O 3D é desenhado em WebGL; o retrô usa Canvas 2D pixelado. Não é geração de imagens por modelo de IA.",tool:"neoGames40"};
 case "progress":return {title:total+" tópicos marcados",body:acc===null?"Comece a responder exercícios para acompanhar seu desempenho.":("Seu aproveitamento acumulado nas questões do portal é de "+acc+"%. O importante é usar os resultados para escolher a próxima revisão."),tool:"neoCentral30"};
 case "creator":return {title:"Transforme conhecimento em criação",body:"Abra a Oficina para fazer cartões, esquemas e atividades usando os recursos existentes. Antes de compartilhar com a turma, revise as informações.",tool:"neoOficina"};
 default:return {title:"Escolha um assistente",body:"Selecione uma área para receber orientações locais.",tool:"neoCentral30"};
 }
}
function power(){
 syncClass();
 if(config.assist==="off")return 1;
 const attempts=round.correct+round.wrong;
 if(attempts<2)return 1;
 const rate=round.correct/attempts;
 if(rate<.45)return config.assist==="light"?.94:.82;
 if(rate>.80&&round.streak>=3)return config.assist==="light"?1.05:1.13;
 return 1;
}
function themeFor(subject){
 syncClass();
 if(config.theme!=="auto")return config.theme;
 const s=String(subject||"").toLowerCase();
 if(/ciênc|biolog|célul/.test(s))return "forest";
 if(/portugu|histór|arte/.test(s))return "sunset";
 return "neon";
}
function quality(){
 syncClass();
 return config.quality;
}
const api={
 specialists,
 recommendation,
 get config(){syncClass();return {...config}},
 get round(){return {...round}},
 set(name,value){
  syncClass();
  const valid={theme:["auto","neon","forest","sunset"],quality:["auto","high","economy"],assist:["normal","light","off"]};
  if(!valid[name]?.includes(value))return false;
  config[name]=value;save();document.dispatchEvent(new CustomEvent("neo4:config",{detail:{...config}}));return true;
 },
 start(){round={correct:0,wrong:0,streak:0,rounds:round.rounds+1};document.dispatchEvent(new Event("neo4:score"))},
 record(correct){if(correct){round.correct++;round.streak++}else{round.wrong++;round.streak=0}document.dispatchEvent(new Event("neo4:score"))},
 difficulty:power,themeFor,quality
};
window.neoAgentCore=api;
function renderHub(){
 const root=$("neoIAs40");if(!root)return;
 root.innerHTML=
 '<div class="n4-ai-hero"><span class="n4-label">✦ NEO 4.0 • ASSISTENTES ESPECIALIZADOS</span><h2>🤖 Central de Inteligência Neo</h2><p>Sete assistentes para ajudar a estudar, revisar, criar e jogar. Todas as recomendações desta versão são calculadas no seu navegador.</p></div>'+
 '<div id="n4AgentsGrid" class="n4-agents-grid" role="group" aria-label="Escolher assistente"></div>'+
 '<div class="n4-ai-detail"><h3 id="n4AgentTitle">Escolha seu assistente</h3><p id="n4AgentResult" aria-live="polite"></p><div class="n4-ai-actions"><button type="button" class="n4-action primary" id="n4AgentGo">Abrir ferramenta</button><button type="button" class="n4-action" id="n4AgentRefresh">↻ Atualizar sugestão</button></div></div>'+
 '<p class="n4-ai-disclaimer">Transparência: estes módulos são <strong>sistemas adaptativos locais baseados em regras</strong>, não modelos de IA generativa. Nenhuma senha, conversa ou nota pessoal é enviada a serviços de IA. O acesso administrativo continua protegido separadamente.</p>';
 const grid=$("n4AgentsGrid");
 let current="game";
 specialists.forEach(a=>{
  const button=document.createElement("button");button.type="button";button.className="n4-agent";
  button.dataset.agent=a.id;
  const icon=document.createElement("span");icon.className="n4-agent-icon";icon.textContent=a.icon;
  const label=document.createElement("strong");label.textContent=a.title;
  const hint=document.createElement("small");hint.textContent=a.caption;
  button.append(icon,label,hint);
  button.addEventListener("click",()=>choose(a.id));grid.append(button);
 });
 function choose(id){
  current=id;const a=specialists.find(x=>x.id===id),r=recommendation(id);
  grid.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.agent===id)));
  $("n4AgentTitle").textContent=a.icon+" "+r.title;
  $("n4AgentResult").textContent=r.body;
  $("n4AgentGo").onclick=()=>{if(typeof showView==="function")showView(r.tool)};
 }
 $("n4AgentRefresh").addEventListener("click",()=>choose(current));
 choose(current);
 document.addEventListener("portal8:viewchange",e=>{if(e.detail?.id==="neoIAs40")choose(current)});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",renderHub,{once:true});else renderHub();
})();