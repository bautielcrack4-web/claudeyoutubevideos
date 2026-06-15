// gen_estafas.mjs — beatsheet/estafas.json (canal "Ben retirado", look ALARMA). Video 3:
// "Las estafas que vacían la cuenta de los jubilados". TEMA UNIVERSAL hispano (sin
// instituciones de un país: "el banco", "la policía", genérico). VISUAL-PRIMERO + sync
// milimétrico (captions ALINEADAS): KeyPhrase palabra-por-palabra + PNGs flotando +
// MistakeCard×8 (estafas) + ProtectionTool×6 (defensa) + journey/annotated/callout/bars.
import fs from "fs";

const IMPERF = "Como una foto real: imperfecciones, luz natural despareja, saturación baja, nada pulido, sin apariencia de IA.";
const P = (d) => `Foto documental realista, 16:9. ${d}. ${IMPERF}`;
const AV = "un hombre latino de unos 68 años, pelo gris, anteojos, camisa a cuadros, expresión cálida";
const PAV = (d) => P(`${AV}, ${d}, en su casa`);
const DP = (d) => `Crear una ILUSTRACIÓN tipo infografía/captura dibujada a mano profesional, 16:9 EXACTO (1792x1024), gráfico de noticias financiero ALTO CONTRASTE. Fondo casi NEGRO, líneas blancas, acentos ROJO alarma y AMARILLO/oro, VERDE solo para "a salvo". ${d}. Iconos y dibujos simples, flechas, MÍNIMO texto (1-4 palabras, español). DEJÁ LIBRE la esquina superior derecha para el avatar. Se entiende en 1 segundo, premium, dramático.`;
const PP = (d) => `${d}. Objeto AISLADO sobre FONDO TRANSPARENTE (PNG cutout, sin fondo, sin escenario), iluminación de estudio suave, sombra propia mínima, recorte limpio, estilo realista premium 3D/render limpio.`;

const HUES = ["red", "amber", "blue"];
const r = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const rav = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: PAV(prompt) }, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
const CLIPS = [];
const real = (name, concept, query, o = {}) => { if (!CLIPS.find((x) => x.name === name)) CLIPS.push({ name, concept, query, dur: o.dur || 5 }); return { t: "raw", name, broll: true, ...o }; };
const clip = (name, o = {}) => ({ t: "raw", name, broll: true, ...o });
const DIAGRAMS = [];
const dg = (name, desc) => { if (!DIAGRAMS.find((x) => x.name === name)) DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };
const D = (name, eyebrow, desc, at) => c("diagram", { eyebrow, slides: [{ image: dg(name, desc), eyebrow }], ...(at ? { at } : {}) });
const PROPS = [];
const prop = (name, desc) => { if (!PROPS.find((x) => x.name === name)) PROPS.push({ name, prompt: PP(desc) }); return `img/${name}.png`; };
// fotos reales (bing) para fondos de struct (callout/journey) — registra prompt
const RAWEXTRA = [];
const ri = (name, desc) => { if (!RAWEXTRA.find((x) => x.name === name)) RAWEXTRA.push({ name, prompt: P(desc) }); return `img/${name}.png`; };
let fpi = 0;
const FP_BG = ["ec_telefono", "ec_compu", "ec_dinero", "ec_anciano_tel", "ec_pareja", "ec_tarjeta", "ec_whatsapp", "ec_anciana_sola"];
const fp = (name, desc, o = {}) => { prop(name, desc); return c("floatprop", { src: `img/${name}.png`, ...o, bg: o.bg || `broll/${FP_BG[fpi++ % FP_BG.length]}.mp4` }); };
const kp = (text, o = {}) => c("keyphrase", { text, ...o });

const W = { raw: 1.25, keyphrase: 1.15, talk: 1.0, rule: 1.1, diagram: 1.7, floatprop: 1.4, mistake: 1.5, goldvault: 1.3, splitlist: 1.4, tool: 1.6, checklist: 1.5, action: 1.5, signature: 1.7, nextvideo: 1.4, statpills: 1.2, journey: 2.6, annotated: 1.7, callout: 1.6, bars: 1.6, process: 1.8 };

// clips usados solo como fondo (FP_BG) / relleno (FILLER) / fondo de KeyPhrase → registrarlos
real("ec_tarjeta", "a hand holding a bank card next to a phone", "hand bank card phone closeup");
real("ec_whatsapp", "a phone showing a chat messaging app conversation", "phone chat messaging app screen");

const SECTIONS = [
  // ════ HOOK (0:00–2:37) — MUY dinámico ════
  { key: "hook", phrase: null, start: 1.5, beats: [
    c("talk", {}),
    kp("Una *llamada* te puede vaciar la cuenta", { w: 0.5 }),
    real("ec_call_center", "a scam call center, people with headsets in an office", "scam call center headsets office", { w: 0.45, at: "alguien marcando telefonos" }),
    kp("No es un loco. Es un *negocio*.", { src: "broll/ec_call_center.mp4", w: 0.5, at: "no es un loco" }),
    c("statpills", { pills: ["MIEDO", "APURO"], slider: false, at: "miedo y apuro" }),
    c("annotated", { image: dg("dg_es_callid", "Pantalla de teléfono recibiendo una llamada, alto contraste, dramático. Texto simulado: 'Número desconocido', 'Llamada entrante'. Estilo alarma."), eyebrow: "Suena el teléfono", caption: "Así empieza, siempre", annotations: [
      { kind: "circle", x: 0.5, y: 0.3, w: 0.22, label: "DESCONOCIDO" } ], at: "leyendo un libreto" }),
    kp("No con un arma: con una *llamada amable*", { src: "broll/ec_anciano_tel.mp4", w: 0.5, at: "le roban con una llamada amable" }),
    real("ec_anciano_tel", "an older man on the phone looking worried at home", "elderly man worried phone call home", { w: 0.45 }),
    kp("No le pasa a los *tontos*. Le pasa a *cualquiera*.", { src: "img/es_medico_jub.png", w: 0.55, at: "no les pasa solo a los distraidos" }),
    r("es_medico_jub", "a retired doctor and a retired teacher, intelligent dignified seniors", { w: 0.5 }),
    kp("No ataca tu *cabeza*. Ataca tu *corazón*.", { src: "img/es_corazon.png", w: 0.55, at: "ataca su corazon" }),
    r("es_corazon", "an older person's hands over their heart, emotional, warm light", { w: 0.5 }),
    c("callout", { image: ri("es_mapa_hispano", "a world map highlighting Latin America and Spain, glowing dots over cities"), figure: "TODOS los países", caption: "México, Argentina, Colombia, España…", accent: "amber", at: "en todos los paises donde se habla espanol" }),
    c("goldvault", { state: "locked", label: "UNA REGLA", caption: "Una sola frase las detiene a todas — al final", at: "le voy a dar una sola regla" }),
    kp("Quédate hasta el *final*", { src: "broll/ec_dinero.mp4", w: 0.45, at: "quedese hasta el final" }),
  ]},
  // ════ BEN (2:37–2:56) ════
  { key: "benintro", phrase: "soy ben y yo", beats: [
    rav("es_ben_camara", "talking warmly to camera, serious and caring", { kicker: "Soy Ben, también jubilado", hold: true }),
    kp("Lo vi de cerca, con gente que *quiero*", { src: "img/es_ben_camara.png", w: 0.6, at: "con gente que quiero" }),
  ]},
  // ════ DON ALDO (2:56–5:22) — anécdota ════
  { key: "aldo", phrase: "tengo un amigo", beats: [
    c("rule", { number: "", title: "La tarde que llamó “el nieto”" }),
    r("es_aldo", "an older latino man, 74, ex truck driver, alert kind face, alone at home", { kicker: "Don Aldo, 74", hold: true }),
    kp("“A mí no me la *cuentan*”", { src: "img/es_aldo.png", w: 0.5, at: "no me la cuentan" }),
    real("ec_telefono", "an old landline phone ringing on a table, afternoon light", "old phone ringing table home", { w: 0.45, at: "le suena el telefono" }),
    kp("“Abuelo… tuve un *accidente*”", { src: "broll/ec_anciano_tel.mp4", w: 0.55, at: "tuve un accidente" }),
    kp("Era la voz de su *nieto*. Idéntica.", { src: "img/es_aldo.png", w: 0.55, at: "era la voz de su nieto" }),
    r("es_abogado", "a calm serious man in a suit on the phone, dim office, ominous", { w: 0.5, at: "se presento como abogado" }),
    kp("“Hay que pagar. *Rápido*. En efectivo.”", { src: "img/es_abogado.png", w: 0.55, at: "habia que pagar" }),
    real("ec_dinero", "older trembling hands counting cash bills", "elderly hands counting cash money", { w: 0.45, at: "junto todo el efectivo" }),
    // journey: la estafa minuto a minuto (dark)
    c("journey", { dark: true, eyebrow: "Cómo se desarmó, paso a paso", accent: "accent", waypoints: [
      { x: 0, y: 0, image: ri("es_j_telefono", "a ringing phone close-up, dramatic"), label: "Suena el teléfono", num: "1", dwell: 2.4, travel: 1.3 },
      { x: 1.3, y: -0.3, image: ri("es_j_llanto", "a crying young man on a phone, distress"), label: "“Soy yo, tuve un accidente”", num: "2", dwell: 2.5, travel: 1.4 },
      { x: 2.6, y: 0.3, image: ri("es_j_pago", "hands handing over a stack of cash, urgent"), label: "Pagó todo en una hora", num: "3", dwell: 2.5, travel: 1.4 },
      { x: 3.9, y: -0.2, image: ri("es_j_sano", "a young man laughing safe at home, healthy"), label: "El nieto estaba sano", num: "4", dwell: 2.7, travel: 1.3 } ] }),
    kp("Habló con un *estafador*. La voz era *idéntica*.", { src: "img/es_aldo.png", w: 0.6, at: "habia hablado con un estafador" }),
  ]},
  // ════ VOZ CLONADA (5:22–6:19) ════
  { key: "voz", phrase: "pueden copiar la voz", beats: [
    D("dg_es_voz", "La voz copiada", "Diagrama: unos segundos de audio (onda de sonido) de un video en redes entran a una computadora con un programa, y SALE una voz idéntica llamando por teléfono a un abuelo. Iconos: onda, computadora, teléfono. Flecha roja.", "pueden copiar la voz"),
    kp("Unos *segundos* de audio bastan", { src: "broll/ec_compu.mp4", w: 0.5, at: "unos segundos de grabacion" }),
    real("ec_compu", "a person typing on a computer in a dark room, screen glow", "person typing computer dark room", { w: 0.45, at: "la meten en un programa" }),
    kp("Ya no alcanza con *reconocer la voz*", { src: "broll/ec_compu.mp4", w: 0.55, at: "ya no alcanza con reconocer" }),
    r("es_aldo_triste", "an older man with a broken sad expression, looking down, regret", { w: 0.5, at: "con la voz rota" }),
    kp("“No fuiste un *tonto*. Te tendieron una *trampa*.”", { src: "img/es_aldo_triste.png", w: 0.6, at: "vos no fuiste un tonto" }),
  ]},
  // ════ DOÑA ROSA (6:40–8:15) ════
  { key: "rosa", phrase: "dona rosa una senora", beats: [
    r("es_rosa", "an older latina widow, sweet kind face, alone at home with a phone", { kicker: "Doña Rosa, viuda", hold: true }),
    real("ec_anciana_sola", "an elderly woman alone at home looking at her phone, lonely afternoon", "elderly woman alone phone lonely home", { w: 0.45, at: "los hijos lejos" }),
    kp("Las tardes *largas*. La casa en *silencio*.", { src: "broll/ec_anciana_sola.mp4", w: 0.55, at: "la casa en silencio" }),
    kp("Por fin alguien la *escuchaba*", { src: "img/es_rosa.png", w: 0.55, at: "le importaba" }),
    c("journey", { dark: true, eyebrow: "El “amor” de Doña Rosa, paso a paso", accent: "accent", waypoints: [
      { x: 0, y: 0, image: ri("es_jr_chat", "an older woman smiling at a sweet phone chat, hopeful"), label: "“Buenos días” todas las mañanas", num: "1", dwell: 2.4, travel: 1.3 },
      { x: 1.3, y: -0.3, image: ri("es_jr_meses", "a calendar pages turning, months of messages"), label: "Meses de cariño", num: "2", dwell: 2.4, travel: 1.4 },
      { x: 2.6, y: 0.3, image: ri("es_jr_pedido", "a phone message asking for money, an emergency"), label: "“Necesito que me mandes dinero”", num: "3", dwell: 2.5, travel: 1.4 },
      { x: 3.9, y: -0.2, image: ri("es_jr_borrado", "a deleted blank profile, vanished, empty"), label: "Desapareció. Nunca existió.", num: "4", dwell: 2.6, travel: 1.3 } ] }),
    fp("es_corazon_roto", "a broken heart with a chat speech bubble", { caption: "El amor que *no existía*", accent: "accent", scale: 0.6, at: "llego el pedido" }),
    kp("Un *libreto*. Para una mujer *sola*.", { src: "img/es_rosa.png", w: 0.6, at: "era un libreto" }),
  ]},
  // ════ BRIDGE (8:15–8:46) ════
  { key: "bridge", phrase: "le cuento estas dos", beats: [
    rav("es_ben_puertas", "explaining, two open doors metaphor, serious", { kicker: "Por ahí entra el estafador" }),
    c("splitlist", { title: "Las dos puertas", items: ["El miedo (una emergencia)", "La soledad (un cariño falso)"], palette: "D", at: "casi todas las puertas" }),
    kp("Conocer la trampa = *media defensa*", { src: "img/es_ben_puertas.png", w: 0.6, at: "conocer la trampa de antemano" }),
  ]},
  // ════ 8 ESTAFAS ════
  { key: "estafa1", phrase: "la primera es la", beats: [
    c("mistake", { number: "1", title: "El falso familiar en problemas", desc: "Emergencia + apuro + “no le digas a nadie”. Ahora con la voz copiada.", eyebrow: "ESTAFA" }),
    c("callout", { image: ri("es_call_panic", "an older person panicking on the phone, hand on forehead"), figure: "Emoción + Apuro + Secreto", caption: "“No le digas a nadie” = trampa", accent: "accent", at: "no le digas a nadie" }),
    kp("Dinero *urgente* y en *secreto*", { src: "broll/ec_anciano_tel.mp4", w: 0.5, at: "le piden dinero urgente y en secreto" }),
  ]},
  { key: "estafa2", phrase: "la segunda es la", beats: [
    c("mistake", { number: "2", title: "El falso banco", desc: "“Confirme su clave / pase su dinero a una cuenta segura.” El banco NUNCA pide eso.", eyebrow: "ESTAFA" }),
    c("annotated", { image: dg("dg_es_banco", "Captura de un mensaje/llamada falsa del banco en un teléfono, alto contraste. Texto simulado: 'Su Banco', 'movimiento sospechoso', 'confirme su clave', 'cuenta segura'."), eyebrow: "El mensaje del “banco”", caption: "Todo esto lo delata", annotations: [
      { kind: "circle", x: 0.5, y: 0.38, w: 0.16, label: "Pide tu CLAVE" },
      { kind: "arrow", x: 0.5, y: 0.66, fromX: 0.18, fromY: 0.85, label: "“Cuenta segura” = la de ELLOS" } ], at: "confirme su clave" }),
    kp("Ningún banco te pide la *clave* por teléfono", { src: "broll/ec_tarjeta.mp4", w: 0.55, at: "ningun banco del mundo" }),
    kp("Quien la pide es el *ladrón*", { src: "broll/ec_tarjeta.mp4", w: 0.5, at: "el que se lo pide es el ladron" }),
    c("splitlist", { title: "El banco de verdad…", items: ["NUNCA pide tu clave completa", "NUNCA te pasa a “otra cuenta”", "Vos llamás al dorso de la tarjeta"], palette: "D", cross: true, at: "asi de simple" }),
  ]},
  { key: "estafa3", phrase: "la tercera es la", beats: [
    c("mistake", { number: "3", title: "El premio o la herencia", desc: "“Ganó un sorteo / apareció una herencia. Pague un pequeño impuesto para recibirlo.”", eyebrow: "ESTAFA" }),
    fp("es_trofeo", "a fake golden prize trophy with a paper price tag", { caption: "Siempre hay una *condición*", accent: "amber", scale: 0.6, at: "siempre hay una condicion" }),
    c("callout", { image: ri("es_premio", "a fake lottery prize letter with confetti, too good to be true"), figure: "¿Pagar para COBRAR?", caption: "Jamás se paga para recibir dinero", accent: "accent", at: "jamas se paga dinero para recibir" }),
  ]},
  { key: "estafa4", phrase: "la cuarta es la", beats: [
    c("mistake", { number: "4", title: "El falso soporte técnico", desc: "“Su equipo tiene un virus, deme acceso / instale esto.” → entran a tu banco.", eyebrow: "ESTAFA" }),
    c("annotated", { image: dg("dg_es_virus", "Pantalla de computadora con un cartel de ALARMA rojo falso, alto contraste. Texto simulado: 'VIRUS DETECTADO', 'llame ya a este número'. Estilo popup de estafa."), eyebrow: "El cartel falso", caption: "Todo es para asustarte", annotations: [
      { kind: "circle", x: 0.5, y: 0.42, w: 0.22, label: "FALSO" },
      { kind: "underline", x: 0.5, y: 0.7, w: 0.28, label: "“llame ya”" } ], at: "un cartel rojo" }),
    c("callout", { image: ri("es_acceso", "a hand giving remote access to a computer, hacker silhouette behind"), figure: "DAME ACCESO", caption: "Si entran, te vacían el banco", accent: "accent", at: "que usted les permita entrar" }),
    kp("Nadie te llama por un *virus*", { src: "broll/ec_compu.mp4", w: 0.5, at: "ninguna empresa de tecnologia en el mundo" }),
  ]},
  { key: "estafa5", phrase: "la quinta es la", beats: [
    c("mistake", { number: "5", title: "El amor por internet", desc: "Compañía durante meses → una emergencia → pide dinero. Nunca se vieron en persona.", eyebrow: "ESTAFA" }),
    real("ec_anciana_sola", "an older person texting on a phone late at night, hopeful lonely", "older person texting phone night hopeful", { w: 0.45, at: "le da conversacion compania" }),
    c("callout", { image: ri("es_romance", "a phone with a romantic chat and a fake profile photo, hearts"), figure: "NUNCA en persona", caption: "Gana tu confianza… y pide dinero", accent: "accent", at: "nunca pudo verse con usted" }),
    c("splitlist", { title: "La señal del amor falso", items: ["Lo conociste por una pantalla", "Nunca se vieron en persona", "En algún momento pide dinero"], palette: "D", cross: true, at: "alguien que conocio por una pantalla" }),
  ]},
  { key: "estafa6", phrase: "la sexta es la", beats: [
    c("mistake", { number: "6", title: "El falso funcionario", desc: "“Tiene una deuda/multa, pague YA o lo detienen.” Pura amenaza para asustar.", eyebrow: "ESTAFA" }),
    c("callout", { image: ri("es_amenaza", "a phone showing a threatening official call, police badge, intimidating"), figure: "“PAGUE YA O…”", caption: "Ninguna autoridad amenaza por teléfono", accent: "accent", at: "lo van a detener" }),
    c("splitlist", { title: "La autoridad real…", items: ["Avisa por escrito, con tiempo", "No te amenaza con la cárcel", "Nunca exige pago inmediato"], palette: "D", cross: true, at: "las cosas serias llegan por escrito" }),
  ]},
  { key: "estafa7", phrase: "la septima es la", beats: [
    c("mistake", { number: "7", title: "“Hola mamá, cambié de número”", desc: "Mensaje de un número nuevo desconocido → enseguida pide una transferencia.", eyebrow: "ESTAFA" }),
    c("annotated", { image: dg("dg_es_whatsapp", "Captura simulada de un chat de mensajería en un teléfono, alto contraste. Burbujas: 'Hola mamá, soy yo', 'se me rompió el teléfono, este es mi número nuevo', 'necesito una transferencia urgente'. Número desconocido arriba."), eyebrow: "El mensaje del “hijo”", caption: "Número nuevo + apuro = alerta", annotations: [
      { kind: "circle", x: 0.5, y: 0.18, w: 0.2, label: "Número DESCONOCIDO" },
      { kind: "underline", x: 0.5, y: 0.74, w: 0.3, label: "“transferencia urgente”" } ], at: "este es mi numero nuevo" }),
    kp("Número nuevo → enseguida pide *plata*", { src: "broll/ec_whatsapp.mp4", w: 0.5, at: "enseguida le pide plata" }),
  ]},
  { key: "estafa8", phrase: "y la octava la", beats: [
    c("mistake", { number: "8", title: "La inversión milagrosa", desc: "“Duplicá tu jubilación.” Mucho, rápido y sin riesgo = mentira.", eyebrow: "ESTAFA" }),
    fp("es_grafico_falso", "a fake investment chart shooting up with crypto coins", { caption: "“Duplicá tu *jubilación*”", accent: "amber", scale: 0.7, at: "duplica tu jubilacion" }),
    c("bars", { eyebrow: "La promesa vs la realidad", title: "Si promete eso, es mentira", unit: "%", bars: [
      { label: "Inversión honesta", value: 6, sub: "al año, despacio", display: "~6%", tone: "good" },
      { label: "La “milagrosa”", value: 300, sub: "que te promete", display: "300%", winner: true } ], at: "es mentira" }),
    c("callout", { image: ri("es_plataforma", "a fake crypto investment platform on a screen that vanishes, empty"), figure: "Y un día… DESAPARECE", caption: "La plataforma y tu dinero, juntos", accent: "accent", at: "la plataforma desaparece" }),
    kp("El dinero honesto crece *despacio*", { src: "broll/ec_dinero.mp4", w: 0.5, at: "el dinero honesto crece despacio" }),
  ]},
  // ════ EL PATRÓN (15:02–15:53) ════
  { key: "patron", phrase: "ahora pare un segundo", beats: [
    rav("es_ben_patron", "explaining the key insight, pointing, intense", { kicker: "El patrón de TODAS", hold: true }),
    D("dg_es_patron", "Las 3 señales", "Diagrama de 3 íconos en fila con flechas hacia '= ESTAFA': 1) una cara asustada/corazón = EMOCIÓN, 2) un reloj = APURO, 3) un dedo en la boca shhh = SILENCIO. Rojo alarma.", "los mismos tres ingredientes"),
    kp("1. Te despiertan una *emoción* fuerte", { src: "broll/ec_anciano_tel.mp4", w: 0.5, at: "le despiertan una emocion fuerte" }),
    kp("2. Te *apuran*: tiene que ser YA", { src: "broll/ec_telefono.mp4", w: 0.5, at: "lo apuran tiene que ser ya" }),
    kp("3. Te *aíslan*: no le digas a nadie", { src: "broll/ec_anciana_sola.mp4", w: 0.5, at: "lo aislan no consultes" }),
    c("process", { eyebrow: "Cómo entra, siempre", title: "Los 3 ingredientes", steps: [
      { title: "Emoción", desc: "miedo o ilusión" },
      { title: "Apuro", desc: "tiene que ser YA" },
      { title: "Silencio", desc: "no le digas a nadie" } ], at: "el tercero lo aislan" }),
    c("splitlist", { title: "Las 3 juntas = estafa", items: ["Emoción (miedo o ilusión)", "Apuro (tiene que ser YA)", "Silencio (no le digas a nadie)"], palette: "D", cross: true, at: "emocion apuro y silencio" }),
    kp("No importa quién diga que es. Es *estafa*.", { src: "img/es_ben_patron.png", w: 0.55, at: "es una estafa punto" }),
  ]},
  // ════ CTA compartir (15:53–16:24) ════
  { key: "cta_share", phrase: "antes de seguir quiero", beats: [
    rav("es_ben_share", "warmly asking to share the video, caring hand gesture", { kicker: "Mandáselo a quien lo necesite" }),
    kp("Reenvíalo. Puede evitar el *peor día*", { src: "img/es_ben_share.png", w: 0.55, at: "le evita el peor dia" }),
  ]},
  // ════ CTA suscribir (16:24–17:11) ════
  { key: "cta_sub", phrase: "suscribase al canal", beats: [
    rav("es_ben_sub", "warmly inviting to subscribe, hand near chest", { kicker: "De jubilado a jubilado" }),
    kp("Lo más *importante* viene ahora", { src: "img/es_ben_sub.png", w: 0.55, at: "lo mas importante de todo el video" }),
  ]},
  // ════ LA REGLA (oro) (17:11–) ════
  { key: "regla", phrase: "cuando algo lo apura", beats: [
    c("goldvault", { state: "open", label: "LA REGLA", caption: "Cuando algo te apura, vos FRENÁS" }),
    kp("Cuando algo te *apura*, vos *frenás*", { src: "img/es_ben_camara.png", w: 0.6, at: "usted frena eso es toda la defensa" }),
    kp("Él necesita tu *miedo*. Vos, tu *calma*.", { src: "img/es_ben_camara.png", w: 0.6, at: "un segundo de miedo" }),
    c("process", { eyebrow: "Tu defensa, en pasos", title: "Fácil de recordar", steps: [
      { title: "Frená y colgá", desc: "ante cualquier pedido" },
      { title: "Verificá por otro camino", desc: "vos llamás" },
      { title: "Palabra clave familiar", desc: "le gana a la voz copiada" } ], at: "se lo bajo a pasos concretos" }),
    c("splitlist", { title: "Solo necesitás un minuto", items: ["Él trabaja con tu apuro", "Vos ganás con tu calma", "Un minuto frena cualquier estafa"], palette: "D", at: "regalarse un minuto de calma" }),
  ]},
  // 6 herramientas de defensa
  { key: "def1", phrase: "corte cuelgue no es", beats: [
    c("tool", { number: "1", nameEs: "Cortá. Colgá.", how: "Ante cualquier pedido de dinero o datos, cortá. No es mala educación, es defensa propia.", eyebrow: "Defensa" }),
    kp("Colgar NO es *mala educación*", { src: "broll/ec_telefono.mp4", w: 0.5, at: "no es de mala educacion" }),
    kp("El que se *enoja* porque colgás… es el *ladrón*", { src: "broll/ec_anciano_tel.mp4", w: 0.55, at: "el que se enoja porque usted cuelga" }),
  ]},
  { key: "def2", phrase: "verifique siempre por otro", beats: [
    c("tool", { number: "2", nameEs: "Verificá por otro camino", how: "Colgá y llamá VOS al número que ya tenés: tu nieto, tu banco. Nunca al que te dieron.", eyebrow: "Defensa" }),
    D("dg_es_verificar", "Verificá vos", "Diagrama: una persona cuelga una llamada sospechosa (X roja) y marca ELLA MISMA un número de confianza ya guardado (tilde verde). Flecha del camino seguro.", "lo llamo su nieto"),
    kp("Llamá VOS al número del *dorso de la tarjeta*", { src: "broll/ec_tarjeta.mp4", w: 0.5, at: "al numero que esta atras de su tarjeta" }),
    kp("Nunca al número que *ellos* te dieron", { src: "broll/ec_telefono.mp4", w: 0.5, at: "nunca jamas devuelva el llamado" }),
  ]},
  { key: "def3", phrase: "inventen una palabra clave", beats: [
    c("tool", { number: "3", nameEs: "Palabra clave familiar", nameEn: "Le gana a la voz copiada", how: "Acuerden una palabra secreta. Si un familiar pide dinero, preguntá la palabra. El estafador no la sabe.", eyebrow: "Defensa" }),
    kp("Junten a hijos y nietos *hoy mismo*", { src: "broll/ec_pareja.mp4", w: 0.5, at: "junte a sus hijos y nietos" }),
    fp("es_llave", "a golden key over a small family photo", { caption: "Girasol, el mate, el primer perro…", accent: "good", scale: 0.6, at: "acuerden una palabra secreta" }),
    kp("Le preguntás, tranquilo, *la palabra*", { src: "img/es_llave.png", w: 0.5, at: "usted le pregunta" }),
    kp("Aunque tenga la voz *idéntica*, no la sabe", { src: "broll/ec_telefono.mp4", w: 0.55, at: "aunque tenga la voz identica" }),
    kp("Una palabra y se cae *todo*", { src: "img/es_llave.png", w: 0.55, at: "una sola palabra y se le cae" }),
  ]},
  { key: "def4", phrase: "nunca bajo ninguna circunstancia", beats: [
    c("tool", { number: "4", nameEs: "Nunca des clave ni acceso", how: "Ni al banco, ni a la policía, ni a soporte. La gente honesta no te lo pide jamás.", eyebrow: "Defensa" }),
    kp("Ni *clave*, ni *contraseña*, ni *acceso*", { src: "broll/ec_compu.mp4", w: 0.5, at: "ni acceso a su computadora" }),
    kp("La gente *honesta* no te lo pide jamás", { src: "broll/ec_pareja.mp4", w: 0.5, at: "la gente honesta" }),
  ]},
  { key: "def5", phrase: "nunca pague para recibir", beats: [
    c("tool", { number: "5", nameEs: "Nunca pagues para recibir", how: "Premio, herencia, préstamo o trabajo: si hay que poner plata para cobrar, es mentira.", eyebrow: "Defensa" }),
    kp("Ni premios, ni herencias, ni *préstamos*", { src: "broll/ec_dinero.mp4", w: 0.5, at: "ni premios ni herencias" }),
    kp("¿Poner plata para *cobrar* plata? *Mentira*", { src: "broll/ec_dinero.mp4", w: 0.5, at: "si hay que poner plata para cobrar" }),
  ]},
  { key: "def6", phrase: "si le piden secreto", beats: [
    c("tool", { number: "6", nameEs: "Si te piden secreto, es estafa", how: "“No le digas a nadie” es la frase del ladrón. Hacé lo contrario: hablá, consultá, llamá.", eyebrow: "Defensa" }),
    kp("“No le digas a nadie” = la frase del *ladrón*", { src: "broll/ec_anciano_tel.mp4", w: 0.55, at: "no le digas a nadie es la frase" }),
    kp("Te exigen silencio → hacé lo *contrario*", { src: "broll/ec_pareja.mp4", w: 0.5, at: "cuando algo le exija silencio" }),
    kp("La estafa se muere a la *luz del día*", { src: "broll/ec_pareja.mp4", w: 0.55, at: "la estafa se muere a la luz" }),
    c("checklist", { title: "Tu defensa, en 6", items: [
      { text: "1. Cortá y colgá", state: "done" },
      { text: "2. Verificá por otro camino", state: "done" },
      { text: "3. Palabra clave familiar", state: "done" },
      { text: "4. Nunca clave ni acceso", state: "done" },
      { text: "5. Nunca pagues para recibir", state: "done" },
      { text: "6. Si piden secreto, es estafa", state: "done" } ], at: "y ahora le voy a decir algo" }),
  ]},
  // ════ SI YA CAÍSTE (20:26–) ════
  { key: "yacaiste", phrase: "que hace si esto", beats: [
    rav("es_ben_apoyo", "compassionate reassuring expression, no shame, kind", { kicker: "¿Ya te pasó? No es tu culpa.", hold: true }),
    kp("No es tu *culpa*. No te *avergüences*.", { src: "img/es_ben_apoyo.png", w: 0.6, at: "no es su culpa" }),
    kp("Le pasó a *Don Aldo*. A *Doña Rosa*. A *millones*.", { src: "img/es_aldo_triste.png", w: 0.55, at: "le paso a donaldo" }),
    kp("La *vergüenza* es lo que usan para que calles", { src: "broll/ec_anciana_sola.mp4", w: 0.55, at: "la verguenza es justamente" }),
    c("process", { eyebrow: "Si acaba de pasar, rápido", title: "Actuá ya", steps: [
      { title: "Llamá a tu banco", desc: "frenar / reportar" },
      { title: "Cambiá tus claves", desc: "todas" },
      { title: "Contalo", desc: "familia + denuncia" } ], at: "llame ya a su banco" }),
    c("checklist", { title: "Si caíste, hoy", items: [
      { text: "No te avergüences: te tendieron una trampa", state: "done" },
      { text: "Banco + claves, ya", state: "done" },
      { text: "Contalo: tu voz salva a otro", state: "done" } ], at: "salva a otro que estaba por caer" }),
    kp("El silencio protege al *ladrón*. Tu voz, a *los demás*.", { src: "broll/ec_pareja.mp4", w: 0.6, at: "el silencio protege al ladron" }),
  ]},
  // ════ PASO CONCRETO ════
  { key: "paso", phrase: "ahora le doy el paso", beats: [
    c("action", { eyebrow: "Hoy mismo", step: "Acordá la palabra clave familiar", question: "Si les llega un mensaje mío de un número nuevo pidiendo plata, llámenme antes de hacer nada." }),
    real("ec_pareja", "an older couple talking warmly with their adult children at home", "family talking together at home", { w: 0.5, at: "llame a su hijo o a su nieto" }),
    kp("“Llámenme *antes* de hacer nada”", { src: "broll/ec_pareja.mp4", w: 0.5, at: "llamenme antes de hacer nada" }),
    kp("Esa charla de 5 min vale más que una *cerradura*", { src: "broll/ec_pareja.mp4", w: 0.55, at: "vale mas que la cerradura" }),
    kp("No lo dejes para *mañana*. La estafa *no avisa*.", { src: "broll/ec_telefono.mp4", w: 0.55, at: "no lo deje para mañana" }),
    kp("Llega un *martes cualquiera*, a la siesta", { src: "broll/ec_anciano_tel.mp4", w: 0.5, at: "llega un martes cualquiera" }),
    kp("El preparado *cuelga y se ríe*. El otro, *pierde todo*.", { src: "broll/ec_dinero.mp4", w: 0.6, at: "el que esta preparado cuelga y hasta se rie" }),
    kp("La diferencia es haberlo *pensado antes*", { src: "img/es_ben_camara.png", w: 0.55, at: "la diferencia es haberlo pensado antes" }),
  ]},
  // ════ RECAP ════
  { key: "recap", phrase: "hagamos un repaso rapido", beats: [
    c("infzoom", { accent: "accent", images: [
      { src: "img/es_call_panic.png", label: "Falso nieto" },
      { src: "img/dg_es_banco.png", label: "Falso banco" },
      { src: "img/es_premio.png", label: "Premio / herencia" },
      { src: "img/es_acceso.png", label: "Soporte técnico" },
      { src: "img/es_romance.png", label: "Amor online" },
      { src: "img/es_amenaza.png", label: "Falso funcionario" },
      { src: "img/dg_es_whatsapp.png", label: "“Cambié de número”" },
      { src: "img/es_plataforma.png", label: "Inversión milagrosa" } ], at: "las estafas cambian de cara" }),
    c("splitlist", { title: "Las 8, una por una", items: ["Falso nieto", "Falso banco", "Premio / herencia", "Soporte técnico", "Amor online", "Falso funcionario", "“Cambié de número”", "Inversión milagrosa"], palette: "D", at: "el falso nieto el falso banco" }),
    c("checklist", { title: "Para no olvidar", items: [
      { text: "Toda estafa: emoción + apuro + secreto", state: "done" },
      { text: "Frená, colgá, verificá por tu cuenta", state: "done" },
      { text: "Palabra clave: le gana a la voz copiada", state: "done" },
      { text: "Nunca clave, acceso, ni pagar para recibir", state: "done" } ], at: "todas se caen con una sola cosa" }),
    kp("Frená, colgá y verificá por tu *propia cuenta*", { src: "broll/ec_telefono.mp4", w: 0.55, at: "usted frena cuelga y verifica" }),
    c("bars", { eyebrow: "La diferencia no es ser más vivo", title: "Es haberlo pensado antes", unit: "min", bars: [
      { label: "Calma que te salva", value: 1, sub: "un minuto", display: "1 min", tone: "good" },
      { label: "Perder todo", value: 10, sub: "si te apuran", display: "10 min", winner: true } ], at: "pierde todo en diez minutos" }),
    kp("La palabra clave le gana hasta a la *voz copiada*", { src: "broll/ec_telefono.mp4", w: 0.55, at: "le gana hasta a la voz copiada" }),
  ]},
  // ════ FIRMA ════
  { key: "firma", phrase: "el estafador trabaja con su", beats: [
    c("signature", { eyebrow: "Para llevarte", lines: [
      { text: "El estafador trabaja con tu apuro." }, { text: "Vos defendete" }, { text: "con tu calma.", gold: true } ] }),
    kp("Nadie honesto te exige decidir *en este segundo*", { src: "img/es_ben_camara.png", w: 0.55, at: "le va a exigir que decida" }),
    kp("El *apuro* es la huella de la *mentira*", { src: "img/es_ben_camara.png", w: 0.6, at: "el apuro es la huella" }),
  ]},
  // ════ EPÍLOGO + CTA final ════
  { key: "epi", phrase: "donaldo perdio esos ahorros", beats: [
    r("es_aldo_avisa", "the older man now warning his friends, sharing his story, dignified", { kicker: "Hoy Don Aldo avisa a todos", w: 0.7 }),
    kp("Hoy él es el *primero* que avisa a todos", { src: "img/es_aldo_avisa.png", w: 0.55, at: "el primero que les avisa" }),
    r("es_rosa_bien", "an older latina woman at peace, healed, dignified, warm light", { w: 0.6, at: "dona rosa tambien salio adelante" }),
    rav("es_ben_final", "warm curious final question to the viewer, kind smile", { kicker: "¿Ya tienen su palabra clave?", at: "tienen ya una palabra" }),
  ]},
  // ════ TEASE próximo ════
  { key: "tease", phrase: "hay algo que le saca", beats: [
    c("nextvideo", { kicker: "Próximo video", title: "Los gastos hormiga", sub: "Lo que te saca dinero todos los meses, en silencio — y cómo cortarlo en una sola tarde." }),
  ]},
  // ════ OUTRO ════
  { key: "outro", phrase: "cuidese cuide sus ahorros", beats: [
    rav("es_ben_outro", "warm goodbye, kind smile to camera", { hold: true, kicker: "Soy Ben, de Ben retirado" }),
  ]},
];

// ── ANCLAJE POR FRASE (captions ALINEADAS) ──
const CAP_PATH = fs.existsSync("public/captions_estafas_aligned.json") ? "public/captions_estafas_aligned.json" : "public/captions_estafas.json";
const CAPS = JSON.parse(fs.readFileSync(CAP_PATH, "utf8"));
console.log("captions:", CAP_PATH);
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let jx = 0; jx < p.length; jx++) if (CW[i + jx].t !== p[jx]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "keyphrase" && b.text ? b.text.replace(/\*/g, "") : null);
const findWords = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after - 0.5) continue;
    let ok = true; for (let jx = 0; jx < p.length; jx++) if (CW[i + jx].t !== p[jx]) { ok = false; break; }
    if (ok) return p.map((_, jx) => CW[i + jx].s);
  }
  return null;
};
const VIDEO_END = (CW[CW.length - 1]?.s || 1476) + 2;

let cursorSec = 0;
for (const s of SECTIONS) {
  if (s.start != null) { cursorSec = s.start; continue; }
  const ms = findMs(s.phrase, cursorSec + 1);
  if (ms == null) console.warn(`⚠ sección no anclada: "${s.phrase}" (${s.key})`);
  s.start = ms != null ? ms : cursorSec + 5;
  cursorSec = s.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.5);
    return ms != null && ms > start + 1 && ms < end - 1.2 ? Math.max(start + 0.5, ms - 0.3) : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.0) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i);
  fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) {
    const a = fixed[f], b = fixed[f + 1];
    const ta = pin[a], tb = b === n ? end : pin[b];
    let sw = 0; for (let i = a; i < b; i++) sw += ws[i];
    let acc = ta;
    for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); }
  }
  sec.beats.forEach((b, i) => {
    const cur = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    const dur = +(nextR - cur).toFixed(2);
    const id = `${sec.key}_${i}`;
    const hue = b.hue || HUES[(si + i) % HUES.length];
    const beat = { id, start: cur, dur };
    if (b.t === "raw") {
      beat.kind = "raw"; beat.src = b.broll ? `broll/${b.name}.mp4` : `img/${b.name}.png`;
      beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
      if (b.broll) beat.broll = true;
      if (b.gen) beat.gen = b.gen;
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cur; beat.dur = dur;
      delete beat.broll; delete beat.w; delete beat.at;
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind !== "journey" && !beat.hue) beat.hue = hue;
    }
    if (beat.kind === "keyphrase" && beat.text) {
      const wsx = findWords(beat.text.replace(/\*/g, ""), beat.start - 0.6);
      if (wsx) beat.times = wsx.map((s) => Math.max(0, Math.round((s - beat.start) * 30)));
    }
    beats.push(beat);
  });
}

// extraImages (struct images con _genImg) — para que make_bing/gpt los genere
const extraImgs = [];
const scan = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(scan); return; } if (o._genImg && o._prompt) extraImgs.push({ name: o._genImg, prompt: o._prompt }); for (const k of Object.keys(o)) scan(o[k]); };
SECTIONS.forEach((s) => s.beats.forEach(scan));
// las fotos REALES de struct (callout/journey/annotated via ri()) NO tienen `gen` en el
// beat → beatsheet.mjs no las ve. make_bing SÍ lee bs.extraImages → las metemos acá.
for (const e of RAWEXTRA) if (!extraImgs.find((x) => x.name === e.name)) extraImgs.push(e);
const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; for (const k of Object.keys(o)) strip(o[k]); };
beats.forEach(strip);

// romper beats largos: NINGÚN beat puede quedar estático demasiado tiempo. El primer
// tramo se queda en el beat original; el remanente se TROCEA en chunks de ~7.5s con
// clips reales rotando (densidad + nada estático). Vale para fotos, diagramas, todo.
const FILLER = ["ec_anciano_tel", "ec_compu", "ec_dinero", "ec_pareja", "ec_telefono", "ec_tarjeta", "ec_whatsapp", "ec_anciana_sola", "ec_call_center"];
const CHUNK = 7.5;
let fi = 0; const broken = [];
for (const b of beats) {
  broken.push(b);
  const cap = b.kind === "journey" ? 14 : b.kind === "diagram" ? 10.5 : b.kind === "raw" ? 9 : 8.5;
  if (b.dur > cap + 2.2) {
    let pos = +(b.start + cap).toFixed(2);
    const end = +(b.start + b.dur).toFixed(2);
    b.dur = cap;
    let k = 0;
    while (end - pos > 0.4) {
      const d = +Math.min(CHUNK, end - pos).toFixed(2);
      broken.push({ id: `${b.id}_f${k++}`, start: pos, dur: d, kind: "raw", broll: true, src: `broll/${FILLER[fi++ % FILLER.length]}.mp4`, hue: b.hue || "red" });
      pos = +(pos + d).toFixed(2);
    }
  }
}
beats.length = 0; beats.push(...broken);

// prompts de fotos REALES (bing): raw beats con gen (no dg_) + RAWEXTRA + extraImgs no-dg
const rawImgs = [];
for (const b of beats) if (b.kind === "raw" && b.gen && b.gen.name && !b.gen.name.startsWith("dg_")) if (!rawImgs.find((x) => x.name === b.gen.name)) rawImgs.push({ name: b.gen.name, prompt: b.gen.prompt });
for (const e of RAWEXTRA) if (!rawImgs.find((x) => x.name === e.name)) rawImgs.push(e);
for (const e of extraImgs) if (!e.name.startsWith("dg_") && !rawImgs.find((x) => x.name === e.name)) rawImgs.push(e);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/estafas.json", JSON.stringify({ video: "estafas", avatar: "estafas_opt.mp4", beats, extraImages: extraImgs }, null, 1));
fs.mkdirSync("public/img", { recursive: true }); fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/img/prompts_estafas.json", JSON.stringify(rawImgs, null, 2));
fs.writeFileSync("public/img/prompts_estafas_diag.json", JSON.stringify(DIAGRAMS.map((d) => ({ name: d.name, prompt: d.prompt })), null, 2));
fs.writeFileSync("public/img/prompts_estafas_props.json", JSON.stringify(PROPS.map((d) => ({ name: d.name, prompt: d.prompt, transparent: true })), null, 2));
fs.writeFileSync("public/broll/match_estafas.json", JSON.stringify(CLIPS, null, 1));

const rawN = beats.filter((b) => b.kind === "raw").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const long = beats.filter((b) => b.dur > 12).length;
console.log(`beats: ${beats.length} · raw: ${rawN} (${(100 * rawN / beats.length).toFixed(0)}%) · realImgs: ${rawImgs.length} · diag: ${DIAGRAMS.length} · props: ${PROPS.length} · clips: ${CLIPS.length} · dur: ${dur.toFixed(0)}s (${(dur / 60).toFixed(1)}min) · >12s: ${long}`);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log("kinds:", JSON.stringify(kinds));
