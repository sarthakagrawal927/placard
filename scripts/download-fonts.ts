// Downloads the Inter font weights placard renders with, into assets/fonts.
// Run once after clone / in CI before build:  npm run fonts
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "fonts");
const CDN = "https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files";

const WEIGHTS: [number, string][] = [
  [400, "Inter-400.woff"],
  [600, "Inter-600.woff"],
  [700, "Inter-700.woff"],
  [800, "Inter-800.woff"],
];

await mkdir(DIR, { recursive: true });
for (const [weight, out] of WEIGHTS) {
  const url = `${CDN}/inter-latin-${weight}-normal.woff`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(join(DIR, out), buf);
  console.log(`✓ ${out} (${(buf.length / 1024).toFixed(0)}KB)`);
}
console.log("Fonts ready in assets/fonts/");
