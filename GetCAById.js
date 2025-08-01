// 'a2RRt000000pii9MAA', // my student worker CA in sandbox

async function getCAById(id, env) {
  // console.log(`getCAById.gs > 2, id: ${id}`);
  if (id) {
    const qp = new QueryParameters();
    qp.setSelect(CAfieldsArray.toString());
    qp.setFrom("Higher_Ed_Strike_Pledge__c");
    qp.setWhere(`Id = \'${id}\'`);

    const records = await get(qp, '50', env);
    const url = env === 'prod' ? SW_PROD_SHEET_URL : SW_DEV_SHEET_URL;
    const sheet = SpreadsheetApp.openByUrl(url).getSheetByName('StudentWorkers');
    setCAById(id, records, sheet);
  } else {
    console.log(`getCAById.gs > 17: no Id provided`);
  }
  
}
