import fs from "node:fs/promises";

const queries = [
  ["车商/代购", "авто из Китая под заказ Li Auto Zeekr контакты"],
  ["车商/代购", "авто из Китая под заказ Москва телефон"],
  ["车商/代购", "электромобили из Китая Zeekr Avatr Voyah телефон"],
  ["车商/代购", "купить Zeekr в Москве дилер телефон"],
  ["车商/代购", "купить Lixiang в Москве дилер телефон"],
  ["车商/代购", "Jetour T2 из Китая под заказ телефон"],
  ["物流清关", "доставка авто из Китая растаможка телефон"],
  ["物流清关", "таможенное оформление авто из Китая телефон"],
  ["物流清关", "логистика автомобилей Китай Россия телефон"],
  ["售后配件", "сервис китайских автомобилей Москва телефон"],
  ["售后配件", "ремонт электромобилей Zeekr Li Auto Москва телефон"],
  ["售后配件", "запчасти для китайских автомобилей Москва телефон"],
];

function clean(s) {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

const rows = [];
for (const [channel, text] of queries) {
  const url = `https://yandex.ru/search/?text=${encodeURIComponent(text)}&lr=213`;
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "accept-language": "ru,en;q=0.8",
      },
    });
    const html = await res.text();
    await fs.writeFile(`outputs/russia-nontraditional-leads/yandex-${rows.length}.html`, html, "utf8");
    const regexes = [
      /<li[^>]+class="[^"]*serp-item[^"]*"[\s\S]*?<\/li>/g,
      /<div[^>]+class="[^"]*Organic[^"]*"[\s\S]*?<\/div>\s*<\/div>/g,
    ];
    for (const re of regexes) {
      for (const m of html.matchAll(re)) {
        const block = m[0];
        const a = block.match(/<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
        if (!a) continue;
        const title = clean(a[2]);
        const snippet = clean(block).slice(0, 700);
        if (title) rows.push({ channel, query: text, title, link: a[1].replace(/&amp;/g, "&"), snippet });
      }
    }
  } catch (err) {
    rows.push({ channel, query: text, title: "ERROR", link: "", snippet: String(err) });
  }
  await new Promise((r) => setTimeout(r, 800));
}

const seen = new Set();
const out = rows.filter((r) => {
  const k = `${r.title}|${r.link}`;
  if (!r.link || seen.has(k)) return false;
  seen.add(k);
  return true;
});

await fs.writeFile("outputs/russia-nontraditional-leads/yandex-candidates.json", JSON.stringify(out, null, 2), "utf8");
await fs.writeFile(
  "outputs/russia-nontraditional-leads/yandex-candidates.tsv",
  out.map((r) => [r.channel, r.title, r.link, r.snippet, r.query].join("\t")).join("\n"),
  "utf8",
);
console.log(`saved ${out.length}`);
