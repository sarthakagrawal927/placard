import { vbox, hbox, text } from "../h.js";
import { box, label, iconTile } from "../ui.js";
import { icons } from "../icons.js";
import type { El, ProjectConfig, Theme } from "../types.js";

export function products(t: Theme, cfg: ProjectConfig): El | null {
  if (!cfg.products.length) return null;
  return box(
    t,
    { title: "Products", icon: iconTile(icons.layers!({ size: 16, color: t.status.todo }), t.status.todo, t), count: cfg.products.length },
    vbox(
      { gap: 7 },
      ...cfg.products.map((p) =>
        hbox(
          { alignItems: "center", gap: 12, background: t.inset, border: `1px solid ${t.borderMuted}`, borderRadius: 9, padding: "9px 12px" },
          vbox(
            { flexGrow: 1, gap: 1, minWidth: 0 },
            text(p.name, { fontSize: 14.5, fontWeight: 600, color: t.text }),
            p.desc ? text(p.desc, { fontSize: 13, color: t.muted, lineHeight: 1.4 }) : null
          ),
          p.status ? label(t, p.status, t.status.done) : null
        )
      )
    )
  );
}
