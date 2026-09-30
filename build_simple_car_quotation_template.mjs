import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "outputs/car_quotation_template";
await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Quotation");
const lists = workbook.worksheets.add("Lists");

const navy = "#17324D";
const teal = "#1D7A8C";
const pale = "#F6F8FA";
const line = "#C9D3DC";
const white = "#FFFFFF";
const green = "#E7F4EA";

sheet.showGridLines = false;
lists.showGridLines = false;

sheet.getRange("A1:L1").merge();
sheet.getRange("A1").values = [["VEHICLE QUOTATION"]];
sheet.getRange("A1").format = {
  fill: navy,
  font: { bold: true, color: white, size: 18 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
sheet.getRange("A1").format.rowHeight = 34;

sheet.getRange("A2:L2").merge();
sheet.getRange("A2").values = [["For international vehicle buyers | Simple price offer for quick review"]];
sheet.getRange("A2").format = {
  fill: "#DCECEF",
  font: { color: navy, italic: true },
  horizontalAlignment: "center",
};

sheet.getRange("A4:L4").merge();
sheet.getRange("A4").values = [["Supplier & Quotation Details"]];
sheet.getRange("A4").format = { fill: teal, font: { bold: true, color: white } };

sheet.getRange("A5:L9").values = [
  ["Company", "[Your Company Name]", "", "", "Quotation No.", "QT-2026-001", "", "", "Quotation Date", new Date("2026-07-03"), "", ""],
  ["Contact", "[Sales Manager]", "", "", "Currency", "USD", "", "", "Valid Until", new Date("2026-07-17"), "", ""],
  ["Email", "[sales@company.com]", "", "", "Incoterms", "FOB", "", "", "Lead Time", "15-30 days", "", ""],
  ["WhatsApp", "[+86 ...]", "", "", "Payment Term", "30% deposit, 70% before shipment", "", "", "Destination Port", "[To be confirmed]", "", ""],
  ["Website", "[www.company.com]", "", "", "Price Note", "Subject to final stock and shipping confirmation", "", "", "", "", "", ""],
];
sheet.getRange("A5:A9").format = { fill: pale, font: { bold: true, color: navy } };
sheet.getRange("E5:E9").format = { fill: pale, font: { bold: true, color: navy } };
sheet.getRange("I5:I9").format = { fill: pale, font: { bold: true, color: navy } };
sheet.getRange("A5:L9").format.borders = { preset: "all", style: "thin", color: line };
sheet.getRange("J5:J6").format.numberFormat = "yyyy-mm-dd";

sheet.getRange("A11:L11").merge();
sheet.getRange("A11").values = [["Vehicle Price List"]];
sheet.getRange("A11").format = { fill: navy, font: { bold: true, color: white } };

sheet.getRange("A12:L12").values = [[
  "No.",
  "Brand",
  "Model",
  "Year",
  "Version / Trim",
  "Fuel",
  "Drive",
  "Color",
  "Qty",
  "Unit Price",
  "Total",
  "Remarks",
]];
sheet.getRange("A12:L12").format = {
  fill: teal,
  font: { bold: true, color: white },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
sheet.getRange("A12:L12").format.rowHeight = 32;

const rows = [];
for (let i = 1; i <= 10; i += 1) {
  rows.push([
    i,
    i === 1 ? "Jetour" : "",
    i === 1 ? "T2 i-DM" : "",
    i === 1 ? 2026 : "",
    i === 1 ? "Luxury / High Spec" : "",
    i === 1 ? "PHEV" : "",
    i === 1 ? "4WD" : "",
    i === 1 ? "Black / White" : "",
    i === 1 ? 1 : "",
    i === 1 ? 28500 : "",
    "",
    i === 1 ? "Sample row - replace with actual offer" : "",
  ]);
}
sheet.getRange("A13:L22").values = rows;
sheet.getRange("K13").formulas = [["=I13*J13"]];
sheet.getRange("K13:K22").fillDown();
sheet.getRange("A13:L22").format = {
  borders: { preset: "all", style: "thin", color: line },
  verticalAlignment: "center",
  wrapText: true,
};
sheet.getRange("A13:A22").format.horizontalAlignment = "center";
sheet.getRange("D13:D22").format.horizontalAlignment = "center";
sheet.getRange("I13:I22").format.horizontalAlignment = "center";
sheet.getRange("J13:K22").format.numberFormat = "$#,##0;-$#,##0;";
sheet.getRange("A13:L22").format.rowHeight = 27;

sheet.getRange("H24:K27").values = [
  ["Summary", "", "", ""],
  ["Total Quantity", "", "", ""],
  ["Grand Total", "", "", ""],
  ["Amount in Words", "", "", ""],
];
sheet.getRange("H24:K24").merge();
sheet.getRange("I25:K25").merge();
sheet.getRange("I26:K26").merge();
sheet.getRange("I27:K27").merge();
sheet.getRange("H24:K27").format.borders = { preset: "all", style: "thin", color: line };
sheet.getRange("H24").format = { fill: navy, font: { bold: true, color: white } };
sheet.getRange("H25:H27").format = { fill: pale, font: { bold: true, color: navy } };
sheet.getRange("I25").formulas = [["=SUM(I13:I22)"]];
sheet.getRange("I26").formulas = [["=SUM(K13:K22)"]];
sheet.getRange("I26").format.numberFormat = "$#,##0;-$#,##0;";
sheet.getRange("H26:I26").format = { fill: green, font: { bold: true, color: navy } };
sheet.getRange("I27").values = [["[Optional]"]];

sheet.getRange("A24:F31").values = [
  ["Terms & Notes", "", "", "", "", ""],
  ["Price Basis", "FOB / CFR / CIF can be quoted upon request.", "", "", "", ""],
  ["Payment", "30% deposit, 70% balance before shipment unless otherwise agreed.", "", "", "", ""],
  ["Availability", "Vehicle availability is subject to final stock confirmation.", "", "", "", ""],
  ["Shipping", "Freight cost and shipping schedule depend on destination port and carrier space.", "", "", "", ""],
  ["Documents", "Commercial invoice, packing list, bill of lading, and certificate of origin can be provided.", "", "", "", ""],
  ["Validity", "This quotation is valid until the date stated above.", "", "", "", ""],
  ["Next Step", "Please confirm model, quantity, color, destination port, and preferred Incoterms.", "", "", "", ""],
];
sheet.getRange("A24:F24").merge();
sheet.getRange("B25:F31").merge(true);
sheet.getRange("A24:F31").format.borders = { preset: "all", style: "thin", color: line };
sheet.getRange("A24").format = { fill: navy, font: { bold: true, color: white } };
sheet.getRange("A25:A31").format = { fill: pale, font: { bold: true, color: navy } };
sheet.getRange("B25:F31").format = { wrapText: true, verticalAlignment: "top" };

sheet.getRange("A33:L33").merge();
sheet.getRange("A33").values = [["Prices, specifications, colors, and delivery time are subject to final confirmation before order."]];
sheet.getRange("A33").format = {
  fill: "#FFF4D6",
  font: { italic: true, color: "#5B6773" },
  horizontalAlignment: "center",
};

const widths = [7, 14, 18, 9, 22, 16, 10, 14, 18, 17, 15, 30];
for (let c = 0; c < widths.length; c += 1) {
  sheet.getRangeByIndexes(0, c, 1, 1).format.columnWidth = widths[c];
}

lists.getRange("A1:D1").values = [["Fuel", "Drive", "Currency", "Incoterms"]];
lists.getRange("A2:A9").values = [["Gasoline"], ["Diesel"], ["HEV"], ["PHEV"], ["EV"], ["REEV"], ["CNG"], ["Other"]];
lists.getRange("B2:B6").values = [["FWD"], ["RWD"], ["AWD"], ["4WD"], ["Other"]];
lists.getRange("C2:C6").values = [["USD"], ["EUR"], ["AED"], ["RUB"], ["CNY"]];
lists.getRange("D2:D8").values = [["EXW"], ["FOB"], ["CFR"], ["CIF"], ["DAP"], ["DDP"], ["Other"]];
lists.getRange("A1:D1").format = { fill: navy, font: { bold: true, color: white } };
lists.getRange("A:D").format.columnWidth = 16;

sheet.getRange("F6").dataValidation = { rule: { type: "list", formula1: "Lists!$C$2:$C$6" } };
sheet.getRange("F7").dataValidation = { rule: { type: "list", formula1: "Lists!$D$2:$D$8" } };
sheet.getRange("F13:F22").dataValidation = { rule: { type: "list", formula1: "Lists!$A$2:$A$9" } };
sheet.getRange("G13:G22").dataValidation = { rule: { type: "list", formula1: "Lists!$B$2:$B$6" } };

sheet.freezePanes.freezeRows(12);
sheet.getRange("A1:L33").format.font = { name: "Aptos" };
lists.getRange("A1:D9").format.font = { name: "Aptos" };

const preview = await workbook.render({
  sheetName: "Quotation",
  range: "A1:L33",
  scale: 1,
  format: "png",
});
await fs.writeFile(`${outputDir}/simple_quotation_preview.png`, new Uint8Array(await preview.arrayBuffer()));

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(`${outputDir}/Simple_Vehicle_Quotation_Template_EN.xlsx`);
