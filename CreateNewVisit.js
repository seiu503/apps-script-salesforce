function createNewVisit(CVRSOS__Contact__c,Visit_Date__c,Visited_By__c,CVRSOS__Result__c,App_Source__c,Preferred_Language__c,Notes_Long__c) {
  console.log(`test.gs > 25, createNewVisit`);
  // console.log(body);

  let today = formatSFDate(new Date());

  const body = {
    CVRSOS__Contact__c, // '003Rf000004I8rhIAC', // my contact
    Visited_By__c, // '00561000001dUpI', // my user
    CVRSOS__Result__c, // 'CONTACTED - SIGNED Membership &/or CAPE',
    App_Source__c, // "Worksite",
    Preferred_Language__c, // "English",
    Notes_Long__c // "Notes go here"
  };

  body.Visit_Date__c = today;

  console.log(`test.gs > 43}`);
  console.log(body);

  if (body) {
    try {
      insert({ 
        sObject: 'CVRSOS__Visits__c', 
        payload: { ...body }
        })
      return {
        Success: true,
        Error: null
      }  

    } catch (err) {
      console.log(err);
      logErrorFunctions('createNewVisit', {body}, '', err);
      return {
        Success: false,
        Error: `There was an error saving the visit, please contact the app administrator. ${err}`
      }
    }

  } else {
    console.log(`test.gs > createNewVisit: no body`);
    logErrorFunctions('createNewVisit', {body}, '', err);
    return {
        Success: false,
        Error: `There was an error saving the visit, please contact the app administrator. No body provided to insert function.`
      }
  }
}
