// function getOptimizedRoute(locations) {
//   try {
//     const payload = JSON.parse(e.postData.contents);
//     const apiKey = GOOGLE_MAPS_API_KEY_2;

//     const locations = payload.locations; // Array of lat,lng strings
//     const origin = locations[0];
//     const destination = locations[locations.length - 1];
//     const waypoints = locations.slice(1, -1).join('|');

//     const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypoints}&key=${apiKey}`;

//     const response = UrlFetchApp.fetch(url);
//     const json = JSON.parse(response.getContentText());

//     const optimizedOrder = json.routes[0].waypoint_order;
//     const orderedStops = [origin, ...optimizedOrder.map(i => locations[i + 1]), destination];

//     const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypoints}`;

//     console.log(mapUrl);

//     // Optionally write to the sheet
//     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stops");
//     sheet.getRange("E2").setValue(mapUrl); // Adjust target cell as needed

//     return ContentService.createTextOutput(JSON.stringify({
//       status: "success",
//       orderedStops: orderedStops,
//       mapUrl: mapUrl
//     })).setMimeType(ContentService.MimeType.JSON);

//   } catch (err) {
//     return ContentService.createTextOutput(JSON.stringify({
//       status: "error",
//       message: err.toString()
//     })).setMimeType(ContentService.MimeType.JSON);
//   }
// }

// function onChange(e) {
//   const ss = SpreadsheetApp.getActiveSpreadsheet();
//   const sheet = ss.getSheetByName("Trigger"); // Or whatever table has the flag
//   const flag = sheet.getRange("A2").getValue(); // Assuming A2 is [TriggerOptimize]

//   if (flag === true) {
//     processOptimizedRoute();
//     sheet.getRange("A2").setValue(false); // Reset flag
//   }
// }

function processOptimizedRoute(campaign='jacksonCounty', user='schneiders@seiu503.org', routeId=1) {
  const apiKey = GOOGLE_MAPS_API_KEY_2;
  const config = globalConfig(campaign);
  const ss = SpreadsheetApp.openByUrl(config.sheetURL);
  const routeSheet = ss.getSheetByName("RouteQueue");
  const data = routeSheet.getDataRange().getValues(); // all data in sheet

  const headers = data[0];
  const allRows = data.slice(1); // skip header
  // console.log(rows);

  // Filter rows where column A (index 0) matches RouteId
  const matchedRows = allRows.filter(row => row[0] === routeId); // the rows in the currently active route for optimization
  const stopIds = matchedRows.map(row => row[1]);
  // console.log(matchedRows);

  matchedRows.forEach((row, index) => {
    // console.log(row);
    // console.log(`!!row[5]: ${!!row[5]}`);
    // console.log(`!row[6]: ${!row[6]}`);
    // console.log(`!row[7]: ${!row[7]}`);
    // console.log(`!!row[5] && (!row[6] || !row[7]): ${!!row[5] && (!row[6] || !row[7])}`);
    if (!!row[5] && (!row[6] || !row[7])) {
      // if lat/lon missing but address present, try to geocode first to return lat/lon
      latlon = geocodeAddress(row[5],apiKey);
      console.log(`latlon for ${row[5]}`);
      console.log(latlon);

      // then write latlon back to sheet
      // find row by stopId
      const rowIndex = stopIds.filter((stopId, index) => {
        if (row[1] === stopId) {
          console.log(`matching row is index ${index}`);
          return index;
        } else {
          return null;
        }});
      console.log(`matchRow index: ${rowIndex}`);
      console.log(`G${Number(rowIndex) + 1}`);
      console.log(`H${Number(rowIndex) + 1}`)
      routeSheet.getRange(`G${Number(rowIndex) + 1}`).setValue(latlon.lat);
      routeSheet.getRange(`H${Number(rowIndex) + 1}`).setValue(latlon.lng);
    }
   });

  // const locations = matchedRows.map(row => `${row[7]},${row[8]}`); // Assumes H=Lat, I=Lon
  // const origin = locations[0];
  // const destination = locations[locations.length - 1];
  // const waypoints = locations.slice(1, -1).join('|');

  // const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypoints}&key=${apiKey}`;
  // const response = UrlFetchApp.fetch(url);
  // const json = JSON.parse(response.getContentText());

  // const optimizedOrder = json.routes[0].waypoint_order;
  // const orderedStops = [origin, ...optimizedOrder.map(i => locations[i + 1]), destination];

  // const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypoints}`;

  // const resultSheet = ss.getSheetByName("RouteResult");
  // const today = new Date();
  // const resultRow = [routeId,	mapUrl,	user,	today]
  // appendNewRowsSimple(resultRow. resultSheet);
}

function geocodeAddress(address, apiKey) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const response = UrlFetchApp.fetch(url);
  const result = JSON.parse(response.getContentText());

  if (result.status === "OK") {
    const location = result.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng
    };
  } else {
    Logger.log("Geocoding failed for: " + address + " - " + result.status);
    return null;
  }
}

