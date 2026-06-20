import { vbox, hbox, text } from "../h";
import { tint } from "../theme";
import { icons } from "../icons";
import type { El, ProjectConfig, Theme } from "../types";

type IconFn = (o?: { size?: number; color?: string }) => El;

const linkBtn = (t: Theme, icon: IconFn, labelText: string): El =>
  hbox(
    { alignItems: "center", gap: 7, background: t.inset, border: `1px solid ${t.border}`, borderRadius: 6, padding: "6px 12px" },
    icon({ size: 15, color: t.muted }),
    text(labelText, { fontSize: 14, fontWeight: 500, color: t.text })
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
      width: 60,
      height: 60,
      borderRadius: 14,
      background: tint(t.accent, t.mode === "light" ? 0.12 : 0.18),
      border: `1px solid ${tint(t.accent, 0.45)}`,
      flexShrink: 0,
    },
    text(initial, { fontSize: 32, fontWeight: 800, color: t.accent })
  );

  return vbox(
    { gap: 16 },
    hbox(
      { alignItems: "center", gap: 18 },
      monogram,
      vbox(
        { gap: 3, flexGrow: 1, minWidth: 0 },
        text(cfg.name, { fontSize: 42, fontWeight: 800, color: t.text, letterSpacing: -0.8, lineHeight: 1.05 }),
        cfg.tagline ? text(cfg.tagline, { fontSize: 18, fontWeight: 600, color: t.accent }) : null
      )
    ),
    cfg.why ? text(cfg.why, { fontSize: 16.5, lineHeight: 1.6, color: t.muted, maxWidth: 880 }) : null,
    links.length ? hbox({ gap: 9, flexWrap: "wrap" }, ...links) : null
  );
}

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
