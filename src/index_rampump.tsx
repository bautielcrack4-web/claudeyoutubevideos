// Entry MÍNIMO solo-Rampump para Remotion Studio (sin OOM en Node 24).
// Uso: npx remotion studio src/index_rampump.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainRampump, TOTAL_FRAMES_RAMPUMP } from "./VideoEdit/Main_rampump";

const RampumpRoot: React.FC = () => (
  <Composition
    id="Rampump"
    component={MainRampump}
    durationInFrames={TOTAL_FRAMES_RAMPUMP}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RampumpRoot);
