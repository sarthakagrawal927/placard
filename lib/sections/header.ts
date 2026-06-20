import { vbox, hbox, text } from "../h.js";
import { tint } from "../theme.js";
import { icons } from "../icons.js";
import type { El, ProjectConfig, Theme } from "../types.js";

type IconFn = (o?: { size?: number; color?: string }) => El;

const linkBtn = (t: Theme, icon: IconFn, labelText: string): El =>
  hbox(
    { alignItems: "center", gap: 6, background: t.inset, border: `1px solid ${t.border}`, borderRadius: 6, padding: "5px 11px" },
    icon({ size: 14, color: t.muted }),
    text(labelText, { fontSize: 13, fontWeight: 500, color: t.text })
  );

export function header(t: Theme, cfg: ProjectConfig): El {
  const initial = (cfg.name.trim()[0] || "•").toUpperCase();

  const links: El[] = [];
  if (cfg.links.repo) links.push(linkBtn(t, icons.repo!, hostOf(cfg.links.repo)));
  if (cfg.links.site) links.push(linkBtn(t, icons.globe!, hostOf(cfg.links.site)));
  if (cfg.links.docs) links.push(linkBtn(t, icons.docs!, "docs"));

  const monogram = hbox(
    {
      alignItems: "center",
      justifyContent: "center",
      width: 52,
      height: 52,
      borderRadius: 13,
      backgroundImage: `linear-gradient(135deg, ${tint(t.accent, 0.28)}, ${tint(t.accent, 0.08)})`,
      border: `1px solid ${tint(t.accent, 0.45)}`,
      flexShrink: 0,
    },
    text(initial, { fontSize: 27, fontWeight: 800, color: t.accent })
  );

  return vbox(
    { gap: 13, paddingBottom: 16, borderBottom: `1px solid ${t.borderMuted}` },
    hbox(
      { alignItems: "center", gap: 15 },
      monogram,
      vbox(
        { gap: 2, flexGrow: 1, minWidth: 0 },
        text(cfg.name, { fontSize: 37, fontWeight: 800, color: t.text, letterSpacing: -1, lineHeight: 1.05 }),
        cfg.tagline ? text(cfg.tagline, { fontSize: 16, fontWeight: 600, color: t.accent }) : null
      )
    ),
    cfg.why ? text(cfg.why, { fontSize: 15, lineHeight: 1.55, color: t.muted, maxWidth: 860 }) : null,
    links.length ? hbox({ gap: 8, flexWrap: "wrap" }, ...links) : null
  );
}

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
