import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { SfxCue, SFX } from "./components/Sfx";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { CUES } from "./cues_borax.gen";

// ── VIDEO 2 · EL CONSTRUCTOR LIBRE — "Esta madera NUNCA tendrá termitas" ──
// Avatar "Tomás" (borax_opt.mp4 = audio de toda la narración) + flujo denso TUTORIAL
// (gpt-image-2 16:9 imperfecto + clips reales + diagramas). 3 injertos. ~18.9 min.

const VIDEO_END = Math.max(...CUES.map((c) => c.start + c.dur)) + 1.5;
export const TOTAL_FRAMES_BX = Math.round(VIDEO_END * 30);

const GRADE: GradeRange[] = [
  { from: 0, to: 90, tint: "#A9794A", strength: 0.07 },        // hook: sepia madera
  { from: 90, to: 300, tint: "#B0833F", strength: 0.05 },      // problema/bórax: tierra
  { from: 300, to: 560, tint: "#7C8A5A", strength: 0.05 },     // aceite/cal: salvia
  { from: 560, to: 980, tint: "#B0833F", strength: 0.05 },     // empezar/plan: tierra
  { from: 980, to: VIDEO_END, tint: "#A9794A", strength: 0.07 }, // cierre: sepia
];

const HIDE = new Set(["impact", "diagram", "journey", "infzoom", "rule", "headline", "aged", "bars", "cross", "process", "checklist", "splitlist", "costtally", "callout", "annotated"]);
const VIS = new Set(["raw", "quote", "chips", "stat"]);
const FULL_SECS = new Set(["ident", "cierre", "proximo", "coment"]);
const sectionOf = (key: string) => key.replace(/_\d+$/, "");

function buildWindows(): AvatarWindow[] {
  const w: AvatarWindow[] = [{ start: 0, mode: "full" }];
  let last = "full";
  let visIdx = 0;
  const rotation: AvatarWindow["mode"][] = ["cornerTR", "cornerTR", "right", "cornerTR", "left"];
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
const SECTION_KEYS = new Set(CUES.filter((c) => c.kind === "rule").map((c) => c.key));

export const MainBorax: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.8} grain={0.06}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="borax_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {(() => {
            const hookEnd = CUES[0].start - 0.3;
            const from = 1.4, dur = Math.max(2, hookEnd - from);
            return (
              <Sequence from={sec(from)} durationInFrames={sec(dur)} layout="none">
                <AvatarScrimText durationInFrames={sec(dur)} setup="Veinte años en lo húmedo" impact="Intacta" impactAccent="amber" fontSize={160} />
              </Sequence>
            );
          })()}
          <SectionGrade ranges={GRADE} />
          {[...SECTION_KEYS].map((k) => {
            const c = CUES.find((x) => x.key === k)!;
            return (
              <Sequence key={"stg" + k} from={sec(c.start) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
                <SectionStinger />
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </CinematicWrap>
      {[...SECTION_KEYS].map((k) => {
        const c = CUES.find((x) => x.key === k)!;
        return <SfxCue key={"sw" + k} at={sec(c.start) - sec(0.4)} src={SFX.sectionSwell} volume={0.2} durationInFrames={sec(2)} />;
      })}
      {[...SECTION_KEYS].map((k) => {
        const c = CUES.find((x) => x.key === k)!;
        return <SfxCue key={"st" + k} at={sec(c.start)} src={SFX.stingerHit} volume={0.22} durationInFrames={sec(1.6)} />;
      })}
    </AbsoluteFill>
  );
};
