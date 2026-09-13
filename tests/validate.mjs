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
  for (const fragment of block.fragments || []) {
    assert.ok(docs.has(fragment.doc), `Bloque ${blockId}: fragmento ${fragment.id} apunta a documento inexistente.`);
  }
  assert.ok((block.debrief || []).length >= 3, `Bloque ${blockId}: faltan preguntas de puesta en común.`);
}

const d9 = course.documents.find(doc => doc.id === 'D9');
assert.ok(d9.content.includes(course.blocks['4'].injectionSnippet), 'La inyección del bloque 4 no coincide con D9.');

// Prueba de puntuación de selección.
const selection = scoreSelections(
  course.blocks['3'].fragments.filter(fragment => fragment.relevant).map(fragment => fragment.id),
  course.blocks['3'].fragments
);
assert.equal(selection.precision, 1);
assert.equal(selection.recall, 1);

console.log('Validación completada: datos y utilidades coherentes.');
