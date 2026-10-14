import {dimensions,situations} from './data.mjs';
import {keys,potential} from './engine.mjs';

// One shared geometry for screen, print and PDF. Never rescale to an individual's peak.
export const chart = {width:720,height:640,cx:360,cy:300,radius:190,max:.9,rings:[.3,.6,.9]};
export const reachableMax=Object.fromEntries(keys.map(k=>[k,situations.reduce((sum,s)=>sum+Math.max(...s.options.map(o=>2*(o.main===k)+(o.secondary===k))),0)]));
export const chartLegend = ['Ausgefüllter Punkt: Deine Ausprägung aus den gewählten Antworten.','Goldener Kreisring: Mathematisch erreichbares Maximum dieser Orientierung.','Skala: Einheitlicher linearer Vergleichsmaßstab von 0 bis 0,9.'];
export const chartNote = 'Die goldenen Kreisringe zeigen die je Orientierung erreichbaren Maxima. Sie sind nicht gleichzeitig erreichbar und weder Idealwerte noch Empfehlungen. Die Größe einer Ausprägung bewertet keine Führungskompetenz.';
export const calculationNote = 'Die Beschriftung zeigt deine Rohpunkte und das je Orientierung erreichbare Maximum. Für die Position bleibt die Rechnung Rohpunkte / Katalogsumme unverändert. Beispiel Beziehung & Dialog: 5 von 11 erreichbaren Punkten ergeben 5 / 14 = 0,357. Die 14 ist die Katalogsumme, nicht das erreichbare Maximum. Die Grafik teilt diesen Vergleichswert durch 0,9, um ihn auf der festen Skala zu positionieren.';
export const directionDescriptions = {
 DIA:'Diese Richtung steht für gemeinsames Klären und Einbeziehen. Das kann helfen, unterschiedliche Sichtweisen hörbar zu machen.',
 KLA:'Diese Richtung steht für ausdrückliche Erwartungen, Grenzen und Vereinbarungen. Sie können Orientierung geben.',
 ZUT:'Diese Richtung steht dafür, anderen Verantwortung und eigene Erfahrungen zu ermöglichen. Das kann Entwicklung unterstützen.',
 FUE:'Diese Richtung steht für Entlastung und Rückhalt für Menschen. Das kann Sicherheit in anspruchsvollen Situationen schaffen.',
 MUT:'Diese Richtung steht für Bewegung, auch wenn noch Fragen offen sind. Das kann helfen, aus dem Abwägen ins Handeln zu kommen.',
 SOR:'Diese Richtung steht für Vorbereitung, nachvollziehbare Kriterien und Ursachenklärung. Das kann Qualität und Verlässlichkeit unterstützen.'
};
export function rosetteModel(result){
 return keys.map((key,i)=>{const angle=(-90+i*60)*Math.PI/180,value=result.raw[key]/potential[key],maxValue=reachableMax[key]/potential[key];
  if(!Number.isFinite(value)||value<0||value>chart.max||maxValue>chart.max)throw Error('Rosettenwert außerhalb der festen Skala');
  const point=r=>({x:chart.cx+Math.cos(angle)*r,y:chart.cy+Math.sin(angle)*r});
  const name=dimensions[key].name.split(' & ');
  return {key,name:dimensions[key].name,lines:[name[0],'& '+name[1]],raw:result.raw[key],denominator:potential[key],value,maxRaw:reachableMax[key],maxValue,maxPoint:point(chart.radius*maxValue/chart.max),highlighted:result.highlighted.includes(key),point:point(chart.radius*value/chart.max),end:point(chart.radius),label:{x:i===0||i===3?chart.cx:i<3?615:105,y:point(248).y}};
 });
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function rosetteSvg(result,{id='compass-rosette',interactive=false}={}){
 const m=rosetteModel(result),{cx,cy,radius,width,height}=chart;
 const text=(x,y,t,size=17,color='#102b40')=>`<text class="${size===18?'rosette-label':size===15?'rosette-value':'rosette-tick'}" x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${color}">${esc(t)}</text>`;
 return `<svg class="rosette-svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}-title ${id}-desc" xmlns="http://www.w3.org/2000/svg"><title id="${id}-title">Deine sechs Handlungsrichtungen</title><desc id="${id}-desc">${esc(chartNote)} ${m.map(d=>esc(`${d.name}: ${d.raw} von ${d.maxRaw} erreichbaren Punkten; Vergleichswert ${d.raw} / ${d.denominator}${d.highlighted?', hervorgehoben':''}.`)).join(' ')}</desc><g font-family="Arial, sans-serif">${chart.rings.map(v=>`<circle cx="${cx}" cy="${cy}" r="${radius*v/chart.max}" fill="none" stroke="#d5dcd9" stroke-width="1"/>`).join('')}${m.map(d=>`<line x1="${cx}" y1="${cy}" x2="${d.end.x}" y2="${d.end.y}" stroke="#d5dcd9"/>`).join('')}${chart.rings.map(v=>text(cx+radius*v/chart.max/Math.sqrt(2),cy-radius*v/chart.max/Math.sqrt(2)-5,String(v).replace('.',','),12,'#586c71')).join('')}${text(cx-13,cy+18,'0',12,'#586c71')}<path d="M ${m.map(d=>`${d.point.x} ${d.point.y}`).join(' L ')} Z" fill="none" stroke="#47696b" stroke-width="2"/>${m.map(d=>{const color=d.highlighted?'#967332':'#355f64';const inside=`<title>${esc(d.name)}: ${d.raw} von ${d.maxRaw} erreichbaren Punkten; Vergleichswert ${d.raw} / ${d.denominator}${d.highlighted?' · hervorgehoben':''}</title><line x1="${cx}" y1="${cy}" x2="${d.point.x}" y2="${d.point.y}" stroke="${color}" stroke-width="4"/><circle cx="${d.point.x}" cy="${d.point.y}" r="6" fill="${color}" stroke="#fff" stroke-width="2"/>${text(d.label.x,d.label.y-18,d.lines[0],18,color)}${text(d.label.x,d.label.y+12,d.lines[1],18,color)}${text(d.label.x,d.label.y+40,`${d.raw} von ${d.maxRaw} erreichbaren`,15,color)}${text(d.label.x,d.label.y+64,`Punkten${d.highlighted?' *':''}`,15,color)}`;return interactive?`<a href="#direction-${d.key}" data-direction="${d.key}" aria-label="${esc(d.name)}: Erklärung öffnen">${inside}</a>`:`<g>${inside}</g>`;}).join('')}${m.map(d=>`<circle class="maximum-marker" cx="${d.maxPoint.x}" cy="${d.maxPoint.y}" r="10" fill="none" stroke="#967332" stroke-width="2.5"><title>${esc(d.name)}: Maximum ${d.maxRaw} / ${d.denominator}</title></circle>`).join('')}</g></svg>`;
}

export function drawRosettePdf(page,result,{font,PDFLib,x,top,width}){
 const scale=width/chart.width,px=v=>x+v*scale,py=v=>top-v*scale;
 const rgb=h=>PDFLib.rgb(...h.match(/\w\w/g).map(c=>parseInt(c,16)/255));
 const pale=rgb('d5dcd9'),muted=rgb('586c71'),teal=rgb('47696b');
 const line=(a,b,color,thickness=1)=>page.drawLine({start:{x:px(a.x),y:py(a.y)},end:{x:px(b.x),y:py(b.y)},color,thickness:thickness*scale});
 const txt=(x,y,text,size,color)=>page.drawText(text,{x:px(x)-font.widthOfTextAtSize(text,size*scale)/2,y:py(y),size:size*scale,font,color});
 const center={x:chart.cx,y:chart.cy},m=rosetteModel(result);
 for(const v of chart.rings)page.drawCircle({x:px(chart.cx),y:py(chart.cy),size:chart.radius*v/chart.max*scale,borderColor:pale,borderWidth:scale});
 for(const d of m)line(center,d.end,pale);
 for(const v of chart.rings)txt(chart.cx+chart.radius*v/chart.max/Math.sqrt(2),chart.cy-chart.radius*v/chart.max/Math.sqrt(2)-5,String(v).replace('.',','),12,muted);
 txt(chart.cx-13,chart.cy+18,'0',12,muted);
 m.forEach((d,i)=>line(d.point,m[(i+1)%m.length].point,teal,2));
 for(const d of m){const color=rgb(d.highlighted?'967332':'355f64');line(center,d.point,color,4);page.drawCircle({x:px(d.point.x),y:py(d.point.y),size:6*scale,color,borderColor:PDFLib.rgb(1,1,1),borderWidth:2*scale});txt(d.label.x,d.label.y-18,d.lines[0],18,color);txt(d.label.x,d.label.y+12,d.lines[1],18,color);txt(d.label.x,d.label.y+40,`${d.raw} von ${d.maxRaw} erreichbaren`,15,color);txt(d.label.x,d.label.y+64,`Punkten${d.highlighted?' *':''}`,15,color);}
 for(const d of m)page.drawCircle({x:px(d.maxPoint.x),y:py(d.maxPoint.y),size:10*scale,borderColor:rgb('967332'),borderWidth:2.5*scale});
}
