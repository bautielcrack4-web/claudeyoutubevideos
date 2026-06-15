import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme_ben";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { SfxCue, SFX } from "./components/Sfx";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { CUES } from "./cues_viuda.gen";

// ── CANAL "BEN RETIRADO" · Video 2 · "La trampa de la viuda" ──
// Look ALARMA (theme_ben). Avatar Ben (viuda_opt.mp4 provee el audio). KeyPhrase + PNGs
// flotando + componentes a medida. Sync milimétrico (captions alineadas). ~22.7 min.

const VIDEO_END = Math.max(...CUES.map((c) => c.start + c.dur)) + 1.5;
export const TOTAL_FRAMES_VD = Math.round(VIDEO_END * 30);

const GRADE: GradeRange[] = [
  { from: 0, to: 90, tint: "#E11507", strength: 0.08 },        // hook: rojo
  { from: 90, to: 360, tint: "#C8904A", strength: 0.05 },      // Elena/Manuel: ámbar cálido
  { from: 360, to: 760, tint: "#E11507", strength: 0.06 },     // la trampa/errores: rojo
  { from: 760, to: 1080, tint: "#1FBF4F", strength: 0.05 },    // soluciones: verde
  { from: 1080, to: VIDEO_END, tint: "#FFC400", strength: 0.05 }, // cierre/firma: oro
];

// keyphrase/floatprop/diorama = full-screen con su propio fondo → ocultan avatar.
// statpills = overlay translúcido sobre el avatar → avatar VISIBLE (full).
const HIDE = new Set([
  "impact", "diagram", "journey", "infzoom", "rule", "headline", "aged", "bars", "cross",
  "process", "checklist", "splitlist", "annotated",
  "estateletter", "twomoments", "mistake", "goldvault", "lookback", "tool", "deed",
  "odometer", "signature", "vsmed", "action", "nextvideo", "keyphrase", "floatprop", "diorama",
]);
const VIS = new Set(["raw", "quote", "chips", "stat", "callout", "statpills"]);
const FULL_SECS = new Set(["benintro", "promesa", "cta_dos", "cta_sub", "soluciones", "cta_final", "outro"]);
const sectionOf = (key: string) => key.replace(/_\d+$/, "");

function buildWindows(): AvatarWindow[] {
  const w: AvatarWindow[] = [{ start: 0, mode: "full" }];
  let last: AvatarWindow["mode"] = "full";
  let visIdx = 0;
  const rotation: AvatarWindow["mode"][] = ["cornerTR", "cornerBR", "right", "cornerTL", "left", "cornerBL"];
  for (const c of CUES) {
    let mode: AvatarWindow["mode"];
    if (c.kind === "statpills") mode = "full";
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

const SECTION_KEYS = new Set(
  CUES.filter((c) => c.kind === "rule" || ["soltero_0", "soluciones_0", "firma_0", "tease_0"].includes(c.key)).map((c) => c.key),
);

export const MainViuda: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.7} grain={0.05}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${COLORS.bg1} 0%, ${COLORS.bg0} 70%)` }} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="viuda_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {(() => {
            const hookEnd = CUES[0].start - 0.3;
            const from = 1.5;
            const dur = Math.max(2, hookEnd - from);
            return (
              <Sequence from={sec(from)} durationInFrames={sec(dur)} layout="none">
                <AvatarScrimText durationInFrames={sec(dur)} setup="Si tu pareja falta…" impact="El que queda paga MÁS" impactAccent="danger" fontSize={116} />
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
