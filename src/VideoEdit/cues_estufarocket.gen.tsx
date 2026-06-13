// cues_estufarocket.gen.tsx — GENERADO por beatsheet.mjs desde estufarocket.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/estufarocket.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { ChipsCluster } from "./scenes/ReframeContent";
import { SplitList } from "./scenes/SplitList";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { StatBig } from "./scenes/StatBig";
import { JourneyCanvas } from "./scenes/JourneyCanvas";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { AgedDoc } from "./scenes/AgedDoc";
import { BarCompare } from "./scenes/BarCompare";
import { CrossSection } from "./scenes/CrossSection";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { Checklist } from "./scenes/Checklist";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { CalloutMark } from "./scenes/CalloutMark";
import { InfiniteZoom } from "./scenes/InfiniteZoom";
import { HalfShot } from "./scenes/HalfShot";
import { CostTally } from "./scenes/CostTally";

const G = COLORS.good, A = COLORS.accent;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hook_1", start: 13.06, dur: 6.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_kindling_hand.mp4" hue="red" kicker="Un puñado de ramitas" /> },
  { key: "hook_2", start: 19.8, dur: 3.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_estufa_brasas.png" hue="blue" kicker="Calienta toda la casa" /> },
  { key: "hook_3", start: 23.76, dur: 3.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/erv_nieve_ventana.mp4" hue="amber" /> },
  { key: "hook_4", start: 27.72, dur: 3.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_ramitas_caben.png" hue="red" /> },
  { key: "hook_5", start: 31.68, dur: 3.97, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_termometro_22.png" hue="blue" /> },
  { key: "hook_6", start: 35.65, dur: 3.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tomas_mangas.png" hue="amber" kicker="En mangas de camisa" /> },
  { key: "hook_7", start: 39.61, dur: 3.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_garrafa_polvo.png" hue="red" /> },
  { key: "hook_8", start: 43.57, dur: 2.64, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"La"},{"t":"cuenta"},{"t":"de"},{"t":"gas:"},{"t":"cero","hl":true}]} eyebrow="Todo el invierno" hue="blue" bg="image" image="img/er_factura_gas.png" /> },
  { key: "hook_9", start: 46.21, dur: 3.97, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_estufa_barro_full.png" hue="amber" /> },
  { key: "hook_10", start: 50.18, dur: 3.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_snow_cabin.mp4" hue="red" /> },
  { key: "hook_11", start: 54.14, dur: 3.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tomas_hook_senala.png" hue="blue" kicker="Mirá esto" /> },
  { key: "ident_0", start: 58.1, dur: 16.86, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tomas_retrato.png" hue="red" kicker="Tomás" /> },
  { key: "ident_1", start: 74.96, dur: 9.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tomas_construyo.png" hue="blue" /> },
  { key: "ident_2", start: 84.88, dur: 6.95, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/er_manos_trabajo.png" words={parseQuote("No soy ingeniero. Soy un *hombre que prueba cosas*.")} hue="amber" /> },
  { key: "ident_3", start: 91.83, dur: 9.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tomas_incomoda.png" hue="red" kicker="La parte que te va a incomodar" /> },
  { key: "ident_4", start: 101.75, dur: 6.61, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Probé"},{"t":"lo"},{"t":"que"},{"t":"funciona."},{"t":"El"},{"t":"resto"},{"t":"lo"},{"t":"tiré","hl":true}]} eyebrow="20 años" hue="amber" bg="grid" /> },
  { key: "promesa_0", start: 108.36, dur: 4.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_pila_lena_fina.png" hue="blue" /> },
  { key: "promesa_1", start: 113.26, dur: 3.27, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={1} prefix="< " suffix=" mes de gas" label="lo que cuesta armar todo el sistema" eyebrow="Te lo prometo" hue="amber" /> },
  { key: "promesa_2", start: 116.53, dur: 3.27, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/er_estufa_barro_full.png" title="Lo que vas a saber al final" chips={["Estufa rocket","Muro Trombe","Sin combustible que comprar"]} hue="amber" /> },
  { key: "promesa_3", start: 119.8, dur: 4.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_cabana_humo.png" hue="blue" /> },
  { key: "problema_0", start: 124.7, dur: 6.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/erv_chimenea_humo.mp4" hue="amber" kicker="Pagás por calentar el cielo" /> },
  { key: "problema_1", start: 130.99, dur: 10.07, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/problema_1.mp4" pages={[{"image":"img/dg_er_perdida.png","eyebrow":"El calor se escapa antes de quedarse"}]} /> },
  { key: "problema_2", start: 141.06, dur: 5.25, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Hogar abierto","value":10,"tone":"danger"},{"label":"Salamandra común","value":50},{"label":"Estufa rocket","value":90,"winner":true}]} title="Cuánto calor aprovechás" unit="%" hue="blue" /> },
  { key: "problema_3", start: 146.31, dur: 6.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_woodstove_fire.mp4" hue="amber" kicker="La salamandra común" /> },
  { key: "problema_4", start: 152.6, dur: 6.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_hogar_abierto.png" hue="red" /> },
  { key: "problema_5", start: 158.9, dur: 6.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/erv_humo_caño.mp4" hue="blue" /> },
  { key: "problema_6", start: 165.19, dur: 4.2, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/er_hogar_abierto.png" title="El problema no es el frío" chips={["El calor","se escapa","antes de quedarse"]} hue="red" /> },
  { key: "problema_7", start: 169.39, dur: 6.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_lena_apilada.png" hue="red" /> },
  { key: "ancestral_0", start: 175.68, dur: 9.82, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="La pared que abriga" lines={[{"text":"Quemar poco, muy caliente."},{"text":"Guardar el calor en una masa de barro."}]} image="img/er_abuelo_pared.png" hue="red" /> },
  { key: "ancestral_1", start: 185.5, dur: 8.19, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/er_estufa_europa.png" title="El secreto de siempre" chips={["Quemar poco","Muy caliente","Guardar en masa"]} hue="amber" /> },
  { key: "ancestral_2", start: 193.69, dur: 12.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_estufa_europa.png" hue="amber" /> },
  { key: "ancestral_3", start: 205.96, dur: 12.28, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_pared_masa.png" hue="red" /> },
  { key: "ancestral_4", start: 218.24, dur: 8.18, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="2.000 años" image="img/er_piso_coreano.png" caption="Calentar la casa con el humo del fuego." hue="blue" /> },
  { key: "ancestral_5", start: 226.42, dur: 12.28, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/erv_brasa_barro.mp4" hue="amber" /> },
  { key: "rocket_mat_0", start: 238.7, dur: 3.34, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="01" title="La estufa rocket de barro" hue="blue" /> },
  { key: "rocket_mat_1", start: 242.04, dur: 5.02, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_ladrillos_pila.png" hue="amber" /> },
  { key: "rocket_mat_2", start: 247.06, dur: 5.01, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_adobe_brick.mp4" hue="red" kicker="Adobe del propio patio" /> },
  { key: "rocket_mat_3", start: 252.07, dur: 5.02, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_cob_mix.mp4" hue="blue" kicker="Barro, arena y paja" /> },
  { key: "rocket_mat_4", start: 257.09, dur: 5.01, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tambor_metal.png" hue="amber" /> },
  { key: "rocket_mat_5", start: 262.1, dur: 5.02, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_materiales_juntos.png" hue="red" /> },
  { key: "rocket_mat_6", start: 267.12, dur: 3.34, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/er_materiales_juntos.png" title="Casi todo recuperado" chips={["Ladrillos / adobe","Tambor viejo","Caño de chapa","Barro del patio"]} hue="amber" /> },
  { key: "rocket_mat_7", start: 270.46, dur: 3.68, kind: "half", el: (d) => <HalfShot durationInFrames={d} src="img/er_cano_chapa.png" side="right" kicker="El caño de chapa" hue="amber" /> },
  { key: "rocket_jota_0", start: 274.14, dur: 15.28, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/rocket_jota_0.mp4" pages={[{"image":"img/dg_er_jota.png","eyebrow":"El aire entra, baja y sube con fuerza"},{"image":"img/dg_er_tiro.png","eyebrow":"Quema casi completo, casi sin humo"}]} /> },
  { key: "rocket_jota_1", start: 289.42, dur: 16.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_rocket_burn.mp4" hue="red" kicker="Suena como un cohete" /> },
  { key: "rocket_jota_2", start: 305.66, dur: 9.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_feed_twigs.mp4" hue="blue" kicker="Ramitas finas, paradas" /> },
  { key: "rocket_jota_3", start: 315.21, dur: 8.27, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/er_riser_caliente.png" annotations={[{"kind":"arrow","x":50,"y":34,"label":"Llama hacia arriba"}]} eyebrow="El riser caliente" caption="Acá quema casi sin humo, a 1000°" hue="amber" /> },
  { key: "rocket_jota_4", start: 323.48, dur: 8.28, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/er_jota_corte.png" annotations={[{"kind":"arrow","x":24,"y":30,"label":"Entra la leña"},{"kind":"circle","x":50,"y":70,"label":"Túnel"},{"kind":"arrow","x":72,"y":28,"label":"Riser caliente"}]} eyebrow="La jota de fuego" caption="El aire entra, baja y sube con fuerza" hue="red" /> },
  { key: "rocket_jota_5", start: 331.76, dur: 9.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_ramitas_vs_tronco.png" hue="blue" /> },
  { key: "rocket_jota_6", start: 341.31, dur: 9.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_chimenea_sin_humo.png" hue="amber" /> },
  { key: "rocket_banco_0", start: 350.86, dur: 9.61, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tomas_tambor.png" hue="red" /> },
  { key: "rocket_banco_1", start: 360.47, dur: 8.02, kind: "cross", el: (d) => <CrossSection durationInFrames={d} layers={[{"label":"Tambor (calor inmediato)","color":"#A9794A","weight":2},{"label":"Caño serpenteando","color":"#7C8A5A","weight":3},{"label":"Banco de barro macizo","color":"#6F8478","weight":4},{"label":"Chimenea (humo frío)","color":"#6E8B47","weight":1}]} eyebrow="Por dónde viaja el calor" title="El banco de masa térmica" hue="blue" /> },
  { key: "rocket_banco_2", start: 368.49, dur: 9.61, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_cano_serpentea.png" hue="amber" /> },
  { key: "rocket_banco_3", start: 378.1, dur: 16.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_mass_heater.mp4" hue="red" kicker="El banco de barro" /> },
  { key: "rocket_banco_4", start: 394.44, dur: 9.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/erv_mano_banco_tibio.mp4" hue="blue" /> },
  { key: "rocket_banco_5", start: 404.06, dur: 6.41, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={12} suffix=" horas" label="sigue tibio después de que el fuego se apagó" eyebrow="El banco de masa" hue="amber" /> },
  { key: "rocket_banco_6", start: 410.47, dur: 16.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tomas_banco_sentado.png" hue="red" kicker="Tibio 10-12 horas después" /> },
  { key: "inject1_0", start: 426.81, dur: 24.71, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/inject1_0.mp4" pages={[{"image":"img/dg_er_manual.png","eyebrow":"Las medidas exactas, en el manual"}]} /> },
  { key: "inject1_1", start: 451.52, dur: 15.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_manual_medidas.png" hue="amber" /> },
  { key: "seguridad_0", start: 466.97, dur: 16.41, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_detector_co.png" hue="amber" /> },
  { key: "seguridad_1", start: 483.38, dur: 13.12, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Reglas que NO se negocian" items={[{"text":"Chimenea que saca bien los gases","state":"done"},{"text":"Detector de monóxido a pilas","state":"done"},{"text":"Quema limpia y caliente","state":"done"}]} hue="red" /> },
  { key: "seguridad_2", start: 496.5, dur: 16.41, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tomas_chimenea.png" hue="blue" /> },
  { key: "seguridad_3", start: 512.91, dur: 12.03, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="El fuego se respeta" items={["Quema limpia = menos monóxido","Recorrido sellado","Detector siempre"]} accent={G} /> },
  { key: "trombe_0", start: 524.94, dur: 11.85, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="02" title="El muro Trombe solar" hue="red" /> },
  { key: "trombe_1", start: 536.79, dur: 17.77, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/erv_sol_invierno.mp4" hue="blue" kicker="El sol calienta gratis" /> },
  { key: "trombe_2", start: 554.56, dur: 28.44, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/trombe_2.mp4" pages={[{"image":"img/dg_er_trombe1.png","eyebrow":"El muro se carga de sol todo el día"},{"image":"img/dg_er_trombe2.png","eyebrow":"De noche te lo devuelve, sin electricidad"}]} /> },
  { key: "trombe_3", start: 583, dur: 17.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_muro_oscuro.png" hue="red" /> },
  { key: "trombe_4", start: 600.78, dur: 17.77, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_vidrio_marco.png" hue="blue" /> },
  { key: "trombe_5", start: 618.55, dur: 17.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_sun_window.mp4" hue="amber" kicker="El sol entra por el vidrio" /> },
  { key: "trombe_6", start: 636.33, dur: 17.77, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_aberturas_muro.png" hue="red" /> },
  { key: "trombe_7", start: 654.1, dur: 11.85, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/er_muro_oscuro.png" title="Combustible: el sol" chips={["Muro oscuro","Vidrio delante","Cámara de aire","Cero electricidad"]} hue="amber" /> },
  { key: "trombe_8", start: 665.95, dur: 15.41, kind: "infzoom", el: (d) => <InfiniteZoom durationInFrames={d} images={[{"src":"img/er_muro_oscuro.png"},{"src":"img/er_vidrio_marco.png"},{"src":"img/er_aberturas_muro.png"}]} /> },
  { key: "trombe_9", start: 681.36, dur: 17.77, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tomas_mano_muro.png" hue="red" kicker="Caliente al atardecer, sin gastar nada" /> },
  { key: "inject2_0", start: 699.13, dur: 20.56, kind: "costtally", el: (d) => <CostTally durationInFrames={d} left={{"label":"El sistema actual","note":"factura cada mes, para siempre","total":480,"bad":true}} right={{"label":"Constructor Libre","note":"sol y barro, gratis","total":0}} hue="blue" /> },
  { key: "inject2_1", start: 719.69, dur: 19.63, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/er_corporacion_factura.png" words={parseQuote("Que dejes de *depender de ellos*.")} accent="danger" hue="amber" /> },
  { key: "empezar_0", start: 739.32, dur: 59.32, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Estufa de prueba","desc":"4 ladrillos y una lata","image":"img/er_prueba_ladrillos.png"},{"title":"Sentí el tiro","desc":"3 ramitas, mucho calor","image":"img/er_prueba_llama.png"},{"title":"La pared del sol","desc":"tu futuro muro Trombe","image":"img/er_pared_sol.png"}]} eyebrow="Sin miedo" title="Empezá chico" hue="amber" /> },
  { key: "empezar_1", start: 798.64, dur: 47.46, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Dale tiempo al barro" lines={[{"text":"Mi primera estufa la apuré y se rajó.","mark":true},{"text":"La segunda la dejé secar dos semanas: 15 años entera."}]} image="img/er_barro_secando.png" hue="red" /> },
  { key: "lena_0", start: 846.1, dur: 18.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/erv_juntar_lena.mp4" hue="red" kicker="Lo que el campo te regala" /> },
  { key: "lena_1", start: 864.55, dur: 13.52, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="La leña de la rocket" items={["Ramitas finas y secas","Palitos del grosor de un dedo","NO troncos gruesos"]} accent={A} /> },
  { key: "lena_2", start: 878.07, dur: 12.3, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/er_banco_largo.png" title="El tamaño manda" chips={["Pieza chica = banco corto","Pieza grande = más masa","En la duda, más masa"]} hue="blue" /> },
  { key: "lena_3", start: 890.37, dur: 18.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_banco_largo.png" hue="red" /> },
  { key: "panorama_0", start: 908.82, dur: 22.59, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={480} prefix="US$ " suffix="/año" label="lo que se va en gas de calefacción" eyebrow="El gasto que no vuelve" hue="blue" /> },
  { key: "panorama_1", start: 931.41, dur: 22.59, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"El"},{"t":"gasto"},{"t":"que"},{"t":"no"},{"t":"vuelve","hl":true}]} eyebrow="Medio año, toda la vida" hue="amber" bg="image" image="img/er_billetes_humo.png" /> },
  { key: "panorama_2", start: 954, dur: 23.72, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/er_manos_viejas_fuego.png" words={parseQuote("Los que construyeron este país lo hacían con *barro y sol*.")} hue="red" /> },
  { key: "plan_0", start: 977.72, dur: 12.1, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Tu fin de semana" items={[{"text":"Estufa de prueba (4 ladrillos)","state":"todo"},{"text":"Encontrar la pared del sol","state":"todo"},{"text":"Juntar ladrillos, tambor y caño","state":"todo"}]} hue="amber" /> },
  { key: "plan_1", start: 989.82, dur: 15.12, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tomas_taller_plan.png" hue="red" /> },
  { key: "plan_2", start: 1004.94, dur: 10.08, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"No"},{"t":"tenés"},{"t":"que"},{"t":"terminar."},{"t":"Tenés"},{"t":"que"},{"t":"empezar","hl":true}]} eyebrow="Este fin de semana" hue="amber" bg="grid" /> },
  { key: "inject3_0", start: 1015.02, dur: 22.06, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/inject3_0.mp4" pages={[{"image":"img/dg_er_stack.png","eyebrow":"Vale 158 — hoy 27, para siempre"}]} /> },
  { key: "inject3_1", start: 1037.08, dur: 11.49, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Por separado","value":158,"tone":"danger"},{"label":"Hoy","value":27,"winner":true}]} title="El valor" unit="US$" hue="blue" /> },
  { key: "inject3_2", start: 1048.57, dur: 9.65, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/er_manual_celular.png" words={parseQuote("Si no te sirve, te devuelvo *todo*. El riesgo lo pongo yo.")} accent="good" hue="amber" /> },
  { key: "coment_0", start: 1058.22, dur: 12.79, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tomas_camara.png" hue="blue" kicker="¿Cuánto pagás de calefacción?" /> },
  { key: "coment_1", start: 1071.01, dur: 8.53, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Contame"},{"t":"de"},{"t":"dónde"},{"t":"sos","hl":true}]} eyebrow="Leo todos los comentarios" hue="amber" bg="grid" /> },
  { key: "cierre_0", start: 1079.54, dur: 15.61, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/er_noche_banco.png" words={parseQuote("El calor de mi casa era *mío*. No dependía de nadie.")} hue="amber" /> },
  { key: "cierre_1", start: 1095.15, dur: 38.67, kind: "journey", el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="Tu camino a la independencia" title="Empezá hoy" waypoints={[{"x":0,"y":0,"z":0,"image":"img/er_j_prueba.png","label":"La estufa de prueba","num":"1","dwell":2.6,"travel":1.6},{"x":1.2,"y":-0.4,"z":0.3,"image":"img/er_j_muro.png","label":"El muro del sol","num":"2","dwell":2.6,"travel":1.6},{"x":2.4,"y":0.3,"z":-0.2,"image":"img/er_j_estufa.png","label":"La estufa grande","num":"3","dwell":2.6,"travel":1.6},{"x":3.6,"y":-0.2,"z":0.2,"image":"img/er_j_libre.png","label":"Libre","num":"4","dwell":3,"travel":1.4}]} /> },
  { key: "proximo_0", start: 1133.82, dur: 12.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_oven_fire.mp4" hue="red" kicker="La próxima: el horno de barro" /> },
  { key: "proximo_1", start: 1146.41, dur: 21.41, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/er_tomas_firma.png" hue="blue" /> },
];

export const REFRAME: { start: number; end: number }[] = [];
