const queries = process.argv.slice(2);
if (!queries.length) {
  console.error("Usage: node bing-search.mjs <query> [...]");
  process.exit(1);
}

function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function decodeUrl(href) {
  href = href.replace(/&amp;/g, "&");
  try {
    const parsed = new URL(href);
    const u = parsed.searchParams.get("u");
    if (u?.startsWith("a1")) {
      const raw = u.slice(2).replace(/-/g, "+").replace(/_/g, "/");
      return Buffer.from(raw, "base64").toString("utf8");
    }
  } catch {}
  return href;
}

for (const q of queries) {
  const url = "https://www.bing.com/search?count=20&setlang=ru&q=" + encodeURIComponent(q);
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "accept-language": "ru,en;q=0.8",
    },
  });
  const html = await res.text();
  console.log("\nQUERY:", q, "STATUS:", res.status);
  const blocks = [...html.matchAll(/<li class="b_algo"[\s\S]*?<\/li>/g)].map((m) => m[0]);
  for (const block of blocks.slice(0, 12)) {
    const a = block.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!a) continue;
    const title = text(a[2]);
    const href = decodeUrl(a[1]);
    const caption = text(block.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] || "");
    console.log("- " + title);
    console.log("  " + href);
    if (caption) console.log("  " + caption.slice(0, 280));
  }
}
