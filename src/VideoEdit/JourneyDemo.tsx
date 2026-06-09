import { Series } from "remotion";
import { JourneyCanvas } from "./scenes/JourneyCanvas";
import { InfiniteZoom } from "./scenes/InfiniteZoom";
import { sec } from "./theme";

const T = (n: string) => `img/${n}.png`;
export const JOURNEY_FRAMES = sec(30);

export const JourneyDemo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={sec(22)}>
        <JourneyCanvas
          durationInFrames={sec(22)}
          eyebrow="Gratis o casi gratis"
          title="El recorrido de la mezcla"
          worldImage={T("es_galpon_caliente_interior")}
          waypoints={[
            { x: 600, y: 900, z: 0.7, image: T("es_tierra_terreno_pala"), label: "Tierra", num: "1" },
            { x: 1650, y: 520, z: 0.4, image: T("es_arena_fina_balde"), label: "Arena", num: "2" },
            { x: 2650, y: 1120, z: 0.85, image: T("es_paja_fardo"), label: "Paja", num: "3" },
            { x: 3600, y: 600, z: 0.5, image: T("es_cortando_paja"), label: "Cortar 5-10 cm", num: "4" },
            { x: 4550, y: 1050, z: 0.72, image: T("es_pisar_mezcla_pies"), label: "Pisar descalzo", num: "5" },
            { x: 5450, y: 540, z: 0.6, image: T("es_bola_barro_prueba"), label: "Como masa de pan", num: "6" },
          ]}
        />
      </Series.Sequence>
      <Series.Sequence durationInFrames={sec(8)}>
        <InfiniteZoom
          durationInFrames={sec(8)}
          images={[
            { src: T("es_estufa_rincon_galpon"), label: "La estufa" },
            { src: T("es_camara_interna_fuego"), label: "La cámara" },
            { src: T("es_fuego_hacia_arriba_motor"), label: "El fuego" },
            { src: T("es_chimenea_columna_vapor"), label: "Solo vapor" },
            { src: T("es_estufa_atardecer_cierre"), label: "46 inviernos" },
          ]}
        />
      </Series.Sequence>
    </Series>
  );
};
