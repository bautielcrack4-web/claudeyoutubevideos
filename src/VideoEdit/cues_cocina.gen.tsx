// cues_cocina.gen.tsx — GENERADO por beatsheet.mjs desde cocina.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/cocina.json
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

const D = COLORS.danger, A = COLORS.accent;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "intro_0", start: 0.15, dur: 7.5, kind: "teasecards", el: (d) => <FoodTeaseCards durationInFrames={d} cards={[{"src":"broll/co_huerta.mp4","label":"La huerta"},{"src":"broll/co_gallinero.mp4","label":"El gallinero"},{"src":"img/co_ai_almacen.png","label":"El almacén"},{"src":"broll/co_leche_botella.mp4","label":"El lechero"},{"src":"broll/co_pan_amasar.mp4","label":"El pan amasado"},{"src":"broll/co_cocina_lena.mp4","label":"La cocina a leña"}]} eyebrow="Antes de los supermercados" title="¿Te acordás de esta cocina?" /> },
  { key: "intro_1", start: 7.65, dur: 5.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_mercado_viejo.mp4" hue="red" kicker="Cómo era la vida antes" /> },
  { key: "intro_2", start: 12.76, dur: 3.38, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/co_abuela_cocina.mp4" side="right" hue="blue" /> },
  { key: "intro_3", start: 16.14, dur: 5.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_huerta.mp4" hue="amber" /> },
  { key: "intro_4", start: 21.25, dur: 5.73, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/co_ai_almacen.png" words={parseQuote("Teníamos mucho menos, pero en muchas cosas vivíamos *mejor*.")} hue="red" /> },
  { key: "intro_5", start: 26.98, dur: 6.82, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={0} suffix=" plástico" label="todo a granel, en tus frascos" eyebrow="El almacén de antes" hue="blue" /> },
  { key: "intro_6", start: 33.8, dur: 7.5, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/co_ai_almacen.png" side="left" hue="amber" /> },
  { key: "intro_7", start: 41.3, dur: 6.82, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Menos"},{"t":"cosas,"},{"t":"más"},{"t":"sentido","hl":true}]} eyebrow="Todo está conectado" hue="red" bg="image" image="broll/co_huerta.mp4" /> },
  { key: "intro_8", start: 48.12, dur: 17.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_abuela_cocina.mp4" hue="blue" /> },
  { key: "s01_huerta_0", start: 65.51, dur: 6.37, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="01" title="La huerta" hue="red" /> },
  { key: "s01_huerta_1", start: 71.88, dur: 9.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_huerta.mp4" hue="blue" /> },
  { key: "s01_huerta_2", start: 80.98, dur: 15.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_tomate_planta.mp4" hue="amber" kicker="Tibio del sol" /> },
  { key: "s01_huerta_3", start: 96.44, dur: 6.67, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/co_lechuga.mp4" side="right" hue="red" /> },
  { key: "s01_huerta_4", start: 103.11, dur: 9.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_canasta_verdura.mp4" hue="blue" /> },
  { key: "s01_huerta_5", start: 112.21, dur: 7.88, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="broll/co_tomate_planta.mp4" annotations={[{"kind":"circle","x":55,"y":40,"label":"Tomate de la planta"},{"kind":"circle","x":30,"y":70,"label":"Tibio del sol"}]} caption="Del fondo de la casa al plato" hue="amber" /> },
  { key: "s01_huerta_6", start: 120.09, dur: 6.37, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/co_tomate_planta.mp4" words={parseQuote("El tomate del súper es lindo pero no sabe a *nada*.")} hue="red" /> },
  { key: "s02_gallinero_0", start: 126.46, dur: 7.16, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="02" title="El gallinero" hue="blue" /> },
  { key: "s02_gallinero_1", start: 133.62, dur: 10.23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_gallinero.mp4" hue="amber" /> },
  { key: "s02_gallinero_2", start: 143.85, dur: 17.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_huevos_juntar.mp4" hue="red" /> },
  { key: "s02_gallinero_3", start: 161.23, dur: 10.23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_huevo_yema.mp4" hue="blue" kicker="Yema naranja, fuerte" /> },
  { key: "s02_gallinero_4", start: 171.46, dur: 7.5, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/co_ai_huerta_gallinas.png" side="left" hue="amber" /> },
  { key: "s02_gallinero_5", start: 178.96, dur: 7.15, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/co_huevo_yema.mp4" words={parseQuote("Comíamos sabiendo el *costo* de las cosas.")} hue="red" /> },
  { key: "s03_almacen_0", start: 186.11, dur: 7.4, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="03" title="El almacén de la esquina" hue="amber" /> },
  { key: "s03_almacen_1", start: 193.51, dur: 17.97, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/co_ai_almacen.png" hue="red" /> },
  { key: "s03_almacen_2", start: 211.48, dur: 7.75, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/co_balanza.mp4" side="right" hue="blue" /> },
  { key: "s03_almacen_3", start: 219.23, dur: 10.57, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_granel.mp4" hue="amber" kicker="Al peso, a granel" /> },
  { key: "s03_almacen_4", start: 229.8, dur: 7.05, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="«Fiado»" image="img/co_ai_almacen.png" caption="El almacenero te conocía y te anotaba en el cuaderno." hue="red" /> },
  { key: "s03_almacen_5", start: 236.85, dur: 7.75, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Lo que perdimos" items={["El almacenero que te conocía","El fiado a fin de mes","Comprar sin envoltorios"]} accent={D} cross /> },
  { key: "s03_almacen_6", start: 244.6, dur: 7.4, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/co_ai_almacen.png" words={parseQuote("Cambiamos el trato humano por la góndola anónima y la *basura*.")} hue="amber" /> },
  { key: "s04_reparto_0", start: 252, dur: 6.77, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="04" title="El lechero, el panadero, el verdulero" hue="red" /> },
  { key: "s04_reparto_1", start: 258.77, dur: 16.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/co_ai_lechero.png" hue="blue" /> },
  { key: "s04_reparto_2", start: 275.22, dur: 9.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_leche_botella.mp4" hue="amber" kicker="Vidrio que se devolvía" /> },
  { key: "s04_reparto_3", start: 284.9, dur: 7.1, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/co_pan_reparto.mp4" side="left" hue="red" /> },
  { key: "s04_reparto_4", start: 292, dur: 9.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_verduleria.mp4" hue="blue" /> },
  { key: "s04_reparto_5", start: 301.68, dur: 6.76, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/co_leche_botella.mp4" words={parseQuote("La comida llegaba de la mano de un vecino, no de un camión *sin cara*.")} hue="amber" /> },
  { key: "s05_fiambrera_0", start: 308.44, dur: 7.35, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="05" title="La fiambrera y la heladera de hielo" hue="blue" /> },
  { key: "s05_fiambrera_1", start: 315.79, dur: 17.86, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_fiambrera.mp4" hue="amber" /> },
  { key: "s05_fiambrera_2", start: 333.65, dur: 10.51, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_hielo_barra.jpg" hue="red" /> },
  { key: "s05_fiambrera_3", start: 344.16, dur: 7.7, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/co_ai_heladera_hielo.png" side="right" hue="blue" /> },
  { key: "s05_fiambrera_4", start: 351.86, dur: 8.75, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Sin freezer","value":1},{"label":"Hoy","value":9}]} title="Comida que se desperdicia" hue="amber" /> },
  { key: "s05_fiambrera_5", start: 360.61, dur: 7.36, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/co_fiambrera.mp4" words={parseQuote("Vivíamos con lo justo, y no se tiraba *nada*.")} hue="red" /> },
  { key: "s06_conservar_0", start: 367.97, dur: 6.73, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="06" title="Conservar sin heladera" hue="amber" /> },
  { key: "s06_conservar_1", start: 374.7, dur: 9.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_salar_carne.mp4" hue="red" /> },
  { key: "s06_conservar_2", start: 384.32, dur: 16.35, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_embutidos.mp4" hue="blue" /> },
  { key: "s06_conservar_3", start: 400.67, dur: 9.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_escabeche.jpg" hue="amber" kicker="En vinagre, en escabeche" /> },
  { key: "s06_conservar_4", start: 410.29, dur: 7.05, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/co_ai_despensa_frascos.png" side="left" hue="red" /> },
  { key: "s06_conservar_5", start: 417.34, dur: 7.69, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="El arte de conservar" items={[{"text":"Frutas en almíbar","state":"done"},{"text":"Carne salada y al sol","state":"done"},{"text":"Embutidos caseros","state":"done"},{"text":"En grasa, en vinagre","state":"done"}]} hue="blue" /> },
  { key: "s06_conservar_6", start: 425.03, dur: 6.73, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/co_despensa.mp4" words={parseQuote("Perdimos la independencia de alimentarnos sin depender de un *enchufe*.")} hue="amber" /> },
  { key: "s07_pan_0", start: 431.76, dur: 8.32, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="07" title="El pan amasado en casa" hue="red" /> },
  { key: "s07_pan_1", start: 440.08, dur: 20.22, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_pan_amasar.mp4" hue="blue" kicker="Harina, agua, sal y las manos" /> },
  { key: "s07_pan_2", start: 460.3, dur: 11.89, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_pan_horno.mp4" hue="amber" /> },
  { key: "s07_pan_3", start: 472.19, dur: 11.5, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Mezclar","image":"broll/co_pan_amasar.mp4"},{"title":"Levar","image":"broll/co_despensa.mp4"},{"title":"Al horno","image":"broll/co_pan_horno.mp4"},{"title":"El duro → budín","image":"broll/co_sobras.mp4"}]} title="Pan amasado en casa" hue="red" /> },
  { key: "s07_pan_4", start: 483.69, dur: 8.32, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/co_pan_amasar.mp4" words={parseQuote("El pan de verdad dura un día. Con el duro hacíamos el *budín*.")} hue="blue" /> },
  { key: "s08_animal_0", start: 492.01, dur: 10.09, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="08" title="El animal, de la nariz a la cola" hue="blue" /> },
  { key: "s08_animal_1", start: 502.1, dur: 24.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_caldo.mp4" hue="amber" kicker="Los huesos, caldo" /> },
  { key: "s08_animal_2", start: 526.6, dur: 10.57, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/co_embutidos.mp4" side="right" hue="red" /> },
  { key: "s08_animal_3", start: 537.17, dur: 10.57, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="No se tiraba nada del animal" items={["Huesos para el caldo","Grasa para cocinar","Achuras, morcilla"]} accent={A} /> },
  { key: "s08_animal_4", start: 547.74, dur: 10.08, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/co_caldo.mp4" words={parseQuote("Comer se volvió algo sin *conciencia*.")} hue="amber" /> },
  { key: "s09_estacion_0", start: 557.82, dur: 9.59, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="09" title="Las frutas y verduras de estación" hue="amber" /> },
  { key: "s09_estacion_1", start: 567.41, dur: 23.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_verduras_temporada.mp4" hue="red" /> },
  { key: "s09_estacion_2", start: 590.71, dur: 13.71, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_duraznos.mp4" hue="blue" kicker="Los duraznos en verano" /> },
  { key: "s09_estacion_3", start: 604.42, dur: 13.71, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_mandarinas.jpg" hue="amber" /> },
  { key: "s09_estacion_4", start: 618.13, dur: 9.59, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/co_duraznos.mp4" words={parseQuote("Cuando todo está siempre, nada es *especial*.")} hue="red" /> },
  { key: "s10_notirar_0", start: 627.72, dur: 14.63, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="10" title="No se tiraba nada" hue="red" /> },
  { key: "s10_notirar_1", start: 642.35, dur: 20.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_sobras.mp4" hue="blue" /> },
  { key: "s10_notirar_2", start: 663.25, dur: 35.53, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_croquetas.mp4" hue="amber" kicker="Las sobras, croquetas" /> },
  { key: "s10_notirar_3", start: 698.78, dur: 16.72, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="El arte de transformar" items={[{"text":"Pan duro → budín","state":"done"},{"text":"Puchero → croquetas","state":"done"},{"text":"Huesos → caldo","state":"done"},{"text":"Fruta pasada → dulce","state":"done"}]} hue="red" /> },
  { key: "s10_notirar_4", start: 715.5, dur: 14.63, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/co_sobras.mp4" words={parseQuote("Nosotros, que teníamos tan poco, valorábamos cada *miga*.")} hue="blue" /> },
  { key: "extras_0", start: 730.13, dur: 30.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_cocina_lena.mp4" hue="blue" kicker="El centro de la casa" /> },
  { key: "extras_1", start: 760.85, dur: 13.25, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/co_olla_fuego.mp4" side="left" hue="amber" /> },
  { key: "extras_2", start: 774.1, dur: 18.07, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_leche_tambo.mp4" hue="red" kicker="La leche del tambo" /> },
  { key: "extras_3", start: 792.17, dur: 18.07, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_nata.mp4" hue="blue" /> },
  { key: "extras_4", start: 810.24, dur: 15.06, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Antes: sano = barato","value":10},{"label":"Hoy: sano = caro","value":3}]} title="Lo barato y lo sano" hue="amber" /> },
  { key: "extras_5", start: 825.3, dur: 12.65, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/co_cocina_lena.mp4" words={parseQuote("El pobre comía sano porque lo sano era lo *barato*.")} hue="red" /> },
  { key: "cierre_0", start: 837.95, dur: 13.92, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Todo"},{"t":"es"},{"t":"la"},{"t":"misma"},{"t":"historia","hl":true}]} eyebrow="¿Te das cuenta?" hue="amber" bg="image" image="broll/co_huerta.mp4" /> },
  { key: "cierre_1", start: 851.87, dur: 20.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_supermercado.mp4" hue="red" kicker="Lleno de todo y tan vacío" /> },
  { key: "cierre_2", start: 872.75, dur: 33.41, kind: "journey", el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="Rescatá lo bueno" title="Con tus propias manos" waypoints={[{"x":0,"y":0,"z":0,"image":"broll/co_tomate_planta.mp4","label":"Plantá un tomate","num":"1","dwell":2.6,"travel":1.6},{"x":1.2,"y":-0.4,"z":0.3,"image":"broll/co_pan_amasar.mp4","label":"Amasá un pan","num":"2","dwell":2.6,"travel":1.6},{"x":2.4,"y":0.3,"z":-0.2,"image":"broll/co_despensa.mp4","label":"Hacé un dulce","num":"3","dwell":2.6,"travel":1.6},{"x":3.6,"y":-0.2,"z":0.2,"image":"broll/co_abuela_cocina.mp4","label":"Cociná para alguien","num":"4","dwell":3,"travel":1.4}]} /> },
  { key: "cierre_3", start: 906.16, dur: 16.71, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Andá al principio de la cadena" lines={[{"text":"Las meriendas, los postres, los domingos."},{"text":"Es toda la misma historia."}]} hue="amber" /> },
  { key: "cierre_4", start: 922.87, dur: 35.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/co_abuela_cocina.mp4" hue="red" /> },
  { key: "cierre_5", start: 958.37, dur: 14.63, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/co_huerta.mp4" words={parseQuote("Comé algo hecho en casa, por favor. Hacelo *por mí*.")} hue="blue" /> },
];

export const REFRAME: { start: number; end: number }[] = [];
