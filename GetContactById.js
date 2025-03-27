function getContactById(id) {
  console.log(`getContactById.gs > 2, id: ${id}`);
  if (id) {
    const qp = new QueryParameters();
    qp.setSelect("Full_Name__c, Employer_Name_Text__c");
    qp.setFrom("Contact");
    qp.setWhere(`Id = \'${id}\'`);
    // qp.setGroupBy("Account.Name");
    // qp.setOrderBy("Account.Name");
    // qp.setLimit(100);
    // qp.setOffset(10);
    // qp.sethaving("SUM(Amount) > 100000");

    const records = get(qp);
    console.log(records);
  } else {
    console.log(`getContactById.gs > 17: no Id provided`);
  }
  
}

// getContactById('003Rf000004I8rhIAC');