import {mkdir,cp,writeFile,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {publicConfig} from './config.mjs';
const root=resolve(import.meta.dirname,'..');
const env={};
try { for(const line of (await readFile(resolve(root,'.env'),'utf8')).split(/\r?\n/)) {const match=line.match(/^([A-Z_]+)=(.*)$/);if(match)env[match[1]]=match[2].trim().replace(/^(['"])(.*)\1$/,'$2');} } catch(error){if(error.code!=='ENOENT')throw error;}
const config=publicConfig({...env,...process.env});
await mkdir(resolve(root,'dist'),{recursive:true});
for(const file of ['index.html','favicon.svg','src']) await cp(resolve(root,file),resolve(root,'dist',file),{recursive:true});
await writeFile(resolve(root,'dist/src/config.js'),`export const config = Object.freeze(${JSON.stringify(config)});\n`);
await writeFile(resolve(root,'dist/.nojekyll'),'');
console.log(`Build concluído: dist/ · modo ${config.mode}`);
