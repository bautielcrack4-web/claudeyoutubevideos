// imgdiag_federer3.mjs — 20 diagramas explicativos (Video 3 OJOS) para Flow/Nano Banana.
// Estilo CLÍNICO LIMPIO (NO casual): infografía médica, texto en español legible, símbolos.
// El avatar SALE de pantalla cuando aparecen → usan TODO el cuadro (sin esquina reservada).
import fs from "fs";
const D = "Infografía médica educativa horizontal, relación 16:9. Estilo lámina científica limpia y premium: fondo blanco o gris muy claro, líneas azul-petróleo oscuro, acentos en verde-agua/teal y un toque de coral. Ilustración de trazo fino, MUY clara, se entiende en 1 segundo, mucho espacio en blanco, pocos bloques grandes. Textos en español, breves y bien legibles. Puede incluir flechas, íconos y etiquetas. Estética de infografía de salud moderna y confiable, nada escolar ni recargado. Sin marcas de agua.";
const g = (name, desc) => ({ name, prompt: `${D} Contenido: ${desc}` });
const DIAG = [
  g("dg_fe3_retina_oxigeno", "mostrar que la RETINA es uno de los tejidos que MÁS oxígeno consume del cuerpo; una silueta de ojo con la retina marcada y un ícono grande de oxígeno, comparándola con otros órganos. Etiqueta: 'La retina consume muchísimo oxígeno'."),
  g("dg_fe3_capilares_retina", "los CAPILARES de la retina, vasos finos como un cabello que llevan sangre y oxígeno al fondo del ojo. Un corte del ojo con la red de capilares finos señalada. Etiqueta: 'Microvasos de la retina'."),
  g("dg_fe3_dia_vs_noche", "comparación de la circulación del ojo de DÍA (presión normal, buen flujo) vs de NOCHE (presión baja, flujo más lento y delicado). Dos paneles lado a lado, un sol y una luna. Etiquetas: 'De día' y 'De noche'."),
  g("dg_fe3_taller_nocturno", "el ojo como un 'taller de reparación nocturno': durante el sueño profundo la retina renueva células, limpia desechos y regenera pigmentos. Un ojo con íconos de reparación/engranajes y una luna. Etiqueta: 'Reparación durante el sueño'."),
  g("dg_fe3_hipoxia", "HIPOXIA de la retina: cuando de noche no le llega suficiente oxígeno, las células receptoras de luz se degradan. Un ojo con la retina apagándose y una flecha de oxígeno bajando. Etiqueta: 'Retina sin oxígeno = vista borrosa'."),
  g("dg_fe3_oxido_nitrico", "el ÓXIDO NÍTRICO relaja y ensancha los capilares para que pase más sangre; comparar un capilar cerrado (poca sangre) con uno abierto (más oxígeno a la retina). Etiquetas: 'Sin óxido nítrico' y 'Con óxido nítrico'."),
  g("dg_fe3_dipper", "dos curvas de PRESIÓN ARTERIAL durante la noche: una que BAJA sana ('los que bajan') y otra que se queda ALTA ('los que no bajan'). Un gráfico simple de línea con el eje de la noche. Etiquetas claras."),
  g("dg_fe3_sangre_espesa", "por deshidratación la sangre se vuelve ESPESA y circula peor por los capilares finos; comparar sangre fluida vs sangre espesa pasando por un vaso finito. Etiqueta: 'Poca agua = sangre espesa'."),
  g("dg_fe3_cafeina_tiempo", "línea de tiempo de un día: un café a las 5 de la tarde y la cafeína que sigue en la sangre 5-6 horas, llegando a la noche y rompiendo el sueño profundo. Reloj, taza y cama. Etiqueta: 'La cafeína dura 5-6 h'."),
  g("dg_fe3_fases_sueno", "las FASES del sueño en una noche y marcar en cuál (el sueño profundo) se repara el ojo. Un gráfico de ondas de sueño con la fase profunda resaltada. Etiqueta: 'Acá se reparan los ojos'."),
  g("dg_fe3_luz_azul", "la LUZ AZUL de la pantalla frena la melatonina y por eso se retrasa el sueño profundo. Un celular emitiendo luz azul hacia un cerebro/ojo y la melatonina cayendo. Etiqueta: 'Luz azul frena la melatonina'."),
  g("dg_fe3_melatonina_antiox", "la MELATONINA además es un antioxidante que de noche protege el ojo; un ojo con un escudo y moléculas de melatonina. Etiqueta: 'Melatonina = escudo antioxidante del ojo'."),
  g("dg_fe3_presion_ocular", "dormir boca abajo aumenta la PRESIÓN dentro del ojo durante horas (factor de glaucoma). Una cabeza apoyada en la almohada con una flecha de presión sobre el ojo. Etiqueta: 'Presión ocular alta de noche'."),
  g("dg_fe3_tension_capilares", "la TENSIÓN ALTA nocturna castiga los capilares finos de la retina noche tras noche, endureciendo sus paredes. Un capilar sano vs uno dañado por presión. Etiqueta: 'Tensión alta = capilares dañados'."),
  g("dg_fe3_fondo_ojo", "el FONDO DE OJO es la única parte de la circulación que un médico puede ver a simple vista; un médico con la lucecita mirando el ojo y lo que ve (red de vasos). Etiqueta: 'La circulación que se puede ver'."),
  g("dg_fe3_luteina_macula", "la LUTEÍNA y la ZEAXANTINA se depositan en la MÁCULA (centro de la retina) y forman un filtro natural, como un anteojo de sol interno. Un ojo con la mácula marcada y un filtro amarillo. Etiquetas de los dos nutrientes."),
  g("dg_fe3_calcio_bloquea", "el CALCIO de los lácteos BLOQUEA la absorción de la luteína y la zeaxantina (hasta 30%). Un plato de fruta buena con una flecha de nutriente frenada por un vaso de leche. Etiqueta: 'Lácteos bloquean la absorción'."),
  g("dg_fe3_grasa_absorcion", "los nutrientes del ojo son SOLUBLES EN GRASA: con una grasa buena (nuez, palta, aceite) se absorben mucho mejor. Una fruta + una nuez y una flecha de absorción que sube. Etiqueta: 'Con grasa buena = más absorción'."),
  g("dg_fe3_glicacion", "la GLICACIÓN: el exceso de azúcar en sangre se pega a las proteínas del cristalino como caramelo y lo va opacando (catarata). Un cristalino claro que se vuelve opaco por el azúcar. Etiqueta: 'Azúcar pegada = cristalino opaco'."),
  g("dg_fe3_protocolo_noche", "resumen del PROTOCOLO DE LA NOCHE para los ojos en 5 pasos con íconos: cena liviana, último vaso de agua, frutos rojos con nuez, pantallas apagadas, caminata después de cenar. Lista numerada clara. Título: 'Tu rutina de la noche'."),
];
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_federer3_diag.json", JSON.stringify(DIAG, null, 2));
let out = "";
out += "════════════════════════════════════════════════════════════\n";
out += " PEGALE ESTO AL AGENTE DE FLOW **PRIMERO** (para los DIAGRAMAS):\n";
out += "════════════════════════════════════════════════════════════\n\n";
out += "Hola. Te voy a pasar prompts de DIAGRAMAS / INFOGRAFÍAS médicas (NO fotos). Reglas:\n\n";
out += "1) GENERÁ DE A 3 POR VEZ y ESPERÁ a que las 3 terminen antes de las siguientes 3. Nunca más de 3 juntas (si no se bloquea la cuenta).\n\n";
out += "2) ESTILO: infografía médica LIMPIA y profesional, prolija, fácil de leer. Fondo claro, colores azul-petróleo y verde-agua/teal. Con TEXTO en español bien legible, flechas, íconos y etiquetas (esto es lo bueno de vos: los textos y símbolos te salen perfectos). Que se entienda en 1 segundo. NADA de foto realista acá: son ilustraciones/infografías.\n\n";
out += "3) Formato horizontal 16:9. Usá TODO el cuadro. Sin marcas de agua.\n\n";
out += "Confirmame que entendiste (sobre todo lo de generar de a 3 y esperar) y te paso los prompts de a tandas.\n\n";
out += "════════════════════════════════════════════════════════════\n";
out += " LOS " + DIAG.length + " DIAGRAMAS (de a 3, esperando que terminen):\n";
out += "════════════════════════════════════════════════════════════\n\n";
DIAG.forEach((x, i) => { out += `#${String(i + 1).padStart(2, "0")} · ${x.name}\n${x.prompt}\n\n`; });
fs.writeFileSync("prompts_federer3_diagramas.txt", out);
console.log(`diagramas: ${DIAG.length} · prompts_federer3_diag.json + prompts_federer3_diagramas.txt`);
