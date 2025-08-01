async function SP_updateCampaignAssessment(
  Id,
  First_name_from_form__c, 
  Preferred_Name_from_Form__c,
  Pronouns__c,
  Last_Name_from_form__c,
  Email_from_form__c, 
  AGENCY_from_form__c, 
  Job_Title__c, 
  Preferred_Language_from_form__c, 
  Phone_from_form__c, 
  Address__c,
  City__c,
  State__c,
  ZIP__c,
  Potential_Leader__c,
  In_Unit__c,
  AppSheet_ID__c,
  Signed_Membership_Form__c,	
  Member_Form_Signed_Date_Time__c,
  Bargaining_Survey_Complete__c,
  Bargaining_Survey_Completed_DATE__c,
  Sticker_Up_Participation__c,
  Bargaining_Team__c
  ) {
  // Id = 'a2RRf000000a6dBMAQ', // prod id
  // First_name_from_form__c = 'updatedFirst', 
  // Preferred_Name_from_Form__c = 'updatedNickname',
  // Last_Name_from_form__c = 'updatedLast',
  // Pronouns__c = 'She/Her',
  // Email_from_form__c = 'test@test.com', 
  // AGENCY_from_form__c = 'Cedar Crossings', 
  // Job_Title__c =  'Certified Nursing Assistant', 
  // Preferred_Language_from_form__c = 'English', 
  // Phone_from_form__c = '5035551212', 
  // Address__c = '123 test street',
  // City__c = "Portland",
  // State__c = 'OR',
  // ZIP__c = '12345',
  // Potential_Leader__c = true,
  // In_Unit__c = true,
  // AppSheet_ID__c = '12345678',
  // Signed_Membership_Form__c,	
  // Member_Form_Signed_Date_Time__c,
  // Bargaining_Survey_Complete__c,
  // Bargaining_Survey_Completed_DATE__c,
  // Sticker_Up_Participation__c,
  // Bargaining_Team__c,
  // env = 'prod' ) {
  
  const body = {
    First_name_from_form__c, 
    Preferred_Name_from_Form__c,
    Pronouns__c,
    Last_Name_from_form__c,
    Email_from_form__c, 
    AGENCY_from_form__c, 
    Job_Title__c, 
    Preferred_Language_from_form__c, 
    Phone_from_form__c, 
    Address__c,
    City__c,
    State__c,
    ZIP__c,
    Potential_Leader__c,
    In_Unit__c,
    AppSheet_ID__c,
    Signed_Membership_Form__c,	
    Member_Form_Signed_Date_Time__c,
    Bargaining_Survey_Complete__c,
    Bargaining_Survey_Completed_DATE__c,
    Sticker_Up_Participation__c,
    Bargaining_Team__c
  };


  console.log(`SP_updateCampaignAssessment.gs > 72}`);
  console.log(body);
  
  const cleanBody = removeNullValues(body);
  console.log('cleanBody');
  console.log(cleanBody);

  if (cleanBody) {
    try {
      const response = await update({ 
        sObject: 'Higher_Ed_Strike_Pledge__c', 
        sObjectId: Id,
        payload: { ...cleanBody },
        apiVersion: '50', 
        env: 'prod'
        });

      return {
        success: true,
        errors: null
      }  

    } catch (err) {
      logErrorFunctions('SP_updateCampaignAssessment', {body}, {cleanBody}, err);
      return {
        success: false,
        errors: [`There was an error updating the worker, please contact the app administrator.`, err]
      }
    }

  } else {
    console.log(`test.gs > SP_updateCampaignAssessment: no body`);
    logErrorFunctions('SP_updateCampaignAssessment', {body}, {cleanBody}, err);
    return {
        success: false,
        errors: [`There was an error updating the worker, please contact the app administrator.`, 'No body provided to insert function']
      }
  }
}
