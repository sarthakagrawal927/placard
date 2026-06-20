// Turn satori's static SVG into an animated one using only declarative
// animation (CSS @keyframes + SMIL) — these play inside a README <img>, where
// JavaScript never runs. Two effects: a one-time fade-in on load, and an
// ambient sheen that sweeps across the card on a loop.

export function animateSvg(svg: string): string {
  const w = Number(svg.match(/\bwidth="(\d+)"/)?.[1] ?? 1100);
  const h = Number(svg.match(/\bheight="(\d+)"/)?.[1] ?? 800);
  const band = Math.round(w * 0.33);

  const style =
    `<style>` +
    `@keyframes plFade{from{opacity:0}to{opacity:1}}` +
    `svg{animation:plFade .9s ease-out both}` +
    `</style>`;

  const sheen =
    `<defs><linearGradient id="plSheen" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0" stop-color="#ffffff" stop-opacity="0"/>` +
    `<stop offset="0.5" stop-color="#ffffff" stop-opacity="0.05"/>` +
    `<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>` +
    `</linearGradient></defs>` +
    `<rect x="0" y="0" width="${band}" height="${h}" fill="url(#plSheen)" transform="translate(${-band},0)">` +
    `<animateTransform attributeName="transform" type="translate" ` +
    `from="${-band} 0" to="${w} 0" dur="4s" begin="0.7s" repeatCount="indefinite"/>` +
    `</rect>`;

  return svg
    .replace(/(<svg[^>]*>)/, `$1${style}`)
    .replace(/<\/svg>\s*$/, `${sheen}</svg>`);
}
