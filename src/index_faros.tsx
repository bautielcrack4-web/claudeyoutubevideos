// Entry MÍNIMO solo-Faros para Remotion Studio. Uso: npx remotion studio src/index_faros.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainFaros, TOTAL_FRAMES_FAROS } from "./VideoEdit/Main_faros";

const FarosRoot: React.FC = () => (
  <Composition id="Faros" component={MainFaros} durationInFrames={TOTAL_FRAMES_FAROS} fps={30} width={1920} height={1080} />
);

registerRoot(FarosRoot);
