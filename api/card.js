import { loadConfig, ConfigError } from "../lib/config.js";
import { renderCard } from "../lib/render.js";
import { renderError } from "../lib/error-card.js";

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const q = url.searchParams;
  const format = q.get("format") === "svg" ? "svg" : "png";
  const themeParam = q.get("theme");
  // undefined => fall back to the project's configured default mode
  const mode = themeParam === "light" ? "light" : themeParam === "dark" ? "dark" : undefined;
  const width = clamp(parseInt(q.get("width"), 10) || 1100, 600, 1600);

  try {
    const cfg = await loadConfig(q.get("src"));
    const { body, contentType } = await renderCard(cfg, { mode, width, format });
    res.setHeader("Content-Type", contentType);
    // Camo caches aggressively; keep edge fresh-ish without hammering the source.
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=86400");
    res.status(200).send(body);
  } catch (err) {
    const isCfg = err instanceof ConfigError;
    const { body, contentType } = await renderError(
      isCfg ? err.message : "Render failed — check your project.json",
      { mode, format }
    );
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    // Must be 200: <img>/Camo won't render a non-200 response, so a styled
    // error card needs a 200 to be visible in a README at all.
    res.status(200).send(body);
  }
}
