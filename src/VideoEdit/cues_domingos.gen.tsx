// cues_domingos.gen.tsx — GENERADO por beatsheet.mjs desde domingos.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/domingos.json
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
import { Checklist } from "./scenes/Checklist";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { CalloutMark } from "./scenes/CalloutMark";
import { FoodTeaseCards } from "./scenes/FoodTeaseCards";

const A = COLORS.accent, G = COLORS.good, B = COLORS.cold;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "intro_0", start: 0.08, dur: 7.8, kind: "teasecards", el: (d) => <FoodTeaseCards durationInFrames={d} cards={[{"src":"broll/do_sobremesa.mp4","label":"La sobremesa"},{"src":"broll/do_almuerzo.mp4","label":"El almuerzo"},{"src":"broll/do_mate_ronda.mp4","label":"El mate en ronda"},{"src":"broll/do_cartas_jugar.mp4","label":"Las cartas"},{"src":"broll/do_plaza_paseo.mp4","label":"El paseo"},{"src":"broll/do_baile.mp4","label":"El baile"}]} eyebrow="El día más lindo de la semana" title="¿Te acordás del domingo de antes?" /> },
  { key: "intro_1", start: 7.88, dur: 5.32, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_familia_70s.mp4" hue="red" kicker="El domingo de antes" /> },
  { key: "intro_2", start: 13.2, dur: 3.51, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_mesa_charla.mp4" side="right" hue="blue" /> },
  { key: "intro_3", start: 16.71, dur: 5.32, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_abuela_nietos.mp4" hue="amber" /> },
  { key: "intro_4", start: 22.03, dur: 5.96, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/do_ai_almuerzo70s.png" words={parseQuote("Un domingo entero, sagrado, que era para la *familia*.")} hue="red" /> },
  { key: "intro_5", start: 27.99, dur: 7.09, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={15} suffix=" costumbres" label="que ya nadie respeta" eyebrow="Hoy te cuento" hue="blue" /> },
  { key: "intro_6", start: 35.08, dur: 7.8, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/do_ai_almuerzo70s.png" side="left" hue="amber" /> },
  { key: "intro_7", start: 42.88, dur: 7.09, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Casi"},{"t":"ninguna"},{"t":"costaba"},{"t":"plata","hl":true}]} eyebrow="Costaban tiempo y ganas" hue="red" bg="image" image="broll/do_mesa_larga.mp4" /> },
  { key: "intro_8", start: 49.97, dur: 18.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_mesa_larga.mp4" hue="blue" /> },
  { key: "s01_sobremesa_0", start: 68.08, dur: 6.81, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="01" title="La sobremesa" hue="red" /> },
  { key: "s01_sobremesa_1", start: 74.89, dur: 16.54, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_sobremesa.mp4" hue="blue" /> },
  { key: "s01_sobremesa_2", start: 91.43, dur: 7.13, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/do_ai_abuela_cuenta.png" side="right" hue="amber" /> },
  { key: "s01_sobremesa_3", start: 98.56, dur: 9.73, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_mesa_charla.mp4" hue="red" /> },
  { key: "s01_sobremesa_4", start: 108.29, dur: 6.49, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="«Horas»" image="broll/do_sobremesa.mp4" caption="Nadie se movía de la mesa. Ahí se contaba el mundo." hue="blue" /> },
  { key: "s01_sobremesa_5", start: 114.78, dur: 7.13, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Ahí se transmitía todo" items={["Quiénes éramos","Las historias viejas","Los chistes de la familia"]} accent={A} /> },
  { key: "s01_sobremesa_6", start: 121.91, dur: 6.81, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_sobremesa.mp4" words={parseQuote("Las mejores conversaciones de nuestra vida, perdidas en el *apuro*.")} hue="red" /> },
  { key: "s02_misa_0", start: 128.72, dur: 10.29, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="02" title="La misa de los domingos" hue="blue" /> },
  { key: "s02_misa_1", start: 139.01, dur: 14.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_iglesia_pueblo.mp4" hue="amber" /> },
  { key: "s02_misa_2", start: 153.71, dur: 24.99, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_iglesia.mp4" hue="red" kicker="Todo el pueblo se encontraba" /> },
  { key: "s02_misa_3", start: 178.7, dur: 10.28, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_iglesia.mp4" words={parseQuote("Mirarse a la cara era lo que hacía que un pueblo fuera un *pueblo*.")} hue="blue" /> },
  { key: "s03_almuerzo_0", start: 188.98, dur: 7.44, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="03" title="El almuerzo de los domingos" hue="amber" /> },
  { key: "s03_almuerzo_1", start: 196.42, dur: 18.06, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_almuerzo.mp4" hue="red" /> },
  { key: "s03_almuerzo_2", start: 214.48, dur: 7.79, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_mesa_larga.mp4" side="left" hue="blue" /> },
  { key: "s03_almuerzo_3", start: 222.27, dur: 10.63, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/do_ai_almuerzo70s.png" hue="amber" kicker="Tres generaciones" /> },
  { key: "s03_almuerzo_4", start: 232.9, dur: 8.5, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="El almuerzo del domingo" items={[{"text":"Venían abuelos, tíos, primos","state":"done"},{"text":"La mesa con tablas","state":"done"},{"text":"Sillas prestadas","state":"done"},{"text":"Todos codo con codo","state":"done"}]} hue="red" /> },
  { key: "s03_almuerzo_5", start: 241.4, dur: 8.5, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="No era una comida, era un acontecimiento" lines={[{"text":"La mesa se estiraba con tablas."},{"text":"Sillas prestadas de los vecinos."}]} image="broll/do_almuerzo.mp4" hue="blue" /> },
  { key: "s04_siesta_0", start: 249.9, dur: 10.02, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="04" title="La siesta" hue="red" /> },
  { key: "s04_siesta_1", start: 259.92, dur: 24.33, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_siesta_calle.mp4" hue="blue" kicker="El pueblo entero dormía" /> },
  { key: "s04_siesta_2", start: 284.25, dur: 14.31, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_siesta_persona.mp4" hue="amber" /> },
  { key: "s04_siesta_3", start: 298.56, dur: 10.01, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_siesta_calle.mp4" words={parseQuote("Aprendíamos a no hacer nada, y que estuviera *bien*.")} hue="red" /> },
  { key: "s05_visitar_0", start: 308.57, dur: 9.68, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="05" title="Visitar sin avisar" hue="blue" /> },
  { key: "s05_visitar_1", start: 318.25, dur: 13.83, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_puerta_tocar.mp4" hue="amber" /> },
  { key: "s05_visitar_2", start: 332.08, dur: 23.51, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_recibir.mp4" hue="red" kicker="Caer de sorpresa era alegría" /> },
  { key: "s05_visitar_3", start: 355.59, dur: 9.69, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_recibir.mp4" words={parseQuote("Aparecer en la puerta de alguien solo porque tenías ganas de *verlo*.")} hue="blue" /> },
  { key: "s06_juegos_0", start: 365.28, dur: 7.92, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="06" title="Los juegos de mesa y las cartas" hue="amber" /> },
  { key: "s06_juegos_1", start: 373.2, dur: 19.23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_cartas_jugar.mp4" hue="red" /> },
  { key: "s06_juegos_2", start: 392.43, dur: 8.3, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_dados.mp4" side="right" hue="blue" /> },
  { key: "s06_juegos_3", start: 400.73, dur: 11.31, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/do_ai_cartas_familia.png" hue="amber" /> },
  { key: "s06_juegos_4", start: 412.04, dur: 7.92, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_cartas_jugar.mp4" words={parseQuote("Tenemos mil juegos en el bolsillo y jugamos más *solos* que nunca.")} hue="red" /> },
  { key: "s07_radiotv_0", start: 419.96, dur: 7.45, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="07" title="La radio y la televisión en familia" hue="red" /> },
  { key: "s07_radiotv_1", start: 427.41, dur: 10.65, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_radio_vieja.mp4" hue="blue" /> },
  { key: "s07_radiotv_2", start: 438.06, dur: 18.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_tv_vintage.mp4" hue="amber" /> },
  { key: "s07_radiotv_3", start: 456.16, dur: 7.81, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/do_ai_tv_familia.png" side="left" hue="red" /> },
  { key: "s07_radiotv_4", start: 463.97, dur: 8.87, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Antes","value":1},{"label":"Hoy","value":8}]} title="Pantallas en la casa" hue="blue" /> },
  { key: "s07_radiotv_5", start: 472.84, dur: 7.46, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/do_ai_tv_familia.png" words={parseQuote("Mirar algo hombro con hombro, y comentarlo en el *momento*.")} hue="amber" /> },
  { key: "s08_ropa_0", start: 480.3, dur: 10.32, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="08" title="La ropa de domingo" hue="blue" /> },
  { key: "s08_ropa_1", start: 490.62, dur: 25.06, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_ropa_domingo.mp4" hue="amber" /> },
  { key: "s08_ropa_2", start: 515.68, dur: 10.81, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_zapatos_lustrar.mp4" side="right" hue="red" /> },
  { key: "s08_ropa_3", start: 526.49, dur: 10.31, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_ropa_domingo.mp4" words={parseQuote("El domingo era una pequeña *fiesta* semanal. Y dejamos de festejarlo.")} hue="blue" /> },
  { key: "s09_telefono_0", start: 536.8, dur: 6.77, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="09" title="El teléfono y las cartas" hue="amber" /> },
  { key: "s09_telefono_1", start: 543.57, dur: 9.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_telefono_viejo.mp4" hue="red" /> },
  { key: "s09_telefono_2", start: 553.24, dur: 16.43, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_carta_escribir.mp4" hue="blue" kicker="Escrita a mano" /> },
  { key: "s09_telefono_3", start: 569.67, dur: 9.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_buzon.jpg" hue="amber" /> },
  { key: "s09_telefono_4", start: 579.34, dur: 8.05, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Antes","value":1},{"label":"Hoy","value":100}]} title="Mensajes por día" hue="red" /> },
  { key: "s09_telefono_5", start: 587.39, dur: 6.76, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_carta_escribir.mp4" words={parseQuote("Una carta tenía más amor que mil mensajes de *hoy*.")} hue="blue" /> },
  { key: "s10_chicos_0", start: 594.15, dur: 7.44, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="10" title="Los chicos en la calle" hue="red" /> },
  { key: "s10_chicos_1", start: 601.59, dur: 18.06, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_chicos_calle.mp4" hue="blue" /> },
  { key: "s10_chicos_2", start: 619.65, dur: 7.79, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_rayuela.mp4" side="left" hue="amber" /> },
  { key: "s10_chicos_3", start: 627.44, dur: 10.63, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_pelota_calle.mp4" hue="red" /> },
  { key: "s10_chicos_4", start: 638.07, dur: 7.79, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="La calle llena de chicos era" items={["Un barrio vivo","Vecinos que se conocían","Chicos que se arreglaban solos"]} accent={G} /> },
  { key: "s10_chicos_5", start: 645.86, dur: 7.44, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_chicos_calle.mp4" words={parseQuote("Hoy es un barrio de puertas *cerradas*.")} hue="amber" /> },
  { key: "s11_mantel_0", start: 653.3, dur: 8.66, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="11" title="El mantel y la vajilla buena" hue="blue" /> },
  { key: "s11_mantel_1", start: 661.96, dur: 21.04, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_mantel_poner.mp4" hue="amber" /> },
  { key: "s11_mantel_2", start: 683, dur: 12.37, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_vajilla.jpg" hue="red" kicker="Guardada, esperando" /> },
  { key: "s11_mantel_3", start: 695.37, dur: 10.72, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="broll/do_mantel_poner.mp4" annotations={[{"kind":"circle","x":30,"y":40,"label":"El mantel bordado"},{"kind":"circle","x":70,"y":55,"label":"La vajilla buena"}]} caption="Honrar el momento y a los que venían" hue="blue" /> },
  { key: "s11_mantel_4", start: 706.09, dur: 8.67, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_mantel_poner.mp4" words={parseQuote("Tratar bien a los que queremos con la mesa puesta como *Dios manda*.")} hue="amber" /> },
  { key: "s12_mate_0", start: 714.76, dur: 13.6, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="12" title="El mate en familia" hue="amber" /> },
  { key: "s12_mate_1", start: 728.36, dur: 33.02, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_mate_ronda.mp4" hue="red" kicker="La ronda no se cortaba" /> },
  { key: "s12_mate_2", start: 761.38, dur: 13.59, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_mate_ronda.mp4" words={parseQuote("Lo lindo del mate nunca fue el mate. Fueron las *personas* alrededor.")} hue="blue" /> },
  { key: "s13_merienda_0", start: 774.97, dur: 9.47, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="13" title="La merienda compartida" hue="red" /> },
  { key: "s13_merienda_1", start: 784.44, dur: 23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_mesa_charla.mp4" hue="blue" /> },
  { key: "s13_merienda_2", start: 807.44, dur: 9.92, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_abuela_nietos.mp4" side="right" hue="amber" /> },
  { key: "s13_merienda_3", start: 817.36, dur: 9.48, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_mesa_charla.mp4" words={parseQuote("Lo que extraño no es la comida. Es la mesa *llena*.")} hue="red" /> },
  { key: "s14_musica_0", start: 826.84, dur: 9.47, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="14" title="Cantar y tocar en familia" hue="blue" /> },
  { key: "s14_musica_1", start: 836.31, dur: 23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_guitarra.mp4" hue="amber" /> },
  { key: "s14_musica_2", start: 859.31, dur: 13.53, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_acordeon.mp4" hue="red" kicker="Una guitarra desafinada" /> },
  { key: "s14_musica_3", start: 872.84, dur: 9.48, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_guitarra.mp4" words={parseQuote("Cantábamos mal, pero con el *alma*. Y dejamos de cantar juntos.")} hue="blue" /> },
  { key: "s15_nada_0", start: 882.32, dur: 8.05, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="15" title="No hacer nada, y que estuviera bien" hue="amber" /> },
  { key: "s15_nada_1", start: 890.37, dur: 19.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_patio_sentado.mp4" hue="red" /> },
  { key: "s15_nada_2", start: 909.92, dur: 8.43, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_cielo_mirar.mp4" side="left" hue="blue" /> },
  { key: "s15_nada_3", start: 918.35, dur: 11.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_ventana_tarde.mp4" hue="amber" /> },
  { key: "s15_nada_4", start: 929.85, dur: 9.2, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="El descanso del alma" lines={[{"text":"El aburrimiento estaba permitido."},{"text":"La calma estaba permitida."}]} image="broll/do_patio_sentado.mp4" hue="red" /> },
  { key: "s15_nada_5", start: 939.05, dur: 8.05, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_ventana_tarde.mp4" words={parseQuote("Perdimos el descanso de verdad: simplemente *estar*, en paz.")} hue="blue" /> },
  { key: "extras_0", start: 947.1, dur: 23.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_plaza_paseo.mp4" hue="red" kicker="El paseo del domingo" /> },
  { key: "extras_1", start: 970.66, dur: 17.28, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_plaza.mp4" side="right" hue="blue" /> },
  { key: "extras_2", start: 987.94, dur: 40.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_album_fotos.mp4" hue="amber" kicker="Mirar fotos juntos" /> },
  { key: "extras_3", start: 1027.99, dur: 23.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_fotos_viejas.jpg" hue="red" /> },
  { key: "extras_4", start: 1051.55, dur: 23.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_cine_viejo.mp4" hue="blue" kicker="El club, el cine" /> },
  { key: "extras_5", start: 1075.11, dur: 40.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_baile_pareja.mp4" hue="amber" /> },
  { key: "extras_6", start: 1115.16, dur: 17.28, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_baile.mp4" side="left" hue="red" /> },
  { key: "extras_7", start: 1132.44, dur: 17.29, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Lugares donde el pueblo se encontraba" items={["La plaza","El cine, el club","El baile"]} accent={B} /> },
  { key: "cierre_0", start: 1149.73, dur: 9.65, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_ventana_tarde.mp4" words={parseQuote("No te cuento esto para que sientas nostalgia y *nada más*.")} hue="blue" /> },
  { key: "cierre_1", start: 1159.38, dur: 23.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_reloj_pared.mp4" hue="amber" /> },
  { key: "cierre_2", start: 1182.82, dur: 22.06, kind: "journey", el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="El domingo que viene" title="Recuperá uno" waypoints={[{"x":0,"y":0,"z":0,"image":"broll/do_sobremesa.mp4","label":"Quedate en la sobremesa","num":"1","dwell":2.6,"travel":1.6},{"x":1.2,"y":-0.4,"z":0.3,"image":"broll/do_cartas_jugar.mp4","label":"Sacá un mazo de cartas","num":"2","dwell":2.6,"travel":1.6},{"x":2.4,"y":0.3,"z":-0.2,"image":"broll/do_mate_ronda.mp4","label":"Mate en ronda","num":"3","dwell":2.6,"travel":1.6},{"x":3.6,"y":-0.2,"z":0.2,"image":"broll/do_abuela_nietos.mp4","label":"Con quien quieras","num":"4","dwell":3,"travel":1.4}]} /> },
  { key: "cierre_3", start: 1204.88, dur: 11.03, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Quedate en la cadena" lines={[{"text":"Ya te conté las meriendas y los postres."},{"text":"Pronto, la cocina de antes de los supermercados."}]} hue="blue" /> },
  { key: "cierre_4", start: 1215.91, dur: 23.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_abuela_nietos.mp4" hue="amber" /> },
  { key: "cierre_5", start: 1239.35, dur: 9.65, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_familia_70s.mp4" words={parseQuote("Regalale una tarde entera, sin apuro. Es lo más valioso que tenés para *dar*.")} hue="red" /> },
];

export const REFRAME: { start: number; end: number }[] = [];
