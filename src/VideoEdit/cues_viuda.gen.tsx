// cues_viuda.gen.tsx — GENERADO por beatsheet.mjs desde viuda.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/viuda.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { SplitList } from "./scenes/SplitList";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { JourneyCanvas } from "./scenes/JourneyCanvas";
import { BarCompare } from "./scenes/BarCompare";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { Checklist } from "./scenes/Checklist";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { CalloutMark } from "./scenes/CalloutMark";
import { InfiniteZoom } from "./scenes/InfiniteZoom";
import { TwoMomentsSplit } from "./scenes/TwoMomentsSplit";
import { MistakeCard } from "./scenes/MistakeCard";
import { GoldVault } from "./scenes/GoldVault";
import { ProtectionTool } from "./scenes/ProtectionTool";
import { SignaturePhrase } from "./scenes/SignaturePhrase";
import { ActionStepCard } from "./scenes/ActionStepCard";
import { NextVideoEndcard } from "./scenes/NextVideoEndcard";
import { KeyPhrase } from "./scenes/KeyPhrase";
import { StatPills } from "./scenes/StatPills";
import { FloatingProp } from "./scenes/FloatingProp";

const D = COLORS.danger;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hook_1", start: 10.65, dur: 4.37, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_feliz.mp4" hue="amber" /> },
  { key: "hook_2", start: 15.02, dur: 5.3, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Si tu *PAREJA* falta…" src="broll/vc_pareja_feliz.mp4" /> },
  { key: "hook_3", start: 20.32, dur: 1.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_sello_gov.mp4" hue="red" /> },
  { key: "hook_4", start: 22.22, dur: 2.3, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Una sorpresa del *gobierno*" src="broll/vc_sello_gov.mp4" /> },
  { key: "hook_5", start: 24.52, dur: 7, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="*MILES* por año, toda la vida" src="broll/vc_calculadora.mp4" /> },
  { key: "hook_5_fill", start: 31.52, dur: 4.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_feliz.mp4" hue="blue" /> },
  { key: "hook_6", start: 36.28, dur: 4.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_persona_sola.mp4" hue="red" /> },
  { key: "hook_7", start: 40.58, dur: 7, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["MENOS ingreso","MÁS impuesto"]} slider={false} /> },
  { key: "hook_7_fill", start: 47.58, dur: 4.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_calculadora.mp4" hue="amber" /> },
  { key: "hook_8", start: 52.14, dur: 3.03, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_viuda_ventana.mp4" hue="blue" /> },
  { key: "hook_9", start: 55.17, dur: 4.07, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="La *penalidad de la viuda*" src="img/vd_viuda_sola.png" times={[13994,13998,14012,14016,14020]} /> },
  { key: "hook_10", start: 59.24, dur: 14.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_manos_pareja.mp4" hue="amber" /> },
  { key: "hook_11", start: 74.04, dur: 7.54, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Se podía *evitar*" src="broll/vc_pareja_cafe.mp4" times={[9,16,23]} /> },
  { key: "hook_12", start: 81.58, dur: 6.22, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_irs_form.mp4" hue="red" /> },
  { key: "hook_13", start: 87.8, dur: 15.56, kind: "goldvault", el: (d) => <GoldVault durationInFrames={d} state="locked" label="UNA DECISIÓN" caption="Tomada a tiempo, salva decenas de miles — al final" /> },
  { key: "benintro_0", start: 103.36, dur: 8.86, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/vd_ben_cocina.png" hue="amber" kicker="Soy Ben" /> },
  { key: "benintro_1", start: 112.22, dur: 7, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Lo primero que pensé fue en *mi esposa*" src="img/vd_ben_cocina.png" times={[9,14,21,29,38,43,47,52]} /> },
  { key: "benintro_1_fill", start: 119.22, dur: 12.06, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_persona_sola.mp4" hue="blue" /> },
  { key: "tieprev_0", start: 131.28, dur: 7, kind: "floatprop", el: (d) => <FloatingProp durationInFrames={d} src="img/vd_casa_prop.png" bg="broll/vc_pareja_feliz.mp4" caption="Aquel video: *la casa*" accent="good" scale={0.8} /> },
  { key: "tieprev_0_fill", start: 138.28, dur: 11.87, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_manos_pareja.mp4" hue="blue" /> },
  { key: "tieprev_1", start: 150.15, dur: 7, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Este: *la persona* que se queda" src="img/vd_ben_cocina.png" /> },
  { key: "tieprev_1_fill", start: 157.15, dur: 5.33, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_irs_form.mp4" hue="red" /> },
  { key: "elena_0", start: 162.48, dur: 8.78, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="01" title="Elena y Manuel" hue="red" /> },
  { key: "elena_1", start: 171.26, dur: 24.59, kind: "journey", el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="46 años juntos" title="Elena y Manuel" dark waypoints={[{"x":0,"y":0,"z":0,"image":"img/vd_pareja_joven.png","label":"Se casaron jóvenes","num":"1","dwell":2.6,"travel":1.5},{"x":1.3,"y":-0.3,"z":0.3,"image":"img/vd_cartero.png","label":"Él, cartero","num":"2","dwell":2.5,"travel":1.5},{"x":2.6,"y":0.3,"z":-0.2,"image":"img/vd_pareja_casa.png","label":"La casa pagada","num":"3","dwell":2.7,"travel":1.5},{"x":3.9,"y":-0.2,"z":0.2,"image":"img/vd_pareja_porche.png","label":"“Hicimos los números”","num":"4","dwell":2.9,"travel":1.4}]} /> },
  { key: "elena_2", start: 195.85, dur: 7.99, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_manos_pareja.mp4" hue="blue" /> },
  { key: "elena_3", start: 203.84, dur: 12.3, kind: "infzoom", el: (d) => <InfiniteZoom durationInFrames={d} images={[{"src":"img/vd_pareja_joven.png"},{"src":"img/vd_pareja_casa.png"},{"src":"img/vd_pareja_porche.png"}]} /> },
  { key: "manuel_0", start: 216.14, dur: 21.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/vd_silla_vacia.png" hue="amber" kicker="Una primavera" /> },
  { key: "manuel_1", start: 237.64, dur: 10.12, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_viuda_ventana.mp4" hue="blue" /> },
  { key: "manuel_2", start: 247.76, dur: 7, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Ella creyó que del dinero iba a estar *bien*" src="img/vd_silla_vacia.png" /> },
  { key: "manuel_2_fill", start: 254.76, dur: 2.54, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_sello_gov.mp4" hue="red" /> },
  { key: "shock_0", start: 257.3, dur: 7, kind: "floatprop", el: (d) => <FloatingProp durationInFrames={d} src="img/vd_papeles_impuestos.png" bg="broll/vc_calculadora.mp4" caption="“Vas a pagar *MÁS*”" accent="accent" /> },
  { key: "shock_0_fill", start: 264.3, dur: 6.49, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_cheque.mp4" hue="blue" /> },
  { key: "shock_1", start: 270.79, dur: 13.49, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/vd_form_1040.png" annotations={[{"kind":"circle","x":60,"y":45,"label":"MÁS impuesto"}]} eyebrow="El mismo formulario" caption="Ahora como soltera" hue="red" /> },
  { key: "shock_2", start: 284.28, dur: 8.82, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="¿*Más*? Si ahora entra *menos*…" src="img/vd_viuda_sola.png" /> },
  { key: "trampa_0", start: 293.1, dur: 6.64, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/vd_ben_explica.png" hue="red" kicker="El primer golpe" /> },
  { key: "trampa_1", start: 299.74, dur: 3.31, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_irs_form.mp4" hue="amber" /> },
  { key: "trampa_2", start: 303.05, dur: 10.21, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/trampa_2.mp4" pages={[{"image":"img/dg_vd_filing.png","eyebrow":"Cómo te clasifican"}]} /> },
  { key: "trampa_3", start: 313.26, dur: 3.32, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_sello_gov.mp4" hue="red" /> },
  { key: "pareja_0", start: 316.58, dur: 7, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Casados = tramos *anchos*, deducción *grande*" src="img/vd_pareja_porche.png" /> },
  { key: "pareja_0_fill", start: 323.58, dur: 7.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_mesa.mp4" hue="amber" /> },
  { key: "pareja_1", start: 330.85, dur: 11.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_feliz.mp4" hue="blue" /> },
  { key: "soltero_0", start: 342.44, dur: 10.38, kind: "twomoments", el: (d) => <TwoMomentsSplit durationInFrames={d} eyebrow="El mismo dinero, otra categoría" leftLabel="EN PAREJA" leftSub="Tramos anchos · deducción doble" rightLabel="SOLTERO/A" rightSub="Tramos a la mitad" /> },
  { key: "soltero_1", start: 352.82, dur: 4.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_persona_sola.mp4" hue="red" /> },
  { key: "soltero_2", start: 357.78, dur: 6.78, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="No te bajan a la mitad: te cambian las *reglas en contra*" src="img/vd_papeles_impuestos.png" /> },
  { key: "deduccion_0", start: 364.56, dur: 7, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["$30,000","$15,000"]} accent="accent" /> },
  { key: "deduccion_0_fill", start: 371.56, dur: 8.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_charla.mp4" hue="red" /> },
  { key: "deduccion_1", start: 380.22, dur: 16.78, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"En pareja","value":30000,"tone":"good"},{"label":"Soltero/a","value":15000,"tone":"danger"}]} title="Deducción estándar" unit="US$" hue="amber" /> },
  { key: "deduccion_2", start: 397, dur: 7, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="−50%" image="img/vd_deduccion_doc.png" caption="La deducción, a la mitad" accent="danger" hue="blue" /> },
  { key: "deduccion_2_fill", start: 404, dur: 7.54, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_ss_oficina.mp4" hue="blue" /> },
  { key: "deduccion_3", start: 411.54, dur: 9.4, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Perdió *la mitad* de la deducción" src="img/vd_viuda_sola.png" /> },
  { key: "tramos_0", start: 420.94, dur: 11, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/tramos_0.mp4" pages={[{"image":"img/dg_vd_brackets.png","eyebrow":"Los escalones de impuestos"}]} /> },
  { key: "tramos_0_fill", start: 431.94, dur: 3.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_abogado_pareja.mp4" hue="amber" /> },
  { key: "tramos_1", start: 435.24, dur: 10.73, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"En pareja","value":12,"tone":"good"},{"label":"Soltero/a","value":22,"tone":"danger"}]} title="El mismo ingreso, la tasa" unit="%" hue="blue" /> },
  { key: "tramos_2", start: 445.97, dur: 9.29, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="22%" image="img/vd_form_1040.png" caption="La tasa de soltero" accent="danger" hue="red" /> },
  { key: "tramos_3", start: 455.26, dur: 5.26, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="No le subió el ingreso. Le subió *la tasa*." src="img/vd_papeles_impuestos.png" times={[9,17,23,31,38,61,68,77,85]} /> },
  { key: "ss_0", start: 460.52, dur: 6.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/vd_ben_ss.png" hue="blue" kicker="El tercer golpe" /> },
  { key: "ss_1", start: 467.12, dur: 4.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_ss_oficina.mp4" hue="red" /> },
  { key: "ss_2", start: 471.84, dur: 11, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/ss_2.mp4" pages={[{"image":"img/dg_vd_ss.png","eyebrow":"Los dos cheques"}]} /> },
  { key: "ss_2_fill", start: 482.84, dur: 3.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_preocupada.mp4" hue="amber" /> },
  { key: "ss_3", start: 486.34, dur: 7, kind: "statpills", el: (d) => <StatPills durationInFrames={d} pills={["2 cheques","1 cheque"]} slider={false} /> },
  { key: "ss_3_fill", start: 493.34, dur: 3.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_viuda_ventana.mp4" hue="blue" /> },
  { key: "ss_4", start: 496.5, dur: 6.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_cheque.mp4" hue="red" /> },
  { key: "ss_5", start: 503.1, dur: 9.43, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="−1 cheque" image="img/vd_dos_cheques.png" caption="Desaparece el más chico" accent="danger" hue="amber" /> },
  { key: "ss_6", start: 512.53, dur: 6.09, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Pierde *un tercio* de lo que entraba" src="img/vd_viuda_sola.png" /> },
  { key: "resumen3_0", start: 518.62, dur: 7, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="*Menos* ingreso. *Más* impuesto. Esa es la trampa." src="broll/vc_calculadora.mp4" fontSize={84} /> },
  { key: "resumen3_0_fill", start: 525.62, dur: 2.83, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_cafe.mp4" hue="red" /> },
  { key: "resumen3_1", start: 528.45, dur: 6.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_calculadora.mp4" hue="amber" /> },
  { key: "cta_dos_0", start: 534.84, dur: 34.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/vd_ben_cta1.png" hue="amber" kicker="Escriban “los dos”" /> },
  { key: "irmaa_0", start: 569.28, dur: 19.87, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="4°" title="El recargo de Medicare (IRMAA)" desc="El límite para soltero es casi la mitad → el mismo ingreso lo cruza." eyebrow="GOLPE" /> },
  { key: "irmaa_1", start: 589.15, dur: 12.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_medicare.mp4" hue="red" /> },
  { key: "irmaa_2", start: 602.07, dur: 7, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="÷2" image="img/vd_deduccion_doc.png" caption="El límite, a la mitad" accent="danger" hue="amber" /> },
  { key: "irmaa_2_fill", start: 609.07, dur: 11.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_feliz.mp4" hue="amber" /> },
  { key: "rmd_0", start: 620.52, dur: 7, kind: "floatprop", el: (d) => <FloatingProp durationInFrames={d} src="img/vd_alcancia.png" bg="broll/vc_irs_form.mp4" caption="Retiros *obligatorios*, tasa de soltero" accent="accent" scale={0.8} /> },
  { key: "rmd_0_fill", start: 627.52, dur: 12.15, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_calculadora.mp4" hue="red" /> },
  { key: "rmd_1", start: 639.67, dur: 7, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="El ahorro se vuelve, en parte, una *carga*" src="img/vd_papeles_impuestos.png" /> },
  { key: "rmd_1_fill", start: 646.67, dur: 5.51, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_persona_sola.mp4" hue="amber" /> },
  { key: "todojunto_0", start: 652.18, dur: 15.08, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="La penalidad de la viuda" items={[{"text":"Pierde un cheque del Seguro Social","state":"done"},{"text":"Deducción a la mitad","state":"done"},{"text":"Salta a un tramo más alto","state":"done"},{"text":"Medicare más caro","state":"done"},{"text":"Retiros obligatorios más gravados","state":"done"}]} hue="amber" /> },
  { key: "todojunto_1", start: 667.26, dur: 15.08, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Con los dos","value":100,"tone":"good"},{"label":"Cuando queda uno","value":65,"tone":"danger"}]} title="Lo que entra al hogar" unit="%" hue="blue" /> },
  { key: "todojunto_2", start: 682.34, dur: 8.44, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Todo, por pasar de *dos* a *una*" src="img/vd_viuda_sola.png" /> },
  { key: "promesa_0", start: 690.78, dur: 16.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/vd_ben_promesa.png" hue="blue" kicker="Hoy: 3 cosas" /> },
  { key: "promesa_1", start: 707.7, dur: 16.92, kind: "goldvault", el: (d) => <GoldVault durationInFrames={d} state="locked" label="EL ORO" caption="Lo más importante, al final" /> },
  { key: "errores_0", start: 724.62, dur: 5.68, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="02" title="Los errores que lo empeoran" hue="red" /> },
  { key: "errores_1", start: 730.3, dur: 5.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_preocupada.mp4" hue="amber" /> },
  { key: "error1_0", start: 735.46, dur: 17.5, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="1" title="“Ya hicimos los números”" desc="Pero los hicieron para DOS, no para el que queda solo." eyebrow="ERROR" /> },
  { key: "error1_1", start: 752.96, dur: 11.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_mesa.mp4" hue="blue" /> },
  { key: "error2_0", start: 764.34, dur: 15.03, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="2" title="Esperar" desc="Casi todo solo se puede hacer mientras los DOS viven." eyebrow="ERROR" /> },
  { key: "error2_1", start: 779.37, dur: 7, kind: "floatprop", el: (d) => <FloatingProp durationInFrames={d} src="img/vd_reloj.png" bg="broll/vc_persona_sola.mp4" caption="Las puertas se *cierran*" accent="accent" scale={0.7} /> },
  { key: "error2_1_fill", start: 786.37, dur: 9.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_manos_pareja.mp4" hue="red" /> },
  { key: "error3_0", start: 795.48, dur: 12.07, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="3" title="Todo en cuentas sin gravar" desc="Le dejás al que queda la cuenta más cara." eyebrow="ERROR" /> },
  { key: "error3_1", start: 807.55, dur: 7, kind: "floatprop", el: (d) => <FloatingProp durationInFrames={d} src="img/vd_cuenta_pesada.png" bg="broll/vc_pareja_charla.mp4" caption="La cuenta *más cara*" accent="accent" scale={0.7} /> },
  { key: "error3_1_fill", start: 814.55, dur: 5.93, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_irs_form.mp4" hue="amber" /> },
  { key: "error4_0", start: 820.48, dur: 22.84, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="4" title="No hablarlo en pareja" desc="El que queda no solo está de duelo: está perdido." eyebrow="ERROR" /> },
  { key: "error4_1", start: 843.32, dur: 14.84, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_charla.mp4" hue="blue" /> },
  { key: "cta_sub_0", start: 858.16, dur: 35.86, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/vd_ben_sub.png" hue="blue" kicker="De jubilado a jubilado" /> },
  { key: "soluciones_0", start: 894.02, dur: 17, kind: "goldvault", el: (d) => <GoldVault durationInFrames={d} state="open" label="EL ORO" caption="Lo que protege al que queda" /> },
  { key: "soluciones_1", start: 911.02, dur: 17, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/vd_ben_sol.png" hue="amber" kicker="Ahora sí: qué hacer" /> },
  { key: "tool1_0", start: 928.02, dur: 19.09, kind: "tool", el: (d) => <ProtectionTool durationInFrames={d} nameEs="Conversión a Roth" how="Mientras los dos viven (tasa barata), pasás de a poco el ahorro a una cuenta Roth: libre de impuestos para siempre." number="1" nameEn="Roth Conversion" eyebrow="Herramienta" /> },
  { key: "tool1_1", start: 947.11, dur: 11, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/tool1_1.mp4" pages={[{"image":"img/dg_vd_roth.png","eyebrow":"Cómo blinda al que queda"}]} /> },
  { key: "tool1_1_fill", start: 958.11, dur: 14.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_sello_gov.mp4" hue="blue" /> },
  { key: "tool1_2", start: 972.57, dur: 19.09, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Hoy, en pareja","value":12,"tone":"good","winner":true},{"label":"Mañana, viuda sola","value":22,"tone":"danger"}]} title="Pagar el impuesto…" unit="%" hue="red" /> },
  { key: "tool1_3", start: 991.66, dur: 22.91, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Cuenta tradicional","desc":"sin gravar","image":"img/vd_cuenta_trad.png"},{"title":"Convertir de a poco","desc":"años en pareja, tasa baja","image":"img/vd_conversion.png"},{"title":"Cuenta Roth","desc":"libre de impuestos","image":"img/vd_roth.png"}]} eyebrow="Con tiempo" title="Cómo se hace" hue="amber" /> },
  { key: "tool1_4", start: 1014.57, dur: 7, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Hacelo con *5 años* de anticipación" src="img/vd_pareja_porche.png" /> },
  { key: "tool1_4_fill", start: 1021.57, dur: 5.47, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_cheque.mp4" hue="blue" /> },
  { key: "tool2_0", start: 1027.04, dur: 25.62, kind: "tool", el: (d) => <ProtectionTool durationInFrames={d} nameEs="Llenar los escalones bajos" how="En los años de ingreso bajo, sacás un poco a tasa barata en vez de dejar el escalón vacío." number="2" nameEn="Bracket filling" eyebrow="Herramienta" /> },
  { key: "tool2_1", start: 1052.66, dur: 7, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Pagás *barato hoy*, no caro mañana" src="img/vd_pareja_porche.png" /> },
  { key: "tool2_1_fill", start: 1059.66, dur: 9.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_mesa.mp4" hue="red" /> },
  { key: "tool3_0", start: 1069.4, dur: 9.58, kind: "tool", el: (d) => <ProtectionTool durationInFrames={d} nameEs="Donación calificada (QCD)" how="Donás directo desde la cuenta de retiro: no cuenta como ingreso y baja los retiros obligatorios." number="3" nameEn="Qualified Charitable Distribution" eyebrow="Herramienta" /> },
  { key: "tool3_1", start: 1078.98, dur: 7, kind: "floatprop", el: (d) => <FloatingProp durationInFrames={d} src="img/vd_corazon.png" bg="broll/vc_pareja_cafe.mp4" accent="good" scale={0.6} /> },
  { key: "tool3_1_fill", start: 1085.98, dur: 2.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_charla.mp4" hue="amber" /> },
  { key: "tool4_0", start: 1088.56, dur: 15.26, kind: "tool", el: (d) => <ProtectionTool durationInFrames={d} nameEs="Seguro de vida con cabeza" how="Algo que el día que uno falte le dé al que queda una cantidad libre de impuestos, para tapar el cheque perdido." number="4" nameEn="Life insurance" eyebrow="Herramienta" /> },
  { key: "tool4_1", start: 1103.82, dur: 7, kind: "floatprop", el: (d) => <FloatingProp durationInFrames={d} src="img/vd_paraguas.png" bg="broll/vc_manos_pareja.mp4" caption="Tapa el *cheque perdido*" accent="good" scale={0.7} /> },
  { key: "tool4_1_fill", start: 1110.82, dur: 8.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_ss_oficina.mp4" hue="blue" /> },
  { key: "tool5_0", start: 1119.08, dur: 12.27, kind: "tool", el: (d) => <ProtectionTool durationInFrames={d} nameEs="Estrategia del Seguro Social" how="El que ganó más espera hasta los 70: su cheque crece, y crece el que hereda el sobreviviente. Gratis." number="5" nameEn="Claiming strategy" eyebrow="Herramienta" /> },
  { key: "tool5_1", start: 1131.35, dur: 11, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/tool5_1.mp4" pages={[{"image":"img/dg_vd_ss70.png","eyebrow":"Esperar hasta los 70"}]} /> },
  { key: "tool5_1_fill", start: 1142.35, dur: 5.35, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_abogado_pareja.mp4" hue="red" /> },
  { key: "paso_0", start: 1147.7, dur: 16.28, kind: "action", el: (d) => <ActionStepCard durationInFrames={d} step="Siéntense los dos con un café" question="Si mañana falta uno de los dos, ¿cómo le quedan las cuentas al que se queda?" eyebrow="Esta semana" /> },
  { key: "paso_1", start: 1163.98, dur: 16.27, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/vd_pareja_porche.png" annotations={[{"kind":"circle","x":50,"y":50,"label":"Juntos"}]} eyebrow="La mejor protección" caption="Hablarlo HOY, los dos" hue="amber" /> },
  { key: "paso_2", start: 1180.25, dur: 9.87, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_cafe.mp4" hue="blue" /> },
  { key: "paso_3", start: 1190.12, dur: 8.47, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_abogado_pareja.mp4" hue="red" /> },
  { key: "paso_4", start: 1198.59, dur: 7, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="No es el dinero. Es el *tiempo*." src="img/vd_pareja_porche.png" /> },
  { key: "paso_4_fill", start: 1205.59, dur: 3.63, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_pareja_preocupada.mp4" hue="amber" /> },
  { key: "recap_0", start: 1209.22, dur: 21.86, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Pareja vs. el que queda" items={["Deducción doble → a la mitad","Tramos anchos → angostos","Dos cheques → uno"]} accent={D} cross /> },
  { key: "recap_1", start: 1231.08, dur: 25.22, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Repaso" items={[{"text":"De pareja a soltero = deducción a la mitad + tramos angostos","state":"done"},{"text":"Se pierde un cheque del Seguro Social","state":"done"},{"text":"Medicare más caro + retiros más gravados","state":"done"},{"text":"Arma: Roth, orden de cuentas, estrategia de SS","state":"done"}]} hue="blue" /> },
  { key: "firma_0", start: 1256.3, dur: 24.56, kind: "signature", el: (d) => <SignaturePhrase durationInFrames={d} lines={[{"text":"En la jubilación"},{"text":"el dinero no se gana de nuevo,"},{"text":"solo se deja de perder.","gold":true}]} eyebrow="Para que te quede" /> },
  { key: "firma_1", start: 1280.86, dur: 7, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Cuidarle las cuentas al que queda es decir *te amo*" src="img/vd_pareja_porche.png" /> },
  { key: "firma_1_fill", start: 1287.86, dur: 9.18, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vc_viuda_ventana.mp4" hue="red" /> },
  { key: "cta_final_0", start: 1297.04, dur: 18.14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/vd_ben_cta2.png" hue="red" kicker="¿Lo sabías?" /> },
  { key: "tease_0", start: 1315.18, dur: 32.24, kind: "nextvideo", el: (d) => <NextVideoEndcard durationInFrames={d} title="La regla de los 10 años" kicker="Próximo video" sub="Lo que el IRS hace con tu cuenta de retiro cuando la heredan tus hijos." /> },
  { key: "outro_0", start: 1347.42, dur: 13.14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/vd_ben_outro.png" hue="blue" kicker="Soy Ben, de Ben retirado" /> },
];

export const REFRAME: { start: number; end: number }[] = [];
