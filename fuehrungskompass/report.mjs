import {chart,chartNote,drawRosettePdf,directionDescriptions} from './rosette.mjs';
import {situations,dimensions,patterns,methodText,VERSION,EMAIL,BOOKING} from './data.mjs';
import {evaluate,scoreLines,potential,keys} from './engine.mjs';
export function reportBlocks(state){
 const r=evaluate(state.answers),b=[];const add=(type,text)=>b.push({type,text});
 add('title','Dein Führungskompass');add('subtitle',`Persönliche Reflexion • Fassung ${VERSION}`);
 add('p','Acht Entscheidungen. Ein Anlass zum Weiterdenken. Dieses Ergebnis ist eine Momentaufnahme deiner gewählten Prioritäten, keine Eignungsbeurteilung und keine Empfehlung für oder gegen eine Führungsrolle.');
 add('chart','Deine sechs Handlungsrichtungen');
 add('small','Gold und *: nach der Rechenregel hervorgehoben, einschließlich Gleichständen. Alle sechs Richtungen bleiben sichtbar.');
 add('small',chartNote);
 add('p','Welche Richtung erkennst du wieder – und welche möchtest du bewusster nutzen?');
 add('page','Deine Handlungsrichtungen im Detail');
 add('h','Alle sechs Richtungen');
 add('p','Mit * hervorgehoben: '+r.highlighted.map(k=>dimensions[k].name).join(', ')+'. '+(r.boundaryTie?'Gleichstände an der Grenze der ersten beiden Plätze sind vollständig berücksichtigt.':'Diese Richtungen liegen nach der offengelegten Rechenregel auf den ersten beiden Plätzen.')+' Daraus folgt kein Vergleich mit anderen Menschen.');
 for(const k of keys){add('h',dimensions[k].name+(r.highlighted.includes(k)?' *':''));add('p',directionDescriptions[k]);add('p',`Antwortbelege: ${r.evidence[k].map(e=>e.id).join(', ')}. Vergleichswert: ${r.raw[k]} / ${potential[k]}.`);add('p',`Frage zum Weiterdenken: ${dimensions[k].question}`);add('p',`Ein mögliches Experiment: ${dimensions[k].idea}`);}
 add('h','Was davon passt zu dir?');add('p','Du darfst dich wiederfinden, widersprechen oder eine andere Deutung haben. Welche Aussage passt zu einer echten Erfahrung? Was fehlt? Vielleicht möchtest du eine kleine Gelegenheit zur Verantwortung ausprobieren und dir danach Rückmeldung holen. Du musst aus diesem Ergebnis keine Berufsentscheidung ableiten.');
 add('h','Muster in deinen Antworten');
 if(!r.patterns.length)add('p','Keines der zwei definierten Muster wurde ausgelöst. Das ist weder ein Vorteil noch ein Nachteil und bedeutet nicht, dass du keine wiederkehrenden Gewohnheiten hast.');
 for(const p of r.patterns){add('p',`${p.name}: ${p.text} Auslösende Antworten: ${p.matches.join(', ')}. ${p.question}`);}
 add('h','Deine Einschätzung der Schwierigkeit');
 const hard=state.difficulty.flatMap((d,i)=>d==='schwer'?[`${i+1}: ${situations[i].topic}`]:[]);
 add('p',hard.length?`Als schwer eingeschätzt: ${hard.join('; ')}. Das kann ein interessanter Gesprächsanlass sein und ist keine Aussage über mangelnde Fähigkeit.`:'Du hast keine Situation als schwer markiert. Nicht angegebene Einschätzungen werden nicht als leicht gewertet.');
 add('h','Wenn du darüber sprechen möchtest');
 add('p',`Ob bestätigt, neugierig oder verunsichert: Schreib Mike deine Gedanken und hänge diese PDF selbst an. Mike antwortet auf deine Nachricht mit PDF und gibt dir einen ersten kostenlosen Impuls. Ohne Bericht ist keine Einordnung deiner Auswertung möglich. E-Mail: ${EMAIL}.`);
 add('p','Eine vertiefende Begleitung ist kostenpflichtig und wird nur nach deiner ausdrücklichen Buchung oder Vereinbarung begonnen: 60 Minuten Gesprächszeit kosten 300 Euro netto, zuzüglich 57 Euro Umsatzsteuer, insgesamt 357 Euro brutto. Vor- und Nachbereitung werden nicht vom Zeitkontingent abgezogen. Gesprächszeit wird in Fünf-Minuten-Schritten zu deinen Gunsten abgerundet; Restzeit ist für weitere Gespräche nutzbar. Es gelten die verlinkten Buchungsbedingungen.');
 add('p',`Buchung: ${BOOKING}`);add('p','Bedingungen: https://biete-orientierung.de/buchungsbedingungen.html • Datenschutz: https://biete-orientierung.de/datenschutz.html#persoenliche-beratung');
 add('page','So ist diese Auswertung entstanden');methodText.forEach(t=>add('p',t));
 add('page','Deine vollständige Berechnung');scoreLines(r).forEach(t=>add('p',t));add('p','Summe deiner Rohpunkte: 24. Vergleich: Rohpunkte / Katalogsumme. Die Brüche sind Rechenwerte, keine Kompetenzanteile oder Prozentwerte. Die Katalogsummen werden aus der unten vollständig angegebenen Zuordnung berechnet.');
 add('h','Regeln für die Musterhinweise');for(const p of patterns)add('p',`${p.name}: mindestens ${p.threshold} gewählte Antworten aus ${p.options.join(', ')}. Bei dir: ${p.options.filter(id=>r.ids.includes(id)).length}.`);
 for(let i=0;i<situations.length;i++){const s=situations[i];add('page',`${i+1}. ${s.topic}`);add('h',s.title);add('p',s.text);add('p',s.question);add('p',`Deine Auswahl: ${i+1}${'ABCD'[state.answers[i]]}. Entscheidung empfunden als: ${state.difficulty[i]||'nicht angegeben'}.`);
 s.options.forEach((o,a)=>{add('h',`${i+1}${'ABCD'[a]} ${a===state.answers[i]?'[GEWÄHLT] ':''}${o.title}`);add('p',o.text);add('small',`Gewichtung: +2 ${dimensions[o.main].name} (${o.main}), +1 ${dimensions[o.secondary].name} (${o.secondary}); alle anderen Ausrichtungen: 0. Begründung: ${o.reason}`);});add('h','Deine Notiz');add('p',state.notes[i]||'Keine Notiz angegeben.');add('small',`Reflexionsfrage: ${s.reflection}`);}
 add('page','Transparenz und deine Daten');add('p','Dieser Bericht enthält alle acht Situationen, alle 32 Antwortmöglichkeiten, sämtliche Zuordnungen und Begründungen, deine Auswahl und deine Berechnung. Die Antwortkennungen verbinden Ergebnis und Frage eindeutig. Nicht ausgewählte Antworten tragen null Punkte zu deinem Ergebnis bei.');
 add('p','Die Berechnung und PDF-Erzeugung erfolgen im Browser. Es gibt keinen automatischen Versand deiner Antworten oder Notizen an Mike oder an eine KI. Eine Speicherung auf diesem Gerät erfolgt nur, wenn du sie bewusst einschaltest. Diese PDF bleibt auch nach dem Zurücksetzen des Checks erhalten, solange du die Datei nicht selbst löschst.');
 add('p','Wenn du den Bericht per E-Mail versendest, gibst du seinen gesamten Inhalt einschließlich deiner Notizen weiter. Bitte prüfe ihn vorher und entferne Angaben über andere Personen, die du nicht teilen möchtest. Die Bearbeitung zugesandter Unterlagen ist in der Datenschutzerklärung beschrieben.');
 add('p',`Anbieter: Nadine Rau und Mike Trepte GbR. Ansprechpartner: Mike Trepte, ${EMAIL}. Website: https://biete-orientierung.de/fuehrungskompass.html`);
 return b;
}
export async function createPdf(state,{PDFLib,fontkit,fontBytes}={}){
 const pdf=await PDFLib.PDFDocument.create();pdf.registerFontkit(fontkit);
 const font=await pdf.embedFont(fontBytes,{subset:true});const supported=new Set(font.getCharacterSet());let replaced=0;
 const safe=s=>Array.from(s.normalize('NFC')).map(c=>c==='\n'||supported.has(c.codePointAt(0))?c:(replaced++,`[U+${c.codePointAt(0).toString(16).toUpperCase()}]`)).join('').replace(/\t/g,'    ');
 const navy=PDFLib.rgb(.063,.169,.251),gold=PDFLib.rgb(.50,.38,.18),muted=PDFLib.rgb(.28,.34,.37);let page,y;const width=595.28,height=841.89,margin=48,contentWidth=width-2*margin;
 const fresh=()=>{page=pdf.addPage([width,height]);y=height-58;page.drawText('BIETE ORIENTIERUNG  /  FÜHRUNGSKOMPASS',{x:margin,y,size:9,font,color:gold});y-=35;};
 const wrap=(text,size)=>{const out=[];for(const paragraph of text.split('\n')){if(!paragraph){out.push('');continue;}let line='';for(const word of paragraph.split(/\s+/)){if(font.widthOfTextAtSize((line?line+' ':'')+word,size)<=contentWidth){line+=(line?' ':'')+word;continue;}if(line){out.push(line);line='';}let piece='';for(const c of word){if(font.widthOfTextAtSize(piece+c,size)>contentWidth){out.push(piece);piece='';}piece+=c;}line=piece;}out.push(line);}return out;};
 fresh();for(const block of reportBlocks(state)){if(block.type==='chart'){const h=contentWidth*chart.height/chart.width;if(y-h<65)fresh();drawRosettePdf(page,evaluate(state.answers),{font,PDFLib,x:margin,top:y,width:contentWidth});y-=h+12;continue;}if(block.type==='page'){fresh();}const heading=['title','page','h'].includes(block.type),size=block.type==='title'?27:block.type==='page'?22:block.type==='h'?12:block.type==='small'?9:10.5;const lines=wrap(safe(block.text),size),leading=size*1.38;
 if(y<65+(heading?lines.length*leading+60:Math.min(lines.length,2)*leading))fresh();if(heading)y-=5;
 for(const line of lines){if(y<65)fresh();page.drawText(line,{x:margin,y,size,font,color:heading?navy:block.type==='subtitle'?gold:muted});y-=leading;}y-=heading?6:7;
 }
 if(replaced){fresh();for(const line of wrap('Hinweis zur Schrift: Einzelne Zeichen sind in der eingebetteten Schrift nicht verfügbar. Sie sind verlustfrei als Unicode-Codepunkte [U+...] angegeben. Im zusätzlichen JSON-Download bleiben die Originalzeichen unverändert.',10.5)){page.drawText(line,{x:margin,y,size:10.5,font,color:muted});y-=16;}}
 const pages=pdf.getPages();pages.forEach((p,i)=>{p.drawLine({start:{x:margin,y:43},end:{x:width-margin,y:43},thickness:.5,color:gold});p.drawText(`Fassung 1.0.0 | Persönliche Reflexion | ${i+1} / ${pages.length}`,{x:margin,y:28,font,size:8,color:muted});});
 pdf.setTitle('Dein Führungskompass – vollständige Auswertung');pdf.setAuthor('Mike Trepte · Biete Orientierung');pdf.setSubject('Reflexionsangebot mit vollständiger Zuordnung und Berechnung');return pdf.save();
}
