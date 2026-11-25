import fs from 'node:fs';
import assert from 'node:assert/strict';
import {tools} from '../dist/js/data.js';
const bank=JSON.parse(fs.readFileSync(new URL('../dist/js/questions.json',import.meta.url)));
assert.equal(bank.length,243);assert.equal(new Set(bank.map(q=>q.subject)).size,8);
assert.equal(new Set(bank.map(q=>q.question)).size,bank.length);
for(const q of bank){assert(q.question&&q.topic&&q.explanation);assert.equal(new Set(q.options).size,4);assert(q.options.includes(q.answer))}
const original=fs.readFileSync(new URL('../dist/modules/index.html',import.meta.url),'utf8');
for(const [id]of tools){const route=({quizOriginal:'quiz',cartoesOriginal:'cartoes'})[id]||id;assert(original.includes('id="'+route+'"'),route)}
for(const route of [...original.matchAll(/<section id="([^"]+)" class="view(?: active)?"/g)].map(m=>m[1]).filter(x=>x!=='inicio'))assert(tools.some(t=>t[0]===route),route);
console.log('OK: 243 questões válidas, 8 matérias, rotas originais preservadas.');
