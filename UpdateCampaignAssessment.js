async function updateCampaignAssessment(
  Id,
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
  In_Unit__c) {
  // Id = 'a2RRt000000qHZRMA2',
  // First_name_from_form__c = 'updatedFirst', 
  // Preferred_Name_from_Form__c = 'updatedNickname',
  // Pronouns__c = 'He/Him',
  // Last_Name_from_form__c = 'updatedLast',
  // Email_from_form__c = 'updated@test.com', 
  // AGENCY_from_form__c = 'Portland State University', 
  // Department__c = 'TLC The Learning Center Svcs',
  // Job_Title__c =  'Updated job title', 
  // Willing_to_Help__c = true, 
  // Preferred_Language_from_form__c = 'English', 
  // Phone_from_form__c = '5035551212', 
  // Address__c = '123 test street',
  // City__c = "Portland",
  // State__c = 'OR',
  // ZIP__c = '12345',
  // Department_Lookup__c = 'a1WRt0000028WG5MAM',
  // Student_Clubs__c = ['American Sign Language (ASL)','Anime Club'],
  // Student_Major__c = 'Arts & Letters',
  // Relationships__c = 'relationship notes',
  // Potential_Leader__c = false,
  // In_Unit__c = false) {

  const body = {
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
    Student_Clubs__c: arrayToSFMultiSelectPicklist(Student_Clubs__c),
    Student_Major__c,
    Relationships__c,
    Potential_Leader__c,
    In_Unit__c
  };


  console.log(`updateCampaignAssessment.gs > 72}`);
  console.log(body);

  if (body) {
    try {
      await update({ 
        sObject: 'Higher_Ed_Strike_Pledge__c', 
        sObjectId: Id,
        payload: { ...body },
        apiVersion: '50', 
        env: 'staging'
        });

      return {
        Success: true,
        Error: null
      }  

    } catch (err) {
      logErrorFunctions('updateCampaignAssessment', {body}, '', err);
      return {
        Success: false,
        Error: `There was an error updating the worker, please contact the app administrator. ${err}`
      }
    }

  } else {
    console.log(`test.gs > updateCampaignAssessment: no body`);
    logErrorFunctions('updateCampaignAssessment', {body}, '', err);
    return {
        Success: false,
        Error: `There was an error updating the worker, please contact the app administrator. No body provided to insert function.`
      }
  }
}
