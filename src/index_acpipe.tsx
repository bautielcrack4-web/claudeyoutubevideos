// Entry MÍNIMO solo-Acpipe para Remotion Studio (bundle liviano, sin OOM en Node 24).
// Uso: npx remotion studio src/index_acpipe.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainAcpipe, TOTAL_FRAMES_ACPIPE } from "./VideoEdit/Main_acpipe";

const AcpipeRoot: React.FC = () => (
  <Composition
    id="Acpipe"
    component={MainAcpipe}
    durationInFrames={TOTAL_FRAMES_ACPIPE}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(AcpipeRoot);
