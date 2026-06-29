// build_ovejas.mjs — comp del video micro-rancho. ★ ANCLAJE POR CONTENIDO (método barcos):
// CADA imagen/clip/componente está clavado al ms EXACTO de su frase (segments_ovejas.json,
// Whisper) y su contenido matchea lo que se dice ahí. NADA por matemática uniforme.
// Imágenes ov001-138 (en orden del guion, cubren hasta ~820s) + clips reales os* + componentes.
// dur de cada beat = hasta el próximo anchor (corte en frase real). Avatar abre, confiesa la guía y cierra.
// Flujo: node build_ovejas.mjs · node beatsheet.mjs beatsheet/ovejas.json
import fs from "fs";

const TOTAL = 1290;

// ── avatar full: apertura (0-6), confesión de la guía a cámara (338-357), cierre (1281-fin) ──
const AV = [[0, 6], [338, 357], [1281.2, TOTAL]];

// ── COMPONENTES — ms VERIFICADO contra el transcript + contenido que matchea la frase ──
const COMP = [
  { start: 6.3, kind: "callout", figure: "$225.000", eyebrow: "DE $2.500 A", caption: "en unos pocos años", image: "img/ov006.jpg", hue: "amber" },
  { start: 90.6, kind: "lielist", title: "Te hacen creer que necesitás:", items: ["Millones de dólares", "Mil hectáreas", "Un tractor enorme"], image: "img/ov035.jpg", hue: "cold" },
  { start: 114.5, kind: "chips", bg: "image", image: "img/ov006.jpg", title: "Hoy vas a ver", chips: ["La cuenta real", "El animal exacto", "El método"], hue: "amber" },
  { start: 154.6, kind: "bars", eyebrow: "VACA vs OVEJA", title: "¿Cuál se multiplica?", bars: [{ label: "Vaca", value: 1, display: "1 cría/año" }, { label: "Oveja", value: 3, display: "2 cada 8 meses" }], hue: "amber" },
  { start: 193.7, kind: "chips", bg: "image", image: "img/ov017.jpg", title: "Oveja de pelo · Dorper", chips: ["No se esquila", "Suelta el pelo sola", "Solo carne, bien pagada"], hue: "amber" },
  { start: 205.2, kind: "annotated", image: "img/ov053.jpg", eyebrow: "COMO BICHO DEL MONTE", caption: "Suelta el pelo sola — no le pagás a nadie", annotations: [{ kind: "circle", x: 0.55, y: 0.5, w: 0.2, label: "Pelo suelto" }], hue: "amber" },
  { start: 238.6, kind: "stat", value: 2, suffix: " CRÍAS", label: "cada 8 meses, casi siempre mellizos", eyebrow: "LA DORPER", hue: "amber" },
  { start: 258.1, kind: "gridreveal", title: "Interés compuesto... con patas", subtitle: "el rebaño se duplica solo", tiles: [{ number: "10", name: "hoy" }, { number: "20", name: "año 1" }, { number: "40", name: "año 2" }, { number: "80", name: "año 3" }] },
  { start: 358.6, kind: "aged", eyebrow: "¿La publico o me la guardo?", heading: "La guía del micro-rancho", lines: [{ text: "Cuántos animales por parcela", mark: true }, { text: "Los tiempos exactos" }, { text: "Los números reales, paso a paso" }], hue: "amber" },
  { start: 389.1, kind: "process", eyebrow: "PASTOREO ROTATIVO", steps: [{ title: "Parcela chica", desc: "con alambre eléctrico" }, { title: "Comen y abonan", desc: "1 o 2 días" }, { title: "Mover al lado", desc: "tira fresca" }, { title: "Descansar 30-40 días", desc: "el pasto resucita" }] },
  { start: 428.5, kind: "annotated", image: "img/ov091.jpg", eyebrow: "ABONO GRATIS", caption: "Lo pisan y lo abonan con su propio estiércol", annotations: [{ kind: "circle", x: 0.5, y: 0.6, w: 0.22, label: "Estiércol" }], hue: "amber" },
  { start: 454.6, kind: "bars", eyebrow: "MISMA HECTÁREA", title: "Animales por hectárea", unit: " ovejas", bars: [{ label: "Suelto", value: 1, display: "1" }, { label: "Rotativo", value: 5, display: "5" }], hue: "amber" },
  { start: 467.2, kind: "regrow", title: "El pasto vuelve más fuerte", leftImage: "img/ov087.jpg", rightImage: "img/ov090.jpg", leftLabel: "Comido", rightLabel: "Resucitado", hue: "amber" },
  { start: 492.7, kind: "ingredients", items: [{ image: "img/ov066.jpg", label: "12 ovejas madre" }, { image: "img/ov097.jpg", label: "1 buen carnero" }], resultLabel: "Tu fábrica viva" },
  { start: 540, kind: "timeline", eyebrow: "LA BOLA DE NIEVE", title: "De $2.500 a un patrimonio", events: [{ year: "Año 1", label: "20 corderos" }, { year: "Año 3", label: "40 madres" }, { year: "Año 4", label: "80 animales" }, { year: "Año 6", label: "$200.000", accent: "amber" }] },
  { start: 554.9, kind: "goldvault", label: "$200.000", caption: "un capital que se reproduce solo" },
  { start: 583.8, kind: "mistake", number: "!", eyebrow: "EL ERROR QUE FUNDE AL 90%", title: "El apuro", desc: "Vender antes de tiempo y comerte las hembras jóvenes que iban a multiplicar el rebaño", image: "img/ov111.jpg" },
  { start: 630.5, kind: "annotated", image: "img/ov121.jpg", eyebrow: "PASTOREO MIXTO", caption: "La vaca come lo alto: yuyos y arbustos", annotations: [{ kind: "circle", x: 0.5, y: 0.45, w: 0.22, label: "Come lo alto" }], hue: "amber" },
  { start: 647, kind: "splitexplain", eyebrow: "PASTOREO MIXTO", title: "Dos productos, una tierra", bg: "img/ov123.jpg", image: "img/ov124.jpg", points: ["La vaca come lo alto", "La oveja limpia lo bajo", "Nada se desperdicia", "Se enferman menos"], accent: "amber" },
  { start: 699.4, kind: "chips", bg: "image", image: "img/ov129.jpg", title: "«No tengo tierra»", chips: ["Alquilá barato", "Trabajá a porcentaje", "Campos abandonados de sobra"], hue: "amber" },
  { start: 776.8, kind: "statpills", pills: ["No se esquila", "Aguanta frío y calor", "Pare sola en el campo", "Casi no se enferma"] },
  { start: 784.1, kind: "annotated", image: "img/ov135.jpg", eyebrow: "LA MÁS RESISTENTE", caption: "Aguanta calor, frío y camina kilómetros", annotations: [{ kind: "circle", x: 0.5, y: 0.5, w: 0.22, label: "Aguanta todo" }], hue: "amber" },
  { start: 866.8, kind: "growthtimeline", title: "De 8 a más de 100", stages: [{ label: "8 ovejas", sub: "el arranque" }, { label: "25", sub: "2do año" }, { label: "+100", sub: "4to año" }] },
  { start: 898, kind: "quote", eyebrow: "EL MUCHACHO DEL CAMPITO", text: "El campo que nadie quería hoy me da *más que el sueldo* que tenía", image: "img/ov130.jpg" },
  { start: 975.1, kind: "splitlist", title: "Te quieren cliente de:", items: ["el banco", "el supermercado", "el patrón"], palette: "D", cross: true },
  { start: 1031.8, kind: "process", eyebrow: "PRIMEROS PASOS", steps: [{ title: "Tierra prestada o alquilada" }, { title: "Hembras de mellizos" }, { title: "Un buen carnero" }, { title: "Cerco eléctrico portátil" }, { title: "Aguantá dos años" }] },
  { start: 1076.7, kind: "stat", value: 50, suffix: "%", label: "de la sangre del rebaño", eyebrow: "EL CARNERO", hue: "amber" },
  { start: 1140.5, kind: "checklist", eyebrow: "RESUMEN", title: "LA RECETA DEL MICRO-RANCHO", items: [{ text: "Pedazo chico, bien manejado" }, { text: "Un animal que se multiplica" }, { text: "Aguantar dos años" }, { text: "Mover el pasto" }, { text: "Sumar unas vacas" }], hue: "amber" },
  { start: 161, kind: "annotated", image: "img/ov047.jpg", eyebrow: "LA VACA", caption: "Casi un año para darte un solo ternero", annotations: [{ kind: "circle", x: 0.6, y: 0.55, w: 0.18, label: "1 cría/año" }], hue: "cold" },
  { start: 405, kind: "annotated", image: "img/ov087.jpg", eyebrow: "EL MODO DE TODOS", caption: "Sueltos meses: el pasto se gasta, la tierra se muere", annotations: [{ kind: "circle", x: 0.3, y: 0.55, w: 0.2, label: "Gastado" }], hue: "cold" },
  { start: 499.2, kind: "callout", figure: "20", eyebrow: "PRIMER AÑO", caption: "corderos con 12 madres", image: "img/ov099.jpg", hue: "amber" },
];

// ── IMÁGENES / CLIPS — [ms exacto de la frase, src] anclados a su contenido ──
// (img/ov* = foto IA en orden del guion · broll/os* = clip real cuyo concepto matchea)
const A = (t, src) => ({ start: t, src });
const ANCH = [
  // HOOK
  A(12.8, "img/ov007.jpg"),   // le levanté una casa a mi hija
  A(16.6, "img/ov013.jpg"),   // a mi patrón lo miré a los ojos
  A(19.8, "img/ov015.jpg"),   // al banco jamás le pedí un peso
  A(24.9, "img/ov003.jpg"),   // animales que la mayoría ni mira
  A(29.3, "broll/os021.mp4"), // no me lo regaló nadie / lotería (manos plata)
  A(33, "img/ov005.jpg"),     // no heredé campo, lo levanté yo
  A(36.4, "img/ov004.jpg"),   // animal por animal
  A(38, "img/ov129.jpg"),     // en tierra que no era mía
  A(41, "broll/os035.mp4"),   // la mayoría hacía lo de siempre: esperar (bus)
  A(46.5, "img/ov015.jpg"),   // el préstamo que el banco nunca aprueba
  A(50.4, "img/ov014.jpg"),   // el aumento que el patrón nunca da
  A(53.2, "img/ov025.jpg"),   // la oportunidad que le toca a otro (reloj/silla)
  A(60, "img/ov027.jpg"),     // yo me cansé de esperar
  A(63.9, "img/ov001.jpg"),   // agarré lo poco que tenía
  A(68, "img/ov065.jpg"),     // la única cosa que crece sola
  A(74.6, "img/ov017.jpg"),   // ¿lo más loco? no fue difícil, fue simple
  A(79.3, "img/ov033.jpg"),   // tan simple que te vas a enojar
  A(86.8, "broll/os036.mp4"), // una industria que vive de mentirte
  // (lielist @90.6)
  A(100, "img/ov037.jpg"),    // es mentira (sheds industriales)
  A(103.7, "img/ov039.jpg"),  // el día que podés solo dejás de comprarles
  A(108.3, "img/ov027.jpg"),  // dejás de depender
  // (chips @114.5)
  A(123.9, "img/ov079.jpg"),  // el método que lo hace posible en poca tierra
  A(128.2, "img/ov111.jpg"),  // un error que mata al 90% (anticipo)
  A(136.6, "img/ov041.jpg"),  // servite unos mates
  A(143, "img/ov107.jpg"),    // vale más que un año de sueldo
  // ANIMAL
  A(147.2, "img/ov043.jpg"),  // ¿qué animal? — vacas
  A(150.3, "broll/os013.mp4"),// todos piensan en vacas
  // (bars vaca/oveja @154.6) 
  A(168.7, "broll/os015.mp4"),// media hectárea por una cabeza (vaca sola)
  A(172.2, "img/ov043.jpg"),  // vendés una cosa grande, una vez
  A(177.6, "broll/os036.mp4"),// el sueño del que tiene mil hectáreas
  A(182.8, "img/ov049.jpg"),  // lo que compré fue oveja de pelo, la dorper
  A(189.6, "img/ov051.jpg"),  // presta atención, esto lo cambia todo
  // (chips dorper @193.7) ... (annotated pelo @205.2)
  A(209, "img/ov055.jpg"),    // producís carne, la que pagan bien
  A(214.1, "broll/os018.mp4"),// carne (cortes de cordero)
  A(217.4, "img/ov017.jpg"),  // la razón por la que te hace rico
  A(223, "img/ov059.jpg"),    // una palabra: reproducción
  // REPRO
  A(229.6, "img/ov029.jpg"),  // acá está el corazón de todo
  A(232.7, "broll/os004.mp4"),// dos mellizos casi siempre
  // (stat 2 crías @238.6)
  A(242.9, "img/ov071.jpg"),  // diez ovejas madre (cuenta)
  A(244.3, "img/ov061.jpg"),  // no diez crías, veinte
  A(248.2, "img/ov063.jpg"),  // al año siguiente ya paren
  A(255.4, "img/ov067.jpg"),  // esto no se suma, se multiplica
  // (gridreveal @258.1)
  A(260.9, "broll/os045.mp4"),// el banco te paga monedas por plata quieta
  A(264.4, "img/ov059.jpg"),  // la oveja te paga en carne y animales
  A(267.9, "broll/os005.mp4"),// esos paren más (corderos jugando)
  A(274, "img/ov067.jpg"),    // se duplica si tenés el aguante
  A(279.6, "img/ov107.jpg"),  // de ahí salió el cuarto de millón
  A(284, "img/ov109.jpg"),    // un puñado que se multiplica
  A(288.6, "broll/os048.mp4"),// mientras los movés de pasto en pasto
  A(295.2, "img/ov079.jpg"),  // el método que entra en poca tierra
  A(302.7, "broll/os036.mp4"),// lo que el campo grande mantiene enterrado
  // GUÍA (tease)
  A(308.5, "img/ov077.jpg"),  // tengo que ser honesto con vos
  A(311, "img/ov073.jpg"),    // lo aprendí a los golpes, perdiendo plata
  A(316.1, "img/ov075.jpg"),  // hasta entender números y tiempos
  A(327.6, "img/ov076.jpg"),  // lo junté todo en una guía
  // (avatar full 338-357 confesión) ... (aged guía @358.6)
  A(372, "img/ov078.jpg"),    // si no está dejame en comentarios
  A(382, "img/ov077.jpg"),    // tenés mi palabra
  // MÉTODO
  A(386.1, "img/ov079.jpg"),  // el método, micro ranching
  // (process rotativo @389.1)
  A(397, "broll/os002.mp4"),  // casi todos sueltan los animales en potrero grande
  A(401, "img/ov137.jpg"),    // pisotean todo, arruinan el resto 
  A(412.4, "img/ov093.jpg"),  // yo los meto en un pedazo chico
  A(417.9, "broll/os007.mp4"),// alambre eléctrico que muevo en minutos
  A(421.1, "img/ov081.jpg"),  // los dejo un día, dos
  A(425.1, "broll/os008.mp4"),// comen hasta el piso
  // (annotated abono @428.5)
  A(431.4, "broll/os006.mp4"),// los corro al pedazo de al lado
  A(434.9, "img/ov087.jpg"),  // el primero lo dejo descansar
  A(441.2, "broll/os011.mp4"),// el pasto resucitó, más verde
  A(450.2, "img/ov089.jpg"),  // porque lo dejé descansar y lo aboné
  // (bars 1vs5 @454.6)
  A(461.9, "broll/os015.mp4"),// te juran una hectárea por oveja
  // (regrow @467.2)
  A(472.3, "img/ov089.jpg"),  // la tierra mejora cada año
  A(476.6, "img/ov093.jpg"),  // un pedazo chico bien manejado
  // MATEMÁTICA
  A(485.8, "broll/os030.mp4"),// la matemática real (anotando)
  A(489.2, "img/ov071.jpg"),  // con la calculadora en la mano
  // (ingredients @492.7) 
  A(502.8, "img/ov101.jpg"),  // lo que el apurado no entiende
  A(511.3, "img/ov061.jpg"),  // las hembras se quedan, se suman
  A(518, "img/ov103.jpg"),    // es una bola de nieve
  A(524.2, "img/ov065.jpg"),  // tercer año 40, cuarto 80
  A(529.1, "broll/os031.mp4"),// recién ahí vendés el sobrante
  A(535.7, "img/ov107.jpg"),  // cada cordero es plata limpia
  // (timeline @540)
  A(547.5, "img/ov109.jpg"),  // el rebaño base sigue creciendo
  A(549.1, "img/ov107.jpg"),  // animales en pie + lo vendido
  // (goldvault @554.9)
  A(561.7, "img/ov109.jpg"),  // sigue produciendo solo
  A(565.6, "img/ov110.jpg"),  // no es un sueldo, es capital vivo
  A(568.9, "broll/os047.mp4"),// come pasto gratis, se reproduce
  // ERROR
  A(573.1, "img/ov111.jpg"),  // y ahora sí, el error
  A(580.1, "img/ov129.jpg"),  // no es la poca tierra ni la plata
  // (mistake @583.8)
  A(590.5, "img/ov113.jpg"),  // se come las hembras jóvenes
  A(596.4, "img/ov115.jpg"),  // como arrancar el árbol a la semana
  A(605.5, "img/ov103.jpg"),  // la bola necesita rodar 2-3 años
  A(610, "img/ov117.jpg"),    // el que entiende gana
  A(615, "img/ov118.jpg"),    // es la cabeza, es el aguante (variante, sin salto de Ken-Burns)
  // MIXTO
  A(621.7, "img/ov119.jpg"),  // sumarle algo a la oveja
  A(627.2, "broll/os008.mp4"),// la oveja come el pasto al ras
  // (annotated come lo alto @630.5)
  A(638.7, "broll/os013.mp4"),// la vaca
  A(640, "img/ov123.jpg"),    // mezclar las dos
  // (splitexplain @647)
  A(655.8, "broll/os014.mp4"),// no desperdician un solo pasto
  A(659.7, "img/ov125.jpg"),  // se limpian solas, se enferman menos
  A(667.4, "img/ov121.jpg"),  // donde antes solo vacas
  A(673, "broll/os018.mp4"),  // carne de vaca y de oveja
  A(678.5, "img/ov125.jpg"),  // dos productos donde antes uno
  // OBJECIONES
  A(687.7, "img/ov039.jpg"),  // ya sé las tres excusas
  A(694.7, "img/ov129.jpg"),  // para que no tengas donde esconderte
  // (chips no tengo tierra @699.4)
  A(704, "img/ov127.jpg"),    // la tierra se alquila por monedas
  A(707.6, "broll/os032.mp4"),// a porcentaje con un vecino
  A(714.7, "broll/os022.mp4"),// miles de hectáreas abandonadas
  A(717.6, "img/ov127.jpg"),  // el dueño te las presta feliz
  A(722.8, "img/ov131.jpg"),  // no dueño de la tierra, sí de los animales
  A(729.3, "broll/os031.mp4"),// esos te los llevas a donde sea
  A(733.9, "img/ov109.jpg"),  // el rebaño es tuyo
  A(735.7, "img/ov001.jpg"),  // yo no tengo 2500 dólares
  A(740.2, "broll/os045.mp4"),// a casi nadie le sobran
  A(743.6, "img/ov131.jpg"),  // arranca con 5, con 3 y un carnero
  A(750.7, "img/ov103.jpg"),  // la bola tarda más pero rueda
  A(757, "broll/os004.mp4"),  // dos crías por madre
  A(763.7, "img/ov133.jpg"),  // no importa con cuánto, que arranques
  A(768.6, "img/ov135.jpg"),  // ¿y si se me mueren?
  // (statpills @776.8) ... (annotated aguanta @784.1)
  A(791.8, "img/ov029.jpg"),  // pare sola en el campo
  A(794.9, "img/ov137.jpg"),  // se enferma cuando la amontonás en el barro
  A(799.5, "broll/os006.mp4"),// el rotativo la saca del barro
  A(805, "broll/os039.mp4"),  // por eso casi no se enferma (sanas)
  A(810.5, "img/ov133.jpg"),  // si igual perdés una
  A(814.5, "img/ov131.jpg"),  // perder una es lección barata
  // HISTORIA DEL MUCHACHO
  A(819.1, "img/ov073.jpg"),  // déjame contarte algo
  A(825.7, "broll/os035.mp4"),// un muchacho igual que vos (bus)
  A(834, "img/ov023.jpg"),    // laburaba todo el día para otro
  A(836.8, "img/ov129.jpg"),  // sin un metro de tierra propio
  A(839.6, "broll/os045.mp4"),// pocos ahorros que no alcanzaban
  A(843.6, "broll/os022.mp4"),// campito abandonado lleno de yuyos
  A(851.9, "broll/os032.mp4"),// déjeme usarlo, yo se lo limpio
  A(856.3, "img/ov131.jpg"),  // compró ocho ovejas y un carnero
  A(860.3, "broll/os040.mp4"),// (corderito recién nacido)
  A(863.4, "img/ov101.jpg"),  // no vendió ni una, aguantó
  // (growthtimeline 8→25→100 @866.8 cubre 2do y 4to año)
  A(877.4, "broll/os003.mp4"),// al cuarto año más de cien animales
  A(881.1, "broll/os031.mp4"),// vendía corderos todos los meses
  A(884.4, "broll/os011.mp4"),// el campito más verde de la zona
  A(889.7, "img/ov091.jpg"),  // resucitado a fuerza de patas y abono
  A(892.5, "img/ov117.jpg"),  // la última vez que lo vi
  // (quote campo que nadie quería @898)
  A(904.4, "img/ov107.jpg"),  // es todo mío, no le debo a nadie
  A(908.4, "img/ov129.jpg"),  // no tenía tierra ni capital
  A(912.5, "img/ov117.jpg"),  // solo la cabeza para entender
  A(914.5, "img/ov109.jpg"),  // la paciencia para aguantar dos años
  // POR QUÉ FUNCIONA
  A(928.6, "img/ov110.jpg"),  // por qué funciona ahora (variante, sin salto de Ken-Burns)
  A(934.5, "broll/os018.mp4"),// la carne a pasto la busca más gente
  A(938, "broll/os037.mp4"),  // sana, sin químicos del engorde
  A(942.2, "broll/os019.mp4"),// hay poca, casi nadie cría así
  A(945.3, "img/ov107.jpg"),  // producís algo que escasea
  A(950.2, "img/ov057.jpg"),  // vendés directo al vecino, al carnicero
  A(958.2, "img/ov107.jpg"),  // vos ponés el precio
  A(965.3, "img/ov033.jpg"),  // lo que el sistema no quiere que entiendas
  A(969.3, "img/ov015.jpg"),  // te llenan con título, sueldo, crédito
  // (splitlist cliente de @975.1)
  A(985.9, "img/ov013.jpg"),  // cliente del patrón
  A(990.9, "img/ov025.jpg"),  // nunca para que te sueltes
  A(993.4, "img/ov005.jpg"),  // ese día te saliste del juego
  A(1003.8, "broll/os036.mp4"),// no lo ves en la tele ni la escuela
  A(1008.7, "img/ov005.jpg"), // un hombre con rebaño propio es libre
  A(1013.2, "img/ov117.jpg"), // los hombres libres no les convienen
  // PRIMEROS PASOS
  A(1016.3, "img/ov069.jpg"), // te dejo los primeros pasos
  A(1027.1, "broll/os022.mp4"),// primero, la tierra (campo tirado)
  // (process primeros pasos @1031.8)
  A(1039.3, "broll/os032.mp4"),// ofrecé limpiárselos
  A(1042.2, "img/ov127.jpg"), // no la compres, conseguila
  A(1044.7, "img/ov133.jpg"), // segundo, los animales
  A(1053.9, "img/ov137.jpg"), // la oveja más barata = animales viejos
  A(1058.9, "img/ov133.jpg"), // hembras jóvenes, hijas de mellizos
  A(1063.4, "img/ov061.jpg"), // esas hembras son tu fábrica
  A(1068.1, "img/ov099.jpg"), // se paga sola en un año
  A(1072.1, "img/ov097.jpg"), // tercero, el carnero
  // (stat carnero 50% @1076.7)
  A(1083.5, "img/ov098.jpg"), // no le pongas el más barato
  A(1085.6, "img/ov097.jpg"), // conseguite un buen dorper
  A(1093.6, "img/ov061.jpg"), // mejora el rebaño en una parición
  A(1099.3, "img/ov079.jpg"), // cuarto, el cerco
  A(1101.5, "broll/os025.mp4"),// alambre portátil + energizador a sol
  A(1110.8, "broll/os007.mp4"),// barato, lo armás vos solo
  A(1113.5, "img/ov085.jpg"), // es el corazón de todo
  A(1115.7, "img/ov117.jpg"), // quinto: aguantá
  A(1121.4, "img/ov101.jpg"), // los primeros dos años casi no vendas
  A(1124.3, "img/ov065.jpg"), // mirá crecer el rebaño
  A(1129.7, "img/ov103.jpg"), // dejá rodar la bola de nieve
  A(1131.9, "img/ov117.jpg"), // el que aguanta gana, siempre
  // CIERRE
  A(1135.3, "img/ov069.jpg"), // te resumo en una sola idea
  // (checklist @1140.5)
  A(1148, "img/ov049.jpg"),   // un animal que se multiplica, la reina
  A(1154, "img/ov103.jpg"),   // aguantar dos años
  A(1161, "broll/os006.mp4"), // movés los animales seguido
  A(1165.8, "img/ov123.jpg"), // sumás unas vacas
  A(1169.5, "img/ov067.jpg"), // el interés compuesto con patas
  A(1174.1, "broll/os047.mp4"),// parado en tu propio pedazo de tierra
  A(1180.8, "img/ov109.jpg"), // un rebaño que vale más que sueldos
  A(1185.5, "img/ov107.jpg"), // lo armaste vos, sin deberle a nadie
  A(1190.6, "broll/os026.mp4"),// esa es la libertad de verdad (pastor atardecer)
  A(1193.2, "img/ov023.jpg"), // no la del que reza para que le alcance
  A(1198.4, "img/ov109.jpg"), // un capital vivo
  A(1203.8, "img/ov067.jpg"), // pase lo que pase sigue ahí
  A(1210.1, "broll/os047.mp4"),// creciendo, esperándote
  A(1214.1, "img/ov015.jpg"), // no te lo quita ningún banco
  A(1221.2, "img/ov069.jpg"), // si llegaste hasta acá pensás distinto
  A(1225.9, "img/ov023.jpg"), // no te conformás con laburar para otro
  A(1230.3, "img/ov005.jpg"), // a ese tipo le hablo yo
  A(1235.8, "img/ov069.jpg"), // suscribite y tocá la campanita
  A(1240, "img/ov005.jpg"),   // seguir destapando esto
  A(1249.7, "img/ov107.jpg"), // animal por animal, sin permiso
  A(1256.8, "img/ov076.jpg"), // y la segunda
  A(1258.8, "img/ov075.jpg"), // andá a la descripción, fíjate si subí la guía
  A(1264, "img/ov076.jpg"),   // con todos los números y tiempos
  A(1272.8, "img/ov107.jpg"), // si el video llega lejos la suelto
  // (avatar full signoff 1281.2-fin)
];

// ── ensamblar: COMP + ANCH en una línea de tiempo, dur = hasta el próximo anchor ──
let id = 0;
const raw = ANCH.map((a) => ({ start: +a.start.toFixed(2), src: a.src, kind: "raw", hue: "amber" }));
const comps = COMP.map((c) => ({ ...c, start: +c.start.toFixed(2) }));
const all = [...raw, ...comps].sort((a, b) => a.start - b.start);
const beats = all.map((b, i) => {
  id++;
  const next = i + 1 < all.length ? all[i + 1].start : TOTAL;
  return { id: `b${id}`, start: b.start, dur: +(next - b.start).toFixed(2), ...b, key: undefined };
}).map(({ key, ...b }) => b);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/ovejas.json", JSON.stringify({ video: "ovejas", avatar: "ovejas_opt.mp4", clipsfirst: true, beats }, null, 2));

// ── avatar windows ──
const windows = [{ start: 0, mode: "full" }];
let cur = "full";
const push = (t, m) => { if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } };
push(AV[0][1], "hidden");
for (const [a, b] of AV.slice(1)) { push(a, "full"); if (b < TOTAL - 1e-6) push(b, "hidden"); }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_ovejas.gen.ts",
  `// avatar_ovejas.gen.ts — GENERADO por build_ovejas.mjs. NO editar.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_OVEJAS = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

const rawN = beats.filter((b) => b.kind === "raw").length;
const clipN = beats.filter((b) => b.kind === "raw" && b.src.startsWith("broll")).length;
console.log(`=== build_ovejas (anclaje por contenido) ===`);
console.log(`beats: ${beats.length} (raw ${rawN} [${clipN} clips + ${rawN - clipN} img] + comp ${comps.length})`);
console.log(`dur prom: ${(beats.reduce((a, b) => a + b.dur, 0) / beats.length).toFixed(1)}s`);
console.log(`→ beatsheet/ovejas.json · avatar_ovejas.gen.ts`);
