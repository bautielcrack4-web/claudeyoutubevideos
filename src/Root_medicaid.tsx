import "./index.css";
import { AbsoluteFill, Composition } from "remotion";
import { MainMedicaid, TOTAL_FRAMES_MED } from "./VideoEdit/Main_medicaid";
import { COLORS } from "./VideoEdit/theme_ben";
import { KeyPhrase } from "./VideoEdit/scenes/KeyPhrase";

// demo del recurso KeyPhrase (frase clave palabra-por-palabra + blur del fondo)
const KeyPhraseDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
    <KeyPhrase durationInFrames={90} text="PUSIERON UN *EMBARGO* A LA CASA" src="img/rb_abogado.png" />
  </AbsoluteFill>
);

// Entry dedicada (anti-OOM): Studio carga SOLO este video.
//   npx remotion studio src/index-medicaid.ts
export const RootMedicaid: React.FC = () => (
  <>
    <Composition id="Medicaid" component={MainMedicaid} durationInFrames={TOTAL_FRAMES_MED} fps={30} width={1920} height={1080} />
    <Composition id="KeyPhraseDemo" component={KeyPhraseDemo} durationInFrames={90} fps={30} width={1920} height={1080} />
  </>
);
