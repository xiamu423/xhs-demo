import {rolldown} from 'rolldown';
import {readFile,rm} from 'node:fs/promises';
import assert from 'node:assert/strict';
const bundle=await rolldown({input:'src/scene-content.ts'});
const out='/private/tmp/xhs-scene-validation.mjs';
await bundle.write({file:out,format:'esm'});
const {sceneCards,sceneExtras,scenes,respondToScene}=await import(out+'?t='+Date.now());
const corpus=JSON.parse(await readFile('src/scene-data.json','utf8'));
let refs=0;
function check(value,noteId){
 if(Array.isArray(value)){value.forEach(x=>check(x,noteId));return}
 if(!value||typeof value!=='object')return;
 for(const [k,v] of Object.entries(value)){
  if(['refs','nameRefs','answerRefs','questionRef'].includes(k))for(const id of typeof v==='string'?[v]:v){assert(corpus.sources[id],`Missing ${id}`);assert.equal(corpus.sources[id].noteId,noteId,`Wrong note: ${id}`);assert(!corpus.sources[id].ai,`AI evidence: ${id}`);refs++;}
  else check(v,noteId);
 }
}
for(const card of sceneCards){
 assert(corpus.notes.some(n=>n.id===card.noteId));assert.equal(new Set(card.candidates.map(c=>c.id)).size,card.candidates.length);check(card,card.noteId);check(sceneExtras[card.noteId],card.noteId);
 for(const q of sceneExtras[card.noteId].questions||[])if(q.candidateId)assert(card.candidates.some(c=>c.id===q.candidateId));
}
for(const note of corpus.notes){
 for(const row of note.comments)if(row.parent)assert(corpus.sources[row.parent],`Missing parent ${row.parent}`);
 for(const photo of note.images)await readFile('public'+photo);
}
for(const scene of scenes.filter(s=>s.id!=='beauty')){
 assert.equal(scene.noteIds.length,2);
 for(const q of scene.followups){const r=respondToScene(scene,q);assert(r.answer&&r.refs.length);for(const id of r.refs)assert(corpus.sources[id]&&!corpus.sources[id].ai);if(r.candidateId)assert(sceneCards.find(c=>c.noteId===r.noteId).candidates.some(c=>c.id===r.candidateId));}
}
await rm(out);
console.log(`Validated ${sceneCards.length} cards, ${sceneCards.reduce((n,c)=>n+c.candidates.length,0)} plans, ${refs} citations, comment parents and 9 followups.`);
