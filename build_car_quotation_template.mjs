import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "outputs/car_quotation_template";
await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const quote = workbook.worksheets.add("Quotation");
const guide = workbook.worksheets.add("Instructions");
const lists = workbook.worksheets.add("Lists");

const dark = "#17324D";
const teal = "#1D7A8C";
const lightBlue = "#EAF4F7";
const pale = "#F6F8FA";
const line = "#C9D3DC";
const gray = "#5B6773";
const white = "#FFFFFF";
const green = "#E7F4EA";
const amber = "#FFF4D6";

quote.showGridLines = false;
guide.showGridLines = false;
lists.showGridLines = false;

quote.getRange("A1:Q1").merge();
quote.getRange("A1").values = [["VEHICLE EXPORT QUOTATION"]];
quote.getRange("A1").format = {
  fill: dark,
  font: { bold: true, color: white, size: 18 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
quote.getRange("A1").format.rowHeight = 34;

quote.getRange("A2:Q2").merge();
quote.getRange("A2").values = [["Prepared for international buyers | Prices, specifications, and availability are subject to final confirmation."]];
quote.getRange("A2").format = {
  fill: "#DCECEF",
  font: { color: dark, italic: true },
  horizontalAlignment: "center",
};

quote.getRange("A4:Q4").values = [[
  "Supplier Information", "", "", "", "", "", "", "",
  "Buyer Information", "", "", "", "",
  "Quotation Summary", "", "", "",
]];
quote.getRange("A4:H4").merge();
quote.getRange("I4:M4").merge();
quote.getRange("N4:Q4").merge();
quote.getRange("A4:Q4").format = {
  fill: teal,
  font: { bold: true, color: white },
  horizontalAlignment: "center",
};

quote.getRange("A5:B11").values = [
  ["Company Name", "[Your Company Name]"],
  ["Address", "[Street, City, Country]"],
  ["Contact Person", "[Sales Manager]"],
  ["Email", "[sales@company.com]"],
  ["WhatsApp / Phone", "[+86 ...]"],
  ["Website", "[www.company.com]"],
  ["Export License / Tax ID", "[Optional]"],
];
quote.getRange("I5:J11").values = [
  ["Buyer Company", "[Buyer Company Name]"],
  ["Contact Person", "[Buyer Contact]"],
  ["Country / Region", "[Destination Country]"],
  ["Email", "[buyer@email.com]"],
  ["WhatsApp / Phone", "[Buyer Phone]"],
  ["Destination Port", "[Jebel Ali / Vladivostok / etc.]"],
  ["Final Destination", "[City, Country]"],
];
quote.getRange("N5:O11").values = [
  ["Quotation No.", "QT-2026-001"],
  ["Quotation Date", new Date("2026-07-03")],
  ["Valid Until", new Date("2026-07-17")],
  ["Currency", "USD"],
  ["Incoterms", "FOB"],
  ["Payment Term", "30% deposit, 70% before shipment"],
  ["Estimated Lead Time", "15-30 days after deposit"],
];
quote.getRange("P5:Q11").merge(true);
quote.getRange("P5").values = [["Status"]];
quote.getRange("P6").values = [["Draft / For Review"]];
quote.getRange("P7").values = [["Version"]];
quote.getRange("P8").values = [["V1.0"]];
quote.getRange("P9").values = [["Prepared By"]];
quote.getRange("P10").values = [["[Name]"]];
quote.getRange("P11").values = [[""]]

quote.getRange("A5:A11").format = { fill: pale, font: { bold: true, color: dark } };
quote.getRange("I5:I11").format = { fill: pale, font: { bold: true, color: dark } };
quote.getRange("N5:N11").format = { fill: pale, font: { bold: true, color: dark } };
quote.getRange("P5:P11").format = { fill: pale, font: { bold: true, color: dark } };
quote.getRange("A5:H11").format.borders = { preset: "all", style: "thin", color: line };
quote.getRange("I5:M11").format.borders = { preset: "all", style: "thin", color: line };
quote.getRange("N5:Q11").format.borders = { preset: "all", style: "thin", color: line };
quote.getRange("O6:O7").format.numberFormat = "yyyy-mm-dd";

quote.getRange("A13:Q13").merge();
quote.getRange("A13").values = [["Vehicle Details & Price Breakdown"]];
quote.getRange("A13").format = {
  fill: dark,
  font: { bold: true, color: white },
  horizontalAlignment: "left",
};

const headers = [[
  "No.",
  "Brand",
  "Model",
  "Model Year",
  "Version / Trim",
  "Fuel Type",
  "Drive",
  "Color",
  "Qty",
  "Unit Vehicle Price",
  "Unit Freight",
  "Insurance",
  "Other Charges",
  "Unit Delivered Price",
  "Line Total",
  "Lead Time",
  "Remarks",
]];
quote.getRange("A14:Q14").values = headers;
quote.getRange("A14:Q14").format = {
  fill: teal,
  font: { bold: true, color: white },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
quote.getRange("A14:Q14").format.rowHeight = 36;

const rows = [];
for (let i = 1; i <= 12; i += 1) {
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
    i === 1 ? 1200 : "",
    i === 1 ? 180 : "",
    i === 1 ? 250 : "",
    "",
    "",
    i === 1 ? "15-25 days" : "",
    i === 1 ? "Sample row - replace with actual offer" : "",
  ]);
}
quote.getRange("A15:Q26").values = rows;
quote.getRange("N15").formulas = [["=SUM(J15:M15)"]];
quote.getRange("N15:N26").fillDown();
quote.getRange("O15").formulas = [["=I15*N15"]];
quote.getRange("O15:O26").fillDown();

quote.getRange("A15:Q26").format = {
  borders: { preset: "all", style: "thin", color: line },
  verticalAlignment: "center",
  wrapText: true,
};
quote.getRange("A15:A26").format.horizontalAlignment = "center";
quote.getRange("I15:I26").format.horizontalAlignment = "center";
quote.getRange("J15:O26").format.numberFormat = "$#,##0";
quote.getRange("N15:O26").format.numberFormat = "$#,##0;-$#,##0;";
quote.getRange("A15:Q26").format.rowHeight = 27;

quote.getRange("A28:F34").values = [
  ["Commercial Terms", "", "", "", "", ""],
  ["Price Basis", "FOB / CFR / CIF / DAP as agreed in final proforma invoice", "", "", "", ""],
  ["Payment Terms", "30% deposit by T/T, 70% balance before shipment unless otherwise agreed", "", "", "", ""],
  ["Delivery Time", "Subject to vehicle availability, export documents, and shipping schedule", "", "", "", ""],
  ["Documents Provided", "Commercial Invoice, Packing List, Bill of Lading, Certificate of Origin, Export Declaration", "", "", "", ""],
  ["Warranty", "Factory warranty or seller warranty subject to destination market policy", "", "", "", ""],
  ["Validity", "This quotation is valid until the date stated above and may change without prior notice.", "", "", "", ""],
];
quote.getRange("A28:F28").merge();
quote.getRange("B29:F34").merge(true);
quote.getRange("A28:F34").format.borders = { preset: "all", style: "thin", color: line };
quote.getRange("A28").format = { fill: dark, font: { bold: true, color: white } };
quote.getRange("A29:A34").format = { fill: pale, font: { bold: true, color: dark } };
quote.getRange("B29:F34").format = { wrapText: true, verticalAlignment: "top" };

quote.getRange("H28:Q34").values = [
  ["Cost Summary", "", "", "", "", "", "", "", "", ""],
  ["Total Vehicle Value", "", "", "", "", "", "", "", "", ""],
  ["Total Freight", "", "", "", "", "", "", "", "", ""],
  ["Total Insurance", "", "", "", "", "", "", "", "", ""],
  ["Total Other Charges", "", "", "", "", "", "", "", "", ""],
  ["Grand Total", "", "", "", "", "", "", "", "", ""],
  ["Amount in Words", "", "", "", "", "", "", "", "", ""],
];
quote.getRange("H28:Q28").merge();
quote.getRange("I29:Q33").merge(true);
quote.getRange("I34:Q34").merge();
quote.getRange("H28:Q34").format.borders = { preset: "all", style: "thin", color: line };
quote.getRange("H28").format = { fill: dark, font: { bold: true, color: white } };
quote.getRange("H29:H34").format = { fill: pale, font: { bold: true, color: dark } };
quote.getRange("I29").formulas = [["=SUMPRODUCT(I15:I26,J15:J26)"]];
quote.getRange("I30").formulas = [["=SUMPRODUCT(I15:I26,K15:K26)"]];
quote.getRange("I31").formulas = [["=SUMPRODUCT(I15:I26,L15:L26)"]];
quote.getRange("I32").formulas = [["=SUMPRODUCT(I15:I26,M15:M26)"]];
quote.getRange("I33").formulas = [["=SUM(O15:O26)"]];
quote.getRange("I34").values = [["[Write total amount in words, if required]"]];
quote.getRange("I29:I33").format.numberFormat = "$#,##0";
quote.getRange("I29:I33").format.numberFormat = "$#,##0;-$#,##0;";
quote.getRange("H33:I33").format = { fill: green, font: { bold: true, color: dark } };
quote.getRange("I34").format = { fill: amber, font: { italic: true, color: gray }, wrapText: true };

quote.getRange("A36:Q38").merge(true);
quote.getRange("A36").values = [["Important Notes"]];
quote.getRange("A37").values = [["1. Vehicle prices may vary due to exchange rates, manufacturer policy, stock availability, shipping space, and destination regulations."]];
quote.getRange("A38").values = [["2. Final specifications, VIN, production date, and export documents shall be confirmed before shipment."]];
quote.getRange("A36:Q38").format.borders = { preset: "all", style: "thin", color: line };
quote.getRange("A36").format = { fill: dark, font: { bold: true, color: white } };
quote.getRange("A37:A38").format = { fill: "#FAFBFC", wrapText: true };

quote.getRange("A40:G43").values = [
  ["Seller Confirmation", "", "", "", "", "", ""],
  ["Authorized Signature", "", "Date", "", "Company Stamp", "", ""],
  ["", "", "", "", "", "", ""],
  ["Name / Title", "", "", "", "", "", ""],
];
quote.getRange("I40:Q43").values = [
  ["Buyer Confirmation", "", "", "", "", "", "", "", ""],
  ["Authorized Signature", "", "Date", "", "Company Stamp", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["Name / Title", "", "", "", "", "", "", "", ""],
];
quote.getRange("A40:G40").merge();
quote.getRange("I40:Q40").merge();
quote.getRange("A40:G43").format.borders = { preset: "all", style: "thin", color: line };
quote.getRange("I40:Q43").format.borders = { preset: "all", style: "thin", color: line };
quote.getRange("A40").format = { fill: teal, font: { bold: true, color: white } };
quote.getRange("I40").format = { fill: teal, font: { bold: true, color: white } };

quote.freezePanes.freezeRows(14);

const widths = [7, 12, 18, 12, 22, 12, 10, 14, 7, 15, 13, 12, 13, 17, 14, 14, 26];
for (let c = 0; c < widths.length; c += 1) {
  quote.getRangeByIndexes(0, c, 1, 1).format.columnWidth = widths[c];
}
quote.getRange("A5:A11").format.columnWidth = 16;
quote.getRange("B5:B11").format.columnWidth = 28;
quote.getRange("I5:I11").format.columnWidth = 18;
quote.getRange("J5:J11").format.columnWidth = 28;
quote.getRange("N5:N11").format.columnWidth = 19;
quote.getRange("O5:O11").format.columnWidth = 18;
quote.getRange("P5:P11").format.columnWidth = 18;
quote.getRange("Q5:Q11").format.columnWidth = 18;

lists.getRange("A1:E1").values = [["Incoterms", "Fuel Type", "Drive", "Currency", "Status"]];
lists.getRange("A2:A8").values = [["EXW"], ["FOB"], ["CFR"], ["CIF"], ["DAP"], ["DDP"], ["Other"]];
lists.getRange("B2:B9").values = [["Gasoline"], ["Diesel"], ["HEV"], ["PHEV"], ["EV"], ["REEV"], ["CNG"], ["Other"]];
lists.getRange("C2:C6").values = [["FWD"], ["RWD"], ["AWD"], ["4WD"], ["Other"]];
lists.getRange("D2:D6").values = [["USD"], ["EUR"], ["AED"], ["RUB"], ["CNY"]];
lists.getRange("E2:E5").values = [["Draft / For Review"], ["Sent to Buyer"], ["Revised"], ["Accepted"]];
lists.getRange("A1:E1").format = { fill: dark, font: { bold: true, color: white } };
lists.getRange("A:E").format.columnWidth = 18;

quote.getRange("O9").dataValidation = { rule: { type: "list", formula1: "Lists!$A$2:$A$8" } };
quote.getRange("O8").dataValidation = { rule: { type: "list", formula1: "Lists!$D$2:$D$6" } };
quote.getRange("P6").dataValidation = { rule: { type: "list", formula1: "Lists!$E$2:$E$5" } };
quote.getRange("F15:F26").dataValidation = { rule: { type: "list", formula1: "Lists!$B$2:$B$9" } };
quote.getRange("G15:G26").dataValidation = { rule: { type: "list", formula1: "Lists!$C$2:$C$6" } };

guide.getRange("A1:H1").merge();
guide.getRange("A1").values = [["How to Use This Vehicle Quotation Template"]];
guide.getRange("A1").format = {
  fill: dark,
  font: { bold: true, color: white, size: 16 },
  horizontalAlignment: "center",
};
guide.getRange("A3:H3").merge();
guide.getRange("A3").values = [["Recommended workflow for overseas customers"]];
guide.getRange("A3").format = { fill: teal, font: { bold: true, color: white } };
guide.getRange("A4:H11").values = [
  ["Step", "What to fill in", "Why it matters", "", "", "", "", ""],
  ["1", "Confirm buyer company, destination port, and final destination.", "Foreign buyers usually compare offers by landed cost and delivery route.", "", "", "", "", ""],
  ["2", "Select Incoterms clearly: FOB, CFR, CIF, DAP, or DDP.", "This avoids misunderstanding about shipping, insurance, tax, and local clearance.", "", "", "", "", ""],
  ["3", "Separate vehicle price, freight, insurance, and other charges.", "International buyers prefer transparent price breakdowns.", "", "", "", "", ""],
  ["4", "Specify model year, trim, fuel type, drive type, color, and lead time.", "Vehicle specs affect compliance, resale value, and buyer approval.", "", "", "", "", ""],
  ["5", "Attach photos, VIN or stock confirmation only after final stock is confirmed.", "This keeps the quotation professional and avoids overpromising.", "", "", "", "", ""],
  ["6", "Send the quotation as PDF after checking all editable fields.", "PDF is easier for customers to review and forward internally.", "", "", "", "", ""],
  ["7", "Issue a Proforma Invoice only after the buyer confirms the quotation.", "The PI should match the final payment, shipment, and document terms.", "", "", "", "", ""],
];
guide.getRange("A4:C11").format.borders = { preset: "all", style: "thin", color: line };
guide.getRange("A4:C4").format = { fill: dark, font: { bold: true, color: white } };
guide.getRange("A5:A11").format.horizontalAlignment = "center";
guide.getRange("B5:C11").format = { wrapText: true, verticalAlignment: "top" };

guide.getRange("A13:H13").merge();
guide.getRange("A13").values = [["Common English Wording"]];
guide.getRange("A13").format = { fill: teal, font: { bold: true, color: white } };
guide.getRange("A14:H23").values = [
  ["Topic", "Suggested wording", "", "", "", "", "", ""],
  ["Validity", "This quotation is valid for 14 days from the quotation date.", "", "", "", "", "", ""],
  ["Availability", "Vehicle availability is subject to final stock confirmation.", "", "", "", "", "", ""],
  ["Price Change", "Prices may change due to exchange rate, factory policy, shipping cost, or market conditions.", "", "", "", "", "", ""],
  ["Payment", "30% deposit is required to reserve the vehicle. Balance payment shall be made before shipment.", "", "", "", "", "", ""],
  ["Shipping", "Shipping schedule is subject to carrier space and destination port conditions.", "", "", "", "", "", ""],
  ["Documents", "Standard export documents will be provided after shipment.", "", "", "", "", "", ""],
  ["Inspection", "Third-party inspection can be arranged at buyer's cost if required.", "", "", "", "", "", ""],
  ["Warranty", "Warranty terms depend on manufacturer policy and destination market regulations.", "", "", "", "", "", ""],
  ["Next Step", "Please confirm the model, quantity, color, destination port, and preferred Incoterms.", "", "", "", "", "", ""],
];
guide.getRange("A14:B23").format.borders = { preset: "all", style: "thin", color: line };
guide.getRange("A14:B14").format = { fill: dark, font: { bold: true, color: white } };
guide.getRange("B15:B23").format = { wrapText: true, verticalAlignment: "top" };
guide.getRange("A:H").format.columnWidth = 18;
guide.getRange("B:B").format.columnWidth = 72;
guide.getRange("C:H").format.columnWidth = 8;
guide.freezePanes.freezeRows(4);

quote.getRange("A1:Q43").format.font = { name: "Aptos" };
guide.getRange("A1:H23").format.font = { name: "Aptos" };
lists.getRange("A1:E9").format.font = { name: "Aptos" };

const quotationPreview = await workbook.render({
  sheetName: "Quotation",
  range: "A1:Q43",
  scale: 1,
  format: "png",
});
await fs.writeFile(`${outputDir}/quotation_preview.png`, new Uint8Array(await quotationPreview.arrayBuffer()));

const instructionsPreview = await workbook.render({
  sheetName: "Instructions",
  range: "A1:H23",
  scale: 1,
  format: "png",
});
await fs.writeFile(`${outputDir}/instructions_preview.png`, new Uint8Array(await instructionsPreview.arrayBuffer()));

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(`${outputDir}/Vehicle_Export_Quotation_Template_EN.xlsx`);
