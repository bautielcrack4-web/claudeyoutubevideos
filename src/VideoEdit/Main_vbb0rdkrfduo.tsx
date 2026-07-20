import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  FedBeforeAfter,
  FedChapter,
  FedChecklist,
  FedCta,
  FedHero,
  FedMolecule,
  FedQuote,
  FedStep,
} from '../FedererKit';

export const TOTAL_FRAMES_VBB0RDKRFDUO = 27699;

const FPS = 30;
const MAX_SHOT_FRAMES = 78; // 2.6 s: ningún visual no-avatar supera 3 s.
const IVORY = '#F4EFE4';
const TEAL = '#88B9A7';
const GOLD = '#C7A35C';
const RED = '#C96857';
const INK = '#071014';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type MediaAsset = {
  src: string;
  type: 'image' | 'video';
  startFrom?: number;
  position?: string;
};

type MontageWindow = {
  start: number;
  end: number;
  kicker: string;
  labels: string[];
  media: MediaAsset[];
  accent?: string;
};

type ComponentScene = {
  start: number;
  duration: number;
  node: React.ReactNode;
};

const frames = (seconds: number) => Math.round(seconds * FPS);
const image = (name: string, position = '50% 50%'): MediaAsset => ({
  src: `img/${name}.png`,
  type: 'image',
  position,
});
const VERIFIED_STARTS: Record<string, number> = {
  vbb_dyn_herbal_tea: 1,
  vbb_dyn_phone_photo: 1,
  vbb_dyn_lemon: 2,
  va_three_drops: 0.5,
  vbb2dyn_water: 3,
  vbb2dyn_cosmetic_shelf: 0.5,
  vbb2dyn_mature_mirror: 0.5,
  vbb2dyn_mature_window: 0.5,
  vbb2dyn_age_spots: 0.5,
  vbb2dyn_relaxed_face: 0.5,
  vbb2dyn_sun_face: 0.5,
  vbb2dyn_sleep: 0.5,
  vbb2dyn_lab_cosmetic: 0.5,
  vbb2dyn_kettle: 0.5,
  vbb2dyn_strainer: 0.5,
  vbb2dyn_face_wash: 0.5,
  vbb2dyn_moisturizer: 0.5,
  vbb2dyn_hat: 0.5,
  vbb2dyn_morning: 0.5,
  vbb2dyn_dermoscope: 0.5,
};
const stock = (name: string, startFrom?: number, position = '50% 50%'): MediaAsset => ({
  src: `broll/${name}.mp4`,
  type: 'video',
  startFrom: frames(startFrom ?? VERIFIED_STARTS[name] ?? 0),
  position,
});

const AvatarBase: React.FC = () => {
  const frame = useCurrentFrame();
  const slowCycle = frame % frames(38);
  const scale = interpolate(slowCycle, [0, frames(38)], [1.006, 1.032], clamp);
  const drift = Math.sin(frame / 210) * 0.32;

  return (
    <AbsoluteFill style={{backgroundColor: INK, overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile('vbb0rdkrfduo_opt.mp4')}
        volume={1}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 50%',
          transformOrigin: '50% 38%',
          transform: `scale(${scale}) translateX(${drift}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const MediaShot: React.FC<{asset: MediaAsset; index: number; duration: number}> = ({asset, index, duration}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, Math.max(1, duration - 1)], [1.015, 1.075], clamp);
  const x = interpolate(frame, [0, Math.max(1, duration - 1)], [index % 2 === 0 ? -0.7 : 0.7, index % 2 === 0 ? 0.7 : -0.7], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: INK, overflow: 'hidden'}}>
      {asset.type === 'video' ? (
        <OffthreadVideo
          src={staticFile(asset.src)}
          muted
          startFrom={(asset.startFrom ?? 0) + (index % 3) * 12}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: asset.position ?? '50% 50%',
            transform: `scale(${scale}) translateX(${x}%)`,
          }}
        />
      ) : (
        <Img
          src={staticFile(asset.src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: asset.position ?? '50% 50%',
            transform: `scale(${scale}) translateX(${x}%)`,
          }}
        />
      )}
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(3,9,12,.78) 0%, rgba(3,9,12,.18) 54%, rgba(3,9,12,.03) 100%)'}} />
    </AbsoluteFill>
  );
};

const ShotTitle: React.FC<{kicker: string; label: string; accent: string; variant: number; duration: number}> = ({
  kicker,
  label,
  accent,
  variant,
  duration,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 8], [0, 1], clamp);
  const leave = interpolate(frame, [Math.max(0, duration - 7), Math.max(1, duration)], [1, 0], clamp);
  const opacity = Math.min(enter, leave);
  const slide = interpolate(enter, [0, 1], [variant % 2 === 0 ? -42 : 42, 0], clamp);
  const isRight = variant === 2;
  const isCenter = variant === 3;

  return (
    <AbsoluteFill style={{fontFamily: 'Arial, Helvetica, sans-serif', color: IVORY, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: isRight ? 980 : isCenter ? 430 : 96,
          right: isRight ? 96 : undefined,
          top: isCenter ? 360 : variant === 1 ? 118 : 680,
          width: isCenter ? 1060 : isRight ? 840 : 900,
          opacity,
          transform: `translateX(${slide}px)`,
          textAlign: isCenter ? 'center' : isRight ? 'right' : 'left',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start', gap: 14, marginBottom: 14}}>
          <div style={{width: 54, height: 4, backgroundColor: accent}} />
          <div style={{fontSize: 20, fontWeight: 850, letterSpacing: 3.4, color: accent}}>{kicker}</div>
        </div>
        <div
          style={{
            display: 'inline-block',
            maxWidth: '100%',
            padding: variant === 3 ? '24px 36px' : '18px 26px',
            borderRadius: variant === 1 ? 6 : 24,
            background: variant === 1 ? 'rgba(7,16,20,.2)' : 'rgba(7,16,20,.72)',
            border: `1px solid ${accent}55`,
            fontSize: variant === 1 ? 70 : variant === 3 ? 62 : 54,
            lineHeight: 1.02,
            fontWeight: 820,
            letterSpacing: -1.6,
            boxShadow: '0 18px 55px rgba(0,0,0,.24)',
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 18,
          left: `${interpolate(frame, [0, 7], [-8, 108], clamp)}%`,
          opacity: interpolate(frame, [0, 3, 7, 10], [0, 0.8, 0.8, 0], clamp),
          background: accent,
          transform: 'skewX(-12deg)',
        }}
      />
    </AbsoluteFill>
  );
};

const FullMontage: React.FC<{window: MontageWindow}> = ({window}) => {
  const duration = frames(window.end - window.start);
  const count = Math.ceil(duration / MAX_SHOT_FRAMES);

  return (
    <AbsoluteFill style={{backgroundColor: INK}}>
      {Array.from({length: count}).map((_, index) => {
        const from = index * MAX_SHOT_FRAMES;
        const shotDuration = Math.min(MAX_SHOT_FRAMES, duration - from);
        const asset = window.media[index % window.media.length];
        const label = window.labels[index % window.labels.length];
        return (
          <Sequence key={`${window.start}-${index}-${asset.src}`} from={from} durationInFrames={shotDuration} premountFor={15}>
            <MediaShot asset={asset} index={index} duration={shotDuration} />
            <ShotTitle
              kicker={window.kicker}
              label={label}
              accent={window.accent ?? TEAL}
              variant={index % 4}
              duration={shotDuration}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const firstMinuteMedia: ComponentScene[] = [
  {
    start: 2.1,
    duration: 1.88,
    node: (
      <FedBeforeAfter kicker="La promesa imposible" title="No borra arrugas ni manchas" hot={['No', 'borra']} imageA={staticFile('img/vbb_fine_lines_window.png')} imageB={staticFile('img/vbb_spots_macro.png')} labelA="ARRUGA" labelB="MANCHA" accent={RED} mood="cool" />
    ),
  },
  {start: 3.98, duration: 1.74, node: <MediaShot asset={stock('vbb2dyn_cosmetic_shelf')} index={0} duration={52} />},
  {start: 5.72, duration: 1.48, node: <MediaShot asset={stock('vbb2dyn_cosmetic_shelf', 1.4)} index={1} duration={44} />},
  {start: 8.8, duration: 2.3, node: <MediaShot asset={image('vbb_rosemary_macro')} index={2} duration={69} />},
  {
    start: 11.1,
    duration: 2.5,
    node: (
      <FedMolecule kicker="El verdadero truco" title="Promesa o criterio" hot={['criterio']} sub="El valor está en usarlo con prudencia." centerLabel="Romero" image={staticFile('img/vbb_rosemary_macro.png')} nodes={[{label: 'Promesa'}, {label: 'Criterio'}]} accent={TEAL} mood="science" />
    ),
  },
  {
    start: 13.6,
    duration: 2.54,
    node: (
      <FedBeforeAfter kicker="Una promesa que no sirve" title="A los 80 no hay que parecer de 40" hot={['80', '40']} imageA={staticFile('img/vbb_dignified_eighty.png')} imageB={staticFile('img/vbb_dignified_eighty.png')} labelA="80" labelB="40" accent={GOLD} mood="gold" />
    ),
  },
  {
    start: 19.44,
    duration: 1.48,
    node: (
      <FedBeforeAfter kicker="Límite honesto" title="Puede mejorar la apariencia; no borrar la historia" hot={['Puede', 'no']} imageA={staticFile('img/vbb_fine_lines_window.png')} imageB={staticFile('img/vbb_mature_hands_history.png')} labelA="PUEDE" labelB="NO PUEDE" accent={TEAL} mood="warmdark" />
    ),
  },
  {start: 20.92, duration: 2.46, node: <MediaShot asset={stock('vbb_dyn_calm_skin')} index={3} duration={74} />},
  {
    start: 23.38,
    duration: 2.4,
    node: (
      <FedMolecule kicker="El riesgo" title="Irritación puede dejar más pigmento" hot={['más', 'pigmento']} sub="La piel inflamada puede oscurecer la marca." centerLabel="Irritación" image={staticFile('img/vbb_pigment_diagram.png')} nodes={[{label: 'Rojez'}, {label: 'Sensibilidad'}, {label: 'Pigmento'}]} accent={RED} mood="cool" />
    ),
  },
  {
    start: 28.76,
    duration: 2.78,
    node: <FedHero kicker="Quedate hasta el final" title="El error de la mezcla" hot={['error']} sub="Tres ingredientes de cocina pueden empeorar la mancha." image={staticFile('img/vbb_rosemary_lab.png')} accent={RED} mood="warmdark" side="right" framed />,
  },
  {start: 31.54, duration: 2.28, node: <MediaShot asset={stock('vbb_dyn_lemon', 2)} index={4} duration={68} />},
  {start: 35.58, duration: 2.72, node: <AbsoluteFill><MediaShot asset={stock('vbb_dyn_fine_lines')} index={5} duration={82} /><ShotTitle kicker="SEÑAL DE ALERTA" label="ARDOR" accent={RED} variant={1} duration={82} /></AbsoluteFill>},
  {
    start: 38.3,
    duration: 2.66,
    node: <FedQuote kicker="Regla de seguridad" quote="ARDOR ≠ FUNCIONA" author="Dr. Valler" role="La irritación es una advertencia" image={staticFile('img/vbb_pigment_diagram.png')} accent={RED} mood="cool" />,
  },
  {start: 43.62, duration: 3, node: <AbsoluteFill><MediaShot asset={stock('vbb_dyn_fine_lines', 1)} index={6} duration={90} /><ShotTitle kicker="LA CONSECUENCIA" label="ROJEZ + MANCHA" accent={RED} variant={2} duration={90} /></AbsoluteFill>},
  {start: 48.08, duration: 2.08, node: <MediaShot asset={stock('vbb2dyn_mature_mirror')} index={7} duration={62} />},
  {start: 50.16, duration: 2.6, node: <MediaShot asset={stock('vbb2dyn_mature_window')} index={8} duration={78} />},
  {start: 52.76, duration: 1.92, node: <MediaShot asset={stock('vbb2dyn_mature_mirror', 1.1)} index={9} duration={58} />},
  {
    start: 56.92,
    duration: 1.72,
    node: <FedStep step={1} total={4} title="Líneas finas" hot={['finas']} sub="Primero identificá qué estás viendo." image={staticFile('img/vbb_fine_lines_window.png')} accent={TEAL} mood="science" />,
  },
  {start: 58.64, duration: 1.36, node: <MediaShot asset={stock('vbb_dyn_fine_lines')} index={10} duration={41} />},
];

const MONTAGES: MontageWindow[] = [
  {start: 60, end: 76.8, kicker: 'MIRÁ LA DIFERENCIA', labels: ['Surco en reposo', 'Mancha plana', 'Lesión que cambia', 'No todo es “edad”'], media: [stock('vbb2dyn_relaxed_face'), stock('vbb2dyn_age_spots'), stock('vbb2dyn_dermoscope'), image('vbb_spots_macro')], accent: TEAL},
  {start: 78, end: 98, kicker: 'DOS RELOJES', labels: ['Tiempo biológico', 'Sol acumulado', 'Exposición ambiental', 'Tabaco', 'Sueño y rutina'], media: [image('vbb_two_clocks'), stock('vbb2dyn_sun_face'), image('vbb_mature_hands_history'), stock('vbb_dyn_smoking'), stock('vbb2dyn_sleep')], accent: GOLD},
  {start: 118, end: 146, kicker: 'ARRUGAS', labels: ['Línea por sequedad', 'Pliegue en reposo', 'Hidratar cambia el aspecto', 'No cambia la estructura', 'Las líneas también cuentan risas'], media: [stock('vbb_dyn_fine_lines'), stock('vbb2dyn_relaxed_face'), stock('vbb2dyn_moisturizer'), stock('vbb_dyn_calm_skin'), stock('vbb_dyn_laugh_lines')], accent: TEAL},
  {start: 146, end: 166, kicker: 'MANCHAS', labels: ['Pigmento acumulado', 'El sol puede intensificarlo', 'Protección diaria', 'Si cambia, se consulta'], media: [stock('vbb2dyn_age_spots'), stock('vbb2dyn_sun_face'), stock('vbb_stock_habit'), stock('vbb2dyn_dermoscope')], accent: GOLD},
  {start: 174, end: 208, kicker: 'LO QUE SÍ SABEMOS', labels: ['Romero real', 'Compuesto estudiado', 'Fórmula cosmética', 'Infusión casera', 'No son equivalentes'], media: [image('vbb_rosemary_macro'), image('vbb_rosemary_lab'), stock('vbb2dyn_lab_cosmetic'), stock('vbb_dyn_herbal_tea'), stock('vbb_dyn_dropper')], accent: TEAL},
  {start: 236, end: 254, kicker: 'ANTES Y DESPUÉS', labels: ['Misma luz', 'Mismo ángulo', 'Misma expresión', 'Sin filtros', 'La cámara también engaña'], media: [stock('vbb_dyn_phone_photo'), stock('vbb2dyn_mature_window'), stock('vbb2dyn_mature_mirror'), stock('vbb_stock_phone')], accent: GOLD},
  {start: 273, end: 299, kicker: 'ROSA Y ELENA', labels: ['Más fuerte no es mejor', 'La piel avisa', 'Rutina simple', 'Constancia', 'Protección'], media: [stock('vbb_dyn_lemon'), stock('vbb_dyn_fine_lines'), stock('vbb2dyn_morning'), stock('vbb_dyn_calm_skin'), stock('vbb_stock_habit')], accent: TEAL},
  {start: 318, end: 343, kicker: 'PREPARACIÓN PRUDENTE', labels: ['Una ramita', 'Agua caliente', 'Reposo breve', 'Colar', 'Dejar enfriar'], media: [image('vbb2_wash_sprig'), stock('vbb2dyn_kettle'), stock('vbb_dyn_herbal_tea'), stock('vbb2dyn_strainer'), image('vbb_rosemary_macro')], accent: GOLD},
  {start: 344, end: 365, kicker: 'NO CONCENTRES', labels: ['Más fuerte irrita más', 'Infusión no es aceite', 'Nada de alcohol', 'Nada de perfumes', 'No improvises'], media: [stock('vbb_dyn_dropper'), image('vbb_rosemary_lab'), stock('vbb2dyn_lab_cosmetic'), stock('vbb_dyn_lemon')], accent: RED},
  {start: 373, end: 388, kicker: 'HIGIENE', labels: ['Prepará poco', 'Recipiente limpio', 'Usalo fresco', 'Descartá lo viejo'], media: [stock('vbb2dyn_kettle'), stock('vbb2dyn_strainer'), image('vbb2_wash_sprig'), image('vbb_rosemary_macro')], accent: TEAL},
  {start: 397, end: 417, kicker: 'PRUEBA DE PARCHE', labels: ['Antebrazo intacto', 'Zona pequeña', 'Esperá la reacción', 'Si molesta: suspendé'], media: [stock('va_three_drops'), image('vbb_mature_hands_history'), stock('vbb_dyn_fine_lines'), stock('vbb_dyn_dropper')], accent: GOLD},
  {start: 428, end: 450, kicker: 'CONTACTO BREVE', labels: ['Gasa limpia', 'Poca cantidad', 'Dos o tres minutos', 'Sin frotar', 'Enjuague suave'], media: [image('vbb_fine_lines_window'), stock('vbb2dyn_face_wash'), stock('vbb2dyn_moisturizer'), stock('vbb_dyn_calm_skin')], accent: TEAL},
  {start: 455, end: 481, kicker: 'EL PASO DECISIVO', labels: ['Protector diario', 'Amplio espectro', 'SPF 30 o más', 'Cantidad suficiente', 'Reaplicá al aire libre'], media: [stock('vbb_stock_habit'), stock('vbb2dyn_sun_face'), stock('vbb2dyn_age_spots'), stock('vbb2dyn_hat')], accent: GOLD},
  {start: 486, end: 504, kicker: 'AFUERA DE CASA', labels: ['Buscá sombra', 'Sombrero de ala', 'Protegé el rostro', 'Reaplicá'], media: [stock('vbb2dyn_hat'), stock('vbb_stock_dignity'), stock('vbb2dyn_hat', 1), stock('vbb_stock_habit')], accent: GOLD},
  {start: 509, end: 529, kicker: 'CUATRO PILARES', labels: ['Limpieza suave', 'Hidratación', 'Protección solar', 'Un activo a la vez'], media: [stock('vbb2dyn_face_wash'), stock('vbb2dyn_moisturizer'), stock('vbb_stock_habit'), stock('vbb_dyn_dropper')], accent: TEAL},
  {start: 533, end: 560, kicker: 'RUTINA SIMPLE', labels: ['Mañana', 'Limpiar', 'Hidratar', 'Proteger', 'Noche', 'Sin mezclar novedades'], media: [stock('vbb2dyn_morning'), stock('vbb2dyn_face_wash'), stock('vbb2dyn_moisturizer'), stock('vbb_stock_habit'), stock('vbb_stock_habit', 1.2)], accent: GOLD},
  {start: 563, end: 588, kicker: 'TREINTA DÍAS', labels: ['Semana 1: tolerancia', 'Semana 2: comodidad', 'Semana 3: constancia', 'Semana 4: fotos comparables'], media: [stock('vbb_dyn_phone_photo'), stock('vbb_dyn_calm_skin'), stock('vbb2dyn_morning'), stock('vbb_stock_phone')], accent: GOLD},
  {start: 598, end: 621, kicker: 'SEIS A OCHO SEMANAS', labels: ['No aumentes concentración', 'Revisá el diagnóstico', 'Una sola novedad', 'Consultá opciones'], media: [stock('vbb_dyn_phone_photo'), stock('vbb_dyn_dropper'), stock('vbb_stock_habit'), stock('vbb2dyn_dermoscope')], accent: TEAL},
  {start: 631, end: 656, kicker: 'CUÁNDO CONSULTAR', labels: ['Cambia de forma', 'Bordes irregulares', 'Sangra o no cicatriza', 'Duele o pica', 'Que lo vea un profesional'], media: [stock('vbb2dyn_age_spots'), stock('vbb2dyn_dermoscope'), image('vbb_spots_macro'), image('vbb_dignified_eighty')], accent: RED},
  {start: 660, end: 682, kicker: 'PIEL REACTIVA', labels: ['Rosácea o eczema activo', 'Heridas', 'Quemadura solar', 'Alergia a fragancias', 'Primero calmá la barrera'], media: [stock('vbb_dyn_fine_lines'), stock('vbb_dyn_dropper'), stock('vbb2dyn_sun_face'), stock('vbb_dyn_calm_skin')], accent: RED},
  {start: 686, end: 709, kicker: 'NO ES LO MISMO', labels: ['Infusión acuosa', 'Aceite esencial', 'Concentraciones distintas', 'No se aplica puro'], media: [stock('vbb_dyn_herbal_tea'), stock('vbb_dyn_dropper'), image('vbb_rosemary_lab'), stock('vbb2dyn_lab_cosmetic')], accent: RED},
  {start: 713, end: 741, kicker: 'EL ERROR PELIGROSO', labels: ['Romero', 'Limón', 'Bicarbonato', 'No los mezcles', 'Luz + cítrico', 'Fricción + irritación'], media: [image('vbb_rosemary_macro'), stock('vbb_dyn_lemon'), image('vbb_pigment_diagram'), stock('vbb_dyn_lemon', 2), stock('vbb2dyn_sun_face'), image('vbb_mature_hands_history')], accent: RED},
  {start: 763, end: 791, kicker: 'CUANDO ARDE', labels: ['La piel avisa', 'Suspendé', 'Enjuagá', 'No salgas al sol', 'Recuperá la barrera'], media: [stock('vbb_dyn_fine_lines'), stock('vbb_dyn_dropper'), stock('vbb2dyn_face_wash'), stock('vbb2dyn_sun_face'), stock('vbb_dyn_calm_skin')], accent: RED},
  {start: 797, end: 818, kicker: 'RECUPERACIÓN', labels: ['Agua', 'Rutina mínima', 'Hidratación', 'Tiempo', 'Sin experimentar'], media: [stock('vbb2dyn_face_wash'), stock('vbb2dyn_moisturizer'), stock('vbb_dyn_calm_skin'), stock('vbb_stock_habit'), stock('vbb_dyn_dropper')], accent: TEAL},
  {start: 824, end: 846, kicker: 'EL VERDADERO TRUCO', labels: ['Evitar irritaciones', 'Hidratar', 'Proteger del sol', 'Consultar cambios', 'Sostener el hábito'], media: [stock('vbb_dyn_calm_skin'), stock('vbb2dyn_moisturizer'), stock('vbb_stock_habit'), stock('vbb2dyn_dermoscope'), stock('vbb2dyn_morning')], accent: GOLD},
  {start: 849, end: 875, kicker: 'A CUALQUIER EDAD', labels: ['No hay que borrar la historia', 'Una piel real', 'Líneas de risa', 'Años vividos', 'Dignidad'], media: [stock('vbb_stock_dignity'), stock('vbb_dyn_laugh_lines'), image('vbb_mature_hands_history'), stock('vbb2dyn_hat'), stock('vbb_stock_dignity', 1.2)], accent: GOLD},
  {start: 878, end: 898, kicker: 'UNA PROMESA HONESTA', labels: ['Menos tirantez', 'Más comodidad', 'Aspecto descansado', 'Protección constante'], media: [stock('vbb2dyn_face_wash'), stock('vbb2dyn_moisturizer'), stock('vbb_dyn_calm_skin'), stock('vbb_stock_habit')], accent: GOLD},
  {start: 904, end: 923.2, kicker: 'QUEDATE CON ESTO', labels: ['Mañana y noche', 'Productos simples', 'Nada que queme', 'El hábito es el héroe', 'Romero: complemento'], media: [stock('vbb2dyn_morning'), stock('vbb_stock_habit'), stock('vbb_dyn_dropper'), stock('vbb_dyn_laugh_lines'), image('vbb_rosemary_macro')], accent: GOLD},
];

const SUPPORT_COMPONENTS: ComponentScene[] = [
  {start: 72, duration: 2.7, node: <FedChecklist kicker="Frente al espejo" title="Diferenciá lo que ves" hot={['Diferenciá']} items={['Líneas finas', 'Surcos', 'Manchas', 'Lesión nueva']} accent={TEAL} mood="warmdark" />},
  {start: 109, duration: 2.8, node: <FedQuote kicker="Principio de cuidado" quote="Proteger lo que ya tenés vale más que perseguir una transformación imposible." author="Dr. Valler" role="Cuidado de piel madura" image={staticFile('img/vbb_dignified_eighty.png')} accent={GOLD} mood="warmdark" />},
  {start: 116, duration: 2.6, node: <FedBeforeAfter kicker="No son lo mismo" title="Arruga ≠ mancha" hot={['Arruga', 'mancha']} imageA={staticFile('img/vbb_fine_lines_window.png')} imageB={staticFile('img/vbb_spots_macro.png')} labelA="TEXTURA" labelB="PIGMENTO" accent={GOLD} mood="cool" />},
  {start: 190, duration: 2.8, node: <FedMolecule kicker="Tres contextos" title="La evidencia no se traslada sola" hot={['evidencia']} sub="Compuesto, fórmula e infusión son cosas distintas." centerLabel="Romero" image={staticFile('img/vbb_rosemary_lab.png')} nodes={[{label: 'Compuesto'}, {label: 'Fórmula'}, {label: 'Infusión'}]} accent={TEAL} mood="science" />},
  {start: 209, duration: 2.8, node: <FedHero kicker="Lo que importa" title="Forma de uso" hot={['uso']} sub="Concentración, tolerancia y constancia." image={staticFile('img/vbb_rosemary_lab.png')} accent={TEAL} mood="science" side="left" framed />},
  {start: 238, duration: 2.8, node: <FedBeforeAfter kicker="La cámara también cambia" title="Luz suave ≠ luz dura" hot={['Luz']} imageA={staticFile('img/vbb_dignified_eighty.png')} imageB={staticFile('img/vbb_dignified_eighty.png')} labelA="SUAVE" labelB="DURA" accent={GOLD} mood="cool" />},
  {start: 300, duration: 2.8, node: <FedChapter kicker="Método casero prudente" index="02" title="Prepará poco y simple" sub="Sin concentrar ni improvisar" accent={GOLD} mood="gold" />},
  {start: 326, duration: 2.8, node: <FedChecklist kicker="Preparación prudente" title="Cuatro pasos" hot={['pasos']} items={['Una ramita', 'Agua caliente', 'Reposar', 'Colar y enfriar']} accent={GOLD} mood="gold" />},
  {start: 357, duration: 2.8, node: <FedChecklist kicker="No agregues nada" title="Sin mezclas" hot={['Sin']} items={['Sin aceite esencial', 'Sin alcohol', 'Sin limón', 'Sin bicarbonato']} accent={RED} mood="cool" />},
  {start: 373, duration: 2.7, node: <FedStep step={1} total={1} title="Usalo fresco" hot={['fresco']} sub="Prepará poca cantidad y descartá lo que sobre." image={staticFile('img/vbb2_wash_sprig.png')} accent={TEAL} mood="warmdark" />},
  {start: 397, duration: 2.8, node: <FedStep step={1} total={2} title="Prueba de parche" hot={['parche']} sub="Antes del rostro: una zona pequeña del antebrazo." image={staticFile('img/vbb_mature_hands_history.png')} accent={GOLD} mood="science" />},
  {start: 428, duration: 2.8, node: <FedStep step={2} total={2} title="Contacto breve" hot={['breve']} sub="Poca cantidad, gasa limpia y sin frotar." image={staticFile('img/vbb_fine_lines_window.png')} accent={TEAL} mood="warmdark" />},
  {start: 466, duration: 2.8, node: <FedHero kicker="El paso decisivo" title="Protección solar diaria" hot={['solar']} sub="Amplio espectro, SPF 30 o más." image={staticFile('img/vbb_spots_macro.png')} accent={GOLD} mood="gold" side="right" framed />},
  {start: 507, duration: 2.8, node: <FedMolecule kicker="Rutina sostenible" title="Cuatro pilares" hot={['pilares']} sub="No hace falta castigar la piel." centerLabel="Rutina" image={staticFile('img/vbb_dignified_eighty.png')} nodes={[{label: 'Limpiar'}, {label: 'Hidratar'}, {label: 'Proteger'}, {label: 'Tratar'}]} accent={GOLD} mood="warmdark" />},
  {start: 563, duration: 2.8, node: <FedChecklist kicker="Seguimiento realista" title="Treinta días" hot={['días']} items={['Tolerancia', 'Comodidad', 'Constancia', 'Fotos comparables']} accent={GOLD} mood="gold" />},
  {start: 598, duration: 2.8, node: <FedChecklist kicker="Si no mejora" title="Seis a ocho semanas" hot={['semanas']} items={['No concentres', 'Revisá diagnóstico', 'Una novedad', 'Consultá']} accent={TEAL} mood="science" />},
  {start: 637, duration: 2.8, node: <FedChecklist kicker="Señales de alarma" title="No lo trates en casa" hot={['casa']} items={['Cambia', 'Crece', 'Sangra', 'Duele o pica']} accent={RED} mood="cool" />},
  {start: 660, duration: 2.8, node: <FedChapter kicker="Piel reactiva" index="03" title="Durante un brote: no" sub="Primero recuperá la calma de la barrera" accent={RED} mood="cool" />},
  {start: 686, duration: 2.8, node: <FedBeforeAfter kicker="Concentraciones distintas" title="Infusión ≠ aceite esencial" hot={['Infusión', 'aceite']} imageA={staticFile('img/vbb_rosemary_lab.png')} imageB={staticFile('img/vbb_rosemary_macro.png')} labelA="INFUSIÓN" labelB="ACEITE" accent={RED} mood="science" />},
  {start: 713, duration: 2.8, node: <FedHero kicker="La suma falsa" title="Romero + limón + bicarbonato" hot={['limón', 'bicarbonato']} sub="Puede inflamar y oscurecer la marca." image={staticFile('img/vbb_rosemary_lab.png')} accent={RED} mood="cool" side="left" framed />},
  {start: 743, duration: 2.8, node: <FedQuote kicker="La piel no tiene que arder" quote="IRRITACIÓN ≠ EFICACIA" author="Dr. Valler" role="Si molesta, suspendé" image={staticFile('img/vbb_pigment_diagram.png')} accent={RED} mood="cool" />},
  {start: 797, duration: 2.8, node: <FedStep step={1} total={3} title="Si arde, pará" hot={['pará']} sub="Retirá, enjuagá y volvé a una rutina simple." image={staticFile('img/vbb_fine_lines_window.png')} accent={RED} mood="cool" />},
  {start: 824, duration: 2.8, node: <FedHero kicker="Criterio antes que curiosidad" title="El verdadero truco" hot={['truco']} sub="Una rutina que puedas sostener sin lastimarte." image={staticFile('img/vbb_rosemary_macro.png')} accent={GOLD} mood="gold" side="right" framed />},
  {start: 878, duration: 2.8, node: <FedChecklist kicker="Una promesa honesta" title="Un mes de hábitos" hot={['hábitos']} items={['Limpieza suave', 'Hidratación', 'Protector diario', 'Nada que queme']} accent={GOLD} mood="gold" />},
  {start: 910, duration: 2.8, node: <FedCta kicker="Tu próximo paso" title="¿Querés una rutina simple?" hot={['rutina']} sub="Escribí ROMERO en los comentarios." buttonLabel="ESCRIBÍ ROMERO" image={staticFile('img/vbb_rosemary_macro.png')} accent={GOLD} mood="gold" />},
];

export const MainVbb0rdkrfduo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: INK}}>
      <AvatarBase />
      <Audio src={staticFile('sfx/music_federer.mp3')} volume={0.028} loop />

      {MONTAGES.map((window) => (
        <Sequence key={`${window.start}-${window.kicker}`} from={frames(window.start)} durationInFrames={frames(window.end - window.start)} premountFor={FPS}>
          <FullMontage window={window} />
        </Sequence>
      ))}

      {firstMinuteMedia.map((scene, index) => (
        <Sequence key={`first-${index}-${scene.start}`} from={frames(scene.start)} durationInFrames={Math.min(90, frames(scene.duration))} premountFor={FPS}>
          {scene.node}
        </Sequence>
      ))}

      {SUPPORT_COMPONENTS.map((scene, index) => (
        <Sequence key={`support-${index}-${scene.start}`} from={frames(scene.start)} durationInFrames={Math.min(90, frames(scene.duration))} premountFor={FPS}>
          {scene.node}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
