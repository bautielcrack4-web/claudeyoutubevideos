// Entry MÍNIMO solo-Mosquitos para Remotion Studio (bundle liviano, sin OOM en Node 24).
// Uso: npx remotion studio src/index_mosquitos.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainMosquitos, TOTAL_FRAMES_MOSQUITOS } from "./VideoEdit/Main_mosquitos";

const MosquitosRoot: React.FC = () => (
  <Composition
    id="Mosquitos"
    component={MainMosquitos}
    durationInFrames={TOTAL_FRAMES_MOSQUITOS}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(MosquitosRoot);
