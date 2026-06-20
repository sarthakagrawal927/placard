// Inline SVG icons. Satori renders svg/path nodes directly, so each icon is a
// plain element tree. `d` paths are 24x24 (lucide-style), recolored via stroke.
import { h } from "./h.js";
import type { El } from "./types.js";

interface IconOpts {
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
}

function icon(paths: string[], o: IconOpts = {}): El {
  const { size = 18, color = "currentColor", fill = "none", strokeWidth = 2 } = o;
  return {
    type: "svg",
    props: {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill,
      stroke: color,
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: paths.map((d) => h("path", { d })),
    },
  };
}

// Variant for icons that need non-path elements (circles/lines).
function iconEl(children: El[], o: IconOpts = {}): El {
  const { size = 18, color = "currentColor", fill = "none", strokeWidth = 2 } = o;
  return {
    type: "svg",
    props: {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill,
      stroke: color,
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children,
    },
  };
}

type Icon = (o?: IconOpts) => El;

export const icons: Record<string, Icon> = {
  repo: (o) => icon(["M3 3h12l6 6v12H3z", "M15 3v6h6"], o),
  globe: (o) => icon(["M12 2a10 10 0 100 20 10 10 0 000-20", "M2 12h20", "M12 2a15 15 0 010 20 15 15 0 010-20"], o),
  docs: (o) => icon(["M4 4h11l5 5v11H4z", "M14 4v5h5", "M8 13h8", "M8 17h8"], o),
  check: (o) => icon(["M20 6L9 17l-5-5"], o),
  checkCircle: (o) => icon(["M12 2a10 10 0 100 20 10 10 0 000-20", "M8 12l3 3 5-6"], o),
  clock: (o) => icon(["M12 2a10 10 0 100 20 10 10 0 000-20", "M12 7v5l3 2"], o),
  package: (o) => icon(["M21 8l-9-5-9 5v8l9 5 9-5z", "M3 8l9 5 9-5", "M12 13v9"], o),
  layers: (o) => icon(["M12 3l9 5-9 5-9-5z", "M3 13l9 5 9-5"], o),
  flag: (o) => icon(["M4 22V4", "M4 4h13l-2 4 2 4H4"], o),
  star: (o) =>
    icon(["M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95z"], {
      ...o,
      fill: o?.color ?? "currentColor",
      strokeWidth: 0,
    }),
  fork: (o) =>
    iconEl(
      [
        h("circle", { cx: 6, cy: 5, r: 2.6 }),
        h("circle", { cx: 18, cy: 5, r: 2.6 }),
        h("circle", { cx: 12, cy: 19, r: 2.6 }),
        h("path", { d: "M6 7.6V10a3 3 0 003 3h6a3 3 0 003-3V7.6" }),
        h("path", { d: "M12 13v3.4" }),
      ],
      o
    ),
  issue: (o) => iconEl([h("circle", { cx: 12, cy: 12, r: 9 }), h("circle", { cx: 12, cy: 12, r: 1, fill: o?.color ?? "currentColor" })], o),
  spark: (o) => icon(["M12 3v4", "M12 17v4", "M3 12h4", "M17 12h4", "M6 6l2 2", "M16 16l2 2", "M18 6l-2 2", "M8 16l-2 2"], o),
};
