import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { PizarraOjo } from "./scenes/PizarraOjo";
import { CirculoVicioso } from "./scenes/CirculoVicioso";
import { PizarraGlicacion } from "./scenes/PizarraGlicacion";
import { RelojNoche } from "./scenes/RelojNoche";
import { AvatarPizarra } from "./scenes/AvatarPizarra";
import { AvatarKeyword } from "./scenes/AvatarKeyword";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { ChecklistErrores } from "./scenes/ChecklistErrores";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";
import { FreezeZoom } from "./scenes/FreezeZoom";
import { F_INTER } from "./kit/premium/theme";
import { VET1_BEATS } from "./vet1_beats";
import { VET1_BROLL } from "./vet1_broll";
import { TALKSV1 } from "./vet1_hooks";
import { renderFederer2Comp, COMP2_KINDS, BOARD_KINDS } from "./FedererComponents2";

// ── CANAL "Dr. Federer Veterinario" · Video 1 · HONGO EN LAS PATAS ────────────
// 4 capas (como el café): (1) B-ROLL DENSO continuo real (Pexels ~2.5s) · (2) FOTOS
// casuales vt1_*.jpg TOPEADAS (~3.6s y vuelve el b-roll) · (3) AVATAR (full/PiP/
// oculto/lado) · (4) COMPONENTES + diagramas + explainers animados, con duración
// TOPEADA (muestran ~8-11s y después sigue el b-roll, no 70s congelados).
const TEAL = "#12B3AE";
const BG = "#0E1D23";

const ANIM = new Set(["pizarraojo", "pizaraglic", "relojnoche", "ciclovicioso"]);
// NUEVOS full-screen (ocultan el avatar) · OVERLAY (avatar sigue) · NOCAP (usan toda su dur)
const NEWFULL = new Set(["avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra", "avatarkeyword"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || ANIM.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

// tope de duración por tipo (evita los holds larguísimos)
const HERO_CAP = 3.6;
const capOf = (k: string): number =>
  ANIM.has(k) ? 12 : k === "diagram" ? 10 : k === "board" ? 13 : k === "quote" ? 8 : k === "rule" ? 5
  : k === "errorstinger" ? 2 : k === "guardaesto" ? 8 : k === "mitoverdad" ? 6 : k === "freezezoom" ? 4.5
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5 : k === "process" || k === "checklist" ? 9 : 6;

const compBeats = VET1_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = VET1_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid)\//.test(b.src || ""));
const VIDEO_END = Math.max(...VET1_BEATS.map((b: any) => b.start + b.dur), VET1_BROLL.length ? VET1_BROLL[VET1_BROLL.length - 1].start + VET1_BROLL[VET1_BROLL.length - 1].dur : 0) + 1.2;
export const TOTAL_FRAMES_VET1 = Math.round(VIDEO_END * 30);

// componentes/diagramas/explainers full-screen → ocultan el avatar (durante su tope)
const HIDE = new Set(["diagram", "pizarraojo", "pizaraglic", "relojnoche", "ciclovicioso", "headline", "rule", "stat", "checklist", "splitlist", "nametag", "chips", "bars", "callout", "cross", "process", "annotated",
  "avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom"]);

// dur efectiva de cada componente (topeada, sin pisar el próximo componente)
const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur); // avatarpizarra/keyword: usan toda su dur (timing interno)
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// momentos de AVATAR FULL extra (transiciones/emoción) — además de los talk
const FULL_AT: number[] = [];
VET1_BEATS.filter((b: any) => b.key === "rehook" || b.key === "cierre").forEach((b: any) => FULL_AT.push(b.start));

function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [];
  for (const b of VET1_BROLL) pts.push({ start: b.start, mode: "cornerTR", pr: 0 });
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
  const talkAt = (s: number) => TALKSV1.some((t) => s >= t.start - 0.05 && s < t.start + t.dur);
  for (const p of pts) {
    const mode: AvatarWindow["mode"] = p.pr < 3 && talkAt(p.start) ? "full" : p.mode;
    if (mode !== last) { w.push({ start: p.start, mode }); last = mode; }
  }
  for (const t of TALKSV1) { w.push({ start: t.start, mode: "full" }); w.push({ start: +(t.start + t.dur).toFixed(2), mode: "cornerTR" }); }
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

  // ★ HOOK: avatar full apenas ~1.4s (regla del canal) y después OCULTO durante el
  // hook (1.4-7s) → detrás del texto rojo se ve el footage del perro lamiéndose la pata.
  const HOOK_END = 7.0;
  const post = out.filter((wnd) => wnd.start < 1.4 || wnd.start >= HOOK_END);
  post.push({ start: 0, mode: "full" }, { start: 1.4, mode: "hidden" });
  // en HOOK_END, retomar el modo que corresponda (el último definido antes de HOOK_END que siga vigente)
  const resume = out.filter((wnd) => wnd.start < HOOK_END).pop();
  post.push({ start: HOOK_END, mode: resume && resume.start >= 1.4 ? "cornerTR" : (resume?.mode ?? "cornerTR") });
  post.sort((a, b) => a.start - b.start);
  const out2: AvatarWindow[] = [];
  for (const x of post) { if (!out2.length || out2[out2.length - 1].mode !== x.mode) out2.push(x); }
  return out2;
}
const AVATAR_WINDOWS = buildWindows();

const ctaBeat = [...compBeats].reverse().find((b: any) => b.kind === "nametag");
const CTA_AT = ctaBeat ? ctaBeat.start : VIDEO_END - 12;

// ── CHECKLIST del "test de 3 señales" (overlay ~7.5s, anti-spoiler) ───────────
// El video estructura el diagnóstico como un test de 3 señales (hongo / alergia de
// fondo / urgente). Cada señal se revela en SU sección; las que aún no llegaron van
// blureadas (el componente lo hace solo con `active`). Keys REALES de vet1_beats:
//   "senales" → se presenta el test + Señal 1 (el olor)  · start 558.54
//   "senal2"  → Señal 2 (el ritmo / alergia de fondo)     · start 584.52
//   "senal3"  → Señal 3 (una sola pata / urgente)          · start 620.68
const ERR_LABELS = ["Señal 1: el olor a hongo", "Señal 2: el ritmo (alergia de fondo)", "Señal 3: una sola pata (urgente)"];
const ERR_STARTS = ["senales", "senal2", "senal3"]
  .map((k) => { const b = VET1_BEATS.find((x: any) => x.key === k); return b ? b.start : null; });

const renderComp = (b: any, d: number) =>
  b.kind === "pizarraojo" ? <PizarraOjo durationInFrames={d} />
  : b.kind === "ciclovicioso" ? <CirculoVicioso durationInFrames={d} />
  : b.kind === "pizaraglic" ? <PizarraGlicacion durationInFrames={d} />
  : b.kind === "relojnoche" ? <RelojNoche durationInFrames={d} />
  : b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={b.clip || "vet1_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "avatarkeyword" ? <AvatarKeyword durationInFrames={d} items={b.items} avatar={b.clip || "vet1_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainVet1: React.FC = () => {
  const hookDur = 5.4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo (Pexels real). Cada clip se EXTIENDE +3 frames
          para SOLAPAR el siguiente (corte duro invisible) → 0 gaps, 0 destello por el
          fondo asomando entre clips. premountFor = decodifica antes de mostrar. */}
      {VET1_BROLL.map((b) => (
        <Sequence key={b.name} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur) + 3)} premountFor={30}>
          <RawShot durationInFrames={Math.max(1, sec(b.dur) + 3)} src={b.src} hue="cold" />
        </Sequence>
      ))}

      {/* CAPA 2 — FOTOS casuales vt1_*.jpg TOPEADAS (~3.6s, luego vuelve el b-roll) */}
      {rawTop.map((b: any) => {
        const d = Math.max(1, sec(Math.min(b.dur, HERO_CAP)));
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR */}
      <AvatarLayer src="vet1_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} />

      {/* CAPA 4 — COMPONENTES / diagramas / explainers, TOPEADOS */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* CHECKLIST de errores — overlay ~7.5s al inicio de cada error */}
      {ERR_STARTS.map((s, i) => s == null ? null : (
        <Sequence key={`chk_${i}`} from={sec(s + 1.2)} durationInFrames={sec(7.5)} layout="none">
          <ChecklistErrores durationInFrames={sec(7.5)} items={ERR_LABELS} active={i} title="El test de 3 señales" side="right" />
        </Sequence>
      ))}

      {/* HOOK — texto ROJO FUERTE sobre el footage del perro lamiéndose la pata
          (avatar oculto en esta ventana). Corto e impactante. */}
      <Sequence from={sec(1.4)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)} setup="Si tu perro se lame las patas sin parar…" impact="NO ES ALERGIA" accentColor="#E4141B" font={F_INTER} fontSize={160} />
      </Sequence>

      {/* ENDCARD de cierre */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} />
      </Sequence>
    </AbsoluteFill>
  );
};
