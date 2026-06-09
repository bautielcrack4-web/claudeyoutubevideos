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
import { SceneFrame } from "./components/SceneFrame";
import { CircleAnnotation } from "./components/Annotation";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { HookGrid } from "./scenes/HookGrid";
import { StatBig, ErnestoCompare } from "./scenes/DataViz";
import { ActionCard } from "./scenes/ActionCard";
import { ReframeList, ChipsCluster } from "./scenes/ReframeContent";
import { OptionCompare } from "./scenes/OptionCompare";

// PART 1 — intro + system explainer + errors 1-3 + error-4 cliffhanger.
// Video cuts mid-error-4 at ~478s. 30fps.
export const TOTAL_FRAMES = sec(478);

// ----- Reframe windows (Rules 2 & 5): presenter shrinks to a card on the right
// while a list/title appears on the left. [start, end] in seconds.
const REFRAME: { start: number; end: number }[] = [
  { start: 5.2, end: 12.2 }, // intro: who DOESN'T tell you
  { start: 54.0, end: 72.0 }, // "hablé con jubilados, asesores, abogados"
  { start: 169.0, end: 182.0 }, // error 1: why people claim at 62
  { start: 366.0, end: 380.0 }, // error 3: three dangerous assumptions
];

type Cue = {
  key: string;
  start: number;
  dur: number;
  el: (d: number) => React.ReactNode;
};

const dangerCol = COLORS.danger;
const goodCol = COLORS.good;

const CUES: Cue[] = [
  // ---------- INTRO ----------
  {
    key: "hook",
    start: 0.5,
    dur: 4.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="Escuchá esto"
        size={96}
        tokens={[
          { t: "Hay" },
          { t: "una" },
          { t: "cosa" },
          { t: "que" },
          { t: "NADIE", hl: true },
          { t: "te" },
          { t: "dice", hl: true },
        ]}
      />
    ),
  },
  {
    key: "whotells",
    start: 5.2,
    dur: 7.0,
    el: (d) => (
      <ReframeList
        durationInFrames={d}
        eyebrow="Nadie te lo va a decir"
        title="No te lo dice…"
        accent={dangerCol}
        items={[
          { text: "Tu empleador", cross: true },
          { text: "Tu banco", cross: true },
          { text: "Tu gobierno", cross: true },
          { text: "Tu contador", cross: true },
        ]}
      />
    ),
  },
  {
    key: "thesis",
    start: 12.8,
    dur: 8.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="La verdad del retiro"
        size={82}
        tokens={[
          { t: "El" },
          { t: "retiro" },
          { t: "premia" },
          { t: "al" },
          { t: "que" },
          { t: "MENOS", good: true },
          { t: "errores", good: true },
          { t: "comete", good: true },
        ]}
      />
    ),
  },
  {
    key: "career",
    start: 23.5,
    dur: 6.3,
    el: (d) => (
      <StatBig
        durationInFrames={d}
        to={40}
        suffix=" años"
        label="Una carrera impecable"
        caption="de trabajo, disciplina y sacrificio"
        icon="tired"
        accent="neutral"
        hue="blue"
      />
    ),
  },
  {
    key: "months",
    start: 34.0,
    dur: 6.8,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="Los últimos 12 meses lo deciden"
        size={84}
        tokens={[
          { t: "Errores", danger: true },
          { t: "que" },
          { t: "NO", danger: true },
          { t: "se" },
          { t: "pueden" },
          { t: "deshacer", danger: true },
        ]}
      />
    ),
  },
  {
    key: "spoke",
    start: 54.0,
    dur: 18.0,
    el: (d) => (
      <ReframeList
        durationInFrames={d}
        eyebrow="Me pasó a mí"
        title="Hablé con decenas de…"
        accent={COLORS.accent}
        items={[
          { icon: "retiree", text: "Jubilados reales" },
          { icon: "advisor", text: "Asesores financieros" },
          { icon: "lawyer", text: "Abogados de consumidor" },
        ]}
      />
    ),
  },
  {
    key: "ninegrid",
    start: 73.5,
    dur: 13.0,
    el: (d) => (
      <HookGrid
        durationInFrames={d}
        tiles={[
          { n: 1, label: "Seguro Social", icon: "sscard" },
          { n: 2, label: "Pensión", icon: "pension" },
          { n: 3, label: "Seguro médico", icon: "hospital" },
          { n: 4 },
          { n: 5 },
          { n: 6 },
          { n: 7 },
          { n: 8 },
          { n: 9 },
        ]}
      />
    ),
  },
  {
    key: "system",
    start: 92.5,
    dur: 8.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="Cómo funciona el sistema"
        size={80}
        tokens={[
          { t: "El" },
          { t: "sistema" },
          { t: "no" },
          { t: "está" },
          { t: "diseñado" },
          { t: "para" },
          { t: "protegerte", danger: true },
        ]}
      />
    ),
  },
  {
    key: "pressure",
    start: 118.0,
    dur: 9.5,
    el: (d) => (
      <ChipsCluster
        durationInFrames={d}
        title="Te empujan a decidir con:"
        hue="red"
        chips={["Poco tiempo", "Poca información", "Presión emocional", "Miedo"]}
      />
    ),
  },
  {
    key: "retireday",
    start: 131.0,
    dur: 7.0,
    el: (d) => (
      <ChipsCluster
        durationInFrames={d}
        title="El día que te retirás sentís:"
        hue="blue"
        chips={["emoción", "alivio", "miedo", "papeles", "dudas"]}
      />
    ),
  },

  // ---------- ERROR 1 — amber ----------
  {
    key: "e1num",
    start: 149.9,
    dur: 8.5,
    el: (d) => (
      <RuleNumberScene
        durationInFrames={d}
        number="01"
        label="ERROR"
        title="Cobrar el Seguro Social demasiado pronto"
        hue="amber"
      />
    ),
  },
  {
    key: "e1why",
    start: 169.0,
    dur: 12.5,
    el: (d) => (
      <ReframeList
        durationInFrames={d}
        eyebrow="Error 01"
        title="Por qué se cobra a los 62"
        accent={COLORS.amber}
        items={[
          { icon: "tired", text: "El cuerpo está cansado" },
          { icon: "bills", text: "Las cuentas aprietan" },
          { icon: "calendar", text: "40 años esperando" },
        ]}
      />
    ),
  },
  {
    key: "e1growth",
    start: 184.0,
    dur: 8.0,
    el: (d) => (
      <StatBig
        durationInFrames={d}
        to={8}
        prefix="+"
        suffix="% al año"
        label="De 62 a 70 años"
        caption="garantizado por ley"
        icon="growth"
        accent="good"
        hue="amber"
      />
    ),
  },
  {
    key: "e1ernesto",
    start: 200.5,
    dur: 46.0,
    el: (d) => <ErnestoCompare durationInFrames={d} />,
  },
  {
    key: "e1action",
    start: 248.0,
    dur: 8.4,
    el: (d) => (
      <ActionCard
        durationInFrames={d}
        items={[
          "Pedí tu proyección oficial en ssa.gov",
          "Compará cobrar a los 62, 67 y 70",
          "Decidí recién con los números en mano",
        ]}
        badge="ssa"
      />
    ),
  },

  // ---------- ERROR 2 — blue ----------
  {
    key: "e2num",
    start: 256.8,
    dur: 8.0,
    el: (d) => (
      <RuleNumberScene
        durationInFrames={d}
        number="02"
        label="ERROR"
        title="Elegir mal la opción de pago de tu pensión"
        hue="blue"
      />
    ),
  },
  {
    key: "e2options",
    start: 269.5,
    dur: 18.0,
    el: (d) => (
      <OptionCompare
        durationInFrames={d}
        left={{
          tag: "Opción A",
          title: "Máximo mensual",
          sub: "El cheque más alto",
          note: "Si morís, tu pareja queda sin nada",
          icon: "monthly",
          accent: dangerCol,
        }}
        right={{
          tag: "Opción B",
          title: "Pensión conjunta",
          sub: "Un poco menos por mes",
          note: "Tu cónyuge cobra de por vida",
          icon: "couple",
          accent: goodCol,
        }}
      />
    ),
  },
  {
    key: "e2widow",
    start: 291.0,
    dur: 7.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="La letra chica"
        size={78}
        tokens={[
          { t: "Tu" },
          { t: "pareja" },
          { t: "puede" },
          { t: "quedar" },
          { t: "SIN", danger: true },
          { t: "INGRESO", danger: true },
          { t: "para" },
          { t: "siempre", danger: true },
        ]}
      />
    ),
  },
  {
    key: "e2irrev",
    start: 306.0,
    dur: 8.0,
    el: (d) => (
      <SceneFrame durationInFrames={d} hue="red" glowY={44} zoom={[1.05, 1.13]}>
        <div style={{ textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block", padding: "10px 30px" }}>
            <div
              style={{
                fontSize: 140,
                fontWeight: 900,
                letterSpacing: 2,
                color: "#fff",
                textShadow: `0 8px 60px ${dangerCol}66`,
              }}
            >
              IRREVERSIBLE
            </div>
            <CircleAnnotation delay={14} color={dangerCol} width={920} height={240} strokeWidth={11} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 600, color: COLORS.textSoft, marginTop: 36 }}>
            No existe un formulario para deshacerlo
          </div>
        </div>
      </SceneFrame>
    ),
  },
  {
    key: "e2action",
    start: 326.0,
    dur: 9.0,
    el: (d) => (
      <ActionCard
        durationInFrames={d}
        items={[
          "Pedí los documentos con anticipación",
          "Asesor independiente por hora, no por comisión",
          "Entendé cada opción antes de firmar",
        ]}
      />
    ),
  },

  // ---------- ERROR 3 — red ----------
  {
    key: "e3num",
    start: 349.2,
    dur: 8.0,
    el: (d) => (
      <RuleNumberScene
        durationInFrames={d}
        number="03"
        label="ERROR"
        title="No saber qué pasa con tu seguro médico"
        hue="red"
      />
    ),
  },
  {
    key: "e3myths",
    start: 366.0,
    dur: 13.0,
    el: (d) => (
      <ReframeList
        durationInFrames={d}
        eyebrow="Error 03"
        title="Tres suposiciones peligrosas"
        accent={dangerCol}
        items={[
          { text: "El seguro de la empresa sigue", cross: true },
          { text: "Medicare arranca solo", cross: true },
          { text: "Algo va a aparecer", cross: true },
        ]}
      />
    ),
  },
  {
    key: "e3cost",
    start: 386.5,
    dur: 7.0,
    el: (d) => (
      <StatBig
        durationInFrames={d}
        to={2000}
        prefix="$"
        suffix="/mes"
        label="Cobertura privada antes de los 65"
        caption="hasta $2,000 por mes de tu bolsillo"
        icon="bills"
        accent="danger"
        hue="red"
      />
    ),
  },
  {
    key: "e3window",
    start: 402.0,
    dur: 8.0,
    el: (d) => (
      <StatBig
        durationInFrames={d}
        to={7}
        suffix=" meses"
        label="Ventana de inscripción a Medicare"
        caption="perdela y pagás multas de por vida"
        icon="window"
        accent="amber"
        hue="red"
        badge="medicare"
      />
    ),
  },
  {
    key: "e3action",
    start: 422.5,
    dur: 9.0,
    el: (d) => (
      <ActionCard
        durationInFrames={d}
        hero="1-800-MEDICARE"
        items={[
          "Llamá 4 meses antes de cumplir 65",
          "Pedí tus opciones y fechas límite",
          "Confirmá cuánto vas a pagar",
        ]}
        badge="medicare"
      />
    ),
  },

  // ---------- ERROR 4 — cliffhanger ----------
  {
    key: "e4num",
    start: 438.4,
    dur: 8.0,
    el: (d) => (
      <RuleNumberScene
        durationInFrames={d}
        number="04"
        label="ERROR"
        title="No hacer inventario de tus activos"
        hue="amber"
      />
    ),
  },
  {
    key: "e4lost",
    start: 449.5,
    dur: 8.0,
    el: (d) => (
      <StatBig
        durationInFrames={d}
        to={29}
        suffix=" millones"
        label="Cuentas de retiro perdidas"
        caption="miles de millones de dólares sin reclamar"
        icon="lost"
        accent="danger"
        hue="amber"
        badge="dol"
      />
    ),
  },
  {
    key: "e4401k",
    start: 465.5,
    dur: 8.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="Tu 401(k) olvidado"
        size={80}
        tokens={[
          { t: "Pasan" },
          { t: "10," },
          { t: "20" },
          { t: "años", hl: true },
          { t: "y" },
          { t: "nadie", danger: true },
          { t: "la" },
          { t: "mira", danger: true },
        ]}
      />
    ),
  },
];

// Reframed video: shrinks to a portrait card on the right during REFRAME windows.
// When NOT reframed, a slow Ken Burns push-in keeps the full-frame avatar alive
// (Rule 6). The card box itself is animated (w/h/x/y); the video uses a manual
// "cover" so the portrait crop keeps the presenter centered on the face.
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

  // target portrait card on the right
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

  // Manual "cover": size the video so it fully covers the box (crop overflow).
  const ratio = 16 / 9;
  let coverW = Math.max(boxW, boxH * ratio);
  let coverH = coverW / ratio;
  // slow Ken Burns push-in, faded out as the card reframes (none when reframed)
  const kb = interpolate(frame, [0, TOTAL_FRAMES], [1.0, 1.07], { extrapolateRight: "clamp" });
  const kbMul = 1 + (kb - 1) * (1 - p);
  coverW *= kbMul;
  coverH *= kbMul;
  // center horizontally; bias vertically so the face (upper-third) stays framed
  const offX = (boxW - coverW) / 2;
  const offY = (boxH - coverH) * 0.36;

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
        src={staticFile("video.mp4")}
        style={{ position: "absolute", left: offX, top: offY, width: coverW, height: coverH }}
      />
    </div>
  );
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={44} hue="blue" drift={0.5} />
      <ReframedVideo />

      {CUES.map((cue) => {
        const from = sec(cue.start);
        const durationInFrames = sec(cue.dur);
        return (
          <Sequence key={cue.key} from={from} durationInFrames={durationInFrames}>
            {cue.el(durationInFrames)}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
