import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, glass } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { Icon, IconName } from "../components/Icon";
import { stagger, drift } from "../lib/anim";

type Tile = { n: number; label?: string; icon?: IconName };

// Rule 9H — open-loop hook. All 9 errors shown in miniature; the ones covered in
// this part are sharp, the rest stay locked/blurred to create a curiosity loop.
export const HookGrid: React.FC<{ durationInFrames: number; tiles: Tile[] }> = ({
  durationInFrames,
  tiles,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // big title leads, then recedes so the grid reads
  const titleIn = spring({ frame: frame - 4, fps, config: { damping: 20 } });
  const titleOut = interpolate(frame, [44, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOp = interpolate(titleIn, [0, 1], [0, 1]) * (1 - titleOut);
  const gridReveal = interpolate(frame, [30, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="blue" glowY={42} zoom={[1.06, 1.14]}>
      {/* grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 300px)",
          gridAutoRows: "210px",
          gap: 28,
          opacity: interpolate(gridReveal, [0, 1], [0.25, 1]),
          transform: `scale(${interpolate(gridReveal, [0, 1], [0.96, 1])})`,
        }}
      >
        {tiles.map((tile, i) => {
          const known = !!tile.label;
          const s = stagger(frame, fps, i, 5, 30);
          const d = drift(frame, i * 1.7, 0.7, 7);
          const op = interpolate(s, [0, 1], [0, 1]);
          const sc = interpolate(s, [0, 1], [0.85, 1]);
          return (
            <div
              key={i}
              style={{
                ...glass("dark"),
                borderRadius: 28,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: op * (known ? 1 : 0.7),
                transform: `translate(${d.x}px, ${d.y}px) scale(${sc})`,
                filter: known ? "none" : "blur(7px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 900,
                  color: known ? "#fff" : COLORS.textDim,
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: known ? "rgba(124,138,90,0.22)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${known ? "rgba(124,138,90,0.5)" : "rgba(255,255,255,0.12)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {String(tile.n).padStart(2, "0")}
              </div>
              {known ? (
                <>
                  <Icon name={tile.icon!} size={62} glow="rgba(124,138,90,0.5)" />
                  <div style={{ fontSize: 25, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
                    {tile.label}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 70, fontWeight: 900, color: COLORS.textDim, alignSelf: "center" }}>
                  ?
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* leading title overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: titleOp,
          transform: `scale(${interpolate(titleIn, [0, 1], [0.8, 1])})`,
        }}
      >
        <div style={{ fontSize: 200, fontWeight: 900, color: COLORS.text, lineHeight: 1, textShadow: "0 10px 60px rgba(124,138,90,0.5)" }}>
          9
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, letterSpacing: 14, color: COLORS.text }}>
          ERRORES
        </div>
        <div style={{ fontSize: 30, fontWeight: 600, color: COLORS.textSoft, marginTop: 14, letterSpacing: 2 }}>
          que te roban el retiro que te ganaste
        </div>
      </div>
    </SceneFrame>
  );
};
