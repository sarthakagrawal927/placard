// Fetch + normalize a project.json into the shape every section renderer expects.
// Source is a raw URL (?src=) so any repo can host its own config.
import { parseRepo } from "./github.js";
import type { Item, ProjectConfig, ThemeMode } from "./types.js";

const MAX_BYTES = 256 * 1024;

export class ConfigError extends Error {}

export async function loadConfig(src: string | null): Promise<ProjectConfig> {
  if (!src) throw new ConfigError("Missing ?src= (raw URL to a project.json)");
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    throw new ConfigError("?src= is not a valid URL");
  }
  if (url.protocol !== "https:") throw new ConfigError("?src= must be https");

  let res: Response;
  try {
    res = await fetch(url, { headers: { accept: "application/json" } });
  } catch {
    throw new ConfigError("Could not fetch project.json");
  }
  if (!res.ok) throw new ConfigError(`Fetch failed (${res.status}) for project.json`);

  const body = await res.text();
  if (body.length > MAX_BYTES) throw new ConfigError("project.json too large (>256KB)");

  let raw: unknown;
  try {
    raw = JSON.parse(body);
  } catch {
    throw new ConfigError("project.json is not valid JSON");
  }
  return normalize(raw);
}

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

const asItem = (v: unknown): Item | null => {
  if (typeof v === "string") return { label: v };
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    const label = str(o.label) || str(o.name);
    const item: Item = { label };
    const note = str(o.note) || str(o.desc);
    if (note) item.note = note;
    if (str(o.url)) item.url = str(o.url);
    return item;
  }
  return null;
};

const asList = (v: unknown): Item[] =>
  Array.isArray(v) ? v.map(asItem).filter((x): x is Item => x !== null && x.label !== "") : [];

export function normalize(input: unknown): ProjectConfig {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, any>;
  const t = (raw.theme || {}) as Record<string, unknown>;
  const deps = (raw.dependencies || {}) as Record<string, unknown>;
  const road = (raw.roadmap || {}) as Record<string, unknown>;
  const links = (raw.links || {}) as Record<string, unknown>;
  const mode = t.mode === "light" || t.mode === "dark" ? (t.mode as ThemeMode) : undefined;

  return {
    name: str(raw.name) || "Untitled Project",
    tagline: str(raw.tagline),
    why: str(raw.why ?? raw.description),
    links: {
      repo: str(links.repo),
      site: str(links.site ?? links.homepage),
      docs: str(links.docs),
    },
    github: parseRepo(str(raw.github) || str(links.repo)),
    stats: raw.stats !== false,
    theme: { accent: str(t.accent), mode },
    dependencies: { external: asList(deps.external), internal: asList(deps.internal) },
    timeline: Array.isArray(raw.timeline)
      ? raw.timeline
          .map((e: Record<string, unknown>) => ({
            date: str(e.date),
            label: str(e.label),
            note: str(e.note ?? e.desc),
            done: e.done !== false,
          }))
          .filter((e: { date: string; label: string }) => e.label !== "" || e.date !== "")
      : [],
    products: Array.isArray(raw.products)
      ? raw.products
          .map((p: Record<string, unknown>) => ({
            name: str(p.name),
            desc: str(p.desc ?? p.tagline),
            url: str(p.url),
            status: str(p.status),
          }))
          .filter((p: { name: string }) => p.name !== "")
      : [],
    features: asList(raw.features ?? raw.done),
    roadmap: {
      planned: asList(road.planned),
      todo: asList(road.todo),
      deferred: asList(road.deferred),
      blocked: asList(road.blocked),
    },
    footer: str(raw.footer),
    updated: str(raw.updated),
  };
}
