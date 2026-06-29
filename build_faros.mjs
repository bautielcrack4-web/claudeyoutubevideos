// build_plomeria.mjs — CLIPS-FIRST DENSO (Constructor Libre, "El Plomero De 65 Años").
// Avatar Tomás + b-roll dominante REAL: clips YouTube (matchfarm proxies) + cientos de imágenes
// web (fetch_bing). AI solo diagramas. Queries ANALIZADAS del guion (específicas, EN inglés,
// ancladas al tema) — no random. Pacing ~4-5s (denso). REGLA #0: cada beat al ms exacto.
// Modos:  node build_oxido.mjs match  |  node build_oxido.mjs
import fs from "fs";

const SLUG = "faros";
const AVATAR = `${SLUG}_opt.mp4`;
const MODE = process.argv[2] === "match" ? "match" : "build";
const MINGAP = Number(process.env.OX_MINGAP) || 2.2;
const OPEN = 1.6, OV = 0.4, DLDUR = 6;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); for (let i = 0; i <= Wc.length - t.length; i++) { let ok = 1; for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; } if (ok) return Wc[i].ms / 1000; } throw new Error("ANCHOR NOT FOUND: " + phrase); };
const atc = (p) => { try { return at(p); } catch { console.warn("⚠ anchor missing:", p); return null; } };
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.5).toFixed(2);
const PHRASE_BOUNDS = [];
for (let i = 0; i < caps.length; i++) { const prev = caps[i - 1]; const punct = prev ? /[.,;:!?…"]$/.test(prev.text.trim()) : true; const gap = prev ? caps[i].startMs - prev.endMs : 9999; if (i === 0 || punct || gap > 200) PHRASE_BOUNDS.push(caps[i].startMs / 1000); }

const C = (name, query, concept, o = {}) => ({ k: "c", name, query, concept, ...o });
const I = (name, query, concept, o = {}) => ({ k: "i", name, query, concept, ...o });
const G = (name, o = {}) => ({ k: "g", name, ...o });
const X = (props) => ({ k: "comp", ...props });
const DP = (d) => `Crear una infografía horizontal, RELACIÓN DE ASPECTO EXACTA 16:9 (1792x1024), estilo lámina ilustrada hecha a mano pero muy profesional, limpia, premium y editorial. Fondo marfil claro con textura de papel muy sutil, líneas marrón oscuro casi negras, acentos en verde oliva/salvia y terracota apagado. ${d}. DEJÁ COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin texto) para colocar después el avatar. Composición minimalista, mucho espacio, pocos bloques grandes, tinta fina con acuarela suave, se entiende en 1 segundo. Textos en español, breves. Estética: vintage botanical / archival textbook illustration, premium editorial, papel levemente envejecido. Evitá verse escolar/infantil/sobrecargado.`;
const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };
const HUES = ["amber", "red", "blue"];

const SECTIONS = [
  // ░░ 1) COLD OPEN — el casi-accidente de noche ░░
  { a: "una noche volviendo por la ruta", start: 0, beats: [
    C("fa_night_road_driving", "driving car at night on dark country road headlights", "driving alone at night on a dark road", { at: "una noche volviendo por la ruta" }),
    C("fa_pedestrian_dark_road", "pedestrian appearing suddenly dark road at night headlights", "a person appearing in the dark, almost hit", { at: "casi atropello a una persona" }),
    C("fa_didnt_see_time", "blurry dim headlights poor visibility night road", "didn't see them in time", { at: "no la vi a tiempo" }),
    C("fa_slam_brakes", "car braking hard at night skid stop", "braking just in time, a miracle", { at: "frene de milagro" }),
    I("fa_yellow_dim_headlight", "yellowed oxidized car headlight glowing dimly night", "yellow opaque headlights lighting half the road", { at: "mis faros estaban amarillos y opacos" }),
    C("fa_half_light_road", "weak headlight beam barely lighting road at night", "lighting less than half of what it should", { at: "menos de la mitad" }),
    I("fa_old_yellow_headlight_day", "cloudy yellow foggy car headlight close up daytime", "a dirty headlight isn't about looks", { at: "un faro sucio no es un tema de estetica" }),
    C("fa_driver_eyes_road_night", "driver squinting at dark road windshield night", "whether you see what's ahead or not", { at: "ves o no ves lo que tenes adelante" }),
    G("fa_tomas_hook", { kicker: "Lo que el taller no quiere que sepas" }),
    C("fa_mechanic_garage_car", "car at auto repair shop mechanic inspecting front", "that same week, to the repair shop", { at: "lleve el auto al taller" }),
  ]},
  // ░░ 2) EL TALLER / mecánico viejo ░░
  { a: "que habia que cambiar las dos opticas enteras", beats: [
    C("fa_new_headlight_unit_price", "brand new car headlight assembly expensive part box", "they said: replace both whole headlight units", { at: "cambiar las dos opticas enteras" }),
    I("fa_expensive_quote_paper", "expensive car repair estimate invoice shock", "a fortune, for two pieces of plastic", { at: "una fortuna por dos pedazos de plastico" }),
    C("fa_old_mechanic_portrait", "old experienced mechanic overalls portrait knowing look", "an old mechanic, the kind that's gone now", { at: "pero un mecanico viejo" }),
    C("fa_mechanic_whisper_aside", "mechanic talking quietly aside hand gesture", "he waved me outside and said it low", { at: "me hizo una sena para que lo siguiera afuera" }),
    C("fa_restore_headlight_curb", "man restoring car headlight on the street curb", "fixed on the curb, in twenty minutes", { at: "eso se arregla en la vereda en 20 minutos" }),
    C("fa_coffee_cup_price", "cup of coffee on table cheap price metaphor", "for the price of a coffee", { at: "por el precio de un cafe" }),
    C("fa_show_exactly_how", "hands demonstrating headlight restoration step by step", "today I'll show you exactly how", { at: "hoy te voy a mostrar exactamente como" }),
  ]},
  // ░░ 3) CONFIRMACIÓN — tus faros ░░
  { a: "es porque tu auto tiene los faros amarillentos opacos", beats: [
    I("fa_yellow_cloudy_headlight2", "yellowed cloudy opaque car headlight oxidized close up", "yellowed, opaque, like a cloud inside", { at: "tu auto tiene los faros amarillentos opacos" }),
    I("fa_headlight_cloud_inside", "foggy hazy car headlight milky cloud lens", "headlights that look ugly and old by day", { at: "como con una nube por dentro" }),
    C("fa_headlight_night_no_see", "dim yellow headlights at night cannot see road", "by night they just won't let you see", { at: "de noche directamente no te dejan ver" }),
    C("fa_dealership_counter_quote", "car dealership service counter expensive quote customer", "you went to the shop or dealership", { at: "fuiste al taller o a la concesionaria" }),
    C("fa_painful_price_estimate", "shocking high repair bill estimate hand", "a number for new units that hurt", { at: "cambiar las opticas que te hizo doler" }),
    C("fa_rag_glass_cleaner_rub", "man rubbing headlight with rag and glass cleaner spray", "you scrubbed with a rag and glass cleaner", { at: "probaste con un trapo y un limpia vidrios" }),
    C("fa_no_change_headlight", "still yellow headlight after wiping no result", "and absolutely nothing happened", { at: "y no paso absolutamente nada" }),
  ]},
  // ░░ 4) ROADMAP / open loops ░░
  { a: "te lo voy a mostrar bien paso a paso", beats: [
    C("fa_fake_internet_tricks", "phone screen fake headlight hack video online", "internet is full of fake tricks", { at: "internet esta lleno de trucos truchos" }),
    C("fa_bright_two_weeks", "shiny restored headlight that fades again", "shiny for two weeks, then worse than before", { at: "el faro brillante por dos semanas" }),
    C("fa_step_by_step_demo", "hands demonstrating headlight sanding step by step", "I'll show you well, step by step", { at: "te lo voy a mostrar bien paso a paso" }),
    C("fa_why_turns_yellow", "uv sun damaging car headlight plastic yellowing", "explaining why the headlight turns yellow", { at: "por que el faro se pone amarillo" }),
    C("fa_real_fix_coins", "cheap sandpaper and clear coat low cost headlight fix", "the real fix, costs pennies, lasts years", { at: "el arreglo de verdad" }),
    C("fa_toothpaste_bathroom_trick", "toothpaste tube on bathroom shelf quick hack", "the quick trick with something in the bathroom", { at: "el truco rapido para una urgencia" }),
    C("fa_skipped_step_secret", "clear coat sealing headlight the forgotten step", "the step 90% of people skip", { at: "el paso que el 90 de la gente se saltea" }),
    C("fa_stay_until_end", "finger pointing keep watching screen reminder", "stay till the end, without it nothing works", { at: "quedate hasta el final" }),
  ]},
  // ░░ 5) SOY TOMÁS ░░
  { a: "soy tomas", full: true, beats: [] },
  // ░░ 6) STAKES — lo que te cuesta ░░
  { a: "pensa un segundo en lo que un faro amarillo te esta costando", beats: [
    C("fa_safety_first_serious", "driver hands on wheel serious night safety", "first and most serious: safety", { at: "lo primero y lo mas serio la seguridad" }),
    X({ kind: "diagram", at: "puede tirar hasta la mitad menos de luz a la ruta", eyebrow: "Un faro opaco tira la mitad de luz", slides: [{ image: dg("dg_fa_half_light", "Diagrama comparativo en corte de noche: el mismo auto con dos haces de luz sobre la ruta. A la izquierda, faro transparente: un cono de luz amplio que llega lejos e ilumina a un peaton cruzando. A la derecha, faro amarillo y opaco: un cono corto y debil que NO llega al peaton. Etiquetas 'faro sano: ves al que cruza', 'faro opaco: la mitad de luz, no lo ves a tiempo'. Transmite peligro real de manejar a ciegas."), eyebrow: "La diferencia entre ver al que cruza y no verlo" }] }),
    C("fa_pedestrian_crossing_night", "pedestrian crossing dark road headlights at night", "the difference between seeing the one crossing", { at: "la diferencia entre ver al que cruza" }),
    C("fa_animal_pothole_road_night", "animal on road at night car headlights danger", "the pothole, the animal, seen too late", { at: "al pozo al animal" }),
    C("fa_driving_blind_night", "driver struggling to see dark road poor headlights", "you drive with your eyes covered", { at: "manejas con los ojos tapados" }),
    C("fa_failed_inspection_headlight", "car failing safety inspection headlight test", "with headlights like this you fail inspection", { at: "no pasas la verificacion" }),
    I("fa_expensive_optics_shelf", "row of expensive new car headlight units shop shelf", "a pair of new units costs a fortune", { at: "un par de opticas nuevas cuesta una fortuna" }),
    C("fa_shop_pushes_replace", "service advisor pushing to replace headlight parts", "the shop pushes you to replace them", { at: "te empuja a cambiarlas" }),
    C("fa_selling_new_plastic", "new plastic headlight unit being sold upsell", "they sell you new plastic, that's the business", { at: "te venden plastico nuevo cuando" }),
  ]},
  // ░░ 7) EL PRINCIPIO — por qué se pone amarillo ░░
  { a: "ahora viene lo que cambia todo", beats: [
    G("fa_tomas_principio", { kicker: "Tan simple que da bronca" }),
    C("fa_people_think_dirt", "person rubbing headlight thinking it is dirt", "people think it's dirt stuck on it", { at: "la gente cree que es mugre" }),
    C("fa_rubbing_outside_useless", "man scrubbing headlight surface no result frustrated", "they rub and rub outside with no result", { at: "frota y frota por afuera" }),
    X({ kind: "diagram", at: "el faro de tu auto no es de vidrio", eyebrow: "El faro es plástico con una capa UV", slides: [{ image: dg("dg_fa_uv_layer", "Diagrama en corte de un faro de auto en capas: arriba una fina CAPA PROTECTORA transparente (barniz UV de fabrica), abajo el PLASTICO de policarbonato. El sol arriba con rayos UV quemando y comiendo la capa protectora. Donde la capa esta gastada, el plastico debajo queda desnudo y amarillo, oxidado. Etiquetas 'capa protectora UV (se quema con el sol)', 'policarbonato', 'plastico desnudo = amarillo'. Transmite que el problema esta en la capa, no en la superficie."), eyebrow: "El sol quema el barniz y el plástico se oxida" }] }),
    I("fa_polycarbonate_headlight", "clear polycarbonate plastic car headlight lens new", "your headlight isn't glass, it's plastic", { at: "es de plastico de policarbonato" }),
    C("fa_uv_clear_coat_factory", "clear protective coating layer on new headlight", "from the factory, a clear protective coat", { at: "una capa protectora transparente" }),
    C("fa_sun_uv_burning_coat", "sun uv rays beating down on car headlight damage", "the sun, over years, burns that coat", { at: "el problema es que el sol" }),
    I("fa_bare_plastic_oxidized", "bare oxidized yellow plastic headlight micro scratches", "the bare plastic underneath oxidizes", { at: "el plastico que queda abajo" }),
    C("fa_micro_scratches_yellow", "yellow opaque headlight full of micro scratches macro", "yellow, opaque, full of micro-scratches", { at: "lleno de micro rayitas" }),
    C("fa_problem_in_dead_layer", "cutaway dead oxidized layer of headlight plastic", "the problem is in the dead layer itself", { at: "esta en la capa muerta del faro mismo" }),
  ]},
  // ░░ 8) LAS DOS CLAVES ░░
  { a: "y eso te da las dos claves de todo el arreglo", beats: [
    X({ kind: "diagram", at: "y eso te da las dos claves de todo el arreglo", eyebrow: "Las dos claves de todo el arreglo", slides: [{ image: dg("dg_fa_two_keys", "Diagrama de dos bloques iconograficos lado a lado, numerados. Bloque 1: una mano lijando un faro amarillo con lija al agua, sacando la capa muerta (flechas que muestran el amarillo saliendo). Bloque 2: un aerosol de barniz transparente sellando el faro ya cristalino, formando una capa protectora nueva contra el sol. Etiquetas '1. sacar la capa muerta (lijar)', '2. volver a proteger (sellar)'. Transmite que faltar una mitad = falla todo."), eyebrow: "1. Sacar lo muerto · 2. Volver a sellar" }] }),
    C("fa_sanding_off_dead_layer", "wet sanding yellow car headlight removing oxidation", "one: sand off that dead, yellow layer", { at: "hay que sacar esa capa muerta" }),
    C("fa_most_forget_seal", "spraying clear coat sealing restored headlight", "two, the one almost everyone forgets", { at: "la que casi todos olvidan" }),
    C("fa_new_protective_coat", "applying fresh protective clear coat to headlight", "put a protective coat back on, seal it", { at: "ponerle una capa protectora" }),
    C("fa_yellow_again_two_weeks", "headlight turning yellow again after weeks sun", "or the sun burns it yellow again in two weeks", { at: "en dos semanas esta amarillo otra vez" }),
    C("fa_remove_protect_summary", "before after headlight remove dead protect clear", "remove the dead, and protect again", { at: "sacarlo muerto y volver a proteger" }),
  ]},
  // ░░ 9) REGLA #1 (OVL) ░░
  { a: "el faro amarillo no se limpia se restaura", beats: [
    C("fa_not_clean_restore", "restoring headlight not just cleaning sanding sealing", "the yellow headlight isn't cleaned, it's restored", { at: "el faro amarillo no se limpia se restaura" }),
    C("fa_old_coat_new_coat", "removing old coat applying new clear coat headlight", "take off the old coat, put on a new one", { at: "se saca la capa vieja y se pone una nueva" }),
  ]},
  // ░░ 10) MÉTODO pasta de dientes (parche) ░░
  { a: "empecemos por el truco rapido", beats: [
    I("fa_toothpaste_white_tube", "tube of plain white toothpaste close up", "the quick trick: plain white toothpaste", { at: "la pasta de dientes" }),
    X({ kind: "diagram", at: "porque la pasta de dientes tiene adentro un abrasivo finito", eyebrow: "Por qué la pasta de dientes pule", slides: [{ image: dg("dg_fa_toothpaste", "Diagrama: un primer plano de pasta de dientes con una lupa que revela las particulas ABRASIVAS finas adentro (puntitos), y al lado esas mismas particulas frotando sobre la superficie amarilla de un faro, lijando suavemente la capa oxidada de arriba. Etiquetas 'abrasivo finito (pule los dientes)', 'lija suave la capa amarilla de arriba'. Transmite que es un parche que lima poquito."), eyebrow: "Un abrasivo finito que lija suave la capa de arriba" }] }),
    C("fa_abrasive_particles_polish", "fine abrasive particles polishing surface macro", "tiny particles that polish, like on teeth", { at: "particulas chiquitas que pulen" }),
    C("fa_rag_toothpaste_headlight", "rubbing toothpaste on car headlight with cloth circles", "rub the headlight hard, in circles, with toothpaste", { at: "frotadas sobre el faro" }),
    C("fa_old_toothbrush_scrub", "old toothbrush scrubbing toothpaste on headlight", "a clean rag or an old toothbrush", { at: "un cepillo de dientes viejo" }),
    C("fa_rag_turning_yellow", "cloth turning yellow from headlight oxidation rubbing", "the rag turns yellow: oxidation coming out", { at: "el trapo se va poniendo amarillo" }),
    C("fa_rinse_dry_better", "rinsing headlight with water clearer result", "rinse, dry, the headlight looks much better", { at: "el faro se ve muchisimo mejor" }),
  ]},
  // ░░ 11) HONESTIDAD — pasta es parche ░░
  { a: "la pasta de dientes es un parche", beats: [
    C("fa_toothpaste_just_patch", "toothpaste quick headlight fix temporary patch", "toothpaste is a patch, for an emergency", { at: "la pasta de dientes es un parche" }),
    C("fa_pass_inspection_tomorrow", "car passing quick headlight inspection next day", "to pass inspection tomorrow, for a photo", { at: "pasar la verificacion manana" }),
    C("fa_opaque_again_weeks", "headlight going opaque again after weeks sun", "with no protection, it dulls again in weeks", { at: "vuelve a opacarse" }),
    C("fa_real_fix_coming", "real headlight restoration sanding tools laid out", "the real fix is the one coming", { at: "el arreglo de verdad es el que viene" }),
  ]},
  // ░░ 12) MÉTODO lijar al agua + tapar ░░
  { a: "es lijar con agua y despues sellar", beats: [
    X({ kind: "oxstack", at: "lo unico que necesitas son unas lijas al agua", images: ["real/fa_wet_sandpaper_grits.png", "real/fa_polish_compound_tube.png", "real/fa_uv_clear_coat_spray.png"], captions: ["Lijas al agua", "Pasta pulidora", "Barniz UV"], accent: "blue" }),
    I("fa_wet_sandpaper_grits", "set of wet sandpaper sheets different grits hardware", "wet sandpaper in different grits, costs pennies", { at: "unas lijas al agua de distintos numeros" }),
    C("fa_masking_tape_around", "masking tape around car headlight protecting paint", "first, tape off everything around the headlight", { at: "tapa con cinta de papel todo lo que rodea al faro" }),
    C("fa_protect_car_paint", "taped car body edge protecting paint before sanding", "so you don't scratch the car's body", { at: "no queres rayar la chapa del auto" }),
    C("fa_tape_whole_edge", "masking tape applied all around headlight edge", "tape the whole border well", { at: "tapa bien todo el borde" }),
  ]},
  // ░░ 13) EL PROCESO DE LIJADO por números ░░
  { a: "y la clave es ir de la lija mas gruesa a la mas fina", beats: [
    X({ kind: "diagram", at: "y la clave es ir de la lija mas gruesa a la mas fina", eyebrow: "De la lija más gruesa a la más fina", slides: [{ image: dg("dg_fa_grits", "Diagrama de progresion horizontal con cuatro cuadrados de lija etiquetados, de gruesa a fina: 400, 600, 1000, 2000. Debajo de cada uno, una mini-vista del faro que va de amarillo a blanco lechoso a opaco parejo a casi liso. Una gota de agua sobre cada lija ('siempre mojado'). Flecha grande que indica el orden. Etiquetas 'siempre con agua, nunca en seco', 'de gruesa a fina'. Transmite el orden exacto del lijado."), eyebrow: "400 · 600 · 1000 · 2000 — siempre con agua" }] }),
    C("fa_always_wet_never_dry", "wet sanding headlight water running never dry", "always wet, with water, never dry", { at: "mojando siempre siempre con agua" }),
    C("fa_sand_400_grit", "wet sanding headlight with coarse 400 grit sandpaper", "start with coarse 400 grit, wet, all over", { at: "numero 400 mojada" }),
    C("fa_headlight_white_milky", "headlight turning white milky opaque after sanding", "it goes all white, milky, don't panic", { at: "lo vas a dejar todo blanco" }),
    C("fa_dead_layer_coming_off", "milky sanded headlight dead layer removed", "that white is the dead layer coming off", { at: "es la capa muerta saliendo" }),
    C("fa_sand_600_grit", "wet sanding headlight with finer 600 grit sandpaper", "then finer, 600 grit, wet, other direction", { at: "numero 600 mojada" }),
    C("fa_finer_grit_1000", "sanding headlight with fine 1000 grit wet", "then finer still, 1000", { at: "todavia mil" }),
    C("fa_finest_grit_2000", "wet sanding headlight smooth with 2000 grit", "and finally a very fine one, 2000", { at: "una bien finita dos mil" }),
    C("fa_smooth_even_no_scratch", "smooth even matte sanded headlight no scratches", "smooth, opaque but even, no scratches", { at: "liso opaco pero parejo sin rayones" }),
  ]},
  // ░░ 14) PULIR — la magia ░░
  { a: "y ahora viene la magia", beats: [
    I("fa_polish_compound_tube", "car polishing compound tube rubbing compound headlight", "a polishing compound, the car scratch one", { at: "una pasta pulidora" }),
    C("fa_polishing_headlight_cloth", "polishing headlight clear with cloth and compound", "polish the headlight hard with a cloth", { at: "pulis el faro con fuerza" }),
    C("fa_plastic_turns_clear", "opaque plastic headlight turning transparent crystal clear", "the opaque plastic turns transparent, like new", { at: "se vuelve transparente cristalino" }),
    C("fa_healthy_plastic_appears", "restored crystal clear car headlight perfect", "the healthy plastic appears underneath", { at: "abajo aparecio el plastico sano" }),
    C("fa_headlight_looks_perfect", "perfect clear restored headlight gleaming", "in that moment, the headlight looks perfect", { at: "el faro se ve perfecto" }),
  ]},
  // ░░ 15) ATAJO con taladro ░░
  { a: "y un atajo por si tenes un taladro en casa", beats: [
    I("fa_drill_sanding_discs", "cordless drill with sanding and buffing discs headlight", "a shortcut if you have a drill at home", { at: "y un atajo por si tenes un taladro en casa" }),
    C("fa_drill_polish_disc", "drill with foam buffing pad polishing headlight", "sanding and a foam disc on the drill", { at: "un disco de esponja" }),
    C("fa_drill_faster_even", "drill restoring headlight faster more even", "much faster and more even, five minutes", { at: "mucho mas rapido y mas parejo" }),
    C("fa_drill_overheat_warning", "drill overheating melting plastic headlight warning", "full speed and dry overheats and ruins it", { at: "recalienta el plastico y lo arruina" }),
    C("fa_slow_wet_always", "drill slow wet sanding headlight careful", "always slow and always wet", { at: "siempre despacio y siempre mojado" }),
  ]},
  // ░░ 16) EL ERROR (teaser) ░░
  { a: "y aca la mayoria grita victoria", beats: [
    C("fa_celebrate_too_soon", "man celebrating shiny headlight putting tools away", "here most people cheer and put it away", { at: "la mayoria grita victoria" }),
    C("fa_biggest_mistake_teaser", "shiny unsealed headlight about to fail mistake", "and make the biggest mistake of all", { at: "el error mas grande de todos" }),
  ]},
  // ░░ 17) INJERTO 1 — manual (ManualCard en OVL) ░░
  { a: "lo tengo todo anotado con las medidas justas", beats: [
    X({ kind: "diagram", at: "lo tengo todo anotado con las medidas justas", eyebrow: "Los números de lija y el sellado, anotados", slides: [{ image: dg("dg_fa_manual", "Lamina de un manual/cuaderno casero abierto sobre una mesa de taller con las notas del arreglo de faros: que numero de lija empezar segun lo amarillo, 400 600 1000 2000, cuanto pulir, como sellar con barniz UV. Una lija, una cinta de papel y un lapiz al lado, estilo archivo artesanal. Transmite 'todo con las medidas justas'. Sin texto legible."), eyebrow: "El Manual de Reparaciones Caseras" }] }),
    C("fa_first_time_missed_grit", "ruined headlight scratch from skipped grit lesson", "the first time I skipped a grit and it marked", { at: "me falto un numero de lija" }),
    C("fa_seal_secret_next", "clear coat sealing headlight the real difference", "keep watching: the sealing secret comes now", { at: "ahora viene el secreto del sellado" }),
  ]},
  // ░░ 18) EL SELLADO — el paso que el 90% saltea ░░
  { a: "acordate de las dos claves del principio", beats: [
    C("fa_clear_but_bare", "crystal clear but unsealed bare headlight plastic", "now it's clear, but bare, no factory coat", { at: "pero esta desnudo" }),
    C("fa_bare_plastic_oxidizes_fast", "bare headlight plastic oxidizing fast in sun", "bare plastic in the sun oxidizes super fast", { at: "el plastico desnudo al sol se oxida rapidisimo" }),
    C("fa_worse_than_start", "headlight worse yellow than before unsealed", "in weeks you'll be worse than when you started", { at: "vas a estar peor que cuando empezaste" }),
    C("fa_what_failed_no_seal", "unsealed headlight failing the missed step", "what failed is you didn't seal it", { at: "lo que fallo es que no lo sellaste" }),
    X({ kind: "diagram", at: "es ponerle una capa protectora nueva", eyebrow: "Sellar: las opciones, de la mejor a la casera", slides: [{ image: dg("dg_fa_seal_options", "Diagrama de tres opciones de sellado en orden de mejor a mas casera, en columnas. 1) Aerosol de BARNIZ TRANSPARENTE con filtro UV (lata de spray, estrellas de durabilidad: dura anos) — la mejor. 2) Barniz transparente para auto en lata, tambien sirve. 3) Una mano de CERA para auto, casera, dura poco. Cada una con su icono. Etiquetas 'barniz UV en aerosol (lo mejor)', 'barniz para auto', 'cera (parche)'. Transmite que algo SIEMPRE hay que ponerle encima."), eyebrow: "Barniz UV en aerosol · barniz auto · cera" }] }),
    I("fa_uv_clear_coat_spray", "aerosol can clear coat uv protectant spray headlight", "best of all: a UV clear coat spray", { at: "un barniz transparente con filtro ultravioleta" }),
    C("fa_spray_thin_coats", "spraying thin even clear coats on taped headlight", "two or three thin coats, drying between", { at: "dos o tres manos finas" }),
    C("fa_lasts_years_recommend", "sealed restored headlight lasting years clear", "that coat is sunscreen for the headlight, lasts years", { at: "y te dura anos es lo que de verdad recomiendo" }),
    C("fa_car_wax_homemade", "applying car wax to headlight homemade option", "or a thin coat of car wax, the homemade way", { at: "una mano finita de cera para auto" }),
    C("fa_never_leave_bare", "always put protective coat headlight never bare", "the key: never, ever leave it bare", { at: "nunca nunca lo dejes desnudo" }),
  ]},
  // ░░ 19) EL ERROR — no sellar ░░
  { a: "el error que comete casi todo el mundo", beats: [
    X({ kind: "diagram", at: "el error es lijar pulir dejarlo brillante y no", eyebrow: "El error: dejarlo brillante y no sellar", slides: [{ image: dg("dg_fa_mistake", "Diagrama de dos pasos con una gran X de error. Paso 1: un faro lijado y pulido, brillante y transparente, con la persona festejando y guardando las cosas. Paso 2: el sol fuerte del fin de semana cayendo sobre ese faro DESNUDO (sin sellar), que se vuelve amarillo de nuevo, peor que antes. Etiquetas 'lo dejas brillante y NO lo sellas', 'el sol lo quema otra vez en dos semanas'. Una gran cruz roja sobre el faro desnudo. Transmite que sin sellar se arruina todo."), eyebrow: "El sol lo quema de nuevo en dos semanas" }] }),
    C("fa_cheering_unsealed", "celebrating shiny unsealed headlight then ruined", "cheering with the clear headlight and not sealing", { at: "festejar con el faro transparente" }),
    C("fa_first_sunny_weekend", "strong sun on bare headlight first weekend damage", "the first strong-sun weekend starts burning it", { at: "el primer fin de semana de sol fuerte" }),
    C("fa_stripped_last_defense", "bare headlight stripped of its last defense sun", "you stripped its last defense", { at: "le sacaste hasta la ultima defensa" }),
    C("fa_skipped_important_half", "the most important half skipped sealing", "they skipped the most important half", { at: "se saltearon la mitad mas importante" }),
  ]},
  // ░░ 20) ADVERTENCIAS — repelente / WD40 ░░
  { a: "vas a ver gente que dice que frotes el faro con repelente de insectos", beats: [
    I("fa_insect_repellent_can", "insect repellent aerosol can warning headlight", "people say rub it with insect repellent", { at: "frotes el faro con repelente de insectos" }),
    C("fa_repellent_instant_clear", "repellent making headlight instantly clear deceptive", "it does make it clear instantly, that's why it's famous", { at: "deja el faro transparente al instante" }),
    C("fa_repellent_melts_plastic", "insect repellent melting deforming headlight plastic", "but it's poison: it melts and softens the plastic", { at: "es veneno para el plastico" }),
    C("fa_sticky_deformed_worse", "sticky deformed ruined headlight plastic worse", "days later it's sticky, deformed, worse than before", { at: "te queda pegajoso deformado" }),
    I("fa_wd40_spray_can", "multipurpose lubricant spray can on headlight", "same with those multipurpose lubricant sprays", { at: "esos lubricantes en aerosol multiuso" }),
    C("fa_oil_shine_one_day", "oily shine on headlight attracting dust dirt", "pure oil over grime, a shine for one day", { at: "es puro aceite encima de la mugre" }),
    C("fa_only_real_way", "sanding polishing sealing the only lasting way", "the only way that lasts: sand, polish, seal", { at: "lijar lo muerto pulir y sellar" }),
  ]},
  // ░░ 21) LÍMITES HONESTOS ░░
  { a: "si tu faro tiene rajaduras de verdad", beats: [
    C("fa_cracked_headlight_real", "car headlight with real cracks damage", "if your headlight has real cracks", { at: "si tu faro tiene rajaduras de verdad" }),
    C("fa_moisture_inside_fog", "moisture water fog inside sealed car headlight", "or fog and moisture inside: water got in", { at: "se le ve humedad empanado por dentro" }),
    C("fa_water_inside_not_sanding", "water trapped inside headlight not fixed by sanding", "that's not fixed by sanding", { at: "eso no se arregla lijando" }),
    C("fa_deep_pitted_plastic", "deeply pitted burned headlight plastic damage", "if it's pitted and deep, sometimes it won't recover", { at: "ves el plastico picado y profundo" }),
    X({ kind: "diagram", at: "son solo la capa de afuera", eyebrow: "99% son solo la capa de afuera", slides: [{ image: dg("dg_fa_99", "Diagrama con un gran numero '99%' y un faro amarillo cuya capa exterior se levanta como una calcomania, mostrando el plastico sano abajo. Al costado, un 1% chico con un faro rajado/con humedad (los casos que no se arreglan). Etiquetas '99% de los faros amarillos: solo la capa de afuera, se arreglan', '1%: rajado o con agua adentro'. Transmite que casi todos se salvan con lo de hoy."), eyebrow: "Esos se arreglan perfecto con lo de hoy" }] }),
    C("fa_most_just_surface", "typical yellow headlight just surface layer fixable", "99% of yellow headlights are just the outer layer", { at: "los faros amarillos que ves por la calle" }),
  ]},
  // ░░ 22) BONUS — plásticos negros ░░
  { a: "viste los plasticos negros del auto", beats: [
    I("fa_faded_black_trim", "faded grey oxidized black plastic car trim", "the black plastics, faded grey and white", { at: "viste los plasticos negros del auto" }),
    C("fa_trim_bumper_mirrors", "oxidized car bumper trim mirrors faded plastic", "the window trim, old bumpers, mirrors", { at: "los paragolpes viejos" }),
    C("fa_same_sun_burned", "sun burned oxidized car plastic surface", "same as the headlight: the sun burned it", { at: "el sol les quemo la superficie" }),
    C("fa_oil_rag_black_back", "rubbing oil on faded trim restoring black instantly", "a rag with a little oil, black comes back instantly", { at: "un trapo con un poquito de aceite" }),
    C("fa_heat_gun_trim", "heat gun restoring faded black car trim deep black", "the lasting way: warm it with a heat gun", { at: "es calentarlos apenas" }),
    C("fa_deep_black_returns", "deep black restored car trim no products months", "deep black comes back on its own, lasts months", { at: "el negro profundo vuelve solo" }),
  ]},
  // ░░ 23) INJERTO 2 — por qué el taller no te lo cuenta ░░
  { a: "y dejame parar un segundo", beats: [
    G("fa_tomas_pausa", { kicker: "Nadie te lo cuenta" }),
    X({ kind: "chips", at: "les conviene venderte las opticas nuevas", title: "Por qué no te lo cuentan", chips: ["Al taller le conviene", "venderte las ópticas nuevas", "no restaurarte las que tenés"], hue: "red", imageDarken: 0.6, _bg: { name: "fa_shop_upsell_bg", query: "service advisor upselling new headlight units customer shop", concept: "the shop upselling new headlight units" }, image: "real/fa_shop_upsell_bg.png" }),
    X({ kind: "splitlist", at: "lo dividi justo asi", title: "Los 40 arreglos, divididos así", items: ["Madera y metal que no mueren", "Plagas por centavos", "Goteras, humedad y moho", "Arreglos del hogar y el auto"], palette: "A" }),
  ]},
  // ░░ 24) RECAP ░░
  { a: "asi que recapitulemos", beats: [
    X({ kind: "checklist", at: "asi que recapitulemos", title: "El plan contra el faro amarillo", items: [{ text: "No es mugre: es plástico oxidado por el sol", state: "done" }, { text: "Urgencia: pasta de dientes (parche)", state: "done" }, { text: "Tapá, lijá con agua 400 → 600 → 1000 → 2000", state: "done" }, { text: "Pulí hasta dejarlo transparente", state: "done" }, { text: "Sellá con barniz UV. Nunca repelente", state: "done" }] }),
    C("fa_two_clear_headlights", "two restored crystal clear car headlights new", "both your headlights like new, in an afternoon", { at: "los 2 faros de tu auto como nuevos" }),
  ]},
  // ░░ 25) INJERTO 3 + CIERRE ░░
  { a: "por eso junte los 40 en el manual de reparaciones caseras", beats: [
    X({ kind: "diagram", at: "por eso junte los 40 en el manual de reparaciones caseras", eyebrow: "Los 40, ordenados y probados", slides: [{ image: dg("dg_fa_stack", "Lamina tipo coleccion de valor artesanal: el Manual de Reparaciones Caseras con 40 arreglos (madera, oxido, plagas, goteras, faros y auto) con planos y medidas, apilado como una pila de valor, con una lija y un faro restaurado al lado. Estilo archivo, sin precios ni texto legible."), eyebrow: "Con los planos y las medidas exactas" }] }),
    C("fa_cheaper_than_one_optic", "restored headlight cheaper than one new unit", "cheaper than a single new headlight unit", { at: "cuesta menos que una sola optica nueva" }),
    C("fa_look_headlights_today", "person inspecting car headlights in daylight today", "go look at your headlights in daylight", { at: "miralos a tus faros a la luz del dia" }),
    C("fa_give_back_sight", "restoring car headlight giving back night vision", "this weekend, with sandpaper and clear coat, give them back their sight", { at: "devolveles la vista" }),
  ]},
  // ░░ 26) PRÓXIMO ░░
  { a: "me quedo en el auto", beats: [
    C("fa_paint_scratches_car", "deep paint scratches on car body finger nail catch", "next: erasing those paint scratches your nail catches", { at: "como borrar esos rayones de la pintura" }),
    C("fa_scratch_removed_clear", "car paint scratch buffed out restored shine", "without repainting, a coins trick", { at: "con un truco de monedas" }),
  ]},
  { a: "la independencia no se compra", full: true, beats: [] },
];

// ── motor (anclaje + placement + salida + avatar windows) ───────────────────
for (const s of SECTIONS) { if (s.start == null) s.start = atc(s.a); }
const SEC = SECTIONS.filter((s) => s.start != null).sort((a, b) => a.start - b.start);
const beats = [];
const MATCH = [], BING = [];
const seenM = new Set(), seenB = new Set();
const addM = (name, query, concept) => { if (!seenM.has(name)) { seenM.add(name); MATCH.push({ name, concept, query: Array.isArray(query) ? query : [query], dur: DLDUR }); } };
const addB = (name, query, concept) => { if (name && !seenB.has(name)) { seenB.add(name); BING.push({ name, query: Array.isArray(query) ? query[0] : query, concept: concept || query, count: 1 }); } };
for (let si = 0; si < SEC.length; si++) {
  const sec = SEC[si];
  const start = sec.start;
  const end = si + 1 < SEC.length ? SEC[si + 1].start : TOTAL;
  if (sec.full || !sec.beats.length) continue;
  const N = sec.beats.length;
  let secB = PHRASE_BOUNDS.filter((b) => b >= start + 0.05 && b <= end - 0.3);
  if (!secB.length) secB = [start];
  const placed = [];
  let lastT = start - 99;
  for (let i = 0; i < N; i++) {
    const b = sec.beats[i];
    let t = null;
    if (b.at) { const a = atc(b.at); if (a != null && a >= start && a < end) t = a; }
    if (t == null) {
      const target = start + ((i + 0.5) / N) * (end - start);
      let best = null, bd = 1e9;
      for (const bb of secB) { if (bb <= lastT + 0.4) continue; const d = Math.abs(bb - target); if (d < bd) { bd = d; best = bb; } }
      t = best != null ? best : Math.max(target, lastT + MINGAP * 0.6);
    }
    if (t <= lastT + 0.4) t = lastT + Math.max(MINGAP * 0.6, 1.0);
    lastT = t;
    placed.push({ b, t: +t.toFixed(2) });
  }
  for (let i = 0; i < placed.length; i++) {
    const { b, t } = placed[i];
    const nextT = i + 1 < placed.length ? placed[i + 1].t : end;
    const dur = +Math.min(nextT - t + OV, TOTAL - t).toFixed(2);
    const hue = b.hue || HUES[(si + i) % HUES.length];
    if (b.k === "c") { beats.push({ id: b.name, start: t, dur, kind: "raw", src: `broll/${b.name}.mp4`, darken: 0, hue, ...(b.kicker ? { kicker: b.kicker } : {}) }); addM(b.name, b.query, b.concept); addB(b.name, b.query, b.concept); }
    else if (b.k === "i") { beats.push({ id: b.name, start: t, dur, kind: "raw", src: `real/${b.name}.png`, darken: 0, hue, ...(b.kicker ? { kicker: b.kicker } : {}) }); addB(b.name, b.query, b.concept); }
    else if (b.k === "g") { beats.push({ id: b.name, start: t, dur, kind: "raw", src: `img/${b.name}.png`, darken: 0, hue, ...(b.kicker ? { kicker: b.kicker } : {}) }); }
    else if (b.k === "comp") {
      const { kind, at: _at, _bg, ...props } = b;
      if (_bg) addB(_bg.name, _bg.query, _bg.concept);
      const scanBg = (o) => { if (!o || typeof o !== "object") return; if (o._bg) { addB(o._bg.name, o._bg.query, o._bg.concept); delete o._bg; } for (const k of Object.keys(o)) scanBg(o[k]); };
      scanBg(props);
      const beat = { id: `cmp_${kind}_${si}_${i}`, start: t, dur: +Math.min(dur, 7.2).toFixed(2), kind, hue, ...props };
      if (kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((x) => (typeof x === "string" ? { t: x } : { t: x.t, hl: true }));
      if (kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      beats.push(beat);
    }
  }
}
beats.sort((a, b) => a.start - b.start);

// ── OVERLAYS A MEDIDA encima del clip vivo (overlay:true → no roban slot, el clip corre detrás borroso) ──
const OVL = [
  // ── HOOK ──
  { kind: "oxquote", at: "no cambies nada", dur: 5.2, quote: "No cambies nada. Eso se arregla en la vereda, *en veinte minutos, por el precio de un café*.", image: "real/fa_old_mechanic_portrait.png", attribution: "Un mecánico viejo", side: "right", accent: "amber" },
  // ── CONFIRMACIÓN ──
  { kind: "oxbefore", at: "tu auto tiene los faros amarillentos opacos", dur: 4.4, before: "real/fa_yellow_cloudy_headlight2.png", after: "real/fa_two_clear_headlights.png", accent: "green" },
  // ── STAKES — seguridad ──
  { kind: "oxstat", at: "puede tirar hasta la mitad menos de luz a la ruta", dur: 4.2, value: 50, suffix: " %", label: "menos de luz a la ruta: manejás con los ojos tapados", glyph: "🚗", accent: "red" },
  { kind: "oxside", at: "no pasas la verificacion", dur: 5.0, image: "real/fa_failed_inspection_headlight.png", title: "Lo que te cuesta", lines: ["Seguridad: ves la mitad de la ruta", "Verificación: te frenan el auto", "Bolsillo: una óptica nueva es una fortuna"], side: "right", accent: "red" },
  // ── PRINCIPIO ──
  { kind: "oxrule", at: "pero no es mugre", dur: 4.4, text: "No es mugre. Es la *capa de plástico oxidada por el sol*.", accent: "amber" },
  { kind: "oxstat", at: "va quemando y comiendo esa capa protectora", dur: 4.0, value: 100, suffix: " %", label: "el sol come la capa UV y el plástico queda desnudo", glyph: "☀️", accent: "red" },
  // ── LAS DOS CLAVES ──
  { kind: "oxside", at: "hay que sacar esa capa muerta", dur: 5.2, image: "real/fa_sanding_off_dead_layer.png", title: "Las dos claves", lines: ["Sacar la capa muerta, lijándola", "Volver a sellar con una capa nueva", "Si te falta una mitad, fallaste"], side: "right", accent: "amber" },
  // ── REGLA #1 ──
  { kind: "oxrule", at: "el faro amarillo no se limpia se restaura", dur: 4.6, text: "El faro amarillo no se *limpia*. Se *restaura*.", accent: "amber" },
  // ── MÉTODO pasta de dientes ──
  { kind: "oxmethod", at: "empecemos por el truco rapido", dur: 4.6, num: "01", title: "Pasta de dientes", chips: ["Trapo o cepillo", "Frotar en círculos", "Es un parche"], cost: "lo del baño", accent: "blue" },
  // ── MÉTODO lijar ──
  { kind: "oxmethod", at: "es lijar con agua y despues sellar", dur: 4.8, num: "02", title: "Lijar al agua y sellar", chips: ["Tapar alrededor", "Lijar 400→2000", "Pulir y sellar"], cost: "monedas", accent: "amber" },
  { kind: "oxrule", at: "mojando siempre siempre con agua", dur: 4.4, text: "Siempre con *agua*, nunca en *seco*. De gruesa a fina.", accent: "blue" },
  { kind: "oxstat", at: "numero 400 mojada", dur: 4.0, value: 400, suffix: "", label: "se arranca con 400, después 600, 1000 y 2000", glyph: "🧽", accent: "amber" },
  // ── PULIR ──
  { kind: "oxtag", at: "una pasta pulidora", dur: 4.0, name: "La pasta pulidora", what: "Saca lo opaco y aparece el plástico cristalino", side: "left", accent: "blue" },
  // ── ATAJO taladro ──
  { kind: "oxtag", at: "y un atajo por si tenes un taladro en casa", dur: 4.0, name: "El taladro", what: "Cinco minutos en vez de veinte, pero despacio y mojado", side: "right", accent: "amber" },
  // ── INJERTO 1 — manual (mid, sin chip) ──
  { kind: "manualcard", at: "un manual que arme", dur: 6.0, image: "real/manual_cover.png", title: "Manual de Reparaciones Caseras", desc: "Los 40 arreglos de $1 a $5 del hogar, con los planos y las medidas exactas.", accent: "amber" },
  // ── EL SELLADO ──
  { kind: "oxstat", at: "el paso que el 90 de la gente se saltea", dur: 4.2, value: 90, suffix: " %", label: "saltea el sellado: por eso el faro se vuelve amarillo", glyph: "🛡️", accent: "red" },
  { kind: "oxmethod", at: "un barniz transparente con filtro ultravioleta", dur: 4.8, num: "03", title: "El sellado UV", chips: ["Aerosol UV", "Barniz de auto", "Cera (parche)"], cost: "el secreto", accent: "amber" },
  // ── EL ERROR ──
  { kind: "oxrule", at: "el error es lijar pulir dejarlo brillante y no", dur: 4.6, text: "El error: dejarlo brillante y *no sellarlo*. El sol lo quema de nuevo.", accent: "red" },
  // ── ADVERTENCIAS ──
  { kind: "oxrule", at: "es veneno para el plastico", dur: 4.4, text: "Repelente, *nunca*: derrite y deforma el plástico.", accent: "red" },
  // ── CIERRE ──
  { kind: "manualcard", at: "el link esta abajo", dur: 6.0, image: "real/manual_cover.png", title: "Manual de Reparaciones Caseras", desc: "Los 40 arreglos, incluido el sellado de los faros.", chip: "Accedé en la descripción", accent: "amber" },
];
let nOv = 0;
for (const o of OVL) { const s = atc(o.at); if (s == null) continue; const { kind, at: _a, dur = 4.2, ...props } = o; beats.push({ id: `ov_${kind}_${Math.round(s)}`, start: +s.toFixed(2), dur, kind, overlay: true, hue: "amber", ...props }); nOv++; }
beats.sort((a, b) => a.start - b.start);

// ── MAXIMUM DENSITY: imágenes ancladas en CADA mini-frase del shotlist aún sin cubrir ──
// [name, query EN visual, concept resuelto al contexto, frase ancla exacta de captions]
const FILL = [
  // ── COLD OPEN ──
  ["fa_fill_didnt_see_time", "blurry weak headlights poor night visibility road", "didn't see them in time on the dark road", "no la vi a tiempo"],
  ["fa_fill_appeared_dark", "dark figure appearing roadside at night car lights", "a dark figure appeared at the side", "aparecio en el costado oscura"],
  ["fa_fill_not_speed_tired", "calm driver hands on wheel night not distracted", "not from speed, not from being tired", "y no fue por ir rapido"],
  ["fa_fill_one_reason", "single dim yellow headlight beam at night", "it was for one single reason", "fue por una sola razon"],
  ["fa_fill_should_light", "comparison weak vs strong headlight beam road night", "lit half of what they should", "de lo que tendrian que alumbrar"],
  ["fa_fill_see_or_not", "driver squinting through windshield dark road night", "whether you see what is ahead or not", "ves o no ves lo que tenes adelante"],
  ["fa_fill_what_they_said", "mechanic delivering bad news to car owner shop", "you know what they told me", "sabes que me dijeron"],
  ["fa_fill_follow_outside", "old mechanic signaling to follow him outside shop", "he signaled me to follow him outside", "para que lo siguiera afuera"],
  ["fa_fill_had_the_reason", "wise old mechanic nodding knowingly portrait", "and he was completely right", "y tenia toda la razon"],
  // ── CONFIRMACIÓN ──
  ["fa_fill_ugly_old_day", "old faded yellow headlights car parked daytime", "headlights that look ugly and old by day", "esos faros que de dia se ven feos"],
  ["fa_fill_already_happened", "car owner frustrated looking at yellow headlight", "and it surely already happened to you", "y seguro ya te paso"],
  ["fa_fill_internet_fake", "smartphone showing fake headlight hack thumbnail", "internet is full of fake tricks", "internet esta lleno de trucos truchos"],
  ["fa_fill_worse_than_before", "headlight yellow again worse than before fade", "and then it is worse than before", "y despues esta peor que antes"],
  ["fa_fill_no_trick_lasts", "headlight fading again no trick lasts uv", "if you don't get it, no trick will last", "ningun truco te va a durar"],
  // ── ROADMAP ──
  ["fa_fill_real_fix_years", "restored clear headlight lasting years like new", "the real fix that lasts years for pennies", "el arreglo de verdad el que cuesta monedas"],
  ["fa_fill_difference_secret", "clear coat sealing headlight key difference", "the secret that makes the difference", "el secreto que hace la diferencia"],
  ["fa_fill_without_step_nothing", "unsealed headlight failing without the key step", "without that step nothing else works", "todo lo demas no sirve de nada"],
  // ── STAKES ──
  ["fa_fill_costing_you", "yellow headlight costing money safety beyond looks", "what a yellow headlight is costing you", "un faro amarillo te esta costando"],
  ["fa_fill_seen_too_late", "animal in road headlights seen too late danger", "and not seeing it until it is too late", "no verlo hasta que es tarde"],
  ["fa_fill_inspection_tech", "car at technical inspection station headlight check", "the technical review fails you", "la revision tecnica"],
  ["fa_fill_the_pocket", "wallet money car repair expensive cost", "and third: your pocket", "el bolsillo"],
  ["fa_fill_shop_business", "car shop service desk selling new parts business", "because that is where their business is", "porque ahi esta su negocio"],
  ["fa_fill_thats_business", "mechanic upselling new headlight units profit", "and that, precisely, is the business", "y eso justamente es el negocio"],
  // ── PRINCIPIO ──
  ["fa_fill_dirt_stuck", "person wiping headlight thinking dirt stuck on it", "people think it is grime, dirt stuck on", "es mugre suciedad pegada"],
  ["fa_fill_factory_coat", "new headlight with factory clear protective coating", "from the factory, with a clear protective coat", "y de fabrica"],
  ["fa_fill_uv_rays_years", "sun uv rays beating on car headlight over years", "over years, with ultraviolet rays", "con los rayos ultravioletas"],
  ["fa_fill_coat_wears_out", "worn protective coat peeling off headlight plastic", "and when that coat wears out", "y cuando esa capa se gasta"],
  ["fa_fill_turns_yellow_opaque", "headlight turning yellow opaque oxidized macro", "it turns yellow, opaque", "se pone amarillo"],
  ["fa_fill_rubbing_no_use", "scrubbing headlight surface outside no result", "so rubbing outside does nothing", "por eso frotar por afuera no hace nada"],
  ["fa_fill_not_on_top", "cutaway headlight problem inside not on surface", "the problem isn't on top of the headlight", "el problema no esta encima del faro"],
  // ── DOS CLAVES ──
  ["fa_fill_record_these", "two key steps headlight restoration noted", "write these down, the two keys", "grabatelas una"],
  ["fa_fill_oxidized_yellow_sand", "wet sanding oxidized yellow layer off headlight", "that dead, oxidized, yellow layer, sanding it", "oxidada amarilla lijandola"],
  ["fa_fill_once_clear", "headlight polished clear after sanding transparent", "once you've left it transparent", "una vez que lo dejaste transparente"],
  ["fa_fill_seal_it", "spraying clear sealant on restored headlight", "seal it, or the sun burns it again", "sellarlo porque si no"],
  ["fa_fill_two_halves", "two halves remove protect headlight restoration", "those are the two halves", "esas son las dos mitades"],
  // ── REGLA #1 ──
  ["fa_fill_old_coat_new", "removing old coat applying new clear coat headlight", "take off the old coat, put a new one", "se saca la capa vieja y se pone una nueva"],
  // ── PASTA DE DIENTES ──
  ["fa_fill_quick_emergency", "toothpaste quick headlight emergency fix", "the quick trick, for an emergency", "el de la urgencia"],
  ["fa_fill_common_white_paste", "plain common white toothpaste tube close up", "yes, plain white toothpaste", "la pasta de dientes comun"],
  ["fa_fill_toothpaste_works_why", "toothpaste fine abrasive polishing teeth metaphor", "and why it works", "y porque funciona"],
  ["fa_fill_sand_top_layer", "toothpaste lightly sanding oxidized headlight top", "they lightly sand the oxidized top layer", "lijan suavecito la capa oxidada de arriba"],
  ["fa_fill_clean_rag", "clean cloth rag with toothpaste for headlight", "you grab a clean rag", "agarras un trapo limpio"],
  ["fa_fill_good_amount_paste", "applying generous toothpaste rubbing headlight circles", "a good amount of paste, rub hard in circles", "le pones una buena cantidad de pasta"],
  ["fa_fill_oxidation_coming_out", "yellow stained rag from headlight oxidation rubbing", "that is the oxidation coming out", "eso es la oxidacion saliendo"],
  ["fa_fill_rinse_water_dry", "rinsing headlight with water and drying cloth", "rinse with water, dry it", "enjuagas con agua secas"],
  // ── HONESTIDAD pasta ──
  ["fa_fill_honest_with_you", "tomas honest to camera homemade repair advice", "but here I have to be honest", "tengo que ser honesto con vos"],
  ["fa_fill_for_a_photo", "headlight quick shine for inspection photo temporary", "for inspection tomorrow, for a photo", "para una foto"],
  ["fa_fill_files_little", "toothpaste lightly filing barely yellow headlight", "it files very little, only for barely yellow", "lima muy poquito"],
  ["fa_fill_good_to_know", "knowing the patch limits headlight quick fix", "good to know, good as a stopgap", "esta bueno para salir del paso"],
  // ── LIJAR + TAPAR ──
  ["fa_fill_sand_then_seal", "wet sanding then sealing headlight real method", "it is wet sanding and then sealing", "lijar con agua y despues sellar"],
  ["fa_fill_sounds_hard", "headlight restoration tools simpler than it sounds", "it sounds harder than it is, I promise", "suena mas dificil de lo que es"],
  ["fa_fill_a_sealer", "clear coat sealer can for headlight restoration", "and a sealer I'll explain", "y un sellador"],
  ["fa_fill_paint_plastics_chrome", "masking tape over car paint plastic chrome trim", "the paint, the plastics, the chrome", "la pintura los plasticos los cromados"],
  // ── PROCESO LIJADO ──
  ["fa_fill_water_removes_dust", "water washing away sanding dust on headlight", "the water carries off the dust", "el agua se lleva el polvillo"],
  ["fa_fill_milky_dont_panic", "headlight gone milky white opaque sanded", "all white and milky, you'll get scared", "te vas a asustar"],
  ["fa_fill_this_is_right", "milky sanded headlight correct stage process", "calm, this is how it should look", "es asi como tiene que quedar"],
  ["fa_fill_other_direction", "wet sanding headlight in crosswise direction", "wet, sand it all again, other direction", "en otra direccion"],
  ["fa_fill_loses_milky", "headlight losing milkiness evening out finer grit", "with each finer grit it loses the milky", "el faro va perdiendolo lechoso"],
  // ── PULIR ──
  ["fa_fill_seems_impossible", "the impossible moment headlight turning clear", "the magic, the moment that seems impossible", "el momento que parece imposible"],
  ["fa_fill_remove_dead_scratched", "removing all dead scratched layers of headlight", "you took off all the dead, scratched layers", "le sacaste todas las capas muertas y rayadas"],
  // ── ATAJO taladro ──
  ["fa_fill_drill_sanding_discs", "drill with sanding discs restoring headlight", "sanding discs and a foam or felt disc", "conseguis unos discos de lija"],
  ["fa_fill_lowering_grits_drill", "drill wet sanding lowering grit numbers headlight", "lowering the grit numbers, always with water", "vas vejando los numeros de lija igual"],
  ["fa_fill_five_vs_twenty", "drill five minutes vs hand twenty headlight", "five minutes instead of twenty", "tardas cinco minutos en vez de veinte"],
  ["fa_fill_watch_one_thing", "warning drill overheating melting headlight plastic", "but watch one thing", "pero ojo con una cosa"],
  // ── ERROR teaser ──
  ["fa_fill_put_away_things", "man putting away tools after shiny headlight", "puts the tools away and makes the mistake", "guarda las cosas"],
  ["fa_fill_dure_or_two_weeks", "headlight lasting years vs fading two weeks", "the difference between lasting years or two weeks", "que esto te dure anos o dos semanas"],
  // ── INJERTO 1 ──
  ["fa_fill_which_grit_start", "choosing sandpaper grit by yellowness of headlight", "which grit to start with, by how yellow", "con que numero de lija empezar"],
  ["fa_fill_exact_steps_manual", "home repair manual exact steps headlight notebook", "I gathered this with the exact steps", "junte esto con los pasos exactos"],
  ["fa_fill_today_need_nothing", "headlight restored with just today's instructions", "for today you need nothing else", "para lo de hoy no te hace falta nada"],
  ["fa_fill_ruins_everything", "unsealed headlight ruined the mistake that ruins all", "and the mistake that ruins everything", "y el error que arruina todo"],
  // ── SELLADO ──
  ["fa_fill_first_already_done", "sanded polished clear headlight first key done", "you just did the first one, sanded and polished", "lijaste y puliste"],
  ["fa_fill_no_factory_coat", "bare headlight stripped of factory protective coat", "without the factory protective coat you sanded off", "sin la capa protectora de fabrica"],
  ["fa_fill_two_three_weeks", "headlight yellowing again after two three weeks", "in two or three weeks, worse than the start", "en dos o tres semanas vas a estar peor"],
  ["fa_fill_trick_does_work", "headlight restoration method that does work sealed", "but the trick does work", "pero el truco si sirve"],
  ["fa_fill_seal_new_coat", "applying new protective clear coat to headlight", "sealing is putting a new protective coat", "una capa protectora nueva"],
  ["fa_fill_aerosol_sold", "aerosol uv clear coat can sold for headlights", "in aerosol, sold for exactly this", "en aerosol que venden para esto"],
  ["fa_fill_sunscreen_headlight", "clear coat acting as sunscreen for headlight", "that coat is sunscreen for the headlight", "esa capa hace de protector solar del faro"],
  ["fa_fill_no_aerosol", "clear automotive varnish can alternative headlight", "if you can't find that aerosol", "si no conseguis ese aerosol"],
  ["fa_fill_wax_for_paint", "car wax tin applied as protection homemade option", "the wax you use for the paint, every couple months", "esa que usas para la pintura"],
  ["fa_fill_doesnt_last_wax", "car wax thin protection not lasting headlight", "it doesn't last like the varnish", "no dura tanto como el barniz"],
  ["fa_fill_put_something_on", "always put protective coat on headlight never bare", "the key: put something on top", "es ponerle algo encima"],
  // ── ERROR ──
  ["fa_fill_people_say_doesnt", "frustrated owner saying this doesn't work headlight", "and people say this doesn't work", "y la gente diga"],
  ["fa_fill_beautiful_but_bare", "beautiful clear but unsealed bare headlight", "that beautiful headlight is bare", "ese faro hermoso que te quedo esta desnudo"],
  ["fa_fill_so_many_frustrate", "many people frustrated by failed headlight trick", "so many try it, it lasts nothing, they give up", "les dura nada y se frustran"],
  // ── ADVERTENCIAS ──
  ["fa_fill_warnings_disaster", "warning bad headlight hacks disaster repellent", "honest warnings: there are disaster tricks", "advertencias honestas"],
  ["fa_fill_famous_instant", "repellent making headlight instantly clear famous hack", "instant clear, that is why it got famous", "y por eso se hizo famoso"],
  ["fa_fill_softens_plastic", "insect repellent softening melting headlight plastic", "the repellent melts it, softens it", "ese repelente lo derrite"],
  ["fa_fill_never_do_it", "warning red cross do not use repellent headlight", "don't ever do it", "no lo hagas nunca"],
  ["fa_fill_nice_shine_day", "oily shine headlight lasting only one day dust", "a nice shine for a day, pure oil over grime", "dan un brillo lindo por un dia"],
  ["fa_fill_attracts_dirt", "oily headlight attracting more dust and dirt", "fixes nothing and gathers more dirt", "no arregla nada y junta mas tierra"],
  // ── LÍMITES ──
  ["fa_fill_see_water_inside", "moisture fog water trapped inside car headlight", "or you see moisture, fogged inside", "se le ve humedad empanado por dentro"],
  ["fa_fill_check_seal_replace", "checking headlight housing seal or replacing unit", "then check the housing seal or replace it", "el sellado del faro o cambiarlo"],
  ["fa_fill_not_fully_recover", "deeply pitted burned headlight not fully recoverable", "sometimes it doesn't fully recover", "a veces no se recupera del todo"],
  // ── BONUS plásticos negros ──
  ["fa_fill_exactly_like_headlight", "faded black trim same as headlight oxidation", "it is exactly the same as the headlight", "es exactamente lo mismo que el faro"],
  ["fa_fill_revived_cheap", "restoring faded black plastic trim cheaply", "the sun burned the surface, revived cheap", "y se revive igual de barato"],
  ["fa_fill_oil_kitchen_works", "rubbing kitchen oil on faded car trim black back", "even kitchen oil works, black returns instantly", "hasta el de cocina sirve"],
  ["fa_fill_heat_gun_pass_far", "heat gun passing over faded trim from distance moving", "passing it from afar and moving", "pasandola de lejos y en movimiento"],
  ["fa_fill_lasts_months", "deep black restored trim lasting months no product", "no products, and it lasts months", "sin productos y aguanta meses"],
  ["fa_fill_hidden_corner_test", "testing heat on hidden corner of car trim", "test it first on a hidden little corner", "en una esquinita escondida"],
  ["fa_fill_same_enemy_sun", "the sun the same enemy cheap fix coins", "the same enemy, the sun, the same coins fix", "el mismo enemigo de siempre"],
  // ── INJERTO 2 / RECAP ──
  ["fa_fill_none_expensive_hard", "cheap simple headlight steps none costly", "none of these steps is expensive or hard", "ninguno de estos pasos es caro"],
  ["fa_fill_wood_metal_section", "manual section wood and metal that dont die", "a part on wood and metal that don't ruin", "una parte de madera y metal"],
  ["fa_fill_leaks_damp_section", "manual section leaks damp and mold repairs", "another on leaks and damp", "otra de goteras y humedad"],
  ["fa_fill_forty_same_criterion", "forty cheap repairs same criterion manual", "forty repairs, all the same criterion", "40 arreglos todos con el mismo criterio"],
  ["fa_fill_industry_hides", "industry hiding cheap fixes to keep you paying", "what the industry hides so you keep paying", "lo que la industria te oculta"],
  ["fa_fill_polish_until_clear", "polishing headlight until crystal clear transparent", "polish until it is transparent", "puli hasta que quede transparente"],
  ["fa_fill_seal_uv_most_important", "sealing headlight with uv clear coat most important", "most important, seal it with a UV clear coat", "sellalo con un barniz transparente con filtro ultravioleta"],
  // ── CIERRE ──
  ["fa_fill_see_night_proper", "driving at night clear restored headlights bright", "see at night as you should, pass inspection", "ver de noche como corresponde"],
  ["fa_fill_secrets_car_shop", "many hidden car secrets the shop won't tell", "headlights are just one of the car's secrets", "los faros son uno solo de los secretos del auto"],
  ["fa_fill_car_house_full", "whole car and house full of cheap fixes", "the whole car and house are full of these", "el auto entero y la casa entera estan llenos"],
  ["fa_fill_wood_rots_liquid", "rotting wood saved with cheap two peso liquid", "wood that rots, saved with a two-peso liquid", "la madera que se pudre"],
  ["fa_fill_rust_eats_iron", "rust eating iron pipe cheap fix", "rust that eats iron, the pipe you unclog yourself", "el oxido que se come el hierro"],
  ["fa_fill_industry_prefers", "industry preferring you stay uninformed cheap fixes", "coin fixes the industry prefers you not know", "que la industria prefiere que no sepas"],
  ["fa_fill_grit_numbers_seal", "manual with sanding grit numbers and sealing headlights", "including the grit numbers and headlight sealing", "incluidos los numeros de lija y el sellado de los faros"],
  ["fa_fill_even_if_never", "person grabbing sandpaper to fix headlight today", "even if you never grab it, do today's fix", "incluso si nunca lo agarras"],
  ["fa_fill_night_safety_thanks", "safe night driving clear headlights gratitude", "your night safety will thank you", "tu seguridad de noche te lo va a agradecer"],
  // ── PRÓXIMO ──
  ["fa_fill_costly_shop_fix", "car repair shop charging a lot for paint fix", "another fix the shop charges a fortune for", "el taller te cobra carisimo"],
  ["fa_fill_if_helped_dont_miss", "subscribe helpful car repair video next", "if this helped, don't miss it", "si esto te sirvio no te lo pierdas"],
];
for (const [name, query, concept, ph] of FILL) { const s = atc(ph); if (s == null) continue; beats.push({ id: name, start: +s.toFixed(2), dur: 3, kind: "raw", src: `real/${name}.png`, darken: 0, hue: HUES[Math.round(s) % 3] }); addB(name, query, concept); }
beats.sort((a, b) => a.start - b.start);

// ── BURSTS extra (oxstack) para flashes sub-1s en momentos de lista ──
const BURSTS = [
  { at: "tu auto tiene los faros amarillentos opacos", images: ["real/fa_yellow_cloudy_headlight2.png", "real/fa_headlight_cloud_inside.png", "real/fa_old_yellow_headlight_day.png"], captions: ["Amarillos", "Opacos", "Como con nube"], accent: "red" },
  { at: "del numero grueso al fino 400", images: ["real/fa_sand_400_grit.png", "real/fa_sand_600_grit.png", "real/fa_finest_grit_2000.png"], captions: ["400 grueso", "600 y 1000", "2000 fino"], accent: "amber" },
  { at: "es lijar con agua y despues sellar", images: ["real/fa_toothpaste_white_tube.png", "real/fa_wet_sandpaper_grits.png", "real/fa_uv_clear_coat_spray.png"], captions: ["Pasta (parche)", "Lijas al agua", "Barniz UV"], accent: "blue" },
  { at: "los paragolpes viejos", images: ["real/fa_faded_black_trim.png", "real/fa_trim_bumper_mirrors.png", "real/fa_deep_black_returns.png"], captions: ["Plásticos grises", "Molduras, espejos", "Negro de vuelta"], accent: "amber" },
];
for (const b of BURSTS) { const s = atc(b.at); if (s == null) continue; beats.push({ id: `burst_${Math.round(s)}`, start: +s.toFixed(2), dur: 4.2, kind: "oxstack", overlay: true, hue: "amber", images: b.images, captions: b.captions, accent: b.accent }); }
beats.sort((a, b) => a.start - b.start);

// ── STRUCT — formatos estructurados (gate de variedad: ≥6 tipos, ≥6% peso, bars≥2) ──
const STRUCT = [
  { kind: "bars", at: "una fortuna por dos pedazos de plastico", hue: "red", title: "Lo que pagás de más", bars: [{ label: "Cambiar las dos ópticas", value: 100, display: "$$", tone: "danger" }, { label: "Restaurarlas vos mismo", value: 3, display: "café", winner: true }] },
  { kind: "bars", at: "el faro amarillo no se limpia se restaura", hue: "amber", title: "Limpiar vs restaurar", bars: [{ label: "Frotar por afuera: no pasa nada", value: 100, display: "✗", tone: "danger" }, { label: "Sacar lo muerto y sellar", value: 6, display: "✓", winner: true }] },
  { kind: "bars", at: "puede tirar hasta la mitad menos de luz a la ruta", hue: "red", title: "Luz a la ruta", bars: [{ label: "Faro amarillo y opaco", value: 50, display: "½", tone: "danger" }, { label: "Faro restaurado", value: 100, display: "100%", winner: true }] },
  { kind: "process", at: "es lijar con agua y despues sellar", hue: "blue", title: "El arreglo que dura años", eyebrow: "Tres pasos, por monedas", steps: [{ title: "Tapá y lijá al agua", desc: "400, 600, 1000 y 2000, siempre mojado" }, { title: "Pulí", desc: "con pasta pulidora hasta dejarlo transparente" }, { title: "Sellá", desc: "barniz UV: el paso que el 90% saltea" }] },
  { kind: "process", at: "empecemos por el truco rapido", hue: "amber", title: "El parche de urgencia", eyebrow: "Algo que tenés en el baño", steps: [{ title: "Pasta de dientes", desc: "una buena cantidad en un trapo o cepillo" }, { title: "Frotá en círculos", desc: "con fuerza, mojando de vez en cuando" }, { title: "Enjuagá", desc: "se ve mejor, pero es solo un parche" }] },
  { kind: "aged", at: "grabatelas una", hue: "amber", heading: "LAS DOS CLAVES", eyebrow: "Si te falta una mitad, fallaste", lines: ["Sacar la capa muerta, lijándola", "Volver a proteger, sellándolo", { text: "Sacar lo muerto y volver a proteger", mark: true }] },
  { kind: "aged", at: "el error que comete casi todo el mundo", hue: "red", heading: "EL ERROR FATAL", eyebrow: "Por qué a la gente no le dura", lines: ["Lijar, pulir y dejarlo brillante", "Y guardar todo SIN sellar", { text: "El sol lo quema de nuevo en dos semanas", mark: true }] },
  { kind: "callout", at: "en 20 minutos", figure: "20 min", caption: "En la vereda, por el precio de un café.", accent: "good", image: "real/fa_restore_headlight_curb.png" },
  { kind: "callout", at: "el plastico que queda abajo", figure: "El sol", caption: "Quema la capa UV y el plástico queda desnudo y amarillo.", accent: "danger", image: "real/fa_bare_plastic_oxidized.png" },
  { kind: "callout", at: "el paso que el 90 de la gente se saltea", figure: "90%", caption: "Saltea el sellado: por eso el faro se vuelve amarillo.", accent: "danger", image: "real/fa_uv_clear_coat_spray.png" },
  { kind: "callout", at: "es veneno para el plastico", figure: "Veneno", caption: "El repelente derrite y deforma el plástico del faro.", accent: "danger", image: "real/fa_insect_repellent_can.png" },
  { kind: "callout", at: "cuesta menos que una sola optica nueva", figure: "< 1 óptica", caption: "El manual cuesta menos que una sola óptica nueva.", accent: "good", image: "real/fa_expensive_optics_shelf.png" },
  { kind: "callout", at: "esa capa hace de protector solar del faro", figure: "Años", caption: "El barniz UV es el protector solar del faro: dura años.", accent: "cold", image: "real/fa_uv_clear_coat_spray.png" },
  { kind: "checklist", at: "para que dure anos", hue: "blue", title: "El plan completo", items: [{ text: "No es mugre: es plástico oxidado por el sol", state: "done" }, { text: "Urgencia: pasta de dientes (parche)", state: "done" }, { text: "Tapá y lijá al agua 400 → 2000", state: "done" }, { text: "Pulí hasta dejarlo transparente", state: "done" }, { text: "Sellá con barniz UV. Nunca repelente", state: "done" }] },
  { kind: "callout", at: "la mitad mas importante", figure: "La mitad", caption: "Sin sellar, te salteás la mitad más importante.", accent: "danger", image: "real/fa_skipped_important_half.png" },
  { kind: "callout", at: "se revive igual de barato", figure: "Mismo arreglo", caption: "Los plásticos negros se reviven con el mismo principio.", accent: "good", image: "real/fa_deep_black_returns.png" },
];
for (const s of STRUCT) { const t = atc(s.at); if (t == null) continue; const { kind, at: _a, image, ...props } = s; const beat = { id: `cmp_${kind}_st_${Math.round(t)}`, start: +t.toFixed(2), dur: 6.5, kind, hue: s.hue || "blue", ...props, ...(image ? { image } : {}) }; if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l)); if (kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it)); beats.push(beat); }
beats.sort((a, b) => a.start - b.start);

fs.mkdirSync("public/broll", { recursive: true }); fs.mkdirSync("public/real", { recursive: true }); fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(MATCH, null, 2));
fs.writeFileSync(`public/real/bing_${SLUG}.json`, JSON.stringify(BING, null, 2));
fs.writeFileSync(`public/img/prompts_${SLUG}_diag.json`, JSON.stringify(DIAGRAMS, null, 2));
if (MODE === "match") { console.log(`=== build_oxido MATCH ===`); console.log(`match ${MATCH.length} · bing ${BING.length} · diag ${DIAGRAMS.length} · proxy ${(2 * MATCH.length / 6).toFixed(0)}/IP`); process.exit(0); }
const haveClip = (n) => fs.existsSync(`public/broll/${n}.mp4`);
const haveReal = (n) => fs.existsSync(`public/real/${n}.png`) || fs.existsSync(`public/real/${n}.jpg`);
const haveImg = (n) => fs.existsSync(`public/img/${n}.png`);
let nClip = 0, nReal = 0, nImg = 0, nMiss = 0; const miss = [];
for (const b of beats) { if (b.kind !== "raw") continue; if (b.src.startsWith("broll/")) { if (haveClip(b.id)) nClip++; else if (haveReal(b.id)) { b.src = `real/${b.id}.png`; nReal++; } else { nMiss++; miss.push(b.id); } } else if (b.src.startsWith("real/")) { if (haveReal(b.id)) nReal++; else { nMiss++; miss.push(b.id); } } else if (b.src.startsWith("img/")) { if (haveImg(b.id)) nImg++; else { nMiss++; miss.push(b.id); } } }
// DENSIDAD MÁXIMA: recomputar dur por beat raw (permite flashes sub-1s, min 0.8s).
{ const ord = beats.filter((b) => !b.overlay).sort((a, b) => a.start - b.start);
  for (let i = 0; i < ord.length; i++) { const b = ord[i]; if (b.kind !== "raw") continue; const next = i + 1 < ord.length ? ord[i + 1].start : TOTAL; b.dur = +Math.max(0.8, Math.min(next - b.start + 0.3, 7)).toFixed(2); } }
// SEGURIDAD: dropear beats raw cuyo asset no existe (evita 404 en el farm).
for (let i = beats.length - 1; i >= 0; i--) { const b = beats[i]; if (b.kind === "raw" && !fs.existsSync("public/" + b.src)) beats.splice(i, 1); }
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, clipsfirst: true, beats }, null, 1));
const AVF = [[0, OPEN]];
for (let i = 0; i < SEC.length; i++) { if (!SEC[i].full) continue; const st = SEC[i].start; const end = i + 1 < SEC.length ? SEC[i + 1].start : TOTAL; AVF.push([st, end]); }
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = []; let k = 0;
for (let i = 0; i < beats.length; i++) { if (beats[i].kind !== "raw") continue; if (i % 5 === 2) { pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]); k++; } }
const firstClip = beats.length ? beats[0].start : OPEN;
const inAvf = (t) => AVF.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
// cobertura por beats raw; en huecos SIN clip el avatar va FULL (nunca negro)
const cov = beats.filter((b) => b.kind === "raw").map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
const covered = (t) => cov.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const modeAt = (t) => { if (t < firstClip - 1e-6) return "full"; if (inAvf(t)) return "full"; if (!covered(t)) return "full"; const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden"; };
const pts = [...new Set([0, firstClip, ...AVF.flat(), ...pip.flatMap((p) => [p[0], p[1]]), ...cov.flat(), TOTAL].map((x) => +(+x).toFixed(2)))].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);
const avSecs = AVF.reduce((a, [s, e]) => a + (e - s), 0);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const dur = beats.length ? beats[beats.length - 1].start + beats[beats.length - 1].dur : 0;
const rawN = beats.filter((b) => b.kind === "raw").length;
console.log(`=== build_oxido BUILD ===`);
console.log(`beats ${beats.length} (raw ${rawN}, ${(100 * rawN / beats.length).toFixed(0)}%) · clips ${nClip} · imgs ${nReal} · gpt ${nImg} · faltan ${nMiss} · dur ${(dur / 60).toFixed(1)}min · pace ${(dur / beats.length).toFixed(1)}s`);
console.log(`avatar-full ${(avSecs / 60).toFixed(1)}min · PiP ${pip.length} · windows ${windows.length} · MATCH ${MATCH.length} · BING ${BING.length} · DIAG ${DIAGRAMS.length}`);
if (miss.length) console.log(`faltan (${miss.length}): ${miss.slice(0, 12).join(", ")}`);
