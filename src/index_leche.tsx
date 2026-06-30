// Entry MÍNIMO solo-Leche para Remotion Studio/render (bundle liviano, sin OOM en Node 24).
// Uso: npx remotion render src/index_leche.tsx Leche out/leche_hook.mp4 --frames=0-5531
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainLeche, TOTAL_FRAMES_LECHE } from "./VideoEdit/Main_leche";

const LecheRoot: React.FC = () => (
  <Composition
    id="Leche"
    component={MainLeche}
    durationInFrames={TOTAL_FRAMES_LECHE}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(LecheRoot);
