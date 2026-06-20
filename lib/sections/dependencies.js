import { vbox, hbox, text } from "../h.js";
import { box, tag, dot, iconTile } from "../ui.js";
import { icons } from "../icons.js";

const group = (t, label, color, items) =>
  items.length
    ? vbox(
        { gap: 10 },
        hbox(
          { alignItems: "center", gap: 7 },
          dot(color, 7),
          text(label, { fontSize: 13, fontWeight: 600, color: t.muted })
        ),
        hbox({ gap: 8, flexWrap: "wrap" }, ...items.map((d) => tag(t, d.label)))
      )
    : null;

export function dependencies(t, cfg) {
  const { external, internal } = cfg.dependencies;
  const total = external.length + internal.length;
  if (!total) return null;
  return box(
    t,
    { title: "Dependencies", icon: iconTile(icons.package({ size: 16, color: t.accent }), t.accent, t), count: total },
    vbox(
      { gap: 16 },
      group(t, "External", t.accent, external),
      group(t, "Internal", t.status.internal, internal)
    )
  );
}
