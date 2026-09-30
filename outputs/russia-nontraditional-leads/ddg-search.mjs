import fs from "node:fs/promises";

const queries = [
  ["车商/代购", '"авто из Китая" "под заказ" "Li Auto" "тел"'],
  ["车商/代购", '"авто из Китая" "Zeekr" "тел"'],
  ["车商/代购", '"Lixiang" "Zeekr" "Voyah" "Москва" "тел"'],
  ["车商/代购", '"электромобили из Китая" "под заказ" "тел"'],
  ["车商/代购", '"авто из китая" "whatsapp" "telegram" "москва"'],
  ["物流清关", '"доставка авто из Китая" "растаможка" "тел"'],
  ["物流清关", '"автовоз" "Китай" "Россия" "автомобили" "тел"'],
  ["物流清关", '"логистика" "авто из Китая" "таможенное оформление"'],
  ["售后配件", '"сервис китайских автомобилей" "Москва" "тел"'],
  ["售后配件", '"ремонт Li Auto" "Москва" "тел"'],
  ["售后配件", '"ремонт Zeekr" "Москва" "тел"'],
  ["售后配件", '"запчасти для китайских автомобилей" "Москва" "тел"'],
];

function clean(s) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

const rows = [];
for (const [channel, q] of queries) {
  const body = new URLSearchParams({ q, kl: "ru-ru" });
  const res = await fetch("https://html.duckduckgo.com/html/", {
    method: "POST",
    body,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": "Mozilla/5.0",
    },
  });
  const html = await res.text();
  const blocks = html.split(/<div class="result /g).slice(1);
  for (const b of blocks) {
    const a = b.match(/<a rel="nofollow" class="result__a" href="([^"]+)">([\s\S]*?)<\/a>/);
    if (!a) continue;
    const u = new URL(a[1].replace(/&amp;/g, "&"), "https://duckduckgo.com");
    const link = u.searchParams.get("uddg") || a[1].replace(/&amp;/g, "&");
    const snippet = (b.match(/<a class="result__snippet"[\s\S]*?>([\s\S]*?)<\/a>/) || [null, ""])[1];
    rows.push({ channel, query: q, title: clean(a[2]), link, snippet: clean(snippet) });
  }
  await new Promise((r) => setTimeout(r, 600));
}

const seen = new Set();
const out = rows.filter((r) => {
  const k = r.link || r.title;
  if (!k || seen.has(k)) return false;
  seen.add(k);
  return true;
});

await fs.writeFile("outputs/russia-nontraditional-leads/ddg-candidates.json", JSON.stringify(out, null, 2), "utf8");
await fs.writeFile(
  "outputs/russia-nontraditional-leads/ddg-candidates.tsv",
  out.map((r) => [r.channel, r.title, r.link, r.snippet, r.query].join("\t")).join("\n"),
  "utf8",
);
console.log(`saved ${out.length}`);
