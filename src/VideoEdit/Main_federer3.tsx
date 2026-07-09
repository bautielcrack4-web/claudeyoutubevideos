import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { PizarraOjo } from "./scenes/PizarraOjo";
import { PizarraGlicacion } from "./scenes/PizarraGlicacion";
import { RelojNoche } from "./scenes/RelojNoche";
import { F_INTER } from "./kit/premium/theme";
import { FED3_BEATS } from "./federer3_beats";
import { FED3_BROLL } from "./federer3_broll";
import { TALKS3 } from "./federer3_hooks";
import { renderFederer2Comp, COMP2_KINDS, BOARD_KINDS } from "./FedererComponents2";

// ── CANAL "Dr. Federer" · Video 3 · OJOS ─────────────────────────────────────
// 4 capas (como el café): (1) B-ROLL DENSO continuo real (Pexels ~2.5s) · (2) FOTOS
// casuales fe3_*.jpg TOPEADAS (~3.6s y vuelve el b-roll) · (3) AVATAR (full/PiP/
// oculto/lado) · (4) COMPONENTES + diagramas + explainers animados, con duración
// TOPEADA (muestran ~8-11s y después sigue el b-roll, no 70s congelados).
const TEAL = "#12B3AE";
const BG = "#0E1D23";

const ANIM = new Set(["pizarraojo", "pizaraglic", "relojnoche"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || ANIM.has(k);

// tope de duración por tipo (evita los holds larguísimos)
const HERO_CAP = 3.6;
const capOf = (k: string): number =>
  ANIM.has(k) ? 12 : k === "diagram" ? 10 : k === "board" ? 13 : k === "quote" ? 8 : k === "rule" ? 5 : k === "process" || k === "checklist" ? 9 : 6;

const compBeats = FED3_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = FED3_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid)\//.test(b.src || ""));
const VIDEO_END = Math.max(...FED3_BEATS.map((b: any) => b.start + b.dur), FED3_BROLL.length ? FED3_BROLL[FED3_BROLL.length - 1].start + FED3_BROLL[FED3_BROLL.length - 1].dur : 0) + 1.2;
export const TOTAL_FRAMES_FED3 = Math.round(VIDEO_END * 30);

// componentes/diagramas/explainers full-screen → ocultan el avatar (durante su tope)
const HIDE = new Set(["diagram", "pizarraojo", "pizaraglic", "relojnoche", "headline", "rule", "stat", "checklist", "splitlist", "nametag", "chips", "bars", "callout", "cross", "process", "annotated"]);

// dur efectiva de cada componente (topeada, sin pisar el próximo componente)
const compDur = (b: any): number => {
  const next = compBeats.filter((x: any) => x.start > b.start).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// momentos de AVATAR FULL extra (transiciones/emoción) — además de los talk
const FULL_AT: number[] = [];
FED3_BEATS.filter((b: any) => b.key === "rehook" || b.key === "cierre").forEach((b: any) => FULL_AT.push(b.start));

function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [];
  for (const b of FED3_BROLL) pts.push({ start: b.start, mode: "cornerTR", pr: 0 });
  for (const b of rawTop) pts.push({ start: b.start, mode: "cornerTR", pr: 0 });
  for (const b of compBeats) {
    const d = compDur(b);
    if (BOARD_KINDS.has(b.kind)) { pts.push({ start: b.start, mode: b.side === "right" ? "left" : "right", pr: 3 }); pts.push({ start: b.start + d, mode: "cornerTR", pr: 1 }); }
    else if (HIDE.has(b.kind)) { pts.push({ start: b.start, mode: "hidden", pr: 3 }); pts.push({ start: b.start + d, mode: "cornerTR", pr: 1 }); }
  }
  for (const s of FULL_AT) pts.push({ start: s, mode: "full", pr: 4 });
  pts.sort((a, b) => a.start - b.start || b.pr - a.pr);

  const w: AvatarWindow[] = [{ start: 0, mode: "full" }];
  let last = "full";
  const talkAt = (s: number) => TALKS3.some((t) => s >= t.start - 0.05 && s < t.start + t.dur);
  for (const p of pts) {
    const mode: AvatarWindow["mode"] = p.pr < 3 && talkAt(p.start) ? "full" : p.mode;
    if (mode !== last) { w.push({ start: p.start, mode }); last = mode; }
  }
  for (const t of TALKS3) { w.push({ start: t.start, mode: "full" }); w.push({ start: +(t.start + t.dur).toFixed(2), mode: "cornerTR" }); }
  w.sort((a, b) => a.start - b.start);
  const coll: AvatarWindow[] = [];
  for (const x of w) { if (!coll.length || coll[coll.length - 1].mode !== x.mode) coll.push(x); }

  // ★ MÁS AVATAR FULL: cada tramo largo de b-roll (cornerTR) arranca con ~5s a
  // pantalla completa (presentador fuerte) y después vuelve a esquina + b-roll.
  const inj: AvatarWindow[] = [];
  for (let i = 0; i < coll.length; i++) {
    const cur = coll[i];
    const nextStart = i + 1 < coll.length ? coll[i + 1].start : VIDEO_END;
    const len = nextStart - cur.start;
    if (cur.mode === "cornerTR" && len > 7) {
      inj.push({ start: cur.start, mode: "full" });
      inj.push({ start: +(cur.start + Math.min(5, len * 0.5)).toFixed(2), mode: "cornerTR" });
    } else inj.push(cur);
  }
  const out: AvatarWindow[] = [];
  for (const x of inj) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }
  return out;
}
const AVATAR_WINDOWS = buildWindows();

const ctaBeat = [...compBeats].reverse().find((b: any) => b.kind === "nametag");
const CTA_AT = ctaBeat ? ctaBeat.start : VIDEO_END - 12;

const renderComp = (b: any, d: number) =>
  b.kind === "pizarraojo" ? <PizarraOjo durationInFrames={d} />
  : b.kind === "pizaraglic" ? <PizarraGlicacion durationInFrames={d} />
  : b.kind === "relojnoche" ? <RelojNoche durationInFrames={d} />
  : renderFederer2Comp(b, d);

export const MainFederer3: React.FC = () => {
  const hookDur = 5.4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo (Pexels real, anclado por frase) */}
      {FED3_BROLL.map((b) => (
        <Sequence key={b.name} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur))}>
          <RawShot durationInFrames={Math.max(1, sec(b.dur))} src={b.src} hue="cold" />
        </Sequence>
      ))}

      {/* CAPA 2 — FOTOS casuales fe3_*.jpg TOPEADAS (~3.6s, luego vuelve el b-roll) */}
      {rawTop.map((b: any) => {
        const d = Math.max(1, sec(Math.min(b.dur, HERO_CAP)));
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d}>
            <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR */}
      <AvatarLayer src="federer3_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} />

      {/* CAPA 4 — COMPONENTES / diagramas / explainers, TOPEADOS */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — scrim sobre el avatar vivo oscurecido */}
      <Sequence from={sec(1.3)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)} setup="Si ves más borroso de noche, escuchá bien:" impact="NO SON TUS OJOS" accentColor={TEAL} font={F_INTER} fontSize={140} />
      </Sequence>

      {/* ENDCARD de cierre */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} />
      </Sequence>
    </AbsoluteFill>
  );
};
