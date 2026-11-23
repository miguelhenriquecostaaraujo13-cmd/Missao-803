'use strict';
/* Neo Aurora Premium — complementos seguros.
   A transicao entre ferramentas e o replay no scroll sao gerenciados por movimentoNeo.
   Evita animar a pagina inteira ao escolher turma, materia ou alternativa. */
(() => {
  const iniciar=()=>{
    const principal=document.getElementById('principal');
    if(!principal || !('MutationObserver' in window))return;
    const vistos=new WeakSet();
    let pendente=false;
    const reduzido=()=>document.body.classList.contains('quieto')||
      matchMedia('(prefers-reduced-motion: reduce)').matches||
      (typeof identidadeAurora!=='undefined'&&identidadeAurora.reduzir());
    const estudo=()=>document.body.classList.contains('espaco-estudo')&&
      !document.body.classList.contains('quadro-aberto')&&
      principal.classList.contains('conteudo');

    function contador(numero){
      if(vistos.has(numero))return;
      vistos.add(numero);
      const texto=numero.textContent.trim();
      if(!/^\d{1,5}$/.test(texto)||reduzido())return;
      const total=Number(texto);
      if(total<1)return;
      const inicio=performance.now();
      function desenhar(agora){
        if(!numero.isConnected||reduzido()){numero.textContent=texto;return;}
        const fracao=Math.min(1,(agora-inicio)/760);
        numero.textContent=String(Math.round(total*(1-Math.pow(1-fracao,3))));
        if(fracao<1)requestAnimationFrame(desenhar);
        else numero.textContent=texto;
      }
      requestAnimationFrame(desenhar);
    }

    function sugestoesTutor(){
      const form=principal.querySelector('#form-neo');
      if(!form || principal.querySelector('.neo-prompts'))return;
      const campo=form.querySelector('#consulta');
      if(!campo)return;
      const area=document.createElement('div');
      area.className='neo-prompts';
      area.setAttribute('aria-label','Sugestões de perguntas ao Neo');
      const titulo=document.createElement('p');
      titulo.textContent='Não sabe por onde começar?';
      const botoes=document.createElement('div');
      for(const pergunta of ['Explique potenciação com um exemplo','Como estudar para uma prova?','O que são frações equivalentes?']){
        const botao=document.createElement('button');
        botao.type='button';botao.textContent=pergunta;
        botao.addEventListener('click',()=>{
          campo.value=pergunta;
          campo.dispatchEvent(new Event('input',{bubbles:true}));
          campo.focus({preventScroll:true});
        });
        botoes.appendChild(botao);
      }
      area.append(titulo,botoes);
      form.before(area);
    }

    function montagemTrilha(){
      const trilha=principal.querySelector('.trilha-gerada');
      if(!trilha||trilha.querySelector('.neo-montagem'))return;
      const etapas=trilha.querySelector('.etapas-personais');
      if(!etapas)return;
      const painel=document.createElement('div');
      painel.className='neo-montagem';
      painel.setAttribute('aria-label','Trilha criada e disponível para estudo');
      const legenda=document.createElement('p');
      legenda.textContent='Seu percurso foi criado. Veja como ele se conecta.';
      const passos=document.createElement('ol');
      for(const nome of ['Preparar','Traçar caminho','Montar etapas','Conectar','Pronto!']){
        const item=document.createElement('li');item.textContent=nome;passos.appendChild(item);
      }
      painel.append(legenda,passos);
      etapas.before(painel);
    }


    /* Não remontar todas as ferramentas ao clicar em uma preferência:
       preserva foco, rolagem e animações de transição somente para mudança de rota. */
    principal.addEventListener('click',(evento)=>{
      const botao=evento.target.closest?.('.wizard button[data-campo][data-valor]');
      if(!botao || !principal.contains(botao) || typeof visitante==='undefined' || !visitante.editando)return;
      evento.stopImmediatePropagation();
      evento.preventDefault();
      const campo=botao.dataset.campo;
      const valor=botao.dataset.valor;
      const antes=botao.getAttribute('aria-pressed')==='true';
      visitante.mudar(campo,valor);
      const opcoes=principal.querySelectorAll('.wizard button[data-campo="'+CSS.escape(campo)+'"]');
      if(campo==='turma'||campo==='formato'){
        opcoes.forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.valor===valor)));
      }else{
        botao.setAttribute('aria-pressed',String(!antes));
      }
      const avancar=principal.querySelector('.wizard [data-acao="avancar"]');
      if(campo==='turma' && avancar)avancar.disabled=false;
      botao.focus({preventScroll:true});
    },true);

    function ajudarAcesso(){
      const formulario=principal.querySelector('#form-conta');
      if(!formulario || principal.querySelector('.neo-ajuda-acesso'))return;
      const aviso=document.createElement('p');
      aviso.className='neo-ajuda-acesso';
      aviso.setAttribute('role','note');
      const google=typeof contas!=='undefined'&&contas.provedores?.google===true;
      aviso.textContent=google
        ? 'Você também pode usar o Google. Para entrar com e-mail, use a senha da sua conta já confirmada.'
        : 'Entrar com Gmail não é o mesmo que entrar com Google: use seu endereço Gmail e a senha cadastrada. O botão Google só aparece quando essa opção está habilitada no servidor. Se o e-mail de confirmação não chegar, verifique spam e evite solicitar vários links seguidos.';
      formulario.insertAdjacentElement('afterend',aviso);
    }

    function atualizar(){
      ajudarAcesso();
      if(!estudo())return;
      sugestoesTutor();
      montagemTrilha();
      // Somente indicadores numéricos, sem animar a tela ao clicar em opções.
      if(!reduzido())principal.querySelectorAll('.metricas > div > b').forEach(contador);
    }
    function agendar(){
      if(pendente)return;
      pendente=true;
      requestAnimationFrame(()=>{pendente=false;atualizar();});
    }
    new MutationObserver(agendar).observe(principal,{childList:true});
    window.addEventListener('hashchange',agendar);
    window.addEventListener('preferencia-movimento',agendar);
    agendar();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});
  else iniciar();
})();
