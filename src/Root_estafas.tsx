import "./index.css";
import { Composition } from "remotion";
import { MainEstafas, TOTAL_FRAMES_ES } from "./VideoEdit/Main_estafas";

// Entry dedicada (anti-OOM): Studio carga SOLO este video.
//   npx remotion studio src/index-estafas.ts
export const RootEstafas: React.FC = () => (
  <>
    <Composition id="Estafas" component={MainEstafas} durationInFrames={TOTAL_FRAMES_ES} fps={30} width={1920} height={1080} />
  </>
);
