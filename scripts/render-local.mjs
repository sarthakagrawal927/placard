// Render a local project.json to PNG/SVG for visual iteration — no deploy needed.
// Usage: node scripts/render-local.mjs [path-to-json] [dark|light] [png|svg]
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { normalize } from "../lib/config.js";
import { renderCard } from "../lib/render.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [, , file = "examples/saas-maker.json", mode = "dark", format = "png"] = process.argv;

const cfg = normalize(JSON.parse(await readFile(join(root, file), "utf8")));
// Composite onto GitHub's real canvas color so the local preview matches how it
// looks embedded in a README (production PNG stays transparent).
const bg = format === "png" ? (mode === "light" ? "#ffffff" : "#0d1117") : undefined;
const { body, contentType } = await renderCard(cfg, { mode, format, bg });

await mkdir(join(root, "out"), { recursive: true });
const ext = format === "svg" ? "svg" : "png";
const outPath = join(root, "out", `${mode}.${ext}`);
await writeFile(outPath, body);
console.log(`✓ ${contentType} -> ${outPath}`);
