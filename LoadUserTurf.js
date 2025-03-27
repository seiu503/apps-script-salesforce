const fieldsArray = ['Id', 'Salutation_Last__c', 'Email', 'Employer_Name_Text__c', 'Title', 'Preferred_Language__c', 'Best_Phone__c', 'Binary_Membership__c', 'Salutation_Name__c', 'Pre_Fill_Member_Form_Link__c', 	'Current_Member_Status__c'];
const ss = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/11pYOEoAtTtxH_5y6uxzVuhUis6DvZxFJoazHnuMD4R4/edit',
);
const workers = ss.getSheetByName('MemberChartingApp'); 
const contactIds = workers.getRange("A2:A").getValues().flat().filter(Boolean);

// const employer = 'Employment - Salem | OED | Employment Building'; // test data
// const employer = 'Beaverton | DHS | Greenbrier Parkway'; // test data

async function loadUserTurf(employer = 'Beaverton | DHS | Greenbrier Parkway') {
  console.log(`loadUserTurf.gs > 6, employer: ${employer}`);
  let records;
  if (employer) {
    try {
      const qp = new QueryParameters();
      qp.setSelect(fieldsArray.toString());
      qp.setFrom("Contact");
      qp.setWhere(`Employer_Name_Text__c = \'${employer}\' AND Active_Worker__c = TRUE`);


      console.log(`loadUserTurf > 19: ${qp}`);
      records = await get(qp);
      // console.log(records);

      await setUserTurf(employer, records);
    } catch (err) {
      console.log(err);
      logErrorFunctions('loadUserTurf', employer, records, err);
    }

  } else {
    console.log(`loadUserTurf > 24: no employer provided`);
  }
  
}

function confirmUniqueRow(newRow) {
  // console.log(`confirmUniqueRow > 38`);
  // console.log(`contactId: ${newRow[0]}`);
  const newRowId = newRow[0];
  // console.log(`confirmUniqueRow returning ${!contactIds.includes(newRowId)} for ${newRow[1]}`);
  return !contactIds.includes(newRowId);
}

function confirmUniqueContactId(id) {
  // console.log(`confirmUniqueContactId > 46`);
  // console.log(`contactId: ${id}`);
  // console.log(`confirmUniqueContactId returning ${!contactIds.includes(id)}`);
  return !contactIds.includes(id);
}

async function appendNewRows(data, sheet) { // expects an array of objects
  console.log('appendNewRows > 30');
    try {
      await data.forEach(obj => {
        // console.log(`appendNewRows > 56 contactId: ${obj.Id}`);
        if (confirmUniqueContactId(obj.Id)) {
          // flatten object to array
          // console.log(`appendNewRows > 59 check field order here`);
          // console.log(Object.values(obj).slice(1));
          const row = Object.values(obj).slice(1);
          sheet.appendRow(row);
        } else {
          console.log(`dup contact Id ${obj.Id}; not appending`);
        }
        // let row = [];
        // fieldsArray.forEach(field => {
        //   row.push(obj[field]);
        // })        
      })
    } catch (err) {
      console.log(err);
      logErrorFunctions('appendNewRows', [data, sheet], '', err);
    }
}

async function setUserTurf(employerName, payload) {
  console.log('setUserTurf > 56');

  // Check for matching rows -- has this turf been pulled before?
  const allData = workers.getDataRange().getValues();
  const turfIndices = [];
  const turf = await allData.filter((row, index) => {
    if (row[3] === employerName) {
      turfIndices.push(index + 1);
      return row;
    }
  })
  console.log(`setUserTurf > 66`);
  // console.log(turf); // array of arrays
  console.log(turf.length);

  
  // If no rows found, create a new row for every row in the payload from the API call in step 1
  if (!turf || !turf.length) {
    // append new rows with data from paylod from loadTurf function
    console.log(`setUserTurf > 57: no matching turf found, appending new data`);
    try {
      await appendNewRows(payload, workers);    
    } catch (err) {
      console.log(err);
      logErrorFunctions('setUserTurf', turf, '', err);
    }
  } else {
    // otherwise, delete all existing rows in that turf and replace them with fresh data from Salesforce
    console.log(`setUserTurf > 61: found matching turf, deleting and replacing`);
    try {
      await turfIndices.forEach(index => workers.deleteRow(index));
      // append new rows with data from paylod from loadTurf function
      await appendNewRows(payload, workers); 
    } catch (err) {
      console.log(err);
      logErrorFunctions('setUserTurf', turf, '', err);
    }
  }
}