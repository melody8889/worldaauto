import fs from "node:fs/promises";

const queries = [
  ["车商/代购", "авто из Китая под заказ контакты сайт"],
  ["车商/代购", "авто из Китая Москва Li Auto Zeekr контакты"],
  ["车商/代购", "электромобили из Китая под заказ контакты"],
  ["车商/代购", "Lixiang Zeekr Voyah из Китая автосалон контакты"],
  ["车商/代购", "site:*.ru авто из Китая под заказ контакты"],
  ["物流清关", "доставка авто из Китая растаможка контакты"],
  ["物流清关", "логистика авто из Китая Россия контакты"],
  ["物流清关", "автовоз Китай Россия автомобили контакты"],
  ["售后配件", "сервис Li Auto Zeekr Москва контакты"],
  ["售后配件", "запчасти Li Auto Zeekr Москва контакты"],
  ["售后配件", "сервис китайских автомобилей Москва контакты"],
];

function clean(s) {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeBingUrl(href) {
  if (!href) return "";
  href = href.replace(/&amp;/g, "&");
  if (href.startsWith("/ck/a") || href.startsWith("https://www.bing.com/ck/a")) {
    const u = new URL(href.startsWith("http") ? href : `https://www.bing.com${href}`);
    const raw = u.searchParams.get("u");
    if (raw?.startsWith("a1")) {
      try {
        return Buffer.from(raw.slice(2), "base64url").toString("utf8");
      } catch {}
    }
  }
  return href.startsWith("http") ? href : "";
}

const rows = [];
for (const [channel, query] of queries) {
  const url = `https://www.bing.com/search?mkt=ru-RU&setlang=ru&count=20&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  const html = await res.text();
  for (const m of html.matchAll(/<li class="b_algo"[\s\S]*?<\/li>/g)) {
    const block = m[0];
    const linkMatch = block.match(/<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch) continue;
    const title = clean(linkMatch[2]);
    const link = decodeBingUrl(linkMatch[1]);
    const snippetMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const snippet = snippetMatch ? clean(snippetMatch[1]) : "";
    rows.push({ channel, query, title, link, snippet });
  }
  await new Promise((r) => setTimeout(r, 350));
}

const seen = new Set();
const out = rows.filter((r) => {
  const k = r.link || r.title;
  if (!k || seen.has(k)) return false;
  seen.add(k);
  return true;
});
await fs.writeFile("outputs/russia-nontraditional-leads/html-candidates.json", JSON.stringify(out, null, 2), "utf8");
await fs.writeFile(
  "outputs/russia-nontraditional-leads/html-candidates.tsv",
  out.map((r) => [r.channel, r.title, r.link, r.snippet, r.query].join("\t")).join("\n"),
  "utf8",
);
console.log(`saved ${out.length}`);
