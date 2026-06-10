import "./index.css";
import { Composition } from "remotion";
import { MainFly, TOTAL_FRAMES_FLY } from "./VideoEdit/Main_fly";
import { MainHipos, TOTAL_FRAMES_HIP } from "./VideoEdit/Main_hipos";

// ── SOLO el proyecto activo (Estufa) + el demo del efecto Impact Reveal ──
// Las composiciones viejas (Termitas, Beduinos, Mongoles, Doodle, etc.) quedan
// DESREGISTRADAS para que Remotion Studio no las cargue ni consuma RAM. Sus
// archivos siguen en src/VideoEdit/ — para reactivar una, volvé a importarla y
// agregá su <Composition> acá.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Fly"
        component={MainFly}
        durationInFrames={TOTAL_FRAMES_FLY}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Hipos"
        component={MainHipos}
        durationInFrames={TOTAL_FRAMES_HIP}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
