// Canvas-drawn dependency graph: a hub (the project) with curved edges out to
// each dependency node. satori can't draw curved edges/graphs, so we render it
// with @napi-rs/canvas and embed the result as a PNG data-URI inside the card.
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { join } from "node:path";
import { fontsDir } from "./fonts.js";
import type { ProjectConfig, Theme } from "./types.js";

let fontReady = false;
function ensureFont(): string {
  if (!fontReady) {
    try {
      GlobalFonts.registerFromPath(join(fontsDir(), "Inter-600.woff"), "InterCanvas");
      GlobalFonts.registerFromPath(join(fontsDir(), "Inter-700.woff"), "InterCanvasBold");
    } catch {
      /* fall back to a system sans-serif */
    }
    fontReady = true;
  }
  return GlobalFonts.families.some((f) => f.family === "InterCanvas") ? "InterCanvas" : "sans-serif";
}

interface Node {
  label: string;
  color: string;
}

function roundRect(ctx: any, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Returns a PNG data-URI, or null if there's nothing to draw.
export function dependencyGraphDataUrl(t: Theme, cfg: ProjectConfig, width: number, height = 300): string | null {
  const ext = cfg.dependencies.external.map((d) => ({ label: d.label, color: t.accent }));
  const int = cfg.dependencies.internal.map((d) => ({ label: d.label, color: t.status.internal }));
  const nodes: Node[] = [...ext, ...int];
  if (!nodes.length) return null;

  const fam = ensureFont();
  const S = 2; // retina scale
  const canvas = createCanvas(width * S, height * S);
  const ctx = canvas.getContext("2d");
  ctx.scale(S, S);

  const cx = width / 2;
  const cy = height / 2;
  const rx = width * 0.36;
  const ry = height * 0.32;

  // Place external nodes across the left arc, internal across the right arc, so
  // the two groups read as two clusters around the hub.
  const place = (group: Node[], a0: number, a1: number) =>
    group.map((n, i) => {
      const a = group.length === 1 ? (a0 + a1) / 2 : a0 + ((a1 - a0) * i) / (group.length - 1);
      return { ...n, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
    });
  const placed = [
    ...place(ext, Math.PI * 0.62, Math.PI * 1.38), // left arc
    ...place(int, -Math.PI * 0.38, Math.PI * 0.38), // right arc
  ];

  // Edges (drawn first, behind nodes).
  ctx.lineWidth = 1.5;
  for (const n of placed) {
    const mx = (cx + n.x) / 2;
    ctx.strokeStyle = hexA(n.color, 0.45);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.bezierCurveTo(mx, cy, mx, n.y, n.x, n.y);
    ctx.stroke();
  }

  // Dependency node pills.
  ctx.font = `600 14px ${fam}`;
  ctx.textBaseline = "middle";
  for (const n of placed) {
    const tw = ctx.measureText(n.label).width;
    const pad = 11;
    const w = tw + pad * 2;
    const h = 28;
    const x = n.x - w / 2;
    const y = n.y - h / 2;
    roundRect(ctx, x, y, w, h, 8);
    ctx.fillStyle = t.inset;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = hexA(n.color, 0.6);
    ctx.stroke();
    // a small color dot
    ctx.beginPath();
    ctx.arc(x + pad, n.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = n.color;
    ctx.fill();
    ctx.fillStyle = t.text;
    ctx.fillText(n.label, x + pad + 8, n.y + 0.5);
  }

  // Hub (the project), on top.
  const hubLabel = cfg.name;
  ctx.font = `700 16px ${fam === "InterCanvas" ? "InterCanvasBold" : fam}`;
  const hw = Math.max(96, ctx.measureText(hubLabel).width + 36);
  const hh = 40;
  roundRect(ctx, cx - hw / 2, cy - hh / 2, hw, hh, 11);
  ctx.fillStyle = t.panel;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = t.accent;
  ctx.stroke();
  ctx.fillStyle = t.text;
  ctx.textAlign = "center";
  ctx.fillText(hubLabel, cx, cy + 1);

  return canvas.toDataURL("image/png");
}

// Append alpha to a #rrggbb hex.
function hexA(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
  return `${hex}${a}`;
}
