// Entry MÍNIMO solo-Moho para Remotion Studio (bundle liviano, sin OOM en Node 24).
// Uso: npx remotion studio src/index_moho.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainMoho, TOTAL_FRAMES_MOHO } from "./VideoEdit/Main_moho";

const MohoRoot: React.FC = () => (
  <Composition
    id="Moho"
    component={MainMoho}
    durationInFrames={TOTAL_FRAMES_MOHO}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(MohoRoot);
