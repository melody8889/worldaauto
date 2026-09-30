import fs from "node:fs/promises";

const urls = [
  ["车商/代购", "Li Auto Russia official distributor", "https://liautoofficial.ru/"],
  ["车商/代购", "Okami Li Auto Ekaterinburg", "https://okami-liauto.ru/"],
  ["车商/代购", "Li Motors dealer Ekaterinburg", "https://li-motors.ru/dealers/ekaterinburg"],
  ["车商/代购", "Li Motors", "https://li-motors.ru/"],
  ["车商/代购", "Drom Li L9 Russia listings", "https://auto.drom.ru/li/l9/"],
  ["车商/代购", "Drom Li Russia listings", "https://auto.drom.ru/li/"],
  ["车商/代购", "Auto.ru Chinese cars order entry", "https://auto.ru/"],
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

function extract(html) {
  const text = clean(html);
  const phones = [...new Set([...text.matchAll(/(?:\+7|8)\s?\(?\d{3,5}\)?[\s-]?\d{2,3}[\s-]?\d{2}[\s-]?\d{2}/g)].map((m) => m[0]))];
  const emails = [...new Set([...html.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)].map((m) => m[0]))];
  const tg = [...new Set([...html.matchAll(/https?:\/\/t\.me\/[A-Za-z0-9_+/.-]+/g)].map((m) => m[0]))];
  const vk = [...new Set([...html.matchAll(/https?:\/\/vk\.com\/[A-Za-z0-9_./-]+/g)].map((m) => m[0]))];
  return { text: text.slice(0, 1200), phones, emails, tg, vk };
}

const out = [];
for (const [channel, name, url] of urls) {
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    const html = await res.text();
    const info = extract(html);
    out.push({ channel, name, url, status: res.status, ...info });
  } catch (err) {
    out.push({ channel, name, url, status: "ERR", error: String(err), phones: [], emails: [], tg: [], vk: [], text: "" });
  }
}
await fs.writeFile("outputs/russia-nontraditional-leads/verified-pages.json", JSON.stringify(out, null, 2), "utf8");
console.log(JSON.stringify(out, null, 2));
