const fieldsArray = ['Id', 'Salutation_Last__c', 'Email', 'Employer_Name_Text__c', 'Title', 'Preferred_Language__c', 'Best_Phone__c', 'Binary_Membership__c', 'Salutation_Name__c', 'Pre_Fill_Member_Form_Link__c', 	'Current_Member_Status__c'];
const ss = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/11pYOEoAtTtxH_5y6uxzVuhUis6DvZxFJoazHnuMD4R4/edit',
);
const workers = ss.getSheetByName('MemberChartingApp'); 
const contactIds = workers.getRange("A2:A").getValues().flat().filter(Boolean);

// const employer = 'Employment - Salem | OED | Employment Building' || 'OHA - Salem | OHA | Oregon State Hospita; // test data
// const employer = 'Beaverton | DHS | Greenbrier Parkway'; // test data

async function loadUserTurf(employer = 'OHA - Salem | OHA | Oregon State Hospital') {
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

      setUserTurf(employer, records);
    } catch (err) {
      logErrorFunctions('loadUserTurf', employer, records, err);
    }

  } else {
    console.log(`loadUserTurf > 24: no employer provided`);
  }
  
}

const confirmUniqueContactId = (id) => !contactIds.includes(id);

function appendNewRows(data, sheet) {
  console.log('appendNewRows');
  try {
    const values = data.reduce((ar, obj) => {
      if (confirmUniqueContactId(obj.Id)) {
        const row = Object.values(obj).slice(1);
        ar.push(row);
      }
      return ar;
    }, []);
    if (values) {
      sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
    } else {
      logErrorFunctions('appendNewRows', [data, sheet], '', 'No values passed to appendNewRows');
    }
  } catch (err) {
    logErrorFunctions('appendNewRows', [data, sheet], '', err);
  }
}

function setUserTurf(employerName, payload) {
  console.log('setUserTurf');
  const allData = workers.getDataRange().getValues();
  const turfIndices = allData.map((row, index) => {
    if (row[3] === employerName) {
      return index + 1;
    }
  }).filter(n => n);
  if (!turfIndices.length) {
    console.log('just add new rows')
    try {
      appendNewRows(payload, workers);
    } catch (err) {
      logErrorFunctions('setUserTurf', turfIndices, '', err);
    }
  } else {
    console.log('delete, then add')
    try {
      const sheetId = workers.getSheetId();
      const requests = turfIndices.reverse().map(e => ({ deleteDimension: { range: { sheetId, startIndex: e - 1, endIndex: e, dimension: "ROWS" } } }));
      Sheets.Spreadsheets.batchUpdate({ requests }, ss.getId());
      SpreadsheetApp.flush();
      appendNewRows(payload, workers);
    } catch (err) {
      logErrorFunctions('setUserTurf', turfIndices, '', err);
    }
  }
}