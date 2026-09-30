import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/Users/Melody/Documents/汽车出口独立站/outputs/sea-auto-importers-sme-corrected/东南亚中小汽车进口商客户名单_重筛版.xlsx";
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const summary = await workbook.inspect({
  kind: "workbook,sheet,table,region",
  maxChars: 12000,
  tableMaxRows: 8,
  tableMaxCols: 14,
  tableMaxCellChars: 120,
});
console.log(summary.ndjson);
