import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "outputs");
fs.mkdirSync(outDir, { recursive: true });

const html = String.raw`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #111; }
    canvas { display: block; width: 100vw; }
  </style>
</head>
<body>
<canvas id="c" width="1280" height="720"></canvas>
<script>
const A = {
  stock: "/assets/proof-video/stock-yard-a.mp4",
  stock2: "/assets/proof-video/stock-yard-b.mp4",
  load: "/assets/proof-video/loading.mp4",
  doc: "/assets/proof-video/sales-contract-01.png",
  doc2: "/assets/proof-video/sales-contract-02.png",
  cus: "/assets/proof-video/customs-declaration.png",
  logo: "/assets/proof-video/logo.png"
};
const c = document.getElementById("c");
const ctx = c.getContext("2d");
const W = 1280;
const H = 720;

function img(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function vid(src) {
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

function cover(media, zoom = 1) {
  const mw = media.videoWidth || media.naturalWidth;
  const mh = media.videoHeight || media.naturalHeight;
  const scale = Math.max(W / mw, H / mh) * zoom;
  const w = mw * scale;
  const h = mh * scale;
  ctx.drawImage(media, (W - w) / 2, (H - h) / 2, w, h);
}

function contain(media) {
  const mw = media.naturalWidth;
  const mh = media.naturalHeight;
  const scale = Math.min(630 / mw, 540 / mh);
  const w = mw * scale;
  const h = mh * scale;
  ctx.drawImage(media, 52 + (690 - w) / 2, 46 + (600 - h) / 2, w, h);
}

function shade() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(0,0,0,.45)");
  g.addColorStop(.5, "rgba(0,0,0,.12)");
  g.addColorStop(1, "rgba(0,0,0,.72)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function drawLogo(logo) {
  const scale = Math.min(300 / logo.naturalWidth, 92 / logo.naturalHeight);
  ctx.save();
  ctx.shadowColor = "rgba(255,255,255,.72)";
  ctx.shadowBlur = 10;
  ctx.drawImage(logo, 910, 38, logo.naturalWidth * scale, logo.naturalHeight * scale);
  ctx.restore();
}

function copy(kicker, title, body) {
  ctx.fillStyle = "rgba(0,0,0,.56)";
  ctx.fillRect(56, 410, 790, 210);
  ctx.fillStyle = "#b08a54";
  ctx.font = "800 24px Arial";
  ctx.fillText(kicker.toUpperCase(), 86, 462);
  ctx.fillStyle = "#fff";
  ctx.font = "800 54px Arial";
  ctx.fillText(title, 86, 528);
  ctx.fillStyle = "rgba(255,255,255,.93)";
  ctx.font = "30px Arial";
  ctx.fillText(body, 86, 580);
  ctx.fillStyle = "rgba(0,0,0,.68)";
  ctx.fillRect(0, H - 74, W, 74);
  ctx.fillStyle = "#fff";
  ctx.font = "700 25px Arial";
  ctx.fillText("WhatsApp: +86-13810710061", 56, H - 29);
  ctx.fillText("Email: sales01@worldaauto.com", 530, H - 29);
}

async function seek(video, time) {
  return new Promise(resolve => {
    video.onseeked = () => resolve();
    video.currentTime = Math.min(time, Math.max(0, (video.duration || time) - .25));
  });
}

async function sceneVideo(video, logo, ms, kicker, title, body) {
  await seek(video, .1);
  await video.play().catch(() => {});
  const start = performance.now();
  return new Promise(resolve => {
    function frame(now) {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, W, H);
      cover(video, 1.03);
      shade();
      drawLogo(logo);
      copy(kicker, title, body);
      if (now - start < ms) requestAnimationFrame(frame);
      else {
        video.pause();
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });
}

async function sceneImage(image, logo, ms, kicker, title, body) {
  const start = performance.now();
  return new Promise(resolve => {
    function frame(now) {
      ctx.fillStyle = "#eef1f4";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(52, 46, 690, 600);
      ctx.strokeStyle = "rgba(30,40,50,.18)";
      ctx.lineWidth = 2;
      ctx.strokeRect(52, 46, 690, 600);
      contain(image);
      drawLogo(logo);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(786, 164, 410, 330);
      ctx.fillStyle = "#b08a54";
      ctx.font = "800 24px Arial";
      ctx.fillText(kicker.toUpperCase(), 818, 222);
      ctx.fillStyle = "#1f2328";
      ctx.font = "800 46px Arial";
      ctx.fillText(title, 818, 290);
      ctx.fillStyle = "#4b5563";
      ctx.font = "28px Arial";
      ctx.fillText(body, 818, 350);
      ctx.fillStyle = "#6b7280";
      ctx.font = "700 20px Arial";
      ctx.fillText("Sensitive buyer details masked for privacy", 818, 430);
      ctx.fillStyle = "#1f2328";
      ctx.font = "700 24px Arial";
      ctx.fillText("WhatsApp: +86-13810710061", 56, 688);
      ctx.fillText("Email: sales01@worldaauto.com", 530, 688);
      if (now - start < ms) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

async function closing(logo, ms) {
  const start = performance.now();
  return new Promise(resolve => {
    function frame(now) {
      ctx.fillStyle = "#f3efe7";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#b08a54";
      ctx.fillRect(0, 0, W, 12);
      const scale = Math.min(700 / logo.naturalWidth, 170 / logo.naturalHeight);
      ctx.drawImage(logo, (W - logo.naturalWidth * scale) / 2, 104, logo.naturalWidth * scale, logo.naturalHeight * scale);
      ctx.fillStyle = "#1f2328";
      ctx.textAlign = "center";
      ctx.font = "800 54px Arial";
      ctx.fillText("Request Stock, Price & Shipping Plan", W / 2, 388);
      ctx.font = "32px Arial";
      ctx.fillText("WhatsApp: +86-13810710061", W / 2, 468);
      ctx.fillText("Email: sales01@worldaauto.com", W / 2, 516);
      ctx.textAlign = "left";
      if (now - start < ms) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

window.run = async function run() {
  const [v1, v2, v3, doc, doc2, customs, logo] = await Promise.all([
    vid(A.stock),
    vid(A.stock2),
    vid(A.load),
    img(A.doc),
    img(A.doc2),
    img(A.cus),
    img(A.logo)
  ]);
  const stream = c.captureStream(30);
  const chunks = [];
  const type = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1.42E01E") ? "video/mp4;codecs=avc1.42E01E" : "video/mp4";
  const recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 3000000 });
  recorder.ondataavailable = event => {
    if (event.data.size) chunks.push(event.data);
  };
  const stopped = new Promise(resolve => recorder.onstop = resolve);
  recorder.start(500);
  await sceneVideo(v1, logo, 4500, "Real Stock Verification", "Vehicles Ready For Export", "Current stock videos before quotation");
  await sceneVideo(v2, logo, 3500, "Inspection Evidence", "Photo & Video Confirmation", "Model, color and configuration checks");
  await sceneImage(doc, logo, 4000, "Export Documents", "Sales Contract", "Order details and trade terms shown clearly");
  await sceneImage(doc2, logo, 3500, "Stamped Contract", "Signed Records", "Company seal and buyer confirmation included");
  await sceneImage(customs, logo, 4000, "Customs Declaration", "Clearance Records", "Route and declaration files arranged by shipment");
  await sceneVideo(v3, logo, 5000, "Loading Updates", "Shipment Follow-Up", "Loading records and delivery progress shared");
  await closing(logo, 3000);
  recorder.stop();
  await stopped;
  const blob = new Blob(chunks, { type: "video/mp4" });
  await fetch("/upload?name=worlda-export-proof-video.mp4", { method: "POST", body: await blob.arrayBuffer() });
  const coverBlob = await new Promise(resolve => c.toBlob(resolve, "image/png"));
  await fetch("/upload?name=worlda-export-proof-cover.png", { method: "POST", body: await coverBlob.arrayBuffer() });
  return { size: blob.size, type };
};
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:8159");
  if (url.pathname === "/") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
    return;
  }
  if (url.pathname === "/upload") {
    const name = path.basename(url.searchParams.get("name") || "out.bin");
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => {
      fs.writeFileSync(path.join(outDir, name), Buffer.concat(chunks));
      res.end("ok");
    });
    return;
  }
  const file = path.join(root, decodeURIComponent(url.pathname).replace(/^\/+/, ""));
  if (!file.startsWith(root) || !fs.existsSync(file)) {
    res.statusCode = 404;
    res.end("not found");
    return;
  }
  const ext = path.extname(file).toLowerCase();
  res.setHeader("Content-Type", ext === ".mp4" ? "video/mp4" : ext === ".png" ? "image/png" : "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});

server.listen(8159, "127.0.0.1", () => {
  console.log("proof-video-composer http://127.0.0.1:8159/");
});
