import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dimensions,situations,VERSION,patterns} from './data.mjs';
import {evaluate,potential,validState,emptyState,keys} from './engine.mjs';
import {reportBlocks} from './report.mjs';
assert.equal(situations.length,8);
for(const s of situations){assert.equal(s.options.length,4);assert.equal(new Set(s.options.map(o=>o.main)).size,4);for(const o of s.options){assert(keys.includes(o.main)&&keys.includes(o.secondary));assert.notEqual(o.main,o.secondary);assert(o.reason.length>20);}}
assert.equal(Object.values(potential).reduce((a,b)=>a+b,0),96);
let ties=0,minActive=6;const profiles=new Set(),winners=Object.fromEntries(keys.map(k=>[k,0]));let tieExample;
for(let n=0;n<65536;n++){
 let rem=n;const a=Array.from({length:8},()=>{const v=rem%4;rem=Math.floor(rem/4);return v;});const r=evaluate(a);
 const independent=Object.fromEntries(keys.map(k=>[k,a.reduce((sum,choice,i)=>sum+2*(situations[i].options[choice].main===k)+(situations[i].options[choice].secondary===k),0)]));
 assert.deepEqual(r.raw,independent);assert.equal(Object.values(r.raw).reduce((a,b)=>a+b),24);assert(r.highlighted.length>=2);
 const sorted=keys.map(k=>({key:k,n:independent[k],d:potential[k]})).sort((x,y)=>y.n*x.d-x.n*y.d);
 const expected=sorted.filter(x=>x.n*sorted[1].d>=sorted[1].n*x.d).map(x=>x.key);assert.deepEqual(r.highlighted,expected);
 for(const k of keys)assert.equal(r.evidence[k].reduce((s,e)=>s+e.points,0),r.raw[k]);
 for(const p of patterns)assert.equal(r.patterns.some(x=>x.id===p.id),p.options.filter(id=>r.ids.includes(id)).length>=p.threshold);
 if(r.boundaryTie){ties++;tieExample??=a;}minActive=Math.min(minActive,Object.values(r.raw).filter(x=>x>0).length);profiles.add(keys.map(k=>r.raw[k]).join(','));
 const best=sorted.filter(x=>x.n*sorted[0].d===sorted[0].n*x.d);for(const x of best)winners[x.key]+=1/best.length;
}
for(const invalid of [[],Array(8),Array(8).fill(null),Array(8).fill(-1),Array(8).fill(4),Array(8).fill('0'),Array(8).fill(.5)])assert.throws(()=>evaluate(invalid));
assert(validState(emptyState()));assert(!validState({...emptyState(),version:'old'}));assert(!validState({...emptyState(),notes:['x']}));assert(!validState({...emptyState(),difficulty:Array(8).fill('unknown')}));
const s={...emptyState(),answers:[0,1,2,3,0,1,2,3],notes:['<script>alert(1)</script> ÄÖÜ ß € 🧭',...Array(7).fill('')],difficulty:Array(8).fill('schwer')};
const blocks=reportBlocks(s),joined=blocks.map(b=>b.text).join('\n');for(let i=0;i<8;i++)for(let j=0;j<4;j++){assert(joined.includes(`${i+1}${'ABCD'[j]}`));assert(joined.includes(situations[i].options[j].text));assert(joined.includes(situations[i].options[j].reason));}assert(joined.includes(s.notes[0]));
const r1=evaluate(s.answers),r2=evaluate([...s.answers]);assert.deepEqual(r1,r2);assert.deepEqual(reportBlocks(s),reportBlocks(structuredClone(s)));
const dir=new URL('.',import.meta.url);const hashes=Object.fromEntries(['data.mjs','engine.mjs','report.mjs','app.mjs'].map(name=>[name,crypto.createHash('sha256').update(fs.readFileSync(new URL(name,dir))).digest('hex')]));
const report={version:VERSION,scope:'Technische Regelprüfung, keine psychometrische Validierung',combinations:65536,allPassed:true,rawPointsAlways:24,potential,profiles:profiles.size,minActiveDimensions:minActive,profilesWithTieAcrossSecondPlace:ties,tieExample,topShareUnderUniformRandomChoices:Object.fromEntries(keys.map(k=>[k,Number((winners[k]/65536).toFixed(6))])),checks:['Alle 32 Antworten gültig und gewichtet','Alle 65.536 Kombinationen gegen unabhängige Berechnung geprüft','Gleichstände an Platz zwei vollständig erhalten','Musterregeln gegen jede Kombination geprüft','Antwortbeiträge summieren sich exakt','Ungültige und unvollständige Eingaben abgewiesen','Alle Fragen, Antworten, Zuordnungen und Notizen im Bericht','Wiederholte Auswertung deterministisch'],sha256:hashes};
fs.writeFileSync(new URL('pruefung.json',dir),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
