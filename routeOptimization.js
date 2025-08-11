// function getOptimizedRoute(locations) {
//   try {
//     const payload = JSON.parse(e.postData.contents);
//     const apiKey = GOOGLE_MAPS_API_KEY_2;

//     const locations = payload.locations; // Array of lat,lng strings
//     const origin = locations[0];
//     const destination = locations[locations.length - 1];
//     const waypoints = locations.slice(1, -1).join('|');

//     const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize%3Atrue|${waypoints}&key=${apiKey}`;

//     const response = UrlFetchApp.fetch(url);
//     const json = JSON.parse(response.getContentText());

//     const optimizedOrder = json.routes[0].waypoint_order;
//     const orderedStops = [origin, ...optimizedOrder.map(i => locations[i + 1]), destination];

//     const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=optimize%3Atrue|${waypoints}`;

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

const testStops = [ [ 'c86cfc5c',
    '3c62807f',
    'schneiders@seiu503.org',
    'Sun Aug 10 2025 16:00:00 GMT-0700 (GMT-07:00)',
    '57EDCE52',
    '3468 Lone Pine Rd Medford, OR 97504-5635',
    '42.345282, -122.826143',
    'Terra Ucar',
    '',
    'a2RRf000000cLQ2MAM' ],
  [ 'c86cfc5c',
    'd3bd36b8',
    'schneiders@seiu503.org',
    'Sun Aug 10 2025 16:00:00 GMT-0700 (GMT-07:00)',
    'ED8B483D',
    '3119 Merriman Rd Medford, OR 97501-1270',
    '42.361512, -122.892680',
    'Sydney Salisburg',
    '',
    'a2RRf000000cKtlMAE' ],
  [ 'c86cfc5c',
    'c73fbddd',
    'schneiders@seiu503.org',
    'Sun Aug 10 2025 16:00:00 GMT-0700 (GMT-07:00)',
    'BA6272DB',
    '2944 Delta Waters Rd Medford, OR 97504-5839',
    '42.360021, -122.841165',
    'Shaine Scarminach',
    '',
    'a2RRf000000cLORMA2' ],
  [ 'c86cfc5c',
    '9bbe5894',
    'schneiders@seiu503.org',
    'Sun Aug 10 2025 16:00:00 GMT-0700 (GMT-07:00)',
    '97108DE1',
    '1735 Alcan Dr Medford, OR 97504-4706',
    '42.351090, -122.861810',
    'Sammie Mackie',
    '',
    'a2RRf000000cKsCMAU' ],
  [ 'c86cfc5c',
    '8a6dd390',
    'schneiders@seiu503.org',
    'Sun Aug 10 2025 16:00:00 GMT-0700 (GMT-07:00)',
    '15CC2B0D',
    '2697 Elliott Ave Medford, OR 97501-1254',
    '42.356868, -122.899531',
    'Sam Scampone',
    '',
    'a2RRf000000cKsBMAU' ],
  [ 'c86cfc5c',
    '47f13f1e',
    'schneiders@seiu503.org',
    'Sun Aug 10 2025 16:00:00 GMT-0700 (GMT-07:00)',
    '48FCE9BB',
    '205 S Central Ave Medford, OR 97501-7223',
    '42.324870, -122.870094',
    'Noel O\'Brien',
    '',
    'a2RRf000000cLLDMA2' ],
  [ 'c86cfc5c',
    '558ef239',
    'schneiders@seiu503.org',
    'Sun Aug 10 2025 16:00:00 GMT-0700 (GMT-07:00)',
    'F39DE379',
    '110 Elm St Medford, OR 97501-3032',
    '42.321812, -122.889897',
    'Nick Stanley',
    '',
    'a2RRf000000cKs9MAE' ],
  [ 'c86cfc5c',
    'be782c16',
    'schneiders@seiu503.org',
    'Sun Aug 10 2025 16:00:00 GMT-0700 (GMT-07:00)',
    '795C63E0',
    '725 Royal Ave Apt 16 Medford, OR 97504-6457',
    '42.337200, -122.866617',
    'Milagros Morales',
    '',
    'a2RRf000000cLJbMAM' ] 
]

async function processOptimizedRoute(campaign='jacksonCounty', user='schneiders@seiu503.org', routeId="ac476fe5", userOrigin="42.3128789,-122.8681219") {
  console.log('processOptimizedRoute > 53');
  console.log(`campaign: ${campaign}, routeId: ${routeId}, user: ${user}`);
  const apiKey = GOOGLE_MAPS_API_KEY_2;
  const config = globalConfig(campaign);
  const ss = SpreadsheetApp.openByUrl(config.sheetURL);

  console.log(userOrigin);

  const routeQueue = ss.getSheetByName("routeQueue");
  const data = routeQueue.getDataRange().getValues(); // all data in sheet
  const routeStops = data.slice(1).filter(row => row[0] === routeId); 
  console.log(routeStops);

  // const routeStops = testStops;

  // check for any stops not geocoded
  routeStops.forEach(async (row) => {
    if (!row[6]) {
      await geocodeRow(row[0]);
    }
  });

  const locations = routeStops.map(row => row[6]); // latlon
  const origin = userOrigin;
  console.log(`origin: ${origin}`);
  const destination = userOrigin;
  console.log(`destination: ${destination}`);
  const stops = locations;
  console.log(`stops: ${stops}`);
  const waypoints = 'optimize:true|' + stops.join('|');
  console.log(`waypoints: ${waypoints}`);

  const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
  // const params = `origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypointsParam)}&key=${apiKey}`;
  // const url = `${baseUrl}?${params}`;

  const url = baseUrl
  + '?origin=' + encodeURIComponent(origin)
  + '&destination=' + encodeURIComponent(destination)
  + '&waypoints=' + encodeURIComponent(waypoints)
  + '&key=' + apiKey;

  console.log(`url: ${url}`);

  const response = UrlFetchApp.fetch(url);
  const json = JSON.parse(response.getContentText());

  if (json.status !== 'OK') {
    console.log(json);
    Logger.log('Directions API error: ' + json.error_message);
    return;
  }

  const optimizedOrder = json.routes[0].waypoint_order;
  console.log('optimizedOrder');
  console.log(optimizedOrder)

  // append optimized stop order to routequeue rows
  routeStops.forEach(row => {
    const originalRowIndexInRoute = routeStops.indexOf(row);
    const rowIndexInSheet = data.slice(1).map((origRow, index) => {
      if (origRow[1] === row[1]) { // match on stopId
          return index;
        }
    })[0];
    console.log(`rowIndexInSheet: ${rowIndexInSheet}`);
    console.log(`originalRowIndexInRoute: ${originalRowIndexInRoute}`);
    const stopOrder = optimizedOrder[originalRowIndexInRoute];
    console.log(`stopOrder: ${stopOrder}`);
    console.log(`setting value of routeQueue I${rowIndexInSheet + 1} to ${stopOrder}`);
    routeQueue.getRange(`I${rowIndexInSheet + 1}`).setValue(stopOrder);
  })



  // just fetch map url and write url to sheet, and return to bot
    const orderedStops = [...optimizedOrder.map(i => stops[i])];
    console.log('orderedStops');
    console.log(orderedStops)

    const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userOrigin)}&destination=${encodeURIComponent(userOrigin)}&waypoints=${encodeURIComponent(orderedStops.join('|'))}`;

    console.log(`mapUrl`);
    console.log(mapUrl);

  //   const urlOK = await isValidAndReachableURL(mapUrl);

  // if (!urlOK) {
  //   return {
  //     error: 'There was an error fetching the route. Please contact the app administrator.'
  //   }
  // } else {
    const resultSheet = ss.getSheetByName("RouteResult");
    const today = new Date();
    const resultRow = [routeId,	mapUrl,	user,	today];
    console.log(resultRow);
    resultSheet.appendRow(resultRow);
    return mapUrl

  }
  // }


    

// or generate actual route legs in app -- not tested
  // const waypointOrder = json.routes[0].waypoint_order;
  // const optimizedStops = [
  //   stops[0], // origin
  //   ...waypointOrder.map(i => stops[i + 1]), // reordered waypoints
  //   stops[stops.length - 1] // destination
  // ];

  // const legs = json.routes[0].legs;

  // const resultSheet = ss.getSheetByName("RouteStops");
  // resultSheet.clear(); // optional — clear old route

  // // Write header
  // // resultSheet.appendRow(["RouteID", "Order", "WorkerID", "Name", "Address", "Directions", "Distance", "Duration"]);

  // for (let i = 0; i < legs.length; i++) {
  //   const leg = legs[i];
  //   const stop = optimizedStops[i]; // current stop
  //   const nextStop = optimizedStops[i + 1]; // next stop

  //   const directionSteps = leg.steps.map(s => s.html_instructions.replace(/<[^>]+>/g, '')).join(" → ");

  //   resultSheet.appendRow([
  //     routeId,
  //     i + 1,
  //     stop.StopId,
  //     stop.WorkerName,
  //     stop.Address,
  //     directionSteps,
  //     leg.distance.text,
  //     leg.duration.text
  //   ]);
  // }

  // Logger.log("Route with " + legs.length + " legs written.");  


function geocodeAddressSimple(address) {
  const response = Maps.newGeocoder().geocode(address);
  if (response.status === "OK") {
    const result = response.results[0].geometry.location;
    return `${result.lat}, ${result.lng}`;
  } else {
    return {
      error: response.status
    }
  }
}

async function geocodeTable(campaign='jacksonCounty',latlonIndex=26,latlonRange='AA',idIndex=16,idRange='Q') {
  const apiKey = GOOGLE_MAPS_API_KEY_2;
  const config = globalConfig(campaign);
  const ss = SpreadsheetApp.openByUrl(config.sheetURL);
  const workers = ss.getSheetByName("Workers");
  const data = workers.getDataRange().getValues(); // all data in sheet

  const headers = data[0];
  const allRowsWithAddresses = data.slice(1).filter(row => !!row[10] && !!row[11] && !!row[12] && !!row[13]); // skip header
  console.log(allRowsWithAddresses);

  allRowsWithAddresses.forEach( async (row) => {
    const address = `${row[10]} ${row[11]}, ${row[12]} ${row[13]}`; //hardcoded, need to generalize
    console.log(address);
    const rowId = row[idIndex]
    const result = geocodeAddressSimple(address);
    const resultLatLong = result.split(',');
    console.log(`result: ${result}`);
    if (!result.error) {
      // write latlon values back to sheet
      const appSheetIds = workers.getRange(`${idRange}2:${idRange}`).getValues().flat();
      // find matching appSheetId
      const rowIndex = appSheetIds.indexOf(rowId);
      if (rowIndex > 1) {
        const latlonCell = workers.getRange(`${latlonRange}${rowIndex + 2}`);
        latlonCell.setValue(result);
      }
      // update CA record in SF

      const body = {
        LatLon__Latitude__s: resultLatLong[0],
        LatLon__Longitude__s: resultLatLong[1].trim()
      };

      const CAId = row[0];
      console.log(`CAId: ${CAId}`);

      console.log(`geocodeTable.gs > 198`);
      console.log(body);

      const request = { 
        sObject: 'Higher_Ed_Strike_Pledge__c', 
        sObjectId: CAId,
        payload: { ...body },
        apiVersion: '50', 
        env: 'prod'
        };
  

      if (body) {
        try {
          const response = await update(request);
          return {
            success: true,
            errors: null
          }  
        } catch (err) {
          logErrorFunctions('geocodeTable', {body}, CAId, err);
          return {
            success: false,
            errors: [`There was an error updating the worker, please contact the app administrator.`, err]
          }
        }

      } else {
        console.log(`geocodeTable: no body`);
        logErrorFunctions('geocodeTable', {body}, CAId, err);
        return {
            success: false,
            errors: [`There was an error updating the worker, please contact the app administrator.`, 'No body provided to insert function']
          }
      }
    } else {
        console.log(`geocodeTable error line 234`);
        logErrorFunctions('geocodeTable', result, address, err);
        return {
            success: false,
            errors: [`There was an error updating the worker, please contact the app administrator.`, 'No body provided to insert function']
          }
    }
  });
}

async function geocodeRow(caID,campaign='jacksonCounty',latlonIndex=26,latlonRange='AA',idIndex=16,idRange='Q') {
  console.log(`geocoding row ${caId}`);
  const apiKey = GOOGLE_MAPS_API_KEY_2;
  const config = globalConfig(campaign);
  const ss = SpreadsheetApp.openByUrl(config.sheetURL);
  const workers = ss.getSheetByName("Workers");
  const data = workers.getDataRange().getValues(); // all data in sheet

  const headers = data[0];
  const row = data.slice(1).filter(row => !!row[10] && !!row[11] && !!row[12] && !!row[13] && row[0] == caID); // skip header
  console.log(row);

  const address = `${row[10]} ${row[11]}, ${row[12]} ${row[13]}`; //hardcoded, need to generalize
  console.log(address);
  const rowId = row[idIndex]
  const result = geocodeAddressSimple(address);
  const resultLatLong = result.split(',');
  console.log(`result: ${result}`);
  if (!result.error) {
    // write latlon values back to sheet
    const appSheetIds = workers.getRange(`${idRange}2:${idRange}`).getValues().flat();
    // find matching appSheetId
    const rowIndex = appSheetIds.indexOf(rowId);
    if (rowIndex > 1) {
      const latlonCell = workers.getRange(`${latlonRange}${rowIndex + 2}`);
      latlonCell.setValue(result);
    }
    // update CA record in SF

    const body = {
      LatLon__Latitude__s: resultLatLong[0],
      LatLon__Longitude__s: resultLatLong[1].trim()
    };

    console.log(`geocodeRow.gs > 292`);
    console.log(body);

    const request = { 
      sObject: 'Higher_Ed_Strike_Pledge__c', 
      sObjectId: caID,
      payload: { ...body },
      apiVersion: '50', 
      env: 'prod'
      };


    if (body) {
      try {
        const response = await update(request);
        return {
          success: true,
          errors: null
        }  
      } catch (err) {
        logErrorFunctions('geocodeRow', {body}, CAId, err);
        return {
          success: false,
          errors: [`There was an error updating the worker, please contact the app administrator.`, err]
        }
      }

    } else {
      console.log(`geocodeRow: no body`);
      logErrorFunctions('geocodeRow', {body}, CAId, err);
      return {
          success: false,
          errors: [`There was an error updating the worker, please contact the app administrator.`, 'No body provided to insert function']
        }
    }
  } else {
      console.log(`geocodeRow error line 328`);
      logErrorFunctions('geocodeRow', result, address, err);
      return {
          success: false,
          errors: [`There was an error updating the worker, please contact the app administrator.`, 'No body provided to insert function']
        }
  }
};

function geocodeAddress(address) {
  const apiKey = GOOGLE_MAPS_API_KEY_2;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const response = UrlFetchApp.fetch(url);
  const result = JSON.parse(response.getContentText());

  if (result.status === "OK") {
    const location = result.results[0].geometry.location;
    return `${location.lat}, ${location.lng}`;
  } else {
    Logger.log("Geocoding failed for: " + address + " - " + result.status);
    return {
      error: result.status
    };
  }
}

function buildRouteStops(stops, routeId = 1, campaign='jacksonCounty') {
  const apiKey = GOOGLE_MAPS_API_KEY_2;
  const config = globalConfig(campaign);
  const ss = SpreadsheetApp.openByUrl(config.sheetURL);
  const origin = `${stops[0].lat},${stops[0].lng}`;
  const destination = `${stops[stops.length - 1].lat},${stops[stops.length - 1].lng}`;
  const waypoints = stops.slice(1, -1).map(stop => `${stop.lat},${stop.lng}`).join('|');

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=optimize%3Atrue|${encodeURIComponent(waypoints)}&key=${apiKey}`;

  const response = UrlFetchApp.fetch(url);
  const json = JSON.parse(response.getContentText());

  if (json.status !== "OK") {
    Logger.log("Directions API Error: " + json.error_message);
    return;
  }

  const waypointOrder = json.routes[0].waypoint_order;
  const optimizedStops = [
    stops[0], // origin
    ...waypointOrder.map(i => stops[i + 1]), // reordered waypoints
    stops[stops.length - 1] // destination
  ];

  const legs = json.routes[0].legs;

  const resultSheet = ss.getSheetByName("RouteStops");
  resultSheet.clear(); // optional — clear old route

  // Write header
  resultSheet.appendRow(["RouteID", "Order", "WorkerID", "Name", "Address", "Directions", "Distance", "Duration"]);

  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];
    const stop = optimizedStops[i]; // current stop
    const nextStop = optimizedStops[i + 1]; // next stop

    const directionSteps = leg.steps.map(s => s.html_instructions.replace(/<[^>]+>/g, '')).join(" → ");

    resultSheet.appendRow([
      routeId,
      i + 1,
      stop.StopId,
      stop.WorkerName,
      stop.Address,
      directionSteps,
      leg.distance.text,
      leg.duration.text
    ]);
  }

  Logger.log("Route with " + legs.length + " legs written.");
}


