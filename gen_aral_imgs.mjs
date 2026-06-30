// gen_aral_imgs.mjs — imágenes IA del Mar de Aral (diagramas, mapas, fondos, miniaturas timeline).
import fs from "fs";
const P = (s) => `Foto documental real, 16:9 horizontal apaisado. ${s} Imperfecciones, luz natural despareja, saturación baja, nada pulido, sin apariencia de IA.`;
const DP = (s) => `Infografía horizontal 16:9 (1792x1024). Ilustración hecha a mano profesional, limpia, editorial, tipo lámina de atlas. ${s} Fondo marfil claro con textura de papel, líneas marrón oscuro, acentos celeste agua y terracota apagado. Minimalista, muy clara. Textos en español, breves.`;
const MP = (s) => `Mapa ilustrado vintage, atlas antiguo, 16:9 horizontal. ${s} Papel crema envejecido, líneas de tinta marrón, relieve y ríos, rosa de los vientos, hermoso, sin texto ilegible.`;
const L = [
  { name: "dg_diversion", prompt: DP("Dos ríos (Amu Daria y Sir Daria) que iban a un mar son desviados por canales hacia campos de algodón; el mar, sin agua, se encoge. Flechas del agua robada. Título: El agua robada al mar.") },
  { name: "dg_tapon", prompt: DP("El agua de un río entra al mar del NORTE pero se escurre al SUR y se pierde; una represa-muro separa norte de sur y atrapa el agua en el norte. Título: Poner el tapón.") },
  { name: "ar_map_shrink", prompt: MP("Mapa del Mar de Aral entre Kazajistán y Uzbekistán mostrando su contorno azul; estilo atlas antiguo.") },
  { name: "ar_map_world", prompt: MP("Mapa de Asia Central con la ubicación del Mar de Aral entre Kazajistán y Uzbekistán resaltada.") },
  { name: "ar_h_aral", prompt: P("Un mar interior azul visto desde la orilla con montañas lejanas, atardecer suave.") },
  { name: "ar_h_arterias", prompt: P("Un río cruzando un desierto hacia un mar lejano, vista aérea.") },
  { name: "ar_h_cotton", prompt: P("Campos de algodón blanco en el desierto bajo sol fuerte, hileras hasta el horizonte.") },
  { name: "ar_h_docs", prompt: P("Documentos y planos soviéticos antiguos sobre un escritorio de madera, blanco y negro envejecido.") },
  { name: "ar_h_moynaq", prompt: P("Una hilera de barcos pesqueros oxidados varados sobre la arena del desierto, cielo gris.") },
  { name: "ar_h_aralkum", prompt: P("Un desierto de sal blanca y polvo donde antes había un mar, viento levantando polvo.") },
  { name: "ar_h_dam", prompt: P("Una larga represa de tierra atravesando el agua de un mar, vista aérea.") },
  { name: "ar_h_fish", prompt: P("Peces nadando en agua azul clara de un lago, luz filtrada.") },
  { name: "ar_h_choice", prompt: P("Una vista dividida: desierto seco agrietado de un lado, agua azul del otro.") },
  { name: "ar_t_full", prompt: P("Un mar interior azul enorme con barcos pesqueros, vista aérea."), size: "1024x1024" },
  { name: "ar_t_cotton", prompt: P("Canales de riego desviando agua hacia campos de algodón en el desierto."), size: "1024x1024" },
  { name: "ar_t_dry", prompt: P("Un fondo marino seco y agrietado con un barco oxidado varado."), size: "1024x1024" },
  { name: "ar_t_dam", prompt: P("Una represa de tierra atravesando el agua, vista aérea."), size: "1024x1024" },
  { name: "ar_t_water", prompt: P("Agua azul volviendo a una costa con un pequeño barco de pesca."), size: "1024x1024" },
];
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_aral_ai.json", JSON.stringify(L, null, 2));
console.log(`prompts_aral_ai.json: ${L.length} imágenes IA`);
