# Operación: Informe para ayer

Práctica web estática para un curso de IA generativa y LLMs. Versión 2.1. La experiencia se plantea como **una única misión profesional**: producir un briefing, descubrir por qué la primera respuesta no basta, verificar evidencias, reaccionar a una fuente problemática, integrar una salida estructurada y actualizar la entrega cuando cambia la información.

Gemini 3.5 Flash-Lite está integrado para reducir fricción, pero la práctica mantiene el botón **Copiar** para usar otros modelos. No necesita backend.

## Enfoque pedagógico

La práctica sigue el principio **«primero el problema, después el concepto»**. El alumno no empieza leyendo una lista de técnicas. Primero intenta resolver el encargo y conserva esa respuesta como **Versión 0**. Los conceptos aparecen cuando hacen falta.

Los cinco momentos son:

1. **El encargo cae sobre tu mesa** — primera respuesta libre y Versión 0.
2. **¿Puedes defender lo que acaba de afirmar?** — auditoría de la propia respuesta, selección de fuentes y mejora del prompt. Las fuentes elegidas se adjuntan automáticamente al ejecutar o copiar la Versión 1. La rúbrica del apartado 2 se actualiza mientras se edita el prompt y reconoce ese contexto automático.
3. **Ha llegado un documento nuevo** — una fuente contiene una instrucción dirigida al modelo y se compara un prompt deliberadamente vulnerable con otro reforzado.
4. **El sistema no quiere literatura** — el resultado debe ser aceptado por un «sistema receptor» JSON.
5. **Dirección cambia una condición** — llega evidencia más reciente, hay que actualizar el contexto y comparar la entrega final con la Versión 0.

El cierre principal no es la puntuación: es la comparación **Versión 0 → Entrega final**.

## Arquitectura

- `index.html` — shell, navegación y diálogos.
- `assets/styles.css` — diseño y estados de feedback.
- `js/app.js` — misión, estado, puntuación, comparación y coordinación de Gemini.
- `js/validators.js` — validaciones deterministas de texto y JSON.
- `data/case.json` — documentos, actualización final y soluciones.
- `localStorage` — progreso y respuestas.
- `sessionStorage` — únicamente la **Clave de la práctica**.

## Gemini integrado y Clave de la práctica

Junto a cada prompt aparece **Ejecutar con Gemini**. La respuesta se coloca automáticamente en la caja correspondiente. La clave no se guarda en el repositorio ni en el progreso.

También puede compartirse un enlace temporal con esta forma:

```text
https://antoniorani.github.io/informe-para-ayer/#practice_key=CLAVE_TEMPORAL
```

La página guarda la clave en `sessionStorage` y limpia el fragmento de la URL.

Si se produce un límite temporal de cuota, la web reintenta con esperas crecientes. El botón **Copiar** permite continuar con otro LLM.

## Publicar en GitHub Pages

La aplicación no necesita compilación. Publica la rama `main` desde la raíz del repositorio en **Settings → Pages**.

## Ejecutar en local

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000`.

## Validación técnica

```bash
node tests/validate.mjs
```

Las pruebas comprueban la estructura de la misión v2.1, la auditoría de fuentes, la demo de prompt injection, la actualización D11 y los validadores JSON.

## Privacidad

Todo el expediente es ficticio. No deben introducirse datos personales, sensibles o documentación real de una organización en herramientas no autorizadas.


## Navegación flexible

Cada bloque mantiene su validación y puntuación, pero también ofrece **Continuar igualmente**. Esto permite avanzar aunque una respuesta sea incompleta, el LLM falle o el alumno no consiga superar todos los criterios. En ese caso se conserva una puntuación parcial con lo realizado hasta ese momento.
