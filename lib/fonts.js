import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "fonts");

// Inter weights satori will use. Files are bundled in assets/fonts (see
// scripts/download-fonts.mjs). Loaded once per process (warm function reuse).
const FILES = [
  { file: "Inter-400.woff", weight: 400 },
  { file: "Inter-600.woff", weight: 600 },
  { file: "Inter-700.woff", weight: 700 },
  { file: "Inter-800.woff", weight: 800 },
];

let cache;

export async function loadFonts() {
  if (cache) return cache;
  cache = await Promise.all(
    FILES.map(async ({ file, weight }) => ({
      name: "Inter",
      data: await readFile(join(DIR, file)),
      weight,
      style: "normal",
    }))
  );
  return cache;
}
