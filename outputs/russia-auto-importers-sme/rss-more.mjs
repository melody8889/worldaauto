const queries = [
  '"Авто из Китая под ключ" "Москва"',
  '"Авто из Китая под ключ" "Владивосток"',
  '"Авто из Китая под ключ" "Санкт-Петербург"',
  '"Купить авто из Китая" "под ключ" "Россия"',
  '"Импорт авто из Китая" "под ключ"',
  '"Авто из Кореи под ключ" "Владивосток"',
  '"Авто из Японии под ключ" "Владивосток"',
  '"Доставка авто из Китая" "растаможка"',
  '"Авто из Китая" "ЭПТС" "СБКТС"',
  '"Авто из Китая" "таможенное оформление"',
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
  const url = "https://www.bing.com/search?format=rss&setlang=ru&q=" + encodeURIComponent(q);
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0", "accept-language": "ru" } });
  const xml = await res.text();
  console.log("\nQ", q);
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const item = m[1];
    const get = (tag) => decode(item.match(new RegExp("<" + tag + ">([\\s\\S]*?)<\\/" + tag + ">"))?.[1]);
    console.log("-", get("title"), "|", get("link"), "|", get("description").slice(0, 160), "|", get("pubDate"));
  }
}
