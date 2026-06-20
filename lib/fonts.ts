import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export interface FontData {
  name: string;
  data: Buffer;
  weight: number;
  style: "normal";
}

// Fonts satori uses (Inter = body, Hanken Grotesk = display). Bundled in
// assets/fonts (see scripts/download-fonts.ts). Loaded once per process.
const FILES: { file: string; weight: number; name: string }[] = [
  { file: "Inter-400.woff", weight: 400, name: "Inter" },
  { file: "Inter-600.woff", weight: 600, name: "Inter" },
  { file: "Inter-700.woff", weight: 700, name: "Inter" },
  { file: "Inter-800.woff", weight: 800, name: "Inter" },
  { file: "Hanken-600.woff", weight: 600, name: "Hanken Grotesk" },
  { file: "Hanken-700.woff", weight: 700, name: "Hanken Grotesk" },
  { file: "Hanken-800.woff", weight: 800, name: "Hanken Grotesk" },
];

// Resolve assets/fonts robustly. When run locally the path is relative to this
// file; on Vercel the .ts function is bundled (import.meta.url moves) and
// includeFiles drops the fonts at the task root (process.cwd()).
export function fontsDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(process.cwd(), "assets", "fonts"),
    join(here, "..", "assets", "fonts"),
    join(here, "..", "..", "assets", "fonts"),
  ];
  return candidates.find((d) => existsSync(join(d, FILES[0]!.file))) ?? candidates[0]!;
}

let cache: FontData[] | undefined;

export async function loadFonts(): Promise<FontData[]> {
  if (cache) return cache;
  const dir = fontsDir();
  cache = await Promise.all(
    FILES.map(async ({ file, weight, name }) => ({
      name,
      data: await readFile(join(dir, file)),
      weight,
      style: "normal" as const,
    }))
  );
  return cache;
}
