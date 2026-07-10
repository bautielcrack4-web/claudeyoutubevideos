// imglist_federer3.mjs — arma public/img/prompts_federer3.json (Video 3 OJOS).
// Fórmula CASUAL nueva (feedback usuario jul 2026): NADA de desenfoque/bokeh artístico
// ni look de banco de imágenes. Todo como foto de celular común, sacada sin pensar.
// TOPE 100 imágenes por lista. Se generan con flowgen (Flow/Nano Banana) a FLOW_CONCURRENCY=3.
import fs from "fs";

// ── PROMPT CASUAL (celular común, todo en foco, sin bokeh) ──
const CAS = "Que parezca una foto que alguien sacó rápido y sin pensar en su casa: encuadre un poco torcido y descuidado, luz normal de casa o de ventana (nada de luz de estudio), TODO bastante en foco como una foto real de celular (nada de fondo desenfocado ni bokeh artístico), colores un poco planos y apagados, algo de grano, espontánea e imperfecta, gente real con caras y manos normales. Que NO parezca foto de banco de imágenes, ni foto profesional, ni con filtros. Sin texto ni marcas de agua.";
const P = (d) => `Foto RE casual sacada con un celular común, 16:9 horizontal. ${d}. ${CAS}`;
// paciente/persona mayor (sujeto recurrente)
const O = (d) => P(`una persona mayor de unos 70 años, ${d}`);

const S = []; // {name, prompt}
const r = (name, scene) => S.push({ name, prompt: P(scene) });
const o = (name, scene) => S.push({ name, prompt: O(scene) });

// ── HOOK / vista borrosa al despertar ──
o("fe3_desperta_borroso", "recién despierta en la cama, se frota los ojos, con cara de vista nublada, luz de la mañana entrando por la persiana");
o("fe3_ojos_pesados", "sentada en el borde de la cama a la mañana, con los ojos cansados y pesados, todavía en pijama");
o("fe3_manos_frias_cama", "mirándose las manos frías apenas se despierta, sábanas revueltas");
o("fe3_entrecerra_ojos", "entrecerrando los ojos para leer la etiqueta de un frasco en la cocina");
r("fe3_taza_cafe_manana", "una taza de café negro humeando sobre la mesada de la cocina a la mañana");
o("fe3_espejo_manana", "mirándose en el espejo del baño a la mañana, cara de recién levantada, algo preocupada");

// ── EL MÉDICO / consultorio ──
r("fe3_medico_consultorio", "un médico joven de unos 38 años con guardapolvo blanco sentado en su consultorio sencillo, luz de ventana");
o("fe3_paciente_consulta", "un paciente mayor sentado frente al escritorio del médico, contando algo con las manos");
r("fe3_fondo_ojo_examen", "un médico revisando el ojo de un paciente mayor con una lucecita, de cerca, en un consultorio simple");

// ── MECANISMO / ojo, noche, reparación ──
o("fe3_ojo_cerca", "primer plano del ojo de una persona mayor, iris y párpado, sin maquillaje, textura real de la piel");
r("fe3_dormir_noche", "un dormitorio de noche con una persona mayor durmiendo, luz muy tenue de un velador");
r("fe3_reloj_madrugada", "un despertador viejo en la mesa de luz marcando las 3 de la madrugada, habitación oscura");

// ── ERROR 6 · deshidratación ──
r("fe3_vaso_agua_noche", "un vaso de agua sobre la mesa de luz al lado de la cama, de noche");
o("fe3_no_toma_agua", "sentada en el sillón a la noche sin tomar agua, mirando tele, con un vaso vacío al lado");
o("fe3_boca_seca", "recién despierta con la boca seca, pasándose la lengua por los labios, cara de sed");
o("fe3_calambre_pierna", "en la cama a la madrugada agarrándose la pantorrilla por un calambre, gesto de dolor");
o("fe3_toma_ultimo_vaso", "tomando un último vaso de agua en la cocina antes de ir a dormir, en pijama");

// ── ERROR 5 · café/mate tarde ──
r("fe3_mate_noche", "un mate con la bombilla y un termo sobre una mesa a la noche, con la tele prendida de fondo");
o("fe3_mate_novela", "tomando mate en el sillón de noche mientras mira una novela en la tele");
r("fe3_cafe_tarde", "una taza de café en una mesa a media tarde, con la luz anaranjada del atardecer por la ventana");
o("fe3_desvelada_cama", "acostada en la cama de noche con los ojos abiertos, desvelada, mirando el techo");
o("fe3_rosa_paciente", "una señora de 68 años sonriendo aliviada en el consultorio, contándole algo bueno al médico");
r("fe3_te_hierbas", "una taza de té de hierbas en la mesada de la cocina a la noche, humeando");

// ── ERROR 4 · pantalla + postura ──
o("fe3_celular_cama", "mirando el celular en la cama con la luz apagada, la cara iluminada por la pantalla azul");
o("fe3_duerme_boca_abajo", "durmiendo boca abajo con la cara hundida en la almohada");
o("fe3_un_ojo_molesto", "recién despierta tocándose un solo ojo, el que estaba apoyado en la almohada, gesto de molestia");
r("fe3_velador_calido", "un velador con luz amarilla cálida y tenue en una mesa de luz, dormitorio de noche");
r("fe3_luz_blanca_techo", "una luz blanca fría de techo prendida en un dormitorio, se ve dura y fea");
o("fe3_duerme_costado", "durmiendo tranquila de costado con una almohada que le sostiene bien el cuello");

// ── ERROR 3 · tensión nocturna ──
o("fe3_tensiometro_brazo", "con un tensiómetro en el brazo midiéndose la presión en su casa, sentada a la mesa");
o("fe3_dolor_nuca", "recién despierta agarrándose la nuca con dolor de cabeza, en el borde de la cama");
o("fe3_desvela_bano", "levantándose a la madrugada para ir al baño, medio dormida, pasillo oscuro");
o("fe3_cara_hinchada", "con la cara un poco hinchada a la mañana, mirándose en el espejo del baño");

// ── ERROR 2 · absorción ──
r("fe3_arandanos_yogur", "un bowl de arándanos con yogur blanco encima, sobre una mesa de cocina (la forma equivocada)");
r("fe3_arandanos_nuez", "un puñado de arándanos y moras con nueces picadas al lado, en un plato simple");
r("fe3_espinaca_plato", "un plato con espinaca y verduras verdes sobre una mesa de cocina común");
r("fe3_palta_aceite", "media palta y un chorrito de aceite de oliva sobre una tabla de madera en la cocina");
r("fe3_frutos_rojos_mesa", "un bowl de frutos rojos variados sobre una mesa de cocina, luz de ventana");
r("fe3_leche_cereal", "un tazón de cereales con leche sobre la mesa del desayuno");

// ── ERROR 1 · azúcar / glicación ──
r("fe3_postre_noche", "un plato de postre dulce con crema sobre la mesa después de cenar, de noche");
r("fe3_galletitas_te", "un plato con galletitas dulces al lado de una taza de té, de noche en la cocina");
r("fe3_pan_fideos", "un plato grande de fideos y pan sobre la mesa de la cena");
o("fe3_alberto_paciente", "un hombre jubilado de 71 años, de pocas palabras, sentado en el consultorio con cara seria");
o("fe3_cena_liviana", "cenando algo liviano, un plato con verduras y algo de pollo, en la mesa de la cocina de noche");
o("fe3_sed_madrugada", "tomando agua de un vaso a la madrugada, media dormida, con mucha sed");

// ── PROTOCOLO / qué hacer ──
o("fe3_camina_noche", "caminando tranquila por la vereda del barrio después de cenar, de noche, luz de faroles");
r("fe3_chocolate_amargo", "un cuadradito de chocolate amargo oscuro sobre un plato, en la mesa de la cocina");
o("fe3_apaga_celular", "dejando el celular boca abajo en la mesa de luz antes de dormir, gesto de apagarlo");
o("fe3_duerme_tranquila", "durmiendo tranquila y relajada boca arriba, dormitorio en penumbra, cara en paz");

// ── CIERRE / emocional ──
o("fe3_cuento_nieto", "leyéndole un cuento a un nieto chico sentados juntos en un sillón, luz cálida de living");
o("fe3_reconoce_gente", "saludando con la mano a alguien que cruza la calle, de día, en la vereda");
o("fe3_maneja_noche", "manejando el auto de noche por la ciudad, vista desde adentro, luces de la calle");
o("fe3_cocina_feliz", "cocinando en su cocina, cortando verduras, tranquila y de buen humor");
o("fe3_mira_ventana_paz", "tomando algo caliente mirando por la ventana a la mañana, tranquila, luz suave");

// ── extras / relleno de acción para densidad ──
r("fe3_persiana_manana", "la luz de la mañana entrando por una persiana entreabierta en un dormitorio");
o("fe3_frota_ojos_noche", "frotándose los ojos cansados a la noche, sentada en la cama");
r("fe3_pastillas_agua", "una mano mayor con una pastilla y un vaso de agua a la mañana, sobre la mesa");
r("fe3_verduras_tabla", "verduras variadas sobre una tabla en la cocina, tomate, zanahoria, verde");
o("fe3_lee_diario", "leyendo el diario en la mesa de la cocina con los anteojos puestos, entrecerrando un poco los ojos");
r("fe3_ventana_atardecer", "la ventana de una cocina al atardecer, luz anaranjada, todo hogareño y desordenado");

const OUT = S.slice(0, 100);
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_federer3.json", JSON.stringify(OUT.map((x) => ({ name: x.name, prompt: x.prompt })), null, 2));
console.log(`prompts_federer3.json: ${OUT.length} imágenes (tope 100)`);
console.log("primeras:", OUT.slice(0, 3).map((x) => x.name).join(", "));
