import fs from "node:fs/promises";

const queries = [
  ["车商/代购", '"авто из Китая" "под заказ" "+7"'],
  ["车商/代购", '"заказать авто из Китая" "+7" "Москва"'],
  ["车商/代购", '"Li Auto" "Lixiang" "+7" "Москва"'],
  ["车商/代购", '"Zeekr" "+7" "Москва" "контакты"'],
  ["车商/代购", '"Avatr" "+7" "Москва" "контакты"'],
  ["车商/代购", '"Voyah" "+7" "Москва" "контакты"'],
  ["物流清关", '"доставка авто из Китая" "+7" "растаможка"'],
  ["物流清关", '"таможенное оформление авто из Китая" "+7"'],
  ["售后配件", '"сервис китайских автомобилей" "+7" "Москва"'],
  ["售后配件", '"ремонт Zeekr" "+7" "Москва"'],
  ["售后配件", '"ремонт Li Auto" "+7" "Москва"'],
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

const rows = [];
let idx = 0;
for (const [channel, q] of queries) {
  const url = `https://www.google.com/search?hl=ru&num=10&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
      "accept-language": "ru-RU,ru;q=0.9,en;q=0.5",
    },
  });
  const html = await res.text();
  await fs.writeFile(`outputs/russia-nontraditional-leads/google-${idx++}.html`, html, "utf8");
  for (const m of html.matchAll(/<a href="\/url\?q=([^"&]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g)) {
    const link = decodeURIComponent(m[1]);
    const title = clean(m[2]);
    if (title && !title.includes("Повторите попытку")) rows.push({ channel, query: q, title, link, snippet: "" });
  }
  await new Promise((r) => setTimeout(r, 1000));
}

const seen = new Set();
const out = rows.filter((r) => {
  if (!/^https?:\/\//.test(r.link)) return false;
  const host = new URL(r.link).hostname;
  if (/google|youtube|webcache|accounts|support|translate/.test(host)) return false;
  const k = host + "|" + r.title;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});
await fs.writeFile("outputs/russia-nontraditional-leads/google-candidates.json", JSON.stringify(out, null, 2), "utf8");
await fs.writeFile(
  "outputs/russia-nontraditional-leads/google-candidates.tsv",
  out.map((r) => [r.channel, r.title, r.link, r.query].join("\t")).join("\n"),
  "utf8",
);
console.log(`saved ${out.length}`);
