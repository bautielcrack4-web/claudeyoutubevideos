# match_v3 — matcheo de clips "editado a mano"

Reemplaza el cerebro del matcher viejo (concepto por plantilla + CLIP) por **autoría transcript-first
con ancla de sujeto** + **juez visual (VLM) que lee los mosaicos de storyboard**. Reusa la plomería
de `match_sb.mjs` (búsqueda YouTube Data API multi-key, storyboards de i.ytimg, `--refine`).
Receta y por qué: memoria `reference_match_v3_hand_edited`.

## Secuencia end-to-end (para un video `<slug>`)
```
# 1. Narración → beats por frase (anclados al ms, contiguos)
node match_v3/1_segment.mjs public/captions_<slug>.json _v3_<slug>_skel.json beatsheet/_<slug>_starts.json 4.5

# 2. AUTORÍA (agente, 1 por sección para paralelizar) — ver PROMPTS.md §1
#    entrada: los beats de una sección + glosario del video
#    salida: los beats con desc/queries(CON ancla)/shot/src llenos → juntar en _v3_<slug>_authored.json

# 3. Búsqueda + mosaicos (local, API 2 keys)
node match_v3/2_search_mosaics.mjs _v3_<slug>_authored.json _v3_<slug>_mosaics 3 2

# 4. JUEZ VISUAL (agente, 1 por sección) — ver PROMPTS.md §2
#    entrada: _v3_<slug>_mosaics/_manifest.json + los PNG de mosaico (Read)
#    salida: _v3_<slug>_picks.json  { "<beat>": {id,ts,reason} | {src:"stock"} }

# 5. Ensamblar → matched.json (formato de match_sb)
node match_v3/3_assemble.mjs _v3_<slug>_authored.json _v3_<slug>_picks.json public/broll/clips_<slug>_matched.json

# 6. Bajar + afinar segundo
node scripts/fetch_parallel.mjs public/broll/clips_<slug>_matched.json          # baja ganadores
node match_sb.mjs --refine public/broll/clips_<slug>_matched.json                # segundo exacto (local)

# 7. VERIFICAR el footage REAL (cierra brecha storyboard→clip) — ver PROMPTS.md §3
node match_v3/4_stills.mjs public/broll/clips_<slug>_matched.json _v3_<slug>_stills   # stills reales
#    → agente VERIFICADOR (Haiku, visión) mira stills → _v3_<slug>_verdicts.json
node match_v3/5_apply_verdicts.mjs public/broll/clips_<slug>_matched.json _v3_<slug>_verdicts.json  # filtra

# 8. Stock para lo reprobado + lo que no tenía footage
node scripts/stockfallback.mjs <slug>                                            # _needstock + _reject → Pexels/Pixabay
```

## Reglas incrustadas (no negociar)
- **Query SIEMPRE con ancla de sujeto** (nombre del plato/cosa). Sin ancla, YouTube deriva a basura.
- **1 query propia por beat** (con 2 keys alcanza; NO compartir 1 query entre muchas frases).
- **Video rico = varios beats** (timestamps distintos del mismo video) → coherencia + variedad.
- **Frase sin footage → stock/foto**, nunca forzar un match malo. Emotivo/reflexivo → `photo`.
- **Esquivar tiles de borde** (títulos al inicio, end-cards al final).

## Notas
- `_v3_*` son scratch (gitignored). `match_v3/` es la infra (versionada).
- 429 rateLimitExceeded al probar mucho seguido = límite por-segundos, se enfría en ~100s. La cuota
  DIARIA (10k/proyecto = ~100 búsquedas) es separada; 2 keys = 2 proyectos = doble.
- Banco de afinado suelto: `match_v3_probe.mjs` (baja mosaicos de una lista chica para calibrar a ojo).
