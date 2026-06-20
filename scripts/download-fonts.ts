// Downloads the fonts placard renders with, into assets/fonts.
// Inter = body/labels, Hanken Grotesk = display (title, headings, big numbers).
// Run once after clone / in CI before build:  npm run fonts
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "fonts");
const CDN = "https://cdn.jsdelivr.net/npm/@fontsource";

const FILES: [string, string][] = [
  // [jsDelivr file path, output filename]
  ["inter@5/files/inter-latin-400-normal.woff", "Inter-400.woff"],
  ["inter@5/files/inter-latin-600-normal.woff", "Inter-600.woff"],
  ["inter@5/files/inter-latin-700-normal.woff", "Inter-700.woff"],
  ["inter@5/files/inter-latin-800-normal.woff", "Inter-800.woff"],
  ["hanken-grotesk@5/files/hanken-grotesk-latin-600-normal.woff", "Hanken-600.woff"],
  ["hanken-grotesk@5/files/hanken-grotesk-latin-700-normal.woff", "Hanken-700.woff"],
  ["hanken-grotesk@5/files/hanken-grotesk-latin-800-normal.woff", "Hanken-800.woff"],
];

await mkdir(DIR, { recursive: true });
for (const [path, out] of FILES) {
  const res = await fetch(`${CDN}/${path}`);
  if (!res.ok) throw new Error(`Failed ${path}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(join(DIR, out), buf);
  console.log(`✓ ${out} (${(buf.length / 1024).toFixed(0)}KB)`);
}
console.log("Fonts ready in assets/fonts/");
