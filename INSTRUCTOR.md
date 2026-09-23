# Guía rápida del instructor · versión 2.0

La práctica funciona mejor si el docente **no anuncia los conceptos por adelantado**. Presenta la misión, deja que el alumno actúe y utiliza la puesta en común para poner nombre a lo que acaba de ocurrir.

## Antes de empezar

- Genera una clave temporal de Gemini para la sesión y revócala al terminar.
- Los alumnos pueden pulsar **Introducir clave de la práctica** una sola vez.
- También puedes compartir un enlace con `#practice_key=CLAVE_TEMPORAL`.
- Recalca que todo el expediente es ficticio.
- No expliques de antemano prompting, grounding, RAG o prompt injection.
- Si falta tiempo, recorta discusión, no la Versión 0 ni la comparación final.

## Bloque 1 — El encargo cae sobre tu mesa

**Objetivo:** obtener una línea base auténtica.

El alumno escribe su propio prompt, ejecuta Gemini y conserva la respuesta como **Versión 0**. Después responde si la enviaría tal cual y explica por qué.

No enseñes una plantilla de prompt todavía.

**Puesta en común:** pregunta quién la enviaría, qué tuvo que asumir el modelo y qué haría falta para defender el texto.

**Concepto que aparece después:** prompting como especificación del trabajo.

## Bloque 2 — ¿Puedes defender lo que acaba de afirmar?

**Objetivo:** convertir la revisión en una auditoría del propio trabajo.

El alumno ve frases de su Versión 0 asociadas a seis temas críticos y debe vincularlas a una fuente o declarar que no puede respaldarlas. Después mejora su prompt y genera una Versión 1.

La web compara fuentes explícitas, patrones de falsa precisión y longitud.

**Conceptos que aparecen después:** grounding, evidencia, alucinación y falsa precisión.

## Bloque 3 — No puedes leer 47 PDFs

**Objetivo:** entender RAG como una decisión de contexto.

Hay 36 fragmentos y un límite de **6**. Primero el alumno selecciona manualmente y ejecuta. Solo después puede activar el ranking automático y hacer un segundo intento cambiando el contexto.

Los seis fragmentos nucleares preparados son: **f1, f2, f3, f5, f10 y f11**.

**Concepto que aparece después:** recuperación + contexto + generación. Insiste en que similitud no equivale a relevancia.

## Bloque 4 — Ha llegado un documento nuevo

**Objetivo:** que la prompt injection aparezca como incidente.

D9 se oculta hasta este momento. El alumno la añade, ejecuta y compara con la respuesta anterior. Solo después de elegir una hipótesis se revela la instrucción incrustada.

No penalices si Gemini resiste el primer intento.

**Concepto que aparece después:** prompt injection indirecta y defensa en capas.

## Bloque 5 — El sistema no quiere literatura

**Objetivo:** distinguir texto para una persona de una salida para otra aplicación.

El alumno genera JSON y lo envía al «sistema receptor». Este responde **ACEPTADO** o **RECHAZADO** y muestra errores concretos. Se conserva un historial corto de intentos.

**Concepto que aparece después:** estructura válida no equivale a contenido verdadero; hacen falta validadores deterministas.

## Bloque 6 — Dirección cambia una condición

**Objetivo:** enseñar que la evidencia cambia.

Aparece **D11**, fechada el 29/09/2026. Indica que el escalado humano ya está validado, pero queda una incidencia de Seguridad abierta, por lo que no puede considerarse cumplida la condición de inicio del 1 de octubre.

Antes de generar otra respuesta, el alumno debe decidir qué afirmaciones anteriores cambian. Después selecciona fuentes, incorpora D11, genera el briefing final y responde tres comprobaciones críticas.

Las respuestas críticas correctas son:

1. ¿Puede iniciarse el piloto el 1 de octubre con la información actualizada? **No**.
2. ¿Existe una ampliación presupuestaria aprobada? **No**.
3. ¿Está aprobado el despliegue general? **No**.

El cierre muestra **Versión 0 → Entrega final**. Ese es el momento pedagógico principal.

## Puntuación

La escala sigue siendo de 1.000 puntos, pero es secundaria:

- Línea base: 50
- Evidencias e instrucciones: 400
- Contexto: 200
- Seguridad: 100
- Integración: 100
- Actualización y revisión final: 150

La comparación cualitativa entre la primera y la última versión es más importante que el número.

## Mensaje de cierre

La secuencia que debería quedar fijada es:

**entender el encargo → formular criterios → seleccionar contexto → ejecutar → contrastar evidencias → validar → corregir → actualizar si cambia la información → entregar.**

La idea final no es «usar un chat», sino diseñar un sistema de trabajo con instrucciones, evidencias, recuperación, modelo, validadores, seguridad y revisión humana.
