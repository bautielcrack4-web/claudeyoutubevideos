import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES } from "./cues_hipos.gen";

// ── LOS HIPOPÓTAMOS DE PABLO ESCOBAR — documental con avatar (~28 min) ──
// Narración (public/hipos.wav, la provee AvatarLayer) + flujo de imágenes reales
// y clips + diagramas. Paleta terrosa. Cues generados desde beatsheet/hipos.json.
const SECONDS = 1684;
export const TOTAL_FRAMES_HIP = Math.round(SECONDS * 30); // 50520

// límites de acto (segundos) — para grade + stingers
const ACTS = [0, 33, 146, 272, 454, 698, 935, 1110, 1280, 1321];

// color-grade por mood de sección (wash suave, paleta terrosa)
const GRADE: GradeRange[] = [
  { from: 0, to: 146, tint: "#C8904A", strength: 0.06 },     // hook/tesis: ámbar cálido
  { from: 146, to: 454, tint: "#A9794A", strength: 0.07 },   // Escobar/abandono: sepia
  { from: 454, to: 698, tint: "#6F8478", strength: 0.07 },   // explosión/río: eucalipto frío
  { from: 698, to: 935, tint: "#B0503C", strength: 0.06 },   // daño ecológico: terracota
  { from: 935, to: 1110, tint: "#B0503C", strength: 0.05 },  // peligro humano: terracota
  { from: 1110, to: 1280, tint: "#7C8A5A", strength: 0.05 }, // turismo/soluciones: salvia
  { from: 1280, to: SECONDS, tint: "#A9794A", strength: 0.07 }, // plan/cierre: sepia nostálgico
];

// camas ambientales loopables (vol muy bajo) — regla de niveles: 0.035–0.05
const AMBIENT: { from: number; to: number; src: string; vol: number }[] = [
  { from: 0, to: 454, src: "sfx/amb_campo.mp3", vol: 0.04 },
  { from: 454, to: 935, src: "sfx/amb_campo.mp3", vol: 0.045 },
  { from: 935, to: 1280, src: "sfx/cold_winter_wind,_lo_#1-1780924461333.mp3", vol: 0.035 },
  { from: 1280, to: SECONDS, src: "sfx/amb_campo.mp3", vol: 0.04 },
];

// ── Cronograma del AVATAR derivado de los cues ──────────────────────────────
// Regla: hidden en el HOOK (0–33, el clip manda) y sobre los DIAGRAMAS (traen su
// propio avatar); cornerTR sobre runs de b-roll (PiP presente); full en los huecos
// sin b-roll (habla a pantalla completa). Persiste hasta la siguiente entrada.
function buildAvatarWindows(): AvatarWindow[] {
  const cues = [...CUES].sort((a, b) => a.start - b.start);
  const w: AvatarWindow[] = [{ start: 0, mode: "hidden" }];
  let cursor = 33;
  let lastMode = "hidden";
  const push = (start: number, mode: AvatarWindow["mode"]) => {
    if (mode !== lastMode) {
      w.push({ start: +start.toFixed(2), mode });
      lastMode = mode;
    }
  };
  for (const c of cues) {
    if (c.start < 33) { cursor = Math.max(cursor, c.start + c.dur); continue; }
    if (c.start > cursor + 0.4) push(cursor, "full"); // hueco → habla full
    // diagram(d) / impact(i) / journey(j) = momentos full-bleed → avatar oculto.
    // raw(hip_*) y stat(s) = b-roll/número → avatar en PiP esquina.
    const fullBleed = /^[dij]/.test(c.key);
    push(c.start, fullBleed ? "hidden" : "cornerTR");
    cursor = c.start + c.dur;
  }
  push(cursor, "full"); // cierre largo: a pantalla completa
  push(SECONDS, "hidden");
  return w;
}
const AVATAR_WINDOWS = buildAvatarWindows();

export const MainHipos: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {/* camas ambientales debajo de todo */}
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
          {/* AVATAR encima del b-roll (provee el audio de la narración siempre) */}
          <AvatarLayer src="hipos_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          <SectionGrade ranges={GRADE} />
          {/* whip + light-leak en cada cambio de acto */}
          {ACTS.filter((t) => t > 0).map((t) => (
            <Sequence key={"stg" + t} from={sec(t) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      {/* cambio de acto: swell + golpe grave (niveles contenidos) */}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.2} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.22} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
