const queries = [
  "site:52wmb.com 俄罗斯 汽车 进口商",
  "site:52wmb.com Russia car importer",
  "site:52wmb.com Russia vehicle importer",
  "site:en.52wmb.com Russia car buyer",
  "site:en.52wmb.com Russia vehicle buyer",
  "site:volza.com/p/car/import/import-in-russia",
  "site:volza.com/company-profile Russia car importer LLC",
  "site:volza.com Russia car buyer LLC",
  "site:importgenius.com Russia car importer LLC",
  "site:importgenius.com Russia vehicle importer",
];

function decode(s = "") {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

for (const q of queries) {
  const url = "https://www.bing.com/search?format=rss&setlang=en&q=" + encodeURIComponent(q);
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  const xml = await res.text();
  console.log("\nQ", q);
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const item = m[1];
    const get = (tag) => decode(item.match(new RegExp("<" + tag + ">([\\s\\S]*?)<\\/" + tag + ">"))?.[1]);
    console.log("-", get("title"), "|", get("link"), "|", get("description").slice(0, 180), "|", get("pubDate"));
  }
}
