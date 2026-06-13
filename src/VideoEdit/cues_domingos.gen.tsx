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
  { key: "intro_2", start: 13.2, dur: 3.52, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_mesa_charla.mp4" side="right" hue="blue" /> },
  { key: "intro_3", start: 16.72, dur: 5.32, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_abuela_nietos.mp4" hue="amber" /> },
  { key: "intro_4", start: 22.04, dur: 5.96, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/do_ai_almuerzo70s.png" words={parseQuote("Un domingo entero, sagrado, que era para la *familia*.")} hue="red" /> },
  { key: "intro_5", start: 28, dur: 7.09, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={15} suffix=" costumbres" label="que ya nadie respeta" eyebrow="Hoy te cuento" hue="blue" /> },
  { key: "intro_6", start: 35.09, dur: 7.8, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/do_ai_almuerzo70s.png" side="left" hue="amber" /> },
  { key: "intro_7", start: 42.89, dur: 7.1, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Casi"},{"t":"ninguna"},{"t":"costaba"},{"t":"plata","hl":true}]} eyebrow="Costaban tiempo y ganas" hue="red" bg="image" image="broll/do_mesa_larga.mp4" /> },
  { key: "intro_8", start: 49.99, dur: 18.09, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_mesa_larga.mp4" hue="blue" /> },
  { key: "s01_sobremesa_0", start: 68.08, dur: 6.77, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="01" title="La sobremesa" hue="red" /> },
  { key: "s01_sobremesa_1", start: 74.85, dur: 16.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_sobremesa.mp4" hue="blue" /> },
  { key: "s01_sobremesa_2", start: 91.29, dur: 7.1, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/do_ai_abuela_cuenta.png" side="right" hue="amber" /> },
  { key: "s01_sobremesa_3", start: 98.39, dur: 9.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_mesa_charla.mp4" hue="red" /> },
  { key: "s01_sobremesa_4", start: 108.06, dur: 6.45, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="«Horas»" image="broll/do_sobremesa.mp4" caption="Nadie se movía de la mesa. Ahí se contaba el mundo." hue="blue" /> },
  { key: "s01_sobremesa_5", start: 114.51, dur: 7.09, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Ahí se transmitía todo" items={["Quiénes éramos","Las historias viejas","Los chistes de la familia"]} accent={A} /> },
  { key: "s01_sobremesa_6", start: 121.6, dur: 7.12, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_sobremesa.mp4" words={parseQuote("Las mejores conversaciones de nuestra vida, perdidas en el *apuro*.")} hue="red" /> },
  { key: "s02_misa_0", start: 128.72, dur: 10.68, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="02" title="La misa de los domingos" hue="blue" /> },
  { key: "s02_misa_1", start: 139.4, dur: 15.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_iglesia_pueblo.mp4" hue="amber" /> },
  { key: "s02_misa_2", start: 154.66, dur: 25.94, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_iglesia.mp4" hue="red" kicker="Todo el pueblo se encontraba" /> },
  { key: "s02_misa_3", start: 180.6, dur: 8.38, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_iglesia.mp4" words={parseQuote("Mirarse a la cara era lo que hacía que un pueblo fuera un *pueblo*.")} hue="blue" /> },
  { key: "s03_almuerzo_0", start: 188.98, dur: 7.44, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="03" title="El almuerzo de los domingos" hue="amber" /> },
  { key: "s03_almuerzo_1", start: 196.42, dur: 18.06, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_almuerzo.mp4" hue="red" /> },
  { key: "s03_almuerzo_2", start: 214.48, dur: 7.79, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_mesa_larga.mp4" side="left" hue="blue" /> },
  { key: "s03_almuerzo_3", start: 222.27, dur: 10.63, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/do_ai_almuerzo70s.png" hue="amber" kicker="Tres generaciones" /> },
  { key: "s03_almuerzo_4", start: 232.9, dur: 8.5, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="El almuerzo del domingo" items={[{"text":"Venían abuelos, tíos, primos","state":"done"},{"text":"La mesa con tablas","state":"done"},{"text":"Sillas prestadas","state":"done"},{"text":"Todos codo con codo","state":"done"}]} hue="red" /> },
  { key: "s03_almuerzo_5", start: 241.4, dur: 8.5, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="No era una comida, era un acontecimiento" lines={[{"text":"La mesa se estiraba con tablas."},{"text":"Sillas prestadas de los vecinos."}]} image="broll/do_almuerzo.mp4" hue="blue" /> },
  { key: "s04_siesta_0", start: 249.9, dur: 10.02, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="04" title="La siesta" hue="red" /> },
  { key: "s04_siesta_1", start: 259.92, dur: 24.32, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_siesta_calle.mp4" hue="blue" kicker="El pueblo entero dormía" /> },
  { key: "s04_siesta_2", start: 284.24, dur: 14.31, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_siesta_persona.mp4" hue="amber" /> },
  { key: "s04_siesta_3", start: 298.55, dur: 10.02, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_siesta_calle.mp4" words={parseQuote("Aprendíamos a no hacer nada, y que estuviera *bien*.")} hue="red" /> },
  { key: "s05_visitar_0", start: 308.57, dur: 8.18, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="05" title="Visitar sin avisar" hue="blue" /> },
  { key: "s05_visitar_1", start: 316.75, dur: 11.69, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_puerta_tocar.mp4" hue="amber" /> },
  { key: "s05_visitar_2", start: 328.44, dur: 19.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_recibir.mp4" hue="red" kicker="Caer de sorpresa era alegría" /> },
  { key: "s05_visitar_3", start: 348.32, dur: 16.96, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_recibir.mp4" words={parseQuote("Aparecer en la puerta de alguien solo porque tenías ganas de *verlo*.")} hue="blue" /> },
  { key: "s06_juegos_0", start: 365.28, dur: 5.47, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="06" title="Los juegos de mesa y las cartas" hue="amber" /> },
  { key: "s06_juegos_1", start: 370.75, dur: 13.28, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_cartas_jugar.mp4" hue="red" /> },
  { key: "s06_juegos_2", start: 384.03, dur: 5.74, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_dados.mp4" side="right" hue="blue" /> },
  { key: "s06_juegos_3", start: 389.77, dur: 7.81, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/do_ai_cartas_familia.png" hue="amber" /> },
  { key: "s06_juegos_4", start: 397.58, dur: 22.38, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_cartas_jugar.mp4" words={parseQuote("Tenemos mil juegos en el bolsillo y jugamos más *solos* que nunca.")} hue="red" /> },
  { key: "s07_radiotv_0", start: 419.96, dur: 7.51, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="07" title="La radio y la televisión en familia" hue="red" /> },
  { key: "s07_radiotv_1", start: 427.47, dur: 10.73, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_radio_vieja.mp4" hue="blue" /> },
  { key: "s07_radiotv_2", start: 438.2, dur: 18.23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_tv_vintage.mp4" hue="amber" /> },
  { key: "s07_radiotv_3", start: 456.43, dur: 7.87, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/do_ai_tv_familia.png" side="left" hue="red" /> },
  { key: "s07_radiotv_4", start: 464.3, dur: 8.94, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Antes","value":1},{"label":"Hoy","value":8}]} title="Pantallas en la casa" hue="blue" /> },
  { key: "s07_radiotv_5", start: 473.24, dur: 7.06, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/do_ai_tv_familia.png" words={parseQuote("Mirar algo hombro con hombro, y comentarlo en el *momento*.")} hue="amber" /> },
  { key: "s08_ropa_0", start: 480.3, dur: 10.73, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="08" title="La ropa de domingo" hue="blue" /> },
  { key: "s08_ropa_1", start: 491.03, dur: 26.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_ropa_domingo.mp4" hue="amber" /> },
  { key: "s08_ropa_2", start: 517.08, dur: 11.24, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_zapatos_lustrar.mp4" side="right" hue="red" /> },
  { key: "s08_ropa_3", start: 528.32, dur: 8.48, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_ropa_domingo.mp4" words={parseQuote("El domingo era una pequeña *fiesta* semanal. Y dejamos de festejarlo.")} hue="blue" /> },
  { key: "s09_telefono_0", start: 536.8, dur: 6.77, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="09" title="El teléfono y las cartas" hue="amber" /> },
  { key: "s09_telefono_1", start: 543.57, dur: 9.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_telefono_viejo.mp4" hue="red" /> },
  { key: "s09_telefono_2", start: 553.23, dur: 16.43, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_carta_escribir.mp4" hue="blue" kicker="Escrita a mano" /> },
  { key: "s09_telefono_3", start: 569.66, dur: 9.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_buzon.jpg" hue="amber" /> },
  { key: "s09_telefono_4", start: 579.33, dur: 8.05, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Antes","value":1},{"label":"Hoy","value":100}]} title="Mensajes por día" hue="red" /> },
  { key: "s09_telefono_5", start: 587.38, dur: 6.77, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_carta_escribir.mp4" words={parseQuote("Una carta tenía más amor que mil mensajes de *hoy*.")} hue="blue" /> },
  { key: "s10_chicos_0", start: 594.15, dur: 7.62, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="10" title="Los chicos en la calle" hue="red" /> },
  { key: "s10_chicos_1", start: 601.77, dur: 18.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_chicos_calle.mp4" hue="blue" /> },
  { key: "s10_chicos_2", start: 620.27, dur: 7.98, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_rayuela.mp4" side="left" hue="amber" /> },
  { key: "s10_chicos_3", start: 628.25, dur: 10.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_pelota_calle.mp4" hue="red" /> },
  { key: "s10_chicos_4", start: 639.13, dur: 7.98, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="La calle llena de chicos era" items={["Un barrio vivo","Vecinos que se conocían","Chicos que se arreglaban solos"]} accent={G} /> },
  { key: "s10_chicos_5", start: 647.11, dur: 6.19, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_chicos_calle.mp4" words={parseQuote("Hoy es un barrio de puertas *cerradas*.")} hue="amber" /> },
  { key: "s11_mantel_0", start: 653.3, dur: 8.82, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="11" title="El mantel y la vajilla buena" hue="blue" /> },
  { key: "s11_mantel_1", start: 662.12, dur: 21.41, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_mantel_poner.mp4" hue="amber" /> },
  { key: "s11_mantel_2", start: 683.53, dur: 12.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_vajilla.jpg" hue="red" kicker="Guardada, esperando" /> },
  { key: "s11_mantel_3", start: 696.13, dur: 10.92, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="broll/do_mantel_poner.mp4" annotations={[{"kind":"circle","x":30,"y":40,"label":"El mantel bordado"},{"kind":"circle","x":70,"y":55,"label":"La vajilla buena"}]} caption="Honrar el momento y a los que venían" hue="blue" /> },
  { key: "s11_mantel_4", start: 707.05, dur: 7.71, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_mantel_poner.mp4" words={parseQuote("Tratar bien a los que queremos con la mesa puesta como *Dios manda*.")} hue="amber" /> },
  { key: "s12_mate_0", start: 714.76, dur: 14.33, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="12" title="El mate en familia" hue="amber" /> },
  { key: "s12_mate_1", start: 729.09, dur: 34.79, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_mate_ronda.mp4" hue="red" kicker="La ronda no se cortaba" /> },
  { key: "s12_mate_2", start: 763.88, dur: 11.09, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_mate_ronda.mp4" words={parseQuote("Lo lindo del mate nunca fue el mate. Fueron las *personas* alrededor.")} hue="blue" /> },
  { key: "s13_merienda_0", start: 774.97, dur: 9.47, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="13" title="La merienda compartida" hue="red" /> },
  { key: "s13_merienda_1", start: 784.44, dur: 23.01, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_mesa_charla.mp4" hue="blue" /> },
  { key: "s13_merienda_2", start: 807.45, dur: 9.92, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_abuela_nietos.mp4" side="right" hue="amber" /> },
  { key: "s13_merienda_3", start: 817.37, dur: 9.47, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_mesa_charla.mp4" words={parseQuote("Lo que extraño no es la comida. Es la mesa *llena*.")} hue="red" /> },
  { key: "s14_musica_0", start: 826.84, dur: 9.47, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="14" title="Cantar y tocar en familia" hue="blue" /> },
  { key: "s14_musica_1", start: 836.31, dur: 23.01, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_guitarra.mp4" hue="amber" /> },
  { key: "s14_musica_2", start: 859.32, dur: 13.53, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_acordeon.mp4" hue="red" kicker="Una guitarra desafinada" /> },
  { key: "s14_musica_3", start: 872.85, dur: 9.47, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_guitarra.mp4" words={parseQuote("Cantábamos mal, pero con el *alma*. Y dejamos de cantar juntos.")} hue="blue" /> },
  { key: "s15_nada_0", start: 882.32, dur: 8.05, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="15" title="No hacer nada, y que estuviera bien" hue="amber" /> },
  { key: "s15_nada_1", start: 890.37, dur: 19.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_patio_sentado.mp4" hue="red" /> },
  { key: "s15_nada_2", start: 909.92, dur: 8.43, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_cielo_mirar.mp4" side="left" hue="blue" /> },
  { key: "s15_nada_3", start: 918.35, dur: 11.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_ventana_tarde.mp4" hue="amber" /> },
  { key: "s15_nada_4", start: 929.85, dur: 9.2, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="El descanso del alma" lines={[{"text":"El aburrimiento estaba permitido."},{"text":"La calma estaba permitida."}]} image="broll/do_patio_sentado.mp4" hue="red" /> },
  { key: "s15_nada_5", start: 939.05, dur: 8.05, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_ventana_tarde.mp4" words={parseQuote("Perdimos el descanso de verdad: simplemente *estar*, en paz.")} hue="blue" /> },
  { key: "extras_0", start: 947.1, dur: 23.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_plaza_paseo.mp4" hue="red" kicker="El paseo del domingo" /> },
  { key: "extras_1", start: 970.66, dur: 17.28, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_plaza.mp4" side="right" hue="blue" /> },
  { key: "extras_2", start: 987.94, dur: 40.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_album_fotos.mp4" hue="amber" kicker="Mirar fotos juntos" /> },
  { key: "extras_3", start: 1027.99, dur: 23.57, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_fotos_viejas.jpg" hue="red" /> },
  { key: "extras_4", start: 1051.56, dur: 23.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_cine_viejo.mp4" hue="blue" kicker="El club, el cine" /> },
  { key: "extras_5", start: 1075.12, dur: 40.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_baile_pareja.mp4" hue="amber" /> },
  { key: "extras_6", start: 1115.17, dur: 17.28, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="broll/do_baile.mp4" side="left" hue="red" /> },
  { key: "extras_7", start: 1132.45, dur: 17.28, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Lugares donde el pueblo se encontraba" items={["La plaza","El cine, el club","El baile"]} accent={B} /> },
  { key: "cierre_0", start: 1149.73, dur: 9.93, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_ventana_tarde.mp4" words={parseQuote("No te cuento esto para que sientas nostalgia y *nada más*.")} hue="blue" /> },
  { key: "cierre_1", start: 1159.66, dur: 24.12, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_reloj_pared.mp4" hue="amber" /> },
  { key: "cierre_2", start: 1183.78, dur: 22.71, kind: "journey", el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="El domingo que viene" title="Recuperá uno" waypoints={[{"x":0,"y":0,"z":0,"image":"broll/do_sobremesa.mp4","label":"Quedate en la sobremesa","num":"1","dwell":2.6,"travel":1.6},{"x":1.2,"y":-0.4,"z":0.3,"image":"broll/do_cartas_jugar.mp4","label":"Sacá un mazo de cartas","num":"2","dwell":2.6,"travel":1.6},{"x":2.4,"y":0.3,"z":-0.2,"image":"broll/do_mate_ronda.mp4","label":"Mate en ronda","num":"3","dwell":2.6,"travel":1.6},{"x":3.6,"y":-0.2,"z":0.2,"image":"broll/do_abuela_nietos.mp4","label":"Con quien quieras","num":"4","dwell":3,"travel":1.4}]} /> },
  { key: "cierre_3", start: 1206.49, dur: 11.35, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Quedate en la cadena" lines={[{"text":"Ya te conté las meriendas y los postres."},{"text":"Pronto, la cocina de antes de los supermercados."}]} hue="blue" /> },
  { key: "cierre_4", start: 1217.84, dur: 24.12, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/do_abuela_nietos.mp4" hue="amber" /> },
  { key: "cierre_5", start: 1241.96, dur: 7.04, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="broll/do_familia_70s.mp4" words={parseQuote("Regalale una tarde entera, sin apuro. Es lo más valioso que tenés para *dar*.")} hue="red" /> },
];

export const REFRAME: { start: number; end: number }[] = [];
