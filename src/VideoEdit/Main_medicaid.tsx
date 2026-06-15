import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme_ben";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { SfxCue, SFX } from "./components/Sfx";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { CUES } from "./cues_medicaid.gen";

// ── CANAL "BEN RETIRADO" · "¿Casa PAGADA? Medicaid se la QUEDA" ──
// Look ALARMA financiera (negro/rojo/amarillo, sans pesada — theme_ben). Avatar Ben
// (medicaid_opt.mp4 provee el audio de toda la narración) + b-roll real + 12 componentes
// a medida + diagramas. ~21.7 min. CUES generados desde beatsheet/medicaid.json.

const VIDEO_END = Math.max(...CUES.map((c) => c.start + c.dur)) + 1.5;
export const TOTAL_FRAMES_MED = Math.round(VIDEO_END * 30);

// grade por mood (alarma): rojo en amenazas, ámbar/oro en soluciones, rojo tenue al cierre
const GRADE: GradeRange[] = [
  { from: 0, to: 75, tint: "#E11507", strength: 0.08 },        // hook: rojo
  { from: 75, to: 320, tint: "#C8904A", strength: 0.05 },      // Rafael/costo: ámbar cálido
  { from: 320, to: 660, tint: "#E11507", strength: 0.06 },     // la ley/el mito/errores: rojo
  { from: 660, to: 870, tint: "#1FBF4F", strength: 0.05 },     // soluciones: verde esperanza
  { from: 870, to: VIDEO_END, tint: "#FFC400", strength: 0.05 }, // cierre/firma: oro
];

// ── Ventanas del avatar (variedad de posiciones) ──
// los componentes full-screen (custom + estructurados) OCULTAN al avatar; raw/quote/chips/stat
// llevan el PiP del presentador sobre el b-roll.
const HIDE = new Set([
  "impact", "diagram", "journey", "infzoom", "rule", "headline", "aged", "bars", "cross",
  "process", "checklist", "splitlist", "annotated",
  "estateletter", "twomoments", "mistake", "goldvault", "lookback", "tool", "deed",
  "odometer", "signature", "vsmed", "action", "nextvideo",
]);
const VIS = new Set(["raw", "quote", "chips", "stat", "callout"]);
// secciones donde el avatar habla a cámara → PANTALLA COMPLETA
const FULL_SECS = new Set(["benintro", "promesa", "mito", "cta_estado", "cta_sub", "soluciones", "cta_final", "outro"]);
const sectionOf = (key: string) => key.replace(/_\d+$/, "");

function buildWindows(): AvatarWindow[] {
  const w: AvatarWindow[] = [{ start: 0, mode: "full" }]; // abre full ≥1s
  let last: AvatarWindow["mode"] = "full";
  let visIdx = 0;
  const rotation: AvatarWindow["mode"][] = ["cornerTR", "cornerBR", "right", "cornerTL", "left", "cornerBL"];
  for (const c of CUES) {
    let mode: AvatarWindow["mode"];
    if (c.kind === "half") mode = "halfL";
    else if (c.kind === "float") mode = "full";
    else if (HIDE.has(c.kind)) mode = "hidden";
    else if (VIS.has(c.kind)) {
      mode = FULL_SECS.has(sectionOf(c.key)) ? "full" : rotation[visIdx % rotation.length];
      visIdx++;
    } else mode = "hidden";
    if (mode !== last) { w.push({ start: c.start, mode }); last = mode; }
  }
  return w;
}
const AVATAR_WINDOWS = buildWindows();

// stingers/swells en fronteras de sección
const SECTION_KEYS = new Set(
  CUES.filter((c) => c.kind === "rule" || ["dosmomentos_0", "soluciones_0", "firma_0", "tease_0"].includes(c.key)).map((c) => c.key),
);

export const MainMedicaid: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.7} grain={0.05}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          {/* fondo: brasa roja sutil (sin grid terroso) */}
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${COLORS.bg1} 0%, ${COLORS.bg0} 70%)` }} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {/* AVATAR encima del b-roll — provee el audio de toda la narración */}
          <AvatarLayer src="medicaid_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {/* HOOK: texto sobre el avatar vivo oscurecido */}
          {(() => {
            const hookEnd = CUES[0].start - 0.3;
            const from = 1.4;
            const dur = Math.max(2, hookEnd - from);
            return (
              <Sequence from={sec(from)} durationInFrames={sec(dur)} layout="none">
                <AvatarScrimText durationInFrames={sec(dur)} setup="Si tu casa está pagada…" impact="Medicaid se la puede QUEDAR" impactAccent="danger" fontSize={120} />
              </Sequence>
            );
          })()}
          <SectionGrade ranges={GRADE} />
          {[...SECTION_KEYS].map((k) => {
            const c = CUES.find((x) => x.key === k)!;
            return (
              <Sequence key={"stg" + k} from={Math.max(0, sec(c.start) - sec(0.25))} durationInFrames={sec(0.7)} layout="none">
                <SectionStinger />
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </CinematicWrap>
      {[...SECTION_KEYS].map((k) => {
        const c = CUES.find((x) => x.key === k)!;
        return <SfxCue key={"sw" + k} at={Math.max(0, sec(c.start) - sec(0.4))} src={SFX.sectionSwell} volume={0.2} durationInFrames={sec(2)} />;
      })}
      {[...SECTION_KEYS].map((k) => {
        const c = CUES.find((x) => x.key === k)!;
        return <SfxCue key={"st" + k} at={sec(c.start)} src={SFX.stingerHit} volume={0.22} durationInFrames={sec(1.6)} />;
      })}
    </AbsoluteFill>
  );
};
