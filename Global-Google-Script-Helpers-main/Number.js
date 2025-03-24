function toFixed(number, precision = 10) {
  return parseFloat((number * 100).toFixed(precision));
}

function round(number, decimalPlaces = 2) {
  number = number || 0;
  return Math.round(number * (10**decimalPlaces)) / 10**decimalPlaces;
}
