async function createNewCampaignAssessment(
  First_name_from_form__c, 
  Preferred_Name_from_Form__c,
  Pronouns__c,
  Last_Name_from_form__c,
  Email_from_form__c, 
  AGENCY_from_form__c, 
  Department__c,
  Job_Title__c, 
  Willing_to_Help__c, 
  Preferred_Language_from_form__c, 
  Phone_from_form__c, 
  Address__c,
  City__c,
  State__c,
  ZIP__c,
  Department_Lookup__c,
  Student_Clubs__c,
  Student_Major__c,
  Relationships__c,
  Potential_Leader__c,
  Signed_Auth_Card__c,
  Auth_Card_Date__c,
  AppSheet_ID__c,
  AppSheet_Department__c,
  CreatedBy_AppSheetUser__c,
  env) {
  // First_name_from_form__c = 'testFirst', 
  // Preferred_Name_from_Form__c = 'testNickname',
  // Last_Name_from_form__c = 'testLast',
  // Pronouns__c = 'She/Her',
  // Email_from_form__c = 'test@test.com', 
  // AGENCY_from_form__c = 'Portland State University', 
  // Department__c = 'ACB AAS Academic Advising Serv',
  // Job_Title__c =  'Test job title', 
  // Willing_to_Help__c = true, 
  // Preferred_Language_from_form__c = 'English', 
  // Phone_from_form__c = '5035551212', 
  // Address__c = '123 test street',
  // City__c = "Portland",
  // State__c = 'OR',
  // ZIP__c = '12345',
  // Department_Lookup__c = 'a1WRf0000027vmn',
  // Student_Clubs__c = ['American Sign Language (ASL)','Anime Club'],
  // Student_Major__c = ['Arts & Letters'],
  // Relationships__c = 'relationship notes',
  // Potential_Leader__c = true,
  // Signed_Auth_Card__c,
  // Auth_Card_Date__c,
  // AppSheet_ID__c = '12345678',
  // AppSheet_Department__c = 'a1WRf0000027vmn',
  // CreatedBy_AppSheetUser__c = '0054N000003rixvQAA',
  // env = 'prod' ) {

  let eLookup;
  if (env = 'prod') {
    eLookup = '001Rf00000RQ5m8IAD' // Student Workers, production
  } else {
    eLookup = '001Rt00000tUA2lIAG' // SWO - Unknown, sandbox
  }
  const body = {
    First_name_from_form__c, 
    Preferred_Name_from_Form__c,
    Last_Name_from_form__c,
    Pronouns__c,
    Email_from_form__c, 
    AGENCY_from_form__c, 
    Department__c,
    Job_Title__c, 
    Willing_to_Help__c, 
    Preferred_Language_from_form__c, 
    Signed_Auth_Card__c,
    Auth_Card_Date__c,
    Phone_from_form__c, 
    Address__c,
    City__c,
    State__c,
    ZIP__c,
    Department_Lookup__c,
    Student_Clubs__c: arrayToSFMultiSelectPicklist(Student_Clubs__c),
    Student_Major__c: arrayToSFMultiSelectPicklist(Student_Major__c),
    Relationships__c,
    Potential_Leader__c,
    In_Unit__c: true,
    RecordTypeId: '012Rf000002kYiIIAU', // External Campaigns, same in sandbox and prod
    Campaign_Name_Picklist__c: 'Student Workers',
    Employer_Lookup__c: eLookup, 
    AppSheet_ID__c,
    AppSheet_Department__c,
    CreatedBy_AppSheetUser__c
  };


  console.log(`createNewCampaignAssessment.gs > 74, env: ${env}}`);
  console.log(body);
  
  const cleanBody = removeNullValues(body);
  console.log('cleanBody');
  console.log(cleanBody);

  if (env === 'prod') {
    swss = SpreadsheetApp.openByUrl(SW_PROD_SHEET_URL);
    swWorkers = swss.getSheetByName('StudentWorkers'); 
    swUsers = swss.getSheetByName('Users');
    CAIds = swWorkers.getRange("A2:A").getValues().flat().filter(Boolean);
  }

  if (cleanBody) {
    try {
      const response = await insert({ 
        sObject: 'Higher_Ed_Strike_Pledge__c', 
        payload: { ...cleanBody },
        env
        });

      console.log(`createNewCampaignAssessment: 84 *******************`);
      console.log(response);
      const jsonResponse = JSON.parse(response);
      const id = jsonResponse.id;

      // write CA_ID value back to google sheet
      const appSheetIds = swWorkers.getRange("Y2:Y").getValues().flat();
      // find matching appSheetId
      // console.log(`AppSheet_ID__c: ${AppSheet_ID__c}`);
      const rowIndex = appSheetIds.indexOf(AppSheet_ID__c);
      if (rowIndex > 1) {
        const cell = swWorkers.getRange(`A${rowIndex + 2}`); // add 2 to row index bc there was no Appsheet ID in header row
        cell.setValue(id);
      }
      

      return {
        success: true,
        errors: null,
        id
      }  

    } catch (err) {
      logErrorFunctions('createNewCampaignAssessment', {body}, {cleanBody}, err);
      return {
        success: false,
        errors: [`There was an error creating the worker, please contact the app administrator.`,err]
      }
    }

  } else {
    console.log(`test.gs > createNewCampaignAssessment: no body`);
    logErrorFunctions('createNewCampaignAssessment', {body}, {cleanBody}, err);
    return {
        success: false,
        errors: [`There was an error creating the worker, please contact the app administrator.`,'No body provided to insert function']
      }
  }
}
