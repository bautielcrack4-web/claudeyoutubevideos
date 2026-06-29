// Entry MÍNIMO solo-Plomeria para Remotion Studio. Uso: npx remotion studio src/index_plomeria.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainPlomeria, TOTAL_FRAMES_PLOMERIA } from "./VideoEdit/Main_plomeria";

const PlomeriaRoot: React.FC = () => (
  <Composition id="Plomeria" component={MainPlomeria} durationInFrames={TOTAL_FRAMES_PLOMERIA} fps={30} width={1920} height={1080} />
);

registerRoot(PlomeriaRoot);
