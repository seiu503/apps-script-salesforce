// 'a2RRt000000pii9MAA', // my student worker CA in sandbox

async function getCAById(id) {
  // console.log(`getCAById.gs > 2, id: ${id}`);
  if (id) {
    const qp = new QueryParameters();
    qp.setSelect(CAfieldsArray.toString());
    qp.setFrom("Higher_Ed_Strike_Pledge__c");
    qp.setWhere(`Id = \'${id}\'`);

    const records = await get(qp);
    setCAById(id, records);
  } else {
    console.log(`getCAById.gs > 17: no Id provided`);
  }
  
}

async function setCAById(id, payload) {
  console.log('setCAById');
  console.log(id);
  const allData = swWorkers.getDataRange().getValues();
  const matchingCAId = (row) => row[0] === id;
  const updateIndex = allData.findIndex(matchingCAId);
  // console.log(`updateIndex: ${updateIndex}`);
  if (!updateIndex || updateIndex < 0) {
    // just add the new contact
    await appendNewRow(payload, swWorkers); 
  } else {
    try {
      // replace contact in matching row
      swWorkers.deleteRow(updateIndex + 1);
      // append new row with data from paylod from getCAById function
      appendNewRow(payload, swWorkers); 
    } catch (err) {
      console.log(err);
      logErrorFunctions('setCAById', payload, updateIndex, err);
    }
  }
}
