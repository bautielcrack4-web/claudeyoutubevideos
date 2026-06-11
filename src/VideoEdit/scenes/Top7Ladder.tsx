import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { Media } from "../components/Media";

// Top7Ladder — RANKING tipo leaderboard: los 7 puestos SIEMPRE en pantalla. Cada beat
// `top7` = el ranking con el puesto `rank` recién REVELADO; los > rank están BLOQUEADOS
// (candado, sin el animal), los < rank ya revelados (atenuados). "La animación lleva
// hasta la N" = un lean-in SUAVE (zoom sutil con origen en la fila actual) + el crossfade
// del placeholder a la foto del animal. Sin scroll (no se va nada de pantalla), easing
// inOut, reveal por fade/scale (sin pops). Limpio y legible.
type Item = { name: string; benefit: string; image: string; accent?: string };
const TONE: Record<string, string> = {
  accent: COLORS.accent, amber: COLORS.amber, good: COLORS.good, cold: COLORS.cold, danger: COLORS.danger,
};

const COL_W = 1240;
const ROW_H = 116;
const GAP = 14;
const PITCH = ROW_H + GAP;
const COL_Y = 162; // arranque de la columna (debajo del encabezado)

export const Top7Ladder: React.FC<{
  durationInFrames: number;
  rank: number; // puesto actual (1..7)
  total?: number;
  items: Item[]; // 7, índice 0 = puesto 1
  hue?: "blue" | "cold" | "amber" | "red";
  label?: string;
}> = ({ durationInFrames, rank, total = 7, items, hue = "amber", label = "EL TOP 7" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // lean-in suave hacia la fila actual (zoom sutil, sin sacar filas de pantalla)
  const rowCenterY = COL_Y + (rank - 1) * PITCH + ROW_H / 2;
  const zoom = interpolate(frame, [0, 30], [1.0, 1.035], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const outOp = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });

  // revelado del puesto actual (después del lean-in)
  const reveal = spring({ frame: frame - 22, fps, config: { damping: 18, mass: 0.8, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, opacity: outOp }}>
      <TechBackground glowX={50} glowY={42} hue={hue} drift={0.3} />

      {/* encabezado fijo */}
      <div style={{ position: "absolute", top: 50, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 10, textTransform: "uppercase", color: COLORS.textSoft }}>{label}</div>
        <div style={{ fontSize: 38, fontWeight: 800, fontStyle: "italic", color: COLORS.text, marginTop: 0 }}>
          {rank} <span style={{ color: COLORS.textDim, fontStyle: "normal", fontSize: 28 }}>/ {total}</span>
        </div>
      </div>

      {/* columna de 7 filas (lean-in con origen en la fila actual) */}
      <div style={{ position: "absolute", left: (1920 - COL_W) / 2, top: COL_Y, width: COL_W, transform: `scale(${zoom})`, transformOrigin: `624px ${rowCenterY}px` }}>
        {items.slice(0, total).map((it, i) => {
          const r = i + 1;
          const acc = TONE[it.accent || "accent"] || COLORS.accent;
          const isCur = r === rank;
          const isDone = r < rank;
          const locked = r > rank;
          const scale = isCur ? interpolate(reveal, [0, 1], [0.97, 1.035]) : 1;
          const op = isCur ? 1 : isDone ? 0.6 : 0.42;
          const heroOp = isCur ? interpolate(reveal, [0, 1], [0, 1]) : isDone ? 1 : 0;

          return (
            <div
              key={r}
              style={{
                position: "absolute", top: i * PITCH, left: 0, width: COL_W, height: ROW_H,
                display: "flex", alignItems: "center", gap: 26, padding: "0 24px",
                transform: `scale(${scale})`, transformOrigin: "center",
                borderRadius: 20,
                background: isCur ? "rgba(239,231,211,0.97)" : "rgba(239,231,211,0.80)",
                border: isCur ? `2px solid ${acc}` : `1px solid ${COLORS.bg2}`,
                boxShadow: isCur
                  ? `0 22px 54px rgba(42,38,32,0.30), 0 0 ${26 + 26 * reveal}px ${acc}${Math.round(38 * reveal).toString(16).padStart(2, "0")}`
                  : "0 8px 22px rgba(42,38,32,0.12)",
                opacity: op,
                zIndex: isCur ? 3 : 1,
              }}
            >
              {/* número de puesto */}
              <div style={{ width: 88, textAlign: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 78, fontWeight: 800, lineHeight: 1, color: isCur ? acc : COLORS.text }}>{r}</span>
              </div>

              {/* miniatura del animal (revela en el actual; bloqueada si r>rank) */}
              <div style={{ position: "relative", width: 188, height: ROW_H - 22, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: COLORS.bg2 }}>
                {!locked && (
                  <Media src={it.image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: heroOp, transform: `scale(${isCur ? interpolate(reveal, [0, 1], [1.12, 1.0]) : 1.0})` }} />
                )}
                {/* placeholder bloqueado: papel + candado (en el actual se desvanece) */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: locked ? 1 : isCur ? 1 - reveal : 0, background: "rgba(42,38,32,0.10)" }}>
                  <LockGlyph color={COLORS.textDim} />
                </div>
                <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 4, background: locked ? COLORS.bg2 : acc, opacity: 0.9 }} />
              </div>

              {/* nombre + beneficio (oculto si bloqueado) */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {locked ? (
                  <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 8, color: COLORS.textDim }}>• • •</div>
                ) : (
                  <>
                    <div style={{ fontSize: 42, fontWeight: 800, fontStyle: "italic", color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: isCur ? reveal : 1 }}>{it.name}</div>
                    <div style={{ fontSize: 24, fontWeight: 600, color: COLORS.textSoft, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 3, opacity: isCur ? reveal : 0.9 }}>{it.benefit}</div>
                  </>
                )}
              </div>

              {/* indicador de estado a la derecha */}
              <div style={{ width: 40, flexShrink: 0, textAlign: "center" }}>
                {isDone && <CheckGlyph color={COLORS.accentSoft} />}
                {isCur && <div style={{ width: 16, height: 16, borderRadius: "50%", background: acc, margin: "0 auto", boxShadow: `0 0 14px ${acc}`, transform: `scale(${1 + Math.sin(frame / 7) * 0.12})` }} />}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const LockGlyph: React.FC<{ color: string }> = ({ color }) => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="10" width="14" height="10" rx="2" stroke={color} strokeWidth="1.8" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={color} strokeWidth="1.8" />
  </svg>
);
const CheckGlyph: React.FC<{ color: string }> = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
