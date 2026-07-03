import "./index.css";
import { Composition } from "remotion";
import { MainKitPreviewPx, TOTAL_FRAMES_KITPX } from "./VideoEdit/KitPreviewPx";
import { MainEstiercol, TOTAL_FRAMES_EST } from "./VideoEdit/Main_estiercol";
import { MainWasp, TOTAL_FRAMES_WASP } from "./VideoEdit/Main_wasp";
import { MainTick, TOTAL_FRAMES_TICK } from "./VideoEdit/Main_tick";
import { MainMeriendas, TOTAL_FRAMES_MER } from "./VideoEdit/Main_meriendas";
import { MainPostres, TOTAL_FRAMES_POS } from "./VideoEdit/Main_postres";
import { MainDulces, TOTAL_FRAMES_DUL } from "./VideoEdit/Main_dulces";
import { MainDomingos, TOTAL_FRAMES_DOM } from "./VideoEdit/Main_domingos";
import { MainCocina, TOTAL_FRAMES_COC } from "./VideoEdit/Main_cocina";
import { MainEstufaRocket, TOTAL_FRAMES_ER } from "./VideoEdit/Main_estufarocket";
import { MainBorax, TOTAL_FRAMES_BX } from "./VideoEdit/Main_borax";
import { MainBarrera, TOTAL_FRAMES_BRR } from "./VideoEdit/Main_barrera";
import { MainJabon, TOTAL_FRAMES_JABON } from "./VideoEdit/Main_jabon";
import { MainCeniza, TOTAL_FRAMES_CENIZA } from "./VideoEdit/Main_ceniza";
import { MainRatas, TOTAL_FRAMES_RATAS } from "./VideoEdit/Main_ratas";
import { MainMelon, TOTAL_FRAMES_MELON } from "./VideoEdit/Main_melon";
import { MainGallinas, TOTAL_FRAMES_GALLINAS } from "./VideoEdit/Main_gallinas";
import { MainOvejas, TOTAL_FRAMES_OVEJAS } from "./VideoEdit/Main_ovejas";
import { MainCorn, TOTAL_FRAMES_CORN } from "./VideoEdit/Main_corn";
import { MainAbono, TOTAL_FRAMES_ABONO } from "./VideoEdit/Main_abono";
import { MainChoclo, TOTAL_FRAMES_CHOCLO } from "./VideoEdit/Main_choclo";
import { MainHugel, TOTAL_FRAMES_HUGEL } from "./VideoEdit/Main_hugel";
import { MainOllas, TOTAL_FRAMES_OLLAS } from "./VideoEdit/Main_ollas";
import { MainPeroxido, TOTAL_FRAMES_PEROXIDO } from "./VideoEdit/Main_peroxido";
import { MainPeroxide, TOTAL_FRAMES_PEROXIDE } from "./VideoEdit/Main_peroxide";
import { MainMoho, TOTAL_FRAMES_MOHO } from "./VideoEdit/Main_moho";
import { MainAcpipe, TOTAL_FRAMES_ACPIPE } from "./VideoEdit/Main_acpipe";
import { MainSandia, TOTAL_FRAMES_SANDIA } from "./VideoEdit/Main_sandia";
import { MainRampump, TOTAL_FRAMES_RAMPUMP } from "./VideoEdit/Main_rampump";
import { MainZeer, TOTAL_FRAMES_ZEER } from "./VideoEdit/Main_zeer";
import { MainCalor, TOTAL_FRAMES_CALOR } from "./VideoEdit/Main_calor";
import { MainCarne, TOTAL_FRAMES_CARNE } from "./VideoEdit/Main_carne";
import { MainMolino, TOTAL_FRAMES_MOLINO } from "./VideoEdit/Main_molino";
import { MainLeche, TOTAL_FRAMES_LECHE } from "./VideoEdit/Main_leche";
import { MainLuz, TOTAL_FRAMES_LUZ } from "./VideoEdit/Main_luz";
import { MainMedicaid, TOTAL_FRAMES_MED } from "./VideoEdit/Main_medicaid";
import { MainViuda, TOTAL_FRAMES_VD } from "./VideoEdit/Main_viuda";
import { MainEstafas, TOTAL_FRAMES_ES } from "./VideoEdit/Main_estafas";
import { MainHormiga, TOTAL_FRAMES_HB } from "./VideoEdit/Main_hormiga";
import { MainHuron, TOTAL_FRAMES_HUR } from "./VideoEdit/Main_huron";
import { MainCastores, TOTAL_FRAMES_CAS } from "./VideoEdit/Main_castores";
import { MainAral, TOTAL_FRAMES_AR } from "./VideoEdit/Main_aral";
import { MainBarcos, TOTAL_FRAMES_BAR } from "./VideoEdit/Main_barcos";
import { MainLeona, TOTAL_FRAMES_LEONA } from "./VideoEdit/Main_leona";
import { MainConstrucciones, TOTAL_FRAMES_CONS } from "./VideoEdit/Main_construcciones";
import { MainAntartida, TOTAL_FRAMES_ANT } from "./VideoEdit/Main_antartida";
import { MainTuneles, TOTAL_FRAMES_TUN } from "./VideoEdit/Main_tuneles";
import { MainOxido, TOTAL_FRAMES_OXIDO } from "./VideoEdit/Main_oxido";
import { MainMosquitos, TOTAL_FRAMES_MOSQUITOS } from "./VideoEdit/Main_mosquitos";
import { MainGotera, TOTAL_FRAMES_GOTERA } from "./VideoEdit/Main_gotera";
import { MainPlomeria, TOTAL_FRAMES_PLOMERIA } from "./VideoEdit/Main_plomeria";
import { MainPuertas, TOTAL_FRAMES_PUE } from "./VideoEdit/Main_puertas";
import { MainMapas, TOTAL_FRAMES_MAP } from "./VideoEdit/Main_mapas";
import { MainFaros, TOTAL_FRAMES_FAROS } from "./VideoEdit/Main_faros";
import { MainMadera, TOTAL_FRAMES_MADERA } from "./VideoEdit/Main_madera";
import { MainCemento, TOTAL_FRAMES_CEMENTO } from "./VideoEdit/Main_cemento";
import { MainSalitre, TOTAL_FRAMES_SALITRE } from "./VideoEdit/Main_salitre";
import { MainAcauto, TOTAL_FRAMES_ACAUTO } from "./VideoEdit/Main_acauto";
import { MainRayones, TOTAL_FRAMES_RAYONES } from "./VideoEdit/Main_rayones";
import { MainKitPreview, TOTAL_FRAMES_KIT } from "./VideoEdit/KitPreview";
// import { MainCafe, TOTAL_FRAMES_CAFE } from "./VideoEdit/Main_cafe"; // untracked: rompe el farm
// import { MainAmish, TOTAL_FRAMES_AMISH } from "./VideoEdit/Main_amish"; // untracked: rompe el farm

// ── SOLO los videos ACTIVOS quedan registrados ──
// Las composiciones viejas (Fly, Hipos, Bisontes, Objetos, Civil, Top7Demo,
// Mograph, MographShowcase, etc.) quedan DESREGISTRADAS para que Studio no las
// cargue ni tire 404 de audios que ya no están en disco. Sus archivos siguen en
// src/VideoEdit/ — para reactivar una, volvé a importarla y agregá su <Composition>.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Hoja de contactos — 16 componentes bespoke del video de peróxido */}
      <Composition id="KitPreviewPx" component={MainKitPreviewPx} durationInFrames={TOTAL_FRAMES_KITPX} fps={30} width={1920} height={1080} />
      {/* PREVIEW DEL KIT — los 30 componentes genéricos en secuencia (90 frames c/u) */}
      <Composition id="KitPreview" component={MainKitPreview} durationInFrames={TOTAL_FRAMES_KIT} fps={30} width={1920} height={1080} />
      {/* VIDEO ACTIVO — Crónicas Perdidas · "7 Barcos…" (SLICE 1) · faceless · voz clonada */}
      <Composition id="Barcos" component={MainBarcos} durationInFrames={TOTAL_FRAMES_BAR} fps={30} width={1920} height={1080} />
      {/* VIDEO ACTIVO — Documental fauna · "El Hurón de Patas Negras" · faceless · voz clonada */}
      <Composition id="Huron" component={MainHuron} durationInFrames={TOTAL_FRAMES_HUR} fps={30} width={1920} height={1080} />
      {/* DOCUMENTAL FAUNA · Planeta Reconstruido — Castores paracaidistas de Idaho (1948) */}
      <Composition id="Castores" component={MainCastores} durationInFrames={TOTAL_FRAMES_CAS} fps={30} width={1920} height={1080} />
      {/* DOCUMENTAL FAUNA · Planeta Reconstruido — El Mar de Aral (del desastre al regreso) */}
      <Composition id="Aral" component={MainAral} durationInFrames={TOTAL_FRAMES_AR} fps={30} width={1920} height={1080} />
      {/* TEST nicho fauna — "La leona" (clip real por frase + voz Trevor) */}
      <Composition id="Leona" component={MainLeona} durationInFrames={TOTAL_FRAMES_LEONA} fps={30} width={1920} height={1080} />
      {/* TEST Cafe/Amish deshabilitados: Main_* sin commitear → rompen el farm */}
      {/* VIDEO 2 Crónicas Perdidas — "7 Construcciones Antiguas Que la Ciencia No Puede Explicar" */}
      <Composition id="Construcciones" component={MainConstrucciones} durationInFrames={TOTAL_FRAMES_CONS} fps={30} width={1920} height={1080} />
      {/* VIDEO 4 Crónicas Perdidas — "7 Estructuras Bajo el Hielo de la Antártida" · faceless · voz Trevor */}
      <Composition id="Antartida" component={MainAntartida} durationInFrames={TOTAL_FRAMES_ANT} fps={30} width={1920} height={1080} />
      {/* VIDEO 5 Crónicas Perdidas — "7 Túneles Antiguos Que la Ciencia No Puede Explicar" */}
      <Composition id="Tuneles" component={MainTuneles} durationInFrames={TOTAL_FRAMES_TUN} fps={30} width={1920} height={1080} />
      {/* VIDEO 6 Crónicas Perdidas — "7 Puertas Antiguas Que Nadie Ha Logrado Abrir" · faceless · voz Trevor */}
      <Composition id="Puertas" component={MainPuertas} durationInFrames={TOTAL_FRAMES_PUE} fps={30} width={1920} height={1080} />
      {/* VIDEO 7 Crónicas Perdidas — "7 Mapas Antiguos Que No Deberían Existir" · faceless · voz Trevor */}
      <Composition id="Mapas" component={MainMapas} durationInFrames={TOTAL_FRAMES_MAP} fps={30} width={1920} height={1080} />
      {/* VIDEO ACTIVO — Ben retirado · "Los gastos hormiga" · AVATAR · look ALARMA */}
      <Composition id="Hormiga" component={MainHormiga} durationInFrames={TOTAL_FRAMES_HB} fps={30} width={1920} height={1080} />
      {/* VIDEO ACTIVO — Ben retirado · "Las estafas que vacían la cuenta" · AVATAR · look ALARMA */}
      <Composition id="Estafas" component={MainEstafas} durationInFrames={TOTAL_FRAMES_ES} fps={30} width={1920} height={1080} />
      {/* VIDEO ACTIVO — Ben retirado · "La trampa de la viuda" · AVATAR · look ALARMA */}
      <Composition id="Viuda" component={MainViuda} durationInFrames={TOTAL_FRAMES_VD} fps={30} width={1920} height={1080} />
      {/* VIDEO ACTIVO — Ben retirado · "¿Casa PAGADA? Medicaid se la QUEDA" · AVATAR · look ALARMA */}
      <Composition id="Medicaid" component={MainMedicaid} durationInFrames={TOTAL_FRAMES_MED} fps={30} width={1920} height={1080} />
      {/* VIDEO ACTIVO — Nunca Más Compres Jabón (ceniza+grasa) · Constructor Libre v4 · faceless */}
      <Composition
        id="Jabon"
        component={MainJabon}
        durationInFrames={TOTAL_FRAMES_JABON}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — No Tires La Ceniza · Constructor Libre v5 · faceless */}
      <Composition id="Ceniza" component={MainCeniza} durationInFrames={TOTAL_FRAMES_CENIZA} fps={30} width={1920} height={1080} />
      {/* VIDEO ACTIVO — Saca las ratas con $1 · Constructor Libre v6 · AVATAR */}
      <Composition id="Ratas" component={MainRatas} durationInFrames={TOTAL_FRAMES_RATAS} fps={30} width={1920} height={1080} />
      {/* VIDEO ACTIVO — KILL EVERY Wasp On Your Property (The Amish Way) */}
      <Composition
        id="Wasp"
        component={MainWasp}
        durationInFrames={TOTAL_FRAMES_WASP}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — El Moho NUNCA Vuelve (Constructor Libre · Tomás · clips-first híbrido) */}
      <Composition
        id="Moho"
        component={MainMoho}
        durationInFrames={TOTAL_FRAMES_MOHO}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Hydrogen Peroxide in the Garden (Claudio Yoder #2 · clips-first) */}
      <Composition
        id="Peroxide"
        component={MainPeroxide}
        durationInFrames={TOTAL_FRAMES_PEROXIDE}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Luz con una llama (off-grid Claudio · EN · clips-first + overlays + WaterLensLight) */}
      <Composition
        id="Luz"
        component={MainLuz}
        durationInFrames={TOTAL_FRAMES_LUZ}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Ariete hidráulico (off-grid Claudio · EN · clips-first + overlays + RamPumpCycle) */}
      <Composition
        id="Rampump"
        component={MainRampump}
        durationInFrames={TOTAL_FRAMES_RAMPUMP}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Sandía más dulce (El Constructor Libre · ES · clips-first + manual $27) */}
      <Composition
        id="Sandia"
        component={MainSandia}
        durationInFrames={TOTAL_FRAMES_SANDIA}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — $40 Amish Cooling Pipe / earth tube (Claudio · canal nuevo off-grid EN) */}
      <Composition
        id="Acpipe"
        component={MainAcpipe}
        durationInFrames={TOTAL_FRAMES_ACPIPE}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Keep food cold with no fridge / zeer pot (Claudio · off-grid EN) */}
      <Composition
        id="Zeer"
        component={MainZeer}
        durationInFrames={TOTAL_FRAMES_ZEER}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Heat the house with one fire + stone (Claudio · off-grid EN) */}
      <Composition
        id="Calor"
        component={MainCalor}
        durationInFrames={TOTAL_FRAMES_CALOR}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Keep meat a year with no fridge (Claudio · off-grid EN) */}
      <Composition
        id="Carne"
        component={MainCarne}
        durationInFrames={TOTAL_FRAMES_CARNE}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Grandfather's windmill, 80 years no power (claudio yoder · homestead EN) */}
      <Composition
        id="Molino"
        component={MainMolino}
        durationInFrames={TOTAL_FRAMES_MOLINO}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Milk/cream/butter fresh in summer, no power (Amish Off-Grid Claudio · EN) */}
      <Composition
        id="Leche"
        component={MainLeche}
        durationInFrames={TOTAL_FRAMES_LECHE}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Agua oxigenada / 7 trucos (Levi Lapp Jardín · ES) */}
      <Composition
        id="Peroxido"
        component={MainPeroxido}
        durationInFrames={TOTAL_FRAMES_PEROXIDO}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Ollas de barro / riego enterrado (Levi Lapp Jardín · ES) */}
      <Composition
        id="Ollas"
        component={MainOllas}
        durationInFrames={TOTAL_FRAMES_OLLAS}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Hugelkultur / troncos enterrados (Levi Lapp Jardín · ES) */}
      <Composition
        id="Hugel"
        component={MainHugel}
        durationInFrames={TOTAL_FRAMES_HUGEL}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Cómo elegir el choclo más dulce (LeviLappJardín · ES) */}
      <Composition
        id="Choclo"
        component={MainChoclo}
        durationInFrames={TOTAL_FRAMES_CHOCLO}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — 7 Basuras de Cocina = Abono GRATIS (Levi Lapp Jardín · canal ES) */}
      <Composition
        id="Abono"
        component={MainAbono}
        durationInFrames={TOTAL_FRAMES_ABONO}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — How to Pick the Sweetest Corn (Levi Lapp Jardín · canal nuevo EN) */}
      <Composition
        id="Corn"
        component={MainCorn}
        durationInFrames={TOTAL_FRAMES_CORN}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — How to Pick the Sweetest Watermelon (Claudio Yoder · canal nuevo EN) */}
      <Composition
        id="Melon"
        component={MainMelon}
        durationInFrames={TOTAL_FRAMES_MELON}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Invertí $2.500 en Ovejas y Hoy Vale $225.000 (Cosecha Prohibida · ES) */}
      <Composition
        id="Ovejas"
        component={MainOvejas}
        durationInFrames={TOTAL_FRAMES_OVEJAS}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — Cuánto Dinero Te Dan 50 Gallinas Ponedoras (Cosecha Prohibida · ES) */}
      <Composition
        id="Gallinas"
        component={MainGallinas}
        durationInFrames={TOTAL_FRAMES_GALLINAS}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — KILL EVERY Tick On Your Land (The Amish Way · $4 Powder) */}
      <Composition
        id="Tick"
        component={MainTick}
        durationInFrames={TOTAL_FRAMES_TICK}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — 25 Meriendas Caseras Que Ya Nadie Prepara (voz anciana, faceless) */}
      <Composition
        id="Meriendas"
        component={MainMeriendas}
        durationInFrames={TOTAL_FRAMES_MER}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — 20 Postres de la Abuela Que Desaparecieron (Video 2 cadena) */}
      <Composition
        id="Postres"
        component={MainPostres}
        durationInFrames={TOTAL_FRAMES_POS}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — 20 Dulces de la Abuela Que Ya No Se Hacen (canal Abuela Rosa) */}
      <Composition
        id="Dulces"
        component={MainDulces}
        durationInFrames={TOTAL_FRAMES_DUL}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — 15 Costumbres de los Domingos (Video 3 cadena) */}
      <Composition id="Domingos" component={MainDomingos} durationInFrames={TOTAL_FRAMES_DOM} fps={30} width={1920} height={1080} />
      {/* VIDEO ACTIVO — Así se Cocinaba Antes de los Supermercados (Video 4 cadena) */}
      <Composition id="Cocina" component={MainCocina} durationInFrames={TOTAL_FRAMES_COC} fps={30} width={1920} height={1080} />
      {/* VIDEO 1 · EL CONSTRUCTOR LIBRE — Calenté toda mi casa con ramitas (avatar Tomás) */}
      <Composition id="EstufaRocket" component={MainEstufaRocket} durationInFrames={TOTAL_FRAMES_ER} fps={30} width={1920} height={1080} />
      {/* VIDEO 2 · EL CONSTRUCTOR LIBRE — Madera sin termitas (bórax + aceite) */}
      <Composition id="Borax" component={MainBorax} durationInFrames={TOTAL_FRAMES_BX} fps={30} width={1920} height={1080} />
      {/* VIDEO 3 · EL CONSTRUCTOR LIBRE — 2 metales = 0 plagas (barrera galvánica) */}
      <Composition id="Barrera" component={MainBarrera} durationInFrames={TOTAL_FRAMES_BRR} fps={30} width={1920} height={1080} />
      <Composition id="Oxido" component={MainOxido} durationInFrames={TOTAL_FRAMES_OXIDO} fps={30} width={1920} height={1080} />
      <Composition id="Mosquitos" component={MainMosquitos} durationInFrames={TOTAL_FRAMES_MOSQUITOS} fps={30} width={1920} height={1080} />
      <Composition id="Gotera" component={MainGotera} durationInFrames={TOTAL_FRAMES_GOTERA} fps={30} width={1920} height={1080} />
      <Composition id="Plomeria" component={MainPlomeria} durationInFrames={TOTAL_FRAMES_PLOMERIA} fps={30} width={1920} height={1080} />
      {/* VIDEO 5 Constructor Libre — "Faros Amarillos: el truco de $5" · AVATAR Tomás · clips-first */}
      <Composition id="Faros" component={MainFaros} durationInFrames={TOTAL_FRAMES_FAROS} fps={30} width={1920} height={1080} />
      {/* VIDEO 6 Constructor Libre — "Rayones del auto: el truco de $5" · AVATAR Tomás · clips-first */}
      <Composition id="Rayones" component={MainRayones} durationInFrames={TOTAL_FRAMES_RAYONES} fps={30} width={1920} height={1080} />
      {/* REMAKE hit madera — "Por Qué La Madera De Antes Duraba 100 Años" · AVATAR Tomás · clips-first */}
      <Composition id="Madera" component={MainMadera} durationInFrames={TOTAL_FRAMES_MADERA} fps={30} width={1920} height={1080} />
      {/* REMAKE cemento romano — "Por Qué El Cemento Romano Duró 2000 Años" · AVATAR Tomás · clips-first */}
      <Composition id="Cemento" component={MainCemento} durationInFrames={TOTAL_FRAMES_CEMENTO} fps={30} width={1920} height={1080} />
      {/* Humedad/salitre en la pared — "La Humedad Que Sube NUNCA Vuelve" · AVATAR Tomás · clips-first */}
      <Composition id="Salitre" component={MainSalitre} durationInFrames={TOTAL_FRAMES_SALITRE} fps={30} width={1920} height={1080} />
      {/* AC del auto — "El Aire De Tu Auto Enfría Como Nuevo Con Esto De $10" · AVATAR Tomás · clips-first */}
      <Composition id="Acauto" component={MainAcauto} durationInFrames={TOTAL_FRAMES_ACAUTO} fps={30} width={1920} height={1080} />
      {/* Reviví tu tierra muerta con $1 (estiércol, bajo esfuerzo) */}
      <Composition
        id="Estiercol"
        component={MainEstiercol}
        durationInFrames={TOTAL_FRAMES_EST}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
