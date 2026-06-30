// gen_castores_imgs.mjs — emite la lista de imágenes IA (diagramas, mapas, retratos, fondos
// de headline/quote/aged, miniaturas de timeline) que NO son clips reales. Mismas envolturas
// de estilo que gen_castores.mjs. → public/img/prompts_castores_ai.json (para gen_images.mjs).
import fs from "fs";
const P = (s) => `Foto documental real, 16:9 horizontal apaisado. ${s} Como un fotograma de un documental viejo de naturaleza: con imperfecciones, luz natural despareja, saturación baja, nada pulido, sin apariencia de IA.`;
const DP = (s) => `Infografía horizontal, relación de aspecto EXACTA 16:9 (1792x1024). Ilustración hecha a mano profesional, limpia, editorial, tipo lámina de historia natural antigua. ${s} Fondo marfil claro con textura de papel sutil, líneas marrón oscuro, acentos verde oliva y celeste agua apagado, papel envejecido. Minimalista, muy clara, se entiende en un segundo. Textos en español, breves.`;
const MP = (s) => `Mapa ilustrado vintage, estilo cartografía de atlas antiguo, 16:9 horizontal apaisado. ${s} Papel de mapa envejecido color crema, líneas de tinta marrón, relieve y ríos suaves, una pequeña rosa de los vientos, hermoso y detallado, sin texto ilegible.`;

const L = [
  // diagramas
  { name: "dg_caja", prompt: DP("Diagrama en 3 pasos de la caja de madera paracaidista de Elmo Heter: 1) cerrada mientras cae con el paracaídas, 2) toca el suelo, 3) las dos mitades se abren solas y el castor sale caminando. Flechas claras entre pasos. Título arriba: La caja que se abre sola.") },
  { name: "dg_napa", prompt: DP("Diagrama de corte transversal de una represa de castor: el agua se frena detrás de la represa, se acumula formando una laguna, y se filtra hacia abajo recargando la napa subterránea; el suelo alrededor actúa como una esponja. Flechas de agua bajando hacia la tierra. Título: El agua que se queda.") },
  // mapas
  { name: "ca_map_us", prompt: MP("Mapa de los Estados Unidos continentales completo, con los límites de los estados marcados sutilmente y el estado de Idaho, en el noroeste, resaltado suavemente.") },
  { name: "ca_map_idaho", prompt: MP("Mapa del estado de Idaho con sus montañas y bosques salvajes del centro, ríos serpenteantes y relieve, sin pueblos.") },
  // retrato / bespoke
  { name: "ca_elmo", prompt: P("Retrato de un funcionario de caza y pesca de los años cuarenta, un hombre con sombrero de ala y campera de trabajo, mirada decidida, de pie al aire libre. Fotografía en blanco y negro envejecida, grano de época.") },
  { name: "ca_mula_caja", prompt: P("Una mula cargando una pesada caja de madera por un sendero empinado de montaña boscosa, un arriero al lado, años cuarenta, luz dura de verano.") },
  // fondos de headline (van detrás de texto, composición con aire)
  { name: "ca_castor_plaga", prompt: P("Un castor junto al borde de un campo agrícola inundado al atardecer, agua desbordada sobre los cultivos, tono melancólico.") },
  { name: "ca_paracaidas_cielo", prompt: P("Un cielo enorme y despejado con un único paracaídas blanco descendiendo a lo lejos, visto desde el suelo, contraluz suave.") },
  { name: "ca_castor_construir", prompt: P("Un castor arrastrando una rama gruesa hacia el agua para su represa, al atardecer, reflejos dorados en el agua.") },
  { name: "ca_castor_ingeniero", prompt: P("Un castor parado sobre su represa de ramas con un amplio humedal verde lleno de vida detrás, luz dorada del atardecer.") },
  { name: "ca_castor_solucion", prompt: P("Un castor sobre su represa rodeado de agua verde y viva, vegetación exuberante, sensación de oasis.") },
  // fondos de quote
  { name: "ca_sombreros", prompt: P("Una hilera de sombreros de fieltro antiguos del siglo diecinueve exhibidos en una vitrina de madera, luz cálida tenue de museo.") },
  { name: "ca_rogando", prompt: P("Dos personas con botas de agua construyendo a mano una pequeña represa de palos y ramas en un arroyo casi seco, restauración ecológica, luz de día nublado.") },
  { name: "ca_castor_agua2", prompt: P("Primer plano de un castor nadando en agua dorada al atardecer, su cabeza y el reflejo, gotas en el pelaje.") },
  // miniaturas de la timeline (cuadradas, sujeto centrado)
  { name: "ca_pieles_t", prompt: P("Una pila de pieles de castor apiladas, época del comercio de pieles, tono sepia envejecido."), size: "1024x1024" },
  { name: "ca_avion_t", prompt: P("Un avión de hélice de los años cuarenta volando bajo sobre un bosque de montaña."), size: "1024x1024" },
  { name: "ca_humedal_t", prompt: P("Un humedal verde y brillante con lagunas en cadena visto desde arriba."), size: "1024x1024" },
  { name: "ca_restaura_t", prompt: P("Un castor siendo liberado de una jaula hacia un arroyo, manos de un voluntario al costado."), size: "1024x1024" },
];

fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_castores_ai.json", JSON.stringify(L, null, 2));
console.log(`prompts_castores_ai.json: ${L.length} imágenes IA`);
