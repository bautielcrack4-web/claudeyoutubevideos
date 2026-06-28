// build_ovejas_imgs.mjs — emite TODOS los prompts del video micro-rancho en ORDEN del guion,
// uno por línea, sin títulos ni divisiones (prompts_ovejas_all.txt) para generar a mano.
// Fórmula larga (foto de celu real) + PERSONAJE consistente auto-agregado en escenas char:1.
// Uso: node build_ovejas_imgs.mjs
import fs from "fs";

const CHAR = "The man is a 50-year-old Amish farmer with a long grey-and-brown FULL BEARD AND NO MUSTACHE (Amish style), a wide-brim straw hat, a light blue button work shirt and dark navy suspenders, weathered tanned face. Keep his face and look consistent.";
const PRE = "Very believable casual smartphone photo, not cinematic, not polished, not stylized. ";
const IMP = " Important: make the image feel like a plain real phone photo, not a visually impressive AI image. Use flat natural light, muted slightly desaturated colors, low contrast, subtle digital noise, slight exposure imperfections, natural skin texture, realistic hands, and a casual slightly awkward composition. Keep more of the scene visible and integrated. The image should feel believable, modest, and unprocessed.";
const AVO = " Avoid cinematic color grading, dramatic lighting, perfect framing, heavy background blur, glossy skin, fake HDR, hyper-detailed textures, render look, epic atmosphere, text, watermark, or logos.";
const mk = (scene, char) => PRE + scene + (char ? " " + CHAR : "") + IMP + AVO;

// [escena, char?] — EN ORDEN DEL GUION, cada micro-frase. char:1 = aparece el avatar.
const S = [
  // — Hook: 2500 → 225k, casa hija, jefe, banco —
  ["weathered hands holding a small stack of worn cash dollar bills over a wooden table", 0],
  ["a few black-headed Dorper sheep standing in a plain dirt pen, ordinary", 0],
  ["a man standing proudly in front of a large flock of sheep spread across a green pasture", 1],
  ["a man and his adult daughter hugging in front of a half-built simple wooden house, raw lumber and a cement bag around, work clothes", 1],
  ["wide shot of the same half-built simple house with stacks of lumber and a wheelbarrow", 0],
  ["a simple finished modest single-story country house in a rural lot with patchy grass and an old fence", 0],
  ["a man talking seriously to his boss inside a cluttered small workshop office, the boss seated at a messy desk", 1],
  ["a plain small-town bank building seen from across the street on an ordinary grey day", 0],
  ["close-up of a black-headed Dorper sheep looking calmly at the camera in a field", 0],
  ["a man crouched in a pasture resting a hand on a sheep, quiet determined face", 1],
  ["a man at dawn carrying a bucket through a misty field toward his sheep", 1],
  ["a tired worker in plain clothes on a crowded bus at grey dawn, looking out the window", 0],
  ["an empty office chair and a punch-clock on a drab wall, the daily grind", 0],
  ["a man standing alone in a field at sunrise with a serious resolved expression", 1],
  ["a ewe with two newborn lambs standing close to her in green grass", 0],
  ["lambs jumping and playing in a paddock early morning", 0],
  ["a man looking straight at the camera with a plain, slightly angry serious expression, on a farm", 1],
  ["a huge modern green tractor and a giant industrial barn on a flat endless field, cold and impersonal", 0],
  ["rows of identical industrial livestock sheds, sterile and corporate", 0],
  ["a man shaking his head, plain skeptical look, standing by a wooden fence", 1],
  ["a steaming mate gourd with a metal straw on a rough weathered wooden table", 0],
  // — ¿Qué animal? vacas vs oveja de pelo —
  ["a couple of cows standing in a muddy field eating a big pile of hay", 0],
  ["one single cow alone in a large empty pasture, lots of unused space", 0],
  ["a cow with one single calf in a plain field", 0],
  ["close-up of a hardy black-headed Dorper sheep with a smooth hair coat, not wool, in a plain field", 0],
  ["a man holding and inspecting a Dorper sheep, showing its hair coat", 1],
  ["a Dorper sheep naturally shedding its hair coat in spring, loose patches of hair", 0],
  ["fresh cuts of lamb meat on plain butcher paper on a wooden kitchen table", 0],
  ["a simple roadside farm stand selling lamb meat, handwritten cardboard, ordinary", 0],
  // — Reproducción / multiplicación —
  ["a ewe nursing two twin lambs in a grassy paddock", 0],
  ["several ewes each with twin lambs scattered across a green field", 0],
  ["a small flock of about ten ewes with many lambs in a paddock", 0],
  ["a noticeably bigger flock of sheep filling a larger paddock", 0],
  ["a large healthy flock of sheep covering an entire green hillside", 0],
  ["a man leaning on a fence watching a big flock graze, calm and proud", 1],
  ["close-up of a hand writing tally numbers in a worn farm notebook on a table", 0],
  // — Tease de la guía (él hablando, honesto) —
  ["a man sitting at a plain kitchen table at night with a thick handwritten notebook and a lamp, thoughtful", 1],
  ["close-up of a worn handwritten guide or notebook full of notes, diagrams of paddocks and numbers", 0],
  ["a man looking at the camera with a serious, slightly hesitant honest expression, indoors", 1],
  // — Método: pastoreo rotativo —
  ["a wide green pasture divided into small sections by thin portable electric fence lines", 0],
  ["a tight bunch of sheep grazing a small fenced strip of pasture down to the ground", 0],
  ["a man moving a lightweight portable electric fence to open the next strip of pasture", 1],
  ["sheep stepping into a fresh green strip of grass, eager", 0],
  ["a grazed-down dusty strip of pasture right next to a tall lush green strip, clear contrast", 0],
  ["a regrown lush green paddock that had been grazed weeks earlier, thick and healthy", 0],
  ["close-up of dark rich soil with fresh green shoots and sheep droppings as natural fertilizer", 0],
  ["a small fenced paddock packed with many sheep, high density on little land", 0],
  // — Matemática del rebaño —
  ["weathered hands counting cash next to a small group of ewes and a ram in a pen", 1],
  ["a ram, a sturdy big Dorper ram standing in a pen", 0],
  ["about a dozen ewes with their first lambs in a modest paddock", 0],
  ["a man choosing not to sell, keeping young female lambs, gently moving them with the flock", 1],
  ["a snowball metaphor: a flock visibly bigger each season across three side fields", 0],
  ["a man loading a few lambs into a small trailer to sell, the rest of the flock behind", 1],
  ["weathered hands holding a thick fan of cash bills out in the field with sheep behind", 1],
  ["a big flock grazing peacefully, a living growing capital", 0],
  // — El error: el apuro —
  ["a frustrated man looking at an almost empty pen with only a couple of sheep left, regret", 1],
  ["someone hastily selling off young female lambs at a market, a mistake", 0],
  ["a tiny tree sapling pulled out of the ground by impatient hands", 0],
  ["a calm patient older man watching his growing flock with his arms crossed, wise", 1],
  // — Animal extra: pastoreo mixto —
  ["sheep grazing low short grass close to the ground in a paddock", 0],
  ["cows grazing tall grass and weeds and brush in the same field", 0],
  ["cows and sheep grazing together in the same green paddock, mixed herd", 0],
  ["a healthy clean pasture with both cattle and sheep, nothing wasted", 0],
  // — Objeciones —
  ["a man shaking hands with a neighbor at the edge of an unused weedy field, making a deal", 1],
  ["a neglected overgrown empty field with an old fence, abandoned and unused", 0],
  ["just three or four sheep and a ram in a very small starter pen, humble beginning", 0],
  ["a young Dorper ewe, healthy and sturdy, close up in a field", 0],
  ["a single robust Dorper sheep standing strong in rain and mud, resilient", 0],
  ["crowded sheep stuck in a muddy pen, the wrong way, dirty", 0],
  ["clean healthy sheep on fresh green grass, the right way", 0],
  ["a man giving basic care to a sheep, simple syringe and minerals, plain barn", 1],
  // — La historia del muchacho —
  ["a worried young man in plain clothes standing in a humble kitchen, money troubles", 0],
  ["a young man shaking hands with an old landowner at the gate of a weedy abandoned field", 0],
  ["a young man unloading eight sheep and one ram from a small trailer into a rough field", 0],
  ["a young man lying awake at night, worried, dim bedroom", 0],
  ["a young man in a field with about twenty-five sheep a year later, hopeful", 0],
  ["townspeople chatting and smirking, doubting, in a small rural town street", 0],
  ["a young man surrounded by a flock of over a hundred sheep in a now-green field, proud", 0],
  ["a young man selling lambs from a small trailer to a local buyer, cash in hand", 0],
  ["a once-abandoned field now the greenest lush pasture in the area, transformed", 0],
  // — Por qué funciona ahora / sistema —
  ["a family at a plain table eating a healthy roast lamb dinner, wholesome", 0],
  ["a butcher shop counter with a sign for grass-fed lamb, ordinary", 0],
  ["a farmer handing a wrapped cut of meat directly to a neighbor at a doorstep, cash exchange", 1],
  ["a credit card and a stack of bills on a table, debt trap, cold", 0],
  ["a crowded supermarket aisle with expensive packaged meat, impersonal", 0],
  ["a man standing free and confident in his own pasture at golden evening, independent", 1],
  // — Primeros pasos —
  ["a man asking around, talking to a neighbor by a pickup truck about renting land", 1],
  ["healthy young ewes being inspected and chosen at a small farm", 0],
  ["a big strong well-bred Dorper ram standing out among the flock, the best animal", 0],
  ["a simple portable electric fence kit with a small solar energizer on a battery, laid out", 0],
  ["a man setting up the first small paddock with portable fence posts and wire", 1],
  ["a hand writing entry and exit dates of paddocks in a small field notebook", 0],
  ["a man patiently watching his slowly growing flock, resisting selling, calm", 1],
  // — Cierre / libertad —
  ["a man standing on his own piece of land at sunset looking at his large flock, fulfilled", 1],
  ["a peaceful flock of sheep grazing on a green hill in soft evening light", 0],
  ["a humble family standing together in front of their modest house and land, content", 0],
  ["a man looking directly at the camera, warm and resolute, on his farm", 1],
];

const VARI = ["", ", seen from a slightly different angle", ", a wider shot showing more of the place"];
const lines = [];
for (let i = 0; i < S.length; i++) {
  const [scene, char] = S[i];
  for (let v = 0; v < 2; v++) lines.push(mk(scene + VARI[v], char));
}
fs.writeFileSync("prompts_ovejas_all.txt", lines.join("\n\n"));
console.log(`prompts_ovejas_all.txt: ${lines.length} prompts (en orden del guion) · ${S.filter((s) => s[1]).length} escenas con el avatar`);
