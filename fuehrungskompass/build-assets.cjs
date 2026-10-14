// Reassemble vendored libraries exactly; verify before publication.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'assets');
for(const entry of JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'))){
 const bytes=Buffer.concat(entry.parts.map(p=>fs.readFileSync(path.join(root,p))));
 if(bytes.length!==entry.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==entry.sha256)throw Error('Library integrity mismatch: '+entry.name);
 fs.writeFileSync(path.join(root,entry.name),bytes);
 console.log('Verified PDF library: '+entry.name);
}
