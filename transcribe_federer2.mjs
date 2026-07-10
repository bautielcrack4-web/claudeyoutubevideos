import path from "path";
import fs from "fs";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const to = path.join(process.cwd(), "whisper_cpu"); // separate from whisper.cpp (CUDA model lives there, unusable on this AMD-GPU machine)
const MODEL = "medium"; // multilingual — good Spanish accuracy

console.log("Installing whisper.cpp (CPU fallback, no NVIDIA GPU on this machine)...");
await installWhisperCpp({ to, version: "1.5.5" });

console.log(`Downloading model: ${MODEL}...`);
await downloadWhisperModel({ model: MODEL, folder: to });

console.log("Transcribing (Spanish)...");
const whisperCppOutput = await transcribe({
  model: MODEL,
  whisperPath: to,
  whisperCppVersion: "1.5.5",
  inputPath: path.join(process.cwd(), "public", "federer2_16k.wav"),
  tokenLevelTimestamps: true,
  language: "es",
});

const { captions } = toCaptions({ whisperCppOutput });

fs.writeFileSync(
  path.join(process.cwd(), "public", "captions_federer2.json"),
  JSON.stringify(captions, null, 2),
);

const plain = captions.map((c) => c.text).join("");
fs.writeFileSync(path.join(process.cwd(), "transcript_federer2.txt"), plain.trim());

console.log("\n=== TRANSCRIPT ===\n");
console.log(plain.trim());
console.log("\n=== DONE === captions_federer2.json written:", captions.length, "tokens");
