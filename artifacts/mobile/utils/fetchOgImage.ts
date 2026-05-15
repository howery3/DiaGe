/**
 * Attempts to fetch the Open Graph image (og:image or twitter:image) from a URL.
 * Works on iOS/Android native fetch without CORS restrictions.
 * Returns null on any error or if no image meta tag is found.
 */
export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    if (!url || !url.startsWith("http")) return null;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DiaGeBot/1.0; +https://digeapp.com)",
        Accept: "text/html",
      },
    });

    if (!response.ok) return null;
    const html = await response.text();

    // og:image — two attribute orderings
    const ogA = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    if (ogA?.[1]) return resolveUrl(ogA[1], url);

    const ogB = html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
    );
    if (ogB?.[1]) return resolveUrl(ogB[1], url);

    // twitter:image fallback
    const twA = html.match(
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
    );
    if (twA?.[1]) return resolveUrl(twA[1], url);

    const twB = html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
    );
    if (twB?.[1]) return resolveUrl(twB[1], url);

    return null;
  } catch {
    return null;
  }
}

function resolveUrl(imageUrl: string, pageUrl: string): string {
  if (imageUrl.startsWith("http")) return imageUrl;
  try {
    const base = new URL(pageUrl);
    return new URL(imageUrl, base.origin).href;
  } catch {
    return imageUrl;
  }
}
