import { h, vbox, hbox, text } from "../h.js";
import { box, dot, iconTile } from "../ui.js";
import { icons } from "../icons.js";
import { langColor } from "../langcolors.js";
import { sparklineDataUrl } from "../graph.js";
import type { El, Theme } from "../types.js";
import type { RepoStats } from "../github.js";

const fmt = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);

function ago(iso: string): string {
  if (!iso) return "";
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

const metric = (t: Theme, icon: El, value: string, label: string): El =>
  hbox(
    { alignItems: "center", gap: 9 },
    icon,
    hbox(
      { alignItems: "baseline", gap: 5 },
      text(value, { fontSize: 17, fontWeight: 700, color: t.text }),
      text(label, { fontSize: 13, color: t.muted })
    )
  );

export function stats(t: Theme, s: RepoStats, activity: number[] | null = null): El {
  const metrics: El[] = [
    metric(t, icons.star!({ size: 17, color: t.status.todo }), fmt(s.stars), "stars"),
    metric(t, icons.fork!({ size: 16, color: t.muted }), fmt(s.forks), "forks"),
    metric(t, icons.issue!({ size: 16, color: t.status.done }), fmt(s.issues), "issues"),
  ];
  if (s.pushedAt) metrics.push(metric(t, icons.clock!({ size: 16, color: t.muted }), ago(s.pushedAt), "updated"));

  // Commit-activity sparkline (canvas), right-aligned in the metric row.
  const spark = activity ? sparklineDataUrl(t, activity, 260, 44) : null;
  const sparkEl = spark
    ? vbox(
        { alignItems: "flex-end", gap: 3, marginLeft: "auto" },
        h("img", { src: spark, width: 260, height: 44, style: { display: "flex" } }),
        text("commits / week", { fontSize: 11.5, color: t.subtle })
      )
    : null;

  const langs = s.languages;
  const bar =
    langs.length > 0
      ? vbox(
          { gap: 10, marginTop: 16 },
          hbox(
            { width: "100%", height: 8, borderRadius: 999, overflow: "hidden", background: t.inset },
            ...langs.map((l, i) =>
              h("div", { style: { display: "flex", width: `${l.pct}%`, height: "100%", background: langColor(l.name, i) } })
            )
          ),
          hbox(
            { gap: 16, flexWrap: "wrap" },
            ...langs.map((l, i) =>
              hbox(
                { alignItems: "center", gap: 6 },
                dot(langColor(l.name, i), 8),
                text(l.name, { fontSize: 13, fontWeight: 500, color: t.text }),
                text(`${l.pct.toFixed(l.pct < 10 ? 1 : 0)}%`, { fontSize: 13, color: t.muted })
              )
            )
          )
        )
      : null;

  return box(
    t,
    { title: "Repository", icon: iconTile(icons.repo!({ size: 16, color: t.accent }), t.accent, t) },
    hbox({ gap: 26, flexWrap: "wrap", alignItems: "center", width: "100%" }, ...metrics, sparkEl),
    bar
  );
}
