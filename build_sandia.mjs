// build_sandia.mjs — CLIPS-FIRST híbrido (ES) para EL CONSTRUCTOR LIBRE.
// "Cómo elegir la sandía más dulce — el método de los viejos" + 3 inyertos del manual $27.
// Mismo avatar (presentador). Clips reales de sandía/huerta/abejas/tierra + imágenes IA
// para huecos + componentes con los datos y la oferta. Identidad doc-broll (ámbar).
//
// Modo: node build_sandia.mjs match  → public/broll/match_sandia.json
//       node build_sandia.mjs        → beatsheet/sandia.json + avatar_sandia.gen.ts
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1379.0;
const OPEN = 2.2;
const DLDUR = 6;

// avatar a PANTALLA COMPLETA (personal / CTA / cierre). Resto = clips.
const AV_FULL = [
  [88.3, 104.3],    // "Yo soy el Constructor Libre... un hombre que hace"
  [1052.6, 1062.3], // "La gente compra con los ojos de la publicidad... de la tierra"
  [1130.2, 1142.4], // "Y por eso lo armé... lo puse en un manual"
  [1336.3, 1347.9], // "Eso es lo que quiero dejarte... una forma de mirar / comentarios"
  [1373.3, TOTAL],  // "No te lo pierdas. Nos vemos en el patio."
];

// [t, name, query, concepto]
const CLIPS = [
  // ── COLD OPEN / problema (la lotería del super vs el abuelo) ──
  [2.2, "sa_golpea_super", ["person knocking knuckles on watermelons at a market","man tapping watermelons in a grocery store"], "una persona golpeando sandías en la verdulería"],
  [6.0, "sa_dudando", ["confused man choosing a watermelon in a store","shopper unsure picking a watermelon"], "un hombre dudando frente a las sandías"],
  [10.0, "sa_aprieta", ["hands turning over and pressing a watermelon","inspecting a watermelon in a shop"], "manos dando vuelta y apretando una sandía"],
  [14.0, "sa_bolsa", ["putting a watermelon into a shopping bag","watermelon at a grocery checkout"], "metiendo una sandía cualquiera en la bolsa"],
  [18.0, "sa_caja_super", ["bin of watermelons in a supermarket","pile of watermelons at a store"], "un cajón de sandías en el supermercado"],
  [25.0, "sa_abuelo", ["old farmer in a straw hat holding a watermelon","elderly man with a watermelon in a field"], "un viejo agricultor sosteniendo una sandía"],
  [29.0, "sa_abuelo_elige", ["old man selecting one watermelon from a pile","farmer choosing a watermelon at market"], "el abuelo eligiendo la sandía justa"],
  [33.0, "sa_cajon_cien", ["large crate full of watermelons","many watermelons stacked in a crate"], "un cajón enorme con cien sandías"],
  [37.5, "sa_senala", ["hand pointing at one watermelon among many","finger selecting a watermelon"], "señalando con el dedo la más dulce"],
  [46.6, "sa_mercado", ["farmers market stall selling watermelons","people buying watermelons at a market"], "gente comprando sandías en el mercado"],
  [54.0, "sa_lee_piel", ["examining the skin of a watermelon closely","close up inspecting a watermelon rind"], "leyendo la cáscara de una sandía de cerca"],
  [58.3, "sa_corta_roja", ["cutting open a deep red ripe watermelon","slicing a juicy red watermelon"], "cortando una sandía roja y madura"],
  [67.0, "sa_corta_casa", ["person slicing a watermelon at home kitchen","cutting watermelon on a wooden board"], "alguien cortando una sandía en su casa"],
  [70.6, "sa_rosada_mala", ["pale pink unripe watermelon flesh cut open","watery colorless watermelon inside"], "una sandía rosada y aguada por dentro"],
  [79.2, "sa_super_gondola", ["supermarket produce aisle wide shot","grocery store shelves of fruit"], "las góndolas del supermercado"],
  // [88.3-104.3] AV intro
  [104.5, "sa_manos_trabajo", ["weathered hands working with soil and tools","calloused hands building outdoors"], "manos curtidas trabajando la tierra"],
  [108.1, "sa_herramientas", ["old hand tools hanging in a shed","rustic farm tools on a wall"], "herramientas viejas colgadas en el galpón"],
  [113.0, "sa_tierra_rica", ["dark rich compost soil in hands","crumbling fertile soil close up"], "tierra negra y rica entre las manos"],
  [117.3, "sa_fuego", ["wood stove fire burning inside a cabin","cozy wood fire in winter"], "el fuego de una estufa de leña en invierno"],
  [121.2, "sa_rebrote", ["vegetable scraps regrowing roots in water","kitchen scraps sprouting"], "restos de cocina rebrotando"],
  [125.7, "sa_viejo_sandia", ["old farmer holding a watermelon in a field","elderly man inspecting watermelon"], "los viejos eligiendo la sandía"],
  [130.0, "sa_cosecha_manos", ["hands holding fresh vegetables from a garden","basket of homegrown vegetables"], "verduras frescas recién cosechadas"],
  [134.0, "sa_recibo_largo", ["long grocery receipt unrolling","supermarket bill close up"], "un recibo larguísimo del supermercado"],
  [142.7, "sa_huerta_patio", ["person tending a backyard vegetable garden","gardener working in a home garden"], "alguien cuidando la huerta del patio"],
  [146.5, "sa_examina", ["examining a watermelon outdoors in the sun","turning a watermelon in hands"], "examinando una sandía al sol"],
  [150.5, "sa_campo_sandias", ["watermelon field rows under the sun","watermelons growing in a field"], "un campo de sandías"],
  // ── el problema (no madura tras cortarla) ──
  [155.2, "sa_pale_cut", ["unripe watermelon cut showing pale flesh","disappointing watermelon inside"], "una sandía pálida recién abierta"],
  [171.8, "sa_frutas_madurando", ["bananas and fruit ripening in a bowl","fruit ripening on a counter"], "otras frutas madurando en la frutera"],
  [176.2, "sa_azucar_macro", ["sugar crystals macro close up","sweet syrup dripping"], "el azúcar, en macro"],
  [180.8, "sa_vid_campo", ["watermelon on the vine in a field","ripe watermelon growing on the ground"], "una sandía en la planta, en el campo"],
  [188.5, "sa_deposito", ["warehouse full of produce boxes","crates of fruit in a depot"], "un depósito lleno de cajones"],
  [192.4, "sa_camion_carga", ["trucks loaded with watermelons","produce being loaded onto a truck"], "camiones cargados de sandías"],
  [196.1, "sa_apiladas_super", ["watermelons stacked in a supermarket display","big pile of watermelons in store"], "sandías apiladas en el supermercado"],
  [200.1, "sa_cosecha_verde", ["harvesting unripe green watermelon early","picking watermelon from the field"], "cosechando la sandía antes de tiempo"],
  [204.2, "sa_envio_cajas", ["produce shipping boxes on pallets","fruit being shipped in boxes"], "la fruta despachada en cajas"],
  [208.0, "sa_camion_ruta", ["long haul truck driving on a highway","semi truck on the road"], "un camión de larga distancia en la ruta"],
  [215.9, "sa_agua_sin_gusto", ["watery pale watermelon flesh","bland colorless watermelon"], "pulpa aguada, sin gusto"],
  [219.8, "sa_punto_justo", ["perfect ripe red watermelon slice","juicy sweet watermelon wedge"], "una sandía en su punto justo de dulzor"],
  [227.8, "sa_elige_mercado", ["choosing a watermelon at a market","selecting watermelon at a fruit stand"], "eligiendo bien en la verdulería"],
  [231.6, "sa_planta_huerta", ["watermelon growing in a home garden","watermelon vine with fruit in backyard"], "plantando tu propia sandía"],
  // ── SEÑAL 1: la mancha del suelo ──
  [235.7, "sa_mancha_base", ["bottom of a watermelon showing the field spot","underside of a watermelon"], "la base de la sandía y su mancha"],
  [243.9, "sa_da_vuelta", ["turning a watermelon to show the pale ground spot","flipping a watermelon over"], "dando vuelta la sandía para ver la mancha"],
  [248.0, "sa_apoyada_suelo", ["watermelon resting on soil in the field","watermelon lying on the ground growing"], "la sandía apoyada en la tierra mientras crecía"],
  [256.8, "sa_mancha_compara", ["comparing the field spots of two watermelons","two watermelon ground spots side by side"], "comparando la mancha de dos sandías"],
  [261.0, "sa_mancha_amarilla", ["creamy yellow field spot on a watermelon","deep buttery yellow spot underside watermelon"], "una mancha amarilla cremosa, como manteca"],
  [269.0, "sa_madura_manos", ["ripe watermelon held in both hands","holding a perfectly ripe watermelon"], "una sandía bien madura en las manos"],
  [277.9, "sa_mancha_blanca", ["white pale ground spot on an unripe watermelon","greenish white spot underside watermelon"], "una mancha blanca verdosa, de sandía verde"],
  [286.2, "sa_verde_inmadura", ["green unripe watermelon close up","immature pale watermelon"], "una sandía arrancada antes de tiempo"],
  [294.5, "sa_mancha_oro", ["bright yellow field spot close up","golden ground spot on watermelon"], "cuanto más amarilla, más dulce"],
  [303.2, "sa_viejo_inspecciona", ["old farmer inspecting the bottom of a watermelon","elderly man checking watermelon underside"], "el viejo mirando la mancha primero"],
  // ── SEÑAL 2: las telarañas (cicatrices de polinización) ──
  [311.6, "sa_telaranas", ["brown web sugar spots on a watermelon skin","brown netting marks on watermelon rind"], "las telarañas marrones sobre la cáscara"],
  [320.5, "sa_marcas_feo", ["rough brown scars on a watermelon","watermelon skin with brown marks"], "esas marcas que parecen un defecto"],
  [328.9, "sa_abeja_flor", ["bee pollinating a yellow flower macro","bee on a watermelon flower"], "una abeja polinizando la flor"],
  [336.9, "sa_abejas_campo", ["bees pollinating flowers in a field","bees flying around garden flowers"], "abejas polinizando en el campo"],
  [345.6, "sa_semillas_roja", ["watermelon seeds in red flesh close up","seeds inside a ripe watermelon"], "el azúcar que alimenta las semillas"],
  [351.1, "sa_red_azucar", ["heavy sugar webbing on watermelon skin","dense brown net pattern on watermelon"], "una red de azúcar dibujada en la cáscara"],
  [359.4, "sa_abejas_aman", ["bees on flowers in a sunny garden","pollinators on blossoms"], "lo que las abejas aman"],
  [368.1, "sa_telarana_mercado", ["webbed watermelon at a market stall","marked watermelon among others"], "buscar las de más telarañas"],
  [372.0, "sa_descartada", ["ugly watermelon with brown marks set aside","blemished watermelon"], "las que todos descartan por feas"],
  // ── SEÑAL 3: el zarcillo ──
  [380.9, "sa_zarcillo", ["curly watermelon tendril on the vine","spiral tendril near a watermelon stem"], "el zarcillo, ese rulito del tallo"],
  [389.1, "sa_conecta_planta", ["watermelon attached to the vine in a field","watermelon stem connected to the plant"], "donde la sandía se conecta a la planta"],
  [393.9, "sa_zarcillo_verde", ["green fresh tendril on a watermelon vine","living green curl on the vine"], "un zarcillo verde y fresco: cosechada pronto"],
  [406.0, "sa_zarcillo_seco", ["dried brown curly tendril near watermelon stem","withered tendril on the vine"], "un zarcillo seco y marrón: sandía lista"],
  [414.4, "sa_madura_vid", ["ripe watermelon on the vine ready","mature watermelon in the field"], "la fruta ya madura en la planta"],
  [423.1, "sa_tallo_macro", ["watermelon stem and dried tendril macro","close up of watermelon stalk"], "el reloj de la propia planta"],
  // ── SEÑAL 4: el golpe / el sonido ──
  [431.3, "sa_golpe_nudillos", ["knocking on a watermelon with knuckles close up","thumping a watermelon"], "golpear la sandía con los nudillos"],
  [438.7, "sa_golpe_mano", ["tapping a watermelon held in one hand","person thumping a watermelon"], "darle un golpe firme, como a una puerta"],
  [450.4, "sa_escucha", ["holding a watermelon to the ear and tapping","listening to a watermelon thump"], "escuchar el sonido profundo y grave"],
  [458.6, "sa_pulpa_jugosa", ["juicy red watermelon interior dripping","watermelon flesh full of juice"], "la pulpa jugosa que vibra adentro"],
  [466.8, "sa_golpe_dura", ["tapping a hard unripe watermelon","knocking a dense watermelon"], "el sonido agudo de una sandía dura"],
  [474.8, "sa_arinosa", ["mealy overripe watermelon flesh","grainy past watermelon inside"], "verde, o pasada y harinosa"],
  [482.7, "sa_compara_sonido", ["comparing two watermelons by tapping them","testing watermelons by sound"], "comparando dos sandías por el sonido"],
  // ── SEÑAL 5: el peso ──
  [490.5, "sa_levanta", ["lifting a watermelon with both hands","weighing a watermelon in the hands"], "sopesar la sandía en la mano"],
  [499.0, "sa_pesada", ["holding a large heavy watermelon","big heavy watermelon in arms"], "que pese más de lo que tu mano espera"],
  [502.8, "sa_compara_peso", ["comparing the weight of two watermelons","lifting two watermelons to compare"], "levantar dos del mismo tamaño y comparar"],
  [510.6, "sa_jugo_chorro", ["juicy watermelon dripping juice","watermelon overflowing with juice"], "el agua es dulzor, es jugo"],
  [519.6, "sa_pesada_buena", ["holding up a big ripe watermelon","heavy watermelon held proudly"], "pesada es buena, siempre"],
  // ── SEÑAL 6: la piel (mate, no brillante) ──
  [527.9, "sa_piel_macro", ["close up of watermelon rind surface texture","macro of a watermelon skin"], "la piel de la sandía, de cerca"],
  [536.2, "sa_brillante", ["glossy shiny waxy watermelon skin","reflective shiny watermelon"], "una sandía brillante, lustrosa"],
  [540.5, "sa_mate", ["matte dull watermelon skin deep color","non-shiny ripe watermelon rind"], "una sandía mate, opaca: madura"],
  [549.4, "sa_encerada", ["waxy shiny green watermelon close up","glossy unripe watermelon"], "la cáscara encerada de una sandía verde"],
  [557.6, "sa_mate_mercado", ["matte ripe watermelon at a market","dull-skinned watermelon in a pile"], "buscar la opaca, la que no refleja"],
  [565.7, "sa_rayas", ["bold dark green stripes on a watermelon","high contrast stripes watermelon"], "las rayas de la sandía, bien marcadas"],
  [574.3, "sa_rayas_lavadas", ["faded pale stripes on a watermelon","washed out watermelon stripes"], "rayas lavadas, sin contraste: le falta"],
  // ── SEÑAL 7: la forma · SEÑAL 8: el cabito ──
  [582.6, "sa_forma_redonda", ["round symmetric watermelon","uniform round watermelon"], "una sandía pareja y simétrica"],
  [591.5, "sa_deforme", ["lumpy misshapen deformed watermelon","watermelon with bumps and dents"], "una sandía con bultos y deformaciones"],
  [612.9, "sa_macho_hembra", ["round watermelon next to an oblong one","comparing round and long watermelons"], "la redonda y la alargada, una al lado de la otra"],
  [621.2, "sa_redonda_dulce", ["plump round watermelon held","compact round watermelon"], "la redonda y rechoncha, más dulce"],
  [629.0, "sa_alargada", ["long oblong elongated watermelon","stretched long watermelon"], "la alargada, más aguachenta"],
  [644.1, "sa_cabito", ["dried brown stem on top of a watermelon","watermelon stalk close up"], "el cabito, el pedacito de tallo"],
  [649.1, "sa_cabito_seco", ["dried brown watermelon stem maturity","withered stalk on a watermelon"], "un cabito seco y marrón: maduró en la planta"],
  // [659 cmp_senal_recap checklist]
  // ── conocimiento / manual 1 ──
  [661.8, "sa_ojos_mano", ["eyes and hands inspecting a watermelon","examining a watermelon carefully"], "tus ojos, tu mano y tu oído"],
  [669.5, "sa_ensena", ["old farmer teaching a young person in a garden","grandfather showing gardening to a child"], "es conocimiento, y no te lo cobra nadie"],
  [678.8, "sa_escribe_manual", ["hands writing notes in a notebook","man writing in a journal at a table"], "documentar lo que funciona"],
  // [686 cmp_manual1 checklist]
  [700.8, "sa_huerta_verde", ["lush green backyard vegetable garden","thriving home garden"], "una huerta verde y sana"],
  // ── producir tu propia sandía ──
  [705.6, "sa_elige_seguro", ["person confidently choosing a watermelon","sure-handed selection of a watermelon"], "elegir mejor que casi todos"],
  [713.8, "sa_planta_semilla", ["planting a watermelon seedling in soil","hands planting a seedling"], "dejar de elegir y empezar a producir"],
  [722.1, "sa_vid_crece", ["watermelon vine growing in a garden","young watermelon plant in soil"], "plantar tu propia sandía"],
  // [734 cmp_tresclaves process]
  [742.9, "sa_tierra_viva2", ["rich dark living soil teeming","healthy crumbling garden soil"], "la tierra viva, lo que cambia todo"],
  [746.5, "sa_tierra_muerta", ["dry cracked dead gray soil","barren cracked earth"], "una tierra muerta, gris y dura"],
  [750.9, "sa_quimico_suelo", ["chemical fertilizer poured on soil","granular fertilizer on ground"], "años de químicos que matan el suelo"],
  [759.5, "sa_lombrices", ["earthworms in dark compost soil","worms in rich soil"], "lombrices trabajando la tierra"],
  [763.7, "sa_homegrown_corta", ["cutting a deep red homegrown watermelon","ripe garden watermelon sliced"], "el dulzor que la góndola no te da"],
  [771.6, "sa_compost_casa", ["making compost at home with scraps","backyard compost pile"], "hacer la tierra en casa, casi gratis"],
  // [783 cmp_tierra checklist]
  [787.3, "sa_tubo_lombriz", ["worm composting tube bin in a garden","vermicompost tower in soil"], "el tubo de lombrices"],
  [795.5, "sa_dibujo_plano", ["hand drawing a simple diagram on paper","sketching a plan with a pencil"], "medidas exactas, con dibujos"],
  [803.4, "sa_come_sandia", ["person eating a slice of watermelon outdoors","enjoying watermelon on a summer day"], "comiendo tu sandía elegida con sabiduría"],
  [807.8, "sa_escupe_semilla", ["watermelon seeds being spit out","seeds discarded from watermelon"], "la gente tira las semillas a la basura"],
  [811.8, "sa_semillas_palma", ["watermelon seeds in the palm of a hand","handful of watermelon seeds"], "tenés oro en la mano"],
  [819.4, "sa_lava_semillas", ["rinsing seeds in a strainer","washing watermelon seeds"], "lavar y secar las semillas a la sombra"],
  [823.4, "sa_sobre_papel", ["seeds stored in a paper envelope","saving seeds in a paper packet"], "guardarlas en un sobre de papel"],
  [831.3, "sa_guarda_viejo", ["old farmer saving seeds in jars","grandfather storing seeds"], "así se hacía antes: se guardaban"],
  [843.8, "sa_plantines", ["tray of tomato seedlings growing","seedling tray in a greenhouse"], "de un tomate, cien plantas"],
  [848.1, "sa_multiplica", ["many young seedlings growing in a garden","rows of seedlings sprouting"], "la multiplicación es gratis"],
  [852.2, "sa_sobres_super", ["seed packets on a store rack","buying seed packets in a shop"], "comprar semillas de cero cada año"],
  [860.1, "sa_entera_mesa", ["whole watermelon on a kitchen counter","uncut watermelon on a table"], "la sandía entera, fuera de la heladera"],
  [868.9, "sa_heladera", ["watermelon inside a refrigerator","cut watermelon covered in the fridge"], "recién cortada va a la heladera"],
  [876.6, "sa_corta_centro", ["cutting through the center of a watermelon","slicing a watermelon in half"], "el corazón, la parte más dulce"],
  [889.8, "sa_comparte", ["sharing watermelon slices with family","handing out watermelon wedges"], "repartir parejo para todos"],
  [898.7, "sa_sal_sandia", ["sprinkling a pinch of salt on a watermelon slice","salt on watermelon wedge"], "una pizca de sal que realza el dulzor"],
  [907.4, "sa_disfruta", ["person enjoying a juicy watermelon slice","satisfied bite of watermelon"], "los detalles que distinguen al que disfruta"],
  [915.0, "sa_vid_fruto", ["watermelon growing on a vine in a garden","watermelon plant with fruit"], "plantarla es de lo más agradecido"],
  [923.4, "sa_sol_huerta", ["bright sun over a vegetable garden","sunny garden bed"], "sol pleno: el azúcar se hace con sol"],
  [927.6, "sa_enredadera", ["sprawling watermelon vine spreading","long watermelon vine on the ground"], "una enredadera que se estira metros"],
  [935.8, "sa_guia_borde", ["training a vine along a fence","guiding a climbing plant"], "guiarla por un borde"],
  [944.1, "sa_siembra_guardada", ["planting a saved seed in living soil","sowing a seed by hand"], "una semilla guardada en tierra viva"],
  [952.6, "sa_cosecha_propia", ["inspecting a watermelon on the vine in a garden","checking a ripening watermelon daily"], "mirar tu planta todos los días"],
  [960.7, "sa_zarcillo_jardin", ["dried tendril on a garden watermelon vine","withered curl beside ripe watermelon"], "el zarcillo se seca: ya está"],
  [977.2, "sa_cosecha_corta", ["harvesting a ripe watermelon from the vine","cutting a watermelon off the plant"], "cuando las tres coinciden, la cortás"],
  [985.3, "sa_atardecer_vid", ["ripe watermelon on the vine at golden hour","watermelon in a field at sunset"], "dejarla en la planta hasta el último día"],
  [994.0, "sa_super_bin", ["watermelons in a supermarket bin","store watermelon display"], "lo que el supermercado jamás hará"],
  [1002.7, "sa_ensena_tierra", ["old hands teaching a child to garden","passing down gardening knowledge"], "no se compran, se aprenden"],
  // ── anécdota del abuelo ──
  [1006.7, "sa_almacen_campo", ["watermelons at a rural country store","crate of watermelons at a farm shop"], "un almacén de campo con un cajón de sandías"],
  [1014.5, "sa_gente_duda", ["people choosing watermelons at a stand crowd","shoppers tapping watermelons"], "gente alrededor, golpeando y dudando"],
  [1019.1, "sa_abuelo_calmo", ["calm old man selecting a watermelon","elderly farmer choosing fruit quietly"], "el abuelo, tranquilo, eligiendo"],
  [1023.8, "sa_da_vuelta_fea", ["turning over a webbed marked watermelon","picking an ugly-looking watermelon"], "eligió una de las más feas, llena de telarañas"],
  [1032.1, "sa_almacenero_rie", ["shopkeeper laughing at a market stall","vendor smiling skeptically"], "el almacenero se rió"],
  [1040.1, "sa_navaja_corta", ["cutting a watermelon with a knife reveals deep red","slicing open a watermelon outdoors"], "la cortó con la navaja: roja, firme"],
  [1044.8, "sa_corazon_crocante", ["crisp deep red watermelon heart","sweet red watermelon core"], "el corazón lleno de azúcar, de las que crujen"],
  // [1052.6-1062.3] AV philosophical
  // ── el cuadro grande ($4055/año) ──
  [1062.3, "sa_homestead", ["self sufficient backyard homestead garden","productive rural property"], "la sandía es solo la punta del ovillo"],
  [1070.3, "sa_facturas", ["a stack of bills and receipts on a table","household bills pile"], "cuánto gastás cada año"],
  [1078.2, "sa_sacos_tierra", ["bags of soil and fertilizer at a garden store","stacked soil bags"], "abono y sacos de tierra"],
  [1086.7, "sa_verdura_cara", ["expensive vegetables with price tags","produce prices at a market"], "verdura y hierbas carísimas"],
  [1091.1, "sa_garrafa", ["propane gas tank and a heater","gas bottle for heating"], "el gas de la calefacción"],
  [1095.0, "sa_cocina_gas", ["gas stove flame in a kitchen","cooking on a gas burner"], "el gas para cocinar"],
  // [1098 cmp_gastos bars] [1102 cmp_4055 stat]
  [1106.6, "sa_corporacion", ["corporate office tower glass building","big corporation headquarters"], "cada dólar va a las corporaciones"],
  [1118.4, "sa_super_carro", ["pushing a cart in a supermarket","shopping for groceries"], "seguir comprando todo"],
  [1122.8, "sa_construye_patio", ["man building something in his backyard","person working on a diy project outdoors"], "aprender a hacerlo vos"],
  // [1130.2-1142.4] AV "por eso lo armé"
  // ── el manual (sistemas) ──
  [1142.4, "sa_manual_mesa", ["a rustic manual book with diagrams on a table","open practical guide on a desk"], "lo puse todo en un manual"],
  [1146.4, "sa_huerta_productiva", ["productive vegetable garden rows","abundant raised garden beds"], "los seis cultivos más rentables"],
  [1150.0, "sa_cosecha_canasta", ["basket overflowing with garden harvest","abundant homegrown vegetables"], "cuarenta y cinco dólares por semana"],
  [1153.7, "sa_barrera_metal", ["copper metal strips around garden plants","metal barrier in a garden bed"], "la barrera galvánica contra plagas"],
  [1157.6, "sa_spray_ajo", ["garlic spray bottle in a garden","spraying plants with homemade spray"], "el spray de ajo"],
  [1161.4, "sa_rocket", ["rocket stove burning twigs with a flame","efficient wood rocket stove"], "la estufa rocket que calienta con ramitas"],
  [1165.1, "sa_solar_muro", ["sunlit wall of a house solar heating","solar panel on a home"], "el muro Trombe, calefacción solar gratis"],
  [1169.3, "sa_horno_barro", ["clay adobe oven with fire","traditional mud oven outdoors"], "el horno de barro que cocina sin combustible"],
  [1173.2, "sa_agua_lluvia", ["rain barrel collecting rainwater","rainwater harvesting tank"], "la captación de agua de lluvia"],
  [1177.2, "sa_manual_dibujos", ["open manual with clear hand-drawn diagrams","instructional book with illustrations"], "instrucciones con letra grande y dibujos"],
  [1182.0, "sa_mayor_proyecto", ["older person doing a hands-on project","senior working in a garden"], "adaptaciones para los más grandes"],
  // [1190 cmp_oferta bars] [1206 cmp_garantia callout]
  [1198.3, "sa_manual_solo", ["a practical manual lying on a wooden table","guide book closed on a desk"], "lo puse a un precio para que llegue"],
  [1202.5, "sa_verdura_costo", ["paying for vegetables at a market","cost of groceries"], "se paga solo con tu próxima compra"],
  [1214.8, "sa_manual_regalo", ["a manual book held as a gift","handing over a guide book"], "te quedás con el manual igual"],
  [1218.9, "sa_celular_link", ["a phone showing a download link","smartphone with a checkout page"], "el link está abajo en la descripción"],
  // ── para quién es / cierre ──
  [1227.6, "sa_lee_no_hace", ["a person reading a book on a couch idle","someone reading without doing"], "el que solo lee y no hace"],
  // [1235 cmp_paraquien splitlist]
  [1252.9, "sa_hecho_a_mano", ["hands crafting something by hand","artisan making something with hands"], "el que valora las cosas hechas a mano"],
  [1257.2, "sa_casa_tranquila", ["peaceful country home at dusk","calm rural house and garden"], "tranquilidad y bajar gastos para siempre"],
  [1265.2, "sa_quinta_produce", ["productive small farm homestead","rural plot with vegetable garden"], "una casa, una quinta, tierra para producir"],
  [1272.9, "sa_mercado_sandia", ["choosing a watermelon at a market again","shopper with a watermelon"], "lo que podés hacer hoy mismo"],
  // [1285 cmp_recap8 checklist]
  [1276.8, "sa_recap_mancha", ["yellow field spot on a watermelon underside","creamy yellow ground spot"], "la mancha amarilla cremosa"],
  [1285.2, "sa_recap_tela", ["brown sugar webbing on a watermelon","webbed watermelon skin"], "las telarañas marrones"],
  [1290.0, "sa_recap_zarcillo", ["dried tendril near a watermelon stem","withered curl on the vine"], "el zarcillo seco"],
  [1294.1, "sa_recap_golpe", ["knocking on a watermelon with knuckles","tapping a watermelon"], "el golpe grave y profundo"],
  [1299.1, "sa_recap_peso", ["weighing a watermelon in two hands","lifting a heavy watermelon"], "pesada para su tamaño"],
  [1303.2, "sa_recap_mate", ["matte dull-skinned ripe watermelon","non-shiny watermelon"], "la mate, no la brillante"],
  [1307.3, "sa_corta_perfecta", ["cutting a perfect firm red watermelon at home","slicing an ideal ripe watermelon"], "vas a cortar una sandía roja, firme, dulce"],
  [1316.4, "sa_satisfecho", ["person satisfied with their garden harvest","content gardener with produce"], "algo más grande que una sandía"],
  [1324.5, "sa_autosuficiente", ["self-sufficient home garden and homestead","independent rural living"], "casi todo lo podés producir vos"],
  [1332.6, "sa_mira_sandia", ["thoughtfully looking at a watermelon in hand","examining a watermelon with a smile"], "una forma de mirar"],
  // [1336.3-1347.9] AV close
  [1349.2, "sa_manual_celu", ["a phone showing a guide download page","smartphone with an ebook"], "el manual te espera abajo"],
  // [1353 cmp_quote]
  [1357.6, "sa_tierra_revive", ["dry gray dead soil transforming to dark rich soil","reviving barren earth into black soil"], "revivir una tierra muerta"],
  [1365.3, "sa_tierra_negra", ["rich black fertile soil in hands","dark living compost soil"], "tierra negra, viva y fértil en 7 días"],
  // [1369 cmp_next] [1373.3-TOTAL] AV signoff

  // ── DENSIDAD: tomas intermedias (cortes cada ~3s, video muy dinámico). Mismo
  // vocabulario sandía/huerta/mercado/tierra con ÁNGULOS distintos → el matcher trae
  // clips diferentes en cada uno. ──
  [4.0, "sa_d_nudillos2", ["extreme close up knuckles tapping a watermelon","fingers thumping watermelon rind"], "los nudillos golpeando, en primer plano"],
  [8.0, "sa_d_pila_super", ["huge pile of watermelons in a supermarket bin","watermelons stacked high in a store"], "una montaña de sandías en el super"],
  [12.0, "sa_d_levanta_super", ["shopper lifting a watermelon to inspect it","man holding watermelon up in a store"], "levantando una sandía para mirarla"],
  [16.0, "sa_d_carro_super", ["watermelon placed in a shopping cart","grocery cart with a watermelon"], "la sandía en el changuito"],
  [22.0, "sa_d_paga", ["paying at a grocery checkout counter","cashier scanning groceries"], "pagando en la caja"],
  [27.0, "sa_d_abuelo_mira", ["close up of an old man's eyes studying fruit","elderly farmer examining produce"], "la mirada experta del abuelo"],
  [31.0, "sa_d_cajon2", ["overhead shot of a crate of watermelons","top view of many watermelons"], "el cajón visto desde arriba"],
  [39.0, "sa_d_mano_elige", ["weathered hand resting on a chosen watermelon","old hand selecting one fruit"], "la mano que elige sin dudar"],
  [44.0, "sa_d_mercado2", ["busy farmers market fruit stand","outdoor market with watermelons and produce"], "el bullicio del mercado"],
  [52.0, "sa_d_gira_sandia", ["rotating a watermelon slowly in hands","turning a watermelon to inspect all sides"], "girando la sandía para leerla"],
  [60.0, "sa_d_rojo_jugo", ["juice dripping from a fresh watermelon slice","red watermelon wedge dripping"], "el jugo cayendo de una tajada roja"],
  [64.0, "sa_d_tajadas", ["plate of fresh red watermelon wedges","sliced watermelon on a plate"], "las tajadas rojas listas"],
  [73.0, "sa_d_decepcion", ["disappointed person looking at pale watermelon","letdown face with bland watermelon"], "la cara de decepción"],
  [82.0, "sa_d_gondola2", ["wide supermarket fruit aisle with shoppers","busy grocery produce section"], "la góndola del supermercado, llena"],
  [106.0, "sa_d_taller", ["man working with hand tools in a rustic workshop","builder in a workshop"], "el hombre que hace, en su taller"],
  [110.0, "sa_d_galpon", ["rustic farm shed interior with tools","old barn workbench"], "el galpón con las herramientas"],
  [115.0, "sa_d_compost_mano", ["dark crumbly compost falling from a hand","rich soil running through fingers"], "la tierra negra cayendo de la mano"],
  [119.0, "sa_d_lena", ["chopped firewood stacked by a stove","wood burning in a stove close up"], "la leña, el calor de la casa"],
  [123.0, "sa_d_rebrote2", ["green onion regrowing in a glass of water","lettuce base regrowing on a windowsill"], "un rebrote desde un resto de cocina"],
  [128.0, "sa_d_canasta2", ["basket full of freshly picked vegetables","harvest basket of garden produce"], "la canasta de la cosecha propia"],
  [132.0, "sa_d_billetes", ["hands counting cash bills","money being counted on a table"], "el dinero que se va cada mes"],
  [140.0, "sa_d_oficina_corp", ["modern corporate glass office tower","big corporation skyscraper"], "las corporaciones"],
  [144.0, "sa_d_huerta2", ["person watering a backyard vegetable garden","gardener with a watering can"], "regando la huerta"],
  [148.0, "sa_d_sandia_sol", ["watermelon in a sunny field close up","watermelon basking in the sun"], "una sandía al sol del campo"],
  [157.0, "sa_d_pulpa_pale", ["close up of pale watery watermelon flesh","unripe whitish watermelon inside"], "la pulpa pálida y aguada"],
  [174.0, "sa_d_frutero", ["bowl of ripening fruit on a kitchen table","fruit bowl with bananas and apples"], "la frutera madurando"],
  [183.0, "sa_d_vid_suelo", ["watermelon resting on straw in a field","watermelon on the ground among leaves"], "la sandía sobre la tierra"],
  [190.0, "sa_d_cajas_pallet", ["pallets of produce boxes in a warehouse","stacked crates in a distribution center"], "los pallets del depósito"],
  [198.0, "sa_d_descarga", ["workers loading watermelons onto a truck","unloading crates of produce"], "cargando el camión"],
  [206.0, "sa_d_ruta2", ["produce truck driving down a long highway","semi truck on the road at dawn"], "el camión rumbo a la ciudad"],
  [213.0, "sa_d_verde_corte", ["unripe green-fleshed watermelon cut open","hard pale watermelon interior"], "una sandía verde por dentro"],
  [221.0, "sa_d_rojo_perfecto", ["perfect crisp red watermelon cross section","ideal ripe watermelon cut in half"], "el rojo perfecto que buscás"],
  [229.0, "sa_d_elige_feria", ["choosing a watermelon at an outdoor fair","picking fruit at a street market"], "eligiendo en la feria"],
  [233.0, "sa_d_planta_joven", ["young watermelon plant with first leaves","seedling in a garden bed"], "la plantita de sandía"],
  // señal 1 extra
  [240.0, "sa_d_base2", ["close up of the flat bottom of a watermelon","underside resting spot of a watermelon"], "la base donde se apoyó"],
  [252.0, "sa_d_tierra_marca", ["watermelon lifted showing soil contact spot","ground spot dirt mark on watermelon"], "la marca que dejó la tierra"],
  [265.0, "sa_d_amarillo_macro", ["macro of a creamy yellow watermelon spot","buttery yellow patch close up"], "el amarillo manteca, bien de cerca"],
  [273.0, "sa_d_madura_corte", ["ripe red watermelon being cut open","deep red flesh revealed"], "lo que hay adentro de una madura"],
  [282.0, "sa_d_blanca_macro", ["macro of a white pale watermelon ground spot","greenish white underside patch"], "la mancha blanca de la verde"],
  [290.0, "sa_d_deja_super", ["putting a watermelon back on the pile","setting down a rejected watermelon"], "dejándola donde estaba"],
  [298.0, "sa_d_dos_manchas", ["two watermelon ground spots compared side by side","yellow vs white field spot"], "amarilla contra blanca"],
  // señal 2 extra
  [316.0, "sa_d_tela_macro", ["macro of brown webbing lines on watermelon rind","corky sugar veins on watermelon skin"], "las venitas marrones en macro"],
  [324.0, "sa_d_marcas_mano", ["finger tracing brown marks on a watermelon","hand on a webbed watermelon"], "el dedo recorriendo las cicatrices"],
  [332.0, "sa_d_abeja_macro", ["macro of a bee covered in pollen on a flower","close up bee pollinating"], "la abeja cargada de polen"],
  [341.0, "sa_d_flor_sandia", ["yellow watermelon flower on the vine","squash family flower in a garden"], "la flor de la sandía"],
  [355.0, "sa_d_tela_densa", ["watermelon with dense heavy brown netting","heavily scarred sweet watermelon"], "una cubierta densa de telarañas"],
  [364.0, "sa_d_abejas_jardin", ["several bees on flowers in a garden","pollinators busy on blossoms"], "las abejas en el jardín"],
  // señal 3 extra
  [384.0, "sa_d_zarcillo_macro", ["macro of a curly green tendril on a vine","spiral tendril close up"], "el rulito del zarcillo, en macro"],
  [397.0, "sa_d_vid_verde", ["green watermelon vine with fresh growth","healthy watermelon plant on the ground"], "la planta todavía verde y activa"],
  [410.0, "sa_d_zarcillo_muerto", ["dried up brown tendril like dead wire","withered curl on a watermelon stem"], "el zarcillo como alambre muerto"],
  [418.0, "sa_d_tallo_seco", ["dry brown stem connection on a watermelon","mature stalk on the vine"], "el tallo seco de la madura"],
  // señal 4 extra
  [434.0, "sa_d_golpe_mesa", ["watermelon on a table being tapped","thumping a watermelon set on a surface"], "golpeándola sobre la mesa"],
  [446.0, "sa_d_oido_sandia", ["person leaning ear to a watermelon while tapping","listening closely to a watermelon"], "el oído pegado a la sandía"],
  [454.0, "sa_d_tambor", ["hands drumming rhythmically on a watermelon","tapping a watermelon like a drum"], "como un tambor hueco"],
  [462.0, "sa_d_pulpa_vibra", ["very juicy red watermelon flesh close up","glistening wet watermelon interior"], "la pulpa vibrando de jugo"],
  [470.0, "sa_d_golpe_dura2", ["knocking on a hard solid unripe watermelon","tapping a dense green watermelon"], "el golpe seco de la dura"],
  [478.0, "sa_d_pasada", ["overripe mealy grainy watermelon flesh","mushy past watermelon inside"], "la pasada, harinosa"],
  // señal 5 extra
  [494.0, "sa_d_pesa_brazos", ["lifting a heavy watermelon with both arms","hoisting a big watermelon"], "el peso en los brazos"],
  [506.0, "sa_d_dos_pesos", ["holding two watermelons one in each hand","comparing two watermelons by weight"], "una en cada mano, comparando"],
  [514.0, "sa_d_liviana", ["light dry watermelon held easily","small light watermelon"], "la liviana, seca por dentro"],
  // señal 6 extra
  [532.0, "sa_d_brillo_reflejo", ["light reflecting off a shiny watermelon skin","glossy reflective watermelon surface"], "el brillo que refleja la luz"],
  [544.0, "sa_d_mate_macro", ["macro of a matte deep green watermelon rind","dull non-reflective watermelon skin"], "la piel mate, sin reflejo"],
  [557.0, "sa_d_mate_pila", ["dull-skinned ripe watermelon among shiny ones","matte watermelon standing out"], "la opaca entre las brillantes"],
  [569.0, "sa_d_rayas_macro", ["macro of bold contrasting watermelon stripes","sharp dark and light green bands"], "las rayas bien marcadas, en macro"],
  // señal 7-8 extra
  [586.0, "sa_d_redonda2", ["perfectly round symmetrical watermelon on a table","uniform globe watermelon"], "la redonda perfecta"],
  [599.0, "sa_d_deforme2", ["watermelon with a big dent and a bulge","lopsided uneven watermelon"], "la deforme, con un lado hundido"],
  [621.0, "sa_d_rechoncha", ["plump compact round watermelon held","chubby round watermelon"], "la redonda y rechoncha"],
  [629.0, "sa_d_alargada2", ["long stretched oblong watermelon on the ground","elongated watermelon"], "la larga y estirada"],
  [645.0, "sa_d_cabito_macro", ["macro of a dried brown stub stem on a watermelon","close up watermelon stalk remnant"], "el cabito, en primer plano"],
  // conocimiento / producir extra
  [665.0, "sa_d_inspecciona2", ["hands and eyes carefully reading a watermelon","close inspection of a melon outdoors"], "leyendo la fruta con calma"],
  [674.0, "sa_d_cuaderno", ["weathered hands writing in a field notebook","handwritten notes and sketches"], "anotando lo que funciona"],
  [705.0, "sa_d_elige_confia", ["confident hand picking the right watermelon","sure selection at a market"], "elegir con seguridad"],
  [718.0, "sa_d_siembra_mano", ["hands pressing a seed into garden soil","planting a seed by hand"], "sembrando con la mano"],
  [726.0, "sa_d_vid_crece2", ["time of a watermelon vine spreading in a garden","young vine with tendrils reaching"], "la enredadera creciendo"],
  [742.0, "sa_d_suelo_vivo", ["macro of living soil with roots and worms","thriving dark earth close up"], "el suelo vivo, por dentro"],
  [750.0, "sa_d_suelo_gris", ["barren gray cracked dead dirt","lifeless dry cracked ground"], "el suelo gris y muerto"],
  [759.0, "sa_d_lombriz_macro", ["macro of an earthworm in dark soil","worm wriggling in compost"], "una lombriz trabajando"],
  [767.0, "sa_d_homegrown2", ["holding a homegrown watermelon proudly in a garden","gardener with their own watermelon"], "la sandía de tu propia huerta"],
  [775.0, "sa_d_compost_bin", ["kitchen scraps in a compost bin","food waste turning into compost"], "los restos de cocina al compost"],
  [791.0, "sa_d_humus", ["dark rich worm castings in hands","fine vermicompost humus"], "el humus de lombriz"],
  [803.0, "sa_d_come_jugosa", ["child biting into a juicy watermelon slice","person eating watermelon happily"], "mordiendo una tajada jugosa"],
  [811.0, "sa_d_semilla_palma2", ["close up of black watermelon seeds in a palm","handful of glossy watermelon seeds"], "las semillas negras en la palma"],
  [823.0, "sa_d_seca_semilla", ["watermelon seeds drying on a paper towel","seeds laid out to dry"], "secando las semillas"],
  [839.0, "sa_d_intercambio", ["neighbors exchanging seeds over a fence","hands sharing seed packets"], "el intercambio de semillas entre vecinos"],
  [848.0, "sa_d_almacigo", ["tray of seedlings sprouting in soil","seed starting tray with sprouts"], "el almácigo brotando"],
  [864.0, "sa_d_fresca_despensa", ["whole watermelon stored in a cool pantry","watermelon on a shelf in shade"], "guardada en un lugar fresco"],
  [881.0, "sa_d_corazon", ["the sweet red heart center of a watermelon","spoon scooping the center of watermelon"], "el corazón, lo más dulce"],
  [894.0, "sa_d_reparte", ["serving watermelon wedges to a family outdoors","handing watermelon slices around"], "repartiendo entre todos"],
  [903.0, "sa_d_sal_macro", ["macro of salt crystals sprinkled on red watermelon","pinch of salt on a watermelon slice"], "la pizca de sal sobre el rojo"],
  [919.0, "sa_d_fruto_vid", ["a watermelon swelling on the vine in a garden","growing watermelon among green leaves"], "el fruto hinchándose en la planta"],
  [931.0, "sa_d_vid_larga", ["a long watermelon vine sprawling across soil","sprawling cucurbit vine in a garden"], "la guía estirándose por el suelo"],
  [944.0, "sa_d_siembra2", ["dropping a seed into a hole in living soil","sowing watermelon seeds in a row"], "poniendo la semilla en tierra viva"],
  [956.0, "sa_d_revisa_vid", ["gardener checking a watermelon on the vine daily","inspecting ripening fruit in a garden"], "revisando la planta cada día"],
  [977.0, "sa_d_corta_vid", ["cutting a ripe watermelon off the vine with a knife","harvesting watermelon from the plant"], "cortándola de la planta en su punto"],
  [989.0, "sa_d_super_triste", ["sad sterile supermarket watermelon display","rows of identical store watermelons"], "las sandías idénticas del super"],
  // anécdota extra
  [1010.0, "sa_d_almacen2", ["rustic country general store with produce","old farm shop interior"], "el almacén de campo"],
  [1027.0, "sa_d_fea_elegida", ["holding up an ugly webbed watermelon","showing a marked rough watermelon"], "la más fea del cajón, la elegida"],
  [1040.0, "sa_d_navaja2", ["a knife slicing into a watermelon outdoors","cutting watermelon with a pocket knife"], "la navaja entrando en la sandía"],
  // cuadro grande extra
  [1074.0, "sa_d_facturas2", ["a pile of utility bills and invoices","stack of monthly bills"], "las facturas que se acumulan"],
  [1086.0, "sa_d_pesticida", ["pesticide spray bottles on a shelf","chemical garden sprays"], "los pesticidas que comprás"],
  [1094.0, "sa_d_cocina_llama", ["blue gas flame on a kitchen stove","cooking gas burner lit"], "la llama del gas"],
  [1110.0, "sa_d_dinero_corp", ["money flowing toward a corporate building","cash going to a big company"], "cada dólar a las empresas"],
  // manual extra
  [1146.0, "sa_d_huerta_rica", ["abundant raised garden beds full of vegetables","lush productive vegetable plot"], "una huerta rebosante"],
  [1161.0, "sa_d_rocket2", ["close up flames inside a rocket stove","efficient twig stove burning hot"], "la estufa rocket encendida"],
  [1169.0, "sa_d_horno_pizza", ["clay oven baking with fire inside","wood-fired adobe oven"], "el horno de barro con fuego"],
  [1177.0, "sa_d_manual_pasos", ["finger following step-by-step diagrams in a manual","clear illustrated instructions page"], "el paso a paso con dibujos"],
  // cierre extra
  [1276.0, "sa_d_mercado_final", ["a hand confidently choosing a watermelon at market","picking the best watermelon"], "la próxima vez en la verdulería"],
  [1311.0, "sa_d_roja_final", ["a perfect red watermelon sliced open at home","ideal ripe red watermelon halves"], "la sandía roja, firme, dulce"],
  [1324.0, "sa_d_libre", ["a self-sufficient family garden at golden hour","peaceful productive homestead"], "la independencia, con tus manos"],
  [1357.0, "sa_d_tierra_transforma", ["dead gray soil beside rich black soil comparison","before and after reviving soil"], "de tierra muerta a tierra viva"],

  // ── TANDA 2 de densidad (cortes aún más rápidos en los tramos clip-a-clip) ──
  [164.0, "sa_e_vid_sol", ["watermelon ripening on the vine in full sun","melon growing in a sunny field"], "la sandía madurando al sol en la planta"],
  [185.0, "sa_e_deposito2", ["stacks of melon crates in a cold warehouse","produce boxes in storage"], "los cajones en el depósito"],
  [224.0, "sa_e_elige_mano2", ["hand picking a watermelon from a market pile","selecting a melon at a stand"], "la mano eligiendo en la verdulería"],
  [376.0, "sa_e_tela_buscar", ["close up of brown sugar webbing on melon skin","corky netting on a watermelon"], "buscando las de más telarañas"],
  [402.0, "sa_e_tendril_verde", ["macro of a fresh green tendril on a vine","green curl on a melon plant"], "el zarcillo verde de la inmadura"],
  [427.0, "sa_e_tendril_seco2", ["dried brown tendril beside a watermelon stem","withered curl on the vine close up"], "el zarcillo seco, el reloj de la planta"],
  [487.0, "sa_e_golpe_ojos", ["person tapping a watermelon with eyes closed listening","focused thumping of a melon"], "golpeando con los ojos cerrados"],
  [524.0, "sa_e_balanza_mano", ["weighing a heavy watermelon in one hand","feeling the weight of a melon"], "la mano como balanza"],
  [553.0, "sa_e_mate_madura", ["matte deep-colored ripe watermelon rind","dull ripe melon skin close up"], "la piel mate de la madura"],
  [561.0, "sa_e_mate_elegir", ["choosing a dull matte watermelon over shiny ones","picking the non-shiny melon"], "eligiendo la opaca"],
  [578.0, "sa_e_rayas2", ["macro of high-contrast green watermelon stripes","bold dark and light bands on a melon"], "las rayas de buen contraste"],
  [606.0, "sa_e_deforme3", ["a lopsided watermelon with uneven sides","bumpy irregular melon"], "una sandía despareja"],
  [617.0, "sa_e_compara_forma", ["round watermelon beside an oblong one on a table","comparing melon shapes"], "comparando la redonda y la larga"],
  [637.0, "sa_e_dos_parejas", ["choosing between two similar watermelons","two melons side by side decision"], "entre dos parejas, la redonda"],
  [655.0, "sa_e_cabito2", ["macro of a dried stub stem on a watermelon","stalk remnant on a melon"], "el cabito seco, por las dudas"],
  [709.0, "sa_e_elige_seguro2", ["confident shopper selecting the perfect watermelon","sure pick at a fruit market"], "elegir mejor que casi todos"],
  [755.0, "sa_e_suelo_raices", ["rich compost soil full of roots and life","dark organic soil close up"], "tierra rica, con materia orgánica"],
  [815.0, "sa_e_semilla_seca", ["watermelon seeds drying on a cloth","laying out melon seeds to dry"], "secando las semillas de una buena sandía"],
  [827.0, "sa_e_sobre2", ["labeled paper seed envelope on a shelf","saved seeds in a paper packet"], "el sobre de papel, fresco y oscuro"],
  [835.0, "sa_e_frascos_semilla", ["glass jars of saved garden seeds","seed jars on a rustic shelf"], "los frascos de semillas guardadas"],
  [856.0, "sa_e_sobres_rack", ["rack of seed packets in a garden store","buying seed packets every year"], "comprar semillas de cero, la mentira"],
  [873.0, "sa_e_heladera2", ["covered bowl of cut watermelon in a fridge","watermelon stored chilled"], "la cortada, tapada en la heladera"],
  [885.0, "sa_e_corazon2", ["spoon scooping the sweet center of a watermelon","red heart of a watermelon"], "el corazón, la parte más dulce"],
  [911.0, "sa_e_saborea", ["person savoring a juicy watermelon slice outdoors","enjoying watermelon with eyes closed"], "el que disfruta, no el que solo come"],
  [940.0, "sa_e_huerta_sol", ["warm sunlit garden bed in summer","sunny vegetable garden"], "calor y sol pleno para la planta"],
  [948.0, "sa_e_varias_sandias", ["several watermelons growing on vines in a garden","multiple melons in a backyard plot"], "varias sandías de una sola planta"],
  [969.0, "sa_e_mancha_jardin", ["yellow ground spot on a garden-grown watermelon","creamy spot on a homegrown melon"], "la mancha amarilla en tu propia sandía"],
  [981.0, "sa_e_muerde_roja", ["biting into a crisp red homegrown watermelon","crunchy red watermelon bite"], "la sandía más dulce de tu vida"],
  [998.0, "sa_e_cosecha_jardin", ["harvesting a ripe watermelon in a home garden","cutting a homegrown melon at the perfect time"], "cosechar en el momento justo"],
  [1036.0, "sa_e_almacenero2", ["a skeptical vendor smiling at a market","shopkeeper amused at a stand"], "el almacenero, incrédulo"],
  [1066.0, "sa_e_recibos2", ["a pile of monthly household bills and receipts","stack of invoices on a table"], "todo lo que gastás al año"],
  [1223.0, "sa_e_checkout", ["a phone showing a secure checkout page","smartphone with a download button"], "el link, con cupos limitados"],
  [1261.0, "sa_e_quinta", ["a small rural homestead with a vegetable garden","country plot with productive land"], "una casa, una quinta, tierra para producir"],
  [1269.0, "sa_e_jardinero_feliz", ["a happy gardener holding a harvest basket","content person in their garden"], "escrito para vos"],
  [1320.0, "sa_e_autosuf2", ["a thriving self-sufficient backyard garden","abundant home homestead garden"], "casi todo lo podés producir vos"],
  [1328.0, "sa_e_manos_tierra", ["old weathered hands working dark soil","hands planting in living earth"], "el conocimiento de los viejos, libre"],

  // ── TANDA 3: cortar los holds largos de componentes (tramos manual/producir) ──
  [693.0, "sa_f_manual_pag", ["open rustic manual book pages with hand-drawn diagrams","flipping through a practical guide book"], "las páginas del manual"],
  [712.0, "sa_f_planta_huerta", ["person planting seedlings in a home garden bed","gardener working a vegetable plot"], "plantando en la huerta"],
  [730.0, "sa_f_mano_plantin", ["hands holding rich soil with a young seedling","planting a seedling in dark earth"], "tierra y un plantín en la mano"],
  [770.0, "sa_f_compost", ["dark crumbly compost soil close up","rich organic soil texture macro"], "el compost casero"],
  [779.0, "sa_f_humus", ["worm castings vermicompost in hands","fine dark humus in palms"], "el humus de lombriz"],
  [1100.0, "sa_f_efectivo", ["counting cash bills on a table","stack of money and a calculator"], "el dinero que se va cada año"],
  [1188.0, "sa_f_libro_mesa", ["a rustic guide book on a wooden table warm light","practical manual on a desk"], "el manual sobre la mesa"],
  [1210.0, "sa_f_sello", ["a guarantee stamp on a paper document","a trust seal close up"], "la garantía"],
  [1238.0, "sa_f_lee_afuera", ["a person reading a book outdoors in the countryside","reading a manual on a porch"], "leyendo el manual"],
  [1246.0, "sa_f_jardin_feliz", ["a happy person working in a thriving garden","content gardener among vegetables"], "manos a la obra en el patio"],
];

CLIPS.sort((a, b) => a[0] - b[0]);
const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.SA_MINGAP) || 2.3; // cortes rápidos (video muy dinámico, ~4.9s/clip)
const clips = [];
let lastT = -99;
for (const c of CLIPS.filter((c) => !inFull(c[0]))) {
  if (c[0] - lastT < MINGAP) continue;
  clips.push(c);
  lastT = c[0];
}

if (MODE === "match") {
  const match = clips.map(([t, name, query, concept]) => ({ name, concept, query, dur: DLDUR }));
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync("public/broll/match_sandia.json", JSON.stringify(match, null, 2));
  console.log(`match_sandia.json: ${match.length} clips a matchear (avatar-full: ${AV_FULL.length} bloques)`);
  process.exit(0);
}

// ── BUILD HÍBRIDO ──
const have = (name) => fs.existsSync(`public/broll/${name}.mp4`);
const IMG_STYLE = ", realistic color photograph, natural vivid colors, sharp focus, well lit, clean, no text, no captions, no watermark, no logo";
const nClip = clips.filter((c) => have(c[1])).length;
const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...clips.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;
const OV = 0.5;
let beats = clips.map(([t, name, , concept]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id: name, start: t, dur, kind: "raw", src: `broll/${name}.mp4`, darken: 0 };
  return { id: name, start: t, dur, kind: "raw", src: `img/${name}.png`, darken: 0, gen: { type: "image", name, prompt: concept + IMG_STYLE } };
});


// ── COMPONENTES (diversos · datos del método + oferta del manual $27) ──
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const COMPONENTS = [
  // gancho: la verdad que cambia todo
  { t: 167, id: "cmp_nomadura", kind: "impact", image: "img/cmp_nomadura_bg.png",
    setup: "Una verdad simple:", impact: "La sandía no madura después de cortarla.", impactAccent: "danger", hitAt: 1.5, boom: 0, darken: 0.42,
    bg: "a cut watermelon with pale watery unripe flesh on a wooden table" },
  // por qué el super te falla (problema)
  { t: 196, id: "cmp_porque", kind: "checklist", hue: "red", accent: "danger",
    title: "Por qué el super te falla", eyebrow: "El negocio",
    items: [ck("La cosechan verde, antes de tiempo"), ck("Aguanta el viaje, no el sabor"), ck("No madura más después de cortada")],
    bg: "watermelons being loaded onto a truck at a packing warehouse" },
  // costo de la verdura (callout)
  { t: 1086, id: "cmp_verdura", kind: "callout", hue: "red", accent: "danger",
    figure: "$1.440", eyebrow: "Cada año", caption: "solo en verdura y hierbas que podrías cosechar en 10 m²",
    bg: "expensive vegetables and herbs with price tags at a market" },
  // qué reemplaza el manual (splitlist)
  { t: 1146, id: "cmp_reemplaza", kind: "splitlist", palette: "G",
    title: "Lo que reemplaza", items: ["Fertilizante caro → mezcla de $1", "Pesticidas → barrera de $5", "Gas → estufa rocket de barro"] },
  // el plan de 90 días (process)
  { t: 1160, id: "cmp_plan", kind: "process", hue: "amber", accent: "good",
    title: "El plan de 90 días", eyebrow: "Tu camino",
    steps: [{ title: "Semana 1: tierra y alimento" }, { title: "Semana 4: defensa" }, { title: "Día 90: −40% de gastos" }] },
  // el sistema (interés opuesto)
  { t: 211, id: "cmp_negocio", kind: "splitlist", palette: "D", cross: true,
    title: "Lo que le conviene a la cadena", items: ["Que aguante 3 semanas en un camión", "Cosecharla verde y dura", "Que viaje sin pudrirse"] },
  // foto anotada con las marcas
  { t: 305, id: "cmp_anotada", kind: "annotated", hue: "amber", eyebrow: "Lo que la fruta te grita", image: "img/cmp_anotada_bg.png",
    annotations: [
      { kind: "circle", x: 0.5, y: 0.82, w: 0.16, label: "Mancha amarilla", color: "good" },
      { kind: "circle", x: 0.32, y: 0.45, w: 0.13, label: "Telarañas marrones", color: "amber" },
      { kind: "arrow", x: 0.74, y: 0.28, fromX: 0.9, fromY: 0.12, label: "Zarcillo seco", color: "accent" },
    ],
    bg: "a ripe watermelon on a wooden table, yellow ground spot, brown sugar webbing on the rind, dried tendril near the stem" },
  // recap de las 8 señales
  { t: 659, id: "cmp_senales", kind: "checklist", hue: "amber", accent: "good",
    title: "Las 8 señales", eyebrow: "Sin cortar · sin balanza",
    items: [ck("Mancha amarilla cremosa"), ck("Telarañas marrones (más = mejor)"), ck("Zarcillo seco y marrón"), ck("Golpe grave y profundo"), ck("Pesada para su tamaño"), ck("Piel mate, no brillante"), ck("Forma pareja y redonda"), ck("Cabito seco")],
    bg: "several ripe watermelons arranged on a rustic wooden table" },
  // manual — inyecto 1 (suave)
  { t: 686, id: "cmp_manual1", kind: "checklist", hue: "amber", accent: "good",
    title: "El Constructor Libre", eyebrow: "Manual · link en la descripción",
    items: [ck("El método completo de la sandía"), ck("+ 35 sistemas para tu independencia"), ck("Medidas exactas, paso a paso")],
    bg: "a rustic practical manual book with hand-drawn diagrams on a wooden table" },
  // tres claves de una sandía dulce
  { t: 734, id: "cmp_tresclaves", kind: "process", hue: "amber", accent: "good",
    title: "Una sandía dulce = 3 cosas", eyebrow: "El mismo secreto",
    steps: [{ title: "Sol pleno" }, { title: "Tiempo en la planta" }, { title: "Tierra viva" }] },
  // tierra viva casi gratis
  { t: 783, id: "cmp_tierra", kind: "checklist", hue: "amber", accent: "good",
    title: "Tierra viva, casi gratis", eyebrow: "La tercera clave",
    items: [ck("Mezcla de $1 revive la tierra en 7 días"), ck("Tubo de lombrices de $2 = $200/año"), ck("Restos de cocina, no sacos caros")],
    bg: "hands holding rich dark living compost soil with worms" },
  // el gasto anual (desglose)
  { t: 1078, id: "cmp_breakdown", kind: "checklist", hue: "red", accent: "danger",
    title: "Lo que perdés cada año", eyebrow: "Sin darte cuenta",
    items: [ck("Fertilizante y tierra", "$180"), ck("Semillas y plantines", "$120"), ck("Pesticidas", "$95"), ck("Verdura y hierbas", "$1.440"), ck("Gas calefacción + cocina", "$720")],
    bg: "a pile of household bills and a propane tank" },
  // 4055 stat
  { t: 1102, id: "cmp_4055", kind: "stat", hue: "red", accent: "danger",
    value: 4055, prefix: "$", suffix: "/año", label: "que le entregás a corporaciones por cosas que podés hacer vos", eyebrow: "El hogar promedio" },
  // qué incluye el manual (inyecto 2)
  { t: 1150, id: "cmp_incluye", kind: "checklist", hue: "amber", accent: "good",
    title: "Qué incluye el manual", eyebrow: "35 sistemas",
    items: [ck("100 páginas · 50 ilustraciones"), ck("Los 6 cultivos más rentables"), ck("Estufa rocket + muro Trombe"), ck("Bonos: calendario + guía de herramientas")],
    bg: "an open rustic manual with technical diagrams and illustrations" },
  // los sistemas (chips)
  { t: 1169, id: "cmp_sistemas", kind: "chips", hue: "amber",
    title: "Algunos de los 35 sistemas", chips: ["Estufa rocket", "Muro Trombe", "Horno de barro", "Agua de lluvia", "Barrera galvánica"],
    bg: "a clay adobe oven and a rocket stove in a rustic yard" },
  // oferta: valor vs precio (bars 1)
  { t: 1190, id: "cmp_oferta", kind: "bars", hue: "amber", accent: "good", unit: "USD",
    title: "Valor real vs hoy", eyebrow: "Pago único · acceso de por vida",
    bars: [{ label: "Valor total", value: 158, display: "$158", tone: "danger" }, { label: "Hoy", value: 27, display: "$27", winner: true }] },
  // garantía (callout)
  { t: 1206, id: "cmp_garantia", kind: "callout", hue: "amber", accent: "good",
    figure: "30 días", eyebrow: "Garantía de confianza", caption: "Si no te sirve, te devolvemos el dinero sin preguntas — y te quedás el manual",
    bg: "a manual book on a table with a warm light, trustworthy" },
  // sistema actual vs constructor libre (bars 2)
  { t: 1118, id: "cmp_vs", kind: "bars", hue: "red", accent: "good", unit: "USD",
    title: "Sistema actual vs hacerlo vos", eyebrow: "La salida",
    bars: [{ label: "Comprar todo", value: 4055, display: "$4.055/año", tone: "danger" }, { label: "El Constructor Libre", value: 27, display: "$27 una vez", winner: true }] },
  // para quién NO es (honestidad)
  { t: 1235, id: "cmp_paraquien", kind: "splitlist", palette: "D", cross: true,
    title: "Este manual NO es para…", items: ["El que solo lee y no hace", "El que espera magia sin esfuerzo", "El que no quiere aprender con las manos"] },
  // recap acción (hoy mismo)
  { t: 1285, id: "cmp_recap8", kind: "checklist", hue: "amber", accent: "good",
    title: "Hoy mismo, en la verdulería", eyebrow: "Sin gastar un peso",
    items: [ck("Mancha amarilla cremosa"), ck("Telarañas marrones"), ck("Zarcillo seco"), ck("Golpe grave"), ck("Pesada y mate")],
    bg: "a person choosing a watermelon at a market stall" },
  // error que comete casi todos
  { t: 6, id: "cmp_error", kind: "mistake", number: "✗", eyebrow: "EL ERROR DE CASI TODOS",
    title: "Comprar con los ojos de la publicidad", desc: "Golpear al azar y rezar. Así te llevás la sandía aguada, una y otra vez.",
    bg: "a confused shopper tapping watermelons at random in a store" },
  // cita de cierre
  { t: 1353, id: "cmp_quote", kind: "quote", hue: "amber", accent: "amber", fontSize: 92,
    text: "La tranquilidad no se compra. Se *construye* con las manos.",
    bg: "weathered hands working soil in a garden at golden hour" },
  // próximo video
  { t: 1369, id: "cmp_next", kind: "nextvideo", kicker: "La semana que viene",
    title: "Cómo revivir una tierra muerta en 7 días", sub: "De gris y dura a negra y fértil, con una mezcla de $1." },
];
let nComp = 0;
const placed = new Set();
for (const c of [...COMPONENTS].sort((a, b) => a.t - b.t)) {
  let idx = -1;
  for (let i = 0; i < beats.length; i++) {
    if (beats[i].start <= c.t + 0.01) { if (!placed.has(beats[i].id)) idx = i; }
    else break;
  }
  if (idx < 0) continue;
  const start = beats[idx].start;
  const D = 6.2;
  const { t, bg, kind, ...rest } = c;
  const ab = { id: c.id, start, dur: D, kind };
  delete rest.id;
  Object.assign(ab, rest);
  if (bg) {
    ab.image = `img/${c.id}_bg.png`;
    ab.gen = { type: "image", name: `${c.id}_bg`, prompt: bg + IMG_STYLE };
  }
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placed.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placed.add(c.id);
  const next = beats[idx + 1];
  const nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + 7.5) - start).toFixed(2);
  nComp++;
}

// ── TOPE de imágenes IA (~100, prioriza clips reales): descarte INTELIGENTE —
// borra una imagen RAW solo si el hueco resultante queda ≤7.5s (donde hay clips
// cerca). Nunca crea holds largos; si no puede bajar a 100 sin holds, deja más.
beats.sort((a, b) => a.start - b.start);
const IMGCAP = Number(process.env.SA_IMGCAP) || 100;
const isImg = (b) => b && b.kind === "raw" && b.gen;
const imgCount = () => beats.filter(isImg).length;
let safety = 500;
while (imgCount() > IMGCAP && safety-- > 0) {
  let droppedOne = false;
  for (let i = 1; i < beats.length - 1; i++) {
    if (!isImg(beats[i])) continue;
    if (beats[i + 1].start - beats[i - 1].start <= 7.5) { beats.splice(i, 1); droppedOne = true; break; }
  }
  if (!droppedOne) break; // no más borrados seguros (evita holds)
}
console.log(`tope imágenes: ${imgCount()} imágenes IA · ${beats.filter((b) => b.kind === "raw" && !b.gen).length} clips reales`);

// ── PASE FINAL DE TILING: cero pantallas vacías ──
beats.sort((a, b) => a.start - b.start);
const avStartsAll = AV_FULL.map(([s]) => s);
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStartsAll.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL);
  if (avAfter < end) end = avAfter;
  const ov = b.kind === "raw" ? OV : 0;
  b.dur = +(Math.max(0.2, Math.min(end + ov, TOTAL) - b.start)).toFixed(2);
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/sandia.json", JSON.stringify({ video: "sandia", avatar: "sandia_opt.mp4", clipsfirst: true, beats }, null, 2));

// ── ventanas de avatar ──
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = [];
let k = 0;
for (let i = 0; i < beats.length; i++) {
  if (i % 6 === 3) { pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]); k++; }
}
const firstClip = clips.length ? clips[0][0] : OPEN;
const modeAt = (t) => {
  if (t < firstClip - 1e-6) return "full";
  if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
  return p ? p[2] : "hidden";
};
const pts = [...new Set([0, firstClip, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = [];
let cur = null;
for (const t of pts) {
  if (t >= TOTAL - 1e-6) break;
  const m = modeAt(t);
  if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; }
}
windows.push({ start: TOTAL, mode: "hidden" });

fs.writeFileSync("src/VideoEdit/avatar_sandia.gen.ts", `// avatar_sandia.gen.ts — GENERADO por build_sandia.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_SANDIA = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0) + OPEN;
console.log(`=== build_sandia ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · imágenes IA: ${beats.length - nClip} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${beats.length ? Math.min(...beats.map((b) => b.dur)) : 0}s / ${beats.length ? Math.max(...beats.map((b) => b.dur)) : 0}s`);
