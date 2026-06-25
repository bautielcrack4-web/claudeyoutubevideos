// anchor_oxido.mjs — inyecta { at: "frase exacta" } en cada clip C()/I() que no lo tenga.
// Mapeo semántico: cada clip → la frase del guion donde se nombra ese visual (única en su sección).
import fs from "fs";

const MAP = {
  // ── HOOK ──
  ox_rust_wrench: "algo de metal en tu vida",
  // ── STAKES ──
  ox_broken_shovel: "la pala que tiraste",
  ox_throw_tool: "porque ya estaba",
  ox_rusty_padlock: "el candado que reventaste",
  ox_hammer_lock: "a martillazos",
  ox_hinge_creak: "la bisagra del porton",
  ox_hinge_rust: "se va a partir",
  ox_rust_spread: "levanta la pintura",
  ox_flaking_rust: "avanza come metal",
  ox_perforated_metal: "en dos o tres anos",
  ox_scrap_pile: "se convierte en chatarra",
  // ── PRINCIPIO ──
  ox_rust_forming: "el oxido rojo el que destruye",
  ox_iron_bar: "hierro oxigeno y agua",
  ox_water_drop_steel: "si le sacas una de las tres",
  ox_old_iron_tool: "todavia esta entero",
  ox_old_vs_new: "el tuyo se deshace",
  ox_oil_rag_metal: "una barrera aceite",
  ox_wax_block: "una capa negra una grasa",
  ox_humid_shed: "entre el metal y el aire humedo",
  ox_air_humid: "el aire lejos del hierro",
  // ── ABUELO ──
  ox_chisel_wood: "de cortar madera",
  ox_chisel_old: "habia sido de su padre",
  ox_wipe_tool_rag: "un trapito con aceite",
  ox_tools_drawer_rust: "se nos pudren en un cajon",
  ox_hands_tool_old: "le gano al tiempo",
  // ── MÉTODO 1 ──
  ox_candle_wax: "un pedazo de cera de abeja",
  ox_light_candle: "una vela comun de parafina",
  ox_wax_screw: "la cera sobre la rosca",
  ox_screws_jar: "antes de ponerlos",
  ox_screw_drive: "la mitad de la fuerza",
  ox_saw_blade_wax: "las hojas de la sierra",
  ox_hinge_pin_out: "herramientas de jardin",
  ox_oil_hinge: "gotas de aceite de maquina",
  ox_oil_blade: "una vez por mes",
  ox_graphite_lock: "esa pelicula es la barrera",
  ox_chalk_sticks: "de esas comunes",
  ox_chalk_box: "de la caja de herramientas",
  ox_silica_packets: "absorbe la humedad del aire",
  ox_dry_tools_hang: "el juego de llaves",
  ox_aerosol_cans: "anticorrosion en aerosol",
  // ── MÉTODO 2 ──
  ox_vinegar_bottle: "comun el de la cocina",
  ox_pour_vinegar: "en vinagre blanco puro",
  ox_bolts_soak: "que la cubra del todo",
  ox_jar_soak_window: "dos o tres horas",
  ox_brush_rust_off: "se va con un cepillo",
  ox_wipe_rust_cloth: "con un simple trapo",
  ox_coarse_salt: "tirale un punado",
  ox_add_salt: "la sal acelera la reaccion",
  ox_rinse_water: "la enjuagas con agua",
  ox_hairdryer_dry: "un secador de pelo",
  ox_oil_after: "le pasas aceite enseguida",
  ox_oily_cloth: "ahora sacale el agua",
  // ── MÉTODO 3 ──
  ox_strong_tea: "el te negro bien cargado",
  ox_tea_pour: "diez saquitos de te negro",
  ox_wire_brush_loose: "un cepillo de alambre",
  ox_brush_tannic: "pincelas eso sobre el oxido",
  ox_rust_darken: "empieza a oscurecer",
  ox_black_coated: "se vuelve un escudo",
  ox_paint_enamel: "pintar con esmalte",
  ox_painted_protected: "protegida por anos",
  ox_converter_bottle: "diez veces el precio",
  // ── INJERTO 1 ──
  ox_notebook_pencil: "me olvidaba las proporciones",
  // ── MÉTODO 4 ──
  ox_bucket_water: "dos cucharadas de soda de lavar",
  ox_washing_soda: "carbonato de sodio",
  ox_spoon_soda: "cinco litros de agua",
  ox_battery_charger: "de seis o doce volts",
  ox_scrap_iron: "que vas a sacrificar",
  ox_dissolve_soda: "disolves la soda de lavar",
  ox_submerge_tool: "metes adentro la pieza oxidada",
  ox_clamp_black: "va a la pieza que queres limpiar",
  ox_clamp_red: "la pinza roja el positivo",
  ox_charger_on: "encendes el cargador",
  ox_bubbles_rise: "vas a ver burbujas subir",
  ox_bucket_overnight: "muy comida toda la noche",
  ox_lift_tool: "a la manana la sacas",
  ox_brush_black_residue: "un residuo negro",
  ox_pull_clean: "aparece el metal sano",
  ox_oil_clean_tool: "aceite o cera como en el metodo",
  // ── MÉTODO 5 ──
  ox_blued_tools: "negro azulado tan lindo",
  ox_clean_steelwool: "lo desengrasas con alcohol",
  ox_heat_tool: "calentas la pieza pareja",
  ox_oil_smoke: "humea al tocarla",
  ox_bluing_form: "esa capa negra protectora",
  ox_wipe_dry_cool: "pasas un trapo seco",
  ox_blued_knife: "muchisimo mejor",
  ox_blacksmith: "los herreros durante siglos",
  // ── INJERTO 2 ──
  ox_manual_sections: "cuarenta arreglos",
  // ── METAL DE AFUERA ──
  ox_iron_fence_rain: "la reja del frente",
  ox_fence_weather: "vive a la intemperie",
  ox_metal_gate_posts: "los postes de metal",
  ox_car_underside: "que nunca miras",
  ox_chassis_hole: "con un agujero",
  ox_brush_railing: "con aceite de linaza",
  ox_linseed_can: "penetra en el metal",
  ox_paint_fence: "un buen esmalte sintetico",
  ox_lanolin_tub: "la grasa natural de la lana",
  ox_sheep_wool: "la lana de oveja",
  ox_spray_underbody: "sellando el chasis con aceite",
  ox_brush_seams: "cada rincon y cada doblez",
  ox_salt_road: "sal sobre la nieve",
  ox_soil_clean: "donde caminan tus hijos",
  // ── EL ERROR ──
  ox_rust_return: "el oxido volvio",
  ox_clean_then_rust: "dejaste intacta la causa",
  ox_damp_corner_tool: "un rincon humedo",
  ox_leak_drip: "la gotera que cae",
  ox_standing_water: "el agua estancada",
  ox_move_dry_shelf: "a un lugar seco",
  ox_fix_leak: "tapa la gotera",
  // ── CIERRE ──
  ox_restored_tools: "salvar las herramientas",
  ox_saved_wrench: "que ibas a tirar",
  ox_wipe_proud: "de la vela a la electrolisis",
  ox_clean_fence_done: "y un monton de cosas",
  // ── PRÓXIMO ──
  ox_wood_rot: "se pudre en cinco",
  ox_old_wood_solid: "cien anos a la intemperie",
};

const path = "build_oxido.mjs";
let lines = fs.readFileSync(path, "utf8").split("\n");
let injected = 0, skipped = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const m = l.match(/^(\s*[CI]\("([a-z0-9_]+)")(.*)\),\s*$/);
  if (!m) continue;
  const name = m[2];
  if (!(name in MAP)) continue;
  if (/\bat:\s*"/.test(l)) continue; // ya anclado
  const phrase = MAP[name];
  // si ya hay objeto de opciones { ... } , insertar at adentro; si no, agregar objeto
  if (/\{[^}]*\}\s*$/.test(m[3])) {
    lines[i] = m[1] + m[3].replace(/\{\s*/, `{ at: ${JSON.stringify(phrase)}, `) + "),";
  } else {
    lines[i] = m[1] + m[3] + `, { at: ${JSON.stringify(phrase)} }),`;
  }
  injected++;
}
fs.writeFileSync(path, lines.join("\n"));
console.log("clips anclados:", injected);
const missing = Object.keys(MAP).filter((n) => !lines.some((l) => new RegExp(`[CI]\\("${n}"`).test(l)));
if (missing.length) console.log("nombres del MAP no encontrados en build:", missing.join(", "));
