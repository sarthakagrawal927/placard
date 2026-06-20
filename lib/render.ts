import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { vbox, hbox, text } from "./h.js";
import { resolveTheme, FONT_FAMILY } from "./theme.js";
import { loadFonts } from "./fonts.js";
import { twoCol } from "./ui.js";
import { header } from "./sections/header.js";
import { dependencies } from "./sections/dependencies.js";
import { timeline } from "./sections/timeline.js";
import { products } from "./sections/products.js";
import { features } from "./sections/features.js";
import { roadmap } from "./sections/roadmap.js";
import type { El, ProjectConfig, Rendered, RenderOpts, Theme } from "./types.js";

type SatoriNode = Parameters<typeof satori>[0];
type SatoriFonts = Parameters<typeof satori>[1]["fonts"];

const PAD = 4; // tiny inset so 1px panel borders aren't clipped at the image edge

function buildTree(t: Theme, cfg: ProjectConfig, width: number): El {
  const deps = dependencies(t, cfg);
  const prods = products(t, cfg);

  // dependencies + products share a row when both exist; otherwise full width.
  const depRow = deps && prods ? twoCol(deps, prods) : deps || prods;

  const sections = [header(t, cfg), timeline(t, cfg), depRow, features(t, cfg), roadmap(t, cfg)].filter(
    (s): s is El => Boolean(s)
  );

  const footer = hbox(
    { marginTop: 4, alignItems: "center", justifyContent: "center", gap: 8 },
    text([cfg.updated && `Updated ${cfg.updated}`, "rendered by placard"].filter(Boolean).join("   ·   "), {
      fontSize: 12.5,
      color: t.subtle,
    })
  );

  // Transparent outer: the gaps show the viewer's real GitHub canvas, so the
  // card blends into any theme (dark / dimmed / light / high-contrast).
  return vbox({ width, padding: PAD, paddingTop: 6, gap: 12, fontFamily: FONT_FAMILY }, ...sections, footer);
}

export async function renderCard(cfg: ProjectConfig, opts: RenderOpts = {}): Promise<Rendered> {
  const { mode, width = 1100, format = "png", scale = 2, bg } = opts;
  // Explicit request (?theme=) wins so <picture> dark/light works; config
  // theme.mode is only the default when no mode is requested.
  const finalMode = mode || cfg.theme.mode || "dark";
  const t = resolveTheme(finalMode, cfg.theme.accent);
  const tree = buildTree(t, cfg, width);
  const fonts = await loadFonts();
  const svg = await satori(tree as unknown as SatoriNode, { width, fonts: fonts as unknown as SatoriFonts });

  if (format === "svg") {
    return { body: svg, contentType: "image/svg+xml; charset=utf-8" };
  }
  // Production output is transparent (blends into any GitHub theme). `bg` is a
  // preview-only flag to composite onto a known canvas color for eyeballing.
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: Math.round(width * scale) },
    ...(bg ? { background: bg } : {}),
  });
  const png = resvg.render().asPng();
  return { body: png, contentType: "image/png" };
}
