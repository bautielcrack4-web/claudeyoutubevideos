// cues_postres.gen.tsx — GENERADO por beatsheet.mjs desde postres.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/postres.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { SplitList } from "./scenes/SplitList";
import { StatBig } from "./scenes/StatBig";
import { JourneyCanvas } from "./scenes/JourneyCanvas";
import { FloatingInsert } from "./scenes/FloatingInsert";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { AgedDoc } from "./scenes/AgedDoc";
import { BarCompare } from "./scenes/BarCompare";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { Checklist } from "./scenes/Checklist";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { CalloutMark } from "./scenes/CalloutMark";
import { FoodTeaseCards } from "./scenes/FoodTeaseCards";

const A = COLORS.accent, B = COLORS.cold;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "intro_0", start: 0.07, dur: 8.08, kind: "teasecards", el: (d) => <FoodTeaseCards durationInFrames={d} cards={[{"src":"img/po_pasta_frola.png","label":"Pasta frola"},{"src":"img/po_flan_mixto.png","label":"Flan mixto"},{"src":"img/po_leche_asada.png","label":"Leche asada"},{"src":"img/po_pan_dulce.png","label":"Pan dulce"},{"src":"broll/po_garrapinada.mp4","label":"Garrapiñada"},{"src":"img/po_pionono.png","label":"Pionono"},{"src":"broll/po_merengues.mp4","label":"Merengues"}]} eyebrow="Algunos merecen volver…" title="¿Cuántos probaste?" /> },
  { key: "intro_1", start: 8.15, dur: 5.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_abuela_postre.mp4" hue="red" kicker="La memoria del azúcar" /> },
  { key: "intro_2", start: 13.42, dur: 3.48, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/po_almibar.mp4" side="right" hue="blue" /> },
  { key: "intro_3", start: 16.9, dur: 5.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_caramelo_cuchara.mp4" hue="amber" /> },
  { key: "intro_4", start: 22.17, dur: 5.9, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/po_abuela_almibar.png" words={parseQuote("La memoria del azúcar no se me *borra*.")} hue="red" /> },
  { key: "intro_5", start: 28.07, dur: 7.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_mesa_dulces.mp4" hue="blue" /> },
  { key: "intro_6", start: 35.45, dur: 7.03, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={20} suffix=" postres" label="que se fueron yendo despacito" eyebrow="Hoy te cuento" hue="amber" /> },
  { key: "intro_7", start: 42.48, dur: 7.73, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/po_mesa_dulces_70s.png" side="left" hue="red" /> },
  { key: "intro_8", start: 50.21, dur: 7.03, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Se"},{"t":"fueron"},{"t":"sin"},{"t":"avisar","hl":true}]} eyebrow="Y un día ya no estaban" hue="blue" bg="image" image="broll/po_navidad_mesa.mp4" /> },
  { key: "intro_9", start: 57.24, dur: 17.93, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_abuela_almibar.png" hue="amber" /> },
  { key: "s01_frola_0", start: 75.17, dur: 7.51, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="01" title="Pasta frola" hue="red" /> },
  { key: "s01_frola_1", start: 82.68, dur: 10.73, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_masa_estirar.mp4" hue="blue" /> },
  { key: "s01_frola_2", start: 93.41, dur: 18.25, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_pasta_frola.png" hue="amber" kicker="Membrillo casero" /> },
  { key: "s01_frola_3", start: 111.66, dur: 9.3, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/po_pasta_frola.png" annotations={[{"kind":"circle","x":50,"y":28,"label":"Tiritas cruzadas"},{"kind":"circle","x":50,"y":62,"label":"Membrillo casero"},{"kind":"circle","x":20,"y":78,"label":"Masa amanteca"}]} caption="La reina de los domingos" hue="red" /> },
  { key: "s01_frola_4", start: 120.96, dur: 8.59, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Pasta frola de verdad" items={[{"text":"Masa amanteca","state":"done"},{"text":"Membrillo casero","state":"done"},{"text":"Tiritas cruzadas","state":"done"},{"text":"La esquinita dorada","state":"done"}]} hue="blue" /> },
  { key: "s01_frola_5", start: 129.55, dur: 7.51, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/po_pasta_frola.png" words={parseQuote("El de ella tenía gusto a *otoño*, a paciencia.")} hue="amber" /> },
  { key: "s02_batata_0", start: 137.06, dur: 9.25, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="02" title="Dulce de batata casero" hue="blue" /> },
  { key: "s02_batata_1", start: 146.31, dur: 22.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_dulce_batata.png" hue="amber" /> },
  { key: "s02_batata_2", start: 168.77, dur: 13.21, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_queso_dulce.jpg" hue="red" kicker="Con un pedazo de queso" /> },
  { key: "s02_batata_3", start: 181.98, dur: 9.25, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/po_dulce_batata.png" words={parseQuote("Un postre de lujo con la verdura más *barata*.")} hue="blue" /> },
  { key: "s03_zapallo_0", start: 191.23, dur: 8.51, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="03" title="Zapallo en almíbar" hue="amber" /> },
  { key: "s03_zapallo_1", start: 199.74, dur: 8.91, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/po_almibar.mp4" side="right" hue="red" /> },
  { key: "s03_zapallo_2", start: 208.65, dur: 20.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_zapallo_almibar.png" hue="blue" kicker="Transparente, brillante" /> },
  { key: "s03_zapallo_3", start: 229.31, dur: 8.91, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="El secreto" items={["Zapallo duro","Almíbar espeso","Clavo de olor"]} accent={A} /> },
  { key: "s03_zapallo_4", start: 238.22, dur: 8.5, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/po_zapallo_almibar.png" words={parseQuote("Casi todo, con paciencia y azúcar, se vuelve *glorioso*.")} hue="red" /> },
  { key: "s04_lecheasada_0", start: 246.72, dur: 8.84, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="04" title="Leche asada" hue="red" /> },
  { key: "s04_lecheasada_1", start: 255.56, dur: 12.63, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_horno_postre.mp4" hue="blue" /> },
  { key: "s04_lecheasada_2", start: 268.19, dur: 21.48, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_leche_asada.png" hue="amber" kicker="La costra dorada arriba" /> },
  { key: "s04_lecheasada_3", start: 289.67, dur: 8.85, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/po_leche_asada.png" words={parseQuote("El confort hecho *postre*.")} hue="red" /> },
  { key: "s05_natillas_0", start: 298.52, dur: 7.11, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="05" title="Natillas y crema pastelera" hue="blue" /> },
  { key: "s05_natillas_1", start: 305.63, dur: 17.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_crema_revolver.mp4" hue="amber" /> },
  { key: "s05_natillas_2", start: 322.9, dur: 10.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_natillas.png" hue="red" kicker="Sin dejar de revolver" /> },
  { key: "s05_natillas_3", start: 333.06, dur: 9.82, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Yemas y azúcar","image":"broll/po_batir_huevos.mp4"},{"title":"Al fuego","image":"broll/po_crema_revolver.mp4"},{"title":"Revolver","image":"broll/po_almibar.mp4"},{"title":"Canela","image":"broll/po_canela.jpg"}]} title="Crema pastelera" hue="blue" /> },
  { key: "s05_natillas_4", start: 342.88, dur: 7.11, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/po_natillas.png" words={parseQuote("Veinte minutos frente a la olla, *solo para vos*.")} hue="amber" /> },
  { key: "s06_bizcochuelo_0", start: 349.99, dur: 7.69, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="06" title="Bizcochuelo casero" hue="amber" /> },
  { key: "s06_bizcochuelo_1", start: 357.68, dur: 18.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_batir_huevos.mp4" hue="red" kicker="Aire, paciencia y brazo" /> },
  { key: "s06_bizcochuelo_2", start: 376.35, dur: 10.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_bizcochuelo.mp4" hue="blue" /> },
  { key: "s06_bizcochuelo_3", start: 387.33, dur: 9.15, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"A mano","value":40},{"label":"De caja","value":10}]} title="Hacer un bizcochuelo" unit="min" hue="amber" /> },
  { key: "s06_bizcochuelo_4", start: 396.48, dur: 7.69, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/po_bizcochuelo.mp4" words={parseQuote("A veces se hundía en el medio. Era *nuestro*.")} hue="red" /> },
  { key: "s07_pandulce_0", start: 404.17, dur: 7.16, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="07" title="Pan dulce de Navidad" hue="red" /> },
  { key: "s07_pandulce_1", start: 411.33, dur: 7.5, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/po_manos_amasar.mp4" side="left" hue="blue" /> },
  { key: "s07_pandulce_2", start: 418.83, dur: 17.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_pan_dulce.png" hue="amber" /> },
  { key: "s07_pandulce_3", start: 436.23, dur: 10.23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_navidad_mesa.mp4" hue="red" kicker="El olor de la Navidad" /> },
  { key: "s07_pandulce_4", start: 446.46, dur: 6.82, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="«Una vez al año»" image="img/po_pan_dulce.png" caption="Amasado en diciembre, con frutas y nueces." hue="blue" /> },
  { key: "s07_pandulce_5", start: 453.28, dur: 8.2, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="La ceremonia, no el sabor" lines={[{"text":"La abuela amasando en diciembre."},{"text":"La casa oliendo a fiesta tres días antes."}]} image="img/po_pan_dulce.png" hue="amber" /> },
  { key: "s08_rosca_0", start: 461.48, dur: 9.2, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="08" title="Rosca de Pascua" hue="blue" /> },
  { key: "s08_rosca_1", start: 470.68, dur: 22.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_rosca_pascua.png" hue="amber" /> },
  { key: "s08_rosca_2", start: 493.02, dur: 9.64, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/po_crema_revolver.mp4" side="right" hue="red" /> },
  { key: "s08_rosca_3", start: 502.66, dur: 9.19, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/po_rosca_pascua.png" words={parseQuote("Comprás solo el pan. Hacerla te daba la *mañana en familia*.")} hue="blue" /> },
  { key: "s09_garrapinada_0", start: 511.85, dur: 11.59, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="09" title="Garrapiñada casera" hue="amber" /> },
  { key: "s09_garrapinada_1", start: 523.44, dur: 28.15, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_garrapinada.mp4" hue="red" kicker="Olor a caramelo hasta la vereda" /> },
  { key: "s09_garrapinada_2", start: 551.59, dur: 11.6, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/po_garrapinada.mp4" words={parseQuote("Mirar cómo nacía la golosina: química y *magia*.")} hue="blue" /> },
  { key: "s10_manzanas_0", start: 563.19, dur: 9.6, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="10" title="Manzanas acarameladas" hue="red" /> },
  { key: "s10_manzanas_1", start: 572.79, dur: 23.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_manzana_caramel.mp4" hue="blue" /> },
  { key: "s10_manzanas_2", start: 596.09, dur: 10.05, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/po_fruta_madura.mp4" side="left" hue="amber" /> },
  { key: "s10_manzanas_3", start: 606.14, dur: 9.6, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/po_manzana_caramel.mp4" words={parseQuote("Alegría desprolija. Y la desprolijidad feliz se está *perdiendo*.")} hue="red" /> },
  { key: "s11_helado_0", start: 615.74, dur: 7.97, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="11" title="Helado casero a mano" hue="blue" /> },
  { key: "s11_helado_1", start: 623.71, dur: 11.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_helado_batir.mp4" hue="amber" kicker="Batir con tenedor cada rato" /> },
  { key: "s11_helado_2", start: 635.1, dur: 19.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_helado_casero.mp4" hue="red" /> },
  { key: "s11_helado_3", start: 654.46, dur: 8.35, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Sin freezer, con paciencia" items={["Crema con yemas","A la heladera","Batir cada media hora"]} accent={B} /> },
  { key: "s11_helado_4", start: 662.81, dur: 7.98, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/po_helado_casero.mp4" words={parseQuote("El premio sabía el doble porque lo *esperabas*.")} hue="amber" /> },
  { key: "s12_marquise_0", start: 670.79, dur: 9.09, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="12" title="Postre de chocolate y galletitas" hue="amber" /> },
  { key: "s12_marquise_1", start: 679.88, dur: 22.09, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_marquise.png" hue="red" /> },
  { key: "s12_marquise_2", start: 701.97, dur: 9.53, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/po_torta_capas.mp4" side="right" hue="blue" /> },
  { key: "s12_marquise_3", start: 711.5, dur: 9.53, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Capas" items={["Galletitas en café","Crema de chocolate","A la heladera"]} accent={A} /> },
  { key: "s12_marquise_4", start: 721.03, dur: 9.09, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/po_marquise.png" words={parseQuote("Robar un poco de crema con el *dedo*.")} hue="red" /> },
  { key: "s13_pionono_0", start: 730.12, dur: 13.09, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="13" title="Pionono de dulce de leche" hue="red" /> },
  { key: "s13_pionono_1", start: 743.21, dur: 31.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_pionono.png" hue="blue" kicker="Enrollar sin que se rompa" /> },
  { key: "s13_pionono_2", start: 775.01, dur: 13.1, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/po_pionono.png" words={parseQuote("Animarse a algo que podía salir mal era parte de *cocinar*.")} hue="amber" /> },
  { key: "s14_budin_0", start: 788.11, dur: 9.59, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="14" title="Budín inglés" hue="blue" /> },
  { key: "s14_budin_1", start: 797.7, dur: 23.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_budin_ingles.mp4" hue="amber" /> },
  { key: "s14_budin_2", start: 821, dur: 13.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_nueces.jpg" hue="red" /> },
  { key: "s14_budin_3", start: 834.7, dur: 9.6, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/po_budin_ingles.mp4" words={parseQuote("Lo que cuesta trabajo dice cosas que lo comprado *no puede*.")} hue="blue" /> },
  { key: "s15_tartamanzana_0", start: 844.3, dur: 6.97, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="15" title="Tarta de manzana casera" hue="amber" /> },
  { key: "s15_tartamanzana_1", start: 851.27, dur: 9.95, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_manzanas_pelar.mp4" hue="red" kicker="Pelar charlando" /> },
  { key: "s15_tartamanzana_2", start: 861.22, dur: 16.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_tarta_manzana.mp4" hue="blue" /> },
  { key: "s15_tartamanzana_3", start: 878.14, dur: 7.3, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/po_horno_postre.mp4" side="left" hue="amber" /> },
  { key: "s15_tartamanzana_4", start: 885.44, dur: 6.96, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/po_tarta_manzana.mp4" words={parseQuote("Un postre que te obligaba a *frenar*.")} hue="red" /> },
  { key: "s16_mermeladas_0", start: 892.4, dur: 8.04, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="16" title="Mermeladas caseras" hue="red" /> },
  { key: "s16_mermeladas_1", start: 900.44, dur: 11.49, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_mermelada_hervir.mp4" hue="blue" /> },
  { key: "s16_mermeladas_2", start: 911.93, dur: 19.53, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_mermelada_frasco.mp4" hue="amber" kicker="Guardar el verano" /> },
  { key: "s16_mermeladas_3", start: 931.46, dur: 9.19, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="La despensa llena" items={[{"text":"Naranja","state":"done"},{"text":"Durazno","state":"done"},{"text":"Ciruela","state":"done"},{"text":"Hasta de tomate","state":"done"}]} hue="red" /> },
  { key: "s16_mermeladas_4", start: 940.65, dur: 8.05, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/po_mermelada_frasco.mp4" words={parseQuote("Cuando dejamos de hacer dulce, perdimos el *estar guardados*.")} hue="blue" /> },
  { key: "s17_merengues_0", start: 948.7, dur: 10.24, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="17" title="Suspiros y merengues" hue="blue" /> },
  { key: "s17_merengues_1", start: 958.94, dur: 14.63, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_claras_batir.mp4" hue="amber" /> },
  { key: "s17_merengues_2", start: 973.57, dur: 24.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_merengues.mp4" hue="red" kicker="Aprovechar las claras" /> },
  { key: "s17_merengues_3", start: 998.45, dur: 10.25, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/po_merengues.mp4" words={parseQuote("Algo tan fino, solo por el gusto de *hacerlo*.")} hue="blue" /> },
  { key: "s18_higos_0", start: 1008.7, dur: 9.71, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="18" title="Higos en almíbar" hue="amber" /> },
  { key: "s18_higos_1", start: 1018.41, dur: 10.17, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/po_higuera.mp4" side="right" hue="red" /> },
  { key: "s18_higos_2", start: 1028.58, dur: 23.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_higos_almibar.png" hue="blue" /> },
  { key: "s18_higos_3", start: 1052.16, dur: 9.72, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/po_higos_almibar.png" words={parseQuote("Perdimos la emoción de esperar que algo esté en su *época*.")} hue="amber" /> },
  { key: "s19_chantilly_0", start: 1061.88, dur: 9.17, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="19" title="Chantilly con frutillas" hue="red" /> },
  { key: "s19_chantilly_1", start: 1071.05, dur: 22.28, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_chantilly.mp4" hue="blue" /> },
  { key: "s19_chantilly_2", start: 1093.33, dur: 13.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_frutillas.jpg" hue="amber" kicker="De la huerta" /> },
  { key: "s19_chantilly_3", start: 1106.43, dur: 10.92, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Batida a mano","value":10},{"label":"Aerosol","value":3}]} title="Crema" hue="red" /> },
  { key: "s19_chantilly_4", start: 1117.35, dur: 9.18, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/po_chantilly.mp4" words={parseQuote("Cambiamos sabor por comodidad. Casi siempre *perdemos*.")} hue="blue" /> },
  { key: "s20_flanmixto_0", start: 1126.53, dur: 11.32, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="20" title="Flan mixto" hue="blue" /> },
  { key: "s20_flanmixto_1", start: 1137.85, dur: 27.49, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_flan_mixto.png" hue="amber" kicker="Dulce de leche y crema" /> },
  { key: "s20_flanmixto_2", start: 1165.34, dur: 11.86, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/po_caramelo_cuchara.mp4" side="left" hue="red" /> },
  { key: "s20_flanmixto_3", start: 1177.2, dur: 11.32, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/po_flan_mixto.png" words={parseQuote("Servir con esmero para las visitas era una forma de *cariño*.")} hue="blue" /> },
  { key: "extras_0", start: 1188.52, dur: 24.25, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_tarta_ricota.mp4" hue="amber" kicker="Torta de ricota" /> },
  { key: "extras_1", start: 1212.77, dur: 41.22, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_crema_quemada.png" hue="red" kicker="Crema quemada" /> },
  { key: "extras_2", start: 1253.99, dur: 17.78, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/po_torta_negra.png" side="right" hue="blue" /> },
  { key: "extras_3", start: 1271.77, dur: 24.25, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_compota.mp4" hue="amber" kicker="Compota: rescate de la fruta" /> },
  { key: "extras_4", start: 1296.02, dur: 41.22, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_banana_dulce.mp4" hue="red" /> },
  { key: "extras_5", start: 1337.24, dur: 17.79, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Lo que casi nadie nombra ya" items={["Torta de ricota","Crema quemada","Torta negra","Compota"]} accent={B} /> },
  { key: "cierre_0", start: 1355.03, dur: 9.91, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/po_mesa_dulces.mp4" words={parseQuote("No se perdieron porque fueran malos. Se perdió el *gesto*.")} hue="red" /> },
  { key: "cierre_1", start: 1364.94, dur: 24.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/po_ninos_postre.mp4" hue="blue" /> },
  { key: "cierre_2", start: 1389.02, dur: 22.66, kind: "journey", el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="Este domingo" title="Elegí uno y hacelo" waypoints={[{"x":0,"y":0,"z":0,"image":"img/po_leche_asada.png","label":"Una leche asada","num":"1","dwell":2.6,"travel":1.6},{"x":1.2,"y":-0.4,"z":0.3,"image":"img/po_dulce_batata.png","label":"Un dulce de batata","num":"2","dwell":2.6,"travel":1.6},{"x":2.4,"y":0.3,"z":-0.2,"image":"broll/po_merengues.mp4","label":"Unos merengues","num":"3","dwell":2.6,"travel":1.6},{"x":3.6,"y":-0.2,"z":0.2,"image":"broll/po_mesa_dulces.mp4","label":"Y compartilo","num":"4","dwell":3,"travel":1.4}]} /> },
  { key: "cierre_3", start: 1411.68, dur: 11.33, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Quedate en la cadena" lines={[{"text":"Ya te conté las meriendas de antes."},{"text":"Pronto, los domingos y la cocina de antes."}]} hue="red" /> },
  { key: "cierre_4", start: 1423.01, dur: 24.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/po_abuela_almibar.png" hue="blue" /> },
  { key: "cierre_5", start: 1447.09, dur: 9.91, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/po_mesa_dulces_70s.png" words={parseQuote("Guardale la esquinita más dorada al que más *quieras*.")} hue="amber" /> },
];

export const REFRAME: { start: number; end: number }[] = [];
