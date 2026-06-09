import path from "path";
import fs from "fs";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const to = path.join(process.cwd(), "whisper.cpp");
const MODEL = "medium";

await installWhisperCpp({ to, version: "1.5.5" });
await downloadWhisperModel({ model: MODEL, folder: to });

console.log("Transcribing termitas (Spanish)...");
const whisperCppOutput = await transcribe({
  model: MODEL,
  whisperPath: to,
  whisperCppVersion: "1.5.5",
  inputPath: path.join(process.cwd(), "public", "termitas.wav"),
  tokenLevelTimestamps: true,
  language: "es",
});

const { captions } = toCaptions({ whisperCppOutput });
fs.writeFileSync(
  path.join(process.cwd(), "public", "captions_termitas.json"),
  JSON.stringify(captions, null, 2),
);

const plain = captions.map((c) => c.text).join("");
fs.writeFileSync(path.join(process.cwd(), "transcript_termitas.txt"), plain.trim());

const fmt = (ms) => {
  const s = ms / 1000;
  const m = Math.floor(s / 60);
  const r = (s - m * 60).toFixed(2).padStart(5, "0");
  return `${String(m).padStart(2, "0")}:${r}`;
};
const timed = captions.map((c) => `[${fmt(c.startMs)}] ${c.text}`).join("\n");
fs.writeFileSync(path.join(process.cwd(), "transcript_termitas_timed.txt"), timed);

console.log("\n=== DONE ===", captions.length, "tokens");
