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
import { CUES, OVERLAYS } from "./cues_huron.gen";

// ── EL HURÓN DE PATAS NEGRAS — documental FACELESS (~24.7 min) ──
// Voz clonada (public/huron.wav, pista continua) + flujo denso de imágenes gpt-image-2
// + componentes estructurados (stat/bars/journey/process/annotated...). SIN avatar.
// SIN camas ambientales: narración + SFX puntuales en cambios de sección.
const INTRO = 4.0; // cold-open teaser antes de la narración (corre todo +INTRO)
const SECONDS = 1482 + INTRO;
export const TOTAL_FRAMES_HUR = Math.round(SECONDS * 30);

// inicio de cada sección (de captions_huron_aligned) +INTRO — para stingers/SFX
const ACTS = [
  0, 92.6, 110.3, 138.2, 198.1, 240.7, 289.5, 331.1, 367.1, 415.7, 461.4, 480.1,
  520.2, 594.1, 630.1, 661.4, 687.6, 730.8, 796.3, 809.3, 850.5, 900.7, 910.4,
  976.4, 1008.0, 1053.6, 1074.1, 1139.7, 1183.8, 1234.5, 1328.9, 1347.7, 1374.3,
  1421.1, 1461.0, 1467.3,
].map((t) => t + INTRO);

export const MainHuron: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {/* SIN filtros: grano 0, viñeta 0, sin SectionGrade — colores 100% naturales */}
      <CinematicWrap handheld={0.8} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="cold" drift={0.5} />
          {CUES.map((cue, i) => {
            // cada toma entra cruzando-disolviendo sobre la anterior (se solapan DIS frames)
            const from = i === 0 ? sec(cue.start) : sec(cue.start) - DIS;
            const dur = i === 0 ? sec(cue.dur) : sec(cue.dur) + DIS;
            return (
              <Sequence key={cue.key} from={from} durationInFrames={dur}>
                <FadeIn on={i !== 0}>{cue.el(dur)}</FadeIn>
              </Sequence>
            );
          })}
          {/* CAPA DE OVERLAYS: componentes ENCIMA del clip (location tags, etc.) */}
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {ACTS.filter((t) => t > 0).map((t) => (
            <Sequence key={"stg" + t} from={sec(t) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>

      {/* NARRACIÓN: voz clonada, arranca después del cold-open teaser (+INTRO) */}
      <Sequence from={sec(INTRO)}>
        <Audio src={staticFile("huron.wav")} />
      </Sequence>

      {/* MÚSICA: canción "Rastro Sagrado" (Suno) en loop a volumen BAJO bajo toda la narración */}
      <Loop durationInFrames={Math.round(773.75 * 30)}>
        <Audio src={staticFile("huron_music.mp3")} volume={0.13} />
      </Loop>

      {/* SFX puntuales SOLO en cambios de sección (sin cama ambiental) */}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.18} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.2} durationInFrames={sec(1.6)} />
      ))}

      {/* DISEÑO DE SONIDO puntual: boom grave en cada cartón de capítulo */}
      {OVERLAYS.filter((o) => o.kind === "chapter").map((o) => (
        <SfxCue key={"boom" + o.key} at={sec(o.start)} src={SFX.boom1} volume={0.4} durationInFrames={sec(2)} />
      ))}
      {/* número rodando en cada cifra/fecha overlay */}
      {OVERLAYS.filter((o) => o.kind === "stattag").map((o) => (
        <SfxCue key={"roll" + o.key} at={sec(o.start) + sec(0.2)} src={SFX.numberRoll} volume={0.26} durationInFrames={sec(1.6)} />
      ))}
      {/* whoosh suave al entrar cada cartón de capítulo */}
      {OVERLAYS.filter((o) => o.kind === "chapter").map((o) => (
        <SfxCue key={"wh" + o.key} at={sec(o.start) - sec(0.18)} src={SFX.whoosh} volume={0.22} durationInFrames={sec(1.2)} />
      ))}
      {/* pulsos de tensión (latido aproximado con boom grave espaciado) en "la decisión imposible" */}
      {[536.5, 538.1, 539.8, 541.6, 543.5].map((t) => (
        <SfxCue key={"pulse" + t} at={sec(t)} src={SFX.boom2} volume={0.15} durationInFrames={sec(1)} />
      ))}
    </AbsoluteFill>
  );
};
