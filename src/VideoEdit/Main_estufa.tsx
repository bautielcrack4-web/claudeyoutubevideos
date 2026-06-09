import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { RawShot } from "./scenes/RawShot";
import { ImpactReveal } from "./scenes/ImpactReveal";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { ChipsCluster } from "./scenes/ReframeContent";
import { CalloutMark } from "./scenes/CalloutMark";
import { StatBig } from "./scenes/StatBig";
import { BarCompare } from "./scenes/BarCompare";
import { SplitList } from "./scenes/SplitList";
import { TextCardReveal } from "./scenes/TextCardReveal";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { Checklist } from "./scenes/Checklist";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { AgedDoc } from "./scenes/AgedDoc";
import { FirePathDiorama } from "./scenes/FirePathDiorama";
import { TitleCardOpen } from "./scenes/TitleCardOpen";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { JourneyCanvas } from "./scenes/JourneyCanvas";
import { InfiniteZoom } from "./scenes/InfiniteZoom";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";

// color-grade por mood de sección (wash suave)
const GRADE: GradeRange[] = [
  { from: 0, to: 185, tint: "#FF9A3D", strength: 0.07 },      // hook/fuego: dorado cálido
  { from: 185, to: 480, tint: "#C8904A", strength: 0.045 },   // promesa/error/física: ámbar
  { from: 480, to: 907, tint: "#B0833F", strength: 0.05 },    // materiales/construcción: tierra
  { from: 907, to: 990, tint: "#D2A24E", strength: 0.05 },    // costo: cálido
  { from: 990, to: 1093, tint: "#5E7A6E", strength: 0.1 },    // casas frías: eucalipto frío
  { from: 1093, to: 1256, tint: "#A9794A", strength: 0.07 },  // ancestros/cierre: sepia nostálgico
];

// ── VIDEO ESTUFA COHETE — "La estufa de barro que calienta 6h con 5 ramitas" ──
// Documental sin avatar: narración (public/estufa.wav) + flujo denso de imágenes
// reales y clips + diagramas vectoriales nativos + texto cinético. Paleta terrosa.
// IMPACT REVEAL en el hook y en los re-hooks de sección. ~21 min.
const T = (img: string) => `img/${img}.png`;
const V = (clip: string) => `vid/${clip}.mp4`;

export const TOTAL_FRAMES_EST = Math.round(1256 * 30); // 37680

const RD = COLORS.danger; // terracota (problema/error/desperdicio)
const GD = COLORS.good; // garden green (payoff/ahorro)

type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

// helper: dur calculado contra el siguiente start (ver build al final)
const C: { key: string; start: number; el: (d: number) => React.ReactNode }[] = [
  // ════════════ HOOK · la estufa, las 5 ramitas (0:00–1:10) ════════════
  { key: "h01", start: 0.0, el: (d) => <TitleCardOpen durationInFrames={d} image={T("es_estufa_amanecer")} kicker="Una estufa de barro · 1979" title="46 inviernos" subtitle="6 horas de calor · 5 ramitas" glowAt={[0.5, 0.6]} /> },
  { key: "h03", start: 7.0, el: (d) => <RawShot durationInFrames={d} src={T("es_pozo_aljibe_tierra")} hue="amber" kicker="Con la tierra del pozo" /> },
  { key: "h04", start: 11.1, el: (d) => <RawShot durationInFrames={d} src={T("es_baldes_arcilla_tierra")} hue="amber" kicker="2 baldes de arcilla · 3 de tierra" /> },
  { key: "h05", start: 15.0, el: (d) => <RawShot durationInFrames={d} src={V("es_mezcla_masa_pan")} hue="amber" kicker="Como masa de pan" /> },
  { key: "h06", start: 18.6, el: (d) => <RawShot durationInFrames={d} src={T("es_puñado_paja")} hue="amber" kicker="Un puñado de paja" /> },
  { key: "h07", start: 21.8, el: (d) => <RawShot durationInFrames={d} src={T("es_secando_semana")} hue="amber" kicker="Se secó en una semana" /> },
  { key: "h08", start: 25.9, el: (d) => <CalloutMark durationInFrames={d} figure="46 años" image={T("es_46_anios_prendida")} eyebrow="Sin un solo arreglo serio" caption="Prendiéndose todos los inviernos" accent="amber" hue="amber" /> },
  { key: "h09", start: 31.7, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("es_estufa_rincon_galpon")} imageDarken={0.6} title="No tiene" chips={["gas", "garrafa", "leña gruesa", "electricidad"]} hue="red" /> },
  { key: "h10", start: 38.9, el: (d) => <ImpactReveal durationInFrames={d} image={T("es_cinco_ramitas_mano")} setup="Funciona con" impact="CINCO RAMITAS" impactAccent="good" hitAt={1.0} boom={0} /> },
  { key: "h11", start: 43.6, el: (d) => <RawShot durationInFrames={d} src={V("es_chico_junta_ramitas")} hue="amber" kicker="Las junta cualquier chico" /> },
  { key: "h12", start: 47.3, el: (d) => <RawShot durationInFrames={d} src={T("es_ramitas_paraiso_podado")} hue="amber" kicker="Del podado del paraíso" /> },
  { key: "h13", start: 50.6, el: (d) => <RawShot durationInFrames={d} src={T("es_ramitas_caidas_fondo")} hue="amber" kicker="De las que caen solas" /> },
  { key: "h14", start: 53.1, el: (d) => <RawShot durationInFrames={d} src={T("es_galpon_caliente_interior")} hue="amber" kicker="Calienta 6 horas el galpón" /> },
  { key: "h15", start: 58.0, el: (d) => <RawShot durationInFrames={d} src={V("es_chimenea_aire_transparente")} hue="cold" kicker="Sin humo negro" /> },
  { key: "h16", start: 60.9, el: (d) => <KineticQuote durationInFrames={d} image={T("es_chimenea_columna_vapor")} eyebrow="De la chimenea sale" words={parseQuote("Solo *vapor* y aire *transparente*")} accent="good" hue="cold" /> },

  // ════════════ COMBUSTIÓN LIMPIA (1:10–1:47) ════════════
  { key: "c17", start: 70.7, el: (d) => <RawShot durationInFrames={d} src={T("es_medidor_gases")} hue="cold" kicker="Verificable · medidor de gases" /> },
  { key: "c18", start: 78.0, el: (d) => <StatBig durationInFrames={d} value={1000} suffix="°C" label="en la cámara interna" eyebrow="Quema a más de" accent="amber" hue="amber" /> },
  { key: "c19", start: 84.3, el: (d) => <RawShot durationInFrames={d} src={V("es_camara_interna_fuego")} hue="amber" kicker="No queda nada sin quemar" /> },
  { key: "c20", start: 87.9, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("es_ceniza_minima")} imageDarken={0.6} title="A esa temperatura" chips={["Cero hollín", "Cero alquitrán", "Cero ceniza"]} hue="amber" /> },
  { key: "c21", start: 96.5, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("es_fuego_boca_ramitas")} imageDarken={0.66} tokens={[{ t: "La combustión más " }, { t: "limpia", good: true }, { t: " posible" }]} /> },
  { key: "c22", start: 101.2, el: (d) => <RawShot durationInFrames={d} src={T("es_asia_central_estepa")} hue="cold" kicker="Inventada hace 3000 años · Asia Central" /> },

  // ════════════ ORIGEN · el viejo y el libro alemán (1:47–3:06) ════════════
  { key: "o23", start: 106.7, el: (d) => <RawShot durationInFrames={d} src={T("es_narrador_retrato")} hue="amber" kicker="32 años construyendo" /> },
  { key: "o24", start: 111.4, el: (d) => <RawShot durationInFrames={d} src={T("es_narrador_galpon_trabajando")} hue="amber" kicker="Aprendí mirando a mi viejo" /> },
  { key: "o25", start: 118.9, el: (d) => <RawShot durationInFrames={d} src={T("es_padre_libro_aleman")} hue="amber" kicker="Un libro alemán de los 50" /> },
  { key: "o26", start: 131.0, el: (d) => <RawShot durationInFrames={d} src={T("es_padre_diccionario")} hue="amber" kicker="Traducido con diccionario" /> },
  { key: "o27", start: 139.4, el: (d) => <AgedDoc durationInFrames={d} eyebrow="El libro" heading="Estufa cohete" lines={[{ text: "Sin nombre en castellano todavía" }, { text: "El alemán lo explicaba en dibujos", mark: true }]} accent="amber" hue="amber" /> },
  { key: "o28", start: 144.3, el: (d) => <KineticQuote durationInFrames={d} image={T("es_fuego_hacia_arriba_motor")} eyebrow="Estufa cohete" words={parseQuote("El fuego arde *hacia arriba*")} accent="amber" hue="amber" /> },
  { key: "o29", start: 151.2, el: (d) => <RawShot durationInFrames={d} src={V("es_fuego_hacia_arriba_motor")} hue="amber" kicker="Como el escape de un motor" /> },
  { key: "o30", start: 154.0, el: (d) => <RawShot durationInFrames={d} src={T("es_laboratorio_oregon")} hue="cold" kicker="Universidad de Aprovecho · Oregón" /> },
  { key: "o31", start: 163.5, el: (d) => <BarCompare durationInFrames={d} eyebrow="Eficiencia térmica" title="Cuánto calor aprovecha cada una" orientation="horizontal" hue="amber" bars={[{ label: "Estufa cohete", value: 90, display: "80-90%", tone: "good", winner: true }, { label: "Gas natural", value: 60, display: "60%", tone: "amber" }, { label: "Salamandra a leña", value: 30, display: "30%", tone: "danger" }]} /> },
  { key: "o32", start: 176.7, el: (d) => <KineticQuote durationInFrames={d} image={T("es_chimenea_calienta_cielo")} eyebrow="El resto" words={parseQuote("Se va *calentando el cielo*")} accent="danger" hue="red" /> },

  // ════════════ PROMESA + COSTO (3:06–4:06) ════════════
  { key: "p33", start: 185.9, el: (d) => <RawShot durationInFrames={d} src={T("es_tierra_terreno_pala")} hue="amber" kicker="Con la tierra de tu terreno" /> },
  { key: "p34", start: 193.8, el: (d) => <SplitList durationInFrames={d} title="Sin comprar" items={["Ladrillo refractario", "Chapa cara", "Contratar a nadie"]} accent={RD} cross /> },
  { key: "p35", start: 201.1, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("es_garrafa_gas")} imageDarken={0.66} tokens={[{ t: "Cuesta menos que una " }, { t: "garrafa", hl: true }]} /> },
  { key: "p36", start: 204.9, el: (d) => <RawShot durationInFrames={d} src={T("es_estufa_curada_ceramica")} hue="amber" kicker="Te dura más que la casa" /> },
  { key: "p37", start: 216.1, el: (d) => <BarCompare durationInFrames={d} eyebrow="Calefaccionar un invierno" title="Costo por temporada" orientation="horizontal" hue="cold" bars={[{ label: "Garrafa", value: 150, display: "$1,5 M", tone: "danger" }, { label: "Gas natural", value: 80, display: "$800 k", tone: "amber" }, { label: "Estufa cohete", value: 2, display: "$0", tone: "good", winner: true, sub: "las ramitas son gratis" }]} /> },
  { key: "p38", start: 233.3, el: (d) => <ImpactReveal durationInFrames={d} image={T("es_chico_junta_ramitas")} setup="El costo real de calentar tu casa" impact="CERO" impactAccent="good" hitAt={0.9} boom={1} /> },
  { key: "p39", start: 238.2, el: (d) => <TextCardReveal durationInFrames={d} eyebrow="Quédate conmigo" lines={["Vas a saber cómo tenerla", "antes del invierno que viene"]} accent={GD} /> },

  // ════════════ EL ERROR (4:06–5:01) ════════════
  { key: "r1", start: 245.6, el: (d) => <RuleNumberScene durationInFrames={d} number="01" label="EL ERROR" title="El que arruina toda calefacción a leña" hue="red" /> },
  { key: "e41", start: 251.3, el: (d) => <KineticQuote durationInFrames={d} image={T("es_salamandra_chapa")} eyebrow="La gente cree" words={parseQuote("El calor viene del *tamaño* del fuego")} accent="amber" hue="amber" /> },
  { key: "e42", start: 262.1, el: (d) => <RawShot durationInFrames={d} src={T("es_lena_gruesa_pila")} hue="amber" kicker="¿Fuego grande = más calor?" /> },
  { key: "e43", start: 270.2, el: (d) => <RawShot durationInFrames={d} src={T("es_salamandra_humo_fuga")} hue="red" kicker="Salamandras enormes, leña gruesa" /> },
  { key: "e43b", start: 277.0, el: (d) => <RawShot durationInFrames={d} src={T("es_galpon_helado")} hue="cold" kicker="Y el galpón sigue helado" /> },
  { key: "e44", start: 283.3, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Viene de " }, { t: "dos", hl: true }, { t: " cosas que casi nadie entiende" }]} /> },
  { key: "e45", start: 290.3, el: (d) => <Checklist durationInFrames={d} eyebrow="El calor real" title="De dónde sale" items={[{ text: "Temperatura de combustión", state: "doing" }, { text: "Tiempo de retención en la masa", state: "doing" }]} accent="good" /> },
  { key: "e46", start: 295.1, el: (d) => <KineticQuote durationInFrames={d} image={T("es_estufa_dura_ceramica2")} eyebrow="La rocket gana en" words={parseQuote("*las dos* al mismo tiempo")} accent="good" hue="amber" /> },

  // ════════════ FÍSICA 1 · temperatura (5:01–6:24) ════════════
  { key: "r2", start: 301.5, el: (d) => <RuleNumberScene durationInFrames={d} number="02" label="FÍSICA" title="Temperatura de combustión" hue="amber" /> },
  { key: "f48", start: 304.9, el: (d) => <StatBig durationInFrames={d} value={500} suffix="°C" label="arde una salamandra común" eyebrow="No alcanza" accent="danger" hue="red" /> },
  { key: "f49", start: 316.7, el: (d) => <RawShot durationInFrames={d} src={V("es_gases_madera_humo")} hue="red" kicker="La madera suelta gases pesados" /> },
  { key: "f50", start: 327.9, el: (d) => <RawShot durationInFrames={d} src={T("es_creosota_cano")} hue="red" kicker="Creosota: pasta marrón y negra" /> },
  { key: "f51", start: 341.5, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("es_chimenea_fuego_peligro")} imageDarken={0.62} title="La creosota" chips={["Prende chimeneas", "Humo negro", "Media energía perdida"]} hue="red" /> },
  { key: "f52", start: 355.7, el: (d) => <StatBig durationInFrames={d} value={1200} suffix="°C" label="en la cámara de la rocket" eyebrow="El doble" accent="amber" hue="amber" /> },
  { key: "f53", start: 371.5, el: (d) => <RawShot durationInFrames={d} src={V("es_chimenea_aire_transparente")} hue="cold" kicker="Humo casi transparente" /> },
  { key: "f54", start: 377.4, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "5 ramitas = " }, { t: "media bolsa", hl: true }, { t: " de leña" }]} /> },

  // ════════════ FÍSICA 2 · retención (6:24–7:43) ════════════
  { key: "r3", start: 384.1, el: (d) => <RuleNumberScene durationInFrames={d} number="03" label="FÍSICA" title="Tiempo de retención del calor" hue="amber" /> },
  { key: "g56", start: 386.5, el: (d) => <RawShot durationInFrames={d} src={T("es_salamandra_apagada_fria")} hue="cold" kicker="Calienta solo mientras arde" /> },
  { key: "g57", start: 393.1, el: (d) => <RawShot durationInFrames={d} src={T("es_banco_masa_corte")} hue="amber" kicker="El banco de barro macizo" /> },
  { key: "g58", start: 405.7, el: (d) => <StatBig durationInFrames={d} value={500} suffix=" kg" label="de tierra y barro" eyebrow="La masa acumula" accent="amber" hue="amber" /> },
  { key: "g59", start: 416.3, el: (d) => <DiagramBoard durationInFrames={d} pages={[{ image: T("dg_masa_termica") }]} avatar="estufa_opt.mp4" avatarFrom={sec(416.3)} /> },
  { key: "g60", start: 428.7, el: (d) => <RawShot durationInFrames={d} src={T("es_horno_barro_pizza")} hue="amber" kicker="Igual que el horno de barro" /> },
  { key: "g60b", start: 436.0, el: (d) => <RawShot durationInFrames={d} src={T("es_horno_barro_noche")} hue="amber" kicker="Cocina solo toda la noche" /> },
  { key: "g61", start: 443.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Calentás " }, { t: "barro", hl: true }, { t: ", el barro te calienta a " }, { t: "vos", good: true }]} /> },

  // ════════════ CIERRE FÍSICA + RE-HOOK (7:43–8:00) ════════════
  { key: "x62", start: 452.7, el: (d) => <RawShot durationInFrames={d} src={T("es_laboratorio_medicion2")} hue="cold" kicker="Física vieja, medida, repetida" /> },
  { key: "x63", start: 463.3, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "No hay nada " }, { t: "nuevo", hl: true }, { t: " acá" }]} /> },
  { key: "x64", start: 465.4, el: (d) => <ImpactReveal durationInFrames={d} image={T("es_factura_gas_alta2")} setup="El gas se puso impagable…" impact="Y NADIE LO CUENTA" impactAccent="danger" hitAt={1.2} boom={2} /> },

  // ════════════ MATERIALES (8:00–11:53) ════════════
  { key: "r4", start: 480.1, el: (d) => <ProcessSteps durationInFrames={d} eyebrow="Gratis o casi gratis" title="Necesitás 3 cosas" orientation="horizontal" accent="good" hue="amber" steps={[{ title: "Tierra", image: T("es_tierra_terreno_pala") }, { title: "Arena", image: T("es_arena_fina_balde") }, { title: "Paja", image: T("es_paja_fardo") }]} /> },
  { key: "m66", start: 489.3, el: (d) => <RawShot durationInFrames={d} src={T("es_terreno_dos_baldes")} hue="amber" kicker="1 · Tierra del propio terreno" /> },
  { key: "m67", start: 497.1, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("es_tierra_arcillosa_mano")} imageDarken={0.66} tokens={[{ t: "Tiene que tener " }, { t: "arcilla", good: true }]} /> },
  { key: "m68", start: 504.1, el: (d) => <SplitList durationInFrames={d} title="No sirve si es" items={["Muy arenosa", "Puro humus"]} accent={RD} cross /> },
  { key: "m69", start: 512.2, el: (d) => <RawShot durationInFrames={d} src={V("es_frasco_agitando")} hue="cold" kicker="La prueba del frasco de mermelada" /> },
  { key: "m69b", start: 519.0, el: (d) => <RawShot durationInFrames={d} src={T("es_frasco_prueba_tierra")} hue="cold" kicker="20 minutos quieto" /> },
  { key: "m70", start: 524.2, el: (d) => <DiagramBoard durationInFrames={d} pages={[{ image: T("dg_prueba_frasco") }]} avatar="estufa_opt.mp4" avatarFrom={sec(524.2)} /> },
  { key: "m71", start: 535.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Arcilla = " }, { t: "un tercio", good: true }, { t: " o más" }]} /> },
  { key: "m72", start: 541.6, el: (d) => <RawShot durationInFrames={d} src={T("es_arcilla_bola_mano")} hue="amber" kicker="Si es poca, mezclás con más arcilla" /> },
  { key: "m73", start: 554.9, el: (d) => <AgedDoc durationInFrames={d} eyebrow="En la descripción · gratis" heading="Módulo 5" lines={[{ text: "La prueba del frasco con dibujo" }, { text: "Las tres correcciones posibles", mark: true }, { text: "Una guía que armé para mis hijos" }]} accent="amber" hue="amber" /> },
  { key: "m74", start: 570.4, el: (d) => <KineticQuote durationInFrames={d} image={T("es_grieta_estufa_mala")} eyebrow="Sin esa prueba" words={parseQuote("La estufa se *agrieta* en el primer fuego")} accent="danger" hue="red" /> },
  { key: "m75", start: 586.3, el: (d) => <RawShot durationInFrames={d} src={T("es_guia_pdf_modulos")} hue="cold" kicker="6 módulos en PDF · gratis" /> },
  { key: "m76", start: 593.1, el: (d) => <RawShot durationInFrames={d} src={T("es_arena_corralon")} hue="amber" kicker="2 · Arena fina" /> },
  { key: "m77", start: 603.1, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "La arena evita que se " }, { t: "contraiga", hl: true }]} /> },
  { key: "m78", start: 611.7, el: (d) => <RawShot durationInFrames={d} src={T("es_arena_fina_balde")} hue="amber" kicker="2 partes tierra · 1 de arena" /> },
  { key: "m79", start: 623.3, el: (d) => <RawShot durationInFrames={d} src={T("es_mapa_argentina_tierra")} hue="cold" kicker="Ajustás según tu tierra" /> },
  { key: "m80", start: 632.4, el: (d) => <RawShot durationInFrames={d} src={T("es_paja_fardo")} hue="amber" kicker="3 · Paja seca" /> },
  { key: "m81", start: 644.0, el: (d) => <RawShot durationInFrames={d} src={T("es_cortando_paja")} hue="amber" kicker="Cortada en 5-10 cm" /> },
  { key: "m82", start: 655.2, el: (d) => <RawShot durationInFrames={d} src={T("es_hierro_construccion_comparacion")} hue="amber" kicker="Como el hierro en el hormigón" /> },
  { key: "m83", start: 668.5, el: (d) => <ImpactReveal durationInFrames={d} image={T("es_grieta_macro2")} setup="Sin paja dura un invierno" impact="CON PAJA, UNA VIDA" impactAccent="good" hitAt={1.0} boom={0} /> },
  { key: "m84", start: 674.7, el: (d) => <RawShot durationInFrames={d} src={V("es_pisar_mezcla_pies")} hue="amber" kicker="Se pisa con los pies descalzos" /> },
  { key: "m85", start: 681.2, el: (d) => <DiagramBoard durationInFrames={d} pages={[{ image: T("dg_receta") }]} avatar="estufa_opt.mp4" avatarFrom={sec(681.2)} /> },
  { key: "m86", start: 689.2, el: (d) => <RawShot durationInFrames={d} src={T("es_bola_barro_prueba")} hue="amber" kicker="Como masa de pan cruda" /> },
  { key: "m87", start: 701.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Esto se aprende " }, { t: "pisando", hl: true }]} /> },

  // ════════════ LA FORMA · 4 partes (11:53–13:42) ════════════
  { key: "r5", start: 712.7, el: (d) => <RuleNumberScene durationInFrames={d} number="04" label="LA FORMA" title="Una rocket tiene 4 partes" hue="amber" /> },
  { key: "s89", start: 719.3, el: (d) => <DiagramBoard durationInFrames={d} pages={[{ image: T("dg_4partes") }]} avatar="estufa_opt.mp4" avatarFrom={sec(719.3)} /> },
  { key: "s91", start: 735.8, el: (d) => <RawShot durationInFrames={d} src={T("es_torre_combustion_cano")} hue="amber" kicker="3 · Torre de combustión (60 cm)" /> },
  { key: "s91b", start: 743.0, el: (d) => <RawShot durationInFrames={d} src={T("es_ladrillos_refractarios")} hue="amber" kicker="Forrada con refractario" /> },
  { key: "s92", start: 750.7, el: (d) => <RawShot durationInFrames={d} src={T("es_cano_galvanizado_banco")} hue="amber" kicker="4 · El banco de masa" /> },
  { key: "s92b", start: 760.0, el: (d) => <RawShot durationInFrames={d} src={T("es_humo_zigzag_banco")} hue="amber" kicker="Caño de chapa en zigzag" /> },
  { key: "s93", start: 769.8, el: (d) => <FirePathDiorama durationInFrames={d} eyebrow="El recorrido del fuego" title="Cómo viaja el calor" /> },
  { key: "s94", start: 789.9, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("es_chimenea_tibia_mano")} imageDarken={0.66} tokens={[{ t: "La chimenea: " }, { t: "tibia", good: true }, { t: ", no caliente" }]} /> },
  { key: "s95", start: 796.4, el: (d) => <RawShot durationInFrames={d} src={T("es_chimenea_tibia_mano")} hue="cold" kicker="Si está caliente, perdiste energía" /> },
  { key: "s96", start: 800.1, el: (d) => <StatBig durationInFrames={d} value={50} suffix="°C" label="el banco, ideal para sentarse" eyebrow="La chimenea tibia, el banco" accent="cold" hue="cold" /> },
  { key: "s96b", start: 810.0, el: (d) => <RawShot durationInFrames={d} src={T("es_banco_sentarse_corea")} hue="amber" kicker="China · Corea · Alemania · 2000 años" /> },

  // ════════════ CONSTRUCCIÓN · 3 días (13:42–15:07) ════════════
  { key: "b97", start: 821.9, el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="3 días · paso a paso" title="La construcción, día a día" worldImage={T("es_galpon_caliente_interior")} waypoints={[
    { x: 600, y: 850, z: 0.7, image: T("es_moldes_ladrillos"), label: "Día 1 · Moldes + 1ª capa", num: "1", dwell: 6, travel: 2.5 },
    { x: 1650, y: 480, z: 0.45, image: T("es_aplicando_capa_barro"), label: "Día 2 · 2ª capa, alisar", num: "2", dwell: 6, travel: 3 },
    { x: 2700, y: 1050, z: 0.8, image: T("es_caños_dia3_encaje"), label: "Día 3 · Encajar los caños", num: "3", dwell: 6, travel: 3 },
    { x: 3750, y: 520, z: 0.5, image: T("es_secado_curado_grietas"), label: "Secar 1 semana al aire", num: "4", dwell: 6, travel: 3 },
    { x: 4800, y: 980, z: 0.7, image: T("es_primer_fuego_chico"), label: "Curar con fuego chico", num: "5", dwell: 6, travel: 3 },
  ]} /> },
  { key: "b101", start: 869.4, el: (d) => <KineticQuote durationInFrames={d} image={T("es_grieta_vapor_estufa")} eyebrow="Si la prendés antes" words={parseQuote("El vapor te *raja* la estufa")} accent="danger" hue="red" /> },
  { key: "b102", start: 875.2, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Esto es " }, { t: "paciencia", hl: true }, { t: " y nada más" }]} /> },
  { key: "b103", start: 881.4, el: (d) => <ProcessSteps durationInFrames={d} eyebrow="Curar la mezcla" title="Encendidos progresivos" orientation="horizontal" accent="good" hue="amber" steps={[{ title: "Día 8", desc: "Fuego chico, 10 min", image: T("es_primer_fuego_chico") }, { title: "Día 9", desc: "Un poco más", image: T("es_estufa_fuego_eficiente") }, { title: "Día 10", desc: "Uso normal", image: T("es_estufa_uso_diario") }]} /> },
  { key: "b104", start: 894.8, el: (d) => <RawShot durationInFrames={d} src={T("es_primer_fuego_chico")} hue="amber" kicker="Cura como cerámica" /> },
  { key: "b105", start: 901.0, el: (d) => <RawShot durationInFrames={d} src={T("es_estufa_uso_diario")} hue="amber" kicker="3 veces al día · 40 años" /> },

  // ════════════ COSTO TOTAL (15:07–16:30) ════════════
  { key: "k106", start: 907.4, el: (d) => <Checklist durationInFrames={d} eyebrow="El costo total" title="Qué pagás" items={[{ text: "Tierra — gratis del terreno", state: "done" }, { text: "Arena — una pizza", state: "done" }, { text: "Paja — la mitad de eso", state: "done" }, { text: "Caños de chapa — lo más caro", state: "doing" }]} accent="good" /> },
  { key: "k107", start: 928.2, el: (d) => <RawShot durationInFrames={d} src={T("es_garrafa_corralon_fila")} hue="amber" kicker="≈ una carga grande de garrafa" /> },
  { key: "k108", start: 940.4, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Menos que " }, { t: "2 meses", hl: true }, { t: " de gas" }]} /> },
  { key: "k109", start: 949.0, el: (d) => <StatBig durationInFrames={d} value={240} suffix=" meses" label="40 años × 6 meses de invierno" eyebrow="Hagamos la cuenta" accent="amber" hue="amber" /> },
  { key: "k110", start: 962.5, el: (d) => <ImpactReveal durationInFrames={d} image={T("es_taza_cafe")} setup="El costo mensual, para siempre" impact="UNA TAZA DE CAFÉ" impactAccent="good" hitAt={1.1} boom={1} /> },
  { key: "k111", start: 974.3, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("es_factura_gas")} imageDarken={0.62} title="Sin nada de esto" chips={["Sin factura", "Sin garrafa", "Sin cortes", "Sin aumentos"]} hue="amber" /> },

  // ════════════ MÁS ALLÁ DEL BOLSILLO (16:30–18:13) ════════════
  { key: "y112", start: 990.2, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Esto va " }, { t: "más allá", hl: true }, { t: " del bolsillo" }]} /> },
  { key: "y113", start: 996.4, el: (d) => <KineticQuote durationInFrames={d} image={T("es_casa_paredes_finas")} eyebrow="Las casas de acá" words={parseQuote("Diseñadas suponiendo *gas barato*")} accent="danger" hue="red" /> },
  { key: "y114", start: 1003.6, el: (d) => <SplitList durationInFrames={d} title="Casas sin" items={["Masa térmica", "Orientación al sol", "Aislación seria"]} accent={RD} cross /> },
  { key: "y115", start: 1012.1, el: (d) => <RawShot durationInFrames={d} src={T("es_casa_moderna_fria")} hue="cold" kicker="Todo depende de la red de gas" /> },
  { key: "y116", start: 1020.9, el: (d) => <KineticQuote durationInFrames={d} image={T("es_habitacion_fria_aliento")} eyebrow="Sin gas" words={parseQuote("Casas que son *carpas* con paredes de ladrillo")} accent="danger" hue="red" /> },
  { key: "y117", start: 1035.0, el: (d) => <RawShot durationInFrames={d} src={T("es_caloventor_electrico")} hue="red" kicker="La salida del sistema: comprar más" /> },
  { key: "y118", start: 1043.7, el: (d) => <ChipsCluster durationInFrames={d} title="Pagar todos los meses" chips={["Garrafa", "Caloventores", "Catalíticas"]} hue="red" /> },
  { key: "y119", start: 1049.7, el: (d) => <RawShot durationInFrames={d} src={T("es_casa_1920_masa_termica")} hue="amber" kicker="Los que construían antes del gas" /> },
  { key: "y120", start: 1058.0, el: (d) => <KineticQuote durationInFrames={d} image={T("es_casa_vieja_estufa_masiva")} eyebrow="Años 20 y 30" words={parseQuote("Una *masa térmica* que devolvía el calor")} accent="good" hue="amber" /> },
  { key: "y121", start: 1072.4, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "La rocket es esa idea, " }, { t: "moderna", good: true }]} /> },
  { key: "y122", start: 1081.5, el: (d) => <ImpactReveal durationInFrames={d} image={T("es_estufa_fuego_eficiente")} setup="No es alternativa hippie" impact="ES INGENIERÍA" impactAccent="amber" hitAt={1.0} boom={2} /> },

  // ════════════ LOS QUE SABÍAN (18:13–19:14) ════════════
  { key: "a123", start: 1093.4, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Los que construyeron este país " }, { t: "sabían", hl: true }]} /> },
  { key: "a124", start: 1098.1, el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="Los que construyeron este país" title="Sabían estas cosas" worldImage={T("es_galpon_exterior")} waypoints={[
    { x: 600, y: 800, z: 0.65, image: T("es_cocina_economica_hierro"), label: "Mi abuelo · Junín", num: "1", dwell: 4.5, travel: 2.8 },
    { x: 1600, y: 500, z: 0.45, image: T("es_quemador_aserrin"), label: "Mi tío · Bariloche", num: "2", dwell: 4.5, travel: 3 },
    { x: 2600, y: 1000, z: 0.8, image: T("es_manos_barro_generacion"), label: "Las manos que sabían", num: "3", dwell: 4.5, travel: 3 },
    { x: 3550, y: 560, z: 0.55, image: T("es_casa_1920_masa_termica"), label: "Sabían retener el calor", num: "4", dwell: 4.5, travel: 3 },
  ]} /> },
  { key: "a127", start: 1128.1, el: (d) => <KineticQuote durationInFrames={d} image={T("es_galpon_exterior")} eyebrow="Nuestra generación" words={parseQuote("Olvidó casi *todo* eso")} accent="danger" hue="cold" /> },
  { key: "a128", start: 1139.1, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "El gas ya " }, { t: "no", danger: true }, { t: " es barato" }]} /> },
  { key: "a129", start: 1144.1, el: (d) => <KineticQuote durationInFrames={d} image={T("es_pampa_tierra_oscura")} eyebrow="Tenemos que recordarlo" words={parseQuote("*nosotros*, los del terreno con tierra")} accent="good" hue="amber" /> },

  // ════════════ COMUNIDAD + OUTRO (19:14–20:56) ════════════
  { key: "z130", start: 1154.0, el: (d) => <RawShot durationInFrames={d} src={T("es_comentarios_mapa")} hue="cold" kicker="¿De qué zona sos?" /> },
  { key: "z131", start: 1160.1, el: (d) => <RawShot durationInFrames={d} src={T("es_frascos_tierra_zonas")} hue="amber" kicker="Pampa: tierra buena para esto" /> },
  { key: "z132", start: 1171.3, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Cuyo: hay que conseguir " }, { t: "arcilla", hl: true }]} /> },
  { key: "z133", start: 1177.8, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Norte colorado: " }, { t: "más arena", hl: true }]} /> },
  { key: "z134", start: 1186.8, el: (d) => <RawShot durationInFrames={d} src={T("es_telefono_comentarios")} hue="cold" kicker="Armamos un mapa entre todos" /> },
  { key: "z135", start: 1196.5, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Mejor que cualquier " }, { t: "manual", good: true }]} /> },
  { key: "z136", start: 1202.8, el: (d) => <RawShot durationInFrames={d} src={T("es_enero_calor_pampa")} hue="amber" kicker="La próxima: lo del verano" /> },
  { key: "z137", start: 1218.0, el: (d) => <RawShot durationInFrames={d} src={T("es_enfriador_caja_persa")} hue="cold" kicker="Caja + barro + trapo mojado" /> },
  { key: "z137b", start: 1226.0, el: (d) => <RawShot durationInFrames={d} src={V("es_trapo_mojado_enfriador")} hue="cold" kicker="−15 °C, sin enchufar nada" /> },
  { key: "z138", start: 1233.0, el: (d) => <InfiniteZoom durationInFrames={d} images={[
    { src: T("es_estufa_rincon_galpon"), label: "La estufa" },
    { src: T("es_camara_interna_fuego"), label: "El fuego" },
    { src: T("es_chimenea_columna_vapor"), label: "Solo vapor" },
    { src: T("es_banco_masa_corte"), label: "El banco de barro" },
    { src: T("es_cierre_estufa_invierno"), label: "46 inviernos" },
  ]} /> },
  { key: "z139", start: 1245.8, el: (d) => <KineticQuote durationInFrames={d} image={T("es_cierre_estufa_invierno")} eyebrow="Hasta entonces, cuidate" words={parseQuote("Sabían cosas que estamos *empezando a recordar*")} accent="good" hue="amber" /> },
];

// dur de cada cue = inicio del siguiente − el suyo (último hasta el final)
const CUES: Cue[] = C.map((c, i) => ({
  ...c,
  dur: (i < C.length - 1 ? C[i + 1].start : 1256) - c.start,
}));

// whoosh suave SOLO en cambios de sección (RuleNumber / ProcessSteps de arranque)
const SECTION_KEYS = new Set(["r1", "r2", "r3", "r4", "r5"]);

// ── Cronograma del AVATAR (variedad de posiciones; el video provee el audio) ──
// Solo aparece sobre ventanas de b-roll/foto (no tapa tarjetas de texto). Cada
// modo persiste hasta la siguiente entrada. Default = hidden (b-roll a full).
const AVATAR_WINDOWS: AvatarWindow[] = [
  { start: 0, mode: "hidden" },        // HOOK + title-card + ImpactReveal mandan
  { start: 70.7, mode: "cornerTR" },   // a partir de acá el presentador está PRESENTE casi siempre (PiP)
  { start: 106.7, mode: "full" },      // "mi nombre no importa, 32 años construyendo"
  { start: 111.4, mode: "cornerTR" },
  { start: 233.3, mode: "hidden" },    // ImpactReveal "CERO"
  { start: 238.2, mode: "cornerTR" },
  { start: 416.3, mode: "hidden" },    // DIAGRAMA masa térmica (trae su propio avatar)
  { start: 428.7, mode: "cornerTR" },
  { start: 465.4, mode: "hidden" },    // ImpactReveal "Y NADIE LO CUENTA"
  { start: 470.0, mode: "cornerTR" },
  { start: 489.3, mode: "right" },     // materiales: avatar DERECHA, tierra IZQUIERDA
  { start: 497.1, mode: "cornerTR" },
  { start: 524.2, mode: "hidden" },    // DIAGRAMA prueba del frasco
  { start: 535.0, mode: "cornerTR" },
  { start: 668.5, mode: "hidden" },    // ImpactReveal "CON PAJA, UNA VIDA"
  { start: 674.7, mode: "cornerTR" },
  { start: 681.2, mode: "hidden" },    // DIAGRAMA receta
  { start: 689.2, mode: "cornerTR" },
  { start: 719.3, mode: "hidden" },    // DIAGRAMA 4 partes
  { start: 735.8, mode: "cornerTR" },
  { start: 928.2, mode: "left" },      // costo: avatar IZQUIERDA, garrafa DERECHA
  { start: 940.4, mode: "cornerTR" },
  { start: 962.5, mode: "hidden" },    // ImpactReveal "UNA TAZA DE CAFÉ"
  { start: 974.3, mode: "cornerTR" },
  { start: 1081.5, mode: "hidden" },   // ImpactReveal "ES INGENIERÍA"
  { start: 1086.0, mode: "cornerTR" },
  { start: 1245.8, mode: "full" },     // cierre emotivo a pantalla completa
  { start: 1256, mode: "hidden" },
];

// camas ambientales loopables (vol bajo) por mood de sección — gran inmersión
const AMBIENT: { from: number; to: number; src: string; vol: number }[] = [
  { from: 0, to: 480, src: "sfx/amb_fuego.mp3", vol: 0.1 }, // estufa/fuego/física
  { from: 480, to: 990, src: "sfx/amb_taller.mp3", vol: 0.11 }, // materiales/forma/construcción
  { from: 990, to: 1093, src: "sfx/amb_invierno.mp3", vol: 0.12 }, // casas frías
  { from: 1093, to: 1154, src: "sfx/amb_taller.mp3", vol: 0.1 }, // los que sabían
  { from: 1154, to: 1256, src: "sfx/amb_campo.mp3", vol: 0.11 }, // comunidad/verano/cierre
];

export const MainEstufa: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {/* camas ambientales debajo de todo (fuera del grado, son audio) */}
      {AMBIENT.map((a, i) => (
        <Sequence key={"amb" + i} from={sec(a.from)} durationInFrames={sec(a.to - a.from)} layout="none">
          <Audio src={staticFile(a.src)} volume={a.vol} loop />
        </Sequence>
      ))}
      {/* TODA la imagen pasa por el grado cinematográfico (grano/viñeta/handheld/polvo) */}
      <CinematicWrap handheld={0.8} grain={0.06}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {/* AVATAR encima del b-roll (provee el audio de la narración siempre) */}
          <AvatarLayer src="estufa_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {/* color-grade por sección (sobre todo, bajo el grano) */}
          <SectionGrade ranges={GRADE} />
          {/* whip + light-leak en cada cambio de sección */}
          {CUES.filter((c) => SECTION_KEYS.has(c.key)).map((c) => (
            <Sequence key={"stg" + c.key} from={sec(c.start) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      {/* cambio de sección: swell cálido + golpe grave */}
      {CUES.filter((c) => SECTION_KEYS.has(c.key)).map((c) => (
        <SfxCue key={"sw" + c.key} at={sec(c.start) - sec(0.4)} src={SFX.sectionSwell} volume={0.4} durationInFrames={sec(2)} />
      ))}
      {CUES.filter((c) => SECTION_KEYS.has(c.key)).map((c) => (
        <SfxCue key={"st" + c.key} at={sec(c.start)} src={SFX.stingerHit} volume={0.42} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
