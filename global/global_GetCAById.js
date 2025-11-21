// 'a2RRt000000pii9MAA', // my student worker CA in sandbox
// 'a2RRf000000cdunMAA', // my test jackson county CA in prod

async function global_getCAById(id, env, campaign) {
  console.log(`global_getCAById.gs > 5, id: ${id}`);

  // set config
  const config = globalConfig(campaign);
  const ss = SpreadsheetApp.openByUrl(config.sheetURL);
  console.log(`config ss: ${ss.getName()}`);
  const workers = ss.getSheetByName(config.workerSheetName); 

  if (id) {
    const qp = new QueryParameters();
    qp.setSelect(config.fieldList.toString());
    qp.setFrom("Higher_Ed_Strike_Pledge__c");
    qp.setWhere(`Id = \'${id}\'`);

    const records = await get(qp, '50', env);
    setCAById(id, records, ss); // this function is sheet-agnostic, campaign-agnostic, but it assumes that Id is in the first column
  } else {
    console.log(`SP_getCAById.gs > 17: no Id provided`);
  }
  
}

async function setCAById(id, payload, sheet) {
  console.log('setCAById');
  console.log(id);
  const allData = sheet.getDataRange().getValues();
  const matchingCAId = (row) => row[0] === id;
  const updateIndex = allData.findIndex(matchingCAId);
  // console.log(`updateIndex: ${updateIndex}`);
  if (!updateIndex || updateIndex < 0) {
    // just add the new contact
    await appendNewRow(payload, sheet); 
  } else {
    try {
      // replace contact in matching row
      sheet.deleteRow(updateIndex + 1);
      // append new row with data from paylod from getCAById function
      appendNewRow(payload, sheet); 
    } catch (err) {
      console.log(err);
      logErrorFunctions('setCAById', payload, updateIndex, err);
    }
  }
}