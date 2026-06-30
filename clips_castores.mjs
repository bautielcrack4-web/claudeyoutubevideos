// clips_castores.mjs — POOL de conceptos (clips-first) para el documental de los castores
// paracaidistas de Idaho (1948) + el regreso del agua. Emite public/broll/match_castores.json
// para matchfarm. Queries VISUALES, en inglés, ancladas al TEMA (nunca la palabra literal).
import fs from "fs";

// M(name, query, concept, dur)
const M = [];
const seen = new Set();
const m = (name, query, concept, dur = 6) => {
  if (seen.has(name)) return; seen.add(name);
  M.push({ name, query: Array.isArray(query) ? query : [query], concept, dur });
};

// ── COMPORTAMIENTO DEL CASTOR (cv_) — el sujeto, mucha variedad ──
m("cv_beaver_swim", ["beaver swimming in a river", "beaver swimming pond surface"], "a beaver swimming across calm water");
m("cv_beaver_face", ["beaver close up eating", "beaver face closeup chewing"], "extreme close up of a beaver's face and teeth");
m("cv_beaver_teeth", ["beaver gnawing tree trunk", "beaver chewing wood"], "a beaver gnawing the trunk of a tree");
m("cv_beaver_fell", ["beaver cutting down tree", "tree felled by beaver gnaw marks"], "a tree trunk chewed to a point by a beaver");
m("cv_beaver_carry", ["beaver carrying branch in water", "beaver dragging stick"], "a beaver carrying a branch through the water");
m("cv_beaver_dam", ["beaver dam in a stream", "beaver dam close up sticks"], "a beaver dam of sticks and mud across a stream");
m("cv_beaver_build", ["beaver building dam pushing mud", "beaver repairing dam"], "a beaver piling sticks and mud onto its dam");
m("cv_beaver_lodge", ["beaver lodge dome of sticks pond", "beaver lodge winter"], "a domed beaver lodge of branches in a pond");
m("cv_beaver_night", ["beaver at night working", "beaver nocturnal trail camera"], "a beaver moving at night");
m("cv_beaver_kits", ["baby beaver kits", "beaver babies in lodge"], "tiny beaver kits");
m("cv_beaver_walk", ["beaver walking on land waddling", "beaver on river bank"], "a beaver waddling on land");
m("cv_beaver_tail", ["beaver slapping tail on water", "beaver tail slap splash"], "a beaver slapping its flat tail on the water");
m("cv_beaver_under", ["beaver swimming underwater", "beaver diving underwater"], "a beaver gliding underwater");
m("cv_beaver_family", ["beaver family group pond", "two beavers together"], "a family of beavers together in their pond");
m("cv_beaver_portrait", ["beaver portrait wet fur", "beaver sitting eating closeup"], "a calm portrait of a beaver, wet fur shining");
m("cv_beaver_dam_aerial", ["aerial beaver dam complex wetland", "beaver dams from above drone"], "an aerial view of a sprawling beaver dam complex");

// ── RÍOS, BOSQUES, HUMEDALES Y TIERRA SECA (st_/cv_) ──
m("st_river_forest", ["clear mountain river forest", "wild river through pine forest"], "a clear river winding through wild forest");
m("st_stream_rocks", ["small stream over rocks", "trickle of water mossy rocks"], "a thin stream trickling over rocks");
m("st_mountain_valley", ["aerial wild forested mountain valley", "remote wilderness valley drone"], "a vast remote forested mountain valley from the air");
m("st_wetland_aerial", ["aerial green wetland marsh", "wetland from above winding water"], "a lush green wetland seen from above");
m("st_pond_calm", ["calm pond reflection forest", "still pond water reflection trees"], "a calm pond mirroring the forest");
m("st_dry_riverbed", ["dry cracked riverbed", "empty dry stream bed drought"], "a dry, empty riverbed");
m("st_drought_earth", ["cracked dry earth drought", "parched cracked soil"], "parched, cracked dry earth");
m("st_dry_canyon", ["dry desert canyon arid west", "barren arid western landscape"], "an arid, barren western landscape");
m("st_forest_aerial", ["aerial pine forest mountains", "drone over evergreen forest"], "an aerial sweep over endless evergreen forest");
m("st_river_fast", ["fast flowing river rapids", "river current rushing"], "a fast river rushing downstream");
m("st_meadow_stream", ["green meadow with stream", "lush meadow water grass"], "a green meadow with a stream running through it");
m("st_sunset_water", ["sunset over river golden", "golden hour over wetland"], "golden sunset light over water");
m("st_marsh_reeds", ["marsh reeds water", "reeds and cattails wetland"], "reeds and cattails swaying in a marsh");
m("st_spring_source", ["spring water bubbling ground", "groundwater seeping wet soil"], "water seeping up from the ground");
m("st_aquifer_soil", ["water soaking into soil cross section", "water filtering through earth"], "water soaking down into the soil");

// ── EL AIRDROP DE 1948 (nw_) — archival real + aviones/paracaídas de época ──
m("nw_beaver_parachute", ["parachuting beavers Idaho 1948", "Geronimo beaver parachute Fur for the Future", "beaver dropped by parachute"], "archival footage of beavers being parachuted into the wilderness");
m("nw_fur_future_film", ["Fur for the Future beaver film Idaho", "Idaho fish game beaver airdrop archival"], "the old restored film of the beaver parachute operation");
m("nw_old_plane", ["1940s propeller airplane flying", "vintage propeller plane in flight"], "a 1940s propeller airplane in flight");
m("nw_cargo_parachute", ["cargo parachute supply drop plane 1940s", "crate parachuting down from sky"], "a crate descending under a parachute");
m("nw_wwii_parachute", ["WWII parachute soldiers jump archival", "military parachute surplus 1940s"], "World War II era parachutes");
m("nw_plane_door_drop", ["airdrop from plane open door", "dropping cargo out of airplane door"], "cargo being pushed out of an airplane door");
m("nw_wood_crate", ["wooden crate box vintage", "rustic wooden box on ground"], "a rough wooden crate");
m("nw_parachute_land", ["parachute landing on ground field", "white parachute collapsing on grass"], "a white parachute settling onto the ground");

// ── MULAS, CABALLOS, REUBICACIÓN ──
m("cv_mule_train", ["pack mules on mountain trail", "mule train wilderness packing"], "a train of pack mules on a steep mountain trail");
m("cv_horse_pack", ["horseback pack trip wilderness forest", "horses carrying load mountains"], "horses hauling loads through the wilderness");
m("nw_release_beaver", ["releasing a beaver into the wild river", "beaver released from crate into water"], "a beaver being released into a river");

// ── ESTADOS UNIDOS DE POSGUERRA / GRANJAS / CONFLICTO ──
m("nw_postwar_town", ["1940s american town main street archival", "post war america 1948 street"], "a 1940s American town being built up");
m("nw_farm_1940s", ["1940s farm homestead archival", "vintage farm family 1940s"], "a 1940s farm and homestead");
m("cv_irrigation_canal", ["irrigation canal farmland water", "farm irrigation ditch flowing"], "water running through a farm irrigation canal");
m("cv_orchard", ["apple orchard rows of trees", "fruit orchard farm"], "rows of fruit trees in an orchard");
m("cv_flooded_field", ["flooded farm field water", "farmland under water flood"], "a farm field drowned under water");
m("cv_log_jam", ["logs jammed in stream", "branches blocking water flow"], "branches and logs jamming a waterway");

// ── COMERCIO DE PIELES / HISTORIA ──
m("nw_fur_pelts", ["stack of beaver fur pelts", "fur trade pelts trapper"], "a stack of beaver pelts");
m("nw_felt_hat", ["vintage felt top hat 19th century", "old fashioned beaver felt hat"], "an old-fashioned felt top hat");
m("nw_trapper_history", ["historical fur trapper river painting", "old fur trade canoe trappers"], "historical fur trappers");
m("nw_old_map", ["antique map of north america rivers", "vintage map continent"], "an antique map of the continent");

// ── CIENCIA MODERNA / SATÉLITE / RESTAURACIÓN ──
m("st_satellite_earth", ["satellite view of land from space", "earth from orbit land rivers"], "a satellite view of the land from space");
m("st_satellite_green", ["satellite imagery green river valley", "aerial green ribbon through dry land"], "green ribbons of vegetation seen from above in dry land");
m("nw_scientist_stream", ["scientists field research stream measuring", "ecologist studying creek"], "scientists studying a stream in the field");
m("nw_bda_build", ["beaver dam analog restoration building", "people building fake beaver dam posts"], "people building a hand-made beaver-style dam");
m("st_drone_wetland", ["drone over green wetland oasis", "aerial lush green valley water"], "a drone gliding over a green wetland oasis");
m("nw_wildfire", ["forest wildfire burning trees", "wildfire flames forest"], "a forest wildfire burning");
m("st_wildfire_smoke", ["wildfire smoke over hills landscape", "burnt forest smoke"], "smoke rising over a burning landscape");
m("st_green_amid_burn", ["green wet area beside burnt forest", "unburned green patch wildfire"], "a green wet patch surviving amid burnt land");
m("nw_drought_reservoir", ["drought low reservoir cracked", "dried up lake drought aerial"], "a reservoir shrunk by drought");

// ── FAUNA QUE REGRESA AL HUMEDAL ──
m("cv_deer_water", ["deer drinking at stream", "deer at water edge forest"], "a deer drinking at the water's edge");
m("cv_elk_meadow", ["elk in green meadow", "elk herd grassland"], "elk grazing in a green meadow");
m("cv_ducks_pond", ["ducks swimming on pond", "ducks taking off water"], "ducks on a pond");
m("cv_heron", ["great heron in wetland fishing", "heron standing in marsh"], "a heron hunting in the shallows");
m("cv_frog", ["frog in pond closeup", "frog on lily pad"], "a frog at the water's edge");
m("cv_fish_stream", ["trout in clear stream underwater", "fish swimming clear river"], "fish darting through a clear stream");
m("cv_birds_marsh", ["flock of birds over wetland", "birds flying over marsh sunset"], "birds rising over a wetland");
m("cv_dragonfly", ["dragonfly on reed water", "dragonfly closeup pond"], "a dragonfly hovering over the water");
m("cv_insects_water", ["insects over pond water surface", "mayflies above stream"], "insects dancing over the water");
m("cv_wildflowers", ["wildflowers meadow breeze", "meadow flowers close up"], "wildflowers nodding in a green meadow");
m("cv_moose_wetland", ["moose in wetland water", "moose wading marsh"], "a moose wading in a wetland");

// ── ATMÓSFERA / TRANSICIONES ──
m("st_night_stars", ["night sky stars over forest timelapse", "starry sky wilderness"], "a starry night sky over the wild");
m("st_dawn_mist", ["misty dawn over river valley", "fog over water morning"], "mist drifting over a river at dawn");
m("st_rain_water", ["rain falling on pond surface", "raindrops on water ripples"], "rain dimpling the surface of the water");
m("st_clouds_time", ["clouds timelapse over mountains", "fast clouds over valley"], "clouds racing over the mountains");
m("st_water_closeup", ["water flowing closeup slow motion", "clear water over stones macro"], "clear water flowing in close up");
m("st_sun_through_trees", ["sunlight through forest canopy", "sun rays pine trees"], "sunlight pouring through the forest");

const out = "public/broll/match_castores.json";
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync(out, JSON.stringify(M, null, 2));
console.log(`${out}: ${M.length} conceptos`);
