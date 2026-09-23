import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  countWords,
  normalize,
  validateTextResponse,
  validateJson,
  scoreSelections
} from '../js/validators.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const course = JSON.parse(fs.readFileSync(path.join(root, 'data', 'case.json'), 'utf8'));

// Estructura web y versión del caso.
assert.equal(course.meta.version, '2.0');
for (const rel of ['index.html', 'assets/styles.css', 'js/app.js', 'js/validators.js', 'js/semantic.js', 'data/case.json']) {
  assert.ok(fs.existsSync(path.join(root, rel)), `Falta el recurso ${rel}.`);
}

// Pruebas de utilidades.
assert.equal(countWords(' uno  dos\n tres '), 3);
assert.equal(normalize('Información   ÚTIL'), 'informacion util');
const textCheck = validateTextResponse('Resumen: correcto. Fuentes: [D1]', {
  required: true,
  maxWords: 10,
  headings: ['Resumen', 'Fuentes'],
  citations: true
});
assert.ok(textCheck.results.every(item => item.ok));

// Bloque 1: debe producir una línea base libre, no un constructor de piezas.
const b1 = course.blocks['1'];
assert.ok(b1.task && (b1.requiredDocs || []).length >= 5, 'Bloque 1: falta un encargo real y su expediente.');

// Bloque 2: auditoría de la respuesta propia con temas rastreables.
const b2 = course.blocks['2'];
assert.ok((b2.auditTopics || []).length >= 5, 'Bloque 2: faltan temas de auditoría.');
assert.ok(b2.auditTopics.some(item => (item.validDocs || []).length === 0), 'Bloque 2: debe existir al menos una afirmación sin evidencia suficiente.');
assert.ok(b2.auditTopics.some(item => (item.validDocs || []).length > 0), 'Bloque 2: deben existir afirmaciones rastreables a fuentes.');

// Bloque 3: recuperación no trivial y límite estricto de contexto.
const b3 = course.blocks['3'];
assert.ok(b3.fragments.length >= 30 && b3.fragments.length <= 40, 'Bloque 3: debe simular un expediente grande con 30–40 fragmentos.');
assert.equal(b3.maxFragments, 6, 'Bloque 3: el límite pedagógico debe ser de 6 fragmentos.');
assert.equal(b3.fragments.filter(fragment => fragment.relevant).length, 6, 'Bloque 3: debe haber seis fragmentos nucleares para la decisión.');

// Validación JSON: contenido correcto, tipos correctos, sin campos extra.
const b5 = course.blocks['5'];
let jsonCheck = validateJson(JSON.stringify(b5.expected), b5.expected, b5.schema);
assert.ok(jsonCheck.results.every(item => item.ok));

jsonCheck = validateJson(
  JSON.stringify({ ...b5.expected, presupuesto_eur: String(b5.expected.presupuesto_eur) }),
  b5.expected,
  b5.schema
);
assert.ok(jsonCheck.results.some(item => !item.ok), 'Un número enviado como string debe fallar.');

jsonCheck = validateJson(
  JSON.stringify({ ...b5.expected, fecha_inicio: '2026-02-31' }),
  b5.expected,
  b5.schema
);
assert.ok(jsonCheck.results.some(item => !item.ok), 'Una fecha imposible debe fallar.');

// Consistencia del expediente.
const docIds = course.documents.map(doc => doc.id);
assert.equal(new Set(docIds).size, docIds.length, 'Hay IDs de documentos duplicados.');
const docs = new Set(docIds);
for (const [blockId, block] of Object.entries(course.blocks)) {
  for (const key of ['requiredDocs', 'recommendedDocs']) {
    for (const docId of block[key] || []) {
      assert.ok(docs.has(docId), `Bloque ${blockId}: documento inexistente ${docId}.`);
    }
  }
  if (block.sourceDoc) assert.ok(docs.has(block.sourceDoc), `Bloque ${blockId}: sourceDoc inexistente.`);
  if (block.updateDoc) assert.ok(docs.has(block.updateDoc), `Bloque ${blockId}: updateDoc inexistente.`);
  for (const fragment of block.fragments || []) {
    assert.ok(docs.has(fragment.doc), `Bloque ${blockId}: fragmento ${fragment.id} apunta a documento inexistente.`);
  }
  assert.ok((block.debrief || []).length >= 3, `Bloque ${blockId}: faltan preguntas de puesta en común.`);
  assert.ok(block.duration, `Bloque ${blockId}: falta duración orientativa.`);
  assert.ok(block.conceptReveal, `Bloque ${blockId}: falta el concepto revelado después de la experiencia.`);
}

const b4 = course.blocks['4'];
const d9 = course.documents.find(doc => doc.id === 'D9');
assert.ok(d9.content.includes(b4.injectionSnippet), 'La inyección del bloque 4 no coincide con D9.');

const b6 = course.blocks['6'];
assert.equal(b6.updateDoc, 'D11');
assert.ok((b6.affectedChecks || []).length >= 4, 'Bloque 6: faltan decisiones sobre qué cambia con la nueva evidencia.');
assert.ok(b6.recommendedDocs.includes('D11'), 'Bloque 6: la actualización final debe ser evidencia principal.');
for (const docId of b6.neutralDocs || []) assert.ok(docs.has(docId), `Bloque 6: neutralDoc inexistente ${docId}.`);

// Prueba de puntuación de selección.
const selection = scoreSelections(
  b3.fragments.filter(fragment => fragment.relevant).map(fragment => fragment.id),
  b3.fragments
);
assert.equal(selection.precision, 1);
assert.equal(selection.recall, 1);

console.log('Validación completada: misión v2, datos y utilidades coherentes.');
