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
import { sec, COLORS, FONT_STACK, glass } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { SceneFrame } from "./components/SceneFrame";
import { SfxCue, SFX } from "./components/Sfx";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { StatBig, BarChart } from "./scenes/DataViz";
import { ActionCard } from "./scenes/ActionCard";
import { ReframeList, ChipsCluster } from "./scenes/ReframeContent";
import { OptionCompare } from "./scenes/OptionCompare";
import { CharacterIntro } from "./scenes/CharacterIntro";
import { drift } from "./lib/anim";

// PART 2 — error 4 action + errors 5-9 + outro/CTA. Presenter video at
// public/p2/video.mp4 (562.4s, 30fps). Applies the upgrade pack: varied
// backgrounds (Rule 12), real stock photos + depth (feedback_video_design),
// CharacterIntro (Rule 13), layered SFX (Rule 9J), motion blur (#6).
export const TOTAL_FRAMES_P2 = sec(562.4);

const S = (p: string) => `assets/stock/${p}`;

// ----- Reframe windows: presenter shrinks to a card on the right.
const REFRAME: { start: number; end: number }[] = [
  { start: 2.0, end: 16.0 }, // E4 exercise checklist
  { start: 126.0, end: 144.0 }, // E6 "saca de donde sea"
  { start: 238.0, end: 254.0 }, // E7 new costs
  { start: 423.0, end: 448.0 }, // E9 "no trabajan para vos"
  { start: 481.0, end: 502.0 }, // E9 personal confession
];

const danger = COLORS.danger;
const good = COLORS.good;
const amber = COLORS.amber;
const blueSoft = "rgba(150,180,225,0.6)";

// ---------------------------------------------------------------------------
// Inline scene: three glass "comparison" cards in a row (tax sources, LTC opts).
// ---------------------------------------------------------------------------
const TriCards: React.FC<{
  durationInFrames: number;
  title?: string;
  hue?: "blue" | "amber" | "red";
  bg?: "grid" | "image" | "black" | "white";
  cards: { title: string; value: string; note: string; accent: string }[];
}> = ({ durationInFrames, title, hue = "blue", bg, cards }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={44} zoom={[1.03, 1.09]} bg={bg}>
      <div style={{ textAlign: "center" }}>
        {title && (
          <div style={{ fontSize: 46, fontWeight: 800, color: "#fff", marginBottom: 54 }}>{title}</div>
        )}
        <div style={{ display: "flex", gap: 44, justifyContent: "center", alignItems: "stretch" }}>
          {cards.map((c, i) => {
            const s = spring({ frame: frame - (12 + i * 18), fps, config: { damping: 19, mass: 0.9 } });
            const d = drift(frame, i * 3 + 2, 0.5, 6);
            return (
              <div
                key={i}
                style={{
                  ...glass("dark"),
                  width: 440,
                  minHeight: 420,
                  borderRadius: 36,
                  padding: 44,
                  border: `1px solid ${c.accent}66`,
                  boxShadow: `0 40px 110px rgba(0,0,0,0.55), 0 0 60px ${c.accent}22, inset 0 1px 0 rgba(255,255,255,0.16)`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  opacity: interpolate(s, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(s, [0, 1], [60, 0]) + d.y}px) scale(${interpolate(s, [0, 1], [0.86, 1])})`,
                }}
              >
                <div style={{ fontSize: 34, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>{c.title}</div>
                <div style={{ fontSize: 66, fontWeight: 900, color: c.accent, lineHeight: 1.05, textShadow: `0 8px 40px ${c.accent}55`, marginTop: "auto" }}>
                  {c.value}
                </div>
                <div style={{ fontSize: 28, fontWeight: 600, color: COLORS.textSoft, lineHeight: 1.25 }}>{c.note}</div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};

type Cue = {
  key: string;
  start: number;
  dur: number;
  el: (d: number) => React.ReactNode;
};

const CUES: Cue[] = [
  // ============ ERROR 4 — action (inventory of lost accounts) — amber ========
  {
    key: "e4exercise",
    start: 2.0,
    dur: 13.5,
    el: (d) => (
      <ReframeList
        durationInFrames={d}
        eyebrow="Hacé este ejercicio"
        title="Antes de retirarte…"
        accent={amber}
        items={[
          { icon: "calendar", text: "Listá cada empleo (30 años)" },
          { icon: "bank", text: "¿Tenías plan de retiro?" },
          { icon: "lost", text: "¿Qué pasó con ese dinero?" },
        ]}
      />
    ),
  },
  {
    key: "e4tools",
    start: 16.5,
    dur: 10.5,
    el: (d) => (
      <ActionCard
        durationInFrames={d}
        kicker="Dónde buscar"
        items={["Unclaimed.org", "Sitio del Departamento de Trabajo", "Llamá a tus exempleadores"]}
        badge="dol"
      />
    ),
  },
  {
    key: "e4found",
    start: 28.5,
    dur: 7.3,
    el: (d) => (
      <StatBig
        durationInFrames={d}
        to={40000}
        prefix="$"
        label="Dinero olvidado"
        caption="que no sabías que tenías"
        icon="moneyup"
        accent="good"
        hue="amber"
        bg="image"
        image={S("stock_lostmoney_blur.jpg")}
        imageBlur={0}
        imageDarken={0.58}
        imageTint="rgba(255,178,62,0.18)"
      />
    ),
  },

  // ============ ERROR 5 — beneficiaries — red ===============================
  {
    key: "e5num",
    start: 36.4,
    dur: 8.2,
    el: (d) => (
      <RuleNumberScene durationInFrames={d} number="05" label="ERROR" title="No revisar los beneficiarios de tus cuentas" hue="red" />
    ),
  },
  {
    key: "e5late",
    start: 45.5,
    dur: 8.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="El error invisible"
        size={84}
        bg="black"
        tokens={[{ t: "No" }, { t: "se" }, { t: "nota" }, { t: "hasta" }, { t: "que" }, { t: "ya" }, { t: "es" }, { t: "TARDE", danger: true }]}
      />
    ),
  },
  {
    key: "e5priority",
    start: 60.2,
    dur: 9.5,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="Prioridad legal"
        hue="red"
        size={80}
        tokens={[{ t: "El" }, { t: "beneficiario" }, { t: "MANDA", danger: true }, { t: "sobre" }, { t: "tu" }, { t: "testamento", hl: true }]}
      />
    ),
  },
  {
    key: "e5ex",
    start: 70.5,
    dur: 13.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="Lo que nadie revisa"
        size={82}
        bg="image"
        image={S("stock_beneficiary_blur.jpg")}
        imageBlur={0}
        imageDarken={0.64}
        tokens={[{ t: "Tu" }, { t: "401(k)" }, { t: "→" }, { t: "tu" }, { t: "EX", danger: true }, { t: "de" }, { t: "hace" }, { t: "15" }, { t: "años", danger: true }]}
      />
    ),
  },
  {
    key: "e5action",
    start: 85.0,
    dur: 13.0,
    el: (d) => (
      <ActionCard
        durationInFrames={d}
        items={["Revisá beneficiarios en cada cuenta y póliza", "Verificá que sean las personas correctas", "Sin testamento: hacelo ya"]}
      />
    ),
  },
  {
    key: "e5will",
    start: 99.0,
    dur: 12.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="Barato vs costoso"
        size={86}
        bg="black"
        tokens={[{ t: "$300", good: true }, { t: "hoy" }, { t: "evitan" }, { t: "años" }, { t: "de" }, { t: "conflicto", danger: true }, { t: "familiar", danger: true }]}
      />
    ),
  },

  // ============ ERROR 6 — withdrawal/tax strategy — blue ====================
  {
    key: "e6num",
    start: 113.6,
    dur: 8.5,
    el: (d) => (
      <RuleNumberScene durationInFrames={d} number="06" label="ERROR" title="No tener una estrategia de de dónde sacar el dinero" hue="blue" />
    ),
  },
  {
    key: "e6problem",
    start: 126.0,
    dur: 18.0,
    el: (d) => (
      <ReframeList
        durationInFrames={d}
        eyebrow="Lo que hace la mayoría"
        title="Saca de donde sea…"
        accent={COLORS.accent}
        items={[
          { icon: "monthly", text: "Un mes, del 401(k)" },
          { icon: "bank", text: "El siguiente, del banco" },
          { icon: "growth", text: "El siguiente, inversiones" },
          { text: "…sin pensar en impuestos", cross: true },
        ]}
      />
    ),
  },
  {
    key: "e6tax",
    start: 151.3,
    dur: 25.0,
    el: (d) => (
      <TriCards
        durationInFrames={d}
        hue="blue"
        title="Cada fuente paga impuestos distinto"
        cards={[
          { title: "401(k) tradicional", value: "Impuesto ALTO", note: "cuenta como ingreso ordinario", accent: danger },
          { title: "Cuenta Roth", value: "$0", note: "los retiros no pagan impuestos", accent: good },
          { title: "Inversiones", value: "Tasa menor", note: "ganancias de capital", accent: amber },
        ]}
      />
    ),
  },
  {
    key: "e6combine",
    start: 178.0,
    dur: 12.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="La estrategia"
        hue="blue"
        size={80}
        tokens={[{ t: "Combinás" }, { t: "bien" }, { t: "→" }, { t: "el" }, { t: "dinero" }, { t: "dura" }, { t: "años", good: true }, { t: "más", good: true }]}
      />
    ),
  },
  {
    key: "e6save",
    start: 191.0,
    dur: 13.0,
    el: (d) => (
      <StatBig
        durationInFrames={d}
        to={40000}
        prefix="$"
        label="Solo en impuestos federales"
        caption="$2,000 al año × 20 años de retiro"
        icon="moneyup"
        accent="good"
        hue="amber"
        bg="image"
        image={S("stock_accountant_blur.jpg")}
        imageBlur={0}
        imageDarken={0.62}
      />
    ),
  },
  {
    key: "e6action",
    start: 204.5,
    dur: 6.3,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="Qué hacer"
        hue="amber"
        size={76}
        bg="black"
        tokens={[{ t: "Hablá" }, { t: "con" }, { t: "un" }, { t: "contador" }, { t: "ANTES", hl: true }, { t: "de" }, { t: "sacar" }, { t: "dinero" }]}
      />
    ),
  },

  // ============ ERROR 7 — underestimating spending — amber ==================
  {
    key: "e7num",
    start: 211.2,
    dur: 8.3,
    el: (d) => (
      <RuleNumberScene durationInFrames={d} number="07" label="ERROR" title="No calcular cuánto vas a gastar de verdad" hue="amber" />
    ),
  },
  {
    key: "e7fake",
    start: 225.0,
    dur: 12.0,
    el: (d) => (
      <ChipsCluster
        durationInFrames={d}
        hue="amber"
        bg="black"
        title="Números sin base real:"
        chips={["80% del salario", "$2,000/mes", "$1M ahorrado"]}
      />
    ),
  },
  {
    key: "e7newcosts",
    start: 238.0,
    dur: 16.0,
    el: (d) => (
      <ReframeList
        durationInFrames={d}
        eyebrow="Gastos que aparecen"
        title="Lo que no viste venir"
        accent={amber}
        items={[
          { icon: "health", text: "Seguro médico: ahora es tuyo" },
          { icon: "calendar", text: "Viajes postergados 40 años" },
          { icon: "bills", text: "Nietos · casa · emergencias" },
          { icon: "growth", text: "La inflación, cada año" },
        ]}
      />
    ),
  },
  {
    key: "e7story",
    start: 255.0,
    dur: 15.0,
    el: (d) => (
      <CharacterIntro
        durationInFrames={d}
        bgImage={S("stock_accountant.jpg")}
        portraitImage={S("stock_accountant_portrait.jpg")}
        name="El Contador"
        role="40 años manejando números ajenos"
        accent={amber}
        tint="rgba(255,178,62,0.16)"
        motionBlur
      />
    ),
  },
  {
    key: "e7compare",
    start: 270.6,
    dur: 14.0,
    el: (d) => (
      <BarChart
        durationInFrames={d}
        hue="amber"
        title="Lo que CALCULÓ vs lo que GASTÓ"
        bars={[
          { label: "Calculó", value: 4000, prefix: "$", max: 6300, color: blueSoft },
          { label: "Gastó (año 1)", value: 6300, prefix: "$", max: 6300, color: danger },
        ]}
      />
    ),
  },
  {
    key: "e7action",
    start: 285.0,
    dur: 16.0,
    el: (d) => (
      <ActionCard
        durationInFrames={d}
        items={["Listá tus gastos REALES (no los ideales)", "Sumá un 15% — siempre hay algo", "¿Lo cubren tus ingresos garantizados?"]}
      />
    ),
  },
  {
    key: "e7time",
    start: 302.0,
    dur: 11.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="La buena noticia"
        hue="amber"
        size={88}
        bg="black"
        tokens={[{ t: "Todavía" }, { t: "estás" }, { t: "a" }, { t: "tiempo" }, { t: "de" }, { t: "AJUSTAR", good: true }]}
      />
    ),
  },

  // ============ ERROR 8 — long-term care — red ==============================
  {
    key: "e8num",
    start: 314.8,
    dur: 7.8,
    el: (d) => (
      <RuleNumberScene durationInFrames={d} number="08" label="ERROR" title="Ignorar los gastos de cuidado a largo plazo" hue="red" />
    ),
  },
  {
    key: "e8stat70",
    start: 323.0,
    dur: 9.5,
    el: (d) => (
      <StatBig
        durationInFrames={d}
        to={70}
        suffix="%"
        label="Llega a los 65 y lo va a necesitar"
        caption="algún tipo de cuidado a largo plazo"
        accent="danger"
        hue="red"
        bg="image"
        image={S("stock_eldercare_blur.jpg")}
        imageBlur={0}
        imageDarken={0.6}
      />
    ),
  },
  {
    key: "e8types",
    start: 333.0,
    dur: 9.0,
    el: (d) => (
      <ChipsCluster
        durationInFrames={d}
        hue="red"
        bg="black"
        title="El cuidado puede ser:"
        chips={["En casa", "Residencia asistida", "Nursing home"]}
      />
    ),
  },
  {
    key: "e8cost",
    start: 342.7,
    dur: 9.0,
    el: (d) => (
      <StatBig
        durationInFrames={d}
        to={100000}
        prefix="$"
        suffix="+"
        label="Un año de cuidado asistido"
        caption="EE.UU. · 2026 — Medicare casi no lo cubre"
        icon="bills"
        accent="danger"
        hue="red"
      />
    ),
  },
  {
    key: "e8medicare",
    start: 352.0,
    dur: 18.0,
    el: (d) => (
      <OptionCompare
        durationInFrames={d}
        left={{ tag: "Medicare SÍ", title: "Cuidado médico", sub: "el médico que te atiende", note: "Esto lo cubre Medicare", icon: "hospital", accent: good }}
        right={{ tag: "Medicare NO", title: "Cuidado personal", sub: "bañarte, vestirte, comer", note: "Esto lo pagás vos", icon: "tired", accent: danger }}
      />
    ),
  },
  {
    key: "e8options",
    start: 375.9,
    dur: 17.0,
    el: (d) => (
      <TriCards
        durationInFrames={d}
        hue="red"
        title="Tenés tres opciones"
        cards={[
          { title: "Seguro de cuidado", value: "Más barato <60", note: "contratado temprano", accent: good },
          { title: "Híbrido de vida", value: "2 en 1", note: "vida + cuidado a largo plazo", accent: amber },
          { title: "Reserva propia", value: "Capital aparte", note: "designado para esto", accent: COLORS.accentSoft },
        ]}
      />
    ),
  },
  {
    key: "e8decide",
    start: 394.5,
    dur: 12.5,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="Y la más cara de todas"
        hue="red"
        size={82}
        bg="black"
        tokens={[{ t: "No" }, { t: "elegir" }, { t: "TAMBIÉN", danger: true }, { t: "es" }, { t: "una" }, { t: "decisión", hl: true }]}
      />
    ),
  },

  // ============ ERROR 9 — trusting others — blue ============================
  {
    key: "e9num",
    start: 409.4,
    dur: 8.3,
    el: (d) => (
      <RuleNumberScene durationInFrames={d} number="09" label="ERROR" title="Confiar en que alguien más cuida tus intereses" hue="blue" />
    ),
  },
  {
    key: "e9who",
    start: 423.7,
    dur: 19.0,
    el: (d) => (
      <ReframeList
        durationInFrames={d}
        eyebrow="La verdad incómoda"
        title="No trabajan para vos"
        accent={danger}
        items={[
          { icon: "employer", text: "El empleador → la empresa", cross: true },
          { icon: "hospital", text: "El rep de Medicare → el plan", cross: true },
          { icon: "advisor", text: "El asesor por comisión → el producto", cross: true },
        ]}
      />
    ),
  },
  {
    key: "e9onlyyou",
    start: 454.4,
    dur: 11.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="En el retiro"
        size={86}
        bg="black"
        tokens={[{ t: "El" }, { t: "único" }, { t: "que" }, { t: "trabaja" }, { t: "para" }, { t: "vos" }, { t: "sos" }, { t: "VOS", good: true }]}
      />
    ),
  },
  {
    key: "e9need",
    start: 466.5,
    dur: 13.0,
    el: (d) => (
      <ChipsCluster
        durationInFrames={d}
        hue="blue"
        title="Necesitás:"
        chips={["Información", "Hacer preguntas", "Entender lo que firmás", "Asesores independientes"]}
      />
    ),
  },
  {
    key: "e9confession",
    start: 481.0,
    dur: 21.0,
    el: (d) => (
      <ReframeList
        durationInFrames={d}
        eyebrow="Me pasó a mí"
        title="Confié en el proceso…"
        accent={danger}
        items={[
          { text: "Pagué lo que llegaba", cross: true },
          { text: "Firmé lo que me ponían", cross: true },
          { text: "Esperé que alguien avisara", cross: true },
        ]}
      />
    ),
  },
  {
    key: "e9diff",
    start: 503.0,
    dur: 16.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="Y duele admitirlo"
        size={84}
        bg="image"
        image={S("stock_senior_thoughtful_blur.jpg")}
        imageBlur={0}
        imageDarken={0.66}
        tokens={[{ t: "Esa" }, { t: "diferencia" }, { t: "tiene" }, { t: "un" }, { t: "número", danger: true }]}
      />
    ),
  },

  // ============ OUTRO + CTA =================================================
  {
    key: "outro9",
    start: 521.8,
    dur: 13.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="El resumen"
        hue="blue"
        size={96}
        tokens={[{ t: "9" }, { t: "errores." }, { t: "Todos" }, { t: "EVITABLES", good: true }]}
      />
    ),
  },
  {
    key: "ctaThink",
    start: 536.0,
    dur: 11.5,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="Antes de cerrar"
        size={80}
        bg="black"
        tokens={[{ t: "Pensá" }, { t: "en" }, { t: "alguien" }, { t: "cerca" }, { t: "de" }, { t: "jubilarse", hl: true }]}
      />
    ),
  },
  {
    key: "ctaSend",
    start: 548.0,
    dur: 13.0,
    el: (d) => (
      <KineticHeadline
        durationInFrames={d}
        eyebrow="Una cosa más"
        size={84}
        bg="image"
        image={S("stock_share_phone_blur.jpg")}
        imageBlur={0}
        imageDarken={0.56}
        tokens={[{ t: "Mandáselo." }, { t: "Puede" }, { t: "cambiar" }, { t: "su" }, { t: "retiro", good: true }]}
      />
    ),
  },
];

// ----- SFX track (absolute frames; rendered at composition root) -----------
const SFX_HITS: { at: number; src: string; vol: number }[] = [
  { at: sec(2.0), src: SFX.whoosh, vol: 0.45 }, // reframe in
  { at: sec(16.6), src: SFX.popUp, vol: 0.4 }, // action card
  { at: sec(28.7), src: SFX.pop2, vol: 0.45 }, // found $40k
  { at: sec(36.4), src: SFX.transition, vol: 0.5 }, // error 5
  { at: sec(45.6), src: SFX.ui3, vol: 0.4 },
  { at: sec(70.6), src: SFX.whoosh, vol: 0.4 },
  { at: sec(85.1), src: SFX.popUp, vol: 0.4 },
  { at: sec(113.6), src: SFX.transition, vol: 0.5 }, // error 6
  { at: sec(126.0), src: SFX.whoosh, vol: 0.45 }, // reframe
  { at: sec(191.2), src: SFX.pop2, vol: 0.45 },
  { at: sec(211.2), src: SFX.transition, vol: 0.5 }, // error 7
  { at: sec(238.0), src: SFX.whoosh, vol: 0.45 }, // reframe
  // e7story CharacterIntro has its own internal SFX (255s)
  { at: sec(270.7), src: SFX.pop1, vol: 0.4 },
  { at: sec(276.0), src: SFX.pop3, vol: 0.5 },
  { at: sec(285.1), src: SFX.popUp, vol: 0.4 },
  { at: sec(314.8), src: SFX.transition, vol: 0.5 }, // error 8
  { at: sec(323.1), src: SFX.pop2, vol: 0.45 },
  { at: sec(342.8), src: SFX.pop3, vol: 0.45 },
  { at: sec(409.4), src: SFX.transition, vol: 0.5 }, // error 9
  { at: sec(423.7), src: SFX.whoosh, vol: 0.45 }, // reframe
  { at: sec(481.0), src: SFX.whoosh, vol: 0.4 }, // confession reframe
  { at: sec(521.8), src: SFX.transition, vol: 0.45 }, // outro
  { at: sec(548.0), src: SFX.ui5, vol: 0.4 }, // CTA
];

// Reframed presenter video (reads p2/video.mp4). Same technique as Part 1:
// animated card box on the right + manual cover with face bias; Ken Burns when
// full-frame so the avatar never sits still (Rule 6 #7).
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
  const kb = interpolate(frame, [0, TOTAL_FRAMES_P2], [1.0, 1.07], { extrapolateRight: "clamp" });
  const kbMul = 1 + (kb - 1) * (1 - p);
  coverW *= kbMul;
  coverH *= kbMul;
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
        src={staticFile("p2/video.mp4")}
        style={{ position: "absolute", left: offX, top: offY, width: coverW, height: coverH }}
      />
    </div>
  );
};

export const Main2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
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

      {/* sound design — absolute-framed cues under narration */}
      {SFX_HITS.map((h, i) => (
        <SfxCue key={`sfx-${i}`} at={h.at} src={h.src} volume={h.vol} />
      ))}
    </AbsoluteFill>
  );
};
