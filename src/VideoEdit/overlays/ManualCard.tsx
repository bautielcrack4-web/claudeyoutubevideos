import { AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { SANS, acc } from "./ui";

// ── ManualCard — overlay PREMIUM del Manual sobre el avatar. ────────────────────
// LIBRO 3D real (tapa + lomo con título vertical + canto de páginas + señalador
// rojo + sombra), que ENTRA con pop, hace una rotación showcase lenta y un PUSH-IN
// de cámara en dos fases (parece cámara real). Al lado: nombre + descripción.
// Fondo transparente → el avatar queda visible a la derecha.

const COVER_RATIO = 1200 / 680; // alto/ancho de la portada

export const ManualCard: React.FC<{
  durationInFrames: number;
  image: string;            // portada, ej "real/manual_cover.png"
  title?: string;
  desc?: string;
  chip?: string;            // ej "$27 · garantía 7 días" (solo en el cierre)
  accent?: string;
}> = ({ durationInFrames, image, title = "Manual de Reparaciones Caseras", desc, chip, accent = "amber" }) => {
  const a = acc(accent);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = durationInFrames;

  // entrada/salida (corte de entrada suave, salida con fade corto)
  const inP = interpolate(f, [0, fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const outP = interpolate(f, [D - fps * 0.45, D], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vis = Math.min(inP, outP);

  // pop de entrada (spring MUY suave premium — se asienta lento, sin rebote brusco)
  const pop = spring({ frame: f, fps, config: { damping: 26, stiffness: 52, mass: 1.4 } });
  const enterScale = 0.9 + 0.1 * pop;
  const enterY = (1 - pop) * 26;

  // PUSH-IN de cámara: dos fases lentas con easing (parece cámara real, no zoom de edición)
  const prog = interpolate(f, [0, D], [0, 1], { extrapolateRight: "clamp" });
  const zA = interpolate(prog, [0, 0.55], [1.0, 1.045], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const zB = interpolate(prog, [0.5, 1], [0, 0.06], { extrapolateLeft: "clamp", easing: Easing.inOut(Easing.quad) });
  const camZoom = zA + zB;

  // ROTACIÓN showcase: el lomo SIEMPRE algo visible a la izquierda (rotateY neg),
  // entra abierta y se asienta, con un vaivén lento (sin que maree).
  const settleY = interpolate(pop, [0, 1], [-46, -27]);
  const swingY = Math.sin(f / 64) * 6;
  const rotY = settleY + swingY;
  const rotX = interpolate(prog, [0, 1], [5, 2.5]) + Math.cos(f / 84) * 1.1;
  const floatY = Math.sin(f / 70) * 4;

  // brillo que barre la tapa al entrar (más lento)
  const sheen = interpolate(f, [fps * 0.5, fps * 1.6], [-160, 320], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sheenOp = interpolate(f, [fps * 0.5, fps * 1.0, fps * 1.6], [0, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // texto en stagger AMPLIO y suave — cada elemento con su propia rampa lenta,
  // bien separados en el tiempo (no aparece todo casi a la vez).
  const rev = (start: number, len = 0.85) => interpolate(f, [fps * start, fps * (start + len)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const tEy = rev(0.8);
  const tTi = rev(1.4);
  const tRu = rev(2.1, 0.7);
  const tCh = rev(4.4, 0.8);

  // DESCRIPCIÓN tipeada (máquina de escribir) — empieza al aparecer la línea.
  const descStart = 2.6, descTypeDur = 1.7;
  const descLen = desc ? desc.length : 0;
  const descChars = Math.max(0, Math.min(descLen, Math.round(interpolate(f, [fps * descStart, fps * (descStart + descTypeDur)], [0, descLen], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))));
  const descTyped = desc ? desc.slice(0, descChars) : "";
  const descAppear = interpolate(f, [fps * descStart, fps * (descStart + 0.15)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const isTyping = descChars < descLen && f >= fps * descStart;
  const caretOn = Math.floor(f / 7) % 2 === 0; // parpadeo del cursor

  // dimensiones del libro
  const W = 300, H = Math.round(W * COVER_RATIO), DEPTH = 48;
  const face: React.CSSProperties = { position: "absolute", left: "50%", top: "50%" };
  const creamEdge = "repeating-linear-gradient(0deg, #efe6cf 0px, #efe6cf 2px, #d9ccaa 2px, #d9ccaa 4px)";

  return (
    <AbsoluteFill style={{ opacity: vis, pointerEvents: "none" }}>
      {/* scrim SOLO a la izquierda → avatar visible a la derecha */}
      <AbsoluteFill style={{ background: `linear-gradient(100deg, rgba(14,10,6,${0.74 * vis}) 0%, rgba(14,10,6,${0.5 * vis}) 40%, rgba(14,10,6,0) 66%)` }} />

      <div style={{ position: "absolute", top: "50%", left: 165, transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 70 }}>
        {/* ── LIBRO 3D ── */}
        <div style={{ perspective: 1600, width: W, height: H }}>
          {/* sombra de contacto (fuera del 3D) */}
          <div style={{ position: "absolute", left: "50%", bottom: -36, width: W * 1.05, height: 46, transform: `translateX(-50%) scale(${enterScale * camZoom})`, background: "radial-gradient(closest-side, rgba(0,0,0,0.55), transparent 75%)", filter: "blur(7px)" }} />
          <div style={{ position: "relative", width: W, height: H, transformStyle: "preserve-3d", transform: `translateY(${enterY + floatY}px) scale(${enterScale * camZoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`, filter: "drop-shadow(0 30px 46px rgba(0,0,0,0.55))" }}>
            {/* CANTO DE PÁGINAS (derecha) */}
            <div style={{ ...face, width: DEPTH, height: H - 14, transform: `translate(-50%,-50%) rotateY(90deg) translateZ(${W / 2}px)`, background: creamEdge, boxShadow: "inset 0 0 12px rgba(120,90,50,0.35)" }} />
            {/* canto SUPERIOR e INFERIOR */}
            <div style={{ ...face, width: W - 12, height: DEPTH, transform: `translate(-50%,-50%) rotateX(90deg) translateZ(${H / 2}px)`, background: creamEdge }} />
            <div style={{ ...face, width: W - 12, height: DEPTH, transform: `translate(-50%,-50%) rotateX(-90deg) translateZ(${H / 2}px)`, background: creamEdge }} />
            {/* LOMO (izquierda) — claro, con bandas y título vertical */}
            <div style={{ ...face, width: DEPTH, height: H, transform: `translate(-50%,-50%) rotateY(-90deg) translateZ(${W / 2}px)`, background: "linear-gradient(90deg,#e8dcc0,#f3ead4 45%,#d8c8a4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "10px 0", boxShadow: "inset -6px 0 12px rgba(0,0,0,0.18)", borderRadius: "3px 0 0 3px" }}>
              <div style={{ width: "100%", height: 22, background: "#5b3d23" }} />
              <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: SANS, fontWeight: 800, fontSize: 15, letterSpacing: 2, color: "#4a3420", textTransform: "uppercase", whiteSpace: "nowrap" }}>Manual · Reparaciones Caseras</div>
              <div style={{ width: "100%", height: 22, background: "#5b3d23" }} />
            </div>
            {/* CONTRATAPA (atrás) */}
            <div style={{ ...face, width: W, height: H, transform: `translate(-50%,-50%) rotateY(180deg) translateZ(${DEPTH / 2}px)`, background: "linear-gradient(135deg,#3a2c1c,#6a523a)", borderRadius: 8 }} />
            {/* TAPA (frente) con la portada */}
            <div style={{ ...face, width: W, height: H, transform: `translate(-50%,-50%) translateZ(${DEPTH / 2}px)`, borderRadius: 8, overflow: "hidden", boxShadow: "0 0 0 1px rgba(60,40,20,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
              <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, left: sheen, width: 95, transform: "skewX(-16deg)", background: `linear-gradient(90deg, transparent, rgba(255,255,255,${sheenOp}), transparent)` }} />
              {/* luz superior + viñeta para volumen de tapa */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.16), transparent 38%), radial-gradient(130% 100% at 50% 105%, rgba(0,0,0,0.22), transparent 60%)" }} />
              {/* lomada (sombra del doblez junto al lomo) */}
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 16, background: "linear-gradient(90deg, rgba(0,0,0,0.28), transparent)" }} />
            </div>
          </div>
        </div>

        {/* ── TEXTO al lado ── */}
        <div style={{ maxWidth: 620 }}>
          <div style={{ fontFamily: SANS, color: a, fontSize: 23, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", opacity: tEy, transform: `translateY(${(1 - tEy) * 14}px)` }}>El Manual</div>
          <div style={{ fontFamily: SANS, color: "#fff", fontSize: 58, fontWeight: 800, lineHeight: 1.06, marginTop: 8, textShadow: "0 4px 22px rgba(0,0,0,0.7)", opacity: tTi, transform: `translateY(${(1 - tTi) * 22}px)` }}>{title}</div>
          <div style={{ height: 5, width: 300 * tRu, background: a, borderRadius: 3, margin: "20px 0 22px", boxShadow: `0 0 16px ${a}` }} />
          {desc && <div style={{ fontFamily: SANS, color: "rgba(255,255,255,0.92)", fontSize: 31, lineHeight: 1.34, maxWidth: 560, minHeight: 84, textShadow: "0 2px 14px rgba(0,0,0,0.7)", opacity: descAppear }}>
            {descTyped}
            <span style={{ opacity: (isTyping || caretOn) ? 0.9 : 0, color: a, fontWeight: 700 }}>|</span>
          </div>}
          {chip && <div style={{ display: "inline-block", marginTop: 22, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#1a140c", background: a, padding: "10px 22px", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.4)", opacity: tCh, transform: `translateY(${(1 - tCh) * 14}px) scale(${0.9 + 0.1 * tCh})` }}>{chip}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};
