'use strict';

// O armazenamento decide quando um marco foi atingido. Esta camada só apresenta o resultado.
const celebracoes = (() => {
  const mensagens = {
    tres: 'Três respostas certas em sequência!',
    cinco: 'Cinco acertos seguidos! O Neo comemora com você.',
    materia: 'Você concluiu todos os assuntos da trilha desta matéria!',
    trilha: 'Trilha do assunto concluída pela primeira vez!',
    meta: 'Você alcançou sua meta da semana!',
    simulado: 'Objetivo do simulado alcançado!',
    revisao: 'Conquista desbloqueada: primeira revisão lembrada!'
  };
  const cores = ['#A78BFA', '#81B7FF', '#6EDAC4', '#F2C777', '#F08EA0'];
  const aviso = document.createElement('div');
  aviso.className = 'marco-estudo';
  aviso.setAttribute('role','status');
  document.body.append(aviso);
  const reduzir = matchMedia('(prefers-reduced-motion: reduce)');
  let camada, relogio;
  function limparParticulas() {
    camada?.remove();
    camada = null;
  }
  reduzir.addEventListener('change', limparParticulas);
  function posicionar() {
    if (!aviso.textContent) return;
    const destino = document.querySelector('.pergunta .explicacao') || document.querySelector('.conteudo .cab, .aula-aurora .practice') || document.body;
    if (aviso.parentElement !== destino) destino.append(aviso);
  }
  function mostrar(marcos) {
    const textos = (marcos || []).map(m => mensagens[m]).filter(Boolean);
    if (!textos.length) return;
    clearTimeout(relogio);
    limparParticulas();
    aviso.textContent = textos.join(' ');
    aviso.dataset.marco = marcos[0];
    posicionar();
    relogio = setTimeout(() => { aviso.textContent = ''; }, 5200);
    if (identidadeAurora.reduzir() || estudos.dados.aparencia?.festa === false
        || typeof Element.prototype.animate !== 'function') return;
    camada = document.createElement('div');
    camada.className = 'confete-estudo';
    camada.setAttribute('aria-hidden','true');
    document.body.append(camada);
    const alvo = camada;
    const quantidade = marcos.includes('cinco') || marcos.includes('trilha') ? 32 : 20;
    const animacoes = [];
    for (let i = 0; i < quantidade; i++) {
      const papel = document.createElement('i');
      papel.style.background = cores[i % cores.length];
      alvo.append(papel);
      const x = (Math.random() - .5) * Math.min(innerWidth * .94, 660);
      const altura = 60 + Math.random() * 105;
      const giro = Math.round((Math.random() - .5) * 610);
      const quadros = Array.from({length: 13}, (_, j) => {
        const t = j / 12;
        const y = -4 * altura * t * (1-t) + 110 * t * t;
        return {transform: 'translate('+ x*t +'px,'+ y +'px) rotate('+ giro*t +'deg)', opacity: Math.min(1,(1-t)*5)};
      });
      animacoes.push(papel.animate(quadros,{duration:930+Math.random()*470,fill:'forwards'}).finished);
    }
    Promise.allSettled(animacoes).then(() => alvo.remove());
  }
  return { mostrar, posicionar, limparParticulas };
})();
