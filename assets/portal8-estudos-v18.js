/* Portal 8º Ano Missão Paz • novas ferramentas aprovadas
   Bloco A: meu dia, revisão inteligente, simulados personalizados e modo prova,
   folha impressa, conquistas pessoais, mascote original e backup local. */
(function(){
 'use strict';
 const get=id=>document.getElementById(id);
 const scope=()=>String(portal8Turma||'803');
 const key=name=>'portal8-exp-'+name+'-'+scope();
 const read=(name,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key(name))||'null');return v===null?fallback:v}catch(e){return fallback}};
 const write=(name,v)=>{try{localStorage.setItem(key(name),JSON.stringify(v));return true}catch(e){return false}};
 const dayISO=(d=new Date())=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
 const ptDate=v=>{try{return new Date(v+'T12:00:00').toLocaleDateString('pt-BR')}catch(e){return v}};
 const writeText=(id,value)=>{const e=get(id);if(e)e.textContent=String(value)};
 const topicNames=()=>typeof subjects==='undefined'?[]:subjects.map(s=>s.name);
 const mascotTips=[
  'Estudar um pouco e revisar depois costuma ajudar mais do que tentar memorizar tudo de uma vez.',
  'Faça uma questão, confira a explicação e anote aquilo que ainda precisa praticar.',
  'O calendário mostra as datas de prova; confirme qualquer alteração com seus professores.',
  'Se uma matéria estiver difícil, experimente explicar o assunto com suas próprias palavras.',
  'Seu progresso é pessoal. Não precisa competir com as notas dos seus colegas.',
  'Antes de mudar de aparelho, exporte um backup dos seus estudos.'
 ];
 let mascotTip=0, exam=null, examClock=null;
 const examHistory=()=>read('simulados',[]);
 const todayTasks=()=>{try{return calendarLoad().filter(x=>x.date===dayISO())}catch(e){return []}};
 function mount(){
  const home=get('inicio');
  if(home&&!get('p8xToday')){
   home.insertAdjacentHTML('afterbegin',
    '<section class="card p8x-section" id="p8xToday" aria-labelledby="p8xTodayTitle"><div class="p8x-heading"><div><span class="p8x-eyebrow">01 · ORGANIZAÇÃO</span><h3 id="p8xTodayTitle">☀️ Meu dia na escola</h3><p id="p8xTodaySubtitle">Aulas, atividades e provas da turma escolhida.</p></div><button type="button" class="btn light" onclick="portal8Study.refreshToday()">↻ Atualizar</button></div><div class="p8x-grid"><div class="p8x-panel"><h4>📖 Aulas de hoje</h4><ul class="p8x-list" id="p8xTodayClasses"></ul></div><div class="p8x-panel"><h4>📌 Minhas tarefas</h4><ul class="p8x-list" id="p8xTodayTasks"></ul></div><div class="p8x-panel"><h4>📝 Provas e atividades</h4><ul class="p8x-list" id="p8xTodayExams"></ul></div></div></section>'
   );
   home.insertAdjacentHTML('afterbegin',
    '<section class="card p8x-section" id="p8xMascot"><div class="p8x-mascot"><svg viewBox="0 0 110 120" role="img" aria-label="Neo, mascote original em forma de livro azul"><path d="M16 26 Q40 14 56 29 Q76 12 98 24 L98 92 Q77 83 56 99 Q37 83 16 91Z" fill="#0675bd" stroke="#073e75" stroke-width="4"/><path d="M55 29 V100 M20 31 Q38 23 51 34 L51 90 Q38 80 20 85Z" fill="#dbf2ff" stroke="#0877b2" stroke-width="3"/><path d="M61 34 Q79 23 94 31 V85 Q77 80 61 91Z" fill="#ecfaff" stroke="#0877b2" stroke-width="3"/><circle cx="39" cy="52" r="3" fill="#154875"/><circle cx="74" cy="52" r="3" fill="#154875"/><path d="M46 65 Q56 74 67 65" stroke="#154875" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M18 58 L6 53 M95 57 L106 52 M36 91 L31 111 M78 92 L84 111" stroke="#0a72b2" stroke-width="5" stroke-linecap="round"/><path d="M9 13 L12 20 L19 22 L12 25 L9 32 L6 25 L0 22 L6 20Z" fill="#fac268"/></svg><div><span class="p8x-eyebrow">15 · MASCOTE EXPERIMENTAL</span><h3>📘 Neo, seu guia de estudos</h3><p id="p8xMascotTip"></p><button type="button" class="btn light" onclick="portal8Study.nextMascotTip()">💡 Outra dica</button></div></div><p class="p8x-note">Mascote original criado para este portal independente; não é personagem oficial da escola.</p></section>'
   );
   const fav=get('portal8-pro-home');
   home.insertAdjacentHTML('beforeend',
    '<section class="card p8x-section" id="p8xAchievements"><div class="p8x-heading"><div><span class="p8x-eyebrow">13 · MOTIVAÇÃO</span><h3>🏅 Minhas conquistas pessoais</h3><p>Medalhas visíveis somente neste navegador, sem classificação entre alunos.</p></div><button type="button" class="btn light" onclick="portal8Study.renderBadges()">↻ Atualizar</button></div><div class="p8x-achievements" id="p8xBadgeGrid"></div></section>'
   );
  }
  const rev=get('revisoes');
  if(rev&&!get('p8xReview')){
   rev.insertAdjacentHTML('afterbegin','<section class="card p8x-section" id="p8xReview"><div class="p8x-heading"><div><span class="p8x-eyebrow">05 · REVISÃO INTELIGENTE</span><h3>🧠 O que revisar agora?</h3><p>Sugestões privadas com base nos seus erros e conteúdos pendentes.</p></div></div><div class="p8x-fields"><label>Matéria para revisar<select id="p8xReviewSubject"></select></label></div><div class="p8x-actions"><button type="button" class="btn orange" onclick="portal8Study.markReviewed()">✅ Revisei esta matéria</button><button type="button" class="btn light" onclick="portal8Study.goWeakQuiz()">🧠 Praticar questões</button></div><div id="p8xReviewAdvice" class="p8x-emphasis"></div><div id="p8xReviewSchedule" class="p8x-grid two" style="margin-top:12px"></div><p class="p8x-note">Revisões sugeridas após 1, 3, 7 e 14 dias. É um roteiro de estudo, não uma avaliação escolar.</p></section>');
  }
  const quiz=get('quiz');
  if(quiz&&!get('p8xExam')){
   quiz.insertAdjacentHTML('afterbegin','<section class="card p8x-section" id="p8xExam"><div class="p8x-heading"><div><span class="p8x-eyebrow">06 E 07 · SIMULADOS</span><h3>🎯 Simulado personalizado e modo prova</h3><p>Escolha a matéria, o número de perguntas e como deseja receber as correções.</p></div></div><div class="p8x-fields"><label>Matéria<select id="p8xExamSubject"></select></label><label>Quantidade<select id="p8xExamCount"><option value="3">3 questões</option><option value="5" selected>5 questões</option><option value="10">10 questões</option></select></label><label>Tipo<select id="p8xExamMode"><option value="practice">Prática: corrigir a cada resposta</option><option value="test">Modo prova: corrigir no final</option></select></label><label>Tempo no modo prova<select id="p8xExamTime"><option value="10">10 minutos</option><option value="15" selected>15 minutos</option><option value="25">25 minutos</option></select></label></div><div class="p8x-actions"><button type="button" class="btn orange" onclick="portal8Study.startExam()">▶ Começar simulado</button><button type="button" class="btn light" id="p8xExamFinish" onclick="portal8Study.finishExam()" hidden>🏁 Encerrar e corrigir</button><span class="p8x-tag" id="p8xExamTimer" hidden></span></div><div class="p8x-status" id="p8xExamStatus" role="status">As questões vêm do banco de estudos existente. A quantidade disponível varia por matéria.</div><div id="p8xExamBoard" aria-live="polite"></div></section>');
  }
  const review=get('revisao803');
  if(review&&!get('p8xPrintable')){
   review.insertAdjacentHTML('afterbegin','<section class="card p8x-section" id="p8xPrintable"><div class="p8x-heading"><div><span class="p8x-eyebrow">08 · REVISÃO PARA IMPRESSÃO</span><h3>🖨️ Minha folha de revisão</h3><p>Monte uma folha pessoal com tópicos da matéria e lembretes do caderno de erros.</p></div></div><div class="p8x-fields"><label>Matéria<select id="p8xPrintSubject"></select></label></div><div class="p8x-actions"><button type="button" class="btn light" onclick="portal8Study.preparePrint()">👁️ Preparar folha</button><button type="button" class="btn orange" onclick="portal8Study.printReview()">🖨️ Imprimir ou salvar em PDF</button></div><div class="p8x-note" id="p8xPrintStatus" role="status">A impressão é gerada no próprio navegador. Os conteúdos de estudo iniciais foram montados para a 803; confirme os assuntos das demais turmas com seus professores.</div><div class="p8x-print-sheet" id="p8xPrintSheet"></div></section>');
  }
  const offline=get('offline');
  if(offline&&!get('p8xBackup')){
   offline.insertAdjacentHTML('afterbegin','<section class="card p8x-section" id="p8xBackup"><div class="p8x-heading"><div><span class="p8x-eyebrow">19 · PRIVACIDADE E BACKUP</span><h3>💾 Backup pessoal dos estudos</h3><p>Leve seu progresso, caderno, anotações e metas para outro aparelho com um arquivo JSON.</p></div></div><div class="p8x-actions"><button type="button" class="btn orange" onclick="portal8Study.exportBackup()">⬇ Baixar backup pessoal</button><label class="btn light" style="cursor:pointer">⬆ Importar arquivo<input type="file" id="p8xBackupInput" accept=".json,application/json" hidden></label></div><div id="p8xBackupStatus" role="status" class="p8x-status">O arquivo fica no seu dispositivo. Guarde-o em local privado; ele pode conter suas anotações.</div><p class="p8x-note">O backup nunca inclui sessões, senhas, e-mail, tokens ou credenciais do Supabase. Antes de importar, revise e confirme a substituição dos dados locais.</p></section>');
  }
  for(const id of ['p8xReviewSubject','p8xExamSubject','p8xPrintSubject']){
   const select=get(id);if(!select)continue;select.replaceChildren();
   topicNames().forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;select.append(option)});
  }
  if(get('p8xBackupInput'))get('p8xBackupInput').addEventListener('change',importBackup);
 }
 function nextMascotTip(){
  const tip=get('p8xMascotTip');if(tip)tip.textContent=mascotTips[mascotTip++%mascotTips.length];
 }
 function fillList(id,items,empty){
  const root=get(id);if(!root)return;root.replaceChildren();
  if(!items.length){const p=document.createElement('li');p.textContent=empty;root.append(p);return}
  for(const entry of items.slice(0,8)){
   const li=document.createElement('li');
   if(Array.isArray(entry)){const time=document.createElement('span');time.className='p8x-time';time.textContent=entry[0];const rest=document.createElement('span');rest.textContent=entry[1];li.append(time,rest)}
   else li.textContent=entry;
   root.append(li);
  }
 }
 function classesToday(){
  if(scope()!=='803')return [];
  const weekday=new Date().getDay();
  if(weekday<1||weekday>5)return [];
  const table=get('portal8Aulas803');if(!table)return [];
  return [...table.querySelectorAll('tbody tr')].map(row=>{
   const cells=row.querySelectorAll('td'),time=row.querySelector('th');
   return [time?.textContent||'',cells[weekday-1]?.textContent?.trim()||''];
  }).filter(x=>x[1]);
 }
 function getUpcomingExams(){
  const today=dayISO(),data=[['2026-11-16','Matemática'],['2026-11-17','Língua Portuguesa'],['2026-11-18','Geografia e Ed. Física'],['2026-11-19','História e Inglês'],['2026-11-23','Ciências e Arte']];
  const official=typeof portal8OfficialExams==='undefined'?[]:(portal8OfficialExams||[]).filter(x=>x.exam_date&&x.subject).map(x=>[x.exam_date,x.subject]);
  return [...data,...official].filter(x=>x[0]>=today).sort((a,b)=>a[0].localeCompare(b[0]));
 }
 function refreshToday(){
  if(!get('p8xToday'))return;
  writeText('p8xTodaySubtitle','Turma '+scope()+' • '+new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'}));
  fillList('p8xTodayClasses',classesToday(),scope()==='803'?'Hoje não há aulas cadastradas (ou é fim de semana).':'Horário desta turma ainda não foi cadastrado.');
  fillList('p8xTodayTasks',todayTasks().map(t=>t.task),'Nenhuma tarefa pessoal marcada para hoje.');
  const activities=window.portal8Classes?.cachedActivities?.()||[];
  const upcoming=getUpcomingExams().slice(0,2).map(x=>[ptDate(x[0]),x[1]]);
  const entries=[...upcoming,...activities.filter(a=>a.entrega&&a.entrega>=dayISO()).slice(0,3).map(a=>[ptDate(a.entrega),a.titulo])];
  fillList('p8xTodayExams',entries,'Nenhuma prova futura cadastrada no roteiro atual. Consulte os avisos.');
 }
 function reviewDue(){
  const raw=read('revisoes',{});return raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 }
 function getWeakSubject(){
  let best=topicNames()[0]||'Matemática',worst=-1;
  for(const sub of topicNames()){
   const errors=(typeof phaseErrors==='undefined'?[]:phaseErrors).filter(x=>x.subject===sub).length;
   const score=(state.scoreBySubject||{})[sub],rate=score?.n?1-(score.c/score.n):.25;
   const weight=errors*2+rate*4;
   if(weight>worst){worst=weight;best=sub}
  }
  return best;
 }
 function renderReview(){
  const box=get('p8xReview');if(!box)return;
  const schedules=reviewDue(),today=dayISO();
  const weak=getWeakSubject();const totalErrors=Array.isArray(phaseErrors)?phaseErrors.length:0;
  const recommendation=get('p8xReviewAdvice');recommendation.replaceChildren();
  const title=document.createElement('b');title.textContent='Sugestão: '+weak;
  const text=document.createElement('p');text.textContent='Seus registros mostram '+totalErrors+' questão(ões) no caderno de erros. Priorize questões erradas e matérias que você marcou como difíceis. As sugestões são orientativas.';
  recommendation.append(title,text);
  const grid=get('p8xReviewSchedule');grid.replaceChildren();
  const entries=Object.entries(schedules).sort((a,b)=>String(a[1].due).localeCompare(String(b[1].due)));
  if(!entries.length){const p=document.createElement('p');p.className='p8x-note';p.textContent='Nenhuma revisão agendada aqui. Escolha uma matéria e marque Revisei esta matéria.';grid.append(p)}
  for(const [subject,info] of entries){
   const card=document.createElement('div');card.className='p8x-panel';
   const heading=document.createElement('h4');heading.textContent=subject;
   const p=document.createElement('p');p.textContent=(info.due<=today?'🔔 Revisão para hoje ou pendente':'📅 Próxima revisão')+' • '+ptDate(info.due);
   card.append(heading,p);grid.append(card);
  }
 }
 function markReviewed(){
  const subject=get('p8xReviewSubject')?.value;if(!subject)return;
  const all=reviewDue(),prev=all[subject]||{step:-1},last=Number.isInteger(prev.step)?prev.step:-1,next=Math.min(3,last+1);
  const due=new Date();due.setHours(12,0,0,0);due.setDate(due.getDate()+[1,3,7,14][next]);
  all[subject]={step:next,due:dayISO(due),last:dayISO()};
  if(!write('revisoes',all))return alert('Não foi possível salvar. Verifique o espaço do navegador.');
  renderReview();renderBadges();
 }
 function goWeakQuiz(){showView('quiz');if(get('p8xExamSubject'))get('p8xExamSubject').value=getWeakSubject();}
 function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
 function stopExamClock(){if(examClock){clearInterval(examClock);examClock=null}}
 function startExam(){
  if(exam?.active&&!confirm('O simulado atual será substituído. Deseja começar outro?'))return;
  const subj=get('p8xExamSubject')?.value,mode=get('p8xExamMode')?.value||'practice',count=Math.max(1,Math.min(10,Number(get('p8xExamCount')?.value)||5));
  const pool=shuffle(quizzes.filter(q=>q.s===subj).slice());
  if(!pool.length){writeText('p8xExamStatus','Não há questões cadastradas para essa matéria.');return}
  stopExamClock();
  const items=pool.slice(0,count);
  exam={active:true,subject:subj,mode,items,index:0,answers:[],deadline:mode==='test'?Date.now()+(Number(get('p8xExamTime')?.value)||15)*60000:null,finished:false};
  writeText('p8xExamStatus','Simulado iniciado: '+items.length+' questões de '+subj+'. '+(mode==='test'?'Correção somente ao terminar.':'Correção após cada resposta.'));
  get('p8xExamFinish').hidden=false;
  get('p8xExamTimer').hidden=mode!=='test';
  if(mode==='test'){examClock=setInterval(tickExam,1000);tickExam()}
  renderExamQuestion();
 }
 function tickExam(){
  if(!exam||!exam.active||exam.mode!=='test')return;
  const left=Math.max(0,Math.ceil((exam.deadline-Date.now())/1000));
  writeText('p8xExamTimer',Math.floor(left/60)+':'+String(left%60).padStart(2,'0'));
  if(left<=0){writeText('p8xExamStatus','Tempo encerrado. Correção automática do simulado.');finishExam()}
 }
 function renderExamQuestion(){
  const root=get('p8xExamBoard');root.replaceChildren();
  if(!exam?.active)return;
  const q=exam.items[exam.index];
  const label=document.createElement('div');label.className='p8x-note';label.textContent='Questão '+(exam.index+1)+' de '+exam.items.length+' • '+(exam.mode==='test'?'Modo prova':'Prática');
  const title=document.createElement('div');title.className='p8x-question';title.textContent=q.q;root.append(label,title);
  const options=document.createElement('div');options.id='p8xExamOptions';
  for(let i=0;i<q.o.length;i++){
   const l=document.createElement('label');l.className='p8x-option';const inp=document.createElement('input');inp.type='radio';inp.name='p8xAnswer';inp.value=String(i);
   const txt=document.createElement('span');txt.textContent=String.fromCharCode(65+i)+'. '+q.o[i];l.append(inp,txt);options.append(l);
  }
  root.append(options);
  const feedback=document.createElement('div');feedback.id='p8xExamFeedback';feedback.className='p8x-status';feedback.setAttribute('role','status');root.append(feedback);
  const action=document.createElement('div');action.className='p8x-actions';
  const button=document.createElement('button');button.type='button';button.className='btn orange';button.textContent=exam.mode==='test'?'Salvar e avançar':'Corrigir resposta';button.onclick=answerExam;button.id='p8xExamNext';
  action.append(button);root.append(action);
 }
 function answerExam(){
  if(!exam?.active)return;
  const checked=document.querySelector('#p8xExamOptions input:checked');
  if(!checked){writeText('p8xExamFeedback','Escolha uma alternativa antes de continuar.');return}
  const q=exam.items[exam.index],answer=Number(checked.value),right=answer===q.a;
  exam.answers[exam.index]=answer;
  if(exam.mode==='test'){advanceExam();return}
  get('p8xExamOptions').querySelectorAll('input').forEach(e=>e.disabled=true);
  writeText('p8xExamFeedback',(right?'✅ Correto! ':'📚 Ainda não. ')+q.e);
  const button=get('p8xExamNext');button.textContent=exam.index===exam.items.length-1?'🏁 Ver resultado':'Próxima questão →';button.onclick=advanceExam;
 }
 function advanceExam(){
  if(!exam?.active)return;
  if(exam.index>=exam.items.length-1){finishExam();return}
  exam.index++;renderExamQuestion();
 }
 function finishExam(){
  if(!exam?.active)return;
  stopExamClock();exam.active=false;exam.finished=true;
  const root=get('p8xExamBoard');root.replaceChildren();get('p8xExamFinish').hidden=true;get('p8xExamTimer').hidden=true;
  let correct=0;
  for(let i=0;i<exam.items.length;i++){
   const q=exam.items[i],picked=exam.answers[i],right=picked===q.a;
   if(right)correct++;
   if(picked!==undefined){
    state.answered++;if(right)state.correct++;
    const sc=state.scoreBySubject[q.s]||{c:0,n:0};
    sc.n++;if(right)sc.c++;state.scoreBySubject[q.s]=sc;
    if(typeof phaseRecordQuiz==='function')phaseRecordQuiz(q,right);
   }
  }
  save();updateDashboard();
  const summary=document.createElement('div');summary.className='p8x-exam-result';
  const strong=document.createElement('strong');strong.textContent='🏁 Resultado: '+correct+' de '+exam.items.length+' acertos';
  const p=document.createElement('p');p.textContent='Esse é um treino pessoal, não uma nota oficial. Confira as explicações abaixo.';
  summary.append(strong,p);root.append(summary);
  for(let i=0;i<exam.items.length;i++){
   const q=exam.items[i],picked=exam.answers[i];const box=document.createElement('div');box.className='p8x-exam-review';
   const title=document.createElement('b');title.textContent=(i+1)+'. '+q.q;
   const answer=document.createElement('p');answer.textContent='Sua resposta: '+(picked===undefined?'não respondida':q.o[picked])+'. Correta: '+q.o[q.a]+'.';
   const explanation=document.createElement('p');explanation.textContent=q.e;box.append(title,answer,explanation);root.append(box);
  }
  const history=examHistory();history.push({day:dayISO(),subject:exam.subject,correct,total:exam.items.length,mode:exam.mode});write('simulados',history.slice(-40));
  writeText('p8xExamStatus','Simulado corrigido. Você pode começar outro quando quiser.');
  renderBadges();renderReview();
 }
 function preparePrint(){
  const sheet=get('p8xPrintSheet'),subject=get('p8xPrintSubject')?.value;
  if(!sheet||!subject)return;
  const s=subjects.find(x=>x.name===subject);sheet.replaceChildren();
  const h1=document.createElement('h1');h1.textContent='Minha folha de revisão • '+subject;
  const intro=document.createElement('p');intro.textContent='Turma '+scope()+' • '+ptDate(dayISO())+' • Portal 8º Ano Missão Paz (projeto independente)';
  sheet.append(h1,intro);
  if(s){
   const warning=document.createElement('p');warning.textContent='Conteúdos de referência inicialmente preparados para a turma 803. Confira com seu professor os assuntos da sua turma.';sheet.append(warning);
   for(const chapter of s.topics){
    const h2=document.createElement('h2');h2.textContent=chapter[0];sheet.append(h2);
    const ul=document.createElement('ul');for(const item of chapter[1]){const li=document.createElement('li');li.textContent='☐ '+item;ul.append(li)}sheet.append(ul);
   }
  }
  const errors=(Array.isArray(phaseErrors)?phaseErrors:[]).filter(x=>x.subject===subject).slice(0,8);
  if(errors.length){const head=document.createElement('h2');head.textContent='Questões para revisar';sheet.append(head);
   for(const item of errors){const p=document.createElement('p');p.textContent='• '+item.question+' — '+item.explanation;sheet.append(p)}
  }
  const area=document.createElement('h2');area.textContent='Minhas anotações';sheet.append(area);
  for(let i=0;i<5;i++){const p=document.createElement('p');p.textContent='__________________________________________________________________';sheet.append(p)}
  writeText('p8xPrintStatus','Folha preparada com conteúdos de '+subject+'. Use Imprimir ou salvar em PDF.');
 }
 function printReview(){preparePrint();window.print()}
 function renderBadges(){
  const el=get('p8xBadgeGrid');if(!el)return;el.replaceChildren();
  const revisions=Object.keys(reviewDue()).length,history=examHistory(),days=new Set((Array.isArray(phaseHistory)?phaseHistory:[]).map(x=>x.date)).size;
  const specs=[
   ['📘','Primeiro passo',state.done.length>=1,'1 tópico concluído'],
   ['✅','Constância',state.done.length>=5,'5 tópicos concluídos'],
   ['🧠','Praticante',state.answered>=10,'10 questões respondidas'],
   ['🎯','Simulado completo',history.length>=1,'1 simulado personalizado'],
   ['📅','Revisão organizada',revisions>=1,'1 revisão agendada'],
   ['🌟','Estudo em dias diferentes',days>=3,'3 dias com exercícios']
  ];
  for(const [emoji,name,unlocked,desc] of specs){
   const card=document.createElement('div');card.className='p8x-medal'+(unlocked?' unlocked':'');
   const icon=document.createElement('span');icon.textContent=unlocked?emoji:'🔒';
   const txt=document.createElement('div');const b=document.createElement('b');b.textContent=name;const small=document.createElement('small');small.textContent=desc;txt.append(b,small);card.append(icon,txt);el.append(card);
  }
 }
 const backupAllowed=k=>/^(missao803-v1|portal8-state-(801|802|803|804|806|807)|missao803-(calendar|smart|caderno|caderno-rascunho)-v1|portal803-(niveis|checklist|erros|historico)-v1(?:-(801|802|803|804|806|807))?|portal803-(theme|favorite-tools|last-tool)-v1|portal8-exp-(revisoes|simulados)-(801|802|803|804|806|807))$/.test(k);
 function exportBackup(){
  const items={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(backupAllowed(k))items[k]=localStorage.getItem(k)}
  const pack={format:'portal8-backup-v1',created_at:new Date().toISOString(),keys:items};
  const json=JSON.stringify(pack,null,2),blob=new Blob([json],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='meus-estudos-portal8-'+dayISO()+'.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),5000);
  writeText('p8xBackupStatus','Backup gerado com '+Object.keys(items).length+' itens pessoais. Guarde o arquivo em local privado.');
 }
 async function importBackup(event){
  const file=event.target.files?.[0];event.target.value='';if(!file)return;
  try{
   if(file.size>1024*1024)throw Error('O arquivo ultrapassa o limite de 1 MB.');
   const pack=JSON.parse(await file.text());
   if(pack?.format!=='portal8-backup-v1'||!pack.keys||typeof pack.keys!=='object'||Array.isArray(pack.keys))throw Error('Formato de backup não reconhecido.');
   const entries=Object.entries(pack.keys);
   if(entries.length>150||entries.some(([k,v])=>!backupAllowed(k)||typeof v!=='string'||v.length>200000))throw Error('O arquivo contém campos não permitidos ou muito grandes.');
   for(const [k,v] of entries)JSON.parse(v);
   if(!entries.length)throw Error('Backup vazio.');
   if(!confirm('Importar '+entries.length+' itens? Os dados locais correspondentes serão substituídos. Salve seu backup atual antes de continuar.'))return;
   for(const [k,v] of entries)localStorage.setItem(k,v);
   writeText('p8xBackupStatus','✅ Backup importado. Recarregue a página para utilizar seus dados restaurados.');
   if(confirm('Dados importados. Deseja recarregar o portal agora?'))location.reload();
  }catch(error){writeText('p8xBackupStatus','Não foi possível importar: '+(error.message||'arquivo inválido'))}
 }
 function afterNavigation(){
  refreshToday();renderReview();renderBadges();
 }
 function init(){
  mount();nextMascotTip();refreshToday();renderReview();renderBadges();
  if(typeof showView==='function'){
   const original=window.showView;window.showView=function(id){original(id);afterNavigation()};
  }
  if(typeof portal8Choose==='function'){
   const originalChoose=window.portal8Choose;window.portal8Choose=function(t){
    const result=originalChoose(t);afterNavigation();return result;
   };
  }
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshToday()});
 }
 window.portal8Study={refreshToday,nextMascotTip,renderBadges,markReviewed,goWeakQuiz,startExam,finishExam,preparePrint,printReview,exportBackup,renderReview,afterNavigation};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
