/* Modèle indépendant de l’interface, partagé par les vérifications. */
(function(root) {
  const fields = [['needs'], ['needs','status','help'], ['status','why','human','technical']];
  function fresh() { return {version:1,name:'',email:'',started:false,validated:false,date:'',exercise:0,index:0,answers:[Array.from({length:30},()=>({})),Array.from({length:24},()=>({})),Array.from({length:14},()=>({}))]}; }
  function complete(e,a) {
    const has=k=>typeof a[k]==='string' && a[k].trim().length>0;
    if(e===0)return has('needs');
    if(e===1)return has('needs') && ['yes','no'].includes(a.status) && (a.status==='yes'||has('help'));
    return ['yes','no'].includes(a.status) && (a.status==='yes'||(has('why')&&has('human')&&has('technical')));
  }
  function normalize(raw) {
    if(!raw || raw.version!==1 || !Array.isArray(raw.answers)) throw new Error('Format de sauvegarde incompatible');
    const s=fresh();
    for(const k of ['name','email','date'])if(typeof raw[k]==='string')s[k]=raw[k];
    s.started=raw.started===true;s.validated=raw.validated===true;
    s.exercise=Number.isInteger(raw.exercise)?Math.max(0,Math.min(2,raw.exercise)):0;
    s.index=Number.isInteger(raw.index)?Math.max(0,Math.min(s.answers[s.exercise].length-1,raw.index)):0;
    s.answers=s.answers.map((rows,e)=>rows.map((_,i)=>{
      const a={};for(const k of fields[e])if(typeof raw.answers[e]?.[i]?.[k]==='string')a[k]=raw.answers[e][i][k];
      if(a.status&&!['yes','no'].includes(a.status))delete a.status;return a;
    }));return s;
  }
  function missing(s) {return s.answers.flatMap((rows,e)=>rows.flatMap((a,i)=>complete(e,a)?[]:[{e,i}]));}
  const api={fresh,normalize,complete,missing,fields};
  root.ADVF=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
