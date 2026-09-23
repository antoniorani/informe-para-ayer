import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  countWords,
  normalize,
  validateTextResponse,
  validateJson
} from '../js/validators.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const course = JSON.parse(fs.readFileSync(path.join(root, 'data', 'case.json'), 'utf8'));

// Estructura web y versión del caso.
assert.equal(course.meta.version, '2.1');
for (const rel of ['index.html', 'assets/styles.css', 'js/app.js', 'js/validators.js', 'data/case.json']) {
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

// La interfaz debe soportar respuestas con Markdown sin ejecutar HTML del modelo.
const appSource = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const stylesSource = fs.readFileSync(path.join(root, 'assets/styles.css'), 'utf8');
assert.ok(appSource.includes('looksLikeMarkdown'), 'Falta la detección de Markdown en respuestas.');
assert.ok(appSource.includes('marked@15.0.12'), 'Falta el renderizador Markdown.');
assert.ok(appSource.includes('escapeHTML(text)'), 'El Markdown debe escapar HTML antes de renderizarse.');
assert.ok(appSource.includes('hardenMarkdownLinks'), 'Los enlaces Markdown deben endurecerse.');
assert.ok(stylesSource.includes('.markdown-body'), 'Faltan estilos para el Markdown renderizado.');
assert.ok(stylesSource.includes('.markdown-preview'), 'Falta la vista formateada de respuestas.');

// Bloque 1: línea base libre.
const b1 = course.blocks['1'];
assert.ok(b1.task && (b1.requiredDocs || []).length >= 5, 'Bloque 1: falta un encargo real y su expediente.');

// Bloque 2: las fuentes seleccionadas deben adjuntarse automáticamente al prompt ejecutado/copied.
const appSourceForSources = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
assert.ok(appSourceForSources.includes('block2SelectedDocIds'), 'Falta la recopilación automática de fuentes seleccionadas.');
assert.ok(appSourceForSources.includes('<FUENTES_SELECCIONADAS>'), 'El prompt del bloque 2 debe incluir las fuentes seleccionadas.');
assert.ok(appSourceForSources.includes('executionContent: executionPrompt'), 'El bloque 2 debe ejecutar/copiar el prompt enriquecido, no solo el texto del editor.');
assert.ok(appSourceForSources.includes('No tienes que copiar ni pegar ninguna fuente'), 'La interfaz debe explicar que las fuentes se adjuntan automáticamente.');

// Flujo flexible y validación viva del bloque 2.
const appSourceFlexible = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
assert.ok(appSourceFlexible.includes('data-b2-rubric'), 'La rúbrica del bloque 2 debe poder actualizarse en vivo.');
assert.ok(appSourceFlexible.includes('liveRubric'), 'Falta la actualización en tiempo real de la rúbrica del bloque 2.');
assert.ok(appSourceFlexible.includes('autoSources: block2SelectedDocIds().length > 0'), 'La rúbrica debe reconocer las fuentes adjuntadas automáticamente.');
assert.ok(appSourceFlexible.includes('function continueAnyway'), 'Debe existir una vía para continuar aunque un bloque no esté completo.');
for (const blockId of ['1', '2', '4', '5', '6']) {
  assert.ok(appSourceFlexible.includes(`data-continue-anyway="${blockId}"`), `Falta la salida flexible del bloque ${blockId}.`);
}

// Bloque 2: auditoría trazable y al menos una afirmación sin evidencia.
const b2 = course.blocks['2'];
assert.ok((b2.auditTopics || []).length >= 5, 'Bloque 2: faltan temas de auditoría.');
assert.ok(b2.auditTopics.some(item => (item.validDocs || []).length === 0), 'Bloque 2: debe existir una afirmación sin evidencia suficiente.');
assert.ok(b2.auditTopics.some(item => (item.validDocs || []).length > 0), 'Bloque 2: deben existir afirmaciones rastreables a fuentes.');

// El antiguo bloque RAG se ha eliminado.
assert.equal(course.blocks['3'], undefined, 'El bloque RAG ya no debe formar parte de la práctica.');

// Prompt injection: D9 debe contener la instrucción inocua y observable.
const b4 = course.blocks['4'];
const d9 = course.documents.find(doc => doc.id === 'D9');
assert.ok(d9.content.includes(b4.injectionSnippet), 'La inyección del bloque 3 visible no coincide con D9.');
assert.ok(b4.injectionSnippet.includes('DOCUMENTO D9: INSTRUCCIÓN EJECUTADA'), 'La inyección debe producir una señal fácil de observar.');

// Validación JSON.
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

// Consistencia documental.
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
  assert.ok((block.debrief || []).length >= 3, `Bloque ${blockId}: faltan preguntas de puesta en común.`);
  assert.ok(block.duration, `Bloque ${blockId}: falta duración orientativa.`);
  assert.ok(block.conceptReveal, `Bloque ${blockId}: falta el concepto revelado después de la experiencia.`);
}

const b6 = course.blocks['6'];
assert.equal(b6.updateDoc, 'D11');
assert.ok((b6.affectedChecks || []).length >= 4, 'Bloque final: faltan decisiones sobre qué cambia con la nueva evidencia.');
assert.ok(b6.recommendedDocs.includes('D11'), 'Bloque final: la actualización D11 debe ser evidencia principal.');
for (const docId of b6.neutralDocs || []) assert.ok(docs.has(docId), `Bloque final: neutralDoc inexistente ${docId}.`);

console.log('Validación completada: misión v2.1 coherente.');
