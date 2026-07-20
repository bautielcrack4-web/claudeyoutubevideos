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
  FedChapter,
  FedChecklist,
  FedCta,
  FedMolecule,
  FedQuote,
  FedStep,
} from '../FedererKit';

export const TOTAL_FRAMES_VBB0RDKRFDUO = 27699;

const FPS = 30;
const SHOT_FRAMES = 78;
const IVORY = '#F4EFE4';
const TEAL = '#88B9A7';
const GOLD = '#C7A35C';
const RED = '#C96857';

type MediaAsset = {
  src: string;
  type: 'image' | 'video';
};

type VisualWindow = {
  start: number;
  duration: number;
  kicker: string;
  title: string;
  accent?: string;
  media: MediaAsset[];
};

const image = (name: string): MediaAsset => ({src: `img/${name}.png`, type: 'image'});
const video = (name: string): MediaAsset => ({src: `broll/${name}.mp4`, type: 'video'});
const frames = (seconds: number) => Math.round(seconds * FPS);

const DIRECTOR_WINDOWS: VisualWindow[] = [
  {
    start: 0,
    duration: 13,
    kicker: 'ROMERO Y PIEL MADURA',
    title: '¿Milagro o herramienta?',
    media: [image('vbb_rosemary_macro'), image('vbb_fine_lines_window'), image('vbb_spots_macro'), image('vbb_dignified_eighty')],
  },
  {
    start: 26,
    duration: 15,
    kicker: 'PRIMERA ADVERTENCIA',
    title: 'Natural no significa inocuo',
    accent: RED,
    media: [image('vbb_rosemary_lab'), image('vbb_pigment_diagram'), image('vbb_fine_lines_window'), image('vbb_rosemary_macro')],
  },
  {
    start: 47,
    duration: 14,
    kicker: 'ANTES DE ELEGIR UN REMEDIO',
    title: 'Mirá qué cambió de verdad',
    media: [image('vbb_dignified_eighty'), image('vbb_fine_lines_window'), image('vbb_spots_macro'), video('vbb_stock_phone')],
  },
  {
    start: 63,
    duration: 12,
    kicker: 'NO TODO ES LO MISMO',
    title: 'Sequedad, textura o pigmento',
    media: [image('vbb_fine_lines_window'), image('vbb_spots_macro'), image('vbb_pigment_diagram')],
  },
  {
    start: 78,
    duration: 20,
    kicker: 'DOS RELOJES',
    title: 'Edad biológica y exposición acumulada',
    media: [image('vbb_two_clocks'), image('vbb_mature_hands_history'), image('vbb_fine_lines_window'), image('vbb_spots_macro')],
  },
  {
    start: 118,
    duration: 28,
    kicker: 'ARRUGAS',
    title: 'Una línea fina no es una arruga profunda',
    media: [image('vbb_fine_lines_window'), image('vbb_mature_hands_history')],
  },
  {
    start: 146,
    duration: 20,
    kicker: 'MANCHAS',
    title: 'El pigmento exige paciencia y protección',
    media: [image('vbb_spots_macro'), image('vbb_pigment_diagram'), image('vbb_dignified_eighty')],
  },
  {
    start: 174,
    duration: 34,
    kicker: 'LO QUE SÍ SABEMOS',
    title: 'El romero no borra décadas en una noche',
    media: [image('vbb_rosemary_lab'), image('vbb_rosemary_macro'), image('vbb2_wash_sprig')],
  },
  {
    start: 236,
    duration: 18,
    kicker: 'CUIDADO CON LA IMAGEN',
    title: 'Un “antes y después” también puede mentir',
    accent: RED,
    media: [video('vbb_stock_phone'), image('vbb_fine_lines_window'), image('vbb_dignified_eighty')],
  },
  {
    start: 273,
    duration: 26,
    kicker: 'ROSA Y ELENA',
    title: 'La intensidad no gana: gana la constancia',
    media: [image('vbb_rosemary_lab'), video('vbb_stock_habit'), image('vbb_dignified_eighty')],
  },
  {
    start: 318,
    duration: 25,
    kicker: 'PREPARACIÓN PRUDENTE',
    title: 'Una ramita. Agua caliente. Nada más.',
    media: [image('vbb2_wash_sprig'), image('vbb_rosemary_macro'), image('vbb_rosemary_lab')],
  },
  {
    start: 344,
    duration: 21,
    kicker: 'NO LO CONCENTRES',
    title: 'Más fuerte no significa más eficaz',
    accent: RED,
    media: [image('vbb_rosemary_lab'), image('vbb_rosemary_macro'), image('vbb2_wash_sprig')],
  },
  {
    start: 373,
    duration: 15,
    kicker: 'HIGIENE',
    title: 'Prepará poco y usalo fresco',
    media: [image('vbb2_wash_sprig'), image('vbb_rosemary_macro'), image('vbb_rosemary_lab')],
  },
  {
    start: 397,
    duration: 20,
    kicker: 'ANTES DEL ROSTRO',
    title: 'Primero, prueba de parche',
    media: [image('vbb_fine_lines_window'), image('vbb_mature_hands_history'), image('vbb_dignified_eighty')],
  },
  {
    start: 428,
    duration: 22,
    kicker: 'APLICACIÓN',
    title: 'Poca cantidad y contacto breve',
    media: [image('vbb_fine_lines_window'), image('vbb_mature_hands_history'), image('vbb_rosemary_macro')],
  },
  {
    start: 455,
    duration: 26,
    kicker: 'EL PASO QUE MÁS PROTEGE',
    title: 'Protector solar, todos los días',
    accent: GOLD,
    media: [image('vbb_spots_macro'), image('vbb_pigment_diagram'), video('vbb_stock_habit'), image('vbb_dignified_eighty')],
  },
  {
    start: 486,
    duration: 18,
    kicker: 'AFUERA DE CASA',
    title: 'Sombra, sombrero y reaplicación',
    media: [image('vbb_spots_macro'), image('vbb_dignified_eighty'), video('vbb_stock_dignity')],
  },
  {
    start: 509,
    duration: 20,
    kicker: 'CUATRO PILARES',
    title: 'Limpiar · hidratar · proteger · tratar',
    media: [video('vbb_stock_habit'), image('vbb_fine_lines_window'), image('vbb_spots_macro'), image('vbb_dignified_eighty')],
  },
  {
    start: 533,
    duration: 27,
    kicker: 'RUTINA SIMPLE',
    title: 'Mañana y noche, sin castigar la piel',
    media: [video('vbb_stock_habit'), image('vbb_fine_lines_window'), image('vbb_dignified_eighty')],
  },
  {
    start: 563,
    duration: 25,
    kicker: 'TREINTA DÍAS',
    title: 'Medí comodidad, no milagros',
    media: [image('vbb_two_clocks'), video('vbb_stock_habit'), image('vbb_fine_lines_window'), image('vbb_mature_hands_history')],
  },
  {
    start: 598,
    duration: 23,
    kicker: 'SEIS A OCHO SEMANAS',
    title: 'Revisá con la misma luz y el mismo ángulo',
    media: [image('vbb_dignified_eighty'), image('vbb_fine_lines_window'), image('vbb_spots_macro'), video('vbb_stock_habit')],
  },
  {
    start: 631,
    duration: 25,
    kicker: 'NO TODO ES COSMÉTICO',
    title: 'Si una lesión cambia, consultá',
    accent: RED,
    media: [image('vbb_mature_hands_history'), image('vbb_dignified_eighty'), video('vbb_stock_dignity')],
  },
  {
    start: 660,
    duration: 22,
    kicker: 'PIEL REACTIVA',
    title: 'Menos ingredientes, más control',
    media: [image('vbb_fine_lines_window'), image('vbb_pigment_diagram'), image('vbb_dignified_eighty')],
  },
  {
    start: 686,
    duration: 23,
    kicker: 'NO ES LO MISMO',
    title: 'Infusión acuosa ≠ aceite esencial',
    accent: RED,
    media: [image('vbb_rosemary_lab'), image('vbb_rosemary_macro'), image('vbb2_wash_sprig')],
  },
  {
    start: 713,
    duration: 28,
    kicker: 'EL ERROR MÁS PELIGROSO',
    title: 'Limón y bicarbonato pueden irritar',
    accent: RED,
    media: [image('vbb_rosemary_lab'), image('vbb_pigment_diagram'), image('vbb_fine_lines_window'), image('vbb_spots_macro')],
  },
  {
    start: 763,
    duration: 28,
    kicker: 'CUANDO ARDE',
    title: 'Suspendé. Enjuagá. Recuperá la barrera.',
    accent: RED,
    media: [image('vbb_pigment_diagram'), image('vbb_fine_lines_window'), image('vbb_mature_hands_history')],
  },
  {
    start: 797,
    duration: 21,
    kicker: 'RECUPERACIÓN',
    title: 'La irritación no es una prueba de eficacia',
    media: [video('vbb_stock_habit'), image('vbb_fine_lines_window'), image('vbb_dignified_eighty')],
  },
  {
    start: 824,
    duration: 22,
    kicker: 'EL VERDADERO TRUCO',
    title: 'Una rutina que puedas sostener',
    accent: GOLD,
    media: [video('vbb_stock_habit'), image('vbb_dignified_eighty'), image('vbb_rosemary_macro')],
  },
  {
    start: 849,
    duration: 26,
    kicker: 'A CUALQUIER EDAD',
    title: 'Cuidar no significa borrar tu historia',
    accent: GOLD,
    media: [video('vbb_stock_dignity'), image('vbb_dignified_eighty'), image('vbb_mature_hands_history')],
  },
  {
    start: 878,
    duration: 20,
    kicker: 'UNA PROMESA HONESTA',
    title: 'Más confort. Más protección. Menos daño.',
    accent: GOLD,
    media: [image('vbb_dignified_eighty'), video('vbb_stock_habit'), image('vbb_rosemary_macro'), video('vbb_stock_dignity')],
  },
  {
    start: 904,
    duration: 19.3,
    kicker: 'QUEDATE CON ESTO',
    title: 'El hábito es el héroe. El romero, un complemento.',
    accent: GOLD,
    media: [image('vbb_dignified_eighty'), video('vbb_stock_habit'), image('vbb_rosemary_macro'), video('vbb_stock_dignity')],
  },
];

const WINDOWS: VisualWindow[] = DIRECTOR_WINDOWS
  .filter(({start}) => [0, 78, 118, 146, 174, 318, 455, 849].includes(start))
  .map((window) => {
    if (window.start === 118) {
      return {...window, media: [image('vbb_fine_lines_window'), image('vbb_spots_macro')]};
    }
    if (window.start === 146) {
      return {...window, media: [image('vbb_spots_macro'), image('vbb_pigment_diagram')]};
    }
    if (window.start === 174) {
      return {...window, duration: 16, media: [image('vbb_rosemary_lab'), image('vbb_rosemary_macro')]};
    }
    if (window.start === 318) {
      return {...window, duration: 8, media: [image('vbb2_wash_sprig')]};
    }
    if (window.start === 455) {
      return {
        ...window,
        duration: 11,
        kicker: 'EL SOL PUEDE INTENSIFICARLAS',
        title: 'La protección cambia el resultado',
        media: [image('vbb_spots_macro'), image('vbb_pigment_diagram')],
      };
    }
    return window;
  });

const MediaShot: React.FC<{asset: MediaAsset; index: number}> = ({asset, index}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, SHOT_FRAMES], [1.015, 1.075], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = index % 2 === 0 ? 0.8 : -0.8;

  return (
    <AbsoluteFill style={{backgroundColor: '#071014', overflow: 'hidden'}}>
      {asset.type === 'video' ? (
        <OffthreadVideo
          src={staticFile(asset.src)}
          muted
          startFrom={(index % 4) * 21}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${drift}) translateX(${x}%)`,
          }}
        />
      ) : (
        <Img
          src={staticFile(asset.src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${drift}) translateX(${x}%)`,
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(90deg, rgba(4,10,12,0.78) 0%, rgba(4,10,12,0.22) 48%, rgba(4,10,12,0.04) 74%)',
        }}
      />
    </AbsoluteFill>
  );
};

const EditorialTitle: React.FC<{kicker: string; title: string; accent: string}> = ({kicker, title, accent}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, 72, 88], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = interpolate(frame, [0, 20], [-34, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 102,
        top: 106,
        width: 820,
        opacity,
        transform: `translateX(${x}px)`,
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: IVORY,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18}}>
        <div style={{width: 62, height: 4, backgroundColor: accent}} />
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 4, color: accent}}>{kicker}</div>
      </div>
      <div style={{fontSize: 68, lineHeight: 1.02, fontWeight: 760, letterSpacing: -2.4, textShadow: '0 3px 22px rgba(0,0,0,0.75)'}}>
        {title}
      </div>
    </div>
  );
};

const FullVisual: React.FC<{window: VisualWindow}> = ({window}) => {
  const duration = frames(window.duration);
  const count = Math.ceil(duration / SHOT_FRAMES);

  return (
    <AbsoluteFill style={{backgroundColor: '#071014'}}>
      {Array.from({length: count}).map((_, index) => {
        const from = index * SHOT_FRAMES;
        const shotDuration = Math.min(SHOT_FRAMES, duration - from);
        const asset = window.media[index % window.media.length];
        return (
          <Sequence key={`${asset.src}-${index}`} from={from} durationInFrames={shotDuration} premountFor={15}>
            <MediaShot asset={asset} index={index} />
          </Sequence>
        );
      })}
      <EditorialTitle kicker={window.kicker} title={window.title} accent={window.accent ?? TEAL} />
    </AbsoluteFill>
  );
};

const AvatarBase: React.FC = () => {
  const frame = useCurrentFrame();
  const cycle = frame % frames(42);
  const scale = interpolate(cycle, [0, frames(42)], [1.006, 1.035], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const drift = Math.sin(frame / 225) * 0.35;

  return (
    <AbsoluteFill style={{backgroundColor: '#071014', overflow: 'hidden'}}>
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

const DIRECTOR_COMPONENT_SCENES = [
  {
    start: 17,
    node: (
      <FedChapter
        kicker="La verdad, sin milagros"
        index="01"
        title="Qué puede hacer el romero"
        sub="Y qué conviene no prometer"
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
  {
    start: 109,
    node: (
      <FedQuote
        kicker="Principio de cuidado"
        quote="Proteger lo que ya tenés vale más que perseguir una transformación imposible."
        author="Dr. Valler"
        role="Consejo para piel madura"
        accent={GOLD}
        mood="warmdark"
      />
    ),
  },
  {
    start: 209,
    node: (
      <FedMolecule
        kicker="Romero sobre la piel"
        title="Interesa la forma de uso"
        hot={['forma', 'uso']}
        sub="La concentración, la tolerancia y la rutina importan más que una promesa aislada."
        centerLabel="Romero"
        image={staticFile('img/vbb_rosemary_lab.png')}
        nodes={[{label: 'Concentración'}, {label: 'Tolerancia'}, {label: 'Constancia'}]}
        accent={TEAL}
        mood="science"
      />
    ),
  },
  {
    start: 300,
    node: (
      <FedChapter
        kicker="Método casero prudente"
        index="02"
        title="Prepará poco y simple"
        sub="Sin mezclar, concentrar ni improvisar"
        accent={GOLD}
        mood="gold"
      />
    ),
  },
  {
    start: 388,
    node: (
      <FedStep
        step={1}
        total={1}
        title="Usalo fresco"
        hot={['fresco']}
        sub="Prepará poca cantidad y descartala si cambia de olor, color o aspecto."
        image={staticFile('img/vbb2_wash_sprig.png')}
        accent={TEAL}
        mood="warmdark"
      />
    ),
  },
  {
    start: 622,
    node: (
      <FedChecklist
        kicker="Cuándo consultar"
        title="No lo trates en casa"
        hot={['casa']}
        items={['Cambia de forma o color', 'Sangra o no cicatriza', 'Pica de manera persistente', 'Te genera una duda real']}
        accent={RED}
        mood="cool"
      />
    ),
  },
  {
    start: 743,
    node: (
      <FedChapter
        kicker="La piel no tiene que arder"
        index="03"
        title="Irritación no es eficacia"
        sub="Si molesta, suspendé y recuperá la barrera"
        accent={RED}
        mood="cool"
      />
    ),
  },
  {
    start: 898.5,
    node: (
      <FedCta
        kicker="Cuidado real"
        title="Protegé tu piel todos los días"
        hot={['Protegé']}
        sub="El hábito es el héroe. El romero puede ser un complemento."
        buttonLabel="Suscribite para más consejos"
        image={staticFile('img/vbb_rosemary_macro.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
];

const checklistScene = (
  start: number,
  kicker: string,
  title: string,
  items: string[],
  accent: string = TEAL,
): {start: number; node: React.ReactNode} => ({
  start,
  node: (
    <FedChecklist
      kicker={kicker}
      title={title}
      hot={title.split(' ').slice(-1)}
      items={items}
      accent={accent}
      mood={accent === RED ? 'cool' : 'warmdark'}
    />
  ),
});

const COMPONENT_SCENES: {start: number; node: React.ReactNode}[] = [
  ...DIRECTOR_COMPONENT_SCENES.filter(({start}) => [17, 109, 209].includes(start)),
  checklistScene(72, 'Frente al espejo', 'Diferenciá lo que ves', [
    'Líneas finas por sequedad',
    'Surcos visibles en reposo',
    'Mancha estable',
    'Lesión nueva o cambiante',
  ]),
  checklistScene(116, 'No son lo mismo', 'Arruga ≠ mancha', [
    'Textura superficial',
    'Pliegue profundo',
    'Cambio de pigmento',
    'Lesión que requiere evaluación',
  ], GOLD),
  checklistScene(190, 'Tres contextos distintos', 'No confundas evidencia', [
    'Compuesto bajo estudio',
    'Fórmula cosmética estable',
    'Infusión preparada en casa',
    'Resultados no equivalentes',
  ]),
  checklistScene(238, 'Antes y después', 'La cámara también cambia', [
    'Luz',
    'Ángulo',
    'Expresión',
    'Distancia',
  ], GOLD),
  checklistScene(326, 'Preparación prudente', 'Simple y medible', [
    '1 ramita o 1 cucharadita',
    '1 taza de agua caliente',
    'Reposar 10 minutos',
    'Colar y dejar enfriar',
  ], GOLD),
  checklistScene(357, 'No la conviertas en una mezcla', 'No agregues nada más', [
    'Sin aceite esencial',
    'Sin alcohol ni perfume',
    'Sin limón ni vinagre',
    'Sin bicarbonato ni agua oxigenada',
  ], RED),
  checklistScene(373, 'Higiene doméstica', 'Usala fresca', [
    'Prepará poca cantidad',
    'Recipiente limpio',
    'No la guardes varios días',
    'Descartá lo que sobre',
  ]),
  checklistScene(397, 'Antes de acercarla al rostro', 'Prueba de parche', [
    'Zona pequeña del antebrazo',
    'Piel intacta',
    'Observá la reacción',
    'Suspendé si molesta',
  ], GOLD),
  checklistScene(428, 'Si la piel la tolera', 'Contacto breve y suave', [
    'Gasa limpia',
    'Zona pequeña',
    'Dos o tres minutos',
    'Sin frotar',
  ]),
  checklistScene(466, 'El paso decisivo', 'Protección solar diaria', [
    'Amplio espectro',
    'SPF 30 o más',
    'Cantidad suficiente',
    'Reaplicá al aire libre',
  ], GOLD),
  checklistScene(507, 'Rutina sostenible', 'Cuatro pilares', [
    'Limpieza suave',
    'Hidratación',
    'Protección solar',
    'Un activo a la vez',
  ], GOLD),
  checklistScene(533, 'Cada mañana', 'Tres pasos bastan', [
    'Limpiá con suavidad',
    'Hidratá si lo necesitás',
    'Protector solar',
    'Sin mezclar novedades',
  ]),
  checklistScene(563, 'Seguimiento realista', 'Treinta días', [
    'Semana 1: tolerancia',
    'Semana 2: comodidad',
    'Semana 3: constancia',
    'Semana 4: fotos comparables',
  ], GOLD),
  checklistScene(598, 'Si no ves mejoría', 'Seis a ocho semanas', [
    'No aumentes la concentración',
    'Revisá el diagnóstico',
    'Consultá opciones con evidencia',
    'Cambiá una sola cosa a la vez',
  ]),
  checklistScene(637, 'Señales de alarma', 'No lo trates en casa', [
    'Cambia de forma o color',
    'Crece o tiene bordes irregulares',
    'Sangra o no cicatriza',
    'Duele o pica de forma persistente',
  ], RED),
  checklistScene(660, 'Piel especialmente sensible', 'Durante un brote: no', [
    'Rosácea o eczema activos',
    'Heridas o quemadura solar',
    'Alergia a fragancias',
    'Reacciones frecuentes',
  ], RED),
  checklistScene(686, 'Concentraciones distintas', 'Aceite esencial ≠ infusión', [
    'Es un producto concentrado',
    'Puede irritar',
    'No se aplica puro',
    'No se mide con cucharas de cocina',
  ], RED),
  checklistScene(713, 'La suma falsa', 'Romero + limón + bicarbonato', [
    'No aclara de forma segura',
    'Puede inflamar',
    'El sol puede empeorarlo',
    'La fricción suma daño',
  ], RED),
  checklistScene(797, 'Ardor, picazón o quemazón', 'Si arde, pará', [
    'Retirá el producto',
    'Enjuagá con agua',
    'Volvé a una rutina simple',
    'Revisá antes de reintentar',
  ], RED),
  checklistScene(824, 'Criterio antes que curiosidad', 'El verdadero truco', [
    'Evitar irritaciones',
    'Hidratar',
    'Proteger del sol',
    'Consultar si algo cambia',
  ], GOLD),
  checklistScene(878, 'Una promesa honesta', 'Un mes de buenos hábitos', [
    'Limpieza suave',
    'Hidratación constante',
    'Protector cada mañana',
    'Nada que queme',
  ], GOLD),
  {
    start: 910,
    node: (
      <FedCta
        kicker="Tu próximo paso"
        title="¿Querés una rutina simple?"
        hot={['rutina']}
        sub="Escribí ROMERO en los comentarios y compartí este video."
        buttonLabel="ESCRIBÍ ROMERO"
        image={staticFile('img/vbb_rosemary_macro.png')}
        accent={GOLD}
        mood="gold"
      />
    ),
  },
];

export const MainVbb0rdkrfduo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#071014'}}>
      <AvatarBase />
      <Audio src={staticFile('sfx/music_federer.mp3')} volume={0.035} loop />

      {WINDOWS.map((window) => (
        <Sequence
          key={`${window.start}-${window.title}`}
          from={frames(window.start)}
          durationInFrames={frames(window.duration)}
          premountFor={FPS}
        >
          <FullVisual window={window} />
        </Sequence>
      ))}

      {COMPONENT_SCENES.map((scene) => (
        <Sequence key={scene.start} from={frames(scene.start)} durationInFrames={150} premountFor={FPS}>
          {scene.node}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
