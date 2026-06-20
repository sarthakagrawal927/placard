import { vbox, hbox, text } from "../h";
import { box, tag, dot, iconTile } from "../ui";
import { icons } from "../icons";
import type { El, Item, ProjectConfig, Theme } from "../types";

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
