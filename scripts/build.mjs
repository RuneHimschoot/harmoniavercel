// No framework or external build dependencies: dist/ is the editable static app.
import {readdir, readFile, mkdir, writeFile, rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';

const root=fileURLToPath(new URL('../',import.meta.url));
const source=path.join(root,'dist');
const output=path.join(root,'build');
async function walk(dir){
  const files=[];
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const name=path.join(dir,entry.name);
    if(entry.isSymbolicLink())throw Error('Geen symlinks in de statische app: '+name);
    if(entry.isDirectory())files.push(...await walk(name));
    else if(entry.isFile())files.push(name);
  }
  return files.sort();
}
const files=await walk(source);
const content=new Map();
for(const file of files){
  const relative=path.relative(source,file).split(path.sep).join('/');
  if(!/\.(html|css|js|json|webmanifest|svg|png|jpg|jpeg|webp|ico|woff2?)$/.test(relative))throw Error('Onverwacht openbaar bestand: '+relative);
  content.set(relative,await readFile(file));
  if(file.endsWith('.js')){
    const check=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});
    if(check.error)throw check.error;
    if(check.status!==0)throw Error('JavaScriptcontrole mislukt: '+relative);
  }
}
for(const required of ['index.html','sw.js','manifest.webmanifest','src/app.js']){
  if(!content.has(required))throw Error('Appbestand ontbreekt: '+required);
}
// Validate the actual offline file list, without running worker event handlers.
const worker=content.get('sw.js').toString('utf8');
const cached=vm.runInNewContext(worker+'\nFILES',{
  URL,self:{location:{href:'https://harmonia.invalid/sw.js'},addEventListener(){}}
},{timeout:1000});
for(const url of cached){
  const name=new URL(url).pathname.slice(1)||'index.html';
  if(!content.has(name))throw Error('Offlinecache verwijst naar ontbrekend bestand: '+name);
}
const hash=createHash('sha256');
for(const [name,bytes] of content)hash.update(name).update('\0').update(bytes).update('\0');
const revision=hash.digest('hex').slice(0,16);
const builtWorker=worker.replace(/const CACHE = PREFIX \+ '[^']+';/,`const CACHE = PREFIX + 'build-${revision}';`);
if(builtWorker===worker)throw Error('Offlinecacheversie kon niet worden ingesteld.');
content.set('sw.js',Buffer.from(builtWorker));
// This fixed, resolved target must remain inside this project before cleaning it.
if(path.dirname(output)!==path.resolve(root)||path.basename(output)!=='build')throw Error('Ongeldig buildpad.');
await rm(output,{recursive:true,force:true});
for(const [name,bytes] of content){
  const target=path.join(output,name);
  await mkdir(path.dirname(target),{recursive:true});
  await writeFile(target,bytes);
}
console.log(`Harmonia gebouwd: ${content.size} bestanden → build/ (cache ${revision})`);
