// Tiny hyperscript helper producing the plain-object element tree satori expects.
import type { El } from "./types";

type Style = Record<string, unknown>;
type Props = Record<string, unknown> & { style?: Style };
type Child = El | string | null | undefined | false;

export function h(type: string, props: Props = {}, ...children: Child[]): El {
  const flat = children
    .flat(Infinity as 1)
    .filter((c): c is El | string => c !== null && c !== undefined && c !== false && c !== "");
  return {
    type,
    props: {
      ...props,
      children: flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat,
    },
  };
}

// Vertical flex container.
export function vbox(style: Style = {}, ...children: Child[]): El {
  return h("div", { style: { display: "flex", flexDirection: "column", ...style } }, ...children);
}

// Horizontal flex container.
export function hbox(style: Style = {}, ...children: Child[]): El {
  return h("div", { style: { display: "flex", flexDirection: "row", ...style } }, ...children);
}

// A bare text node wrapper (satori renders strings only inside an element).
export function text(value: unknown, style: Style = {}): El {
  return h("div", { style: { display: "flex", ...style } }, String(value));
}
