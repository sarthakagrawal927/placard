import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { vbox, hbox, text } from "./h.js";
import { resolveTheme, FONT_FAMILY } from "./theme.js";
import { loadFonts } from "./fonts.js";
import { twoCol } from "./ui.js";
import { header } from "./sections/header.js";
import { stats as statsSection } from "./sections/stats.js";
import { fetchRepoStats, fetchCommitActivity, type RepoStats } from "./github.js";
import { animateSvg } from "./animate.js";
import { dependencies, dependenciesGraph } from "./sections/dependencies.js";
import { timeline } from "./sections/timeline.js";
import { products } from "./sections/products.js";
import { features } from "./sections/features.js";
import { roadmap } from "./sections/roadmap.js";
import type { El, ProjectConfig, Rendered, RenderOpts, Theme } from "./types.js";

type SatoriNode = Parameters<typeof satori>[0];
type SatoriFonts = Parameters<typeof satori>[1]["fonts"];

const PAD = 4; // tiny inset so 1px panel borders aren't clipped at the image edge

function buildTree(
  t: Theme,
  cfg: ProjectConfig,
  width: number,
  repoStats: RepoStats | null,
  activity: number[] | null,
  graph: boolean
): El {
  const prods = products(t, cfg);

  // Graph mode: full-width dependency graph + full-width products.
  // Default: dependencies (chips) and products share a two-column row.
  const depBlocks: (El | null)[] = graph
    ? [dependenciesGraph(t, cfg, width - 2 * PAD - 2 - 36), prods]
    : (() => {
        const deps = dependencies(t, cfg);
        return [deps && prods ? twoCol(deps, prods) : deps || prods];
      })();

  const sections = [
    header(t, cfg),
    repoStats ? statsSection(t, repoStats, activity) : null,
    timeline(t, cfg),
    ...depBlocks,
    features(t, cfg),
    roadmap(t, cfg),
  ].filter((s): s is El => Boolean(s));

  const footer = hbox(
    { marginTop: 4, alignItems: "center", justifyContent: "center", gap: 8 },
    text([cfg.updated && `Updated ${cfg.updated}`, "rendered by placard"].filter(Boolean).join("   ·   "), {
      fontSize: 12.5,
      color: t.subtle,
    })
  );

  // Themes with their own bg (midnight) paint a self-contained rounded card;
  // dark/light stay transparent so the gaps blend into the GitHub canvas.
  const outer = t.bg
    ? { width, padding: 24, gap: 12, backgroundImage: t.bg, borderRadius: 22, fontFamily: FONT_FAMILY }
    : { width, padding: PAD, paddingTop: 6, gap: 12, fontFamily: FONT_FAMILY };
  return vbox(outer, ...sections, footer);
}

export async function renderCard(cfg: ProjectConfig, opts: RenderOpts = {}): Promise<Rendered> {
  const { mode, width = 1100, format = "png", scale = 2, bg, animate = false, graph = false } = opts;
  // Explicit request (?theme=) wins so <picture> dark/light works; config
  // theme.mode is only the default when no mode is requested.
  const finalMode = mode || cfg.theme.mode || "dark";
  const t = resolveTheme(finalMode, cfg.theme.accent);
  const [repoStats, activity] =
    cfg.stats && cfg.github
      ? await Promise.all([
          fetchRepoStats(cfg.github.owner, cfg.github.repo),
          fetchCommitActivity(cfg.github.owner, cfg.github.repo),
        ])
      : [null, null];
  const tree = buildTree(t, cfg, width, repoStats, activity, graph || cfg.graph);
  const fonts = await loadFonts();
  const svg = await satori(tree as unknown as SatoriNode, { width, fonts: fonts as unknown as SatoriFonts });

  if (format === "svg") {
    return { body: animate ? animateSvg(svg) : svg, contentType: "image/svg+xml; charset=utf-8" };
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
