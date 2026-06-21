import "./index.css";
import { Composition } from "remotion";
import { MainReplantar, TOTAL_FRAMES_REPLANTAR } from "./VideoEdit/Main_replantar";
import { MainCiudades, TOTAL_FRAMES_CIUD } from "./VideoEdit/Main_ciudades";

// ── Limpieza jun 2026 ──
// Se desregistraron los ~27 videos viejos ya renderizados y se borraron sus assets
// de public/ (avatares, wavs, imágenes, clips). Sus Main_*.tsx / cues_*.gen.tsx
// siguen en src/VideoEdit/ por si querés reactivar alguno (re-importá + agregá su
// <Composition>), pero sin sus assets no renderizan. Solo Replantar queda activo.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* VIDEO ACTIVO — Replantar verduras del súper (LeviLappJardín · ES · clips-first) */}
      <Composition
        id="Replantar"
        component={MainReplantar}
        durationInFrames={TOTAL_FRAMES_REPLANTAR}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — 7 Ciudades Sumergidas (Crónicas Perdidas · ES · faceless · clips-first) */}
      <Composition
        id="Ciudades"
        component={MainCiudades}
        durationInFrames={TOTAL_FRAMES_CIUD}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
