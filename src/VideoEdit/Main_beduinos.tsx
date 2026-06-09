import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { Video } from "@remotion/media";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { StatBig } from "./scenes/DataViz";
import { OptionCompare } from "./scenes/OptionCompare";
import { ReframeList, ChipsCluster } from "./scenes/ReframeContent";
import { PhotoScene, PhotoCards, QuoteScene, CheckList } from "./BeduinoKit";
import { BarCompare } from "./scenes/BarCompare";
import { CrossSection } from "./scenes/CrossSection";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { CalloutMark } from "./scenes/CalloutMark";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { AvatarPresentation } from "./scenes/AvatarPresentation";

// Video beduino — 25:12. Avatar 1080p30 en public/beduinos.mp4 (su audio es la
// pista). Escenas full-screen como overlays; en ventanas REFRAME el avatar se
// achica a una tarjeta a la derecha y aparece una lista a la izquierda.
export const TOTAL_FRAMES_BED = Math.round(1512.7 * 30);

const A = COLORS.amber;
const G = COLORS.good;
const D = COLORS.danger;
const B = COLORS.accent;

const REFRAME: { start: number; end: number }[] = [{ start: 76, end: 88 }];

type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

const CUES: Cue[] = [
  // ---------- INTRO (0:00–2:06) ----------
  { key: "i1", start: 0.4, dur: 5.0, el: (d) => <PhotoScene durationInFrames={d} n="001" hue="amber" kicker="55°C afuera" caption="Los beduinos viven en el desierto más caliente del planeta" /> },
  { key: "i2", start: 5.6, dur: 5.4, el: (d) => <PhotoScene durationInFrames={d} n="002" hue="amber" kicker="−12° adentro" caption="Sus tiendas son 8 a 12° más frescas que el exterior" /> },
  { key: "i3", start: 11.2, dur: 5.4, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="El secreto" size={88} tokens={[{ t: "Con" }, { t: "TELA", hl: true }, { t: "—" }, { t: "no" }, { t: "con" }, { t: "tecnología", danger: true }]} /> },
  { key: "i4", start: 17.0, dur: 6.0, el: (d) => <CalloutMark durationInFrames={d} eyebrow="Grabado en el cuerpo" figure="4000" caption="años entendiendo el calor del desierto" image="bed/004.jpg" accent="amber" hue="amber" /> },
  { key: "i5", start: 33.4, dur: 7.4, el: (d) => <StatBig durationInFrames={d} to={4} prefix="$" label="La versión moderna" caption="Hasta $800–1000 de ahorro este verano" icon="moneyup" accent="good" hue="amber" /> },
  { key: "i6", start: 99.0, dur: 7.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="La física" size={84} tokens={[{ t: "El" }, { t: "calor" }, { t: "no" }, { t: "se" }, { t: "BLOQUEA", danger: true }, { t: "—" }, { t: "se" }, { t: "MUEVE", hl: true }]} /> },
  { key: "i7", start: 88.5, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} n="005" hue="amber" kicker="El beduino hace lo opuesto" caption="Abre. Pero de forma controlada." /> },
  { key: "i8", start: 76.0, dur: 12.0, el: (d) => <ReframeList durationInFrames={d} eyebrow="Instinto equivocado" title="Cuando tenés calor, cerrás…" accent={D} items={[{ text: "Las ventanas", cross: true }, { text: "Las persianas", cross: true }, { text: "La puerta", cross: true }]} /> },
  { key: "i9", start: 114.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} n="034" kicker="La estrategia" caption="Crear un camino para el calor y traer aire fresco" /> },

  // ---------- MATERIALES (2:06–2:44) ----------
  { key: "m1", start: 126.5, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Los materiales" size={92} tokens={[{ t: "Solo" }, { t: "3" }, { t: "cosas." }, { t: "$4", good: true }]} /> },
  { key: "m2", start: 138.0, dur: 9.5, el: (d) => <PhotoCards durationInFrames={d} title="Todo lo que necesitás" items={[{ n: "022", label: "Tela de tejido abierto", caption: "muselina o gasa · $1–2/m", accent: A }, { n: "026", label: "Agua", caption: "la del grifo sirve", accent: B }, { n: "008", label: "Cuerda o ganchos", caption: "para colgarla", accent: G }]} /> },
  { key: "m3", start: 159.0, dur: 6.5, el: (d) => <StatBig durationInFrames={d} to={4} prefix="$" label="Costo total" caption="entre 3 y 4 dólares, una sola vez" icon="moneyup" accent="good" hue="blue" /> },

  // ---------- ANÉCDOTA (2:48–6:12) ----------
  { key: "a1", start: 168.5, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="015" hue="amber" kicker="Hace unos años" caption="Un verano en una ciudad del interior" /> },
  { key: "a2", start: 178.0, dur: 6.5, el: (d) => <StatBig durationInFrames={d} to={42} suffix="°C" label="Adentro de mi departamento" caption="primer piso, techo de chapa, sol directo" icon="warn" accent="danger" hue="red" /> },
  { key: "a3", start: 190.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="038" kicker="Aire portátil" caption="Ruido constante y poco fresco" /> },
  { key: "a4", start: 200.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="042" hue="red" kicker="La factura" caption="La más alta que pagué en mi vida" /> },
  { key: "a5", start: 206.5, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="010" kicker="Una visita" caption="El padre de un amigo — años en el norte de África" /> },
  { key: "a6", start: 248.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} n="023" kicker="Mojala y colgala" caption="Frente a la ventana principal, al oeste" /> },
  { key: "a7", start: 260.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} n="028" kicker="Corriente cruzada" caption="Una ventana abierta en cada extremo" /> },
  { key: "a8", start: 276.0, dur: 6.0, el: (d) => <StatBig durationInFrames={d} to={10} suffix=" min" label="El resultado" caption="La temperatura bajó de forma perceptible" icon="check" accent="good" hue="blue" /> },
  { key: "a9", start: 295.0, dur: 7.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Lo que me explicó" size={84} tokens={[{ t: "Entra" }, { t: "FRESCO", good: true }, { t: "—" }, { t: "sale" }, { t: "CALIENTE", danger: true }]} /> },
  { key: "a10", start: 308.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} n="030" kicker="Como soplar la sopa" caption="No enfría el aliento: enfría la evaporación" /> },
  { key: "a11", start: 321.5, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} n="004" kicker="Tejido abierto" caption="Deja pasar el aire pero lo ralentiza" /> },
  { key: "a12", start: 342.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="003" hue="amber" kicker="Dentro de la tienda" caption="Varios grados menos que el desierto" /> },

  // ---------- SISTEMA · 4 PRINCIPIOS (6:12–11:11) ----------
  { key: "s0", start: 372.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Ahora el sistema" size={92} tokens={[{ t: "4" }, { t: "principios." }, { t: "Paso" }, { t: "a" }, { t: "paso.", hl: true }]} /> },
  { key: "p1", start: 383.0, dur: 7.0, el: (d) => <RuleNumberScene durationInFrames={d} number="01" label="PRINCIPIO" title="La corriente de aire" hue="blue" /> },
  { key: "p1a", start: 403.0, dur: 6.0, el: (d) => <AnnotatedImage durationInFrames={d} eyebrow="La corriente" image="bed/034.jpg" hue="amber" annotations={[{ kind: "arrow", x: 0.32, y: 0.56, fromX: 0.05, fromY: 0.62, label: "Entra fresco", color: "good" }, { kind: "arrow", x: 0.95, y: 0.40, fromX: 0.70, fromY: 0.50, label: "Sale caliente", color: "danger" }]} /> },
  { key: "sys", start: 412.0, dur: 16.0, el: (d) => <AvatarPresentation durationInFrames={d} eyebrow="El sistema" hue="amber" accent="amber" avatar="beduinos.mp4" avatarFrom={sec(412)} slides={[{ image: "img/bed_sistema.png", title: "El sistema beduino", note: "4 principios, una tela y agua" }, { image: "img/bed_ventilacion.png", title: "Ventilación cruzada", note: "Entra fresco, sale el calor" }]} /> },
  { key: "p1b", start: 443.0, dur: 7.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="El ciclo" size={82} tokens={[{ t: "Calor" }, { t: "ARRIBA", danger: true }, { t: "·" }, { t: "fresco" }, { t: "ABAJO", good: true }]} /> },
  { key: "p2", start: 468.0, dur: 7.0, el: (d) => <RuleNumberScene durationInFrames={d} number="02" label="PRINCIPIO" title="La posición de la tela" hue="amber" /> },
  { key: "p2a", start: 486.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="022" kicker="¿Por dónde entra el viento?" caption="Una vela cerca de la ventana te lo dice" /> },
  { key: "p2b", start: 500.0, dur: 6.0, el: (d) => <StatBig durationInFrames={d} to={70} suffix="%" label="Cubrí la ventana" caption="para forzar el aire a pasar por la tela" icon="check" accent="good" hue="amber" /> },
  { key: "p2c", start: 528.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="063" kicker="Ni denso ni muy abierto" caption="Muselina o gasa: el tejido ideal" /> },
  { key: "p3", start: 541.0, dur: 7.0, el: (d) => <RuleNumberScene durationInFrames={d} number="03" label="PRINCIPIO" title="La humedad de la tela" hue="blue" /> },
  { key: "p3a", start: 558.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="024" kicker="Húmeda, no empapada" caption="Si gotea, el agua cae sin evaporarse" /> },
  { key: "p3b", start: 567.0, dur: 8.0, el: (d) => <ProcessSteps durationInFrames={d} eyebrow="Paso a paso" title="Cómo prepararla" orientation="vertical" accent="good" hue="blue" steps={[{ title: "Mojá la tela", desc: "toda la pieza, bien" }, { title: "Escurrí", desc: "hasta que no gotee" }, { title: "Colgala", desc: "en la entrada de aire" }]} /> },
  { key: "p3c", start: 580.0, dur: 6.0, el: (d) => <StatBig durationInFrames={d} from={2} to={4} suffix=" h" label="Volvé a humedecer" caption="cada 2–4 h en calor seco" icon="calendar" accent="neutral" hue="blue" /> },
  { key: "p4", start: 597.0, dur: 7.0, el: (d) => <RuleNumberScene durationInFrames={d} number="04" label="PRINCIPIO" title="El momento del día" hue="amber" /> },
  { key: "p4a", start: 615.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="019" kicker="De noche" caption="Abrí todo: máxima ventilación" /> },
  { key: "p4b", start: 625.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="013" kicker="Paredes = baterías térmicas" caption="De noche absorben el fresco" /> },
  { key: "p4c", start: 654.0, dur: 9.0, el: (d) => <OptionCompare durationInFrames={d} left={{ tag: "DÍA", title: "Tela húmeda", sub: "Corriente dirigida", note: "Entra fresco, sale el calor", icon: "window", accent: A }} right={{ tag: "NOCHE", title: "Ventilación total", sub: "Enfriás la masa térmica", note: "Preparás el día siguiente", icon: "calendar", accent: B }} /> },

  // ---------- ACUMULACIÓN + OBSERVACIÓN (11:11–12:12) ----------
  { key: "o1", start: 671.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Una semana" size={92} tokens={[{ t: "El" }, { t: "efecto" }, { t: "se" }, { t: "ACUMULA", good: true }]} /> },
  { key: "o2", start: 682.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="006" hue="amber" kicker="Ellos lo viven desde que nacen" caption="Saben cuándo abrir y cuándo cerrar" /> },
  { key: "o3", start: 711.0, dur: 16.0, el: (d) => <CheckList durationInFrames={d} title="Una semana de observación" items={["Cómo entra el sol", "Por dónde entra el viento", "Cuándo calientan las paredes", "Cuándo afuera es más fresco"]} accent={B} n="032" /> },

  // ---------- CTA SUSCRIPCIÓN (12:12–12:53) ----------
  { key: "c1", start: 733.0, dur: 7.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Pausa de 10 segundos" size={76} hue="amber" tokens={[{ t: "Suscribite" }, { t: "y" }, { t: "contá" }, { t: "tu" }, { t: "caso", good: true }, { t: "abajo", good: true }]} /> },
  { key: "c2", start: 742.0, dur: 8.0, el: (d) => <CheckList durationInFrames={d} title="Dejá en los comentarios" items={["De dónde sos", "Tu temperatura máxima en verano", "Si ya probaste algo así"]} accent={B} /> },

  // ---------- DINERO (12:53–15:09) ----------
  { key: "d1", start: 773.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="043" hue="amber" kicker="Hablemos de dinero" caption="¿De dónde sale el ahorro de $1000?" /> },
  { key: "d2", start: 783.0, dur: 6.0, el: (d) => <StatBig durationInFrames={d} from={900} to={2000} suffix=" W" label="Consumo de un aire" caption="900 a 2000 vatios por hora" icon="warn" accent="danger" hue="red" /> },
  { key: "d3", start: 790.5, dur: 6.5, el: (d) => <StatBig durationInFrames={d} to={720} suffix=" h" label="8 h/día · 3 meses" caption="horas de uso en un verano" icon="calendar" accent="neutral" hue="amber" /> },
  { key: "d4", start: 798.5, dur: 7.0, el: (d) => <StatBig durationInFrames={d} to={864} suffix=" kWh" label="Solo el aire acondicionado" caption="× 1200 W de consumo promedio" icon="bills" accent="danger" hue="red" /> },
  { key: "d5", start: 810.5, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="049" kicker="Tarifa residencial" caption="15 a 20 ¢ por kWh en LatAm y España" /> },
  { key: "d6", start: 824.0, dur: 6.0, el: (d) => <StatBig durationInFrames={d} to={170} prefix="$" label="Un solo equipo" caption="720 h a 20 ¢/kWh" icon="bills" accent="amber" hue="amber" /> },
  { key: "d7", start: 834.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="040" hue="red" kicker="Pero casi nadie tiene uno" caption="La mayoría: 2 o 3 equipos" /> },
  { key: "d8", start: 846.0, dur: 9.5, el: (d) => <BarCompare durationInFrames={d} eyebrow="En un verano" title="Lo que pagás de aire" orientation="horizontal" hue="red" accent="amber" bars={[{ label: "1 equipo", value: 170, display: "$170", tone: "accent" }, { label: "2 equipos · 12h", value: 600, display: "$600", tone: "amber" }, { label: "3 equipos", value: 1000, display: "$1000", tone: "danger" }]} /> },
  { key: "d9", start: 874.0, dur: 7.0, el: (d) => <StatBig durationInFrames={d} from={250} to={500} prefix="$" label="Si reducís a la mitad" caption="ahorrás $250 a $500 por verano" icon="moneyup" accent="good" hue="blue" /> },
  { key: "d10", start: 885.0, dur: 7.0, el: (d) => <StatBig durationInFrames={d} to={1000} prefix="$" label="Si lo eliminás casi del todo" caption="el ahorro llega a $800–1000" icon="moneyup" accent="good" hue="blue" /> },
  { key: "d11", start: 894.0, dur: 5.5, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="No es promesa" size={104} tokens={[{ t: "Es" }, { t: "MATEMÁTICA", good: true }]} /> },
  { key: "d12", start: 900.5, dur: 8.0, el: (d) => <PhotoCards durationInFrames={d} title="Todo por:" items={[{ n: "050", label: "$4 una vez", caption: "inversión única", accent: G }, { n: "026", label: "Agua del grifo", caption: "costo cero", accent: B }, { n: "001", label: "4000 años", caption: "de conocimiento", accent: A }]} /> },

  // ---------- BEDUINOS MÁS PROFUNDO (15:09–17:34) ----------
  { key: "b1", start: 909.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="002" hue="amber" kicker="No es un truco" caption="Es un sistema completo de relación con el calor" /> },
  { key: "b2", start: 924.0, dur: 8.0, el: (d) => <ChipsCluster durationInFrames={d} title="Debajo de la tela hay:" hue="blue" chips={["sombra", "movimiento", "tiempo", "orientación", "materiales"]} /> },
  { key: "b3", start: 939.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="036" kicker="Adaptan su ritmo" caption="Duermen en el pico de calor, activos de madrugada" /> },
  { key: "b4", start: 963.0, dur: 7.5, el: (d) => <PhotoCards durationInFrames={d} title="Movélas a la hora fresca" items={[{ n: "072", label: "Ejercicio", accent: A }, { n: "070", label: "Cocinar", accent: D }, { n: "071", label: "Lavar", accent: B }]} /> },
  { key: "b5", start: 984.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="065" hue="red" kicker="Un TV en una pieza vacía" caption="suma 2 a 4° en pocas horas" /> },
  { key: "b6", start: 993.0, dur: 5.5, el: (d) => <PhotoScene durationInFrames={d} n="068" kicker="Apagá lo que no usás" caption="No es solo ahorro: es manejo térmico" /> },
  { key: "b7", start: 999.5, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="058" hue="amber" kicker="La ropa importa" caption="Larga, suelta, de fibra natural" /> },
  { key: "b8", start: 1018.0, dur: 9.0, el: (d) => <OptionCompare durationInFrames={d} left={{ tag: "MAL", title: "Remera ajustada", sub: "Algodón húmedo de sudor", note: "Pega a la piel, no evapora", icon: "x", accent: D }} right={{ tag: "BIEN", title: "Camisa suelta de lino", sub: "Cámara de aire", note: "Mantiene el microclima", icon: "check", accent: G }} /> },

  // ---------- CIERRE EMOCIONAL 1 (17:20–18:47) ----------
  { key: "e1", start: 1040.0, dur: 9.0, el: (d) => <OptionCompare durationInFrames={d} left={{ tag: "SOFOCA", title: "Casa cerrada", sub: "Combatir con electricidad", note: "Más factura, mismo calor", icon: "tired", accent: D }} right={{ tag: "RESPIRA", title: "Casa abierta", sub: "Entender el calor", note: "Fresca y casi gratis", icon: "health", accent: G }} /> },
  { key: "e2", start: 1054.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="010" kicker="Antes de irse" caption="Me dijo algo que no entendí en ese momento" /> },
  { key: "e3", start: 1067.0, dur: 11.0, el: (d) => <QuoteScene durationInFrames={d} n="023" quote="El aire acondicionado no te enseña nada sobre el calor. Solo te esconde de él." attribution="El padre de mi amigo" accent={A} /> },
  { key: "e4", start: 1086.0, dur: 8.0, el: (d) => <CheckList durationInFrames={d} title="Ese verano aprendí" items={["Cuándo entra el sol", "Cuándo irradian las paredes", "Por dónde se mueve el aire"]} accent={G} n="017" /> },
  { key: "e5", start: 1106.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Eso es todo" size={84} tokens={[{ t: "Cuatro" }, { t: "dólares" }, { t: "y" }, { t: "CONOCIMIENTO", good: true }]} /> },

  // ---------- BONUS · CALOR EXTREMO / CAPAS (18:47–20:48) ----------
  { key: "x1", start: 1127.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Un bonus" size={92} hue="red" tokens={[{ t: "Para" }, { t: "el" }, { t: "calor" }, { t: "EXTREMO", danger: true }]} /> },
  { key: "x2", start: 1140.0, dur: 6.0, el: (d) => <StatBig durationInFrames={d} to={40} suffix="°C" label="Días de calor extremo" caption="incluso la evaporación tiene un límite" icon="warn" accent="danger" hue="red" /> },
  { key: "x3", start: 1167.0, dur: 6.0, el: (d) => <CrossSection durationInFrames={d} eyebrow="Calor extremo" title="Capas en serie" hue="amber" layers={[{ label: "Tela exterior húmeda", depth: "1ª barrera", color: "#9C6B3B", weight: 1 }, { label: "Espacio intermedio", depth: "porche / galería", color: "#7E5A36", weight: 1.2 }, { label: "Tela en tu ventana", depth: "2ª barrera", color: "#5F4527", weight: 1 }, { label: "Interior fresco", depth: "8–12° menos", color: "#3C5A4A", weight: 1.4 }]} marker={{ label: "Aire", atDepth: 0.5, color: "accent" }} /> },
  { key: "x4", start: 1186.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} n="057" kicker="Espacio intermedio" caption="Porche, galería o corredor entre medio" /> },
  { key: "x5", start: 1196.0, dur: 6.0, el: (d) => <StatBig durationInFrames={d} from={8} to={12} suffix="°C" label="Doble enfriamiento" caption="hasta 8–12° menos que afuera" icon="growth" accent="good" hue="blue" /> },
  { key: "x6", start: 1207.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} n="056" kicker="En casa moderna" caption="Una tela afuera, otra en tu ventana" /> },
  { key: "x7", start: 1233.0, dur: 6.0, el: (d) => <StatBig durationInFrames={d} from={3} to={5} suffix="°C" label="Una segunda tela ($1–2)" caption="suma 3 a 5° menos" icon="moneyup" accent="good" hue="amber" /> },

  // ---------- RECAP ECONÓMICO (20:48–22:30) ----------
  { key: "r1", start: 1263.0, dur: 7.0, el: (d) => <StatBig durationInFrames={d} from={250} to={400} prefix="$" label="Incluso la mitad" caption="$250–400 sin comparación posible" icon="moneyup" accent="good" hue="blue" /> },
  { key: "r2", start: 1277.0, dur: 10.0, el: (d) => <CheckList durationInFrames={d} title="Lo que cuesta mantenerlo" items={["Cero mantenimiento", "Cero consumo eléctrico", "Cero dependencia de la red", "Cero piezas que se rompen"]} accent={G} n="030" /> },
  { key: "r3", start: 1298.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Por eso" size={78} tokens={[{ t: "Es" }, { t: "una" }, { t: "SOLUCIÓN", good: true }, { t: "no" }, { t: "un" }, { t: "PRODUCTO", hl: true }]} /> },
  { key: "r4", start: 1310.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} n="030" kicker="No se vuelve obsoleta" caption="La física de la evaporación no cambia" /> },
  { key: "r5", start: 1341.0, dur: 7.0, el: (d) => <PhotoCards durationInFrames={d} title="Esta misma noche:" items={[{ n: "022", label: "Una tela", accent: A }, { n: "026", label: "Agua", accent: B }, { n: "029", label: "Una ventana abierta", accent: G }]} /> },

  // ---------- FAQ HUMEDAD (22:30–24:18) ----------
  { key: "h1", start: 1350.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="La pregunta de siempre" size={104} hue="blue" tokens={[{ t: "¿Y" }, { t: "la" }, { t: "HUMEDAD?", hl: true }]} /> },
  { key: "h2", start: 1367.0, dur: 9.0, el: (d) => <BarCompare durationInFrames={d} eyebrow="Según humedad" title="Qué tan bien funciona" orientation="horizontal" hue="cold" accent="good" bars={[{ label: "Seco (<50%)", value: 100, display: "100%", sub: "enfriamiento neto", winner: true }, { label: "Medio (50–65%)", value: 65, display: "65%", sub: "positivo, menor", tone: "amber" }, { label: "Húmedo (>70%)", value: 30, display: "30%", sub: "poca efectividad", tone: "danger" }]} /> },
  { key: "h3", start: 1424.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="031" kicker="Zona costera húmeda" caption="Funciona, con resultados más modestos" /> },
  { key: "h4", start: 1431.5, dur: 6.0, el: (d) => <StatBig durationInFrames={d} from={2} to={4} suffix="°C" label="Solo la corriente" caption="baja 2 a 4° la sensación" icon="check" accent="good" hue="blue" /> },
  { key: "h5", start: 1441.5, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} n="019" kicker="En zonas húmedas" caption="El preenfriamiento nocturno es lo más importante" /> },

  // ---------- CIERRE · CULTURAS (24:18–25:12) ----------
  { key: "f1", start: 1458.0, dur: 5.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="En cualquier clima" size={84} tokens={[{ t: "Algo" }, { t: "del" }, { t: "sistema" }, { t: "SIRVE", good: true }]} /> },
  { key: "f2", start: 1477.0, dur: 9.0, el: (d) => <PhotoCards durationInFrames={d} title="El mismo principio, mil culturas" items={[{ n: "075", label: "Griegos", caption: "patios sombreados", accent: B }, { n: "076", label: "Andaluces", caption: "cármenes y fuentes", accent: G }, { n: "078", label: "Mexicanos", caption: "portales", accent: A }, { n: "054", label: "Tucumanos", caption: "corredores", accent: D }]} /> },
  { key: "f3", start: 1497.0, dur: 8.0, el: (d) => <CheckList durationInFrames={d} title="El principio universal" items={["Mover el aire", "Enfriar el aire con agua", "Proteger la masa térmica del sol"]} accent={G} /> },
  { key: "f4", start: 1506.5, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Cuatro dólares · 4000 años" size={130} hue="amber" tokens={[{ t: "USALOS.", good: true }]} /> },
];

const ReframedVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  let p = 0;
  for (const w of REFRAME) {
    const s = sec(w.start);
    const e = sec(w.end);
    if (frame >= s - 18 && frame <= e + 18) {
      const into = spring({ frame: frame - s, fps, config: { damping: 20, mass: 0.7 } });
      const out = spring({ frame: frame - e, fps, config: { damping: 200 } });
      p = into * (1 - out);
      break;
    }
  }

  const Wt = 720;
  const Ht = 980;
  const margin = 90;
  const xTarget = width - Wt - margin;
  const yTarget = (height - Ht) / 2;

  const boxW = interpolate(p, [0, 1], [width, Wt]);
  const boxH = interpolate(p, [0, 1], [height, Ht]);
  const boxX = interpolate(p, [0, 1], [0, xTarget]);
  const boxY = interpolate(p, [0, 1], [0, yTarget]);
  const radius = interpolate(p, [0, 1], [0, 40]);
  const shadow = p > 0.02 ? `0 40px 100px rgba(0,0,0,${0.6 * p})` : "none";

  const ratio = 16 / 9;
  let coverW = Math.max(boxW, boxH * ratio);
  let coverH = coverW / ratio;
  const kb = interpolate(frame, [0, TOTAL_FRAMES_BED], [1.0, 1.06], { extrapolateRight: "clamp" });
  const kbMul = 1 + (kb - 1) * (1 - p);
  coverW *= kbMul;
  coverH *= kbMul;
  const offX = (boxW - coverW) / 2;
  const offY = (boxH - coverH) * 0.32;

  return (
    <div
      style={{
        position: "absolute",
        left: boxX,
        top: boxY,
        width: boxW,
        height: boxH,
        borderRadius: radius,
        overflow: "hidden",
        boxShadow: shadow,
        border: p > 0.02 ? "1px solid rgba(255,255,255,0.16)" : "none",
        willChange: "left, top, width, height",
      }}
    >
      <Video
        src={staticFile("beduinos.mp4")}
        style={{ position: "absolute", left: offX, top: offY, width: coverW, height: coverH }}
      />
    </div>
  );
};

export const MainBeduinos: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
      <ReframedVideo />
      {CUES.map((cue) => (
        <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
          {cue.el(sec(cue.dur))}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
