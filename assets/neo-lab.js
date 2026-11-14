/* Neo Lab v27 — ferramentas pessoais, gratuitas e sem API.
 * Novas ideias complementares; não substituem a lista original de 20 ideias.
 * Sem dados sensíveis e sem envio para a nuvem.
 */
(() => {
 "use strict";
 const $=id=>document.getElementById(id);
 const GROUP="neo-lab-27-";
 const lessons=[
  ["Matemática","O que significa calcular uma porcentagem?","Encontrar uma parte de 100 unidades. Por exemplo, 25% de 80 é 20."],
  ["Matemática","Qual é a função da média aritmética?","Representar a soma dos valores dividida pela quantidade de valores."],
  ["Matemática","O que é uma variável numa equação?","É um símbolo, como x, que representa um valor desconhecido."],
  ["Português","Qual é a função de uma tese em um texto argumentativo?","Apresentar a posição central que será defendida com argumentos."],
  ["Português","O que é coesão textual?","É a conexão entre palavras, frases e ideias para dar continuidade ao texto."],
  ["História","O que foi o Primeiro Reinado no Brasil?","Foi o período imperial de 1822 a 1831, quando D. Pedro I governou o Brasil."],
  ["História","O que é uma fonte histórica?","Um vestígio ou registro usado para investigar e compreender o passado."],
  ["Geografia","Qual a diferença entre clima e tempo atmosférico?","Tempo é a condição do momento; clima descreve padrões observados por longos períodos."],
  ["Geografia","O que é densidade demográfica?","É a quantidade de habitantes em relação à área de um território."],
  ["Ciências","Qual é a função principal dos glóbulos vermelhos?","Transportar oxigênio pelo corpo com a ajuda da hemoglobina."],
  ["Ciências","O que significa biodiversidade?","É a variedade de seres vivos e formas de vida em um ambiente ou na Terra."],
  ["Inglês","Quando usamos o Simple Past?","Para falar de acontecimentos e ações concluídos no passado."],
  ["Inglês","Como o Present Perfect é normalmente formado?","Com have ou has, seguido do particípio passado do verbo."],
  ["Arte","O que é composição visual?","É a organização de elementos como formas, cores e linhas numa imagem."]
 ];
 const glossary=[
  ["Porcentagem","Razão expressa em centésimos (%).","Matemática"],
  ["Média aritmética","Soma dos valores dividida pela quantidade de valores.","Matemática"],
  ["Equação","Igualdade que pode conter um valor desconhecido.","Matemática"],
  ["Probabilidade","Medida da chance de um acontecimento ocorrer.","Matemática"],
  ["Tese","Posição central defendida em um texto argumentativo.","Português"],
  ["Coesão","Ligação entre as partes de um texto.","Português"],
  ["Argumento","Razão usada para defender uma ideia.","Português"],
  ["Fonte histórica","Documento, objeto, imagem ou relato que ajuda a estudar o passado.","História"],
  ["Primeiro Reinado","Período do Brasil imperial de 1822 a 1831.","História"],
  ["Densidade demográfica","Número de habitantes dividido pela área de um território.","Geografia"],
  ["Tempo atmosférico","Condições da atmosfera em determinado momento.","Geografia"],
  ["Clima","Padrões de tempo atmosférico observados ao longo de anos.","Geografia"],
  ["Biodiversidade","Variedade de formas de vida.","Ciências"],
  ["Célula","Unidade estrutural e funcional fundamental dos seres vivos.","Ciências"],
  ["Ecossistema","Conjunto de organismos e fatores do ambiente em interação.","Ciências"],
  ["Simple Past","Tempo verbal usado, em geral, para ações concluídas no passado.","Inglês"],
  ["Present Perfect","Tempo verbal formado por have/has e particípio passado.","Inglês"],
  ["Composição","Organização de elementos visuais ou artísticos.","Arte"]
 ];
 const proposals=[
  {id:"a",stars:3,title:"Banco de exercícios por dificuldade",detail:"Níveis iniciante, intermediário e avançado, revistos por matéria."},
  {id:"b",stars:3,title:"Revisões ligadas às provas publicadas",detail:"Ligação automática entre as datas oficiais e as atividades de revisão."},
  {id:"c",stars:3,title:"Sincronização opcional dos dados de estudo",detail:"Backup privado entre dispositivos, com consentimento e proteção de dados."},
  {id:"d",stars:3,title:"Painel de acessibilidade ainda mais completo",detail:"Ajuste de espaçamento, contraste e leitura para diferentes necessidades."},
  {id:"e",stars:2,title:"Biblioteca de exemplos resolvidos",detail:"Exemplos contextualizados, revisados e organizados por matéria."},
  {id:"f",stars:2,title:"Cartões personalizados pelo aluno",detail:"Criar, revisar e exportar cartões próprios sem publicar informações pessoais."},
  {id:"g",stars:2,title:"Modo apresentação de resumos",detail:"Exibir anotações em cartões grandes para estudar com os colegas."},
  {id:"h",stars:2,title:"Trilha de recuperação de conteúdo",detail:"Sugestões de revisão para assuntos que ainda geram dúvidas."},
  {id:"i",stars:1,title:"Temas decorativos por estação",detail:"Detalhes visuais próprios do portal, sem interferir na leitura."},
  {id:"j",stars:1,title:"Animações comemorativas do Neo",detail:"Pequenas reações opcionais ao concluir uma revisão."},
  {id:"k",stars:1,title:"Cartaz de estudos imprimível",detail:"Resumo semanal simples, sem nome ou dados pessoais."},
  {id:"l",stars:1,title:"Atalhos favoritos na página inicial",detail:"Acessar as ferramentas preferidas com menos cliques."}
 ];
 const bag=["Caderno","Estojo e lápis","Livros do dia","Agenda escolar","Material solicitado","Garrafa de água"];
 let selectedQuestion=null,speech=null;
 const key=part=>GROUP+part+"-"+(typeof portal8Turma==="string"?portal8Turma:"geral");
 const read=(part,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key(part)));return v??fallback}catch(e){return fallback}};
 const save=(part,val)=>{try{localStorage.setItem(key(part),JSON.stringify(val));return true}catch(e){return false}};
 const set=(id,text)=>{const node=$(id);if(node)node.textContent=text};
 const normal=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 const dashes="—";
 function initPlan(){
  const stored=read("planner",{});
  document.querySelectorAll("#neoWeekPlanner [data-weekday]").forEach(input=>{
   input.value=String(stored[input.dataset.weekday]||"").slice(0,90);
  });
  $("neoWeekSave")?.addEventListener("click",()=>{
   const out={};
   document.querySelectorAll("#neoWeekPlanner [data-weekday]").forEach(input=>{
    out[input.dataset.weekday]=input.value.trim().slice(0,90);
   });
   set("neoWeekStatus",save("planner",out)?"✅ Plano semanal salvo neste navegador.":"Não foi possível salvar neste navegador.");
  });
 }
 function initBag(){
  const node=$("neoBagList");if(!node)return;
  const stored=new Set(read("bag",[]));
  node.replaceChildren();
  bag.forEach(name=>{
   const label=document.createElement("label");label.className="neo-check-row";
   const input=document.createElement("input");input.type="checkbox";input.checked=stored.has(name);
   const span=document.createElement("span");span.textContent=name;
   input.addEventListener("change",()=>{
    const next=new Set(read("bag",[]));input.checked?next.add(name):next.delete(name);
    save("bag",Array.from(next));set("neoBagStatus",next.size+" de "+bag.length+" itens conferidos.");
   });
   label.append(input,span);node.append(label);
  });
  set("neoBagStatus",stored.size+" de "+bag.length+" itens conferidos.");

 }
 function showGlossary(){
  const q=normal($("neoGlossaryInput")?.value).trim();
  const data=glossary.filter(x=>!q||normal(x.join(" ")).includes(q)).slice(0,12);
  const container=$("neoGlossaryResults");if(!container)return;container.replaceChildren();
  if(!data.length){container.textContent="Nenhum termo encontrado. Tente outra palavra.";return}
  for(const [term,description,subject] of data){
   const item=document.createElement("div");item.className="neo-output";
   const strong=document.createElement("strong");strong.textContent=term+" · "+subject;
   const paragraph=document.createElement("p");paragraph.style.margin="4px 0 0";paragraph.textContent=description;
   item.append(strong,paragraph);container.append(item);
  }
 }
 function gradeCalculator(){
  const values=($("neoGradeNumbers")?.value||"").split(/[;\n\s]+/).map(x=>x.trim()).filter(Boolean);
  if(!values.length)return set("neoGradeOutput","Digite de duas a dez notas separadas por espaço ou ponto e vírgula.");
  const nums=values.map(x=>Number(x.replace(",",".")));
  if(nums.length<2||nums.length>10||nums.some(x=>!Number.isFinite(x)||x<0||x>12)){
   return set("neoGradeOutput","Digite entre 2 e 10 valores válidos de 0 a 12. Exemplo: 8; 9,5; 10.");
  }
  const mean=nums.reduce((a,b)=>a+b,0)/nums.length;
  set("neoGradeOutput","Média aritmética: "+mean.toLocaleString("pt-BR",{maximumFractionDigits:2})+".\nSoma: "+nums.reduce((a,b)=>a+b,0).toLocaleString("pt-BR")+", dividida por "+nums.length+".\nÉ apenas uma simulação, não uma nota oficial.");
 }
 function mindMap(){
  const main=($("neoMindTitle")?.value||"").trim().slice(0,80);
  const topics=[0,1,2,3].map(i=>($("neoMind"+i)?.value||"").trim().slice(0,90)).filter(Boolean);
  if(!main)return set("neoMindOutput","Escreva primeiro o tema central.");
  const lines=["🌟 "+main,...topics.map((x,i)=>"  "+(i===topics.length-1?"└":"├")+"─ "+x)];
  set("neoMindOutput",lines.join("\n")+"\n\nUse as ramificações para organizar as ideias. Você pode copiar o resultado.");
 }
 function pickQuestion(){
  const selected=$("neoQuestionSubject")?.value||"Todas";
  const pool=lessons.filter(q=>selected==="Todas"||q[0]===selected);
  if(!pool.length)return set("neoQuestionOutput","Nenhuma pergunta disponível para essa matéria.");
  selectedQuestion=pool[Math.floor(Math.random()*pool.length)];
  set("neoQuestionOutput","🧠 "+selectedQuestion[0]+": "+selectedQuestion[1]+"\n\nTente responder antes de revelar a resposta.");
 }
 function revealQuestion(){set("neoQuestionOutput",selectedQuestion?"💡 "+selectedQuestion[1]+"\n\n"+selectedQuestion[2]:"Clique em Nova pergunta primeiro.")}
 function stopSpeech(){if("speechSynthesis" in window)window.speechSynthesis.cancel();speech=null;}
 function speak(){
  const text=($("neoReadText")?.value||"").trim();
  if(!text)return set("neoReadStatus","Cole ou escreva o texto que quer ouvir.");
  if(!("speechSynthesis" in window))return set("neoReadStatus","Este navegador não oferece leitura em voz alta.");
  stopSpeech();
  speech=new SpeechSynthesisUtterance(text.slice(0,2500));speech.lang="pt-BR";speech.rate=.95;
  speech.onend=()=>set("neoReadStatus","Leitura concluída.");
  speech.onerror=()=>set("neoReadStatus","Não foi possível reproduzir o texto neste dispositivo.");
  window.speechSynthesis.speak(speech);set("neoReadStatus","🔊 Lendo o texto com a voz disponível no aparelho.");
 }
 function findTools(){
  const term=normal($("neoToolQuery")?.value||"").trim();
  const container=$("neoToolResults");if(!container)return;container.replaceChildren();
  if(!term){container.textContent="Digite parte do nome de uma ferramenta.";return}
  const matches=[...document.querySelectorAll("nav .navbtn[data-view]")].filter(x=>normal(x.textContent).includes(term)).slice(0,10);
  if(!matches.length){container.textContent="Nenhuma ferramenta encontrada.";return}
  for(const match of matches){
   const button=document.createElement("button");button.type="button";
   button.textContent=match.textContent.trim();button.addEventListener("click",()=>{
    if(typeof showView==="function")showView(match.dataset.view);
   });container.append(button);
  }
 }
 function miniPlan(){
  const subject=$("neoMicroSubject")?.value||"Matemática";
  const mins=Number($("neoMicroMinutes")?.value||20);
  if(![10,15,20,30].includes(mins))return;
  const intro=Math.max(3,Math.round(mins*.2)),practice=Math.max(4,Math.round(mins*.5)),check=mins-intro-practice;
  set("neoMicroOutput","📘 Plano de "+mins+" minutos para "+subject+"\n\n1. "+intro+" min — releia um tópico.\n2. "+practice+" min — tente questões ou cartões sem consultar.\n3. "+check+" min — confira respostas, anote dúvidas e faça uma pausa.\n\nAdapte o plano à sua rotina.");
 }
 function initPriority(){
  const root=$("neoPriorityList");if(!root)return;root.replaceChildren();
  const selected=new Set(read("future",[]));
  for(const p of proposals){
   const label=document.createElement("label");label.className="neo-priority-item";
   const input=document.createElement("input");input.type="checkbox";input.value=p.id;input.checked=selected.has(p.id);
   const detail=document.createElement("div");
   const h=document.createElement("strong");h.textContent=p.title;
   const small=document.createElement("small");small.textContent=p.detail;
   const stars=document.createElement("span");stars.className="neo-priority-stars";stars.textContent="⭐".repeat(p.stars);
   detail.append(h,small);label.append(input,stars,detail);root.append(label);
  }
  $("neoPrioritySave")?.addEventListener("click",()=>{
   const chosen=[...root.querySelectorAll("input:checked")].map(x=>x.value);
   save("future",chosen);
   set("neoPriorityStatus","✅ "+chosen.length+" ideias selecionadas neste navegador. Marcar não publica nem instala uma função; serve para planejar as próximas versões.");
  });
 }
 function init(){
  if(!$("neoLab"))return;
  initPlan();initBag();showGlossary();initPriority();
  $("neoBagReset")?.addEventListener("click",()=>{save("bag",[]);initBag()});
  $("neoGlossaryInput")?.addEventListener("input",showGlossary);
  $("neoGradeButton")?.addEventListener("click",gradeCalculator);
  $("neoMindButton")?.addEventListener("click",mindMap);
  $("neoMindCopy")?.addEventListener("click",()=>{
   const text=$("neoMindOutput")?.textContent||"";
   if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>set("neoMindCopyStatus","Copiado!")).catch(()=>set("neoMindCopyStatus","Selecione e copie o texto manualmente."));
   else set("neoMindCopyStatus","Selecione e copie o texto manualmente.");
  });
  $("neoQuestionNew")?.addEventListener("click",pickQuestion);
  $("neoQuestionReveal")?.addEventListener("click",revealQuestion);
  $("neoReadStart")?.addEventListener("click",speak);
  $("neoReadStop")?.addEventListener("click",()=>{stopSpeech();set("neoReadStatus","Leitura interrompida.")});
  $("neoToolQuery")?.addEventListener("input",findTools);
  $("neoMicroButton")?.addEventListener("click",miniPlan);
  document.addEventListener("portal8:viewchange",e=>{if(e.detail?.id!=="neoLab")stopSpeech()});
  window.addEventListener("pagehide",stopSpeech);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();