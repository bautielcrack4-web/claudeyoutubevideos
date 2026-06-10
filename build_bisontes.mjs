// build_bisontes.mjs — construye beatsheet/bisontes.json + prompts_bisontes_diag.json
// desde una tabla compacta de beats. Auto-calcula dur = (start del próximo) - start,
// salvo override por beat. Mantiene FLUX (fotos/clips) y gpt-image-2 (diagramas) separados.
import fs from "fs";

const AVATAR = "bisontes_opt.mp4";
const END = 1530.5;

// ── wrappers de prompt ───────────────────────────────────────────────────────
const REAL =
  "realistic imperfect handheld camera angle, slightly tilted frame, practical documentary look, no cinematic lighting, no perfect studio setup, natural video compression, low-resolution YouTube documentary screenshot look, not staged, ultra realistic";
const NEG =
  "Negative prompt: clean studio photo, cinematic lighting, overly saturated colors, cartoon, CGI, 3D render, luxury advertisement, sharp perfect text, dramatic shadows, watermark, logo overlay, perfect symmetrical face, extra fingers, distorted hands, fantasy style, illustration, modern clothing.";
// foto realista
const ph = (desc, light = "natural soft overcast northern daylight, muted cold colors") =>
  `Realistic handheld 16:9 documentary-style video frame of ${desc}. ${light}. ${REAL}. ${NEG}`;
// foto de archivo vintage (historia)
const arch = (desc) =>
  `Realistic handheld 16:9 documentary-style video frame of a faded vintage sepia archival photograph of ${desc}, scratched grain, sun-faded yellowed tones, late 1800s. ${REAL}. ${NEG}`;

// diagrama gpt-image-2 (lámina editorial artesanal, esquina sup-der libre)
const dg = (panel) =>
  `Crear una infografía horizontal 16:9, estilo ilustración hecha a mano pero muy profesional, limpia, premium y editorial — lámina artesanal moderna, NO póster escolar. ${panel} Fondo marfil claro con textura de papel muy sutil, alto contraste, líneas marrón oscuro o casi negras, acentos en verde oliva apagado y terracota apagado, estética botánica/archivo vintage. Dejá COMPLETAMENTE LIBRE la esquina superior derecha (limpia, luminosa, sin texto ni dibujos) para colocar después el avatar. Composición minimalista, hermosa, MUY clara, mucho espacio respirable, pocos bloques grandes, números grandes, texto mínimo en español, ilustraciones de tinta fina y acuarela suave, flechas elegantes, se entiende en 1 segundo. Evitá saturación, íconos de más, textos chicos, look escolar o infantil.`;

// recolector de diagramas (van a archivo aparte para gen_images.mjs / gpt-image-2)
const diagPrompts = [];
const addDiag = (name, panel) => {
  if (!diagPrompts.find((d) => d.name === name)) diagPrompts.push({ name, prompt: dg(panel), size: "1536x1024" });
  return `img/${name}.png`;
};

// ── helpers de beat ──────────────────────────────────────────────────────────
let auto = 0;
const id = (p) => `${p}${String(++auto).padStart(3, "0")}`;
const beats = [];

// raw foto
function P(start, name, desc, { hue = "cold", kicker, light, dur, lead = 0 } = {}) {
  beats.push({ id: name, start: +(start - lead).toFixed(2), kind: "raw", src: `img/${name}.png`, hue, ...(kicker ? { kicker } : {}),
    gen: { type: "image", name, prompt: light === "arch" ? arch(desc) : ph(desc, light) }, ...(dur ? { _dur: dur } : {}) });
}
// raw clip (animado)
function C(start, name, desc, { hue = "cold", kicker, frames = 110, dur, lead = 0, prompt } = {}) {
  beats.push({ id: name, start: +(start - lead).toFixed(2), kind: "raw", src: `vid/${name}.mp4`, hue, ...(kicker ? { kicker } : {}),
    gen: { type: "clip", image: name, prompt: prompt || desc, frames }, _img: { name, prompt: ph(desc) }, ...(dur ? { _dur: dur } : {}) });
}
function IMPACT(start, o) {
  // si la imagen de fondo es un bi_im_* propio, registrala para generar (FLUX)
  if (o.image && /^img\/bi_im_/.test(o.image) && o.bgPrompt) {
    const nm = o.image.replace(/^img\//, "").replace(/\.png$/, "");
    beats.push({ id: nm + "_gen", start: 999, kind: "talk", _skipcue: true, gen: { type: "image", name: nm, prompt: ph(o.bgPrompt, o.bgLight) } });
  }
  const { bgPrompt, bgLight, ...rest } = o;
  beats.push({ id: id("i"), start, kind: "impact", _dur: o.dur || 3.6, ...rest });
}
function STAT(start, o) { beats.push({ id: id("s"), start, kind: "stat", _dur: o.dur || 4.2, ...o }); }
function QUOTE(start, o) { beats.push({ id: id("q"), start, kind: "quote", _dur: o.dur || 3.4, ...o }); }
function DIAG(start, o) {
  const slides = o.slides.map((s) => ({ image: addDiag(s.name, s.panel), title: s.title }));
  beats.push({ id: id("d"), start, kind: "diagram", _dur: o.dur || 9.5, eyebrow: o.eyebrow, hue: o.hue || "amber", accent: o.accent || "accent", slides });
}
function JOURNEY(start, o) { beats.push({ id: id("j"), start, kind: "journey", _dur: o.dur || 22, eyebrow: o.eyebrow, title: o.title, accent: o.accent || "accent", waypoints: o.waypoints, ...(o.worldImage ? { worldImage: o.worldImage } : {}) }); }

// =============================================================================
// ACTO 1 — HOOK (0–53): el avión, los cajones, el valle
// =============================================================================
C(0.0, "bi_c_herc_land", "a 1980s Canadian military C-130 Hercules transport plane landing on a rough dirt gravel airstrip in a vast empty northern wilderness, propellers spinning, dust kicked up", { hue: "amber", kicker: "Junio de 1980", frames: 120 });
C(6.8, "bi_c_crates", "large reinforced wooden crates strapped down inside the cargo hold of a military transport plane, a live bison visible through the slats, dim industrial light", { hue: "amber", frames: 100 });
P(11.0, "bi_p_crate_eye", "extreme close-up of a sedated bison's eye looking out through the wooden slats of a shipping crate, breath fogging", { hue: "amber" });
P(14.1, "bi_p_valley_aerial", "a sweeping aerial view of a remote roadless northern valley in Canada, endless boreal forest, winding river, low mountains, no human structures", { hue: "cold", kicker: "Territorios del Noroeste" });
P(18.5, "bi_p_valley2", "a wide empty subarctic river valley with sparse spruce trees and wetlands under a grey sky, utterly remote", { hue: "cold" });
IMPACT(23.2, { image: "img/bi_im_hook.png", setup: "Nadie había visto un bisonte salvaje acá en", impact: "MÁS DE 100 AÑOS", impactAccent: "amber", hitAt: 1.2, boom: 2, dur: 5.2, bgPrompt: "a vast empty remote northern valley at dawn with no animals, mist over the river, profound silence", bgLight: "cold dawn light" });
P(28.4, "bi_p_bison_snow_hook", "a single huge dark wood bison standing alone in falling snow in a vast empty valley, seen from behind, tiny against the landscape", { hue: "cold" });
P(33.0, "bi_p_biologists_watch", "two 1980s field biologists in olive parkas watching through binoculars from a distance across a northern meadow, documentary still", { hue: "amber" });
P(38.5, "bi_p_herd_arctic", "a small group of dark wood bison scattered across a frozen arctic meadow at dusk, breath visible, cinematic distance", { hue: "cold" });
P(45.0, "bi_p_bison_closeup_hook", "a powerful close portrait of a massive dark wood bison with thick woolly winter coat and curved horns, snow on its fur, staring at camera", { hue: "cold" });

// =============================================================================
// ACTO 2 — ABUNDANCIA / la subespecie (53–122)
// =============================================================================
P(53.3, "bi_p_oldmap", "an old yellowed map of North America from the 1800s spread on a wooden table, hand drawn, lit by warm lamp", { hue: "amber", light: "warm indoor archival lamp light", kicker: "Retrocedamos un siglo" });
C(61.1, "bi_c_herd_horizon", "an enormous herd of bison stretching across a 19th century great plains horizon, thousands of animals darkening the grassland to the edge of view, dust haze", { hue: "amber", frames: 120, light: "arch" });
DIAG(73.8, { eyebrow: "Antes de la colonización", hue: "amber", accent: "good", slides: [
  { name: "dg_bi_range", title: "30–60 millones de bisontes", panel: "Un mapa simple y elegante de Norteamérica con una gran mancha de color verde oliva cubriendo casi todo el continente, una manada ilustrada de bisontes, y un número enorme '30–60 MILLONES'. La mayor concentración de mamíferos terrestres del planeta." },
] });
P(85.0, "bi_p_two_bison_compare", "two bison side by side in a misty boreal forest, one larger and much darker than the other, comparison framing", { hue: "cold" });
DIAG(92.0, { eyebrow: "Una subespecie aparte", hue: "cold", accent: "cold", dur: 7.4, slides: [
  { name: "dg_bi_subspecies", title: "Bisonte de bosque vs. de llanura", panel: "Comparación lado a lado de dos siluetas de bisonte: a la izquierda el 'bisonte de bosque' (Wood Bison) MÁS GRANDE, más oscuro, joroba más adelantada, pelaje grueso, con el rótulo 'frío extremo · bosque boreal · +1000 kg'; a la derecha el 'bisonte de llanura' más chico y claro. Flecha que marca las diferencias de tamaño." },
] });
C(99.4, "bi_c_woodbison_forest", "a giant dark wood bison walking slowly through a dense boreal forest of birch and black pine, ferns, dappled cold light, half hidden among trees", { hue: "cold", kicker: "El bisonte de bosque", frames: 110 });
P(106.2, "bi_p_woodbison_size", "a massive wood bison towering next to a small birch tree for scale, the largest land animal in North America, low angle, imposing", { hue: "cold" });
P(110.5, "bi_p_bison_scale_man", "a vintage photo of a huge dark bison bull beside a tiny human figure for scale, archival", { hue: "amber", light: "arch" });
P(113.8, "bi_p_swamp_forest", "a frozen swampy boreal wetland with black pines and birches, mist over icy pools, the kind of place no hunter would enter", { hue: "cold" });

// =============================================================================
// ACTO 3 — LA MATANZA (122–268)
// =============================================================================
IMPACT(122.7, { image: "img/bi_im_matanza.png", setup: "Y entonces vino", impact: "LA MATANZA", impactAccent: "danger", hitAt: 1.0, boom: 2, dur: 4.0, bgPrompt: "a vintage sepia field of scattered bison bones and skulls on an empty prairie, grim", bgLight: "arch" });
P(126.8, "bi_p_bones_pile", "an enormous mountain of bison skulls and bones from the 1870s, two men in old clothes standing on top, infamous archival photograph, sepia", { hue: "red", light: "arch", kicker: "1870–1890" });
C(133.0, "bi_c_hunters_rifles", "19th century commercial buffalo hunters lying in tall prairie grass aiming long Sharps rifles at a distant herd, smoke from a rifle shot, sepia archival", { hue: "red", light: "arch", frames: 100 });
DIAG(138.7, { eyebrow: "El rifle Sharps", hue: "red", accent: "danger", dur: 6.4, slides: [
  { name: "dg_bi_sharps", title: "Mataban a 500 metros", panel: "Diagrama de un rifle Sharps de largo alcance dibujado en detalle con una línea de trayectoria punteada que cruza hasta un bisonte lejano, con el rótulo '500 m' y 'sin que la manada se diera cuenta'. Estilo lámina técnica vintage." },
] });
C(149.5, "bi_c_train_prairie", "a 19th century steam train crossing the open great plains, stacks of bison hides piled in open rail cars, sepia archival motion", { hue: "red", light: "arch", frames: 110, kicker: "Pieles a 2–3 dólares" });
P(160.0, "bi_p_train_shooting", "passengers leaning out of 1800s train windows firing rifles at bison from the moving train for sport, sepia archival photograph", { hue: "red", light: "arch" });
P(165.0, "bi_p_hides_stack", "thousands of stacked bison hides piled in a frontier rail yard, men posing, vintage archival sepia photo", { hue: "red", light: "arch" });
C(168.8, "bi_c_carcasses_sun", "rotting skinned bison carcasses left scattered across an empty prairie under harsh sun, vultures, grim sepia archival scene", { hue: "red", light: "arch", frames: 100 });
DIAG(176.0, { eyebrow: "No fue casualidad", hue: "red", accent: "danger", dur: 6.0, slides: [
  { name: "dg_bi_policy", title: "Una política deliberada", panel: "Diagrama de causa y efecto: a la izquierda un bisonte tachado con una X, una flecha grande hacia la derecha que apunta a la silueta de un campamento indígena de las llanuras, con el texto 'destruir al bisonte = destruir a los pueblos indígenas'. Sobrio, sin sensacionalismo." },
] });
P(182.3, "bi_p_sheridan", "a stern 1870s US army general in uniform, formal vintage studio portrait, sepia archival", { hue: "red", light: "arch" });
QUOTE(196.2, { image: "img/bi_p_sheridan2.png", eyebrow: "El general Philip Sheridan", text: "Hicieron más para *someter a las tribus* en dos años que el ejército en treinta", accent: "danger", hue: "red", dur: 11.0, fontSize: 78 });
// imagen para la cita
beats.push({ id: "bi_p_sheridan2", start: 999, kind: "raw", src: "img/bi_p_sheridan2.png", hue: "red", _skipcue: true, gen: { type: "image", name: "bi_p_sheridan2", prompt: arch("a grim empty great plains landscape strewn with bison bones at dusk") } });
STAT(207.8, { value: 60, suffix: " millones", label: "se redujeron a unos pocos cientos", eyebrow: "En dos décadas", accent: "danger", hue: "red", dur: 7.0 });
P(215.6, "bi_p_hornaday", "a Victorian era zoologist in a museum surrounded by mounted bison specimens and skulls, 1889, sepia archival photograph", { hue: "amber", light: "arch", kicker: "Censo de 1889" });
STAT(222.0, { value: 1191, label: "bisontes vivos en todo el continente", eyebrow: "William Hornaday, 1889", accent: "danger", hue: "amber", dur: 5.4 });
P(227.4, "bi_p_captive_bison", "a few sad bison behind a wooden fence in a small 1800s enclosure, last survivors, sepia archival", { hue: "amber", light: "arch" });
P(237.2, "bi_p_dene_people", "a vintage sepia portrait of northern Dene indigenous people of the Mackenzie region in the late 1800s, dignified, archival photograph", { hue: "amber", light: "arch", kicker: "Los pueblos Dene" });
P(247.0, "bi_p_dene_camp", "a late 1800s northern indigenous camp by a river in the boreal north, tipis and drying racks, sepia archival", { hue: "amber", light: "arch" });
P(256.4, "bi_p_elder_child", "a vintage photo of an indigenous elder telling a story to a child by a fire, warm sepia archival, generational", { hue: "amber", light: "arch" });
P(262.0, "bi_p_empty_plain_dusk", "an empty silent great plain at dusk with not a single animal in sight, melancholic, faded archival", { hue: "amber", light: "arch" });

// =============================================================================
// ACTO 4 — REDESCUBRIMIENTO (268–368)
// =============================================================================
P(268.1, "bi_p_museum_bones", "bison skeletons and skulls displayed in a dim natural history museum, 'extinct' feeling, cold light", { hue: "cold", kicker: "Se creía extinto" });
P(278.0, "bi_p_museum_label", "an old museum specimen label reading 'Bison' in faded typewriter text pinned beside mounted bones, macro archival", { hue: "cold" });
C(288.2, "bi_c_floatplane_1957", "a 1950s float plane flying low over a vast swampy boreal wilderness in northern Alberta, seen from inside the cockpit, wing visible", { hue: "amber", kicker: "1957", frames: 110, light: "vintage 1950s color film, faded" });
C(296.0, "bi_c_aerial_herd_spot", "aerial view from a small plane spotting a herd of dark bison moving through flooded forest below, faded 1950s color film look", { hue: "amber", frames: 110 });
P(308.0, "bi_p_dark_herd_trees", "a herd of unusually dark large bison half hidden among boreal trees, seen from above, mysterious", { hue: "cold" });
C(319.3, "bi_c_biologists_wade", "1950s biologists in waders walking for hours through a flooded boreal forest, water up to their knees, swatting mosquitoes, faded film", { hue: "amber", frames: 110, light: "faded 1950s color film" });
P(331.4, "bi_p_bison_closeup_discover", "a close look at a massive dark wood bison standing in a misty swamp, biologists' point of view, awe", { hue: "cold" });
DIAG(340.0, { eyebrow: "La prueba", hue: "cold", accent: "cold", dur: 7.6, slides: [
  { name: "dg_bi_skull", title: "Mediciones craneales", panel: "Una lámina tipo cuaderno de campo con dos cráneos de bisonte dibujados de perfil, líneas de medición y compases, comparando el cráneo de museo con el cráneo vivo hallado; un cartelito '¡Es el bisonte de bosque!'. Estilo ilustración científica artesanal." },
] });
P(348.0, "bi_p_skull_measure", "a scientist's hands measuring a bison skull with calipers on a workbench, field notes, documentary macro", { hue: "amber", light: "warm workshop light" });
IMPACT(355.0, { image: "img/bi_im_200.png", setup: "Quedaban apenas", impact: "200 ANIMALES", impactAccent: "amber", hitAt: 1.0, boom: 1, dur: 5.0, bgPrompt: "a small herd of dark wood bison standing together in a misty boreal clearing, the last survivors of their kind" });
P(360.5, "bi_p_small_herd_hope", "a small herd of about a dozen dark bison standing together in a clearing, the last of their kind, soft hopeful light", { hue: "amber" });

// =============================================================================
// ACTO 5 — EL PLAN / ELK ISLAND (368–489)
// =============================================================================
P(368.1, "bi_p_planning_room", "1960s government biologists around a table with maps and documents planning a wildlife program, archival office, warm light", { hue: "amber", light: "warm indoor archival light", kicker: "Un plan a largo plazo" });
P(377.0, "bi_p_capture_corral", "bison being herded into a wooden capture corral by handlers, dust, mid century, faded color film", { hue: "amber" });
P(384.7, "bi_p_elk_island_sign", "a weathered wooden national park sign reading 'Elk Island National Park' at the edge of an Alberta aspen forest", { hue: "amber", kicker: "Elk Island, Alberta" });
C(391.3, "bi_c_fenced_reserve", "a fenced wildlife reserve with bison grazing in golden aspen parkland, long page wire fence in foreground", { hue: "amber", frames: 100 });
P(401.9, "bi_p_breeding_calf", "a healthy bison cow with a young calf in a clean grassy reserve, soft morning light, hopeful", { hue: "amber" });
DIAG(425.9, { eyebrow: "El gran problema", hue: "red", accent: "danger", dur: 9.0, slides: [
  { name: "dg_bi_disease", title: "El norte ya estaba ocupado", panel: "Diagrama: silueta de bisonte de llanura con dos etiquetas rojas 'tuberculosis bovina' y 'brucelosis', una flecha hacia un bisonte de bosque sano con un símbolo de contagio. Texto 'si los soltaban en zona contaminada, los perdían otra vez'." },
  { name: "dg_bi_cleanvalley", title: "Necesitaban un valle limpio", panel: "Un mapa simple del oeste de Canadá señalando con un pin un valle aislado rodeado de montañas y ríos, con marcas 'sin enfermedades · sin contacto · solo por avión'. Limpio y claro." },
] });
P(439.8, "bi_p_remote_valley_find", "a pristine isolated river valley surrounded by mountains in the southern Northwest Territories, untouched wetlands and grass, aerial", { hue: "cold" });
P(450.0, "bi_p_liard_river", "the wide Liard river winding through a remote subarctic valley with spruce forest, grey northern light", { hue: "cold", kicker: "Valle del Río Liard" });
P(457.2, "bi_p_nahanni_butte", "a tiny remote settlement of a few cabins beside a river under a mountain in the far north, only reachable by plane", { hue: "cold", kicker: "Nahanni Butte" });
C(463.5, "bi_c_wetlands_paradise", "a lush green subarctic wetland meadow stretching to the horizon, perfect bison habitat, soft summer light, drifting clouds", { hue: "amber", frames: 110 });
QUOTE(472.5, { image: "img/bi_p_empty_valley_silence.png", eyebrow: "El último bisonte se fue en 1880", text: "Más de un siglo de *silencio*", accent: "cold", hue: "cold", dur: 12.0, fontSize: 96 });
beats.push({ id: "bi_p_empty_valley_silence", start: 999, kind: "raw", src: "img/bi_p_empty_valley_silence.png", hue: "cold", _skipcue: true, gen: { type: "image", name: "bi_p_empty_valley_silence", prompt: ph("an utterly silent empty northern valley at dawn, mist over the river, no animals, profound stillness") } });

// =============================================================================
// ACTO 6 — EL OPERATIVO (489–685)
// =============================================================================
IMPACT(489.0, { image: "img/bi_im_1980.png", setup: "El plan se ejecutó en", impact: "JUNIO DE 1980", impactAccent: "amber", hitAt: 0.9, boom: 1, dur: 3.4, bgPrompt: "a Canadian military C-130 Hercules plane on a remote tarmac being loaded with large crates, 1980, faded color film", bgLight: "faded 1980s color film daylight" });
STAT(492.4, { value: 28, label: "bisontes seleccionados", eyebrow: "Elk Island, Alberta", accent: "accent", hue: "amber", dur: 5.0 });
P(497.5, "bi_p_selected_bison", "a group of young healthy bison cows in a holding pen at Elk Island, several visibly pregnant, faded 1980 color film", { hue: "amber" });
P(504.0, "bi_p_pregnant_cow", "a pregnant bison cow standing calmly in a corral, soft 1980s documentary film grain", { hue: "amber" });
C(517.3, "bi_c_loading_crate", "handlers guiding a single bison into a tall reinforced wooden shipping crate through a chute, 1980 documentary, dust and effort", { hue: "amber", frames: 110, kicker: "Uno por cajón" });
DIAG(541.6, { eyebrow: "Cajones a medida", hue: "amber", accent: "amber", dur: 9.0, slides: [
  { name: "dg_bi_crate", title: "Más de 1000 kg cada uno", panel: "Diagrama técnico tipo plano de un cajón de madera reforzado de transporte con un bisonte adentro de perfil, flechas señalando 'respiraderos calibrados', 'refuerzos laterales', y el peso '+1000 kg'. Estilo blueprint artesanal vintage." },
] });
C(553.4, "bi_c_crates_truck", "wooden crates with bison inside being loaded onto flatbed trucks by a crew, 1980, faded color documentary film", { hue: "amber", frames: 100 });
C(559.5, "bi_c_hercules_ground", "a Canadian Forces C-130 Hercules transport plane on a tarmac with its rear cargo ramp open, crew loading large crates, 1980", { hue: "amber", frames: 110, kicker: "Hércules C-130" });
P(569.7, "bi_p_operation_crew", "a 1980 crew of veterinarians, biologists, military pilots and indigenous guides standing together by the cargo plane, group documentary photo", { hue: "amber" });
P(580.0, "bi_p_logistics_notes", "hands over detailed 1980 logistics paperwork and checklists on a clipboard beside the plane, documentary macro", { hue: "amber", light: "warm indoor light" });
// Journey: la ruta del vuelo
JOURNEY(597.8, { eyebrow: "El vuelo", title: "De Elk Island al Valle del Liard", accent: "amber", dur: 24, worldImage: addDiag("dg_bi_routemap", "Un mapa dibujado a mano del oeste de Canadá en estilo cartográfico vintage marfil: provincias de Alberta, Columbia Británica y los Territorios del Noroeste, cadenas de montañas, ríos, y una línea de trayectoria punteada de avión que sube desde el sur (Elk Island) hasta un valle remoto en el norte (Nahanni Butte). Sin texto encima de la esquina superior derecha."),
  waypoints: [
    { x: 0.22, y: 0.78, z: 0, num: "1", label: "Elk Island", sub: "Alberta", image: "img/bi_p_elk_island_sign.png", dwell: 2.6, travel: 1.8 },
    { x: 0.38, y: 0.6, z: 1, num: "2", label: "Llanuras de Alberta", image: "img/bi_p_oldmap.png", dwell: 2.2, travel: 1.8 },
    { x: 0.5, y: 0.46, z: 0, num: "3", label: "Bosques de B.C.", image: "img/bi_p_swamp_forest.png", dwell: 2.4, travel: 1.8 },
    { x: 0.64, y: 0.34, z: 1, num: "4", label: "Montañas y ríos", image: "img/bi_p_valley_aerial.png", dwell: 2.4, travel: 1.8 },
    { x: 0.8, y: 0.2, z: 0, num: "5", label: "Pista de tierra", sub: "Nahanni Butte", image: "img/bi_p_nahanni_butte.png", dwell: 2.8, travel: 1.6 },
  ] });
P(622.0, "bi_p_dirt_strip", "a rough flattened gravel airstrip cut into the boreal forest, no control tower, no terminal, a transport plane at the far end, grey northern light", { hue: "cold", kicker: "Sin torre, sin combustible" });
C(633.8, "bi_c_open_crates", "crew opening a wooden bison crate on a remote dirt strip in cold northern light, a dark bison hesitating at the open door, 1980 documentary", { hue: "cold", frames: 110 });
C(641.3, "bi_c_bison_step_out", "a massive dark wood bison stepping cautiously out of a shipping crate onto wild northern ground for the first time, looking around confused, faded 1980 film", { hue: "cold", frames: 110, kicker: "28 animales bajaron" });
P(655.7, "bi_p_bison_frozen", "a bison standing completely still at the mouth of an open crate, hesitating, not moving, cold grey light", { hue: "cold" });
C(661.9, "bi_c_bison_run_forest", "a dark bison charging away from the crates straight into the boreal forest, disappearing among spruce trees, motion blur, 1980 film", { hue: "cold", frames: 100 });
C(670.5, "bi_c_cow_river_drink", "a pregnant bison cow standing at the edge of a northern river drinking slowly then staring at the water, quiet golden hour, emotional", { hue: "amber", frames: 120, kicker: "Una hembra preñada" });
P(685.0, "bi_p_biologists_distance2", "1980 biologists watching the released bison from far away across a meadow with binoculars, anxious, faded film", { hue: "cold" });

// =============================================================================
// ACTO 7 — CONTRA TODO PRONÓSTICO / EXPLOSIÓN (685–886)
// =============================================================================
P(695.9, "bi_p_failed_reintro", "a lone disoriented animal in a harsh empty landscape, bleak, symbolic of failed reintroductions, cold muted tones", { hue: "cold" });
STAT(710.3, { value: 50, suffix: "%", label: "era la esperanza más realista de supervivencia", eyebrow: "Primeros dos inviernos", accent: "cold", hue: "cold", dur: 7.8 });
IMPACT(718.1, { image: "img/bi_im_supero.png", setup: "Lo que pasó", impact: "SUPERÓ TODO", impactAccent: "good", hitAt: 1.0, boom: 1, dur: 4.1, bgPrompt: "a strong wood bison standing defiantly in deep snow during a blizzard, surviving against the odds, dramatic" });
C(722.2, "bi_c_winter_storm", "dark wood bison standing in a brutal subarctic blizzard, snow up to their chests, minus 40 degrees, wind whipping snow, survival", { hue: "cold", frames: 120, kicker: "−40 °C" });
P(731.0, "bi_p_wolves_circle", "a pack of grey wolves circling at the edge of a snowy meadow watching a bison herd at dusk, tense, cold", { hue: "cold" });
C(738.5, "bi_c_sedge_dig", "a bison sweeping its head and horns to clear snow and reach tough sedge grass in a subarctic wetland, breath steaming", { hue: "cold", frames: 110, kicker: "Pasto de sedge" });
P(745.7, "bi_p_routes_snow", "bison walking in single file along a seasonal trail through deep snow in a frozen valley, aerial, learning the land", { hue: "cold" });
C(751.7, "bi_c_first_calf", "a newborn reddish bison calf taking its first steps beside its mother in a green subarctic summer meadow, tender, hopeful warm light", { hue: "amber", frames: 120, kicker: "1981 · primeras crías" });
P(762.1, "bi_p_herd_growing", "a healthy growing herd of wood bison grazing across a lush green northern valley in summer, thriving", { hue: "amber" });
P(768.9, "bi_p_reinforce_1989", "a few additional bison being released from a trailer into the valley, 1989, faded color documentary", { hue: "amber", kicker: "1989 · +12" });
P(777.2, "bi_p_fort_liard", "a small northern settlement of Fort Liard with cabins and a river, subarctic, documentary", { hue: "cold", kicker: "1998 · +59" });
// Journey: la curva poblacional ascendente
JOURNEY(796.1, { eyebrow: "El conteo aéreo", title: "Una manada que no paraba de crecer", accent: "good", dur: 26, worldImage: addDiag("dg_bi_growthworld", "Un fondo de lámina marfil con una línea de tiempo curva y ascendente dibujada a mano que sube de izquierda a derecha, hitos de años marcados con pequeños bisontes ilustrados de tamaño creciente, estética cuaderno de campo vintage. Espacio limpio arriba a la derecha."),
  waypoints: [
    { x: 0.18, y: 0.8, z: 0, num: "1980", label: "28 bisontes", image: "img/bi_p_selected_bison.png", dwell: 2.6, travel: 1.8 },
    { x: 0.34, y: 0.7, z: 1, num: "1981", label: "Primeras crías", image: "img/bi_p_breeding_calf.png", dwell: 2.4, travel: 1.8 },
    { x: 0.5, y: 0.54, z: 0, num: "2004", label: "403", image: "img/bi_p_herd_growing.png", dwell: 2.6, travel: 1.8 },
    { x: 0.66, y: 0.4, z: 1, num: "2011", label: "431", image: "img/bi_p_herd_valley_big.png", dwell: 2.4, travel: 1.8 },
    { x: 0.84, y: 0.22, z: 0, num: "2017", label: "960", image: "img/bi_p_herd_thriving2.png", dwell: 3.0, travel: 1.6 },
  ] });
// imágenes nuevas usadas por el journey
beats.push({ id: "bi_p_herd_valley_big", start: 999, kind: "raw", src: "img/bi_p_herd_valley_big.png", hue: "amber", _skipcue: true, gen: { type: "image", name: "bi_p_herd_valley_big", prompt: ph("a large herd of wood bison spread across a wide green northern river valley, hundreds of animals, aerial documentary") } });
beats.push({ id: "bi_c_huge_herd", start: 999, kind: "raw", src: "vid/bi_c_huge_herd.mp4", hue: "amber", _skipcue: true, gen: { type: "clip", image: "bi_c_huge_herd", frames: 120, prompt: "a vast herd of nearly a thousand wood bison moving across a green subarctic valley, drone shot, dust, thriving" }, _img: { name: "bi_c_huge_herd", prompt: ph("a vast herd of nearly a thousand wood bison moving across a green subarctic valley seen from a drone, thriving") } });
IMPACT(824.3, { image: "img/bi_im_960.png", setup: "El censo de 2017 dio", impact: "960 BISONTES", impactAccent: "good", hitAt: 1.1, boom: 2, dur: 6.0, bgPrompt: "an epic aerial view of nearly a thousand wood bison spread across a vast green northern valley, thriving, dramatic sky" });
P(837.2, "bi_p_herd_thriving2", "nearly a thousand wild wood bison scattered across a vast green valley under a dramatic northern sky, descendants of 28, epic", { hue: "amber" });
P(847.9, "bi_p_expansion_map_photo", "bison tracks and a lone bison on a frosty plateau expanding into new territory toward distant mountains, wide", { hue: "cold", kicker: "Hasta el Yukon" });
P(866.3, "bi_p_documentary_crew", "a modern wildlife documentary film crew with a camera on a tripod filming bison in a northern valley, behind the scenes", { hue: "amber", kicker: "Un milagro de la conservación" });
QUOTE(880.9, { image: "img/bi_p_herd_thriving2.png", eyebrow: "Caso Nahanni", text: "28 animales habían *reescrito* la historia", accent: "good", hue: "amber", dur: 5.6, fontSize: 92 });

// =============================================================================
// ACTO 8 — EL COLAPSO (886–1021)
// =============================================================================
IMPACT(886.7, { image: "img/bi_im_cambio.png", setup: "Y entonces, sin aviso", impact: "TODO CAMBIÓ", impactAccent: "danger", hitAt: 1.0, boom: 2, dur: 4.7, bgPrompt: "a lone bison in a darkening snowy valley as a storm rolls in, ominous shift, cold tones" });
P(891.4, "bi_p_count_plane_2021", "a survey plane flying low over a snowy valley counting bison below, 2021, cold grey light, fewer animals visible", { hue: "cold", kicker: "Conteo de 2021" });
IMPACT(898.2, { image: "img/bi_im_544.png", setup: "De 960 quedaban solo", impact: "544", impactAccent: "danger", hitAt: 1.1, boom: 2, dur: 6.7, bgPrompt: "a thinning herd of bison scattered across a vast snowy valley, noticeably fewer animals, melancholic aerial" });
STAT(905.0, { value: 50, suffix: "%", label: "de la manada desapareció en 4 años", eyebrow: "Y nadie sabía por qué", accent: "danger", hue: "red", dur: 7.0 });
// las hipótesis — pod de chips/cortes
P(915.1, "bi_p_blood_sample", "a veterinarian in the field holding a vial of bison blood for disease testing, gloved hands, clinical documentary", { hue: "cold", kicker: "¿Epidemia?" });
P(921.9, "bi_p_patrol_forest", "a ranger patrol walking through snowy forest looking for signs of poaching, no evidence, cold", { hue: "cold", kicker: "¿Cacería ilegal?" });
P(927.7, "bi_p_grass_valley", "a healthy grassy valley still producing plenty of forage, green and normal, ruling out famine", { hue: "amber", kicker: "¿Hambruna?" });
C(933.3, "bi_c_wolves_hunt", "a pack of wolves chasing a bison through snow at dusk, predator pressure, cold blue tones, motion", { hue: "cold", frames: 110, kicker: "¿Lobos?" });
P(948.2, "bi_p_biologist_data", "a biologist studying tracking data and maps on a laptop in a field cabin, puzzled, looking for a pattern", { hue: "amber", light: "warm cabin light" });
DIAG(955.0, { eyebrow: "La caída era selectiva", hue: "red", accent: "danger", dur: 9.0, slides: [
  { name: "dg_bi_selective", title: "Desaparecían los machos jóvenes", panel: "Diagrama de una manada de bisontes en silueta donde los individuos jóvenes y fuertes (machos en vigor reproductivo) están marcados desapareciendo (siluetas que se desvanecen con una X suave), mientras viejos y crías quedan. Texto 'los más fuertes, los reproductores del futuro'. Inquietante pero sobrio." },
] });
P(966.0, "bi_p_strong_male", "a powerful young adult bison bull in its prime standing alone in a meadow, strong and healthy, the kind that was vanishing", { hue: "amber" });
P(977.4, "bi_p_lone_bison_wander", "a single bison walking alone across an empty snowy expanse, separated from the herd, going nowhere, desolate", { hue: "cold", kicker: "Avistamientos extraños" });
P(987.3, "bi_p_trampled_area", "a trampled abandoned bison wallow and trail with no animals, churned mud and snow, eerie emptiness", { hue: "cold" });
P(994.8, "bi_p_dene_witness", "a present-day Dene indigenous man in a winter coat looking out over the Liard valley, weathered face, documentary portrait", { hue: "cold", kicker: "Los Dene del Liard" });
P(1006.1, "bi_p_lone_bison_snow2", "a solitary bison standing in falling snow at the edge of a dark forest, lost, melancholic", { hue: "cold" });
P(1013.2, "bi_p_dead_young_male", "the silhouette of a fallen young bison in a snowy forest clearing, no visible cause, somber and respectful, dim light", { hue: "red" });

// =============================================================================
// ACTO 9 — EL ENEMIGO REAL / CLIMA (1021–1238)
// =============================================================================
P(1021.0, "bi_p_climatologist", "a climate scientist reviewing graphs of arctic temperature data on screens, cold blue lab light", { hue: "cold", kicker: "Los climatólogos" });
P(1031.1, "bi_p_thin_winter", "a subarctic valley with patchy thin snow and bare ground in an unusually mild erratic winter, wrong-looking", { hue: "cold" });
C(1033.8, "bi_c_rain_on_snow", "freezing rain falling on snow in a winter forest, water glazing over the snowpack, forming a sheet of ice, grey cold light", { hue: "cold", frames: 110, kicker: "Lluvia sobre nieve" });
DIAG(1043.6, { eyebrow: "Rain on snow events", hue: "cold", accent: "cold", dur: 11.0, slides: [
  { name: "dg_bi_ros1", title: "Llueve sobre la nieve", panel: "Diagrama paso 1 de 2: corte lateral de un suelo nevado con pasto debajo, gotas de lluvia cayendo sobre la nieve y filtrándose, flecha hacia abajo, rótulo 'el agua se filtra en la nieve'. Lámina clara de un solo concepto." },
  { name: "dg_bi_ros2", title: "Se forma una placa de hielo", panel: "Diagrama paso 2 de 2: el mismo corte lateral pero ahora con una capa de HIELO sólido brillante sellando la superficie, un bisonte arriba sin poder romperla con la cabeza, el pasto verde atrapado debajo, rótulo 'mueren de hambre con comida bajo las pezuñas'. Trágico pero claro." },
] });
C(1060.5, "bi_c_bison_ice_dig", "a desperate bison trying to break a hard sheet of ice with its head and hooves to reach grass underneath, failing, frozen valley", { hue: "cold", frames: 110 });
DIAG(1078.8, { eyebrow: "El hábitat se transforma", hue: "cold", accent: "cold", dur: 10.0, slides: [
  { name: "dg_bi_invasive", title: "Plantas invasoras", panel: "Diagrama comparando dos parches de pasto: a la izquierda 'sedge nutritivo' (verde, sano) y a la derecha 'especies invasoras' traídas por el calentamiento reemplazándolo, flecha de reemplazo. Texto mínimo en español." },
  { name: "dg_bi_permafrost", title: "El permafrost se derrite", panel: "Corte lateral del suelo subártico mostrando el permafrost congelado derritiéndose, humedales alterándose y el agua subiendo, rótulo 'áreas enteras intransitables en verano'. Estilo lámina geológica artesanal." },
] });
P(1095.0, "bi_p_melting_permafrost", "a thawing permafrost wetland with collapsing ground and standing water in the boreal north, summer, climate change", { hue: "cold" });
C(1107.8, "bi_c_grizzly_learn", "a grizzly bear moving through a northern meadow stalking, having learned to hunt young bison, golden subarctic light", { hue: "amber", frames: 110, kicker: "Los osos aprendieron" });
P(1118.8, "bi_p_lone_young_bison", "a young bison alone and vulnerable in a thawing landscape, separated from the herd, a target", { hue: "cold" });
C(1128.9, "bi_c_wolves_pack_big", "a large pack of wolves moving confidently across a snowy valley, grown in number, relentless predators", { hue: "cold", frames: 110, kicker: "Los lobos no pararon" });
DIAG(1159.5, { eyebrow: "Una tormenta perfecta", hue: "red", accent: "danger", dur: 9.0, slides: [
  { name: "dg_bi_storm", title: "Todo a la vez", panel: "Diagrama central con un bisonte en el medio y cuatro flechas convergiendo sobre él desde cuatro esquinas, cada una rotulada: 'cambio climático', 'fragmentación del hábitat', 'nueva depredación', 'estrés acumulado'. Composición de tormenta perfecta, sobrio y potente." },
] });
P(1168.2, "bi_p_changing_ecosystem", "a subarctic landscape visibly in transition, half frozen half thawed, a lone bison in the distance, a world changing too fast", { hue: "cold" });
P(1181.3, "bi_p_experts_silent", "scientists looking at field data with grave expressions, the paradox that left experts speechless, muted light", { hue: "cold", kicker: "La paradoja" });

// =============================================================================
// ACTO 10 — PARADOJA Y CIERRE (1186–1530)
// =============================================================================
STAT(1199.5, { value: 34, prefix: "×", label: "se multiplicaron en menos de 40 años", eyebrow: "Lograron lo imposible", accent: "good", hue: "amber", dur: 4.4 });
C(1203.9, "bi_c_herd_epic", "a magnificent herd of wood bison crossing a northern river at golden hour, powerful and alive, epic documentary", { hue: "amber", frames: 120 });
QUOTE(1214.8, { image: "img/bi_p_changing_ecosystem.png", eyebrow: "El enemigo definitivo", text: "No fue la enfermedad ni los humanos: fue el *clima mismo*", accent: "danger", hue: "cold", dur: 8.1, fontSize: 74 });
C(1222.9, "bi_c_landscape_morph", "a timelapse-like view of a northern paradise valley slowly transforming, seasons shifting wrong, under the hooves of bison, melancholic", { hue: "cold", frames: 120 });
P(1238.2, "bi_p_today_herd_500", "around 500 wild bison grazing in a northern valley today under pressure, beautiful but fragile, present day documentary", { hue: "cold", kicker: "Hoy · ~500 animales" });
P(1251.3, "bi_p_pride_fear", "a biologist looking at a bison herd through binoculars with a complex expression of pride and worry, present day", { hue: "cold" });
C(1256.8, "bi_c_gps_collar", "a tranquilized bison being fitted with a GPS tracking collar by veterinarians who arrived by helicopter, present day field science", { hue: "cold", frames: 110, kicker: "Monitoreo satelital" });
P(1267.2, "bi_p_helicopter_vet", "a helicopter landed in a snowy valley with veterinarians taking blood samples from a bison, modern conservation work", { hue: "cold" });
P(1273.2, "bi_p_university_lecture", "a university lecture hall with a slide about the Nahanni bison reintroduction case study on screen, students, present day", { hue: "amber", light: "warm indoor light", kicker: "Un caso de estudio" });
DIAG(1288.1, { eyebrow: "El debate", hue: "amber", accent: "amber", dur: 10.0, slides: [
  { name: "dg_bi_debate", title: "¿Sirven los modelos del siglo XX?", panel: "Diagrama de balanza/dos columnas: a la izquierda 'lo que funcionó 40 años', a la derecha 'una década de cambio climático', con un signo de pregunta grande en el medio. Texto 'animales devueltos a hábitats que ya no existen'. Reflexivo y elegante." },
] });
P(1305.5, "bi_p_lost_habitat", "a bison standing in a landscape that no longer matches its ancient home, subtle wrongness, evocative", { hue: "cold" });
P(1314.2, "bi_p_herd_still_there", "a resilient herd of bison still grazing together in the valley, enduring, soft hopeful light", { hue: "amber", kicker: "Resiliencia" });
C(1329.0, "bi_c_calf_spring", "a bison calf running playfully in a green spring meadow beside the herd, life continuing, warm hopeful light", { hue: "amber", frames: 110 });
P(1338.8, "bi_p_zoology_book", "an open zoology book with an illustration of the wood bison, a hand turning the page, warm library light, 'almost a footnote'", { hue: "amber", light: "warm indoor light" });
IMPACT(1363.2, { image: "img/bi_p_herc_silhouette.png", setup: "Aquellos 28 no sabían que cargaban", impact: "EL FUTURO DE UNA ESPECIE", impactAccent: "good", hitAt: 1.2, boom: 1, dur: 7.9, darken: 0.5 });
beats.push({ id: "bi_p_herc_silhouette", start: 999, kind: "raw", src: "img/bi_p_herc_silhouette.png", hue: "amber", _skipcue: true, gen: { type: "image", name: "bi_p_herc_silhouette", prompt: ph("the silhouette of a C-130 Hercules plane against a vast northern sky at golden dusk, lone and historic") } });
C(1371.1, "bi_c_descendants_walk", "descendant wood bison walking in single file through misty subarctic wetlands at dawn, quiet and timeless", { hue: "cold", frames: 120 });
P(1387.2, "bi_p_alive_by_chance", "a single bison standing in soft northern light looking toward the horizon, alive by chance, contemplative", { hue: "cold" });
C(1402.1, "bi_c_grazing_silence", "wood bison grazing in silence in remote Liard wetlands among spruce, no humans, peaceful and remote, drifting mist", { hue: "cold", frames: 120, kicker: "Pastando en silencio" });
C(1415.0, "bi_c_bison_snow_walk", "bison walking over deep snow searching for grass beneath the ice in an ever stranger winter, breath steaming, enduring", { hue: "cold", frames: 120 });
QUOTE(1435.3, { image: "img/bi_p_alive_by_chance.png", eyebrow: "Una pregunta sin respuesta", text: "¿Puede la naturaleza *volver atrás*?", accent: "cold", hue: "cold", dur: 7.3, fontSize: 96 });
P(1442.6, "bi_p_question2", "a vast empty northern valley at blue hour with a single bison far away, open question, profound", { hue: "cold" });
P(1452.8, "bi_p_bison_nonanswer", "a bison with its head bowed grazing, breath in the freezing air, not answering, intimate cold portrait", { hue: "cold" });
C(1458.2, "bi_c_breath_cold", "extreme close-up of a bison's nostrils breathing steam into freezing air, frost on its dark fur, slow and alive", { hue: "cold", frames: 120 });
P(1463.4, "bi_p_horns_sky", "the curved horns of a bison silhouetted against a grey northern sky, low angle, iconic", { hue: "cold" });
IMPACT(1467.6, { image: "img/bi_im_28a500.png", setup: "28 se convirtieron en mil,", impact: "MIL EN 500", impactAccent: "amber", hitAt: 1.2, boom: 2, dur: 5.0, bgPrompt: "a bison herd in a misty northern valley at dusk, timeless and uncertain, soft fading light" });
C(1472.5, "bi_c_herd_fade", "a herd of bison slowly walking away into northern mist, fading into the grey, uncertain future, cinematic and quiet", { hue: "cold", frames: 120 });
P(1488.8, "bi_p_last_word", "a lone bison standing still in a silent snowy valley as wind blows, the last word not yet written, elegiac", { hue: "cold", kicker: "Todavía no está escrita" });
C(1504.9, "bi_c_wind_valley", "wind blowing across a silent empty subarctic valley with spruce trees bending, atmospheric and lonely, grey light", { hue: "cold", frames: 120 });
P(1518.6, "bi_p_hooves_ground", "close on the hooves of a giant bison pressing into snowy northern ground, a land that almost forgot them, evocative macro", { hue: "cold" });
C(1524.0, "bi_c_final_bison", "a single majestic wood bison standing in a vast silent northern valley facing away into the cold open landscape, the open question, final shot", { hue: "cold", frames: 120, dur: 6.5 });

// =============================================================================
// ★ CAPA DE DENSIDAD — flujo casi continuo de imágenes/clips reales (regla #1) ★
// Tomas extra en los huecos entre anchors → nueva imagen cada ~3.5-4.5s. El
// tiling auto-acorta los holds largos. 'c'=clip (video real), 'p'=foto.
// Campos: [t, name, kind, desc, kicker, hue, light('arch'|'warm')]
// =============================================================================
const MORE = [
  // ACTO 1 — HOOK (0–53)
  [3.5, "bi_a001", "c", "a Canadian C-130 Hercules military plane flying low over an endless flat white arctic wilderness seen from the side, propellers turning", "", "amber"],
  [9.5, "bi_a002", "p", "macro of heavy ratchet straps and chains securing a large reinforced wooden animal crate in a dim aircraft cargo hold", "", "amber"],
  [16.0, "bi_a003", "p", "an aerial of a frozen winding river cutting through dark boreal forest, no roads, utterly remote", "", "cold"],
  [20.5, "bi_a004", "p", "tall black spruce trees standing in cold morning mist in a northern bog", "", "cold"],
  [30.5, "bi_a005", "p", "fresh lone bison hoofprints in deep clean snow leading toward distant trees", "Un siglo después", "cold"],
  [35.5, "bi_a006", "p", "point of view through binoculars with a dark circular vignette, distant bison specks on a snowy plain", "", "amber"],
  [41.5, "bi_a007", "p", "two or three dark bison standing far apart on a frozen dusk meadow, breath rising", "", "cold"],
  [48.0, "bi_a008", "p", "extreme close on a wood bison's frost-covered woolly shoulder hump, texture detail", "", "cold"],
  [50.8, "bi_a009", "p", "a wood bison turning its huge head slowly toward camera in cold grey light, intimate", "", "cold"],
  // ACTO 2 — ABUNDANCIA (53–122)
  [56.5, "bi_a010", "p", "an old leather-bound 1800s book and a yellowed map of North America on a desk", "", "amber", "warm"],
  [59.5, "bi_a011", "p", "a vast bison herd on the open plains stretching to the horizon, late 1800s", "Finales del s. XIX", "amber", "arch"],
  [64.5, "bi_a012", "c", "an immense herd of bison flowing across golden prairie grass, dust rising, seen from a low hill, faded sepia archival 1870s", "", "amber"],
  [69.5, "bi_a013", "p", "thousands of bison dotting rolling plains under an enormous sky, sepia", "", "amber", "arch"],
  [85.5, "bi_a014", "p", "a large dark wood bison standing among white birch trunks in a snowy boreal forest", "", "cold"],
  [89.0, "bi_a015", "p", "close detail of a wood bison's massive curved black horn and shaggy frosted forehead", "", "cold"],
  [101.0, "bi_a016", "p", "a wood bison walking through deep forest shadow, shafts of cold light between black pines", "", "cold"],
  [104.5, "bi_a017", "p", "the hooves of a giant bison sinking into mossy boggy ground among ferns", "", "cold"],
  [108.5, "bi_a018", "p", "a towering dark bison bull beside a small wooden cabin for scale, vintage", "", "amber", "arch"],
  [116.0, "bi_a019", "p", "a frozen black-water swamp with half-submerged logs and mist in a boreal wetland", "", "cold"],
  [120.0, "bi_a020", "p", "a dense tangled thicket of birch and black pine too thick to pass, snow", "", "cold"],
  // ACTO 3 — LA MATANZA (122–268)
  [129.5, "bi_a021", "p", "a sepia mountain of bleached bison skulls with a man standing on top", "", "red", "arch"],
  [135.0, "bi_a022", "p", "sepia hunters skinning a dead bison on the open prairie, hides stacked nearby", "", "red", "arch"],
  [147.0, "bi_a023", "p", "a long-range Sharps rifle resting on a bipod in prairie grass, smoke drifting, sepia", "", "red", "arch"],
  [152.5, "bi_a024", "c", "a steam locomotive crossing the open plains belching black smoke as bison flee, faded sepia archival", "Las vías del tren", "red"],
  [157.5, "bi_a025", "p", "open rail cars piled high with bison hides at a frontier station, men posing, sepia", "", "red", "arch"],
  [163.0, "bi_a026", "p", "passengers leaning from 1800s train windows aiming rifles at a panicked herd, sepia", "", "red", "arch"],
  [167.5, "bi_a027", "p", "a single skinned bison carcass rotting in tall grass under harsh sun, sepia", "", "red", "arch"],
  [172.5, "bi_a028", "p", "dozens of stripped bison carcasses scattered to the horizon, a wasteland, sepia", "", "red", "arch"],
  [184.5, "bi_a029", "p", "a stern army officer on horseback overlooking the empty plains, sepia", "", "red", "arch"],
  [189.5, "bi_a030", "p", "a US cavalry column riding across a treeless plain, 1870s sepia", "", "red", "arch"],
  [192.5, "bi_a031", "p", "an indigenous plains hunter on foot looking at a field of bones, despair, sepia", "", "amber", "arch"],
  [217.0, "bi_a032", "p", "a Victorian museum hall with mounted bison and glass cases, dim, sepia", "", "amber", "arch"],
  [231.5, "bi_a033", "p", "a handful of bison behind a rough wooden fence, the last captive survivors, sepia", "", "amber", "arch"],
  [241.5, "bi_a034", "p", "a dignified Dene family in furs outside a log cabin in the north, sepia", "Los Dene", "amber", "arch"],
  [251.5, "bi_a035", "p", "drying racks and a quiet northern indigenous camp by a river, no bison, sepia", "", "amber", "arch"],
  [258.5, "bi_a036", "p", "an elder's weathered hands holding a carved bison horn by firelight, sepia", "", "amber", "arch"],
  [264.0, "bi_a037", "p", "an empty snow-dusted plain at dusk with a single bison skull in the foreground, sepia", "", "amber", "arch"],
  // ACTO 4 — REDESCUBRIMIENTO (268–368)
  [272.5, "bi_a038", "p", "bison skeletons mounted in a cold dim natural history museum, an extinct feeling", "", "cold"],
  [276.5, "bi_a039", "p", "a faded museum specimen card reading 'Bison' in typewriter text, macro", "", "cold"],
  [283.0, "bi_a040", "p", "a 1950s biologist studying a topographic map inside a small float plane cabin", "", "amber", "warm"],
  [291.5, "bi_a041", "c", "a 1950s float plane banking over endless swampy boreal forest, faded color film", "1957", "amber"],
  [299.5, "bi_a042", "p", "a blurry aerial glimpse of dark animals among flooded trees, faded 1950s film", "", "amber"],
  [304.5, "bi_a043", "p", "a dark unusually large bison half-hidden among boreal trees seen from above", "", "cold"],
  [312.5, "bi_a044", "p", "biologists in waders pushing through chest-high flooded forest, swatting mosquitoes, faded film", "", "amber"],
  [324.5, "bi_a045", "p", "a biologist's mud-soaked boots and canvas field bag in shallow swamp water, macro", "", "amber"],
  [328.5, "bi_a046", "p", "a huge dark bison standing in a misty swamp seen up close for the first time", "", "cold"],
  [335.0, "bi_a047", "p", "two scientists quietly photographing a distant dark bison, awe, faded film", "", "amber"],
  [351.5, "bi_a048", "p", "calipers measuring a bison skull on a workbench beside handwritten field notes, macro", "", "amber", "warm"],
  [362.5, "bi_a049", "p", "a small herd of a dozen dark bison in a foggy clearing, the last survivors", "", "amber"],
  [366.5, "bi_a050", "p", "a hopeful close portrait of a healthy dark wood bison in soft light", "", "amber"],
  // ACTO 5 — EL PLAN / ELK ISLAND (368–489)
  [372.5, "bi_a051", "p", "1960s biologists in an office with maps and typed reports, planning, warm light", "El plan", "amber", "warm"],
  [380.5, "bi_a052", "p", "bison funneled through a wooden chute by handlers, dust, faded color film", "", "amber"],
  [388.5, "bi_a053", "p", "golden aspen parkland with bison grazing behind a tall page-wire fence", "Elk Island", "amber"],
  [396.5, "bi_a054", "p", "a veterinarian checking a bison through a fence with a clipboard, faded color", "", "amber", "warm"],
  [405.5, "bi_a055", "p", "a bison cow nuzzling her young calf in a clean green reserve at morning", "", "amber"],
  [412.5, "bi_a056", "p", "a row of healthy bison grazing peacefully in fenced aspen parkland", "", "amber"],
  [419.5, "bi_a057", "p", "handlers loading hay for the bison reserve from a small truck, faded film", "", "amber"],
  [440.5, "bi_a058", "p", "a pristine remote river valley ringed by mountains, untouched, aerial", "", "cold"],
  [446.5, "bi_a059", "p", "the wide Liard river winding through spruce forest in grey northern light", "", "cold"],
  [453.5, "bi_a060", "p", "a tiny cluster of cabins under a mountain beside a river in the far north", "Nahanni Butte", "cold"],
  [460.5, "bi_a061", "p", "a lush green subarctic wetland meadow stretching to the horizon", "", "amber"],
  [466.5, "bi_a062", "p", "wildflowers and sedge grass in a sunlit northern wetland in summer, macro", "", "amber"],
  [470.5, "bi_a063", "p", "a silent empty valley at dawn with mist on the river and no animals", "", "cold"],
  // ACTO 6 — EL OPERATIVO (489–685)
  [500.5, "bi_a064", "p", "young pregnant bison cows standing in a holding pen, faded 1980 film grain", "", "amber"],
  [508.5, "bi_a065", "p", "close on a pregnant bison cow's belly and numbered ear tag, 1980 film", "", "amber"],
  [513.5, "bi_a066", "p", "handlers fitting a numbered ear tag on a sedated bison, gloved hands, 1980", "", "amber"],
  [522.5, "bi_a067", "c", "handlers urging a reluctant bison up a ramp into a tall wooden crate, dust, 1980 film", "Uno por cajón", "amber"],
  [528.5, "bi_a068", "p", "a heavy wooden shipping crate closed with a bison inside, breathing vents, 1980", "", "amber"],
  [534.5, "bi_a069", "p", "macro of calibrated wooden vent slots cut into a reinforced animal crate", "", "amber"],
  [538.5, "bi_a070", "p", "a crew bolting reinforcement beams onto a giant wooden crate, 1980 film", "", "amber"],
  [554.5, "bi_a071", "c", "wooden crates with bison craned onto flatbed trucks, 1980 faded color film", "", "amber"],
  [560.5, "bi_a072", "c", "a C-130 Hercules with its rear ramp open being loaded with large crates, 1980", "Hércules C-130", "amber"],
  [566.5, "bi_a073", "p", "the cavernous interior of a Hercules cargo hold with strapped wooden crates", "", "amber"],
  [572.5, "bi_a074", "p", "veterinarians and pilots in 1980 jackets reviewing a checklist by the plane", "", "amber"],
  [584.5, "bi_a075", "p", "hands marking a logistics chart of water rations per animal, macro, 1980", "", "amber", "warm"],
  [590.5, "bi_a076", "p", "a Hercules taxiing on a remote runway under a wide pale northern sky, 1980", "", "amber"],
  [626.5, "bi_a077", "p", "a rough gravel airstrip carved into boreal forest with a plane at the far end", "Sin torre de control", "cold"],
  [630.5, "bi_a078", "p", "extra fuel drums beside a transport plane on a remote strip, crew nearby", "", "cold"],
  [637.5, "bi_a079", "c", "a crate door swinging open as a dark bison hesitates at the threshold, cold light, 1980", "", "cold"],
  [645.5, "bi_a080", "p", "a massive bison's first step onto wild northern soil, confused, 1980 film", "", "cold"],
  [650.5, "bi_a081", "p", "a bison standing frozen at the open crate mouth refusing to move, grey light", "", "cold"],
  [658.5, "bi_a082", "c", "a bison bolting into the spruce forest in motion blur, disappearing among trees", "", "cold"],
  [666.5, "bi_a083", "p", "fresh bison tracks leading away into the trees with the empty crate behind", "", "cold"],
  [674.5, "bi_a084", "c", "a pregnant bison cow drinking at a river edge then staring at the water, golden hour", "Una hembra preñada", "amber"],
  [680.5, "bi_a085", "p", "biologists watching from a ridge with binoculars, tiny bison far below", "", "cold"],
  // ACTO 7 — EXPLOSIÓN (685–886)
  [689.5, "bi_a086", "p", "a lone disoriented bison in a bleak empty frozen expanse, symbolic of failure", "", "cold"],
  [696.5, "bi_a087", "p", "wolf tracks circling around bison tracks in fresh snow, tension", "", "cold"],
  [703.5, "bi_a088", "p", "a tense pack of wolves watching a bison herd across a snowy meadow at dusk", "", "cold"],
  [726.5, "bi_a089", "c", "bison enduring a savage blizzard with snow up to their chests, wind whipping, survival", "−40 °C", "cold"],
  [732.5, "bi_a090", "p", "a bison sweeping snow aside with its head to reach grass, breath steaming", "", "cold"],
  [738.0, "bi_a091", "p", "close on tough green sedge grass exposed under cleared snow", "Pasto de sedge", "cold"],
  [744.0, "bi_a092", "p", "bison walking single file along a packed trail through deep snow, aerial", "", "cold"],
  [749.0, "bi_a093", "c", "a newborn reddish bison calf wobbling on its first steps beside its mother in a green meadow", "1981", "amber"],
  [755.0, "bi_a094", "p", "a bison calf nursing in warm summer sun, hopeful", "", "amber"],
  [760.0, "bi_a095", "p", "a growing herd grazing across a lush green river valley in summer", "", "amber"],
  [766.0, "bi_a096", "p", "a healthy bison herd with several calves resting in tall summer grass", "", "amber"],
  [772.0, "bi_a097", "p", "bison released from a trailer into the valley, 1989, faded color film", "1989 · +12", "amber"],
  [780.0, "bi_a098", "p", "a small northern settlement with cabins beside a river, Fort Liard", "1998 · +59", "cold"],
  [788.0, "bi_a099", "p", "a wide valley speckled with hundreds of grazing bison, aerial", "", "amber"],
  [833.5, "bi_a100", "p", "nearly a thousand bison spread across a vast green valley under an epic sky", "", "amber"],
  [840.5, "bi_a101", "c", "a huge herd of bison moving across a green valley, drone shot, dust rising", "", "amber"],
  [850.5, "bi_a102", "p", "lone bison tracks crossing a frosty plateau toward distant mountains", "Hasta el Yukon", "cold"],
  [857.5, "bi_a103", "p", "a bison standing on a high tundra ridge looking over new territory", "", "cold"],
  [863.5, "bi_a104", "p", "a modern documentary crew filming bison from a respectful distance", "", "amber"],
  [870.5, "bi_a105", "p", "a conservation conference slide showing a bison recovery graph, audience", "", "amber", "warm"],
  [876.5, "bi_a106", "p", "stacks of scientific papers and a journal cover about the bison recovery, macro", "", "amber", "warm"],
  // ACTO 8 — EL COLAPSO (886–1021)
  [892.5, "bi_a107", "p", "a survey plane flying low over a snowy valley with only a few bison below, 2021", "", "cold"],
  [914.5, "bi_a108", "p", "a vet holding a vial of bison blood up to the light, gloved hands, clinical", "¿Epidemia?", "cold"],
  [918.5, "bi_a109", "p", "negative lab test strips for tuberculosis and brucellosis on a tray, macro", "", "cold"],
  [923.5, "bi_a110", "p", "rangers on snowmobiles searching a snowy forest for poaching signs, none found", "¿Cacería?", "cold"],
  [929.5, "bi_a111", "p", "a healthy grassy valley still full of forage, ruling out famine", "¿Hambruna?", "amber"],
  [938.5, "bi_a112", "c", "wolves chasing a bison through deep snow at dusk, motion, cold blue tones", "¿Lobos?", "cold"],
  [945.5, "bi_a113", "p", "a worried biologist studying GPS tracking maps on a laptop in a field cabin", "", "amber", "warm"],
  [950.5, "bi_a114", "p", "scattered map pins showing bison vanishing from old territories, macro", "", "amber", "warm"],
  [966.5, "bi_a115", "p", "a powerful young bull bison alone in a meadow, the kind that was vanishing", "", "amber"],
  [972.5, "bi_a116", "p", "an empty churned-up bison wallow with no animals, eerie", "", "cold"],
  [978.5, "bi_a117", "p", "a single bison wandering alone across an empty snowfield, lost", "Avistamientos extraños", "cold"],
  [984.5, "bi_a118", "p", "a mother bison with no calf standing in falling snow, melancholic", "", "cold"],
  [990.5, "bi_a119", "p", "a trampled abandoned trail through snowy brush with no herd, eerie", "", "cold"],
  [997.5, "bi_a120", "p", "a present-day Dene man in a fur-lined coat scanning the valley, weathered face", "Los Dene del Liard", "cold"],
  [1002.5, "bi_a121", "p", "a solitary bison at the edge of a dark spruce forest in falling snow", "", "cold"],
  [1008.5, "bi_a122", "p", "tracks of a lone bison going in confused circles in deep snow", "", "cold"],
  [1015.5, "bi_a123", "p", "the somber silhouette of a fallen young bison in a snowy clearing, dim respectful light", "", "red"],
  // ACTO 9 — CLIMA (1021–1238)
  [1024.5, "bi_a124", "p", "a climate scientist studying rising arctic temperature graphs on screens, blue light", "Los climatólogos", "cold"],
  [1029.5, "bi_a125", "p", "a subarctic valley with patchy thin snow and bare ground, a wrong mild winter", "", "cold"],
  [1037.5, "bi_a126", "c", "freezing rain falling on snow, water glazing the surface into a sheet of ice, grey light", "Lluvia sobre nieve", "cold"],
  [1041.5, "bi_a127", "p", "a glassy sheet of ice sealing over snow in a winter forest, cold light", "", "cold"],
  [1057.5, "bi_a128", "c", "a desperate bison hammering a hard ice crust with its head and hooves, failing", "", "cold"],
  [1063.5, "bi_a129", "p", "green grass visible frozen beneath a clear sheet of ice, macro", "", "cold"],
  [1069.5, "bi_a130", "p", "a bison standing over impenetrable ice unable to reach the grass below", "", "cold"],
  [1075.5, "bi_a131", "p", "a bison's worn hoof scraping uselessly at a sheet of ice, close", "", "cold"],
  [1092.5, "bi_a132", "p", "two grass patches side by side, lush sedge versus invasive weeds taking over, macro", "", "cold"],
  [1097.5, "bi_a133", "p", "a thawing permafrost wetland with collapsing ground and pooling water, summer", "", "cold"],
  [1103.5, "bi_a134", "p", "cracked sinking earth and tilting spruce in melting permafrost", "", "cold"],
  [1112.5, "bi_a135", "c", "a grizzly bear stalking through a northern meadow, having learned to hunt young bison", "Los osos aprendieron", "amber"],
  [1118.5, "bi_a136", "p", "a grizzly's huge clawed paw print beside bison tracks in mud, macro", "", "amber"],
  [1122.5, "bi_a137", "p", "a young bison alone and vulnerable in a thawing landscape, a target", "", "cold"],
  [1126.5, "bi_a138", "p", "a grizzly watching a lone young bison from tall grass, tension", "", "amber"],
  [1132.5, "bi_a139", "c", "a large confident wolf pack crossing a snowy valley, relentless predators", "Los lobos no pararon", "cold"],
  [1139.5, "bi_a140", "p", "wolves at a kill site in the snow, the herd can no longer recover, somber", "", "cold"],
  [1146.5, "bi_a141", "p", "a weakened thin bison standing apart from a shrinking herd in snow", "", "cold"],
  [1153.5, "bi_a142", "p", "a lone bison in a half-frozen half-thawed valley, a perfect storm closing in", "", "cold"],
  [1172.5, "bi_a143", "p", "a subarctic landscape visibly changing too fast, melting and refreezing", "", "cold"],
  [1178.5, "bi_a144", "p", "a single bison dwarfed by a vast rapidly changing northern wilderness", "", "cold"],
  [1184.5, "bi_a145", "p", "scientists with grave faces studying field data, the paradox", "La paradoja", "cold"],
  [1190.5, "bi_a146", "p", "a haunting wide shot of a thinning bison herd under a cold pale sky", "", "cold"],
  [1196.5, "bi_a147", "p", "a bison standing still as snow falls, time running out, elegiac", "", "cold"],
  // ACTO 10 — PARADOJA Y CIERRE (1238–1530)
  [1208.5, "bi_a148", "c", "a magnificent herd crossing a northern river at golden hour, powerful and alive", "", "amber"],
  [1227.5, "bi_a149", "c", "a northern paradise valley slowly transforming under bison hooves, melancholic", "", "cold"],
  [1233.5, "bi_a150", "p", "a lone bison facing a changing horizon, the landscape itself as the enemy", "", "cold"],
  [1242.5, "bi_a151", "p", "around 500 bison grazing in a northern valley today, beautiful but fragile", "Hoy · ~500", "cold"],
  [1248.5, "bi_a152", "p", "a biologist watching the herd through binoculars with pride and worry, present day", "", "cold"],
  [1254.5, "bi_a153", "p", "a GPS tracking collar being fitted on a tranquilized bison, modern field science", "Monitoreo", "cold"],
  [1261.5, "bi_a154", "p", "a research helicopter landed in a snowy valley with veterinarians at work", "", "cold"],
  [1268.5, "bi_a155", "p", "vets drawing a blood sample from a sedated bison in the field, present day", "", "cold"],
  [1276.5, "bi_a156", "p", "a university lecture hall with a slide on the Nahanni bison case study", "Caso de estudio", "amber", "warm"],
  [1282.5, "bi_a157", "p", "students taking notes during a conservation lecture, present day", "", "amber", "warm"],
  [1300.5, "bi_a158", "p", "a bison in a landscape that no longer matches its ancient home, evocative", "", "cold"],
  [1307.5, "bi_a159", "p", "a resilient herd grazing together in soft hopeful light, enduring", "Resiliencia", "amber"],
  [1314.5, "bi_a160", "p", "a close bison family group with calves, life continuing", "", "amber"],
  [1322.5, "bi_a161", "c", "a bison calf running playfully in a green spring meadow beside the herd", "", "amber"],
  [1332.5, "bi_a162", "p", "an open zoology book with a wood bison illustration, a hand turning the page", "", "amber", "warm"],
  [1340.5, "bi_a163", "p", "a faded footnote in an old zoology book about a vanished subspecies, macro", "", "amber", "warm"],
  [1348.5, "bi_a164", "p", "a lone Hercules plane silhouette against a vast dusk sky, historic", "", "amber"],
  [1356.5, "bi_a165", "p", "bison grazing peacefully at golden hour, the experiment still a success", "", "amber"],
  [1374.5, "bi_a166", "c", "descendant bison walking single file through misty dawn wetlands, timeless", "", "cold"],
  [1382.5, "bi_a167", "p", "a bison's reflection in still dark wetland water at dawn, serene", "", "cold"],
  [1390.5, "bi_a168", "p", "a single bison gazing toward the horizon in soft northern light, alive by chance", "", "cold"],
  [1396.5, "bi_a169", "p", "bison grazing in remote spruce wetlands with no humans, peaceful", "", "cold"],
  [1409.5, "bi_a170", "c", "wood bison grazing in silence among spruce with drifting mist, remote", "Pastando en silencio", "cold"],
  [1420.5, "bi_a171", "c", "bison plowing through deep snow searching for grass beneath the ice, enduring", "", "cold"],
  [1426.5, "bi_a172", "p", "a bison's breath steaming in brutal cold with frost on its dark fur, alive", "", "cold"],
  [1446.5, "bi_a173", "p", "a vast empty valley at blue hour with one distant bison, an open question", "", "cold"],
  [1450.5, "bi_a174", "p", "a bison with head bowed grazing in freezing air, not answering", "", "cold"],
  [1457.5, "bi_a175", "c", "extreme close-up of a bison's nostrils breathing steam into frozen air", "", "cold"],
  [1462.5, "bi_a176", "p", "the curved horns of a bison silhouetted against a grey northern sky, low angle", "", "cold"],
  [1477.5, "bi_a177", "c", "a herd of bison walking away into northern mist, fading to grey, uncertain future", "", "cold"],
  [1485.5, "bi_a178", "p", "a lone bison standing still in a silent snowy valley as wind blows, elegiac", "Todavía no está escrita", "cold"],
  [1493.5, "bi_a179", "p", "wind bending spruce across a silent empty valley, atmospheric and lonely", "", "cold"],
  [1501.5, "bi_a180", "c", "wind sweeping across a silent subarctic valley with spruce bending, grey light", "", "cold"],
  [1511.5, "bi_a181", "p", "close on giant bison hooves pressing into snowy northern ground, evocative macro", "", "cold"],
  [1516.5, "bi_a182", "p", "a single majestic wood bison facing away into a vast silent valley, final shot", "", "cold"],
];
for (const [t, n, k, desc, kicker, hue, light] of MORE) {
  const opt = { hue: hue || "cold" };
  if (kicker) opt.kicker = kicker;
  if (light === "warm") opt.light = "warm indoor archival light";
  if (k === "c") { opt.frames = 90; C(t, n, desc, opt); }
  else { if (light === "arch") opt.light = "arch"; P(t, n, desc, opt); }
}

// =============================================================================
// ★ FLOATING INSERTS — imagen enmarcada flotando al lado del avatar full-screen ★
// Aparecen SOBRE el avatar (full) con "zoom al lugar" antes de materializarse.
// Imágenes propias (no se repiten con el b-roll). El avatar va `full` en estas
// ventanas (lógica en Main_bisontes). Momentos donde nombrar UNA cosa concreta.
// =============================================================================
function FLOAT(start, o) {
  const light = o.light === "warm" ? "warm indoor archival light" : undefined;
  beats.push({
    id: id("f"), start, kind: "float", _dur: o.dur || 5.5, src: `img/${o.name}.png`,
    side: o.side || "right", ...(o.kicker ? { kicker: o.kicker } : {}), hue: o.hue || "amber",
    gen: { type: "image", name: o.name, prompt: o.light === "arch" ? arch(o.desc) : ph(o.desc, light) },
  });
}
FLOAT(110.5, { name: "bi_f01", side: "right", hue: "cold", kicker: "+1000 kg", desc: "a towering dark wood bison bull standing at full height in a snowy clearing, immense, low angle" });
FLOAT(245.0, { name: "bi_f02", side: "left", hue: "amber", light: "arch", kicker: "Los pueblos del norte", desc: "a dignified northern indigenous elder in furs looking calmly at the camera, sepia archival portrait" });
FLOAT(384.5, { name: "bi_f03", side: "right", hue: "amber", kicker: "Elk Island", desc: "a weathered wooden Elk Island National Park entrance sign in golden aspen forest" });
FLOAT(453.0, { name: "bi_f04", side: "left", hue: "cold", kicker: "Nahanni Butte", desc: "an aerial of a tiny remote northern settlement beside a wide river under a mountain" });
FLOAT(560.5, { name: "bi_f05", side: "right", hue: "amber", kicker: "Hércules C-130", desc: "a Canadian Forces C-130 Hercules transport plane parked on a tarmac with rear cargo ramp open, 1980 faded film" });
FLOAT(670.0, { name: "bi_f06", side: "left", hue: "amber", kicker: "Una hembra preñada", desc: "a pregnant bison cow standing at a misty river edge at golden hour, reflective and quiet" });
FLOAT(760.5, { name: "bi_f07", side: "right", hue: "amber", kicker: "La manada crece", desc: "a thriving bison herd with several calves grazing across a green summer valley" });
FLOAT(998.5, { name: "bi_f08", side: "left", hue: "cold", kicker: "Los Dene del Liard", desc: "a present-day Dene man in a fur-lined parka looking over a snowy valley, weathered face, documentary portrait" });
FLOAT(1095.5, { name: "bi_f09", side: "right", hue: "cold", kicker: "El permafrost se derrite", desc: "a thawing permafrost wetland with cracked sinking ground and pooling water, summer" });
FLOAT(1267.5, { name: "bi_f10", side: "left", hue: "cold", kicker: "Veterinarios en helicóptero", desc: "a research helicopter on snow with veterinarians beside a sedated bison, present day" });
FLOAT(1340.5, { name: "bi_f11", side: "right", hue: "amber", light: "warm", kicker: "Una nota al pie", desc: "an open antique zoology book showing a wood bison engraving, a hand resting on the page" });

// =============================================================================
// ★ FOOTAGE REAL (Wikimedia/archivo) — combinado con la IA (regla #3 stock real) ★
// Imágenes reales en public/real/. Se interleavan como RawShots en la timeline
// (sin _dur → el tiling las integra entre las tomas IA, subiendo densidad). Se
// colocan en el tiempo libre de cada sección, evitando los anchors (d/i/j/q/s).
// =============================================================================
let rcount = 0;
function layReal(t0, t1, assets, jitter = 0) {
  const occ = beats
    .filter((b) => ["impact", "stat", "diagram", "quote", "journey"].includes(b.kind) && b.start < t1 && b.start + (b._dur || b.dur || 3) > t0)
    .map((b) => [b.start, b.start + (b._dur || b.dur || 3)])
    .sort((a, b) => a[0] - b[0]);
  let free = [], c = t0;
  for (const [s, e] of occ) { if (s > c) free.push([c, Math.min(s, t1)]); c = Math.max(c, e); }
  if (c < t1) free.push([c, t1]);
  const freeT = free.reduce((a, [s, e]) => a + (e - s), 0);
  const n = assets.length;
  if (!n || !free.length) return;
  const d = Math.min(5, Math.max(3, freeT / n));
  let fi = 0, cur = free[0][0] + jitter;
  for (const a of assets) {
    while (fi < free.length && cur + 0.05 >= free[fi][1]) { fi++; if (fi < free.length) cur = free[fi][0]; }
    if (fi >= free.length) break;
    beats.push({ id: `r${String(++rcount).padStart(3, "0")}`, start: +cur.toFixed(2), kind: "raw", src: a.s, hue: a.h || "cold", ...(a.k ? { kicker: a.k } : {}) });
    cur = Math.min(cur + d, free[fi][1]);
  }
}
const R = (s, h, k) => ({ s: `real/${s}`, h, k });
// ABUNDANCIA
layReal(53, 118, [R("real_herd_hist_2.jpg", "amber", "Manadas reales, s. XIX"), R("real_herd_hist_3.jpg", "amber"), R("real_bison_1.jpg", "cold"), R("real_bison_2.jpg", "cold"), R("real_woodbison_1.jpg", "cold"), R("real_woodbison_2.jpg", "cold")]);
// MATANZA (archivo histórico real — lo más valioso)
layReal(123, 266, [R("real_skullpile_1.jpg", "red", "Foto real, 1870s"), R("real_skullpile_2.jpg", "red"), R("real_skullpile_3.jpg", "red"), R("real_buffalohunters_1.jpg", "red"), R("real_buffalohunters_2.jpg", "red"), R("real_buffalohunters_3.jpg", "red"), R("real_hidehunt_1.jpg", "red"), R("real_hidehunt_2.jpg", "red"), R("real_hidepile_1.jpg", "red"), R("real_hidepile_2.jpg", "red"), R("real_trainbison_1.jpg", "red"), R("real_railroad_1.jpg", "red"), R("real_railroad_2.jpg", "red"), R("real_sharps_2.jpg", "red"), R("real_sheridan.jpg", "red", "Gral. Philip Sheridan"), R("real_dene_1.jpg", "amber"), R("real_dene_2.jpg", "amber")]);
// REDESCUBRIMIENTO
layReal(268, 354, [R("real_woodbuffalo_1.jpg", "cold", "Wood Buffalo NP"), R("real_floatplane_1.jpg", "amber"), R("real_floatplane_2.jpg", "amber"), R("real_woodbison_3.jpg", "cold"), R("real_woodbison_4.jpg", "cold")]);
// PLAN / ELK ISLAND
layReal(368, 472, [R("real_elkisland_1.jpg", "amber", "Elk Island NP"), R("real_elkisland_2.jpg", "amber"), R("real_woodbuffalo_3.jpg", "cold"), R("real_nwt_1.jpg", "cold")]);
// OPERATIVO
layReal(497, 684, [R("real_c130_1.jpg", "amber", "C-130 Hércules real"), R("real_c130_2.jpg", "amber"), R("real_cc130_1.jpg", "amber"), R("real_cc130_2.jpg", "amber"), R("real_nahanni_1.jpg", "cold"), R("real_liard_2.jpg", "cold")]);
// EXPLOSIÓN
layReal(685, 880, [R("real_bison_snow_1.jpg", "cold"), R("real_bison_snow_2.jpg", "cold"), R("real_bison_calf_1.jpg", "amber", "Crías reales"), R("real_bison_calf_2.jpg", "amber"), R("real_bison_3.jpg", "amber")]);
// COLAPSO
layReal(905, 1020, [R("real_wolf_1.jpg", "cold", "Lobos"), R("real_bison_snow_3.jpg", "cold")]);
// CLIMA
layReal(1024, 1158, [R("real_grizzly_1.jpg", "amber", "Osos pardos"), R("real_grizzly_2.jpg", "amber"), R("real_wolf_2.jpg", "cold"), R("real_permafrost_1.jpg", "cold", "Permafrost real"), R("real_permafrost_2.jpg", "cold"), R("real_boreal_1.png", "cold")]);
// CIERRE
layReal(1238, 1520, [R("real_nahanni_2.jpg", "cold"), R("real_nwt_2.jpg", "cold"), R("real_boreal_2.jpg", "cold")]);

// ── FAUNA EN VIDEO REAL (Pexels, public/broll/*.mp4) — jitter 2.2 para no chocar
// con las fotos reales; interleave como clips. El footage más valioso del video.
const V = (s, h, k) => ({ s: `broll/${s}.mp4`, h, k });
layReal(53, 118, [V("pex_bison_field", "amber", "Bisontes reales"), V("pex_bison_herd", "amber"), V("pex_bison_field2", "amber"), V("pex_bison_graze", "amber")], 4.5);
layReal(268, 354, [V("pex_bison_walk", "cold"), V("pex_bison_closeup", "cold"), V("pex_boreal_aerial", "cold"), V("pex_forest_fog", "cold")], 4.5);
layReal(368, 472, [V("pex_meadow_summer", "amber"), V("pex_aspen", "amber"), V("pex_wetland", "cold")], 4.5);
layReal(497, 684, [V("pex_cargo_plane", "amber", "Avión de carga"), V("pex_tundra", "cold"), V("pex_river_forest", "cold"), V("pex_snowy_mountains", "cold"), V("pex_frozen_river", "cold"), V("pex_river_water", "cold")], 4.5);
layReal(685, 880, [V("pex_bison_snow", "cold"), V("pex_bison_winter", "cold"), V("pex_bison_run", "amber"), V("pex_spruce_snow", "cold"), V("pex_wildflowers", "amber"), V("pex_herd_aerial", "amber"), V("pex_bison_dust", "amber"), V("pex_bison_herd2", "amber")], 4.5);
layReal(905, 1020, [V("pex_wolf", "cold", "Lobos reales"), V("pex_wolf_pack", "cold"), V("pex_snow_falling", "cold")], 4.5);
layReal(1024, 1158, [V("pex_grizzly", "amber", "Oso pardo real"), V("pex_bear_walk", "amber"), V("pex_wolf_forest", "cold"), V("pex_ice_melt", "cold"), V("pex_snow_forest", "cold"), V("pex_blizzard", "cold")], 4.5);
layReal(1238, 1520, [V("pex_winter_valley", "cold"), V("pex_mountains_winter", "cold")], 4.5);

// ── THINNING: separación mínima entre tomas; ante colisión gana el footage REAL
// (real-video > real-foto > clip-IA > foto-IA). Evita el "machine-gun" (<2.8s) y
// asegura que lo real desplace a la IA, no al revés. ──────────────────────────
const MIN_GAP = 2.4;
const prio = (b) => {
  const s = b.src || "";
  if (s.startsWith("broll/")) return 3; // video real (Pexels)
  if (s.startsWith("real/")) return 2;  // foto real (Wikimedia)
  if (s.startsWith("vid/")) return 1;   // clip IA (LTX)
  return 0;                              // foto IA (FLUX)
};
{
  const raws = beats.filter((b) => b.kind === "raw").sort((a, b) => a.start - b.start);
  const drop = new Set();
  let lastKept = null;
  for (const b of raws) {
    if (!lastKept) { lastKept = b; continue; }
    if (b.start - lastKept.start >= MIN_GAP) { lastKept = b; continue; }
    // colisión: dropear el de menor prioridad (si empatan, el más nuevo)
    if (prio(b) > prio(lastKept)) { drop.add(lastKept); lastKept = b; }
    else { drop.add(b); }
  }
  for (let i = beats.length - 1; i >= 0; i--) if (drop.has(beats[i])) beats.splice(i, 1);
}

// ── compute durations from next start (skip helper-only beats) ───────────────
// floats son OVERLAY (solapan el b-roll a propósito) → fuera del tiling, dur fija.
for (const b of beats) { if (b.kind === "float") b.dur = b._dur; }
const real = beats.filter((b) => b.start !== 999 && b.kind !== "float");
real.sort((a, b) => a.start - b.start);
for (let i = 0; i < real.length; i++) {
  const next = real[i + 1];
  const gap = next ? +(next.start - real[i].start).toFixed(2) : +(END - real[i].start).toFixed(2);
  real[i].dur = real[i]._dur != null ? Math.min(real[i]._dur, gap) : gap;
}
// emit: clip beats also need their still image generated (FLUX) → add as image entries via _img
// beatsheet.mjs only generates clip's own png? No: clips need a source image. gen_video uses image=name from public/img.
// So every clip must ALSO have an image generated. We add hidden image beats for clips' stills.
const extraImgs = [];
for (const b of beats) {
  if (b._img) extraImgs.push({ id: b._img.name + "_still", start: 999, kind: "raw", src: `img/${b._img.name}.png`, hue: b.hue, _skipcue: true, gen: { type: "image", name: b._img.name, prompt: b._img.prompt } });
}
const all = [...beats, ...extraImgs];

// clean internal fields
const out = { video: "bisontes", avatar: AVATAR, beats: all.map((b) => {
  const c = { id: b.id, start: b.start, dur: b.dur != null ? b.dur : (b._dur || 3), kind: b.kind };
  for (const k of ["src", "side", "hue", "kicker", "image", "setup", "impact", "impactAccent", "hitAt", "boom", "darken", "value", "prefix", "suffix", "decimals", "label", "eyebrow", "accent", "text", "fontSize", "title", "items", "palette", "cross", "chips", "bg", "slides", "waypoints", "worldImage", "gen"]) {
    if (b[k] !== undefined) c[k] = b[k];
  }
  if (b._skipcue) c._skipcue = true;
  return c;
}) };
// helper-only beats (_skipcue) must still generate their asset but emit NO cue → set kind to a non-cue marker
for (const b of out.beats) { if (b._skipcue) { b.kind = "talk"; delete b._skipcue; } }

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/bisontes.json", JSON.stringify(out, null, 2));
fs.writeFileSync("public/img/prompts_bisontes_diag.json", JSON.stringify(diagPrompts, null, 2));

const cues = out.beats.filter((b) => b.kind !== "talk").length;
console.log(`beats: ${out.beats.length}  ·  cues: ${cues}  ·  diagramas (gpt-image): ${diagPrompts.length}`);
console.log("→ beatsheet/bisontes.json");
console.log("→ public/img/prompts_bisontes_diag.json");
