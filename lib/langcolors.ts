// GitHub's language colors (subset of common languages). Fallback for unknown.
const COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Astro: "#ff5a03",
  Elixir: "#6e4a7e",
  Scala: "#c22d40",
  Lua: "#000080",
  Zig: "#ec915c",
  Nix: "#7e7eff",
  MDX: "#fcb32c",
  Dockerfile: "#384d54",
};

const FALLBACK = ["#3178c6", "#3fb950", "#d29922", "#a371f7", "#f85149"];

export function langColor(name: string, i = 0): string {
  return COLORS[name] ?? FALLBACK[i % FALLBACK.length]!;
}
