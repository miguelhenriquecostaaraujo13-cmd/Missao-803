'use strict';

const ilustracoes = (() => {
  const catalogo = new Map([
    ["Matemática", {arquivo:'matematica', descricao:"Triângulo retângulo com catetos de três e quatro unidades e hipotenusa de cinco.", assuntos:["Geometria"]}],
    ["Ciências", {arquivo:'ciencias', descricao:"Modelo do sistema Terra–Lua, fora de escala.", assuntos:["Terra e Lua"]}],
    ["Geografia", {arquivo:'geografia', descricao:"Curvas de nível fechadas com cotas de 100, 200 e 300 metros.", assuntos:["Cartografia"]}],
    ["História", {arquivo:'historia', descricao:"Linha do tempo do Brasil: Independência em 1822, início da Regência em 1831 e início do Segundo Reinado em 1840.", assuntos:["Independência do Brasil","Primeiro Reinado","Período Regencial","Segundo Reinado"]}],
    ["Língua Portuguesa", {arquivo:'portugues', descricao:"O pronome ela retoma o nome Lia em duas frases.", assuntos:["Coesão textual"]}],
    ["Inglês", {arquivo:'ingles', descricao:"Since indica o início de um intervalo que chega ao presente.", assuntos:["Present perfect"]}],
    ["Arte", {arquivo:'arte', descricao:"Estudo de composição: círculo, triângulo e retângulo sobrepostos.", assuntos:["Elementos visuais"]}],
    ["Educação Física", {arquivo:'movimento', descricao:"Trajetória de uma bola em um arremesso até a cesta.", assuntos:["Esportes de invasão"]}]
  ]);
  function imagem(materia, decorativa = false) {
    const arte = catalogo.get(materia);
    if (!arte) return '';
    return '<img class="arte-materia" width="320" height="152" loading="lazy" decoding="async" src="estudo/ilustracoes/'+arte.arquivo+'.svg" alt="'+(decorativa?'':arte.descricao)+'">';
  }
  function exemplo(materia, assunto) {
    if (materia === 'Matemática' && assunto === 'Potenciação') {
      return '<figure class="exemplo-visual oficina-potencia"><figcaption>Experimente uma potência de base 2</figcaption><label>Expoente <select data-expoente>'+[1,2,3,4,5].map(n=>'<option '+(n===3?'selected':'')+'>'+n+'</option>').join('')+'</select></label><output aria-live="polite">2 × 2 × 2 = 8</output></figure>';
    }
    const arte = catalogo.get(materia);
    if (!arte?.assuntos.includes(assunto)) return '';
    return '<figure class="exemplo-visual">'+imagem(materia,true)+'<figcaption>'+arte.descricao+'</figcaption></figure>';
  }
  function galeria(materias) {
    return '<section class="materias-ilustradas"><h2>Explore por matéria</h2><div>'+materias.filter(m=>catalogo.has(m)).map(m=>'<button data-act="abrir-materia" data-value="'+m+'">'+imagem(m,true)+'<span>'+m+' <i aria-hidden="true">↗</i></span></button>').join('')+'</div></section>';
  }
  document.addEventListener('change', e => {
    if (!e.target.matches('[data-expoente]')) return;
    const n = Number(e.target.value);
    e.target.closest('figure').querySelector('output').textContent = Array(n).fill('2').join(' × ')+' = '+2**n;
  });
  document.addEventListener('error', e => {
    if (e.target instanceof HTMLImageElement && e.target.classList.contains('arte-materia')) e.target.hidden = true;
  }, true);
  return { imagem, exemplo, galeria };
})();
