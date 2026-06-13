// cues_barrera.gen.tsx — GENERADO por beatsheet.mjs desde barrera.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/barrera.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { ChipsCluster } from "./scenes/ReframeContent";
import { SplitList } from "./scenes/SplitList";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { StatBig } from "./scenes/StatBig";
import { JourneyCanvas } from "./scenes/JourneyCanvas";
import { FloatingInsert } from "./scenes/FloatingInsert";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { BarCompare } from "./scenes/BarCompare";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { Checklist } from "./scenes/Checklist";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { CalloutMark } from "./scenes/CalloutMark";
import { HalfShot } from "./scenes/HalfShot";
import { CostTally } from "./scenes/CostTally";

const D = COLORS.danger, G = COLORS.good;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hook_1", start: 6.93, dur: 13.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_dos_lechugas.png" hue="red" kicker="Misma tierra, mismo sol" /> },
  { key: "hook_2", start: 19.98, dur: 7.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_lechuga_comida.png" hue="blue" /> },
  { key: "hook_3", start: 27.65, dur: 7.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_lechuga_sana.png" hue="amber" /> },
  { key: "hook_4", start: 35.33, dur: 7.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_anillo_metales.png" hue="red" kicker="Un anillo de $5" /> },
  { key: "hook_5", start: 43, dur: 7.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_babosa_rastro.png" hue="blue" /> },
  { key: "hook_6", start: 50.68, dur: 7.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/bgv_babosa_retira.mp4" hue="amber" kicker="Se da media vuelta" /> },
  { key: "hook_7", start: 58.35, dur: 7.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_perro_huerta.png" hue="red" /> },
  { key: "hook_8", start: 66.03, dur: 7.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_abeja_flor.png" hue="blue" /> },
  { key: "ident_0", start: 73.7, dur: 23.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_tomas_huerta.png" hue="red" kicker="Tomás" /> },
  { key: "ident_1", start: 97, dur: 9.59, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/bg_manos_tierra.png" words={parseQuote("No soy agrónomo. Soy un *hombre que prueba cosas*.")} hue="blue" /> },
  { key: "ident_2", start: 106.59, dur: 13.71, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_tomas_incomoda.png" hue="amber" kicker="La parte que te va a dar bronca" /> },
  { key: "promesa_0", start: 120.3, dur: 4.34, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={5} prefix="US$ " label="lo que cuesta proteger tu huerta" eyebrow="Te lo prometo" hue="blue" /> },
  { key: "promesa_1", start: 124.64, dur: 4.35, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/bg_tomas_huerta.png" title="Lo que vas a saber" chips={["Barrera de 2 metales","Bórax para hormigas","Spray de ajo","Tierra de diatomeas"]} hue="amber" /> },
  { key: "promesa_2", start: 128.99, dur: 6.51, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_frasco_veneno_no.png" hue="red" /> },
  { key: "problema_0", start: 135.5, dur: 24.46, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/problema_0.mp4" pages={[{"image":"img/dg_bg_barrera.png","eyebrow":"Defendé el territorio, no pelees cuerpo a cuerpo"}]} /> },
  { key: "problema_1", start: 159.96, dur: 15.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_rociar_veneno.png" hue="red" /> },
  { key: "problema_2", start: 175.25, dur: 15.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/bgv_plaga_vuelve.mp4" hue="blue" kicker="Y a los días vuelve" /> },
  { key: "problema_3", start: 190.55, dur: 11.21, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="La guerra sin fin" items={["Rociás veneno","Se evapora o lo lava la lluvia","Volvés a comprar"]} accent={D} cross /> },
  { key: "problema_4", start: 201.76, dur: 12.74, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Veneno (semanas)","value":3,"tone":"danger"},{"label":"Barrera (años)","value":40,"winner":true}]} title="Cuánto dura" hue="red" /> },
  { key: "barrera_que_0", start: 214.5, dur: 9.82, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="01" title="La barrera galvánica de $5" hue="red" /> },
  { key: "barrera_que_1", start: 224.32, dur: 25.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_babosa_baba.png" hue="blue" kicker="Babosas y caracoles" /> },
  { key: "barrera_que_2", start: 249.37, dur: 23.57, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/barrera_que_2.mp4" pages={[{"image":"img/dg_bg_fisica.png","eyebrow":"Su cuerpo húmedo cierra el circuito = una pila"}]} /> },
  { key: "barrera_que_3", start: 272.94, dur: 14.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_pila_natural.png" hue="red" /> },
  { key: "barrera_que_4", start: 287.68, dur: 9.82, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="US$ 5" image="img/bg_anillo_macro.png" caption="Una vez. Dura años." accent="amber" hue="blue" /> },
  { key: "barrera_receta_0", start: 297.5, dur: 6.4, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/bg_materiales_barrera.png" annotations={[{"kind":"circle","x":30,"y":55,"label":"Cinta de cobre"},{"kind":"circle","x":70,"y":55,"label":"Chapa galvanizada (zinc)"}]} eyebrow="Lo que necesitás" caption="Cobre y zinc, monedas" hue="blue" /> },
  { key: "barrera_receta_1", start: 303.9, dur: 7.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_cinta_cobre.png" hue="amber" kicker="1 · Cobre" /> },
  { key: "barrera_receta_2", start: 311.28, dur: 7.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_chapa_zinc.png" hue="red" kicker="2 · Zinc (chapa galvanizada)" /> },
  { key: "barrera_receta_3", start: 318.66, dur: 7.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_pegar_cobre.png" hue="blue" /> },
  { key: "barrera_receta_4", start: 326.04, dur: 7.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_pegar_zinc.png" hue="amber" /> },
  { key: "barrera_receta_5", start: 333.42, dur: 7.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_copper_tape.mp4" hue="red" kicker="3 · Rodear el cantero" /> },
  { key: "barrera_receta_6", start: 340.8, dur: 7.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_anillo_cerrado.png" hue="blue" kicker="Un anillo cerrado, los dos metales juntos" /> },
  { key: "barrera_receta_7", start: 348.18, dur: 7.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/bgv_babosa_calambre.mp4" hue="amber" kicker="Toca los dos, recibe el calambre, se va" /> },
  { key: "barrera_receta_8", start: 355.56, dur: 5.42, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/bg_monedas_cobre.png" side="right" hue="red" /> },
  { key: "barrera_receta_9", start: 360.98, dur: 5.9, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="La barrera galvánica" items={[{"text":"Cobre + zinc juntos","state":"done"},{"text":"Anillo cerrado sin huecos","state":"done"},{"text":"Alrededor de la planta","state":"done"},{"text":"Dura años, sin recomprar","state":"done"}]} hue="blue" /> },
  { key: "inject1_0", start: 366.88, dur: 35.54, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/inject1_0.mp4" pages={[{"image":"img/dg_bg_manual.png","eyebrow":"Las medidas exactas, en el manual"}]} /> },
  { key: "inject1_1", start: 402.42, dur: 19.25, kind: "half", el: (d) => <HalfShot durationInFrames={d} src="img/bg_manual_huerta.png" side="right" kicker="Todo documentado" hue="red" /> },
  { key: "hormigas_0", start: 421.67, dur: 0.4, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="02" title="El bórax contra las hormigas" hue="red" /> },
  { key: "hormigas_1", start: 422.07, dur: 0.61, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_fila_hormigas.png" hue="blue" kicker="Las hormigas" /> },
  { key: "hormigas_2", start: 422.68, dur: 0.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_borax_azucar.png" hue="amber" kicker="Bórax + azúcar" /> },
  { key: "hormigas_3", start: 423.28, dur: 0.61, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_borax_cebo.png" hue="red" kicker="Mezclar en una pasta dulce" /> },
  { key: "hormigas_4", start: 423.89, dur: 0.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_cebo_cerca.png" hue="blue" /> },
  { key: "hormigas_5", start: 424.49, dur: 0.61, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/bgv_hormigas_cebo.mp4" hue="amber" kicker="Se lo llevan al hormiguero" /> },
  { key: "hormigas_6", start: 425.1, dur: 0.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_borax_linea.png" hue="red" kicker="Y una línea seca de barrera" /> },
  { key: "hormigas_7", start: 425.7, dur: 0.97, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/hormigas_7.mp4" pages={[{"image":"img/dg_bg_hormiga.png","eyebrow":"Colapsa desde adentro, sin cavar"}]} /> },
  { key: "ajo_0", start: 426.67, dur: 60.83, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="03" title="El spray de ajo contra los pulgones" hue="blue" /> },
  { key: "ajo_1", start: 487.5, dur: 9.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_dientes_ajo.png" hue="amber" kicker="Unos dientes de ajo" /> },
  { key: "ajo_2", start: 497.08, dur: 9.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_ajo_machacar.png" hue="red" kicker="Machacado" /> },
  { key: "ajo_3", start: 506.66, dur: 9.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_ajo_reposar.png" hue="blue" kicker="Reposar una noche" /> },
  { key: "ajo_4", start: 516.24, dur: 9.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_colar_spray.png" hue="amber" kicker="Colar y al pulverizador" /> },
  { key: "ajo_5", start: 525.82, dur: 9.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_spray_leaves.mp4" hue="red" kicker="Rociar el REVERSO de las hojas" /> },
  { key: "ajo_6", start: 535.4, dur: 8.3, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/bg_pulgon_reverso.png" annotations={[{"kind":"arrow","x":40,"y":60,"label":"Reverso: ahí están"},{"kind":"circle","x":75,"y":30,"label":"Flor: NO (las abejas)"}]} eyebrow="El truco" caption="Abajo de la hoja, nunca las flores" hue="blue" /> },
  { key: "ajo_7", start: 543.7, dur: 7.03, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="La regla de oro del ajo" items={["Rociar el reverso","Nunca las flores abiertas","Repetir tras la lluvia"]} accent={G} /> },
  { key: "diatomeas_0", start: 550.73, dur: 6.36, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="04" title="La tierra de diatomeas" hue="amber" /> },
  { key: "diatomeas_1", start: 557.09, dur: 9.54, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_diatomeas_polvo.png" hue="red" kicker="Polvo finísimo" /> },
  { key: "diatomeas_2", start: 566.63, dur: 15.26, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/diatomeas_2.mp4" pages={[{"image":"img/dg_bg_diat.png","eyebrow":"Suave para vos, filoso para el bicho"}]} /> },
  { key: "diatomeas_3", start: 581.89, dur: 9.53, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_diat_espolvorear.png" hue="amber" kicker="Espolvorear alrededor" /> },
  { key: "diatomeas_4", start: 591.42, dur: 9.54, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_diat_linea.png" hue="red" kicker="Una barrera que no cruzan" /> },
  { key: "diatomeas_5", start: 600.96, dur: 9.54, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/bgv_diat_lluvia.mp4" hue="blue" kicker="Repetir después de la lluvia" /> },
  { key: "cuatro_0", start: 610.5, dur: 14.94, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/bg_tomas_huerta.png" title="Cuatro defensas, ningún veneno" chips={["Babosas → 2 metales","Hormigas → bórax","Pulgones → ajo","Todo → diatomeas"]} hue="amber" /> },
  { key: "cuatro_1", start: 625.44, dur: 38.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_huerta_sana.png" hue="blue" kicker="Seguro para abejas, mariposas y chicos" /> },
  { key: "inject2_0", start: 663.54, dur: 27.29, kind: "costtally", el: (d) => <CostTally durationInFrames={d} left={{"label":"El veneno","note":"se gasta, comprás de nuevo cada mes","total":95,"bad":true}} right={{"label":"Constructor Libre","note":"barreras que duran años","total":5}} hue="blue" /> },
  { key: "inject2_1", start: 690.83, dur: 26.05, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/bg_veneno_abeja.png" words={parseQuote("Ese veneno mata también a las *abejas* que dan tu comida.")} accent="danger" hue="amber" /> },
  { key: "empezar_0", start: 716.88, dur: 24.7, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Babosas","desc":"la barrera de 2 metales","image":"img/bg_anillo_metales.png"},{"title":"Hormigas","desc":"el cebo de bórax","image":"img/bg_borax_cebo.png"},{"title":"Pulgones","desc":"el spray de ajo","image":"img/bg_ajo_machacar.png"}]} eyebrow="Sin abrumarte" title="Empezá por tu peor plaga" hue="amber" /> },
  { key: "empezar_1", start: 741.58, dur: 41.99, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_huerta_castigada.png" hue="red" kicker="Ganá una batalla primero" /> },
  { key: "aliados_0", start: 783.57, dur: 8.18, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_mariquita.png" hue="red" kicker="La mariquita come cientos por día" /> },
  { key: "aliados_1", start: 791.75, dur: 8.19, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_sapo.png" hue="blue" /> },
  { key: "aliados_2", start: 799.94, dur: 8.18, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_arana_jardin.png" hue="amber" /> },
  { key: "aliados_3", start: 808.12, dur: 8.19, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_pajaro_huerta.png" hue="red" /> },
  { key: "aliados_4", start: 816.31, dur: 8.18, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_refugio_sapo.png" hue="blue" kicker="Dales un refugio" /> },
  { key: "aliados_5", start: 824.49, dur: 13.1, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/aliados_5.mp4" pages={[{"image":"img/dg_bg_ecos.png","eyebrow":"Cuando dejás el veneno, vuelve el ejército"}]} /> },
  { key: "panorama_0", start: 837.59, dur: 34.32, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Comida"},{"t":"sana"},{"t":"a"},{"t":"unos"},{"t":"pasos"},{"t":"de"},{"t":"tu"},{"t":"cocina","hl":true}]} eyebrow="Lo más valioso" hue="blue" bg="image" image="img/bg_huerta_sana.png" /> },
  { key: "panorama_1", start: 871.91, dur: 36.03, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/bg_manos_cosecha.png" words={parseQuote("Cultivaban sin un solo químico de laboratorio. Y *comían*.")} hue="amber" /> },
  { key: "plan_0", start: 907.94, dur: 14.51, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Tu fin de semana" items={[{"text":"Cobre y zinc para la barrera","state":"todo"},{"text":"Una caja de bórax","state":"todo"},{"text":"Ajo en agua esta noche","state":"todo"}]} hue="amber" /> },
  { key: "plan_1", start: 922.45, dur: 18.14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_tomas_arma_barrera.png" hue="red" /> },
  { key: "inject3_0", start: 940.59, dur: 27.02, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/inject3_0.mp4" pages={[{"image":"img/dg_bg_stack.png","eyebrow":"Vale 158 — hoy 27, para siempre"}]} /> },
  { key: "inject3_1", start: 967.61, dur: 14.07, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Por separado","value":158,"tone":"danger"},{"label":"Hoy","value":27,"winner":true}]} title="El valor" unit="US$" hue="blue" /> },
  { key: "inject3_2", start: 981.68, dur: 11.82, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/bg_manual_celular.png" words={parseQuote("Si no te sirve, te devuelvo *todo*. El riesgo lo pongo yo.")} accent="good" hue="amber" /> },
  { key: "coment_0", start: 993.5, dur: 19.89, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_tomas_camara.png" hue="blue" kicker="¿Qué plaga te arruina la huerta?" /> },
  { key: "cierre_0", start: 1013.39, dur: 19.31, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/bg_huerta_sana.png" words={parseQuote("Dejás de ser un cliente y volvés a ser un *hombre que sabe*.")} hue="amber" /> },
  { key: "cierre_1", start: 1032.7, dur: 47.8, kind: "journey", el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="La verdadera cosecha" title="Tu huerta libre" waypoints={[{"x":0,"y":0,"z":0,"image":"img/bg_anillo_metales.png","label":"La barrera","num":"1","dwell":2.6,"travel":1.6},{"x":1.2,"y":-0.4,"z":0.3,"image":"img/bg_mariquita.png","label":"Los aliados","num":"2","dwell":2.6,"travel":1.6},{"x":2.4,"y":0.3,"z":-0.2,"image":"img/bg_huerta_sana.png","label":"La huerta sana","num":"3","dwell":3,"travel":1.4}]} /> },
  { key: "proximo_0", start: 1080.5, dur: 17.77, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_tierra_negra.png" hue="red" kicker="La próxima: revivir tierra muerta con $1" /> },
  { key: "proximo_1", start: 1098.27, dur: 30.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bg_tomas_firma.png" hue="blue" /> },
];

export const REFRAME: { start: number; end: number }[] = [];
