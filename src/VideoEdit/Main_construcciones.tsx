// Main_construcciones.tsx — video 2 Crónicas Perdidas (misterio). Clips reales (1 por idea)
// sincronizados al ms exacto de la narración Trevor, cross-dissolve + Ken-Burns. SIN crop de
// fauna (en misterio no importan marcas de agua). Audio = voz (el farm la mezcla bien).
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import cues from "./construcciones_cues.json";

const FPS = 30;
const DIS = 12;
const last = cues[cues.length - 1];
export const TOTAL_FRAMES_CONS = Math.round((last.start + last.dur + 0.5) * FPS);

const Clip: React.FC<{ name: string; durF: number }> = ({ name, durF }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, DIS, durF - DIS, durF], [0, 1, 1, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scale = interpolate(f, [0, durF], [1.0, 1.07], { extrapolateRight: "clamp" }); // Ken-Burns suave
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(`broll/${name}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
    </AbsoluteFill>
  );
};

export const MainConstrucciones: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {cues.map((c, i) => {
        const from = Math.round(c.start * FPS) - (i === 0 ? 0 : DIS);
        const durF = Math.round(c.dur * FPS) + (i === 0 ? 0 : DIS);
        return (
          <Sequence key={c.name} from={Math.max(0, from)} durationInFrames={durF + 2} name={c.name}>
            <Clip name={c.name} durF={durF} />
          </Sequence>
        );
      })}
      <Audio src={staticFile("construcciones.wav")} />
    </AbsoluteFill>
  );
};
