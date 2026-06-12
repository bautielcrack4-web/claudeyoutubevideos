// cues_estiercol.gen.tsx — GENERADO por beatsheet.mjs desde estiercol.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/estiercol.json
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { Checklist } from "./scenes/Checklist";

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "rb_squeeze", start: 2.6, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_squeeze.mp4" hue="amber" kicker="Apretá un puñado de tierra" /> },
  { key: "rb_ball", start: 13.3, dur: 4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_ball.mp4" hue="amber" kicker="Dura como cemento = muerta" /> },
  { key: "rb_crumble", start: 19.7, dur: 4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_crumble.mp4" hue="amber" kicker="¿Se escurre como arena?" /> },
  { key: "rb_dig", start: 28.5, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_dig.mp4" hue="amber" kicker="Escarbá 20 cm" /> },
  { key: "rb_root", start: 31.9, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_root.mp4" hue="amber" kicker="¿Ni una raíz blanca?" /> },
  { key: "rb_vivero", start: 39, dur: 2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_vivero.mp4" hue="amber" kicker="El mejor abono del vivero…" /> },
  { key: "rb_bagged", start: 41, dur: 2.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_bagged.mp4" hue="amber" kicker="…la tierra negra embolsada…" /> },
  { key: "rb_chem", start: 43.5, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_chem.mp4" hue="amber" kicker="…el mejor químico…" /> },
  { key: "rb_dead", start: 47, dur: 4.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_dead.mp4" hue="red" kicker="En 6 meses: igual que al inicio" /> },
  { key: "mt_gallinas", start: 76.1, dur: 1.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_gallinas.mp4" hue="amber" /> },
  { key: "mt_conejos", start: 77.65, dur: 1.15, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_conejos.mp4" hue="amber" /> },
  { key: "mt_codornices", start: 78.8, dur: 1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_codornices.mp4" hue="amber" /> },
  { key: "mt_patos", start: 79.8, dur: 1.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_patos.mp4" hue="amber" /> },
  { key: "mt_cabras", start: 81.1, dur: 0.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_cabras.mp4" hue="amber" /> },
  { key: "mt_lombrices", start: 81.95, dur: 0.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_lombrices.mp4" hue="amber" /> },
  { key: "mt_abejas", start: 82.8, dur: 2.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_abejas.mp4" hue="amber" /> },
  { key: "mt_pasto", start: 104.8, dur: 1.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_pasto.mp4" hue="cold" /> },
  { key: "mt_trebol", start: 106.35, dur: 1.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_trebol.mp4" hue="cold" /> },
  { key: "mt_alfalfa", start: 108, dur: 2.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_alfalfa.mp4" hue="cold" /> },
  { key: "mt_huerto", start: 120.3, dur: 3.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_huerto.mp4" hue="cold" kicker="Sin huerto no hay alimento" /> },
  { key: "mt_super", start: 129.8, dur: 3.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_super.mp4" hue="amber" kicker="…volvés al supermercado" /> },
  { key: "mt_aband", start: 144.6, dur: 3.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_aband.mp4" hue="amber" kicker="Terreno abandonado 20 años" /> },
  { key: "mt_cemento", start: 148.9, dur: 2.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_cemento.mp4" hue="amber" kicker="Cemento y baldosas" /> },
  { key: "mt_arido", start: 152.1, dur: 3.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_arido.mp4" hue="amber" kicker="Zona árida y arenosa" /> },
  { key: "mt_campesinos", start: 172.3, dur: 4.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/mt_campesinos.mp4" hue="amber" kicker="Lo hacían los campesinos de siempre" /> },
  { key: "rb_handful_life", start: 210.1, dur: 6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_handful_life.mp4" hue="cold" kicker="Un puñado = más vida que humanos en la Tierra" /> },
  { key: "rb_worms", start: 222.2, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_worms.mp4" hue="cold" kicker="Bacterias, hongos, lombrices" /> },
  { key: "rb_dark_soil", start: 260.5, dur: 6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_dark_soil.mp4" hue="cold" kicker="Huele a bosque tras la lluvia" /> },
  { key: "rb_npk_bag", start: 291.4, dur: 6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_npk_bag.mp4" hue="amber" kicker="N-P-K: el número de la bolsa" /> },
  { key: "rb_scraps", start: 393.3, dur: 7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_scraps.mp4" hue="amber" kicker="1) Restos de cocina" /> },
  { key: "rb_leaves", start: 436.9, dur: 6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_leaves.mp4" hue="amber" kicker="2) Hojas secas = carbono" /> },
  { key: "rb_ash", start: 501.6, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_ash.mp4" hue="amber" kicker="3) Ceniza de madera" /> },
  { key: "rb_eggshells", start: 556.2, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_eggshells.mp4" hue="amber" kicker="4) Cáscaras de huevo (calcio)" /> },
  { key: "rb_endrot", start: 580.6, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_endrot.mp4" hue="red" kicker="Podredumbre apical = falta calcio" /> },
  { key: "rb_manure", start: 618.6, dur: 8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_manure.mp4" hue="amber" kicker="5) Estiércol — el alimento #1" /> },
  { key: "rb_broadfork", start: 784.4, dur: 6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_broadfork.mp4" hue="cold" kicker="Aflojá, no des vuelta la tierra" /> },
  { key: "rb_manure_layer", start: 807.2, dur: 6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_manure_layer.mp4" hue="amber" kicker="Capa de estiércol" /> },
  { key: "rb_layering", start: 835.1, dur: 6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_layering.mp4" hue="amber" kicker="Capa de restos de cocina" /> },
  { key: "rb_mulch", start: 866.9, dur: 7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_mulch.mp4" hue="cold" kicker="Tapá con hojas o cartón (mulch)" /> },
  { key: "ck_mulch", start: 894.4, dur: 9, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="El mulch hace 4 cosas a la vez" items={[{"text":"Protege la tierra del sol"},{"text":"Alimenta el suelo desde arriba"},{"text":"Frena las malezas"},{"text":"Retiene la humedad"}]} accent="good" hue="cold" /> },
  { key: "ck_ingredientes", start: 968.3, dur: 9, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="La mezcla de un dólar" items={[{"text":"Estiércol"},{"text":"Restos de cocina"},{"text":"Cáscaras de huevo"},{"text":"Ceniza (opcional)"},{"text":"Hojas secas o cartón"}]} accent="good" hue="amber" /> },
  { key: "rb_mycelium", start: 1076.8, dur: 6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_mycelium.mp4" hue="cold" kicker="Día 5-6: hilos blancos (micelio)" /> },
  { key: "rb_worms_appear", start: 1135.6, dur: 6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_worms_appear.mp4" hue="cold" kicker="Día 7: llegan las lombrices solas" /> },
  { key: "rb_clay_lot", start: 1492.7, dur: 6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_clay_lot.mp4" hue="amber" kicker="Arcilla gris, 15 años abandonada" /> },
  { key: "rb_harvest", start: 1578.9, dur: 6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_harvest.mp4" hue="cold" kicker="Tanto que regalé a los vecinos" /> },
  { key: "rb_worm_tube", start: 1624.4, dur: 8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rb_worm_tube.mp4" hue="amber" kicker="Tubo de lombrices: 2 dólares" /> },
];

export const REFRAME: { start: number; end: number }[] = [];
