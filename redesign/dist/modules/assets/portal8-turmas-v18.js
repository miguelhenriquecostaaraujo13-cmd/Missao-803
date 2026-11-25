(function(){
"use strict";
const byId=id=>document.getElementById(id);
const turma=()=>portal8Turma;
let activities=[];
function status(id,value){const e=byId(id);if(e)e.textContent=value;}
async function loadActivities(){
 const root=byId("p8xActivitiesList");if(!root)return;
 root.replaceChildren();status("p8xActivitiesSubtitle","Turma "+turma()+" • publicações gerais e da sala");
 try{
  const r=await ensureCloudClient().from("portal8_atividades").select("turma,materia,titulo,descricao,entrega")
   .eq("publicada",true).in("turma",["geral",turma()]).order("criado_em",{ascending:false}).limit(40);
  if(r.error)throw r.error;
  activities=r.data||[];
  if(!activities.length)root.textContent="Nenhuma atividade publicada no momento.";
  for(const x of activities){
   const box=document.createElement("div");box.className="p8x-board-card";
   const title=document.createElement("b");title.textContent=x.titulo;
   const meta=document.createElement("small");meta.textContent=x.materia+" • "+(x.entrega?"Entrega: "+new Date(x.entrega+"T12:00:00").toLocaleDateString("pt-BR"):"Prazo não definido");
   const body=document.createElement("p");body.textContent=x.descricao;
   box.append(title,meta,body);root.append(box);
  }
  if(window.portal8Study)window.portal8Study.refreshToday();
 }catch(error){root.textContent="Atividades indisponíveis. Verifique sua conexão.";}
}
async function publishActivity(){
 if(!portalIsOwner)return status("p8xActStatus","Acesso reservado ao administrador.");
 const data={turma:byId("p8xActTurma").value,materia:byId("p8xActMateria").value.trim(),titulo:byId("p8xActTitulo").value.trim(),descricao:byId("p8xActDescricao").value.trim(),entrega:byId("p8xActEntrega").value||null,publicada:true};
 if(data.materia.length<2||data.titulo.length<4||data.descricao.length<8)return status("p8xActStatus","Preencha os campos.");
 if(!confirm("Publicar a atividade para "+data.turma+"?"))return;
 try{
  const r=await ensureCloudClient().from("portal8_atividades").insert(data);
  if(r.error)throw r.error;
  status("p8xActStatus","✅ Atividade publicada.");
  byId("p8xActTitulo").value="";byId("p8xActDescricao").value="";
  loadActivities();
 }catch(e){status("p8xActStatus","Não foi possível publicar. Verifique a conta de administrador.");}
}
const themes=[
 ["Matemática em ação","Revisar Matemática","Resolver três questões","Conferir explicações"],
 ["Leitura e interpretação","Ler um texto","Identificar sua ideia principal","Responder questões de Português"],
 ["Ciência no cotidiano","Revisar Ciências","Encontrar um exemplo","Resolver duas questões"],
 ["História e memória","Revisar um tema","Construir uma linha do tempo","Resolver perguntas"],
 ["Mundo e Geografia","Estudar um mapa","Revisar Geografia","Responder questões"],
 ["Revisão integrada","Revisar uma matéria difícil","Praticar outra matéria","Registrar uma dúvida"]
];
function renderTheme(){
 const root=byId("p8xThemeSteps");if(!root)return;
 const week=portal8WeekStart();
 const offset=Math.floor((Date.parse(week+"T12:00:00Z")-Date.parse("2026-11-02T12:00:00Z"))/604800000);
 const entry=themes[((offset%themes.length)+themes.length)%themes.length];
 status("p8xThemeTitle","🏆 "+entry[0]);
 status("p8xThemeWeek","Semana de "+new Date(week+"T12:00:00").toLocaleDateString("pt-BR"));
 root.replaceChildren();for(const item of entry.slice(1)){const li=document.createElement("li");li.textContent="✅ "+item;root.append(li);}
}
function refresh(){activities=[];loadActivities();renderTheme();}
function init(){
 refresh();
 const before=window.showView;
 window.showView=function(id){const r=before(id);if(id==="calendario")loadActivities();if(id==="desafio8ano")renderTheme();return r;};
 const choose=window.portal8Choose;
 window.portal8Choose=function(id){const r=choose(id);refresh();return r;};
}
window.portal8Classes={loadActivities,publishActivity,renderTheme,cachedActivities:()=>activities.slice()};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();