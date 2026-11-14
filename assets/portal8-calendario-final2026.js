/* Calendário escolar 2026, eventos restantes transcritos da folha da escola. */
(() => {
 "use strict";
 const rootHome=()=>document.getElementById("mpSchoolEventsHome");
 const rootCalendar=()=>document.getElementById("mpSchoolEventsFull");
 const icons={feriado:"🏛️",sabado:"📚",recesso:"🌿",etapa:"📘",termino:"🎓",planejamento:"🗓️"};
 const fallback=[
 {date:"2026-11-20",type:"feriado",title:"Dia da Consciência Negra"},
 {date:"2026-11-28",type:"sabado",title:"Sábado letivo"},
 {date:"2026-12-07",type:"recesso",title:"Recesso"},
 {date:"2026-12-08",type:"feriado",title:"Aniversário de Belo Horizonte"},
 {date:"2026-12-14",type:"etapa",title:"Fim da 3ª etapa"},
 {date:"2026-12-15",type:"termino",title:"Término do ano letivo"},
 {date:"2026-12-16",end:"2026-12-18",type:"planejamento",title:"Planejamento escolar"},
 {date:"2026-12-21",end:"2026-12-23",type:"planejamento",title:"Planejamento escolar"},
 {date:"2026-12-25",type:"feriado",title:"Natal"},
 {date:"2026-12-28",end:"2026-12-31",type:"recesso",title:"Recesso escolar"}
 ];
 function formatDate(date){const [year,month,day]=date.split("-");return day+"/"+month+"/"+year}
 function formatRange(event){return event.end?formatDate(event.date)+" a "+formatDate(event.end):formatDate(event.date)}
 function addEntry(container,event){
  const card=document.createElement("article");card.className="mp-school-event mp-school-"+event.type;
  const date=document.createElement("span");date.className="mp-school-event-date";date.textContent=formatRange(event);
  const title=document.createElement("strong");title.className="mp-school-event-title";
  title.textContent=(icons[event.type]||"📅")+" "+event.title;
  const info=document.createElement("span");info.className="mp-school-event-type";
  info.textContent=({feriado:"Feriado",sabado:"Sábado letivo",recesso:"Recesso",etapa:"Etapa escolar",termino:"Ano letivo",planejamento:"Planejamento"})[event.type]||"Evento";
  card.append(date,title,info);
  if(container===rootCalendar()&&event.detail){
   const description=document.createElement("p");
   description.className="mp-school-event-details";
   description.textContent=event.detail;
   card.append(description);
  }
  container.append(card);
 }
 function render(items){
  const safe=items.filter(e=>e&&typeof e.date==="string"&&e.date>="2026-11-16"&&e.date<="2026-12-31"&&typeof e.title==="string"&&e.title.length<140&&icons[e.type])
   .sort((a,b)=>a.date.localeCompare(b.date));
  for(const [target,isHome] of [[rootHome(),true],[rootCalendar(),false]]){
   if(!target)continue;
   target.replaceChildren();
   for(const event of (isHome?safe.slice(0,5):safe))addEntry(target,event);
  }
 }
 async function init(){
  render(fallback);
  try{
   const response=await fetch("./assets/calendario-escolar-2026-restante.json?v=25");
   if(!response.ok)throw new Error("Sem dados");
   const parsed=await response.json();
   if(!Array.isArray(parsed?.events))throw new Error("Formato inválido");
   render(parsed.events);
  }catch(e){/* Mantém os eventos já transcritos e incluídos no próprio script, também offline. */}
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();