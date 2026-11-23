'use strict';
/* Neo Aurora Premium: animacoes progressivas sem dependencias externas.
   Extensao visual; nao modifica autenticacao, dados nem renderizacao de aulas. */
(() => {
  const iniciar = () => {
    const principal = document.getElementById('principal');
    if (!principal || !('MutationObserver' in window)) return;

    const reduzido = () => Boolean(
      document.body.classList.contains('quieto') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (typeof identidadeAurora !== 'undefined' && identidadeAurora.reduzir())
    );
    const pronto = () => !reduzido() && !document.hidden &&
      document.body.classList.contains('espaco-estudo') &&
      !document.body.classList.contains('quadro-aberto') &&
      principal.classList.contains('conteudo');

    const decorados = new WeakSet();
    const contadorIniciado = new WeakSet();
    let observerEntrada = null;
    let agendado = false;

    function contar(valor) {
      if (!pronto() || contadorIniciado.has(valor)) return;
      contadorIniciado.add(valor);
      const original = valor.textContent.trim();
      if (!/^\d{1,5}$/.test(original)) return;
      const total = Number(original);
      if (!Number.isFinite(total) || total <= 0) return;
      const inicio = performance.now();
      const duracao = 720;
      valor.textContent = '0';
      function quadro(agora) {
        if (!valor.isConnected || reduzido()) {
          valor.textContent = original;
          return;
        }
        const t = Math.min(1, (agora - inicio) / duracao);
        const suave = 1 - Math.pow(1-t, 3);
        valor.textContent = String(Math.floor(total * suave));
        if (t < 1) requestAnimationFrame(quadro);
        else valor.textContent = original;
      }
      requestAnimationFrame(quadro);
    }

    function revelar(elemento) {
      if (!pronto() || !elemento.isConnected) return;
      if (elemento.matches('.neo-revelado,.neo-aguardando')) return;
      if (typeof elemento.animate === 'function') {
        elemento.animate([
          {opacity:0.55,transform:'translate3d(0,16px,0)'},
          {opacity:1,transform:'translate3d(0,0,0)'}
        ], {duration:580,easing:'cubic-bezier(.16,1,.3,1)',fill:'none'});
      }
      if (elemento.matches('.metricas > div')) {
        const valor = elemento.querySelector('b');
        if (valor) contar(valor);
      }
    }

    if ('IntersectionObserver' in window) {
      observerEntrada = new IntersectionObserver((entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          observerEntrada.unobserve(entrada.target);
          revelar(entrada.target);
        }
      }, {threshold:0.09,rootMargin:'0px 0px -12px 0px'});
    }

    function sugestoesTutor() {
      const form = principal.querySelector('#form-neo');
      if (!form || principal.querySelector('.neo-prompts')) return;
      const campo = form.querySelector('#consulta');
      if (!campo) return;
      const area = document.createElement('div');
      area.className = 'neo-prompts';
      area.setAttribute('aria-label','Sugestões de perguntas ao Neo');
      const titulo = document.createElement('p');
      titulo.textContent = 'Não sabe por onde começar?';
      const botoes = document.createElement('div');
      const exemplos = [
        'Explique potenciação com um exemplo',
        'Como estudar para uma prova?',
        'O que são frações equivalentes?'
      ];
      for (const pergunta of exemplos) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = pergunta;
        b.addEventListener('click',() => {
          campo.value = pergunta;
          campo.dispatchEvent(new Event('input',{bubbles:true}));
          campo.focus({preventScroll:true});
        });
        botoes.appendChild(b);
      }
      area.append(titulo,botoes);
      form.before(area);
    }

    function atualizar() {
      if (!pronto()) return;
      sugestoesTutor();
      const alvos = principal.querySelectorAll([
        '.folha-estudo .metricas > div',
        '.folha-estudo .grade > .atalho',
        '.folha-estudo .trilha > li',
        '.folha-estudo .amostra',
        '.folha-estudo .linha',
        '.folha-estudo .resumo-trilha',
        '.folha-estudo .papel',
        '.folha-estudo .trilhas-pessoais-grade > .trilha-pessoal-card',
        '.folha-estudo .mesa-neo',
        '.folha-estudo .biblioteca > section'
      ].join(','));
      let analisados = 0;
      for (const el of alvos) {
        if (analisados++ >= 85) break;
        if (decorados.has(el)) continue;
        decorados.add(el);
        if (el.matches('.neo-revelado,.neo-aguardando')) continue;
        if (observerEntrada) observerEntrada.observe(el);
        else if (el.getBoundingClientRect().top < innerHeight) revelar(el);
      }
    }

    function agendar() {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        if (pronto()) atualizar();
        else observerEntrada?.disconnect();
      });
    }

    new MutationObserver(agendar).observe(principal, {childList:true});
    document.addEventListener('visibilitychange',() => {
      if (!document.hidden) agendar();
      else observerEntrada?.disconnect();
    });
    window.addEventListener('preferencia-movimento', agendar);
    agendar();
  };
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded',iniciar,{once:true});
  else iniciar();
})();
