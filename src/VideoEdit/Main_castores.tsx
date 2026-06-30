import { AbsoluteFill, Sequence, Audio, staticFile, Loop, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";

// cross-dissolve sutil entre tomas (estética documental NatGeo, no corte duro seco)
const DIS = 10; // ~0.33s
const FadeIn: React.FC<{ children: React.ReactNode; on: boolean }> = ({ children, on }) => {
  const f = useCurrentFrame();
  const op = on ? interpolate(f, [0, DIS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};
import { TechBackground } from "./components/TechBackground";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionStinger } from "./components/SectionFx";
import { CUES, OVERLAYS } from "./cues_castores.gen";

// ── LOS CASTORES PARACAIDISTAS DE IDAHO (1948) — documental FACELESS ──
// Voz clonada (public/castores.wav) + flujo denso de clips/imágenes reales + componentes.
// SIN avatar, SIN filtros de color, SIN camas ambientales: narración + SFX puntuales.
const INTRO = 4.0; // cold-open teaser antes de la narración (todo corre +INTRO)
const END = Math.max(...CUES.map((c) => c.start + c.dur), ...OVERLAYS.map((c) => c.start + c.dur));
export const TOTAL_FRAMES_CAS = Math.round((END + 1.5) * 30);

// inicio de cada sección (primer beat de cada sección, parseando la key) → stingers/SFX
const sectionOf = (k: string) => k.split(/_\d/)[0];
const ACTS = (() => {
  const seen = new Set<string>();
  const out: number[] = [];
  for (const c of [...CUES].sort((a, b) => a.start - b.start)) {
    if (c.key.startsWith("teaser")) continue;
    const s = sectionOf(c.key);
    if (!seen.has(s)) { seen.add(s); out.push(c.start); }
  }
  return out;
})();

export const MainCastores: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {/* SIN filtros: grano 0, viñeta 0, sin SectionGrade — colores 100% naturales */}
      <CinematicWrap handheld={0.8} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="cold" drift={0.5} />
          {CUES.map((cue, i) => {
            const from = i === 0 ? sec(cue.start) : sec(cue.start) - DIS;
            const dur = i === 0 ? sec(cue.dur) : sec(cue.dur) + DIS;
            return (
              <Sequence key={cue.key} from={from} durationInFrames={dur}>
                <FadeIn on={i !== 0}>{cue.el(dur)}</FadeIn>
              </Sequence>
            );
          })}
          {/* CAPA DE OVERLAYS: componentes ENCIMA del clip (location/stat/name/phrase/meter) */}
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {ACTS.filter((t) => t > sec(0.1) / 30).map((t) => (
            <Sequence key={"stg" + t} from={sec(t) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>

      {/* NARRACIÓN: voz clonada, arranca después del cold-open teaser (+INTRO) */}
      <Sequence from={sec(INTRO)}>
        <Audio src={staticFile("castores.wav")} />
      </Sequence>

      {/* MÚSICA: score calmo en loop a volumen BAJO bajo toda la narración */}
      <Loop durationInFrames={Math.round(773.75 * 30)}>
        <Audio src={staticFile("castores_music.mp3")} volume={0.13} />
      </Loop>

      {/* SFX puntuales SOLO en cambios de sección (sin cama ambiental) */}
      {ACTS.map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.18} durationInFrames={sec(2)} />
      ))}
      {ACTS.map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.2} durationInFrames={sec(1.6)} />
      ))}
      {/* número rodando en cada cifra/fecha overlay */}
      {OVERLAYS.filter((o) => o.kind === "stattag").map((o) => (
        <SfxCue key={"roll" + o.key} at={sec(o.start) + sec(0.2)} src={SFX.numberRoll} volume={0.26} durationInFrames={sec(1.6)} />
      ))}
      {/* whoosh suave en los reveals de componente full (spreadmap/timeline) */}
      {CUES.filter((c) => c.kind === "spreadmap" || c.kind === "timeline").map((c) => (
        <SfxCue key={"wh" + c.key} at={sec(c.start) - sec(0.18)} src={SFX.whoosh} volume={0.22} durationInFrames={sec(1.2)} />
      ))}
    </AbsoluteFill>
  );
};
