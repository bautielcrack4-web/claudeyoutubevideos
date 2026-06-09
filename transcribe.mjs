import path from "path";
import fs from "fs";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const to = path.join(process.cwd(), "whisper.cpp");
const MODEL = "medium"; // multilingual — good Spanish accuracy

console.log("Installing whisper.cpp...");
await installWhisperCpp({ to, version: "1.5.5" });

console.log(`Downloading model: ${MODEL}...`);
await downloadWhisperModel({ model: MODEL, folder: to });

console.log("Transcribing (Spanish)...");
const whisperCppOutput = await transcribe({
  model: MODEL,
  whisperPath: to,
  whisperCppVersion: "1.5.5",
  inputPath: path.join(process.cwd(), "public", "audio.wav"),
  tokenLevelTimestamps: true,
  language: "es",
});

const { captions } = toCaptions({ whisperCppOutput });

fs.writeFileSync(
  path.join(process.cwd(), "public", "captions.json"),
  JSON.stringify(captions, null, 2),
);

// Also write a plain readable transcript for review.
const plain = captions.map((c) => c.text).join("");
fs.writeFileSync(path.join(process.cwd(), "transcript.txt"), plain.trim());

console.log("\n=== TRANSCRIPT ===\n");
console.log(plain.trim());
console.log("\n=== DONE === captions.json written:", captions.length, "tokens");
