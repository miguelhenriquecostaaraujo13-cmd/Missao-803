/* Neo Diretor de Desafios v33 — mecanismo adaptativo local e transparente.
   Não é um LLM. Usa apenas resultados da partida corrente, não envia dados. */
(() => {
"use strict";
const limit=(x,a,b)=>Math.max(a,Math.min(b,x));
const profiles={
 fractions:{label:"Frações",hints:["Frações equivalentes representam a mesma parte do todo.","Para comparar, multiplique ou divida numerador e denominador pelo mesmo número.","Observe o número de cima e o de baixo antes de coletar."]},
 cell:{label:"Célula",hints:["Mitocôndrias participam da produção de energia para a célula.","Ribossomos produzem proteínas. Procure o setor PROTEÍNAS.","O núcleo contém a maior parte do DNA e ajuda a coordenar atividades celulares."]},
 words:{label:"Conectivos",hints:["Oposição: mas, porém, contudo e entretanto.","Adição: também, além disso, e, ainda.","Conclusão: portanto, logo, assim, por isso."]}
};
let game=null,successes=0,errors=0,streak=0,assist="equilibrado",lastHint="",firstTip=true;
function classify(){
 const samples=successes+errors;
 if(samples<3)return 1;
 const ratio=successes/samples;
 return ratio<.45?.8:ratio>.8&&streak>=4?1.12:1;
}
function publish(){
 const tier=classify(),rate=successes+errors?(100*successes/(successes+errors)).toFixed(0)+"%":"—";
 const level=tier<1?"Apoio extra":tier>1?"Desafio avançado":"Equilibrado";
 document.getElementById("neoBrainState")?.replaceChildren(document.createTextNode("🧠 Diretor Neo: "+level+" · acertos "+rate+" · série "+streak));
 return tier;
}
function hint(){
 const profile=profiles[game];
 if(!profile)return "Escolha um dos jogos para receber uma dica.";
 const hint=profile.hints[(errors+successes)%profile.hints.length];
 lastHint=hint;return hint;
}
function announce(message){
 const node=document.getElementById("neoBrainTip");
 if(node)node.textContent=message;
}
const api={
 start(name){game=profiles[name]?name:null;successes=0;errors=0;streak=0;lastHint="";firstTip=true;publish();announce("O Diretor Neo observa apenas esta partida. Use 'Pedir dica' quando quiser.");},
 good(){successes++;streak++;publish();if(streak===3){announce("⭐ Três acertos seguidos! Você está pegando o jeito.")}},
 miss(){errors++;streak=0;publish();if(assist!=="desligado"&&errors%2===0)announce("💡 "+hint());},
 multiplier(){const factor=classify();return assist==="desligado"?1:assist==="leve"?1+(factor-1)*.45:factor},
 get mode(){return assist},
 setMode(value){assist=["equilibrado","leve","desligado"].includes(value)?value:"equilibrado";publish();announce(assist==="desligado"?"Adaptação automática desativada. Você ainda pode pedir dicas.":assist==="leve"?"Adaptação suave ativada.":"Adaptação automática equilibrada ativada.");},
 speed(base){return base*api.multiplier()},
 hint(){const result=hint();announce("💡 "+result);return result;},
 get snapshot(){return {game,successes,errors,streak,mode:assist,multiplier:api.multiplier()}}
};
window.neoGameBrain=api;
function init(){
 const mode=document.getElementById("neoBrainMode");
 if(mode)mode.addEventListener("change",()=>api.setMode(mode.value));
 document.getElementById("neoBrainHintButton")?.addEventListener("click",()=>api.hint());
 publish();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();