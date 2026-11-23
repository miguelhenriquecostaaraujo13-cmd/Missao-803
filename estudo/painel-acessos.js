'use strict';
(async () => {
 const estado=document.getElementById('estado-admin');
 const painel=document.getElementById('dados-admin');
 const formatar=new Intl.NumberFormat('pt-BR');
 const dataHora=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?'—':d.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Sao_Paulo'});};
 try {
  await contas.preparar();
  if(!contas.usuario){estado.textContent='Entre com sua conta de administrador para visualizar as estatísticas. ';
    const a=document.createElement('a');a.href='./index.html#conta/entrar';a.textContent='Ir para o login';estado.append(a);return;}
  if(!contas.administrador){estado.textContent='Acesso restrito. Esta conta não tem permissão de administrador.';return;}
 } catch {estado.textContent='Não foi possível verificar sua conta. Atualize a página e tente novamente.';return;}
 async function atualizar(){
  estado.hidden=false;estado.textContent='Carregando dados de acesso…';
  try {
   const dados=await contas.relatorioAcessos();
   for(const [id,valor] of [['visitas-hoje',dados.visitasHoje],['visitas-30',dados.visitas30Dias],['contas-total',dados.contasComAcesso],['contas-ativas',dados.contasAtivas30Dias]]){
    document.getElementById(id).textContent=formatar.format(Number(valor||0));
   }
   const serie=new Map((dados.dias||[]).map(d=>[d.dia,Number(d.visitas)||0]));
   const hoje=new Date((dados.hoje||new Date().toISOString().slice(0,10))+'T12:00:00');
   const ultimos=Array.from({length:14},(_,i)=>{const data=new Date(hoje);data.setDate(data.getDate()-13+i);
    const key=[data.getFullYear(),String(data.getMonth()+1).padStart(2,'0'),String(data.getDate()).padStart(2,'0')].join('-');
    return {dia:key,visitas:serie.get(key)||0};});
   const max=Math.max(1,...ultimos.map(d=>d.visitas)),grafico=document.getElementById('grafico-admin');
   grafico.replaceChildren();
   for(const item of ultimos){
    const coluna=document.createElement('div');coluna.className='dia-coluna';
    const valor=document.createElement('span');valor.className='valor-dia';valor.textContent=String(item.visitas);
    const area=document.createElement('div');area.className='barra-area';
    const barra=document.createElement('div');barra.className='barra';
    barra.style.height=(item.visitas?Math.max(6,item.visitas/max*100):3)+'%';
    barra.title=item.dia+': '+item.visitas+' visitas';area.append(barra);
    const legenda=document.createElement('span');legenda.className='etiqueta-dia';legenda.textContent=item.dia.slice(8);
    coluna.append(valor,area,legenda);grafico.append(coluna);
   }
   const contasDados=Array.isArray(dados.contas)?dados.contas:[];
   const corpo=document.getElementById('corpo-contas');corpo.replaceChildren();
   for(const registro of contasDados){
    const tr=document.createElement('tr'),usuario=document.createElement('td'),nome=document.createElement('strong'),email=document.createElement('small');
    nome.textContent=registro.nome||'Estudante';email.textContent=registro.email||'Sem e-mail';
    usuario.append(nome,email);
    const ultimo=document.createElement('td');ultimo.textContent=dataHora(registro.ultimoAcesso);
    const dias=document.createElement('td');dias.textContent=formatar.format(Number(registro.diasAtivos)||0);
    tr.append(usuario,ultimo,dias);corpo.append(tr);
   }
   document.getElementById('sem-contas').hidden=contasDados.length>0;
   painel.hidden=false;estado.hidden=true;
  }catch{
   estado.hidden=false;estado.textContent='Não foi possível carregar os dados. Verifique a conexão e sua permissão de administrador.';
  }
 }
 document.getElementById('atualizar-admin').addEventListener('click',atualizar);
 await atualizar();
})();
