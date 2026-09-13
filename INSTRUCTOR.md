# Guía rápida del instructor

Esta práctica está pensada para alternar **trabajo autónomo** y **puesta en común**. El flujo recomendado es: presentar el reto en 1–2 minutos, dejar trabajar al grupo, parar cuando lleguen a la pantalla de debrief y extraer el concepto a partir de lo que realmente les haya ocurrido con sus modelos.

## Antes de empezar

- Pide a todos que abran un LLM al que tengan acceso.
- Recalca que el expediente es ficticio y que no deben utilizar datos reales o sensibles.
- No expliques la “trampa” de cada bloque antes de tiempo.
- Las diferencias entre ChatGPT, Copilot, Gemini, Claude u otros modelos son material de discusión, no un problema de la práctica.

## Bloque 1 — El becario digital

**Idea a fijar:** un prompt es una especificación del trabajo, no una fórmula mágica. Objetivo, audiencia, fuentes, límites y formato hacen el resultado más evaluable.

Preguntas de puesta en común:

- ¿Qué cambió realmente entre la primera y la segunda respuesta?
- ¿Cuál de las instrucciones tuvo más impacto?
- ¿Un prompt muy largo es necesariamente mejor?
- ¿Qué parte debe estar en el prompt y qué parte fuera del LLM?

## Bloque 2 — Muy convincente. Muy falso.

**Soluciones:**

- 185.000 € autorizados → respaldada.
- Despliegue general el 15/01/2027 → contradice las fuentes.
- 5 % de respuestas incorrectas/no respaldadas → respaldada.
- Reducción del 37 % de carga → no aparece en las fuentes.
- Riesgo moderado si se aplican controles → respaldada.
- 95.000 € ya autorizados → contradice las fuentes.
- Esperar 4,2/5 en usuarios reales → inferencia, no hecho confirmado.

**Idea a fijar:** fluidez, seguridad verbal y presencia de citas no garantizan que la afirmación esté respaldada.

## Bloque 3 — No puedes leer 47 PDFs

**Fragmentos relevantes preparados en el caso:** f1, f2, f3, f5, f6, f10 y f11.

**Idea a fijar:** RAG, simplificado, es recuperar contexto útil y dárselo al generador. Una mala recuperación puede producir una mala respuesta aunque el LLM sea bueno.

El botón de recuperación local es opcional. Si el modelo de embeddings no carga, la web cae a un ranking léxico.

## Bloque 4 — El documento rebelde

La instrucción maliciosa está en D9. La opción correcta es la **prompt injection indirecta**.

**Idea a fijar:** el contenido recuperado es dato no confiable desde el punto de vista de instrucciones. Mejorar el prompt ayuda, pero la seguridad real necesita controles en capas.

## Bloque 5 — Quiero datos, no literatura

El JSON esperado es:

```json
{
  "referencia": "ORI-2026-014",
  "proyecto": "ORIÓN",
  "proveedor": "Nébula Digital S.L.",
  "fecha_inicio": "2026-10-01",
  "fecha_cierre": "2026-12-15",
  "presupuesto_eur": 185000,
  "estado": "piloto autorizado con condiciones",
  "responsable": "Marta Salcedo"
}
```

**Idea a fijar:** JSON válido no equivale a información verdadera. Hay validación sintáctica y validación semántica/de negocio.

## Bloque 6 — El jefe vuelve a llamar

Fuentes recomendadas: D1–D6. D7 puede servir como contexto secundario, D8 es distractor y D9 contiene la inyección.

Las tres comprobaciones críticas tienen respuesta **No**:

1. No está aprobado el despliegue general.
2. No hay ampliación presupuestaria aprobada.
3. Un 4,2/5 en prueba interna no permite extrapolar el comportamiento con usuarios reales.

**Idea a fijar:** una aplicación profesional con LLM no es “un chat”; combina instrucciones, fuentes, recuperación, validaciones, permisos, seguridad y revisión humana.

## Puntuación

La escala total es de 1.000 puntos. La puntuación es deliberadamente orientativa: sirve para dar feedback inmediato y mantener ritmo, no como evaluación académica rigurosa.

- 900–1000: Analista IA con criterio.
- 750–899: Analista IA funcional.
- 600–749: Prometedor, con revisión humana recomendada.
- <600: La evidencia solicita una segunda oportunidad.
