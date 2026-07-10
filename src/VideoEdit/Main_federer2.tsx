import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { F_INTER } from "./kit/premium/theme";
import { FED2_BEATS } from "./federer2_beats";
import { FED2_BROLL } from "./federer2_broll";
import { TALKS2 } from "./federer2_hooks";
import { renderFederer2Comp, COMP2_KINDS, BOARD_KINDS } from "./FedererComponents2";

// ── CANAL "Dr. Federer" · Video 2 · CAFÉ ─────────────────────────────────────
// 3 capas: (1) B-ROLL DENSO real continuo (Pexels, anclado por frase) ·
// (2) FOTOS IA específicas + clips sobre momentos clave · (3) AVATAR (full/PiP/
// oculto) · (4) COMPONENTES premium MEDICO por encima. Hook: scrim "CAFÉ".
const TEAL = "#12B3AE";
const BG = "#0E1D23";

const compBeats = FED2_BEATS.filter((b: any) => COMP2_KINDS.has(b.kind));
// fotos IA + clips LTX propios (NO los broll/ genéricos: la capa densa ya cubre eso)
const rawTop = FED2_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid)\//.test(b.src || ""));
const lastBroll = FED2_BROLL[FED2_BROLL.length - 1];
const VIDEO_END = Math.max(lastBroll.start + lastBroll.dur, ...compBeats.map((b: any) => b.start + b.dur)) + 1.2;
export const TOTAL_FRAMES_FED2 = Math.round(VIDEO_END * 30);

// componentes que OCULTAN el avatar (gráfico manda) vs PiP en la esquina
const HIDE = new Set(["diagram", "headline", "rule", "stat", "checklist", "splitlist", "annotated", "ingredients", "nametag", "blurexplainer", "pizarra", "bars", "callout", "chips"]);

function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [];
  for (const b of FED2_BROLL) pts.push({ start: b.start, mode: "cornerTR", pr: 0 });
  for (const b of rawTop) pts.push({ start: b.start, mode: "cornerTR", pr: 0 });
  for (const b of compBeats) {
    if (BOARD_KINDS.has(b.kind)) pts.push({ start: b.start, mode: b.side === "right" ? "left" : "right", pr: 2 }); // avatar al lado de la pizarra
    else if (HIDE.has(b.kind)) pts.push({ start: b.start, mode: "hidden", pr: 1 });
  }
  pts.sort((a, b) => a.start - b.start || b.pr - a.pr);

  const w: AvatarWindow[] = [{ start: 0, mode: "full" }];
  let last = "full";
  const talkAt = (s: number) => TALKS2.some((t) => s >= t.start - 0.05 && s < t.start + t.dur);
  for (const p of pts) {
    const mode: AvatarWindow["mode"] = talkAt(p.start) ? "full" : p.mode;
    if (mode !== last) { w.push({ start: p.start, mode }); last = mode; }
  }
  for (const t of TALKS2) { w.push({ start: t.start, mode: "full" }); w.push({ start: +(t.start + t.dur).toFixed(2), mode: "cornerTR" }); }
  w.sort((a, b) => a.start - b.start);
  const out: AvatarWindow[] = [];
  for (const x of w) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }
  return out;
}
const AVATAR_WINDOWS = buildWindows();

// CTA (Endcard) desde el último nametag/cta hasta el final
const ctaBeat = [...compBeats].reverse().find((b: any) => b.kind === "nametag");
const CTA_AT = ctaBeat ? ctaBeat.start : VIDEO_END - 12;

export const MainFederer2: React.FC = () => {
  const hookDur = 5.2; // cartel de apertura breve (NO hasta la palabra "federer")
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo (Pexels real, anclado por frase) */}
      {FED2_BROLL.map((b) => (
        <Sequence key={b.name} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur))}>
          <RawShot durationInFrames={Math.max(1, sec(b.dur))} src={b.src} hue="cold" />
        </Sequence>
      ))}

      {/* CAPA 2 — FOTOS IA / CLIPS propios sobre momentos clave (más específico que el stock) */}
      {rawTop.map((b: any) => (
        <Sequence key={b.id} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur))}>
          <RawShot durationInFrames={Math.max(1, sec(b.dur))} src={b.src} hue="cold" kicker={b.kicker} />
        </Sequence>
      ))}

      {/* CAPA 3 — AVATAR: PiP quieto sobre b-roll, full al hablar, oculto en gráficos */}
      <AvatarLayer src="federer2_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} />

      {/* CAPA 4 — COMPONENTES premium MEDICO por encima */}
      {compBeats.map((b: any) => (
        <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur))} layout="none">
          {renderFederer2Comp(b, Math.max(1, sec(b.dur)), { medico: true })}
        </Sequence>
      ))}

      {/* HOOK — scrim "CAFÉ" sobre el avatar vivo oscurecido */}
      <Sequence from={sec(1.3)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)} setup="Lo que nadie te contó sobre el" impact="CAFÉ" accentColor={TEAL} font={F_INTER} fontSize={170} />
      </Sequence>

      {/* ENDCARD de cierre (CTA suscripción) */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} />
      </Sequence>
    </AbsoluteFill>
  );
};
