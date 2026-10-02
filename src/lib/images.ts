const PLACEHOLDER_BASE = "https://placehold.co";

/**
 * Fallback poster path, used only when a movie has no downloaded poster.
 * The .png matters: placehold.co defaults to SVG, which next/image refuses.
 */
export function placeholderPath(title: string): string {
  const text = encodeURIComponent(title).replace(/%20/g, "+");
  return `/342x513/1e293b/e2e8f0.png?text=${text}`;
}

/**
 * Returns the stored poster path (a local file under /public) or a remote
 * placeholder fallback.
 */
export function posterUrl(path: string | null, title: string): string {
  if (path) {
    return path;
  }

  return `${PLACEHOLDER_BASE}${placeholderPath(title)}`;
}
