'use strict';
// Configuração pública do Missão 803; nunca incluir chaves secretas ou service_role.
const configuracao = Object.freeze({ url: 'https://mbltrucgwqozrujxifcx.supabase.co', chavePublica: 'sb_publishable_kLsE6obFofxRlM6R5ozVrA_TtGowU32' });
const contas = (() => {
  const sdk=new URL('vendor/supabase.js',document.currentScript.src).href;
  const paginaInicial=new URL('../index.html',document.currentScript.src);
  let cliente, usuario, preferencias, provedores = {}, cadastro = false, recuperando = false, administrador = false;
  let recado = 'Entre com sua conta ou continue como visitante.';
  let armazenamentoPersistente=localStorage;
  try {
    const teste='missao803.teste.armazenamento';
    localStorage.setItem(teste,'1');localStorage.removeItem(teste);
  }catch{armazenamentoPersistente=sessionStorage;}
  const guardar=(chave,valor)=>{try{armazenamentoPersistente.setItem(chave,valor);return true;}catch{return false;}};
  const chave=nome=>usuario?nome+'.conta.'+usuario:nome;
  function migrarSessaoAntiga(storageKey){
    if(armazenamentoPersistente!==localStorage)return;
    try {
      // A versão anterior guardava a sessão na aba. Preservá-la ao atualizar o site.
      for(let i=0;i<sessionStorage.length;i++){
        const chave=sessionStorage.key(i);
        if(chave!==(storageKey) && !chave?.startsWith(storageKey+'-'))continue;
        if(localStorage.getItem(chave)===null){
          const valor=sessionStorage.getItem(chave);
          if(valor)localStorage.setItem(chave,valor);
        }
      }
    }catch{}
  }
  function migrarDadosAntigos(){
    if(!usuario||armazenamentoPersistente!==localStorage)return;
    const suffix='.conta.'+usuario,base='missao803.estudos.v1'+suffix;
    try{
      const antigo=sessionStorage.getItem(base);
      const atual=localStorage.getItem(base);
      const tempoAntigo=Number(sessionStorage.getItem(base+'.modificado'))||0;
      const tempoAtual=Number(localStorage.getItem(base+'.modificado'))||0;
      if(antigo&&(!atual||tempoAntigo>tempoAtual)){
        localStorage.setItem(base,antigo);
        // Alteração não confirmada pela nuvem deve voltar à fila.
        localStorage.setItem(base+'.modificado',String(tempoAntigo||Date.now()));
        localStorage.setItem(base+'.pendente','1');
      }
      const nomeTrilhas='missao803.trilhas.pessoais.v1'+suffix;
      const antigas=JSON.parse(sessionStorage.getItem(nomeTrilhas)||'[]');
      const salvas=JSON.parse(localStorage.getItem(nomeTrilhas)||'[]');
      if(Array.isArray(antigas)&&Array.isArray(salvas)&&antigas.length){
        const unidas=new Map(salvas.filter(t=>t&&typeof t.id==='string').map(t=>[t.id,t]));
        for(const t of antigas){
          if(!t||typeof t.id!=='string')continue;
          if(!unidas.has(t.id)||(Number(t.atualizado)||0)>(Number(unidas.get(t.id).atualizado)||0))unidas.set(t.id,t);
        }
        localStorage.setItem(nomeTrilhas,JSON.stringify([...unidas.values()].slice(0,100)));
      }
      const preferencias='missao803.previa.visitante.v1'+suffix;
      if(!localStorage.getItem(preferencias)){
        const antigoPerfil=sessionStorage.getItem(preferencias);
        if(antigoPerfil)localStorage.setItem(preferencias,antigoPerfil);
      }
    }catch{}
  }
  const callback = tipo => {
    const url = new URL(paginaInicial);
    url.searchParams.set('acesso', tipo);
    return url.href;
  };
  function carregar(src) {
    return new Promise((resolve,reject) => {
      const script = document.createElement('script');
      script.src=src; script.onload=resolve; script.onerror=reject; document.head.append(script);
    });
  }
  function mensagem(erro) {
    const codigo=erro?.code;
    if(codigo==='invalid_credentials')return 'Confira seu e-mail e sua senha.';
    if(codigo==='email_not_confirmed')return 'Confirme o endereço pelo link enviado ao seu e-mail.';
    if(codigo==='weak_password')return 'Escolha uma senha mais forte e tente outra vez.';
    if(erro?.status===429)return 'Houve muitas tentativas. Aguarde alguns minutos.';
    if(erro?.message?.startsWith('Seu progresso ainda não foi sincronizado.'))return erro.message;
    return 'A solicitação não foi concluída. Verifique a conexão e tente novamente.';
  }
  async function preparar(){
    if(!configuracao.url||!configuracao.chavePublica||location.protocol==='file:')return;
    try {
      const url=new URL(configuracao.url);
      if(!(url.protocol==='https:'&&/^[a-z0-9]+\.supabase\.co$/.test(url.hostname)) && !(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname)))throw Error();
      if(!configuracao.chavePublica.startsWith('sb_publishable_'))throw Error();
      let config={external:{email:true},disable_signup:false},configConfiavel=false;
      try{
        const settings=await fetch(url.origin+'/auth/v1/settings',{headers:{apikey:configuracao.chavePublica},cache:'no-store',signal:AbortSignal.timeout(6500)});
        if(settings.ok){config=await settings.json();configConfiavel=true;}
      }catch{}
      await carregar(sdk);
      const chaveSessao='missao803.auth.'+url.host;
      migrarSessaoAntiga(chaveSessao);
      cliente=window.supabase.createClient(url.origin,configuracao.chavePublica,{
        auth:{flowType:'pkce',detectSessionInUrl:false,storage:armazenamentoPersistente,
          storageKey:chaveSessao,persistSession:true,autoRefreshToken:true}
      });
      if(!configConfiavel)recado='O servidor de acesso demorou a responder. Você ainda pode tentar entrar na sua conta.';
      const retorno=new URL(location.href);
      let retornoInvalido=false;
      if(retorno.searchParams.has('acesso')){
        const tipo=retorno.searchParams.get('acesso'), code=retorno.searchParams.get('code');
        history.replaceState(null,'',location.pathname+'#conta/entrar');
        if(!code || retorno.searchParams.has('error'))retornoInvalido=true;
        else {
          const resposta=await cliente.auth.exchangeCodeForSession(code);
          retornoInvalido=Boolean(resposta.error);
          recuperando=!retornoInvalido&&tipo==='recuperar';
        }
      }
      const {data,error}=await cliente.auth.getSession();
      if(error)recado='Não foi possível restaurar sua sessão. Você pode tentar entrar novamente.';
      if(data?.session){
        let pessoa=null;
        try{
          const validacao=await cliente.auth.getUser();
          if(!validacao.error)pessoa=validacao.data?.user;
        }catch{}
        if(pessoa){
          usuario=pessoa.id;
          preferencias=pessoa.user_metadata?.missao_preferencias;
          migrarDadosAntigos();
          try {
            if(recuperando)sessionStorage.setItem('missao803.redefinir',usuario);
            else recuperando=location.hash==='#conta/nova-senha'&&sessionStorage.getItem('missao803.redefinir')===usuario;
          } catch {}
        }else recado='Não foi possível validar a sessão agora. Confira a conexão e atualize a página.';
      }
      if(usuario){
        try{
          const {data:permissao,error:erroPermissao}=await cliente.from('portal803_admins')
            .select('user_id').eq('user_id',usuario).maybeSingle();
          administrador=Boolean(permissao)&&!erroPermissao;
        }catch{administrador=false;}
      }
      provedores=config.external||{};cadastro=!config.disable_signup;
      recado=retornoInvalido?'Este link não é mais válido. Solicite outro neste navegador.':
        usuario?(armazenamentoPersistente===localStorage?
        'Sua sessão permanece conectada e seu progresso é sincronizado com sua conta.':
        'Seu navegador bloqueou o armazenamento permanente. Confira suas configurações.'):
        'Entre com sua conta para sincronizar seu progresso entre dispositivos.';
      if(usuario && !location.pathname.endsWith('QUADRO-NEO-AURORA.html') && (recuperando||!location.hash||location.hash.startsWith('#conta')))history.replaceState(null,'',location.pathname+(recuperando?'#conta/nova-senha':'#painel'));
      cliente.auth.onAuthStateChange((evento,sessao)=>{
        if(evento==='SIGNED_OUT'&&usuario){
          limparDadosDaAba();
          history.replaceState(null,'',paginaInicial.pathname+'#conta/entrar');location.reload();
        }
        if(evento==='SIGNED_IN'&&sessao?.user.id!==usuario){limparDadosDaAba();location.reload();}
      });
    } catch {
      recado='Não foi possível validar o acesso. Se abriu um link de e-mail, solicite um novo neste mesmo navegador.';
      provedores={};cadastro=false;
    }
  }
  async function enviar(modo,form){
    const email=form.elements.email?.value.trim(),password=form.elements.senha?.value;
    if(!cliente)throw Error();
    let resultado;
    if(modo==='nova-senha'&&usuario&&recuperando)resultado=await cliente.auth.updateUser({password});
    else if(modo==='criar'&&cadastro&&provedores.email)resultado=await cliente.auth.signUp({email,password,options:{emailRedirectTo:callback('confirmar')}});
    else if(modo==='entrar'&&provedores.email)resultado=await cliente.auth.signInWithPassword({email,password});
    else if(modo==='recuperar'&&provedores.email)resultado=await cliente.auth.resetPasswordForEmail(email,{redirectTo:callback('recuperar')});
    else throw Error();
    if(resultado.error)throw resultado.error;
    if(modo==='nova-senha'){
      recuperando=false;try{sessionStorage.removeItem('missao803.redefinir');}catch{}
      location.hash='painel';
    }
    return modo==='recuperar'?'Se houver uma conta para este e-mail, você receberá as instruções.':modo==='criar'?'Confira seu e-mail para confirmar o cadastro.':'Acesso confirmado.';
  }
  async function social(provider){
    if(!['google','apple'].includes(provider)||!provedores[provider])throw Error();
    const {error}=await cliente.auth.signInWithOAuth({provider,options:{redirectTo:callback('entrar')}});
    if(error)throw error;
  }
  function limparDadosDaAba(){
    // Não excluir progresso ao sair. O cache local é separado por UUID da conta.
    // O Supabase mantém as regras de segurança para os dados do servidor.
    try{
      if(usuario)sessionStorage.removeItem('missao803.rascunhos.conta.'+usuario);
      sessionStorage.removeItem('missao803.redefinir');
    }catch{}
  }

  // Conta apenas um navegador por dia; sem IP, localização ou identidade do visitante.
  async function registrarVisita(){
    if(!cliente || !globalThis.crypto?.randomUUID)return;
    const dia=new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    let anterior;
    try{anterior=JSON.parse(localStorage.getItem('missao803.contagem.dia')||'null');}catch{}
    let token=anterior?.dia===dia && /^[a-f0-9-]{36}$/i.test(anterior?.token||'') ? anterior.token : crypto.randomUUID();
    try{localStorage.setItem('missao803.contagem.dia',JSON.stringify({dia,token}));}catch{}
    const {error}=await cliente.rpc('neo_aurora_registrar_visita',{p_token:token});
    if(error)throw error;
  }
  async function relatorioAcessos(){
    if(!cliente||!usuario||!administrador)throw new Error('Apenas o administrador pode acessar os dados.');
    const {data,error}=await cliente.rpc('neo_aurora_relatorio_admin');
    if(error)throw error;
    return data;
  }

  // Progresso local persistente e sincronização autenticada com fila recuperável.
  let envioEstado=null, gravandoEstado=false,temporizadorEstado=null, gravacaoEmCurso=null, statusEstado='';
  const chaveEstudos=()=>chave('missao803.estudos.v1');
  const chaveData=()=>chaveEstudos()+'.modificado';
  const chavePendente=()=>chaveEstudos()+'.pendente';
  const lerLocal=(key)=>{try{return armazenamentoPersistente.getItem(key);}catch{return null;}};
  const armazenarLocal=(key,value)=>guardar(key,value);
  async function carregarEstudos(){
    if(!cliente||!usuario)return;
    const local=lerLocal(chaveEstudos());
    const momento=Number(lerLocal(chaveData()))||0;
    const pendente=lerLocal(chavePendente())==='1';
    try{
      const requisicao=cliente.from('neo_aurora_estado_estudos').select('conteudo,atualizado_em').eq('usuario_id',usuario).maybeSingle();
      const resultado=await Promise.race([requisicao,new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),6500))]);
      if(resultado.error)throw resultado.error;
      const remoto=resultado.data;
      const tempoRemoto=remoto?new Date(remoto.atualizado_em).getTime():0;
      // Uma alteração pendente nunca deve ser substituída por uma cópia antiga do servidor.
      if(local&&(pendente||!remoto||momento>tempoRemoto)){
        envioEstado=local;agendarEstudos(100);
        statusEstado='Recuperando alterações que ainda não foram sincronizadas…';
      }else if(remoto?.conteudo){
        armazenarLocal(chaveEstudos(),JSON.stringify(remoto.conteudo));
        armazenarLocal(chaveData(),String(tempoRemoto));
        try{armazenamentoPersistente.removeItem(chavePendente());}catch{}
        statusEstado='Seu progresso está sincronizado com a sua conta.';
      }else statusEstado='Seu progresso está pronto para ser salvo na conta.';
    }catch{
      if(local&&pendente)envioEstado=local;
      statusEstado='Sem conexão com a nuvem. Seu progresso continua salvo neste navegador.';
    }
  }
  function agendarEstudos(atraso=650){
    clearTimeout(temporizadorEstado);
    temporizadorEstado=setTimeout(()=>{void gravarEstudos();},atraso);
  }
  function sincronizarEstudos(conteudo){
    if(!usuario)return;
    envioEstado=conteudo;
    const salvo=armazenarLocal(chaveEstudos(),conteudo);
    const marcado=armazenarLocal(chaveData(),String(Date.now()));
    const pendente=armazenarLocal(chavePendente(),'1');
    statusEstado=salvo&&marcado&&pendente?'Progresso salvo neste navegador; sincronizando…':
      'O navegador não confirmou a cópia local. Mantenha o site aberto até a sincronização.';
    if(cliente)agendarEstudos();
  }
  async function gravarEstudos(){
    if(!cliente||!usuario)return false;
    if(gravacaoEmCurso)return gravacaoEmCurso;
    const atual=envioEstado||((lerLocal(chavePendente())==='1')?lerLocal(chaveEstudos()):null);
    if(!atual)return true;
    gravandoEstado=true;
    const versao=lerLocal(chaveData());
    const operacao=(async()=>{
      try{
        const {error}=await cliente.from('neo_aurora_estado_estudos').upsert({
          usuario_id:usuario,conteudo:JSON.parse(atual),atualizado_em:new Date().toISOString()
        },{onConflict:'usuario_id'});
        if(error)throw error;
        if(envioEstado===atual||!envioEstado)envioEstado=null;
        // Uma nova alteração durante o envio continua pendente.
        if(lerLocal(chaveData())===versao&&lerLocal(chaveEstudos())===atual){
          try{armazenamentoPersistente.removeItem(chavePendente());}catch{}
        }
        statusEstado='Progresso sincronizado com o Supabase.';
        return true;
      }catch{
        statusEstado='A nuvem não confirmou o salvamento. Suas alterações continuam neste navegador.';
        return false;
      }
    })();
    gravacaoEmCurso=operacao;
    try{return await operacao;}
    finally{
      gravandoEstado=false;gravacaoEmCurso=null;
      if(envioEstado&&envioEstado!==atual)agendarEstudos(250);
    }
  }
  async function finalizarEstudos(){
    clearTimeout(temporizadorEstado);
    if(!usuario||(!envioEstado&&lerLocal(chavePendente())!=='1'))return true;
    if(gravacaoEmCurso)await gravacaoEmCurso;
    if(!envioEstado&&lerLocal(chavePendente())!=='1')return true;
    const salvo=await gravarEstudos();
    return Boolean(salvo)&&lerLocal(chavePendente())!=='1';
  }
  async function removerEstudos(){
    envioEstado=null;clearTimeout(temporizadorEstado);
    if(!cliente||!usuario)return;
    const {error}=await cliente.from('neo_aurora_estado_estudos').delete().eq('usuario_id',usuario);
    if(error)throw error;
    for(const chaveRemover of [chaveData(),chavePendente()])try{armazenamentoPersistente.removeItem(chaveRemover);}catch{}
  }
  window.addEventListener('online',()=>{
    if(!usuario)return;
    if(envioEstado||lerLocal(chavePendente())==='1')void gravarEstudos();
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden&&(envioEstado||lerLocal(chavePendente())==='1'))void gravarEstudos();
  });
  async function salvarPreferencias(perfil){
    if(!usuario)return;
    const {error}=await cliente.auth.updateUser({data:{missao_preferencias:perfil}});
    if(error)throw error;
  }
  async function sair(){
    const seguro=await finalizarEstudos();
    if(!seguro)throw new Error('Seu progresso ainda não foi sincronizado. Reconecte-se à internet antes de sair para não perder alterações recentes.');
    const {error}=await cliente.auth.signOut({scope:'local'});
    if(error)throw error;
  }
  return {preparar,enviar,social,sair,salvarPreferencias,registrarVisita,relatorioAcessos,carregarEstudos,sincronizarEstudos,finalizarEstudos,removerEstudos,mensagem,carregar,get cliente(){return cliente;},get estadoSincronizacao(){return statusEstado;},get administrador(){return administrador;},get preferencias(){return preferencias;},get armazenamento(){return armazenamentoPersistente;},get usuario(){return usuario;},get recado(){return recado;},get provedores(){return provedores;},get cadastro(){return cadastro;},get recuperando(){return recuperando;},chave};
})();
