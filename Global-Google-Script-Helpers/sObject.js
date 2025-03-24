const toSpreadsheetArray = (sObjects, headerMap) => {
  const firstRecord = sObjects[0];
  const buildHeader = (record, header, headerOriginal, previousKey) => {
    const keys = Object.keys(record);
    const values = Object.values(record);

    for (let vix = 0; vix < values.length; vix++) {
      const value = values[vix];
      const isObject = isPlainObject(value);
      let key = keys[vix];

      if (previousKey) key = previousKey + '.' + key;

      if (!/attributes/.test(key)) {
        if (isObject) {
          buildHeader(value, header, headerOriginal, key);
        } else {
          headerOriginal.push(key);
          header.push(key.replace('FGM_Base__', '').replace('FGM_Portal__', '').replace('__r.', ' ').replace('__r', '').replace('__c', '').replace(/_/g, ' ').replace(/ +/g, ' '));
        }

      }
    }

    return [header, headerOriginal];
  }
  const buildRows = (records, keys) => {
    const rows = [];

    for (let record of records) {
      const row = [];
      for (let key of keys) {
        const isNestedObject = /\./.test(key);
        let value;

        if (isNestedObject) {
          const nestedKeys = key.split('.');

          for (let nix = 0; nix < nestedKeys.length; nix++) {
            const nestedKey = nestedKeys[nix];

            value = nix === 0 ? record[nestedKey] 
            : value[nestedKey];

            if (value === null) break;
          }
        } else {
          value = record[key];
        }

        row.push(value);
      }

      rows.push(row);
    }

    return rows;
  }
  let [header, headerOriginal] = buildHeader(firstRecord, [], []);
  console.log(headerOriginal);
  const rows = buildRows(sObjects, headerOriginal);
  // const altHeader = [];

  if (headerMap) {
    for (let head of headerOriginal) {
      const hix = headerOriginal.indexOf(head);
      const h = headerMap[head] ? headerMap[head] : header[hix];

      header[hix] = h;

      // altHeader.push(h);
    }

    // if (altHeader.length > 0) header = altHeader;
  }

  rows.unshift(header);

  return rows;
}
Object.defineProperty(this, 'toSpreadsheetArray', { value: toSpreadsheetArray, enumerable: true });