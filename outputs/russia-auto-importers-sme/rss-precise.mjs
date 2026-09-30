const queries = [
  "site:.ru авто из Китая под ключ контакты",
  "site:.ru авто из Китая с доставкой в Россию",
  "site:.ru импорт авто из Китая под ключ",
  "site:.ru привезем авто из Китая под ключ",
  "site:.ru купить авто из Китая под ключ",
  "site:.ru авто из Кореи под ключ Владивосток",
  "site:.ru авто из Японии под ключ Владивосток",
  "site:.ru параллельный импорт автомобилей Россия",
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
  const url = "https://www.bing.com/search?format=rss&setlang=ru&cc=ru&q=" + encodeURIComponent(q);
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      "accept-language": "ru-RU,ru;q=0.9,en;q=0.5",
    },
  });
  const xml = await res.text();
  console.log("\nQ", q);
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const item = m[1];
    const get = (tag) => decode(item.match(new RegExp("<" + tag + ">([\\s\\S]*?)<\\/" + tag + ">"))?.[1]);
    console.log("-", get("title"), "|", get("link"), "|", get("description").slice(0, 160), "|", get("pubDate"));
  }
}
