const CAfieldsArray = [
  'Id', 
  'First_name_from_form__c', 
  'Preferred_Name_from_Form__c',
  'Last_Name_from_form__c',
  'Pronouns__c',
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
  'In_Unit__c',
  'AppSheet_ID__c',
  'AppSheet_Department__c',
  'Auth_Card_Date_Time__c'
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
      } else {
        console.log(`no records returned`);
      }

      setCAsSimple(records);
      try {
        removeEmptyRows(swWorkers);
      } catch(err) {
        logErrorFunctions('getCAsByCampaign: removeEmptyRows', null, records[0], err);
      }
      return {
        Success: true,
        Error: null
        }       

    } catch (err) {
      logErrorFunctions('getCAsByCampaign', null, records[0], err);
      return {
        Success: false,
        Error: err
      }
    }

  
}

function appendNewRowsSimple(data, sheet) {
  const values = data.reduce((ar, obj) => {
      ar.push(Object.values(obj).slice(1));
      return ar;
    }, []);

  if (values && values.length) {

   const last = sheet.getLastRow();
   console.log(`last: ${last}`);
   console.log(`sheet.getMaxRows(): ${sheet.getMaxRows()}`);
   if (last === sheet.getMaxRows()) {
    console.log('last === sheet.getMaxRows');
    console.log('inserting row after last');
    sheet.insertRowAfter(last);
   }
   sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
    } else {
      logErrorFunctions('appendNewRowsSimple', [data[0], sheet], '', 'No data passed to appendNewRowsSimple');
    }
}

async function setCAsSimple(payload) {
  console.log(`setCAsSimple`);
  console.log(payload[0]);
  
  console.log('clear'); 
  // clear all existing rows except header row, if there is more than one row in the sheet
  if (swWorkers.getMaxRows() > 1) {
    try {
    swWorkers.getRange('A2:AA').clearContent(); // will need to sub 'AA' for last SF column if # of fields updates?
    } catch(err) {
      logErrorFunctions('setCASimple: DELETE', '', '', err);
    }
  }
  
  console.log('add'); 
  // add all rows from payload
  try {
    appendNewRowsSimple(payload, swWorkers);
    return;
  } catch (err) {
    logErrorFunctions('setCASimple: ADD', payload[0], '', err);
  }

}
const swAssessments = swss.getSheetByName('Assessments'); 
// function syncCardsAndAssessments() {
//   // find rows that need updating
//   const workerValues = swWorkers.getDataRange().getValues().slice(1); // remove header row
//   const assessmentValues = swAssessments.getDataRange().getValues().slice(1); // remove header row
//   let cardSignDateTime;
//   const updateWorkerIds = workerValues.map((row, idx) => {
//     if (row[12] == true || 'true') {
//       const nameCombo1 = workerValues[idx][2] ? `${workerValues[idx][2]} ${workerValues[idx][3]}` : `${workerValues[idx][1]} ${workerValues[idx][3]}`;

//       // check if most recent assessment was set before card sign date and is not a 2
//       cardSignDateTime = row[26] ? new Date(row[26]) : new Date(row[13]);
//       console.log(`${nameCombo1} cardSignDateTime: ${cardSignDateTime}, card signed = ${row[12]}`);
//       const matchingAssessments = assessmentValues.filter(aRow => aRow[6] === row[24]).filter(n => n);
//       if (!matchingAssessments.length) {
//         console.log(`no matching assessments for ${nameCombo1} at index ${idx}`);
//         return [idx, nameCombo1, row[12], cardSignDateTime];
//       } else {
//         const mostRecentMatchingAssessmemt = matchingAssessments.sort((a,b) => new Date(b[1]) - new Date(a[1]))[0];
//         // const mRMADate = new Date(mostRecentMatchingAssessmemt[1].toDateString()); // this strips out the timestamp
//         const mRMADate = new Date(mostRecentMatchingAssessmemt[1]);
//         console.log(`${nameCombo1} mRMADate: ${mRMADate}`);
//         console.log(`is most recent assessment (mRMA date) smaller than card sign date for ${nameCombo1}? ${mRMADate < cardSignDateTime}`);
//         console.log(mostRecentMatchingAssessmemt[3]);
//         if (mRMADate < cardSignDateTime && mostRecentMatchingAssessmemt[3] != '2') {
//           return [idx, nameCombo1, row[12], cardSignDateTime];
//         }      
//     }}
//   }).filter(n => n);
//   console.log('updateWorkerIds: this should be only card signers');
//   console.log(updateWorkerIds.find(item => item[2] !== 'true'));
//   for (i = 1; i < updateWorkerIds.length; i++) {
//     const id = generateUID(8);
//     const idxx = updateWorkerIds[i[0]] - 1;
//     if (workerValues[idxx] && workerValues[idxx].length) {
//       const nameCombo = workerValues[idxx][2] ? `${workerValues[idxx][2]} ${workerValues[idxx][3]}` : `${workerValues[idxx][1]} ${workerValues[idxx][3]}`;
//       cardSignDateTime = workerValues[idxx][26] ? new Date(workerValues[idxx][26]) : new Date(workerValues[idxx][13]);
//       const row = [				
//         id, // AssessID
//         cardSignDateTime, // Date
//         'Signed Card', // AssessedBy	
//         '2', // Assessment	
//         workerValues[idxx][0], // CA ID	
//         nameCombo, // Name
//         workerValues[idxx][24] // AppSheet Worker ID
//       ];
//       console.log(`i: ${i} . ${idxx + 1}: ${nameCombo}`);
//       // console.log(row);
//       // swAssessments.appendRow(row);
//     }
//   };
// }
