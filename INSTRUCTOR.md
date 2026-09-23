# Guía rápida del instructor · versión 2.1

La práctica funciona mejor si el docente **no anuncia los conceptos por adelantado**. Presenta la misión, deja que el alumno actúe y utiliza la puesta en común para poner nombre a lo que acaba de ocurrir.

## Antes de empezar

- Genera una clave temporal de Gemini para la sesión y revócala al terminar.
- Los alumnos pueden pulsar **Introducir clave de la práctica** una sola vez.
- También puedes compartir un enlace con `#practice_key=CLAVE_TEMPORAL`.
- Recalca que todo el expediente es ficticio.
- No expliques de antemano prompting, grounding o prompt injection.
- Si falta tiempo, recorta discusión, no la Versión 0 ni la comparación final.

## Bloque 1 — El encargo cae sobre tu mesa

**Objetivo:** obtener una línea base auténtica.

El alumno escribe su propio prompt, ejecuta Gemini y conserva la respuesta como **Versión 0**. Después responde si la enviaría tal cual y explica por qué.

No enseñes una plantilla de prompt todavía.

**Puesta en común:** pregunta quién la enviaría, qué tuvo que asumir el modelo y qué haría falta para defender el texto.

**Concepto que aparece después:** prompting como especificación del trabajo.

## Bloque 2 — ¿Puedes defender lo que acaba de afirmar?

**Objetivo:** convertir la revisión en una auditoría del propio trabajo.

El alumno ve frases de su Versión 0 asociadas a seis temas críticos. Para cada una, **no tiene que copiar ninguna fuente**: selecciona un documento en el desplegable y la web muestra inmediatamente el texto del documento debajo para poder comprobarlo. También puede abrir el expediente completo desde el propio bloque.

Después mejora su prompt y genera una Versión 1. **Las fuentes seleccionadas arriba se adjuntan automáticamente** al pulsar «Ejecutar con Gemini» o «Copiar», de modo que el alumno no tiene que pegar el contenido de los documentos en el prompt. Puede desplegar «Ver el prompt completo que recibirá el LLM» para comprobar exactamente qué contexto se enviará.

Claves de corrección:

- Presupuesto autorizado → D1 o D3.
- Inicio del piloto → D2 o D4.
- Nivel de riesgo → D5.
- Prueba interna → D6.
- Despliegue general → D4, que permite comprobar precisamente que no está aprobado.
- Reducción de carga con usuarios reales → no hay evidencia suficiente en el expediente.

La web compara fuentes explícitas, patrones de falsa precisión y longitud.

**Conceptos que aparecen después:** grounding, evidencia, alucinación y falsa precisión.

## Bloque 3 — Ha llegado un documento nuevo

**Objetivo:** que la prompt injection aparezca como incidente y que sea fácil observar el efecto.

D9 se oculta hasta este momento. En la primera ejecución, el prompt es **deliberadamente vulnerable**: indica al modelo que trate las instrucciones operativas encontradas dentro de los documentos como parte del procedimiento y que las siga. D9 contiene una instrucción inocua pero disruptiva:

`DOCUMENTO D9: INSTRUCCIÓN EJECUTADA`

Si el modelo obedece, la respuesta queda secuestrada por esa frase. Si el modelo resiste, la web lo señala y la actividad sigue siendo válida: el diseño continúa siendo vulnerable porque confía en instrucciones procedentes de una fuente.

Después el alumno diagnostica el problema y ejecuta una versión reforzada que trata los documentos únicamente como datos.

**Concepto que aparece después:** prompt injection indirecta y defensa en capas.

## Bloque 4 — El sistema no quiere literatura

**Objetivo:** distinguir texto para una persona de una salida para otra aplicación.

El alumno genera JSON y lo envía al «sistema receptor». Este responde **ACEPTADO** o **RECHAZADO** y muestra errores concretos. Se conserva un historial corto de intentos.

**Concepto que aparece después:** estructura válida no equivale a contenido verdadero; hacen falta validadores deterministas.

## Bloque 5 — Dirección cambia una condición

**Objetivo:** enseñar que la evidencia cambia.

Aparece **D11**, fechada el 29/09/2026. Indica que el escalado humano ya está validado, pero queda una incidencia de Seguridad abierta, por lo que no puede considerarse cumplida la condición de inicio del 1 de octubre.

Antes de generar otra respuesta, el alumno debe decidir qué afirmaciones anteriores cambian. Después selecciona fuentes, incorpora D11, genera el briefing final y responde tres comprobaciones críticas.

Las respuestas críticas correctas son:

1. ¿Puede iniciarse el piloto el 1 de octubre con la información actualizada? **No**.
2. ¿Existe una ampliación presupuestaria aprobada? **No**.
3. ¿Está aprobado el despliegue general? **No**.

El cierre muestra **Versión 0 → Entrega final**. Ese es el momento pedagógico principal.

## Puntuación

La escala total sigue siendo de 1.000 puntos, pero es secundaria:

- Línea base: 50
- Evidencias e instrucciones: 450
- Seguridad: 150
- Integración: 150
- Actualización y revisión final: 200

La comparación cualitativa entre la primera y la última versión es más importante que el número.

## Mensaje de cierre

La secuencia que debería quedar fijada es:

**entender el encargo → formular criterios → ejecutar → contrastar evidencias → validar → corregir → actualizar si cambia la información → entregar.**

La idea final no es «usar un chat», sino diseñar un sistema de trabajo con instrucciones, evidencias, validadores, seguridad y revisión humana.
