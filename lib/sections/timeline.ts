import { h, vbox, hbox, text } from "../h";
import { box, iconTile } from "../ui";
import { icons } from "../icons";
import type { El, ProjectConfig, Theme } from "../types";

// Horizontal milestone rail: a thin baseline through evenly spaced nodes,
// date above each, label below. Completed nodes are filled, upcoming is a ring.
export function timeline(t: Theme, cfg: ProjectConfig): El | null {
  const items = cfg.timeline;
  if (!items.length) return null;

  const rail = h(
    "div",
    { style: { display: "flex", position: "relative", width: "100%", paddingTop: 2 } },
    h("div", {
      style: { display: "flex", position: "absolute", top: 25, left: 24, right: 24, height: 2, background: t.border },
    }),
    hbox(
      { width: "100%", justifyContent: "space-between", alignItems: "flex-start" },
      ...items.map((e) =>
        vbox(
          { flexBasis: 0, flexGrow: 1, alignItems: "center", gap: 9, padding: "0 6px" },
          text(e.date || "", { fontSize: 12.5, fontWeight: 600, color: t.muted }),
          h("div", {
            style: {
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 999,
              background: e.done ? t.status.done : t.panel,
              border: `3px solid ${e.done ? t.status.done : t.accent}`,
            },
          }),
          text(e.label || "", { fontSize: 14, fontWeight: 600, color: t.text, textAlign: "center", lineHeight: 1.3 }),
          e.note ? text(e.note, { fontSize: 12, color: t.muted, textAlign: "center", lineHeight: 1.3 }) : null
        )
      )
    )
  );

  return box(t, { title: "Build timeline", icon: iconTile(icons.clock!({ size: 16, color: t.status.done }), t.status.done, t) }, rail);
}
