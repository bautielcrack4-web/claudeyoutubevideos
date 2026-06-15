import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme_ben";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { SfxCue, SFX } from "./components/Sfx";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { CUES } from "./cues_hormiga.gen";

// ── CANAL "BEN RETIRADO" · Video 4 · "Los gastos hormiga que se comen tu jubilación" ──
// Look ALARMA (theme_ben). Avatar Ben (hormiga_opt.mp4 provee el audio). TEMA UNIVERSAL.
// KeyPhrase palabra-por-palabra + PNGs flotando + 8 HORMIGAS (MistakeCard) + el MÉTODO
// (process/checklist/tool) + journeys oscuros. Sync milimétrico. ~27.4 min.

const VIDEO_END = Math.max(...CUES.map((c) => c.start + c.dur)) + 1.5;
export const TOTAL_FRAMES_HB = Math.round(VIDEO_END * 30);

const GRADE: GradeRange[] = [
  { from: 0, to: 91, tint: "#E11507", strength: 0.08 },         // hook: rojo alarma
  { from: 91, to: 492, tint: "#C8904A", strength: 0.05 },       // Ben / Don Tito / por qué: ámbar
  { from: 492, to: 876, tint: "#E11507", strength: 0.06 },      // las 8 hormigas: rojo
  { from: 876, to: 1084, tint: "#FFC400", strength: 0.05 },     // la cuenta: oro
  { from: 1084, to: 1428, tint: "#1FBF4F", strength: 0.05 },    // el método: verde a salvo
  { from: 1428, to: VIDEO_END, tint: "#FFC400", strength: 0.05 }, // cierre / firma: oro
];

const HIDE = new Set([
  "impact", "diagram", "journey", "infzoom", "rule", "headline", "aged", "bars", "cross",
  "process", "checklist", "splitlist", "annotated",
  "estateletter", "twomoments", "mistake", "goldvault", "lookback", "tool", "deed",
  "odometer", "signature", "vsmed", "action", "nextvideo", "keyphrase", "floatprop", "diorama",
]);
const VIS = new Set(["raw", "quote", "chips", "stat", "callout", "statpills"]);
// secciones donde Ben habla a cámara → avatar FULL (cubre las imágenes hb_ben_*)
const FULL_SECS = new Set(["benintro", "porque", "cuenta", "nosientas", "ctashare", "ctasub", "metodo", "epi", "tease", "outro"]);
const sectionOf = (key: string) => key.replace(/_(\d+|f\d+)$/, "");

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

const STINGER_KEYS = ["anecben_0", "cat1_0", "cuenta_0", "metodo_0", "firma_0", "tease_0"];
const SECTION_KEYS = new Set(CUES.filter((c) => STINGER_KEYS.includes(c.key)).map((c) => c.key));

export const MainHormiga: React.FC = () => {
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
          <AvatarLayer src="hormiga_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {(() => {
            const hookEnd = CUES[0].start - 0.3;
            const from = 1.5;
            const dur = Math.max(2, hookEnd - from);
            return (
              <Sequence from={sec(from)} durationInFrames={sec(dur)} layout="none">
                <AvatarScrimText durationInFrames={sec(dur)} setup="No te lo roban de golpe…" impact="Te lo GOTEAN en silencio" impactAccent="amber" fontSize={104} />
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
