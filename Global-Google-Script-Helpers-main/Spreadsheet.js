const writeToSheet = (data, shtName, onlyClearAffectedRange, rowStart) => {
  const sht = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(shtName);
  const rows = data.length;
  const cols = data[0].length;

  rowStart = rowStart || 1;

  if (onlyClearAffectedRange) sht.getRange(rowStart, 1, sht.getMaxRows(), data[0].length).clearContent();
  else sht.getRange(rowStart, 1, sht.getMaxRows(), sht.getMaxColumns()).clearContent();
  sht.getRange(rowStart, 1, rows, cols).setValues(data);
}
Object.defineProperty(this, 'writeToSheet', { value: writeToSheet, enumerable: true });

const getRange = (shtName, range) => {
  const sht = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(shtName);

  return sht.getRange(range).getValue();
}
Object.defineProperty(this, 'getRange', { value: getRange, enumerable: true });