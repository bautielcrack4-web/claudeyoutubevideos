// rename_fed3_imgs.mjs — copia las imágenes de Flow (nombres por contenido) a
// public/img/<name>.jpg según mi convención fe3_* / dg_fe3_*. Mapeo por texto.
import fs from "fs";
import path from "path";

const SRC = "D:/rtmp/fed3_imgs";
const OUT = "public/img";
fs.mkdirSync(OUT, { recursive: true });

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_");

// [substring normalizado (distintivo), target]. El orden importa: los "_2" primero.
const MAP = [
  // ── con #NN (conservaron mi nombre) ──
  ["fe3_ojos_pesados", "fe3_ojos_pesados"],
  ["fe3_dormir_noche", "fe3_dormir_noche"],
  ["fe3_vaso_agua_noche", "fe3_vaso_agua_noche"],
  ["fe3_cafe_tarde", "fe3_cafe_tarde"],
  ["fe3_dolor_nuca", "fe3_dolor_nuca"],
  // ── DUPLICADOS (_2) — van PRIMERO ──
  ["rubbing_eyes_202607091333_2", "fe3_frota_ojos_noche"],
  ["drinking_water_202607091333_2", "fe3_sed_madrugada"],
  ["looking_in_mirror_202607091333_2", "fe3_cara_hinchada"],
  ["sleeping_peacefully_202607091333_2", "fe3_duerme_costado"],
  // ── DIAGRAMAS ──
  ["alta_tension_dana_capilares", "dg_fe3_tension_capilares"],
  ["cafeina_en_sangre_tiempo", "dg_fe3_cafeina_tiempo"],
  ["dia_vs_noche_ojo", "dg_fe3_dia_vs_noche"],
  ["blood_thickens_with_dehydration", "dg_fe3_sangre_espesa"],
  ["fases_del_sueno_y_reparacion", "dg_fe3_fases_sueno"],
  ["fondo_de_ojo_infografia", "dg_fe3_fondo_ojo"],
  ["glicacion_azucar_opaca", "dg_fe3_glicacion"],
  ["grasa_buena_absorcion", "dg_fe3_grasa_absorcion"],
  ["infografia_presion_arterial", "dg_fe3_dipper"],
  ["luteina_zeaxantina_macula", "dg_fe3_luteina_macula"],
  ["luz_azul_frena_melatonina", "dg_fe3_luz_azul"],
  ["lacteos_bloquean_absorcion", "dg_fe3_calcio_bloquea"],
  ["melatonin_antioxidant_eye_shield", "dg_fe3_melatonina_antiox"],
  ["ojo_taller_reparacion", "dg_fe3_taller_nocturno"],
  ["protocolo_de_la_noche", "dg_fe3_protocolo_noche"],
  ["retina_capillaries_medical", "dg_fe3_capilares_retina"],
  ["retina_consumes_much_oxygen", "dg_fe3_retina_oxigeno"],
  ["retina_hypoxia_illustration", "dg_fe3_hipoxia"],
  ["sleeping_position_increases_eye", "dg_fe3_presion_ocular"],
  ["oxido_nitrico_relaja_capilares", "dg_fe3_oxido_nitrico"],
  // ── FOTOS (por contenido) ──
  ["arandanos_moras_nueces", "fe3_arandanos_nuez"],
  ["avocado_and_olive_oil", "fe3_palta_aceite"],
  ["bowl_of_berries_on_table", "fe3_frutos_rojos_mesa"],
  ["bowl_of_blueberries_with_yogurt", "fe3_arandanos_yogur"],
  ["bowl_of_cereal_with_milk", "fe3_leche_cereal"],
  ["chocolate_square_on_kitchen", "fe3_chocolate_amargo"],
  ["close_up_eye_of_old", "fe3_ojo_cerca"],
  ["dessert_plate_on_table", "fe3_postre_noche"],
  ["doctor_examining_patient", "fe3_fondo_ojo_examen"],
  ["elderly_patient_talking_to_doctor", "fe3_paciente_consulta"],
  ["elderly_person_awake_in_bed", "fe3_desvelada_cama"],
  ["elderly_person_cooking", "fe3_cocina_feliz"],
  ["elderly_person_dining", "fe3_cena_liviana"],
  ["elderly_person_drinking_mate", "fe3_mate_novela"],
  ["elderly_person_drinking_water_202607091333_j", "fe3_toma_ultimo_vaso"],
  ["elderly_person_driving_car", "fe3_maneja_noche"],
  ["elderly_person_going_to_bathroom", "fe3_desvela_bano"],
  ["elderly_person_leg_cramp", "fe3_calambre_pierna"],
  ["elderly_person_looking_at_cold", "fe3_manos_frias_cama"],
  ["elderly_person_looking_at_phone", "fe3_celular_cama"],
  ["elderly_person_looking_in_mirror_202607091333_j", "fe3_espejo_manana"],
  ["elderly_person_looking_out_window", "fe3_mira_ventana_paz"],
  ["elderly_person_measuring_blood", "fe3_tensiometro_brazo"],
  ["elderly_person_reading_label", "fe3_entrecerra_ojos"],
  ["elderly_person_reading_newspaper", "fe3_lee_diario"],
  ["elderly_person_reading_to_child", "fe3_cuento_nieto"],
  ["elderly_person_rubbing_eyes_202607091333_j", "fe3_desperta_borroso"],
  ["elderly_person_sleeping_face_down", "fe3_duerme_boca_abajo"],
  ["elderly_person_sleeping_peacefully_202607091333_j", "fe3_duerme_tranquila"],
  ["elderly_person_touching_eye", "fe3_un_ojo_molesto"],
  ["elderly_person_turning_off_phone", "fe3_apaga_celular"],
  ["elderly_person_walking_at_night", "fe3_camina_noche"],
  ["elderly_person_watching_tv", "fe3_no_toma_agua"],
  ["elderly_person_waving_hand", "fe3_reconoce_gente"],
  ["elderly_person_with_dry_mouth", "fe3_boca_seca"],
  ["elderly_woman_smiling_in_office", "fe3_rosa_paciente"],
  ["fideos_y_pan_en_mesa", "fe3_pan_fideos"],
  ["hand_holding_pill_water", "fe3_pastillas_agua"],
  ["kitchen_window_at_sunset", "fe3_ventana_atardecer"],
  ["man_sitting_in_office", "fe3_alberto_paciente"],
  ["mate_and_thermos_on_table", "fe3_mate_noche"],
  ["morning_light_through_blinds", "fe3_persiana_manana"],
  ["old_alarm_clock_3_am", "fe3_reloj_madrugada"],
  ["plate_of_cookies_tea_night", "fe3_galletitas_te"],
  ["plato_con_espinaca", "fe3_espinaca_plato"],
  ["taza_de_cafe_humeando", "fe3_taza_cafe_manana"],
  ["varied_vegetables_on_board", "fe3_verduras_tabla"],
  ["velador_with_warm_light", "fe3_velador_calido"],
  ["white_ceiling_light_in_bedroom", "fe3_luz_blanca_techo"],
  ["young_doctor_in_office", "fe3_medico_consultorio"],
];

const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const used = new Set();
const targetDone = new Set();
const unmatched = [];
for (const f of files) {
  const n = norm(f);
  let hit = null;
  for (const [sub, target] of MAP) {
    if (used.has(sub)) continue;
    if (n.includes(sub)) { hit = { sub, target }; break; }
  }
  if (!hit) { unmatched.push(f); continue; }
  used.add(hit.sub);
  fs.copyFileSync(path.join(SRC, f), path.join(OUT, hit.target + ".jpg"));
  targetDone.add(hit.target);
}

const allTargets = MAP.map((m) => m[1]);
const missingTargets = [...new Set(allTargets)].filter((t) => !targetDone.has(t));
// mis 80 nombres esperados (para ver qué falta generar)
const expected = [...Array(0)];
console.log(`copiadas: ${targetDone.size} · sin match: ${unmatched.length}`);
if (unmatched.length) console.log("SIN MATCH:", unmatched);
if (missingTargets.length) console.log("targets del map sin archivo:", missingTargets);
console.log("FOTOS en disco:", fs.readdirSync(OUT).filter((f) => /^fe3_.*\.jpg$/.test(f)).length);
console.log("DIAGRAMAS en disco:", fs.readdirSync(OUT).filter((f) => /^dg_fe3_.*\.jpg$/.test(f)).length);
