// Recuperación local opcional. El flujo principal NO depende de este módulo.
// Primero intenta embeddings en navegador mediante Transformers.js. Si falla,
// usa un ranking léxico sencillo para que la práctica siga funcionando.

function normalize(text = "") {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9ñáéíóúü\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP = new Set(["de","la","el","los","las","un","una","y","o","que","en","a","por","para","con","del","al","se","su","sus","es","son","si","como","lo","qué","puede","debe"]);

function tokens(text) {
  return normalize(text).split(" ").filter(t => t.length > 2 && !STOP.has(t));
}

function lexicalScore(query, text) {
  const q = new Set(tokens(query));
  const t = tokens(text);
  if (!q.size || !t.length) return 0;
  let matches = 0;
  for (const term of t) if (q.has(term)) matches += 1;
  return matches / Math.sqrt(q.size * t.length);
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / ((Math.sqrt(na) * Math.sqrt(nb)) || 1);
}

let extractorPromise = null;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const { pipeline, env } = await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2");
      env.allowLocalModels = false;
      // Modelo multilingüe compacto. Puede descargar decenas de MB la primera vez.
      return pipeline("feature-extraction", "Xenova/paraphrase-multilingual-MiniLM-L12-v2");
    })();
  }
  return extractorPromise;
}

async function embed(extractor, text) {
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

export async function rankFragments(query, fragments, onStatus = () => {}) {
  try {
    onStatus("Descargando/cargando modelo local de embeddings… la primera vez puede tardar.");
    const extractor = await getExtractor();
    onStatus("Calculando embeddings en tu navegador…");
    const qVec = await embed(extractor, query);
    const ranked = [];
    for (const fragment of fragments) {
      const vec = await embed(extractor, fragment.text);
      ranked.push({ ...fragment, score: cosine(qVec, vec), method: "embeddings" });
    }
    return ranked.sort((a,b) => b.score - a.score);
  } catch (error) {
    console.warn("Embeddings locales no disponibles; se usa ranking léxico.", error);
    onStatus("No se pudo cargar el modelo local. Uso un ranking léxico de respaldo.");
    return fragments
      .map(fragment => ({ ...fragment, score: lexicalScore(query, fragment.text), method: "lexical" }))
      .sort((a,b) => b.score - a.score);
  }
}
