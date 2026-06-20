import { h, vbox, hbox, text } from "../h.js";
import { box, iconTile, tint } from "../ui.js";
import { icons } from "../icons.js";
import type { El, ProjectConfig, Theme } from "../types.js";

// Horizontal milestone rail: a thin baseline through evenly spaced nodes,
// date above each, label below. Completed nodes are filled, upcoming is a ring.
export function timeline(t: Theme, cfg: ProjectConfig): El | null {
  const items = cfg.timeline;
  if (!items.length) return null;

  const node = (done: boolean): El => {
    const color = done ? t.status.done : t.accent;
    return hbox(
      {
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: 999,
        background: tint(color, t.mode === "light" ? 0.14 : 0.2),
      },
      h("div", {
        style: {
          display: "flex",
          width: 12,
          height: 12,
          borderRadius: 999,
          background: done ? color : t.panel,
          border: `3px solid ${color}`,
        },
      })
    );
  };

  const rail = h(
    "div",
    { style: { display: "flex", position: "relative", width: "100%", paddingTop: 2 } },
    h("div", {
      style: {
        display: "flex",
        position: "absolute",
        top: 35,
        left: 30,
        right: 30,
        height: 2,
        borderRadius: 2,
        backgroundImage: `linear-gradient(90deg, ${t.status.done}, ${t.accent})`,
      },
    }),
    hbox(
      { width: "100%", justifyContent: "space-between", alignItems: "flex-start" },
      ...items.map((e) =>
        vbox(
          { flexBasis: 0, flexGrow: 1, alignItems: "center", gap: 7, padding: "0 6px" },
          text(e.date || "", { fontSize: 12, fontWeight: 600, color: t.muted }),
          node(e.done),
          text(e.label || "", { fontSize: 13.5, fontWeight: 600, color: t.text, textAlign: "center", lineHeight: 1.3 }),
          e.note ? text(e.note, { fontSize: 12, color: t.muted, textAlign: "center", lineHeight: 1.3 }) : null
        )
      )
    )
  );

  return box(t, { title: "Build timeline", icon: iconTile(icons.clock!({ size: 16, color: t.status.done }), t.status.done, t) }, rail);
}
