const CAfieldsArray = [
  'Id', 
  'First_name_from_form__c', 
  'Preferred_Name_from_Form__c',
  'Last_Name_from_form__c',
  'Pronouns__c',
  'Email_from_form__c', 
  'AGENCY_from_form__c', 
  'Department__c',
  'Job_Title__c', 
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
  'Auth_Card_Date_Time__c',
  'CreatedBy_AppSheetUser__c'
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
    swWorkers.getRange('A2:AB').clearContent(); // sub 'AB' for last SF column if # of fields updates
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