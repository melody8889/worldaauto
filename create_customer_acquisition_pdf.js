const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require(
  "C:\\Users\\Melody\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\pdf-lib"
);

async function main() {
const outDir = path.join(__dirname, "output", "pdf");
fs.mkdirSync(outDir, { recursive: true });
const outputPath = path.join(outDir, "汽车出口获客落地执行手册.pdf");
const fontPath = "C:\\Windows\\Fonts\\msyh.ttc";
const boldFontPath = "C:\\Windows\\Fonts\\msyhbd.ttc";

const doc = await PDFDocument.create();
doc.setTitle("汽车出口获客落地执行手册");
doc.setAuthor("Codex");
const regular = await doc.embedFont(fs.readFileSync(fontPath), { subset: true });
const bold = await doc.embedFont(fs.readFileSync(boldFontPath), { subset: true });
const pageW = 595.28;
const pageH = 841.89;
const margin = 42;
const navy = rgb(0.07, 0.16, 0.25);
const teal = rgb(0.04, 0.48, 0.48);
const gold = rgb(0.92, 0.62, 0.18);
const ink = rgb(0.12, 0.15, 0.18);
const muted = rgb(0.36, 0.40, 0.44);
const pale = rgb(0.94, 0.97, 0.97);
const line = rgb(0.82, 0.86, 0.87);

function wrap(text, font, size, maxWidth) {
  const lines = [];
  let current = "";
  for (const ch of String(text)) {
    const test = current + ch;
    if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
      lines.push(current);
      current = ch;
    } else current = test;
  }
  if (current) lines.push(current);
  return lines;
}
function text(page, value, x, y, size = 10, font = regular, color = ink, maxWidth = null, leading = size * 1.55) {
  const lines = maxWidth ? wrap(value, font, size, maxWidth) : [String(value)];
  lines.forEach((l, i) => page.drawText(l, { x, y: y - i * leading, size, font, color }));
  return y - lines.length * leading;
}
function rect(page, x, y, w, h, color, border = null, bw = 0.8) {
  page.drawRectangle({ x, y, width: w, height: h, color, borderColor: border || color, borderWidth: border ? bw : 0 });
}
function header(page, section, pageNo) {
  rect(page, 0, pageH - 62, pageW, 62, navy);
  text(page, "汽车出口获客落地执行手册", margin, pageH - 36, 16, bold, rgb(1, 1, 1));
  text(page, section, pageW - margin - 130, pageH - 35, 9, regular, rgb(0.82, 0.90, 0.90), 130);
  page.drawLine({ start: { x: margin, y: 34 }, end: { x: pageW - margin, y: 34 }, thickness: 0.6, color: line });
  text(page, `第 ${pageNo} 页`, pageW - margin - 34, 19, 8, regular, muted);
}
function sectionTitle(page, title, y) {
  rect(page, margin, y - 4, 5, 22, teal);
  text(page, title, margin + 14, y, 14, bold, navy);
  return y - 30;
}
function bullet(page, value, x, y, width, color = ink) {
  text(page, "•", x, y, 11, bold, teal);
  return text(page, value, x + 14, y, 10, regular, color, width - 14, 15.5);
}
function checkbox(page, label, x, y, width) {
  page.drawRectangle({ x, y: y - 2, width: 10, height: 10, borderColor: teal, borderWidth: 0.8 });
  return text(page, label, x + 17, y, 9.5, regular, ink, width - 17, 14);
}
function table(page, x, yTop, widths, rows, rowH = 28, headerFill = teal) {
  let y = yTop;
  rows.forEach((row, ri) => {
    let x0 = x;
    const fill = ri === 0 ? headerFill : (ri % 2 ? rgb(1, 1, 1) : pale);
    row.forEach((cell, ci) => {
      rect(page, x0, y - rowH, widths[ci], rowH, fill, line, 0.55);
      const f = ri === 0 ? bold : regular;
      const c = ri === 0 ? rgb(1, 1, 1) : ink;
      const wrapped = wrap(cell, f, ri === 0 ? 8.6 : 8.4, widths[ci] - 10);
      const startY = y - (wrapped.length === 1 ? 18 : 12);
      wrapped.slice(0, 2).forEach((l, i) => text(page, l, x0 + 5, startY - i * 11, ri === 0 ? 8.6 : 8.4, f, c));
      x0 += widths[ci];
    });
    y -= rowH;
  });
  return y;
}

// Page 1
{
  const p = doc.addPage([pageW, pageH]);
  rect(p, 0, 0, pageW, pageH, rgb(0.97, 0.98, 0.97));
  rect(p, 0, pageH - 190, pageW, 190, navy);
  text(p, "汽车出口获客", margin, pageH - 105, 30, bold, rgb(1, 1, 1));
  text(p, "落地执行手册", margin, pageH - 145, 24, bold, rgb(0.64, 0.91, 0.88));
  text(p, "给自己一个 7 天周期，把“等客户”变成每天可完成的动作。", margin, pageH - 225, 13, regular, navy, pageW - margin * 2);
  rect(p, margin, pageH - 370, pageW - margin * 2, 96, rgb(1, 1, 1), line);
  text(p, "本手册的目标", margin + 18, pageH - 303, 12, bold, teal);
  text(p, "每天完成 10 个有效触达，持续发布真实车辆内容，建立自己的客户池和转介绍渠道。", margin + 18, pageH - 328, 11, regular, ink, pageW - margin * 2 - 36);
  text(p, "适用业务：二手车、新能源车、整车出口、阿联酋及非洲/中亚市场开发", margin + 18, pageH - 353, 9.5, regular, muted, pageW - margin * 2 - 36);
  sectionTitle(p, "使用规则", pageH - 415);
  let y = pageH - 448;
  y = checkbox(p, "每天只抓 2 小时，先完成动作，再优化方法。", margin, y, pageW - margin * 2);
  y -= 12;
  y = checkbox(p, "先问客户车型、预算和目的地，再发送匹配车辆。", margin, y, pageW - margin * 2);
  y -= 12;
  y = checkbox(p, "每一次联系都记录结果，避免重复和遗忘。", margin, y, pageW - margin * 2);
  y -= 12;
  y = checkbox(p, "7 天后复盘：哪个国家、车型和渠道回复率最高。", margin, y, pageW - margin * 2);
  text(p, "开始日期：__________________    本周目标：获得 ______ 个有效询盘", margin, 90, 10, regular, muted);
  text(p, "版本：2026 年 9 月", margin, 52, 8, regular, muted);
}

// Page 2
{
  const p = doc.addPage([pageW, pageH]);
  header(p, "每日执行", 2);
  let y = sectionTitle(p, "每天 2 小时工作块", pageH - 100);
  y = text(p, "把时间固定下来。你不需要等状态好才开始，按顺序做完即可。", margin, y, 10, regular, muted, pageW - margin * 2);
  y -= 14;
  y = table(p, margin, y, [78, 132, 270], [
    ["时间", "动作", "完成标准"],
    ["0:00-0:30", "整理客户名单", "新增 20 个真实客户，写清国家、主营车型、联系方式"],
    ["0:30-1:10", "首次触达", "发消息给 10 个客户，至少 3 个是精准匹配"],
    ["1:10-1:20", "休息", "离开屏幕，喝水，回来继续"],
    ["1:20-1:50", "发布内容", "发布 1 条真实车辆信息，含图片/视频、年份、价格区间"],
    ["1:50-2:00", "跟进记录", "跟进 5 人，填写结果和下次联系日期"],
  ], 38);
  y -= 22;
  y = sectionTitle(p, "每天开始前写下 3 件事", y);
  y = checkbox(p, "今天要联系的国家/市场：________________________________", margin, y, pageW - margin * 2);
  y -= 12;
  y = checkbox(p, "今天主推车型：________________________________________", margin, y, pageW - margin * 2);
  y -= 12;
  y = checkbox(p, "今天完成后能看到的结果：_______________________________", margin, y, pageW - margin * 2);
  y -= 24;
  y = sectionTitle(p, "客户来源清单", y);
  y = bullet(p, "Google Maps：搜索 used car dealer、car importer、auto trading + 国家/城市。", margin, y, pageW - margin * 2);
  y -= 5;
  y = bullet(p, "Facebook 群组：搜索 UAE used cars、African car dealers、Chinese cars in [国家]。", margin, y, pageW - margin * 2);
  y -= 5;
  y = bullet(p, "LinkedIn：搜索 importer、dealer、procurement、automotive trading。", margin, y, pageW - margin * 2);
  y -= 5;
  y = bullet(p, "WhatsApp：优先联系有公开号码、近期发车源或询价内容的人。", margin, y, pageW - margin * 2);
  y -= 22;
  rect(p, margin, 75, pageW - margin * 2, 58, rgb(1, 0.96, 0.87), rgb(0.92, 0.75, 0.36));
  text(p, "今天的最低完成线", margin + 16, 111, 11, bold, navy);
  text(p, "20 个名单 + 10 条首次消息 + 1 条车辆内容 + 5 个跟进。做完就算完成。", margin + 16, 89, 10, regular, ink, pageW - margin * 2 - 32);
}

// Page 3
{
  const p = doc.addPage([pageW, pageH]);
  header(p, "7 天计划", 3);
  let y = sectionTitle(p, "7 天获客任务表", pageH - 100);
  y = text(p, "每一天只增加一个重点，避免同时研究太多平台。", margin, y, 10, regular, muted, pageW - margin * 2);
  y -= 12;
  y = table(p, margin, y, [45, 145, 205, 115], [
    ["天", "主题", "当天任务", "验收结果"],
    ["1", "建立名单", "找 20 个车商/进口商，完成 10 次首次联系", "至少 1 人回复"],
    ["2", "测试车型", "发布 2 个车型，比较哪条内容有人问", "记录询问车型"],
    ["3", "扩大渠道", "加入 5 个相关群组，发 1 条真实车源", "新增 10 个潜客"],
    ["4", "做转介绍", "联系 10 个旧客户/货代/供应商，提出介绍合作", "获得 2 个转介绍线索"],
    ["5", "建立信任", "给 5 个客户发送验车视频、底盘号或装运流程", "至少 2 个进入询价"],
    ["6", "集中跟进", "跟进前 5 天所有已回复客户", "明确预算/车型/目的地"],
    ["7", "复盘优化", "统计回复率、询价率、有效渠道和热门车型", "确定下周重点"],
  ], 39);
  y -= 22;
  y = sectionTitle(p, "每晚 5 分钟复盘", y);
  y = checkbox(p, "今天新增客户：______ 人    首次触达：______ 人", margin, y, pageW - margin * 2);
  y -= 10;
  y = checkbox(p, "回复：______ 人    有效询盘：______ 人    报价：______ 人", margin, y, pageW - margin * 2);
  y -= 10;
  y = checkbox(p, "今天哪个动作最有效：__________________________________", margin, y, pageW - margin * 2);
  y -= 10;
  y = checkbox(p, "明天要删掉或调整的动作：_______________________________", margin, y, pageW - margin * 2);
  y -= 24;
  rect(p, margin, 80, pageW - margin * 2, 72, pale, rgb(0.70, 0.84, 0.83));
  text(p, "判断标准", margin + 16, 128, 11, bold, teal);
  text(p, "不要只看成交。前期先看“回复”和“有效询盘”。如果连续 3 天没人回复，优先改客户名单、开场问题或主推车型。", margin + 16, 106, 9.5, regular, ink, pageW - margin * 2 - 32, 14);
}

// Page 4
{
  const p = doc.addPage([pageW, pageH]);
  header(p, "话术模板", 4);
  let y = sectionTitle(p, "首次联系：英文短消息", pageH - 100);
  rect(p, margin, y - 104, pageW - margin * 2, 104, rgb(0.96, 0.98, 0.98), line);
  text(p, "Hi, I’m [Name] from China. We export used cars and new energy vehicles with inspection videos, chassis numbers and shipping support.", margin + 16, y - 24, 10, regular, ink, pageW - margin * 2 - 32, 15);
  text(p, "Are you currently sourcing cars from China? Please tell me the models and price range you are looking for. I can send you suitable stock today.", margin + 16, y - 58, 10, regular, ink, pageW - margin * 2 - 32, 15);
  text(p, "中文意思：我们出口二手车和新能源车，可提供验车视频、底盘号和运输支持。您目前从中国采购车辆吗？请告诉我想要的车型和预算，我今天可以发匹配车源。", margin + 16, y - 89, 8.8, regular, muted, pageW - margin * 2 - 32, 13);
  y -= 130;
  y = sectionTitle(p, "客户回复后：4 个问题", y);
  y = bullet(p, "Which models are you looking for? 你要找哪些车型？", margin, y, pageW - margin * 2);
  y -= 4;
  y = bullet(p, "What is your target price range? 你的目标预算是多少？", margin, y, pageW - margin * 2);
  y -= 4;
  y = bullet(p, "Which destination port and country? 目的港和国家是哪里？", margin, y, pageW - margin * 2);
  y -= 4;
  y = bullet(p, "How many units do you need per month? 每月大约需要多少台？", margin, y, pageW - margin * 2);
  y -= 20;
  y = sectionTitle(p, "跟进话术", y);
  y = table(p, margin, y, [90, 390], [
    ["时间", "消息"],
    ["2-3 天后", "Hi [Name], I found a few cars that may fit your market. Would you like me to send the details and videos?"],
    ["客户已看车源", "Which one is closer to your target? I can check the latest price and shipping cost for you."],
    ["客户不回复", "Just checking whether you are still sourcing cars this month. I can send only the models within your budget."],
    ["客户说贵", "Understood. If you share your target price, I can look for another year, mileage or model option."],
  ], 48);
  y -= 18;
  rect(p, margin, 78, pageW - margin * 2, 55, rgb(1, 0.96, 0.87), rgb(0.92, 0.75, 0.36));
  text(p, "小原则：每次消息只推进一个问题。让客户容易回复，比一次发一大段公司介绍更重要。", margin + 16, 108, 10, bold, navy, pageW - margin * 2 - 32, 14);
}

// Page 5
{
  const p = doc.addPage([pageW, pageH]);
  header(p, "转介绍与记录", 5);
  let y = sectionTitle(p, "转介绍合作方案", pageH - 100);
  y = text(p, "你可以主动找拥有客户资源的人合作，不必等别人自然推荐。", margin, y, 10, regular, muted, pageW - margin * 2);
  y -= 12;
  y = table(p, margin, y, [125, 190, 165], [
    ["合作对象", "你提供什么", "怎么开口"],
    ["旧客户", "新车源、价格和物流支持", "有朋友也在找中国车吗？成交后我给你介绍费。"],
    ["货代/物流", "稳定车源和客户需求", "你有买家询车时可以转给我，我按成交台数结算。"],
    ["短视频/外贸顾问", "内容素材和佣金", "你负责带来询盘，我负责报价、验车和发运。"],
    ["修理厂/车行", "车型匹配和售后协同", "客户需要采购车辆时，可以直接把我的 WhatsApp 给他。"],
  ], 45);
  y -= 22;
  y = sectionTitle(p, "客户跟进记录表", y);
  y = table(p, margin, y, [78, 88, 95, 100, 91], [
    ["客户/公司", "国家/城市", "需求车型/预算", "当前状态", "下次跟进"],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ], 35);
  y -= 22;
  y = sectionTitle(p, "本周复盘", y);
  y = checkbox(p, "回复率最高的渠道：____________________________________", margin, y, pageW - margin * 2);
  y -= 10;
  y = checkbox(p, "客户最常问的车型/预算：________________________________", margin, y, pageW - margin * 2);
  y -= 10;
  y = checkbox(p, "下周只重点做的两个渠道：_______________________________", margin, y, pageW - margin * 2);
  y -= 10;
  y = checkbox(p, "下周目标：有效询盘 ______ 个，报价 ______ 个，成交 ______ 台", margin, y, pageW - margin * 2);
  text(p, "提醒：先连续执行 7 天，再判断方法是否有效。", margin, 70, 9, bold, teal);
}

const bytes = await doc.save();
fs.writeFileSync(outputPath, bytes);
console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
