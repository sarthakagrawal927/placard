import { vbox, hbox, text } from "../h.js";
import { box, dot, iconTile } from "../ui.js";
import { icons } from "../icons.js";

const COLUMNS = [
  { key: "planned", label: "Planned", status: "planned" },
  { key: "todo", label: "To do", status: "todo" },
  { key: "deferred", label: "Deferred", status: "deferred" },
  { key: "blocked", label: "Blocked", status: "blocked" },
];

const column = (t, label, color, items) =>
  vbox(
    {
      flexBasis: 0,
      flexGrow: 1,
      minWidth: 0,
      gap: 9,
      background: t.inset,
      border: `1px solid ${t.borderMuted}`,
      borderRadius: 10,
      padding: 13,
    },
    hbox(
      { alignItems: "center", gap: 8, marginBottom: 1 },
      dot(color, 9),
      text(label, { fontSize: 13.5, fontWeight: 600, color: t.text, flexGrow: 1 }),
      text(String(items.length), { fontSize: 12, fontWeight: 600, color: t.subtle })
    ),
    ...(items.length
      ? items.map((it) =>
          text(it.label, {
            fontSize: 13.5,
            color: t.muted,
            lineHeight: 1.4,
            background: t.panel,
            border: `1px solid ${t.borderMuted}`,
            borderRadius: 8,
            padding: "8px 11px",
          })
        )
      : [text("—", { fontSize: 13.5, color: t.subtle, padding: "2px 0" })])
  );

export function roadmap(t, cfg) {
  const present = COLUMNS.filter((c) => cfg.roadmap[c.key].length);
  if (!present.length) return null;
  const total = present.reduce((n, c) => n + cfg.roadmap[c.key].length, 0);
  return box(
    t,
    { title: "Roadmap", icon: iconTile(icons.flag({ size: 16, color: t.accent }), t.accent, t), count: total },
    hbox(
      { gap: 11, width: "100%", alignItems: "stretch" },
      ...present.map((c) => column(t, c.label, t.status[c.status], cfg.roadmap[c.key]))
    )
  );
}
