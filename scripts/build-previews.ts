// Pre-render static preview PNGs for the landing page so it loads instantly
// (no serverless render on page view). Run before deploy:  npm run preview
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { normalize } from "../lib/config.js";
import { renderCard } from "../lib/render.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cfg = normalize(JSON.parse(await readFile(join(root, "examples/saas-maker.json"), "utf8")));

for (const [mode, bg, out] of [
  ["dark", "#0d1117", "card-dark.png"],
  ["light", "#ffffff", "card-light.png"],
] as const) {
  const { body } = await renderCard(cfg, { mode, format: "png", bg });
  await writeFile(join(root, out), body);
  console.log(`✓ ${out}`);
}
console.log("Previews ready.");
