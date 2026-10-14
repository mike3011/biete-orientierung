// Reproducible, explicitly fictional homepage illustration. No visitor data.
import fs from 'node:fs';
import {evaluate} from './engine.mjs';
import {rosetteSvg} from './rosette.mjs';
const example=evaluate([0,1,2,3,0,1,2,3]);
const svg=rosetteSvg(example,{id:'example-rosette'}).replace('Deine sechs Handlungsrichtungen','Beispielauswertung mit fiktiven Antworten').replace('<g font-family=', '<style>.rosette-label{font-size:28px}.rosette-value{font-size:22px}</style><g font-family=');
fs.writeFileSync(new URL('../assets/kompass-beispiel.svg',import.meta.url),svg);
