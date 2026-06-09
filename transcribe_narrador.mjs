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

console.log("Transcribing narrador (Spanish)...");
const whisperCppOutput = await transcribe({
  model: MODEL,
  whisperPath: to,
  whisperCppVersion: "1.5.5",
  inputPath: path.join(process.cwd(), "public", "narrador.wav"),
  tokenLevelTimestamps: true,
  language: "es",
});

const { captions } = toCaptions({ whisperCppOutput });
fs.writeFileSync(
  path.join(process.cwd(), "public", "captions_narrador.json"),
  JSON.stringify(captions, null, 2),
);
const plain = captions.map((c) => c.text).join("");
fs.writeFileSync(path.join(process.cwd(), "transcript_narrador.txt"), plain.trim());
console.log("\n=== TRANSCRIPT ===\n");
console.log(plain.trim());
console.log("\n=== DONE ===", captions.length, "tokens");
