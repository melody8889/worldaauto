import { spawn } from "node:child_process";
import playwright from "file:///C:/Users/Melody/AppData/Local/OpenAI/Codex/runtimes/cua_node/1b23c930bdf84ed6/bin/node_modules/playwright/index.js";

const { chromium } = playwright;

const server = spawn(
  "C:\\Users\\Melody\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe",
  ["tools\\proof-video-composer.mjs"],
  { cwd: process.cwd(), stdio: ["ignore", "pipe", "pipe"] }
);

let ready = false;
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("Composer server did not start")), 10000);
  server.stdout.on("data", chunk => {
    if (String(chunk).includes("proof-video-composer")) {
      ready = true;
      clearTimeout(timer);
      resolve();
    }
  });
  server.stderr.on("data", chunk => {
    const text = String(chunk);
    if (text.includes("EADDRINUSE")) {
      ready = true;
      clearTimeout(timer);
      resolve();
    }
  });
});

try {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto("http://127.0.0.1:8159/", { waitUntil: "load", timeout: 10000 });
  const result = await page.evaluate(() => window.run());
  await browser.close();
  console.log(JSON.stringify(result));
} finally {
  if (ready) server.kill();
}
