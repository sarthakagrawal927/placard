import { h, vbox, hbox, text } from "../h.js";
import { box, iconTile } from "../ui.js";
import { icons } from "../icons.js";
import type { El, ProjectConfig, Theme } from "../types.js";

export function features(t: Theme, cfg: ProjectConfig): El | null {
  if (!cfg.features.length) return null;
  return box(
    t,
    {
      title: "Shipped",
      icon: iconTile(icons.check!({ size: 16, color: t.status.done }), t.status.done, t),
      count: cfg.features.length,
    },
    vbox(
      { gap: 9 },
      ...cfg.features.map((f) =>
        hbox(
          { alignItems: "flex-start", gap: 9 },
          h("div", { style: { display: "flex", paddingTop: 1 } }, icons.checkCircle!({ size: 16, color: t.status.done })),
          vbox(
            { gap: 1, flexGrow: 1, minWidth: 0 },
            text(f.label, { fontSize: 14, color: t.text, lineHeight: 1.45 }),
            f.note ? text(f.note, { fontSize: 12.5, color: t.muted, lineHeight: 1.4 }) : null
          )
        )
      )
    )
  );
}
