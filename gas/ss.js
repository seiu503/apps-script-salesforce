// function getCellValue(campaign, sheetName, cellRange) {
//   const config = globalConfig(campaign);
//   const ss = SpreadsheetApp.openByUrl(config.sheetURL);
//   const sheet = ss.getSheetByName(sheetName); 
//   return sheet.getRange(cellRange).getValue();
// }
// if (typeof module !== 'undefined') module.exports = { getCellValue };