import { registerRoot } from "remotion";
// ── RAMA federer4-render: entry MÍNIMO (solo Federer4) para el farm — bundle limpio,
//    sin el baggage del Root grande. NO mergear a main.
import { RootFederer4 } from "./Root_federer4";

registerRoot(RootFederer4);
