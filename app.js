(() => {
  'use strict';
  const L=window.LESSON,C=window.ADVF,app=document.querySelector('#app');
  const titles=['Identifier les besoins fondamentaux','Analyser les situations','Étude de cas Madame A'];
  const KEY='advf-besoins-v1:'+location.pathname.replace(/index\.html$/,'');
  let state=C.fresh(),view='home',saveError='',conflict=false,correctionPromise;
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const statusText=s=>s==='yes'?'Satisfait':s==='no'?'Non satisfait':'Non renseigné';
  function notice(message){document.querySelector('#save-message').textContent=message;}
  try{
    const raw=localStorage.getItem(KEY);
    if(raw)try{state=C.normalize(JSON.parse(raw));}catch(error){
      const backup=localStorage.getItem(KEY+':backup');
      if(backup){state=C.normalize(JSON.parse(backup));saveError='La dernière sauvegarde était illisible. La copie précédente a été récupérée.';}
      else{saveError='La sauvegarde locale est illisible. Une nouvelle session peut être commencée ; l’ancienne copie reste conservée dans le navigateur.';localStorage.setItem(KEY+':damaged',raw);}
    }
  }catch(error){saveError='La sauvegarde locale est indisponible. Gardez cette page ouverte et téléchargez votre PDF avant de la fermer.';}
  function save(){
    if(conflict)return false;
    try{
      const previous=localStorage.getItem(KEY);
      if(previous)localStorage.setItem(KEY+':backup',previous);
      localStorage.setItem(KEY,JSON.stringify(state));
      saveError='';notice('');return true;
    }catch(error){saveError='Vos dernières réponses ne sont pas sauvegardées : le navigateur bloque le stockage ou manque de place. Gardez cette page ouverte et téléchargez votre PDF à la fin.';notice(saveError);return false;}
  }
  addEventListener('storage',event=>{
    if(event.key===KEY){conflict=true;notice('Cette session a été modifiée dans un autre onglet. Rechargez cette page pour reprendre la version sauvegardée. La saisie est suspendue pour éviter de l’écraser.');app.querySelectorAll('input,textarea,button').forEach(el=>el.disabled=true);}
  });
  const trim=v=>typeof v==='string'?v.trim():'';
  const current=()=>state.answers[state.exercise][state.index];
  function progress(){const missing=C.missing(state);return 68-missing.length;}
  function focusTitle(){const el=app.querySelector('.screen-title');if(el){el.focus({preventScroll:true});el.scrollIntoView({block:'start',behavior:'auto'});}}
  function resize(el){el.style.height='auto';el.style.height=Math.max(125,el.scrollHeight+2)+'px';}
  function textField(key,label,value){return `<label for="field-${key}">${label}</label><textarea id="field-${key}" data-field="${key}" rows="4" placeholder="Rédigez avec vos propres mots…">${escape(value)}</textarea>`;}
  function statusField(value){return `<fieldset><legend>Le besoin est-il satisfait ?</legend><div class="radio-row">${[['yes','Satisfait'],['no','Non satisfait']].map(([v,t])=>`<label><input type="radio" name="status" value="${v}" ${value===v?'checked':''}>${t}</label>`).join('')}</div></fieldset>`;}
  function story(){return `<details class="story"><summary>Lire la situation complète de Madame A</summary><div class="story-body">${L.story.map(p=>`<p>${escape(p)}</p>`).join('')}</div></details>`;}
  function example(){const x=L.example;return `<details class="example"><summary>L’exemple du document apprenant</summary><p>${escape(x.text)}</p><p><b>Besoin :</b> ${escape(x.needs)} · <b>Non satisfait</b></p><p>${escape(x.help)}</p></details>`;}
  function home(){
    app.innerHTML=`<section class="hero"><div><p class="eyebrow">Formation assistant de vie aux familles</p><h1 class="screen-title" tabindex="-1">Les besoins<br>fondamentaux</h1><p>Observer une situation, reconnaître les besoins et envisager un accompagnement adapté. Prenez le temps de rédiger, à votre rythme.</p><div class="badges"><span class="badge">3 exercices</span><span class="badge">Réponses libres</span><span class="badge">Autocorrection guidée</span></div></div><div><img class="hero-image" src="assets/intro.webp" alt="Une assistante de vie partage un moment d’échange avec une personne âgée à son domicile" width="720" height="480"><p class="hero-note">Accompagner la personne, dans le respect de ses habitudes.</p></div></section><section class="card start-card"><div><h2>${state.started?'Votre travail vous attend':'À vous de jouer'}</h2><p class="muted">${state.started?`${progress()} fiches complètes sur 68. Votre session est conservée sur cet appareil.`:'Indiquez votre prénom et votre nom, puis commencez. Vous pourrez revenir sur chaque réponse avant de valider.'}</p></div><form class="start-form" id="start-form"><label for="learner-name">Prénom et nom<input id="learner-name" name="name" autocomplete="name" required maxlength="200" value="${escape(state.name)}" ${state.validated?'readonly':''}></label><button class="primary" type="submit">${state.validated?'Voir mon travail':state.started?'Reprendre':'Commencer'} <span aria-hidden="true">→</span></button></form></section><section class="course-outline">${titles.map((t,e)=>`<div class="outline-item"><span>EXERCICE ${e+1} · ${L.exercises[e].length} ${e===2?'BESOINS':'SITUATIONS'}</span><h3>${t}</h3><p>${['Identifiez un ou plusieurs besoins pour chaque situation.','Repérez les besoins et proposez des aides lorsque c’est nécessaire.','Analysez la situation au regard des 14 besoins de Virginia Henderson.'][e]}</p></div>`).join('')}</section>`;
    document.querySelector('#start-form').onsubmit=event=>{event.preventDefault();if(conflict)return;const name=trim(document.querySelector('#learner-name').value);if(!name){document.querySelector('#learner-name').setCustomValidity('Indiquez votre prénom et votre nom.');document.querySelector('#learner-name').reportValidity();return;}if(!state.validated){state.name=name;state.started=true;save();}view=state.validated?'correction':'exercise';render();focusTitle();};
    document.querySelector('#learner-name').oninput=e=>e.target.setCustomValidity('');
  }
  function tabs(){return `<nav class="nav-tabs" aria-label="Exercices">${titles.map((t,e)=>`<button data-exercise="${e}" class="${state.exercise===e?'active':''}" ${state.exercise===e?'aria-current="step"':''}>${e+1}. ${escape(t)}</button>`).join('')}<button data-summary>Récapitulatif</button></nav>`;}
  function grid(e,summary=false){return `<div class="question-grid" aria-label="${summary?'Revenir aux fiches':'Navigation entre les fiches'}">${state.answers[e].map((a,i)=>{const full=C.complete(e,a);return `<button data-go="${e}:${i}" class="${full?'filled':''} ${!summary&&state.index===i?'current':''}" aria-label="${e===2?'Besoin':'Situation'} ${i+1}, ${full?'complète':'à compléter'}" ${!summary&&state.index===i?'aria-current="step"':''}>${i+1}</button>`;}).join('')}</div>`;}
  function exercise(){
    if(state.validated){view='correction';render();return;}
    const e=state.exercise,i=state.index,q=L.exercises[e][i],a=current();
    app.innerHTML=`${tabs()}<div class="progress-label"><span>Votre parcours</span><span id="progress-count">${progress()} / 68 fiches complètes</span></div><div class="track" role="progressbar" aria-label="Fiches complètes" aria-valuemin="0" aria-valuemax="68" aria-valuenow="${progress()}"><span style="width:${progress()/68*100}%"></span></div><div class="workspace"><aside class="card sidebar"><h3>Exercice ${e+1}</h3><p class="mini muted">${e===2?'14 besoins à explorer':`${L.exercises[e].length} situations à explorer`}</p>${grid(e)}<p class="mini">Vert : fiche complète.<br>Clair : à compléter.</p></aside><section>${e===2?story():e===1?example():''}<div class="card question-card"><p class="eyebrow">Exercice ${e+1} · ${e===2?'Besoin':'Situation'} ${i+1} sur ${L.exercises[e].length}</p><h2 class="screen-title" tabindex="-1">${escape(titles[e])}</h2><p class="question-heading">${escape(q.text)}</p>${q.given?`<p class="notice">${escape(q.given)}</p>`:''}<div id="answer-fields">${e<2?textField('needs','Besoin(s) concerné(s)',a.needs):''}${e>0?statusField(a.status):''}<div id="conditional-fields">${conditional(e,a)}</div></div><p class="save-hint">Rédigez librement. La dictée du clavier de votre appareil peut être utilisée. ${e===2?'Si aucune aide n’est nécessaire ou connue, indiquez-le dans le champ concerné.':''}</p><div class="actions"><button id="previous" ${e===0&&i===0?'disabled':''}>← Précédent</button><button class="primary" id="next">${e===2&&i===13?'Voir le récapitulatif':'Suivant →'}</button></div></div></section></div>`;
    bindNavigation();bindFields();
    document.querySelector('#previous').onclick=()=>move(-1);
    document.querySelector('#next').onclick=()=>move(1);
  }
  function conditional(e,a){
    if(e===1&&a.status==='no')return textField('help','Aides humaines et/ou techniques envisageables',a.help);
    if(e===2)return `${a.status==='no'?textField('why','Pourquoi le besoin n’est-il pas satisfait ?',a.why):''}${textField('human','Aide humaine existante ou envisageable',a.human)}${textField('technical','Aide technique existante ou envisageable',a.technical)}`;
    return '';
  }
  function updateProgress(){
    document.querySelector('#progress-count').textContent=`${progress()} / 68 fiches complètes`;
    const bar=document.querySelector('[role=progressbar]');bar.setAttribute('aria-valuenow',progress());bar.firstElementChild.style.width=progress()/68*100+'%';
    const b=app.querySelector(`[data-go="${state.exercise}:${state.index}"]`),full=C.complete(state.exercise,current());
    b.classList.toggle('filled',full);b.setAttribute('aria-label',`${state.exercise===2?'Besoin':'Situation'} ${state.index+1}, ${full?'complète':'à compléter'}`);
  }
  function bindFields(){
    app.querySelectorAll('textarea').forEach(el=>{resize(el);el.oninput=()=>{if(conflict||state.validated)return;current()[el.dataset.field]=el.value;resize(el);save();updateProgress();};});
    app.querySelectorAll('input[name=status]').forEach(el=>el.onchange=()=>{if(conflict||state.validated)return;current().status=el.value;save();document.querySelector('#conditional-fields').innerHTML=conditional(state.exercise,current());bindFields();updateProgress();});
  }
  function move(step){
    let e=state.exercise,i=state.index+step;
    if(i>=L.exercises[e].length){e++;i=0;}if(i<0){e--;i=L.exercises[e].length-1;}
    if(e>2){view='summary';}else{state.exercise=e;state.index=i;save();}render();focusTitle();
  }
  function bindNavigation(){
    app.querySelectorAll('[data-exercise]').forEach(b=>b.onclick=()=>{state.exercise=Number(b.dataset.exercise);state.index=0;save();view=state.validated?'correction':'exercise';render();focusTitle();});
    app.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{[state.exercise,state.index]=b.dataset.go.split(':').map(Number);save();view='exercise';render();focusTitle();});
    app.querySelectorAll('[data-summary]').forEach(b=>b.onclick=()=>{view='summary';render();focusTitle();});
  }
  function summary(){
    if(state.validated){view='correction';render();return;}
    const missing=C.missing(state);
    app.innerHTML=`<div class="card"><div class="summary-intro"><div><p class="eyebrow">Avant la validation</p><h1 class="screen-title" tabindex="-1" style="font-size:2.5rem">Votre récapitulatif</h1><p>Relisez votre travail. Cliquez sur un numéro pour compléter ou modifier une réponse.</p></div><div><div class="result-count">${68-missing.length} / 68</div><p class="muted">fiches complètes</p></div></div><p class="notice">${missing.length?`${missing.length} fiche(s) restent à compléter. Vous pouvez aussi valider un travail incomplet : toutes vos réponses seront conservées.`:'Toutes les fiches sont complètes. Vous pouvez encore modifier vos réponses.'} Le corrigé sera disponible après votre confirmation.</p>${titles.map((t,e)=>`<section class="summary-group"><h3>${e+1}. ${escape(t)}</h3><p class="mini muted">${state.answers[e].filter(a=>C.complete(e,a)).length} / ${L.exercises[e].length} complètes · numéros clairs : à compléter</p>${grid(e,true)}</section>`).join('')}<div class="actions"><button id="return">Revenir à ma fiche</button><button class="primary" id="finish">Terminer et accéder au corrigé</button></div></div>`;
    bindNavigation();document.querySelector('#return').onclick=()=>{view='exercise';render();focusTitle();};
    document.querySelector('#finish').onclick=()=>{document.querySelector('#confirm-missing').textContent=missing.length?`${missing.length} fiche(s) sont incomplètes.`:'Les 68 fiches sont complètes.';document.querySelector('#confirm-dialog').showModal();};
  }
  function loadScript(src){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>{script.remove();reject(new Error('Impossible de charger '+src));};document.head.append(script);});}
  function loadCorrections(){if(window.CORRECTIONS)return Promise.resolve();if(!correctionPromise)correctionPromise=loadScript('corrections.js').catch(e=>{correctionPromise=null;throw e;});return correctionPromise;}
  function responseLines(e,a){
    if(e===0)return [['Besoin(s)',a.needs]];
    if(e===1)return [['Besoin(s)',a.needs],['État du besoin',statusText(a.status)],['Aides humaines et/ou techniques',a.help]];
    return [['État du besoin',statusText(a.status)],['Pourquoi',a.why],['Aide humaine',a.human],['Aide technique',a.technical]];
  }
  function correctionLines(e,c){
    const status=c.status?statusText(c.status):'Case non renseignée dans le corrigé fourni';
    if(e===0)return [['Besoin(s)',c.needs]];
    if(e===1)return [['Besoin(s)',c.needs],['État du besoin',status],['Aides humaines et/ou techniques',c.help||'Aucune proposition indiquée dans le corrigé.']];
    return [['État du besoin',status],['Pourquoi',c.why||'Non renseigné dans le corrigé.'],['Aide humaine',c.human||'Non renseignée dans le corrigé.'],['Aide technique',c.technical||'Non renseignée dans le corrigé.'],...(c.shared?[['Précision','Correction commune aux besoins « s’occuper en vue de se réaliser », « se recréer, se divertir » et « apprendre », regroupés dans le document.']]:[])];
  }
  const panel=lines=>lines.map(([label,value])=>`<p><b>${escape(label)}</b><br>${escape(trim(value)||'Non renseigné')}</p>`).join('');
  async function correction(){
    if(!state.validated){view='summary';render();return;}
    app.innerHTML='<div class="card"><p role="status">Chargement du corrigé…</p></div>';
    try{await loadCorrections();if(view!=='correction')return;}catch(error){app.innerHTML='<div class="error">Le corrigé n’a pas pu être chargé. Vos réponses sont conservées. <button id="retry">Réessayer</button></div>';document.querySelector('#retry').onclick=correction;return;}
    const e=state.exercise;
    app.innerHTML=`<p class="eyebrow">Votre travail · ${escape(state.name)}</p><h1 class="screen-title" tabindex="-1" style="font-size:2.5rem">Comparer pour progresser</h1><p>Votre rédaction est personnelle. Comparez les besoins et les aides proposés avec la référence, sans note ni évaluation automatique de vos réponses libres.</p><section class="card pdf-card"><h2>Conserver mon travail</h2><p class="muted">Le PDF contient les trois exercices, le récit, toutes vos réponses et le corrigé. Votre e-mail sert uniquement à identifier ce document.</p><form id="pdf-form"><label for="email">Adresse e-mail<input id="email" type="email" autocomplete="email" required maxlength="254" value="${escape(state.email)}"></label><button class="primary" type="submit" id="pdf-button">Télécharger mon travail et le corrigé en PDF</button><p id="pdf-status" role="status" class="mini"></p></form></section><nav class="nav-tabs" aria-label="Corrigés des exercices">${titles.map((t,x)=>`<button data-exercise="${x}" class="${x===e?'active':''}" ${x===e?'aria-current="page"':''}>${x+1}. ${escape(t)}</button>`).join('')}</nav>${e===2?story():e===1?example():''}<h2>${escape(titles[e])}</h2>${L.exercises[e].map((q,i)=>{const c=window.CORRECTIONS[e][i],a=state.answers[e][i];return `<article class="card comparison"><p class="eyebrow">${e===2?'Besoin':'Situation'} ${i+1}</p><p class="question-heading">${escape(q.text)}</p><div class="compare-grid"><section class="answer-panel"><h3>Votre réponse</h3>${panel(responseLines(e,a))}</section><section class="answer-panel official"><h3>Corrigé de référence</h3>${panel(correctionLines(e,c))}</section></div>${e>0&&c.status&&a.status?`<p class="comparison-note">État du besoin : ${c.status===a.status?'votre choix rejoint le corrigé.':'votre choix diffère du corrigé ; examinez les éléments de la situation.'}</p>`:''}</article>`;}).join('')}`;
    bindNavigation();
    document.querySelector('#email').oninput=event=>{state.email=event.target.value;save();};
    document.querySelector('#pdf-form').onsubmit=download;
  }
  let pdfPromise;
  async function download(event){
    event.preventDefault();if(!state.validated||conflict)return;
    const email=document.querySelector('#email');email.value=email.value.trim();if(!email.reportValidity())return;
    state.email=email.value;save();const button=document.querySelector('#pdf-button'),message=document.querySelector('#pdf-status');
    button.disabled=true;message.textContent='Préparation du document complet…';
    try{
      if(!pdfPromise)pdfPromise=(async()=>{await loadScript('vendor/pdf-lib.min.js');await loadScript('vendor/fontkit.min.js');await loadScript('vendor/font.js');await loadScript('pdf.js');})().catch(error=>{pdfPromise=null;throw error;});
      await pdfPromise;const bytes=await window.createWorkPDF({state,lesson:L,corrections:window.CORRECTIONS,titles,responseLines,correctionLines});
      const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));const a=document.createElement('a');a.href=url;a.download='ADVF-besoins-'+state.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-')+'.pdf';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);message.textContent='Votre PDF est prêt. Retrouvez-le dans les téléchargements de votre appareil.';
    }catch(error){message.textContent='Le PDF n’a pas pu être généré. Vos réponses restent disponibles. Réessayez, ou utilisez l’impression du navigateur pour enregistrer le corrigé affiché.';console.error(error);}
    finally{button.disabled=false;}
  }
  function render(){notice(saveError);if(view==='home')home();else if(view==='exercise')exercise();else if(view==='summary')summary();else correction();}
  document.querySelector('#home-link').onclick=event=>{event.preventDefault();view='home';render();focusTitle();};
  document.querySelector('#cancel-final').onclick=()=>document.querySelector('#confirm-dialog').close();
  document.querySelector('#confirm-final').onclick=()=>{if(conflict)return;state.validated=true;state.date=new Date().toISOString();save();document.querySelector('#confirm-dialog').close();view='correction';render();};
  render();
})();
