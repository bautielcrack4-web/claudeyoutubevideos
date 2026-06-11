import "./index.css";
import { Composition } from "remotion";
import { MainFly, TOTAL_FRAMES_FLY } from "./VideoEdit/Main_fly";
import { MainHipos, TOTAL_FRAMES_HIP } from "./VideoEdit/Main_hipos";
import { MainBisontes, TOTAL_FRAMES_BI } from "./VideoEdit/Main_bisontes";
import { MainObjetos, TOTAL_FRAMES_OBJ } from "./VideoEdit/Main_objetos";
import { MainCivil, TOTAL_FRAMES_CIVIL } from "./VideoEdit/Main_civil";
import { MographDemo, TOTAL_FRAMES_MOGRAPH } from "./VideoEdit/mograph/MographDemo";
import { MographShowcase, TOTAL_FRAMES_SHOWCASE } from "./VideoEdit/mograph/MographShowcase";

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
      <Composition
        id="Bisontes"
        component={MainBisontes}
        durationInFrames={TOTAL_FRAMES_BI}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Objetos"
        component={MainObjetos}
        durationInFrames={TOTAL_FRAMES_OBJ}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Civil"
        component={MainCivil}
        durationInFrames={TOTAL_FRAMES_CIVIL}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* mograph kit — broadcast-style component demo (cyan/magenta/dark) */}
      <Composition
        id="Mograph"
        component={MographDemo}
        durationInFrames={TOTAL_FRAMES_MOGRAPH}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* real-footage showcase — Mairi + Knapdale, the competitor look end to end */}
      <Composition
        id="MographShowcase"
        component={MographShowcase}
        durationInFrames={TOTAL_FRAMES_SHOWCASE}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
