async function global_updateCampaignAssessment(env = 'prod', campaign = 'jacksonCounty', AppSheet_ID__c='A1162A15') {
  console.log(`global_updateCampaignAssessment.gs > 2: env: ${env}`);

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
  };

  config.fieldList.map((field, index) => {
    body[field] = rowValues[0][index]
  })
  const CAId = body.Id;
  console.log(`CAId: ${CAId}`);

  console.log(`global_updateCampaignAssessment.gs > 34`);
  // console.log(body);
  
  const cleanBody = removeNullValues(body);
  delete cleanBody.Id;
  console.log('cleanBody');
  console.log(cleanBody);

  const request = { 
    sObject: 'Higher_Ed_Strike_Pledge__c', 
    sObjectId: CAId,
    payload: { ...cleanBody },
    apiVersion: '50', 
    env: 'prod'
    };
  
  // console.log(request);

  if (cleanBody) {
    try {
      const response = await update(request);

      return {
        success: true,
        errors: null
      }  

    } catch (err) {
      logErrorFunctions('global_updateCampaignAssessment', {body}, {cleanBody}, err);
      return {
        success: false,
        errors: [`There was an error updating the worker, please contact the app administrator.`, err]
      }
    }

  } else {
    console.log(`global_updateCampaignAssessment: no body`);
    logErrorFunctions('global_updateCampaignAssessment', {body}, {cleanBody}, err);
    return {
        success: false,
        errors: [`There was an error updating the worker, please contact the app administrator.`, 'No body provided to insert function']
      }
  }
}
