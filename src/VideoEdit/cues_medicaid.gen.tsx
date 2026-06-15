// cues_medicaid.gen.tsx — GENERADO por beatsheet.mjs desde medicaid.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/medicaid.json
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { ChipsCluster } from "./scenes/ReframeContent";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { StatBig } from "./scenes/StatBig";
import { JourneyCanvas } from "./scenes/JourneyCanvas";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { BarCompare } from "./scenes/BarCompare";
import { CrossSection } from "./scenes/CrossSection";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { Checklist } from "./scenes/Checklist";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { CalloutMark } from "./scenes/CalloutMark";
import { InfiniteZoom } from "./scenes/InfiniteZoom";
import { EstateRecoveryLetter } from "./scenes/EstateRecoveryLetter";
import { TwoMomentsSplit } from "./scenes/TwoMomentsSplit";
import { MistakeCard } from "./scenes/MistakeCard";
import { GoldVault } from "./scenes/GoldVault";
import { LookbackTimeline } from "./scenes/LookbackTimeline";
import { ProtectionTool } from "./scenes/ProtectionTool";
import { DeedStamp } from "./scenes/DeedStamp";
import { CostOdometer } from "./scenes/CostOdometer";
import { SignaturePhrase } from "./scenes/SignaturePhrase";
import { MedicareVsMedicaid } from "./scenes/MedicareVsMedicaid";
import { ActionStepCard } from "./scenes/ActionStepCard";
import { NextVideoEndcard } from "./scenes/NextVideoEndcard";

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hook_1", start: 9.79, dur: 5.01, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_casa_ext.mp4" hue="amber" /> },
  { key: "hook_2", start: 14.8, dur: 4.51, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_llaves_casa.png" hue="blue" /> },
  { key: "hook_3", start: 19.31, dur: 10.8, kind: "infzoom", el: (d) => <InfiniteZoom durationInFrames={d} images={[{"src":"img/rb_casa_pagada.png"},{"src":"img/rb_llaves_casa.png"},{"src":"img/rb_pareja_mayor_casa.png"}]} /> },
  { key: "hook_4", start: 30.11, dur: 11.58, kind: "estateletter", el: (d) => <EstateRecoveryLetter durationInFrames={d} amount="$180,000" eyebrow="Recuperación de bienes de Medicaid" label="EL ESTADO RECLAMA" hitAt={50} /> },
  { key: "hook_5", start: 41.69, dur: 6.01, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_carta_abre.mp4" hue="blue" kicker="Una carta del gobierno" /> },
  { key: "hook_6", start: 47.7, dur: 15.43, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/hook_6.mp4" pages={[{"image":"img/dg_med_recovery.png","eyebrow":"Lo que hace Medicaid"}]} /> },
  { key: "hook_7", start: 63.13, dur: 10.03, kind: "goldvault", el: (d) => <GoldVault durationInFrames={d} state="locked" label="UN SOLO DOCUMENTO" caption="El papel que la habría salvado — al final" /> },
  { key: "benintro_0", start: 73.16, dur: 11.35, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_ben_cocina.png" hue="amber" kicker="Soy Ben" /> },
  { key: "benintro_1", start: 84.51, dur: 4.01, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_cafe.mp4" hue="blue" /> },
  { key: "benintro_2", start: 88.52, dur: 6.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_ben_casa.png" hue="red" /> },
  { key: "rafael_0", start: 95.2, dur: 6.58, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="01" title="La historia de Don Rafael" hue="blue" /> },
  { key: "rafael_1", start: 101.78, dur: 5.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_barrio.mp4" hue="red" /> },
  { key: "rafael_2", start: 106.91, dur: 18.41, kind: "journey", el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="Una vida entera" title="Don Rafael" waypoints={[{"x":0,"y":0,"z":0,"image":"img/rb_rafael_fabrica.png","label":"41 años trabajando","num":"1","dwell":2.6,"travel":1.5},{"x":1.3,"y":-0.3,"z":0.3,"image":"img/rb_rafael_mecanico.png","label":"Mecánico por su cuenta","num":"2","dwell":2.6,"travel":1.5},{"x":2.6,"y":0.3,"z":-0.2,"image":"img/rb_rafael_casa.png","label":"Casa pagada a los 62","num":"3","dwell":2.8,"travel":1.5},{"x":3.9,"y":-0.2,"z":0.2,"image":"img/rb_rafael_porche.png","label":"“Es de mis hijos”","num":"4","dwell":3,"travel":1.4}]} /> },
  { key: "rafael_3", start: 125.32, dur: 5.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_porche.mp4" hue="blue" /> },
  { key: "rafael_4", start: 130.45, dur: 20.36, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/rb_rafael_sonrisa.png" words={parseQuote("Ya nadie me la puede quitar. Es de *mis hijos*.")} hue="red" /> },
  { key: "alzheimer_0", start: 150.81, dur: 6.19, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_carmen_ventana.png" hue="red" kicker="A Carmen le diagnosticaron Alzheimer" /> },
  { key: "alzheimer_1", start: 157, dur: 4.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_manos_ancianos.mp4" hue="amber" /> },
  { key: "alzheimer_2", start: 161.96, dur: 4.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_rafael_cansado.png" hue="blue" kicker="Rafael ya no daba abasto" /> },
  { key: "alzheimer_3", start: 166.3, dur: 6.19, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_asilo.mp4" hue="red" kicker="Un hogar de ancianos" /> },
  { key: "costo_0", start: 172.49, dur: 7.05, kind: "odometer", el: (d) => <CostOdometer durationInFrames={d} to={100000} prefix="$" suffix="/año" eyebrow="Lo que cuesta un asilo" label="Más de 8.000 al mes. Año tras año tras año." repeat="AÑO TRAS AÑO" /> },
  { key: "costo_1", start: 179.54, dur: 7.55, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"En casa","value":6000},{"label":"Asistida","value":5000},{"label":"Asilo","value":9000,"tone":"danger"}]} title="Cuánto cuesta el cuidado" unit="US$/mes" hue="blue" /> },
  { key: "costo_2", start: 187.09, dur: 7.56, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/rb_factura_asilo.png" annotations={[{"kind":"circle","x":52,"y":48,"label":"Cada mes"}]} eyebrow="8.000 a 10.000 al mes" caption="Mes tras mes" hue="red" /> },
  { key: "costo_3", start: 194.65, dur: 4.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_dinero.mp4" hue="amber" /> },
  { key: "costo_4", start: 199.23, dur: 3.93, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_calendario_meses.png" hue="blue" /> },
  { key: "medicare_0", start: 203.16, dur: 5.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_ben_explica.png" hue="blue" kicker="Medicare NO cubre el asilo" /> },
  { key: "medicare_1", start: 208.94, dur: 3.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_tarjeta_medicare.png" hue="red" /> },
  { key: "medicare_2", start: 212.4, dur: 8.89, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/medicare_2.mp4" pages={[{"image":"img/dg_med_medicare.png","eyebrow":"El primer golpe"}]} /> },
  { key: "medicare_3", start: 221.29, dur: 7.11, kind: "vsmed", el: (d) => <MedicareVsMedicaid durationInFrames={d} leftTitle="MEDICARE" leftItems={[{"text":"Hospital","ok":true},{"text":"Médico","ok":true},{"text":"Asilo prolongado","ok":false}]} rightTitle="MEDICAID" rightItems={[{"text":"Asilo prolongado","ok":true},{"text":"Solo bajos recursos","ok":false}]} eyebrow="Qué cubre cada uno" /> },
  { key: "gastar_0", start: 228.4, dur: 14.3, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/gastar_0.mp4" pages={[{"image":"img/dg_med_spend.png","eyebrow":"El requisito"}]} /> },
  { key: "gastar_1", start: 242.7, dur: 12.87, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Gastar ahorros","desc":"quedar sin nada","image":"img/rb_ahorros_vacios.png"},{"title":"Calificar","desc":"bajos recursos","image":"img/rb_formulario_medicaid.png"},{"title":"Medicaid paga","desc":"el asilo","image":"img/rb_asilo_pasillo.png"}]} eyebrow="El requisito" title="Para que Medicaid pague" hue="amber" /> },
  { key: "gastar_2", start: 255.57, dur: 5.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_cuenta_banco_baja.png" hue="blue" /> },
  { key: "gastar_3", start: 261.15, dur: 9.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_rafael_alivio.png" hue="red" kicker="Pensó que lo peor pasó" /> },
  { key: "carta_0", start: 270.44, dur: 7.84, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_buzon.mp4" hue="amber" kicker="Entre las cuentas" /> },
  { key: "carta_1", start: 278.28, dur: 15.06, kind: "estateletter", el: (d) => <EstateRecoveryLetter durationInFrames={d} amount="$180,000" eyebrow="Semanas después" label="EL ESTADO RECLAMA" hitAt={48} /> },
  { key: "carta_2", start: 293.34, dur: 13.06, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="$180.000" image="img/rb_manos_temblando.png" caption="Todo lo que Medicaid pagó." accent="danger" hue="red" /> },
  { key: "carta_3", start: 306.4, dur: 13.06, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_casa_noche.png" hue="amber" kicker="Lo cobraban de la casa" /> },
  { key: "carta_4", start: 319.46, dur: 9.14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_rafael_puerta.png" hue="blue" /> },
  { key: "promesa_0", start: 328.6, dur: 11.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_ben_promesa.png" hue="blue" kicker="Hoy: 3 cosas" /> },
  { key: "promesa_1", start: 340.32, dur: 11.72, kind: "goldvault", el: (d) => <GoldVault durationInFrames={d} state="locked" label="EL ORO" caption="Lo más importante, al final" /> },
  { key: "enemigo_0", start: 352.04, dur: 11.36, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="01" title="El enemigo: la ley de 1993" hue="red" /> },
  { key: "enemigo_1", start: 363.4, dur: 10.33, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_capitolio.mp4" hue="amber" kicker="Ley federal, todo el país" /> },
  { key: "enemigo_2", start: 373.73, dur: 22.71, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/enemigo_2.mp4" pages={[{"image":"img/dg_med_recover_what.png","eyebrow":"Qué puede recuperar"}]} /> },
  { key: "enemigo_3", start: 396.44, dur: 14.76, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="1993" image="img/rb_oficina_medicaid.png" caption="Ley federal, sin excepción" hue="red" /> },
  { key: "edad55_0", start: 411.2, dur: 7.74, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={55} suffix=" años" label="desde esta edad se puede recuperar" eyebrow="El dato clave" accent="danger" hue="red" /> },
  { key: "edad55_1", start: 418.94, dur: 12.9, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/edad55_1.mp4" pages={[{"image":"img/dg_med_55.png","eyebrow":"La edad gatillo"}]} /> },
  { key: "edad55_2", start: 431.84, dur: 8.38, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="55+" image="img/rb_jubilados_banco.png" caption="A los jubilados nos toca de lleno" hue="red" /> },
  { key: "objetivo_0", start: 440.22, dur: 20.82, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/objetivo_0.mp4" pages={[{"image":"img/dg_med_target.png","eyebrow":"El primer objetivo"}]} /> },
  { key: "objetivo_1", start: 461.04, dur: 15.62, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/rb_casa_mira.png" annotations={[{"kind":"circle","x":50,"y":55,"label":"Tu casa"}]} eyebrow="El primer objetivo" caption="La que más te costó" hue="red" /> },
  { key: "objetivo_2", start: 476.66, dur: 9.47, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_firma_papeles.mp4" hue="amber" kicker="Está en la letra chica" /> },
  { key: "mito_0", start: 486.13, dur: 10.73, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_ben_mito.png" hue="red" kicker="“Su casa está exenta”" /> },
  { key: "mito_1", start: 496.86, dur: 8.26, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Exenta"},{"t":"no"},{"t":"es"},{"t":"protegida","hl":true}]} eyebrow="El malentendido" hue="red" bg="image" image="img/rb_casa_pagada.png" /> },
  { key: "dosmomentos_0", start: 505.12, dur: 23.96, kind: "twomoments", el: (d) => <TwoMomentsSplit durationInFrames={d} eyebrow="La misma casa, distinto momento" leftLabel="MIENTRAS VIVE" leftSub="Exenta · intocable" rightLabel="AL FALLECER" rightSub="En la mira del Estado" /> },
  { key: "dosmomentos_1", start: 529.08, dur: 12.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_casa_atardecer.mp4" hue="blue" /> },
  { key: "dosmomentos_2", start: 541.54, dur: 10.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_casa_sol.png" hue="red" /> },
  { key: "dosmomentos_3", start: 551.92, dur: 10.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_casa_sombra.png" hue="amber" /> },
  { key: "dosmomentos_4", start: 562.31, dur: 17.57, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/rb_casa_dia_noche.png" words={parseQuote("Misma casa. *Distinto destino*.")} hue="blue" /> },
  { key: "probate_0", start: 579.88, dur: 12.84, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/probate_0.mp4" pages={[{"image":"img/dg_med_probate.png","eyebrow":"Por dónde te cobran"}]} /> },
  { key: "probate_1", start: 592.72, dur: 5.84, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_tribunal.mp4" hue="red" /> },
  { key: "estados_0", start: 598.56, dur: 12.65, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_mapa_usa.png" hue="red" kicker="Cada estado, distinto" /> },
  { key: "estados_1", start: 611.21, dur: 10.71, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/rb_mapa_usa.png" title="Las reglas cambian" chips={["Florida","Texas","California"]} hue="blue" /> },
  { key: "cta_estado_0", start: 621.92, dur: 21.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_ben_cta1.png" hue="amber" kicker="¿De qué estado me ves?" /> },
  { key: "cta_estado_1", start: 643.31, dur: 12.84, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_comentarios.mp4" hue="blue" /> },
  { key: "errores_intro_0", start: 656.15, dur: 6.98, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="02" title="Los errores que entregan la casa" hue="blue" /> },
  { key: "errores_intro_1", start: 663.13, dur: 13.95, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/errores_intro_1.mp4" pages={[{"image":"img/dg_med_errores.png","eyebrow":"4 errores"}]} /> },
  { key: "error1_0", start: 677.08, dur: 22.56, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="1" title="Poner la casa a nombre de un hijo" desc="La trampa más cruel." eyebrow="ERROR" /> },
  { key: "error1_1", start: 699.64, dur: 25.77, kind: "lookback", el: (d) => <LookbackTimeline durationInFrames={d} eyebrow="El período de revisión" title="5 años hacia atrás" flags={["Casa a un hijo","Regalar dinero","Vender barato"]} /> },
  { key: "error1_2", start: 725.41, dur: 12.57, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_padre_hijo_casa.png" hue="blue" /> },
  { key: "error1_3", start: 737.98, dur: 14.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_penalidad.mp4" hue="red" kicker="Te penalizan meses o años" /> },
  { key: "error2_0", start: 752.64, dur: 12.38, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="2" title="Mudarte y dejar la casa sin avisar" desc="Deja de ser tu vivienda principal." eyebrow="ERROR" /> },
  { key: "error2_1", start: 765.02, dur: 6.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_mudanza.mp4" hue="blue" /> },
  { key: "error3_0", start: 771.92, dur: 15.2, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="3" title="No hacer nada" desc="Cuando llega, las puertas se cerraron." eyebrow="ERROR" /> },
  { key: "error3_1", start: 787.12, dur: 8.47, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_reloj.mp4" hue="red" kicker="El error de Rafael" /> },
  { key: "error4_0", start: 795.59, dur: 38.08, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="4" title="Creerle a quien no sabe" desc="Cada caso es distinto." eyebrow="ERROR" /> },
  { key: "cta_sub_0", start: 833.67, dur: 36.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_ben_sub.png" hue="amber" kicker="De jubilado a jubilado" /> },
  { key: "soluciones_0", start: 870.23, dur: 5.98, kind: "goldvault", el: (d) => <GoldVault durationInFrames={d} state="open" label="EL ORO" caption="Lo que protege tu casa" /> },
  { key: "soluciones_1", start: 876.21, dur: 5.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_ben_soluciones.png" hue="red" kicker="Ahora sí: qué hacer" /> },
  { key: "soluciones_2", start: 882.19, dur: 6.9, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Sin plan","value":100,"tone":"danger"},{"label":"Con plan a tiempo","value":5,"winner":true}]} title="Tu casa en riesgo" unit="%" hue="amber" /> },
  { key: "elderlaw_0", start: 889.09, dur: 6.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_abogado.mp4" hue="red" kicker="Un abogado de Elder Law" /> },
  { key: "elderlaw_1", start: 895.47, dur: 5.39, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/rb_mapa_camino.png" words={parseQuote("Yo te doy el *mapa*.")} accent="good" hue="amber" /> },
  { key: "tool1_0", start: 900.86, dur: 19.65, kind: "tool", el: (d) => <ProtectionTool durationInFrames={d} nameEs="Fideicomiso irrevocable" how="La casa entra al fideicomiso, vos seguís viviendo, y el Estado no la toca." number="1" nameEn="Medicaid Asset Protection Trust" eyebrow="Herramienta" /> },
  { key: "tool1_1", start: 920.51, dur: 26.21, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/tool1_1.mp4" pages={[{"image":"img/dg_med_trust.png","eyebrow":"Cómo blinda la casa"}]} /> },
  { key: "tool1_2", start: 946.72, dur: 10.22, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_documento_trust.png" hue="red" /> },
  { key: "tool1_3", start: 956.94, dur: 11.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_persona_mayor_casa_feliz.png" hue="amber" kicker="Seguís viviendo en ella" /> },
  { key: "tool2_0", start: 968.86, dur: 11.12, kind: "tool", el: (d) => <ProtectionTool durationInFrames={d} nameEs="Escritura de patrimonio vital" how="Vivís en la casa, y al morir pasa directo a tus hijos sin herencia." number="2" nameEn="Lady Bird Deed" eyebrow="Herramienta" /> },
  { key: "tool2_1", start: 979.98, dur: 14.82, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/tool2_1.mp4" pages={[{"image":"img/dg_med_ladybird.png","eyebrow":"El salto"}]} /> },
  { key: "tool2_2", start: 994.8, dur: 11.11, kind: "deed", el: (d) => <DeedStamp durationInFrames={d} title="ESCRITURA" stampText="FUERA DEL ALCANCE" caption="Un documento. Una firma." hitAt={54} /> },
  { key: "tool2_3", start: 1005.91, dur: 6.75, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_firma.mp4" hue="blue" /> },
  { key: "tool2_4", start: 1012.66, dur: 8.15, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/rb_rafael_papel.png" words={parseQuote("El papel que *salvaba* a Rafael.")} accent="good" hue="red" /> },
  { key: "tool3_0", start: 1020.81, dur: 14.63, kind: "tool", el: (d) => <ProtectionTool durationInFrames={d} nameEs="Excepción del hijo cuidador" how="Un hijo que vivió 2+ años cuidándote puede recibir la casa sin penalidad." number="3" nameEn="Caregiver Child Exemption" eyebrow="Herramienta" /> },
  { key: "tool3_1", start: 1035.44, dur: 19.5, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/tool3_1.mp4" pages={[{"image":"img/dg_med_caregiver.png","eyebrow":"Premia el amor"}]} /> },
  { key: "tool3_2", start: 1054.94, dur: 10.14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_caregiver.mp4" hue="blue" kicker="Dejó su vida para cuidarte" /> },
  { key: "otras_0", start: 1065.08, dur: 15.26, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Otras protecciones" items={[{"text":"Cónyuge en la casa","state":"done"},{"text":"Hijo menor de 21 o con discapacidad","state":"done"},{"text":"Hermano que vivió ahí","state":"done"},{"text":"Dificultad excesiva (pedirla)","state":"done"}]} hue="amber" /> },
  { key: "otras_1", start: 1080.34, dur: 15.26, kind: "cross", el: (d) => <CrossSection durationInFrames={d} layers={[{"label":"Cónyuge en la casa","color":"#1FBF4F","weight":2},{"label":"Hijo cuidador","color":"#37B6FF","weight":2},{"label":"Fideicomiso","color":"#FFC400","weight":3},{"label":"Lady Bird Deed","color":"#1FBF4F","weight":2}]} eyebrow="Las defensas" title="Capas que protegen tu casa" hue="blue" /> },
  { key: "otras_2", start: 1095.6, dur: 7.94, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_pareja_mayor_sofa.png" hue="red" /> },
  { key: "otras_3", start: 1103.54, dur: 9.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_familia.mp4" hue="amber" /> },
  { key: "paso_0", start: 1112.8, dur: 24.95, kind: "action", el: (d) => <ActionStepCard durationInFrames={d} step="Llamá a un abogado de Elder Law" question="Tengo mi casa pagada, ¿cómo la protejo de Medicaid en mi estado?" eyebrow="Esta semana" /> },
  { key: "paso_1", start: 1137.75, dur: 15.14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_telefono.mp4" hue="red" /> },
  { key: "paso_2", start: 1152.89, dur: 33.27, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/paso_2.mp4" pages={[{"image":"img/dg_med_act.png","eyebrow":"No es el dinero, es el tiempo"}]} /> },
  { key: "recap_0", start: 1186.16, dur: 30.65, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Repaso" items={[{"text":"Medicaid reclama la casa al morir","state":"done"},{"text":"Exenta ≠ protegida","state":"done"},{"text":"Regalarla sale mal (5 años)","state":"done"},{"text":"Fideicomiso · Lady Bird · hijo cuidador","state":"done"}]} hue="red" /> },
  { key: "recap_1", start: 1216.81, dur: 21.25, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rbc_rafael_salvado.mp4" hue="amber" kicker="Rafael conservó la casa" /> },
  { key: "firma_0", start: 1238.06, dur: 14.44, kind: "signature", el: (d) => <SignaturePhrase durationInFrames={d} lines={[{"text":"En la jubilación"},{"text":"el dinero no se gana de nuevo,"},{"text":"solo se deja de perder.","gold":true}]} eyebrow="Para que te quede" /> },
  { key: "cta_final_0", start: 1252.5, dur: 12.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_ben_cta2.png" hue="blue" kicker="¿Ya lo sabías?" /> },
  { key: "tease_0", start: 1265.05, dur: 27.39, kind: "nextvideo", el: (d) => <NextVideoEndcard durationInFrames={d} title="La trampa de la viuda" kicker="Próximo video" sub="Un impuesto que cae sobre el que queda." /> },
  { key: "outro_0", start: 1292.44, dur: 8.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/rb_ben_outro.png" hue="amber" kicker="Soy Ben, de Ben retirado" /> },
];

export const REFRAME: { start: number; end: number }[] = [];
