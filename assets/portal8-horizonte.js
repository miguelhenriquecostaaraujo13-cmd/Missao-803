/* Missão Paz Horizonte — resumo somente visual, sem modificar registros. */
(() => {
 "use strict";
 const $=id=>document.getElementById(id);
 const sources=["doneMetric","answeredMetric","correctMetric","nextExam","p8ProfileNameView"];
 let queued=false;
 function sync(){
  queued=false;
  const doneText=$("doneMetric")?.textContent?.replace(/\s+/g," ").trim()||"0 / 0";
  const match=doneText.match(/(\d+)\s*\/\s*(\d+)/);
  const completed=match?Number(match[1]):0,total=match?Number(match[2]):0;
  const percent=total?Math.min(100,Math.round(completed/total*100)):0;
  const answered=Number($("answeredMetric")?.textContent)||0;
  const correct=Number($("correctMetric")?.textContent)||0;
  const next=($("nextExam")?.textContent||"Confira o calendário").trim();
  const name=($("p8ProfileNameView")?.textContent||"").trim();
  const greetingName=(!name||name==="Bem-vindo ao Portal!"||name==="Estudante"||name==="Escolha seu nome")?"estudante":name.split(/\s+/)[0].slice(0,25);
  const greeting=$("mpHorizonGreeting");
  if(greeting)greeting.textContent="Olá, "+greetingName+"!";
  const stats={
    mpHorizonPercent:percent+"%",
    mpHorizonDone:completed+" de "+total+" tópicos",
    mpHomeCompleted:completed+" / "+total,
    mpHomeAccuracy:answered?Math.round(correct/answered*100)+"%":"—",
    mpHomeNext:next,
    mpHorizonAnswered:String(answered),
    mpHorizonCorrect:String(correct)
  };
  for(const [id,value] of Object.entries(stats)){
    const node=$(id);if(node&&node.textContent!==value)node.textContent=value;
  }
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(sync)}}
 function init(){
  if(!$("mpHorizonGreeting"))return;
  for(const id of sources){
    const node=$(id);
    if(node)new MutationObserver(schedule).observe(node,{subtree:true,childList:true,characterData:true});
  }
  document.addEventListener("portal8:viewchange",schedule);
  sync();
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();