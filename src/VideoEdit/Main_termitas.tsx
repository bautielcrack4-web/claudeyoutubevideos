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
import { StatBig } from "./scenes/DataViz";
import { ReframeList, ChipsCluster } from "./scenes/ReframeContent";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { PhotoScene, QuoteScene } from "./MongolKit";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { CalloutMark } from "./scenes/CalloutMark";
import { TextCardReveal } from "./scenes/TextCardReveal";
import { SplitList } from "./scenes/SplitList";
import { BarCompare } from "./scenes/BarCompare";
import { OptionCompare } from "./scenes/OptionCompare";
import { ValueJourney } from "./scenes/ValueJourney";
import { CrossSection } from "./scenes/CrossSection";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { AgedDoc } from "./scenes/AgedDoc";
import { AvatarPresentation } from "./scenes/AvatarPresentation";
import { Checklist as PhotoChecklist } from "./scenes/Checklist";
import { RawShot } from "./scenes/RawShot";
import {
  TrofalaxiaDiagram,
  GutMechanism,
  SelectiveCompare,
  CostCumulative,
  WorldMapPins,
  HouseInspection,
  BoraxTimeline,
  ThreeMethods,
  SafetyGrid,
} from "./TermiteKit";
import { SfxCue, SFX, POPS } from "./components/Sfx";

// Video TERMITAS — "El polvo de $1 que mata termitas en 48 horas". 21:39.
// Presentador (avatar) hablando en public/termitas_opt.mp4 (su audio es la pista).
// Escenas full-screen como overlays; en ventanas REFRAME el avatar se achica a una
// tarjeta a la derecha y entra una lista a la izquierda. Paleta cold (grafito):
// DORADO = borax/solución · ACERO = problema/colonia · ROJO = veneno · VERDE = seguro.
export const TOTAL_FRAMES_TER = Math.round(1300 * 30); // 39000

const A = COLORS.accent; // dorado (borax)
const G = COLORS.good; // verde (seguro)
const D = COLORS.danger; // rojo (veneno/peligro)
const B = COLORS.cold; // acero (problema)

// Ventanas donde el avatar se achica a la derecha y entra una lista a la izquierda.
const REFRAME: { start: number; end: number }[] = [
  { start: 540, end: 552 },
  { start: 1224, end: 1238 },
];

type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

const CUES: Cue[] = [
  // ───────── HOOK · la caja, las vigas, el 1962 (0:00–1:48) ─────────
  // ░░ MINUTO 1 — denso, imágenes reales crudas animadas, un beat cada ~2.5-4s ░░
  { key: "m01", start: 0.4, dur: 3.2, el: (d) => <RawShot durationInFrames={d} src="vid/caja_polvo_banco_taller.mp4" hue="amber" kicker="El polvo de la caja" /> },
  { key: "m02", start: 3.6, dur: 2.4, el: (d) => <RawShot durationInFrames={d} src="vid/avatar_taller_caja.mp4" hue="amber" /> },
  { key: "m03", start: 6.0, dur: 2.4, el: (d) => <RawShot durationInFrames={d} src="img/ferreteria_estante_precio.png" hue="amber" kicker="~1000 pesos · ferretería" /> },
  { key: "m04", start: 8.4, dur: 3.6, el: (d) => <RawShot durationInFrames={d} src="vid/caja_mitad_llena_mano.mp4" hue="amber" kicker="11 años · queda la mitad" /> },
  { key: "m05", start: 12.0, dur: 2.4, el: (d) => <RawShot durationInFrames={d} src="img/vigas_galpon_tratadas.png" hue="amber" kicker="Las vigas del galpón" /> },
  { key: "m06", start: 14.4, dur: 2.2, el: (d) => <RawShot durationInFrames={d} src="img/postes_gallinero.png" hue="amber" kicker="Los postes del gallinero" /> },
  { key: "m07", start: 16.6, dur: 2.4, el: (d) => <RawShot durationInFrames={d} src="img/marcos_ventana_madera.png" hue="amber" kicker="Los marcos de las ventanas" /> },
  { key: "m08", start: 19.0, dur: 2.4, el: (d) => <RawShot durationInFrames={d} src="img/piso_deposito_herramientas.png" hue="amber" kicker="El piso del depósito" /> },
  { key: "m09", start: 21.4, dur: 2.6, el: (d) => <RawShot durationInFrames={d} src="img/viga_maestra_techo_vieja.png" hue="amber" kicker="La viga maestra" /> },
  { key: "m10", start: 24.0, dur: 4.0, el: (d) => <RawShot durationInFrames={d} src="img/viga_1962.jpg" hue="amber" kicker="Puesta en 1962" /> },
  { key: "m11", start: 28.0, dur: 3.5, el: (d) => <RawShot durationInFrames={d} src="img/viga_intacta_macro.png" hue="amber" kicker="Sin una sola galería" /> },
  { key: "m12", start: 31.5, dur: 3.6, el: (d) => <RawShot durationInFrames={d} src="img/piso_limpio_bajo_viga.png" hue="amber" kicker="Sin polvillo en el piso" /> },
  { key: "m13", start: 35.1, dur: 3.9, el: (d) => <RawShot durationInFrames={d} src="img/entretecho_grietas.png" hue="cold" kicker="Sin un crujido a las 3 AM" /> },
  { key: "m14", start: 39.0, dur: 4.8, el: (d) => <RawShot durationInFrames={d} src="img/viga_sana_macro.png" hue="amber" /> },
  { key: "m15", start: 43.8, dur: 3.2, el: (d) => <KineticQuote durationInFrames={d} image="img/viga_sana_macro.png" eyebrow="La viga del 62" words={parseQuote("Ni una *termita* la tocó")} accent="good" hue="amber" /> },
  { key: "m16", start: 47.0, dur: 3.0, el: (d) => <KineticQuote durationInFrames={d} image="img/borax_cucharada.png" eyebrow="Lo que tengo en la caja" words={parseQuote("No es un *veneno*")} accent="danger" hue="cold" fontSize={104} /> },
  { key: "m17", start: 50.0, dur: 3.0, el: (d) => <RawShot durationInFrames={d} src="img/borax_agua_vaso.png" hue="amber" /> },
  { key: "m18", start: 53.0, dur: 3.0, el: (d) => <RawShot durationInFrames={d} src="vid/perro_olfatea_caja.mp4" hue="amber" kicker="No mata al perro" /> },
  { key: "m19", start: 56.0, dur: 3.0, el: (d) => <RawShot durationInFrames={d} src="vid/abejas_colmena.mp4" hue="amber" kicker="Ni a las abejas" /> },
  { key: "m20", start: 59.0, dur: 3.0, el: (d) => <RawShot durationInFrames={d} src="vid/lombrices_huerta.mp4" hue="amber" kicker="Ni a las lombrices" /> },
  { key: "m21", start: 62.0, dur: 4.0, el: (d) => <RawShot durationInFrames={d} src="img/pies_descalzos_galpon.png" hue="amber" kicker="Ni a los chicos descalzos" /> },
  { key: "m22", start: 66.0, dur: 3.0, el: (d) => <RawShot durationInFrames={d} src="vid/termita_muerde_madera.mp4" hue="red" kicker="Lo que muerde la madera" /> },
  { key: "m23", start: 69.0, dur: 3.0, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/termita_muerde_madera.png" title="Mata una sola cosa" chips={["lo que MUERDE", "la madera"]} hue="red" /> },
  { key: "h8", start: 72.0, dur: 6.0, el: (d) => <KineticQuote durationInFrames={d} image="img/colonia_corte.png" eyebrow="Y lo mejor" words={parseQuote("Mata a la *colonia* entera")} accent="good" hue="cold" /> },
  { key: "h9", start: 84.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} name="taller_intro" hue="amber" kicker="32 años construyendo casas" caption="Nunca llamé una sola vez a una fumigadora" accent={A} /> },
  { key: "h10", start: 96.0, dur: 7.0, el: (d) => <TextCardReveal durationInFrames={d} eyebrow="El borax contra la fumigación" lines={["Funciona mejor", "Dura más", "Cuesta menos"]} accent={G} /> },

  // ───────── PROMESA · Australia/Hawái/EE.UU. + el negocio (1:48–2:48) ─────────
  { key: "p1", start: 108.0, dur: 6.0, el: (d) => <CalloutMark durationInFrames={d} figure="40 años" image="img/archivo_industria.png" eyebrow="La parte incómoda" caption="Lo saben hace décadas — y lo callan" accent="danger" hue="red" /> },
  { key: "p2r", start: 120.0, dur: 3.5, el: (d) => <RawShot durationInFrames={d} src="img/casa_eeuu_dano_termita.png" hue="red" /> },
  { key: "p2", start: 123.5, dur: 6.5, el: (d) => <WorldMapPins durationInFrames={d} /> },
  { key: "p3r", start: 132.0, dur: 3.0, el: (d) => <RawShot durationInFrames={d} src="img/madera_fabrica_tratada.png" hue="red" /> },
  { key: "p3", start: 135.0, dur: 3.5, el: (d) => <SplitList durationInFrames={d} title="Te venden la madera así" items={["Sin tratar", "Sin protección", "Lista para que la coman"]} accent={D} cross /> },
  { key: "p4", start: 144.0, dur: 10.5, el: (d) => <CostCumulative durationInFrames={d} eyebrow="Y la fumigación, aparte" /> },
  { key: "p5", start: 156.0, dur: 7.0, el: (d) => <BarCompare durationInFrames={d} eyebrow="La diferencia" title="Una caja vs una fumigación" orientation="horizontal" hue="amber" bars={[{ label: "Una caja de borax", value: 120, display: "10 años", tone: "good", winner: true, sub: "y te sobra" }, { label: "Una fumigación", value: 3, display: "3 meses", tone: "danger", sub: "y vuelven" }]} /> },

  // ───────── EL ERROR · vienen de tu propio suelo (2:48–4:12) ─────────
  { key: "e1", start: 168.0, dur: 6.0, el: (d) => <KineticQuote durationInFrames={d} image="img/dano_corcho.png" eyebrow="Antes de mostrarte qué hacer" words={parseQuote("El *error* que casi *todos* cometen")} accent="amber" hue="cold" /> },
  { key: "e2", start: 180.0, dur: 6.0, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/suelo_cimientos.png" title="No vienen del bosque" chips={["vienen de TU", "propio suelo"]} hue="red" /> },
  { key: "e3", start: 192.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="termita_macro" hue="red" kicker="Ya estaban ahí" caption="En tu propio terreno, antes de que compraras la casa" accent={B} /> },
  { key: "e4r", start: 204.0, dur: 3.5, el: (d) => <RawShot durationInFrames={d} src="vid/colonia_millon_tierra.mp4" hue="red" /> },
  { key: "e4", start: 207.5, dur: 3.5, el: (d) => <StatBig durationInFrames={d} to={1000000} suffix="" label="Una colonia puede tener" caption="individuos viviendo bajo la línea de la tierra" icon="warn" accent="danger" hue="red" size={150} /> },
  { key: "e5r", start: 216.0, dur: 3.0, el: (d) => <RawShot durationInFrames={d} src="img/reina_termita.png" hue="red" /> },
  { key: "e5", start: 219.0, dur: 3.0, el: (d) => <CrossSection durationInFrames={d} eyebrow="Todo el día, todos los días" title="Lo que buscan, bajo tierra" hue="red" layers={[{ label: "Aire seco", depth: "arriba", color: "rgba(150,160,170,0.45)", weight: 0.7 }, { label: "Línea de tierra", color: "rgba(110,90,60,0.7)", weight: 0.5 }, { label: "Madera húmeda", depth: "su objetivo", color: "rgba(242,169,59,0.55)", weight: 1 }, { label: "Tierra profunda", color: "rgba(70,55,40,0.85)", weight: 1.2 }]} marker={{ label: "termitas", atDepth: 0.5, color: "danger" }} /> },
  { key: "e6", start: 228.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="revisando_poste" hue="red" kicker="Un poste sin tratar" caption="Clavado en la tierra: las termitas lo van a encontrar" accent={B} /> },
  { key: "e7", start: 240.0, dur: 6.0, el: (d) => <KineticQuote durationInFrames={d} image="img/tubos_barro_pared.png" eyebrow="No es cuestión de si" words={parseQuote("Es cuestión de *cuándo*")} accent="danger" hue="red" fontSize={104} /> },

  // ───────── DAÑO OCULTO + FUMIGADORAS (4:12–5:12) ─────────
  { key: "f1r", start: 252.0, dur: 3.0, el: (d) => <RawShot durationInFrames={d} src="img/galeria_barro_pared_grande.png" hue="red" /> },
  { key: "f1", start: 255.0, dur: 3.5, el: (d) => <PhotoScene durationInFrames={d} name="madera_danada" hue="red" kicker="Comen por dentro" caption="Dejan la cáscara intacta — no te enterás por años" accent={D} /> },
  { key: "f2", start: 264.0, dur: 6.5, el: (d) => <AnnotatedImage durationInFrames={d} image="img/galeria_barro.jpg" eyebrow="El primer signo" caption="Una galería de barro subiendo por la pared" hue="red" annotations={[{ kind: "circle", x: 0.45, y: 0.5, w: 0.13, label: "galería de barro", color: "danger" }, { kind: "arrow", x: 0.45, y: 0.36, fromX: 0.7, fromY: 0.18, color: "amber" }]} /> },
  { key: "f3", start: 276.0, dur: 6.0, el: (d) => <RawShot durationInFrames={d} src="vid/camion_fumigador.mp4" hue="red" /> },
  { key: "f4", start: 288.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="quimicos_fumigadora" hue="red" kicker="Fipronil · bifentrina · midacloprid" caption="Neurotóxicos que no distinguen qué matan" accent={D} /> },
  { key: "f5r", start: 300.0, dur: 3.0, el: (d) => <RawShot durationInFrames={d} src="img/fumigador_interior.png" hue="red" /> },
  { key: "f5", start: 303.0, dur: 6.5, el: (d) => <SafetyGrid durationInFrames={d} /> },

  // ───────── ES BORAX (5:12–6:00) ─────────
  { key: "b1", start: 312.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="borax_mineral" hue="amber" kicker="Lo que tengo es BORAX" caption="Borato de sodio — un mineral que sale de la tierra" accent={A} /> },
  { key: "b2", start: 324.0, dur: 3.0, el: (d) => <PhotoScene durationInFrames={d} name="mina_borax" hue="amber" kicker="California · Turquía · Bolivia" caption="Se usa en jabones, cosméticos, vidrio, soldadura" accent={A} /> },
  { key: "b2r", start: 327.0, dur: 3.0, el: (d) => <RawShot durationInFrames={d} src="img/soldadura_borax_pasta.png" hue="amber" /> },
  { key: "b3", start: 336.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} name="jabon_abuela" hue="amber" kicker="Lo usaban las abuelas" caption="Para lavar la ropa y limpiar la plata" accent={A} /> },
  { key: "b4", start: 348.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="perro_oliendo" hue="amber" kicker="Tan seguro como la sal" caption="Le das la caja al perro a oler y no le pasa nada" accent={G} /> },

  // ───────── EL MECANISMO · intestino + trofalaxia (6:00–7:36) ─────────
  { key: "m1", start: 360.0, dur: 6.0, el: (d) => <KineticQuote durationInFrames={d} image="img/termitas_macro_madera.png" eyebrow="Pero a las termitas las mata" words={parseQuote("¿Por qué? El *mecanismo*")} accent="accent" hue="cold" /> },
  { key: "m2", start: 372.0, dur: 6.0, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/termitas_macro_madera.png" title="Su digestión depende de" chips={["microorganismos", "en el intestino"]} hue="amber" /> },
  { key: "m3", start: 384.0, dur: 11.0, el: (d) => <GutMechanism durationInFrames={d} /> },
  { key: "m4", start: 408.0, dur: 6.0, el: (d) => <CalloutMark durationInFrames={d} figure="MAGIA" image="img/borax_agua_vaso.png" eyebrow="Y acá viene" caption="La parte mágica" accent="accent" hue="amber" /> },
  { key: "m5r", start: 420.0, dur: 3.5, el: (d) => <RawShot durationInFrames={d} src="vid/trofalaxia_macro.mp4" hue="cold" /> },
  { key: "m5", start: 423.5, dur: 8.5, el: (d) => <TrofalaxiaDiagram durationInFrames={d} /> },
  { key: "m6", start: 444.0, dur: 7.0, el: (d) => <KineticQuote durationInFrames={d} image="img/colonia_corte.png" eyebrow="Las termitas hacen el trabajo" words={parseQuote("No hace falta encontrar el *nido*")} accent="good" hue="cold" /> },

  // ───────── SELECTIVIDAD + HISTORIA (7:36–8:48) ─────────
  { key: "s1", start: 456.0, dur: 9.0, el: (d) => <SelectiveCompare durationInFrames={d} /> },
  { key: "s2", start: 468.0, dur: 11.0, el: (d) => <BoraxTimeline durationInFrames={d} /> },
  { key: "s3", start: 492.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="viga_1962" hue="amber" kicker="Edificios tratados hace 50 años" caption="Cuando los demolieron, la madera estaba intacta" accent={A} /> },
  { key: "s4", start: 504.0, dur: 6.0, el: (d) => <OptionCompare durationInFrames={d} left={{ tag: "Ferretería", title: "Borax", sub: "Borato de sodio", note: "Una caja = una década", icon: "check", accent: A }} right={{ tag: "Profesional", title: "5× más caro", sub: "El mismo principio activo", note: "Solo cambia el packaging", icon: "bills", accent: D }} /> },
  { key: "s5", start: 516.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="caja_borax_banco" hue="amber" kicker="Solo cambia el packaging" caption="Es el mismo polvo de la ferretería" accent={A} /> },

  // ───────── PRÁCTICA · 3 cosas + Método 1 (8:48–10:36) ─────────
  { key: "c1", start: 528.0, dur: 6.0, el: (d) => <TextCardReveal durationInFrames={d} eyebrow="La parte práctica" lines={["Lo que hacés", "este fin de semana"]} accent={A} /> },
  { key: "c2", start: 540.0, dur: 12.0, el: (d) => <ReframeList durationInFrames={d} eyebrow="Necesitás solo" title="Tres cosas" accent={A} items={[{ text: "Una caja de borax", icon: "check" }, { text: "Un balde de 10 litros", icon: "check" }, { text: "Un pulverizador de jardín", icon: "check" }]} /> },
  { key: "c3", start: 553.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} name="pulverizador_jardin" hue="amber" kicker="Borax decahidratado" caption="Una caja de un kilo te alcanza para la casa entera" accent={A} /> },
  { key: "c4", start: 564.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="pulverizador_hombro" hue="amber" kicker="El de bombeo manual" caption="Sale lo mismo que una visita — y dura toda la vida" accent={A} /> },
  { key: "c5", start: 576.0, dur: 10.0, el: (d) => <ThreeMethods durationInFrames={d} /> },
  { key: "c6", start: 588.0, dur: 6.0, el: (d) => <RuleNumberScene durationInFrames={d} number="01" label="MÉTODO" title="Líquido · madera expuesta" hue="amber" /> },
  { key: "c7", start: 600.0, dur: 6.5, el: (d) => <RawShot durationInFrames={d} src="img/balde_revolviendo_avatar.png" hue="amber" /> },
  { key: "c8", start: 612.0, dur: 6.0, el: (d) => <StatBig durationInFrames={d} to={300} suffix=" g" label="Por cada 10 litros" caption="el borax se disuelve lento — tené paciencia" icon="check" accent="amber" hue="amber" /> },
  { key: "c9", start: 624.0, dur: 7.0, el: (d) => <RawShot durationInFrames={d} src="vid/rociar_viga_avatar.mp4" hue="amber" /> },

  // ───────── SELLADO + Método 2 (10:36–12:00) ─────────
  { key: "g1", start: 636.0, dur: 6.0, el: (d) => <ValueJourney durationInFrames={d} eyebrow="Esa madera" title="Protegida por décadas" accent="good" hue="amber" nodes={[{ label: "Día 1", level: 1 }, { label: "10 años", level: 1 }, { label: "30 años", level: 0.96 }, { label: "60 años", level: 0.92 }]} endValue="60+" endLabel="años protegida" /> },
  { key: "g2", start: 648.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="aceite_linaza" hue="amber" kicker="Si se moja con lluvia" caption="Aceite de linaza con trementina sella y atrapa el borato" accent={A} /> },
  { key: "g3", start: 660.0, dur: 6.0, el: (d) => <RuleNumberScene durationInFrames={d} number="02" label="MÉTODO" title="Polvo seco · grietas y juntas" hue="amber" /> },
  { key: "g4", start: 672.0, dur: 6.0, el: (d) => <PhotoScene durationInFrames={d} name="fuelle_herramienta" hue="amber" kicker="El fuelle" caption="Un soplador de mano que dispara el polvo con aire" accent={A} /> },
  { key: "g5", start: 684.0, dur: 6.5, el: (d) => <RawShot durationInFrames={d} src="vid/fuelle_nube_polvo.mp4" hue="amber" /> },
  { key: "g6", start: 696.0, dur: 6.0, el: (d) => <ProcessSteps durationInFrames={d} eyebrow="El polvo seco" title="Cómo se contaminan solas" orientation="horizontal" accent="accent" hue="cold" steps={[{ title: "Queda en la grieta", desc: "esperando" }, { title: "Lo levantan", desc: "con las patas" }, { title: "Se limpian", desc: "con la boca" }]} /> },
  { key: "g7", start: 708.0, dur: 6.0, el: (d) => <KineticQuote durationInFrames={d} image="img/termitas_macro_madera.png" eyebrow="Se limpian con la boca" words={parseQuote("Y se *contaminan*")} accent="danger" hue="cold" fontSize={104} /> },

  // ───────── Método 3 · cebo (12:00–13:12) ─────────
  { key: "t1", start: 720.0, dur: 6.0, el: (d) => <KineticQuote durationInFrames={d} eyebrow="Lo llevan al nido" words={parseQuote("Por *trofalaxia* matan la *colonia*")} accent="good" hue="cold" /> },
  { key: "t2", start: 732.0, dur: 6.5, el: (d) => <AnnotatedImage durationInFrames={d} image="img/galeria_barro.jpg" eyebrow="Colonia activa" caption="No rompas la galería — es la autopista de las obreras" hue="amber" annotations={[{ kind: "underline", x: 0.45, y: 0.6, w: 0.16, label: "no la rompas", color: "amber" }]} /> },
  { key: "t3", start: 744.0, dur: 6.0, el: (d) => <RuleNumberScene durationInFrames={d} number="03" label="MÉTODO" title="Cebo · colonia activa" hue="amber" /> },
  { key: "t4", start: 756.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="cebo_pasta" hue="amber" kicker="Dos de azúcar, una de borax" caption="Una pasta en una tapita, cerca de la galería" accent={A} /> },
  { key: "t5", start: 768.0, dur: 6.0, el: (d) => <RawShot durationInFrames={d} src="vid/cebo_hormigas_fila.mp4" hue="amber" /> },
  { key: "t6", start: 780.0, dur: 6.0, el: (d) => <CalloutMark durationInFrames={d} figure="0" image="img/viga_sana_macro.png" eyebrow="En una semana" caption="No ves una sola más" accent="good" hue="amber" /> },

  // ───────── COSTO + INSPECCIÓN (13:12–14:48) ─────────
  { key: "i1", start: 792.0, dur: 10.0, el: (d) => <CostCumulative durationInFrames={d} eyebrow="La inversión total" /> },
  { key: "i2", start: 804.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="abejas_flores" hue="amber" kicker="Y no envenenás el suelo" caption="Las abejas siguen trabajando los girasoles" accent={G} /> },
  { key: "i3", start: 816.0, dur: 6.0, el: (d) => <KineticQuote durationInFrames={d} image="img/caminar_linterna.png" eyebrow="Quiero ser honesto" words={parseQuote("La otra mitad *no se compra*")} accent="amber" hue="cold" /> },
  { key: "i4", start: 828.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="caminar_linterna" hue="amber" kicker="Una vez por mes" caption="Una linterna, un destornillador, y caminás tu casa" accent={A} /> },
  { key: "i5r", start: 840.0, dur: 3.5, el: (d) => <RawShot durationInFrames={d} src="img/inspeccion_linterna_avatar.png" hue="amber" /> },
  { key: "i5", start: 843.5, dur: 7.5, el: (d) => <HouseInspection durationInFrames={d} /> },
  { key: "i6", start: 864.0, dur: 6.5, el: (d) => <RawShot durationInFrames={d} src="img/destornillador_madera_blanda.png" hue="amber" /> },
  { key: "i7", start: 876.0, dur: 6.0, el: (d) => <CalloutMark durationInFrames={d} figure="5 min" image="img/rociar_finde.png" eyebrow="Eso es todo" caption="Cinco minutos por mes" accent="good" hue="amber" /> },

  // ───────── GUÍA GRATUITA (14:48–16:00) ─────────
  { key: "u1", start: 888.0, dur: 6.0, el: (d) => <TextCardReveal durationInFrames={d} eyebrow="La termita siempre avisa" lines={["El problema", "es que nadie escucha"]} accent={A} /> },
  { key: "u2", start: 912.0, dur: 6.5, el: (d) => <PhotoChecklist durationInFrames={d} eyebrow="Una guía gratuita" title="Lo que te llevás" image="img/taller_intro.jpg" pin="left" accent="good" hue="amber" items={[{ text: "Seis módulos que junté en 30 años", state: "done" }, { text: "No es un curso · no vendo nada", state: "done" }, { text: "Sin tarjeta de crédito", state: "doing" }]} /> },
  { key: "u3", start: 924.0, dur: 6.0, el: (d) => <AgedDoc durationInFrames={d} eyebrow="El cuaderno del viejo" heading="Defensa de la madera" accent="accent" hue="amber" lines={[{ text: "Lo que mi viejo me enseñó" }, { text: "Anotado durante 30 años", mark: true }, { text: "Sin químicos, sin fumigadoras" }]} /> },
  { key: "u4", start: 948.0, dur: 6.5, el: (d) => <AvatarPresentation durationInFrames={d} eyebrow="Guía gratuita" hue="amber" accent="accent" avatar="termitas_opt.mp4" avatarFrom={sec(948.0)} slides={[{ image: "img/taller_intro.jpg", title: "Defensa Biológica", note: "Uno de seis módulos · link en la descripción" }]} /> },

  // ───────── BORAX BONUS · plagas + sellador (16:00–18:00) ─────────
  { key: "x1", start: 960.0, dur: 6.0, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/borax_cucharada.png" title="Dos cosas más" chips={["una BUENA", "y una que parece mala"]} hue="amber" /> },
  { key: "x2", start: 972.0, dur: 6.0, el: (d) => <KineticQuote durationInFrames={d} image="img/cucarachas_zocalo.png" eyebrow="La buena" words={parseQuote("No es solo para *termitas*")} accent="good" hue="cold" /> },
  { key: "x3", start: 984.0, dur: 6.5, el: (d) => <PhotoChecklist durationInFrames={d} eyebrow="No solo termitas" title="El mismo polvo también mata" image="img/cebo_hormigas.jpg" pin="right" accent="good" hue="amber" items={[{ text: "Hormigas", state: "done" }, { text: "Cucarachas", state: "done" }, { text: "Pulgas", state: "done" }, { text: "Cualquier bicho de cuerpo blando", state: "doing" }]} /> },
  { key: "x4", start: 996.0, dur: 6.5, el: (d) => <RawShot durationInFrames={d} src="img/zocalo_heladera_polvo.png" hue="amber" /> },
  { key: "x5", start: 1008.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="cebo_hormigas" hue="amber" kicker="Un hormiguero en el patio" caption="Borax con azúcar al lado · una semana, terminado" accent={A} /> },
  { key: "x6r", start: 1020.0, dur: 3.0, el: (d) => <RawShot durationInFrames={d} src="img/linea_borax_puerta.png" hue="amber" /> },
  { key: "x6", start: 1023.0, dur: 3.0, el: (d) => <CalloutMark durationInFrames={d} figure="1 caja" image="img/caja_unica_borax.png" eyebrow="Múltiples plagas" caption="Una década de tranquilidad" accent="good" hue="amber" /> },
  { key: "x7", start: 1032.0, dur: 6.0, el: (d) => <KineticQuote durationInFrames={d} eyebrow="La que parece mala" words={parseQuote("Con lluvia, el borax se *lava*")} accent="danger" hue="cold" /> },
  { key: "x8", start: 1044.0, dur: 6.5, el: (d) => <RawShot durationInFrames={d} src="img/sellador_linaza_brocha.png" hue="amber" /> },
  { key: "x9", start: 1056.0, dur: 6.0, el: (d) => <CalloutMark durationInFrames={d} figure="∞" eyebrow="Adentro, sin lluvia" caption="Dura prácticamente para siempre" accent="good" hue="amber" /> },
  { key: "x10", start: 1068.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="viga_1962" hue="amber" kicker="Mi viga del 62" caption="Sigue intacta — afuera, repasás cada 5 o 6 años" accent={A} /> },

  // ───────── LA INDUSTRIA · panorama (18:00–19:48) ─────────
  { key: "n1", start: 1080.0, dur: 6.0, el: (d) => <CalloutMark durationInFrames={d} figure="PEOR" image="img/construccion_barata.png" eyebrow="Algo más grande" caption="Las casas se construyen cada vez peor" accent="danger" hue="red" /> },
  { key: "n2", start: 1092.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="casa_rural" hue="red" kicker="Madera sin tratar" caption="Estructuras con problemas programados desde el día 1" accent={B} /> },
  { key: "n3", start: 1116.0, dur: 6.0, el: (d) => <OptionCompare durationInFrames={d} left={{ tag: "Industria 1", title: "Construcción", sub: "Madera sin tratar", note: "Crea el problema", icon: "warn", accent: B }} right={{ tag: "Industria 2", title: "Fumigación", sub: "Cobra por el síntoma", note: "Vive del problema", icon: "bills", accent: D }} /> },
  { key: "n4", start: 1128.0, dur: 6.5, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/factura_fumigacion.png" title="Pagás dos veces" chips={["por el problema", "y por la solución"]} hue="red" /> },
  { key: "n5", start: 1140.0, dur: 6.0, el: (d) => <CalloutMark durationInFrames={d} figure="NO" eyebrow="Y la solución" caption="...no soluciona" accent="danger" hue="red" /> },
  { key: "n6", start: 1152.0, dur: 6.0, el: (d) => <StatBig durationInFrames={d} to={150} suffix=" años" label="La madera bien tratada en seco" caption="dura lo que tres generaciones" icon="calendar" accent="good" hue="amber" /> },
  { key: "n7", start: 1164.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="viga_1962" hue="amber" kicker="Apoyada en piedra" caption="No en cemento, no en tierra — dura tres generaciones" accent={A} /> },
  { key: "n8", start: 1176.0, dur: 6.0, el: (d) => <AgedDoc durationInFrames={d} eyebrow="Técnicas que se dejaron de enseñar" heading="Madera para tres generaciones" accent="good" hue="amber" lines={[{ text: "Apoyar en piedra, no en tierra" }, { text: "Tratar en seco con borato", mark: true }, { text: "Las necesitamos más que nunca" }]} /> },
  { key: "n9", start: 1188.0, dur: 6.0, el: (d) => <KineticQuote durationInFrames={d} image="img/ferreteria_precios.png" eyebrow="Más que nunca" words={parseQuote("Los productos se ponen *caros*")} accent="danger" hue="red" /> },

  // ───────── CIERRE (19:48–21:39) ─────────
  { key: "z1", start: 1200.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="caja_borax_banco" hue="amber" kicker="Una caja de polvo blanco" caption="Un pulverizador · cinco minutos por mes" accent={A} /> },
  { key: "z2", start: 1212.0, dur: 6.0, el: (d) => <KineticQuote durationInFrames={d} image="img/casa_durar.png" eyebrow="Eso es todo" words={parseQuote("Tu casa va a durar más que *vos*")} accent="good" hue="cold" /> },
  { key: "z3", start: 1224.0, dur: 14.0, el: (d) => <ReframeList durationInFrames={d} eyebrow="Contame en los comentarios" title="Yo leo todo" accent={G} items={[{ text: "Dónde vivís", icon: "check" }, { text: "Si tenés termitas en tu zona", icon: "check" }, { text: "Dónde conseguís el borax", icon: "check" }]} /> },
  { key: "z4", start: 1239.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} name="estufa_cohete" hue="amber" kicker="La próxima" caption="Una estufa de barro que se construye en un día" accent={A} /> },
  { key: "z5", start: 1260.0, dur: 6.5, el: (d) => <ChipsCluster durationInFrames={d} title="La estufa cohete" chips={["Sin gas", "Sin garrafa", "Sin electricidad"]} hue="amber" /> },
  { key: "z6", start: 1272.0, dur: 6.0, el: (d) => <KineticQuote durationInFrames={d} image="img/estufa_cohete.png" eyebrow="Lleva nombre de cohete" words={parseQuote("Por *algo*")} accent="accent" hue="cold" fontSize={120} /> },
  { key: "z7", start: 1284.0, dur: 12.0, el: (d) => <QuoteScene durationInFrames={d} name="taller_intro" quote="Los que vinieron antes que nosotros no eran tontos. Solo sabían cosas que estamos empezando a recordar." attribution="El del taller" accent={A} /> },
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
  const kb = interpolate(frame, [0, TOTAL_FRAMES_TER], [1.0, 1.06], { extrapolateRight: "clamp" });
  const kbMul = 1 + (kb - 1) * (1 - p);
  coverW *= kbMul;
  coverH *= kbMul;
  const offX = (boxW - coverW) / 2;
  const offY = (boxH - coverH) * 0.3;

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
        src={staticFile("termitas_opt.mp4")}
        style={{ position: "absolute", left: offX, top: offY, width: coverW, height: coverH }}
      />
    </div>
  );
};

export const MainTermitas: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={44} hue="cold" drift={0.5} />
      <ReframedVideo />
      {CUES.map((cue) => (
        <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
          {cue.el(sec(cue.dur))}
        </Sequence>
      ))}
      {/* Pasada de SFX — golpe en el arranque de cada escena. En el HOOK (0–108s)
          usamos whoosh/swish alternado para una sensación de zoom dinámico; el
          PhotoBurst trae su propio sonido (obturador + whoosh), así que se omite. */}
      {CUES.map((cue, i) => {
        if (cue.key === "hb") return null;
        const isHook = cue.start <= 108;
        const src = cue.key.match(/^(c6|g3|t3)$/)
          ? SFX.transition
          : isHook
            ? i % 2 === 0
              ? SFX.whoosh2
              : SFX.swish
            : POPS[i % POPS.length];
        return (
          <SfxCue
            key={"sfx" + cue.key}
            at={sec(cue.start)}
            src={src}
            volume={isHook ? 0.4 : 0.3}
            durationInFrames={isHook ? 34 : 45}
          />
        );
      })}
    </AbsoluteFill>
  );
};
