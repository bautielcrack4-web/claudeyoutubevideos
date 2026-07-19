// cues_vj7hqe8koadv.gen.tsx — GENERADO por beatsheet.mjs desde vj7hqe8koadv.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/vj7hqe8koadv.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { ChipsCluster } from "./scenes/ReframeContent";
import { SplitList } from "./scenes/SplitList";
import { VintageMapZoom } from "./scenes/VintageMapZoom";
import { StatBig } from "./scenes/StatBig";
import { JourneyCanvas } from "./scenes/JourneyCanvas";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { AgedDoc } from "./scenes/AgedDoc";
import { BarCompare } from "./scenes/BarCompare";
import { VsCard } from "./scenes/VsCard";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { Checklist } from "./scenes/Checklist";
import { NumberCard } from "./scenes/NumberCard";

const A = COLORS.accent;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "c_darvaza_stat", start: 0, dur: 5.4, kind: "numcard", el: (d) => <NumberCard durationInFrames={d} number="55" name="años ardiendo sin parar" eyebrow="Cráter de Darvaza · Turkmenistán" total="desde 1971" /> },
  { key: "hook_2", start: 12.42, dur: 6.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hook_darvaza2.png" hue="amber" darken={0.14} /> },
  { key: "hook_3", start: 19.34, dur: 3.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hook_darvaza3.png" hue="amber" darken={0.14} /> },
  { key: "intro_1", start: 22.74, dur: 4.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/intro_mapa1.png" hue="amber" darken={0.14} /> },
  { key: "intro_2", start: 27.64, dur: 6.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/intro_mapa2.png" hue="amber" darken={0.14} /> },
  { key: "intro_3_a", start: 34.62, dur: 5.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/intro_mundo.png" hue="amber" darken={0.14} kbPhase={1} /> },
  { key: "intro_3_b", start: 40.38, dur: 5.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/intro_mundo.png" hue="amber" darken={0.14} kbPhase={2} /> },
  { key: "richat_1", start: 46.14, dur: 3.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/richat_1.png" hue="amber" darken={0.14} /> },
  { key: "c_richat_map", start: 49.22, dur: 6, kind: "mapzoom", el: (d) => <VintageMapZoom durationInFrames={d} image="img/richat_2.png" pinX={0.42} pinY={0.5} label="Estructura de Richat · Mauritania" eyebrow="El Ojo del Sahara" zoom={1.15} /> },
  { key: "c_richat_stat", start: 55.22, dur: 5.2, kind: "numcard", el: (d) => <NumberCard durationInFrames={d} number="100" name="km de anillos concéntricos" eyebrow="Escala real" total="en pleno desierto" /> },
  { key: "richat_4_a", start: 60.42, dur: 5.57, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/richat_4.png" hue="amber" darken={0.14} kbPhase={1} /> },
  { key: "richat_4_b", start: 65.99, dur: 5.57, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/richat_4.png" hue="amber" darken={0.14} kbPhase={2} /> },
  { key: "richat_4_c", start: 71.56, dur: 5.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/richat_4.png" hue="amber" darken={0.14} kbPhase={3} /> },
  { key: "stonehenge_1", start: 77.12, dur: 4.02, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/stonehenge_1.png" hue="amber" darken={0.14} /> },
  { key: "stonehenge_2", start: 81.14, dur: 2.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/stonehenge_2.png" hue="amber" darken={0.14} /> },
  { key: "c_stonehenge_bars", start: 83.8, dur: 6.4, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Distancia recorrida","value":200,"display":"200 km"},{"label":"Ruedas disponibles","value":0},{"label":"Metal disponible","value":0},{"label":"Animales de carga","value":0}]} eyebrow="Stonehenge, Inglaterra" title="Cómo movieron piedras de varias toneladas" hue="amber" /> },
  { key: "stonehenge_4_a", start: 97.58, dur: 4.19, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/stonehenge_4.png" hue="amber" darken={0.14} kbPhase={1} /> },
  { key: "stonehenge_4_b", start: 101.77, dur: 4.19, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/stonehenge_4.png" hue="amber" darken={0.14} kbPhase={2} /> },
  { key: "zimbabue_1_a", start: 105.96, dur: 4.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/zimbabue_1.png" hue="blue" darken={0.14} kbPhase={1} /> },
  { key: "zimbabue_1_b", start: 110.68, dur: 4.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/zimbabue_1.png" hue="blue" darken={0.14} kbPhase={2} /> },
  { key: "c_zimbabue_vs", start: 115.4, dur: 6.2, kind: "vs", el: (d) => <VsCard durationInFrames={d} left={{"label":"Gran Zimbabue","value":"800 años en pie","sub":"granito apilado a seco, sin una gota de mortero","good":true}} right={{"label":"Construcción moderna","value":"necesita mortero","sub":"y refuerzo estructural para durar","good":false}} eyebrow="Gran Zimbabue" title="Sin una gota de mortero" hue="blue" /> },
  { key: "nazca_1_a", start: 134.22, dur: 4.23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/nazca_1.png" hue="amber" darken={0.14} kbPhase={1} /> },
  { key: "nazca_1_b", start: 138.45, dur: 4.23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/nazca_1.png" hue="amber" darken={0.14} kbPhase={2} /> },
  { key: "nazca_1_c", start: 142.68, dur: 4.22, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/nazca_1.png" hue="amber" darken={0.14} kbPhase={3} /> },
  { key: "c_nazca_num", start: 146.9, dur: 5.6, kind: "numcard", el: (d) => <NumberCard durationInFrames={d} number="300" name="metros de largo" eyebrow="Líneas de Nazca" total="solo se entiende desde el aire" /> },
  { key: "c_nazca_checklist", start: 153.64, dur: 5.6, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Las figuras de Nazca" items={[{"text":"Un colibrí de decenas de metros"},{"text":"Una araña gigante"},{"text":"Un mono de 300 metros de largo"}]} hue="amber" /> },
  { key: "c_nazca_quote", start: 163.58, dur: 5.8, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/nazca_3.png" eyebrow="Líneas de Nazca" words={parseQuote("Alguien que dedica su vida a un *dibujo* que nunca va a poder *mirar*.")} accent="amber" hue="amber" fontSize={92} /> },
  { key: "c_atacama_num", start: 175.06, dur: 5.4, kind: "numcard", el: (d) => <NumberCard durationInFrames={d} number="1000+" name="años de antigüedad" eyebrow="Geoglifos de Atacama" total="marcando rutas comerciales" /> },
  { key: "atacama_2", start: 194.7, dur: 6.04, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/atacama_2.png" hue="amber" darken={0.14} /> },
  { key: "gobekli_1_a", start: 200.74, dur: 3.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/gobekli_1.png" hue="amber" darken={0.14} kbPhase={1} /> },
  { key: "gobekli_1_b", start: 204.72, dur: 3.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/gobekli_1.png" hue="amber" darken={0.14} kbPhase={2} /> },
  { key: "c_gobekli_bars", start: 208.7, dur: 6.6, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Göbekli Tepe","value":11600},{"label":"La rueda","value":6000},{"label":"La escritura","value":5200},{"label":"Stonehenge","value":5000}]} eyebrow="Turquía · 6.000 años antes que Stonehenge" title="Qué es más viejo que Göbekli Tepe" unit="años atrás" hue="amber" /> },
  { key: "gobekli_3_a", start: 225.3, dur: 4.91, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/gobekli_3.png" hue="amber" darken={0.14} kbPhase={1} /> },
  { key: "gobekli_3_b", start: 230.21, dur: 4.91, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/gobekli_3.png" hue="amber" darken={0.14} kbPhase={2} /> },
  { key: "c_newgrange_num", start: 235.12, dur: 5.4, kind: "numcard", el: (d) => <NumberCard durationInFrames={d} number="5000" name="años de precisión astronómica" eyebrow="Newgrange, Irlanda" total="más vieja que Stonehenge" /> },
  { key: "c_newgrange_aged", start: 249.36, dur: 6.6, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Newgrange, Irlanda" lines={[{"text":"Cámara de piedra sellada"},{"text":"Solsticio de invierno: el sol entra exacto","mark":true},{"text":"Construida hace más de 5.000 años"}]} eyebrow="Una sola vez al año" image="img/newgrange_2.png" hue="cold" /> },
  { key: "carnac_1_a", start: 264.84, dur: 5.31, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/carnac_1.png" hue="blue" darken={0.14} kbPhase={1} /> },
  { key: "carnac_1_b", start: 270.15, dur: 5.31, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/carnac_1.png" hue="blue" darken={0.14} kbPhase={2} /> },
  { key: "carnac_1_c", start: 275.46, dur: 5.32, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/carnac_1.png" hue="blue" darken={0.14} kbPhase={3} /> },
  { key: "silbury_1_a", start: 280.78, dur: 4.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/silbury_1.png" hue="blue" darken={0.14} kbPhase={1} /> },
  { key: "silbury_1_b", start: 285.37, dur: 4.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/silbury_1.png" hue="blue" darken={0.14} kbPhase={2} /> },
  { key: "silbury_1_c", start: 289.96, dur: 4.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/silbury_1.png" hue="blue" darken={0.14} kbPhase={3} /> },
  { key: "silbury_1_undefined", start: 294.55, dur: 4.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/silbury_1.png" hue="blue" darken={0.14} kbPhase={4} /> },
  { key: "rehook_1_a", start: 299.14, dur: 4.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rehook_1.png" hue="amber" darken={0.14} kbPhase={1} /> },
  { key: "rehook_1_b", start: 303.76, dur: 4.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rehook_1.png" hue="amber" darken={0.14} kbPhase={2} /> },
  { key: "rehook_1_c", start: 308.38, dur: 4.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rehook_1.png" hue="amber" darken={0.14} kbPhase={3} /> },
  { key: "rehook_1_undefined", start: 313, dur: 4.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rehook_1.png" hue="amber" darken={0.14} kbPhase={4} /> },
  { key: "derinkuyu_1_a", start: 317.62, dur: 5.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/derinkuyu_1.png" hue="amber" darken={0.14} kbPhase={1} /> },
  { key: "derinkuyu_1_b", start: 323.6, dur: 5.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/derinkuyu_1.png" hue="amber" darken={0.14} kbPhase={2} /> },
  { key: "c_derinkuyu_process", start: 329.58, dur: 7.2, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Entrada","desc":"un pozo angosto en la superficie"},{"title":"Establos y bodegas","desc":"los primeros niveles"},{"title":"Capillas","desc":"más abajo todavía"},{"title":"Puerta circular","desc":"se cerraba solo desde adentro"}]} eyebrow="Capadocia, Turquía" title="Derinkuyu, ciudad bajo tierra" hue="amber" /> },
  { key: "c_derinkuyu_quote", start: 336.78, dur: 5, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/derinkuyu_3.png" eyebrow="Derinkuyu, Turquía" words={parseQuote("La construyeron para *esconderse* de algo.")} accent="amber" hue="amber" fontSize={96} /> },
  { key: "pumapunku_1", start: 348.26, dur: 4.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/pumapunku_1.png" hue="cold" darken={0.14} /> },
  { key: "c_pumapunku_vs", start: 353.24, dur: 6, kind: "vs", el: (d) => <VsCard durationInFrames={d} left={{"label":"El corte de los bloques","value":"ángulos rectos tipo máquina","sub":"precisión casi milimétrica","good":false}} right={{"label":"Herramientas de la época","value":"sin metales duros","sub":"ni herramientas de precisión conocidas","good":false}} eyebrow="Puma Punku, Bolivia" title="Precisión imposible" hue="cold" /> },
  { key: "pumapunku_3", start: 368.96, dur: 5.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/pumapunku_3.png" hue="cold" darken={0.14} /> },
  { key: "machupicchu_1_a", start: 374.7, dur: 5.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/machupicchu_1.png" hue="blue" darken={0.14} kbPhase={1} /> },
  { key: "machupicchu_1_b", start: 379.94, dur: 5.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/machupicchu_1.png" hue="blue" darken={0.14} kbPhase={2} /> },
  { key: "c_machupicchu_num", start: 385.18, dur: 5.4, kind: "numcard", el: (d) => <NumberCard durationInFrames={d} number="0" name="mm entre bloques" eyebrow="Machu Picchu, Perú" total="sin argamasa" /> },
  { key: "machupicchu_3", start: 392.56, dur: 7.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/machupicchu_3.png" hue="blue" darken={0.14} /> },
  { key: "sacsayhuaman_1", start: 399.76, dur: 3.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sacsayhuaman_1.png" hue="blue" darken={0.14} /> },
  { key: "c_sacsayhuaman_num", start: 403.46, dur: 5.6, kind: "numcard", el: (d) => <NumberCard durationInFrames={d} number="100+" name="toneladas por bloque" eyebrow="Sacsayhuamán, Cusco" total="cuesta arriba, sin explicación" /> },
  { key: "c_tiwanaku_map", start: 415.46, dur: 5.8, kind: "mapzoom", el: (d) => <VintageMapZoom durationInFrames={d} image="img/tiwanaku_1.png" pinX={0.3} pinY={0.62} label="Tiwanaku · Bolivia" eyebrow="A orillas del lago Titicaca" zoom={1.1} /> },
  { key: "yonaguni_1_a", start: 436.56, dur: 4.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/yonaguni_1.png" hue="cold" darken={0.14} kbPhase={1} /> },
  { key: "yonaguni_1_b", start: 441.24, dur: 4.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/yonaguni_1.png" hue="cold" darken={0.14} kbPhase={2} /> },
  { key: "yonaguni_1_c", start: 445.92, dur: 4.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/yonaguni_1.png" hue="cold" darken={0.14} kbPhase={3} /> },
  { key: "c_yonaguni_vs", start: 450.6, dur: 6.4, kind: "vs", el: (d) => <VsCard durationInFrames={d} left={{"label":"Hipótesis natural","value":"arenisca que se fractura sola","sub":"así lo explican algunos geólogos","good":true}} right={{"label":"Hipótesis artificial","value":"terrazas demasiado perfectas","sub":"para ser puro azar geológico","good":false}} eyebrow="Monumento de Yonaguni, Japón" title="¿Natural o construido?" hue="cold" /> },
  { key: "c_bimini_aged", start: 460.7, dur: 6, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Camino de Bimini, Bahamas" lines={[{"text":"Bloques rectangulares bajo el agua"},{"text":"Parece una calle empedrada","mark":true},{"text":"La mayoría de los geólogos: formación natural"}]} eyebrow="Bajo el agua" image="img/bimini_1.png" hue="cold" /> },
  { key: "bermuda_1_a", start: 475.56, dur: 5.49, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bermuda_1.png" hue="cold" darken={0.14} kbPhase={1} /> },
  { key: "bermuda_1_b", start: 481.05, dur: 5.49, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bermuda_1.png" hue="cold" darken={0.14} kbPhase={2} /> },
  { key: "c_bermuda_stat", start: 486.54, dur: 5.8, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={0} prefix="+" suffix="% extra" label="desapariciones vs. otras rutas marítimas" eyebrow="Triángulo de las Bermudas" accent="cold" hue="cold" /> },
  { key: "c_baltico_map", start: 503.06, dur: 5.8, kind: "mapzoom", el: (d) => <VintageMapZoom durationInFrames={d} image="img/baltico_1.png" pinX={0.55} pinY={0.35} label="Anomalía del Báltico" eyebrow="Entre Suecia y Finlandia" zoom={1.1} /> },
  { key: "pascua_1_a", start: 525.82, dur: 5.65, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/pascua_1.png" hue="amber" darken={0.14} kbPhase={1} /> },
  { key: "pascua_1_b", start: 531.47, dur: 5.65, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/pascua_1.png" hue="amber" darken={0.14} kbPhase={2} /> },
  { key: "c_pascua_chips", start: 537.12, dur: 5.6, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/pascua_2.png" title="Los Moái de Isla de Pascua" chips={["cuerpo enterrado hasta el cuello","varias toneladas cada uno","isla sin un solo árbol"]} hue="amber" /> },
  { key: "pascua_3_a", start: 543.54, dur: 5.42, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/pascua_3.png" hue="amber" darken={0.14} kbPhase={1} /> },
  { key: "pascua_3_b", start: 548.96, dur: 5.42, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/pascua_3.png" hue="amber" darken={0.14} kbPhase={2} /> },
  { key: "pascua_3_c", start: 554.38, dur: 5.42, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/pascua_3.png" hue="amber" darken={0.14} kbPhase={3} /> },
  { key: "c_malta_bars", start: 559.8, dur: 6, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Templos de Malta","value":5600},{"label":"Pirámides de Egipto","value":4500},{"label":"Stonehenge","value":5000}]} eyebrow="Templos de Malta" title="Más viejos que las pirámides" unit="años de antigüedad" hue="amber" /> },
  { key: "c_nanmadol_chips", start: 584.42, dur: 5.6, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/nanmadol_1.png" title="Nan Madol, Micronesia" chips={["casi 100 islotes artificiales","columnas de basalto de toneladas","la 'ciudad de los espíritus'"]} hue="blue" /> },
  { key: "c_skarabrae_quote", start: 608.82, dur: 5.8, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/skarabrae_1.png" eyebrow="Skara Brae, Escocia" words={parseQuote("Una *tormenta* de 1850 mostró en un día lo que nadie había visto en *miles de años*.")} accent="cold" hue="cold" fontSize={88} /> },
  { key: "longyou_1_a", start: 637.24, dur: 5.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/longyou_1.png" hue="amber" darken={0.14} kbPhase={1} /> },
  { key: "longyou_1_b", start: 642.32, dur: 5.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/longyou_1.png" hue="amber" darken={0.14} kbPhase={2} /> },
  { key: "longyou_1_c", start: 647.4, dur: 5.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/longyou_1.png" hue="amber" darken={0.14} kbPhase={3} /> },
  { key: "longyou_1_undefined", start: 652.48, dur: 5.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/longyou_1.png" hue="amber" darken={0.14} kbPhase={4} /> },
  { key: "longyou_1_undefined", start: 657.56, dur: 5.06, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/longyou_1.png" hue="amber" darken={0.14} kbPhase={5} /> },
  { key: "c_asia_split", start: 662.62, dur: 6.4, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Tres sitios, un mismo misterio" items={["Longyou (China): cuevas talladas sin un solo registro histórico","Mohenjo-Daro (Pakistán): cañerías más avanzadas que ciudades de hace un siglo","Gunung Padang (Indonesia): antigüedad todavía en discusión"]} accent={A} /> },
  { key: "gunungpadang_1_a", start: 677.18, dur: 5.77, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/gunungpadang_1.png" hue="blue" darken={0.14} kbPhase={1} /> },
  { key: "gunungpadang_1_b", start: 682.95, dur: 5.77, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/gunungpadang_1.png" hue="blue" darken={0.14} kbPhase={2} /> },
  { key: "gunungpadang_1_c", start: 688.72, dur: 5.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/gunungpadang_1.png" hue="blue" darken={0.14} kbPhase={3} /> },
  { key: "rehook_2_a", start: 694.5, dur: 3.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rehook_2.png" hue="blue" darken={0.14} kbPhase={1} /> },
  { key: "rehook_2_b", start: 698.46, dur: 3.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rehook_2.png" hue="blue" darken={0.14} kbPhase={2} /> },
  { key: "angkor_1", start: 702.42, dur: 3.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/angkor_1.png" hue="blue" darken={0.14} /> },
  { key: "c_angkor_process", start: 706.4, dur: 6.6, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Semilla","desc":"cae sobre la piedra del templo"},{"title":"Raíz","desc":"se cuela entre las juntas"},{"title":"Crecimiento","desc":"la raíz se vuelve tronco"},{"title":"Fusión","desc":"el árbol es parte del muro"}]} eyebrow="Camboya" title="Cómo la selva se comió Angkor" hue="blue" /> },
  { key: "c_angkor_quote", start: 726.14, dur: 5.4, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/angkor_3.png" eyebrow="Angkor, Camboya" words={parseQuote("Nunca se había *perdido* para ellos.")} accent="accent" hue="blue" fontSize={92} /> },
  { key: "c_cierre_journey", start: 731.54, dur: 7, kind: "journey", el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="El recorrido sigue" title="De Angkor a las ruinas Maya" dark waypoints={[{"x":0.28,"y":0.42,"z":0,"image":"img/angkor_1.png","label":"Angkor, Camboya","num":"1","dwell":2.6,"travel":1.6},{"x":0.72,"y":0.55,"z":0.3,"image":"img/jemermaya_1.png","label":"Ruinas Maya, México","num":"2","dwell":2.6,"travel":1.6}]} /> },
  { key: "close_hook_darvaza1", start: 738.54, dur: 1.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hook_darvaza1.png" hue="amber" darken={0.35} /> },
  { key: "close_stonehenge_1", start: 739.84, dur: 1.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/stonehenge_1.png" hue="amber" darken={0.35} /> },
  { key: "close_nazca_1", start: 741.14, dur: 1.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/nazca_1.png" hue="amber" darken={0.35} /> },
  { key: "close_machupicchu_1", start: 742.44, dur: 1.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/machupicchu_1.png" hue="amber" darken={0.35} /> },
  { key: "close_angkor_1", start: 743.74, dur: 1.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/angkor_1.png" hue="amber" darken={0.35} /> },
  { key: "close_card", start: 745.04, dur: 3.94, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Seguí"},{"t":"el"},{"t":"mapa"},{"t":"—"},{"t":"suscribite","hl":true}]} eyebrow="Quedan muchos lugares más en el mapa" hue="amber" bg="image" image="img/hook_darvaza1.png" /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [

];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = null;

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = [{"at":0,"role":"popUp","vol":0.32},{"at":49.22,"role":"popUp","vol":0.32},{"at":55.22,"role":"popUp","vol":0.32},{"at":83.8,"role":"popUp","vol":0.32},{"at":115.4,"role":"popUp","vol":0.32},{"at":146.9,"role":"popUp","vol":0.32},{"at":153.64,"role":"popUp","vol":0.32},{"at":163.58,"role":"popUp","vol":0.32},{"at":175.06,"role":"popUp","vol":0.32},{"at":208.7,"role":"popUp","vol":0.32},{"at":235.12,"role":"popUp","vol":0.32},{"at":249.36,"role":"popUp","vol":0.32},{"at":329.58,"role":"popUp","vol":0.32},{"at":336.78,"role":"popUp","vol":0.32},{"at":353.24,"role":"popUp","vol":0.32},{"at":385.18,"role":"popUp","vol":0.32},{"at":403.46,"role":"popUp","vol":0.32},{"at":415.46,"role":"popUp","vol":0.32},{"at":450.6,"role":"popUp","vol":0.32},{"at":460.7,"role":"popUp","vol":0.32},{"at":486.54,"role":"popUp","vol":0.32},{"at":503.06,"role":"popUp","vol":0.32},{"at":537.12,"role":"popUp","vol":0.32},{"at":559.8,"role":"popUp","vol":0.32},{"at":584.42,"role":"popUp","vol":0.32},{"at":608.82,"role":"popUp","vol":0.32},{"at":662.62,"role":"popUp","vol":0.32},{"at":706.4,"role":"popUp","vol":0.32},{"at":726.14,"role":"popUp","vol":0.32},{"at":731.54,"role":"popUp","vol":0.32},{"at":745.04,"role":"popUp","vol":0.32}];
