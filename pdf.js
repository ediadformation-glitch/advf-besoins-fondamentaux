/* PDF local, texte sélectionnable, police Unicode incluse. */
window.createWorkPDF=async function({state,lesson,corrections,titles,responseLines,correctionLines}) {
  if(!state.validated)throw new Error('Validation requise');
  const {PDFDocument,rgb}=window.PDFLib,doc=await PDFDocument.create();
  doc.registerFontkit(window.fontkit);
  const fontBytes=Uint8Array.from(atob(window.PDF_FONT_BASE64),c=>c.charCodeAt(0));
  const font=await doc.embedFont(fontBytes,{subset:true});
  doc.setTitle('ADVF - Les besoins fondamentaux');doc.setAuthor(state.name);doc.setSubject('Travail personnel et corrigé de référence');
  const W=595.28,H=841.89,M=45,width=W-2*M,ink=rgb(.08,.23,.28),teal=rgb(.07,.35,.4),gray=rgb(.32,.4,.43);
  let page,y;
  function newPage(){page=doc.addPage([W,H]);y=H-60;page.drawText('ADVF  /  LES BESOINS FONDAMENTAUX',{x:M,y:H-30,font,size:8,color:gray});}
  newPage();
  const supported=new Set(font.getCharacterSet());
  function clean(value){return Array.from(String(value??'').replace(/\r\n?/g,'\n').replace(/\t/g,'    ').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'')).map(c=>c==='\n'||supported.has(c.codePointAt(0))?c:'[caractère U+'+c.codePointAt(0).toString(16).toUpperCase()+' non pris en charge]').join('');}
  function wrap(value,size){
    const result=[];
    for(const paragraph of clean(value).split('\n')){
      if(!paragraph){result.push('');continue;}
      let line='';
      for(const word of paragraph.split(/\s+/)){
        const candidate=line?line+' '+word:word;
        if(font.widthOfTextAtSize(candidate,size)<=width){line=candidate;continue;}
        if(line){result.push(line);line='';}
        let piece='';
        for(const c of word){if(font.widthOfTextAtSize(piece+c,size)>width&&piece){result.push(piece);piece='';}piece+=c;}line=piece;
      }
      if(line)result.push(line);
    }
    return result;
  }
  function text(value,{size=10,color=ink,gap=8}={}){
    const height=size*1.55,lines=wrap(value,size);
    if(y-height*Math.min(3,lines.length)<50)newPage();
    for(const line of lines){if(y-height<50)newPage();if(line)page.drawText(line,{x:M,y:y-size,font,size,color});y-=height;}
    y-=gap;
  }
  function heading(value){if(y<125)newPage();text(value,{size:15,color:teal,gap:14});}
  function block(label,lines,color){if(y<150)newPage();page.drawRectangle({x:M-9,y:y-15,width:3,height:15,color});text(label,{size:11,color,gap:6});for(const [key,value]of lines)text(key+' :\n'+(String(value??'').trim()||'Non renseigné'),{gap:9});y-=5;}
  heading('Les besoins fondamentaux');
  text('Formation Assistant de vie aux familles',{size:12});
  text('Prénom et nom : '+state.name+'\nAdresse e-mail : '+state.email+'\nDate de réalisation : '+new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeZone:'Europe/Paris'}).format(new Date(state.date)),{size:11,gap:15});
  text('Autocorrection guidée : les réponses libres sont comparées au corrigé de référence, sans note. Les cases laissées vides dans le corrigé sont signalées. Les réponses personnelles incomplètes sont conservées.');
  for(let e=0;e<3;e++){
    newPage();heading('Exercice '+(e+1)+' - '+titles[e]);
    text(['Pour chacune des situations suivantes, indiquez le besoin concerné.','Pour chacune des situations suivantes, indiquez le besoin concerné, et complétez l’analyse : satisfait / non satisfait, aides humaines et/ou techniques envisageables.','Lisez la situation suivante. À partir des éléments relevés, analysez les 14 besoins selon Virginia Henderson : état du besoin, pourquoi il n’est pas satisfait, aides humaines et techniques existantes ou envisageables.'][e]);
    if(e===1){heading('Exemple du document apprenant');text(lesson.example.text);block('Réponse de l’exemple',[['Besoin',lesson.example.needs],['État','Non satisfait'],['Aides',lesson.example.help]],teal);}
    if(e===2){heading('Situation complète de Madame A');for(const p of lesson.story)text(p);}
    for(let i=0;i<lesson.exercises[e].length;i++){
      const q=lesson.exercises[e][i];heading((e===2?'Besoin ':'Situation ')+(i+1));text(q.text,{size:11,gap:13});if(q.given)text(q.given,{color:gray});
      block('Votre réponse',responseLines(e,state.answers[e][i]),rgb(.27,.43,.57));
      block('Corrigé de référence',correctionLines(e,corrections[e][i]),rgb(.24,.48,.34));
      if(y>60){page.drawLine({start:{x:M,y},end:{x:W-M,y},thickness:.5,color:rgb(.82,.87,.86)});y-=20;}
    }
  }
  const pages=doc.getPages();pages.forEach((p,i)=>p.drawText('Travail personnel  |  '+(i+1)+' / '+pages.length,{x:M,y:25,font,size:8,color:gray}));
  return doc.save();
};
