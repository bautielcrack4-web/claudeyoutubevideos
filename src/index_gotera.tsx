// Entry MÍNIMO solo-Gotera para Remotion Studio (bundle liviano, sin OOM en Node 24).
// Uso: npx remotion studio src/index_gotera.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainGotera, TOTAL_FRAMES_GOTERA } from "./VideoEdit/Main_gotera";

const GoteraRoot: React.FC = () => (
  <Composition
    id="Gotera"
    component={MainGotera}
    durationInFrames={TOTAL_FRAMES_GOTERA}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(GoteraRoot);
