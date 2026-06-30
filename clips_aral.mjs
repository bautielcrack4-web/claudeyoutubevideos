// clips_aral.mjs — POOL de conceptos para el documental del MAR DE ARAL.
// ★ Mejora pedida (jun 2026): queries con CONTEXTO arrastrado (sujeto = Mar de Aral) +
// MULTI-EXTRACCIÓN de documentales clave (campo urls + MATCH_REUSE=1 → muchos clips de cada doc,
// timestamps distintos). Emite public/broll/match_aral.json (para matchclip MATCH_REUSE=1).
import fs from "fs";

// ── DOCUMENTALES FUENTE (multi-extracción) ──
const D = {
  vanish: "https://youtu.be/MZ2594EETbU",   // The Vanishing of the Aral Sea (25m)
  toxic:  "https://youtu.be/xEIt4OojA3Y",   // The Aral Sea: The Toxic Soviet Sea (24m)
  ghost:  "https://youtu.be/5OURVhttKvM",   // Ghost Fleet of the Aral Sea — Abandoned Engineering (44m)
  ussr:   "https://youtu.be/uxu3iYQJeW4",   // How the USSR Destroyed the World's Largest Lake (13m)
  reborn: "https://youtu.be/LJnNYDK48kA",   // Aral Sea Reborn — earthrise (12m) — RECUPERACIÓN
  bbc1:   "https://youtu.be/5N-_69cWyKo",   // BBC: the sea that dried up in 40 years
  bbc2:   "https://youtu.be/FzvEW1FHc60",   // BBC: man-made environmental disaster
};
const DEATH = [D.vanish, D.toxic, D.ussr, D.bbc1, D.bbc2]; // pool "muerte del mar"
const GHOST = [D.ghost, D.vanish, D.toxic];                // pool "barcos fantasma / Moynaq"
const REBORN = [D.reborn, D.bbc1];                         // pool "regreso / Kokaral / peces"

const M = [];
const seen = new Set();
// d(name, urls[], concept, dur)  → multi-extracción de documentales
const d = (name, urls, concept, dur = 6) => { if (seen.has(name)) return; seen.add(name); M.push({ name, urls, concept, dur }); };
// q(name, query, concept, dur)   → búsqueda YouTube específica (sujeto Aral pegado)
const q = (name, query, concept, dur = 6) => { if (seen.has(name)) return; seen.add(name); M.push({ name, query: Array.isArray(query) ? query : [query], concept, dur }); };

// ── BARCOS FANTASMA / MOYNAQ (de los docs, muchos ángulos distintos) ──
d("ar_ship_sand1", GHOST, "a rusty fishing ship abandoned on desert sand where a sea used to be");
d("ar_ship_sand2", GHOST, "row of rusted shipwrecks stranded on dry cracked seabed");
d("ar_ship_closeup", GHOST, "close up of a rusted ship hull corroded in the desert");
d("ar_ship_aerial", GHOST, "aerial view of abandoned ships scattered on the dry Aral seabed");
d("ar_ship_people", GHOST, "people walking among giant rusted ships on the sand");
d("ar_moynaq", GHOST, "the ship graveyard of Moynaq former fishing port");
d("ar_ship_inside", GHOST, "interior of a decaying abandoned fishing trawler rusted");
d("ar_ship_sunset", GHOST, "rusted shipwreck silhouette on the desert at sunset");

// ── LO QUE ERA: mar lleno, pesca próspera (docs + archivo) ──
d("ar_old_sea", DEATH, "old footage of the full Aral Sea with waves, a vast inland sea");
d("ar_old_fishing", DEATH, "vintage footage of Soviet fishermen pulling nets full of fish on the Aral Sea");
d("ar_old_port", DEATH, "old busy fishing port on the Aral Sea with many boats");
d("ar_old_cannery", DEATH, "vintage fish cannery factory workers canning fish Soviet era");
q("ar_fish_catch", "fishermen pulling net full of fish lake", "a net hauled up full of silver fish");
q("ar_map_aral_full", ["Aral Sea map central asia", "satellite Aral Sea large blue lake"], "a map showing the large Aral Sea between Kazakhstan and Uzbekistan");

// ── LOS DOS RÍOS / EQUILIBRIO ──
q("ar_river_mountains", "river flowing from snowy mountains into desert", "a wide river carrying meltwater from distant mountains");
q("ar_river_desert", "large river crossing arid desert aerial", "a big river winding across the dry desert");
d("ar_river_delta", DEATH, "a river delta emptying into the Aral Sea from above");

// ── LA DECISIÓN SOVIÉTICA / ALGODÓN / CANALES ──
d("ar_soviet_plan", DEATH, "Soviet officials planners looking at a map of central asia 1960s");
q("ar_cotton_field", ["cotton field harvest central asia", "white cotton plantation rows"], "vast fields of white cotton in the desert");
q("ar_cotton_pick", "workers picking cotton by hand field", "workers harvesting cotton by hand");
d("ar_canal_dig", DEATH, "excavators digging huge irrigation canals in the desert Soviet era");
q("ar_canal_water", ["irrigation canal water flowing desert", "large irrigation channel arid land"], "water rushing through a huge irrigation canal in the desert");
q("ar_canal_leak", "water leaking into sand from earthen canal", "water seeping and wasted into the sand from an unlined canal");

// ── EL MAR RETROCEDE / SE SECA ──
d("ar_retreat1", DEATH, "the shoreline of the Aral Sea retreating leaving dry land");
d("ar_dry_bed", DEATH, "cracked dry former seabed of the Aral Sea stretching to horizon");
q("ar_cracked_mud", "cracked dry mud lakebed close up", "cracked dry mud where water used to be");
d("ar_pier_dry", GHOST, "an old wooden pier left stranded far from any water on dry land");
q("ar_salt_crust", "white salt crust on dry lakebed", "a white crust of salt covering the dry ground");
d("ar_salt_flat", DEATH, "endless white salt flats of the dried Aral seabed");

// ── PECES MUEREN / SAL ──
q("ar_dead_fish", "dead fish on dry cracked lakebed", "dead fish lying on the cracked dry ground");
q("ar_salty_water", "salty shallow water evaporating white edges", "shallow salty water with white salt edges evaporating");
d("ar_empty_boat", GHOST, "a single abandoned fishing boat half buried in sand");

// ── DESASTRE HUMANO / PUEBLOS / SALUD / POLVO ──
d("ar_ghost_town", GHOST, "an abandoned former fishing town near the dry Aral Sea");
d("ar_dust_storm", DEATH, "a huge dust storm of salt sweeping over the dry Aral region");
q("ar_dust_sky", "dust storm sweeping across desert town", "a wall of dust blowing over houses");
q("ar_sat_duststorm", "dust storm seen from satellite space", "a dust storm seen from orbit over central asia");
d("ar_sick_people", DEATH, "people in a poor central asian village affected by the Aral disaster");
q("ar_salt_crops", "salt damaged dead crops field", "crops withered and ruined by salt in the soil");

// ── SATÉLITE / ENCOGIMIENTO ──
q("ar_sat_shrink", ["Aral Sea shrinking satellite timelapse", "Aral Sea satellite 1960 to 2010"], "satellite images of the Aral Sea shrinking year after year");
q("ar_earth_space", "earth from space central asia lake", "a view of central asia and its lakes from space");

// ── EL GIRO: NORTE vs SUR / LA IDEA DEL MURO ──
q("ar_map_split", "Aral Sea split north south map satellite", "a map of the Aral Sea split into a north and south part");
d("ar_north_water", REBORN, "the remaining water of the North Aral Sea");

// ── LA REPRESA DE KOKARAL ──
d("ar_dam_build", REBORN, "construction of the Kokaral dam dike across the Aral Sea");
d("ar_dam_aerial", REBORN, "aerial view of the Kokaral dam holding back water");
q("ar_dam_earthen", "earthen dam dike across water aerial", "a long earthen dam stretching across the water");
q("ar_dam_sluice", "dam sluice gate releasing water", "a dam gate controlling and releasing water");

// ── EL REGRESO: AGUA SUBE / SAL BAJA / PECES / PESCADORES ──
d("ar_water_return", REBORN, "water returning and rising in the North Aral Sea");
d("ar_waves_shore", REBORN, "waves of the revived Aral Sea breaking on the shore");
q("ar_water_aerial", "blue lake water returning aerial drone", "blue water filling a basin seen from above");
d("ar_fish_return", REBORN, "fish swimming again in the recovered North Aral Sea");
q("ar_fish_underwater", "fish swimming underwater freshwater lake", "fish swimming in clear water");
d("ar_fishermen_back", REBORN, "fishermen returning to fish on the revived Aral Sea");
d("ar_fish_net_haul", REBORN, "fishermen hauling a net of fish from the North Aral Sea");
d("ar_aralsk", REBORN, "the town of Aralsk former port near the returning Aral Sea");
q("ar_fish_market", "fresh fish market stall central asia", "fresh caught fish at a market stall");
q("ar_boat_out", "small fishing boat heading out on a lake morning", "a small fishing boat heading out onto the water at dawn");

// ── SUR MUERTO (contraste honesto) ──
d("ar_south_dead", DEATH, "the still-dry dead southern part of the Aral Sea desert");

// ── ATMÓSFERA / CIERRE ──
q("ar_gulls", "seagulls flying over lake water", "seagulls flying over the water");
q("ar_sunset_water", "sunset over a calm lake water", "golden sunset over calm water");
q("ar_kid_shore", "child looking at a lake shore", "a child looking out at the water from the shore");
d("ar_ship_and_water", REBORN, "a rusted old ship on sand with new water visible in the distance");

const out = "public/broll/match_aral.json";
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync(out, JSON.stringify(M, null, 2));
const docN = M.filter((x) => x.urls).length, qN = M.filter((x) => x.query).length;
console.log(`${out}: ${M.length} conceptos · ${docN} multi-doc (urls) · ${qN} búsqueda`);
