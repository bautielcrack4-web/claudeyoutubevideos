# PREMIUM KIT — catálogo de componentes de motion-graphics de estudio

Biblioteca reusable y **themeable** para ensamblar los overlays de cualquier video
documental sin inventar componentes bespoke. 34 componentes en 8 familias +
sistema de themes + primitivas core para componer piezas nuevas.

```tsx
import { VsDuel, ThemeProvider, THEME_NATURE } from "./kit/premium";

// por prop (un beat suelto):
<VsDuel durationInFrames={120} theme={THEME_NATURE} left={{...}} right={{...}} />

// o por context (todo el video en un theme):
<ThemeProvider theme={THEME_ALARM}>...cues...</ThemeProvider>
```

**Contrato:** todo componente recibe `durationInFrames` (entra con spring, sale
con fade en los últimos ~12 frames) + `theme?` opcional + props de contenido.
Render-safe: determinista, clampeado, sin assets obligatorios (toda prop `image`
es opcional — sin imagen dibuja un placeholder digno; en producción pasá
`staticFile(...)`).

## Themes (`theme.ts`)

| Theme | Canal / identidad | Look |
|---|---|---|
| `THEME_EARTH` | Constructor Libre / huerta / remedios | terroso vintage, EB Garamond, papel |
| `THEME_NATURE` | documental fauna | BBC nocturno, Playfair + Inter, oro sobre verde-negro |
| `THEME_AMISH` | homesteading calmo | crema rústica serif, sepia, papel fuerte |
| `THEME_ALARM` | finanzas jubilados | negro/rojo/oro, Oswald MAYÚSCULAS, urgencia |

Crear un theme nuevo = copiar uno y cambiar `color`/fuentes; TODOS los
componentes lo toman sin tocar código.

## Mapa intención-de-beat → componente

### Comparación (`compare.tsx`)
- **VsDuel** — "X contra Y" con veredicto: dos contendientes, medallón VS que estampa, cifra por lado. Props: `eyebrow, title, left/right: {label, sub, image?, value?, unit?, good?}`.
- **BeforeAfter** — "mirá el cambio": barrido antes→después con divisor dorado y tags. Props: `eyebrow, beforeLabel, afterLabel, beforeImage?, afterImage?, caption`.
- **DuelColumns** — "punto por punto": tabla de atributos con tick/cruz por columna. Props: `title, leftName, rightName, rows: {attr, leftWins}[]`.
- **TierRanking** — "del mejor al peor": filas S/A/B con chips de items. Props: `title, rows: {tier, color?, items[]}[]`.

### Números / stats (`stats.tsx`)
- **BigStatReveal** — UN dato que tiene que pegar: cifra gigante con odómetro + subrayado + fuente. Props: `eyebrow, value, prefix, suffix, support, source`.
- **StatGrid** — 3-4 datos juntos (resumen del año): grilla 2x2 con odómetros. Props: `title, stats: {value, prefix?, suffix?, label, accent?}[]` (máx 4).
- **RankBars** — comparar magnitudes: barras horizontales con líder destacado. Props: `title, unit, rows: {label, value, accent?}[]`.
- **GaugeDial** — nivel/riesgo 0-100: medidor semicircular con aguja y zonas. Props: `eyebrow, label, value (0-100), suffix, zones`.
- **DonutPercent** — "X de cada 100": anillo que se dibuja + % centrado + claim. Props: `value (0-100), title, support`.

### Diagramas (`diagrams.tsx`)
- **CutawayCallouts** — anatomía/por dentro: lámina central + rótulos con flechas codo. Props: `eyebrow, title, image?, callouts: {text, sub?, tx, ty (0-1), side?}[]`.
- **FlowSteps** — proceso lineal A→B→C (2-5 pasos): nodos circulares + flechas dibujadas. Props: `title, nodes: {label, sub?, image?}[]`.
- **CycleLoop** — ciclo que se repite: nodos en órbita + cometa girando + centro. Props: `title, center, nodes: {label, sub?}[]` (máx 6).
- **LayerStack** — "capa sobre capa" (hügelkultur, aislación, lasaña): planos isométricos que caen y apilan. Props: `title, layers: {label, color?}[]` (de arriba hacia abajo).

### Listas (`lists.tsx`)
- **NumberedSteps** — receta/instrucciones con orden: espina de tinta + medallas numeradas. Props: `eyebrow, title, steps: {title, sub?, image?}[]`.
- **ChecklistReveal** — "necesitás esto antes de empezar": tildes que se dibujan + sello TODO LISTO. Props: `title, items[], stamp`.
- **BulletCascade** — 3 ideas fuertes ("no es X, es Y"): bullets grandes con keyword resaltada. Props: `eyebrow, bullets: {pre?, key, post?}[]`.

### Texto / énfasis (`text.tsx`)
- **HookCaption** — gancho de apertura: palabras que golpean, claves en caja de acento. Props: `words: {text, boxed?}[], sub`.
- **PullQuote** — cita con autoridad: retrato circular + comillas gigantes + atribución. Props: `quote, author, role, image?`.
- **KaraokePhrase** — frase para grabarse palabra por palabra (la activa brilla). Props: `phrase, wordDur?, eyebrow`.
- **HighlightSweep** — una oración donde el marcador BARRE la parte que importa. Props: `pre, highlight, post, note`.

### Lugar / tiempo (`place.tsx`)
- **TimelinePlayhead** — cronología: riel con playhead que viaja y enciende eventos. Props: `title, events: {year, label}[]`.
- **MapPinPoint** — "acá pasó": pin que cae con radar sobre mapa estilizado. Props: `place, region, x, y (0-1)`.
- **RouteTrace** — trayecto A→B sobre mapa con distancia. Props: `from/to: {label, x, y}, distance`.
- **DateStampCorner** — sello esquina fecha+lugar con typewriter (overlay sobre footage). Props: `date, place, corner (tl/tr/bl/br)`.

### Marco / identidad (`frame.tsx`)
- **CornerEyebrow** — kicker de canal/sección en esquina (overlay liviano). Props: `eyebrow, text, corner (tl/tr)`.
- **ChapterTitle** — portada de capítulo: numeral romano gigante de fondo + título. Props: `number, title, sub`.
- **LowerThirdId** — presentar a alguien: retrato chico + nombre + rol (overlay). Props: `name, role, image?`.
- **CtaCard** — vender el manual/producto: portada 3D + precio odómetro + botón que respira. Props: `eyebrow, title, bullet, price, cta, image?`.
- **StampBadge** — veredicto que SLAMEA ("PROBADO", "ESTAFA"): sello de goma con polvo (overlay). Props: `text, sub, color?, x, y (0-1)`.
- **MythTruth** — derribar un mito: MITO tachado que se apaga → VERDAD que enciende. Props: `myth, truth`.

### Media (`media.tsx`)
- **FramedPhoto** — UNA foto protagonista (archivo/prueba): marco museo + ken-burns + placa. Props: `image?, caption, sub, kenburns`.
- **FloatingCutout** — presentar UN objeto/ingrediente: recorte flotando con rim light + label grande. Props: `image?, label, sub`.
- **PhotoCarousel** — 3-5 candidatos/variantes: polaroids, la activa se adelanta con badge. Props: `title, items: {image?, label}[]`.
- **SplitPanel** — media + conclusiones: imagen con corte diagonal + bullets con ticks. Props: `eyebrow, title, image?, bullets[]`.

## Primitivas core (`core.tsx`) — para bespoke que combine con el kit
`Panel` (escenario texturado con rayos/viñeta) · `Card` (superficie glass del theme)
· `Stage` · `Eyebrow/Display/Support` (jerarquía tipográfica) · `ImgOr` (Img o
placeholder) · `PhotoBlock` (foto con marco marcador) · `Odo` (odómetro themeado)
· `Arrow/Stroke/Tick/Cross` (tinta que se dibuja) · `Burst/Motas` (partículas)
· `ContactShadow` · `Texture/Rays/Vignette` · `useBeat` (enter+exit estándar)
· `kick(frame,fps,at)` (spring diferido para .map()) · `rand/wob/fmt/clamp01`.

## Gallery / verificación
`src/index-premium.ts` registra `PremiumGallery` (páginas 2x2, un theme por página,
90 frames c/u). Verificar con:

```powershell
$env:TEMP='D:\rtmp\tmp'; $env:TMP='D:\rtmp\tmp'
npx remotion still src/index-premium.ts PremiumGallery out/gallery_N.png --frame=(N*90+70)
```
