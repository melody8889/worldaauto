import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import playwright from "file:///C:/Users/Melody/AppData/Local/OpenAI/Codex/runtimes/cua_node/1b23c930bdf84ed6/bin/node_modules/playwright/index.js";

const { chromium } = playwright;
const root = process.cwd();
const outputDir = path.join(root, "outputs", "worlda-social-video");
const previewDir = path.join(outputDir, "preview-frames");
const output = path.join(outputDir, "worlda-global-auto-tiktok-instagram.mp4");
const cover = path.join(outputDir, "worlda-global-auto-cover.png");
const scriptFile = path.join(outputDir, "english-voiceover-script.txt");
const logoPath = "D:/2. Worlda Global Limited/logo/定稿/logo(1).png";

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(previewDir, { recursive: true });

fs.writeFileSync(scriptFile, [
  "Import cars from China without supplier risk.",
  "Worlda Global Auto helps overseas dealers and importers source reliable vehicles from China.",
  "We provide new cars, used cars, luxury SUVs, Chinese EVs, pickups, spare parts, and SKD solutions.",
  "From model selection and stock confirmation to export documents, inspection updates, and shipment follow-up, we keep every step clear.",
  "Tap our profile to see more models.",
  "Visit worldaauto.com or contact sales01@worldaauto.com.",
  "Wechat and WhatsApp: plus eighty-six, one three eight, one zero seven one, zero zero six one."
].join("\n"), "utf8");

const html = String.raw`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #101010; }
    canvas { display: block; width: 360px; height: 640px; }
  </style>
</head>
<body>
<canvas id="canvas" width="1080" height="1920"></canvas>
<script>
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const W = 1080;
const H = 1920;
const FPS = 30;
const TOTAL = 28;

const assets = {
  logo: "/logo.png",
  banner: "/assets/videos/company-banner.mp4",
  benz: "/assets/videos/Benz.mp4",
  stockA: "/assets/proof-video/stock-yard-a.mp4",
  stockB: "/assets/proof-video/stock-yard-b.mp4",
  loading: "/assets/videos/loading%20container.mp4",
  exportLoading: "/assets/proof-video/loading.mp4",
  luxury: "/assets/products/land-rover-range-rover/main.jpg",
  lexus: "/assets/products/lexus-lx600/main.jpg",
  mercedes: "/assets/products/Mercedes-%20GLS450/main.png",
  ev: "/assets/products/byd-song-plus-dmi/main.png",
  pickup: "/assets/products/tank-700/main.jpg",
  economy: "/assets/products/toyota-corolla/main.jpg",
  parts: "/assets/categories/auto-spare-parts.jpg",
  skd: "/assets/categories/skd-car-kits.jpg",
  docs: "/assets/proof-video/customs-declaration.png"
};

const scenes = [
  {
    start: 0, end: 3, kind: "video", src: "stockA", zoom: 1.13,
    eyebrow: "CHINA AUTO EXPORT",
    title: "Import cars from China without supplier risk.",
    sub: "Verified supply for overseas dealers and importers.",
    cta: "See more models on our profile",
    align: "hero"
  },
  {
    start: 3, end: 7, kind: "grid", src: ["luxury", "ev", "pickup", "economy"],
    eyebrow: "ALL CATEGORIES",
    title: "One source. More vehicle options.",
    sub: "New cars, used cars, luxury SUVs, EVs, pickups and more.",
    cta: "See more models on our profile"
  },
  {
    start: 7, end: 11, kind: "video", src: "benz", zoom: 1.12,
    eyebrow: "DEALER-READY MODELS",
    title: "Premium stock for serious buyers.",
    sub: "Model, trim, color and availability confirmed before quote.",
    cta: "See more models on our profile"
  },
  {
    start: 11, end: 15, kind: "video", src: "stockB", zoom: 1.1,
    eyebrow: "REAL STOCK CHECK",
    title: "Evidence before you commit.",
    sub: "Photo and video updates help reduce sourcing uncertainty.",
    cta: "See more models on our profile"
  },
  {
    start: 15, end: 19, kind: "image", src: "docs", zoom: 1.03,
    eyebrow: "EXPORT SUPPORT",
    title: "Clear process from quote to shipment.",
    sub: "Documents, inspection updates and shipping follow-up arranged.",
    cta: "More models on our profile"
  },
  {
    start: 19, end: 23.5, kind: "video", src: "loading", zoom: 1.13,
    eyebrow: "GLOBAL DELIVERY",
    title: "Built for importers who need reliability.",
    sub: "We support dealers, traders and fleet buyers worldwide.",
    cta: "See more models on our profile"
  },
  {
    start: 23.5, end: 28, kind: "closing",
    eyebrow: "WORLDA GLOBAL AUTO",
    title: "More models on our profile.",
    sub: "Request available stock, export prices and shipping options.",
    cta: "www.worldaauto.com"
  }
];

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function loadVideo(src) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.loop = true;
    video.onloadedmetadata = () => resolve(video);
    video.onerror = reject;
    video.src = src;
    video.load();
  });
}

function mediaSize(media) {
  return {
    w: media.videoWidth || media.naturalWidth,
    h: media.videoHeight || media.naturalHeight
  };
}

function drawCover(media, zoom = 1, drift = 0) {
  const s = mediaSize(media);
  const scale = Math.max(W / s.w, H / s.h) * zoom;
  const w = s.w * scale;
  const h = s.h * scale;
  const x = (W - w) / 2 + Math.sin(drift * 0.8) * 18;
  const y = (H - h) / 2 + Math.cos(drift * 0.6) * 14;
  ctx.drawImage(media, x, y, w, h);
}

function roundRect(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function wrap(text, maxWidth, font) {
  ctx.font = font;
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function textBlock(scene, t) {
  const x = 58;
  const isHero = scene.align === "hero";
  const y = isHero ? 1070 : 1065;
  const w = W - 116;
  ctx.save();
  ctx.fillStyle = "rgba(6, 8, 10, .68)";
  roundRect(38, y - 92, W - 76, isHero ? 430 : 400, 8);
  ctx.fill();
  ctx.fillStyle = "#d8b775";
  ctx.font = "800 30px Arial";
  ctx.fillText(scene.eyebrow, x, y - 34);
  const titleFont = isHero ? "900 64px Arial" : "900 58px Arial";
  const titleLines = wrap(scene.title, w, titleFont).slice(0, 3);
  ctx.fillStyle = "#ffffff";
  ctx.font = titleFont;
  let ty = y + 38;
  for (const line of titleLines) {
    ctx.fillText(line, x, ty);
    ty += isHero ? 70 : 64;
  }
  const subFont = "500 34px Arial";
  ctx.font = subFont;
  ctx.fillStyle = "rgba(255,255,255,.93)";
  for (const line of wrap(scene.sub, w, subFont).slice(0, 2)) {
    ctx.fillText(line, x, ty + 18);
    ty += 44;
  }
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(216,183,117,.9)";
  ctx.lineWidth = 2;
  roundRect(x, y + 285, 640, 74, 8);
  ctx.stroke();
  ctx.font = "800 28px Arial";
  ctx.fillText(scene.cta, x + 28, y + 333);
  ctx.restore();
}

function drawShade() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(0,0,0,.48)");
  g.addColorStop(.34, "rgba(0,0,0,.05)");
  g.addColorStop(.72, "rgba(0,0,0,.18)");
  g.addColorStop(1, "rgba(0,0,0,.76)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function drawWatermark(logo) {
  const maxW = 236;
  const scale = maxW / logo.naturalWidth;
  const w = logo.naturalWidth * scale;
  const h = logo.naturalHeight * scale;
  ctx.save();
  ctx.globalAlpha = .92;
  ctx.fillStyle = "rgba(255,255,255,.74)";
  roundRect(W - w - 58, 34, w + 34, h + 24, 6);
  ctx.fill();
  ctx.shadowColor = "rgba(0,0,0,.22)";
  ctx.shadowBlur = 8;
  ctx.drawImage(logo, W - w - 41, 46, w, h);
  ctx.restore();
}

function drawFooter() {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,.7)";
  ctx.fillRect(0, H - 94, W, 94);
  ctx.fillStyle = "#fff";
  ctx.font = "700 27px Arial";
  ctx.fillText("www.worldaauto.com", 44, H - 36);
  ctx.textAlign = "right";
  ctx.fillText("sales01@worldaauto.com", W - 44, H - 36);
  ctx.restore();
}

function drawGrid(scene, loaded, localT) {
  const imgs = scene.src.map(k => loaded.images[k]);
  const gap = 18;
  const cellW = (W - 96 - gap) / 2;
  const cellH = 420;
  const top = 170;
  ctx.fillStyle = "#101214";
  ctx.fillRect(0, 0, W, H);
  const labels = ["Luxury SUVs", "Chinese EVs", "Pickups", "Used Cars"];
  imgs.forEach((img, i) => {
    const x = 48 + (i % 2) * (cellW + gap);
    const y = top + Math.floor(i / 2) * (cellH + gap);
    ctx.save();
    roundRect(x, y, cellW, cellH, 8);
    ctx.clip();
    drawCoverIn(img, x, y, cellW, cellH, 1.04 + localT * .004);
    const grad = ctx.createLinearGradient(0, y + cellH * .45, 0, y + cellH);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,.7)");
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, cellW, cellH);
    ctx.fillStyle = "#fff";
    ctx.font = "800 30px Arial";
    ctx.fillText(labels[i], x + 22, y + cellH - 34);
    ctx.restore();
  });
}

function drawCoverIn(media, x, y, boxW, boxH, zoom = 1) {
  const s = mediaSize(media);
  const scale = Math.max(boxW / s.w, boxH / s.h) * zoom;
  const w = s.w * scale;
  const h = s.h * scale;
  ctx.drawImage(media, x + (boxW - w) / 2, y + (boxH - h) / 2, w, h);
}

function drawImageScene(scene, loaded, localT) {
  const img = loaded.images[scene.src];
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.filter = "blur(28px)";
  drawCover(img, 1.18, localT);
  ctx.restore();
  ctx.fillStyle = "rgba(0,0,0,.26)";
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  roundRect(78, 160, W - 156, 780, 8);
  ctx.clip();
  drawCoverIn(img, 78, 160, W - 156, 780, scene.zoom || 1);
  ctx.restore();
}

function drawClosing(scene, logo) {
  ctx.fillStyle = "#0e1113";
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "rgba(216,183,117,.34)");
  g.addColorStop(.38, "rgba(20,28,32,.1)");
  g.addColorStop(1, "rgba(216,183,117,.22)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const scale = Math.min(720 / logo.naturalWidth, 230 / logo.naturalHeight);
  const w = logo.naturalWidth * scale;
  const h = logo.naturalHeight * scale;
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.9)";
  roundRect((W - w) / 2 - 36, 250, w + 72, h + 54, 8);
  ctx.fill();
  ctx.drawImage(logo, (W - w) / 2, 277, w, h);
  ctx.restore();
  ctx.textAlign = "center";
  ctx.fillStyle = "#d8b775";
  ctx.font = "800 30px Arial";
  ctx.fillText(scene.eyebrow, W / 2, 610);
  ctx.fillStyle = "#fff";
  ctx.font = "900 62px Arial";
  ctx.fillText("More models on our profile.", W / 2, 710);
  ctx.font = "500 34px Arial";
  ctx.fillStyle = "rgba(255,255,255,.9)";
  ctx.fillText("Request available stock, export prices", W / 2, 790);
  ctx.fillText("and shipping options.", W / 2, 838);
  ctx.fillStyle = "rgba(255,255,255,.08)";
  roundRect(108, 980, W - 216, 366, 8);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "700 34px Arial";
  ctx.fillText("www.worldaauto.com", W / 2, 1060);
  ctx.fillText("sales01@worldaauto.com", W / 2, 1135);
  ctx.fillText("Wechat / WhatsApp: +86 13810710061", W / 2, 1210);
  ctx.font = "800 30px Arial";
  ctx.fillStyle = "#d8b775";
  ctx.fillText("Tap the profile. Send the model. Get the plan.", W / 2, 1370);
  ctx.textAlign = "left";
}

function currentScene(t) {
  return scenes.find(s => t >= s.start && t < s.end) || scenes[scenes.length - 1];
}

async function ensureVideoAt(video, scene, t) {
  const local = Math.max(0, t - scene.start);
  if (video.paused) await video.play().catch(() => {});
  if (Math.abs(video.currentTime - local) > .7) {
    await new Promise(resolve => {
      video.onseeked = resolve;
      video.currentTime = Math.min(local, Math.max(0, video.duration - .3));
    });
    await video.play().catch(() => {});
  }
}

function renderFrame(t, loaded) {
  const scene = currentScene(t);
  const localT = Math.max(0, t - scene.start);
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, W, H);
  if (scene.kind === "closing") {
    drawClosing(scene, loaded.images.logo);
    return;
  }
  if (scene.kind === "grid") {
    drawGrid(scene, loaded, localT);
  } else if (scene.kind === "image") {
    drawImageScene(scene, loaded, localT);
  } else {
    drawCover(loaded.videos[scene.src], scene.zoom || 1.08, localT);
  }
  drawShade();
  drawWatermark(loaded.images.logo);
  textBlock(scene, t);
  drawFooter();
}

async function loadAll() {
  const videoKeys = [...new Set(scenes.filter(s => s.kind === "video").map(s => s.src))];
  const imageKeys = new Set(["logo"]);
  for (const scene of scenes) {
    if (scene.kind === "grid") scene.src.forEach(k => imageKeys.add(k));
    if (scene.kind === "image") imageKeys.add(scene.src);
  }
  const videos = {};
  const images = {};
  await Promise.all(videoKeys.map(async key => videos[key] = await loadVideo(assets[key])));
  await Promise.all([...imageKeys].map(async key => images[key] = await loadImage(assets[key])));
  return { videos, images };
}

async function saveCanvas(name) {
  const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
  await fetch("/upload-frame?name=" + encodeURIComponent(name), { method: "POST", body: await blob.arrayBuffer() });
}

window.capturePreviews = async function capturePreviews() {
  const loaded = await loadAll();
  const points = [1.2, 4.8, 8.2, 12.4, 16.3, 20.8, 25.8];
  for (let i = 0; i < points.length; i++) {
    const t = points[i];
    const scene = currentScene(t);
    if (scene.kind === "video") await ensureVideoAt(loaded.videos[scene.src], scene, t);
    renderFrame(t, loaded);
    await saveCanvas("frame-" + String(i + 1).padStart(2, "0") + ".png");
  }
  return { points };
};

window.renderVideo = async function renderVideo() {
  const loaded = await loadAll();
  const stream = canvas.captureStream(FPS);
  const chunks = [];
  const type = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1.42E01E") ? "video/mp4;codecs=avc1.42E01E" : "video/mp4";
  const recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 6200000 });
  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  const stopped = new Promise(resolve => recorder.onstop = resolve);
  recorder.start(500);
  const start = performance.now();
  await new Promise(resolve => {
    async function frame() {
      const t = (performance.now() - start) / 1000;
      if (t >= TOTAL) {
        renderFrame(TOTAL - .05, loaded);
        resolve();
        return;
      }
      const scene = currentScene(t);
      if (scene.kind === "video") await ensureVideoAt(loaded.videos[scene.src], scene, t);
      renderFrame(t, loaded);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
  recorder.stop();
  await stopped;
  const blob = new Blob(chunks, { type });
  await fetch("/upload-video", { method: "POST", body: await blob.arrayBuffer() });
  await saveCanvas("cover.png");
  return { size: blob.size, type, width: W, height: H, duration: TOTAL };
};
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:8189");
  if (url.pathname === "/") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
    return;
  }
  if (url.pathname === "/logo.png") {
    res.setHeader("Content-Type", "image/png");
    fs.createReadStream(logoPath).pipe(res);
    return;
  }
  if (url.pathname === "/upload-frame" && req.method === "POST") {
    const name = path.basename(url.searchParams.get("name") || "frame.png");
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => {
      const file = name === "cover.png" ? cover : path.join(previewDir, name);
      fs.writeFileSync(file, Buffer.concat(chunks));
      res.end("ok");
    });
    return;
  }
  if (url.pathname === "/upload-video" && req.method === "POST") {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => {
      fs.writeFileSync(output, Buffer.concat(chunks));
      res.end("ok");
    });
    return;
  }
  const requested = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  const file = path.resolve(root, requested);
  if (!file.startsWith(root) || !fs.existsSync(file)) {
    res.statusCode = 404;
    res.end("not found");
    return;
  }
  const ext = path.extname(file).toLowerCase();
  res.setHeader("Content-Type", ext === ".mp4" ? "video/mp4" : ext === ".png" || ext === ".jpg" || ext === ".jpeg" ? "image/" + (ext === ".jpg" ? "jpeg" : ext.slice(1)) : "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});

await new Promise(resolve => server.listen(8189, "127.0.0.1", resolve));

try {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto("http://127.0.0.1:8189/", { waitUntil: "load", timeout: 15000 });
  const previews = await page.evaluate(() => window.capturePreviews());
  const rendered = await page.evaluate(() => window.renderVideo());
  await browser.close();
  console.log(JSON.stringify({ previews, rendered, output, cover, scriptFile }, null, 2));
} finally {
  server.close();
}
