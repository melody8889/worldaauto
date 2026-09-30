import fs from "node:fs/promises";

const queries = [
  { channel: "车商/代购", q: '"авто из Китая" "контакты" "Li Auto"' },
  { channel: "车商/代购", q: '"авто из Китая" "контакты" "Zeekr"' },
  { channel: "车商/代购", q: '"авто из Китая" "контакты" "Jetour"' },
  { channel: "车商/代购", q: '"авто из Китая" "WhatsApp" "Москва"' },
  { channel: "车商/代购", q: '"авто из Китая" "Telegram" "Москва"' },
  { channel: "车商/代购", q: '"авто под заказ из Китая" "контакты"' },
  { channel: "车商/代购", q: '"китайские автомобили" "в наличии" "контакты" "Москва"' },
  { channel: "车商/代购", q: '"Li Auto" "в наличии" "контакты" "Москва"' },
  { channel: "车商/代购", q: '"Zeekr" "в наличии" "контакты" "Москва"' },
  { channel: "车商/代购", q: '"Jetour T2" "в наличии" "контакты" "Россия"' },
  { channel: "物流清关", q: '"доставка авто из Китая" "таможенное оформление" "контакты"' },
  { channel: "物流清关", q: '"растаможка авто из Китая" "контакты"' },
  { channel: "物流清关", q: '"автовоз из Китая" "контакты" "Россия"' },
  { channel: "物流清关", q: '"доставка автомобилей из Китая" "WhatsApp"' },
  { channel: "售后配件", q: '"запчасти для китайских автомобилей" "контакты" "Москва"' },
  { channel: "售后配件", q: '"сервис китайских автомобилей" "контакты" "Москва"' },
  { channel: "售后配件", q: '"Li Auto" "сервис" "контакты" "Москва"' },
  { channel: "售后配件", q: '"Zeekr" "сервис" "контакты" "Москва"' },
];

function stripTags(html) {
  return html
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

function extractItems(xml, channel, query) {
  const items = [];
  for (const block of xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)) {
    const raw = block[1];
    const pick = (tag) => {
      const m = raw.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return m ? stripTags(m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "")) : "";
    };
    items.push({
      channel,
      query,
      title: pick("title"),
      link: pick("link"),
      snippet: pick("description"),
      pubDate: pick("pubDate"),
    });
  }
  return items;
}

const all = [];
for (const { channel, q } of queries) {
  const url = `https://www.bing.com/search?format=rss&mkt=ru-RU&setlang=ru&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    const text = await res.text();
    all.push(...extractItems(text, channel, q));
    await new Promise((resolve) => setTimeout(resolve, 250));
  } catch (err) {
    all.push({ channel, query: q, title: "FETCH_ERROR", link: "", snippet: String(err), pubDate: "" });
  }
}

const seen = new Set();
const deduped = all.filter((item) => {
  const key = item.link || item.title;
  if (!key || seen.has(key)) return false;
  seen.add(key);
  return true;
});

await fs.writeFile(
  "outputs/russia-nontraditional-leads/candidates.json",
  JSON.stringify(deduped, null, 2),
  "utf8",
);
await fs.writeFile(
  "outputs/russia-nontraditional-leads/candidates.tsv",
  deduped.map((x) => [x.channel, x.title, x.link, x.snippet, x.query].join("\t")).join("\n"),
  "utf8",
);

console.log(`saved ${deduped.length} candidates`);
