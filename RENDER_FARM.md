# Render farm GRATIS (GitHub Actions, repo público)

Renderiza los videos en la nube de GitHub **gratis** (repo público = minutos ilimitados),
partiendo cada video en rangos de frames que corren en paralelo. **Entrega el mp4 final
como artifact descargable — NO sube a YouTube.** Tu laptop queda libre.

## Setup (una sola vez)
1. **Repo público** con este proyecto subido (incluye `.github/workflows/render.yml`).
   - El CÓDIGO se ve (es solo el pipeline); tu CONTENIDO (avatar, assets, mp4) NO va al repo.
2. `gh` (GitHub CLI) instalado y logueado: `gh auth login`.
3. Nada más. No hace falta AWS, R2 ni tarjeta.

## Hacer un video (un comando)
Una vez que el video está armado localmente (transcripción + assets generados + `Main_<slug>.tsx`
registrado en `Root.tsx`, igual que ahora):

```
node scripts/farm.mjs <slug> <comp_id> <total_frames> [chunks=24] [prefijoAssets]
# ej:
node scripts/farm.mjs fly Fly 43380 24 fl
```

El orquestador: empaqueta los assets → los sube como release `assets-<slug>` → dispara el
workflow → espera → descarga **`out/<slug>.mp4`**. Listo, te entrego ese mp4.

## Cómo funciona (y por qué es gratis y rápido)
- `render.yml`: job **prepare** arma la matriz de N pedazos → job **render** (matrix) renderiza
  cada rango `--frames=A-B` en su propio runner EN PARALELO → job **stitch** une todo con
  `ffmpeg -c copy` (sin recodificar, sin pérdida) → sube el mp4 como artifact.
- **Minutos ilimitados** en repo público. El límite real es **concurrencia (~20 jobs)** → con
  `chunks=20` un video sale en ~el tiempo de UN pedazo. Más chunks = más rápido hasta saturar los 20.
- Assets viajan como **release asset** (gratis, hasta 2 GB), no por el repo.

## Escalar a 10/día
- 10 videos de ~24 min/día entran en una sola cuenta (~8h desatendido), gratis.
- Para más (docs de 50 min ×10), sumá workers **legítimos** al orquestador: tu PC y/o una
  **Oracle ARM gratis** como carriles extra. (NO multicuentas de GitHub — va contra ToS.)

## Notas / TODO
- `chunks=24` por defecto; subilo para videos largos (más paralelo).
- Si el tarball de assets es grande, pasá el `prefijoAssets` (ej `fl`) para empaquetar solo
  los de ESE video + los diagramas `dg_*`, en vez de `img/` y `vid/` enteros.
- Runners ubuntu traen ffmpeg y 4 cores; `--concurrency=2` por pedazo va bien.
- El `concat -c copy` exige que todos los pedazos compartan codec/params → los comparten
  (mismo render). Si alguna vez falla el concat, recodificar en el stitch (más lento).
- PENDIENTE de probar end-to-end cuando el repo esté público + `gh` logueado (este esqueleto
  está escrito pero aún no corrido).
