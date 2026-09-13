export function countWords(text = "") {
  return text.trim() ? text.trim().split(/\s+/u).filter(Boolean).length : 0;
}

export function normalize(text = "") {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function containsHeading(text, heading) {
  const nText = normalize(text);
  const nHeading = normalize(heading);
  return nText.includes(nHeading);
}

export function hasAnyCitation(text = "") {
  return /(\[?D\d+\]?|documento\s+\d+|doc\.?\s*\d+)/iu.test(text);
}

export function validateTextResponse(text, rules = {}) {
  const results = [];
  const words = countWords(text);
  if (rules.required) {
    results.push({
      ok: text.trim().length > 0,
      label: text.trim().length > 0 ? "Hay una respuesta pegada." : "Falta pegar la respuesta del LLM."
    });
  }
  if (rules.maxWords) {
    results.push({
      ok: words <= rules.maxWords && words > 0,
      label: `${words}/${rules.maxWords} palabras.`
    });
  }
  if (rules.minWords) {
    results.push({
      ok: words >= rules.minWords,
      label: `${words} palabras; mínimo recomendado ${rules.minWords}.`
    });
  }
  (rules.headings || []).forEach((heading) => {
    const ok = containsHeading(text, heading);
    results.push({ ok, label: `${ok ? "Incluye" : "Falta"} la sección «${heading}».` });
  });
  if (rules.citations) {
    const ok = hasAnyCitation(text);
    results.push({ ok, label: ok ? "Incluye referencias a documentos." : "No se detectan referencias a documentos." });
  }
  return { words, results, passed: results.filter(r => r.ok).length, total: results.length };
}

export function validateJson(raw, expected, schema = {}) {
  let parsed;
  try {
    parsed = JSON.parse(raw.trim());
  } catch (error) {
    return {
      validJson: false,
      parsed: null,
      results: [{ ok: false, label: `JSON no válido: ${error.message}` }],
      passed: 0,
      total: Object.keys(expected).length + 1
    };
  }

  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    return {
      validJson: true,
      parsed,
      results: [
        { ok: true, label: "JSON sintácticamente válido." },
        { ok: false, label: "La salida debe ser un objeto JSON, no una lista ni un valor simple." }
      ],
      passed: 1,
      total: 2
    };
  }

  const results = [{ ok: true, label: "JSON sintácticamente válido." }];
  for (const [key, expectedValue] of Object.entries(expected)) {
    const hasKey = Object.prototype.hasOwnProperty.call(parsed, key);
    if (!hasKey) {
      results.push({ ok: false, label: `Falta el campo «${key}».` });
      continue;
    }

    const value = parsed[key];
    const expectedType = schema[key];
    let typeOk = true;
    let typeLabel = "";

    if (expectedType === "number") {
      typeOk = typeof value === "number" && Number.isFinite(value);
      typeLabel = "numérico";
    } else if (expectedType === "string") {
      typeOk = typeof value === "string";
      typeLabel = "texto";
    } else if (expectedType === "YYYY-MM-DD") {
      typeOk = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
      if (typeOk) {
        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        typeOk = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
      }
      typeLabel = "fecha YYYY-MM-DD";
    }

    if (!typeOk) {
      results.push({ ok: false, label: `«${key}» tiene un tipo/formato incorrecto; se esperaba ${typeLabel}.` });
      continue;
    }

    const same = typeof expectedValue === "number"
      ? value === expectedValue
      : normalize(value) === normalize(expectedValue);
    results.push({
      ok: same,
      label: same ? `«${key}» correcto.` : `«${key}» no coincide con la fuente.`
    });
  }

  const extra = Object.keys(parsed).filter(k => !Object.prototype.hasOwnProperty.call(expected, k));
  if (extra.length) {
    results.push({ ok: false, label: `Campos adicionales no solicitados: ${extra.join(", ")}.` });
  }

  return {
    validJson: true,
    parsed,
    results,
    passed: results.filter(r => r.ok).length,
    total: results.length
  };
}

export function scoreSelections(selectedIds, items, key = "relevant") {
  const selected = new Set(selectedIds);
  const positives = items.filter(item => item[key]).map(item => item.id);
  const negatives = items.filter(item => !item[key]).map(item => item.id);
  const tp = positives.filter(id => selected.has(id)).length;
  const fn = positives.length - tp;
  const fp = negatives.filter(id => selected.has(id)).length;
  const tn = negatives.length - fp;
  const precision = tp + fp ? tp / (tp + fp) : 0;
  const recall = tp + fn ? tp / (tp + fn) : 0;
  return { tp, fp, fn, tn, precision, recall };
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
