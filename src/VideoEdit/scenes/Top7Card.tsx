import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, SPRING_ZOOM } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { Media } from "../components/Media";

// Top7Card — tarjeta flotante de REVELACIÓN de cada animal del top, con un riel de
// progreso de 7 casilleros que se va encendiendo a medida que avanza el conteo.
// Es el separador/revelación de cada puesto (reemplaza a RuleNumberScene en este
// video): foto-héroe enmarcada CON PROFUNDIDAD (relleno blureado detrás), número de
// puesto grande con numerales old-style, nombre del animal en serif, la línea de
// beneficio, y abajo el riel "N / 7". Marca terrosa: papel crema, tinta marrón,
// acento salvia/sepia, EB Garamond.
const TONE: Record<string, string> = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
};

export const Top7Card: React.FC<{
  durationInFrames: number;
  rank: number; // 1..7 (puesto actual)
  total?: number; // 7
  name: string; // "La gallina ponedora"
  benefit: string; // "Huevos todo el año"
  image: string; // "img/x.png" foto-héroe del animal
  accent?: "accent" | "amber" | "good" | "cold" | "danger";
  hue?: "blue" | "cold" | "amber" | "red";
  label?: string; // eyebrow, default "EL TOP 7"
}> = ({
  durationInFrames,
  rank,
  total = 7,
  name,
  benefit,
  image,
  accent = "accent",
  hue = "amber",
  label = "EL TOP 7",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const acc = TONE[accent] || COLORS.accent;

  const enter = spring({ frame, fps, config: SPRING_ZOOM });
  const exit = spring({ frame: frame - (durationInFrames - 16), fps, config: { damping: 200 } });
  const op = interpolate(enter, [0, 1], [0, 1]) * interpolate(exit, [0, 1], [1, 0]);

  // foto-héroe entra escalando desde un poco más chica + leve giro; flota suave
  const cardIn = spring({ frame: frame - 4, fps, config: { damping: 17, mass: 0.85, stiffness: 110 } });
  const cardScale = interpolate(cardIn, [0, 1], [0.86, 1]) * interpolate(exit, [0, 1], [1, 1.06]);
  const cardRot = (1 - cardIn) * -2.4;
  const float = Math.sin(frame / 30) * 7;
  const kb = interpolate(frame, [0, durationInFrames], [1.05, 1.13]);

  // texto a la derecha entra escalonado
  const numIn = spring({ frame: frame - 8, fps, config: { damping: 16 } });
  const nameIn = spring({ frame: frame - 14, fps, config: { damping: 18 } });
  const benIn = spring({ frame: frame - 22, fps, config: { damping: 18 } });

  const HERO_W = 760,
    HERO_H = 900;
  const heroLeft = 150,
    heroTop = (1080 - HERO_H) / 2 - 10;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, opacity: op }}>
      <TechBackground glowX={62} glowY={42} hue={hue} drift={0.4} />

      {/* ── foto-héroe enmarcada CON PROFUNDIDAD (relleno blureado detrás) ── */}
      <div
        style={{
          position: "absolute",
          left: heroLeft,
          top: heroTop,
          width: HERO_W,
          height: HERO_H,
          transform: `translateY(${float}px) scale(${cardScale}) rotate(${cardRot}deg)`,
          transformOrigin: "center",
          borderRadius: 26,
          padding: 10,
          background: COLORS.bg0,
          boxShadow: "0 50px 110px rgba(42,38,32,0.40), 0 12px 30px rgba(42,38,32,0.28)",
          border: `1px solid ${COLORS.bg2}`,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 18, overflow: "hidden" }}>
          {/* relleno blureado de fondo (profundidad, no plano) */}
          <Media
            src={image}
            style={{ position: "absolute", inset: -30, width: "calc(100% + 60px)", height: "calc(100% + 60px)", objectFit: "cover", filter: "blur(26px) brightness(0.7)", transform: "scale(1.1)" }}
          />
          {/* foto nítida al frente */}
          <Media
            src={image}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }}
          />
          {/* viñeta sutil + línea de acento inferior */}
          <AbsoluteFill style={{ background: "radial-gradient(70% 80% at 50% 40%, transparent 55%, rgba(42,38,32,0.35) 100%)" }} />
          <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 6, background: acc, opacity: 0.92 }} />
        </div>
      </div>

      {/* ── columna derecha: puesto + nombre + beneficio + riel ── */}
      <div
        style={{
          position: "absolute",
          left: 1010,
          top: 150,
          width: 760,
          height: 780,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 8, textTransform: "uppercase", color: COLORS.textSoft, opacity: numIn }}>
          {label}
        </div>

        {/* número de puesto grande */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginTop: 6,
            opacity: numIn,
            transform: `translateY(${interpolate(numIn, [0, 1], [22, 0])}px)`,
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 700, color: acc, fontStyle: "italic" }}>N.º</span>
          <span style={{ fontSize: 230, fontWeight: 800, lineHeight: 0.9, color: COLORS.text }}>{rank}</span>
          <span style={{ fontSize: 50, fontWeight: 600, color: COLORS.textDim }}>de {total}</span>
        </div>

        {/* nombre del animal */}
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            fontStyle: "italic",
            color: COLORS.text,
            lineHeight: 1.05,
            marginTop: 4,
            opacity: nameIn,
            transform: `translateY(${interpolate(nameIn, [0, 1], [24, 0])}px)`,
          }}
        >
          {name}
        </div>

        {/* línea de beneficio con barra de acento */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 22,
            opacity: benIn,
            transform: `translateY(${interpolate(benIn, [0, 1], [18, 0])}px)`,
          }}
        >
          <div style={{ width: 6, height: 46, background: acc, borderRadius: 3 }} />
          <div style={{ fontSize: 40, fontWeight: 600, color: COLORS.textSoft }}>{benefit}</div>
        </div>

        {/* ── riel de progreso N / 7 ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 52, opacity: numIn }}>
          {Array.from({ length: total }, (_, i) => {
            const n = i + 1;
            const done = n < rank;
            const current = n === rank;
            // el casillero actual late suave
            const pulse = current ? 1 + Math.sin(frame / 7) * 0.06 : 1;
            const size = current ? 58 : 46;
            return (
              <div
                key={n}
                style={{
                  width: size,
                  height: size,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: current ? 30 : 24,
                  fontWeight: 800,
                  transform: `scale(${pulse})`,
                  background: current ? acc : done ? COLORS.accentSoft : "transparent",
                  color: current ? COLORS.bg0 : done ? COLORS.bg0 : COLORS.textDim,
                  border: current || done ? "none" : `2px solid ${COLORS.bg2}`,
                  boxShadow: current ? `0 8px 22px ${acc}66` : "none",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
