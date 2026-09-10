// Publish only runtime assets, never Git history or project documentation.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),port=Number(process.env.PORT)||4173;
const assets={'/':'index.html','/index.html':'index.html','/game.js':'game.js','/world.js':'world.js','/levels.js':'levels.js','/style.css':'style.css'};
http.createServer((req,res)=>{
  const file=assets[new URL(req.url,'http://localhost').pathname];
  if(!file){res.writeHead(404);return res.end('Not found');}
  const type=file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html';
  res.writeHead(200,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store'});
  fs.createReadStream(path.join(root,file)).pipe(res);
}).listen(port,'0.0.0.0',()=>console.log(`Level Devil on port ${port}`));
