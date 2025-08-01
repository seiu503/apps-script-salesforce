async function global_createNewCampaignAssessment( env = 'prod', campaign = 'jacksonCounty', AppSheet_ID__c='A1162A15') {
  console.log(`global_createNewCampaignAssessment.gs > 2: env: ${env}`);
  

  // set config
  const config = globalConfig(campaign);
  const ss = SpreadsheetApp.openByUrl(config.sheetURL);
  console.log(`config ss: ${ss.getName()}`);
  const workers = ss.getSheetByName(config.workerSheetName); 

  // get values for body from gSheet

  const appSheetIds = workers.getRange(config.appSheetIdColumn).getValues().flat();
  // find matching appSheetId
  console.log(`AppSheet_ID__c: ${AppSheet_ID__c}`);
  const rowIndex = appSheetIds.indexOf(AppSheet_ID__c);
  console.log(`rowIndex: ${rowIndex}`);
  // get row values
  let rowValues = [];
  if (rowIndex > 1) {
    console.log(`getting values for range A${rowIndex + 2}:${config.lastSFColumn}${rowIndex + 2}`); // add 2 to row index bc there was no Appsheet ID in header row
    rowValues = workers.getRange(`A${rowIndex + 2}:${config.lastSFColumn}${rowIndex + 2}`).getValues();
    console.log('rowValues (inner array of 2D array)');
    console.log(rowValues[0]);
  }
  // create body object from field list and row values

  const body = {
    RecordTypeId: '012Rf000002kYiIIAU', // External Campaigns
    Campaign_Name_Picklist__c: config.campaignPicklist,
  };

  config.fieldList.map((field, index) => {
    body[field] = rowValues[0][index]
  })

  console.log(`global_createNewCampaignAssessment.gs > 37`);
  console.log(body);

  delete body.Id;
  
  const cleanBody = removeNullValues(body);
  console.log('cleanBody');
  console.log(cleanBody);

  if (cleanBody) {
    try {
      const response = await insert({ 
        sObject: 'Higher_Ed_Strike_Pledge__c', 
        payload: { ...cleanBody },
        env: 'prod' // hard-coded env var
        });

      console.log(`global_createNewCampaignAssessment: 54 *******************`);
      console.log(response);
      const jsonResponse = JSON.parse(response);
      const id = jsonResponse.id;

      // write CA_ID value back to google sheet
      if (rowIndex > 1) {
        console.log(`setting cell A${rowIndex + 2} in ${ss.getName()} sheet to ${id}`); // add 2 to row index bc there was no Appsheet ID in header row
        workers.getRange(`A${rowIndex + 2}`).setValue(id);
        console.log('this step happens after the value is set.')
      }
      

      return {
        success: true,
        errors: null,
        id
      }  

    } catch (err) {
      logErrorFunctions('global_createNewCampaignAssessment', {body}, {cleanBody}, err);
      return {
        success: false,
        errors: [`There was an error creating the worker, please contact the app administrator.`,err]
      }
    }

  } else {
    console.log(`global_createNewCampaignAssessment: no body`);
    logErrorFunctions('global_createNewCampaignAssessment', {body}, {cleanBody}, err);
    return {
        success: false,
        errors: [`There was an error creating the worker, please contact the app administrator.`,'No body provided to insert function']
      }
  }
}
