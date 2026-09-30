import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import playwright from "file:///C:/Users/Melody/AppData/Local/OpenAI/Codex/runtimes/cua_node/1b23c930bdf84ed6/bin/node_modules/playwright/index.js";

const { chromium } = playwright;
const root = process.cwd();
const outputDir = path.join(root, "outputs", "instagram-resize");
const source = path.join(outputDir, "source.mp4");
const output = path.join(outputDir, "instagram-9x16.mp4");

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

function drawCover(video) {
  const scale = Math.max(W / video.videoWidth, H / video.videoHeight);
  const w = video.videoWidth * scale;
  const h = video.videoHeight * scale;
  ctx.drawImage(video, (W - w) / 2, (H - h) / 2, w, h);
}

function drawContain(video) {
  const scale = Math.min((W - 64) / video.videoWidth, (H - 160) / video.videoHeight);
  const w = video.videoWidth * scale;
  const h = video.videoHeight * scale;
  const x = (W - w) / 2;
  const y = (H - h) / 2;
  ctx.fillStyle = "rgba(255,255,255,.96)";
  ctx.fillRect(x - 14, y - 14, w + 28, h + 28);
  ctx.drawImage(video, x, y, w, h);
}

function blurBackground() {
  ctx.fillStyle = "rgba(0,0,0,.26)";
  ctx.fillRect(0, 0, W, H);
}

window.renderInstagram = async function renderInstagram() {
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.playsInline = true;
  video.src = "/source.mp4";
  video.load();
  await new Promise((resolve, reject) => {
    video.onloadedmetadata = resolve;
    video.onerror = reject;
  });

  const stream = canvas.captureStream(30);
  const chunks = [];
  const type = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1.42E01E") ? "video/mp4;codecs=avc1.42E01E" : "video/mp4";
  const recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 4500000 });
  recorder.ondataavailable = event => {
    if (event.data.size) chunks.push(event.data);
  };
  const stopped = new Promise(resolve => recorder.onstop = resolve);

  recorder.start(500);
  video.currentTime = 0;
  await video.play();
  await new Promise(resolve => {
    function frame() {
      ctx.save();
      ctx.filter = "blur(34px)";
      drawCover(video);
      ctx.restore();
      blurBackground();
      drawContain(video);
      if (!video.ended) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
  recorder.stop();
  await stopped;
  const blob = new Blob(chunks, { type: "video/mp4" });
  await fetch("/upload", { method: "POST", body: await blob.arrayBuffer() });
  return { size: blob.size, type, duration: video.duration, width: W, height: H };
};
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:8169");
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
  if (url.pathname === "/upload" && req.method === "POST") {
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

await new Promise(resolve => server.listen(8169, "127.0.0.1", resolve));

try {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto("http://127.0.0.1:8169/", { waitUntil: "load", timeout: 10000 });
  const result = await page.evaluate(() => window.renderInstagram());
  await browser.close();
  console.log(JSON.stringify(result));
} finally {
  server.close();
}
