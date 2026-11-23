'use strict';
// Configuração pública do Missão 803; nunca incluir chaves secretas ou service_role.
const configuracao = Object.freeze({ url: 'https://mbltrucgwqozrujxifcx.supabase.co', chavePublica: 'sb_publishable_kLsE6obFofxRlM6R5ozVrA_TtGowU32' });
const contas = (() => {
  const sdk=new URL('vendor/supabase.js',document.currentScript.src).href;
  const paginaInicial=new URL('../index.html',document.currentScript.src);
  let cliente, usuario, preferencias, provedores = {}, cadastro = false, recuperando = false;
  let recado = 'O acesso por conta aguarda um ambiente de homologação. Você já pode estudar como visitante.';
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
  async function salvarPreferencias(perfil){
    if(!usuario)return;
    const {error}=await cliente.auth.updateUser({data:{missao_preferencias:perfil}});
    if(error)throw error;
  }
  async function sair(){const {error}=await cliente.auth.signOut({scope:'local'});if(error)throw error;}
  return {preparar,enviar,social,sair,salvarPreferencias,mensagem,carregar,get preferencias(){return preferencias;},get armazenamento(){return usuario?sessionStorage:localStorage;},get usuario(){return usuario;},get recado(){return recado;},get provedores(){return provedores;},get cadastro(){return cadastro;},get recuperando(){return recuperando;},chave:nome=>usuario?nome+'.conta.'+usuario:nome};
})();
