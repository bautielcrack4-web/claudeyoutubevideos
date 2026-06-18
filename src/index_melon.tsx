// Entry MÍNIMO solo-Melon: registra una sola composición para que Remotion Studio
// bundlee liviano y no se quede sin heap (el index.ts completo, con todas las comps
// + JSON grandes, dispara OOM de V8 en Node 24). Uso: npx remotion studio src/index_melon.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainMelon, TOTAL_FRAMES_MELON } from "./VideoEdit/Main_melon";

const MelonRoot: React.FC = () => (
  <Composition
    id="Melon"
    component={MainMelon}
    durationInFrames={TOTAL_FRAMES_MELON}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(MelonRoot);
