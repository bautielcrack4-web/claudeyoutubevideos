import { Series } from "remotion";
import { ImpactReveal } from "./scenes/ImpactReveal";
import { sec } from "./theme";

// Demo de 3 beats del efecto IMPACT REVEAL para revisar el hook.
export const IMPACT_FRAMES = sec(15);

export const ImpactDemo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={sec(5)}>
        <ImpactReveal
          durationInFrames={sec(5)}
          image="img/es_estufa_rincon_galpon.png"
          setup="¿Pagás gas o garrafa para calentar tu casa?"
          impact="TE ESTÁN ROBANDO"
          impactAccent="danger"
          hitAt={1.1}
          fontSize={140}
          boom={0}
        />
      </Series.Sequence>

      <Series.Sequence durationInFrames={sec(5)}>
        <ImpactReveal
          durationInFrames={sec(5)}
          image="img/es_chimenea_humo_negro_mala.png"
          setup="Esa salamandra que tenés en el galpón"
          impact="TIRA EL 70% AL CIELO"
          impactAccent="amber"
          hitAt={1.0}
          fontSize={132}
          boom={1}
        />
      </Series.Sequence>

      <Series.Sequence durationInFrames={sec(5)}>
        <ImpactReveal
          durationInFrames={sec(5)}
          image="img/es_cinco_ramitas_mano.png"
          setup="Esta estufa calienta 6 horas con"
          impact="CINCO RAMITAS"
          impactAccent="good"
          hitAt={1.0}
          align="bottom"
          fontSize={150}
          boom={2}
        />
      </Series.Sequence>
    </Series>
  );
};
