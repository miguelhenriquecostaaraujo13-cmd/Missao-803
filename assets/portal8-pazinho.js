/* Pazinho: balões por ferramenta, sem coleta de dados, sem áudio ou serviços externos. */
(() => {
 "use strict";
 const STORAGE_KEY="portal8-pazinho-enabled-v1";
 const SESSION_KEY="portal8-pazinho-welcome-v1";
 const TIPS={
  inicio:["Olá! Eu sou o Pazinho. Escolha uma ferramenta e vamos aprender!","Seu próximo desafio está a um clique. Por onde começamos?"],
  trilha:["Na Minha trilha você acompanha os assuntos já estudados!","Uma etapa de cada vez. Marque os conteúdos que concluir!"],
  videoaulas:["Uma videoaula pode ajudar a entender aquele assunto difícil!","Faça anotações enquanto assiste. Depois, tente explicar o tema!"],
  cartoes:["Leia a pergunta antes de revelar a resposta. Você consegue!","Flashcards são ótimos para treinar sua memória!"],
  metodos:["Experimente um método e veja o que funciona melhor para você!","Estudar com pequenas pausas ajuda a manter a concentração!"],
  assistente:["Tem alguma dúvida? O tutor local pode ajudar!","Faça perguntas sobre os conteúdos e confira as explicações!"],
  revisoes:["Hora de revisar! Pequenos passos fazem diferença!","As missões ajudam a relembrar o que você já aprendeu!"],
  quiz:["Desafio aceito? Vamos testar seus conhecimentos!","Errou uma questão? Aproveite a explicação para aprender!"],
  gerador:["Vamos criar questões para você praticar mais!","Resolva uma questão de cada vez e confira seu raciocínio!"],
  laboratorio:["Cole um texto de estudo e pratique com perguntas!","Leia com atenção: o Laboratório ajuda a revisar textos!"],
  arena:["Bem-vindo à Arena! Preparado para um desafio?","Concentre-se em cada rodada e aprenda com as respostas!"],
  desempenho:["Veja seu progresso e celebre cada avanço!","O importante é comparar seu aprendizado com o de ontem!"],
  evolucao803:["Aqui você acompanha sua própria evolução!","Seu histórico ajuda a identificar o que revisar!"],
  metas803:["Defina uma meta possível para hoje. Você consegue!","Metas pequenas e claras ajudam a manter a constância!"],
  revisao803:["Revise primeiro os assuntos em que tem mais dúvidas!","Seu caderno de erros pode mostrar o que precisa praticar!"],
  calendario:["Aqui você confere provas e atividades importantes!","Organize seus estudos olhando as próximas datas!"],
  foco:["Hora de se concentrar! Que tal uma sessão de foco?","Lembre de fazer pausas durante os estudos!"],
  caderno:["Anote com suas palavras: isso ajuda a aprender!","Guarde aqui suas ideias, resumos e dúvidas!"],
  lembretes:["Configure lembretes que combinem com sua rotina!","Uma revisão curta por dia pode ajudar bastante!"],
  turma:["Veja as novidades da sua turma por aqui!","Confira sua turma selecionada para ver os avisos corretos!"],
  desafio8ano:["Vamos avançar juntos nas missões do 8º ano!","Participar é voluntário. O importante é aprender!"],
  biblioteca:["Explore materiais compartilhados e aprovados!","Tem uma sugestão de estudo? Conheça a biblioteca!"],
  professor:["Aqui ficam informações e recursos para professores!","Use esta área para consultar orientações disponíveis!"],
  criador:["Esta área administrativa exige autorização. Tudo bem!","As publicações oficiais precisam de uma conta autorizada!"],
  offline:["Confira os recursos que funcionam sem conexão!","Para preparar o modo offline, abra o portal com internet!"],
  ajuda803:["Encontrou algum problema? Conte por aqui!","Seu relato pode ajudar a melhorar a plataforma!"],
  acessibilidade803:["Ajuste a leitura e as animações ao seu gosto!","Aqui você pode ativar ou desativar minhas dicas!"],
  perfil:["Olá! Aqui você pode criar sua conta e escolher seu avatar!","Seu perfil é privado. Personalize seu livrinho de estudos!"]
 };
 let widget,balao,fala,avatar,close,again,setting,hideTimer,entryTimer,wiggleTimer;
 let enabled=true,activeId=document.querySelector(".view.active")?.id||"inicio";
 let mascotName="Pazinho",transitionOverlay=null,transitionTimer=null,avatarAnimation=null;
 const indexByView=Object.create(null);
 function readEnabled(){try{return localStorage.getItem(STORAGE_KEY)!=="false"}catch(_){return true}}
 function writeEnabled(value){try{localStorage.setItem(STORAGE_KEY,String(value))}catch(_){}}
 function nextTip(id){
  const arr=TIPS[id]||["Ferramenta aberta! Vamos aprender algo novo?"];
  const pos=indexByView[id]||0;indexByView[id]=pos+1;
  return arr[pos%arr.length];
 }
 function validName(name){return typeof name==="string"&&name.trim().length>=2&&name.trim().length<=24&&!/[<>\\r\\n]/.test(name)}
 function updateName(){
  widget?.setAttribute("aria-label",mascotName+", o livrinho mascote do Portal 8º Ano");
  const title=widget?.querySelector(".pazinho-topo span");if(title)title.textContent="💙 Dica do "+mascotName;
  if(avatar){avatar.title=mascotName+": mostrar uma dica";avatar.setAttribute("aria-label",mascotName+": mostrar dica da ferramenta")}
  const current=document.getElementById("portal8MascotNameCurrent");
  if(current)current.textContent=mascotName;
  const input=document.getElementById("portal8MascotNameInput");
  if(input&&document.activeElement!==input)input.value=mascotName;
  if(transitionOverlay){const label=transitionOverlay.querySelector(".pazinho-scene-label");if(label)label.textContent=mascotName+" chegou!"}
 }
 async function loadName(){
  try{
   if(typeof ensureCloudClient!=="function")return;
   const {data,error}=await ensureCloudClient().from("portal8_site_settings").select("value").eq("key","mascot_name").single();
   if(!error&&validName(data?.value)){mascotName=data.value.trim();updateName()}
  }catch(e){/* Nome padrão funciona offline. */}
 }
 window.portal8MascotSaveName=async function(){
  const input=document.getElementById("portal8MascotNameInput");
  const status=document.getElementById("portal8MascotNameStatus");
  if(!input||!status)return;
  const value=input.value.trim().replace(/\\s+/g," ");
  if(!validName(value)){status.textContent="Use um nome com 2 a 24 caracteres, sem símbolos < ou >.";return}
  status.textContent="Salvando o novo nome no portal…";
  try{
   const client=ensureCloudClient();
   const {data:userResult,error:userError}=await client.auth.getUser();
   if(userError||!userResult?.user||userResult.user.is_anonymous)throw new Error("Entre como administrador autorizado.");
   const {data,error}=await client.from("portal8_site_settings").update({value}).eq("key","mascot_name").select("value").maybeSingle();
   if(error||!data)throw new Error("Apenas contas administradoras autorizadas podem mudar o nome.");
   mascotName=data.value;updateName();
   status.textContent="✅ Nome atualizado para "+mascotName+" em todo o portal!";
   show(activeId,80,false);
  }catch(e){status.textContent=e.message||"Não foi possível salvar. Verifique sua conexão."}
 };
 function createTransition(){
  if(transitionOverlay)return;
  transitionOverlay=document.createElement("div");
  transitionOverlay.className="pazinho-scene";
  transitionOverlay.id="portal8MascotTransition";
  transitionOverlay.hidden=true;
  transitionOverlay.setAttribute("aria-hidden","true");
  const img=document.createElement("img");
  img.src="./assets/pazinho.svg?v=23";img.alt="";img.width=86;img.height=92;
  const words=document.createElement("span");words.className="pazinho-scene-label";
  transitionOverlay.append(img,words);
  document.body.append(transitionOverlay);
  setMotionMode();
  updateName();
 }
 function playTransition(){
  if(reduced()||!enabled||!widget)return;
  createTransition();
  clearTimeout(transitionTimer);
  transitionOverlay.hidden=false;
  transitionOverlay.classList.remove("pazinho-scene-play");
  void transitionOverlay.offsetWidth;
  transitionOverlay.classList.add("pazinho-scene-play");
  transitionTimer=setTimeout(()=>{transitionOverlay.classList.remove("pazinho-scene-play");transitionOverlay.hidden=true},1550);
  if(avatarAnimation){avatarAnimation.cancel();avatarAnimation=null}
  if(typeof avatar.animate==="function"){
   avatarAnimation=avatar.animate([
    {opacity:0,transform:"translate3d(105px,56px,0) rotate(15deg) scale(.65)",offset:0},
    {opacity:1,transform:"translate3d(-48px,-60px,0) rotate(-8deg) scale(1.35)",offset:.48},
    {opacity:1,transform:"translate3d(7px,-8px,0) rotate(3deg) scale(.99)",offset:.78},
    {opacity:1,transform:"translate3d(0,0,0) rotate(0) scale(1)",offset:1}
   ],{duration:1100,easing:"cubic-bezier(.22,.76,.25,1)"});
  }
 }
 window.portal8MascotNavigate=function(id){
  if(typeof id==="string"&&TIPS[id])show(id,110,true);
 };
 function pauseClock(){clearTimeout(hideTimer)}
 function scheduleClose(){clearTimeout(hideTimer);hideTimer=setTimeout(closeBubble,5000)}
 function reduced(){
  if(document.documentElement.dataset.phaseMotion==="reduce")return true;
  // Respeita a opção "Ativar neste navegador" exatamente como a transição de telas.
  if(typeof window.portal8MotionAllowed==="function")return !window.portal8MotionAllowed();
  return !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
 }
 function setMotionMode(){
  const off=reduced();
  widget?.classList.toggle("pazinho-sem-movimento",off);
  widget?.classList.toggle("pazinho-motion-override",!off);
  transitionOverlay?.classList.toggle("pazinho-motion-override",!off);
 }
 function closeBubble(){
  if(!balao||balao.hidden)return;
  balao.classList.remove("is-open");
  pauseClock();
  if(reduced())balao.hidden=true;
  else setTimeout(()=>{if(!balao.classList.contains("is-open"))balao.hidden=true},500);
 }
 function show(id=activeId,delay=0,withTransition=false){
  if(!enabled||!widget)return;
  activeId=TIPS[id]?id:"inicio";
  clearTimeout(entryTimer);
  entryTimer=setTimeout(()=>{
   if(!enabled)return;
   setMotionMode();pauseClock();
   fala.textContent=nextTip(activeId).replaceAll("Pazinho",mascotName);
   balao.hidden=false;
   // Atualiza o conteúdo sem reconstruir o resto da página.
   balao.classList.remove("is-open");
   widget.classList.remove("pazinho-entrando");
   void widget.offsetWidth;
   widget.classList.add("pazinho-entrando");
   requestAnimationFrame(()=>balao.classList.add("is-open"));
   if(withTransition)playTransition();
   clearTimeout(wiggleTimer);
   wiggleTimer=setTimeout(()=>widget.classList.remove("pazinho-entrando"),1580);
   scheduleClose();
  },delay);
 }
 function setEnabled(value){
  enabled=!!value;writeEnabled(enabled);
  widget.hidden=!enabled;
  if(setting)setting.checked=enabled;
  if(!enabled){
   clearTimeout(entryTimer);clearTimeout(wiggleTimer);clearTimeout(transitionTimer);pauseClock();closeBubble();
   if(avatarAnimation){avatarAnimation.cancel();avatarAnimation=null}
   if(transitionOverlay)transitionOverlay.hidden=true;
  }
  else show(activeId,90);
 }
 function init(){
  if(document.getElementById("portal8Pazinho"))return;
  enabled=readEnabled();
  widget=document.createElement("aside");
  widget.id="portal8Pazinho";widget.setAttribute("aria-label","Pazinho, o livrinho mascote do Portal 8º Ano");
  widget.innerHTML=`
    <div class="pazinho-balao" id="portal8PazinhoBalao" hidden>
      <div class="pazinho-topo"><span>💙 Dica do Pazinho</span><button type="button" class="pazinho-close" aria-label="Fechar dica do Pazinho" title="Fechar dica">×</button></div>
      <p class="pazinho-fala" id="portal8PazinhoFala" role="status" aria-live="polite"></p>
      <button class="pazinho-again" type="button" title="Mostrar outra dica">✨ Outra dica</button>
    </div>
    <button type="button" class="pazinho-avatar" title="Pazinho: mostrar uma dica" aria-label="Pazinho: mostrar dica da ferramenta">
      <img src="./assets/pazinho.svg?v=23" alt="" aria-hidden="true" width="98" height="98" decoding="async">
    </button>`;
  document.body.append(widget);
  balao=widget.querySelector(".pazinho-balao");
  fala=widget.querySelector(".pazinho-fala");
  avatar=widget.querySelector(".pazinho-avatar");
  close=widget.querySelector(".pazinho-close");
  again=widget.querySelector(".pazinho-again");
  avatar.addEventListener("click",()=>show(activeId));
  again.addEventListener("click",()=>show(activeId));
  close.addEventListener("click",closeBubble);
  widget.addEventListener("pointerenter",pauseClock);
  widget.addEventListener("pointerleave",()=>{if(!balao.hidden)scheduleClose()});
  widget.addEventListener("focusin",pauseClock);
  widget.addEventListener("focusout",e=>{if(!widget.contains(e.relatedTarget)&&!balao.hidden)scheduleClose()});
  const card=document.querySelector("#acessibilidade803 .card");
  if(card){
   const row=document.createElement("label");row.className="row";row.style.cssText="display:flex;align-items:center;gap:9px;margin:14px 0;";
   setting=document.createElement("input");setting.type="checkbox";setting.id="portal8PazinhoEnabled";setting.checked=enabled;
   const words=document.createElement("span");words.textContent="Mostrar o Pazinho e suas dicas ao abrir ferramentas";
   row.append(setting,words);card.append(row);
   const help=document.createElement("p");help.className="small muted";
   help.textContent="O mascote mostra balões de texto. Clique nele para outra dica; sua escolha fica só neste navegador.";
   card.append(help);
   setting.addEventListener("change",()=>setEnabled(setting.checked));
   const preview=document.createElement("button");preview.type="button";preview.className="btn light";
   preview.textContent="▶ Testar animação do mascote";preview.style.margin="8px 0";
   preview.addEventListener("click",()=>show(activeId,0,true));card.append(preview);
  }
  widget.hidden=!enabled;
  setMotionMode();
  updateName();loadName();
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)loadName()});
  document.addEventListener("portal8:viewchange",()=>{ /* A navegação anima no próprio showView. */ });
  // Saudação uma vez por sessão; outras aparições ocorrem ao trocar de ferramenta.
  if(enabled){
   let first=true;
   try{first=sessionStorage.getItem(SESSION_KEY)!=="seen";if(first)sessionStorage.setItem(SESSION_KEY,"seen")}catch(_){}
   if(first)show("inicio",850,true);
  }
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
 else init();
})();
