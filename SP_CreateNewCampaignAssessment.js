async function SP_createNewCampaignAssessment(
  First_name_from_form__c, 
  Preferred_Name_from_Form__c,
  Pronouns__c,
  Last_Name_from_form__c,
  Email_from_form__c, 
  AGENCY_from_form__c, 
  Job_Title__c, 
  Willing_to_Help__c, 
  Preferred_Language_from_form__c, 
  Phone_from_form__c, 
  Address__c,
  City__c,
  State__c,
  ZIP__c,
  Potential_Leader__c,
  AppSheet_ID__c,
  Signed_Membership_Form__c,	
  Member_Form_Signed_Date_Time__c,
  Bargaining_Survey_Complete__c,
  Bargaining_Survey_Completed_DATE__c,
  Sticker_Up_Participation__c,
  Bargaining_Team__c
  ) {
  // First_name_from_form__c = 'testFirst', 
  // Preferred_Name_from_Form__c = 'testNickname',
  // Last_Name_from_form__c = 'testLast',
  // Pronouns__c = 'She/Her',
  // Email_from_form__c = 'test@test.com', 
  // AGENCY_from_form__c = 'Cedar Crossings', 
  // Job_Title__c =  'Certified Nursing Assistant', 
  // Willing_to_Help__c = true, 
  // Preferred_Language_from_form__c = 'English', 
  // Phone_from_form__c = '5035551212', 
  // Address__c = '123 test street',
  // City__c = "Portland",
  // State__c = 'OR',
  // ZIP__c = '12345',
  // Potential_Leader__c = true,
  // AppSheet_ID__c = '12345678' ) {

  const body = {
    First_name_from_form__c, 
    Preferred_Name_from_Form__c,
    Last_Name_from_form__c,
    Pronouns__c,
    Email_from_form__c, 
    AGENCY_from_form__c, 
    Job_Title__c, 
    Willing_to_Help__c, 
    Preferred_Language_from_form__c, 
    Phone_from_form__c, 
    Address__c,
    City__c,
    State__c,
    ZIP__c,
    Potential_Leader__c,
    In_Unit__c: true,
    RecordTypeId: '012Rf000002kYiIIAU', // External Campaigns
    Campaign_Name_Picklist__c: 'Sapphire',
    // Employer_Lookup__c: '0016100000Pw3eMAAR', // NOT NEEDED Sapphire Health Services (parent employer)
    AppSheet_ID__c,
    Signed_Membership_Form__c,	
    Member_Form_Signed_Date_Time__c,
    Bargaining_Survey_Complete__c,
    Bargaining_Survey_Completed_DATE__c,
    Sticker_Up_Participation__c,
    Bargaining_Team__c
  };


  console.log(`SP_createNewCampaignAssessment.gs > 74`);
  console.log(body);
  
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

      console.log(`SP_createNewCampaignAssessment: 84 *******************`);
      console.log(response);
      const jsonResponse = JSON.parse(response);
      const id = jsonResponse.id;

      // write CA_ID value back to google sheet
      console.log('write CA_ID value back to google sheet')
      const appSheetIds = spWorkers.getRange("Q2:Q").getValues().flat(); // hard-coded column value that will need to be changed if fieldlist or sheet changes
      // find matching appSheetId
      console.log(`AppSheet_ID__c: ${AppSheet_ID__c}`);
      const rowIndex = appSheetIds.indexOf(AppSheet_ID__c);
      console.log(`rowIndex: ${rowIndex}`);
      console.log(`A${rowIndex + 2}`);
      if (rowIndex > 1) {
        console.log(`setting cell A${rowIndex + 2} to ${id}`); // add 2 to row index bc there was no Appsheet ID in header row
        spWorkers.getRange(`A${rowIndex + 2}`).setValue(id);
        console.log('this step happens after the value is set.')
      }
      

      return {
        success: true,
        errors: null,
        id
      }  

    } catch (err) {
      logErrorFunctions('SP_createNewCampaignAssessment', {body}, {cleanBody}, err);
      return {
        success: false,
        errors: [`There was an error creating the worker, please contact the app administrator.`,err]
      }
    }

  } else {
    console.log(`SP_createNewCampaignAssessment: no body`);
    logErrorFunctions('SP_createNewCampaignAssessment', {body}, {cleanBody}, err);
    return {
        success: false,
        errors: [`There was an error creating the worker, please contact the app administrator.`,'No body provided to insert function']
      }
  }
}
