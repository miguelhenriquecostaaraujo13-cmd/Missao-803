'use strict';

const estudos = (() => {
  const chave = typeof contas === 'undefined' ? 'missao803.estudos.v1' : contas.chave('missao803.estudos.v1');
  const porId = new Map(questoes.map(q => [q.id, q]));
  const materias = [...new Set(questoes.map(q => q.materia))];
  const novo = () => ({ versao: 1, materia: '', sessoes: [], revisoes: {}, notas: [], agenda: [], materiais: [], foco: null });
  let dados = novo();
  let mensagem = '';
  let apenasMemoria = false;

  const idValido = s => typeof s === 'string' && /^[a-z0-9-]{1,64}$/i.test(s);
  function sessaoValida(s) {
    if (!s || !idValido(s.id) || !materias.includes(s.materia) || typeof s.assunto !== 'string'
      || !Number.isFinite(s.inicio) || !(s.fim === null || Number.isFinite(s.fim))
      || !Array.isArray(s.itens) || !Number.isInteger(s.passo) || s.passo < 0 || s.passo >= s.itens.length) return false;
    return s.itens.every(i => {
      const q = porId.get(i?.id);
      return q && Array.isArray(i.ordem) && i.ordem.length === q.alternativas.length
        && new Set(i.ordem).size === i.ordem.length && i.ordem.every(n => Number.isInteger(n) && n >= 0 && n < q.alternativas.length)
        && (i.escolha === null || i.ordem.includes(i.escolha));
    });
  }
  function ler() {
    if (apenasMemoria) return;
    try {
      const texto = (typeof contas==='undefined'?localStorage:contas.armazenamento).getItem(chave);
      const salvo = texto ? JSON.parse(texto) : novo();
      if (salvo?.versao !== 1 || !Array.isArray(salvo.sessoes) || !Array.isArray(salvo.notas)
          || !Array.isArray(salvo.agenda) || !salvo.revisoes || typeof salvo.revisoes !== 'object'
          || (salvo.materiais!==undefined && (!Array.isArray(salvo.materiais)||!salvo.materiais.every(m=>m&&idValido(m.id)&&typeof m.nome==='string'&&typeof m.separado==='boolean')))
          || !salvo.sessoes.every(sessaoValida)
          || !salvo.notas.every(n => n && idValido(n.id) && typeof n.texto === 'string' && Number.isFinite(n.data))
          || !salvo.agenda.every(e => e && idValido(e.id) && typeof e.texto === 'string' && typeof e.data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.data))
          || !Object.entries(salvo.revisoes).every(([id,r]) => (porId.has(id) || (idValido(id) && typeof salvo.cartoes?.[id]?.frente === 'string' && typeof salvo.cartoes?.[id]?.verso === 'string')) && r && Number.isFinite(r.quando) && Number.isInteger(r.nivel))
          || (salvo.meta != null && (!Number.isInteger(salvo.meta) || salvo.meta < 1 || salvo.meta > 50))) {
        throw new Error('Formato incompatível');
      }
      salvo.materiais ??= [];
      dados = salvo;
    } catch {
      apenasMemoria = true;
      mensagem = 'O armazenamento deste navegador está indisponível ou contém dados incompatíveis. Esta sessão funciona em memória.';
    }
  }
  ler();

  async function alterar(fn) {
    function gravar() {
      ler();
      const valor = fn(dados);
      if (!apenasMemoria) {
        try { (typeof contas==='undefined'?localStorage:contas.armazenamento).setItem(chave, JSON.stringify(dados)); }
        catch {
          apenasMemoria = true;
          mensagem = 'O navegador não conseguiu salvar. Suas mudanças ficam disponíveis enquanto esta página estiver aberta.';
        }
      }
      return valor;
    }
    return navigator.locks ? navigator.locks.request(chave, gravar) : gravar();
  }
  const uid = () => crypto.randomUUID?.() || Array.from(crypto.getRandomValues(new Uint32Array(4)), n => n.toString(16).padStart(8,'0')).join('');
  function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }
  function respostas(materia) {
    return dados.sessoes.filter(s => !materia || s.materia === materia)
      .flatMap(s => s.itens.filter(i => Number.isInteger(i.escolha)));
  }
  function lista(materia) { return questoes.filter(q => q.materia === materia); }
  function iniciar(materia, assunto = '') {
    return alterar(d => {
      const aberta = d.sessoes.find(s => !s.fim && s.materia === materia && s.assunto === assunto);
      if (aberta) return aberta.id;
      const vistos = new Map();
      for (const s of d.sessoes) for (const i of s.itens) vistos.set(i.id, (vistos.get(i.id) || 0) + 1);
      const banco = lista(materia).filter(q => !assunto || q.assunto === assunto);
      const itens = embaralhar(banco).sort((a,b) => (vistos.get(a.id)||0) - (vistos.get(b.id)||0))
        .slice(0, assunto ? 3 : 5).map(q => ({
          id: q.id, ordem: embaralhar(q.alternativas.map((_,i) => i)), escolha: null
        }));
      if (!itens.length) throw new Error('Este assunto ainda não tem questões.');
      const id = uid();
      d.sessoes.push({ id, materia, assunto, itens, passo: 0, inicio: Date.now(), fim: null });
      return id;
    });
  }
  function semana(d) {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - (hoje.getDay() + 6) % 7).getTime();
    const total = d.sessoes.filter(s => s.fim >= inicio).length + Number((d.aulas?.escalas || 0) >= inicio);
    return { inicio, total };
  }
  function metaAlcancada(d) {
    const { inicio, total } = semana(d);
    if (!d.meta || total !== d.meta || d.semanaCelebrada === inicio) return [];
    d.semanaCelebrada = inicio;
    return ['meta'];
  }
  function concluirEscalas() {
    return alterar(d => {
      if (d.aulas?.escalas) return [];
      d.aulas ||= {};
      d.aulas.escalas = Date.now();
      return metaAlcancada(d);
    });
  }
  const acertou = i => i.escolha === porId.get(i.id).correta;
  function assuntosConcluidos(d,materia) {
    return new Set(d.sessoes.filter(s => s.fim && s.materia === materia && s.assunto && s.itens.every(acertou)).map(s => s.assunto));
  }
  function sequenciaAnterior(d) {
    if (Number.isSafeInteger(d.sequencia)) return d.sequencia;
    const antigas = d.sessoes.flatMap(s => s.itens.filter(i => i.escolha !== null)
      .map(i => ({ certo: acertou(i), hora: i.respondidaEm || s.inicio })));
    return antigas.sort((a,b) => a.hora - b.hora).reduce((n,i) => i.certo ? n + 1 : 0, 0);
  }
  function responder(id, passo, escolha) {
    return alterar(d => {
      const s = d.sessoes.find(s => s.id === id);
      if (!s || s.fim || s.passo !== passo) return;
      const i = s.itens[passo];
      if (i.escolha !== null || !i.ordem.includes(escolha)) return;
      d.sequencia = escolha === porId.get(i.id).correta ? sequenciaAnterior(d) + 1 : 0;
      i.escolha = escolha;
      i.respondidaEm = Date.now();
      if (escolha !== porId.get(i.id).correta) d.revisoes[i.id] = { nivel: 0, quando: Date.now() };
      if (d.sequencia === 3) return ['tres'];
      if (d.sequencia === 5) return ['cinco'];
      return [];
    });
  }
  function avancar(id, passo) {
    return alterar(d => {
      const s = d.sessoes.find(s => s.id === id);
      if (!s || s.fim || s.passo !== passo || s.itens[passo].escolha === null) return;
      if (passo + 1 < s.itens.length) {
        s.passo++;
        return [];
      }
      s.fim = Date.now();
      const marcos = metaAlcancada(d);
      if (s.assunto && s.itens.every(acertou)) {
        const repetida = d.sessoes.some(outra => outra !== s && outra.fim && outra.materia === s.materia
          && outra.assunto === s.assunto && outra.itens.every(acertou));
        if (!repetida) {
          const assuntos = new Set(lista(s.materia).map(q => q.assunto));
          const concluidos = assuntosConcluidos(d,s.materia);
          marcos.unshift(concluidos.size === assuntos.size ? 'materia' : 'trilha');
        }
      } else if (!s.assunto && s.itens.filter(acertou).length >= Math.ceil(.8 * s.itens.length)) {
        marcos.unshift('simulado');
      }
      return marcos;
    });
  }
  function revisar(id, lembrei, previsto) {
    return alterar(d => {
      const card = d.revisoes[id];
      if (!card || card.quando !== previsto || card.quando > Date.now()) return;
      const dias = [1, 3, 7, 14, 30];
      const nivel = lembrei ? Math.min((card.nivel || 0) + 1, dias.length) : 0;
      const depois = new Date();
      if (lembrei) depois.setDate(depois.getDate() + dias[nivel - 1]);
      else depois.setMinutes(depois.getMinutes() + 10);
      const primeira = !d.primeiraRevisao && !Object.values(d.revisoes).some(r => r.nivel > 0);
      d.revisoes[id] = { nivel, quando: depois.getTime() };
      if (lembrei && primeira) {
        d.primeiraRevisao = Date.now();
        return ['revisao'];
      }
      return [];
    });
  }
  const destinos=Object.freeze({
    trilha:'Trilha',simulados:'Simulados',revisao:'Flashcards',biblioteca:'Biblioteca',
    'biblioteca/mapa':'Mapa de assuntos',quadro:'Quadro livre',caderno:'Caderno',
    'caderno/erros':'Caderno de erros',tutor:'Tutor Neo',agenda:'Agenda e foco',escalas:'Da planta ao pátio'
  });
  function favoritos(){
    return Array.isArray(dados.favoritos)?dados.favoritos.filter(id=>Object.hasOwn(destinos,id)):[];
  }
  function salvarDestino(id,incluir){
    if(!Object.hasOwn(destinos,id))return;
    return alterar(d=>{
      const lista=new Set(favoritos());
      if(incluir)lista.add(id);else lista.delete(id);
      d.favoritos=[...lista];
    });
  }
  async function lembrarArea(id){
    if(Object.hasOwn(destinos,id)&&dados.ultimaArea!==id)await alterar(d=>{d.ultimaArea=id;});
  }
  function guardarCard(id) {
    return alterar(d => {
      if (porId.has(id) && !d.revisoes[id]) d.revisoes[id] = { nivel: 0, quando: Date.now() };
    });
  }
  window.addEventListener('storage', e => {
    if (e.key === chave || e.key === null) {
      ler();
      window.dispatchEvent(new Event('estudos-atualizados'));
    }
  });
  async function apagar(){
    const remover=()=>{(typeof contas==='undefined'?localStorage:contas.armazenamento).removeItem(chave);dados=novo();mensagem='';};
    if(navigator.locks)await navigator.locks.request(chave,remover);else remover();
  }
  return { assuntosConcluidos, semana, concluirEscalas, destinos, favoritos, salvarDestino, lembrarArea, porId, materias, uid, alterar, apagar, respostas, lista, iniciar, responder, avancar, revisar, guardarCard,
    get dados() { return dados; }, get mensagem() { return mensagem; } };
})();
