// cues_barcos.gen.tsx — GENERADO por beatsheet.mjs desde barcos.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/barcos.json
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { ChipsCluster } from "./scenes/ReframeContent";
import { StatBig } from "./scenes/StatBig";
import { NameTag } from "./scenes/NameTag";
import { SagaTimeline } from "./scenes/SagaTimeline";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { AgedDoc } from "./scenes/AgedDoc";
import { BarCompare } from "./scenes/BarCompare";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { ExpeditionMap } from "./setpieces/ExpeditionMap";
import { ScaleColossus } from "./setpieces/ScaleColossus";
import { EvidenceBoard } from "./setpieces/EvidenceBoard";
import { LoupeInspect } from "./setpieces/LoupeInspect";
import { ThenNow } from "./setpieces/ThenNow";
import { GhostReconstruction } from "./setpieces/GhostReconstruction";
import { FocusCard } from "./setpieces/FocusCard";
import { TermCard } from "./setpieces/TermCard";
import { SplitExplain } from "./setpieces/SplitExplain";
import { DocLabel } from "./overlays/DocLabel";
import { PlaceTag } from "./overlays/PlaceTag";
import { DateStamp } from "./overlays/DateStamp";
import { CountRail } from "./overlays/CountRail";
import { SourceChip } from "./overlays/SourceChip";
import { SonarHUD } from "./overlays/SonarHUD";

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "c001", start: 0.1, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/abyss_descend.mp4" hue="cold" darken={0.18} /> },
  { key: "c002", start: 3.1, dur: 3.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/wreck_intact_seabed.mp4" hue="cold" darken={0.16} /> },
  { key: "c003", start: 6.2, dur: 2.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/wreck_mast.mp4" hue="cold" /> },
  { key: "c004", start: 8.8, dur: 2.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/wreck_rudder.mp4" hue="cold" /> },
  { key: "c005", start: 11.4, dur: 2.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rowing_benches.mp4" hue="cold" /> },
  { key: "c006", start: 14.3, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/wreck_deck_eerie.mp4" hue="cold" /> },
  { key: "c007", start: 17.3, dur: 3.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/wreck_interior_dark.mp4" hue="cold" darken={0.14} /> },
  { key: "c008", start: 20.6, dur: 3.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/diver_wreck_torch.mp4" hue="cold" /> },
  { key: "c009", start: 24, dur: 3.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/research_vessel_deck.mp4" hue="blue" /> },
  { key: "c010", start: 27.2, dur: 3.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sonar_lab_screens.mp4" hue="blue" /> },
  { key: "c011", start: 30.5, dur: 3.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rov_lights_wreck.mp4" hue="cold" darken={0.16} /> },
  { key: "c012", start: 33.6, dur: 3.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sonar_3d_wreck.mp4" hue="blue" /> },
  { key: "c013", start: 36.8, dur: 3.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/wreck_timbers.mp4" hue="cold" /> },
  { key: "c014", start: 40, dur: 4.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/stormy_ocean_omen.mp4" hue="cold" darken={0.2} /> },
  { key: "i015", start: 44.7, dur: 2.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="real/antikythera_fragment.jpg" hue="amber" /> },
  { key: "c016", start: 47.5, dur: 2.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/museum_bronze_case.mp4" hue="cold" /> },
  { key: "i017", start: 50.4, dur: 2.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="real/antikythera_gears.jpg" hue="amber" /> },
  { key: "c018", start: 53.2, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/gears_model_turning.mp4" hue="amber" /> },
  { key: "c019", start: 56.2, dur: 2.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/planets_orbits.mp4" hue="blue" /> },
  { key: "c020", start: 59.1, dur: 2.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/solar_eclipse.mp4" hue="cold" /> },
  { key: "stat021", start: 62.1, dur: 6, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={1400} suffix=" años" label="hasta volver a fabricar algo igual" eyebrow="Una computadora de bronce" accent="accent" hue="amber" /> },
  { key: "c022", start: 68.1, dur: 4.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/astronomical_clock.mp4" hue="amber" /> },
  { key: "c023", start: 72.4, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sink_dark_again.mp4" hue="cold" darken={0.18} /> },
  { key: "c024", start: 75.4, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/bronze_on_seabed.mp4" hue="cold" /> },
  { key: "c025", start: 78.4, dur: 4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/guanabara_aerial.mp4" hue="blue" /> },
  { key: "c026", start: 82.4, dur: 4.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/atlantic_crossing_ship.mp4" hue="cold" /> },
  { key: "stat027", start: 86.5, dur: 6.4, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={1500} suffix=" años antes" label="que Colón y los portugueses" eyebrow="Un océano cruzado" accent="danger" hue="red" /> },
  { key: "c028", start: 93.2, dur: 3.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/restricted_tape.mp4" hue="red" /> },
  { key: "c029", start: 96.3, dur: 3.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/site_roped_divers.mp4" hue="cold" /> },
  { key: "c030", start: 99.4, dur: 3.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/officials_documents.mp4" hue="red" /> },
  { key: "aged031", start: 102.8, dur: 4.5, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="ACCESO CLAUSURADO" lines={[{"text":"Investigación suspendida"},{"text":"Sitio cubierto por sedimento","mark":true},{"text":"Preguntas sin respuesta"}]} eyebrow="El hallazgo incómodo" accent="danger" hue="red" /> },
  { key: "c032", start: 107.3, dur: 2.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/silt_settling.mp4" hue="cold" darken={0.14} /> },
  { key: "c033", start: 110.1, dur: 2.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/archive_boxes.mp4" hue="amber" /> },
  { key: "c034", start: 113.5, dur: 3.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/primitive_engraving.mp4" hue="amber" /> },
  { key: "c035", start: 117.3, dur: 3.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/ancients_on_shore.mp4" hue="amber" /> },
  { key: "c036", start: 121.1, dur: 4.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/progress_line.mp4" hue="blue" /> },
  { key: "c037", start: 125.4, dur: 4.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/modern_city_time.mp4" hue="blue" /> },
  { key: "c038", start: 129.7, dur: 5.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/deep_mystery_water.mp4" hue="cold" darken={0.18} /> },
  { key: "headline039", start: 135.6, dur: 6, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Barcos"},{"t":"imposibles.","danger":true},{"t":"Tecnología"},{"t":"perdida.","danger":true},{"t":"Silencios"},{"t":"incómodos.","danger":true}]} hue="red" size={92} bg="image" image="real/dark_ocean.jpg" /> },
  { key: "headline040", start: 141.6, dur: 9.5, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"7","hl":true},{"t":"barcos"},{"t":"que"},{"t":"la"},{"t":"ciencia"},{"t":"no"},{"t":"puede"},{"t":"explicar","hl":true}]} hue="amber" size={96} bg="image" image="real/shipwreck_dramatic.jpg" /> },
  { key: "c041", start: 151.1, dur: 4.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/wreck_montage_drama.mp4" hue="cold" darken={0.12} /> },
  { key: "c042", start: 155.7, dur: 5.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/blue_descent_suspense.mp4" hue="cold" darken={0.14} /> },
  { key: "c043", start: 161.6, dur: 4.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/old_world_map_unroll.mp4" hue="amber" /> },
  { key: "c044", start: 166.1, dur: 4.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/ship_to_unknown_coast.mp4" hue="cold" /> },
  { key: "rule045", start: 170.6, dur: 4.5, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="07" title="El Barco de Uluburún" label="Costa sur de Turquía" hue="amber" /> },
  { key: "c046", start: 175.1, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/turkey_coast_aerial.mp4" hue="blue" /> },
  { key: "i047", start: 178.1, dur: 3.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="real/map_turkey_kas.jpg" hue="amber" kicker="1982" /> },
  { key: "c048", start: 181.7, dur: 2.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/free_diver_descend.mp4" hue="cold" /> },
  { key: "c049", start: 184.4, dur: 2.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sponge_diver_vintage.mp4" hue="cold" /> },
  { key: "c050", start: 187.2, dur: 2.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/diver_along_reef.mp4" hue="cold" /> },
  { key: "c051", start: 189.9, dur: 2.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/rocky_seabed_med.mp4" hue="cold" /> },
  { key: "i052", start: 192.6, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="real/oxhide_ingots_seabed.jpg" hue="amber" /> },
  { key: "c053", start: 195.6, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/objects_buried_sand.mp4" hue="cold" /> },
  { key: "c054", start: 198.6, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/diver_finds_object.mp4" hue="cold" /> },
  { key: "loupe055", start: 201.6, dur: 5.1, kind: "loupe", el: (d) => <LoupeInspect durationInFrames={d} image="real/copper_oxhide_ingot.jpg" focusX={0.52} focusY={0.48} zoom={2.6} label="La marca del fundidor en el lingote" accent="cyan" /> },
  { key: "termcard056", start: 206.7, dur: 7, kind: "termcard", el: (d) => <TermCard durationInFrames={d} bg="broll/excavation_grid.mp4" term="Lingote 'oxhide'" definition="Barras de cobre con forma de piel de buey: la 'moneda' del comercio en la Edad de Bronce." image="real/copper_oxhide_ingot.jpg" accent="amber" /> },
  { key: "c057", start: 213.7, dur: 3.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/raising_artifact.mp4" hue="cold" /> },
  { key: "nametag058", start: 217.6, dur: 3.3, kind: "nametag", el: (d) => <NameTag durationInFrames={d} name="Uluburun" sub="La nave de la Edad de Bronce" accent="accent" /> },
  { key: "scalecolossus059", start: 220.9, dur: 6.8, kind: "scalecolossus", el: (d) => <ScaleColossus durationInFrames={d} image="real/bronze_age_ship_art.jpg" meters={15} unit="m" label="de eslora" eyebrow="La nave de Uluburún" accent="cyan" /> },
  { key: "ghost060", start: 227.7, dur: 6.2, kind: "ghost", el: (d) => <GhostReconstruction durationInFrames={d} real="real/bronze_age_shipwreck_site.jpg" ghost="real/bronze_age_ship_art.jpg" label="Así surcaba el Mediterráneo" accent="cyan" /> },
  { key: "stat061", start: 233.9, dur: 3.2, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={3300} prefix="+" suffix=" años" label="de antigüedad" eyebrow="Se hundió ~1300 a.C." accent="accent" hue="amber" /> },
  { key: "timeline062", start: 237.1, dur: 7.5, kind: "timeline", el: (d) => <SagaTimeline durationInFrames={d} events={[{"year":"1300 a.C.","label":"Uluburun"},{"year":"27 a.C.","label":"Imperio Romano"}]} eyebrow="Plena Edad de Bronce" title="Mil años antes de Roma" /> },
  { key: "c063", start: 244.6, dur: 5.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/calm_deep_dark.mp4" hue="cold" darken={0.16} /> },
  { key: "focuscard064", start: 249.7, dur: 9.9, kind: "focuscard", el: (d) => <FocusCard durationInFrames={d} bg="broll/cargo_hold_amphorae.mp4" image="real/copper_ingots_stack.jpg" title="Una carga de otro mundo" desc="Diez toneladas de cobre, una de estaño y objetos de once culturas distintas — en una sola nave." eyebrow="La bodega" accent="amber" /> },
  { key: "bars065", start: 259.6, dur: 5, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Cobre","value":10},{"label":"Estaño","value":1}]} title="La carga de metal" unit=" t" accent="accent" hue="amber" /> },
  { key: "splitexplain066", start: 264.6, dur: 8.1, kind: "splitexplain", el: (d) => <SplitExplain durationInFrames={d} bg="broll/bronze_foundry.mp4" image="real/copper_ingots_stack.jpg" title="Cobre + estaño = bronce" points={["El metal más valioso de la era","Armas, herramientas y lujo","Por eso cruzaban mares por él"]} eyebrow="Por qué importaba" accent="amber" /> },
  { key: "stat067", start: 272.7, dur: 4, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={11} suffix=" culturas" label="en un solo barco" eyebrow="La carga imposible" accent="danger" hue="red" /> },
  { key: "c068", start: 276.7, dur: 3.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/artifacts_civilizations.mp4" hue="amber" /> },
  { key: "evidenceboard069", start: 280.6, dur: 24, kind: "evidenceboard", el: (d) => <EvidenceBoard durationInFrames={d} items={[{"src":"real/canaanite_jars.jpg","label":"Vasija cananea"},{"src":"real/ebony_logs.jpg","label":"Ébano · África"},{"src":"real/ivory_tusk.jpg","label":"Marfil"},{"src":"real/egyptian_gold_jewelry.jpg","label":"Oro · Egipto"},{"src":"real/mycenaean_pottery.jpg","label":"Cerámica micénica"},{"src":"real/baltic_amber.jpg","label":"Ámbar · Báltico"}]} title="Una sola bodega · once culturas" accent="red" /> },
  { key: "i070", start: 304.6, dur: 3.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="real/old_mediterranean_map.jpg" hue="amber" /> },
  { key: "c071", start: 308.3, dur: 3.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/baltic_cold_coast.mp4" hue="cold" /> },
  { key: "c072", start: 312.7, dur: 3.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/ocean_contemplative.mp4" hue="cold" /> },
  { key: "expeditionmap073", start: 316, dur: 12.5, kind: "expeditionmap", el: (d) => <ExpeditionMap durationInFrames={d} mapImage="real/old_mediterranean_map.jpg" route={[{"x":0.64,"y":0.44},{"x":0.52,"y":0.5},{"x":0.42,"y":0.46},{"x":0.34,"y":0.28},{"x":0.2,"y":0.64}]} pins={[{"x":0.64,"y":0.44,"label":"Egipto"},{"x":0.52,"y":0.5,"label":"Grecia"},{"x":0.42,"y":0.46,"label":"Mesopotamia"},{"x":0.34,"y":0.28,"label":"Báltico"},{"x":0.2,"y":0.64,"label":"África"}]} eyebrow="Una red de comercio global" title="Un solo barco conectaba el mundo conocido" accent="amber" /> },
  { key: "c074", start: 328.5, dur: 3.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/ship_hold_mixed.mp4" hue="cold" /> },
  { key: "c075", start: 331.7, dur: 3.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amphorae_stacked.mp4" hue="cold" /> },
  { key: "c076", start: 335, dur: 3.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/ancient_port_goods.mp4" hue="amber" /> },
  { key: "thennow077", start: 341.7, dur: 8.6, kind: "thennow", el: (d) => <ThenNow durationInFrames={d} before={{"src":"real/oxhide_ingots_seabed.jpg","label":"En el lecho marino"}} after={{"src":"real/copper_oxhide_ingot.jpg","label":"Restaurado"}} accent="amber" /> },
  { key: "c078", start: 350.3, dur: 5.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/navigation_stars.mp4" hue="blue" /> },
  { key: "chips079", start: 355.6, dur: 7.6, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="real/mediterranean_sea_wind.jpg" title="Sabían leer" chips={["los vientos","las corrientes","los puertos","los idiomas"]} hue="amber" /> },
  { key: "i080", start: 363.2, dur: 3.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="real/ancient_coins.jpg" hue="amber" /> },
  { key: "c081", start: 366.7, dur: 3.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/ancient_harbor_busy.mp4" hue="amber" /> },
  { key: "c082", start: 370.5, dur: 3.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/ships_docking_port.mp4" hue="amber" /> },
  { key: "c083", start: 374.3, dur: 3.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/trade_routes_lines.mp4" hue="blue" /> },
  { key: "c084", start: 378.6, dur: 5.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/ancient_scribe.mp4" hue="amber" /> },
  { key: "i085", start: 384.3, dur: 6.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="real/empty_archive_shelves.jpg" hue="cold" /> },
  { key: "c086", start: 390.7, dur: 3.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/ship_sinking_dark.mp4" hue="cold" darken={0.18} /> },
  { key: "c087", start: 394.1, dur: 3.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/shadows_underwater.mp4" hue="cold" darken={0.2} /> },
  { key: "c088", start: 397.6, dur: 4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/stone_fissure.mp4" hue="cold" /> },
  { key: "c089", start: 401.6, dur: 4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/vast_deep_unknown.mp4" hue="cold" darken={0.16} /> },
  { key: "c090", start: 405.6, dur: 4.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/bronze_ship_sunset.mp4" hue="amber" /> },
  { key: "headline091", start: 409.7, dur: 6.6, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"¿Qué"},{"t":"más"},{"t":"eran"},{"t":"capaces","hl":true},{"t":"de"},{"t":"hacer?","hl":true}]} hue="amber" size={100} bg="image" image="real/shipwreck_dramatic.jpg" /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [
  { key: "o092", start: 78.4, dur: 6, kind: "placetag", el: (d) => <PlaceTag durationInFrames={d} place="Bahía de Guanabara" sub="Brasil" accent="ice" /> },
  { key: "o093", start: 170.6, dur: 245, kind: "countrail", el: (d) => <CountRail durationInFrames={d} rank={7} total={7} name="Uluburún" accent="amber" /> },
  { key: "o094", start: 178.1, dur: 5, kind: "datestamp", el: (d) => <DateStamp durationInFrames={d} value="1982" label="AÑO" accent="cyan" corner="tr" /> },
  { key: "o095", start: 181.7, dur: 6, kind: "placetag", el: (d) => <PlaceTag durationInFrames={d} place="Cabo Uluburún" sub="Costa sur de Turquía · Mediterráneo" accent="cyan" /> },
  { key: "o096", start: 192.6, dur: 8, kind: "sonarhud", el: (d) => <SonarHUD durationInFrames={d} depth="PROF. 44 m" coords="36.1°N 29.6°E" accent="ice" /> },
  { key: "o097", start: 192.6, dur: 6, kind: "doclabel", el: (d) => <DocLabel durationInFrames={d} label="Lingotes de cobre" sub="forma de 'piel de buey'" accent="amber" /> },
  { key: "o098", start: 206.7, dur: 6, kind: "sourcechip", el: (d) => <SourceChip durationInFrames={d} text="Naufragio de Uluburun · Museo de Bodrum" accent="cyan" /> },
  { key: "o099", start: 227.7, dur: 6, kind: "datestamp", el: (d) => <DateStamp durationInFrames={d} value="≈1300 a.C." label="ÉPOCA" accent="amber" corner="tr" /> },
];
