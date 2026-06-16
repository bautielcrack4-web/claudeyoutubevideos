import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";

// LocationTag — OVERLAY abajo-izquierda: tarjeta con mini-mapa vintage + pin que cae
// sobre el lugar + nombre. Va ENCIMA del clip que sigue corriendo a pantalla completa.
// No cubre la pantalla: es un lower-third de ubicación, estilo documental.
export const LocationTag: React.FC<{
  durationInFrames: number;
  mapImage: string;        // "img/hu_map_us.png" (mapa vintage)
  pinX: number;            // % horizontal del pin dentro del mapa (0-100)
  pinY: number;            // % vertical
  place: string;           // "Wyoming"
  sub?: string;            // "Estados Unidos"
}> = ({ durationInFrames, mapImage, pinX, pinY, place, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // entrada (slide+fade desde la izquierda) y salida
  const inS = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const outS = interpolate(frame, [durationInFrames - sec(0.5), durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(inS, [0, 1], [-60, 0]) + interpolate(outS, [0, 1], [0, -60]);
  const op = Math.min(inS, 1 - outS);

  // pin que cae con rebote (un poco después de entrar)
  const pinDrop = spring({ frame: frame - sec(0.35), fps, config: { damping: 9, stiffness: 140 } });
  const pinY2 = interpolate(pinDrop, [0, 1], [-26, 0], { extrapolateLeft: "clamp" });
  const pinOp = interpolate(frame, [sec(0.35), sec(0.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // pulso del pin
  const pulse = 1 + Math.sin(Math.max(0, frame - sec(0.6)) / 6) * 0.12;

  const CARD_W = 380, MAP_H = 188;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", left: 70, bottom: 90, width: CARD_W,
          transform: `translateX(${x}px)`, opacity: op, fontFamily: FONT_STACK,
          borderRadius: 16, overflow: "hidden",
          background: "rgba(22,18,12,0.82)", backdropFilter: "blur(6px)",
          border: `1px solid ${COLORS.amber}66`, boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
        }}
      >
        {/* mini-mapa vintage con el pin */}
        <div style={{ position: "relative", width: "100%", height: MAP_H, overflow: "hidden" }}>
          <Img src={mapImage.startsWith("http") ? mapImage : staticFile(mapImage)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {/* anillo de ubicación */}
          <div style={{ position: "absolute", left: `${pinX}%`, top: `${pinY}%`, width: 30, height: 30, marginLeft: -15, marginTop: -15, borderRadius: "50%", border: `2px solid ${COLORS.danger}`, opacity: pinOp * 0.6, transform: `scale(${pulse * 1.5})` }} />
          {/* pin */}
          <div style={{ position: "absolute", left: `${pinX}%`, top: `${pinY}%`, marginLeft: -9, marginTop: -30, opacity: pinOp, transform: `translateY(${pinY2}px)` }}>
            <svg width="18" height="30" viewBox="0 0 18 30">
              <path d="M9 0 C3 0 0 4 0 9 C0 16 9 30 9 30 C9 30 18 16 18 9 C18 4 15 0 9 0 Z" fill={COLORS.danger} />
              <circle cx="9" cy="9" r="3.4" fill={COLORS.bg0} />
            </svg>
          </div>
        </div>
        {/* etiqueta */}
        <div style={{ padding: "12px 18px 14px", borderTop: `1px solid ${COLORS.amber}33` }}>
          <div style={{ fontSize: 15, letterSpacing: 3, textTransform: "uppercase", color: COLORS.amber, opacity: 0.85, marginBottom: 2 }}>Ubicación</div>
          <div style={{ fontSize: 34, fontWeight: 700, color: COLORS.bg0, lineHeight: 1.05 }}>{place}</div>
          {sub && <div style={{ fontSize: 18, color: COLORS.bg0, opacity: 0.7, marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};
