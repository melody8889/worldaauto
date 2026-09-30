import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "C:/Users/Melody/Documents/汽车出口独立站/outputs/middle-east-auto-importers";

const headers = [
  "序号",
  "公司名称",
  "国家/地区",
  "城市",
  "公司规模判断",
  "主营业务/车型",
  "联系人",
  "职位",
  "邮箱",
  "电话",
  "WhatsApp",
  "官网/店铺",
  "公开联系来源",
  "贸易数据核验状态",
  "贸易核验来源",
  "活跃状态判断",
  "备注"
];

const rows = [
  [1, "Alba Cars", "UAE", "Dubai", "中小型独立车商", "二手车、豪华车、SUV、出口客户询价", "未公开", "未公开", "info@albacars.ae; jparker@albacars.ae; alex@albacars.ae", "+971 4 377 2503", "官网有 WhatsApp 入口", "https://www.albacars.ae/", "官网首页公开邮箱/电话/WhatsApp 入口", "已做公开贸易数据入口核验", "Volza/Panjiva/ImportGenius 等公开入口按公司名核验；不展开提单", "官网可访问，库存和联系入口正常", "适合作为迪拜高端二手车/出口询价客户"],
  [2, "Linda Cars", "UAE", "Dubai", "中小型独立车商", "二手车、豪华车、SUV、现车销售", "未公开", "未公开", "info@lindacars.com", "+971 4 510 9400", "官网有 WhatsApp 入口", "https://www.lindacars.com/", "官网公开邮箱/电话/WhatsApp 入口", "已做公开贸易数据入口核验", "Volza/Panjiva/ImportGenius 等公开入口按公司名核验；不展开提单", "官网可访问，页面体量大且库存内容活跃", "迪拜本地独立车商，适合高端车源开发"],
  [3, "Milele Motors", "UAE", "Dubai", "中型出口型车商", "新车、SUV、皮卡、商用车、全球出口", "未公开", "未公开", "info@milele.com", "+971 800 645353; +971 54 497 7510; +971 4 323 5991", "官网有 WhatsApp 入口", "https://milele.com/", "官网公开邮箱/电话/WhatsApp 入口", "已做公开贸易数据入口核验", "Volza/Panjiva/ImportGenius 等公开入口按公司名核验；不展开提单", "官网可访问，明确展示车辆出口业务", "规模略大但仍是贸易型车商，不是整车厂/总代理"],
  [4, "Piston Motors", "UAE", "Dubai", "中小型独立车商", "高端二手车、性能车、豪华 SUV", "未公开", "未公开", "未公开", "未公开", "官网/社媒渠道核验", "https://www.pistonmotors.com/", "官网可访问，联系信息需页面内进一步确认", "已做公开贸易数据入口核验", "Volza/Panjiva/ImportGenius 等公开入口按公司名核验；不展开提单", "官网可访问，库存展示正常", "公开邮箱未稳定提取，建议优先用官网表单或社媒"],
  [5, "The Elite Cars", "UAE", "Dubai", "中型独立豪华车商", "豪华车、超豪华车、SUV、寄售/销售", "未公开", "未公开", "customer-care@theelitecars.com; sales-product@theelitecars.com", "未公开", "官网有 WhatsApp 入口", "https://theelitecars.com/", "官网公开邮箱/WhatsApp 入口", "已做公开贸易数据入口核验", "Volza/Panjiva/ImportGenius 等公开入口按公司名核验；不展开提单", "官网可访问，库存和联系入口正常", "适合高端车、豪华 SUV 外贸线索"],
  [6, "F1rst Motors", "UAE", "Dubai", "中型独立豪华车商", "超跑、豪华车、高端 SUV", "未公开", "未公开", "info@f1rstmotors.com", "+971 4 320 1030", "未公开", "https://f1rstmotors.com/", "官网公开邮箱/电话", "已做公开贸易数据入口核验", "Volza/Panjiva/ImportGenius 等公开入口按公司名核验；不展开提单", "官网可访问，库存展示正常", "高端车客户，价格带较高"],
  [7, "Auto Deals UAE", "UAE", "Dubai", "中小型汽车服务/车商", "二手车销售、汽车交易服务", "未公开", "未公开", "info@autodeals.ae", "+971 55 696 9976; +971 4 297 9745", "官网有 WhatsApp 入口", "https://www.autodeals.ae/", "官网公开邮箱/电话/WhatsApp 入口", "已做公开贸易数据入口核验", "Volza/Panjiva/ImportGenius 等公开入口按公司名核验；不展开提单", "官网可访问，联系入口正常", "官网含样例邮箱字段，使用 info 邮箱为主"],
  [8, "Sahara Motors", "UAE", "Dubai/Sharjah", "中型车辆贸易商", "SUV、皮卡、出口车型、新车/二手车", "未公开", "未公开", "未公开", "未公开", "未公开", "https://www.saharamotorsuae.com/", "官网访问受限，需人工打开复核", "已做公开贸易数据入口核验", "Volza/Panjiva/ImportGenius 等公开入口按公司名核验；不展开提单", "品牌和业务仍可公开检索，官网有访问限制", "建议通过官网、DubiCars 或社媒补联系方式"],
  [9, "Verona Used Cars", "UAE", "Dubai", "中小型二手车商", "二手车、乘用车、SUV", "未公开", "未公开", "未公开", "未公开", "未公开", "https://www.dubicars.com/dealers/dubai-verona-used-cars-3202", "DubiCars 经销商页", "已做公开贸易数据入口核验", "DubiCars 经营页 + 贸易数据库入口按公司名核验", "DubiCars 店铺页存在，说明仍有公开销售渠道", "适合作为中小客户候选，需二次获取邮箱/WA"],
  [10, "Andaleeb Used Cars Trading", "UAE", "Dubai", "中小型二手车贸易商", "二手车、乘用车、SUV", "未公开", "未公开", "未公开", "未公开", "未公开", "https://www.dubicars.com/dealers/dubai-andaleeb-used-cars-trading-1982", "DubiCars 经销商页", "已做公开贸易数据入口核验", "DubiCars 经营页 + 贸易数据库入口按公司名核验", "DubiCars 店铺页存在，说明仍有公开销售渠道", "中小规模特征明显，适合后续电话/平台开发"],
  [11, "F7 Motors Trading", "UAE", "Dubai", "中小型汽车贸易商", "二手车、乘用车、SUV", "未公开", "未公开", "未公开", "未公开", "未公开", "https://www.dubicars.com/dealers/dubai-f7-motors-trading-2505", "DubiCars 经销商页", "已做公开贸易数据入口核验", "DubiCars 经营页 + 贸易数据库入口按公司名核验", "DubiCars 店铺页存在，说明仍有公开销售渠道", "可作为迪拜车商外呼/WhatsApp 二次开发对象"],
  [12, "Al Attar Used Cars 33", "UAE", "Dubai", "中小型二手车商", "二手车、乘用车、SUV", "未公开", "未公开", "未公开", "未公开", "未公开", "https://www.dubicars.com/dealers/dubai-al-attar-used-cars-33-2701", "DubiCars 经销商页", "已做公开贸易数据入口核验", "DubiCars 经营页 + 贸易数据库入口按公司名核验", "DubiCars 店铺页存在，说明仍有公开销售渠道", "公开联系方式需从平台或电话二次获取"],
  [13, "Approved Automotive", "UAE", "Dubai", "中小型车商", "二手车、认证车、SUV", "未公开", "未公开", "未公开", "未公开", "未公开", "https://www.dubicars.com/dealers/dubai-approved-automotive-2865", "DubiCars 经销商页", "已做公开贸易数据入口核验", "DubiCars 经营页 + 贸易数据库入口按公司名核验", "DubiCars 店铺页存在，说明仍有公开销售渠道", "适合补充迪拜中小车商名单"],
  [14, "Auto Max Used Cars Trading", "UAE", "Dubai", "中小型二手车贸易商", "二手车、乘用车、SUV", "未公开", "未公开", "未公开", "+971 50 364 4649; +971 50 119 9711", "DubiCars 显示 WhatsApp 入口", "https://www.dubicars.com/dealers/dubai-auto-max-used-cars-trading-158", "DubiCars 公开经销商页，含电话/WhatsApp 信号", "已做公开贸易数据入口核验", "DubiCars 经营页 + 贸易数据库入口按公司名核验", "DubiCars 店铺页可访问，车辆销售页存在", "中小规模特征明显，适合 WhatsApp 开发"],
  [15, "Auto Bank Used Cars Trading", "UAE", "Dubai", "中小型二手车贸易商", "二手车、乘用车、SUV", "未公开", "未公开", "未公开", "+971 54 247 9606", "DubiCars 显示 WhatsApp 入口", "https://www.dubicars.com/dealers/dubai-auto-bank-used-cars-trading-2278", "DubiCars 公开经销商页，含电话/WhatsApp 信号", "已做公开贸易数据入口核验", "DubiCars 经营页 + 贸易数据库入口按公司名核验", "DubiCars 店铺页可访问，车辆销售页存在", "适合迪拜二手车批发/现车询价"],
  [16, "Alpha Motors", "UAE", "Dubai", "中小型汽车贸易商", "二手车、乘用车、SUV", "未公开", "未公开", "未公开", "+971 52 366 5463; +971 4 333 4220", "DubiCars 显示 WhatsApp 入口", "https://www.dubicars.com/dealers/dubai-alpha-motors-1837", "DubiCars 公开经销商页，含电话/WhatsApp 信号", "已做公开贸易数据入口核验", "DubiCars 经营页 + 贸易数据库入口按公司名核验", "DubiCars 店铺页可访问，车辆销售页存在", "公开电话较完整，优先级较高"],
  [17, "Arabia One International", "UAE", "Dubai", "中小型车辆贸易商", "二手车、乘用车、SUV、出口型库存", "未公开", "未公开", "未公开", "+971 55 820 2906", "DubiCars 显示 WhatsApp 入口", "https://www.dubicars.com/dealers/dubai-arabia-one-international-1673", "DubiCars 公开经销商页，含电话/WhatsApp 信号", "已做公开贸易数据入口核验", "DubiCars 经营页 + 贸易数据库入口按公司名核验", "DubiCars 店铺页可访问，车辆销售页存在", "名称和业务形态更接近贸易客户"],
  [18, "Arion Motors", "UAE", "Dubai", "中小型汽车贸易商", "二手车、乘用车、SUV", "未公开", "未公开", "未公开", "+971 52 568 1065", "DubiCars 显示 WhatsApp 入口", "https://www.dubicars.com/dealers/dubai-arion-motors-3272", "DubiCars 公开经销商页，含电话/WhatsApp 信号", "已做公开贸易数据入口核验", "DubiCars 经营页 + 贸易数据库入口按公司名核验", "DubiCars 店铺页可访问，车辆销售页存在", "适合后续 WhatsApp 触达"],
  [19, "Atlantis Motors", "UAE", "Dubai", "中小型汽车贸易商", "二手车、乘用车、SUV", "未公开", "未公开", "未公开", "+971 58 823 3188; +971 56 998 0051", "DubiCars 显示 WhatsApp 入口", "https://www.dubicars.com/dealers/dubai-atlantis-motors-2345", "DubiCars 公开经销商页，含电话/WhatsApp 信号", "已做公开贸易数据入口核验", "DubiCars 经营页 + 贸易数据库入口按公司名核验", "DubiCars 店铺页可访问，车辆销售页存在", "多个公开电话，适合优先开发"],
  [20, "World Wide Auto", "UAE", "Dubai", "中小型车辆贸易商", "二手车、乘用车、SUV、出口型库存", "未公开", "未公开", "未公开", "+971 58 293 7627; +971 58 557 7756", "DubiCars 显示 WhatsApp 入口", "https://www.dubicars.com/dealers/dubai-world-wide-auto-2576", "DubiCars 公开经销商页，含电话/WhatsApp 信号", "已做公开贸易数据入口核验", "DubiCars 经营页 + 贸易数据库入口按公司名核验", "DubiCars 店铺页可访问，车辆销售页存在", "公司名和销售渠道适合外贸车辆开发"]
];

const notes = [
  ["项目", "说明"],
  ["筛选区域", "中东地区第一批，优先保留公开联系方式和活跃店铺页更完整的 UAE/Dubai 中小车辆贸易商。"],
  ["客户类型", "优先选择中小型独立车商、车辆贸易商、出口/进口型车商；明显大型整车厂、总代集团、纯平台型大企业原则上不作为首选。"],
  ["贸易数据口径", "本表按公司名/国家/车辆品类通过公开贸易数据入口做筛选核验。部分贸易平台明细页需要登录或反爬，表内不展示提单明细，也不把无法复核的提单内容写入。"],
  ["活跃判断", "官网/店铺页可访问、库存/车辆分类存在、公开电话/邮箱/WhatsApp 入口存在，或区域车辆交易平台仍有经营页。"],
  ["联系人字段", "只填写公开可确认的联系人；未公开时标注为“未公开”，不猜测个人姓名。"],
  ["WhatsApp 字段", "只填写官网/平台明确显示的 WhatsApp 或 WhatsApp 入口；未公开不补造号码。"],
  ["使用建议", "优先联系邮箱和 WhatsApp 已公开的公司；平台型条目建议进入平台筛具体 showroom，再补充采购联系人。"],
  ["更新时间", "2026-06-26"]
];

await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("中东汽车进口商");
sheet.showGridLines = false;
sheet.getRangeByIndexes(0, 0, 1, headers.length).values = [headers];
sheet.getRangeByIndexes(1, 0, rows.length, headers.length).values = rows;
sheet.freezePanes.freezeRows(1);

const dataRange = sheet.getRangeByIndexes(0, 0, rows.length + 1, headers.length);
dataRange.format.font = { name: "Microsoft YaHei", size: 10, color: "#1F2933" };
dataRange.format.wrapText = true;
dataRange.format.borders = { preset: "inside", style: "thin", color: "#E5E7EB" };

const headerRange = sheet.getRangeByIndexes(0, 0, 1, headers.length);
headerRange.format = {
  fill: "#1F4E5F",
  font: { name: "Microsoft YaHei", bold: true, color: "#FFFFFF", size: 10 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true
};
headerRange.format.rowHeight = 34;

sheet.getRangeByIndexes(1, 0, rows.length, 1).format.horizontalAlignment = "center";
sheet.getRangeByIndexes(1, 0, rows.length, headers.length).format.verticalAlignment = "top";
sheet.getRangeByIndexes(1, 0, rows.length, headers.length).format.rowHeight = 64;

const widths = [7, 24, 12, 13, 18, 28, 12, 12, 34, 28, 24, 42, 34, 22, 38, 28, 38];
widths.forEach((width, idx) => {
  sheet.getRangeByIndexes(0, idx, rows.length + 1, 1).format.columnWidth = width;
});

const table = sheet.tables.add(`A1:Q${rows.length + 1}`, true, "MiddleEastAutoImporters");
table.style = "TableStyleMedium2";
table.showFilterButton = true;

const notesSheet = workbook.worksheets.add("筛选说明");
notesSheet.showGridLines = false;
notesSheet.getRangeByIndexes(0, 0, notes.length, 2).values = notes;
notesSheet.getRange("A1:B1").format = {
  fill: "#1F4E5F",
  font: { name: "Microsoft YaHei", bold: true, color: "#FFFFFF", size: 11 },
};
notesSheet.getRangeByIndexes(0, 0, notes.length, 2).format.font = { name: "Microsoft YaHei", size: 10, color: "#1F2933" };
notesSheet.getRangeByIndexes(0, 0, notes.length, 2).format.wrapText = true;
notesSheet.getRangeByIndexes(0, 0, notes.length, 2).format.borders = { preset: "inside", style: "thin", color: "#E5E7EB" };
notesSheet.getRange("A:A").format.columnWidth = 18;
notesSheet.getRange("B:B").format.columnWidth = 92;
notesSheet.getRangeByIndexes(1, 0, notes.length - 1, 2).format.rowHeight = 42;
notesSheet.freezePanes.freezeRows(1);
notesSheet.tables.add(`A1:B${notes.length}`, true, "ScreeningNotes").style = "TableStyleMedium2";

const inspect = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 4000,
  tableMaxRows: 3,
  tableMaxCols: 5
});
console.log(inspect.ndjson);

const preview = await workbook.render({
  sheetName: "中东汽车进口商",
  range: "A1:Q8",
  scale: 1,
  format: "png"
});
await fs.writeFile(`${outputDir}/preview.png`, new Uint8Array(await preview.arrayBuffer()));

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(`${outputDir}/中东中小汽车进口商客户名单.xlsx`);
