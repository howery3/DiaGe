/**
 * Fetches the Open Graph / Twitter card image from a product URL.
 * Uses browser-like headers to avoid being blocked by retailer sites.
 * Returns null on any error or if no image meta tag is found.
 */
export async function fetchOgImage(url: string): Promise<string | null> {
  if (!url || !url.startsWith("http")) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        // No Accept-Encoding — we want plain text so we can parse it directly
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    if (!response.ok) return null;

    // Read as text (React Native handles decompression automatically)
    // Truncate in JS after reading so we don't parse the full page body
    const html = await response.text();
    const head = html.slice(0, 120_000);

    return extractImage(head, url);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function extractImage(html: string, pageUrl: string): string | null {
  // Normalise whitespace inside meta tags to simplify matching
  const normalised = html.replace(/<meta([^>]+)>/gi, (_: string, attrs: string) =>
    `<meta ${attrs.replace(/\s+/g, " ").trim()}>`
  );

  const patterns = [
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /property=["']og:image:secure_url["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image:secure_url["']/i,
    /name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
    /name=["']twitter:image:src["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*name=["']twitter:image:src["']/i,
  ];

  for (const pattern of patterns) {
    const match = normalised.match(pattern);
    if (match?.[1]) {
      const resolved = resolveUrl(match[1].trim(), pageUrl);
      if (resolved) return resolved;
    }
  }

  return null;
}

function resolveUrl(imageUrl: string, pageUrl: string): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  if (imageUrl.startsWith("//")) {
    return `https:${imageUrl}`;
  }
  try {
    const base = new URL(pageUrl);
    return new URL(imageUrl, base.origin).href;
  } catch {
    return null;
  }
}
