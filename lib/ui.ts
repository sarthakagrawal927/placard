// Reusable building blocks styled to read as native GitHub surfaces.
import { h, vbox, hbox, text } from "./h";
import { FONT_FAMILY, tint } from "./theme";
import type { El, Theme } from "./types";

type Child = El | string | null | undefined | false;
type Style = Record<string, unknown>;

interface BoxOpts {
  title?: string;
  icon?: El | null;
  count?: number | null;
}

// A GitHub-style "Box": subtle surface, 1px border, rounded corners.
export function box(t: Theme, { title, icon, count }: BoxOpts = {}, ...children: Child[]): El {
  const header =
    title &&
    hbox(
      { alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
      hbox(
        { alignItems: "center", gap: 10 },
        icon || null,
        text(title, { fontSize: 15, fontWeight: 600, color: t.text, letterSpacing: 0.1 })
      ),
      count != null ? countPill(t, count) : null
    );

  return vbox(
    { background: t.panel, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20 },
    header,
    ...children
  );
}

// Small monochrome count, GitHub "Counter" style.
export function countPill(t: Theme, n: number): El {
  return text(String(n), {
    fontSize: 12,
    fontWeight: 600,
    color: t.muted,
    background: t.inset,
    border: `1px solid ${t.borderMuted}`,
    borderRadius: 999,
    padding: "1px 9px",
    lineHeight: 1.6,
  });
}

// GitHub "Label" pill — tinted fill + same-hue border + colored text.
export function label(t: Theme, value: string, color: string): El {
  return text(value, {
    fontSize: 12.5,
    fontWeight: 600,
    color,
    background: tint(color, t.mode === "light" ? 0.12 : 0.16),
    border: `1px solid ${tint(color, 0.4)}`,
    borderRadius: 999,
    padding: "2px 10px",
    lineHeight: 1.5,
  });
}

// Neutral topic-tag chip (dependencies).
export function tag(t: Theme, value: string): El {
  return text(value, {
    fontSize: 13.5,
    fontWeight: 500,
    color: t.text,
    background: t.inset,
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    padding: "5px 11px",
    lineHeight: 1.3,
  });
}

// Rounded icon tile with a tinted background (section glyphs).
export function iconTile(icon: El, color: string, t: Theme): El {
  return hbox(
    {
      alignItems: "center",
      justifyContent: "center",
      width: 28,
      height: 28,
      borderRadius: 8,
      background: tint(color, t.mode === "light" ? 0.12 : 0.18),
    },
    icon
  );
}

export function dot(color: string, size = 8): El {
  return h("div", {
    style: { display: "flex", width: size, height: size, borderRadius: 999, background: color, flexShrink: 0 },
  });
}

export function paragraph(t: Theme, value: string, style: Style = {}): El {
  return text(value, { fontSize: 16, lineHeight: 1.6, color: t.muted, ...style });
}

export function twoCol(left: El, right: El, gap = 16): El {
  return hbox(
    { gap, width: "100%", alignItems: "stretch" },
    h("div", { style: { display: "flex", flexBasis: 0, flexGrow: 1, minWidth: 0 } }, left),
    h("div", { style: { display: "flex", flexBasis: 0, flexGrow: 1, minWidth: 0 } }, right)
  );
}

export { FONT_FAMILY, tint };
