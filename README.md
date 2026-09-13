# Operación: Informe para ayer

Práctica web estática para un curso de IA generativa y LLMs. Versión 1.2, revisada para uso en aula. La web organiza seis retos y obliga al participante a utilizar un LLM real externo (ChatGPT, Copilot, Gemini, Claude, modelo corporativo, etc.). No necesita backend ni claves de API.

## Qué incluye

1. **El becario digital** — mejora de prompts.
2. **Muy convincente. Muy falso.** — alucinaciones y verificación de evidencias.
3. **No puedes leer 47 PDFs** — simulación de RAG y selección de contexto.
4. **El documento rebelde** — prompt injection indirecta.
5. **Quiero datos, no literatura** — salida JSON y validación automática.
6. **El jefe vuelve a llamar** — briefing final integrador.

Entre bloques aparece una pantalla de **puesta en común** con preguntas para revisar todos juntos en clase. Cada bloque muestra una duración orientativa y el botón de avance recuerda esperar la indicación del docente.

## Arquitectura

- `index.html` — shell de la aplicación.
- `assets/styles.css` — estilos.
- `js/app.js` — navegación, lógica, puntuación y estado.
- `js/validators.js` — validaciones deterministas de texto y JSON.
- `js/semantic.js` — recuperación local opcional con embeddings y respaldo léxico.
- `data/case.json` — expediente ficticio, preguntas, soluciones y reglas.

Todo el progreso se guarda en `localStorage` del navegador.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo.
2. Sube el contenido de esta carpeta a la raíz del repositorio.
3. En **Settings → Pages**, elige **Deploy from a branch**.
4. Selecciona `main` y `/ (root)`.
5. Guarda. GitHub publicará la web en la URL de Pages del repositorio.

No hace falta ningún proceso de compilación.

## Ejecutar en local

Como la aplicación carga `data/case.json` mediante `fetch`, es preferible usar un servidor HTTP local:

```bash
python -m http.server 8000
```

Después abre:

```text
http://localhost:8000
```

Abrir `index.html` directamente mediante `file://` puede impedir que el navegador cargue el JSON.

### Validación técnica opcional

Si tienes Node.js instalado, puedes ejecutar las comprobaciones incluidas en el proyecto:

```bash
node tests/validate.mjs
```

Comprueban la coherencia del expediente, referencias entre documentos y bloques, y las validaciones deterministas (incluidos tipos y fechas del ejercicio JSON).

## Recuperación semántica local

En el bloque 3 hay un botón experimental que intenta cargar en el navegador `@xenova/transformers` y el modelo multilingüe `Xenova/paraphrase-multilingual-MiniLM-L12-v2` desde CDN.

- La primera carga puede tardar y descargar decenas de MB.
- Algunos equipos corporativos pueden bloquear CDN, WebAssembly o WebGPU.
- **La práctica no depende de ello.** Si el modelo no carga, la web usa automáticamente un ranking léxico sencillo.
- El LLM generativo sigue siendo siempre el LLM externo elegido por el alumno.

Si prefieres evitar por completo esta descarga, puedes eliminar el botón del bloque 3 o sustituir `rankFragments()` por el ranking léxico del propio archivo `semantic.js`.

## Personalización rápida

La mayor parte del contenido está en `data/case.json`. Puedes cambiar:

- documentos del expediente;
- textos humorísticos;
- preguntas de puesta en común;
- afirmaciones del bloque de alucinaciones;
- fragmentos del RAG;
- esquema JSON;
- documentos recomendados del reto final.

Si cambias hechos del expediente, revisa también las soluciones y valores esperados para que la corrección automática siga siendo coherente.

## Uso en clase

- Pide a los participantes que abran su LLM antes de empezar. En los bloques con comparación (1 y 4), conviene usar el mismo modelo en ambos intentos.
- Lanza cada bloque y deja que trabajen de forma autónoma.
- Cuando aparezca **PAUSA · PUESTA EN COMÚN**, detén al grupo y revisa las preguntas en plenaria.
- Aprovecha que distintos alumnos usarán modelos diferentes: las diferencias de respuesta son parte de la práctica.
- En el bloque 2 se hace un experimento A/B con el mismo modelo: primero se prueba un encargo deliberadamente problemático que presiona para completar huecos; después el alumno audita el propio prompt y ejecuta una versión reforzada. Si el modelo resiste desde el primer intento, la actividad sigue siendo válida: debe identificar por qué el prompt era peligroso aunque el modelo se haya comportado bien.
- En el bloque 3, la recuperación local reordena visualmente los fragmentos; un puesto alto por similitud no equivale a relevancia real.
- Los bloques completados quedan en modo de revisión para que la puntuación no se desincronice de las respuestas.

## Privacidad

El expediente incluido es completamente ficticio. La práctica recuerda al alumno que no debe introducir información real, personal o sensible en herramientas no autorizadas.

## Licencia

Código preparado para uso formativo y adaptación interna. Puedes modificarlo libremente para el curso.

## Cambios de la versión 1.2

- Bloque 2 convertido en un experimento A/B con el mismo LLM: prompt problemático frente a prompt reforzado.
- El alumno registra si su modelo inventó, resistió o mostró un comportamiento mixto.
- Se añade una auditoría obligatoria del propio prompt para que el ejercicio siga funcionando aunque el modelo no alucine.
- La puntuación del bloque 2 combina identificación de señales de riesgo y clasificación de afirmaciones contra las fuentes.
- Se mantiene la auditoría factual como actividad independiente de lo que haya respondido cada modelo.
- Resto de mejoras de la v1.1: ranking semántico visible, fuentes opcionales sin penalización y bloqueo de respuestas tras corregir.
