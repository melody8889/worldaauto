import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = path.dirname(fileURLToPath(import.meta.url));

const directLeads = [
  {
    name: "Оками Li Auto / Okami Li Auto",
    type: "区域经销商/中国新能源车",
    city: "Екатеринбург",
    channel: "车商/代购",
    priority: "高",
    fit: "官网明确为 Li Auto/Lixiang 叶卡捷琳堡经销商，有现车、试驾、企业客户入口，适合用中国现车/补充车源切入。",
    publicContact: "+7 (343) 379-62-26",
    social: "未公开",
    source: "https://okami-liauto.ru/",
    suggestedOpen: "Здравствуйте, увидел у вас Li Auto/Lixiang в Екатеринбурге. Можем быстро дать экспортную цену по L6/L7/L9 из Китая и расчёт поставки до РФ.",
    note: "直接联系销售/采购/企业客户部门；先不要讲公司介绍，先给车型+价格表。",
  },
  {
    name: "Li Motors / Lixiang Motors",
    type: "Li/Lixiang 车源与经销网络",
    city: "俄罗斯多城市/官网未集中列明",
    channel: "车商/代购",
    priority: "高",
    fit: "页面出现“Заказать Lixiang из Китая”“Авто в наличии”“Стать партнером”等入口，适合找合作/供货/区域代理负责人。",
    publicContact: "+7 (343) 302-20-67（叶卡捷琳堡经销页）",
    social: "Telegram: https://t.me/lixiangmotors",
    source: "https://li-motors.ru/ ; https://li-motors.ru/dealers/ekaterinburg",
    suggestedOpen: "Здравствуйте. Видим, что вы работаете с Lixiang и заказом из Китая. Можем предложить стабильные экспортные предложения по L6/L7/L9 с фото, VIN и сроком отгрузки.",
    note: "优先问采购/партнерство，不要只找零售销售。",
  },
  {
    name: "Li Auto Russia official distributor",
    type: "品牌俄语站/经销入口",
    city: "俄罗斯",
    channel: "车商/代购",
    priority: "中",
    fit: "官网有“Стать дилером”“Корпоративные продажи”“Найти дилера”，适合继续挖其下游经销商和企业销售入口。",
    publicContact: "未公开",
    social: "Telegram: https://t.me/liautoofficial ; VK: https://vk.com/liautoofficial",
    source: "https://liautoofficial.ru/",
    suggestedOpen: "Здравствуйте. Мы поставляем автомобили из Китая и хотим обсудить B2B-поставки/партнёрство по Li Auto для дилеров в РФ.",
    note: "更像入口，不一定是中小客户；用来找下游 dealer 列表。",
  },
  {
    name: "Drom Li / Li L9 listings",
    type: "车型广告平台/可挖具体卖家",
    city: "俄罗斯多城市",
    channel: "车商/代购",
    priority: "高",
    fit: "Li/Lixiang 有大量在售广告；每条广告背后是正在卖中国新能源车的车商或个人中间商，比公开进口商名单更活跃。",
    publicContact: "平台内展示，需逐条进入广告查看",
    social: "Telegram: https://t.me/drom ; VK: https://vk.com/drom/",
    source: "https://auto.drom.ru/li/ ; https://auto.drom.ru/li/l9/",
    suggestedOpen: "Здравствуйте, увидел ваше объявление по Li L7/L9 на Drom. Есть регулярные предложения из Китая, могу отправить свежий прайс и сроки поставки.",
    note: "按城市筛：莫斯科、叶卡捷琳堡、新西伯利亚、海参崴；优先联系同一账号多台车源者。",
  },
  {
    name: "Auto.ru - Авто на заказ / Chinese brands",
    type: "车源平台/经销商入口",
    city: "俄罗斯多城市",
    channel: "车商/代购",
    priority: "中",
    fit: "平台有“Авто на заказ”“Для бизнеса”“Дилеры”，可按 Jetour/Changan/Geely/Tank/Li/Zeekr 找具体商家。",
    publicContact: "平台内展示，需逐条进入广告查看",
    social: "未公开",
    source: "https://auto.ru/",
    suggestedOpen: "Здравствуйте, увидел у вас китайские авто/авто на заказ. Можем дать экспортные цены из Китая по конкретным моделям и расчёт доставки.",
    note: "不要联系平台邮箱；要联系广告页内车商账号。",
  },
  {
    name: "Avito - автомобили / авто из Китая sellers",
    type: "分类广告/中小车商入口",
    city: "俄罗斯多城市",
    channel: "车商/代购",
    priority: "高",
    fit: "大量小车商在 Avito 发中国车现车/代购广告，适合按车型直接打招呼。",
    publicContact: "平台内展示，需登录/点开广告查看",
    social: "未公开",
    source: "https://www.avito.ru/all/avtomobili",
    suggestedOpen: "Здравствуйте, увидел ваше объявление по китайскому авто. Есть поставки из Китая по Li/Zeekr/Jetour/Tank, могу отправить цены по 3-5 ходовым моделям.",
    note: "优先找多车源商家，不要找单台私人卖家。",
  },
  {
    name: "Auto.kolesa.ru dealer catalog",
    type: "经销商车源平台",
    city: "俄罗斯多城市",
    channel: "车商/代购",
    priority: "中",
    fit: "搜索结果显示平台聚合官方经销商和新车/二手车，适合找二线城市经销商。",
    publicContact: "平台内展示，需按车型/城市进入",
    social: "未公开",
    source: "https://auto.kolesa.ru/all-auto",
    suggestedOpen: "Здравствуйте, работаем с экспортом авто из Китая. Можем предложить поставки под ваш спрос по популярным китайским моделям.",
    note: "作为补充入口，不作为单独客户。",
  },
  {
    name: "T-Аuto catalog",
    type: "金融/平台销售入口",
    city: "俄罗斯",
    channel: "车商/代购",
    priority: "低",
    fit: "平台有新车购买、申请和配送流程；可作为观察俄市场车型和价格的入口，直接成交可能性低。",
    publicContact: "平台表单",
    social: "未公开",
    source: "https://www.tbank.ru/auto/catalog/",
    suggestedOpen: "不建议作为第一批开发对象；用于看价格和车型趋势。",
    note: "大平台，回复概率低。",
  },
];

const playbook = [
  ["Drom/Avito/Auto.ru 车型广告", "按 Li L7/L9、Zeekr 001/009、Jetour T2、Tank 300/500、Changan、Geely 筛选", "优先联系同账号多台车的卖家", "开场只说看到某车型广告+能给中国出口价"],
  ["Li/Lixiang 经销体系", "从 liautoofficial、li-motors、okami 页面进入 dealer/partner/contact", "找采购、企业客户、合作部门", "不要问是否买车，问是否需要稳定中国车源/补充配置"],
  ["物流清关转介绍", "搜索俄语：доставка авто из Китая / растаможка авто из Китая / таможенный брокер авто", "问他们是否有客户需要中国现车报价", "给介绍佣金或一起赚服务费"],
  ["售后配件/维修店", "搜索俄语：сервис китайских автомобилей / ремонт Li Auto / ремонт Zeekr", "维修店知道谁卖得多、谁缺货", "不要推销车，先问是否认识车商需要稳定车源"],
  ["区域打法", "叶卡捷琳堡、新西伯利亚、喀山、乌法、克拉斯诺达尔、海参崴", "二线城市比莫斯科更缺中国供应链", "用具体到城的到货时间和成本表切入"],
];

const headers = [
  "名称",
  "类型",
  "城市/区域",
  "渠道",
  "优先级",
  "为什么适合开发",
  "公开联系方式",
  "Telegram/VK/社媒",
  "来源链接",
  "建议开场白",
  "备注",
];

const workbook = Workbook.create();
const ws = workbook.worksheets.add("客户与渠道清单");
ws.showGridLines = false;
ws.getRange("A1:K1").values = [headers];
ws.getRangeByIndexes(1, 0, directLeads.length, headers.length).values = directLeads.map((r) => [
  r.name,
  r.type,
  r.city,
  r.channel,
  r.priority,
  r.fit,
  r.publicContact,
  r.social,
  r.source,
  r.suggestedOpen,
  r.note,
]);

ws.freezePanes.freezeRows(1);
ws.getRange("A1:K1").format = {
  fill: "#1F4E79",
  font: { color: "#FFFFFF", bold: true },
  wrapText: true,
};
ws.getRangeByIndexes(0, 0, directLeads.length + 1, headers.length).format = {
  font: { name: "Microsoft YaHei", size: 10 },
  wrapText: true,
  verticalAlignment: "top",
};
ws.getRangeByIndexes(0, 0, directLeads.length + 1, headers.length).format.borders = {
  preset: "all",
  style: "thin",
  color: "#D9E2F3",
};
ws.getRange("A:A").format.columnWidth = 28;
ws.getRange("B:B").format.columnWidth = 22;
ws.getRange("C:C").format.columnWidth = 20;
ws.getRange("D:E").format.columnWidth = 12;
ws.getRange("F:F").format.columnWidth = 42;
ws.getRange("G:H").format.columnWidth = 34;
ws.getRange("I:I").format.columnWidth = 46;
ws.getRange("J:J").format.columnWidth = 54;
ws.getRange("K:K").format.columnWidth = 34;
ws.tables.add(`A1:K${directLeads.length + 1}`, true, "RussiaNontraditionalLeads");

const ps = workbook.worksheets.add("开发打法");
ps.showGridLines = false;
ps.getRange("A1:D1").values = [["路径", "怎么找", "筛选标准", "第一句话方向"]];
ps.getRangeByIndexes(1, 0, playbook.length, 4).values = playbook;
ps.freezePanes.freezeRows(1);
ps.getRange("A1:D1").format = {
  fill: "#6B7C3A",
  font: { color: "#FFFFFF", bold: true },
  wrapText: true,
};
ps.getRangeByIndexes(0, 0, playbook.length + 1, 4).format = {
  font: { name: "Microsoft YaHei", size: 10 },
  wrapText: true,
  verticalAlignment: "top",
};
ps.getRangeByIndexes(0, 0, playbook.length + 1, 4).format.borders = {
  preset: "all",
  style: "thin",
  color: "#E2E8D5",
};
ps.getRange("A:A").format.columnWidth = 28;
ps.getRange("B:D").format.columnWidth = 46;
ps.tables.add(`A1:D${playbook.length + 1}`, true, "RussiaLeadPlaybook");

const ns = workbook.worksheets.add("说明");
ns.showGridLines = false;
ns.getRange("A1:B8").values = [
  ["生成日期", "2026-07-14"],
  ["原则", "只记录网页公开可验证的联系方式；未能稳定提取的联系方式标为未公开或平台内展示。"],
  ["重要提醒", "俄罗斯方向开发需做合规审查，避免受限制主体、受限制车型/用途、异常付款和不透明最终买家。"],
  ["使用方法", "第一批优先联系高优先级直接对象；同时每天从 Drom/Avito/Auto.ru 按热门车型挖 20 个正在卖车的具体账号。"],
  ["推荐车型切入", "Li L6/L7/L9、Zeekr 001/009、Jetour T2、Tank 300/500、Changan、Geely、Voyah。"],
  ["不要这样做", "不要群发公司介绍；不要只发“we export cars”。每条消息必须带对方正在卖的车型。"],
  ["后续补充", "若需要更大名单，建议按城市+车型逐条进入平台广告人工提取车商账号。"],
  ["来源", "见客户与渠道清单的来源链接列。"],
];
ns.getRange("A1:A8").format = { fill: "#F2F2F2", font: { bold: true } };
ns.getRange("A1:B8").format = {
  font: { name: "Microsoft YaHei", size: 10 },
  wrapText: true,
  verticalAlignment: "top",
};
ns.getRange("A:A").format.columnWidth = 18;
ns.getRange("B:B").format.columnWidth = 90;

const preview = await workbook.render({ sheetName: "客户与渠道清单", autoCrop: "all", scale: 1, format: "png" });
await fs.writeFile(`${outputDir}/preview.png`, new Uint8Array(await preview.arrayBuffer()));

const inspect = await workbook.inspect({
  kind: "table",
  sheetId: "客户与渠道清单",
  range: `A1:K${directLeads.length + 1}`,
  tableMaxRows: 5,
  tableMaxCols: 6,
  maxChars: 3000,
});
console.log(inspect.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(`${outputDir}/俄罗斯非常规客户开发清单.xlsx`);
