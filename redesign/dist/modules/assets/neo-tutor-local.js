/* Neo tutor local: motor pedagógico determinístico, sem API nem pagamentos. */
(function(){
"use strict";
const get=id=>document.getElementById(id);
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const fmt=n=>new Intl.NumberFormat("pt-BR",{maximumFractionDigits:4}).format(n);
const memory={last:null,question:null};
function say(s,role){
 const root=get("assistantChat");if(!root)return;
 const item=document.createElement("div");item.className="assistant-msg "+(role||"bot");
 item.textContent=String(s).slice(0,1800);root.append(item);root.scrollTop=root.scrollHeight;
}
function reset(){
 memory.last=null;memory.question=null;get("assistantChat")?.replaceChildren();
 say("📘 Oi! Sou o Neo, seu tutor local. Posso explicar os assuntos cadastrados, praticar cartões, calcular porcentagens e resolver equações simples. Não sou o ChatGPT: uso conteúdos do portal e regras gratuitas.");
}
function terms(s){return [...new Set(norm(s).split(/[^a-z0-9]+/).filter(x=>x.length>=4&&!["quero","como","qual","para","sobre","explica","explique","pode","entender","porque","exemplo","questao","estudar","fazer","tenho","duvida","isso","essa","mais","dica"].includes(x)))];}
function library(subject){
 const out=[];
 if(typeof subjects==="undefined"||typeof flashcards==="undefined")return out;
 for(const s of subjects){
  if(subject&&s.name!==subject)continue;
  out.push({subject:s.name,title:"Resumo de "+s.name,body:s.summary,kind:"resumo"});
  for(const group of s.topics||[])for(const topic of group[1])out.push({subject:s.name,title:topic,body:s.summary,kind:"tópico"});
  for(const c of flashcards[s.name]||[])out.push({subject:s.name,title:c[0],body:c[1],kind:"cartão"});
 }
 return out;
}
function best(query,subject){
 const ws=terms(query);if(!ws.length)return null;
 let found=null,max=2;
 for(const d of library(subject)){
  const title=terms(d.title),body=terms(d.body);let score=0,matched=0;
  for(const w of ws){
   if(title.includes(w)){score+=5;matched++}
   else if(title.some(t=>t.startsWith(w)||w.startsWith(t))){score+=2.5;matched++}
   if(body.includes(w))score+=.55;
  }
  if(matched&&score>max){max=score;found=d}
 }
 return found;
}
function teach(d,mode){
 memory.last=d;
 if(mode==="simples")return "📚 "+d.subject+" — "+d.title+"\n\n"+d.body.slice(0,750)+"\n\nExplique em uma frase o que entendeu. Também posso propor uma questão.";
 if(mode==="exemplo")return "✏️ Vamos praticar "+d.title+": pense em uma situação da aula que use esse conceito. O resumo disponível diz:\n"+d.body.slice(0,800)+"\n\nQue exemplo você daria?";
 return "📖 "+d.subject+" — "+d.title+"\n\n"+d.body.slice(0,1050)+"\n\nQuer uma explicação mais simples, um exemplo ou uma questão?";
}
function math(input){
 const q=norm(input).replace(/[−–]/g,"-").replace(/[×·]/g,"*").replace(/÷/g,"/");
 if(q.length>140)return null;
 const p=q.match(/(-?\d+(?:[.,]\d+)?)\s*%\s*(?:de|do|da)\s*(-?\d+(?:[.,]\d+)?)/);
 if(p){const rate=Number(p[1].replace(",",".")),total=Number(p[2].replace(",","."));return "➗ Porcentagem:\n1. Divida "+fmt(rate)+" por 100.\n2. Multiplique por "+fmt(total)+".\n3. Resultado: "+fmt(rate*total/100)+".\n\nExperimente calcular 15% de 200.";}
 const e=q.replace(/\s+/g,"").match(/^([+-]?\d*(?:[.,]\d+)?)x([+-]\d+(?:[.,]\d+)?)?=([+-]?\d+(?:[.,]\d+)?)$/);
 if(e){
  const a=e[1]===""||e[1]==="+"?1:e[1]==="-"?-1:Number(e[1].replace(",",".")),b=e[2]?Number(e[2].replace(",",".")):0,c=Number(e[3].replace(",","."));
  if(!a||![a,b,c].every(Number.isFinite))return "Confira o coeficiente de x na equação.";
  return "🧮 Equação do 1º grau:\n"+fmt(a)+"x + ("+fmt(b)+") = "+fmt(c)+"\n1. Isole o termo com x: "+fmt(a)+"x = "+fmt(c-b)+".\n2. Divida por "+fmt(a)+".\n3. x = "+fmt((c-b)/a)+".";
 }
 const a=q.match(/(?:quanto (?:e|é) |calcule |resolva )?(-?\d+(?:[.,]\d+)?)\s*([+*/-])\s*(-?\d+(?:[.,]\d+)?)\s*\??$/);
 if(a){
  const n=Number(a[1].replace(",",".")),m=Number(a[3].replace(",",".")),op=a[2];
  if(op==="/"&&m===0)return "Não podemos dividir por zero.";
  const value=op==="+"?n+m:op==="-"?n-m:op==="*"?n*m:n/m;
  if(Number.isFinite(value))return "🧮 Cálculo: "+fmt(n)+" "+(op==="*"?"×":op==="/"?"÷":op)+" "+fmt(m)+" = "+fmt(value)+".\nQuer praticar mais?";
 }
 return null;
}
function question(subject){
 let cards=library(subject).filter(d=>d.kind==="cartão");
 if(memory.last){const same=cards.filter(d=>d.subject===memory.last.subject);if(same.length)cards=same;}
 if(!cards.length)return "Não há cartões nessa matéria. Escolha outra matéria ou abra a Trilha.";
 const chosen=cards[Math.floor(Math.random()*cards.length)];
 memory.question=chosen;
 return "🧠 Pergunta de "+chosen.subject+":\n"+chosen.title+"\n\nResponda com suas palavras ou digite 'ver resposta'.";
}
function reply(text,subject){
 const n=norm(text);
 if(/\b(?:cpf|senha|endereco|telefone|email|e-mail)\b/.test(n))return "🔒 Não inclua dados pessoais no chat. Reescreva somente a dúvida escolar.";
 if(/\b(?:suicidio|suicidar|me machucar|me ferir)\b/.test(n))return "Se estiver passando por uma situação difícil, procure agora um adulto de confiança ou profissional de saúde. Para perigo imediato, peça ajuda presencial urgente.";
 if(/^(oi|ola|olá|bom dia|boa tarde|boa noite)[!. ]*$/.test(n))return "Olá! 📘 Escolha uma matéria e me pergunte algo. Posso ajudar com porcentagem, conteúdos do 8º ano e exercícios!";
 if(memory.question){
  const card=memory.question;
  if(/^(ver resposta|mostrar resposta|nao sei|não sei|pular|desisto)$/.test(n)){memory.question=null;memory.last=card;return "✅ Resposta do cartão:\n"+card.body+"\n\nQuer outra questão?";}
  if(n.length<12)return "Tente explicar com mais detalhes, ou digite 'ver resposta'.";
  memory.question=null;memory.last=card;
  return "Obrigado por tentar! Não consigo corrigir respostas abertas com precisão. Compare sua explicação com o cartão:\n"+card.body+"\n\nQuer outra questão?";
 }
 if(/(outra questao|outra questão|faça uma pergunta|faz uma pergunta|me teste|quiz|me pergunte|uma questão)/.test(n))return question(subject);
 if(memory.last&&/(mais simples|resuma|explica melhor|não entendi|nao entendi|outras palavras)/.test(n))return teach(memory.last,"simples");
 if(memory.last&&/\b(exemplo|exemplos)\b/.test(n)&&n.length<75)return teach(memory.last,"exemplo");
 if(/^(ajuda|comandos|como funciona|o que você faz)$/.test(n))return "Posso pesquisar os resumos e cartões do portal, praticar perguntas, calcular 20% de 150, resolver 2x+4=14 e explicar assuntos em etapas. Minhas respostas são limitadas ao conteúdo disponível.";
 const result=math(text);if(result)return result;
 const doc=best(text,subject);if(doc)return teach(doc);
 return "Ainda não tenho uma explicação confiável para isso no material cadastrado. Tente palavras específicas da matéria, uma conta (20% de 150), ou peça uma questão. Confira assuntos mais avançados com o professor.";
}
function send(){
 const input=get("assistantInput"),text=input?.value.trim();
 if(!text||text.length<3){say("Escreva uma pergunta de pelo menos 3 caracteres.");return;}
 if(text.length>1200)return;
 input.value="";say(text,"me");
 const choice=get("assistantSubject")?.value||"Todas";
 let answer;try{answer=reply(text,choice==="Todas"?null:choice)}catch(e){answer="Não consegui consultar o material. Tente novamente."}
 say(answer);
}
function init(){
 if(!get("assistantChat"))return;
 window.askTutor=send;
 window.neoTutorReset=reset;
 window.neoTutorQuestion=()=>{get("assistantInput").value="faça uma pergunta";send()};
 window.neoTutorExample=()=>{get("assistantInput").value="me dê um exemplo";send()};
 get("assistantInput")?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}});
 reset();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();