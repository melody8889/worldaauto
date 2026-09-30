import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import playwright from "file:///C:/Users/Melody/AppData/Local/OpenAI/Codex/runtimes/cua_node/1b23c930bdf84ed6/bin/node_modules/playwright/index.js";

const { chromium } = playwright;
const root = process.cwd();
const source = "C:/Users/Melody/Downloads/\u8ddf\u8fdb\u62a5\u4ef7\u90ae\u4ef6.mp4";
const logoPath = "D:/2. Worlda Global Limited/logo/\u5b9a\u7a3f/logo(1).png";
const outDir = path.join(root, "outputs", "followup-video-logo-replace");
const previewDir = path.join(outDir, "preview-frames");
const output = path.join(outDir, "followup-quote-email-worlda-logo-contact.mp4");
const cover = path.join(outDir, "followup-quote-email-worlda-cover.png");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(previewDir, { recursive: true });

const html = String.raw`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #111; }
    canvas { display: block; width: 360px; height: 640px; }
  </style>
</head>
<body>
<canvas id="c"></canvas>
<script>
const c = document.getElementById("c");
const ctx = c.getContext("2d");

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
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

function drawLogoCard(logo, x, y, w, h, mode = "light") {
  ctx.save();
  ctx.fillStyle = mode === "dark" ? "rgba(10,12,14,.74)" : "rgba(255,255,255,.88)";
  roundRect(x, y, w, h, 8);
  ctx.fill();
  const scale = Math.min((w - 20) / logo.naturalWidth, (h - 16) / logo.naturalHeight);
  const lw = logo.naturalWidth * scale;
  const lh = logo.naturalHeight * scale;
  ctx.drawImage(logo, x + (w - lw) / 2, y + (h - lh) / 2, lw, lh);
  ctx.restore();
}

function drawWatermarkReplacement(logo, t) {
  // Original AI watermark alternates between bottom-right and top-left.
  if (t < 5.25 || (t >= 9 && t < 13.25)) {
    drawLogoCard(logo, 494, 1158, 176, 66, "light");
  }
  if ((t >= 5.05 && t < 9.25) || t >= 13.15) {
    drawLogoCard(logo, 42, 38, 176, 66, "light");
  }
}

function drawContactReplacement(logo) {
  // Final contact page only: cover incorrect contact text and redraw clean details.
  ctx.save();
  ctx.fillStyle = "rgba(247,247,247,.98)";
  ctx.fillRect(56, 430, 608, 310);
  ctx.fillRect(116, 1006, 488, 92);

  ctx.fillStyle = "#20242a";
  ctx.font = "700 28px Arial";
  ctx.textBaseline = "middle";
  const rows = [
    ["✉", "sales01@worldaauto.com"],
    ["☎", "Wechat / WhatsApp: +86 13810710061"],
    ["▣", "www.worldaauto.com"]
  ];
  rows.forEach(([icon, text], i) => {
    const y = 500 + i * 72;
    ctx.fillStyle = "#22272e";
    ctx.font = "700 28px Arial";
    ctx.fillText(icon, 104, y);
    ctx.font = i === 1 ? "700 24px Arial" : "700 28px Arial";
    ctx.fillText(text, 154, y);
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#2a2f36";
  ctx.font = "700 25px Arial";
  ctx.fillText("Tap www.worldaauto.com", 360, 1055);
  ctx.textAlign = "left";
  ctx.restore();

  drawLogoCard(logo, 42, 38, 176, 66, "light");
}

async function seek(video, time) {
  await new Promise(resolve => {
    video.onseeked = resolve;
    video.currentTime = Math.min(time, Math.max(0, video.duration - 0.05));
  });
}

async function saveCanvas(name) {
  const blob = await new Promise(resolve => c.toBlob(resolve, "image/png"));
  await fetch("/upload-frame?name=" + encodeURIComponent(name), { method: "POST", body: await blob.arrayBuffer() });
}

function drawFrame(video, logo, t) {
  ctx.drawImage(video, 0, 0, c.width, c.height);
  drawWatermarkReplacement(logo, t);
  if (t >= 13.15) drawContactReplacement(logo);
}

window.preview = async function() {
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.playsInline = true;
  video.src = "/source.mp4";
  video.load();
  const logo = await loadImage("/logo.png");
  await new Promise((resolve, reject) => {
    video.onloadedmetadata = resolve;
    video.onerror = reject;
  });
  c.width = video.videoWidth;
  c.height = video.videoHeight;
  const points = [1.9, 6.0, 11.0, 14.0];
  for (let i = 0; i < points.length; i++) {
    await seek(video, points[i]);
    drawFrame(video, logo, points[i]);
    await saveCanvas("preview-" + String(i + 1).padStart(2, "0") + ".png");
  }
  return { width: c.width, height: c.height, duration: video.duration, points };
};

window.render = async function() {
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.muted = false;
  video.playsInline = true;
  video.src = "/source.mp4";
  video.load();
  const logo = await loadImage("/logo.png");
  await new Promise((resolve, reject) => {
    video.onloadedmetadata = resolve;
    video.onerror = reject;
  });
  c.width = video.videoWidth;
  c.height = video.videoHeight;

  const canvasStream = c.captureStream(30);
  let stream = canvasStream;
  let audioContext;
  try {
    audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(video);
    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);
    stream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...destination.stream.getAudioTracks()
    ]);
  } catch {
    stream = canvasStream;
  }
  const type = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1.42E01E") ? "video/mp4;codecs=avc1.42E01E" : "video/mp4";
  const chunks = [];
  const recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 4200000 });
  recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
  const stopped = new Promise(resolve => recorder.onstop = resolve);

  recorder.start(500);
  await seek(video, 0);
  if (audioContext) await audioContext.resume();
  await video.play();
  await new Promise(resolve => {
    function frame() {
      const t = video.currentTime;
      drawFrame(video, logo, t);
      if (video.ended || t >= video.duration - 0.03) {
        drawFrame(video, logo, video.duration);
        resolve();
      } else {
        requestAnimationFrame(frame);
      }
    }
    requestAnimationFrame(frame);
  });
  recorder.stop();
  await stopped;
  const blob = new Blob(chunks, { type });
  await fetch("/upload-video", { method: "POST", body: await blob.arrayBuffer() });
  await saveCanvas("cover.png");
  return { size: blob.size, type, width: c.width, height: c.height, duration: video.duration };
};
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:8219");
  if (url.pathname === "/") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
    return;
  }
  if (url.pathname === "/source.mp4") {
    res.setHeader("Content-Type", "video/mp4");
    fs.createReadStream(source).pipe(res);
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
  res.statusCode = 404;
  res.end("not found");
});

await new Promise(resolve => server.listen(8219, "127.0.0.1", resolve));
try {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 } });
  await page.goto("http://127.0.0.1:8219/", { waitUntil: "load", timeout: 10000 });
  const preview = await page.evaluate(() => window.preview());
  const rendered = await page.evaluate(() => window.render());
  await browser.close();
  console.log(JSON.stringify({ preview, rendered, output, cover, previewDir }, null, 2));
} finally {
  server.close();
}
