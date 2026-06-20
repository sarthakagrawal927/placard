# placard

Render a `project.json` into a beautiful, embeddable **project-overview card** for any GitHub README — the "much larger" sibling of a status badge.

One image shows the whole project at a glance: what it is and why, build timeline, dependencies, products, what's shipped, and the roadmap board (planned / to do / deferred / blocked).

<!-- placard renders its own card, from project.json in this repo (live once deployed) -->
<p align="center">
  <a href="https://placard-coral.vercel.app">
    <picture>
      <source media="(prefers-color-scheme: light)"
              srcset="https://placard-coral.vercel.app/api/card?src=https://raw.githubusercontent.com/sarthakagrawal927/placard/main/project.json&theme=light">
      <img alt="placard project card"
           src="https://placard-coral.vercel.app/api/card?src=https://raw.githubusercontent.com/sarthakagrawal927/placard/main/project.json&theme=dark">
    </picture>
  </a>
</p>

```md
![project card](https://placard-coral.vercel.app/api/card?src=https://raw.githubusercontent.com/you/repo/main/project.json)
```

> Built the same way as a shields.io badge — a serverless endpoint returns an image — but it renders a full multi-section card. Powered by [satori](https://github.com/vercel/satori) (real font metrics → no text overflow) and rendered to **PNG**, which always renders on GitHub (no Camo SVG-sanitization surprises).

## How it works

1. Drop a `project.json` in your repo (see [the schema](schema/project.schema.json) and [example](examples/saas-maker.json)).
2. Embed the endpoint, pointing `?src=` at the **raw** URL of that file.
3. The card re-renders whenever the JSON changes (subject to GitHub's image cache).

## Embed recipes

**Basic:**
```md
![project](https://placard-coral.vercel.app/api/card?src=<RAW_JSON_URL>)
```

**Dark / light automatic** (GitHub picks based on the viewer's theme):
```html
<picture>
  <source media="(prefers-color-scheme: dark)"
          srcset="https://placard-coral.vercel.app/api/card?src=<RAW_JSON_URL>&theme=dark">
  <source media="(prefers-color-scheme: light)"
          srcset="https://placard-coral.vercel.app/api/card?src=<RAW_JSON_URL>&theme=light">
  <img alt="project card" src="https://placard-coral.vercel.app/api/card?src=<RAW_JSON_URL>">
</picture>
```

**Click-through** (the static card becomes a link to your live dashboard/site):
```md
[![project](https://placard-coral.vercel.app/api/card?src=<RAW_JSON_URL>)](https://your-site.com)
```

## Query parameters

| Param | Values | Default | Notes |
|-------|--------|---------|-------|
| `src` | raw https URL | — | **Required.** Points at your `project.json`. |
| `theme` | `dark` \| `light` | project's `theme.mode`, else `dark` | An explicit value wins (needed for `<picture>`). |
| `format` | `png` \| `svg` | `png` | PNG is recommended for GitHub. |
| `width` | `600`–`1600` | `1100` | Card width in px. |

## project.json

Minimal:
```json
{ "name": "My Project", "tagline": "does the thing", "why": "..." }
```

Every section is optional and only renders when present. Lists accept either
plain strings or `{ "label", "note", "url" }` objects. Full reference:
[`schema/project.schema.json`](schema/project.schema.json). Real example:
[`examples/saas-maker.json`](examples/saas-maker.json).

Sections: `links` · `dependencies` (external/internal) · `timeline` ·
`products` · `features` (shipped) · `roadmap` (planned/todo/deferred/blocked).

## Local development

```bash
npm install
npm run fonts                 # download Inter weights into assets/fonts/
npm run render                # renders examples/saas-maker.json -> out/dark.png
npm run render -- examples/saas-maker.json light png
npm run typecheck             # tsc --noEmit
```

Written in TypeScript. Local scripts run via `tsx`; Vercel compiles `api/*.ts`
natively, so there's still no build step.

## Deploy (Vercel)

```bash
vercel              # preview
vercel --prod       # production
```

The Inter fonts are committed under `assets/fonts/` and bundled into the
function via `includeFiles` in `vercel.json`, so no build step is required.
Re-run `npm run fonts` only to refresh them.

## Notes & limits

- **Caching:** GitHub proxies README images through Camo and caches them.
  The endpoint sets `max-age=300`, but updates can still lag — the card is
  near-live, not real-time.
- **Custom graphics** (timeline) are drawn as inline SVG inside satori's
  layout. Dependencies render as grouped chips (scannable at README scale).
- **No JS / no external resources** in the output — everything is baked into
  the image, so it renders identically everywhere.
