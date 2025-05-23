const CAfieldsArray = [
  'Id', 
  'First_name_from_form__c', 
  'Preferred_Name_from_Form__c',
  'Pronouns__c',
  'Last_Name_from_form__c',
  'Email_from_form__c', 
  'AGENCY_from_form__c', 
  'Department__c',
  'Job_Title__c', // picklist? check if we need a different field for this?
  'Willing_to_Help__c', 
  'Preferred_Language_from_form__c', 
  'Phone_from_form__c', 
  'Signed_Auth_Card__c', 
  'Auth_Card_Date__c',
  'Address__c',
  'City__c',
  'State__c',
  'ZIP__c',
  'Department_Lookup__c',
  'Student_Clubs__c',
  'Student_Major__c',
  'Relationships__c',
  'Potential_Leader__c',
  'In_Unit__c'
  ];
const swss = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/14a5ZRXFbAl69VQ98aJ1lCnWLcfh3mhZrKpsxAT01btA/edit',
);
const swWorkers = swss.getSheetByName('StudentWorkers'); 
const swUsers = swss.getSheetByName('Users');
const CAIds = swWorkers.getRange("A2:A").getValues().flat().filter(Boolean);
// console.log('CAIds');
// console.log(CAIds);

async function getCAsByCampaign() {
  console.log(`getCAsByCampaign.gs > 29`);
  let records;
    try {
      const qp = new QueryParameters();
      qp.setSelect(CAfieldsArray.toString());
      qp.setFrom("Higher_Ed_Strike_Pledge__c");
      qp.setWhere(`Campaign_Name_Picklist__c = 'Student Workers'`);

      // add 'prod' as 3d argument to get() to get from production; otherwise gets records from 503admin sandbox
      records = await get(qp, '50');
      if (records && records.length) {
        console.log(`${records.length} records returned`);
        // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        // console.log(records[0]);
      } else {
        console.log(`no records returned`);
      }

      await setCAs(records);
      return {
        Success: true,
        Error: null
        }       

    } catch (err) {
      logErrorFunctions('getCAsByCampaign', null, records, err);
    }

  
}

function appendNewRowsSW(data, sheet) {
  console.log('appendNewRowsSW');
  try {
    const values = data.reduce((ar, obj) => {
      if (!CAIds.includes(obj.Id)) {
        const row = Object.values(obj).slice(1);
        ar.push(row);
      }
      return ar;
    }, []);
  if (values && values.length) {
      sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
    } else {
      logErrorFunctions('appendNewRowsSW', [data, sheet], '', 'No values passed to appendNewRowsSW');
    }
  } catch (err) {
    logErrorFunctions('appendNewRowsSW', [data, sheet], '', err);
  }
}

async function setCAs(payload) {
  console.log(`setCAs`);
  const allData = swWorkers.getDataRange().getValues();
  const payloadCAIds = payload.map(obj => obj.Id).filter(Boolean);
  
  console.log('diff sheet against new data'); 
  let rowsToDelete = [];
  let existingTurfcontactIds = [];
  try {
    // identify rows to DELETE
    // values that are in existing sheet but not in payloadCAIds (new data)
    sheetCAIds = allData.map((row, index) => [index + 1, row[0]]).slice(1).filter(Boolean); // 2D array containing the row index and the CA ID of each row
    if (sheetCAIds.length) {
      // console.log('sheetCAIds');
      // console.log(sheetCAIds);
      rowsToDelete = sheetCAIds.filter(x => {
        // console.log(`133: ${x}`);
        if (!payloadCAIds.includes(x[1])) {
          return x[0]
        }
        }).filter(Boolean); // 1D array, just the indices of the rows to delete
      console.log('rowsToDelete:');
      console.log(rowsToDelete.length);
      if (rowsToDelete && rowsToDelete.length) {
        const indicesOfRowsToDelete = rowsToDelete.map(row => row[0]);
        console.log(`indicesOfRowsToDelete - 84`);
        console.log(indicesOfRowsToDelete);
        const sheetId = swWorkers.getSheetId();
        const requests = indicesOfRowsToDelete.reverse().map(e => ({ deleteDimension: { range: { sheetId, startIndex: e - 1, endIndex: e, dimension: "ROWS" } } }));
        Sheets.Spreadsheets.batchUpdate({ requests }, swss.getId());
        SpreadsheetApp.flush();
      } 
    }
          
  } catch(err) {
    logErrorFunctions('setCAs: DELETE', sheetCAIds, rowsToDelete, err);
  }


  // identify rows to ADD
  // values that are in new data (payloadCAIds) but not in existing sheet
  const rowsToAdd = payload.filter(x => !CAIds.includes(x.Id)) // Array of objects returned from Salesforce whose contact Ids are not in Google sheet
  console.log('rowsToAdd:');
  console.log(rowsToAdd.length);
  if (rowsToAdd && rowsToAdd.length) {
    try {
      appendNewRowsSW(rowsToAdd, swWorkers);
    } catch (err) {
      logErrorFunctions('setCAs: ADD', payloadCAIds, rowsToAdd, err);
    }
  }
    

  // identify rows to UPDATE
  const intersectionIncoming = payload.filter(x => CAIds.includes(x.Id)); // new data rows that are already in google sheet
  const intersectionExisting = allData.filter((x, sheetIndex) => {
    if (payloadCAIds.includes(x[0])) {
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

  intersectionExisting.forEach((sheetRow) => {
    // console.log('160: sheetRow');
    // console.log(sheetRow);
    // console.log(`sheetRow[0]: ${sheetRow[0]}`);
    const origIndex = sheetRow.pop();
    // console.log(`origIndex: ${origIndex}`);
    const matchingRowInPayload = intersectionIncoming.find(payloadRow => payloadRow.Id === sheetRow[0]);
    if (matchingRowInPayload) {
      // console.log(`MATCH: matchingRowInPayload:` );
      // console.log(matchingRowInPayload);
      const slicedArray = Object.values(matchingRowInPayload).slice(1);
      // console.log(`slicedArray`);
      // console.log(slicedArray);
      // console.log(`sheetRow`);
      // console.log(sheetRow);
      if ( sheetRow.every((cell, i) => looserEqual(slicedArray[i], cell))) { 
        // console.log(`180: MATCH ${origIndex + 1}`);
      } else {
        console.log(`185: NOMATCH ${origIndex + 1}`);
        console.log('sheetRow');
        console.log(sheetRow);
        console.log('slicedArray');
        console.log(slicedArray);
        // this means the row that matched on contact ID DOES NOT match entirely (eg other data is new) and needs to be updated
        // need to find the index of this row *in the google sheet*, not in the incoming payload array
        indicesOfRowsToUpdate.push(origIndex + 1);
        newRowsToAppend.push(Object.values(matchingRowInPayload));
      }
    } else {
      console.log('no matching row found')
    }
    
  });
  console.log(`newRowsToAppend 161: ${newRowsToAppend.length}`);
  console.log(`indicesOfRowsToUpdate 163: ${indicesOfRowsToUpdate.length}`);
  if (newRowsToAppend && newRowsToAppend.length && indicesOfRowsToUpdate && indicesOfRowsToUpdate.length) {
    try {
    const sheetId = swWorkers.getSheetId();
    const requests = indicesOfRowsToUpdate.reverse().map(e => ({ deleteDimension: { range: { sheetId, startIndex: e - 1, endIndex: e, dimension: "ROWS" } } }));
    Sheets.Spreadsheets.batchUpdate({ requests }, swss.getId());
    SpreadsheetApp.flush();
    appendNewRowsSW(newRowsToAppend, workers);
  } catch (err) {
    logErrorFunctions('setCAs: UPDATE', indicesOfRowsToUpdate, newRowsToAppend, err);
  } 
  }

  // remove duplicates
  console.log('removing dupes');
  const sheetId = swWorkers.getSheetId();
  console.log(`sheetId: ${sheetId}`);
  const resource = { requests: [{ deleteDuplicates: { range: { sheetId } } }] };
  Sheets.Spreadsheets.batchUpdate(resource, swss.getId());
  SpreadsheetApp.flush();
}
