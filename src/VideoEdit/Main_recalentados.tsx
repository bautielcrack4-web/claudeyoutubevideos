import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { EmphasisMoment } from "./scenes/EmphasisMoment";
import { Endcard } from "./scenes/Endcard";
import { RawShot } from "./scenes/RawShot";
import { F_INTER } from "./kit/premium/theme";
import { renderRecalComp } from "./FedererComponents";
import { RECAL_BROLL } from "./recalentados_broll";
import { RECAL_COMPS } from "./recalentados_beats";
import { RECAL_SCRIMS, RECAL_EMPH, RECAL_ENDCARD, RECAL_END } from "./recalentados_hooks";

// ── FEDERER SALUD · "Recalentados" ──────────────────────────────────────────
// Plan visual segundo-a-segundo (6 agentes Haiku + densificado). 3 capas:
// b-roll denso real → avatar (PiP/oculto) → componentes premium MEDICO.
// Overlays: scrims (oscurece+palabra), emphasis (avatar full+frase), endcard.
const TEAL = "#12B3AE";
const CORAL = "#E0523E";
const BG = "#0E1D23";

export const TOTAL_FRAMES_RECAL = Math.round(RECAL_END * 30);

function buildWindows(): AvatarWindow[] {
  const CORNER: AvatarWindow["mode"] = "cornerTR";
  const pts: { start: number; mode: AvatarWindow["mode"]; pr: number }[] = [{ start: 0, mode: "full", pr: 3 }];
  for (const b of RECAL_BROLL) pts.push({ start: b.start, mode: CORNER, pr: 0 });
  for (const c of RECAL_COMPS) pts.push({ start: c.start, mode: "hidden", pr: 1 });
  pts.push({ start: 2.0, mode: CORNER, pr: 2 }); // tras abrir full ~2s
  pts.sort((a, b) => a.start - b.start || b.pr - a.pr);
  const w: AvatarWindow[] = [];
  let last = "";
  for (const p of pts) { if (p.mode !== last) { w.push({ start: p.start, mode: p.mode }); last = p.mode; } }
  return w;
}
const AVATAR_WINDOWS = buildWindows();

export const MainRecalentados: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — b-roll denso */}
      {RECAL_BROLL.map((b) => (
        <Sequence key={b.name} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur))}>
          <RawShot durationInFrames={Math.max(1, sec(b.dur))} src={b.src} hue="cold" />
        </Sequence>
      ))}

      {/* CAPA 2 — avatar (PiP quieto sobre b-roll, oculto en componentes) */}
      <AvatarLayer src="recalentados_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} />

      {/* CAPA 3 — componentes premium (stat/headline/pizarra/diagram/checklist) */}
      {RECAL_COMPS.map((c: any, i: number) => (
        <Sequence key={`c_${c.id || i}`} from={sec(c.start)} durationInFrames={Math.max(1, sec(c.dur))}>
          {renderRecalComp(c, Math.max(1, sec(c.dur)))}
        </Sequence>
      ))}

      {/* OVERLAY — scrims (oscurece + palabra de shock/revelación) */}
      {RECAL_SCRIMS.map((s, i) => (
        <Sequence key={`s_${i}`} from={sec(s.start)} durationInFrames={sec(Math.max(1.4, s.dur))} layout="none">
          <AvatarScrimText durationInFrames={sec(Math.max(1.4, s.dur))} impact={s.word} accentColor={s.accent === "coral" ? CORAL : TEAL} font={F_INTER} fontSize={150} />
        </Sequence>
      ))}

      {/* OVERLAY — emphasis (avatar full + frase grande) */}
      {RECAL_EMPH.map((e, i) => (
        <Sequence key={`e_${i}`} from={sec(e.from)} durationInFrames={sec(Math.max(1.4, e.to - e.from))} layout="none">
          <EmphasisMoment durationInFrames={sec(Math.max(1.4, e.to - e.from))} avatarFromSec={e.from} text={e.text} avatarSrc="recalentados_opt.mp4" />
        </Sequence>
      ))}

      {/* ENDCARD */}
      <Sequence from={sec(RECAL_ENDCARD)} durationInFrames={sec(Math.max(2, RECAL_END - RECAL_ENDCARD))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, RECAL_END - RECAL_ENDCARD))} />
      </Sequence>
    </AbsoluteFill>
  );
};
