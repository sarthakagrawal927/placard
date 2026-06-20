import { h, vbox, hbox, text } from "../h.js";
import { box, tag, dot, iconTile } from "../ui.js";
import { icons } from "../icons.js";
import { dependencyGraphDataUrl } from "../graph.js";
import type { El, Item, ProjectConfig, Theme } from "../types.js";

const group = (t: Theme, label: string, color: string, items: Item[]): El | null =>
  items.length
    ? vbox(
        { gap: 10 },
        hbox({ alignItems: "center", gap: 7 }, dot(color, 7), text(label, { fontSize: 13, fontWeight: 600, color: t.muted })),
        hbox({ gap: 8, flexWrap: "wrap" }, ...items.map((d) => tag(t, d.label)))
      )
    : null;

export function dependencies(t: Theme, cfg: ProjectConfig): El | null {
  const { external, internal } = cfg.dependencies;
  const total = external.length + internal.length;
  if (!total) return null;
  return box(
    t,
    { title: "Dependencies", icon: iconTile(icons.package!({ size: 16, color: t.accent }), t.accent, t), count: total },
    vbox(
      { gap: 16 },
      group(t, "External", t.accent, external),
      group(t, "Internal", t.status.internal, internal)
    )
  );
}

// Full-width canvas dependency graph (opt-in via ?graph=1 / config graph:true).
// Falls back to the chip view if the graph can't be drawn.
export function dependenciesGraph(t: Theme, cfg: ProjectConfig, innerWidth: number): El | null {
  const { external, internal } = cfg.dependencies;
  const total = external.length + internal.length;
  if (!total) return null;

  const gw = innerWidth;
  const gh = Math.round(Math.min(360, Math.max(220, total * 26 + 140)));
  const dataUrl = dependencyGraphDataUrl(t, cfg, gw, gh);
  if (!dataUrl) return dependencies(t, cfg);

  return box(
    t,
    { title: "Dependencies", icon: iconTile(icons.package!({ size: 16, color: t.accent }), t.accent, t), count: total },
    h("img", { src: dataUrl, width: gw, height: gh, style: { display: "flex", borderRadius: 8 } }),
    hbox(
      { gap: 16, marginTop: 12 },
      external.length ? hbox({ alignItems: "center", gap: 6 }, dot(t.accent, 7), text("external", { fontSize: 12.5, color: t.muted })) : null,
      internal.length ? hbox({ alignItems: "center", gap: 6 }, dot(t.status.internal, 7), text("internal", { fontSize: 12.5, color: t.muted })) : null
    )
  );
}
