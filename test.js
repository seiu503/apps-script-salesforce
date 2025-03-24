// function getContactById(id) {
//   console.log(`test.gs > 6, id: ${id}`);
//   if (id) {
//     const qp = new QueryParameters();
//     qp.setSelect("Full_Name__c, Employer_Name_Text__c");
//     qp.setFrom("Contact");
//     qp.setWhere(`Id = \'${id}\'`);
//     // qp.setGroupBy("Account.Name");
//     // qp.setOrderBy("Account.Name");
//     // qp.setLimit(100);
//     // qp.setOffset(10);
//     // qp.sethaving("SUM(Amount) > 100000");

//     const records = get(qp);
//     console.log(records);
//   } else {
//     console.log(`test.gs > 21: no Id provided`);
//   }
  
// }

// getContactById('003Rf000004I8rhIAC');

// function createNewVisit(body) {
function createNewVisit() {
  console.log(`test.gs > 25, createNewVisit`);
  // console.log(body);

  // console.log(`test.gs > 29 TODAY(): ${TODAY()}`);

  // test data for now
  const body = {
    CVRSOS__Contact__c: '003Rf000004I8rhIAC', // my contact
    Visit_Date__c: '2024-03-24',
    Visited_By__c: '00561000001dUpI', // my user
    CVRSOS__Result__c: 'CONTACTED - SIGNED Membership &/or CAPE',
    App_Source__c: "Worksite",
    Preferred_Language__c: "English",
    Notes_Long__c: "Notes go here"
  };

  console.log(`test.gs > 43}`);
  console.log(body);

  if (body) {
    try {
      insert({ 
        sObject: 'CVRSOS__Visits__c', 
        payload: { ...body }
        })

    } catch (err) {
      console.log(err);
      logErrorFunctions('createNewVisit', {body}, '', err);
    }

  } else {
    console.log(`test.gs > createNewVisit: no body`)
  }
}
