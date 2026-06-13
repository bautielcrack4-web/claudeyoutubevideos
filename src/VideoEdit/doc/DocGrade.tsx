import { AbsoluteFill, useCurrentFrame } from "remotion";

// ── DocGrade ──────────────────────────────────────────────────────────────────
// Capa de pulido que UNIFICA clips de fuentes distintas para que parezcan un solo
// documental: lavado cálido (dorado sabana), viñeta, grano de película sutil y
// barras cinematográficas finas. Va ENCIMA de todos los clips. El ajuste de
// contraste/saturación se aplica como `filter` en el wrapper del Main.
export const DocGrade: React.FC<{ bars?: boolean }> = ({ bars = true }) => {
  const f = useCurrentFrame();
  // grano: textura estática que cambia poco (barata)
  const grainSeed = Math.floor(f / 2);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* lavado cálido dorado (soft-light) */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 38%, rgba(255,214,150,0.16), rgba(120,80,40,0.05) 55%, rgba(20,12,6,0.0) 80%)",
          mixBlendMode: "soft-light",
        }}
      />
      {/* viñeta */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(130% 130% at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      {/* grano de película */}
      <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id={`gr${grainSeed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={grainSeed} />
          </filter>
          <rect width="100%" height="100%" filter={`url(#gr${grainSeed})`} />
        </svg>
      </AbsoluteFill>
      {/* barras cinematográficas finas (look documental) */}
      {bars && (
        <>
          <AbsoluteFill style={{ height: 56, top: 0, background: "#000" }} />
          <AbsoluteFill style={{ height: 56, top: "auto", bottom: 0, background: "#000" }} />
        </>
      )}
    </AbsoluteFill>
  );
};
