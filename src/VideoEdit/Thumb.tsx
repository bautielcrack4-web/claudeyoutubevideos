import { AbsoluteFill, Img, staticFile } from "remotion";

// Fuente de sistema pesada (sin fetch a Google Fonts, que colgaba el render de still).
// Impact / Arial Black = look de miniatura de YouTube, condensado y grueso.
const fontFamily = '"Arial Black", Impact, "Haettenschweiler", sans-serif';

// Miniatura estilo canal: presentador (foto gpt-image) + texto AMARILLO con borde
// negro grueso + flecha ROJA curva apuntando al objeto. 1280x720.
export type ThumbProps = {
  image: string; // staticFile path del fondo (presentador + objeto)
  lines: string[]; // 1-3 líneas, se muestran en mayúscula
  arrow?: { x1: number; y1: number; x2: number; y2: number; curve?: number } | null;
  textX?: number;
  textY?: number;
  fontSize?: number;
};

const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; curve?: number }> = ({ x1, y1, x2, y2, curve = 0.3 }) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const cx = mx - dy * curve, cy = my + dx * curve;
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const ah = 52;
  const a1 = ang + Math.PI - 0.5, a2 = ang + Math.PI + 0.5;
  const p1x = x2 + ah * Math.cos(a1), p1y = y2 + ah * Math.sin(a1);
  const p2x = x2 + ah * Math.cos(a2), p2y = y2 + ah * Math.sin(a2);
  const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  return (
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0 }}>
      <path d={d} stroke="#000" strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#ED1C1C" strokeWidth={17} fill="none" strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}`} fill="#ED1C1C" stroke="#000" strokeWidth={6} strokeLinejoin="round" />
    </svg>
  );
};

export const Thumb: React.FC<ThumbProps> = ({ image, lines, arrow, textX = 48, textY = 46, fontSize = 112 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.3) 42%, rgba(0,0,0,0) 62%)" }} />
      <div style={{ position: "absolute", left: textX, top: textY, display: "flex", flexDirection: "column", lineHeight: 0.92 }}>
        {lines.map((l, i) => (
          <span
            key={i}
            style={{
              fontFamily,
              fontSize,
              color: "#FFD21A",
              textTransform: "uppercase",
              WebkitTextStroke: "9px #000",
              // paintOrder asegura que el borde quede DETRÁS del relleno amarillo
              paintOrder: "stroke fill",
              textShadow: "5px 6px 0 rgba(0,0,0,0.95)",
              letterSpacing: 1,
            }}
          >
            {l}
          </span>
        ))}
      </div>
      {arrow && <Arrow {...arrow} />}
    </AbsoluteFill>
  );
};
