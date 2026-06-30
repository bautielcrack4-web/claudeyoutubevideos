import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// CinematicLowerThird — plano (imagen) con Ken Burns + placa documental elegante:
// una línea fina que se traza y el lugar/fecha en serif que entra suave. Ancla
// tiempo/lugar = credibilidad documental. Va sobre footage (avatar puede quedar).
const GOLD = "#C9A87A";

export const CinematicLowerThird: React.FC<{
  durationInFrames: number;
  image: string;
  place?: string;
  date?: string;
}> = ({ durationInFrames, image, place = "", date = "" }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ken Burns lento
  const kb = interpolate(frame, [0, durationInFrames], [1, 1.07]);

  // placa: línea que se traza + texto
  const lineW = interpolate(frame, [10, 26], [0, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
  const txtSpr = spring({ frame: frame - 16, fps, config: { damping: 16 }, durationInFrames: 14 });
  const dateO = interpolate(frame, [24, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: inO * outO, background: "#000" }}>
      <Img src={staticFile(image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }} />
      {/* scrim inferior-izquierdo */}
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(10,8,5,0.7) 0%, rgba(10,8,5,0.1) 30%, transparent 50%)" }} />

      <div style={{ position: "absolute", left: 70, bottom: 90, fontFamily: FONT_STACK }}>
        <div style={{ color: "#FBF1E0", fontSize: 56, fontWeight: 800, letterSpacing: 1, textShadow: "0 2px 12px rgba(0,0,0,0.8)", opacity: txtSpr, transform: `translateY(${interpolate(txtSpr, [0, 1], [14, 0])}px)` }}>{place}</div>
        {/* línea dorada que se traza */}
        <div style={{ height: 3, width: lineW, background: GOLD, margin: "14px 0", boxShadow: "0 1px 6px rgba(0,0,0,0.5)" }} />
        {date ? <div style={{ color: GOLD, fontSize: 30, letterSpacing: 5, textTransform: "uppercase", fontWeight: 700, opacity: dateO, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>{date}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
