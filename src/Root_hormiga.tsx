import "./index.css";
import { Composition } from "remotion";
import { MainHormiga, TOTAL_FRAMES_HB } from "./VideoEdit/Main_hormiga";

// Entry dedicada (anti-OOM): Studio carga SOLO este video.
//   npx remotion studio src/index-hormiga.ts
export const RootHormiga: React.FC = () => (
  <>
    <Composition id="Hormiga" component={MainHormiga} durationInFrames={TOTAL_FRAMES_HB} fps={30} width={1920} height={1080} />
  </>
);
