import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { vbox, text } from "./h";
import { resolveTheme, FONT_FAMILY } from "./theme";
import { loadFonts } from "./fonts";
import type { El, Format, Rendered, ThemeMode } from "./types";

type SatoriNode = Parameters<typeof satori>[0];
type SatoriFonts = Parameters<typeof satori>[1]["fonts"];

// A small, styled card shown when config/render fails — never a broken image.
export async function renderError(
  message: string,
  { mode = "dark", format = "png" }: { mode?: ThemeMode; format?: Format } = {}
): Promise<Rendered> {
  const t = resolveTheme(mode);
  const width = 640;
  const tree: El = vbox(
    { width, padding: 24, gap: 8, backgroundColor: t.panel, border: `1px solid ${t.status.blocked}`, borderRadius: 12, fontFamily: FONT_FAMILY },
    text("placard · could not render card", { fontSize: 13, fontWeight: 600, color: t.status.blocked }),
    text(message, { fontSize: 17, color: t.text, lineHeight: 1.45 })
  );
  const fonts = await loadFonts();
  const svg = await satori(tree as unknown as SatoriNode, { width, fonts: fonts as unknown as SatoriFonts });
  if (format === "svg") return { body: svg, contentType: "image/svg+xml; charset=utf-8" };
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width * 2 } }).render().asPng();
  return { body: png, contentType: "image/png" };
}
