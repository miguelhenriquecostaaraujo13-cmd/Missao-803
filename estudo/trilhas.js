'use strict';
// Trilhas criadas pelo estudante: funcionam sem IA, sem serviço pago e com armazenamento privado.
const trilhasPersonalizadas=(()=>{
 let lista=[],mensagem='',recemCriada='';
 const nome=()=>contas.chave('missao803.trilhas.pessoais.v1');
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normalizar=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const idValido=v=>/^[0-9a-f-]{36}$/i.test(v||'');
 const valido=t=>t&&idValido(t.id)&&typeof t.titulo==='string'&&t.titulo.length<=120&&typeof t.materia==='string'&&
  Array.isArray(t.etapas)&&t.etapas.length>0&&t.etapas.length<=16&&t.etapas.every(e=>e&&typeof e.titulo==='string'&&typeof e.texto==='string')&&
  Array.isArray(t.concluidas);
 function local(){
   try{const a=JSON.parse(contas.armazenamento.getItem(nome())||'[]');return Array.isArray(a)?a.filter(valido).slice(0,100):[];}catch{return [];}
 }
 function persistir(){
   try{contas.armazenamento.setItem(nome(),JSON.stringify(lista));}catch{mensagem='O navegador não conseguiu manter as trilhas salvas.';}
 }
 const organizadas=()=>lista.slice().sort((a,b)=>(b.atualizado||0)-(a.atualizado||0));
 async function preparar(){
   lista=local();
   if(!contas.usuario||!contas.cliente)return;
   try{
     const res=await Promise.race([
      contas.cliente.from('neo_aurora_trilhas_pessoais').select('id,conteudo,atualizado_em').eq('usuario_id',contas.usuario).limit(100),
      new Promise((_,rej)=>setTimeout(()=>rej(Error('timeout')),6500))
     ]);
     if(res.error)throw res.error;
     const remoto=new Map((res.data||[]).filter(r=>valido(r.conteudo)).map(r=>[r.id,{...r.conteudo,atualizado:new Date(r.atualizado_em).getTime()}]));
     const pendentes=[];
     for(const t of lista){const antigo=remoto.get(t.id);if(!antigo||(t.atualizado||0)>antigo.atualizado){remoto.set(t.id,t);pendentes.push(t);}}
     lista=[...remoto.values()];persistir();
     for(const t of pendentes)void enviar(t);
     mensagem='Trilhas sincronizadas com a sua conta.';
   }catch{mensagem='Suas trilhas continuam disponíveis nesta aba. A sincronização será tentada novamente.';}
 }
 async function enviar(t){
   if(!contas.usuario||!contas.cliente)return true;
   const {error}=await contas.cliente.from('neo_aurora_trilhas_pessoais').upsert({
      id:t.id,usuario_id:contas.usuario,conteudo:t,atualizado_em:new Date(t.atualizado).toISOString()
   },{onConflict:'id'});
   if(error){mensagem='Trilha guardada neste navegador; não foi possível confirmar a sincronização.';return false;}
   mensagem='Trilha salva na sua conta.';return true;
 }
 function gerarEtapas(materia,assunto,texto){
   const partes=texto.trim().split(/\n\s*\n+/).map(s=>s.replace(/\s+/g,' ').trim()).filter(s=>s.length>=15);
   if(partes.length){
     let pacotes=[];let atual='';
     for(const p of partes){
       if(atual.length+p.length>1100&&atual){pacotes.push(atual);atual='';}
       atual+=(atual?' ':'')+p.slice(0,1800);
     }if(atual)pacotes.push(atual);
     return [
       {titulo:'Objetivo da trilha',texto:'Assunto: '+assunto+'. Material enviado pelo próprio estudante.'},
       ...pacotes.slice(0,9).map((p,i)=>({titulo:'Parte '+(i+1)+' do material',texto:p})),
       {titulo:'Revisar o conteúdo',texto:'Releia o material, destaque o que aprendeu e crie perguntas ou flashcards no caderno.'}
     ];
   }
   const candidatos=(typeof questoes==='undefined'?[]:questoes).filter(q=>q.materia===materia&&
     (normalizar(q.assunto).includes(normalizar(assunto))||normalizar(assunto).includes(normalizar(q.assunto)))).slice(0,5);
   if(candidatos.length)return [
      {titulo:'Introdução',texto:'Você vai praticar '+assunto+' usando explicações já disponíveis no Missão 8º Ano.'},
      ...candidatos.map((q,i)=>({titulo:'Explicação '+(i+1),texto:q.explicacao})),
      {titulo:'Pratique e revise',texto:'Abra os simulados desta matéria, responda às questões e guarde os erros para revisar.'}
   ];
   return [
     {titulo:'Defina seu objetivo',texto:'Escreva no caderno o que deseja compreender sobre '+assunto+'.'},
     {titulo:'Estude o assunto',texto:'Adicione um texto ou material à trilha, faça anotações e destaque conceitos importantes.'},
     {titulo:'Encontre exemplos',texto:'Reúna exemplos confiáveis e tente explicá-los com suas próprias palavras.'},
     {titulo:'Revise e pratique',texto:'Crie questões ou flashcards no caderno e retome os pontos mais difíceis.'}
   ];
 }
 async function lerArquivo(file){
   if(!file)return '';
   const tipo=file.name.split('.').pop().toLowerCase();
   if(!['txt','md','pdf'].includes(tipo))throw Error('Envie um PDF com texto, .txt ou .md.');
   if(file.size>5*1024*1024)throw Error('O arquivo deve ter até 5 MB.');
   if(tipo==='pdf'){
     try{
       const pdfjs=await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs');
       pdfjs.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
       const pdf=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;
       const secoes=[];
       for(let n=1;n<=Math.min(20,pdf.numPages);n++){
         const pagina=await pdf.getPage(n),conteudo=await pagina.getTextContent();
         secoes.push(conteudo.items.map(item=>item.str||'').join(' '));
       }
       const texto=secoes.join('\n\n').trim();
       if(texto.length<30)throw Error('Este PDF parece digitalizado, sem texto selecionável. Cole o texto do conteúdo.');
       return texto.slice(0,45000);
     }catch(e){throw Error(e?.message?.includes('digitalizado')?e.message:'Não foi possível ler esse PDF. Tente um arquivo com texto selecionável ou cole o texto.');}
   }
   if(file.size>102400)throw Error('Arquivos TXT e Markdown devem ter até 100 KB.');
   const texto=(await file.text()).trim();
   if(texto.includes('\u0000'))throw Error('O arquivo não contém texto legível.');
   return texto.slice(0,45000);
 }
 async function criar({titulo,materia,assunto,texto,arquivo}){
   titulo=String(titulo||'').trim().slice(0,100);
   assunto=String(assunto||titulo).trim().slice(0,150);
   texto=String(texto||'').trim().slice(0,45000);
   if(!titulo||!assunto)throw Error('Preencha o nome da trilha e o assunto.');
   if(lista.length>=100)throw Error('Você atingiu o limite de 100 trilhas.');
   if(!estudos.materias.includes(materia))throw Error('Selecione uma matéria válida.');
   const agora=Date.now();
   const t={id:crypto.randomUUID(),titulo,materia,assunto,material:arquivo||'',etapas:gerarEtapas(materia,assunto,texto),
            concluidas:[],criado:agora,atualizado:agora};
   lista.push(t);persistir();recemCriada=t.id;await enviar(t);
   return t;
 }
 function obter(id){return idValido(id)?lista.find(t=>t.id===id):undefined;}
 async function alternar(id,i){
   const t=obter(id);if(!t||!Number.isInteger(i)||i<0||i>=t.etapas.length)return;
   const set=new Set(t.concluidas);if(set.has(i))set.delete(i);else set.add(i);
   t.concluidas=[...set].sort((a,b)=>a-b);t.atualizado=Date.now();
   persistir();await enviar(t);
 }
 async function excluir(id){
   const t=obter(id);if(!t)return;
   lista=lista.filter(x=>x.id!==id);persistir();
   if(contas.usuario&&contas.cliente){
      const {error}=await contas.cliente.from('neo_aurora_trilhas_pessoais').delete().eq('id',id).eq('usuario_id',contas.usuario);
      if(error)mensagem='Trilha excluída deste navegador, mas a exclusão na nuvem não foi confirmada.';
   }
 }
 function telaLista(){
   const itens=organizadas().map(t=>{
     const completo=t.concluidas.length,porcentagem=Math.round(100*completo/t.etapas.length);
     return '<a class="trilha-pessoal-card" href="#trilha-personalizada/'+esc(t.id)+'"><span class="trilha-materia">'+esc(t.materia)+'</span><h3>'+esc(t.titulo)+'</h3><p>'+esc(t.assunto)+'</p><progress value="'+completo+'" max="'+t.etapas.length+'" aria-label="Progresso de '+esc(t.titulo)+'"></progress><small>'+porcentagem+'% concluído · '+t.etapas.length+' etapas</small><span class="abrir-trilha">Continuar trilha →</span></a>';
   }).join('');
   return '<header class="cab"><p class="rotulo">Aprendizado personalizado</p><h1>Minhas trilhas</h1><p>Crie uma trilha sobre qualquer assunto e acompanhe seu progresso.</p></header>'+
    '<div class="trilhas-pessoais">'+
      '<details class="papel nova-trilha" id="criar-trilha" '+(lista.length?'':'open')+'><summary>＋ Criar minha trilha</summary>'+
        '<form id="form-nova-trilha" class="form-trilha">'+
          '<div class="campos-trilha"><label>Nome da trilha<input name="titulo" maxlength="100" required placeholder="Ex.: Equações do 1º grau"></label>'+
          '<label>Matéria<select name="materia">'+estudos.materias.map(m=>'<option>'+esc(m)+'</option>').join('')+'</select></label></div>'+
          '<label>Qual assunto você quer estudar?<input name="assunto" maxlength="150" required placeholder="Ex.: Resolver equações simples"></label>'+
          '<label>Escreva ou cole seu material (opcional)<textarea name="texto" maxlength="45000" rows="5" placeholder="Cole um resumo ou material de estudo. Se não tiver, você pode criar a trilha somente com o assunto."></textarea></label>'+
          '<label>Ou envie um material (opcional)<input type="file" name="arquivo" accept=".txt,.md,.pdf,text/plain,text/markdown,application/pdf"></label>'+
          '<p class="nota-trilha">Aceita PDF com texto selecionável, TXT ou Markdown. Os arquivos são lidos no navegador. PDF requer conexão para carregar o leitor. Não envie dados pessoais.</p>'+
          '<button class="principal" type="submit">Criar trilha ✨</button><p id="erro-trilha" role="alert"></p>'+
        '</form></details>'+
      '<section aria-label="Trilhas salvas"><div class="trilhas-heading"><h2>Seus percursos</h2><span>'+lista.length+' trilha(s)</span></div>'+
       (itens?'<div class="trilhas-pessoais-grade">'+itens+'</div>':'<div class="vazio-trilhas"><p>Você ainda não criou uma trilha.</p><p>Experimente começar com uma matéria ou colar seu próprio resumo.</p></div>')+
      '</section><p class="estado-trilhas" role="status">'+esc(mensagem)+'</p></div>';
 }
 function telaDetalhe(id){
    const t=obter(id);if(!t)return '<section class="papel"><h1>Trilha não encontrada</h1><p>Confira suas trilhas salvas.</p><a class="principal" href="#minhas-trilhas">Voltar às trilhas</a></section>';
    const nova=recemCriada===id;recemCriada='';
    const completas=t.concluidas.length,total=t.etapas.length;
    return '<section class="trilha-pessoal-detalhe '+(nova?'trilha-gerada':'')+'"><div class="trilha-detalhe-topo">'+
     '<a class="voltar-trilhas" href="#minhas-trilhas">← Minhas trilhas</a><span>'+esc(t.materia)+'</span></div>'+
     '<header class="trilha-apresentacao"><span class="selo-trilha">'+(nova?'✨ Trilha criada com sucesso':'Seu percurso personalizado')+'</span>'+
     '<h1>'+esc(t.titulo)+'</h1><p>'+esc(t.assunto)+'</p><p>'+completas+' de '+total+' etapas concluídas</p>'+
     '<progress value="'+completas+'" max="'+total+'" aria-label="Progresso da trilha"></progress>'+
     '</header><ol class="etapas-personais">'+t.etapas.map((e,i)=>{
      const feito=t.concluidas.includes(i);
      return '<li style="--ordem:'+i+'" class="'+(feito?'etapa-feita':'')+'"><span class="etapa-numero">'+(feito?'✓':i+1)+'</span><div class="etapa-conteudo"><h2>'+esc(e.titulo)+'</h2><p>'+esc(e.texto)+'</p>'+
      '<button class="'+(feito?'secundario':'principal')+'" type="button" data-trilha-act="passo" data-id="'+esc(id)+'" data-passo="'+i+'">'+(feito?'Reabrir etapa':'Concluir esta etapa')+'</button></div></li>';
     }).join('')+'</ol><div class="acoes-trilha"><a class="principal" href="#quadro/'+esc(t.id)+'">Assistir aula no quadro ✦</a><a class="secundario" href="#caderno">Abrir caderno</a><a class="secundario" href="#revisao">Revisar flashcards</a>'+
     '<button type="button" data-trilha-act="excluir" data-id="'+esc(id)+'" class="excluir-trilha">Excluir trilha</button></div></section>';
 }
 return {preparar,criar,alternar,excluir,lerArquivo,telaLista,telaDetalhe,get lista(){return organizadas();},get mensagem(){return mensagem;}};
})();