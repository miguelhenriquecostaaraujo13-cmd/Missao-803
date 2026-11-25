/* Neo Ideias — mapa mental ampliado e cards públicos de revisão, grátis e locais. */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const K="portal8-neo-ideias-v30";
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const safe=s=>String(s||"").trim().slice(0,145);
const load=()=>{try{const x=JSON.parse(localStorage.getItem(K));return x&&typeof x==="object"?x:{saved:[],recent:[]}}catch{return {saved:[],recent:[]}}};
const write=v=>{try{localStorage.setItem(K,JSON.stringify(v));return true}catch{return false}};
const mk=(tag,parent,text,cls)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;parent?.append(x);return x};
const btn=(parent,title,fn)=>{const b=mk("button",parent,title,"btn light");b.type="button";b.addEventListener("click",fn);return b};
const status=(node,text)=>{if(node)node.textContent=text};
let current=null,cards=[],index=0,flipped=false,slide=0,stepTimer=null;
function details(){
 const subj=$("neoMapSubject")?.value||"Matemática";
 const topic=($("neoMapCustom")?.value||"").trim()||($("neoMapTopic")?.value||"");
 const branches=($("neoMapBranches")?.value||"").split(/[\n;]+/).map(safe).filter(Boolean).slice(0,8);
 const course=typeof subjects!=="undefined"&&Array.isArray(subjects)?subjects.find(s=>s.name===subj):null;
 const chapter=(course?.topics||[]).find(g=>(g[1]||[]).some(t=>t===topic));
 if(chapter){
  branches.push(...(chapter[1]||[]).filter(t=>t!==topic).slice(0,5).map(safe));
 }
 const related=typeof flashcards==="object"&&flashcards?flashcards[subj]||[]:[];
 const matches=related.filter(c=>norm(c[0]+" "+c[1]).includes(norm(topic).split(/[^a-z0-9]+/).find(t=>t.length>5)||"__sem_correspondencia__")).slice(0,2);
 for(const c of matches)branches.push(safe(c[0]));
 return {subject:subj,topic:safe(topic)||"Novo assunto",branches:[...new Set(branches)].slice(0,9)};
}
function note(text){status($("neoIdeasStatus"),text)}
function capture(){
 const data=details();if(!data.topic||data.topic==="Novo assunto"){note("Escolha uma matéria e assunto antes de criar recursos.");return null}
 current=data;return data;
}
function storedCurrent(){
 if(current)return current;
 return capture();
}
function use(data){
 if(!data||!data.topic)return;
 const subject=$("neoMapSubject");if([...subject.options].some(x=>x.value===data.subject)){subject.value=data.subject;subject.dispatchEvent(new Event("change"))}
 $("neoMapCustom").value=data.topic;
 $("neoMapBranches").value=(data.branches||[]).join("\n");
 $("neoMapGenerate")?.click();current=data;
 note("Mapa recuperado: "+data.topic);
}
function renderSaved(){
 const root=$("neoIdeasSaved");if(!root)return;root.replaceChildren();
 const all=load().saved||[];
 if(!all.length){mk("p",root,"Nenhum mapa favorito. Use 'Guardar mapa' depois de gerar um.", "small muted");return}
 all.forEach((entry,i)=>{
  const line=mk("div",root,undefined,"neo-idea-saved");
  btn(line,entry.subject+" · "+entry.topic,()=>use(entry));
  btn(line,"Excluir",()=>{const v=load();v.saved.splice(i,1);write(v);renderSaved()});
 });
}
function saveMap(){
 const d=capture();if(!d)return;
 const data=load();data.saved=Array.isArray(data.saved)?data.saved:[];
 data.saved=[d,...data.saved.filter(x=>!(x.topic===d.topic&&x.subject===d.subject))].slice(0,16);
 if(write(data)){note("✅ Mapa guardado neste dispositivo. Não é enviado à nuvem.");renderSaved()}
 else note("Não foi possível guardar este mapa neste dispositivo.");
}
function makeCards(){
 const d=capture();if(!d)return;
 const base=d.branches.length?d.branches:[d.topic];
 cards=base.map((s,i)=>({front:"Como explicar: "+s+"?",back:"Lembre-se de relacionar este conceito ao tema "+d.topic+".\nSeu tópico registrado: "+s,source:"Roteiro de revisão — não é gabarito automático"}));
 const known=(typeof flashcards==="object"&&flashcards)?flashcards[d.subject]||[]:[];
 const token=norm(d.topic).split(/[^a-z0-9]+/).find(t=>t.length>5);
 if(token)for(const c of known.filter(x=>norm(x[0]+" "+x[1]).includes(token)).slice(0,5))cards.unshift({front:safe(c[0]),back:safe(c[1]),source:"Cartão do material escolar"});
 if(!cards.length){note("Acrescente alguma ideia ou escolha um assunto.");return}
 index=0;flipped=false;renderCard();note(cards.length+" cards preparados. Escolha a aparência e clique para virar.");
}
function renderCard(){
 const el=$("neoIdeasFlashcard");if(!el)return;
 el.className="neo-idea-flashcard neo-card-"+($("neoIdeasCardStyle")?.value||"azul")+(flipped?" neo-flipped":"");
 const c=cards[index];if(!c){el.textContent="Crie cards a partir do assunto.";return}
 el.replaceChildren();
 mk("small",el,(index+1)+" / "+cards.length+" · "+c.source);
 mk("strong",el,flipped?c.back:c.front);
 mk("small",el,flipped?"Toque para voltar":"Toque para virar o card");
}
function cardsFile(){
 if(!cards.length)return note("Gere os cards primeiro.");
 const text=cards.map((x,i)=>(i+1)+". "+x.front+"\n"+x.back).join("\n\n");
 download(new Blob([text],{type:"text/plain;charset=utf-8"}),"cards-neo.txt");
}
function download(blob,name){
 const url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download=name;link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1200);
}
function compare(){
 const d=storedCurrent();if(!d)return;
 const second=$("neoIdeasCompareTopic")?.value.trim();if(!second)return note("Digite o segundo assunto para comparar.");
 const other={subject:d.subject,topic:safe(second),branches:[]};
 const course=typeof subjects!=="undefined"&&Array.isArray(subjects)?subjects.find(s=>s.name===d.subject):null;
 const group=(course?.topics||[]).find(g=>(g[1]||[]).some(x=>norm(x).includes(norm(second))||norm(second).includes(norm(x))));
 if(group)other.branches=(group[1]||[]).filter(x=>norm(x)!==norm(second)).slice(0,6).map(safe);
 const container=$("neoIdeasCompareOutput");container.replaceChildren();
 for(const entry of [d,other]){
  const side=mk("div",container,undefined,"neo-idea-comparison");
  mk("strong",side,entry.topic);
  const arr=entry.branches.length?entry.branches:["Sem ramificações cadastradas. Acrescente ideias manualmente para comparar."];
  for(const s of arr)mk("p",side,"• "+s);
 }
 note("Comparação montada. Ela mostra temas e ramos cadastrados, sem afirmar semelhanças não verificadas.");
}
function relate(){
 const d=storedCurrent();if(!d)return;
 const a=$("neoIdeasRelationA")?.value.trim(),b=$("neoIdeasRelationB")?.value.trim();
 if(!a||!b)return note("Escreva dois conceitos para estabelecer uma ligação.");
 const connector=($("neoIdeasRelationType")?.value||"relaciona-se a");
 const output=$("neoIdeasRelations");output.replaceChildren();
 for(const [text,cl] of [[a,"neo-rel-node"],[connector,"neo-rel-arrow"],[b,"neo-rel-node"]])mk("span",output,safe(text),cl);
 mk("p",output,"Relação criada por você para o mapa de "+d.topic+". Não é uma relação verificada automaticamente.","small muted");
}
function presentation(){
 const d=storedCurrent();if(!d)return;
 slide=0;const list=[d.topic,...d.branches];const output=$("neoIdeasSlides");
 const render=()=>{output.replaceChildren();mk("small",output,"ETAPA "+(slide+1)+" DE "+list.length);
  mk("strong",output,list[slide]);mk("p",output,slide===0?"Tema principal":"Explique com suas palavras a ligação com o tema central.")};
 render();
 window.neoIdeasSlideNext=()=>{slide=(slide+1)%list.length;render()};
 window.neoIdeasSlidePrevious=()=>{slide=(slide-1+list.length)%list.length;render()};
 note("Apresentação pronta: avance as ramificações manualmente.");
}
function conceptQuiz(){
 const d=storedCurrent();if(!d)return;
 const options=d.branches.filter(Boolean);
 if(!options.length)return note("Adicione ramificações antes de criar um desafio.");
 const item=options[Math.floor(Math.random()*options.length)];
 const root=$("neoIdeasChallenge");root.replaceChildren();
 mk("strong",root,"Desafio de recordação: explique como '"+item+"' se relaciona com '"+d.topic+"'.");
 const field=mk("textarea",root);field.placeholder="Escreva uma explicação com suas próprias palavras.";field.maxLength=600;
 btn(root,"Revelar o tópico de referência",()=>{mk("p",root,"Tópico registrado: "+item+". Compare sua explicação com o conteúdo da aula; não há correção automática.", "small muted")});
}
function checklist(){
 const d=storedCurrent();if(!d)return;
 const root=$("neoIdeasChecklist");root.replaceChildren();
 for(const item of d.branches){
  const l=mk("label",root,undefined,"neo-idea-check");const c=mk("input",l);c.type="checkbox";mk("span",l,"Consegui explicar: "+item);
 }
 note("Checklist criado. Marque os conceitos revisados; as marcas não são notas.");
}
function outline(){
 const d=storedCurrent();if(!d)return;
 const text=d.subject+" — "+d.topic+"\n"+d.branches.map((s,i)=>(i+1)+". "+s).join("\n");
 download(new Blob([text],{type:"text/plain;charset=utf-8"}),"esquema-neo.txt");
}
function wire(id,fn){$(id)?.addEventListener("click",fn)}
function init(){
 if(!$("neoIdeasPanel"))return;
 $("neoMapGenerate")?.addEventListener("click",()=>{
  const d=details();
  if(d.topic!=="Novo assunto"){current=d;const all=load();all.recent=[d,...(all.recent||[]).filter(x=>x.topic!==d.topic)].slice(0,8);write(all)}
 });
 wire("neoIdeasSave",saveMap);
 wire("neoIdeasMakeCards",makeCards);
 wire("neoIdeasPrevCard",()=>{if(!cards.length)return;index=(index-1+cards.length)%cards.length;flipped=false;renderCard()});
 wire("neoIdeasNextCard",()=>{if(!cards.length)return;index=(index+1)%cards.length;flipped=false;renderCard()});
 wire("neoIdeasExportCards",cardsFile);
 $("neoIdeasFlashcard")?.addEventListener("click",()=>{if(cards.length){flipped=!flipped;renderCard()}});
 $("neoIdeasFlashcard")?.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&cards.length){e.preventDefault();flipped=!flipped;renderCard()}});
 $("neoIdeasCardStyle")?.addEventListener("change",renderCard);
 wire("neoIdeasCompare",compare);
 wire("neoIdeasLink",relate);
 wire("neoIdeasPresentation",presentation);
 wire("neoIdeasSlideNext",()=>window.neoIdeasSlideNext?.());
 wire("neoIdeasSlidePrev",()=>window.neoIdeasSlidePrevious?.());
 wire("neoIdeasChallengeNew",conceptQuiz);
 wire("neoIdeasChecklistNew",checklist);
 wire("neoIdeasOutlineExport",outline);
 renderSaved();renderCard();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();