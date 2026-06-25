// Entry MÍNIMO solo-Oxido para Remotion Studio (bundle liviano, sin OOM en Node 24).
// Uso: npx remotion studio src/index_oxido.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainOxido, TOTAL_FRAMES_OXIDO } from "./VideoEdit/Main_oxido";

const OxidoRoot: React.FC = () => (
  <Composition
    id="Oxido"
    component={MainOxido}
    durationInFrames={TOTAL_FRAMES_OXIDO}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(OxidoRoot);
