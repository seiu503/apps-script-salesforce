const fieldsArray = ['Id', 'Salutation_Last__c', 'Email', 'Employer_Name_Text__c', 'Title', 'Preferred_Language__c', 'Best_Phone__c', 'Binary_Membership__c', 'Salutation_Name__c', 'Pre_Fill_Member_Form_Link__c', 	'Current_Member_Status__c'];
const mlss = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/11pYOEoAtTtxH_5y6uxzVuhUis6DvZxFJoazHnuMD4R4/edit',
);
const mlworkers = mlss.getSheetByName('MemberChartingApp'); 
const mlusers = mlss.getSheetByName('Users');
const contactIds = mlworkers.getRange("A2:A").getValues().flat().filter(Boolean);
// console.log('contactIds');
// console.log(contactIds);

// const employer = 'Employment - Salem | OED | Employment Building' || 'OHA - Salem | OHA | Oregon State Hospita; // test data
// const employer = 'Beaverton | DHS | Greenbrier Parkway'; // test data

async function loadUserTurf(employer = 'ODOT - Portland | ODOT | Region 1 Headquarters') {
  console.log(`loadUserTurf.gs > 6, employer: ${employer}`);
  let records;
  if (employer) {
    try {
      const qp = new QueryParameters();
      qp.setSelect(fieldsArray.toString());
      qp.setFrom("Contact");
      qp.setWhere(`Employer_Name_Text__c = \'${employer}\' AND Active_Worker__c = TRUE`);

      records = await get(qp);
      if (records && records.length) {
        console.log(`${records.length} records returned for ${employer}`);
        // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        // console.log(records[0]);
      } else {
        console.log(`no records returned for ${employer}`);
      }

      await setUserTurf(employer, records);
      return {
        Success: true,
        Error: null
        }       

    } catch (err) {
      logErrorFunctions('loadUserTurf', employer, records, err);
    }

  } else {
    console.log(`loadUserTurf > 24: no employer provided`);
    logErrorFunctions('loadUserTurf', employer, records, 'No employer provided');
  }
  
}

function appendNewRows(data, sheet) {
  console.log('appendNewRows');
  try {
    const values = data.reduce((ar, obj) => {
      if (!contactIds.includes(obj.Id)) {
        const row = Object.values(obj).slice(1);
        ar.push(row);
      }
      return ar;
    }, []);
  if (values && values.length) {
      sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
    } else {
      logErrorFunctions('appendNewRows', [data, sheet], '', 'No values passed to appendNewRows');
    }
  } catch (err) {
    logErrorFunctions('appendNewRows', [data, sheet], '', err);
  }
}

async function setUserTurf(employerName, payload) {
  console.log(`setUserTurf: ${employerName}`);
  const allData = mlworkers.getDataRange().getValues();
  const payloadContactIds = payload.map(obj => obj.Id).filter(Boolean);
  const turfIndices = allData.map((row, index) => {
    if (row[3] === employerName) {
      return index + 1;
    }
  }).filter(n => n);
  const turfRows = allData.map((row, index) => {
    if (row[3] === employerName) {
      return row
    }
  }).filter(n => n);
  
  if (!turfIndices.length) {
    console.log('just add new rows')
    try {
      appendNewRows(payload, mlworkers);
      return {Success: true, Error: null}
    } catch (err) {
      logErrorFunctions('setUserTurf: ALL NEW', turfIndices, '', err);
    }
  } else {
    console.log('diff existing turf against new data'); 
    let rowsToDelete = [];
    let existingTurfcontactIds = [];
    try {
      // identify rows to DELETE
      // values that are in existing turf but not in payloadContactIds (new data)
      existingTurfContactIds = await allData.map((row, index) => { // 2D array containing the row index and the contact ID of rows that match on employer name
        if (row[3] == employerName) {
          return [index + 1, row[0]]
        }
      }).filter(Boolean);
      if (existingTurfContactIds.length) {
        // console.log('existingTurfContactIds');
        // console.log(existingTurfContactIds);
        rowsToDelete = existingTurfContactIds.filter(x => {
          // console.log(`133: ${x}`);
          if (!payloadContactIds.includes(x[1])) {
            return x[0]
          }
          }).filter(Boolean); // 1D array, just the indices of the rows to delete
        console.log('rowsToDelete:');
        console.log(rowsToDelete);
        if (rowsToDelete && rowsToDelete.length) {
          const indicesOfRowsToDelete = rowsToDelete.map(row => row[0]);
          const sheetId = mlworkers.getSheetId();
          const requests = indicesOfRowsToDelete.reverse().map(e => ({ deleteDimension: { range: { sheetId, startIndex: e - 1, endIndex: e, dimension: "ROWS" } } }));
          Sheets.Spreadsheets.batchUpdate({ requests }, mlss.getId());
          SpreadsheetApp.flush();
        } 
      }
            
    } catch(err) {
      logErrorFunctions('setUserTurf: DELETE', existingTurfContactIds, rowsToDelete, err);
    }


    // identify rows to ADD
    // values that are in new data (payloadContactIds) but not in existing turf
    const rowsToAdd = payload.filter(x => !contactIds.includes(x.Id)) // Array of objects returned from Salesforce whose contact Ids are not in Google sheet
    console.log('rowsToAdd:');
    console.log(rowsToAdd);
    if (rowsToAdd && rowsToAdd.length) {
      try {
        appendNewRows(rowsToAdd, mlworkers);
      } catch (err) {
        logErrorFunctions('setUserTurf: ADD', payloadContactIds, rowsToAdd, err);
      }
    }
      

    // identify rows to UPDATE
    const intersectionIncoming = payload.filter(x => contactIds.includes(x.Id)); // new data rows that are already in google sheet
    const intersectionExisting = allData.filter((x, sheetIndex) => {
      if (payloadContactIds.includes(x[0])) {
        x.push(sheetIndex);
        return true;
      }
   }) // google sheet rows that are in newData, with original sheet index as last item in array
    // console.log('intersectionIncoming');
    // console.log(intersectionIncoming);
    // console.log('intersectionExisting'); 
    // console.log(intersectionExisting);
    // check whether any of these rows are different
    let indicesOfRowsToUpdate = [];
    let newRowsToAppend = [];
    // console.log('179');
    // console.log(`turfRows`);
    // console.log(turfRows);
    intersectionExisting.forEach((turfRow) => {
      // console.log('160: turfRow');
      // console.log(turfRow);
      // console.log(`turfRow[0]: ${turfRow[0]}`);
      const origIndex = turfRow.pop();
      // console.log(`origIndex: ${origIndex}`);
      const matchingRowInPayload = intersectionIncoming.find(payloadRow => payloadRow.Id === turfRow[0]);
      if (matchingRowInPayload) {
        // console.log(`MATCH: matchingRowInPayload:` );
        // console.log(matchingRowInPayload);
        const slicedArray = Object.values(matchingRowInPayload).slice(1);
        // console.log(`slicedArray`);
        // console.log(slicedArray);
        // console.log(`turfRow`);
        // console.log(turfRow);
        if ( turfRow.every((cell, i) => looserEqual(slicedArray[i], cell))) { 
          console.log(`180: MATCH ${origIndex + 1}`);
        } else {
          console.log(`185: NOMATCH ${origIndex + 1}`);
          // console.log('turfRow');
          // console.log(turfRow);
          // console.log('slicedArray');
          // console.log(slicedArray);
          // this means the row that matched on contact ID DOES NOT match entirely (eg other data is new) and needs to be updated
          // need to find the index of this row *in the google sheet*, not in the incoming payload array
          indicesOfRowsToUpdate.push(origIndex + 1);
          newRowsToAppend.push(Object.values(matchingRowInPayload));
        }
      } else {
        console.log('no matching row found')
      }
      
    });
    console.log('newRowsToAppend');
    console.log(newRowsToAppend);
    console.log('indicesOfRowsToUpdate');
    console.log(indicesOfRowsToUpdate);
    if (newRowsToAppend && newRowsToAppend.length && indicesOfRowsToUpdate && indicesOfRowsToUpdate.length) {
      try {
      const sheetId = mlworkers.getSheetId();
      const requests = indicesOfRowsToUpdate.reverse().map(e => ({ deleteDimension: { range: { sheetId, startIndex: e - 1, endIndex: e, dimension: "ROWS" } } }));
      Sheets.Spreadsheets.batchUpdate({ requests }, mlss.getId());
      SpreadsheetApp.flush();
      appendNewRows(newRowsToAppend, mlworkers);
    } catch (err) {
      logErrorFunctions('setUserTurf: UPDATE', indicesOfRowsToUpdate, newRowsToAppend, err);
    } 
    }

    // remove duplicates
    console.log('removing dupes');
    const sheetId = mlworkers.getSheetId();
    console.log(`sheetId: ${sheetId}`);
    const resource = { requests: [{ deleteDuplicates: { range: { sheetId } } }] };
    Sheets.Spreadsheets.batchUpdate(resource, mlss.getId());
    SpreadsheetApp.flush();
  }
}