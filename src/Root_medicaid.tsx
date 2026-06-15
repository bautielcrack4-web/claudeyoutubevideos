import "./index.css";
import { Composition } from "remotion";
import { MainMedicaid, TOTAL_FRAMES_MED } from "./VideoEdit/Main_medicaid";

// Entry dedicada (anti-OOM): Studio carga SOLO este video.
//   npx remotion studio src/index-medicaid.ts
export const RootMedicaid: React.FC = () => (
  <>
    <Composition id="Medicaid" component={MainMedicaid} durationInFrames={TOTAL_FRAMES_MED} fps={30} width={1920} height={1080} />
  </>
);
