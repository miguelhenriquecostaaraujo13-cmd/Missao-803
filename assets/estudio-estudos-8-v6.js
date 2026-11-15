/* Estúdio Missão Paz — estudo com fontes e banco curricular. Sem IA generativa.
 * Questões filtradas, histórico por tópico e materiais privados somente neste aparelho.
 */
(() => {
"use strict";
const root=document.getElementById("neoEstudio8");
if(!root)return;
const $=id=>document.getElementById(id);
const bank=()=>window.portal8Q8;
const subjects=()=>bank()?.subjects?.()||[];
const storage=()=> "mp-estudio-v6-"+(typeof portal8Turma!=="undefined"?portal8Turma:"803");
let subject="",topic="",view="quiz",quiz=null,cards=[],cardIndex=0,cardFace=false,notes=[],noteId="",message="";
const stopwords=new Set("de da do das dos um uma uns umas e a o os as para por com sem que qual quais como quando onde em no na nos nas isso isto esta este foi ser são era tem ter sobre entre ao aos à às se eu você meu minha seus suas mais menos tudo todos todas pelo pela pela porque como onde assim então ou e um uma há".split(" "));
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
const encode=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const publicSubject=s=>String(s||"");
function load(){
 try{
  const data=JSON.parse(localStorage.getItem(storage())||"{}");
  notes=Array.isArray(data.notes)?data.notes.filter(n=>n&&typeof n.title==="string"&&typeof n.text==="string").slice(-20):[];
 }catch(_){notes=[]}
}
function save(){
 try{localStorage.setItem(storage(),JSON.stringify({notes}))}
 catch(_){show("Armazenamento cheio. Exporte ou apague algumas anotações.",true)}
}
function show(text,isError=false){const msg=$("mp6Notice");msg.textContent=text;msg.dataset.error=String(isError)}
root.innerHTML=[
'<section class="mp6-hero"><div><span class="mp6-kicker">ESTÚDIO DE ESTUDOS • 8º ANO</span><h2>Seu conteúdo. Seu ritmo.<br><em>Seu próximo aprendizado.</em></h2><p>Questões por assunto, revisão dos erros, anotações organizadas e materiais de estudo criados a partir dos seus próprios textos.</p><div class="mp6-hero-links"><button type="button" data-mp6-tab="quiz" class="mp6-cta">Começar simulado</button><button type="button" data-mp6-tab="notes" class="mp6-cta alt">Criar material de estudo</button></div></div><div class="mp6-hero-art" aria-hidden="true"><span class="mp6-orb">✦</span><span class="mp6-book">📖</span><span class="mp6-sheet">Aa<br>✓ ✓ ✓</span></div></section>',
'<div class="mp6-stats"><article><strong id="mp6QuestionsCount">—</strong><span>Questões disponíveis</span></article><article><strong id="mp6SubjectCount">—</strong><span>Matérias</span></article><article><strong id="mp6TopicCount">—</strong><span>Assuntos para praticar</span></article><article><strong id="mp6NotesCount">0</strong><span>Meus materiais locais</span></article></div>',
'<div class="mp6-tabs" role="tablist" aria-label="Ferramentas do estúdio"><button type="button" role="tab" aria-selected="true" data-mp6-tab="quiz">🧠 Simulados</button><button type="button" role="tab" aria-selected="false" data-mp6-tab="notes">📚 Materiais e resumos</button><button type="button" role="tab" aria-selected="false" data-mp6-tab="revision">🎯 Revisão inteligente</button></div>',
'<div class="mp6-panel" id="mp6QuizPanel"><div class="mp6-panel-head"><div><h3>Simulados por matéria e assunto</h3><p>Escolha o que quer treinar. As perguntas são alternadas entre partidas; após responder, veja uma explicação.</p></div><span class="mp6-tag">Banco curricular local</span></div>',
'<div class="mp6-controls"><label>Matéria<select id="mp6Subject"></select></label><label>Assunto<select id="mp6Topic"></select></label><label>Questões<select id="mp6Amount"><option value="5">5 questões</option><option value="10" selected>10 questões</option><option value="15">15 questões</option></select></label><button type="button" id="mp6Start" class="mp6-primary">▶ Iniciar simulado</button></div>',
'<div class="mp6-quiz-stage" id="mp6QuizStage" hidden><div class="mp6-quiz-top"><span id="mp6Progress">Questão 1</span><span id="mp6Score">0 pontos</span></div><div class="mp6-progress"><i id="mp6Bar"></i></div><span class="mp6-topic-tag" id="mp6QuizTopic"></span><h4 id="mp6Question"></h4><div id="mp6Options" class="mp6-options"></div><p id="mp6Feedback" aria-live="polite" class="mp6-feedback"></p><button type="button" id="mp6Next" class="mp6-primary" hidden>Próxima questão →</button></div>',
'<div id="mp6QuizEmpty" class="mp6-empty">Escolha uma matéria para começar. O sistema mostrará seus acertos e os conteúdos que precisam de revisão.</div></div>',
'<div class="mp6-panel" id="mp6NotesPanel" hidden><div class="mp6-panel-head"><div><h3>Minha biblioteca de estudos</h3><p>Organize textos, extraia um resumo fiel e crie cartões a partir de linhas do tipo <b>termo: definição</b>.</p></div><span class="mp6-tag">Privado neste navegador</span></div>',
'<div class="mp6-editor-grid"><div class="mp6-editor"><label>Título<input id="mp6NoteTitle" maxlength="85" type="text" placeholder="Ex.: Revolução Industrial"></label><label>Matéria<select id="mp6NoteSubject"></select></label><label>Conteúdo<textarea id="mp6NoteBody" rows="11" maxlength="14000" placeholder="Cole suas anotações aqui. Para gerar cartões, escreva uma definição por linha: termo: explicação."></textarea></label><div class="mp6-editor-actions"><button type="button" class="mp6-primary" id="mp6Save">💾 Salvar material</button><label class="mp6-import">📂 Importar .txt ou .md<input id="mp6Import" type="file" accept=".txt,.md,text/plain,text/markdown" hidden></label><button type="button" id="mp6Summarize">✨ Criar resumo</button><button type="button" id="mp6MakeCards">🃏 Gerar cartões</button></div><small>Textos salvos apenas neste dispositivo. Importação local de arquivos .txt e .md, até 100 KB. Não envie informações pessoais sensíveis.</small></div><aside class="mp6-library"><strong>Materiais salvos</strong><div id="mp6NoteList"></div><button type="button" id="mp6New">+ Nova anotação</button></aside></div>',
'<div id="mp6Generated" class="mp6-generated" hidden><h4 id="mp6GeneratedTitle"></h4><div id="mp6GeneratedBody"></div></div>',
'<div class="mp6-source-ask"><h4>🔎 Pergunte às suas anotações</h4><p>Busque trechos que respondam à sua dúvida, com indicação da fonte. A busca é local e não inventa respostas.</p><div class="mp6-source-form"><input type="text" id="mp6Ask" placeholder="Ex.: O que foi a Revolução Industrial?" maxlength="180"><button type="button" id="mp6Search">Pesquisar</button></div><div id="mp6SearchResults" role="status" aria-live="polite"></div></div></div>',
'<div class="mp6-panel" id="mp6ReviewPanel" hidden><div class="mp6-panel-head"><div><h3>Seus próximos passos</h3><p>Revise os temas em que houve mais dificuldades. O painel usa somente as respostas registradas neste navegador.</p></div><span class="mp6-tag">Revisão personalizada</span></div><div id="mp6ReviewItems" class="mp6-review-items"></div></div>',
'<p class="mp6-truth">Ferramentas atuais: resumos por seleção de trechos, cartões baseados em definições e recuperação de passagens por palavras-chave. Não é um modelo de IA generativa e não interpreta PDFs automaticamente. A sequência de conteúdos deve ser confirmada com o planejamento da escola.</p>',
'<p class="mp6-notice" id="mp6Notice" role="status" aria-live="polite"></p>'
].join("");
function populate(){
 const q=bank();if(!q){show("O banco de questões não carregou. Atualize o portal.",true);return}
 const select=$("mp6Subject"),ns=$("mp6NoteSubject");
 const names=subjects();
 for(const name of names){
  for(const node of [select,ns]){
   const option=document.createElement("option");option.value=name;option.textContent=name;node.append(option);
  }
 }
 subject=names[0]||"";select.value=subject;
 updateTopics();
 const summary=q.stats();
 $("mp6QuestionsCount").textContent=q.all().length;
 $("mp6SubjectCount").textContent=names.length;
 $("mp6TopicCount").textContent=Object.values(summary).reduce((a,b)=>a+b.topics,0);
 updateLibrary();
}
function updateTopics(){
 subject=$("mp6Subject").value;const topics=bank()?.topics(subject)||[];
 const sel=$("mp6Topic");sel.replaceChildren();
 const all=document.createElement("option");all.value="";all.textContent="Todos os assuntos";sel.append(all);
 topics.forEach(t=>{const op=document.createElement("option");op.value=t;op.textContent=t;sel.append(op)});
 topic="";
}
function setTab(name){
 if(!["quiz","notes","revision"].includes(name))return;
 view=name;
 root.querySelectorAll("[data-mp6-tab]").forEach(b=>{if(b.getAttribute("role")==="tab")b.setAttribute("aria-selected",String(b.dataset.mp6Tab===name))});
 $("mp6QuizPanel").hidden=name!=="quiz";
 $("mp6NotesPanel").hidden=name!=="notes";
 $("mp6ReviewPanel").hidden=name!=="revision";
 if(name==="revision")renderReview();
}
function start(){
 const q=bank()?.pick($("mp6Subject").value,Number($("mp6Amount").value),$("mp6Topic").value)||[];
 if(!q.length){show("Não encontrei questões desse assunto. Tente outra matéria ou selecione Todos os assuntos.",true);return}
 quiz={questions:q,index:0,correct:0,answered:false};
 $("mp6QuizStage").hidden=false;$("mp6QuizEmpty").hidden=true;displayQuestion();
 show("Simulado iniciado. Você verá as explicações depois de escolher.");
}
function displayQuestion(){
 const q=quiz.questions[quiz.index],done=quiz.index>=quiz.questions.length;
 if(done){
  $("mp6Progress").textContent="Simulado concluído";
  $("mp6Score").textContent=quiz.correct+" acertos";
  $("mp6Bar").style.width="100%";
  $("mp6QuizTopic").textContent="Resultado";
  $("mp6Question").textContent="Você acertou "+quiz.correct+" de "+quiz.questions.length+".";
  $("mp6Options").replaceChildren();
  $("mp6Feedback").textContent=quiz.correct>=Math.ceil(quiz.questions.length*.7)?
   "Boa prática! Revise também as explicações que achar desafiadoras.":
   "Os erros ajudam a escolher o que praticar. Veja sua revisão inteligente.";
  $("mp6Next").hidden=true;return;
 }
 quiz.answered=false;
 $("mp6Progress").textContent="Questão "+(quiz.index+1)+" de "+quiz.questions.length;
 $("mp6Score").textContent=quiz.correct+" acerto(s)";
 $("mp6Bar").style.width=Math.round(100*quiz.index/quiz.questions.length)+"%";
 $("mp6QuizTopic").textContent=q.s+" • "+(q.t||"Geral");
 $("mp6Question").textContent=q.q;
 $("mp6Feedback").textContent="";
 $("mp6Next").hidden=true;
 const opts=$("mp6Options");opts.replaceChildren();
 q.o.forEach((answer,i)=>{
  const b=document.createElement("button");b.type="button";b.className="mp6-option";
  b.textContent=String.fromCharCode(65+i)+". "+answer;
  b.addEventListener("click",()=>choose(i));opts.append(b);
 });
}
function choose(i){
 if(!quiz||quiz.answered)return;
 const q=quiz.questions[quiz.index],right=i===q.a;quiz.answered=true;
 if(right)quiz.correct++;
 bank()?.record(q,right);
 [...$("mp6Options").children].forEach((b,j)=>{
  b.disabled=true;b.classList.toggle("good",j===q.a);b.classList.toggle("bad",j===i&&!right);
 });
 $("mp6Feedback").textContent=(right?"✅ Resposta correta! ":"💡 Entenda a resposta: ")+q.e;
 $("mp6Score").textContent=quiz.correct+" acerto(s)";
 $("mp6Next").hidden=false;
 $("mp6Next").textContent=quiz.index===quiz.questions.length-1?"Concluir simulado →":"Próxima questão →";
}
function advance(){if(!quiz?.answered)return;quiz.index++;displayQuestion()}
function validNote(){return $("mp6NoteBody").value.trim().length>=20}
function clearEditor(){
 noteId="";$("mp6NoteTitle").value="";$("mp6NoteBody").value="";$("mp6Generated").hidden=true;
 show("Nova anotação pronta.");
}
function updateLibrary(){
 const list=$("mp6NoteList");list.replaceChildren();
 $("mp6NotesCount").textContent=notes.length;
 if(!notes.length){const p=document.createElement("p");p.textContent="Sua biblioteca ainda não tem textos.";p.className="mp6-empty-mini";list.append(p);return}
 notes.slice().reverse().forEach(note=>{
  const item=document.createElement("div");item.className="mp6-library-item";
  const open=document.createElement("button");open.type="button";open.textContent=note.title+" · "+note.subject;
  open.addEventListener("click",()=>{
   noteId=note.id;$("mp6NoteTitle").value=note.title;$("mp6NoteBody").value=note.text;$("mp6NoteSubject").value=note.subject;
   $("mp6Generated").hidden=true;show("Material aberto. Edite e salve, se desejar.");
  });
  const remove=document.createElement("button");remove.type="button";remove.className="mp6-remove";remove.setAttribute("aria-label","Excluir "+note.title);remove.textContent="✕";
  remove.addEventListener("click",()=>{
   if(!window.confirm("Excluir este material deste navegador?"))return;
   notes=notes.filter(n=>n.id!==note.id);if(noteId===note.id)clearEditor();save();updateLibrary();show("Material excluído do dispositivo.");
  });
  item.append(open,remove);list.append(item);
 });
}
function saveNote(){
 const title=$("mp6NoteTitle").value.trim(),body=$("mp6NoteBody").value.trim();
 if(!title){show("Dê um título ao material antes de salvar.",true);return}
 if(body.length<20){show("Adicione pelo menos 20 caracteres de conteúdo.",true);return}
 const uid=noteId||"nota-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7);
 const note={id:uid,title,subject:$("mp6NoteSubject").value,text:body,updated:Date.now()};
 notes=notes.filter(n=>n.id!==uid).concat(note).slice(-20);noteId=uid;
 save();updateLibrary();show("💾 Material salvo neste navegador.");
}
function phrases(text){
 return String(text||"").replace(/\r/g,"").replace(/[ \t]+/g," ").split(/\n+/).flatMap(p=>p.match(/[^.!?]+[.!?]?/g)||[]).map(s=>s.trim()).filter(s=>s.length>=22);
}
function keywordSet(q){
 return [...new Set((norm(q).match(/[a-z]{4,}/g)||[]).filter(w=>!stopwords.has(w)))];
}
function summary(){
 const content=$("mp6NoteBody").value.trim();
 if(content.length<60){show("Cole um texto de pelo menos 60 caracteres para extrair um resumo.",true);return}
 const parts=phrases(content).slice(0,140);
 if(!parts.length){show("Não consegui identificar frases completas no material.",true);return}
 const words=parts.flatMap(s=>keywordSet(s)),freq={};
 words.forEach(w=>freq[w]=(freq[w]||0)+1);
 const ranked=parts.map((s,i)=>({s,i,score:keywordSet(s).reduce((acc,w)=>acc+Math.log(1+(freq[w]||0)),0)/(Math.sqrt(s.length)+1)+((i===0)?1.5:0)}));
 ranked.sort((a,b)=>b.score-a.score);
 const selected=ranked.slice(0,Math.min(5,Math.max(2,Math.ceil(parts.length/3)))).sort((a,b)=>a.i-b.i);
 const container=$("mp6GeneratedBody");container.replaceChildren();
 selected.forEach(r=>{const p=document.createElement("p");p.textContent="• "+r.s;container.append(p)});
 $("mp6GeneratedTitle").textContent="Resumo por trechos selecionados";
 $("mp6Generated").hidden=false;
 show("Resumo extraído de "+parts.length+" trecho(s) da sua anotação. Confira e revise antes de estudar.");
}
function generateCards(){
 const lines=$("mp6NoteBody").value.split(/\n+/);
 cards=[];
 for(const line of lines){
  const m=line.match(/^\s*([^:\n—–]{3,95})\s*(?::|—|–)\s*(.{8,350})$/);
  if(m)cards.push({q:m[1].trim(),a:m[2].trim()});
 }
 cards=cards.slice(0,50);cardIndex=0;cardFace=false;
 if(!cards.length){show("Para criar cartões, escreva linhas como 'Fotossíntese: processo que transforma energia luminosa em química'.",true);return}
 $("mp6GeneratedTitle").textContent="Cartões de revisão · "+cards.length+" encontrados";
 const content=$("mp6GeneratedBody");content.replaceChildren();
 const flash=document.createElement("button");flash.type="button";flash.className="mp6-flash";
 const caption=document.createElement("p");caption.className="mp6-card-caption";
 const controls=document.createElement("div");controls.className="mp6-card-actions";
 const prev=document.createElement("button");prev.type="button";prev.textContent="← Anterior";
 const next=document.createElement("button");next.type="button";next.textContent="Próximo →";
 const refresh=()=>{flash.textContent=cardFace?cards[cardIndex].a:cards[cardIndex].q;caption.textContent="Cartão "+(cardIndex+1)+" de "+cards.length+" · toque para "+(cardFace?"ver o termo":"ver a resposta")};
 flash.addEventListener("click",()=>{cardFace=!cardFace;refresh()});
 prev.addEventListener("click",()=>{cardIndex=(cardIndex+cards.length-1)%cards.length;cardFace=false;refresh()});
 next.addEventListener("click",()=>{cardIndex=(cardIndex+1)%cards.length;cardFace=false;refresh()});
 controls.append(prev,next);content.append(flash,caption,controls);
 $("mp6Generated").hidden=false;refresh();show("Cartões criados a partir das definições que você escreveu. Nenhuma resposta foi inventada.");
}
function searchSources(){
 const query=$("mp6Ask").value.trim(),words=keywordSet(query);
 const out=$("mp6SearchResults");out.replaceChildren();
 if(!words.length){show("Escreva uma pergunta com termos relevantes.",true);return}
 const candidates=[];
 const buffer=$("mp6NoteBody").value.trim();
 if(buffer.length>20)candidates.push({title:"Texto aberto no editor",text:buffer});
 notes.forEach(n=>{if(n.id!==noteId)candidates.push({title:n.title,text:n.text})});
 const matches=[];
 for(const note of candidates){
  for(const phrase of phrases(note.text).slice(0,250)){
   const normal=norm(phrase);
   const hit=words.filter(w=>normal.includes(w)).length;
   if(hit)matches.push({title:note.title,text:phrase,score:hit/words.length});
  }
 }
 matches.sort((a,b)=>b.score-a.score||a.text.length-b.text.length);
 if(!matches.length){out.textContent="Não encontrei esse assunto nas suas notas. Experimente outras palavras ou adicione um texto que trate do tema.";return}
 matches.slice(0,3).forEach(hit=>{
  const row=document.createElement("article");row.className="mp6-search-hit";
  const title=document.createElement("strong");title.textContent=hit.title;
  const p=document.createElement("p");p.textContent=hit.text;
  row.append(title,p);out.append(row);
 });
 show("Encontrados "+matches.length+" trecho(s) relacionados. Esta ferramenta recupera citações das suas notas, não cria respostas.");
}
function renderReview(){
 const target=$("mp6ReviewItems");target.replaceChildren();
 const items=bank()?.practice?.()||[];
 if(!items.length){
  target.innerHTML='<div class="mp6-empty">Quando você responder simulados ou jogos, este painel destacará os assuntos que merecem mais prática. Comece com 5 questões de uma matéria.</div>';
  return;
 }
 items.slice(0,12).forEach(p=>{
  const card=document.createElement("article");card.className="mp6-review-card";
  const text=document.createElement("div");
  const h=document.createElement("strong");h.textContent=p.subject+" • "+p.topic;
  const line=document.createElement("p");line.textContent=p.percent+"% de acertos em "+p.attempts+" tentativa(s) registradas.";
  text.append(h,line);
  const btn=document.createElement("button");btn.type="button";btn.textContent="Praticar";
  btn.addEventListener("click",()=>{
   $("mp6Subject").value=p.subject;updateTopics();
   const found=[...$("mp6Topic").options].find(o=>o.value===p.topic);
   if(found)$("mp6Topic").value=p.topic;
   setTab("quiz");start();
  });
  card.append(text,btn);target.append(card);
 });
}
root.addEventListener("click",e=>{const b=e.target.closest("[data-mp6-tab]");if(b)setTab(b.dataset.mp6Tab)});
$("mp6Subject").addEventListener("change",updateTopics);
$("mp6Start").addEventListener("click",start);
$("mp6Next").addEventListener("click",advance);
$("mp6Save").addEventListener("click",saveNote);
$("mp6New").addEventListener("click",clearEditor);
$("mp6Summarize").addEventListener("click",summary);
$("mp6MakeCards").addEventListener("click",generateCards);
$("mp6Search").addEventListener("click",searchSources);
$("mp6Ask").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();searchSources()}});
$("mp6Import").addEventListener("change",async e=>{
 const file=e.target.files?.[0];if(!file)return;
 if(!/\.(txt|md)$/i.test(file.name)||file.size>102400){show("Importe apenas arquivos .txt ou .md de até 100 KB.",true);e.target.value="";return}
 try{
  const content=await file.text();
  $("mp6NoteTitle").value=file.name.replace(/\.(txt|md)$/i,"").slice(0,85);
  $("mp6NoteBody").value=content.slice(0,14000);noteId="";show("Arquivo importado. Revise e clique em Salvar material.");
 }catch(_){show("Não foi possível ler esse arquivo de texto.",true)}
 e.target.value="";
});
document.addEventListener("portal8:viewchange",e=>{if(e.detail?.id==="neoEstudio8"){updateLibrary();if(view==="revision")renderReview()}});
load();populate();setTab("quiz");
window.portal8Estudio8={open:(tab="quiz")=>{if(typeof showView==="function")showView("neoEstudio8");setTab(tab)},refresh:()=>{populate();updateLibrary()}};
})();