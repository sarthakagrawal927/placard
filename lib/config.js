// Fetch + normalize a project.json into the shape every section renderer expects.
// Source is a raw URL (?src=) so any repo can host its own config.

const MAX_BYTES = 256 * 1024;

export async function loadConfig(src) {
  if (!src) throw new ConfigError("Missing ?src= (raw URL to a project.json)");
  let url;
  try {
    url = new URL(src);
  } catch {
    throw new ConfigError("?src= is not a valid URL");
  }
  if (url.protocol !== "https:") throw new ConfigError("?src= must be https");

  let res;
  try {
    res = await fetch(url, { headers: { accept: "application/json" } });
  } catch {
    throw new ConfigError("Could not fetch project.json");
  }
  if (!res.ok) throw new ConfigError(`Fetch failed (${res.status}) for project.json`);

  const body = await res.text();
  if (body.length > MAX_BYTES) throw new ConfigError("project.json too large (>256KB)");

  let raw;
  try {
    raw = JSON.parse(body);
  } catch {
    throw new ConfigError("project.json is not valid JSON");
  }
  return normalize(raw);
}

export class ConfigError extends Error {}

const asItem = (v) =>
  typeof v === "string"
    ? { label: v }
    : v && typeof v === "object"
    ? { label: v.label ?? v.name ?? "", note: v.note ?? v.desc, url: v.url }
    : null;

const asList = (v) => (Array.isArray(v) ? v.map(asItem).filter((x) => x && x.label) : []);

export function normalize(raw = {}) {
  const t = raw.theme || {};
  return {
    name: str(raw.name) || "Untitled Project",
    tagline: str(raw.tagline),
    why: str(raw.why || raw.description),
    links: {
      repo: str(raw.links?.repo),
      site: str(raw.links?.site || raw.links?.homepage),
      docs: str(raw.links?.docs),
    },
    theme: {
      accent: str(t.accent),
      mode: t.mode === "light" || t.mode === "dark" ? t.mode : undefined,
    },
    dependencies: {
      external: asList(raw.dependencies?.external),
      internal: asList(raw.dependencies?.internal),
    },
    timeline: Array.isArray(raw.timeline)
      ? raw.timeline
          .map((e) => ({
            date: str(e.date),
            label: str(e.label),
            note: str(e.note || e.desc),
            done: e.done !== false,
          }))
          .filter((e) => e.label || e.date)
      : [],
    products: Array.isArray(raw.products)
      ? raw.products
          .map((p) => ({
            name: str(p.name),
            desc: str(p.desc || p.tagline),
            url: str(p.url),
            status: str(p.status),
          }))
          .filter((p) => p.name)
      : [],
    features: asList(raw.features || raw.done),
    roadmap: {
      planned: asList(raw.roadmap?.planned),
      todo: asList(raw.roadmap?.todo),
      deferred: asList(raw.roadmap?.deferred),
      blocked: asList(raw.roadmap?.blocked),
    },
    footer: str(raw.footer),
    updated: str(raw.updated),
  };
}

const str = (v) => (typeof v === "string" ? v.trim() : "");
