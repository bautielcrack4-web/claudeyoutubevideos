import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES } from "./cues_objetos.gen";

// ── 7 OBJETOS QUE APARECIERON DE LA NADA — documental con avatar (~33.5 min) ──
// Narración (public/objetos.wav, la provee AvatarLayer vía objetos_opt.mp4) + flujo
// denso de fotos REALES (real/ob*), recreaciones (deAPI), diagramas gpt-image-2,
// stats, journeys, quotes. Cues generados desde beatsheet/objetos.json.
const SECONDS = 2007.2;
export const TOTAL_FRAMES_OBJ = Math.round(SECONDS * 30); // 60216

// límites de objeto/sección (segundos) — para grade + stingers
const ACTS = [0, 78.2, 294.2, 508.4, 720.4, 903.2, 1066.2, 1240.2, 1486.5, 1569.5, 1768.5];

// color-grade por mood de sección (wash suave, paleta terrosa)
const GRADE: GradeRange[] = [
  { from: 0, to: 78.2, tint: "#B0503C", strength: 0.07 },       // hook: terracota ominoso
  { from: 78.2, to: 294.2, tint: "#6F8478", strength: 0.06 },   // Klerksdorp: eucalipto frío
  { from: 294.2, to: 508.4, tint: "#A9794A", strength: 0.06 },  // Antikythera: bronce sepia
  { from: 508.4, to: 720.4, tint: "#6F8478", strength: 0.06 },  // Aiud: metálico frío
  { from: 720.4, to: 903.2, tint: "#A9794A", strength: 0.06 },  // Delhi: hierro cálido
  { from: 903.2, to: 1066.2, tint: "#6E8B47", strength: 0.06 }, // Costa Rica: verde selva
  { from: 1066.2, to: 1240.2, tint: "#A9794A", strength: 0.06 },// Martillo: sepia Texas
  { from: 1240.2, to: 1486.5, tint: "#C8904A", strength: 0.06 },// Göbekli: piedra/amanecer
  { from: 1486.5, to: 1569.5, tint: "#B0503C", strength: 0.07 },// recap: terracota
  { from: 1569.5, to: 1768.5, tint: "#6F8478", strength: 0.07 },// reflexión: eucalipto frío
  { from: 1768.5, to: SECONDS, tint: "#A9794A", strength: 0.06 },// cierre: sepia
];

// camas ambientales loopables (vol muy bajo) — regla de niveles: 0.035–0.05
const DEEP = "sfx/Smooth,_very_deep_ci_#2-1780916058254.mp3"; // dron grave de misterio
const WIND = "sfx/cold_winter_wind,_lo_#1-1780924461333.mp3";
const AMBIENT: { from: number; to: number; src: string; vol: number }[] = [
  { from: 0, to: 78.2, src: DEEP, vol: 0.04 },          // hook: dron grave
  { from: 78.2, to: 294.2, src: WIND, vol: 0.035 },     // mina sudafricana
  { from: 294.2, to: 508.4, src: DEEP, vol: 0.038 },    // fondo del mar (dron)
  { from: 508.4, to: 720.4, src: WIND, vol: 0.035 },    // zanja Rumanía
  { from: 720.4, to: 903.2, src: DEEP, vol: 0.035 },    // Delhi
  { from: 903.2, to: 1066.2, src: "sfx/amb_campo.mp3", vol: 0.04 }, // selva Costa Rica
  { from: 1066.2, to: 1240.2, src: WIND, vol: 0.035 },  // Texas
  { from: 1240.2, to: 1486.5, src: WIND, vol: 0.038 },  // colinas turcas
  { from: 1486.5, to: SECONDS, src: DEEP, vol: 0.04 },  // recap + reflexión + cierre
];

// el avatar va en PiP esquina solo sobre b-roll/numeros/citas; OCULTO bajo cualquier
// gráfico full-bleed (diagramas, journeys, headlines, barras, etc.).
const PIP_KINDS = new Set(["raw", "stat", "quote", "chips"]);
const OPENER = 5; // s de avatar full al inicio de cada sección
const OPENER_SPANS = ACTS.filter((t) => t > 0).map((t) => ({ s: t, e: t + OPENER }));
const HOOK_END = 70; // el hook va sin avatar (montaje denso); el avatar entra al obj 1

function modeAt(t: number): AvatarWindow["mode"] {
  if (t < HOOK_END) return "hidden";
  const c = CUES.find((c) => t >= c.start && t < c.start + c.dur);
  if (c && !PIP_KINDS.has(c.kind)) return "hidden"; // gráfico full-bleed oculta al avatar
  for (const a of OPENER_SPANS) if (t >= a.s && t < a.e) return "full"; // apertura → full
  if (!c) return "full"; // hueco → habla full
  return "cornerTR"; // raw/stat/quote/chips → PiP sobre el b-roll
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

export const MainObjetos: React.FC = () => {
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
          <AvatarLayer src="objetos_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
