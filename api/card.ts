import { loadConfig, loadConfigFromData, ConfigError } from "../lib/config.js";
import { renderCard } from "../lib/render.js";
import { renderError } from "../lib/error-card.js";
import type { Format, Req, Res, ThemeMode } from "../lib/types.js";

const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, n));

export default async function handler(req: Req, res: Res): Promise<void> {
  const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
  const q = url.searchParams;
  // animate implies SVG (PNG can't carry declarative animation).
  const animate = q.get("animate") === "1";
  const graph = q.get("graph") === "1";
  const format: Format = animate || q.get("format") === "svg" ? "svg" : "png";
  const themeParam = q.get("theme");
  // undefined => fall back to the project's configured default mode
  const mode: ThemeMode | undefined = themeParam === "light" ? "light" : themeParam === "dark" ? "dark" : undefined;
  const width = clamp(parseInt(q.get("width") || "", 10) || 1100, 600, 1600);

  try {
    const data = q.get("data");
    const cfg = data ? loadConfigFromData(data) : await loadConfig(q.get("src"));
    const { body, contentType } = await renderCard(cfg, { mode, width, format, animate, graph });
    res.setHeader("Content-Type", contentType);
    // Cache hard at the edge for speed; bump the embed's &v= param to force a
    // fresh render during iteration (changes the URL -> new cache key + new Camo).
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=604800, stale-while-revalidate=604800");
    res.status(200).send(body);
  } catch (err) {
    const isCfg = err instanceof ConfigError;
    const { body, contentType } = await renderError(
      isCfg ? (err as ConfigError).message : "Render failed — check your project.json",
      { mode, format }
    );
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    // Must be 200: <img>/Camo won't render a non-200 response, so a styled
    // error card needs a 200 to be visible in a README at all.
    res.status(200).send(body);
  }
}
