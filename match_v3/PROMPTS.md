# match_v3 — prompts de los 2 agentes (el "cerebro")

Los pasos mecánicos son scripts. Estos 2 son los que necesitan LLM/visión. Se corren con el tool `Agent`
(uno por sección para paralelizar). Contratos de entrada/salida en JSON estricto.

---

## AGENTE 1 — AUTORÍA (transcript-first)
**Entrada**: el esqueleto de beats de UNA sección (de `1_segment.mjs`) + el GLOSARIO del video
(descripción canónica del sujeto y elementos recurrentes — ver [[feedback_video_visual_context]]).

**Prompt** (rellenar `{SECCION}`, `{GLOSARIO}`, `{BEATS_JSON}`):
```
Sos un editor de video documental. Para cada beat (una frase real de la narración) escribí el PLANO
ideal que un editor humano pondría encima de esa frase. Contexto del video (glosario, resolvé toda
referencia a esto): {GLOSARIO}

Sección: {SECCION}
Beats (JSON): {BEATS_JSON}

Devolvé EL MISMO array, con estos campos por beat:
- "desc": descripción EN corta del plano ideal (para el juez visual). Ej: "hands stretching hot
  caramel until white and glossy". Anclada a lo que DICE la frase, no al tema genérico.
- "queries": 2 búsquedas en español para YouTube. REGLA DURA: CADA query DEBE llevar el NOMBRE del
  plato/sujeto (mazamorra, alfeñique, arrope…); la acción es modificador. Sin el ancla, YouTube deriva
  a basura (probado: "miel de caña chorreando" → videos de sueño de 3h). Ej OK: "mazamorra hirviendo
  olla maiz blanco". Ej MAL: "granos abriéndose cremita".
- "shot": uno de wide|medio|close|manos|cara|detalle.
- "src": "youtube" si hay footage real esperable; "stock" si es ambiente genérico (cocina, familia,
  campo — sale más limpio de Pexels); "photo" si va mejor una foto fija (nostalgia, retrato).
  Frases SIN footage posible (ej "remojado desde la noche anterior", metáforas) → "stock" o "photo".
Sólo el JSON, sin texto extra.
```
**Salida**: el array de beats con `desc/queries/shot/src` llenos → se junta y pasa a `2_search_mosaics.mjs`.

---

## AGENTE 2 — JUEZ VISUAL (lee los mosaicos)
**Entrada**: `_manifest.json` de `2_search_mosaics.mjs` para sus beats + los PNG de mosaico (imágenes).
Cada PNG es una grilla `cols×rows` de miniaturas de TODO el video (hoja de contactos). La geometría
está en el nombre: `__c<COLS>r<ROWS>_int<INTERVAL>_base<BASE>.png`.

**Prompt** (rellenar `{MANIFEST_JSON}` y adjuntar los PNG con Read):
```
Sos un editor eligiendo el fotograma exacto para cada frase. Para cada beat mirá los mosaicos de sus
candidatos (cada mosaico es la película entera en miniaturas, grilla cols×rows, leída de izq→der y
arriba→abajo). Elegí el VIDEO y el TILE que MEJOR ilustra la frase y esté LIMPIO.

Reglas:
1. El tile debe mostrar la ACCIÓN de la frase (no el tema en general).
2. EVITÁ tiles con texto quemado/título (suelen ser los PRIMEROS ~2 tiles) y end-cards
   "SUSCRIBITE/Dale Like" (los ÚLTIMOS ~2). Elegí del cuerpo del video.
3. Si dos beats contiguos del mismo plato tienen un mismo video RICO, sacá tiles de MOMENTOS distintos
   de ese video (coherencia + variedad) en vez de videos sueltos.
4. Si NINGÚN candidato sirve, devolvé {"src":"stock"} para ese beat (no fuerces un match malo).

Calculá el timestamp del tile elegido: ts = (base + fila*cols + col + 0.5) × interval
(fila y col empiezan en 0; base, cols, interval salen del nombre del PNG).

Manifest: {MANIFEST_JSON}

Devolvé SOLO un JSON { "<beat>": {"id":"<videoId>","ts":<segundos>,"reason":"<3-6 palabras>"} | {"src":"stock"} }.
```
**Salida**: `picks.json` → `3_assemble.mjs`.
