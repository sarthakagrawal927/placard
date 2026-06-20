// GitHub Primer color tokens so the card blends into a README as if it were a
// first-party GitHub surface. The outer background is transparent (see render.ts)
// so the gaps between panels show the viewer's real GitHub canvas in any theme.
import type { Theme, ThemeMode } from "./types.js";

const DARK: Theme = {
  mode: "dark",
  canvas: "#0d1117", // assumed GitHub bg (for reference, not painted)
  panel: "#161b22", // canvas.subtle — the "Box" surface
  inset: "#0d1117", // canvas.default — nested wells
  insetAlt: "#010409", // canvas.inset — deepest
  border: "#30363d", // border.default
  borderMuted: "#21262d", // border.muted
  text: "#e6edf3", // fg.default
  muted: "#8b949e", // fg.muted (secondary text)
  subtle: "#6e7681", // fg.subtle (tertiary)
  accent: "#2f81f7", // accent.fg
  accentEmphasis: "#388bfd",
  shadow: "0 1px 0 rgba(1,4,9,0.55), 0 2px 6px rgba(1,4,9,0.4)",
  status: {
    done: "#3fb950", // success.fg
    planned: "#2f81f7", // accent.fg
    todo: "#d29922", // attention.fg
    deferred: "#8b949e", // neutral
    blocked: "#f85149", // danger.fg
    internal: "#a371f7", // done.fg (purple)
  },
};

const LIGHT: Theme = {
  mode: "light",
  canvas: "#ffffff",
  panel: "#f6f8fa", // canvas.subtle
  inset: "#ffffff", // canvas.default
  insetAlt: "#eaeef2",
  border: "#d0d7de", // border.default
  borderMuted: "#d8dee4", // border.muted
  text: "#1f2328", // fg.default
  muted: "#59636e", // fg.muted
  subtle: "#6e7781", // fg.subtle
  accent: "#0969da", // accent.fg
  accentEmphasis: "#0860ca",
  shadow: "0 1px 0 rgba(31,35,40,0.04), 0 1px 3px rgba(31,35,40,0.08)",
  status: {
    done: "#1a7f37", // success.fg
    planned: "#0969da", // accent.fg
    todo: "#9a6700", // attention.fg
    deferred: "#6e7781", // neutral
    blocked: "#cf222e", // danger.fg
    internal: "#8250df", // done.fg (purple)
  },
};

// 8-digit hex alpha helper for tinted status backgrounds (Primer-style subtle fills).
export function tint(hex: string, alpha = 0.15): string {
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
  return `${hex}${a}`;
}

export function resolveTheme(mode: ThemeMode = "dark", accent?: string): Theme {
  const base = mode === "light" ? LIGHT : DARK;
  const theme: Theme = { ...base, status: { ...base.status } };
  if (accent && /^#[0-9a-fA-F]{3,8}$/.test(accent)) {
    theme.accent = accent;
    theme.accentEmphasis = accent;
    theme.status.planned = accent;
  }
  return theme;
}

export const FONT_FAMILY = "Inter";
