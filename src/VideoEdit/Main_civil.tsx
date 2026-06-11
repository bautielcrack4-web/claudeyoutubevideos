import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES } from "./cues_civil.gen";

// ── 7 CIVILIZACIONES QUE EXISTIERON ANTES QUE LA HISTORIA — con avatar (~24.6 min) ──
// Narración (public/civil.wav, vía AvatarLayer/civil_opt.mp4) + ~80% IMÁGENES REALES
// (real/cv*) y CLIPS de STOCK (broll/cvb*) + diagramas + recreaciones deAPI.
const SECONDS = 1475.6;
export const TOTAL_FRAMES_CIVIL = Math.round(SECONDS * 30); // 44268

// límites de civilización/sección (segundos)
const ACTS = [0, 68.3, 249.0, 470.4, 650.1, 829.2, 979.6, 1126.9, 1258.4, 1319.6, 1462.9];

// color-grade por mood de sección (paleta terrosa)
const GRADE: GradeRange[] = [
  { from: 0, to: 68.3, tint: "#B0503C", strength: 0.07 },        // hook: terracota
  { from: 68.3, to: 249.0, tint: "#C8904A", strength: 0.06 },    // Teotihuacán: sol/ámbar
  { from: 249.0, to: 470.4, tint: "#6F8478", strength: 0.06 },   // Indo: ladrillo gris/frío
  { from: 470.4, to: 650.1, tint: "#6F8478", strength: 0.06 },   // Minoica: egeo eucalipto
  { from: 650.1, to: 829.2, tint: "#A9794A", strength: 0.06 },   // Tartessos: oro sepia
  { from: 829.2, to: 979.6, tint: "#C8904A", strength: 0.06 },   // Caral: desierto ámbar
  { from: 979.6, to: 1126.9, tint: "#B0503C", strength: 0.07 },  // Anasazi: roca roja
  { from: 1126.9, to: 1258.4, tint: "#6F8478", strength: 0.07 }, // Turuñuelo: enterrado frío
  { from: 1258.4, to: 1319.6, tint: "#A9794A", strength: 0.06 }, // recap: sepia
  { from: 1319.6, to: 1462.9, tint: "#B0503C", strength: 0.07 }, // patrón: terracota
  { from: 1462.9, to: SECONDS, tint: "#6F8478", strength: 0.07 },// cierre: frío
];

// camas ambientales (vol muy bajo)
const DEEP = "sfx/Smooth,_very_deep_ci_#2-1780916058254.mp3";
const WIND = "sfx/cold_winter_wind,_lo_#1-1780924461333.mp3";
const AMBIENT: { from: number; to: number; src: string; vol: number }[] = [
  { from: 0, to: 68.3, src: DEEP, vol: 0.04 },           // hook
  { from: 68.3, to: 249.0, src: "sfx/amb_campo.mp3", vol: 0.04 },  // Teotihuacán (valle)
  { from: 249.0, to: 470.4, src: DEEP, vol: 0.038 },     // Indo
  { from: 470.4, to: 650.1, src: WIND, vol: 0.035 },     // Minoica (mar/viento)
  { from: 650.1, to: 829.2, src: "sfx/amb_campo.mp3", vol: 0.038 }, // Tartessos (marismas)
  { from: 829.2, to: 979.6, src: WIND, vol: 0.035 },     // Caral (desierto)
  { from: 979.6, to: 1126.9, src: WIND, vol: 0.038 },    // Anasazi (cañón)
  { from: 1126.9, to: 1258.4, src: DEEP, vol: 0.04 },    // Turuñuelo
  { from: 1258.4, to: SECONDS, src: DEEP, vol: 0.04 },   // recap + patrón + cierre
];

const PIP_KINDS = new Set(["raw", "stat", "quote", "chips"]);
const OPENER = 5;
const OPENER_SPANS = ACTS.filter((t) => t > 0).map((t) => ({ s: t, e: t + OPENER }));
const HOOK_END = 64;

function modeAt(t: number): AvatarWindow["mode"] {
  if (t < HOOK_END) return "hidden";
  const c = CUES.find((c) => t >= c.start && t < c.start + c.dur);
  if (c && !PIP_KINDS.has(c.kind)) return "hidden";
  for (const a of OPENER_SPANS) if (t >= a.s && t < a.e) return "full";
  if (!c) return "full";
  return "cornerTR";
}
function buildAvatarWindows(): AvatarWindow[] {
  const marks = new Set<number>([0, HOOK_END, SECONDS]);
  for (const c of CUES) { marks.add(c.start); marks.add(+(c.start + c.dur).toFixed(2)); }
  for (const a of OPENER_SPANS) { marks.add(a.s); marks.add(+a.e.toFixed(2)); }
  const times = [...marks].filter((t) => t >= 0 && t < SECONDS).sort((a, b) => a - b);
  const w: AvatarWindow[] = [];
  let last = "";
  for (let i = 0; i < times.length; i++) {
    const t0 = times[i], t1 = times[i + 1] ?? SECONDS;
    const mid = (t0 + t1) / 2;
    const mode = modeAt(mid);
    if (mode !== last) { w.push({ start: +t0.toFixed(2), mode }); last = mode; }
  }
  w.push({ start: SECONDS, mode: "hidden" });
  return w;
}
const AVATAR_WINDOWS = buildAvatarWindows();

export const MainCivil: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {AMBIENT.map((a, i) => (
        <Sequence key={"amb" + i} from={sec(a.from)} durationInFrames={sec(a.to - a.from)} layout="none">
          <Audio src={staticFile(a.src)} volume={a.vol} loop />
        </Sequence>
      ))}
      <CinematicWrap handheld={0.8} grain={0.06}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="civil_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          <SectionGrade ranges={GRADE} />
          {ACTS.filter((t) => t > 0).map((t) => (
            <Sequence key={"stg" + t} from={sec(t) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.2} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.22} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
