// Live, unauthenticated GitHub data for the stats section. Best-effort: any
// failure returns null so the card still renders without stats. The rendered
// image is edge-cached, so the API is hit rarely (well under the 60/hr limit).

export interface RepoStats {
  stars: number;
  forks: number;
  issues: number;
  pushedAt: string; // ISO
  languages: { name: string; pct: number }[];
}

const API = "https://api.github.com";

// Derive "owner/repo" from a github.com URL or an "owner/repo" string.
export function parseRepo(input: string): { owner: string; repo: string } | null {
  if (!input) return null;
  let path = input.trim();
  const m = path.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?\/?$/i);
  if (m) return { owner: m[1]!, repo: m[2]! };
  const slug = path.match(/^([\w.-]+)\/([\w.-]+)$/);
  if (slug) return { owner: slug[1]!, repo: slug[2]! };
  return null;
}

const headers = {
  accept: "application/vnd.github+json",
  "user-agent": "placard-card",
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

export async function fetchRepoStats(owner: string, repo: string): Promise<RepoStats | null> {
  try {
    const [repoRes, langRes] = await Promise.all([
      fetch(`${API}/repos/${owner}/${repo}`, { headers }),
      fetch(`${API}/repos/${owner}/${repo}/languages`, { headers }),
    ]);
    if (!repoRes.ok) return null;
    const r = (await repoRes.json()) as Record<string, unknown>;

    let languages: { name: string; pct: number }[] = [];
    if (langRes.ok) {
      const langs = (await langRes.json()) as Record<string, number>;
      const total = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
      languages = Object.entries(langs)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, bytes]) => ({ name, pct: (bytes / total) * 100 }));
    }

    return {
      stars: num(r.stargazers_count),
      forks: num(r.forks_count),
      issues: num(r.open_issues_count),
      pushedAt: typeof r.pushed_at === "string" ? r.pushed_at : "",
      languages,
    };
  } catch {
    return null;
  }
}

const num = (v: unknown): number => (typeof v === "number" ? v : 0);
