const fs=require('node:fs');
fs.mkdirSync('dist',{recursive:true});
for(const name of ['index.html','styles.css','data.js','core.js','app.js','corrections.js','pdf.js'])fs.copyFileSync(name,'dist/'+name);
for(const name of ['assets','vendor'])fs.cpSync(name,'dist/'+name,{recursive:true});
fs.writeFileSync('dist/.nojekyll','');
console.log('Application statique prête dans dist/');
