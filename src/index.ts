import { registerRoot } from "remotion";
// ── RAMA federer6-render: entry MÍNIMO (solo Federer6) para el farm — bundle limpio,
//    sin el baggage del Root grande. NO mergear a main.
import { RootFederer6 } from "./Root_federer6";

registerRoot(RootFederer6);
