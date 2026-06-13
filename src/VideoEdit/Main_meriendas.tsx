import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES } from "./cues_meriendas.gen";

// ── 25 MERIENDAS CASERAS QUE YA NADIE PREPARA — documental FACELESS (~28.5 min) ──
// Voz clonada de la anciana (public/meriendas.wav, pista continua) + flujo denso de
// fotos/clips REALES (90% stock) + IA criolla (10%) + componentes estructurados.
// SIN avatar en cámara. SIN camas ambientales (regla del usuario): narración + SFX
// puntuales en cambios de sección. Cues generados desde beatsheet/meriendas.json.
const SECONDS = 1713;
export const TOTAL_FRAMES_MER = Math.round(SECONDS * 30); // 51390

// inicio de cada sección/merienda (de los captions) — para grade + stingers de sección
const ACTS = [
  0, 88.04, 157.16, 220.04, 291.36, 347.2, 403.46, 485, 509.54, 559.14, 617.67,
  669.28, 721.2, 782.56, 832, 885.29, 936.91, 986.99, 1040.2, 1092.49, 1145.14,
  1196, 1251, 1311.94, 1384.36, 1445.55, 1508.48, 1578.98, 1643.7,
];

// color-grade por sección: wash terroso que rota (cálido ↔ eucalipto frío ↔ verde),
// con los tramos emotivos (mazamorra, cierre) en eucalipto frío reflexivo.
const TINTS = ["#A9794A", "#6F8478", "#6E8B47", "#C8904A"]; // sepia · eucalipto · verde · ámbar
const EMOTIONAL = new Set([21, 27, 28]); // mazamorra, merienda compartida, cierre
const GRADE: GradeRange[] = ACTS.map((from, i) => ({
  from,
  to: ACTS[i + 1] ?? SECONDS,
  tint: EMOTIONAL.has(i) ? "#6F8478" : TINTS[i % TINTS.length],
  strength: EMOTIONAL.has(i) ? 0.08 : 0.06,
}));

export const MainMeriendas: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.8} grain={0.06}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <SectionGrade ranges={GRADE} />
          {ACTS.filter((t) => t > 0).map((t) => (
            <Sequence key={"stg" + t} from={sec(t) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>

      {/* NARRACIÓN: voz clonada de la anciana, pista continua desde 0 */}
      <Audio src={staticFile("meriendas.wav")} />

      {/* SFX puntuales SOLO en cambios de sección (sin cama ambiental) */}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.18} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.2} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
