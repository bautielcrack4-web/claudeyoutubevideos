// gen_jabon.mjs — beatsheet/jabon.json para "Nunca Más Compres Jabón" (Constructor
// Libre v4, FACELESS, voz clonada de Tomás).
// ★ v2: CADA imagen es un gpt-image-2 ÚNICO, específico al momento narrado, SIN
// repetir (feedback usuario: el stock genérico "se ve horrible"). Prompt corto-
// imperfecto en español = máximo realismo. Diagramas dg_* ya generados. Anclaje
// POR FRASE a captions (sync exacto). Modo TUTORIAL (raw <=65%).
import fs from "fs";

// ── registro de imágenes gpt-image-2 (name -> prompt) ────────────────────────
const IMAGES = new Map();
const P = (s) =>
  `Foto documental muy realista, formato horizontal apaisado 16:9. ${s} Que parezca una foto casera real sacada con el celular: leve desenfoque en algunas zonas, encuadre un poco torcido, luz despareja y natural, texturas reales, manos naturales, fondo algo desordenado, pequeñas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental auténtico de casa de campo con madera vieja, saturación baja, colores suaves y apagados. Negative prompt: foto de estudio limpia, producto perfecto, brillante, cinematográfico, CGI, render 3D, ilustración, cartoon, texto legible, logo, marca de agua, cara perfecta simétrica, dedos de más, manos deformadas.`;
const IM = (name, subject) => { if (!IMAGES.has(name)) IMAGES.set(name, P(subject)); return `img/${name}.png`; };
const DG = (name) => `img/${name}.png`; // diagrama ya generado

const HUES = ["amber", "red", "blue"];
const r = (src, o = {}) => ({ t: "raw", src, ...o });
const dgb = (src, o = {}) => ({ t: "raw", src, zoom: [1.0, 1.05], hold: true, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const f = (src, o = {}) => ({ t: "float", src, side: fSide++ % 2 ? "left" : "right", ...o });

const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.05, stat: 1.0, aged: 1.2,
  checklist: 1.25, splitlist: 1.1, bars: 1.25, process: 1.5, journey: 2.4, infzoom: 1.3,
  annotated: 1.35, callout: 1.05, chips: 1.0 };

// ── SECCIONES ────────────────────────────────────────────────────────────────
const SECTIONS = [
  // 0 — HOOK (0–70)
  { key: "intro", start: 0.1, hue: "amber", beats: [
    c("impact", { image: IM("jb_barra_mano", "Primer plano de una barra de jabón artesanal color crema, rústica, irregular, sostenida en la palma de un hombre mayor de campo, fondo de cocina de madera."), setup: "Esta barra no la compré en ningún lado", impact: "Y NO VAS A CREER DE QUÉ ESTÁ HECHA", impactAccent: "danger", hitAt: 1.3 }),
    r(IM("jb_jabon_mano2", "Otra barra de jabón casero rústica girando en la mano de un hombre de campo, contraluz de ventana, primer plano."), { kicker: "No la compré en ningún lado", w: 0.6 }),
    r(IM("jb_jabon_tabla", "Varias barras de jabón casero cortadas a mano, desparejas, apoyadas sobre una tabla de madera gastada junto a un poco de ceniza."), { w: 0.5 }),
    f(IM("jb_ceniza_fogon", "Ceniza gris y fría en el fondo de un fogón de leña apagado, con algunos carbones, luz suave de mañana."), { kicker: "Ceniza del fogón", w: 0.5 }),
    r(IM("jb_grasa_sarten", "Grasa animal amarillenta cuajada y endurecida en una sartén de hierro vieja sobre una mesada de madera rústica."), { kicker: "Grasa que iba a la basura", w: 0.5 }),
    c("quote", { image: IM("jb_lavar_manos", "Manos de hombre lavándose con una barra de jabón casero bajo un chorro de agua, espuma blanca, pileta de campo."), text: "Más suave con su piel que los jabones de colores del *supermercado*." }),
    r(IM("jb_espuma_macro", "Primer plano de espuma blanca cremosa de jabón sobre la piel mojada, burbujas, gotas de agua."), { hold: true }),
    r(IM("jb_lavar_ropa", "Una mujer de campo lavando ropa a mano en un fuentón de chapa con una barra de jabón, mucha espuma, patio rústico."), { w: 0.6 }),
    c("quote", { image: IM("jb_monedas", "Monedas y unos billetes gastados sobre una mesa de madera, luz tenue de cocina vieja."), text: "No es solo que sea barato. Es que *dura* años." }),
    r(IM("jb_gondola", "Góndola de supermercado llena de jabones de colores con envoltorios brillantes, luz fluorescente fría."), { kicker: "Mes a mes, toda la vida", hold: true }),
    c("headline", { tokens: ["Nunca", "más", "compres", { t: "jabón" }], eyebrow: "Lo que tu bisabuela sabía", bg: "image", image: IM("jb_pila_curado", "Una pila ordenada de barras de jabón casero curándose sobre un estante de madera, en una despensa rústica.") }),
  ]},
  // 1 — TOMÁS (70–133.6)
  { key: "tomas", start: 70.12, hue: "blue", beats: [
    r(IM("jb_casa_campo", "Una casa de madera hecha a mano en el campo patagónico, humo saliendo de la chimenea, atardecer, paisaje agreste."), { kicker: "Hace veinte años dejé la ciudad", hold: true }),
    r(IM("jb_cocina_lena", "Cocina rústica de campo con una cocina a leña de hierro encendida, ollas viejas, leña apilada, luz cálida."), { w: 0.6 }),
    c("quote", { image: IM("jb_manos_viejas", "Las manos curtidas y arrugadas de un hombre de campo descansando sobre la mesa de madera."), text: "La primera tanda me salió mal, se lo confieso. Y la segunda *también*." }),
    r(IM("jb_jabon_feo", "Una barra de jabón casero mal hecha, blanda y grasosa, deforme, sobre un trapo, fracaso de un primer intento."), { w: 0.6 }),
    c("aged", { heading: "Lo que le voy a enseñar", lines: ["Sacar la lejía de la ceniza.", "Limpiar la grasa.", "Cocinar, cortar y curar el jabón."], image: IM("jb_pasos_mesa", "Sobre una mesa de madera: un balde con ceniza, un frasco con grasa y unas barras de jabón, todo junto, luz natural.") }),
    f(IM("jb_barra_sol", "Una barra de jabón artesanal a contraluz junto a una ventana de campo, polvo flotando en la luz."), { kicker: "Una cosa menos que comprar" }),
    c("stat", { value: 20, suffix: " años", label: "haciendo mi propio jabón", eyebrow: "Sin comprar una barra" }),
    r(IM("jb_hombre_campo", "Un hombre mayor de espaldas caminando por un sendero de campo hacia su casa de madera, mañana con neblina."), { hold: true }),
  ]},
  // 2 — QUÉ ES EL JABÓN (133.6–189)
  { key: "quees", start: 133.62, hue: "amber", beats: [
    c("headline", { tokens: ["¿Qué", "es", "el", { t: "jabón" }, "?"], eyebrow: "Entendé esto y nunca le temés", bg: "image", image: IM("jb_barra_corte", "Una barra de jabón casero partida al medio mostrando su interior parejo color crema, sobre tabla de madera.") }),
    r(IM("jb_grasa_cuchara", "Una cucharada de grasa blanca animal sobre una cuchara de madera, primer plano, cocina rústica."), { kicker: "Una grasa", w: 0.55 }),
    r(IM("jb_ceniza_mano", "Un puñado de ceniza gris fina cayendo entre los dedos de una mano sobre un balde, luz lateral."), { kicker: "Un álcali", w: 0.55 }),
    c("quote", { image: IM("jb_olla_mezcla", "Una olla de hierro al fuego con una mezcla espesa y cremosa, una cuchara de madera revolviendo, vapor."), text: "Es lo que pasa cuando uno junta una grasa con un *álcali* fuerte." }),
    dgb(DG("dg_saponificacion"), { kicker: "Saponificación", w: 1.4 }),
    c("splitlist", { title: "El jabón sale de dos cosas", items: ["Una grasa", "Un álcali (lejía)"], palette: "A" }),
    c("quote", { image: IM("jb_fuego_noche", "Fuego de leña ardiendo en un fogón de noche, llamas naranjas, ambiente antiguo."), text: "No hay magia. Es química vieja, de hace cinco *mil* años." }),
    c("stat", { value: 5000, suffix: " años", label: "limpiándose así", eyebrow: "La humanidad", accent: "amber" }),
  ]},
  // 3 — DOS MITADES / ÁLCALI DE LA CENIZA (189–264.9)
  { key: "dos", start: 189.11, hue: "blue", beats: [
    dgb(DG("dg_dos_mitades"), { kicker: "Dos mitades que se unen" }),
    c("quote", { image: IM("jb_fogon_brasas", "Brasas y ceniza en el fondo de un fogón de leña, primer plano, todavía algo de calor, tonos grises y naranjas."), text: "El álcali salió de un solo lugar, gratis: del fondo del *fogón*." }),
    r(IM("jb_lena_arde", "Troncos de madera dura ardiendo en una estufa a leña, llamas vivas, chispas."), { hold: true }),
    r(IM("jb_ceniza_balde", "Un balde de metal lleno de ceniza gris de madera guardada, en un galpón de campo."), { kicker: "La ceniza guarda el álcali" }),
    c("chips", { bg: "image", image: IM("jb_roble_lena", "Leña de roble y fresno apilada y partida junto a un hacha clavada en un tronco, patio de campo."), title: "La mejor ceniza", chips: ["madera dura", "roble, fresno", "frutales"], hue: "amber" }),
    c("splitlist", { title: "Ceniza que SÍ y que NO", items: ["Madera limpia natural", "Nunca pintada ni tratada", "Nunca carbón con químicos"], palette: "D", cross: true }),
    c("quote", { image: IM("jb_ceniza_fina", "Primer plano de ceniza de madera muy fina y limpia, gris clara, tamizada, textura aterciopelada."), text: "Madera limpia, ceniza limpia. Eso es *ley*." }),
  ]},
  // 4 — SACAR LA LEJÍA (264.9–324.8)
  { key: "lejia", start: 264.9, hue: "amber", beats: [
    c("headline", { tokens: ["Sacar", "la", { t: "lejía" }], eyebrow: "El agua fuerte de los antiguos", bg: "image", image: IM("jb_barril_ceniza", "Un barril de madera viejo lleno de ceniza con un agujero abajo, montado para sacar lejía, en un patio de campo.") }),
    r(IM("jb_balde_paja", "Un balde con una capa de paja seca en el fondo y ceniza encima, preparado para filtrar agua, cocina rústica."), { kicker: "Un balde o un barril", w: 0.6 }),
    dgb(DG("dg_lixiviado"), { kicker: "Cómo gotea la lejía" }),
    r(IM("jb_verter_agua", "Una mano vertiendo agua de un jarro de metal sobre un balde lleno de ceniza, gotas, luz natural."), { kicker: "Agua de lluvia tibia", hold: true }),
    r(IM("jb_lejia_gotea", "Un líquido oscuro amarronado goteando por debajo de un barril de ceniza hacia un frasco de vidrio, primer plano."), { kicker: "Sale oscura y resbalosa", hold: true, w: 1.5 }),
    c("process", { title: "Sacar la lejía", steps: [
      { title: "Paja en el fondo", image: IM("jb_paja_fondo", "Una capa de paja seca y pasto en el fondo de un balde de madera, primer plano cenital.") },
      { title: "Ceniza encima", image: IM("jb_ceniza_encima", "Ceniza gris llenando un balde sobre la paja, vista desde arriba, textura.") },
      { title: "Echar agua", image: IM("jb_echar_agua", "Agua cayendo sobre la ceniza de un balde y empapándola, burbujeo gris.") },
      { title: "Gotea la lejía", image: IM("jb_gota_lejia", "Una gota de líquido marrón oscuro colgando del fondo de un barril, a punto de caer en un frasco.") },
    ]}),
    c("quote", { image: IM("jb_lejia_frasco", "Un frasco de vidrio con un líquido oscuro y aceitoso, la lejía, sobre una mesa de madera, luz lateral."), text: "Ese líquido jabonoso entre los dedos, *es* la lejía." }),
  ]},
  // 5 — LA PRUEBA + ADVERTENCIA (324.8–419)
  { key: "prueba", start: 324.83, hue: "blue", beats: [
    c("headline", { tokens: ["¿Está", "en", "su", { t: "punto" }, "?"], eyebrow: "Sin instrumentos, como los viejos", bg: "image", image: IM("jb_huevo_lejia", "Un huevo crudo flotando en un frasco con líquido turbio oscuro, asomando apenas, prueba casera, cocina rústica.") }),
    r(IM("jb_huevo_mano", "Una mano sosteniendo un huevo fresco sobre un frasco con lejía, a punto de soltarlo, luz de ventana."), { kicker: "La prueba del huevo", hold: true }),
    dgb(DG("dg_huevo"), { kicker: "Floja, en punto o fuerte" }),
    c("quote", { image: IM("jb_huevo_flota", "Primer plano de un huevo flotando en lejía asomando un círculo del tamaño de una moneda en la superficie."), text: "El huevo flota y asoma un pedacito del tamaño de una *moneda*." }),
    r(IM("jb_pluma_lejia", "Una pluma de gallina blanca metida en un frasco de líquido oscuro, empezando a deshacerse, primer plano."), { kicker: "La pluma se empieza a deshacer" }),
    c("annotated", { image: IM("jb_guantes_lejia", "Un hombre con guantes de goma y gafas manipulando un balde de lejía en una mesa de campo, con cuidado."), caption: "La lejía quema: respeto, no pánico", annotations: [
      { x: 30, y: 45, label: "Guantes" },
      { x: 66, y: 35, label: "Proteja los ojos" },
      { x: 50, y: 78, label: "Lugar ventilado" },
    ]}),
    c("quote", { image: IM("jb_cuchillo_filo", "Un cuchillo viejo de campo bien afilado y un fósforo encendido sobre una mesa de madera, metáfora de herramienta peligrosa."), text: "No le tenga pánico. Téngale *respeto*. Como al fuego." }),
    r(IM("jb_balde_tapado", "Un balde con lejía tapado con una tabla, guardado en un rincón ventilado lejos del alcance, galpón de campo."), { w: 0.6 }),
  ]},
  // 6 — INJERTO 1 (419–455)
  { key: "injerto1", start: 419, hue: "amber", beats: [
    c("aged", { heading: "Uno de 35 sistemas", lines: ["Las proporciones exactas, las pasadas de ceniza,", "cómo concentrar una lejía floja…", "todo medido y probado en mi cocina."], image: IM("jb_cuaderno", "Un cuaderno viejo manuscrito con anotaciones y dibujos a mano sobre jabón, sobre una mesa de madera con un lápiz.") }),
    f(IM("jb_manual_jabon", "Un libro casero artesanal abierto mostrando láminas dibujadas a mano del proceso del jabón, papel envejecido."), { kicker: "Todo junto en el manual" }),
    r(IM("jb_estante_frascos", "Un estante de madera con frascos de lejía, ceniza y barras de jabón ordenadas, despensa de campo."), { w: 0.7 }),
    c("quote", { image: IM("jb_olla_humea", "Una olla de hierro humeando sobre la cocina a leña, lista para empezar a hacer jabón, cocina rústica."), text: "Ahora viene la grasa, y no le voy a esconder ni un solo *paso*." }),
  ]},
  // 7 — LA GRASA (455–545)
  { key: "grasa", start: 455, hue: "red", beats: [
    c("headline", { tokens: ["La", "otra", "mitad", ":", { t: "grasa" }], eyebrow: "Lo que también se tira", bg: "image", image: IM("jb_sebo_bowl", "Un bowl de cerámica con grasa animal blanca cruda, sebo, sobre una mesada de campo, primer plano.") }),
    r(IM("jb_recortar_grasa", "Manos recortando con un cuchillo la grasa blanca de un trozo de carne sobre una tabla de madera."), { kicker: "Grasa que le saca a la carne", w: 0.6 }),
    r(IM("jb_manteca_cerdo", "Un frasco de manteca de cerdo blanca casera sobre una mesa de madera, cocina rústica, luz cálida."), { hold: true }),
    c("chips", { bg: "image", image: IM("jb_grasas_varias", "Sobre una mesa de madera: un trozo de sebo, un frasco de manteca de cerdo y una botella de aceite, varias grasas juntas."), title: "Cualquier grasa sirve", chips: ["sebo de vaca", "manteca de cerdo", "o aceite vegetal"], hue: "red" }),
    r(IM("jb_grasa_derrite", "Grasa blanca derritiéndose en una olla con agua sobre el fuego, volviéndose líquida y dorada, vapor."), { kicker: "Se derrite en agua", hold: true }),
    c("process", { title: "Limpiar la grasa", steps: [
      { title: "Grasa + agua al fuego", image: IM("jb_grasa_agua", "Una olla con grasa y agua hirviendo suavemente sobre la cocina a leña, vista cenital.") },
      { title: "Enfriar toda la noche", image: IM("jb_olla_reposa", "Una olla tapada reposando sobre una mesada fría de noche, cocina rústica en penumbra.") },
      { title: "Sube y se solidifica", image: IM("jb_capa_grasa", "Una capa blanca y dura de grasa solidificada flotando sobre agua sucia en una olla, vista cenital.") },
      { title: "Raspar lo sucio", image: IM("jb_raspar_grasa", "Un cuchillo raspando la parte de abajo de una tapa de grasa blanca limpia, primer plano.") },
    ]}),
    r(IM("jb_grasa_limpia", "Un trozo de grasa blanca pura y limpia, lista para hacer jabón, sobre un plato de loza viejo."), { w: 0.7 }),
    c("quote", { image: IM("jb_grasa_brillo", "Primer plano de grasa blanca limpia y brillante en una olla, textura suave, luz natural."), text: "La grasa más limpia da el jabón más blanco y más *suave*." }),
  ]},
  // 8 — COCCIÓN / EL PUNTO (545–643)
  { key: "coccion", start: 545, hue: "amber", beats: [
    c("quote", { image: IM("jb_olla_revolver", "Una olla grande de hierro sobre el fuego con una mezcla cremosa de jabón, una cuchara larga de madera revolviendo, vapor."), text: "Esta es la parte donde se hace el jabón de *verdad*." }),
    r(IM("jb_grasa_tibia", "Grasa derretida tibia y dorada en una olla a fuego suave, lista para recibir la lejía, cocina a leña."), { kicker: "Grasa tibia, no hirviendo", w: 0.6 }),
    r(IM("jb_verter_lejia", "Un hilo fino de lejía oscura cayendo despacio dentro de una olla de grasa mientras una mano revuelve, vapor."), { kicker: "La lejía de a poco, revolviendo", hold: true, w: 1.4 }),
    dgb(DG("dg_proceso"), { kicker: "Los cuatro pasos" }),
    r(IM("jb_mezcla_espesa", "La mezcla de jabón poniéndose espesa y cremosa como natilla en la olla, primer plano, color crema."), { kicker: "Se pone cremosa, espesa" }),
    c("annotated", { image: IM("jb_rastro_cuchara", "Una cuchara de madera dejando caer un hilo de mezcla de jabón espesa sobre la superficie, dejando una marca, primer plano."), caption: "La prueba del rastro", annotations: [
      { x: 50, y: 45, label: "La gota deja una marca" },
      { x: 50, y: 78, label: "= llegó al punto" },
    ]}),
    c("checklist", { title: "Si quiere, al final", items: ["Un puñado de sal: más dura", "Aromas: lavanda, romero", "Avena: más suave"] }),
    r(IM("jb_lavanda_sal", "Sobre una mesa de madera: un puñado de sal gruesa, ramas de lavanda seca y avena en cuencos pequeños."), { w: 0.5 }),
    r(IM("jb_romero_mano", "Una mano dejando caer hojas de romero y lavanda en una olla de jabón cremoso, primer plano."), { w: 0.5 }),
    c("quote", { image: IM("jb_brazo_revuelve", "El brazo de un hombre mayor revolviendo con esfuerzo una olla pesada de jabón sobre el fuego, gesto de paciencia."), text: "El mismo movimiento del brazo que hicieron millones de manos antes que la *suya*." }),
  ]},
  // 9 — MOLDE Y CURADO (643–716)
  { key: "curar", start: 643.1, hue: "blue", beats: [
    r(IM("jb_verter_molde", "Vertiendo la pasta espesa de jabón crema dentro de una caja de madera forrada con un trapo, primer plano."), { kicker: "Verter en moldes", hold: true }),
    r(IM("jb_cortar_barras", "Cortando un bloque de jabón endurecido en barras con un cuchillo o un alambre, sobre una tabla de madera."), { kicker: "Cortar en barras" }),
    r(IM("jb_barras_frescas", "Barras de jabón recién cortadas, todavía blandas y húmedas, alineadas sobre un paño."), { w: 0.6 }),
    c("bars", { title: "Tiempo de curado", unit: "semanas", bars: [{ label: "Mínimo", value: 4 }, { label: "Ideal", value: 8 }] }),
    c("quote", { image: IM("jb_curado_estante", "Barras de jabón curándose separadas sobre un estante de madera en una despensa aireada, luz suave de ventana."), text: "El jabón curado, viejo, es el *mejor* jabón." }),
    r(IM("jb_secar_aire", "Barras de jabón paradas y separadas secándose al aire sobre rejillas de madera, despensa rústica."), { kicker: "Secar al aire, separadas" }),
    c("quote", { image: IM("jb_jabon_viejo", "Una barra de jabón casero curada hace meses, dura y pareja, sobre un plato de loza antiguo."), text: "La prisa es la enemiga del *buen* jabón." }),
  ]},
  // 10 — INJERTO 2 anti-corporación (716–780)
  { key: "injerto2", start: 716, hue: "red", beats: [
    c("headline", { tokens: ["¿Por", "qué", "nadie", "te", "lo", { t: "enseñó" }, "?"], eyebrow: "La parte incómoda", bg: "image", image: IM("jb_gondola2", "Góndola de supermercado con decenas de jabones empaquetados de colores, etiquetas brillantes, luz fría artificial.") }),
    r(IM("jb_jabon_marca", "Un jabón industrial de marca en su envoltorio plástico brillante sobre una góndola, contraste con lo casero."), { kicker: "Un producto con marca y publicidad", hold: true }),
    c("quote", { image: IM("jb_caja_registr", "Una caja registradora vieja y unas manos pagando con billetes en un almacén, luz tenue."), text: "Con algo gratis que sale de la ceniza, nadie gana *dinero*." }),
    c("bars", { title: "Lo que entrega gota a gota", unit: "", bars: [{ label: "Jabón casero", value: 1 }, { label: "Toda una vida comprando", value: 12 }] }),
    c("quote", { image: IM("jb_abuela_ensena", "Una abuela mostrándole a una nieta cómo hacer algo en una cocina antigua, transmisión de un saber, luz cálida."), text: "Alcanza con que deje de enseñarse una sola *generación*." }),
    r(IM("jb_manos_jabon_viejo", "Manos viejas y manos jóvenes sosteniendo juntas una barra de jabón casero, transmisión entre generaciones."), { w: 0.6 }),
    c("aged", { heading: "Por eso junté todo", lines: ["Treinta y cinco sistemas, ordenados y probados.", "Para devolverle el saber que le sacaron."], image: IM("jb_cuaderno2", "Un cuaderno grueso manuscrito lleno de recetas y dibujos caseros, abierto sobre una mesa con una taza de mate.") }),
  ]},
  // 11 — PREGUNTAS (780–855)
  { key: "preguntas", start: 780.34, hue: "amber", beats: [
    c("splitlist", { title: "¿Y si es peligroso por la lejía?", items: ["Empiece por el jabón", "Después saque su lejía", "Vaya a su ritmo"], palette: "G" }),
    r(IM("jb_principiante", "Una persona haciendo su primera tanda de jabón con cuidado en una cocina de campo, gesto de aprender."), { w: 0.6 }),
    c("quote", { image: IM("jb_tanda_fallida", "Una bandeja con un intento de jabón que salió mal, blando y disparejo, junto a uno bien hecho, comparación."), text: "Le va a salir mal alguna vez, y no pasa nada. Cada error le *enseña*." }),
    r(IM("jb_jabon_usos", "Una barra de jabón casero junto a ropa, platos y una palangana, mostrando sus usos, cocina rústica."), { w: 0.6 }),
    c("chips", { bg: "image", image: IM("jb_jabon_rallado", "Jabón casero rallado en escamas dentro de un frasco para lavar la ropa, sobre una mesada de madera."), title: "Una sola receta sirve para", chips: ["manos y cuerpo", "lavar la ropa", "los platos", "la casa"], hue: "blue" }),
    c("quote", { image: IM("jb_lavar_platos", "Manos lavando platos de loza con jabón casero y espuma en una pileta de campo, agua corriendo."), text: "Una sola receta le resuelve la limpieza entera de su *hogar*." }),
    r(IM("jb_platos_secan", "Platos y ollas limpios secándose en una rejilla junto a una ventana de cocina rústica, luz natural."), { w: 0.6 }),
    r(IM("jb_ropa_tendida", "Ropa limpia colgada en una soga al sol en un patio de campo, sábanas blancas al viento."), { hold: true }),
  ]},
  // 12 — PANORAMA (855–907.5)
  { key: "panorama", start: 855, hue: "blue", beats: [
    c("quote", { image: IM("jb_pan_casero", "Un pan casero recién horneado, frascos de conserva y un jabón sobre una mesa de campo, saberes caseros juntos."), text: "El jabón, el pan, conservar la comida… dejamos de *enseñarlas*." }),
    r(IM("jb_mujer_amasa", "Una mujer mayor amasando pan en una cocina antigua de campo, harina, luz cálida de ventana."), { hold: true }),
    c("splitlist", { title: "No tenés que hacer todo", items: ["Tené la opción", "Sepé hacerlo", "No dependas de nadie"], palette: "A" }),
    r(IM("jb_despensa_llena", "Una despensa de campo llena de frascos, jabones y provisiones caseras en estantes de madera."), { w: 0.6 }),
    c("quote", { image: IM("jb_hombre_ventana", "Un hombre mayor mirando tranquilo por la ventana de su casa de madera al campo, taza en la mano, paz."), text: "Esa tranquilidad de saber que podría hacerlo… no la compra el *dinero*." }),
    r(IM("jb_campo_atardecer", "Un campo abierto al atardecer con una casa de madera a lo lejos y humo de chimenea, sensación de libertad."), { hold: true }),
  ]},
  // 13 — ACCIÓN (907.5–958)
  { key: "accion", start: 907.53, hue: "amber", beats: [
    c("checklist", { title: "Este fin de semana", items: ["Junte grasa de cocinar", "Guarde ceniza de madera limpia", "Guantes y algo para los ojos", "Una tanda chica, sin apuro"] }),
    r(IM("jb_frasco_grasa", "Un frasco de vidrio juntando grasa de cocina guardada en una heladera vieja, etiqueta a mano."), { w: 0.5 }),
    r(IM("jb_juntar_ceniza", "Una persona juntando con una pala chica la ceniza fría de un asado dentro de un tacho de metal."), { w: 0.5 }),
    r(IM("jb_guantes_mesa", "Unos guantes de goma y unas gafas de protección sobre una mesa de madera junto a un balde, listos para usar."), { w: 0.5 }),
    c("journey", { eyebrow: "Su primera barra", title: "Paso a paso, sin miedo", accent: "accent", waypoints: [
      { x: 0, y: 0, z: 0, image: IM("jb_jrn_ceniza", "Ceniza gris fina en un balde de metal, primer plano, luz de mañana en un patio de campo."), label: "Ceniza", num: "1", dwell: 2.4, travel: 1.5 },
      { x: 1.2, y: -0.3, z: 0.3, image: IM("jb_jrn_lejia", "Lejía oscura goteando en un frasco bajo un barril de ceniza, primer plano."), label: "Lejía", num: "2", dwell: 2.4, travel: 1.5 },
      { x: 2.4, y: 0.2, z: -0.2, image: IM("jb_jrn_cocina", "Una olla de jabón cremoso revolviéndose sobre el fuego, cuchara de madera, vapor."), label: "Cocinar", num: "3", dwell: 2.4, travel: 1.5 },
      { x: 3.6, y: -0.2, z: 0.2, image: IM("jb_jrn_curar", "Barras de jabón curándose en un estante de madera en una despensa aireada."), label: "Curar", num: "4", dwell: 2.6, travel: 1.4 },
    ]}),
    c("quote", { image: IM("jb_primera_barra", "Un hombre sosteniendo orgulloso su primera barra de jabón hecha a mano, sonrisa apenas visible, cocina rústica."), text: "Es una sensación que no se *compra*." }),
  ]},
  // 14 — INJERTO 3 CTA (958–1013.7)
  { key: "injerto3", start: 958, hue: "red", beats: [
    c("aged", { heading: "Todo en el manual", lines: ["Proporciones, tiempos de curado,", "jabón de ropa y jabón de bebé,", "y cómo arreglar una tanda que salió mal."], image: IM("jb_manual_abierto", "Un manual casero abierto con láminas dibujadas a mano del proceso del jabón, papel envejecido, sobre madera.") }),
    r(IM("jb_jabones_surtido", "Un surtido de jabones caseros de distintos colores naturales y tamaños sobre un paño de lino, despensa rústica."), { hold: true }),
    c("bars", { title: "El precio de hoy", unit: "", bars: [{ label: "Por separado", value: 158 }, { label: "Hoy", value: 27 }] }),
    c("quote", { image: IM("jb_jabon_regalo", "Una barra de jabón casero envuelta en papel madera atada con hilo, como un regalo simple, sobre madera."), text: "Si no es para usted, le devuelvo cada centavo. Todo el riesgo lo pongo *yo*." }),
    f(IM("jb_pocas_copias", "Unas pocas barras de jabón casero quedando en un estante casi vacío, sensación de últimas unidades."), { kicker: "Quedan pocas copias" }),
  ]},
  // 15 — CIERRE + PRÓXIMO (1013.7–1070.5)
  { key: "cierre", start: 1013.75, hue: "blue", beats: [
    c("quote", { image: IM("jb_abuela_jabon", "Una abuela de campo haciendo jabón en una olla sobre el fuego en una foto de aire antiguo, recuerdo familiar."), text: "Cuénteme si su abuela lo hacía. Esas historias me *encantan*." }),
    r(IM("jb_manos_arrugadas", "Las manos arrugadas de una anciana sosteniendo una barra de jabón casero, ternura, luz cálida."), { w: 0.6 }),
    c("headline", { tokens: ["No", "tire", "más", "la", { t: "ceniza" }], eyebrow: "La próxima vez", bg: "image", image: IM("jb_ceniza_tacho", "Un tacho lleno de ceniza de madera a punto de ser tirado, con la mano dudando, patio de campo.") }),
    r(IM("jb_ceniza_huerta", "Ceniza esparciéndose como fertilizante alrededor de plantas en una huerta de campo, manos trabajando."), { kicker: "Fertilizante, limpieza, plagas", hold: true }),
    c("quote", { image: IM("jb_oficio_manos", "Las manos de un hombre de campo trabajando la madera y el jabón, oficio, dignidad, luz de taller."), text: "No es magia. Es *oficio*. Y todavía se puede aprender." }),
    r(IM("jb_barra_final", "Una barra de jabón casero sobre el borde de una ventana de madera con el campo de fondo desenfocado, cierre tranquilo."), { hold: true, w: 1.8 }),
  ]},
];

const VIDEO_END = 1070.52;

// ── ANCLAJE POR FRASE (sync fino) ─────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_jabon.json", "utf8"));
const CW = (CAPS.words || CAPS).map((x) => ({ t: x.text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(), s: (x.startMs || 0) / 1000 }));
const normTok = (phrase) => phrase.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
const matchAt = (p, i) => { let ok = 0; for (let j = 0; j < p.length; j++) if (CW[i + j] && CW[i + j].t === p[j]) ok++; return ok; };
const findMs = (phrase, after) => {
  const full = normTok(phrase);
  for (const len of [6, 5, 4, 3]) {
    const p = full.slice(0, len);
    if (p.length < 3) continue;
    for (let i = 0; i < CW.length - p.length; i++) {
      if (CW[i].s < after) continue;
      if (matchAt(p, i) >= Math.ceil(p.length * 0.8)) return CW[i].s;
    }
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b);
    if (!ph) return null;
    const ms = findMs(ph, start + 0.5);
    return ms != null && ms > start + 1 && ms < end - 1.5 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.5) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i);
  fixed.push(n);
  const startT = new Array(n);
  for (let fx = 0; fx < fixed.length - 1; fx++) {
    const a = fixed[fx], b = fixed[fx + 1];
    const ta = pin[a], tb = b === n ? end : pin[b];
    let sw = 0; for (let i = a; i < b; i++) sw += ws[i];
    let acc = ta;
    for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); }
  }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    const dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const hue = b.hue || sec.hue || HUES[(si + i) % HUES.length];
    const beat = { id, start: +cursor.toFixed(2), dur };
    if (b.t === "raw") { beat.kind = "raw"; beat.src = b.src; beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.zoom) beat.zoom = b.zoom; }
    else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = +cursor.toFixed(2); beat.dur = dur;
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
// ── SWAP a CLIPS REALES de YouTube en beats de ACCIÓN (movimiento real) ───────
// Solo en beats raw (RawShot es video-aware). Si el clip no se descargó, queda la
// imagen gpt-image-2 como respaldo (no rompe el render).
const CLIP_SWAP = {
  jb_barra_mano: "jb_soap_bar_hand", jb_grasa_sarten: "jb_lard_fat",
  jb_espuma_macro: "jb_soap_lather", jb_lavar_ropa: "jb_wash_laundry",
  jb_gondola: "jb_supermarket_soap", jb_cocina_lena: "jb_old_kitchen",
  jb_lena_arde: "jb_fire_wood", jb_ceniza_balde: "jb_ash_bucket",
  jb_verter_agua: "jb_pour_water", jb_lejia_gotea: "jb_lye_leach",
  jb_pluma_lejia: "jb_feather", jb_recortar_grasa: "jb_fat_trim",
  jb_grasa_derrite: "jb_melt_fat", jb_lavanda_sal: "jb_salt_add",
  jb_romero_mano: "jb_lavender", jb_verter_molde: "jb_soap_pour",
  jb_cortar_barras: "jb_soap_cut", jb_secar_aire: "jb_soap_cure",
  jb_jabones_surtido: "jb_soap_stack", jb_huevo_mano: "jb_egg_float",
  jb_grasa_tibia: "jb_melt_fat", jb_juntar_ceniza: "jb_ash_bucket",
  jb_platos_secan: "jb_wash_dishes", jb_ceniza_huerta: "jb_rain_barrel",
};
let swapped = 0;
for (const b of beats) {
  if (b.kind === "raw" && typeof b.src === "string" && b.src.startsWith("img/")) {
    const name = b.src.slice(4, -4);
    const clip = CLIP_SWAP[name];
    if (clip && fs.existsSync(`public/broll/${clip}.mp4`)) { b.src = `broll/${clip}.mp4`; swapped++; }
  }
}
// SWAP a clips ANIMADOS (LTX img2video): si una imagen fija tiene su versión animada
// en vid/<name>.mp4, usar el clip animado (movimiento real, no Ken-Burns).
let animated = 0;
for (const b of beats) {
  if (b.kind === "raw" && typeof b.src === "string" && b.src.startsWith("img/")) {
    const name = b.src.slice(4, -4);
    if (fs.existsSync(`public/vid/${name}.mp4`)) { b.src = `vid/${name}.mp4`; animated++; }
  }
}
console.log(`swap YouTube: ${swapped} · animadas LTX: ${animated}`);

fs.writeFileSync("beatsheet/jabon.json", JSON.stringify({ video: "jabon", tutorial: true, beats }, null, 1));

// ── prompts gpt-image-2 (todas las imágenes generadas, sin stock) ────────────
const promptList = [...IMAGES.entries()].map(([name, prompt]) => ({ name, prompt }));
fs.writeFileSync("public/img/prompts_jabon_imgs.json", JSON.stringify(promptList, null, 2));

const raw = beats.filter((b) => b.kind === "raw").length;
const kinds = new Set(beats.map((b) => b.kind));
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · tipos: ${[...kinds].join(",")}`);
console.log(`imágenes gpt-image-2 únicas: ${promptList.length}`);
console.log(`dur total: ${(beats[beats.length - 1].start + beats[beats.length - 1].dur).toFixed(0)}s`);
