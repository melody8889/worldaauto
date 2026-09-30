const queries = [
  '"авто из Китая под ключ" "контакты"',
  '"авто из Китая под заказ" "контакты"',
  '"доставка авто из Китая" "контакты"',
  '"параллельный импорт" "автомобили" "контакты"',
  '"авто из Кореи" "Владивосток" "контакты"',
  '"импорт автомобилей" "ООО" "контакты"',
  '"китайские автомобили" "официальный импортер" "ООО"',
  '"HS Code 8703" "Russia" "importers" "Volza"',
  '"Cars Importers in Russia" "Volza"',
  '"Vehicle Importers in Russia" "shipment data"',
];

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function decodeGoogleUrl(url) {
  try {
    if (url.startsWith("/url?")) {
      const parsed = new URL("https://www.google.com" + url);
      return parsed.searchParams.get("q") || url;
    }
  } catch {}
  return url;
}

for (const q of queries) {
  const url = "https://www.bing.com/search?count=10&setlang=ru&q=" + encodeURIComponent(q);
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      "accept": "text/html,application/xhtml+xml",
    },
  });
  const html = await res.text();
  console.log("\nQUERY:", q, "STATUS:", res.status);
  const matches = [
    ...html.matchAll(/<li class="b_algo"[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g),
    ...html.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g),
  ];
  const seen = new Set();
  let count = 0;
  for (const m of matches) {
    const href = decodeGoogleUrl(m[1]);
    if (!href.startsWith("http") || href.includes("google.")) continue;
    const text = stripTags(m[2]);
    if (!text || seen.has(href)) continue;
    seen.add(href);
    console.log("-", text.slice(0, 180));
    console.log(" ", href);
    if (++count >= 8) break;
  }
}
