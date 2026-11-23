'use strict';

(function(){
  const principal = document.querySelector('#principal');
  const nav = document.querySelector('#nav');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const porId = estudos.porId;
  const perfil = () => visitante.perfil;
  const materia = () => estudos.materias.includes(estudos.dados.materia) ? estudos.dados.materia : perfil()?.materias[0] || 'Matemática';
  const dataCurta = ms => new Date(ms).toLocaleDateString('pt-BR', {day:'numeric',month:'short'});
  const paginas = {painel:'Meu painel',trilha:'Trilha',simulados:'Simulados',revisao:'Flashcards',biblioteca:'Biblioteca',tutor:'Tutor Neo',quadro:'Quadro livre',busca:'Busca',caderno:'Caderno',agenda:'Agenda e foco',ajustes:'Ajustes'};
  const {icone,organizarArea}=identidadeAurora;
  const menu = document.querySelector('#menu');
  const pequeno = matchMedia('(max-width: 1100px)');
  function mostrarMenu(aberto=false) {
    menu.hidden = (!pequeno.matches && !nav.classList.contains('menu-estudos')) || !nav.childElementCount;
    menu.setAttribute('aria-expanded', String(aberto && !menu.hidden));
    nav.hidden = !menu.hidden && !aberto;
  }
  document.addEventListener('pointerdown',e=>{
    if(menu.getAttribute('aria-expanded')==='true'&&!nav.contains(e.target)&&!menu.contains(e.target))mostrarMenu();
  });
  nav.addEventListener('click',e=>{
    const a=e.target.closest('a');
    if(a&&a.hash===location.hash&&a.pathname===location.pathname){mostrarMenu();principal.focus();}
  });
  menu.onclick = () => mostrarMenu(menu.getAttribute('aria-expanded')!=='true');
  document.addEventListener('keydown', e => {
    if(e.key==='Escape' && menu.getAttribute('aria-expanded')==='true'){mostrarMenu();menu.focus();}
  });
  pequeno.addEventListener('change',()=>mostrarMenu());
  let rota = '';
  let sessaoId = '';
  let revelado = '';
  const diaISO = d => [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  let mesVisivel=diaISO(new Date()).slice(0,7),diaSelecionado='';
  let notaId = '';
  let notaBase = '';
  let rascunhosNotas = {};
  try { const salvos=JSON.parse(sessionStorage.getItem(contas.chave('missao803.rascunhos'))); if(salvos && typeof salvos==='object')rascunhosNotas=salvos; } catch {}
  function preservarRascunhos(){try{sessionStorage.setItem(contas.chave('missao803.rascunhos'),JSON.stringify(rascunhosNotas));}catch{}}
  let fonteId = '', filtroNotas = '';
  let errosPendentes=false;
  let aviso = '';
  let buscaNeo = '', consultaGeral = '';
  let assuntoAberto = '';
  let zoomMapa = 100;
  let ocupado = false;
  const botao = (texto, acao, valor='', cls='secundario') => `<button class="${cls}" data-act="${acao}" data-value="${esc(valor)}">${esc(texto)}</button>`;
  const link = (texto, rota, cls='secundario') => `<a class="${cls}" href="#${rota}">${esc(texto)}</a>`;
  const titulo = (sobre, texto, descricao='') => `<header class="cab"><p class="rotulo">${esc(sobre)}</p><h1>${esc(texto)}</h1>${descricao ? `<p>${esc(descricao)}</p>` : ''}</header>`;
  const listaMateria = () => `<label class="seletor">Matéria <select id="materia">${[...new Set([...(perfil()?.materias||[]),...estudos.materias])].map(m=>`<option ${m===materia()?'selected':''}>${esc(m)}</option>`).join('')}</select></label>`;
  const robo = () => `<button class="neo" id="neo" aria-label="Mostrar dica do Neo" aria-expanded="false" aria-controls="dica"><span class="figura"><span class="antena"></span><span class="casco"><span class="viseira"><i></i><i></i></span></span><span class="corpo"></span><span class="asa esquerda"></span><span class="asa direita"></span></span></button>`;
  const dicas = {
    tutor:'Escolha uma matéria e busque um assunto, como escalas ou potência. Você pode abrir uma questão a partir da explicação.',
    inicio:'Você pode começar como visitante. Eu guardo sua turma e suas escolhas neste navegador.',
    painel:'Comece por uma pergunta. Depois da resposta, leia a explicação e tente dizer o raciocínio com suas palavras.',
    trilha:'Escolha um assunto. Um erro entra nos flashcards para você praticar de novo.',
    simulados:'Faça uma estimativa antes de olhar as alternativas. Você pode sair e retomar o simulado.',
    revisao:'Tente lembrar antes de virar o cartão. Escolha “Lembrei” quando conseguir explicar a resposta.',
    caderno:'Anote o que você entendeu e uma pergunta que ainda quer responder.',
    agenda:'Escolha uma tarefa pequena antes de iniciar o tempo de foco.',
    ajustes:'Você pode rever as preferências que escolheu no primeiro acesso.'
  };
  function tutor(grande=false) {
    return `<div class="tutor ${grande?'observatorio':'compacto'}"><div class="orbita o1"></div><div class="orbita o2"></div><div class="orbita o3"></div>${robo()}<div id="dica" role="status" hidden></div></div>`;
  }
  function passosEntrada(ativa){
    const passos=['Acessar a plataforma','Escolher suas preferências','Começar a estudar'];
    return `<aside class="portal-luz"><div class="portal-sinal" aria-hidden="true"><i></i><i></i></div><p class="rotulo">Neo Aurora</p><h2>Seu espaço<br>de estudo.</h2><ol>${passos.map((nome,i)=>'<li'+(i+1===ativa?' aria-current="step"':'')+'>'+nome+'</li>').join('')}</ol></aside>`;
  }
  function conta() {
    const titulos={criar:'Criar conta',entrar:'Entrar',recuperar:'Recuperar senha','nova-senha':'Escolher nova senha'};
    const pedido=location.hash.split('/')[1];
    const modo=contas.recuperando?'nova-senha':['criar','recuperar'].includes(pedido)?pedido:'entrar';
    const nome=titulos[modo], habilitado=modo==='nova-senha'?contas.recuperando:contas.provedores.email&&(modo!=='criar'||contas.cadastro);
    const escolhas=['criar','entrar','recuperar'].map(id=>`<a href="#conta/${id}" ${id===modo?'aria-current="page"':''}>${titulos[id]}</a>`).join('');
    return `<section class="portal-conta">
      ${passosEntrada(1)}
      <div class="portal-form"><h1>${nome}</h1>${contas.usuario&&!contas.recuperando?'<p>Você está conectado. Seu progresso fica nesta aba até você sair ou fechá-la.</p><a class="principal" href="#painel">Voltar ao painel</a><button type="button" data-act="sair-conta">Sair da conta</button>':`
      ${modo==='nova-senha'?'':'<nav aria-label="Opções de conta">'+escolhas+'</nav>'}
      <form id="form-conta" data-modo="${modo}"><fieldset ${habilitado?'':'disabled'}>
      ${modo==='nova-senha'?'':'<label>E-mail<input type="email" name="email" autocomplete="email" required></label>'}
      ${modo==='recuperar'?'':'<label>Senha<input type="password" name="senha" autocomplete="'+(modo==='entrar'?'current-password':'new-password')+'" required '+(modo==='entrar'?'':'minlength="8"')+'></label>'}
      <button class="principal" ${habilitado?'':'disabled'}>${modo==='recuperar'?'Enviar link de recuperação':nome}</button></fieldset></form>
      <p id="status-conta" role="status">${esc(contas.recado)}</p><p class="aviso-privacidade-acessos">Acessos de contas podem aparecer no painel privado do administrador. Visitantes sem login são contados anonimamente, sem identificação pessoal.</p>
      ${modo==='nova-senha'?'':`<div class="provedores">${['Google','Apple'].filter(p=>contas.provedores[p.toLowerCase()]).map(p=>{const id=p.toLowerCase();return '<button type="button" data-act="provedor" data-value="'+id+'" '+(contas.provedores[id]?'':'disabled')+'>Continuar com '+p+(contas.provedores[id]?'':' · Indisponível')+'</button>';}).join('')}</div>
      ${perfil()?link('Voltar ao meu painel','painel'):'<button class="visitante-discreto" data-act="começar">Continuar como visitante</button>'}`}`}</div></section>`;
  }
  function inicio() {
    if (visitante.editando) return `<section class="config">${titulo('Primeiro acesso','Seu espaço de estudo')}<div class="portal-conta personalizar">${passosEntrada(visitante.etapa===5?3:2)}<div class="papel wizard">${visitante.conteudo('Quais matérias você quer priorizar?')}</div></div></section>`;
    return apresentacaoAurora.tela(robo,Boolean(perfil()));
  }
  function ajudaNeo() {
    const s=rota==='sessao'?estudos.dados.sessoes.find(v=>v.id===sessaoId):null;
    const it=s?.itens[s.passo], resolveu=it && it.escolha!==null, certo=resolveu && it.escolha===porId.get(it.id).correta;
    const texto=rota==='inicio'||rota==='ajustes'?['','Sua turma define seu painel.','Escolha um objetivo ou siga em frente.','Marque as matérias que quer ver primeiro.','Experimente uma voz local, se quiser.','Confira as escolhas antes de abrir o painel.'][visitante.etapa] : s?.fim?'Confira os comentários das questões e revise seus cartões.':resolveu?(certo?'Você acertou! Experimente explicar por que as outras alternativas não servem.':'Sua resposta ficou no caderno de erros. Leia a explicação antes de seguir.'):'Leia o enunciado e faça uma estimativa antes de responder.';
    return `<aside class="neo-ajuda" data-humor="${certo?'alegre':'pensando'}">${robo()}<p id="dica" role="status" hidden>${esc(texto)}</p></aside>`;
  }
  function vencidos() {return Object.entries(estudos.dados.revisoes).filter(([id,r])=>(porId.has(id)||estudos.dados.cartoes?.[id])&&r.quando<=Date.now()).sort((a,b)=>a[1].quando-b[1].quando);}
  function meta() {
    const {total} = estudos.semana(estudos.dados);
    const alvo = estudos.dados.meta;
    return `<section class="papel meta"><h2>Meta da semana</h2>${alvo ? `<p>${total} de ${alvo} atividades concluídas${total>=alvo?' · Meta alcançada':''}.</p><progress aria-label="Atividades concluídas nesta semana" max="${alvo}" value="${Math.min(total,alvo)}"></progress>`:'<p>Escolha quantas atividades quer concluir até domingo.</p>'}<form id="form-meta"><label>Atividades por semana<input id="alvo" type="number" min="1" max="50" required value="${alvo || 3}"></label><button>Salvar meta</button></form></section>`;
  }
  function tutorEstudos() {
    const itens = buscaNeo.trim() ? tutorNeo.procurar(buscaNeo,materia()) : [];
    const resultados = itens.map(q=>`<article class="papel"><p class="rotulo">${esc(q.assunto)}</p><h2>${esc(q.pergunta)}</h2><p>${esc(q.explicacao)}</p><div class="acoes">${botao('Praticar assunto','iniciar',q.assunto)}${tutorNeo.voz()?botao('Ouvir explicação','ouvir',q.id):''}</div></article>`).join('');
    const recentes=estudos.dados.sessoes.slice(-3).reverse();
    return titulo('Neo Aurora','Estude com o Neo')+`<section class="mesa-neo"><aside class="estante-neo"><h2>Estudar com Neo</h2>${[['revisao','Revisar flashcards'],['simulados','Encontrar questões'],['caderno','Criar cartões no caderno']].map(([id,nome])=>link(nome,id)).join('')}<a href="${hrefDestino('escalas')}">Abrir quadro narrado</a><h3>Atividades recentes</h3>${recentes.length?recentes.map(s=>link(esc(s.assunto||s.materia),'sessao/'+s.id)).join(''):'<p>Suas atividades aparecem aqui depois da primeira prática.</p>'}</aside><div class="consulta-neo"><div class="nucleo-neo" data-estado="${itens.length?'explicando':'pronto'}">${tutor()}</div><p>Busque um conceito nas explicações da sua matéria.</p>${listaMateria()}`+
      `<form class="papel" id="form-neo"><label for="consulta">O que você quer entender?</label><input type="search" id="consulta" maxlength="180" required value="${esc(buscaNeo)}" placeholder="Digite um conceito ou uma dúvida"><button class="principal">Buscar explicação</button></form>
      <section aria-label="Explicações encontradas">${buscaNeo&&!itens.length?'<p>Nenhuma explicação encontrada. Tente uma palavra do assunto ou escolha outra matéria.</p>':resultados}</section></div></section>`;
  }
  const hrefDestino=id=>id==='escalas'?'propostas/QUADRO-NEO-AURORA.html?origem=estudo':'#'+id;
  function marcarDestino(id){
    const salvo=estudos.favoritos().includes(id);
    return `<button class="marcador-aurora" data-act="favorito" data-value="${id}" aria-pressed="${salvo}" aria-label="Salvar nos favoritos: ${estudos.destinos[id]}">${icone('salvar')}${salvo?'Salvo nos favoritos':'Salvar nos favoritos'}</button>`;
  }
  function caminhosSalvos(){
    const ultima=estudos.dados.ultimaArea,lista=estudos.favoritos();
    if(!lista.length&&!Object.hasOwn(estudos.destinos,ultima))return '';
    const atalho=id=>`<a class="secundario" href="${hrefDestino(id)}">${estudos.destinos[id]} →</a>`;
    return `<section class="papel caminhos-salvos"><h2>Retomar meus estudos</h2>${Object.hasOwn(estudos.destinos,ultima)?`<p>Última área visitada</p>${atalho(ultima)}`:''}${lista.length?`<h3>Favoritos</h3><ul>${lista.map(id=>`<li>${atalho(id)}<button data-act="tirar-favorito" data-value="${id}" aria-label="Remover dos favoritos: ${estudos.destinos[id]}">Remover</button></li>`).join('')}</ul>`:''}</section>`;
  }
  function painel() {
    const d=estudos.dados, abertas=d.sessoes.filter(s=>!s.fim), atual=abertas.at(-1);
    const respondidas=estudos.respostas(), acertos=respondidas.filter(i=>i.escolha===porId.get(i.id).correta).length;
    const proximas = {'Questões':['simulados','Começar um simulado'],'Resumos':['biblioteca','Ler por assunto'],'Mapas mentais':['biblioteca/mapa','Explorar o mapa']};
    const [destino, convite] = proximas[perfil().formato] || ['trilha','Abrir minha trilha'];
    const cards=[['trilha','Trilha por assunto','Escolha um tema para praticar.'],['revisao','Revisar flashcards',`${vencidos().length} para revisar agora.`],['caderno','Caderno de estudos','Guarde suas explicações e dúvidas.'],['agenda','Agenda e foco','Organize provas e tempo de estudo.']];
    return `${titulo('Turma '+perfil().turma,'Seu painel',perfil().objetivos.join(' · '))}
    <section class="missao"><div><p class="rotulo">${atual?'Atividade em andamento':'Sua próxima atividade'}</p><h2>${esc(atual?.assunto || atual?.materia || materia())}</h2><p>${atual?`Você está na questão ${atual.passo+1} de ${atual.itens.length}.`:esc(perfil().formato || 'Trilha por assunto')}</p>${atual?link('Continuar atividade →','sessao/'+atual.id,'principal'):link(convite+' →',destino,'principal')}</div>${tutor()}</section>
    <div class="metricas"><div><b>${respondidas.length}</b> questões respondidas</div><div><b>${acertos}</b> respostas corretas</div><div><b>${d.sessoes.filter(s=>s.fim).length+Number(Boolean(d.aulas?.escalas))}</b> atividades concluídas</div></div>
    <div class="atalhos-estudo"><a class="principal" href="#simulados">Responder questões</a><a class="secundario" href="#atlas">Abrir Atlas interativo</a><a class="secundario" href="#revisao">Revisar cartões</a></div><p class="persistencia-local">${contas.usuario?'O progresso desta conta fica nesta aba até você sair ou fechá-la.':'Seu progresso fica salvo neste navegador.'}</p>${lembretes()}${caminhosSalvos()}${ilustracoes.galeria([...new Set([...perfil().materias,...estudos.materias])])}${d.primeiraRevisao?'<section class="papel selo-revisao"><h2>Primeira revisão lembrada</h2><p>Você recuperou uma resposta de memória. O cartão voltará na próxima revisão.</p></section>':''}${meta()}<section class="grade">${cards.map(([r,t,c])=>`<a class="atalho" href="#${r}"><span aria-hidden="true">${icone(r)}</span><h2>${t}</h2><p>${c}</p></a>`).join('')}</section>
    <section class="amostra"><div><p class="rotulo">Matemática · Quadro do Neo</p><h2>Da planta ao pátio</h2>${d.aulas?.escalas?'<p>Aula concluída</p>':''}</div><a class="secundario" href="propostas/QUADRO-NEO-AURORA.html?origem=estudo">Abrir aula de escalas ↗</a></section>`;
  }
  function trilha() {
    const assuntos=[...new Set(estudos.lista(materia()).map(q=>q.assunto))];
    const concluidos=estudos.assuntosConcluidos(estudos.dados,materia()).size;
    const progresso='<section class="resumo-trilha">'+ilustracoes.imagem(materia())+'<div><h2>Seu percurso</h2><p>'+concluidos+' de '+assuntos.length+' assuntos concluídos</p><progress aria-label="Assuntos concluídos" max="'+assuntos.length+'" value="'+concluidos+'"></progress></div></section>';
    return titulo(materia(),'Trilha de aprendizagem','Acerte todas as questões de uma rodada para concluir o assunto. Os erros ficam disponíveis para revisão.')+listaMateria()+progresso+'<div class="atalhos-estudo"><a class="secundario" href="#atlas">Explorar o Atlas</a>'+(materia()==='Matemática'?'<a class="secundario" href="#pratica">Potenciação guiada</a>':'')+'</div>'+`<ol class="trilha">${assuntos.map((a,i)=>{
      const sessoes=estudos.dados.sessoes.filter(s=>s.materia===materia()&&s.assunto===a);
      const aberta=sessoes.find(s=>!s.fim);
      const completa=sessoes.some(s=>s.fim&&s.itens.every(it=>it.escolha===porId.get(it.id).correta));
      const status=aberta?'Em andamento':completa?'Concluído':sessoes.length?'Revisar':'Disponível';
      return `<li data-concluido="${completa}"><span class="ponto" aria-hidden="true">${completa?'✓':i+1}</span><div><small>${status}</small><h2>${esc(a)}</h2></div>${botao(aberta?'Retomar':completa?'Praticar de novo':'Praticar','iniciar',a)}</li>`;
    }).join('')}</ol>`;
  }
  function biblioteca() {
    const banco = estudos.lista(materia());
    const temas = [...new Set(banco.map(q => q.assunto))];
    if (!temas.includes(assuntoAberto)) assuntoAberto = temas[0];
    const fontes = banco.filter(q => q.assunto === assuntoAberto);
    const mapa = location.hash.endsWith('/mapa');
    const botoes = temas.map(a => `<button data-act="assunto" data-value="${esc(a)}" aria-pressed="${assuntoAberto===a}">${esc(a)}</button>`).join('');
    const conceitos = fontes.map(q => `<details><summary>${esc(q.pergunta)}</summary><p>${esc(q.explicacao)}</p>${estudos.dados.revisoes[q.id]?'Cartão guardado.':botao('Guardar flashcard','guardar',q.id)}</details>`).join('');
    return titulo('Biblioteca de estudos',mapa?'Mapa de assuntos':'Resumos por assunto')+listaMateria()+
      link(mapa?'Ver resumos':'Ver mapa de assuntos',mapa?'biblioteca':'biblioteca/mapa')+
      `<div class="biblioteca"><section class="papel"><h2>${esc(materia())}</h2>${mapa?`<label class="seletor">Zoom do mapa <select id="zoom-mapa">${[100,125,150,175].map(z=>`<option value="${z}" ${z===zoomMapa?'selected':''}>${z}%</option>`).join('')}</select></label><div class="janela-mapa" role="region" aria-label="Ramificações do assunto" tabindex="0"><div class="temas ramificacoes" style="zoom:${zoomMapa}%">${botoes}</div></div>`:`<div class="temas">${botoes}</div>`}</section><section class="papel" id="leitura" tabindex="-1"><p class="rotulo">${esc(materia())}</p><h2>${esc(assuntoAberto)}</h2>${ilustracoes.exemplo(materia(),assuntoAberto)}<p>${esc(fontes[0].explicacao)}</p>${conceitos}<div class="acoes">${botao('Praticar este assunto','iniciar',assuntoAberto,'principal')}</div></section></div>`;
  }
  function simulados() {
    const todas=estudos.dados.sessoes.filter(s=>s.materia===materia()&&!s.assunto).slice().reverse();
    return titulo('Prática','Simulados')+listaMateria()+`<section class="papel"><h2>${esc(materia())}</h2><p>Cinco questões por rodada. O objetivo é acertar pelo menos quatro. As menos praticadas aparecem primeiro.</p>${botao(todas.some(s=>!s.fim)?'Retomar simulado':'Começar simulado','iniciar','','principal')}</section>
    <h2>Histórico</h2>${todas.length?todas.map(s=>`<a class="linha" href="#sessao/${s.id}"><span>${dataCurta(s.inicio)} · ${esc(s.materia)}</span><strong>${s.fim?placar(s):'Em andamento'} →</strong></a>`).join(''):'<p>Os seus simulados aparecerão aqui após a primeira rodada.</p>'}`;
  }
  const placar = s => `${s.itens.filter(i=>i.escolha===porId.get(i.id).correta).length} de ${s.itens.length} acertos`;
  function sessao() {
    const s=estudos.dados.sessoes.find(s=>s.id===sessaoId);
    if(!s) return titulo('Atividade','Atividade não encontrada')+link('Ir ao painel','painel');
    const destino=s.assunto?'trilha':'simulados';
    if(s.fim) return titulo(s.assunto||s.materia,'Atividade concluída',placar(s))+`<section class="papel"><h2>Seu resultado</h2>${s.itens.map(i=>{
      const q=porId.get(i.id);
      return `<details><summary>${i.escolha===q.correta?'Acerto':'Revisar'} · ${esc(q.pergunta)}</summary><p>Sua resposta: ${esc(q.alternativas[i.escolha])}</p><p>Resposta correta: ${esc(q.alternativas[q.correta])}</p><p>${esc(q.explicacao)}</p></details>`;
    }).join('')}</section><div class="acoes">${link('Revisar flashcards','revisao','principal')}${link('Voltar',destino)}</div>`;
    const item=s.itens[s.passo], q=porId.get(item.id), resolvida=item.escolha!==null;
    return titulo(s.assunto||s.materia,`Questão ${s.passo+1} de ${s.itens.length}`)+`<section class="papel pergunta" data-passo="${s.passo}"><p class="rotulo">${esc(q.assunto)}</p><h2>${esc(q.pergunta)}</h2><div class="alternativas">${item.ordem.map((n,j)=>`<button data-act="responder" data-value="${n}" ${resolvida?'disabled':''} class="${resolvida&&n===q.correta?'correta':resolvida&&n===item.escolha?'incorreta':''}"><span>${'ABCD'[j]||j+1}</span>${esc(q.alternativas[n])}${resolvida&&n===item.escolha?' · Sua resposta':''}</button>`).join('')}</div>${resolvida?`<div class="explicacao" tabindex="-1"><h3>${item.escolha===q.correta?'Você acertou.':'Vamos revisar.'}</h3><p>${esc(q.explicacao)}</p>${ilustracoes.exemplo(q.materia,q.assunto)}<p>${item.escolha!==q.correta?'Esta questão entrou nos seus flashcards.':estudos.dados.revisoes[q.id]?'Cartão guardado para revisão.':botao('Guardar flashcard','guardar',q.id)}</p></div>${botao(s.passo===s.itens.length-1?'Ver resultado':'Próxima questão →','avancar','','principal')}`:''}</section>${link('Sair e continuar depois',destino)}`;
  }
  function revisao() {
    const fila=vencidos(), contados=Object.values(estudos.dados.revisoes);
    const topo=titulo('Revisão espaçada','Seus flashcards');
    if(!fila.length) {
      const proximo=contados.map(r=>r.quando).sort((a,b)=>a-b)[0];
      return topo+`<div class="papel"><h2>${proximo?'Revisão em dia':'Seu primeiro cartão'}</h2><p>${proximo?'Próxima revisão em '+new Date(proximo).toLocaleString('pt-BR')+'.':'Durante uma atividade, os erros viram cartões. Você também pode guardar uma questão após acertar.'}</p>${link('Praticar questões','simulados','principal')}</div>`;
    }
    const [id,r]=fila[0],q=porId.get(id), pessoal=estudos.dados.cartoes?.[id];
    return topo+`<section class="papel flash" data-quando="${r.quando}"><p class="rotulo">${fila.length} para revisar · ${esc(q?.materia || 'Meu caderno')}</p><h2>${esc(q?.pergunta || pessoal.frente)}</h2>${revelado===id?`<div class="explicacao"><h3>${esc(q ? q.alternativas[q.correta] : pessoal.verso)}</h3>${q ? '<p>'+esc(q.explicacao)+'</p>'+ilustracoes.exemplo(q.materia,q.assunto) : ''}</div><div class="acoes">${botao('Rever em 10 min','rever',id)}${botao('Lembrei','lembrei',id,'principal')}</div>`:botao('Mostrar resposta','revelar',id,'principal')}</section>`;
  }
  function cadernoErros() {
    const itens = new Map();
    const historico=estudos.dados.sessoes.flatMap(s=>s.itens.filter(i=>i.escolha!==null).map(it=>({it,quando:it.respondidaEm||s.inicio}))).sort((a,b)=>a.quando-b.quando);
    for(const {it} of historico){
      const q=porId.get(it.id);
      if(!itens.has(it.id)&&it.escolha===q.correta)continue;
      const antigo=itens.get(it.id);
      itens.delete(it.id);
      itens.set(it.id,{q,erradas:(antigo?.erradas||0)+Number(it.escolha!==q.correta), ultima:it.escolha, anterior:it.escolha===q.correta?antigo?.anterior:it.escolha});
    }
    const lista=[...itens.values()].reverse().filter(({q,ultima})=>!errosPendentes||ultima!==q.correta);
    return titulo('Caderno de estudos','Questões para retomar')+link('Voltar às anotações','caderno')+
      (itens.size?`<p><label><input type="checkbox" id="erros-pendentes" ${errosPendentes?'checked':''}> Mostrar apenas questões que ainda preciso acertar</label></p>`:'')+
      (lista.length?lista.map(({q,erradas,ultima,anterior})=>`<details class="papel"><summary>${esc(q.pergunta)}</summary><p><strong>${esc(q.materia)} · ${esc(q.assunto)}</strong></p><p>${erradas} tentativa(s) incorreta(s). ${ultima===q.correta?'Você acertou na tentativa mais recente.':''}</p><p>Sua última resposta incorreta: ${esc(q.alternativas[anterior])}</p><p>Resposta correta: ${esc(q.alternativas[q.correta])}</p><p>${esc(q.explicacao)}</p>${botao('Revisar este assunto','praticar-erro',q.id)}</details>`).join(''):itens.size?'<p>Você já acertou todas estas questões na tentativa mais recente.</p>':'<p>As questões que você errar nas atividades vão aparecer aqui, com explicações.</p>');
  }
  function caderno() {
    if(location.hash.endsWith('/erros'))return cadernoErros();
    const notas=estudos.dados.notas;
    const nota=notas.find(n=>n.id===notaId);
    const draft=rascunhosNotas[notaId || 'nova'];
    notaBase=typeof draft?.base==='string'?draft.base:(nota?.texto || '');
    const fonte=notas.find(n=>n.id===fonteId);
    const cartao=fonte?`<form class="papel" id="form-cartao"><h2>Criar flashcard da anotação</h2><p class="trecho">${esc(fonte.texto.slice(0,240))}</p><label>Pergunta<input id="frente" required maxlength="240"></label><label>Resposta<textarea id="verso" required maxlength="2000" rows="3"></textarea></label><div class="acoes"><button class="principal">Guardar para revisar</button><button type="button" data-act="sair-cartao">Cancelar</button></div></form>`:'';
    const pesquisa=`<form class="busca" id="form-busca"><label>Buscar nas anotações<input type="search" id="busca" value="${esc(filtroNotas)}"></label><button>Buscar</button></form>`;
    const itens=notas.filter(n=>n.texto.toLocaleLowerCase('pt-BR').includes(filtroNotas.toLocaleLowerCase('pt-BR'))).reverse();
    return titulo('Material pessoal','Caderno de estudos')+link('Abrir caderno de erros','caderno/erros')+`<form class="papel" id="form-nota"><label for="texto">${nota?'Editar anotação':'Nova anotação'}</label><textarea id="texto" required maxlength="102400" rows="5" placeholder="O que você aprendeu hoje?">${esc(typeof draft?.texto==='string'?draft.texto:notaBase)}</textarea><div class="acoes"><button class="principal">Salvar anotação</button>${nota?'<button type="button" data-act="cancelar-nota">Cancelar edição</button>':''}</div></form>${cartao}
    <form class="papel" id="form-arquivo"><label>Importar texto ou Markdown (até 100 KiB)<input type="file" id="arquivo" accept=".txt,.md,text/plain,text/markdown" required></label><button>Importar como anotação</button></form>
    <section><h2>Anotações salvas</h2>${notas.length?pesquisa:''}${itens.length?itens.map(n=>`<article class="linha"><div><small>${dataCurta(n.data)}</small><p class="pre">${esc(n.texto)}</p></div><div class="acoes">${botao('Editar','editar-nota',n.id)}${botao('Criar flashcard','criar-cartao',n.id)}</div></article>`).join(''):`<p>${notas.length?'Nenhuma anotação encontrada.':'Você pode guardar resumos e perguntas aqui.'}</p>`}</section>`;
  }
  function busca() {
    const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
    const t=norm(consultaGeral.trim());
    const links=Object.entries(paginas).filter(([k,v])=>k!=='busca'&&norm(v).includes(t));
    const temas=new Map();
    if(t) for(const q of questoes) {
      if(norm(q.materia+' '+q.assunto+' '+q.pergunta).includes(t))temas.set(q.materia+'/'+q.assunto, q);
    }
    const resultados=[...temas.values()];
    return titulo('Ferramentas e conteúdos','Buscar')+`<form id="form-global" class="papel"><label for="geral">Nome da ferramenta, matéria ou assunto</label><input type="search" id="geral" maxlength="120" value="${esc(consultaGeral)}"><button class="principal">Buscar</button></form>`+
      (links.length?`<section><h2>Ferramentas</h2><div class="acoes">${links.map(([r,n])=>link(n,r)).join('')}</div></section>`:'')+
      (resultados.length?`<section><h2>Assuntos encontrados (${resultados.length})</h2>${resultados.map(q=>`<button class="linha resultado-busca" data-act="abrir-tema" data-value="${q.id}"><span>${esc(q.assunto)}</span><small>${esc(q.materia)} →</small></button>`).join('')}</section>`:'')+
      (!links.length&&!resultados.length?'<p>Nenhum resultado. Tente uma palavra mais curta.</p>':'');
  }
  function preferenciasLocais() {
    const aparencia=estudos.dados.aparencia || {};
    return `<section class="papel"><h2>Leitura e movimento</h2>${painelMovimento()}<div class="acoes"><label><input type="checkbox" id="letra" ${aparencia.letra?'checked':''}> Ampliar texto</label><label><input type="checkbox" id="contraste" ${aparencia.contraste?'checked':''}> Alto contraste</label><label><input type="checkbox" id="neo-minimo" ${apresentacaoAurora.neoMinimo()?'checked':''}> Minimizar Neo</label><label><input type="checkbox" id="festa" ${aparencia.festa!==false?'checked':''}> Confete nas conquistas</label></div></section>`+'<section class="papel"><h2>Dados neste navegador</h2><a href="#conta/entrar">Opções de conta</a><p>Este dispositivo guarda seu perfil de estudo. Você pode baixar suas preferências, atividades e materiais antes de encerrar o uso em um aparelho compartilhado.</p><div class="acoes">'+
      botao('Baixar meus dados','exportar')+botao('Apagar dados locais…','pedir-limpeza')+'</div><div id="confirmacao" hidden><p>Apagar o perfil, anotações, desenhos, flashcards e progresso deste navegador? Esta ação é definitiva.</p>'+
      botao('Manter meus dados','manter')+botao('Confirmar exclusão local','limpar')+'</div></section>';
  }
  function calendario() {
    const [ano,mes]=mesVisivel.split('-').map(Number);
    const primeiro=new Date(ano,mes-1,1);
    const numeroDias=new Date(ano,mes,0).getDate();
    const tituloMes=primeiro.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
    const compromissos=estudos.dados.agenda;
    const celulas=Array((primeiro.getDay()+6)%7).fill('<span></span>');
    for(let dia=1;dia<=numeroDias;dia++){
      const iso=mesVisivel+'-'+String(dia).padStart(2,'0');
      const qtd=compromissos.filter(e=>e.data===iso).length;
      const descricao=dia+' de '+tituloMes+(qtd?', '+qtd+' compromisso(s)':'');
      celulas.push(`<button data-act="dia" data-value="${iso}" aria-label="${esc(descricao)}" aria-pressed="${iso===diaSelecionado}" ${iso===diaISO(new Date())?'aria-current="date"':''}>${dia}${qtd?`<small aria-hidden="true">•${qtd}</small>`:''}</button>`);
    }
    return `<section class="papel calendario"><div class="mes"><button data-act="mes" data-value="-1" aria-label="Mês anterior">←</button><h2>${esc(tituloMes)}</h2><button data-act="mes" data-value="1" aria-label="Próximo mês">→</button></div><div class="dias">${['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(n=>`<strong>${n}</strong>`).join('')}${celulas.join('')}</div></section>`;
  }
  function lembretes() {
    const agora=new Date(), hoje=diaISO(agora);
    const semana=new Date(agora);semana.setDate(semana.getDate()+7);
    const pendentes=estudos.dados.agenda.filter(e=>!e.feito&&e.data<=diaISO(semana)).sort((a,b)=>a.data.localeCompare(b.data));
    if(!pendentes.length)return '';
    return `<section class="papel"><h2>Lembretes da agenda</h2>${pendentes.slice(0,3).map(e=>`<p><strong>${e.data<hoje?'Em atraso':e.data===hoje?'Hoje':e.data.split('-').reverse().join('/')}</strong> · ${esc(e.texto)}</p>`).join('')}${link('Ver agenda','agenda')}</section>`;
  }
  function materiais(){
    const lista=estudos.dados.materiais || [];
    return `<section class="papel materiais"><h2>Materiais para estudar</h2><form id="form-material"><label for="material">Material que preciso separar</label><input id="material" maxlength="100" required><button class="secundario">Incluir material</button></form>${lista.map(m=>`<div class="linha"><label><input type="checkbox" data-material="${esc(m.id)}" ${m.separado?'checked':''}> <span>${esc(m.nome)}</span></label><button data-act="remover-material" data-value="${esc(m.id)}" aria-label="Remover ${esc(m.nome)}">Remover</button></div>`).join('')}</section>`;
  }
  function agenda() {
    const entradas=estudos.dados.agenda.filter(e=>!diaSelecionado || e.data===diaSelecionado).sort((a,b)=>a.data.localeCompare(b.data));
    const f=estudos.dados.foco;
    return titulo('Organização','Agenda e foco')+calendario()+`<section class="grade"><form id="form-agenda" class="papel"><h2>Adicionar compromisso</h2><label for="evento">Prova ou tarefa</label><input required maxlength="160" id="evento"><label for="dia">Data</label><input required type="date" id="dia" value="${esc(diaSelecionado)}"><button class="principal">Adicionar</button></form><div class="papel"><h2>${f?.tipo==='pausa'?'Intervalo curto':'Tempo de foco'}</h2><p id="relogio" class="relogio" role="timer"></p><div class="acoes">${botao(f?.ate?'Pausar':f?.restante?'Retomar':'Iniciar 25 minutos','foco','','principal')}${f?botao('Reiniciar','zerar'):''}</div></div></section><h2>Compromissos${diaSelecionado?' do dia':''}</h2>${diaSelecionado?botao('Mostrar todos','todos-dias'):''}${entradas.length?entradas.map(e=>`<div class="linha"><label><input type="checkbox" data-tarefa="${esc(e.id)}" ${e.feito?'checked':''}> ${esc(e.texto)}</label><time datetime="${esc(e.data)}">${esc(e.data.split('-').reverse().join('/'))}</time></div>`).join(''):'<p>Nenhum compromisso cadastrado.</p>'}`+materiais();
  }
  function relogio() {
    const el=document.querySelector('#relogio'); if(!el)return;
    const f=estudos.dados.foco;
    const ms=f?.ate?Math.max(0,f.ate-Date.now()):f?.restante??1500000;
    const seg=Math.ceil(ms/1000);
    el.textContent=seg?Math.floor(seg/60)+':'+String(seg%60).padStart(2,'0'):'Sessão concluída';
    if(!seg && f?.ate){const b=document.querySelector('[data-act="foco"]');if(b)b.textContent=f.tipo==='pausa'?'Iniciar 25 minutos':'Começar pausa de 5 minutos';}
  }
  function navegar(proxima) {
    if(location.hash==='#'+proxima) render(true);
    else location.hash=proxima;
  }
  function render(focar=false) {
    const [solicitada,id]=location.hash.slice(1).split('/');
    atlasAurora.fechar();apresentacaoAurora.fechar();
    rota=['aurora','atlas','conta','preferencias'].includes(solicitada)?solicitada:!perfil()?'inicio':visitante.editando?'ajustes':(Object.hasOwn(paginas,solicitada)||['pratica','sessao'].includes(solicitada)?solicitada:'painel');
    sessaoId=id||'';
    if(rota==='ajustes'&&!visitante.editando) visitante.comecar();
    const abas=perfil()&&!visitante.editando&&rota!=='aurora'?Object.entries(paginas):[];
    nav.innerHTML=abas.map(([r,n])=>`<a href="#${r}" ${r===rota?'aria-current="page"':''}>${icone(r)}${n}</a>`).join('');
    const naEntrada=rota==='aurora'||(rota==='inicio'&&!visitante.editando);
    if(naEntrada)nav.innerHTML=perfil()?'<a href="#painel">Meu painel ↗</a>':'<a id="estudar-nav" href="#conta/entrar">Acesso do estudante</a>';
    if(rota==='atlas')nav.innerHTML=perfil()?'<a href="#trilha">Voltar à trilha</a>':'<a href="#inicio">Início</a>';
    if(rota==='conta'&&!perfil())nav.innerHTML='<a href="#inicio">Voltar ao início</a>';
    nav.classList.toggle('menu-estudos',Boolean(abas.length)&&rota!=='atlas');
    menu.innerHTML=nav.classList.contains('menu-estudos')?'Menu<span class="menu-extenso"> de estudos</span>':'Menu';
    menu.setAttribute('aria-label',nav.classList.contains('menu-estudos')?'Menu de estudos':'Menu');
    mostrarMenu();
    document.documentElement.classList.toggle('letra-ampliada',estudos.dados.aparencia?.letra===true);
    document.documentElement.classList.toggle('alto-contraste',estudos.dados.aparencia?.contraste===true);
    const views={preferencias:()=>titulo('Preferências','Movimento e animações')+'<section class="papel">'+painelMovimento()+'<a class="secundario" href="#aurora">Voltar ao início</a></section>',conta,pratica:()=>titulo('Trilha de matemática','Potenciação guiada')+apresentacaoAurora.pratica(robo)+link('Voltar à trilha','trilha'),aurora:()=>apresentacaoAurora.tela(robo,Boolean(perfil())),atlas:()=>atlasAurora.tela(robo,Boolean(perfil())),inicio,painel,trilha,simulados,biblioteca,busca,tutor:tutorEstudos,quadro:()=>titulo('Estúdio de estudos','Quadro livre','Desenhe com o dedo ou o mouse. Para um fluxograma, adicione e conecte os blocos pelo nome.')+quadroLivre.tela(esc),revisao,sessao,caderno,agenda,ajustes:()=>`<section class="config">${titulo('Perfil local','Ajustes')}<div class="papel wizard">${visitante.conteudo('Quais matérias você quer priorizar?')}</div>${preferenciasLocais()}</section>`};
    principal.className=['atlas','aurora'].includes(rota)||(rota==='inicio'&&!visitante.editando)?'entrada':'conteudo';
    principal.innerHTML=views[rota]();
    if(principal.className==='conteudo'){
      organizarArea(principal);
      const destino=location.hash.slice(1);
      if(perfil()&&Object.hasOwn(estudos.destinos,destino))principal.querySelector('.cab')?.insertAdjacentHTML('beforeend',marcarDestino(destino));
    }
    document.body.classList.toggle('espaco-estudo',principal.className==='conteudo');
    const comAtlas=Boolean(principal.querySelector('.atlas-hero'));
    document.body.classList.toggle('no-atlas',comAtlas);
    document.querySelector('#ver-atlas').hidden=!comAtlas;
    document.body.classList.toggle('apresentando',naEntrada);
    if(naEntrada||rota==='pratica')apresentacaoAurora.montar();
    else if(comAtlas)atlasAurora.montar();
    else if(rota==='sessao'||((rota==='ajustes'||rota==='inicio')&&visitante.editando)){
      const area=principal.querySelector('.wizard, .pergunta, .papel');
      area?.insertAdjacentHTML('afterbegin',ajudaNeo());
      for(const escolha of principal.querySelectorAll('.wizard [data-campo=materias]')) {
        escolha.insertAdjacentHTML('afterbegin',ilustracoes.imagem(escolha.dataset.valor,true));
      }
    }
    if(rota==='quadro')quadroLivre.montar(()=>render());
    if(rota==='inicio'||rota==='ajustes')visitante.prepararVoz();
    document.querySelector('#persistencia').textContent=[aviso,visitante.aviso,estudos.mensagem].filter(Boolean).join(' ');
    document.body.classList.toggle('neo-minimo',apresentacaoAurora.neoMinimo());
    document.title=(paginas[rota]|| (rota==='sessao'?'Atividade':'Boas-vindas'))+' · Missão 8º Ano';
    if(['conta','pratica','preferencias'].includes(rota))document.title=principal.querySelector('h1').textContent+' · Missão 8º Ano';
    relogio();
    celebracoes.posicionar();
    if(focar)principal.focus();
  }
  function situacaoMovimento(){
    if(identidadeAurora.preferencia==='sistema'&&identidadeAurora.sistemaMovimento.matches)return 'O navegador informa que o sistema prefere movimento reduzido. O fundo fica parado e as conquistas aparecem em texto.';
    return identidadeAurora.reduzir()?'O movimento foi reduzido neste navegador.':'O fundo está animado. O confete acompanha conquistas, como três acertos seguidos.';
  }
  function painelMovimento(){
    const opcoes=[['sistema','Seguir a preferência do sistema'],['animar','Animar o fundo e as conquistas'],['reduzido','Reduzir movimento']];
    return '<label>Movimento neste navegador<select id="movimento">'+opcoes.map(([v,n])=>'<option value="'+v+'" '+(identidadeAurora.preferencia===v?'selected':'')+'>'+n+'</option>').join('')+'</select></label><p id="estado-movimento" role="status">'+situacaoMovimento()+'</p>';
  }
  function movimento(){
    if(identidadeAurora.reduzir())celebracoes.limparParticulas();
    const estado=document.querySelector('#estado-movimento');if(estado)estado.textContent=situacaoMovimento();
    const campo=document.querySelector('#movimento');if(campo)campo.value=identidadeAurora.preferencia;
  }
  document.querySelector('#ver-atlas').onclick=()=>{const b=document.querySelector('.atlas-rodape [aria-pressed=true]');b?.focus();b?.click();};
  window.addEventListener('preferencia-movimento',movimento);
  document.querySelector('#pular').onclick=e=>{e.preventDefault();principal.focus();};
  window.addEventListener('hashchange',async()=>{
    tutorNeo.parar();aviso='';revelado='';notaId='';render(true);window.scrollTo(0,0);
    const destino=location.hash.slice(1);
    if(perfil()&&Object.hasOwn(estudos.destinos,destino)){
      await estudos.lembrarArea(destino);
      if(rota==='painel')render();
    }
  });
  window.addEventListener('storage',e=>{
    if((e.key===contas.chave('missao803.previa.visitante.v1') || e.key===null) && e.newValue===null) {
      try{sessionStorage.removeItem(contas.chave('missao803.rascunhos'));}catch{}
      location.reload();
    }
  });
  window.addEventListener('estudos-atualizados',()=>{if(!document.querySelector('textarea:focus, form input:focus')&&rota!=='caderno')render();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&rota==='revisao')render();});
  window.setInterval(()=>{relogio();if(rota==='revisao'&&vencidos().length&&!document.querySelector('.flash'))render();},1000);
  let destinoEntrada='';
  principal.addEventListener('click',async e=>{
    const atalho=e.target.closest('[data-destino]');if(atalho&&!perfil())destinoEntrada=atalho.dataset.destino;
    const b=e.target.closest('button');if(!b||ocupado)return;
    if(b.id==='neo'){
      const dica=document.querySelector('#dica');
      dica.hidden=!dica.hidden;
      if(!b.closest('.neo-ajuda')&&!b.closest('.palco'))dica.textContent=dicas[rota]||dicas.painel;
      b.setAttribute('aria-expanded',String(!dica.hidden));return;
    }
    if(b.dataset.campo){
      visitante.mudar(b.dataset.campo,b.dataset.valor);render();
      principal.querySelector(`[data-campo="${CSS.escape(b.dataset.campo)}"][data-valor="${CSS.escape(b.dataset.valor)}"]`)?.focus();return;
    }
    const acao=b.dataset.act||b.dataset.acao, valor=b.dataset.value;
    if(!acao)return;
    ocupado=true;aviso='';b.setAttribute('aria-busy','true');
    try {
      switch(acao) {
        case 'sair-conta': case 'provedor':
          try {if(acao==='sair-conta')await contas.sair();else await contas.social(valor);} catch(erro){document.querySelector('#persistencia').textContent=contas.mensagem(erro);}return;
        case 'começar': case 'comecar': visitante.comecar();if(['aurora','atlas','conta'].includes(rota)){navegar('inicio');return;}break;
        case 'voltar': visitante.voltar();if(perfil()&&!visitante.editando){navegar('painel');return;}break;
        case 'cancelar': visitante.sair();navegar('painel');return;
        case 'avancar': 
          if(b.dataset.acao){
            if(visitante.avancar()){
              await estudos.alterar(d=>{if(perfil().materias.length&&!perfil().materias.includes(d.materia))d.materia=perfil().materias[0];});
              if(contas.usuario){
                try {await contas.salvarPreferencias(perfil());}catch{visitante.informar('As preferências ficaram nesta aba. A conta não confirmou a sincronização.');}
              }
              navegar(destinoEntrada||'painel');destinoEntrada='';return;
            }
          }else celebracoes.mostrar(await estudos.avancar(sessaoId,Number(b.closest('[data-passo]').dataset.passo)));
          break;
        case 'abrir-materia': if(estudos.materias.includes(valor)){await estudos.alterar(d=>{d.materia=valor;});navegar('trilha');return;}break;
        case 'iniciar': navegar('sessao/'+await estudos.iniciar(materia(),valor));return;
        case 'responder': celebracoes.mostrar(await estudos.responder(sessaoId,Number(b.closest('[data-passo]').dataset.passo),Number(valor)));break;
        case 'guardar': await estudos.guardarCard(valor);break;
        case 'exportar': {
          const arquivo=new Blob([JSON.stringify({versao:1,exportado:new Date().toISOString(),perfil:perfil(),estudos:estudos.dados},null,2)],{type:'application/json'});
          const url=URL.createObjectURL(arquivo), a=document.createElement('a');
          a.href=url;a.download='missao803-meus-estudos.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);return;
        }
        case 'pedir-limpeza': {
          const c=document.querySelector('#confirmacao');c.hidden=false;c.querySelector('button').focus();return;
        }
        case 'manter': document.querySelector('#confirmacao').hidden=true;document.querySelector('[data-act="pedir-limpeza"]').focus();return;
        case 'limpar': {
          try{
            await estudos.apagar();
            for(const chave of ['missao803.previa.visitante.v1','missao803.previa.percurso.v1','missao803.movimento','missao803.neo'])(chave.includes('previa')?contas.armazenamento:localStorage).removeItem(chave.includes('previa')?contas.chave(chave):chave);
            sessionStorage.removeItem(contas.chave('missao803.rascunhos'));
          }catch{document.querySelector('#persistencia').textContent='O navegador bloqueou a exclusão completa. Verifique o armazenamento nas configurações do navegador.';return;}
          history.replaceState(null,'','#inicio');location.reload();return;
        }
        case 'ouvir': tutorNeo.ouvir(porId.get(valor).explicacao,()=>{document.querySelector('#persistencia').textContent='A voz escolhida está indisponível. A explicação continua em texto.';});return;
        case 'praticar-erro': {
          const q=porId.get(valor);
          await estudos.alterar(d=>{d.materia=q.materia;});navegar('sessao/'+await estudos.iniciar(q.materia,q.assunto));return;
        }
        case 'abrir-tema': {
          const q=porId.get(valor);
          await estudos.alterar(d=>{d.materia=q.materia;});assuntoAberto=q.assunto;navegar('biblioteca');return;
        }
        case 'favorito': case 'tirar-favorito':{
          const incluir=acao==='favorito'&&b.getAttribute('aria-pressed')==='false';
          await estudos.salvarDestino(valor,incluir);aviso=incluir?'Guardado nos favoritos.':'Removido dos favoritos.';break;
        }
        case 'remover-material': await estudos.alterar(d=>{d.materiais=d.materiais.filter(m=>m.id!==valor);});aviso='Material removido.';break;
        case 'assunto': assuntoAberto=valor;break;
        case 'revelar': revelado=valor;break;
        case 'lembrei': case 'rever': celebracoes.mostrar(await estudos.revisar(valor,acao==='lembrei',Number(b.closest('[data-quando]').dataset.quando)));revelado='';break;
        case 'editar-nota': notaId=valor;break;
        case 'criar-cartao': fonteId=valor;break;
        case 'sair-cartao': fonteId='';break;
        case 'cancelar-nota': delete rascunhosNotas[notaId];preservarRascunhos();notaId='';break;
        case 'dia': diaSelecionado=valor;break;
        case 'todos-dias': diaSelecionado='';break;
        case 'mes': {
          const [ano,mes]=mesVisivel.split('-').map(Number);
          mesVisivel=diaISO(new Date(ano,mes-1+Number(valor),1)).slice(0,7);diaSelecionado='';break;
        }
        case 'foco': await estudos.alterar(d=>{
          const f=d.foco, agora=Date.now();
          if(f?.ate>agora)d.foco={tipo:f.tipo || 'estudo',restante:f.ate-agora};
          else if(f?.restante)d.foco={tipo:f.tipo || 'estudo',ate:agora+f.restante};
          else if(f?.ate && f.tipo!=='pausa')d.foco={tipo:'pausa',ate:agora+300000};
          else d.foco={tipo:'estudo',ate:agora+1500000};
        });break;
        case 'zerar': await estudos.alterar(d=>{d.foco=null;});break;
        default:return;
      }
      render(true);
      if(acao==='favorito')principal.querySelector('.marcador-aurora')?.focus({preventScroll:true});
      if(acao==='tirar-favorito')principal.querySelector('.caminhos-salvos a')?.focus({preventScroll:true});
      if(acao==='responder')document.querySelector('.explicacao')?.focus();
      if(acao==='criar-cartao')document.querySelector('#frente')?.focus();
      if(acao==='mes')document.querySelector('[data-act="mes"][data-value="'+valor+'"]')?.focus();
      if(acao==='dia')document.querySelector('#evento')?.focus();
      if(acao==='assunto')document.querySelector('#leitura')?.focus();
      if(acao==='editar-nota')document.querySelector('#texto')?.focus();
    } catch {
      document.querySelector('#persistencia').textContent='A ação não pôde ser concluída. Confira seu progresso e tente novamente.';
    } finally {b.removeAttribute('aria-busy');ocupado=false;}
  });
  principal.addEventListener('input',e=>{
    if(e.target.id==='texto'){rascunhosNotas[notaId || 'nova']={base:notaBase,texto:e.target.value};preservarRascunhos();}
  });
  principal.addEventListener('change',async e=>{
    if(e.target.id==='movimento'){
      identidadeAurora.definirMovimento(e.target.value);return;
    }
    if(e.target.id==='erros-pendentes'){errosPendentes=e.target.checked;render();document.querySelector('#erros-pendentes')?.focus();return;}
    if(e.target.id==='zoom-mapa'){
      zoomMapa=Number(e.target.value);
      principal.querySelector('.ramificacoes').style.zoom=zoomMapa+'%';
      return;
    }
    if(e.target.id==='neo-minimo'){apresentacaoAurora.ajustarNeo(e.target.checked);return;}
    if(e.target.id==='letra'||e.target.id==='contraste'||e.target.id==='festa'){if(!e.target.checked&&e.target.id==='festa')celebracoes.limparParticulas();const id=e.target.id,on=e.target.checked;await estudos.alterar(d=>{d.aparencia ||= {}; d.aparencia[id]=on;});render();document.getElementById(id).focus();return;}
    if(e.target.id==='materia'){tutorNeo.parar();const m=e.target.value;await estudos.alterar(d=>{if(estudos.materias.includes(m))d.materia=m;});render();document.querySelector('#materia').focus();}
    if(e.target.dataset.material){
      const id=e.target.dataset.material,separado=e.target.checked;
      await estudos.alterar(d=>{const m=d.materiais.find(m=>m.id===id);if(m)m.separado=separado;});
    }
    if(e.target.dataset.tarefa){const id=e.target.dataset.tarefa, feito=e.target.checked;await estudos.alterar(d=>{const item=d.agenda.find(x=>x.id===id);if(item)item.feito=feito;});}
  });
  principal.addEventListener('submit',async e=>{
    e.preventDefault();if(ocupado)return;
    const form=e.target;
    if(form.id==='form-conta'){
      const status=principal.querySelector('#status-conta');ocupado=true;const enviar=form.querySelector('button');enviar.disabled=true;enviar.setAttribute('aria-busy','true');
      try {status.textContent=await contas.enviar(form.dataset.modo,form);form.reset();} catch(erro){status.textContent=contas.mensagem(erro);} finally{ocupado=false;enviar.disabled=false;enviar.removeAttribute('aria-busy');}return;
    }
    if(!['form-global','form-neo','form-meta','form-nota','form-agenda','form-material','form-cartao','form-arquivo','form-busca'].includes(form.id))return;
    ocupado=true;
    const enviar=e.submitter;
    enviar?.setAttribute('aria-busy','true');
    try {
      if(form.id==='form-material'){
        const nome=form.querySelector('#material').value.trim();
        if(!nome)return;
        await estudos.alterar(d=>{d.materiais.push({id:estudos.uid(),nome,separado:false});});
        aviso='Material incluído.';
      }
      else if(form.id==='form-global'){consultaGeral=form.querySelector('#geral').value.trim();}
      else if(form.id==='form-busca'){filtroNotas=form.querySelector('#busca').value.trim();}
      else if(form.id==='form-arquivo'){
        const arquivo=form.querySelector('#arquivo').files[0];
        if(!arquivo || !/\.(txt|md)$/i.test(arquivo.name) || arquivo.size>102400){document.querySelector('#persistencia').textContent='Use um arquivo .txt ou .md de até 100 KiB.';return;}
        let texto;
        try{texto=(await arquivo.text()).trim();}catch{document.querySelector('#persistencia').textContent='O navegador não conseguiu ler o arquivo.';return;}
        if(!texto || texto.includes('\u0000')){document.querySelector('#persistencia').textContent='O arquivo precisa conter texto legível.';return;}
        await estudos.alterar(d=>d.notas.push({id:estudos.uid(),texto,data:Date.now()}));aviso='Texto importado para o caderno.';
      }else if(form.id==='form-cartao'){
        const frente=form.querySelector('#frente').value.trim(), verso=form.querySelector('#verso').value.trim();
        if(!frente||!verso)return;
        const id=estudos.uid(), fonte=fonteId;
        await estudos.alterar(d=>{d.cartoes ||= {};d.cartoes[id]={frente,verso,fonte};d.revisoes[id]={nivel:0,quando:Date.now()};});
        fonteId='';aviso='Flashcard guardado para revisão.';
      }else if(form.id==='form-neo'){ buscaNeo=form.querySelector('#consulta').value.trim(); tutorNeo.parar(); }
      else if(form.id==='form-meta'){ const valor=Number(form.querySelector('#alvo').value); if(Number.isInteger(valor)&&valor>=1&&valor<=50){await estudos.alterar(d=>{d.meta=valor;});aviso='Meta da semana salva.';} }
      else if(form.id==='form-nota'){
        const texto=form.querySelector('textarea').value.trim();if(!texto)return;
        const id=notaId,base=notaBase;
        const conflito=await estudos.alterar(d=>{
          const n=d.notas.find(n=>n.id===id);
          if(n&&n.texto===base){n.texto=texto;n.data=Date.now();}
          else d.notas.push({id:estudos.uid(),texto,data:Date.now()});
          return n&&n.texto!==texto;
        });
        delete rascunhosNotas[notaId || 'nova'];preservarRascunhos();notaId='';aviso=conflito?'A anotação mudou em outra aba. Sua versão foi salva separadamente.':'Anotação salva.';
      }else{
        const texto=form.querySelector('#evento').value.trim(),data=form.querySelector('#dia').value;
        if(!texto||!data)return;
        await estudos.alterar(d=>d.agenda.push({id:estudos.uid(),texto,data,feito:false}));aviso='Compromisso adicionado.';
      }
      render(true);
      if(form.id==='form-material')document.querySelector('#material')?.focus();
    }finally{enviar?.removeAttribute('aria-busy');ocupado=false;}
  });
  if(contas.usuario&&!perfil()&&!contas.recuperando) visitante.comecar();
  movimento();render();
})();
