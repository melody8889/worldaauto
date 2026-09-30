const queries = [
  "авто из Китая под ключ контакты",
  "авто из Китая под заказ контакты",
  "доставка авто из Китая контакты",
  "импорт авто из Китая под ключ контакты",
  "привезти авто из Китая под ключ контакты",
  "авто из Кореи Владивосток контакты",
  "авто из Японии Кореи Китая Владивосток контакты",
  "параллельный импорт автомобилей контакты",
  "растаможка авто из Китая контакты",
  "купить авто из Китая Россия контакты",
  "автомобили из Китая в Россию под ключ контакты",
  "импорт автомобилей из Китая Россия компания контакты",
];

function decodeXml(s = "") {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const seen = new Set();
for (const q of queries) {
  const url = "https://www.bing.com/search?format=rss&setlang=ru&q=" + encodeURIComponent(q);
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0", "accept-language": "ru" } });
  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  for (const item of items) {
    const title = decodeXml(item[1].match(/<title>([\s\S]*?)<\/title>/)?.[1] || "");
    const link = decodeXml(item[1].match(/<link>([\s\S]*?)<\/link>/)?.[1] || "");
    const description = decodeXml(item[1].match(/<description>([\s\S]*?)<\/description>/)?.[1] || "");
    const pubDate = decodeXml(item[1].match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "");
    let host = "";
    try { host = new URL(link).hostname.replace(/^www\./, ""); } catch {}
    if (!host || seen.has(host)) continue;
    seen.add(host);
    console.log(JSON.stringify({ host, title, link, description, pubDate, query: q }));
  }
}
