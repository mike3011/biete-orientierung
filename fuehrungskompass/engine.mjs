import {situations,dimensions,patterns,VERSION} from './data.mjs';
export const keys=Object.keys(dimensions);
export const potential=Object.fromEntries(keys.map(k=>[k,situations.reduce((n,s)=>n+s.options.reduce((v,o)=>v+2*(o.main===k)+(o.secondary===k),0),0)]));
export function validAnswer(a){return Number.isInteger(a)&&a>=0&&a<4;}
export function evaluate(answers){
 if(!Array.isArray(answers)||answers.length!==8||!Array.from({length:8},(_,i)=>validAnswer(answers[i])).every(Boolean))throw Error('Bitte beantworte alle acht Situationen mit einer gültigen Auswahl.');
 const raw=Object.fromEntries(keys.map(k=>[k,0])),evidence=Object.fromEntries(keys.map(k=>[k,[]]));
 const ids=answers.map((a,i)=>`${i+1}${'ABCD'[a]}`);
 answers.forEach((a,i)=>{const o=situations[i].options[a];raw[o.main]+=2;raw[o.secondary]++;evidence[o.main].push({id:ids[i],points:2});evidence[o.secondary].push({id:ids[i],points:1});});
 const cmp=(a,b)=>raw[b]*potential[a]-raw[a]*potential[b];
 const order=[...keys].sort(cmp);const highlighted=order.filter(k=>cmp(k,order[1])<=0);
 return {version:VERSION,raw,evidence,order,highlighted,ids,patterns:patterns.filter(p=>p.options.filter(id=>ids.includes(id)).length>=p.threshold).map(p=>({...p,matches:p.options.filter(id=>ids.includes(id))})),boundaryTie:highlighted.length>2};
}
export function validState(x){return Boolean(x&&x.version===VERSION&&['answers','notes','difficulty'].every(k=>Array.isArray(x[k])&&x[k].length===8)&&Array.from({length:8},(_,i)=>(x.answers[i]===null||validAnswer(x.answers[i]))&&typeof x.notes[i]==='string'&&x.notes[i].length<=3000&&['','leicht','mittel','schwer'].includes(x.difficulty[i])).every(Boolean));}
export function emptyState(){return {version:VERSION,answers:Array(8).fill(null),notes:Array(8).fill(''),difficulty:Array(8).fill('')};}
export function scoreLines(result){return keys.map(k=>`${dimensions[k].name} (${k}): ${result.raw[k]} / ${potential[k]}. Beiträge: ${result.evidence[k].map(e=>`${e.id} (+${e.points})`).join(', ')||'keine'}.`);}
