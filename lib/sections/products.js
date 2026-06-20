import { vbox, hbox, text } from "../h.js";
import { box, label, iconTile } from "../ui.js";
import { icons } from "../icons.js";

export function products(t, cfg) {
  if (!cfg.products.length) return null;
  return box(
    t,
    { title: "Products", icon: iconTile(icons.layers({ size: 16, color: t.accent }), t.accent, t), count: cfg.products.length },
    vbox(
      { gap: 9 },
      ...cfg.products.map((p) =>
        hbox(
          {
            alignItems: "center",
            gap: 12,
            background: t.inset,
            border: `1px solid ${t.borderMuted}`,
            borderRadius: 10,
            padding: "11px 14px",
          },
          vbox(
            { flexGrow: 1, gap: 2, minWidth: 0 },
            text(p.name, { fontSize: 15.5, fontWeight: 600, color: t.text }),
            p.desc ? text(p.desc, { fontSize: 13.5, color: t.muted, lineHeight: 1.4 }) : null
          ),
          p.status ? label(t, p.status, t.status.done) : null
        )
      )
    )
  );
}
