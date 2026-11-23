'use strict';

// Apenas preferências voluntárias do visitante da prévia, sem identificador de conta.
const visitante = (() => {
  const chave = typeof contas === 'undefined' ? 'missao803.previa.visitante.v1' : contas.chave('missao803.previa.visitante.v1');
  const turmas = ['801', '802', '803', '804', '806', '807'];
  const objetivos = ['Preparar uma prova', 'Criar uma rotina', 'Tirar dúvidas', 'Explorar uma matéria'];
  const materias = ['Matemática', 'Língua Portuguesa', 'História', 'Geografia', 'Ciências', 'Inglês', 'Arte', 'Educação Física'];
  const formatos = ['Trilha visual', 'Questões', 'Resumos', 'Mapas mentais'];
  const ultima = 5;
  let perfil = null;
  let rascunho = null;
  let etapa = 0;
  let aviso = '';
  let fala;
  const sintese = window.speechSynthesis;
  const limitarLista = (valores, permitidos) => Array.isArray(valores)
    ? [...new Set(valores.filter(valor => permitidos.includes(valor)))] : [];

  function preferencias(dados = {}) {
    return {
      turma: turmas.includes(dados.turma) ? dados.turma : '',
      objetivos: limitarLista(dados.objetivos, objetivos),
      materias: limitarLista(dados.materias, materias),
      formato: formatos.includes(dados.formato) ? dados.formato : '',
      voz: typeof dados.voz === 'string' ? dados.voz.slice(0, 500) : ''
    };
  }

  try {
    const salvo = JSON.parse((typeof contas==='undefined'?localStorage:contas.armazenamento).getItem(chave));
    if (salvo?.perfil && turmas.includes(salvo.perfil.turma)) perfil = preferencias(salvo.perfil);
    if(!perfil && typeof contas!=='undefined' && turmas.includes(contas.preferencias?.turma))perfil=preferencias(contas.preferencias);
    if (salvo?.rascunho) {
      rascunho = preferencias(salvo.rascunho);
      etapa = Number.isInteger(salvo.etapa) && rascunho.turma
        ? Math.max(1, Math.min(salvo.etapa, ultima)) : 1;
    }
  } catch {
    // Dados inválidos ou armazenamento indisponível permitem uma nova sessão em memória.
  }
  function salvar() {
    try {
      (typeof contas==='undefined'?localStorage:contas.armazenamento).setItem(chave, JSON.stringify({ perfil, rascunho, etapa }));
      aviso = '';
    } catch {
      aviso = 'O navegador não conseguiu salvar. Suas escolhas valem enquanto esta página estiver aberta.';
    }
  }
  function comecar() {
    if (rascunho) return;
    rascunho = preferencias(perfil || {});
    etapa = 1;
    salvar();
  }
  function mudar(campo, valor) {
    if (!rascunho) return;
    const lista = rascunho[campo];
    if (Array.isArray(lista)) {
      rascunho[campo] = lista.includes(valor) ? lista.filter(v => v !== valor) : [...lista, valor];
    } else {
      rascunho[campo] = valor;
    }
    rascunho = preferencias(rascunho);
    salvar();
  }
  function cancelarFala() {
    if (fala) sintese?.cancel();
    fala = null;
  }
  function sair() {
    cancelarFala();
    rascunho = null;
    etapa = 0;
    salvar();
  }
  function avancar() {
    if (!rascunho?.turma) return false;
    cancelarFala();
    if (etapa === ultima) {
      perfil = preferencias(rascunho);
      sair();
      return true;
    }
    etapa++;
    salvar();
    return false;
  }
  function voltar() {
    cancelarFala();
    if (etapa <= 1) sair();
    else {
      etapa--;
      salvar();
    }
  }
  function opcoes(campo, lista, selecionado) {
    return '<div class="choices" role="group" aria-labelledby="pergunta">' + lista.map(valor =>
      '<button type="button" data-campo="' + campo + '" data-valor="' + valor +
      '" aria-pressed="' + selecionado.includes(valor) + '">' + valor + '</button>'
    ).join('') + '</div>';
  }
  function resumo(p) {
    return '<dl class="resumo">' + [
      ['Turma', p.turma], ['Objetivos', p.objetivos.join(' · ') || 'A definir'],
      ['Matérias', p.materias.join(' · ') || 'Explorar todas'], ['Formato', p.formato || 'Explorar os formatos']
    ].map(([rotulo, valor]) => '<div><dt>' + rotulo + '</dt><dd>' + valor + '</dd></div>').join('') +
      '<div><dt>Narração</dt><dd id="voz-resumo"></dd></div></dl>';
  }
  function conteudo(pergunta) {
    if (!rascunho) {
      return '<h2 id="pergunta">Oi, eu sou o Neo.</h2><p>Vamos escolher por onde começar? Seu plano de visitante fica neste navegador.</p>' +
        '<button class="primary" data-acao="comecar">Continuar como visitante →</button>';
    }
    const dados = rascunho;
    const titulos = ['', 'Qual é a sua turma?', 'O que você quer alcançar?', pergunta, 'Como prefere estudar?', 'Seu plano ficou assim'];
    let elemento;
    if (etapa === 1) elemento = opcoes('turma', turmas, [dados.turma]);
    if (etapa === 2) elemento = '<p>Escolha quantos objetivos quiser.</p>' + opcoes('objetivos', objetivos, dados.objetivos);
    if (etapa === 3) elemento = '<p>Você pode explorar várias matérias.</p>' + opcoes('materias', materias, dados.materias);
    if (etapa === 4) elemento = opcoes('formato', formatos, [dados.formato]) +
      '<label class="voz-label" for="voz">Voz do Neo</label><div class="voz-opcoes"><select id="voz"></select>' +
      '<button type="button" class="secundario" id="ouvir">Ouvir exemplo</button></div><p role="status" id="voz-status"></p>';
    if (etapa === ultima) elemento = resumo(dados);
    return '<p class="etapa">Passo ' + etapa + ' de ' + ultima + '</p><h2 id="pergunta">' + titulos[etapa] + '</h2>' +
      elemento + '<div class="acoes"><button type="button" class="secundario" data-acao="voltar">Voltar</button>' +
      '<button class="primary" data-acao="avancar"' + (etapa === 1 && !dados.turma ? ' disabled' : '') + '>' +
      (etapa === ultima ? (perfil ? 'Salvar ajustes' : 'Abrir meu painel') : 'Continuar') + ' →</button></div>' +
      (perfil ? '<button class="texto" data-acao="cancelar">Cancelar edição</button>' : '');
  }
  const vozes = () => (sintese?.getVoices() || []).filter(voz => voz.localService)
    .sort((a, b) => Number(b.lang.startsWith('pt')) - Number(a.lang.startsWith('pt')));
  function atualizarVoz() {
    const seletor = document.querySelector('#voz');
    if (!seletor || !rascunho) return;
    const lista = vozes();
    seletor.replaceChildren(new Option('Sem narração', ''));
    lista.forEach(v => seletor.add(new Option(v.name + ' · ' + v.lang, v.voiceURI)));
    if (rascunho.voz && !lista.some(v => v.voiceURI === rascunho.voz)) {
      const ausente = new Option('Voz salva indisponível', rascunho.voz);
      ausente.disabled = true;
      seletor.add(ausente);
    }
    seletor.value = rascunho.voz;
    document.querySelector('#ouvir').disabled = !lista.some(v => v.voiceURI === seletor.value);
    document.querySelector('#voz-status').textContent = lista.length ? '' : 'Nenhuma voz local disponível. Você pode continuar com texto.';
  }
  sintese?.addEventListener('voiceschanged', atualizarVoz);
  function prepararVoz() {
    const sumario = document.querySelector('#voz-resumo');
    if (sumario && rascunho) sumario.textContent = rascunho.voz
      ? (vozes().find(v => v.voiceURI === rascunho.voz)?.name || 'Voz salva indisponível') : 'Sem narração';
    const seletor = document.querySelector('#voz');
    if (!seletor) return;
    atualizarVoz();
    seletor.onchange = () => {
      cancelarFala();
      mudar('voz', seletor.value);
      atualizarVoz();
    };
    document.querySelector('#ouvir').onclick = () => {
      const voz = vozes().find(v => v.voiceURI === seletor.value);
      if (!voz) return;
      cancelarFala();
      const mensagem = 'Vamos começar a sua próxima atividade.';
      const status = document.querySelector('#voz-status');
      status.textContent = mensagem;
      fala = new SpeechSynthesisUtterance(mensagem);
      fala.voice = voz;
      fala.lang = voz.lang;
      const atual = fala;
      fala.onerror = () => {
        if (fala === atual) status.textContent = 'A reprodução falhou. Você pode escolher outra voz ou continuar com texto.';
      };
      sintese.speak(fala);
    };
  }
  return {
    comecar, mudar, avancar, voltar, sair, conteudo, prepararVoz, informar(texto){aviso=texto;},
    get perfil() { return perfil; }, get editando() { return Boolean(rascunho); },
    get aviso() { return aviso; }, get etapa() { return etapa; }
  };
})();
