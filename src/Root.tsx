import "./index.css";
import { Composition } from "remotion";
import { MainEstiercol, TOTAL_FRAMES_EST } from "./VideoEdit/Main_estiercol";
import { MainWasp, TOTAL_FRAMES_WASP } from "./VideoEdit/Main_wasp";
import { MainTick, TOTAL_FRAMES_TICK } from "./VideoEdit/Main_tick";
import { MainMeriendas, TOTAL_FRAMES_MER } from "./VideoEdit/Main_meriendas";
import { MainPostres, TOTAL_FRAMES_POS } from "./VideoEdit/Main_postres";
import { MainDomingos, TOTAL_FRAMES_DOM } from "./VideoEdit/Main_domingos";
import { MainCocina, TOTAL_FRAMES_COC } from "./VideoEdit/Main_cocina";
import { MainEstufaRocket, TOTAL_FRAMES_ER } from "./VideoEdit/Main_estufarocket";
import { MainBorax, TOTAL_FRAMES_BX } from "./VideoEdit/Main_borax";
import { MainBarrera, TOTAL_FRAMES_BRR } from "./VideoEdit/Main_barrera";
import { MainJabon, TOTAL_FRAMES_JABON } from "./VideoEdit/Main_jabon";
import { MainCeniza, TOTAL_FRAMES_CENIZA } from "./VideoEdit/Main_ceniza";
import { MainRatas, TOTAL_FRAMES_RATAS } from "./VideoEdit/Main_ratas";
import { MainMelon, TOTAL_FRAMES_MELON } from "./VideoEdit/Main_melon";
import { MainCorn, TOTAL_FRAMES_CORN } from "./VideoEdit/Main_corn";
import { MainChoclo, TOTAL_FRAMES_CHOCLO } from "./VideoEdit/Main_choclo";
import { MainPeroxide, TOTAL_FRAMES_PEROXIDE } from "./VideoEdit/Main_peroxide";
import { MainMoho, TOTAL_FRAMES_MOHO } from "./VideoEdit/Main_moho";
import { MainAcpipe, TOTAL_FRAMES_ACPIPE } from "./VideoEdit/Main_acpipe";
import { MainSandia, TOTAL_FRAMES_SANDIA } from "./VideoEdit/Main_sandia";
import { MainRampump, TOTAL_FRAMES_RAMPUMP } from "./VideoEdit/Main_rampump";
import { MainZeer, TOTAL_FRAMES_ZEER } from "./VideoEdit/Main_zeer";
import { MainLuz, TOTAL_FRAMES_LUZ } from "./VideoEdit/Main_luz";
import { MainMedicaid, TOTAL_FRAMES_MED } from "./VideoEdit/Main_medicaid";
import { MainViuda, TOTAL_FRAMES_VD } from "./VideoEdit/Main_viuda";
import { MainEstafas, TOTAL_FRAMES_ES } from "./VideoEdit/Main_estafas";
import { MainHormiga, TOTAL_FRAMES_HB } from "./VideoEdit/Main_hormiga";
import { MainHuron, TOTAL_FRAMES_HUR } from "./VideoEdit/Main_huron";
import { MainBarcos, TOTAL_FRAMES_BAR } from "./VideoEdit/Main_barcos";
import { MainLeona, TOTAL_FRAMES_LEONA } from "./VideoEdit/Main_leona";
import { MainConstrucciones, TOTAL_FRAMES_CONS } from "./VideoEdit/Main_construcciones";
import { MainAntartida, TOTAL_FRAMES_ANT } from "./VideoEdit/Main_antartida";
import { MainTuneles, TOTAL_FRAMES_TUN } from "./VideoEdit/Main_tuneles";
// import { MainPuertas, TOTAL_FRAMES_PUE } from "./VideoEdit/Main_puertas"; // roto: falta cues_puertas.gen

// ── SOLO los videos ACTIVOS quedan registrados ──
// Las composiciones viejas (Fly, Hipos, Bisontes, Objetos, Civil, Top7Demo,
// Mograph, MographShowcase, etc.) quedan DESREGISTRADAS para que Studio no las
// cargue ni tire 404 de audios que ya no están en disco. Sus archivos siguen en
// src/VideoEdit/ — para reactivar una, volvé a importarla y agregá su <Composition>.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* VIDEO ACTIVO — Crónicas Perdidas · "7 Barcos…" (SLICE 1) · faceless · voz clonada */}
      <Composition id="Barcos" component={MainBarcos} durationInFrames={TOTAL_FRAMES_BAR} fps={30} width={1920} height={1080} />
      {/* VIDEO ACTIVO — Documental fauna · "El Hurón de Patas Negras" · faceless · voz clonada */}
      <Composition id="Huron" component={MainHuron} durationInFrames={TOTAL_FRAMES_HUR} fps={30} width={1920} height={1080} />
      {/* TEST nicho fauna — "La leona" (clip real por frase + voz Trevor) */}
      <Composition id="Leona" component={MainLeona} durationInFrames={TOTAL_FRAMES_LEONA} fps={30} width={1920} height={1080} />
      {/* VIDEO 2 Crónicas Perdidas — "7 Construcciones Antiguas Que la Ciencia No Puede Explicar" */}
      <Composition id="Construcciones" component={MainConstrucciones} durationInFrames={TOTAL_FRAMES_CONS} fps={30} width={1920} height={1080} />
      {/* VIDEO 4 Crónicas Perdidas — "7 Estructuras Bajo el Hielo de la Antártida" · faceless · voz Trevor */}
      <Composition id="Antartida" component={MainAntartida} durationInFrames={TOTAL_FRAMES_ANT} fps={30} width={1920} height={1080} />
      {/* VIDEO 5 Crónicas Perdidas — "7 Túneles Antiguos Que la Ciencia No Puede Explicar" */}
      <Composition id="Tuneles" component={MainTuneles} durationInFrames={TOTAL_FRAMES_TUN} fps={30} width={1920} height={1080} />
      {/* VIDEO 6 Crónicas Perdidas — "7 Puertas Antiguas..." (deshabilitado: falta cues_puertas.gen) */}
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
      {/* VIDEO ACTIVO — Cómo elegir el choclo más dulce (LeviLappJardín · ES) */}
      <Composition
        id="Choclo"
        component={MainChoclo}
        durationInFrames={TOTAL_FRAMES_CHOCLO}
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
