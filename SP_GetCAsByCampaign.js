const SP_CAfieldsArray = [
  'Id', 
  'First_name_from_form__c', 
  'Preferred_Name_from_Form__c',
  'Last_Name_from_form__c',
  'Pronouns__c',
  'Email_from_form__c', 
  'AGENCY_from_form__c', 
  'Job_Title__c', 
  'Preferred_Language_from_form__c', 
  'Phone_from_form__c', 
  'Address__c',
  'City__c',
  'State__c',
  'ZIP__c',
  'Potential_Leader__c',
  'In_Unit__c',
  'AppSheet_ID__c'
  ];
let spss = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1JktJuDesKyZMW6gcM2wRNzIs-BAfobNcC6DuvYg_itM/edit', // Sapphire contract campaign
);
let spWorkers = spss.getSheetByName('Workers'); 
let spUsers = spss.getSheetByName('Users');
let spCAIds = spWorkers.getRange("A2:A").getValues().flat().filter(Boolean);
// console.log('spCAIds');
// console.log(spCAIds);

async function SP_getCAsByCampaign(env) {
  console.log(`SP_getCAsByCampaign.gs > 33: env: ${env}`);

  let records;
    try {
      const qp = new QueryParameters();
      qp.setSelect(SP_CAfieldsArray.toString());
      qp.setFrom("Higher_Ed_Strike_Pledge__c");
      qp.setWhere(`Campaign_Name_Picklist__c = 'Sapphire'`);

      // add 'prod' as 3d argument to get() to get from production; otherwise gets records from 503admin sandbox
      records = await get(qp, '50', 'prod');
      if (records && records.length) {
        console.log(`${records.length} records returned`);
      } else {
        console.log(`no records returned`);
      }

      SP_setCAsSimple(records, spWorkers);
      try {
        removeEmptyRows(spWorkers);
      } catch(err) {
        logErrorFunctions('SP_getCAsByCampaign: removeEmptyRows', null, records[0], err);
      }
      return {
        Success: true,
        Error: null
        }       

    } catch (err) {
      logErrorFunctions('SP_getCAsByCampaign', null, records[0], err);
      return {
        Success: false,
        Error: err
      }
    }

  
}

async function SP_setCAsSimple(payload, sheet) {
  console.log(`SP_setCAsSimple`);
  console.log(payload[0]);
  
  console.log('clear'); 
  // clear all existing rows except header row, if there is more than one row in the sheet
  if (sheet.getMaxRows() > 1) {
    try {
    sheet.getRange('A2:AB').clearContent(); // sub 'AB' for last SF column if # of fields updates
    } catch(err) {
      logErrorFunctions('SP_setCAsSimple: DELETE', '', '', err);
    }
  }
  
  console.log('add'); 
  // add all rows from payload
  try {
    appendNewRowsSimple(payload, sheet);
    return;
  } catch (err) {
    logErrorFunctions('SP_setCAsSimple: ADD', payload[0], '', err);
  }

}