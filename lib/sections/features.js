import { h, vbox, hbox, text } from "../h.js";
import { box, iconTile } from "../ui.js";
import { icons } from "../icons.js";

export function features(t, cfg) {
  if (!cfg.features.length) return null;
  return box(
    t,
    {
      title: "Shipped",
      icon: iconTile(icons.check({ size: 16, color: t.status.done }), t.status.done, t),
      count: cfg.features.length,
    },
    vbox(
      { gap: 11 },
      ...cfg.features.map((f) =>
        hbox(
          { alignItems: "flex-start", gap: 10 },
          h("div", { style: { display: "flex", paddingTop: 1 } }, icons.checkCircle({ size: 17, color: t.status.done })),
          vbox(
            { gap: 1, flexGrow: 1, minWidth: 0 },
            text(f.label, { fontSize: 15, color: t.text, lineHeight: 1.45 }),
            f.note ? text(f.note, { fontSize: 13, color: t.muted, lineHeight: 1.4 }) : null
          )
        )
      )
    )
  );
}
