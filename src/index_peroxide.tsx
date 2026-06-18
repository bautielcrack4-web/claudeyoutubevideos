// Entry MÍNIMO solo-Peroxide para Remotion Studio (bundle liviano, sin OOM en Node 24).
// Uso: npx remotion studio src/index_peroxide.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainPeroxide, TOTAL_FRAMES_PEROXIDE } from "./VideoEdit/Main_peroxide";

const PeroxideRoot: React.FC = () => (
  <Composition
    id="Peroxide"
    component={MainPeroxide}
    durationInFrames={TOTAL_FRAMES_PEROXIDE}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(PeroxideRoot);
