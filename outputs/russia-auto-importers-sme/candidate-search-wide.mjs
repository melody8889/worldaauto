const queries = [
  'site:.ru "авто из Китая" "под ключ"',
  'site:.ru "авто из Китая" "Владивосток" "контакты"',
  'site:.ru "автомобили из Китая" "под заказ" "контакты"',
  'site:.ru "доставка авто из Китая" "контакты"',
  'site:.ru "авто из Кореи" "Владивосток" "контакты"',
  'site:.ru "авто из Японии" "Китая" "Кореи" "контакты"',
  'site:.ru "параллельный импорт автомобилей" "контакты"',
  'site:.ru "растаможка авто из Китая" "контакты"',
  'site:.ru "купить авто из Китая" "под заказ"',
  'site:.ru "привезти авто из Китая" "под ключ"',
  '"garantavtoimport.ru"',
  '"asiancarway.ru"',
  '"chinaautozone.ru"',
  '"coobauto.com"',
  '"vanavto.ru"',
  '"worldcarchina.ru"',
];

function text(html) {
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
function decodeUrl(href) {
  href = href.replace(/&amp;/g, "&");
  try {
    const parsed = new URL(href);
    const u = parsed.searchParams.get("u");
    if (u?.startsWith("a1")) {
      const raw = u.slice(2).replace(/-/g, "+").replace(/_/g, "/");
      return Buffer.from(raw, "base64").toString("utf8");
    }
  } catch {}
  return href;
}
const out = [];
for (const q of queries) {
  const url = "https://www.bing.com/search?count=12&setlang=ru&q=" + encodeURIComponent(q);
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0", "accept-language": "ru,en;q=0.8" } });
  const html = await res.text();
  const blocks = [...html.matchAll(/<li class="b_algo"[\s\S]*?<\/li>/g)].map((m) => m[0]);
  for (const block of blocks) {
    const a = block.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!a) continue;
    const href = decodeUrl(a[1]);
    if (!/^https?:\/\//.test(href)) continue;
    const title = text(a[2]);
    const caption = text(block.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] || "");
    out.push({ q, title, href, caption });
  }
}
const seen = new Set();
for (const r of out) {
  let host = "";
  try { host = new URL(r.href).hostname.replace(/^www\./, ""); } catch {}
  if (!host || seen.has(host)) continue;
  seen.add(host);
  console.log(JSON.stringify({ host, ...r }, null, 0));
}
