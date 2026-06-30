// assets_castores.mjs — rutea cada concepto del pool a Pexels (video 4K) o Bing (imagen real).
// Emite public/broll/shots.json (fetchstock) + public/real/bing_castores.json (fetch_bing).
import fs from "fs";

// PEXELS (video 4K, landscape) — naturaleza, agua, fauna, paisaje, fuego, genéricos filmables
const PX = {
  // castor (Pexels tiene varios clips de beaver; lo que falte cae a Bing en el post-pass)
  cv_beaver_swim: "beaver swimming river", cv_beaver_face: "beaver close up", cv_beaver_teeth: "beaver eating wood",
  cv_beaver_dam: "beaver dam", cv_beaver_lodge: "beaver lodge pond", cv_beaver_walk: "beaver",
  cv_beaver_under: "beaver underwater", cv_beaver_portrait: "beaver closeup", cv_beaver_night: "beaver",
  cv_beaver_kits: "baby beaver", cv_beaver_build: "beaver dam building", cv_beaver_carry: "beaver branch",
  cv_beaver_fell: "tree gnawed beaver", cv_beaver_tail: "beaver tail water", cv_beaver_family: "beavers",
  cv_beaver_dam_aerial: "wetland aerial river",
  // agua / paisaje
  st_river_forest: "river forest aerial", st_stream_rocks: "stream rocks water", st_mountain_valley: "mountain valley forest aerial",
  st_wetland_aerial: "wetland marsh aerial", st_pond_calm: "calm pond forest reflection", st_dry_riverbed: "dry riverbed",
  st_drought_earth: "cracked dry earth", st_dry_canyon: "arid desert canyon", st_forest_aerial: "pine forest aerial",
  st_river_fast: "river rapids", st_meadow_stream: "meadow stream", st_sunset_water: "sunset over river",
  st_marsh_reeds: "marsh reeds water", st_spring_source: "spring water ground", st_water_closeup: "clear water flowing closeup",
  st_dawn_mist: "fog over river morning", st_night_stars: "night sky stars timelapse", st_rain_water: "rain on water surface",
  st_clouds_time: "clouds timelapse mountains", st_sun_through_trees: "sunlight forest canopy", st_drone_wetland: "green wetland drone aerial",
  // fauna que regresa
  cv_deer_water: "deer drinking water", cv_elk_meadow: "elk meadow", cv_ducks_pond: "ducks pond",
  cv_heron: "heron wetland", cv_frog: "frog pond", cv_fish_stream: "trout stream underwater",
  cv_birds_marsh: "birds flying wetland", cv_dragonfly: "dragonfly water", cv_insects_water: "insects pond water",
  cv_wildflowers: "wildflowers meadow", cv_moose_wetland: "moose water",
  // granjas / conflicto (filmable)
  cv_irrigation_canal: "irrigation canal farm", cv_orchard: "apple orchard", cv_flooded_field: "flooded field water",
  cv_log_jam: "logs in river", cv_mule_train: "pack mules trail", cv_horse_pack: "horses mountain trail",
  // ciencia / fuego / cielo
  nw_wildfire: "forest wildfire", st_wildfire_smoke: "wildfire smoke landscape", st_green_amid_burn: "burnt forest",
  st_satellite_earth: "earth from space", nw_old_plane: "vintage propeller airplane", nw_cargo_parachute: "parachute drop sky",
  nw_wwii_parachute: "parachute jump", nw_plane_door_drop: "skydiving plane door", nw_parachute_land: "parachute landing",
  nw_drought_reservoir: "drought reservoir low water", nw_scientist_stream: "scientist river research",
};

// BING (imagen real) — archival/histórico/específico que Pexels NO tiene
const BG = {
  nw_beaver_parachute: "beavers parachute Idaho 1948 fur for the future",
  nw_fur_future_film: "Fur for the Future Idaho beaver film 1950 archival",
  nw_wood_crate: "1940s wooden crate box vintage",
  nw_postwar_town: "1948 american small town main street",
  nw_farm_1940s: "1940s farm homestead black and white",
  nw_fur_pelts: "beaver fur pelts stack fur trade",
  nw_felt_hat: "antique beaver felt top hat 19th century",
  nw_trapper_history: "historical fur trappers beaver trade painting",
  nw_old_map: "antique map north america rivers",
  nw_release_beaver: "releasing beaver into river reintroduction",
  nw_bda_build: "beaver dam analog restoration building posts stream",
  st_satellite_green: "beaver wetland satellite aerial green valley",
  st_aquifer_soil: "groundwater soaking into soil illustration",
};

const shots = Object.entries(PX).map(([name, query]) => ({ name, query, type: "video", orientation: "landscape" }));
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/broll/shots.json", JSON.stringify(shots, null, 2));

const bing = Object.entries(BG).map(([name, query]) => ({ name, query, count: 2 }));
fs.mkdirSync("public/real", { recursive: true });
fs.writeFileSync("public/real/bing_castores.json", JSON.stringify(bing, null, 2));

console.log(`shots.json: ${shots.length} clips Pexels · bing_castores.json: ${bing.length} imágenes`);
