import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import playwright from "file:///C:/Users/Melody/AppData/Local/OpenAI/Codex/runtimes/cua_node/1b23c930bdf84ed6/bin/node_modules/playwright/index.js";

const { chromium } = playwright;
const root = process.cwd();
const source = "C:/Users/Melody/Desktop/60b8259cd4bfcefeeecccc5fff032761_raw.mp4";
const logo = path.join(root, "assets", "logo.png");
const outputDir = path.join(root, "outputs", "branded-video");
const output = path.join(outputDir, "worldaauto-branded-ad.mp4");
const previewDir = path.join(outputDir, "preview-frames");

fs.mkdirSync(outputDir, { recursive: true });
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
<canvas id="canvas" width="1080" height="1920"></canvas>
<script>
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const W = 1080;
const H = 1920;

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
    video.onloadedmetadata = () => resolve(video);
    video.onerror = reject;
    video.src = src;
    video.load();
  });
}

function cover(video) {
  const scale = Math.max(W / video.videoWidth, H / video.videoHeight);
  const w = video.videoWidth * scale;
  const h = video.videoHeight * scale;
  ctx.drawImage(video, (W - w) / 2, (H - h) / 2, w, h);
}

function drawTextBlock(lines, x, y, maxWidth, lineHeight) {
  for (const line of lines) {
    const words = line.split(" ");
    let current = "";
    for (const word of words) {
      const test = current ? current + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        ctx.fillText(current, x, y);
        y += lineHeight;
        current = word;
      } else {
        current = test;
      }
    }
    if (current) {
      ctx.fillText(current, x, y);
      y += lineHeight;
    }
  }
}

function sceneCopy(t, duration) {
  const p = duration ? t / duration : 0;
  if (p < 0.22) {
    return {
      kicker: "EXPORT-READY VEHICLE",
      title: "Premium Model, Global Supply",
      body: ["Clean exterior, strong road presence,", "ready for dealer inquiry."]
    };
  }
  if (p < 0.44) {
    return {
      kicker: "DETAILS THAT MATTER",
      title: "Configuration Checked Before Quote",
      body: ["Exterior, interior and trim details", "confirmed before order."]
    };
  }
  if (p < 0.66) {
    return {
      kicker: "B2B VEHICLE EXPORT",
      title: "Stock, Price & Shipping Plan",
      body: ["We coordinate quotation, documents,", "inspection and shipment."]
    };
  }
  if (p < 0.86) {
    return {
      kicker: "WORLDA GLOBAL AUTO",
      title: "Reliable China Auto Export Partner",
      body: ["For dealers, traders and fleet buyers", "looking for stable supply."]
    };
  }
  return {
    kicker: "GET YOUR QUOTE",
    title: "Send Model & Destination",
    body: ["Fast response for price, availability", "and export route options."]
  };
}

function shade() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(0,0,0,.34)");
  g.addColorStop(0.44, "rgba(0,0,0,.03)");
  g.addColorStop(1, "rgba(0,0,0,.72)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function drawLogo(logoImg) {
  const targetW = 245;
  const scale = targetW / logoImg.naturalWidth;
  const w = logoImg.naturalWidth * scale;
  const h = logoImg.naturalHeight * scale;
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.72)";
  ctx.fillRect(W - w - 64, 28, w + 40, h + 28);
  ctx.globalAlpha = 0.96;
  ctx.shadowColor = "rgba(0,0,0,.45)";
  ctx.shadowBlur = 18;
  ctx.drawImage(logoImg, W - w - 44, 42, w, h);
  ctx.restore();
}

function drawSubtitle(copy) {
  const x = 54;
  const bottom = H - 345;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,.58)";
  ctx.fillRect(36, bottom - 58, W - 72, 270);
  ctx.fillStyle = "#c9a469";
  ctx.font = "800 34px Arial";
  ctx.fillText(copy.kicker, x, bottom);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 56px Arial";
  drawTextBlock([copy.title], x, bottom + 70, W - 108, 62);
  ctx.fillStyle = "rgba(255,255,255,.94)";
  ctx.font = "500 34px Arial";
  drawTextBlock(copy.body, x, bottom + 166, W - 108, 43);
  ctx.restore();
}

function drawFooter() {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,.74)";
  ctx.fillRect(0, H - 92, W, 92);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 28px Arial";
  ctx.fillText("www.worldaauto.com", 44, H - 36);
  ctx.textAlign = "right";
  ctx.fillText("sales01@worldaauto.com  |  +86-13810710061", W - 44, H - 36);
  ctx.restore();
}

function drawClosing(logoImg) {
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#181818");
  g.addColorStop(0.55, "#24332f");
  g.addColorStop(1, "#b08a54");
  ctx.fillStyle = g;
  ctx.globalAlpha = 0.46;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;
  const scale = Math.min(620 / logoImg.naturalWidth, 180 / logoImg.naturalHeight);
  const w = logoImg.naturalWidth * scale;
  const h = logoImg.naturalHeight * scale;
  ctx.drawImage(logoImg, (W - w) / 2, 300, w, h);
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 64px Arial";
  ctx.fillText("Request Stock, Price & Shipping Plan", W / 2, 640);
  ctx.font = "500 40px Arial";
  ctx.fillText("www.worldaauto.com", W / 2, 760);
  ctx.fillText("sales01@worldaauto.com", W / 2, 835);
  ctx.fillText("+86-13810710061", W / 2, 910);
  ctx.textAlign = "left";
}

async function seek(video, time) {
  await new Promise(resolve => {
    video.onseeked = resolve;
    video.currentTime = Math.min(time, Math.max(0, video.duration - 0.2));
  });
}

window.captureFrames = async function captureFrames() {
  const video = await loadVideo("/source.mp4");
  const logoImg = await loadImage("/logo.png");
  const points = [0.8, video.duration * 0.25, video.duration * 0.5, video.duration * 0.75, Math.max(0, video.duration - 1)];
  const frames = [];
  for (let i = 0; i < points.length; i++) {
    await seek(video, points[i]);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);
    cover(video);
    shade();
    drawLogo(logoImg);
    drawSubtitle(sceneCopy(points[i], video.duration));
    drawFooter();
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    await fetch("/upload-frame?name=frame-" + String(i + 1).padStart(2, "0") + ".png", { method: "POST", body: await blob.arrayBuffer() });
    frames.push({ time: points[i], name: "frame-" + String(i + 1).padStart(2, "0") + ".png" });
  }
  return { duration: video.duration, width: video.videoWidth, height: video.videoHeight, frames };
};

window.renderBranded = async function renderBranded() {
  const video = await loadVideo("/source.mp4");
  const logoImg = await loadImage("/logo.png");
  const stream = canvas.captureStream(30);
  const chunks = [];
  const mimeType = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1.42E01E") ? "video/mp4;codecs=avc1.42E01E" : "video/mp4";
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5200000 });
  recorder.ondataavailable = event => {
    if (event.data.size) chunks.push(event.data);
  };
  const stopped = new Promise(resolve => recorder.onstop = resolve);
  recorder.start(500);
  video.currentTime = 0;
  await video.play();
  await new Promise(resolve => {
    function frame() {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, W, H);
      cover(video);
      shade();
      drawLogo(logoImg);
      drawSubtitle(sceneCopy(video.currentTime, video.duration));
      drawFooter();
      if (!video.ended) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
  const closeStart = performance.now();
  await new Promise(resolve => {
    function closeFrame(now) {
      drawClosing(logoImg);
      if (now - closeStart < 3000) requestAnimationFrame(closeFrame);
      else resolve();
    }
    requestAnimationFrame(closeFrame);
  });
  recorder.stop();
  await stopped;
  const blob = new Blob(chunks, { type: mimeType });
  await fetch("/upload-video", { method: "POST", body: await blob.arrayBuffer() });
  return { size: blob.size, type: mimeType, sourceDuration: video.duration, outputWidth: W, outputHeight: H };
};
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:8179");
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
    fs.createReadStream(logo).pipe(res);
    return;
  }
  if (url.pathname === "/upload-frame" && req.method === "POST") {
    const name = path.basename(url.searchParams.get("name") || "frame.png");
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => {
      fs.writeFileSync(path.join(previewDir, name), Buffer.concat(chunks));
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

await new Promise(resolve => server.listen(8179, "127.0.0.1", resolve));

try {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto("http://127.0.0.1:8179/", { waitUntil: "load", timeout: 15000 });
  const frames = await page.evaluate(() => window.captureFrames());
  const rendered = await page.evaluate(() => window.renderBranded());
  await browser.close();
  console.log(JSON.stringify({ frames, rendered, output }, null, 2));
} finally {
  server.close();
}
