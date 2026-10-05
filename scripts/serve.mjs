import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(import.meta.dirname,'..',process.argv.includes('--dist')?'dist':'.');
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost');
  const path=decodeURIComponent(url.pathname);
  // Apenas arquivos públicos: nunca servir .env, código do servidor, Git ou migrations.
  if(!(path==='/'||path==='/index.html'||path==='/favicon.svg'||/^\/src\/[a-zA-Z0-9/_-]+\.(js|css)$/.test(path))){res.writeHead(404);res.end('Não encontrado');return;}
  const file=resolve(root,'.'+(path==='/'?'/index.html':path));
  if(!file.startsWith(root+sep)||!(await stat(file)).isFile())throw new Error('Not found');
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(await readFile(file));
 }catch{res.writeHead(404);res.end('Não encontrado');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
