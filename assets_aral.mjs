// assets_aral.mjs — Pexels (video 4K genérico) + Bing (mapas/archivo) para el Mar de Aral.
import fs from "fs";
const PX = {
  ar_desert_sand: "desert sand dunes wind", ar_cracked_earth: "cracked dry earth lakebed",
  ar_salt_flat2: "white salt flat desert", ar_dust_storm2: "dust storm desert sky",
  ar_lake_waves: "lake waves shore blue water", ar_fish_underwater2: "fish swimming underwater lake",
  ar_fish_net2: "fishing net full of fish", ar_fish_boat2: "small fishing boat on lake",
  ar_seagulls2: "seagulls flying over water", ar_sunset_lake2: "sunset over calm lake",
  ar_cotton2: "cotton field harvest white", ar_canal2: "irrigation canal water desert farm",
  ar_rusty_metal: "rusty corroded metal close up", ar_river_mtn2: "river from snowy mountains",
  ar_earth_space2: "earth from space blue planet", ar_drone_water: "drone over blue lake water aerial",
  ar_dead_tree: "dead tree dry barren land", ar_village_poor: "poor rural village central asia houses",
  ar_water_pour: "clear water flowing close up", ar_market_fish2: "fresh fish market stall",
};
const BG = {
  ar_map_aral: "Aral Sea map Kazakhstan Uzbekistan central asia",
  ar_map_split2: "Aral Sea north south split map",
  ar_sat_beforeafter: "Aral Sea satellite before after shrinking comparison",
  ar_moynaq_ships: "Moynaq ship graveyard Aral Sea rusted ships sand",
  ar_kokaral_dam: "Kokaral dam Aral Sea aerial dike",
  ar_soviet_cotton: "Soviet cotton harvest Uzbekistan 1970s",
  ar_aral_1960: "Aral Sea 1960 fishing boats port historic",
  ar_dust_satellite: "Aral Sea dust storm satellite image",
};
const shots = Object.entries(PX).map(([name, query]) => ({ name, query, type: "video", orientation: "landscape" }));
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/broll/shots_aral.json", JSON.stringify(shots, null, 2));
const bing = Object.entries(BG).map(([name, query]) => ({ name, query, count: 2 }));
fs.mkdirSync("public/real", { recursive: true });
fs.writeFileSync("public/real/bing_aral.json", JSON.stringify(bing, null, 2));
console.log(`shots_aral.json: ${shots.length} Pexels · bing_aral.json: ${bing.length} imágenes`);
