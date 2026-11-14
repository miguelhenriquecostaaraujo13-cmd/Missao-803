/* Ateliê Neo — 12 protótipos de avaliação em modo proprietário.
 * Nada desta versão envia dados novos à nuvem; a sincronização é uma demonstração local.
 */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const labStore="neo-admin-lab-v29-";
const get=(key,def)=>{try{return JSON.parse(localStorage.getItem(labStore+key))??def}catch(_){return def}};
const put=(key,value)=>{try{localStorage.setItem(labStore+key,JSON.stringify(value));return true}catch(_){return false}};
const make=(tag,parent,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;parent?.append(el);return el};
const row=(parent,title,description)=>{
 const section=make("section",parent,undefined,"neo-tool neo-prototype");
 make("h3",section,title);make("p",section,description);
 return section;
};
const label=(parent,text,ctrl)=>{const l=make("label",parent,text);l.append(ctrl);return ctrl};
const input=(type,placeholder)=>{const e=document.createElement("input");e.type=type;e.placeholder=placeholder||"";e.maxLength=500;return e};
const button=(parent,text,fn)=>{const e=make("button",parent,text,"btn light");e.type="button";e.addEventListener("click",fn);return e};
const output=parent=>make("div",parent,"Pronto para experimentar.","neo-output");
const select=(values)=>{const e=document.createElement("select");values.forEach((v)=>e.append(new Option(v,v)));return e};
const subjectsList=()=>typeof subjects!=="undefined"&&Array.isArray(subjects)?subjects.map(s=>s.name):["Matemática","Língua Portuguesa","Ciências"];
function lessonBank(){return typeof quizzes!=="undefined"&&Array.isArray(quizzes)?quizzes.filter(x=>x.q&&Array.isArray(x.o)&&Number.isInteger(x.a)) : []}
function addDifficulty(root){
 const box=row(root,"⭐⭐⭐ Banco de questões por dificuldade","Teste perguntas do acervo oficial do portal. Os níveis são faixas estimadas para este protótipo, não dificuldade avaliada pelos professores.");
 const subject=label(box,"Matéria",select(["Todas",...subjectsList()]));
 const level=label(box,"Nível de teste",select(["Básico","Intermediário","Desafio"]));
 const result=output(box);
 button(box,"Sortear questão",()=>{
  const list=lessonBank().filter(q=>subject.value==="Todas"||q.s===subject.value);
  if(!list.length)return result.textContent="Não há perguntas dessa matéria ainda.";
  const byLevel=list.filter((q,i)=>{
   const count=q.q.length+q.o.join("").length;
   return level.value==="Básico"?count<210:level.value==="Intermediário"?count>=130&&count<300:count>=200;
  });
  const pool=byLevel.length?byLevel:list;
  const q=pool[Math.floor(Math.random()*pool.length)];
  result.replaceChildren();make("strong",result,q.s+": "+q.q);
  q.o.forEach((x,i)=>make("p",result,(i+1)+". "+x));
  button(result,"Ver resposta comentada",()=>result.textContent="✅ "+q.o[q.a]+"\n"+(q.e||"Compare as alternativas e explique seu raciocínio."));
 });
}
function addExamReview(root){
 const box=row(root,"⭐⭐⭐ Revisão por prova","Prévia de preparação por matéria. Consulte as datas confirmadas na ferramenta Calendário; este protótipo não altera nem cria provas.");
 const subject=label(box,"Matéria",select(subjectsList()));
 const result=output(box);
 button(box,"Montar revisão",()=>{
  const course=typeof subjects!=="undefined"?subjects.find(x=>x.name===subject.value):null;
  const topics=(course?.topics||[]).flatMap(group=>group[1]||[]).slice(0,5);
  result.textContent="📅 Confira a data no Calendário oficial.\n\n"+(topics.length?topics.map((x,i)=>(i+1)+". "+x).join("\n"):"Consulte a Trilha para selecionar os assuntos.")+"\n\nDepois pratique em Simulados e revise os erros.";
  button(result,"Abrir calendário",()=>window.showView?.("calendario"));
 });
}
function addSyncPrototype(root){
 const box=row(root,"⭐⭐⭐ Sincronização opcional — protótipo","O armazenamento em nuvem NÃO está ativado. Aqui você só testa exportar e importar preferências deste laboratório. Não inclua dados pessoais.");
 const result=output(box);
 button(box,"Exportar preferências locais",()=>{
  const keys=["future","planner","bag"];const data={version:1,created:new Date().toISOString(),preferences:Object.fromEntries(keys.map(k=>[k,get(k,k==="future"||k==="bag"?[]:{})]))};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
  const a=document.createElement("a");a.href=url;a.download="atelier-neo-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
  result.textContent="Backup local baixado. Não foi enviado para a nuvem.";
 });
 const file=input("file");file.accept=".json,application/json";label(box,"Importar arquivo local",file);
 file.addEventListener("change",async()=>{
  try{
   const source=file.files?.[0];if(!source||source.size>30000)throw Error("Arquivo inválido ou grande demais.");
   const parsed=JSON.parse(await source.text());
   if(parsed.version!==1||!parsed.preferences||typeof parsed.preferences!=="object")throw Error("Formato incompatível.");
   const p=parsed.preferences;
   if(p.future&&Array.isArray(p.future))put("future",p.future.filter(x=>typeof x==="string").slice(0,12));
   if(p.planner&&typeof p.planner==="object"&&!Array.isArray(p.planner))put("planner",Object.fromEntries(Object.entries(p.planner).slice(0,7).map(([k,v])=>[k,String(v).slice(0,90)])));
   if(p.bag&&Array.isArray(p.bag))put("bag",p.bag.filter(x=>typeof x==="string").slice(0,7));
   result.textContent="Preferências importadas localmente. Reabra a área para ver as alterações.";
  }catch(e){result.textContent="Não consegui importar. Verifique o arquivo exportado pelo Ateliê."}
  file.value="";
 });
}
function addAccess(root){
 const box=row(root,"⭐⭐⭐ Acessibilidade do laboratório","Experimente espaçamento ampliado, foco de leitura e palavras maiores apenas nesta área de testes.");
 const modes=label(box,"Visual para testar",select(["Padrão","Espaçado","Letras maiores","Foco de leitura"]));
 modes.value=get("labStyle","Padrão");
 const apply=()=>{const node=$("neoLab");if(!node)return;node.classList.remove("neo-test-spaced","neo-test-large","neo-test-focus");const mode=modes.value;if(mode==="Espaçado")node.classList.add("neo-test-spaced");if(mode==="Letras maiores")node.classList.add("neo-test-large");if(mode==="Foco de leitura")node.classList.add("neo-test-focus");put("labStyle",mode)};
 modes.addEventListener("change",apply);apply();
}
function addExamples(root){
 const box=row(root,"⭐⭐ Exemplos resolvidos","Use explicações já cadastradas nas questões do portal, sem gerar novos fatos.");
 const subject=label(box,"Matéria",select(["Todas",...subjectsList()]));
 const result=output(box);
 button(box,"Mostrar exemplo",()=>{
  const list=lessonBank().filter(q=>q.e&&(subject.value==="Todas"||q.s===subject.value));
  if(!list.length)return result.textContent="Sem exemplo cadastrado para essa matéria.";
  const q=list[Math.floor(Math.random()*list.length)];
  result.textContent=q.q+"\n\n✅ "+q.o[q.a]+"\n\nExplicação: "+q.e;
 });
}
function addCards(root){
 const box=row(root,"⭐⭐ Meus cartões de teste","Crie cartões apenas neste navegador. O experimento não envia cartões à biblioteca dos alunos.");
 const front=label(box,"Pergunta",input("text","Ex.: O que é tese?"));
 const back=label(box,"Resposta",input("text","Explicação curta"));
 const status=output(box);
 button(box,"Salvar cartão local",()=>{
  if(front.value.trim().length<5||back.value.trim().length<3)return status.textContent="Escreva pergunta e resposta para salvar.";
  const cards=get("cards",[]);cards.unshift({q:front.value.trim().slice(0,180),a:back.value.trim().slice(0,400)});
  put("cards",cards.slice(0,40));front.value="";back.value="";status.textContent="✅ Cartão salvo no laboratório.";
 });
 button(box,"Sortear cartão",()=>{
  const cards=get("cards",[]);if(!cards.length)return status.textContent="Crie um cartão primeiro.";
  const item=cards[Math.floor(Math.random()*cards.length)];
  status.textContent="🧠 "+item.q;button(status,"Revelar",()=>status.textContent=item.q+"\n\n✅ "+item.a);
 });
}
function addSlides(root){
 const box=row(root,"⭐⭐ Apresentação de resumos","Cole tópicos separados por linhas; apresente um de cada vez, sem compartilhar os dados.");
 const area=make("textarea",box);area.placeholder="Introdução\nIdeia principal\nExemplo\nConclusão";area.maxLength=2200;
 let slides=[],index=0;const status=output(box);
 button(box,"Começar apresentação",()=>{slides=area.value.split("\n").map(s=>s.trim()).filter(Boolean).slice(0,20);index=0;status.textContent=slides.length?"1/"+slides.length+" — "+slides[0]:"Adicione pelo menos um tópico.";});
 button(box,"Próximo tópico",()=>{if(slides.length){index=(index+1)%slides.length;status.textContent=(index+1)+"/"+slides.length+" — "+slides[index]}});
}
function addRecovery(root){
 const box=row(root,"⭐⭐ Recuperação de conteúdos","Sugestão de passos com base nos temas da Trilha. Não avalia habilidades pessoais nem cria notas.");
 const subject=label(box,"Matéria",select(subjectsList()));
 const status=output(box);
 button(box,"Gerar caminho",()=>{
  const course=typeof subjects!=="undefined"?subjects.find(x=>x.name===subject.value):null;
  const topics=(course?.topics||[]).flatMap(g=>g[1]||[]).slice(0,3);
  status.textContent="1. Volte ao resumo de "+subject.value+".\n2. Revise: "+(topics.join("; ")||"um capítulo da Trilha")+".\n3. Faça cartões de memória.\n4. Resolva uma questão e compare com o gabarito.";
 });
}
function addThemes(root){
 const box=row(root,"⭐ Temas decorativos","Uma pequena prévia visual aplicada somente ao laboratório.");
 const choice=label(box,"Decoração do laboratório",select(["Original","Azul oceano","Dourado suave","Folhas verdes"]));
 const preview=make("div",box,"Prévia decorativa · Neo","neo-output neo-theme-preview");
 const styles={"Original":["transparent",""],"Azul oceano":["#d8f1fc","#174d82"],"Dourado suave":["#fff2d6","#75500c"],"Folhas verdes":["#e3f5e3","#286c48"]};
 choice.value=get("theme","Original");
 const apply=()=>{const [bg,fg]=styles[choice.value];preview.style.background=bg;preview.style.color=fg;put("theme",choice.value)};
 choice.addEventListener("change",apply);apply();
}
function addAnimation(root){
 const box=row(root,"⭐ Animações do Neo","Teste uma entrada do mascote, usando a configuração de movimento do próprio portal.");
 const status=output(box);
 button(box,"Testar aparição",()=>{
  if(typeof window.portal8MascotNavigate==="function"){window.portal8MascotNavigate("neoLab");status.textContent="Animação solicitada ao Neo (respeita a opção de reduzir movimento).";}
  else status.textContent="Mascote indisponível neste navegador.";
 });
}
function addPoster(root){
 const box=row(root,"⭐ Cartaz imprimível","Monte um pequeno cartaz de revisão, sem dados pessoais ou publicação na internet.");
 const title=label(box,"Assunto",input("text","Ex.: Revolução Industrial"));
 const points=make("textarea",box);points.placeholder="Uma ideia importante por linha";points.maxLength=1000;
 const poster=make("div",box,"Seu cartaz aparecerá aqui.","neo-output neo-print-poster");
 button(box,"Criar cartaz",()=>{poster.textContent="📘 "+title.value.trim().slice(0,70)+"\n\n"+points.value.split("\n").slice(0,8).map(x=>"• "+x.slice(0,120)).join("\n")});
 button(box,"Imprimir cartaz",()=>window.print());
}
function addFavorites(root){
 const box=row(root,"⭐ Acesso a favoritos","Monte atalhos só para você experimentar aqui no laboratório.");
 const available=[...document.querySelectorAll("nav .navbtn[data-view]")].filter(x=>x.dataset.view!=="neoLab");
 const dropdown=label(box,"Escolher ferramenta",select(available.map(x=>x.textContent.trim())));
 const list=make("div",box,undefined,"neo-small-list");
 const favorites=get("favorites",[]);
 const render=()=>{list.replaceChildren();for(const id of favorites){const found=available.find(x=>x.dataset.view===id);if(!found)continue;button(list,"Abrir "+found.textContent.trim(),()=>window.showView?.(id))}};
 button(box,"Adicionar favorito",()=>{const found=available.find(x=>x.textContent.trim()===dropdown.value);if(!found)return;if(!favorites.includes(found.dataset.view))favorites.push(found.dataset.view);put("favorites",favorites.slice(0,10));render()});
 button(box,"Limpar favoritos",()=>{favorites.length=0;put("favorites",[]);render()});render();
}
function init(){
 const root=$("neoExperimentPrototypes");if(!root)return;
 const heading=make("h3",root,"🧪 Laboratório de 12 ideias aprovadas");
 make("p",root,"Todos os recursos abaixo são protótipos locais para avaliação. Nenhum é liberado aos estudantes automaticamente; a sincronização na nuvem é somente demonstrativa.");
 const grid=make("div",root,undefined,"neo-lab-grid");
 [addDifficulty,addExamReview,addSyncPrototype,addAccess,addExamples,addCards,addSlides,addRecovery,addThemes,addAnimation,addPoster,addFavorites].forEach(fn=>fn(grid));
 const brainstorm=make("div",root,undefined,"neo-priority-board");
 make("h3",brainstorm,"💡 Ideias derivadas dos mapas mentais");
 [
 "⭐⭐⭐ Converter ramificações de um mapa em perguntas de revisão",
 "⭐⭐⭐ Comparar dois assuntos em mapas lado a lado",
 "⭐⭐ Histórico privado de mapas favoritos por matéria",
 "⭐⭐ Criar conexões entre conceitos com setas e legendas",
 "⭐ Apresentação animada das ramificações, uma de cada vez"
 ].forEach(t=>make("p",brainstorm,t));
 make("small",brainstorm,"Essas cinco são novas sugestões. Ainda não estão implementadas como ferramentas.");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();