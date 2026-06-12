import "./index.css";
import { Composition } from "remotion";
import { MainEstiercol, TOTAL_FRAMES_EST } from "./VideoEdit/Main_estiercol";

// ── SOLO los videos ACTIVOS quedan registrados ──
// Las composiciones viejas (Fly, Hipos, Bisontes, Objetos, Civil, Top7Demo,
// Mograph, MographShowcase, etc.) quedan DESREGISTRADAS para que Studio no las
// cargue ni tire 404 de audios que ya no están en disco. Sus archivos siguen en
// src/VideoEdit/ — para reactivar una, volvé a importarla y agregá su <Composition>.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* VIDEO ACTIVO — Reviví tu tierra muerta con $1 (estiércol, bajo esfuerzo) */}
      <Composition
        id="Estiercol"
        component={MainEstiercol}
        durationInFrames={TOTAL_FRAMES_EST}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
