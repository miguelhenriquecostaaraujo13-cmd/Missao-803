'use strict';
// Configuração pública do Missão 803; nunca incluir chaves secretas ou service_role.
const configuracao = Object.freeze({ url: 'https://mbltrucgwqozrujxifcx.supabase.co', chavePublica: 'sb_publishable_kLsE6obFofxRlM6R5ozVrA_TtGowU32' });
const contas = (() => {
  const sdk=new URL('vendor/supabase.js',document.currentScript.src).href;
  const paginaInicial=new URL('../index.html',document.currentScript.src);
  let cliente, usuario, preferencias, provedores = {}, cadastro = false, recuperando = false, administrador = false;
  let recado = 'Entre com sua conta ou continue como visitante.';
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
    return 'A solicitação não foi concluída. Verifique a conexão e tente novamente.';
  }
  async function preparar(){
    if(!configuracao.url||!configuracao.chavePublica||location.protocol==='file:')return;
    try {
      const url=new URL(configuracao.url);
      if(!(url.protocol==='https:'&&/^[a-z0-9]+\.supabase\.co$/.test(url.hostname)) && !(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname)))throw Error();
      if(!configuracao.chavePublica.startsWith('sb_publishable_'))throw Error();
      const settings=await fetch(url.origin+'/auth/v1/settings',{headers:{apikey:configuracao.chavePublica},cache:'no-store',signal:AbortSignal.timeout(6500)});
      if(!settings.ok)throw Error();
      const config=await settings.json();
      await carregar(sdk);
      cliente=window.supabase.createClient(url.origin,configuracao.chavePublica,{auth:{flowType:'pkce',detectSessionInUrl:false,storage:sessionStorage,storageKey:'missao803.auth.'+url.host}});
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
      if(error)throw error;
      if(data.session){
        const validacao=await cliente.auth.getUser();
        if(validacao.error||!validacao.data.user)throw Error();
        usuario=validacao.data.user.id;
        preferencias=validacao.data.user.user_metadata?.missao_preferencias;
        try {
          if(recuperando)sessionStorage.setItem('missao803.redefinir',usuario);
          else recuperando=location.hash==='#conta/nova-senha'&&sessionStorage.getItem('missao803.redefinir')===usuario;
        } catch {}
      }
      if(usuario){
        try{
          const {data:permissao,error:erroPermissao}=await cliente.from('portal803_admins')
            .select('user_id').eq('user_id',usuario).maybeSingle();
          administrador=Boolean(permissao)&&!erroPermissao;
        }catch{administrador=false;}
      }
      provedores=config.external||{};cadastro=!config.disable_signup;
      recado=retornoInvalido?'Este link não é mais válido. Solicite outro neste navegador.':'O progresso da conta fica nesta aba até você sair ou fechá-la.';
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
    if(!usuario)return;
    try {
      for(const base of ['missao803.estudos.v1','missao803.previa.visitante.v1','missao803.rascunhos'])sessionStorage.removeItem(base+'.conta.'+usuario);
      sessionStorage.removeItem('missao803.redefinir');
    } catch {}
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

  // Sincronização privada do progresso, com cópia local para uso offline.
  let envioEstado=null, gravandoEstado=false,temporizadorEstado=null, statusEstado='';
  const chaveEstudos=()=>chave('missao803.estudos.v1');
  const chaveData=()=>chaveEstudos()+'.modificado';
  async function carregarEstudos(){
    if(!cliente||!usuario)return;
    try {
      const requisicao=cliente.from('neo_aurora_estado_estudos').select('conteudo,atualizado_em').eq('usuario_id',usuario).maybeSingle();
      const resultado=await Promise.race([requisicao,new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),6500))]);
      if(resultado.error)throw resultado.error;
      const remoto=resultado.data;
      const local=sessionStorage.getItem(chaveEstudos());
      const momento=Number(sessionStorage.getItem(chaveData()))||0;
      const atualizado=remoto?new Date(remoto.atualizado_em).getTime():0;
      if(remoto?.conteudo && (!local || atualizado>=momento)){
        sessionStorage.setItem(chaveEstudos(),JSON.stringify(remoto.conteudo));
        sessionStorage.setItem(chaveData(),String(atualizado));
        statusEstado='Sincronizado com a sua conta.';
      }else if(local && (!remoto || momento>atualizado)){
        sincronizarEstudos(local);
      }else statusEstado='Seu progresso será sincronizado com a sua conta.';
    }catch{statusEstado='Sem sincronização no momento. O progresso continua nesta aba.';}
  }
  function sincronizarEstudos(conteudo){
    if(!cliente||!usuario)return;
    envioEstado=conteudo;
    clearTimeout(temporizadorEstado);
    try{sessionStorage.setItem(chaveData(),String(Date.now()));}catch{}
    statusEstado='Salvando alterações na sua conta…';
    temporizadorEstado=setTimeout(()=>{void gravarEstudos();},650);
  }
  async function gravarEstudos(){
    if(!cliente||!usuario||gravandoEstado||!envioEstado)return;
    const atual=envioEstado;
    gravandoEstado=true;
    try {
      const {error}=await cliente.from('neo_aurora_estado_estudos').upsert({
        usuario_id:usuario,conteudo:JSON.parse(atual),atualizado_em:new Date().toISOString()
      },{onConflict:'usuario_id'});
      if(error)throw error;
      statusEstado='Progresso sincronizado.';
      if(envioEstado===atual)envioEstado=null;
    }catch{
      statusEstado='Sem conexão com a nuvem. Dados mantidos nesta aba.';
    }finally{
      gravandoEstado=false;
      if(envioEstado&&envioEstado!==atual)temporizadorEstado=setTimeout(()=>{void gravarEstudos();},300);
    }
  }
  async function removerEstudos(){
    envioEstado=null;clearTimeout(temporizadorEstado);
    if(!cliente||!usuario)return;
    const {error}=await cliente.from('neo_aurora_estado_estudos').delete().eq('usuario_id',usuario);
    if(error)throw error;
    try{sessionStorage.removeItem(chaveData());}catch{}
  }
  window.addEventListener('online',()=>{if(envioEstado)void gravarEstudos();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&envioEstado)void gravarEstudos();});
  async function salvarPreferencias(perfil){
    if(!usuario)return;
    const {error}=await cliente.auth.updateUser({data:{missao_preferencias:perfil}});
    if(error)throw error;
  }
  async function sair(){const {error}=await cliente.auth.signOut({scope:'local'});if(error)throw error;}
  return {preparar,enviar,social,sair,salvarPreferencias,registrarVisita,relatorioAcessos,carregarEstudos,sincronizarEstudos,removerEstudos,mensagem,carregar,get cliente(){return cliente;},get estadoSincronizacao(){return statusEstado;},get administrador(){return administrador;},get preferencias(){return preferencias;},get armazenamento(){return usuario?sessionStorage:localStorage;},get usuario(){return usuario;},get recado(){return recado;},get provedores(){return provedores;},get cadastro(){return cadastro;},get recuperando(){return recuperando;},chave:nome=>usuario?nome+'.conta.'+usuario:nome};
})();
