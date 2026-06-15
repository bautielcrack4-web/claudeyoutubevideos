import "./index.css";
import { Composition } from "remotion";
import { MainViuda, TOTAL_FRAMES_VD } from "./VideoEdit/Main_viuda";

// Entry dedicada (anti-OOM): Studio carga SOLO este video.
//   npx remotion studio src/index-viuda.ts
export const RootViuda: React.FC = () => (
  <>
    <Composition id="Viuda" component={MainViuda} durationInFrames={TOTAL_FRAMES_VD} fps={30} width={1920} height={1080} />
  </>
);
