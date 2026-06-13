import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { SfxCue, SFX } from "./components/Sfx";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { CUES } from "./cues_estufarocket.gen";

// ── VIDEO 1 · EL CONSTRUCTOR LIBRE — "Calenté toda mi casa con ramitas" ──
// Avatar "Tomás" (estufarocket_opt.mp4 provee el audio de toda la narración) +
// flujo denso de imágenes/clips reales + diagramas + texto cinético. Paleta terrosa.
// 3 injertos de venta del Manual. ~19.5 min. CUES generados desde el beatsheet.

const VIDEO_END = Math.max(...CUES.map((c) => c.start + c.dur)) + 1.5;
export const TOTAL_FRAMES_ER = Math.round(VIDEO_END * 30);

// grade por mood de sección (wash suave)
const GRADE: GradeRange[] = [
  { from: 0, to: 95, tint: "#FF9A3D", strength: 0.07 },       // hook: dorado/fuego
  { from: 95, to: 250, tint: "#C8904A", strength: 0.045 },    // problema/física: ámbar
  { from: 250, to: 470, tint: "#B0833F", strength: 0.05 },    // rocket/construcción: tierra
  { from: 470, to: 600, tint: "#5E7A6E", strength: 0.09 },    // trombe/sol-frío: eucalipto
  { from: 600, to: 1010, tint: "#B0833F", strength: 0.05 },   // empezar/plan: tierra
  { from: 1010, to: VIDEO_END, tint: "#A9794A", strength: 0.07 }, // cierre: sepia nostálgico
];

// ── Ventanas del avatar derivadas de los CUES (variedad de posiciones) ──
// hidden = el gráfico/diagrama/impact manda; cornerTR/right/left = PiP sobre b-roll.
const HIDE = new Set(["impact", "diagram", "journey", "infzoom", "rule", "headline", "aged", "bars", "cross", "process", "checklist", "splitlist", "costtally", "callout", "annotated"]);
const VIS = new Set(["raw", "quote", "chips", "stat"]);
// secciones donde el avatar va a PANTALLA COMPLETA cuando habla (personales)
const FULL_SECS = new Set(["ident", "cierre", "proximo", "coment"]);
const sectionOf = (key: string) => key.replace(/_\d+$/, "");

function buildWindows(): AvatarWindow[] {
  const w: AvatarWindow[] = [{ start: 0, mode: "full" }]; // ★ abre a pantalla completa ≥1s
  let last = "full";
  let visIdx = 0;
  const rotation: AvatarWindow["mode"][] = ["cornerTR", "cornerTR", "right", "cornerTR", "left"];
  for (const c of CUES) {
    let mode: AvatarWindow["mode"];
    if (c.kind === "half") mode = "halfL";        // imagen mitad derecha → avatar mitad izquierda, al ras
    else if (c.kind === "float") mode = "full";   // FloatingInsert flota SOBRE el avatar full (no oculto)
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

// stingers/swells en las fronteras de sección (cues kind "rule" + primeros de sistema)
const SECTION_KEYS = new Set(CUES.filter((c) => c.kind === "rule" || /_(0)$/.test(c.key) && (c.key.startsWith("trombe") || c.key.startsWith("rocket_mat"))).map((c) => c.key));

export const MainEstufaRocket: React.FC = () => {
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
          {/* AVATAR encima del b-roll — provee el audio de la narración SIEMPRE */}
          <AvatarLayer src="estufarocket_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {/* HOOK: texto SOBRE el avatar vivo oscurecido (no color sólido). Va ENCIMA
              del AvatarLayer; el avatar abre full y sigue hablando atenuado detrás. */}
          {(() => {
            const hookEnd = CUES[0].start - 0.3; // hasta justo antes del 1er b-roll
            const from = 1.4, dur = Math.max(2, hookEnd - from);
            return (
              <Sequence from={sec(from)} durationInFrames={sec(dur)} layout="none">
                <AvatarScrimText durationInFrames={sec(dur)} setup="Afuera, dos grados bajo cero" impact="Adentro, 22°" impactAccent="amber" fontSize={150} />
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
