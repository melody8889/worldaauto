import fs from "node:fs/promises";

const queries = [
  ["车商/代购", "заказать автомобиль из китая москва контакты"],
  ["车商/代购", "подбор авто из китая москва контакты"],
  ["车商/代购", "авто из китая владивосток контакты"],
  ["车商/代购", "авто из китая новосибирск контакты"],
  ["车商/代购", "авто из китая екатеринбург контакты"],
  ["车商/代购", "zeekr москва официальный дилер контакты"],
  ["车商/代购", "voyah москва дилер контакты"],
  ["车商/代购", "avatr москва дилер контакты"],
  ["车商/代购", "tank москва дилер контакты"],
  ["车商/代购", "jetour t2 москва дилер контакты"],
  ["物流清关", "растаможка авто из китая москва контакты"],
  ["物流清关", "доставка авто из китая владивосток москва контакты"],
  ["物流清关", "таможенный брокер авто из китая контакты"],
  ["售后配件", "сервис zeekr москва контакты"],
  ["售后配件", "сервис lixiang москва контакты"],
  ["售后配件", "сервис voyah москва контакты"],
  ["售后配件", "запчасти lixiang москва контакты"],
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
for (const [channel, q] of queries) {
  const url = `https://www.bing.com/search?mkt=ru-RU&setlang=ru&cc=ru&count=12&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0", "accept-language": "ru-RU,ru;q=0.9,en;q=0.5" } });
  const html = await res.text();
  for (const m of html.matchAll(/<li class="b_algo"[\s\S]*?<\/li>/g)) {
    const block = m[0];
    const linkMatch = block.match(/<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch) continue;
    const title = clean(linkMatch[2]);
    const link = decodeBingUrl(linkMatch[1]);
    const snippetMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const snippet = snippetMatch ? clean(snippetMatch[1]) : "";
    rows.push({ channel, query: q, title, link, snippet });
  }
  await new Promise((r) => setTimeout(r, 350));
}

const bad = /(microsoft|support\.google|reddit|stackoverflow|wikipedia|amazon|skyscanner|answers\.|facebook\.com$|youtube|finance|marketwatch|yahoo|linkedin|vk\.com\/wall|tenforums|community|bank of america|toronto|tumbex|dairyscience|clutchfans)/i;
const seen = new Set();
const out = rows.filter((r) => {
  if (!r.link || bad.test(`${r.title} ${r.link} ${r.snippet}`)) return false;
  const k = new URL(r.link).hostname.replace(/^www\./, "") + "|" + r.title;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

await fs.writeFile("outputs/russia-nontraditional-leads/more-candidates.json", JSON.stringify(out, null, 2), "utf8");
await fs.writeFile(
  "outputs/russia-nontraditional-leads/more-candidates.tsv",
  out.map((r) => [r.channel, r.title, r.link, r.snippet, r.query].join("\t")).join("\n"),
  "utf8",
);
console.log(`saved ${out.length}`);
