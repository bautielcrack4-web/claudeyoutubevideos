import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

// FrostWipe — transición: cristales de ESCARCHA crecen desde los bordes y tapan la
// pantalla (pico ~50%), luego se retiran. El corte entre escenas va en el pico.
// Pensado como overlay corto (~0.8-1.2s) sobre el límite entre dos beats.
const seeds = Array.from({ length: 22 }, (_, i) => {
  // sembrados alrededor del borde
  const edge = i % 4;
  const f = ((i * 53) % 100) / 100;
  if (edge === 0) return { x: f, y: 0, a: 90 };
  if (edge === 1) return { x: 1, y: f, a: 180 };
  if (edge === 2) return { x: f, y: 1, a: 270 };
  return { x: 0, y: f, a: 0 };
});

// un helecho de escarcha: espina + ramitas
const fern = (len: number) => {
  let d = `M 0 0 L 0 ${-len}`;
  const n = Math.max(2, Math.floor(len / 26));
  for (let k = 1; k <= n; k++) {
    const y = -(k / n) * len * 0.92;
    const bl = len * 0.22 * (1 - k / (n + 2));
    d += ` M 0 ${y} L ${bl} ${y - bl}`;
    d += ` M 0 ${y} L ${-bl} ${y - bl}`;
  }
  return d;
};

export const FrostWipe: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  // cobertura: crece 0→1 (0..0.5) y se retira (0.5..1)
  const grow = interpolate(t, [0, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const recede = interpolate(t, [0.5, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cover = t < 0.5 ? grow : recede;

  const veil = interpolate(cover, [0.3, 1], [0, 0.96], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const maxLen = Math.hypot(width, height) * 0.6;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* helechos de escarcha */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {seeds.map((s, i) => {
          const len = maxLen * cover * (0.55 + ((i * 31) % 50) / 100);
          return (
            <g key={i} transform={`translate(${s.x * width} ${s.y * height}) rotate(${s.a + ((i * 17) % 30) - 15})`} opacity={Math.min(1, cover * 1.4)}>
              <path d={fern(len)} fill="none" stroke="#EAF4FB" strokeWidth={2.2} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(180,215,240,0.8))" }} />
            </g>
          );
        })}
      </svg>
      {/* velo frío */}
      <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 50%, rgba(230,244,251,0.2), rgba(214,236,247,0.95))", opacity: veil }} />
    </AbsoluteFill>
  );
};
