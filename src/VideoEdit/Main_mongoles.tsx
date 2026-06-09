import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { Video } from "@remotion/media";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { HeatFlowDiagram } from "./scenes/HeatFlowDiagram";
import { ValueJourney } from "./scenes/ValueJourney";
import { StatBig, BarChart } from "./scenes/DataViz";
import { OptionCompare } from "./scenes/OptionCompare";
import { ReframeList } from "./scenes/ReframeContent";
import { CharacterIntro } from "./scenes/CharacterIntro";
import { PhotoScene, QuoteScene, CheckList } from "./MongolKit";
import { SfxCue, SFX, POPS } from "./components/Sfx";

// Video mongol — 23:23. Avatar 1080p30 en public/mongoles.mp4 (su audio es la
// pista). Escenas full-screen como overlays; en ventanas REFRAME el avatar se
// achica a una tarjeta a la derecha y aparece una lista a la izquierda.
// Paleta narrativa (sobre grafito neutro, NO navy): ACERO desaturado = problema/
// frío/exterior · DORADO/ÁMBAR = solución/calor. El color lo llevan las fotos y el
// acento, no un lavado azul. Acento por principio: P1 volumen→frío · P2 lana→ámbar ·
// P3 masa→rojo · P4 superficies→ámbar · P5 capas→ámbar.
export const TOTAL_FRAMES_MON = Math.round(1403.4 * 30); // 42102

const A = COLORS.amber;
const G = COLORS.good;
const D = COLORS.danger;
const B = COLORS.cold;

// Ventanas donde el avatar se achica a la derecha y entra una lista a la izquierda.
const REFRAME: { start: number; end: number }[] = [
  { start: 129, end: 150 },
  { start: 1184, end: 1204 },
];

type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

const CUES: Cue[] = [
  // ---------- HOOK (0:00–1:34) ----------
  { key: "h1", start: 0.4, dur: 5.4, el: (d) => <PhotoScene durationInFrames={d} name="estepa_invierno" hue="blue" kicker="−30 °C" caption="La estepa mongola en pleno invierno" /> },
  { key: "h2", start: 6.0, dur: 5.4, el: (d) => <PhotoScene durationInFrames={d} name="ger_noche" hue="amber" kicker="Sin gas. Sin electricidad." caption="Y nadie muere de frío" /> },
  { key: "h3", start: 11.6, dur: 5.4, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="2000 años" size={90} bg="black" tokens={[{ t: "No" }, { t: "es" }, { t: "supervivencia" }, { t: "—" }, { t: "es" }, { t: "INGENIERÍA", good: true }]} /> },
  { key: "h4", start: 17.2, dur: 6.2, el: (d) => <PhotoScene durationInFrames={d} name="nomades_caballo" hue="blue" kicker="Nómades de la estepa" caption="2000 años perfeccionando el frío" /> },
  { key: "h5", start: 30.0, dur: 6.6, el: (d) => <PhotoScene durationInFrames={d} name="cambridge_estudio" hue="blue" kicker="Cambridge, 2019" caption="Uno de los sistemas térmicos más eficientes jamás diseñados" /> },
  { key: "h6", start: 38.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} name="ger_corte" hue="blue" kicker="La ger de fieltro" caption="Más eficiente que muchas casas modernas con doble vidrio" /> },
  { key: "h7", start: 52.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="El veredicto" size={88} bg="black" tokens={[{ t: "Menos" }, { t: "materiales." }, { t: "Más" }, { t: "CALOR", good: true }]} /> },
  { key: "h8", start: 62.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="familia_ger" hue="amber" kicker="Lo que ellos saben" caption="y que nosotros olvidamos" /> },
  { key: "h9", start: 76.0, dur: 8.0, el: (d) => <CheckList durationInFrames={d} title="Sin reformas" items={["Sin instalar nada", "Sin gastar lo que no tenés", "Sin depender de la red"]} accent={G} /> },

  // ---------- LA FÍSICA (1:34–3:15) ----------
  { key: "f1", start: 94.0, dur: 7.0, el: (d) => <HeatFlowDiagram durationInFrames={d} eyebrow="La física" coldLabel="El frío no ENTRA" heatLabel="El calor SALE" /> },
  { key: "f2", start: 103.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="calor_sale" hue="blue" kicker="El calor escapa" caption="de tu cuerpo hacia las superficies frías" /> },
  { key: "f3", start: 116.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="tres_perdidas" hue="blue" kicker="Tres direcciones a la vez" caption="Conducción · Convección · Radiación" /> },
  { key: "f4", start: 129.0, dur: 21.0, el: (d) => <ReframeList durationInFrames={d} eyebrow="Tu calor escapa por" title="Tres vías a la vez" accent={B} items={[{ text: "Conducción", icon: "warn" }, { text: "Convección", icon: "warn" }, { text: "Radiación", icon: "warn" }]} /> },
  { key: "f5", start: 152.0, dur: 6.2, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="El frío" size={92} bg="black" tokens={[{ t: "No" }, { t: "es" }, { t: "presencia" }, { t: "—" }, { t: "es" }, { t: "AUSENCIA", hl: true }]} /> },
  { key: "f6", start: 168.0, dur: 6.2, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="La estrategia cambia" size={92} bg="black" tokens={[{ t: "No" }, { t: "generes" }, { t: "más" }, { t: "—" }, { t: "RETENÉ", good: true }]} /> },
  { key: "f7", start: 180.0, dur: 6.5, el: (d) => <StatBig durationInFrames={d} to={2000} suffix=" años" label="Perfeccionando el problema" caption="en uno de los climas más extremos del planeta" icon="calendar" accent="neutral" hue="blue" /> },

  // ---------- ANÉCDOTA · TÍO GUSTAVO (3:15–6:39) ----------
  { key: "a1", start: 195.0, dur: 6.2, el: (d) => <PhotoScene durationInFrames={d} name="depto_frio" hue="blue" kicker="Tenía 22 años" caption="El lugar más frío en el que viví" /> },
  { key: "a2", start: 205.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="dormitorio_norte" hue="blue" kicker="El dormitorio al norte" caption="Sin sol. Pared exterior helada al tacto." /> },
  { key: "a3", start: 214.0, dur: 5.5, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Cada noche" size={94} bg="black" tokens={[{ t: "Tres" }, { t: "frazadas." }, { t: "Igual" }, { t: "FRÍO", danger: true }]} /> },
  { key: "a4", start: 226.0, dur: 6.5, el: (d) => <PhotoScene durationInFrames={d} name="factura_gas" hue="red" kicker="La factura de gas" caption="Me dejó sin margen para nada más" /> },
  { key: "a5", start: 246.0, dur: 9.0, el: (d) => <CharacterIntro durationInFrames={d} bgImage="img/depto_frio.jpg" portraitImage="img/tio_gustavo.jpg" name="TÍO GUSTAVO" role="Hombre de campo · manos que construyen" accent={A} tint="rgba(255,178,62,0.16)" motionBlur /> },
  { key: "a6", start: 276.0, dur: 6.2, el: (d) => <PhotoScene durationInFrames={d} name="cajas_carton" hue="amber" kicker="¿Tenés cartón?" caption="Cajas de mudanza apiladas en el depósito" /> },
  { key: "a7", start: 300.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} name="arreglo_diy" hue="amber" kicker="Una hora de trabajo" caption="Cartón, papel de aluminio y una frazada vieja" /> },
  { key: "a8", start: 340.0, dur: 9.5, el: (d) => <PhotoScene durationInFrames={d} name="arreglo_corte" hue="amber" kicker="Por qué funcionó" caption="Cartón corta conducción · aluminio refleja radiación · frazada = cámara de aire" /> },
  { key: "a9", start: 376.0, dur: 7.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="La lección" size={86} bg="black" tokens={[{ t: "El" }, { t: "calor" }, { t: "que" }, { t: "ya" }, { t: "tenés" }, { t: "vale" }, { t: "MÁS", good: true }]} /> },

  // ---------- P1 · REDUCIR EL VOLUMEN (6:39–8:33) ----------
  { key: "p1", start: 399.0, dur: 7.0, el: (d) => <RuleNumberScene durationInFrames={d} number="01" label="PRINCIPIO" title="Reducí el volumen" hue="blue" /> },
  { key: "p1a", start: 412.0, dur: 9.0, el: (d) => <PhotoScene durationInFrames={d} name="circulo_vs_cuadrado" hue="blue" kicker="El círculo pierde menos" caption="Menos perímetro = menos superficie de pérdida" /> },
  { key: "p1b", start: 438.0, dur: 7.0, el: (d) => <StatBig durationInFrames={d} to={17} prefix="−" suffix="%" label="Superficie de pérdida" caption="forma circular vs. cuarto cuadrado" icon="growth" accent="good" hue="blue" /> },
  { key: "p1c", start: 455.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Tu jugada" size={92} bg="black" tokens={[{ t: "Calentá" }, { t: "MENOS", hl: true }, { t: "aire" }]} /> },
  { key: "p1d", start: 466.0, dur: 7.0, el: (d) => <StatBig durationInFrames={d} to={48} suffix=" m³" label="Una habitación entera" caption="todo ese aire que hay que calentar" icon="warn" accent="danger" hue="blue" /> },
  { key: "p1e", start: 475.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="dosel_volumen" hue="amber" kicker="48 m³ → 6 m³" caption="Un dosel sobre la cama calienta 8× menos volumen" /> },
  { key: "p1f", start: 490.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} name="capas_volumen" hue="amber" kicker="Capas de volumen" caption="Cada capa más chica y más fácil de mantener caliente" /> },

  // ---------- P2 · EL FIELTRO / LANA (8:33–11:18) ----------
  { key: "p2", start: 513.0, dur: 7.0, el: (d) => <RuleNumberScene durationInFrames={d} number="02" label="PRINCIPIO" title="El fieltro de lana" hue="amber" /> },
  { key: "p2a", start: 525.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} name="fieltro_macro" hue="amber" kicker="Fieltro de lana de oveja" caption="Producido localmente, espesor según el invierno" /> },
  { key: "p2b", start: 533.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="fieltro_propiedad" hue="amber" kicker="Vapor sale · viento bloqueado" caption="Mantiene el interior seco sin dejar entrar el frío" /> },
  { key: "p2c", start: 548.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} name="lana_ovejas" hue="amber" kicker="Hecho a mano" caption="Lana de oveja amasada de forma tradicional" /> },
  { key: "p2d", start: 562.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="En tu casa" size={90} bg="black" tokens={[{ t: "Lana" }, { t: "de" }, { t: "verdad" }, { t: "—" }, { t: "no" }, { t: "SINTÉTICA", danger: true }]} /> },
  { key: "p2e", start: 606.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="lana_aire" hue="amber" kicker="Millones de cámaras de aire" caption="El aire quieto atrapado es el mejor aislante" /> },
  { key: "p2f", start: 628.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="aislantes_aire" hue="blue" kicker="Todos atrapan aire" caption="Poliestireno · cámara de aire · lana" /> },
  { key: "p2g", start: 642.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="El secreto" size={94} bg="black" tokens={[{ t: "Es" }, { t: "el" }, { t: "AIRE", good: true }, { t: "QUIETO", good: true }]} /> },

  // ---------- CTA SUSCRIPCIÓN (10:51–11:18) ----------
  { key: "c1", start: 651.0, dur: 7.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="30 segundos" size={78} hue="amber" tokens={[{ t: "Suscribite" }, { t: "y" }, { t: "contá" }, { t: "tu" }, { t: "punto" }, { t: "más" }, { t: "FRÍO", good: true }]} /> },
  { key: "c2", start: 662.0, dur: 8.0, el: (d) => <CheckList durationInFrames={d} title="Dejá en los comentarios" items={["El punto más frío de tu casa", "Qué probaste hasta ahora", "De qué clima escribís"]} accent={B} /> },

  // ---------- P3 · MASA TÉRMICA (11:18–13:27) ----------
  { key: "p3", start: 678.0, dur: 7.0, el: (d) => <RuleNumberScene durationInFrames={d} number="03" label="PRINCIPIO" title="La masa térmica" hue="red" /> },
  { key: "p3a", start: 690.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} name="estufa_ger" hue="amber" kicker="Una estufa pequeña" caption="Se usa en ráfagas cortas e intensas" /> },
  { key: "p3b", start: 713.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="masa_bateria" hue="red" kicker="Batería de calor" caption="Las piedras cargan y liberan el calor lentamente" /> },
  { key: "p3c", start: 735.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="masa_casa" hue="amber" kicker="Tu casa ya tiene masa" caption="Ladrillo, cemento, muebles pesados" /> },
  { key: "p3d", start: 752.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="El error común" size={90} bg="black" tokens={[{ t: "La" }, { t: "estás" }, { t: "usando" }, { t: "AL", danger: true }, { t: "REVÉS", danger: true }]} /> },
  { key: "p3e", start: 763.0, dur: 9.0, el: (d) => <ValueJourney durationInFrames={d} eyebrow="Masa térmica · una noche" title="Cargá fuerte, soltá lento" accent="amber" hue="amber" endValue="6 h" endLabel="de calor con un fuego corto" nodes={[{ label: "Encendés", sub: "fuego corto", level: 0.18 }, { label: "Pico", sub: "piedras al rojo", level: 1.0 }, { label: "1–2 h", sub: "calor intenso", level: 0.82 }, { label: "Noche", sub: "irradia lento", level: 0.5 }, { label: "Madrugada", sub: "aún templado", level: 0.28 }]} /> },
  { key: "p3f", start: 782.0, dur: 7.0, el: (d) => <StatBig durationInFrames={d} from={2} to={6} suffix=" h" label="El calor dura" caption="2 a 6 h según masa y aislación" icon="calendar" accent="amber" hue="amber" /> },

  // ---------- P4 · CALENTAR SUPERFICIES (13:27–15:58) ----------
  { key: "p4", start: 807.0, dur: 7.0, el: (d) => <RuleNumberScene durationInFrames={d} number="04" label="PRINCIPIO" title="Calentá superficies" hue="amber" /> },
  { key: "p4a", start: 820.0, dur: 5.5, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Lo contraintuitivo" size={96} bg="black" tokens={[{ t: "No" }, { t: "calientes" }, { t: "el" }, { t: "AIRE", danger: true }]} /> },
  { key: "p4b", start: 826.0, dur: 9.0, el: (d) => <PhotoScene durationInFrames={d} name="aire_vs_superficie" hue="blue" kicker="El aire caliente sube" caption="Calentás el techo, no el lugar donde estás vos" /> },
  { key: "p4c", start: 846.0, dur: 9.5, el: (d) => <OptionCompare durationInFrames={d} left={{ tag: "AIRE", title: "Aire caliente", sub: "Sube al techo", note: "Calentás el lugar equivocado", icon: "warn", accent: D }} right={{ tag: "SUPERFICIE", title: "Superficie caliente", sub: "Irradia hacia vos", note: "Calor directo donde estás", icon: "check", accent: G }} /> },
  { key: "p4d", start: 862.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="piso_radiante" hue="amber" kicker="Calor radiante" caption="Las superficies te calientan, no el aire" /> },
  { key: "p4e", start: 880.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="ger_radiacion" hue="amber" kicker="La ger irradia" caption="Las paredes de fieltro devuelven el calor al interior" /> },
  { key: "p4f", start: 912.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} name="trucos_superficie" hue="amber" kicker="Trucos caseros" caption="Bolsa de agua, ladrillos en tela, lámpara a la pared" /> },
  { key: "p4g", start: 932.0, dur: 10.0, el: (d) => <CheckList durationInFrames={d} title="Calentá la superficie fría" items={["Bolsa de agua contra la pared", "Ladrillos calientes envueltos en tela", "Lámpara apuntando a la pared, no a vos"]} accent={G} /> },

  // ---------- P5 · CAPAS SOBRE EL CUERPO (15:58–17:51) ----------
  { key: "p5", start: 958.0, dur: 7.0, el: (d) => <RuleNumberScene durationInFrames={d} number="05" label="PRINCIPIO" title="Capas sobre el cuerpo" hue="amber" /> },
  { key: "p5a", start: 972.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="deel_mongol" hue="amber" kicker="El deel" caption="Túnica cruzada que cierra el paso al viento" /> },
  { key: "p5b", start: 981.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="deel_corte" hue="amber" kicker="Cámara de aire del cuerpo" caption="El cruce frontal calienta todo el torso" /> },
  { key: "p5c", start: 1021.0, dur: 9.0, el: (d) => <PhotoScene durationInFrames={d} name="tres_capas" hue="amber" kicker="Tres capas" caption="1 Algodón ajustado · 2 Lana · 3 Cortaviento" /> },
  { key: "p5d", start: 1036.0, dur: 7.0, el: (d) => <StatBig durationInFrames={d} from={12} to={15} suffix=" °C" label="Dormís cómodo a" caption="12 a 15 °C sin calefacción adicional" icon="check" accent="good" hue="amber" /> },
  { key: "p5e", start: 1049.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="alpinista" hue="blue" kicker="Alpinistas y exploradores polares" caption="Misma conclusión, 2000 años después" /> },

  // ---------- LOS NÚMEROS (17:51–19:44) ----------
  { key: "n1", start: 1071.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Los números" size={96} bg="black" tokens={[{ t: "Hablemos" }, { t: "de" }, { t: "DINERO", good: true }]} /> },
  { key: "n2", start: 1078.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} name="factura_gas" hue="red" kicker="Calefacción a gas" caption="$80 a $200 por mes en invierno" /> },
  { key: "n3", start: 1088.0, dur: 9.0, el: (d) => <BarChart durationInFrames={d} title="Lo que pagás por invierno (3 meses)" hue="red" bars={[{ label: "Mínimo", value: 240, max: 600, prefix: "$", color: A }, { label: "Máximo", value: 600, max: 600, prefix: "$", color: D, highlight: true }]} footer="240 a 600 USD, año tras año" /> },
  { key: "n4", start: 1108.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="materiales_baratos" hue="amber" kicker="Materiales baratos" caption="Frazada de lana, cartón, aluminio, tela · $0 a $20" /> },
  { key: "n5", start: 1122.0, dur: 8.0, el: (d) => <StatBig durationInFrames={d} from={30} to={60} suffix="%" label="Reducción del consumo" caption="entre el 30 y el 60 % según tu punto de partida" icon="growth" accent="good" hue="amber" /> },
  { key: "n6", start: 1135.0, dur: 9.0, el: (d) => <BarChart durationInFrames={d} title="El ahorro real por invierno" hue="blue" bars={[{ label: "−30 % de $200", caption: "$60/mes", value: 180, max: 540, prefix: "$", color: A }, { label: "−60 % de $300", caption: "$180/mes", value: 540, max: 540, prefix: "$", color: G, highlight: true }]} footer="Con $0 a $20 en materiales" /> },
  { key: "n7", start: 1155.0, dur: 6.5, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="No es magia" size={96} bg="black" tokens={[{ t: "Es" }, { t: "ARITMÉTICA", good: true }]} /> },
  { key: "n8", start: 1166.0, dur: 7.0, el: (d) => <PhotoScene durationInFrames={d} name="arreglo_diy" hue="amber" kicker="Cartón, aluminio y una frazada" caption="Física, no magia — la misma de hace 2000 años" /> },

  // ---------- RECAP · 5 PRINCIPIOS (19:44–20:05) ----------
  { key: "rc", start: 1184.0, dur: 21.0, el: (d) => <ReframeList durationInFrames={d} eyebrow="Recapitulemos" title="Los 5 principios mongoles" accent={G} items={[{ text: "Reducí el volumen", icon: "check" }, { text: "Usá lana", icon: "check" }, { text: "Cargá la masa térmica", icon: "check" }, { text: "Calentá las superficies", icon: "check" }, { text: "Capas sobre el cuerpo", icon: "check" }]} /> },

  // ---------- CIERRE (20:05–20:53) ----------
  { key: "z1", start: 1205.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="cierre_durmiendo" hue="amber" kicker="−30 °C afuera" caption="Duermen sin morir de frío" /> },
  { key: "z2", start: 1216.0, dur: 6.5, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Tienen menos que vos" size={92} bg="black" tokens={[{ t: "Y" }, { t: "duermen" }, { t: "MEJOR", good: true }]} /> },
  { key: "z3", start: 1227.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Ahora lo sabés vos" size={88} hue="amber" tokens={[{ t: "Aplicalo" }, { t: "este" }, { t: "INVIERNO", hl: true }]} /> },
  { key: "z4", start: 1236.0, dur: 9.0, el: (d) => <CheckList durationInFrames={d} title="Esta semana" items={["Elegí la habitación más fría", "Probá un solo principio", "Contame cuál en los comentarios"]} accent={B} /> },

  // ---------- BONUS · FRÍO EXTREMO (20:53–23:23) ----------
  { key: "x1", start: 1253.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Un bonus" size={92} hue="red" bg="black" tokens={[{ t: "¿Y" }, { t: "si" }, { t: "el" }, { t: "frío" }, { t: "es" }, { t: "EXTREMO?", danger: true }]} /> },
  { key: "x2", start: 1263.0, dur: 7.0, el: (d) => <StatBig durationInFrames={d} to={10} prefix="−" suffix=" °C" label="Inviernos severos" caption="bajo cero sostenido durante semanas" icon="warn" accent="danger" hue="red" /> },
  { key: "x3", start: 1290.0, dur: 6.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="Aun así" size={90} bg="black" tokens={[{ t: "Los" }, { t: "principios" }, { t: "siguen" }, { t: "VALIENDO", good: true }]} /> },
  { key: "x4", start: 1320.0, dur: 9.0, el: (d) => <CheckList durationInFrames={d} title="Por qué alcanza con poco" items={["Calentás menos volumen", "El calor se escapa más lento", "La masa retiene más tiempo", "Tu ropa hace su parte"]} accent={G} /> },
  { key: "x5", start: 1356.0, dur: 8.0, el: (d) => <PhotoScene durationInFrames={d} name="estufa_ger" hue="amber" kicker="Una estufa pequeña" caption="Todo lo demás diseñado para que esa estufa alcance" /> },
  { key: "x6", start: 1377.0, dur: 7.0, el: (d) => <KineticHeadline durationInFrames={d} eyebrow="La clave" size={82} bg="black" tokens={[{ t: "Eficiencia" }, { t: "del" }, { t: "SISTEMA", good: true }, { t: "—" }, { t: "no" }, { t: "del" }, { t: "aparato" }]} /> },
  { key: "x7", start: 1390.0, dur: 11.5, el: (d) => <QuoteScene durationInFrames={d} name="depto_frio" quote="El problema no es cuánto calor tenés. Es cuánto calor perdés." attribution="Tío Gustavo" accent={A} /> },
];

const ReframedVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  let p = 0;
  for (const w of REFRAME) {
    const s = sec(w.start);
    const e = sec(w.end);
    if (frame >= s - 18 && frame <= e + 18) {
      const into = spring({ frame: frame - s, fps, config: { damping: 20, mass: 0.7 } });
      const out = spring({ frame: frame - e, fps, config: { damping: 200 } });
      p = into * (1 - out);
      break;
    }
  }

  const Wt = 720;
  const Ht = 980;
  const margin = 90;
  const xTarget = width - Wt - margin;
  const yTarget = (height - Ht) / 2;

  const boxW = interpolate(p, [0, 1], [width, Wt]);
  const boxH = interpolate(p, [0, 1], [height, Ht]);
  const boxX = interpolate(p, [0, 1], [0, xTarget]);
  const boxY = interpolate(p, [0, 1], [0, yTarget]);
  const radius = interpolate(p, [0, 1], [0, 40]);
  const shadow = p > 0.02 ? `0 40px 100px rgba(0,0,0,${0.6 * p})` : "none";

  const ratio = 16 / 9;
  let coverW = Math.max(boxW, boxH * ratio);
  let coverH = coverW / ratio;
  const kb = interpolate(frame, [0, TOTAL_FRAMES_MON], [1.0, 1.06], { extrapolateRight: "clamp" });
  const kbMul = 1 + (kb - 1) * (1 - p);
  coverW *= kbMul;
  coverH *= kbMul;
  const offX = (boxW - coverW) / 2;
  const offY = (boxH - coverH) * 0.32;

  return (
    <div
      style={{
        position: "absolute",
        left: boxX,
        top: boxY,
        width: boxW,
        height: boxH,
        borderRadius: radius,
        overflow: "hidden",
        boxShadow: shadow,
        border: p > 0.02 ? "1px solid rgba(255,255,255,0.16)" : "none",
        willChange: "left, top, width, height",
      }}
    >
      <Video
        src={staticFile("mongoles_opt.mp4")}
        style={{ position: "absolute", left: offX, top: offY, width: coverW, height: coverH }}
      />
    </div>
  );
};

export const MainMongoles: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={44} hue="blue" drift={0.5} />
      <ReframedVideo />
      {CUES.map((cue) => (
        <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
          {cue.el(sec(cue.dur))}
        </Sequence>
      ))}
      {/* Pasada de SFX — un golpe sutil en el arranque de cada escena (Regla 9J). */}
      {CUES.map((cue, i) => (
        <SfxCue
          key={"sfx" + cue.key}
          at={sec(cue.start)}
          src={cue.key.startsWith("p") && cue.key.length === 2 ? SFX.transition : POPS[i % POPS.length]}
          volume={0.3}
        />
      ))}
    </AbsoluteFill>
  );
};
