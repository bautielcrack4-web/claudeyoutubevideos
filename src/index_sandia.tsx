// Entry MÍNIMO solo-Sandia para Remotion Studio (sin OOM en Node 24).
// Uso: npx remotion studio src/index_sandia.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainSandia, TOTAL_FRAMES_SANDIA } from "./VideoEdit/Main_sandia";

const SandiaRoot: React.FC = () => (
  <Composition
    id="Sandia"
    component={MainSandia}
    durationInFrames={TOTAL_FRAMES_SANDIA}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(SandiaRoot);
