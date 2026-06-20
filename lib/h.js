// Tiny hyperscript helper producing the plain-object element tree satori expects.
// Usage: h("div", { style }, child, child, ...) or h("div", { style }, [children]).
//
// Satori requires every element that has more than one child to be display:flex.
// The `box` / `vbox` / `hbox` helpers bake that in so we never forget.

export function h(type, props = {}, ...children) {
  const flat = children
    .flat(Infinity)
    .filter((c) => c !== null && c !== undefined && c !== false && c !== "");
  return {
    type,
    props: {
      ...props,
      children: flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat,
    },
  };
}

// Vertical flex container.
export function vbox(style = {}, ...children) {
  return h("div", { style: { display: "flex", flexDirection: "column", ...style } }, ...children);
}

// Horizontal flex container.
export function hbox(style = {}, ...children) {
  return h("div", { style: { display: "flex", flexDirection: "row", ...style } }, ...children);
}

// A bare text node wrapper (satori renders strings only inside an element).
export function text(value, style = {}) {
  return h("div", { style: { display: "flex", ...style } }, String(value));
}
