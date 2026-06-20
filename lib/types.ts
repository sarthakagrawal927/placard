// Shared types for placard.

// Satori element tree node. h() produces these; satori consumes them (we cast
// to its ReactNode-ish input at the call site).
export interface El {
  type: string;
  props: Record<string, unknown> & { children?: unknown };
}

// A normalized list item (features, deps, roadmap entries).
export interface Item {
  label: string;
  note?: string;
  url?: string;
}

export interface TimelineEntry {
  date: string;
  label: string;
  note: string;
  done: boolean;
}

export interface Product {
  name: string;
  desc: string;
  url: string;
  status: string;
}

export interface ProjectConfig {
  name: string;
  tagline: string;
  why: string;
  links: { repo: string; site: string; docs: string };
  github: { owner: string; repo: string } | null;
  stats: boolean;
  graph: boolean;
  theme: { accent: string; mode: ThemeMode | undefined };
  dependencies: { external: Item[]; internal: Item[] };
  timeline: TimelineEntry[];
  products: Product[];
  features: Item[];
  roadmap: { planned: Item[]; todo: Item[]; deferred: Item[]; blocked: Item[] };
  footer: string;
  updated: string;
}

export type ThemeMode = "dark" | "light" | "midnight";

export interface Theme {
  mode: ThemeMode;
  canvas: string;
  // Optional self-contained card background (radial gradient). When set, the
  // card paints this instead of being transparent — a distinct, branded look.
  bg?: string;
  glow?: boolean;
  panel: string;
  panelTop: string;
  inset: string;
  insetAlt: string;
  border: string;
  borderMuted: string;
  text: string;
  muted: string;
  subtle: string;
  accent: string;
  accentEmphasis: string;
  shadow: string;
  status: {
    done: string;
    planned: string;
    todo: string;
    deferred: string;
    blocked: string;
    internal: string;
  };
}

export type Format = "png" | "svg";

export interface RenderOpts {
  mode?: ThemeMode;
  width?: number;
  format?: Format;
  scale?: number;
  bg?: string;
  animate?: boolean;
  graph?: boolean;
}

export interface Rendered {
  body: Buffer | string;
  contentType: string;
}

// Minimal Vercel Node handler request/response shape (avoids a heavy dep).
export interface Req {
  url?: string;
  headers: { host?: string } & Record<string, unknown>;
}
export interface Res {
  setHeader(key: string, value: string): void;
  status(code: number): Res;
  send(body: Buffer | string): void;
}
