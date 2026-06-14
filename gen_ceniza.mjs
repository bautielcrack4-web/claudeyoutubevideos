// gen_ceniza.mjs — "No Tires La Ceniza" (Constructor Libre v5, FACELESS, voz Tomás).
// Cada imagen = gpt-image-2 único matcheado al momento narrado + diagramas + clips
// reales (matchclip) + animaciones LTX. Anclaje por frase. Guard: corre sin captions
// (emite prompts) y se re-corre tras transcribir para el sync fino. Clon de gen_jabon.
import fs from "fs";

const IMAGES = new Map();
const P = (s) =>
  `Foto documental muy realista, formato horizontal apaisado 16:9. ${s} Que parezca una foto casera real sacada con el celular: leve desenfoque, encuadre algo torcido, luz despareja y natural, texturas reales, manos naturales, fondo algo desordenado, pequeñas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental auténtico de casa de campo, saturación baja, colores suaves y apagados. Negative prompt: foto de estudio limpia, producto perfecto, brillante, cinematográfico, CGI, render 3D, ilustración, cartoon, texto legible, logo, marca de agua, cara perfecta simétrica, dedos de más, manos deformadas.`;
const DGP = (s) =>
  `Infografía horizontal 16:9 (1792x1024), lámina artesanal editorial premium, muy limpia. Fondo marfil con textura de papel sutil, líneas marrón oscuro, acentos verde oliva y terracota apagado. ${s} Tipografía serif clásica, ilustraciones de tinta fina y acuarela suave, mucho espacio en blanco, se entiende en un segundo. Estética vintage de libro de texto antiguo, papel envejecido. Nada infantil ni recargado, sin sobrecarga de íconos.`;
const IM = (name, subject) => { if (!IMAGES.has(name)) IMAGES.set(name, P(subject)); return `img/${name}.png`; };
const DIA = (name, subject) => { if (!IMAGES.has(name)) IMAGES.set(name, DGP(subject)); return `img/${name}.png`; };

const HUES = ["amber", "red", "blue"];
const r = (src, o = {}) => ({ t: "raw", src, ...o });
const dgb = (src, o = {}) => ({ t: "raw", src, zoom: [1.0, 1.05], hold: true, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const f = (src, o = {}) => ({ t: "float", src, side: fSide++ % 2 ? "left" : "right", ...o });
const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.05, stat: 1.0, aged: 1.2,
  checklist: 1.25, splitlist: 1.1, bars: 1.25, process: 1.5, journey: 2.4, infzoom: 1.3,
  annotated: 1.35, callout: 1.05, chips: 1.0 };

const SECTIONS = [
  // 0 — HOOK (dinámico: impact + clips animados + cortes rápidos + stat, NO fotos lentas)
  { key: "intro", start: 0.12, hue: "amber", beats: [
    c("impact", { image: IM("cz_ceniza_mano", "Primer plano de un puñado de ceniza gris fina cayendo entre los dedos de un hombre de campo, sobre el fondo de un fogón."), setup: "Esto que usted tira a la basura…", impact: "ES DE LO MÁS VALIOSO QUE TIENE", impactAccent: "danger", hitAt: 1.1 }),
    r("vid/cz_fogon_apagado.mp4", { kicker: "La ceniza del fogón", w: 0.4 }),
    f(IM("cz_tacho_ceniza", "Un tacho de metal con tapa lleno de ceniza guardada en un galpón de campo."), { kicker: "Yo la guardo como oro gris", w: 0.4 }),
    r("vid/cz_ceniza_oro.mp4", { w: 0.4 }),
    c("stat", { value: 7, suffix: "", label: "productos que reemplaza, gratis", eyebrow: "Una sola ceniza", accent: "amber" }),
    r(IM("cz_vivero_bolsa", "Una bolsa de fertilizante comprado en un vivero, con precio, góndola, luz fría."), { kicker: "Lo que después paga en el vivero", w: 0.4 }),
    c("quote", { image: IM("cz_huerta_tomates", "Una huerta de campo con plantas de tomate verdes y sanas, tierra oscura, luz natural."), text: "Está tirando fertilizante, limpiador, veneno contra plagas… *gratis*." }),
    r(IM("cz_balde_tirar", "Una persona a punto de tirar un balde de ceniza a la basura en un patio de campo."), { kicker: "Y la gente la tira", w: 0.5 }),
    c("headline", { tokens: ["No", "tires", "la", { t: "ceniza" }], eyebrow: "Lo que la gente de antes nunca desperdiciaba", bg: "image", image: IM("cz_ceniza_oro", "Ceniza gris fina iluminada por un rayo de sol, como un tesoro, primer plano artístico.") }),
  ]},
  // 1 — TOMÁS
  { key: "tomas", start: 70, hue: "blue", beats: [
    r(IM("cz_casa_campo", "Una casa de madera hecha a mano en el campo, humo saliendo de la chimenea, atardecer."), { kicker: "Hace veinte años dejé la ciudad", hold: true }),
    r(IM("cz_estufa_manana", "Un hombre de campo sacando ceniza de una estufa a leña con una pala, en la mañana."), { w: 0.6 }),
    c("quote", { image: IM("cz_manos_ceniza", "Las manos curtidas de un hombre de campo sosteniendo ceniza, primer plano."), text: "Me pregunté: ¿de verdad esto no sirve para *nada*? Y servía para todo." }),
    c("aged", { heading: "No desperdiciar nada", lines: ["Cuando uno vive lejos,", "cada cosa que tira la tiene que ir a comprar lejos y caro."], image: IM("cz_galpon_campo", "El interior de un galpón de campo con herramientas viejas, baldes y leña, luz cálida.") }),
    r(IM("cz_hombre_huerta", "Un hombre mayor trabajando en su huerta de campo al amanecer, de espaldas."), { hold: true }),
  ]},
  // 2 — QUÉ ES
  { key: "quees", start: 130, hue: "amber", beats: [
    c("headline", { tokens: ["¿Qué", "es", "la", { t: "ceniza" }, "?"], eyebrow: "Entendé esto y todo se vuelve obvio", bg: "image", image: IM("cz_lena_arde2", "Troncos de madera ardiendo en una estufa, llamas vivas, brasas naranjas.") }),
    r(IM("cz_arbol_grande", "Un árbol grande y frondoso en un campo, raíces fuertes, cielo abierto."), { kicker: "El árbol sacó minerales toda su vida", w: 0.6 }),
    dgb(DIA("dg_cz_minerales", "Mostrar cómo un ÁRBOL toma minerales de la tierra (potasio, calcio, magnesio) por las raíces, el fuego se lleva el humo, y queda la CENIZA rica en minerales. Flechas simples: árbol, fuego, ceniza con rótulos en español.")),
    c("quote", { image: IM("cz_ceniza_fina2", "Primer plano de ceniza de madera muy fina y limpia, gris clara, textura aterciopelada."), text: "La ceniza es, literalmente, el árbol reducido a sus *minerales* puros." }),
    c("splitlist", { title: "La ceniza tiene dos caras", items: ["Rica en minerales que alimentan", "Alcalina y fuerte: hay que saber usarla"], palette: "A" }),
  ]},
  // 3 — HUERTA (fertilizante)
  { key: "huerta", start: 175, hue: "blue", beats: [
    c("headline", { tokens: ["El", "rey", ":", "la", { t: "huerta" }], eyebrow: "Fertilizante de potasio gratis", bg: "image", image: IM("cz_huerta_grande", "Una huerta grande y próspera de campo con canteros de verduras, al atardecer.") }),
    r(IM("cz_potasio_fruto", "Tomates rojos grandes y sanos colgando de la planta, primer plano, gotas de rocío."), { kicker: "Más flores, más frutos", w: 0.6 }),
    r(IM("cz_espolvorear", "Una mano espolvoreando ceniza fina alrededor de una planta de tomate, como salando, en la huerta."), { kicker: "Finita, repartida", hold: true }),
    dgb(DIA("dg_cz_plantas", "Una tabla simple de dos columnas: a la izquierda en verde 'AMAN la ceniza' con tomate, ajo, cebolla, repollo, frutales; a la derecha en terracota 'la ODIAN' con arándano, papa, azalea, hortensia. Rótulos en español, ilustraciones simples de cada planta.")),
    c("chips", { bg: "image", image: IM("cz_tomate_ajo", "Tomates, ajos y cebollas frescos recién cosechados sobre una mesa de madera."), title: "Aman la ceniza", chips: ["tomates", "ajos y cebollas", "coles", "frutales"], hue: "amber" }),
    c("splitlist", { title: "La odian (tierra ácida)", items: ["Arándanos y azaleas", "Hortensias", "Papas"], palette: "D", cross: true }),
    c("quote", { image: IM("cz_cantero", "Un cantero de huerta con tierra oscura recién trabajada y plantines verdes."), text: "Saber esta lista es la diferencia entre un regalo y un *desastre*." }),
    c("annotated", { image: IM("cz_balde_volcado", "Un montón excesivo de ceniza volcado en un solo lugar de la huerta, quemando la tierra."), caption: "El error que mata la tierra", annotations: [
      { x: 50, y: 45, label: "Nunca un balde entero" },
      { x: 50, y: 78, label: "Poca, fina, repartida" },
    ]}),
  ]},
  // 4 — INJERTO 1
  { key: "injerto1", start: 235, hue: "amber", beats: [
    c("aged", { heading: "Uno de 35 sistemas", lines: ["Cuánta ceniza por metro, cada cuánto,", "qué cultivo la ama y cuál la odia,", "todo medido en mi propia huerta."], image: IM("cz_cuaderno", "Un cuaderno viejo manuscrito con anotaciones sobre la huerta y dibujos, sobre una mesa de madera.") }),
    f(IM("cz_manual", "Un manual casero abierto mostrando una tabla dibujada a mano de cultivos, papel envejecido."), { kicker: "Todo junto en el manual" }),
    c("quote", { image: IM("cz_cocina_campo", "Una cocina rústica de campo con una olla quemada y ceniza, luz cálida."), text: "Pero quédese, que la ceniza sirve para mucho más que la *huerta*." }),
  ]},
  // 5 — GUARDAR
  { key: "guardar", start: 270, hue: "red", beats: [
    c("checklist", { title: "Guardar la ceniza", items: ["Fría y seca, nunca con brasas", "Tacho de metal con tapa", "Tamizada (sin carboncitos)"] }),
    r(IM("cz_brasa_peligro", "Una brasa naranja escondida entre la ceniza gris, primer plano, advertencia de incendio."), { kicker: "Una brasa aguanta horas", w: 0.6 }),
    r(IM("cz_tamizar", "Pasando ceniza por una rejilla o colador viejo para separar la fina de los carboncitos, manos."), { kicker: "Tamizar la fina", hold: true }),
    r(IM("cz_tacho_metal", "Un tacho de metal con tapa lleno de ceniza fina guardada, en un rincón de galpón."), { w: 0.6 }),
  ]},
  // 6 — LIMPIEZA
  { key: "limpieza", start: 305, hue: "amber", beats: [
    c("headline", { tokens: ["El", "polvo", "de", { t: "fregar" }], eyebrow: "El limpiador de las abuelas", bg: "image", image: IM("cz_olla_quemada", "Una olla de hierro con el fondo quemado y negro, sobre una mesada rústica.") }),
    r(IM("cz_frotar_olla", "Una mano frotando con ceniza y un trapo húmedo el fondo quemado de una olla, sacando lo negro."), { kicker: "Arranca lo quemado sin rayar", hold: true }),
    r(IM("cz_vidrio_hollin", "El vidrio de una estufa a leña tiznado de hollín negro, antes de limpiar."), { kicker: "Vidrio con hollín", w: 0.5 }),
    r(IM("cz_limpiar_vidrio", "Un papel de diario húmedo pasado por ceniza limpiando el vidrio de la estufa, quedando transparente."), { kicker: "Diario húmedo + ceniza", hold: true }),
    c("process", { title: "Limpiar el vidrio", steps: [
      { title: "Diario húmedo", image: IM("cz_diario_humedo", "Un trozo de papel de diario mojado en la mano, sobre una mesa.") },
      { title: "En la ceniza", image: IM("cz_papel_ceniza", "El papel de diario húmedo apretado contra ceniza fina blanca.") },
      { title: "Frotar el vidrio", image: IM("cz_frotar_vidrio", "Frotando el papel con ceniza sobre el vidrio tiznado de la estufa.") },
      { title: "Transparente", image: IM("cz_vidrio_limpio", "El vidrio de la estufa limpio y transparente, mostrando el fuego adentro.") },
    ]}),
    c("quote", { image: IM("cz_plata_bronce", "Cubiertos de plata y objetos de bronce viejos siendo pulidos con ceniza, brillo."), text: "Era el limpiapisos, el limpia ollas y el quitamanchas, todo en *uno*." }),
  ]},
  // 7 — PLAGAS
  { key: "plagas", start: 360, hue: "blue", beats: [
    r(IM("cz_babosa_planta", "Una babosa comiéndose la hoja tierna de un plantín en la huerta, de noche, primer plano."), { kicker: "Se comen los plantines", w: 0.6 }),
    r(IM("cz_anillo_ceniza", "Un anillo de ceniza seca espolvoreado alrededor de un plantín tierno en la huerta, como barrera."), { kicker: "Una barrera de ceniza", hold: true }),
    c("annotated", { image: IM("cz_barrera_babosa", "Una babosa frenada al borde de un anillo de ceniza alrededor de una planta, no puede cruzar."), caption: "Por qué no cruzan", annotations: [
      { x: 50, y: 40, label: "Seca y abrasiva" },
      { x: 50, y: 75, label: "Renovar tras la lluvia" },
    ]}),
    c("quote", { image: IM("cz_plantin_sano", "Un plantín tierno y sano protegido en la huerta, con un anillo de ceniza alrededor."), text: "Sin un veneno que mate a las abejas y los *sapos*, que son sus amigos." }),
  ]},
  // 8 — HIELO / ANIMALES / LEJÍA
  { key: "otros", start: 405, hue: "amber", beats: [
    r(IM("cz_camino_helado", "Un camino de campo helado y resbaladizo en invierno, escarcha, escalones."), { kicker: "Invierno: hielo resbaladizo", w: 0.5 }),
    r(IM("cz_ceniza_hielo", "Ceniza gris espolvoreada sobre hielo en un camino de campo, derritiéndolo y dando agarre."), { kicker: "Derrite y da agarre", hold: true }),
    r(IM("cz_gallina_polvo", "Una gallina revolcándose en un pozo de ceniza y tierra seca, baño de polvo natural, gallinero."), { kicker: "El baño de polvo de las gallinas", w: 0.6 }),
    c("chips", { bg: "image", image: IM("cz_jabon_lejia", "Un balde de ceniza junto a barras de jabón casero, conexión ceniza-lejía-jabón, mesa de madera."), title: "Y todavía más", chips: ["deshiela el invierno", "baño de las gallinas", "lejía para jabón"], hue: "amber" }),
  ]},
  // 9 — CORREGIR TIERRA + TEST
  { key: "tierra", start: 445, hue: "blue", beats: [
    c("quote", { image: IM("cz_tierra_acida", "Tierra de campo húmeda y oscura entre las manos de un agricultor, primer plano."), text: "Solo si su tierra es *ácida*. Si ya es alcalina, la ceniza la mata." }),
    dgb(DIA("dg_cz_test", "La prueba casera del suelo: dos vasos. Vaso 1 'tierra + VINAGRE → burbujea = ALCALINA, no eches ceniza'. Vaso 2 'tierra + BICARBONATO → burbujea = ÁCIDA, la ceniza ayuda'. Rótulos en español, ilustración simple de los dos vasos burbujeando.")),
    c("process", { title: "Prueba casera del pH", steps: [
      { title: "Dos puñados de tierra", image: IM("cz_dos_vasos", "Dos vasos de vidrio con tierra de la huerta, sobre una mesa de madera.") },
      { title: "Uno con vinagre", image: IM("cz_vinagre", "Echando vinagre en un vaso con tierra, viendo si burbujea, primer plano.") },
      { title: "Otro con bicarbonato", image: IM("cz_bicarbonato", "Echando bicarbonato en un vaso con tierra mojada, viendo si burbujea.") },
      { title: "Mira cuál burbujea", image: IM("cz_burbujeo", "Un vaso de tierra burbujeando con espuma, reacción química casera.") },
    ]}),
    r(IM("cz_septimo_uso", "Ceniza usada para desodorizar el fondo de un compost o letrina seca en el campo."), { kicker: "Hasta desodoriza y conserva", w: 0.6 }),
  ]},
  // 10 — INJERTO 2 anti-corp
  { key: "injerto2", start: 500, hue: "red", beats: [
    c("headline", { tokens: ["¿Por", "qué", "nadie", "te", "lo", { t: "enseña" }, "?"], eyebrow: "La parte incómoda", bg: "image", image: IM("cz_gondola_productos", "Una góndola de supermercado llena de productos de jardín y limpieza, cada uno con su envase y precio.") }),
    r(IM("cz_siete_productos", "Siete productos distintos comprados (fertilizante, limpiador, matababosas, sal) alineados sobre una mesa."), { kicker: "Siete productos comprados", hold: true }),
    c("bars", { title: "Lo que reemplaza una ceniza gratis", unit: "", bars: [{ label: "Ceniza gratis", value: 1 }, { label: "Productos comprados", value: 7 }] }),
    c("quote", { image: IM("cz_dinero", "Billetes y monedas sobre una mesa de madera, luz tenue, gasto."), text: "Con la ceniza gratis no se gana *dinero*. Por eso nadie te lo cuenta." }),
    c("aged", { heading: "Por eso junté todo", lines: ["Treinta y cinco sistemas, ordenados y probados,", "para devolverle el saber que le sacaron."], image: IM("cz_manual2", "Un manual grueso manuscrito abierto con recetas y dibujos caseros, sobre una mesa con un mate.") }),
  ]},
  // 11 — PREGUNTAS
  { key: "preguntas", start: 545, hue: "amber", beats: [
    c("splitlist", { title: "¿Qué ceniza puedo usar?", items: ["Solo madera natural y limpia", "Nunca pintada ni tratada", "Nunca carbón con químicos"], palette: "G" }),
    r(IM("cz_lena_limpia", "Leña de madera natural limpia apilada, sin pintura ni tratamiento, patio de campo."), { kicker: "Madera limpia, ceniza limpia", w: 0.6 }),
    c("quote", { image: IM("cz_tacho_guardar", "Un balde de metal con tapa guardando ceniza seca en un lugar seco del galpón."), text: "Guárdela seca: seca conserva todo su *poder*." }),
    r(IM("cz_punado_fino", "Un puñado fino de ceniza repartiéndose sobre la tierra de la huerta, mano abierta."), { kicker: "Menos es más", w: 0.6 }),
    c("chips", { bg: "image", image: IM("cz_usos_juntos", "Sobre una mesa: ceniza junto a un tomate, una olla limpia y un camino, mostrando sus usos."), title: "Una sola cosa para", chips: ["la huerta", "la limpieza", "las plagas", "el hielo"], hue: "blue" }),
  ]},
  // 12 — PANORAMA (ciclo)
  { key: "panorama", start: 590, hue: "blue", beats: [
    dgb(DIA("dg_cz_ciclo", "El ciclo perfecto en círculo con flechas: SUELO → ÁRBOL (crece) → FUEGO (se quema) → CENIZA → de vuelta al SUELO. Rótulos en español, ilustración circular elegante, nada se desperdicia.")),
    c("quote", { image: IM("cz_arbol_ciclo", "Un árbol grande en el campo con sus raíces en tierra oscura, ciclo de la vida, luz dorada."), text: "Del suelo al árbol, del árbol al fuego, de la ceniza de vuelta al *suelo*." }),
    r(IM("cz_campo_amplio", "Un campo amplio y verde con un árbol y una casa de madera a lo lejos, armonía, atardecer."), { hold: true }),
    c("splitlist", { title: "En la naturaleza", items: ["Nada es basura", "Todo es alimento de otra cosa", "Recuperar esa mirada cambia todo"], palette: "A" }),
  ]},
  // 13 — ACCIÓN
  { key: "accion", start: 625, hue: "amber", beats: [
    c("checklist", { title: "A partir de hoy", items: ["No tire más la ceniza limpia", "Un tacho de metal con tapa", "Pruebe el vidrio de la estufa", "Déle a sus tomates"] }),
    r(IM("cz_guardar_hoy", "Una persona guardando ceniza fría en un tacho de metal con tapa en el patio."), { w: 0.5 }),
    r(IM("cz_prueba_vidrio", "El antes y después del vidrio de la estufa: medio tiznado, medio transparente limpiado con ceniza."), { kicker: "La prueba que convence", hold: true }),
    c("journey", { eyebrow: "Empiece chico", title: "Deje que la ceniza le demuestre", accent: "accent", waypoints: [
      { x: 0, y: 0, z: 0, image: IM("cz_jrn_tacho", "Un tacho de metal con ceniza guardada, primer plano, galpón de campo."), label: "Guardar", num: "1", dwell: 2.4, travel: 1.5 },
      { x: 1.2, y: -0.3, z: 0.3, image: IM("cz_jrn_vidrio", "El vidrio de la estufa quedando transparente al frotarlo con ceniza."), label: "Limpiar", num: "2", dwell: 2.4, travel: 1.5 },
      { x: 2.4, y: 0.2, z: -0.2, image: IM("cz_jrn_huerta", "Ceniza fina espolvoreada alrededor de tomates en la huerta."), label: "Fertilizar", num: "3", dwell: 2.4, travel: 1.5 },
      { x: 3.6, y: -0.2, z: 0.2, image: IM("cz_jrn_tomate", "Tomates grandes y sanos cosechados, resultado de la ceniza."), label: "Cosechar", num: "4", dwell: 2.6, travel: 1.4 },
    ]}),
    c("quote", { image: IM("cz_observar", "Un hombre de campo mirando satisfecho su huerta próspera, manos en la cintura."), text: "Empiece chico, observe, y deje que le demuestre sola lo que *vale*." }),
  ]},
  // 14 — INJERTO 3 CTA
  { key: "injerto3", start: 660, hue: "red", beats: [
    c("aged", { heading: "Todo en el manual", lines: ["La tabla de cultivos, las cantidades,", "cómo medir el pH, las recetas de limpieza,", "la barrera contra babosas paso a paso."], image: IM("cz_manual_abierto", "Un manual casero abierto con láminas dibujadas a mano de la huerta y la ceniza, papel envejecido.") }),
    r(IM("cz_huerta_prospera", "Una huerta de campo próspera y abundante, llena de verduras sanas, al sol."), { hold: true }),
    c("bars", { title: "El precio de hoy", unit: "", bars: [{ label: "Por separado", value: 158 }, { label: "Hoy", value: 27 }] }),
    c("quote", { image: IM("cz_tomate_mano", "Un tomate rojo grande y sano en la mano de un agricultor, orgullo, huerta de fondo."), text: "Si no es para usted, le devuelvo cada centavo. El riesgo lo pongo *yo*." }),
  ]},
  // 15 — CIERRE + PRÓXIMO (ratas)
  { key: "cierre", start: 700, hue: "blue", beats: [
    c("quote", { image: IM("cz_compost", "Una pila de compost de campo con restos y ceniza, tierra viva, primer plano."), text: "Mire el mundo como un ciclo donde nada *sobra*." }),
    r(IM("cz_manos_tierra", "Las manos de un hombre de campo sosteniendo tierra negra y rica, vida, primer plano."), { w: 0.6 }),
    c("headline", { tokens: ["Saca", "las", "ratas", "con", { t: "$1" }], eyebrow: "La próxima vez", bg: "image", image: IM("cz_galpon_rata", "Un galpón de campo con una bolsa de granos, insinuando el problema de las ratas, penumbra.") }),
    r(IM("cz_gallinero", "Un gallinero de campo con gallinas, alimento y un granero, escena rural."), { kicker: "Sin veneno, sin trampas", hold: true }),
    c("quote", { image: IM("cz_oficio2", "Las manos de un hombre de campo trabajando con dignidad, oficio, luz de taller."), text: "No es magia. Es *oficio*. Y todavía se puede aprender." }),
    r(IM("cz_ceniza_final", "Un puñado de ceniza cayendo sobre la tierra de la huerta al atardecer, cierre tranquilo."), { hold: true }),
  ]},
];

// ── SEGUNDA PASADA: imágenes FLUX deAPI de INSTRUCCIÓN, una por micro-acción,
// ancladas a la frase EXACTA (at:). El anclaje por frase las reubica en su momento.
const FLUX = [
  { sec: "quees", src: "img/cf_ceniza_textura.png", at: "la ceniza es literalmente el arbol", kicker: "Minerales puros" },
  { sec: "huerta", src: "img/cf_espolvorear_tomate.png", at: "espolvorearla finita como quien sala", kicker: "Finita, repartida" },
  { sec: "huerta", src: "img/cf_tomates_canasta.png", at: "Una planta con buen potasio da frutos" },
  { sec: "guardar", src: "img/cf_pala_estufa.png", at: "nunca meta ceniza con alguna brasa", kicker: "Fría, nunca con brasas" },
  { sec: "guardar", src: "img/cf_tamiz_ceniza.png", at: "tamicela pasela por una rejilla", kicker: "Tamizar la fina" },
  { sec: "limpieza", src: "img/cf_olla_quemada2.png", at: "Tiene una olla con el fondo quemado", kicker: "El fondo quemado" },
  { sec: "limpieza", src: "img/cf_diario_bollo.png", at: "un papel de diario humedo lo moja", kicker: "Diario húmedo" },
  { sec: "limpieza", src: "img/cf_vidrio_estufa.png", at: "deja el vidrio transparente", kicker: "Queda transparente" },
  { sec: "limpieza", src: "img/cf_cuchara_plata.png", at: "limpia y pule la plata y el bronce", kicker: "Pule la plata" },
  { sec: "plagas", src: "img/cf_anillo_babosa.png", at: "arma una barrera un anillo de ceniza", kicker: "Un anillo de ceniza" },
  { sec: "otros", src: "img/cf_ceniza_hielo2.png", at: "espolvoree ceniza", kicker: "Derrite y da agarre" },
  { sec: "otros", src: "img/cf_gallina_polvo2.png", at: "donde se revuelcan las gallinas", kicker: "El baño de las gallinas" },
  { sec: "tierra", src: "img/cf_vinagre_botella.png", at: "le agrega un poco de vinagre", kicker: "Vinagre → alcalina" },
  { sec: "tierra", src: "img/cf_bicarbonato_cuchara.png", at: "le agrega un punado de bicarbonato", kicker: "Bicarbonato → ácida" },
  { sec: "tierra", src: "img/cf_tierra_burbujea.png", at: "burbujea con el bicarbonato", kicker: "Si burbujea…" },
];
// (el push de FLUX + re-orden cronológico se hace más abajo, tras definir findMs)

// tiempos REALES de sección (de captions_ceniza tras recortar silencios)
const REAL = { intro: 0.12, tomas: 63.30, quees: 116.95, huerta: 160.20, injerto1: 308.28, guardar: 345.50, limpieza: 395.52, plagas: 445.88, otros: 502.86, tierra: 560.72, injerto2: 647.98, preguntas: 706.70, panorama: 761.58, accion: 808.38, injerto3: 852.68, cierre: 898.50 };
for (const s of SECTIONS) if (REAL[s.key] != null) s.start = REAL[s.key];
const VIDEO_END = 948.43;

// ── ANCLAJE POR FRASE (con guard si no hay captions) ─────────────────────────
let CW = [];
try { const C = JSON.parse(fs.readFileSync("public/captions_ceniza.json", "utf8")); CW = (C.words || C).map((x) => ({ t: x.text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(), s: (x.startMs || 0) / 1000 })); } catch { CW = []; }
const normTok = (p) => p.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
const matchAt = (p, i) => { let ok = 0; for (let j = 0; j < p.length; j++) if (CW[i + j] && CW[i + j].t === p[j]) ok++; return ok; };
const findMs = (phrase, after) => {
  if (!CW.length) return null;
  const full = normTok(phrase);
  for (const len of [6, 5, 4, 3]) { const p = full.slice(0, len); if (p.length < 3) continue; for (let i = 0; i < CW.length - p.length; i++) { if (CW[i].s < after) continue; if (matchAt(p, i) >= Math.ceil(p.length * 0.8)) return CW[i].s; } }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);

// ── SEGUNDA PASADA: insertar FLUX (con at:) y RE-ORDENAR cada sección por tiempo de
// ancla, para que las imágenes de instrucción caigan en su micro-acción (no al final).
for (const fx of FLUX) { const s = SECTIONS.find((x) => x.key === fx.sec); if (s) s.beats.push({ t: "raw", src: fx.src, at: fx.at, w: 0.42, ...(fx.kicker ? { kicker: fx.kicker } : {}) }); }
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  // tiempo efectivo de cada beat: ancla (findMs) si la tiene; si no, su posición original
  // proporcional dentro de la sección (preserva el orden de los no-anclados).
  const n = sec.beats.length;
  const eff = sec.beats.map((b, i) => {
    if (i === 0) return sec.start;
    const ph = pinPhrase(b);
    const t = ph ? findMs(ph, sec.start + 0.3) : null;
    return t != null && t > sec.start && t < end ? t : sec.start + ((i + 0.5) / n) * (end - sec.start);
  });
  const order = sec.beats.map((b, i) => i).sort((a, b) => eff[a] - eff[b] || a - b);
  sec.beats = order.map((i) => sec.beats[i]);
}

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => { if (i === 0) return start; const ph = pinPhrase(b); if (!ph) return null; const ms = findMs(ph, start + 0.5); return ms != null && ms > start + 1 && ms < end - 1.5 ? ms : null; });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.5) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i); fixed.push(n);
  const startT = new Array(n);
  for (let fx = 0; fx < fixed.length - 1; fx++) { const a = fixed[fx], b = fixed[fx + 1]; const ta = pin[a], tb = b === n ? end : pin[b]; let sw = 0; for (let i = a; i < b; i++) sw += ws[i]; let acc = ta; for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); } }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2); const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2); const dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`; const hue = b.hue || sec.hue || HUES[(si + i) % HUES.length];
    const beat = { id, start: +cursor.toFixed(2), dur };
    if (b.t === "raw") { beat.kind = "raw"; beat.src = b.src; beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.zoom) beat.zoom = b.zoom; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = +cursor.toFixed(2); beat.dur = dur;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind === "annotated" && Array.isArray(beat.annotations)) beat.annotations = beat.annotations.map((a) => ({ kind: a.kind || "circle", ...a }));
      if (beat.kind === "journey") delete beat.accent;
      if (beat.kind !== "journey" && !beat.hue) beat.hue = hue;
    }
    beats.push(beat);
  });
}

// SWAP a clips reales (YouTube) y animados (LTX) si existen en disco
const CLIP_SWAP = {
  cz_lena_arde2: "cz_fire_wood", cz_espolvorear: "cz_spread_ash", cz_frotar_olla: "cz_scrub_pot",
  cz_limpiar_vidrio: "cz_clean_glass", cz_babosa_planta: "cz_slug", cz_ceniza_hielo: "cz_ice_melt",
  cz_gallina_polvo: "cz_hen_dust", cz_tamizar: "cz_sift_ash", cz_estufa_manana: "cz_shovel_ash",
  cz_vinagre: "cz_vinegar_fizz",
};
let swapped = 0, animated = 0;
for (const b of beats) { if (b.kind === "raw" && typeof b.src === "string" && b.src.startsWith("img/")) { const name = b.src.slice(4, -4); const clip = CLIP_SWAP[name]; if (clip && fs.existsSync(`public/broll/${clip}.mp4`)) { b.src = `broll/${clip}.mp4`; swapped++; } } }
for (const b of beats) { if (b.kind === "raw" && typeof b.src === "string" && b.src.startsWith("img/")) { const name = b.src.slice(4, -4); if (fs.existsSync(`public/vid/${name}.mp4`)) { b.src = `vid/${name}.mp4`; animated++; } } }

fs.writeFileSync("beatsheet/ceniza.json", JSON.stringify({ video: "ceniza", tutorial: true, beats }, null, 1));
const promptList = [...IMAGES.entries()].map(([name, prompt]) => ({ name, prompt }));
fs.writeFileSync("public/img/prompts_ceniza_imgs.json", JSON.stringify(promptList, null, 2));
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · imágenes: ${promptList.length} · captions: ${CW.length ? "sí" : "NO (provisional)"} · swap YT:${swapped} LTX:${animated}`);
