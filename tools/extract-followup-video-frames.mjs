import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import playwright from "file:///C:/Users/Melody/AppData/Local/OpenAI/Codex/runtimes/cua_node/1b23c930bdf84ed6/bin/node_modules/playwright/index.js";

const { chromium } = playwright;
const root = process.cwd();
const source = "C:/Users/Melody/Downloads/\u8ddf\u8fdb\u62a5\u4ef7\u90ae\u4ef6.mp4";
const outDir = path.join(root, "outputs", "followup-video-logo-replace", "source-frames");
fs.mkdirSync(outDir, { recursive: true });

const html = String.raw`<!doctype html>
<canvas id="c"></canvas>
<script>
const c = document.getElementById("c");
const ctx = c.getContext("2d");
async function seek(video, time) {
  await new Promise(resolve => {
    video.onseeked = resolve;
    video.currentTime = Math.min(time, Math.max(0, video.duration - 0.05));
  });
}
window.extract = async function() {
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
  c.width = video.videoWidth;
  c.height = video.videoHeight;
  const points = [];
  const count = 10;
  for (let i = 0; i < count; i++) points.push(video.duration * i / (count - 1));
  const frames = [];
  for (let i = 0; i < points.length; i++) {
    await seek(video, points[i]);
    ctx.drawImage(video, 0, 0, c.width, c.height);
    const blob = await new Promise(resolve => c.toBlob(resolve, "image/png"));
    const name = "frame-" + String(i + 1).padStart(2, "0") + ".png";
    await fetch("/upload?name=" + name, { method: "POST", body: await blob.arrayBuffer() });
    frames.push({ name, time: points[i] });
  }
  return { duration: video.duration, width: video.videoWidth, height: video.videoHeight, frames };
};
</script>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:8199");
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
    const name = path.basename(url.searchParams.get("name") || "frame.png");
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => {
      fs.writeFileSync(path.join(outDir, name), Buffer.concat(chunks));
      res.end("ok");
    });
    return;
  }
  res.statusCode = 404;
  res.end("not found");
});

await new Promise(resolve => server.listen(8199, "127.0.0.1", resolve));
try {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:8199/", { waitUntil: "load", timeout: 10000 });
  const result = await page.evaluate(() => window.extract());
  await browser.close();
  console.log(JSON.stringify({ result, outDir }, null, 2));
} finally {
  server.close();
}
