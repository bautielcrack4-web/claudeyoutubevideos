// Main_leona.tsx — TEST nicho fauna. Clips reales matcheados (1 por frase), sincronizados
// al ms exacto de la narración Trevor (leona.wav), con cross-dissolve + Ken-Burns suave.
// Cues en leona_cues.json (de gen_leona.mjs). Sin filtros de color (regla del usuario).
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import cues from "./leona_cues.json";

const FPS = 30;
const DIS = 12; // frames de cross-dissolve
const last = cues[cues.length - 1];
export const TOTAL_FRAMES_LEONA = Math.round((last.start + last.dur + 0.5) * FPS);

// ★ FAUNA: crop seguro — zoom base 1.12 + leve subida → empuja logos de esquina y
// el lower-third inferior (NatGeo/BBC) FUERA de cuadro, para que no se note la fuente.
const SAFE_CROP = 1.12;
const Clip: React.FC<{ name: string; durF: number }> = ({ name, durF }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, DIS, durF - DIS, durF], [0, 1, 1, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scale = interpolate(f, [0, durF], [SAFE_CROP, SAFE_CROP + 0.06], { extrapolateRight: "clamp" }); // Ken-Burns sobre el crop
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: "#000", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(`broll/${name}.mp4`)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translateY(-2.5%)` }}
      />
    </AbsoluteFill>
  );
};

export const MainLeona: React.FC = () => {
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
      <Audio src={staticFile("leona.wav")} />
    </AbsoluteFill>
  );
};
