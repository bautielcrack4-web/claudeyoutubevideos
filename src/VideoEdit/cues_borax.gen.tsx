// cues_borax.gen.tsx — GENERADO por beatsheet.mjs desde borax.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/borax.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { ChipsCluster } from "./scenes/ReframeContent";
import { SplitList } from "./scenes/SplitList";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { StatBig } from "./scenes/StatBig";
import { JourneyCanvas } from "./scenes/JourneyCanvas";
import { FloatingInsert } from "./scenes/FloatingInsert";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { AgedDoc } from "./scenes/AgedDoc";
import { BarCompare } from "./scenes/BarCompare";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { Checklist } from "./scenes/Checklist";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { CalloutMark } from "./scenes/CalloutMark";
import { HalfShot } from "./scenes/HalfShot";
import { CostTally } from "./scenes/CostTally";

const D = COLORS.danger, A = COLORS.accent;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hook_1", start: 5.89, dur: 6.25, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_viga_maciza.png" hue="red" kicker="20 años, intacta" /> },
  { key: "hook_2", start: 12.14, dur: 6.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_viga_golpe.png" hue="blue" /> },
  { key: "hook_3", start: 18.4, dur: 6.25, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_viga_sana_cerca.png" hue="amber" /> },
  { key: "hook_4", start: 24.65, dur: 6.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_termita_madera.png" hue="red" /> },
  { key: "hook_5", start: 30.91, dur: 6.25, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_zona_humeda.png" hue="blue" /> },
  { key: "hook_6", start: 37.16, dur: 6.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_caja_borax.png" hue="amber" kicker="Cuesta monedas" /> },
  { key: "hook_7", start: 43.42, dur: 6.25, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/bxv_aceite_cae.mp4" hue="red" /> },
  { key: "hook_8", start: 49.67, dur: 6.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_madera_podrida_otra.png" hue="blue" kicker="Lo normal sin tratar" /> },
  { key: "hook_9", start: 55.93, dur: 6.25, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_fumigadora_no.png" hue="amber" /> },
  { key: "hook_10", start: 62.18, dur: 6.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_casa_madera_full.png" hue="red" /> },
  { key: "ident_0", start: 68.44, dur: 24.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_tomas_retrato.png" hue="red" kicker="Tomás" /> },
  { key: "ident_1", start: 92.7, dur: 9.99, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/bx_manos_madera.png" words={parseQuote("No soy químico. Soy un *hombre que prueba cosas*.")} hue="blue" /> },
  { key: "ident_2", start: 102.69, dur: 14.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_tomas_incomoda.png" hue="amber" kicker="La parte que te va a dar bronca" /> },
  { key: "promesa_0", start: 116.96, dur: 3.75, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={2} prefix="US$ " label="lo que cuesta tratar tu madera" eyebrow="Te lo prometo" hue="blue" /> },
  { key: "promesa_1", start: 120.71, dur: 3.75, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/bx_casa_madera_full.png" title="Lo que vas a saber" chips={["Bórax contra termitas","Aceite contra el agua","Cal de 5000 años"]} hue="amber" /> },
  { key: "promesa_2", start: 124.46, dur: 5.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_galpon_madera.png" hue="red" /> },
  { key: "problema_0", start: 130.08, dur: 13.76, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/problema_0.mp4" pages={[{"image":"img/dg_bx_dos.png","eyebrow":"Bichos por dentro, agua por fuera"}]} /> },
  { key: "problema_1", start: 143.84, dur: 7.45, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/bx_termita_galeria.png" annotations={[{"kind":"circle","x":45,"y":50,"label":"Túneles"},{"kind":"arrow","x":70,"y":65,"label":"Polvillo"}]} eyebrow="Por dentro" caption="Las galerías que no ves" hue="red" /> },
  { key: "problema_2", start: 151.29, dur: 8.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_carcoma_bicho.png" hue="blue" kicker="La carcoma" /> },
  { key: "problema_3", start: 159.88, dur: 8.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_hormiga_carpintera.png" hue="amber" kicker="La hormiga carpintera" /> },
  { key: "problema_4", start: 168.48, dur: 8.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_madera_humeda.png" hue="red" kicker="Y la humedad" /> },
  { key: "problema_5", start: 176.68, dur: 8.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/bxv_madera_podrida.mp4" hue="blue" kicker="El agua y los hongos" /> },
  { key: "problema_6", start: 184.88, dur: 8.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_hongo_blanco.png" hue="amber" /> },
  { key: "problema_7", start: 193.08, dur: 5.47, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/bx_galpon_madera.png" title="Dos defensas, no una" chips={["Una contra los bichos","Otra contra el agua"]} hue="red" /> },
  { key: "problema_8", start: 198.55, dur: 6.01, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Por qué fallan los productos caros" items={["Atacan UNA sola cosa","Se evaporan en meses","Hay que comprar de nuevo"]} accent={D} cross /> },
  { key: "borax_que_0", start: 204.56, dur: 2.9, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="01" title="El bórax contra termitas y hongos" hue="red" /> },
  { key: "borax_que_1", start: 207.46, dur: 7.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_borax_mineral.png" hue="blue" kicker="Un mineral natural" /> },
  { key: "borax_que_2", start: 214.85, dur: 4.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_borax_mina.png" hue="amber" /> },
  { key: "borax_que_3", start: 219.19, dur: 4.35, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_borax_lavanderia.png" hue="red" /> },
  { key: "borax_que_4", start: 223.54, dur: 4.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_borax_mano.png" hue="blue" /> },
  { key: "borax_que_5", start: 227.88, dur: 2.9, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="US$ 2" image="img/bx_borax_cucharada.png" caption="Una caja te dura años." accent="amber" hue="amber" /> },
  { key: "borax_que_6", start: 230.78, dur: 2.9, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/bx_borax_mineral.png" title="Mata bichos Y hongos" chips={["No es de laboratorio","Sal mineral","Seguro para vos"]} hue="amber" /> },
  { key: "borax_como_0", start: 233.68, dur: 15.13, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/borax_como_0.mp4" pages={[{"image":"img/dg_bx_mata.png","eyebrow":"La termita que muerde, muere"},{"image":"img/dg_bx_queda.png","eyebrow":"Y queda en la fibra, permanente"}]} /> },
  { key: "borax_como_1", start: 248.81, dur: 9.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_termita_come.png" hue="amber" /> },
  { key: "borax_como_2", start: 258.27, dur: 9.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_termita_muerta.png" hue="red" /> },
  { key: "borax_como_3", start: 267.73, dur: 9.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_carcoma_agujeros.png" hue="blue" /> },
  { key: "borax_como_4", start: 277.18, dur: 9.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_borax_cristales.png" hue="amber" /> },
  { key: "borax_receta_0", start: 286.64, dur: 3.51, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/bx_mesa_productos.png" annotations={[{"kind":"circle","x":25,"y":55,"label":"Bórax"},{"kind":"circle","x":55,"y":55,"label":"Agua caliente"},{"kind":"circle","x":80,"y":55,"label":"Pincel"}]} eyebrow="Lo que necesitás" caption="Todo de ferretería, monedas" hue="amber" /> },
  { key: "borax_receta_1", start: 290.15, dur: 5.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_agua_caliente.png" hue="red" kicker="1 · Agua bien caliente" /> },
  { key: "borax_receta_2", start: 296.03, dur: 5.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_caja_abrir.png" hue="blue" /> },
  { key: "borax_receta_3", start: 301.91, dur: 5.89, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_echar_borax.png" hue="amber" kicker="2 · Echar el bórax" /> },
  { key: "borax_receta_4", start: 307.8, dur: 5.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/bxv_revolver.mp4" hue="red" kicker="Revolver hasta disolver" /> },
  { key: "borax_receta_5", start: 313.68, dur: 5.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_borax_fondo.png" hue="blue" kicker="Hasta que quede polvo en el fondo" /> },
  { key: "borax_receta_6", start: 319.56, dur: 4.32, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/bx_balde_solucion.png" side="right" hue="amber" /> },
  { key: "borax_receta_7", start: 323.88, dur: 5.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_brush_wood.mp4" hue="red" kicker="3 · Pincelar la madera" /> },
  { key: "borax_receta_8", start: 329.76, dur: 5.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_puntas_madera.png" hue="blue" kicker="Las puntas primero" /> },
  { key: "borax_receta_9", start: 335.64, dur: 5.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_uniones.png" hue="amber" kicker="Y las uniones" /> },
  { key: "borax_receta_10", start: 341.52, dur: 5.1, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/bx_viga_tratada.png" annotations={[{"kind":"arrow","x":30,"y":40,"label":"1ª mano"},{"kind":"arrow","x":65,"y":60,"label":"2ª mano"}]} eyebrow="Dos manos" caption="Dejá secar entre mano y mano" hue="red" /> },
  { key: "borax_receta_11", start: 346.62, dur: 5.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/bxv_secar.mp4" hue="blue" kicker="Dejar secar" /> },
  { key: "borax_receta_12", start: 352.5, dur: 4.71, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="La receta del bórax" items={[{"text":"Agua caliente","state":"done"},{"text":"Bórax hasta saturar","state":"done"},{"text":"Mojar bien las puntas","state":"done"},{"text":"Dos manos, dejar secar","state":"done"}]} hue="amber" /> },
  { key: "inject1_0", start: 357.21, dur: 24.01, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/inject1_0.mp4" pages={[{"image":"img/dg_bx_manual.png","eyebrow":"Las proporciones exactas, en el manual"}]} /> },
  { key: "inject1_1", start: 381.22, dur: 13, kind: "half", el: (d) => <HalfShot durationInFrames={d} src="img/bx_manual_madera.png" side="right" kicker="Todo documentado" hue="blue" /> },
  { key: "punto_debil_0", start: 394.22, dur: 14.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/bxv_lluvia_madera.mp4" hue="blue" kicker="El agua puede lavar el bórax" /> },
  { key: "punto_debil_1", start: 408.96, dur: 9.83, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Hace"},{"t":"falta"},{"t":"una"},{"t":"segunda"},{"t":"defensa","hl":true}]} eyebrow="Contra el agua" hue="amber" bg="image" image="img/bx_galpon_madera.png" /> },
  { key: "aceite_0", start: 418.79, dur: 4.2, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="02" title="El líquido de $2 contra el agua" hue="amber" /> },
  { key: "aceite_1", start: 422.99, dur: 6.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_lino_planta.png" hue="red" /> },
  { key: "aceite_2", start: 429.28, dur: 16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_lino_semilla.png" hue="blue" kicker="Aceite de linaza" /> },
  { key: "aceite_3", start: 445.28, dur: 16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_pino_resina.png" hue="amber" /> },
  { key: "aceite_4", start: 461.28, dur: 16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_trementina.png" hue="red" kicker="Trementina de los pinos" /> },
  { key: "aceite_5", start: 477.28, dur: 25.6, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/aceite_5.mp4" pages={[{"image":"img/dg_bx_sella.png","eyebrow":"Penetra, endurece, sella desde adentro"}]} /> },
  { key: "aceite_receta_0", start: 502.88, dur: 7.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_verter_aceite.png" hue="red" kicker="Mitad aceite" /> },
  { key: "aceite_receta_1", start: 510.24, dur: 7.35, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_verter_trementina.png" hue="blue" /> },
  { key: "aceite_receta_2", start: 517.59, dur: 7.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_mezcla_mitad.png" hue="amber" kicker="Mitad y mitad" /> },
  { key: "aceite_receta_3", start: 524.95, dur: 5.39, kind: "float", el: (d) => <FloatingInsert durationInFrames={d} src="img/bx_pincel_cargar.png" side="left" hue="red" /> },
  { key: "aceite_receta_4", start: 530.34, dur: 7.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_oil_wood.mp4" hue="blue" kicker="Pincelar sobre el bórax seco" /> },
  { key: "aceite_receta_5", start: 537.7, dur: 7.35, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_madera_bebe.png" hue="amber" kicker="La madera lo bebe" /> },
  { key: "aceite_receta_6", start: 545.05, dur: 7.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/bxv_gota_pato.mp4" hue="red" kicker="El agua resbala como en un pato" /> },
  { key: "aceite_receta_7", start: 552.41, dur: 7.35, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_madera_sellada.png" hue="blue" kicker="Sellada por dentro" /> },
  { key: "aceite_receta_8", start: 559.76, dur: 6.38, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/bx_dos_defensas.png" annotations={[{"kind":"circle","x":35,"y":50,"label":"Bórax adentro"},{"kind":"arrow","x":70,"y":35,"label":"Aceite sella"}]} eyebrow="Las dos juntas" caption="El bórax mata, el aceite lo encierra" hue="amber" /> },
  { key: "cal_0", start: 566.14, dur: 9.89, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_cal_balde.png" hue="blue" /> },
  { key: "cal_1", start: 576.03, dur: 9.89, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_cal_pintar.png" hue="amber" kicker="La cal: 5000 años" /> },
  { key: "cal_2", start: 585.92, dur: 9.89, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_postes_blancos.png" hue="red" /> },
  { key: "cal_3", start: 595.81, dur: 9.89, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/bxv_madera_quemada.mp4" hue="blue" kicker="Quemar la punta enterrada" /> },
  { key: "cal_4", start: 605.7, dur: 9.89, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_poste_enterrar.png" hue="amber" kicker="Quemar, aceitar, enterrar" /> },
  { key: "cal_5", start: 615.59, dur: 6.6, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/bx_postes_blancos.png" title="La cal protege hace 5000 años" chips={["Vuelve la madera alcalina","Refleja el sol","Templos antiguos"]} hue="amber" /> },
  { key: "cal_6", start: 622.19, dur: 7.25, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Para la madera enterrada" items={["Quemar la superficie","Aceitar encima","Enterrar"]} accent={A} /> },
  { key: "credibilidad_0", start: 629.44, dur: 8.65, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Conocimiento viejo, probado" lines={[{"text":"El aceite de linaza protege barcos hace siglos."},{"text":"El bórax trata madera a nivel industrial.","mark":true}]} image="img/bx_barco_madera.png" hue="amber" /> },
  { key: "credibilidad_1", start: 638.09, dur: 10.81, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_barco_madera.png" hue="red" /> },
  { key: "credibilidad_2", start: 648.9, dur: 10.81, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_herramientas_aceitadas.png" hue="blue" /> },
  { key: "credibilidad_3", start: 659.71, dur: 10.81, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_aserradero_industrial.png" hue="amber" /> },
  { key: "inject2_0", start: 670.52, dur: 29.15, kind: "costtally", el: (d) => <CostTally durationInFrames={d} left={{"label":"El barniz que falla","note":"se descascara, comprás de nuevo","total":120,"bad":true}} right={{"label":"Constructor Libre","note":"bórax + aceite, una vez","total":4}} hue="red" /> },
  { key: "inject2_1", start: 699.67, dur: 27.82, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/bx_barniz_descascarado.png" words={parseQuote("El negocio es que tu madera se arruine *cada dos años*.")} accent="danger" hue="blue" /> },
  { key: "empezar_0", start: 727.49, dur: 18.73, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Bórax","desc":"agua caliente, 2 manos","image":"img/bx_echar_borax.png"},{"title":"Secar","desc":"un día entero","image":"img/bx_viga_tratada.png"},{"title":"Aceite","desc":"mitad y mitad, 2 manos","image":"img/bx_mezcla_mitad.png"}]} eyebrow="Sin miedo" title="Empezá con una pieza" hue="blue" /> },
  { key: "empezar_1", start: 746.22, dur: 18.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_pieza_practica.png" hue="amber" kicker="Empezá con algo chico" /> },
  { key: "empezar_2", start: 764.96, dur: 18.73, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_poste_cerca.png" hue="red" kicker="O un poste de cerca" /> },
  { key: "empezar_3", start: 783.69, dur: 31.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_dos_tablas.png" hue="blue" kicker="Compará a los 2 meses" /> },
  { key: "empezar_4", start: 815.54, dur: 15.61, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Sin tratar","value":3,"tone":"danger"},{"label":"Barniz caro","value":8},{"label":"Bórax + aceite","value":40,"winner":true}]} title="Cuánto dura la madera" unit="años" hue="amber" /> },
  { key: "objeciones_0", start: 831.15, dur: 18.21, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/bx_viga_tratada.png" title="¿Queda pegajoso o con olor?" chips={["No, si seca bien","Olor suave a madera","Cura en días"]} hue="blue" /> },
  { key: "objeciones_1", start: 849.36, dur: 27.31, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_tabla_cocina.png" hue="red" /> },
  { key: "objeciones_2", start: 876.67, dur: 18.21, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/bx_tabla_cocina.png" title="Seguro para comida" chips={["Aceite de linaza puro","Bien curado","Sin químicos"]} hue="blue" /> },
  { key: "panorama_0", start: 894.88, dur: 30.73, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Lo"},{"t":"más"},{"t":"caro"},{"t":"lo"},{"t":"come"},{"t":"un"},{"t":"bicho","hl":true}]} eyebrow="Una casa, un galpón" hue="red" bg="image" image="img/bx_termita_madera.png" /> },
  { key: "panorama_1", start: 925.61, dur: 32.26, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/bx_manos_viejas_madera.png" words={parseQuote("Hacían durar una viga *cien años* con aceite y minerales.")} hue="blue" /> },
  { key: "plan_0", start: 957.87, dur: 15.24, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Tu fin de semana" items={[{"text":"Conseguir bórax, aceite, trementina","state":"todo"},{"text":"Tratar una pieza de prueba","state":"todo"},{"text":"Dejarla a la intemperie y comparar","state":"todo"}]} hue="blue" /> },
  { key: "plan_1", start: 973.11, dur: 19.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_tomas_taller.png" hue="amber" /> },
  { key: "inject3_0", start: 992.16, dur: 25.08, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/inject3_0.mp4" pages={[{"image":"img/dg_bx_stack.png","eyebrow":"Vale 158 — hoy 27, para siempre"}]} /> },
  { key: "inject3_1", start: 1017.24, dur: 13.07, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Por separado","value":158,"tone":"danger"},{"label":"Hoy","value":27,"winner":true}]} title="El valor" unit="US$" hue="red" /> },
  { key: "inject3_2", start: 1030.31, dur: 10.97, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/bx_manual_celular.png" words={parseQuote("Si no te sirve, te devuelvo *todo*. El riesgo lo pongo yo.")} accent="good" hue="blue" /> },
  { key: "coment_0", start: 1041.28, dur: 19.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_tomas_camara.png" hue="red" kicker="¿Qué querés proteger?" /> },
  { key: "cierre_0", start: 1061.26, dur: 10.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_techo_vigas.png" hue="blue" kicker="El mismo techo" /> },
  { key: "cierre_1", start: 1071.37, dur: 10.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_hijo_madera.png" hue="amber" /> },
  { key: "cierre_2", start: 1081.48, dur: 7.08, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/bx_viga_maciza.png" words={parseQuote("Esta viga la va a heredar mi hijo. Es *herencia*, no gasto.")} hue="red" /> },
  { key: "cierre_3", start: 1088.56, dur: 17.52, kind: "journey", el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="Hacelo durar" title="Tres generaciones" waypoints={[{"x":0,"y":0,"z":0,"image":"img/bx_caja_borax.png","label":"Bórax","num":"1","dwell":2.6,"travel":1.6},{"x":1.2,"y":-0.4,"z":0.3,"image":"img/bx_mezcla_mitad.png","label":"Aceite de $2","num":"2","dwell":2.6,"travel":1.6},{"x":2.4,"y":0.3,"z":-0.2,"image":"img/bx_viga_maciza.png","label":"Madera para siempre","num":"3","dwell":3,"travel":1.4}]} /> },
  { key: "proximo_0", start: 1106.08, dur: 11.35, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_barrera_metales.png" hue="amber" kicker="La próxima: 2 metales = 0 plagas" /> },
  { key: "proximo_1", start: 1117.43, dur: 19.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/bx_tomas_firma.png" hue="red" /> },
];

export const REFRAME: { start: number; end: number }[] = [];
