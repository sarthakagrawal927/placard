// Pre-render static preview PNGs for the landing page so it loads instantly
// (no serverless render on page view). Run before deploy:  npm run preview
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { normalize } from "../lib/config.js";
import { renderCard } from "../lib/render.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const load = async (f: string) => normalize(JSON.parse(await readFile(join(root, f), "utf8")));

// Landing hero = placard's own (trimmed, midnight) card. dark/light demos use
// the fuller saas-maker example.
const placard = await load("project.json");
const demo = await load("examples/saas-maker.json");

const jobs = [
  { cfg: placard, mode: "midnight", bg: "#0b1326", out: "card-midnight.png", graph: false },
  { cfg: demo, mode: "dark", bg: "#0d1117", out: "card-dark.png", graph: true },
  { cfg: demo, mode: "light", bg: "#ffffff", out: "card-light.png", graph: true },
] as const;

for (const { cfg, mode, bg, out, graph } of jobs) {
  const { body } = await renderCard(cfg, { mode, format: "png", bg, graph });
  await writeFile(join(root, out), body);
  console.log(`✓ ${out}`);
}
console.log("Previews ready.");
