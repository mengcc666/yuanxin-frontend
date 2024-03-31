// import { fi } from "element-plus/es/locale";
import * as XLSX from "xlsx";
var fs = require("fs");

var xlsxFile = fs.readFileSync("input.txt");
const fileReader = new FileReader();
fileReader.readAsArrayBuffer(xlsxFile);

fileReader.onload = (e) => {
  const fileData = e.target.result;

  const workbook = XLSX.read(fileData, { type: "binary" });
  console.log("workbook", workbook);
};

// const workbook = XLSX.readFile("front-end-dynamic-table.xlsx");

// const sheetName = workbook.SheetNames[0];
// const worksheet = workbook.Sheets[sheetName];

// // Convert xlsx data to JSON
// const jsonData = XLSX.utils.sheet_to_json(worksheet);

// function transformData(data) {
//   const tableData = [];

//   data.forEach((row) => {
//     const transformedRow = {
//       ID: row["ID"],
//       baseMean: row["baseMean"],
//       log2FoldChange: row["log2FoldChange"],
//       lfcSE: row["lfcSE"],
//       stat: row["stat"],
//       pvalue: row["pvalue"],
//       padj: row["padj"],
//     };
//     tableData.push(transformedRow);
//   });

//   return tableData;
// }

// // Transform the JSON data
// const xlsxTableData = transformData(jsonData);

// export default xlsxTableData;
