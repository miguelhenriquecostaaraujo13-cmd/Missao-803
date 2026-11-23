'use strict';

const tutorNeo = (() => {
  const comuns = new Set(['para','como','qual','quais','porque','sobre','uma','que','dos','das','com','por','uma','explique','quero','saber','ajuda','entender']);
  const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function termos(texto) {
    return [...new Set(normalizar(texto).split(/[^a-z0-9]+/).filter(t => t.length >= 2 && !comuns.has(t)))];
  }
  const indice = questoes.map(q => ({
    q, assunto: new Set(termos(q.assunto)),
    pergunta: new Set(termos(q.pergunta)),
    explicacao: new Set(termos(q.explicacao))
  }));
  function procurar(busca, materia) {
    const palavras = termos(busca);
    if (!palavras.length) return [];
    return indice.filter(i => i.q.materia === materia).map(i => {
      let peso = 0;
      for (const termo of palavras) {
        if (i.assunto.has(termo)) peso += 6;
        if (i.pergunta.has(termo)) peso += 3;
        if (i.explicacao.has(termo)) peso++;
      }
      return { q:i.q, peso };
    }).filter(r => r.peso > 0).sort((a,b) => b.peso - a.peso).slice(0,3).map(r => r.q);
  }
  async function perguntarIA(pergunta,materia){
    if(!contas.usuario||!contas.cliente)throw new Error('Entre na sua conta para usar o Neo IA. A busca local funciona como visitante.');
    if(!pergunta||pergunta.length<4)throw new Error('Escreva uma pergunta um pouco mais detalhada.');
    const {data,error}=await contas.cliente.functions.invoke('neo-ia-gratis',{body:{pergunta,materia}});
    if(error){
      let aviso='O Neo IA generativo não está disponível. Use a busca local de explicações.';
      try{const detalhe=await error.context?.json();if(detalhe?.erro)aviso=detalhe.erro;}catch{}
      throw new Error(aviso);
    }
    if(!data||typeof data.resposta!=='string')throw new Error('O Neo IA não conseguiu responder. Tente outra pergunta.');
    return data.resposta.slice(0,3000);
  }
  let fala;
  function parar() {
    if (fala) window.speechSynthesis?.cancel();
    fala = null;
  }
  function voz() {
    const uri = visitante.perfil?.voz;
    return uri && window.speechSynthesis?.getVoices().find(v => v.localService && v.voiceURI === uri);
  }
  function ouvir(texto, erro) {
    parar();
    const selecionada = voz();
    if (!selecionada || !window.SpeechSynthesisUtterance) { erro(); return; }
    const atual = new SpeechSynthesisUtterance(texto);
    atual.voice=selecionada;
    atual.lang=selecionada.lang;
    fala=atual;
    atual.onend=()=>{ if (fala===atual) fala=null; };
    atual.onerror=()=>{ if (fala===atual) { fala=null; erro(); } };
    try { window.speechSynthesis.speak(atual); } catch { fala=null; erro(); }
  }
  window.addEventListener('pagehide',parar);
  return { procurar, voz, ouvir, parar, perguntarIA };
})();
