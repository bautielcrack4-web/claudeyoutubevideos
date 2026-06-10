// build_hipos.mjs — shotlist DENSO de "Los hipopótamos de Pablo Escobar".
// Yo escribo solo el "core" espacial de cada toma; este script envuelve cada prompt
// en el formato de realismo validado + negative inline, y auto-secuencia el timing
// por acto (sin solapes). Luego: node beatsheet.mjs beatsheet/hipos.json
import fs from "fs";

// ── envoltorios de prompt ────────────────────────────────────────────────────
const IMPERF =
  "realistic imperfect handheld camera angle, slightly tilted frame, practical documentary look, no cinematic lighting, no perfect studio setup, natural video compression, low-resolution YouTube documentary screenshot look, not staged, ultra realistic";
const NEG_OBJ =
  "Negative prompt: clean studio product photo, cinematic lighting, overly saturated colors, cartoon, CGI, 3D render, luxury advertisement, sharp perfect text, dramatic shadows, watermark, logo overlay, fantasy style, illustration.";
const NEG_ANIMAL =
  "Negative prompt: clean studio photo, cinematic lighting, overly saturated colors, cartoon, CGI, 3D render, cute mascot, anthropomorphic, watermark, logo, fantasy style, illustration, extra limbs, distorted anatomy.";
const NEG_PEOPLE =
  "Negative prompt: clean studio portrait, cinematic lighting, overly saturated, cartoon, CGI, 3D render, watermark, logo, perfect symmetrical face, extra fingers, distorted hands, blurry face, fantasy style.";

const wrap = (core, neg = NEG_OBJ) =>
  `Realistic handheld 16:9 documentary-style video frame ${core}. ${IMPERF}. ${neg}`;
const HUE = { amber: "amber", cold: "cold", danger: "red", ink: "amber", good: "cold", blue: "blue", red: "red" };
const vhue = (h) => HUE[h] || "amber";
function diagWrap(core) {
  return `Crear una infografía horizontal 16:9, estilo ilustración hecha a mano pero muy profesional, limpia, premium y editorial. ${core}. Fondo marfil claro con textura de papel sutil, líneas marrón oscuro, acentos verde oliva apagado y terracota apagado, estética botánica/archivo vintage. Dejá COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin texto ni dibujos) para colocar después el avatar. Composición minimalista, pocos bloques grandes, números grandes, texto mínimo en español, se entiende en 1 segundo. Evitá saturación, íconos de más, textos chicos, look escolar o infantil.`;
}

// ── tabla de beats ───────────────────────────────────────────────────────────
// {act:s}                              fija el reloj al inicio del acto
// {p:"core",d,hue,kick?,neg?}          foto RawShot
// {c:"core img base",m:"movimiento",d,frames?,hue,kick?,neg?}  clip RawShot (img2video)
// {st:{value,suffix?,prefix?,decimals?,label?,eyebrow?,accent?,hue?},d}  StatBig (número)
// {im:{slug,gen:"core img",setup?,impact,impactAccent?,hitAt?,boom?,neg?},d}  ImpactReveal
// {dg:{eyebrow,hue,accent,slides:[{title,img:"core lámina"}]},d}  diagrama
// {jy:{eyebrow,title,accent?,world:{slug,gen},wps:[{slug,gen,label,num,x,y,z?,dwell?,travel?,neg?}]},d}  JourneyCanvas
const T = [
  // ════════════ ACTO 0 — HOOK (0:00–0:33) ════════════
  { act: 0 },
  { c: "of a massive hippopotamus half-submerged in a muddy brown tropical river at dusk, only eyes and ears above the murky water, dense green jungle bank behind", m: "the hippo slowly rises, water dripping, ripples spreading across the murky river", d: 3.4, frames: 110, hue: "cold", kick: "Río Magdalena, Colombia" },
  { im: { slug: "hook", gen: "of a huge wild hippopotamus standing in a Colombian tropical river, menacing, brown water, jungle behind, gritty documentary", setup: "Pablo Escobar trajo 4. Hoy son", impact: "MÁS DE 200", impactAccent: "danger", hitAt: 1.1, boom: 2, neg: NEG_ANIMAL }, d: 3.6 },
  { p: "of a faded vintage 1980s photo of Pablo Escobar standing in front of a lavish hacienda with exotic animals, sun-faded colors, archival snapshot", d: 2.4, hue: "amber", neg: NEG_PEOPLE },
  { p: "of a group of more than a dozen hippos crowded along a Colombian riverbank seen from a distance, overcast tropical light", d: 2.4, hue: "cold" },
  { c: "of an aggressive hippo with mouth wide open showing huge teeth in a river, threatening, water splashing", m: "the hippo lunges forward with open jaws, big splash of muddy water", d: 3.2, frames: 100, hue: "danger", kick: "Atacan pescadores" },
  { p: "of dead fish floating belly-up at the edge of a green algae-covered river, environmental damage documentary photo", d: 2.2, hue: "danger", neg: NEG_ANIMAL, kick: "Contaminan el agua" },
  { im: { slug: "kill80", gen: "of a Colombian government press conference with officials at a podium and microphones, serious, news documentary still", setup: "Y el gobierno acaba de decidir", impact: "MATAR A 80", impactAccent: "danger", hitAt: 1.0, boom: 1, neg: NEG_PEOPLE }, d: 3.4 },
  { p: "of two hippos fighting in churning muddy water, spray flying, dramatic wildlife documentary frame", d: 2.4, hue: "danger" },
  { p: "of a lone fisherman in a small wooden canoe on a wide tropical river at dawn, nets in hand, misty water", d: 2.6, hue: "cold", kick: "La peor invasión de Sudamérica" },

  // ════════════ ACTO 1 — Tesis + río Magdalena (0:33–2:26) ════════════
  { act: 33 },
  { p: "of a wide aerial view of the Magdalena river winding through green Colombian lowlands, brown water, tropical vegetation, overcast", d: 3.2, hue: "cold", kick: "1.500 km de río" },
  { c: "of a hippo walking out of the river onto a grassy bank at twilight, huge body, mud on its skin", m: "the heavy hippo lumbers slowly out of the water onto the muddy grass", d: 3.6, frames: 110, hue: "cold" },
  { p: "of a weathered paper map of Colombia with the Magdalena river highlighted in blue running south to north, marker annotations", d: 2.8, hue: "cold", neg: NEG_OBJ, kick: "El 2º río más importante" },
  { st: { value: 200, prefix: "+", label: "hipopótamos salvajes en Colombia", eyebrow: "Hoy, en 2026", accent: "danger", hue: "red" }, d: 4 },
  { p: "of the entrance gate of Hacienda Napoles with a small replica airplane mounted above the gate, faded 1980s look", d: 2.8, hue: "amber", kick: "Hacienda Nápoles" },
  { p: "of a vast green estate seen from above with a private airstrip, a lake and scattered buildings, tropical Colombian countryside, sun-faded", d: 3, hue: "amber", kick: "3.000 hectáreas" },
  { c: "of a herd of hippos resting in shallow brown water surrounded by reeds, several heads visible", m: "gentle ripples, one hippo opens its mouth in a wide yawn", d: 3.4, frames: 100, hue: "cold" },
  { p: "of dense riverside jungle vegetation reflected in still brown water, Colombian tropical wetland, muted natural light", d: 2.8, hue: "cold" },
  { p: "of a worn scientific clipboard with hippo population count numbers and a hippo silhouette stamp, research desk", d: 2.6, hue: "ink", neg: NEG_OBJ },
  { p: "of a Colombian riverside village with simple houses near the brown water, overcast tropical day, casual snapshot", d: 2.8, hue: "amber" },
  { p: "of hippo tracks and churned mud along a tropical riverbank, large footprints, documentary detail", d: 2.6, hue: "ink" },
  { c: "of a hippo submerged with only nostrils and eyes above brown water, slow drifting, jungle reflection", m: "the hippo drifts slowly, nostrils flaring, gentle ripples", d: 3.2, frames: 100, hue: "cold" },
  { p: "of a wide melancholic shot of the Magdalena river at golden hour, lush banks, calm water", d: 2.8, hue: "amber" },

  // ════════════ ACTO 2 — Hacienda Nápoles + importación (2:26–4:32) ════════════
  { act: 146 },
  { p: "of the famous bullet-riddled vintage white Cadillac displayed as a trophy at Hacienda Napoles, full of bullet holes, faded photo", d: 2.8, hue: "amber", kick: "El Cadillac a balazos" },
  { p: "of a 1980s private zoo enclosure with giraffes and zebras in a tropical Colombian setting, sun-faded archival snapshot", d: 2.8, hue: "amber", neg: NEG_ANIMAL },
  { p: "of an old concrete bullring arena overgrown with weeds, abandoned, tropical climate, faded", d: 2.4, hue: "amber" },
  { p: "of a vintage collection of classic cars in an open shed at a luxury estate, 1980s, faded colors", d: 2.6, hue: "amber" },
  { c: "of a large cargo airplane on a jungle airstrip at night with crates being unloaded, dim floodlights", m: "ground crew move crates near the plane, dust drifting in the headlights", d: 3.6, frames: 110, hue: "ink", kick: "Aviones que volvían de Miami" },
  { p: "of stacks of cocaine bricks wrapped in plastic inside an aircraft hold, gritty 1980s smuggling documentary", d: 2.6, hue: "ink", neg: NEG_OBJ, kick: "Iban llenos de droga al norte" },
  { p: "of wooden shipping crates stamped with stencil letters in a dim warehouse, exotic animal transport boxes, gritty", d: 2.6, hue: "ink", kick: "Y volvían llenos de animales" },
  { p: "of a sedated hippopotamus lying in a large reinforced crate inside an aircraft cargo hold, veterinary documentary", d: 2.8, hue: "ink", neg: NEG_ANIMAL },
  { p: "of exotic animals mixed together, elephants, zebras, ostriches, flamingos in a lush private estate, faded 1980s color", d: 2.8, hue: "amber", neg: NEG_ANIMAL },
  { st: { value: 100000, prefix: "$", label: "costaba cada hipopótamo en los 80", eyebrow: "Una fortuna", accent: "amber", hue: "amber" }, d: 4 },
  { c: "of four hippos being released into a freshly built concrete pond, splashing into green water", m: "the hippos slide into the water, big splashes, ripples spreading", d: 3.4, frames: 100, hue: "cold", kick: "Un macho, tres hembras" },
  { p: "of an old yellowed invoice document with handwritten figures around 100000 dollars for animal purchase, aged paper", d: 2.4, hue: "ink", neg: NEG_OBJ },
  { p: "of a single hippo grazing on bright green Colombian grass beside a pond, tropical warm afternoon, casual snapshot", d: 2.8, hue: "good" },
  { p: "of Pablo Escobar appearing in an old Forbes-style magazine page about the richest men, faded print archival", d: 2.6, hue: "ink", neg: NEG_PEOPLE, kick: "Para él, una propina" },

  // ════════════ ACTO 3 — Muerte de Escobar + abandono (4:32–7:34) ════════════
  { act: 272 },
  { im: { slug: "death", gen: "of a Medellin rooftop at dusk with terracotta tiles and police, somber news documentary still, 1993", setup: "2 de diciembre de 1993", impact: "ESCOBAR MUERE", impactAccent: "danger", hitAt: 1.0, boom: 2, neg: NEG_PEOPLE }, d: 3.4 },
  { p: "of a faded newspaper front page in Spanish announcing the death of a drug lord, old print, grainy black and white", d: 2.8, hue: "ink", neg: NEG_OBJ },
  { p: "of the Hacienda Napoles mansion abandoned and looted, broken windows, weeds growing through cracks, decay, overcast", d: 3, hue: "ink", kick: "Confiscada y abandonada" },
  { p: "of empty rusted zoo cages with open doors overgrown by tropical vegetation, abandoned animal enclosures", d: 2.8, hue: "ink" },
  { p: "of a looted ransacked luxury room with graffiti and debris, abandoned narco mansion, gritty", d: 2.6, hue: "ink", kick: "Saqueada por bandas" },
  { c: "of an elephant being loaded onto a transport truck with cranes and handlers, dusty documentary scene", m: "handlers guide the elephant up the ramp, dust in the air", d: 3.4, frames: 100, hue: "amber", neg: NEG_ANIMAL },
  { p: "of a lone starving giraffe in a neglected enclosure with dry ground, sad abandoned zoo, muted colors", d: 2.6, hue: "ink", neg: NEG_ANIMAL, kick: "Las jirafas no sobrevivieron" },
  { p: "of an empty zebra enclosure with a broken fence, abandoned, tropical overgrowth, faded", d: 2.4, hue: "ink" },
  { p: "of a hippo standing alone in a half-drained algae-covered concrete pond, neglected, overcast", d: 2.8, hue: "cold", kick: "Los hipopótamos: otro problema" },
  { st: { value: 3000, suffix: " kg", label: "pesa un hipopótamo adulto", eyebrow: "Imposible de mover", accent: "amber", hue: "amber" }, d: 3.8 },
  { p: "of a heavy crane and reinforced cage prepared to move a large animal, complex logistics, documentary", d: 2.6, hue: "ink" },
  { p: "of rusted broken fence wire collapsed into tall grass beside a stream, abandoned barrier, tropical overgrowth", d: 2.8, hue: "ink", kick: "Las cercas cediendo" },
  { c: "of hippos walking single file along a muddy trail away from a broken pond toward open water at dusk", m: "the hippos walk slowly along the trail, tails swaying", d: 3.6, frames: 110, hue: "cold", kick: "Caminaron hacia afuera" },
  { p: "of a small jungle stream connecting to a wider river, brown water flowing through green banks, Colombian lowlands", d: 2.6, hue: "cold" },
  { p: "of overgrown weeds erasing an old dirt road at an abandoned estate, slow decay, tropical, muted", d: 2.4, hue: "ink", kick: "Una erosión lenta" },
  { c: "of a hippo entering a wide brown river from a small stream at dawn, finding open water, misty", m: "the hippo wades into the wider river, ripples spreading outward", d: 3.4, frames: 100, hue: "cold" },

  // ════════════ ACTO 4 — Escape + explosión poblacional (7:34–11:38) ════════════
  { act: 454 },
  { p: "of the wide warm Magdalena river at golden hour, lush banks, calm brown water, paradise-like tropical scene", d: 3, hue: "good", kick: "El paraíso del hipopótamo" },
  { c: "of a hippo fully submerged then surfacing in clear shallow river water, lush green reeds around", m: "the hippo surfaces, water sheeting off its back, slow ripples", d: 3.6, frames: 110, hue: "cold" },
  { dg: { eyebrow: "Por qué explotó la población", hue: "good", accent: "accent", slides: [
    { title: "En África: freno natural", img: "comparison panel: an African river with crocodiles, drought and dominant males limiting hippo reproduction, fewer hippos" },
    { title: "En Colombia: sin frenos", img: "comparison panel: a Colombian river with unlimited food, no predators, stable warm climate, many hippos multiplying, arrows up" },
  ] }, d: 9 },
  { p: "of a mother hippo with a tiny newborn calf in shallow water close beside her, tender wildlife documentary frame", d: 2.8, hue: "good", neg: NEG_ANIMAL, kick: "Crías cada año, no cada 3" },
  { p: "of a biologist in field clothes observing hippos through binoculars from a riverbank, documentary", d: 2.6, hue: "ink", neg: NEG_PEOPLE },
  // JOURNEY A — la curva poblacional 2007→2026
  { jy: { eyebrow: "La invasión, año por año", title: "De 4 a más de 200", accent: "#B0503C",
    world: { slug: "jy_river_world", gen: "of a wide aged map-like illustration of a tropical river basin from above, sepia parchment tones, room to travel across" },
    wps: [
      { slug: "jy_2007", gen: "of about twenty hippos scattered in a river, aerial documentary, brown water", label: "2007 · ~20", num: "1", x: 500, y: 820, z: 0.7, dwell: 2.6, travel: 1.6, neg: NEG_ANIMAL },
      { slug: "jy_2014", gen: "of a larger group of forty hippos along a river bend, aerial documentary, brown water", label: "2014 · ~40", num: "2", x: 1550, y: 480, z: 0.45, dwell: 2.6, travel: 1.8, neg: NEG_ANIMAL },
      { slug: "jy_2020", gen: "of around ninety hippos crowded in a river, aerial documentary, many dark bodies", label: "2020 · ~90", num: "3", x: 2650, y: 1020, z: 0.8, dwell: 2.6, travel: 1.8, neg: NEG_ANIMAL },
      { slug: "jy_2026", gen: "of more than two hundred hippos packed across a river basin, aerial documentary, overwhelming", label: "2026 · +200", num: "4", x: 3750, y: 520, z: 0.5, dwell: 3, travel: 1.8, neg: NEG_ANIMAL },
    ] }, d: 18 },
  { st: { value: 3, suffix: " años", label: "edad reproductiva en Colombia (en África: 7-9)", eyebrow: "La mitad del tiempo", accent: "danger", hue: "red" }, d: 4 },
  { c: "of a large group of hippos packed together in a river bend seen from above, many dark bodies in brown water", m: "slow aerial drift over the crowded hippos, slight water movement", d: 3.6, frames: 110, hue: "cold" },
  { p: "of two scientific journal covers titled Biological Conservation and Scientific Reports on a researcher desk", d: 2.4, hue: "ink", neg: NEG_OBJ },
  { p: "of hippos at night caught by a wildlife camera trap, greenish night-vision glow, eyes reflecting, grainy", d: 2.6, hue: "ink", neg: NEG_ANIMAL, kick: "Nocturnos, difíciles de contar" },
  { p: "of a hand-drawn exponential curve on aged paper climbing steeply, ominous projection graphic", d: 2.6, hue: "danger", neg: NEG_OBJ },
  { im: { slug: "proj7000", gen: "of a vast crowd of hippos overwhelming a river to the horizon, dystopian aerial documentary, overcast", setup: "Si nadie hace nada, para 2050", impact: "SERÁN 7.000", impactAccent: "danger", hitAt: 1.1, boom: 2, neg: NEG_ANIMAL }, d: 3.8 },
  { p: "of a wide shot of the Magdalena river basin with green wetlands stretching to the horizon, overcast tropical sky", d: 2.8, hue: "cold", kick: "Colonización de toda la cuenca" },

  // ════════════ ACTO 5 — Daño ecológico (11:38–15:35) ════════════
  { act: 698 },
  { c: "of a hippo yawning showing enormous teeth in a river, calm but huge, documentary wildlife close up", m: "the hippo opens its mouth in a slow huge yawn, water dripping from teeth", d: 3.4, frames: 100, hue: "cold", kick: "Parecen inofensivos" },
  { c: "of a hippo grazing on grass on a riverbank at night under moonlight, eating large mouthfuls", m: "the hippo chews grass slowly, head moving, night ambience", d: 3.2, frames: 100, hue: "ink" },
  { st: { value: 40, suffix: " kg", label: "de vegetación come por noche, cada uno", eyebrow: "Una máquina de procesar", accent: "amber", hue: "amber" }, d: 3.8 },
  { dg: { eyebrow: "Cómo envenena el río", hue: "danger", accent: "danger", slides: [
    { title: "1. Come en la orilla", img: "panel: a hippo eating riverbank vegetation at night, simple labeled diagram" },
    { title: "2. Devuelve todo al agua", img: "panel: hippo waste entering the river, nitrogen and phosphorus arrows into water" },
    { title: "3. Algas y cero oxígeno", img: "panel: algae bloom on a river surface, dead fish below, low-oxygen dead zone" },
  ] }, d: 10 },
  { p: "of a tropical river surface covered in thick green algae bloom, stagnant water, polluted wetland, overcast", d: 2.8, hue: "danger", kick: "Florecen las algas" },
  { p: "of dead fish floating belly-up at the edge of a green algae-covered river, environmental damage photo", d: 2.6, hue: "danger", neg: NEG_ANIMAL },
  { c: "of green murky river water with low visibility and a few struggling fish, polluted, documentary underwater-ish", m: "particles drift in the murky green water, slow current", d: 3, frames: 100, hue: "cold" },
  { p: "of a Colombian artisanal fisherman holding up a nearly empty net with two small fish, disappointed, riverbank", d: 2.8, hue: "ink", neg: NEG_PEOPLE, kick: "Antes 30 kg, hoy 2" },
  { p: "of native bocachico fish and a striped catfish laid on a wooden table, river fish documentary photo", d: 2.4, hue: "cold", neg: NEG_ANIMAL },
  { p: "of an empty fish market stall by a river, few fish, struggling local economy, overcast", d: 2.6, hue: "ink", kick: "Pueblos que viven del río" },
  { p: "of a Caribbean manatee swimming in clouded river water, gentle endangered animal, murky documentary frame", d: 2.8, hue: "cold", neg: NEG_ANIMAL, kick: "El manatí, en peligro crítico" },
  { p: "of a capybara standing on a muddy riverbank looking displaced, tropical wetland, overcast", d: 2.4, hue: "good", neg: NEG_ANIMAL },
  { p: "of a Magdalena river turtle on a sandy bank near eggs, fragile native species, documentary", d: 2.4, hue: "cold", neg: NEG_ANIMAL },
  { c: "of a riverbank heavily trampled and eroded by heavy animals, churned mud, collapsed edge into brown water", m: "muddy water laps at the eroded crumbling bank", d: 3.2, frames: 100, hue: "ink", kick: "Orillas pisoteadas" },
  { p: "of a drying wetland with cracked mud and dead aquatic plants, ecosystem collapse, muted tones", d: 2.6, hue: "ink" },
  { p: "of endemic aquatic plants disappearing from a riverbank, sparse vegetation, documentary detail, muted", d: 2.4, hue: "cold", kick: "Plantas que solo existen acá" },

  // ════════════ ACTO 6 — Peligro humano (15:35–18:30) ════════════
  { act: 935 },
  { im: { slug: "deaths500", gen: "of an aggressive hippo with open jaws charging in muddy water, extremely dangerous, documentary", setup: "En África matan más que los leones", impact: "500 MUERTES AL AÑO", impactAccent: "danger", hitAt: 1.1, boom: 2, neg: NEG_ANIMAL }, d: 3.8 },
  { c: "of an angry hippo charging fast across a muddy riverbank toward the camera, aggressive, spray of mud", m: "the hippo charges forward fast, mud flying, very threatening", d: 3.2, frames: 90, hue: "danger", kick: "30 km/h en tierra" },
  { st: { value: 30, suffix: " km/h", label: "alcanza un hipopótamo en tierra", eyebrow: "Y son impredecibles", accent: "danger", hue: "red" }, d: 3.6 },
  { p: "of an overturned small wooden fishing canoe near a riverbank, abandoned, ripples, ominous documentary scene", d: 2.6, hue: "danger" },
  { p: "of a rural Colombian dirt road at dawn with a large hippo crossing it, houses in the background, surreal everyday scene", d: 3, hue: "cold", kick: "Cruzan la carretera" },
  { p: "of hand-painted warning signs in Spanish about hippos near a riverside village, danger sign, tropical setting", d: 2.6, hue: "danger", neg: NEG_OBJ },
  { c: "of a hippo standing among trees at the edge of a rural farm yard at dusk, unexpected and menacing", m: "the hippo shifts its weight, ears twitching, slow menacing presence", d: 3.2, frames: 100, hue: "ink" },
  { p: "of fishermen of the Magdalena medio gathered talking with worried faces on a riverbank at dawn, group photo", d: 2.8, hue: "ink", neg: NEG_PEOPLE },
  { p: "of a child running away from a large hippo seen in the distance in a rural backyard, tense documentary moment", d: 2.6, hue: "danger", neg: NEG_PEOPLE, kick: "Chicos que salen corriendo" },
  { p: "of a small town sign reading Puerto Triunfo on a rural Colombian road, everyday documentary photo", d: 2.4, hue: "amber", neg: NEG_OBJ, kick: "Doradal · Puerto Triunfo" },
  { p: "of a hippo resting in a roadside ditch beside a rural highway, locals passing, surreal everyday scene, overcast", d: 2.8, hue: "cold", kick: "Ya es parte de la vida diaria" },

  // ════════════ ACTO 7 — Turismo + soluciones fallidas (18:30–21:20) ════════════
  { act: 1110 },
  { p: "of a tourist boat full of people taking photos of a hippo in a lake near Hacienda Napoles, sunny tourism scene", d: 2.8, hue: "good", neg: NEG_PEOPLE, kick: "Atracción turística" },
  { p: "of a small town restaurant sign with a cartoon hippo logo painted on it, rural Colombian street, casual snapshot", d: 2.4, hue: "good", neg: NEG_OBJ },
  { p: "of children near a riverbank pointing happily at a distant hippo, rural Colombian village, warm afternoon", d: 2.6, hue: "good", neg: NEG_PEOPLE, kick: "Para ellos, vecinos" },
  { p: "of a souvenir stall selling hippo plush toys and trinkets in a Colombian town, tourism documentary", d: 2.4, hue: "good", neg: NEG_OBJ },
  { dg: { eyebrow: "Las soluciones que probaron", hue: "cold", accent: "cold", slides: [
    { title: "Esterilizar", img: "panel: a vet sterilizing a sedated hippo, dollar sign, slow and dangerous, labeled" },
    { title: "Anticonceptivos por dardo", img: "panel: a dart rifle aiming at a female hippo, hormonal dart, partial success, labeled" },
    { title: "Trasladar al exterior", img: "panel: a crated hippo on a plane with arrows to Mexico and India, very expensive, labeled" },
  ] }, d: 10 },
  { c: "of veterinarians in field gear sedating a large hippo with equipment on a riverbank, tense operation", m: "vets move around the sedated hippo carefully, equipment handling", d: 3.4, frames: 110, hue: "ink", neg: NEG_PEOPLE, kick: "$20.000 por esterilización" },
  { p: "of a wildlife officer aiming a dart rifle toward a hippo in water from a boat, conservation operation", d: 2.6, hue: "ink", neg: NEG_PEOPLE },
  { p: "of a huge reinforced steel crate with a hippo inside being lifted by a crane for transport, logistics scene", d: 2.8, hue: "ink", neg: NEG_ANIMAL, kick: "$200.000 por traslado" },
  { p: "of a world map on aged paper with arrows from Colombia to Mexico and India, animal relocation plan graphic", d: 2.4, hue: "cold", neg: NEG_OBJ },
  { p: "of a frustrated official looking at rising hippo population charts in an office, documentary still", d: 2.6, hue: "ink", neg: NEG_PEOPLE, kick: "Mientras tanto, se reproducían" },

  // ════════════ ACTO 8 — 2022 invasora → plan 2026 (21:20–22:01) ════════════
  { act: 1280 },
  { p: "of an official Colombian government document in Spanish declaring the hippo an invasive species, stamped 2022, aged paper", d: 3, hue: "ink", neg: NEG_OBJ, kick: "2022: especie invasora" },
  { p: "of a hand-drawn timeline graphic on aged paper from 1981 to 2026 marking key events, archival data graphic", d: 3, hue: "amber", neg: NEG_OBJ },
  { im: { slug: "plan2026", gen: "of a tense Colombian environmental authority meeting with maps and hippo data on screens, 2026, documentary", setup: "Y para 2026, lo inevitable", impact: "UN PLAN DE CONTROL", impactAccent: "amber", hitAt: 1.0, boom: 1, neg: NEG_PEOPLE }, d: 3.6 },

  // ════════════ ACTO 9 — Eutanasia + protestas + cierre (22:01–28:03) ════════════
  { act: 1321 },
  { im: { slug: "euthan", gen: "of a stern Spanish newspaper front page about a plan to euthanize 80 hippos, somber print", setup: "Por primera vez, sin eufemismos", impact: "EUTANASIA DE 80", impactAccent: "danger", hitAt: 1.0, boom: 2, neg: NEG_OBJ }, d: 3.8 },
  { p: "of animal rights activists protesting in a Colombian city street with signs in Spanish defending hippos, crowd photo", d: 3, hue: "cold", neg: NEG_PEOPLE, kick: "La reacción: feroz" },
  { p: "of a handwritten protest sign in Spanish saying the hippos are not guilty, held up at a demonstration, gritty", d: 2.6, hue: "cold", neg: NEG_OBJ },
  { p: "of a large protest crowd in Bogota with banners, animal rights demonstration, documentary", d: 2.6, hue: "cold", neg: NEG_PEOPLE },
  { p: "of a phone screen showing an international online petition to save the hippos, social media documentary", d: 2.4, hue: "cold", neg: NEG_OBJ, kick: "Cartas de todo el mundo" },
  { p: "of a lawyer holding legal documents outside a Colombian courthouse about animal rights, documentary still", d: 2.6, hue: "ink", neg: NEG_PEOPLE },
  { p: "of scientists pointing at charts and river data in a field office discussing hippo control, documentary still", d: 2.8, hue: "ink", neg: NEG_PEOPLE, kick: "La ciencia: datos contundentes" },
  { st: { value: 1500, prefix: "+", label: "ejemplares en menos de 2 décadas si no se actúa", eyebrow: "La proyección", accent: "danger", hue: "red" }, d: 4 },
  { p: "of weary Magdalena fishermen standing by their boats demanding action, worried determined faces, overcast", d: 2.8, hue: "ink", neg: NEG_PEOPLE, kick: "Los pescadores: acción urgente" },
  { c: "of hippos floating calmly submerged in the brown Magdalena river during daytime, indifferent, peaceful", m: "the hippos drift slowly, only eyes above water, gentle current", d: 3.6, frames: 110, hue: "cold", kick: "Indiferentes al debate" },
  { p: "of hippos at dusk expanding further along a new stretch of river, exploring new territory, documentary", d: 2.8, hue: "cold", kick: "Se expanden hacia el norte" },
  { p: "of a distant town reporting a hippo sighting for the first time, rural Colombia, surprised locals, overcast", d: 2.6, hue: "amber", neg: NEG_PEOPLE },
  // JOURNEY B — la línea de tiempo Escobar → hoy
  { jy: { eyebrow: "Cómo un capricho se volvió crisis", title: "1981 → hoy", accent: "#A9794A",
    world: { slug: "jy_time_world", gen: "of a long aged sepia timeline parchment background with faint year marks, archival, room to travel left to right" },
    wps: [
      { slug: "jy_t_import", gen: "of four hippos arriving at a 1980s private zoo pond, faded archival photo", label: "1981 · Llegan 4", num: "1", x: 500, y: 800, z: 0.65, dwell: 2.4, travel: 1.5, neg: NEG_ANIMAL },
      { slug: "jy_t_death", gen: "of a Medellin rooftop with police in 1993, somber faded news photo", label: "1993 · Muere Escobar", num: "2", x: 1500, y: 500, z: 0.45, dwell: 2.4, travel: 1.6, neg: NEG_PEOPLE },
      { slug: "jy_t_escape", gen: "of hippos walking out of an abandoned estate toward a river, dusk, faded", label: "~2000 · Escapan", num: "3", x: 2550, y: 1000, z: 0.8, dwell: 2.4, travel: 1.6, neg: NEG_ANIMAL },
      { slug: "jy_t_today", gen: "of a crowded river full of more than two hundred hippos today, aerial documentary", label: "2026 · +200", num: "4", x: 3600, y: 540, z: 0.5, dwell: 2.8, travel: 1.6, neg: NEG_ANIMAL },
    ] }, d: 16 },
  { p: "of the Hacienda Napoles today turned into a colorful theme park with visitors, tourism documentary photo", d: 2.8, hue: "good", neg: NEG_PEOPLE, kick: "Hoy: un parque temático" },
  { p: "of a faded portrait of Pablo Escobar dissolving into archival texture, somber legacy imagery, sun-faded", d: 2.8, hue: "ink", neg: NEG_PEOPLE, kick: "Su legado más resistente" },
  { im: { slug: "legacy4", gen: "of four hippo silhouettes in a misty river at dawn, reflective melancholic documentary", setup: "No fue su fortuna ni su cartel. Fueron", impact: "CUATRO HIPOPÓTAMOS", impactAccent: "amber", hitAt: 1.2, boom: 0, neg: NEG_ANIMAL }, d: 4 },
  { c: "of a newborn hippo calf surfacing beside its mother in the Magdalena river at dawn, new life, soft light", m: "the tiny calf bobs up next to the mother, gentle ripples, dawn glow", d: 3.8, frames: 120, hue: "good", kick: "Y nace otra cría" },
  { p: "of a mother hippo nudging her newborn calf in calm dawn water, tender, soft golden light, documentary", d: 2.8, hue: "good", neg: NEG_ANIMAL },
  { p: "of lawyers and activists debating outside a building while a hippo floats in a river, split worlds, documentary", d: 2.6, hue: "cold", neg: NEG_PEOPLE, kick: "Mientras los humanos discuten" },
  { c: "of a wide melancholic shot of the Magdalena river at sunset with hippo silhouettes in the distance, reflective", m: "the river glows at sunset, hippo silhouettes drift slowly, water shimmering", d: 4, frames: 120, hue: "amber", kick: "La invasión se acelera" },
  { p: "of a single hippo silhouette under a tropical sunset on the Magdalena river, lonely reflective closing frame", d: 3, hue: "amber", kick: "Un final sin escribir" },
];

// ── construir beats con timing auto-secuenciado ──────────────────────────────
let clock = 0;
let id = 0;
const beats = [];
const fluxPrompts = []; // fotos b-roll + imágenes de impact/journey (FLUX)
const stillPrompts = []; // imágenes base de clips (FLUX), se animan después
const diagPrompts = []; // láminas gpt-image (gen_images.mjs)
const nid = (pfx) => `${pfx}${String(++id).padStart(3, "0")}`;
const addFlux = (name, prompt) => fluxPrompts.push({ name, prompt });
let curAct = 0;
const ACTS = [0, 33, 146, 272, 454, 698, 935, 1110, 1280, 1321];
const add = (b) => { b._act = curAct; beats.push(b); };

for (const row of T) {
  if (row.act != null) { clock = row.act; curAct = row.act; continue; }
  const start = +clock.toFixed(2);

  if (row.talk) { add({ id: nid("t"), start, dur: row.d, kind: "talk" }); clock += row.d; continue; }

  if (row.st) {
    const s = row.st;
    add({ id: nid("s"), start, dur: row.d, kind: "stat", value: s.value, prefix: s.prefix, suffix: s.suffix, decimals: s.decimals, label: s.label, eyebrow: s.eyebrow, accent: s.accent, hue: vhue(s.hue) });
    clock += row.d; continue;
  }

  if (row.im) {
    const im = row.im;
    const name = `hip_im_${im.slug}`;
    addFlux(name, wrap(im.gen, im.neg || NEG_OBJ));
    add({ id: nid("i"), start, dur: row.d, kind: "impact", image: `img/${name}.png`, setup: im.setup, impact: im.impact, impactAccent: im.impactAccent, hitAt: im.hitAt, boom: im.boom });
    clock += row.d; continue;
  }

  if (row.dg) {
    const slides = row.dg.slides.map((s, i) => {
      const name = `hip_dg_${id + 1}_${i + 1}`;
      diagPrompts.push({ name, prompt: diagWrap(s.img) });
      return { image: `img/${name}.png`, title: s.title };
    });
    add({ id: nid("d"), start, dur: row.d, kind: "diagram", eyebrow: row.dg.eyebrow, hue: vhue(row.dg.hue), accent: row.dg.accent, slides });
    clock += row.d; continue;
  }

  if (row.jy) {
    const jy = row.jy;
    const worldName = `hip_${jy.world.slug}`;
    addFlux(worldName, wrap(jy.world.gen, NEG_OBJ));
    const wps = jy.wps.map((w) => {
      const wn = `hip_${w.slug}`;
      addFlux(wn, wrap(w.gen, w.neg || NEG_OBJ));
      return { x: w.x, y: w.y, z: w.z ?? 0.5, image: `img/${wn}.png`, label: w.label, num: w.num, dwell: w.dwell, travel: w.travel };
    });
    add({ id: nid("j"), start, dur: row.d, kind: "journey", eyebrow: jy.eyebrow, title: jy.title, accent: jy.accent, worldImage: `img/${worldName}.png`, waypoints: wps });
    clock += row.d; continue;
  }

  if (row.c) {
    const name = `hip_${nid("c")}`;
    stillPrompts.push({ name, prompt: wrap(row.c, row.neg || NEG_ANIMAL) });
    const b = { id: name, start, dur: row.d, kind: "raw", src: `vid/${name}.mp4`, hue: vhue(row.hue), gen: { type: "clip", image: name, prompt: row.m, frames: row.frames || 110 } };
    if (row.kick) b.kicker = row.kick;
    add(b);
  } else {
    const name = `hip_${nid("p")}`;
    addFlux(name, wrap(row.p, row.neg || NEG_OBJ));
    const b = { id: name, start, dur: row.d, kind: "raw", src: `img/${name}.png`, hue: vhue(row.hue), gen: { type: "image", name, prompt: wrap(row.p, row.neg || NEG_OBJ) } };
    if (row.kick) b.kicker = row.kick;
    add(b);
  }
  clock += row.d;
}

// ── densidad: estirar holds de las tomas (raw) para llenar cada acto ─────────
// journey/diagram/stat/impact conservan su dur; las fotos/clips se estiran (clamp
// 2.4–7s) para que casi siempre haya b-roll detrás del avatar. Preserva el orden.
const actEnds = {};
for (let i = 0; i < ACTS.length; i++) actEnds[ACTS[i]] = ACTS[i + 1] ?? 1684;
const FIXED = new Set(["journey", "diagram", "stat", "impact"]);
for (const a of ACTS) {
  const grp = beats.filter((b) => b._act === a);
  if (!grp.length) continue;
  const A = actEnds[a] - a;
  const fixedSum = grp.filter((b) => FIXED.has(b.kind)).reduce((s, b) => s + b.dur, 0);
  const rawW = grp.filter((b) => !FIXED.has(b.kind)).reduce((s, b) => s + b.dur, 0) || 1;
  const scale = Math.max(0, A - fixedSum) / rawW;
  let t = a;
  for (const b of grp) {
    if (!FIXED.has(b.kind)) b.dur = Math.max(2.4, Math.min(7, +(b.dur * scale).toFixed(2)));
    b.start = +t.toFixed(2);
    t += b.dur;
  }
}
beats.forEach((b) => delete b._act);
beats.sort((x, y) => x.start - y.start);

const out = { video: "hipos", avatar: "hipos_opt.mp4", beats };
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/hipos.json", JSON.stringify(out, null, 2));
// FLUX (fotos + impact + journey) ya incluye lo que beatsheet derivaría de gen.image,
// pero para impact/journey beatsheet NO deriva → mando una lista FLUX completa propia.
fs.writeFileSync("public/img/prompts_hipos_all.json", JSON.stringify(fluxPrompts, null, 2));
fs.writeFileSync("public/img/prompts_hipos_stills.json", JSON.stringify(stillPrompts, null, 2));
fs.writeFileSync("public/img/prompts_hipos_diag.json", JSON.stringify(diagPrompts, null, 2));

const n = (k) => beats.filter((b) => b.kind === k).length;
console.log(`beats: ${beats.length}  ·  raw(foto+clip): ${n("raw")}  ·  stat: ${n("stat")}  ·  impact: ${n("impact")}  ·  journey: ${n("journey")}  ·  diagram: ${n("diagram")}`);
console.log(`FLUX a generar: ${fluxPrompts.length}  ·  stills(clips): ${stillPrompts.length}  ·  láminas: ${diagPrompts.length}`);
console.log(`clock final: ${clock.toFixed(1)}s / 1684s  ·  cobertura ~${Math.round((beats.reduce((a, b) => a + (b.dur || 0), 0) / 1684) * 100)}%`);
console.log("→ beatsheet/hipos.json · prompts_hipos_all.json · prompts_hipos_stills.json · prompts_hipos_diag.json");
