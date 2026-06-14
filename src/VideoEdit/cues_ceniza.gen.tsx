// cues_ceniza.gen.tsx — GENERADO por beatsheet.mjs desde ceniza.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/ceniza.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { ChipsCluster } from "./scenes/ReframeContent";
import { SplitList } from "./scenes/SplitList";
import { StatBig } from "./scenes/StatBig";
import { ImpactReveal } from "./scenes/ImpactReveal";
import { JourneyCanvas } from "./scenes/JourneyCanvas";
import { FloatingInsert } from "./scenes/FloatingInsert";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { AgedDoc } from "./scenes/AgedDoc";
import { BarCompare } from "./scenes/BarCompare";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { Checklist } from "./scenes/Checklist";
import { AnnotatedImage } from "./scenes/AnnotatedImage";

const A = COLORS.accent, D = COLORS.danger, G = COLORS.good;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "intro_0", start: 0.12, dur: 10.09, kind: "impact", el: (d) => <ImpactReveal durationInFrames={d} image="img/cz_ceniza_mano.png" impact="ES DE LO MÁS VALIOSO QUE TIENE" setup="Esto que usted tira a la basura…" impactAccent="danger" hitAt={1.1} /> },
  { key: "intro_1", start: 10.21, dur: 5.51, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/cz_fogon_apagado.mp4" hue="amber" kicker="La ceniza del fogón" /> },
  { key: "intro_2", start: 15.72, dur: 4.03, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/cz_tacho_ceniza.png" side="right" kicker="Yo la guardo como oro gris" hue="amber" /> },
  { key: "intro_3", start: 19.75, dur: 5.51, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/cz_ceniza_oro.mp4" hue="amber" /> },
  { key: "intro_4", start: 25.26, dur: 9.08, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_huerta_tomates.png" words={parseQuote("Está tirando fertilizante, limpiador, veneno contra plagas… *gratis*.")} hue="amber" /> },
  { key: "intro_5", start: 34.34, dur: 8.64, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={7} label="productos que reemplaza, gratis" eyebrow="Una sola ceniza" accent="amber" hue="amber" /> },
  { key: "intro_6", start: 42.98, dur: 5.19, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_vivero_bolsa.png" hue="amber" kicker="Lo que después paga en el vivero" /> },
  { key: "intro_7", start: 48.17, dur: 6.48, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_balde_tirar.png" hue="amber" kicker="Y la gente la tira" /> },
  { key: "intro_8", start: 54.65, dur: 8.65, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"No"},{"t":"tires"},{"t":"la"},{"t":"ceniza","hl":true}]} eyebrow="Lo que la gente de antes nunca desperdiciaba" hue="amber" bg="image" image="img/cz_ceniza_oro.png" /> },
  { key: "tomas_0", start: 63.3, dur: 15.28, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/cz_casa_campo.mp4" hue="blue" kicker="Hace veinte años dejé la ciudad" /> },
  { key: "tomas_1", start: 78.58, dur: 7.07, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_manos_ceniza.png" words={parseQuote("Me pregunté: ¿de verdad esto no sirve para *nada*? Y servía para todo.")} hue="blue" /> },
  { key: "tomas_2", start: 85.65, dur: 6.06, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/cz_shovel_ash.mp4" hue="blue" /> },
  { key: "tomas_3", start: 91.71, dur: 8.07, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="No desperdiciar nada" lines={[{"text":"Cuando uno vive lejos,"},{"text":"cada cosa que tira la tiene que ir a comprar lejos y caro."}]} image="img/cz_galpon_campo.png" hue="blue" /> },
  { key: "tomas_4", start: 99.78, dur: 17.17, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/cz_hombre_huerta.mp4" hue="blue" /> },
  { key: "quees_0", start: 116.95, dur: 5.98, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"¿Qué"},{"t":"es"},{"t":"la"},{"t":"ceniza","hl":true},{"t":"?"}]} eyebrow="Entendé esto y todo se vuelve obvio" hue="amber" bg="image" image="img/cz_lena_arde2.png" /> },
  { key: "quees_1", start: 122.93, dur: 5.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/cz_arbol_grande.mp4" hue="amber" kicker="El árbol sacó minerales toda su vida" /> },
  { key: "quees_2", start: 128.32, dur: 15.25, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/dg_cz_minerales.png" hue="amber" zoom={[1,1.05]} /> },
  { key: "quees_3", start: 143.57, dur: 6.28, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_ceniza_fina2.png" words={parseQuote("La ceniza es, literalmente, el árbol reducido a sus *minerales* puros.")} hue="amber" /> },
  { key: "quees_4", start: 149.85, dur: 6.58, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="La ceniza tiene dos caras" items={["Rica en minerales que alimentan","Alcalina y fuerte: hay que saber usarla"]} accent={A} /> },
  { key: "quees_5", start: 156.43, dur: 3.77, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_ceniza_textura.png" hue="amber" kicker="Minerales puros" /> },
  { key: "huerta_0", start: 160.2, dur: 11.78, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"El"},{"t":"rey"},{"t":":"},{"t":"la"},{"t":"huerta","hl":true}]} eyebrow="Fertilizante de potasio gratis" hue="blue" bg="image" image="img/cz_huerta_grande.png" /> },
  { key: "huerta_1", start: 171.98, dur: 10.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/cz_potasio_fruto.mp4" hue="blue" kicker="Más flores, más frutos" /> },
  { key: "huerta_2", start: 182.58, dur: 6.23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_tomates_canasta.png" hue="blue" /> },
  { key: "huerta_3", start: 188.81, dur: 25.21, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/cz_spread_ash.mp4" hue="blue" kicker="Finita, repartida" /> },
  { key: "huerta_4", start: 214.02, dur: 25.22, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/dg_cz_plantas.png" hue="blue" zoom={[1,1.05]} /> },
  { key: "huerta_5", start: 239.24, dur: 9.88, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/cz_tomate_ajo.png" title="Aman la ceniza" chips={["tomates","ajos y cebollas","coles","frutales"]} hue="amber" /> },
  { key: "huerta_6", start: 249.12, dur: 10.88, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="La odian (tierra ácida)" items={["Arándanos y azaleas","Hortensias","Papas"]} accent={D} cross /> },
  { key: "huerta_7", start: 260, dur: 16.73, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_cantero.png" words={parseQuote("Saber esta lista es la diferencia entre un regalo y un *desastre*.")} hue="blue" /> },
  { key: "huerta_8", start: 276.73, dur: 21.51, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/cz_balde_volcado.png" annotations={[{"kind":"circle","x":50,"y":45,"label":"Nunca un balde entero"},{"kind":"circle","x":50,"y":78,"label":"Poca, fina, repartida"}]} caption="El error que mata la tierra" hue="blue" /> },
  { key: "huerta_9", start: 298.24, dur: 10.04, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_espolvorear_tomate.png" hue="blue" kicker="Finita, repartida" /> },
  { key: "injerto1_0", start: 308.28, dur: 15.49, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Uno de 35 sistemas" lines={[{"text":"Cuánta ceniza por metro, cada cuánto,"},{"text":"qué cultivo la ama y cuál la odia,"},{"text":"todo medido en mi propia huerta."}]} image="img/cz_cuaderno.png" hue="amber" /> },
  { key: "injerto1_1", start: 323.77, dur: 14.19, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/cz_manual.png" side="left" kicker="Todo junto en el manual" hue="amber" /> },
  { key: "injerto1_2", start: 337.96, dur: 7.54, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_cocina_campo.png" words={parseQuote("Pero quédese, que la ceniza sirve para mucho más que la *huerta*.")} hue="amber" /> },
  { key: "guardar_0", start: 345.5, dur: 10.38, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Guardar la ceniza" items={[{"text":"Fría y seca, nunca con brasas","state":"done"},{"text":"Tacho de metal con tapa","state":"done"},{"text":"Tamizada (sin carboncitos)","state":"done"}]} hue="red" /> },
  { key: "guardar_1", start: 355.88, dur: 2.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_pala_estufa.png" hue="red" kicker="Fría, nunca con brasas" /> },
  { key: "guardar_2", start: 358.43, dur: 3.63, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_brasa_peligro.png" hue="red" kicker="Una brasa aguanta horas" /> },
  { key: "guardar_3", start: 362.06, dur: 10.31, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/cz_sift_ash.mp4" hue="red" kicker="Tamizar la fina" /> },
  { key: "guardar_4", start: 372.37, dur: 3.64, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_tacho_metal.png" hue="red" /> },
  { key: "guardar_5", start: 376.01, dur: 19.51, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_tamiz_ceniza.png" hue="red" kicker="Tamizar la fina" /> },
  { key: "limpieza_0", start: 395.52, dur: 2.78, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"El"},{"t":"polvo"},{"t":"de"},{"t":"fregar","hl":true}]} eyebrow="El limpiador de las abuelas" hue="amber" bg="image" image="img/cz_olla_quemada.png" /> },
  { key: "limpieza_1", start: 398.3, dur: 7.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/cz_scrub_pot.mp4" hue="amber" kicker="Arranca lo quemado sin rayar" /> },
  { key: "limpieza_2", start: 405.38, dur: 2.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_vidrio_hollin.png" hue="amber" kicker="Vidrio con hollín" /> },
  { key: "limpieza_3", start: 407.46, dur: 7.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/cz_clean_glass.mp4" hue="amber" kicker="Diario húmedo + ceniza" /> },
  { key: "limpieza_4", start: 414.54, dur: 2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_olla_quemada2.png" hue="amber" kicker="El fondo quemado" /> },
  { key: "limpieza_5", start: 416.54, dur: 4.76, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Diario húmedo","image":"img/cz_diario_humedo.png"},{"title":"En la ceniza","image":"img/cz_papel_ceniza.png"},{"title":"Frotar el vidrio","image":"img/cz_frotar_vidrio.png"},{"title":"Transparente","image":"img/cz_vidrio_limpio.png"}]} title="Limpiar el vidrio" hue="amber" /> },
  { key: "limpieza_6", start: 421.3, dur: 3.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_diario_bollo.png" hue="amber" kicker="Diario húmedo" /> },
  { key: "limpieza_7", start: 425.02, dur: 6.2, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_plata_bronce.png" words={parseQuote("Era el limpiapisos, el limpia ollas y el quitamanchas, todo en *uno*.")} hue="amber" /> },
  { key: "limpieza_8", start: 431.22, dur: 6.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_vidrio_estufa.png" hue="amber" kicker="Queda transparente" /> },
  { key: "limpieza_9", start: 437.9, dur: 7.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_cuchara_plata.png" hue="amber" kicker="Pule la plata" /> },
  { key: "plagas_0", start: 445.88, dur: 7.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/cz_slug.mp4" hue="blue" kicker="Se comen los plantines" /> },
  { key: "plagas_1", start: 453.04, dur: 20.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_anillo_ceniza.png" hue="blue" kicker="Una barrera de ceniza" /> },
  { key: "plagas_2", start: 473.33, dur: 6.14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_anillo_babosa.png" hue="blue" kicker="Un anillo de ceniza" /> },
  { key: "plagas_3", start: 479.47, dur: 13.16, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/cz_barrera_babosa.png" annotations={[{"kind":"circle","x":50,"y":40,"label":"Seca y abrasiva"},{"kind":"circle","x":50,"y":75,"label":"Renovar tras la lluvia"}]} caption="Por qué no cruzan" hue="blue" /> },
  { key: "plagas_4", start: 492.63, dur: 10.23, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_plantin_sano.png" words={parseQuote("Sin un veneno que mate a las abejas y los *sapos*, que son sus amigos.")} hue="blue" /> },
  { key: "otros_0", start: 502.86, dur: 5.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_camino_helado.png" hue="amber" kicker="Invierno: hielo resbaladizo" /> },
  { key: "otros_1", start: 508.74, dur: 19.97, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/cz_ice_melt.mp4" hue="amber" kicker="Derrite y da agarre" /> },
  { key: "otros_2", start: 528.71, dur: 7.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/cz_hen_dust.mp4" hue="amber" kicker="El baño de polvo de las gallinas" /> },
  { key: "otros_3", start: 535.76, dur: 6.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_gallina_polvo2.png" hue="amber" kicker="El baño de las gallinas" /> },
  { key: "otros_4", start: 542.72, dur: 11.04, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/cz_jabon_lejia.png" title="Y todavía más" chips={["deshiela el invierno","baño de las gallinas","lejía para jabón"]} hue="amber" /> },
  { key: "otros_5", start: 553.76, dur: 6.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_ceniza_hielo2.png" hue="amber" kicker="Derrite y da agarre" /> },
  { key: "tierra_0", start: 560.72, dur: 8.95, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_tierra_acida.png" words={parseQuote("Solo si su tierra es *ácida*. Si ya es alcalina, la ceniza la mata.")} hue="blue" /> },
  { key: "tierra_1", start: 569.67, dur: 21.75, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/dg_cz_test.png" hue="blue" zoom={[1,1.05]} /> },
  { key: "tierra_2", start: 591.42, dur: 12.79, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Dos puñados de tierra","image":"img/cz_dos_vasos.png"},{"title":"Uno con vinagre","image":"img/cz_vinagre.png"},{"title":"Otro con bicarbonato","image":"img/cz_bicarbonato.png"},{"title":"Mira cuál burbujea","image":"img/cz_burbujeo.png"}]} title="Prueba casera del pH" hue="blue" /> },
  { key: "tierra_3", start: 604.21, dur: 7.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_septimo_uso.png" hue="blue" kicker="Hasta desodoriza y conserva" /> },
  { key: "tierra_4", start: 611.88, dur: 10.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_vinagre_botella.png" hue="blue" kicker="Vinagre → alcalina" /> },
  { key: "tierra_5", start: 622.66, dur: 2.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_bicarbonato_cuchara.png" hue="blue" kicker="Bicarbonato → ácida" /> },
  { key: "tierra_6", start: 625.54, dur: 22.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cf_tierra_burbujea.png" hue="blue" kicker="Si burbujea…" /> },
  { key: "injerto2_0", start: 647.98, dur: 8.08, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"¿Por"},{"t":"qué"},{"t":"nadie"},{"t":"te"},{"t":"lo"},{"t":"enseña","hl":true},{"t":"?"}]} eyebrow="La parte incómoda" hue="red" bg="image" image="img/cz_gondola_productos.png" /> },
  { key: "injerto2_1", start: 656.06, dur: 20.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_siete_productos.png" hue="red" kicker="Siete productos comprados" /> },
  { key: "injerto2_2", start: 676.65, dur: 10.1, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Ceniza gratis","value":1},{"label":"Productos comprados","value":7}]} title="Lo que reemplaza una ceniza gratis" hue="red" /> },
  { key: "injerto2_3", start: 686.75, dur: 9.31, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_dinero.png" words={parseQuote("Con la ceniza gratis no se gana *dinero*. Por eso nadie te lo cuenta.")} hue="red" /> },
  { key: "injerto2_4", start: 696.06, dur: 10.64, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Por eso junté todo" lines={[{"text":"Treinta y cinco sistemas, ordenados y probados,"},{"text":"para devolverle el saber que le sacaron."}]} image="img/cz_manual2.png" hue="red" /> },
  { key: "preguntas_0", start: 706.7, dur: 12.2, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="¿Qué ceniza puedo usar?" items={["Solo madera natural y limpia","Nunca pintada ni tratada","Nunca carbón con químicos"]} accent={G} /> },
  { key: "preguntas_1", start: 718.9, dur: 9.97, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_lena_limpia.png" hue="amber" kicker="Madera limpia, ceniza limpia" /> },
  { key: "preguntas_2", start: 728.87, dur: 11.64, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_tacho_guardar.png" words={parseQuote("Guárdela seca: seca conserva todo su *poder*.")} hue="amber" /> },
  { key: "preguntas_3", start: 740.51, dur: 9.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_punado_fino.png" hue="amber" kicker="Menos es más" /> },
  { key: "preguntas_4", start: 750.49, dur: 11.09, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/cz_usos_juntos.png" title="Una sola cosa para" chips={["la huerta","la limpieza","las plagas","el hielo"]} hue="blue" /> },
  { key: "panorama_0", start: 761.58, dur: 19.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/dg_cz_ciclo.png" hue="blue" zoom={[1,1.05]} /> },
  { key: "panorama_1", start: 781.14, dur: 6.09, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_arbol_ciclo.png" words={parseQuote("Del suelo al árbol, del árbol al fuego, de la ceniza de vuelta al *suelo*.")} hue="blue" /> },
  { key: "panorama_2", start: 787.23, dur: 14.77, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/cz_campo_amplio.mp4" hue="blue" /> },
  { key: "panorama_3", start: 802, dur: 6.38, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="En la naturaleza" items={["Nada es basura","Todo es alimento de otra cosa","Recuperar esa mirada cambia todo"]} accent={A} /> },
  { key: "accion_0", start: 808.38, dur: 7.22, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="A partir de hoy" items={[{"text":"No tire más la ceniza limpia","state":"done"},{"text":"Un tacho de metal con tapa","state":"done"},{"text":"Pruebe el vidrio de la estufa","state":"done"},{"text":"Déle a sus tomates","state":"done"}]} hue="amber" /> },
  { key: "accion_1", start: 815.6, dur: 4.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_guardar_hoy.png" hue="amber" /> },
  { key: "accion_2", start: 819.94, dur: 14.73, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_prueba_vidrio.png" hue="amber" kicker="La prueba que convence" /> },
  { key: "accion_3", start: 834.67, dur: 13.87, kind: "journey", el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="Empiece chico" title="Deje que la ceniza le demuestre" waypoints={[{"x":0,"y":0,"z":0,"image":"img/cz_jrn_tacho.png","label":"Guardar","num":"1","dwell":2.4,"travel":1.5},{"x":1.2,"y":-0.3,"z":0.3,"image":"img/cz_jrn_vidrio.png","label":"Limpiar","num":"2","dwell":2.4,"travel":1.5},{"x":2.4,"y":0.2,"z":-0.2,"image":"img/cz_jrn_huerta.png","label":"Fertilizar","num":"3","dwell":2.4,"travel":1.5},{"x":3.6,"y":-0.2,"z":0.2,"image":"img/cz_jrn_tomate.png","label":"Cosechar","num":"4","dwell":2.6,"travel":1.4}]} /> },
  { key: "accion_4", start: 848.54, dur: 4.14, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_observar.png" words={parseQuote("Empiece chico, observe, y deje que le demuestre sola lo que *vale*.")} hue="amber" /> },
  { key: "injerto3_0", start: 852.68, dur: 8.19, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Todo en el manual" lines={[{"text":"La tabla de cultivos, las cantidades,"},{"text":"cómo medir el pH, las recetas de limpieza,"},{"text":"la barrera contra babosas paso a paso."}]} image="img/cz_manual_abierto.png" hue="red" /> },
  { key: "injerto3_1", start: 860.87, dur: 17.41, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_huerta_prospera.png" hue="red" /> },
  { key: "injerto3_2", start: 878.28, dur: 8.53, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Por separado","value":158},{"label":"Hoy","value":27}]} title="El precio de hoy" hue="red" /> },
  { key: "injerto3_3", start: 886.81, dur: 11.69, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_tomate_mano.png" words={parseQuote("Si no es para usted, le devuelvo cada centavo. El riesgo lo pongo *yo*.")} hue="red" /> },
  { key: "cierre_0", start: 898.5, dur: 8.45, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_compost.png" words={parseQuote("Mire el mundo como un ciclo donde nada *sobra*.")} hue="blue" /> },
  { key: "cierre_1", start: 906.95, dur: 7.25, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/cz_manos_tierra.mp4" hue="blue" /> },
  { key: "cierre_2", start: 914.2, dur: 8.04, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Saca"},{"t":"las"},{"t":"ratas"},{"t":"con"},{"t":"$1","hl":true}]} eyebrow="La próxima vez" hue="blue" bg="image" image="img/cz_galpon_rata.png" /> },
  { key: "cierre_3", start: 922.24, dur: 20.53, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/cz_gallinero.png" hue="blue" kicker="Sin veneno, sin trampas" /> },
  { key: "cierre_4", start: 942.77, dur: 1.65, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/cz_oficio2.png" words={parseQuote("No es magia. Es *oficio*. Y todavía se puede aprender.")} hue="blue" /> },
  { key: "cierre_5", start: 944.42, dur: 4.01, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/cz_ceniza_final.mp4" hue="blue" /> },
];

export const REFRAME: { start: number; end: number }[] = [];
