const fs=require('node:fs');
fs.mkdirSync('dist',{recursive:true});
for(const name of ['index.html','styles.css','data.js','core.js','app.js','corrections.js','pdf.js'])fs.copyFileSync(name,'dist/'+name);
const resources={
  assets:['intro.webp'],
  vendor:['pdf-lib.min.js','fontkit.min.js','font.js','pdf-lib-LICENSE.md','fontkit-NOTICE.txt','Ubuntu-UFL.txt']
};
for(const [folder,names] of Object.entries(resources)){
  fs.mkdirSync('dist/'+folder,{recursive:true});
  for(const name of names){
    const source=fs.existsSync(folder+'/'+name)?folder+'/'+name:name;
    fs.copyFileSync(source,'dist/'+folder+'/'+name);
  }
}
fs.writeFileSync('dist/.nojekyll','');
console.log('Application statique prête dans dist/');
