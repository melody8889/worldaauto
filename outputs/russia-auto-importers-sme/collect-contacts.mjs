import fs from "node:fs/promises";

const seeds = [
  "garantavtoimport.ru",
  "asiancarway.ru",
  "chinaautozone.ru",
  "coobauto.com",
  "vanavto.ru",
  "worldcarchina.ru",
  "nextcars.io",
  "carmaple.com",
  "chinacar.club",
  "china-car.ru",
  "china-motors.ru",
  "auto-importer.ru",
  "avtoizkitaya.ru",
  "imperial-auto.ru",
  "sfera-car.ru",
  "kimuracars.ru",
  "jet-auto.ru",
  "auto-asia.ru",
  "vladivostok-auto.ru",
  "dv-auto.ru",
  "japantransit.ru",
  "carwin.ru",
  "china-auto.ru",
  "globaldrive.ru",
  "autochina77.ru",
  "autochina-msk.ru",
  "chinaautoimport.ru",
  "china-auto-import.ru",
];

const paths = ["/", "/contacts/", "/contact/", "/kontakty/", "/about/", "/o-kompanii/"];

function cleanText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#43;/g, "+")
    .replace(/\s+/g, " ")
    .trim();
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

async function fetchText(url) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 10000);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      redirect: "follow",
      headers: {
        "user-agent": "Mozilla/5.0",
        "accept-language": "ru,en;q=0.8",
      },
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, url: res.url, body };
  } catch (e) {
    return { ok: false, status: 0, url, body: "", error: e.message };
  } finally {
    clearTimeout(t);
  }
}

const out = [];
for (const host of seeds) {
  const pages = [];
  for (const protocol of ["https://", "http://"]) {
    for (const path of paths) {
      const r = await fetchText(protocol + host + path);
      if (r.ok && r.body.length > 500) pages.push(r);
      if (pages.length >= 3) break;
    }
    if (pages.length) break;
  }
  const merged = cleanText(pages.map((p) => p.body).join(" "));
  const phones = uniq((merged.match(/(?:\+7|8)\s*[\( -]?\d{3}[\) -]?\s*\d{3}[\s-]?\d{2}[\s-]?\d{2}/g) || [])
    .map((s) => s.replace(/\s+/g, " ").trim())).slice(0, 5);
  const emails = uniq((merged.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [])
    .map((s) => s.toLowerCase())).slice(0, 5);
  const hasImport = /импорт|растамож|тамож|сбктс|эптс|достав|выкуп|китая|кореи|японии/i.test(merged);
  out.push({
    host,
    ok: pages.length > 0,
    urls: pages.map((p) => p.url),
    phones,
    emails,
    hasImport,
    snippet: merged.slice(0, 300),
  });
}

await fs.writeFile("candidate-contact-scan.json", JSON.stringify(out, null, 2), "utf8");
console.log(JSON.stringify(out, null, 2));
