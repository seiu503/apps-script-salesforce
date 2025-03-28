// '003Rf000004I8rhIAC'

async function getContactById(id = '003Rf000004I8rhIAC') {
  // console.log(`getContactById.gs > 2, id: ${id}`);
  if (id) {
    const qp = new QueryParameters();
    qp.setSelect(fieldsArray.toString());
    qp.setFrom("Contact");
    qp.setWhere(`Id = \'${id}\'`);

    const records = await get(qp);
    setContactById(id, records);
  } else {
    console.log(`getContactById.gs > 17: no Id provided`);
  }
  
}

async function setContactById(id, payload) {
  // console.log('setContactById');
  // console.log(id);
  const allData = workers.getDataRange().getValues();
  const matchingContactId = (row) => row[0] === id;
  const updateIndex = allData.findIndex(matchingContactId);
  // console.log(`updateIndex: ${updateIndex}`);
  if (!updateIndex || updateIndex < 0) {
    // just add the new contact
    await appendNewRow(payload, workers); 
  } else {
    try {
      // replace contact in matching row
      workers.deleteRow(updateIndex + 1);
      // append new rows with data from paylod from getContactById function
      appendNewRow(payload, workers); 
    } catch (err) {
      console.log(err);
      logErrorFunctions('setContactById', payload, updateIndex, err);
    }
  }
}
