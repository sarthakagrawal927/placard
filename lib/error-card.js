import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { vbox, text } from "./h.js";
import { resolveTheme, FONT_FAMILY } from "./theme.js";
import { loadFonts } from "./fonts.js";

// A small, styled card shown when config/render fails — never a broken image.
export async function renderError(message, { mode = "dark", format = "png" } = {}) {
  const t = resolveTheme(mode);
  const width = 640;
  const tree = vbox(
    {
      width,
      padding: 24,
      gap: 8,
      backgroundColor: t.panel,
      border: `1px solid ${t.status.blocked}`,
      borderRadius: 12,
      fontFamily: FONT_FAMILY,
    },
    text("placard · could not render card", {
      fontSize: 13,
      fontWeight: 600,
      color: t.status.blocked,
    }),
    text(message, { fontSize: 17, color: t.text, lineHeight: 1.45 })
  );
  const fonts = await loadFonts();
  const svg = await satori(tree, { width, fonts });
  if (format === "svg") return { body: svg, contentType: "image/svg+xml; charset=utf-8" };
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width * 2 } }).render().asPng();
  return { body: png, contentType: "image/png" };
}
