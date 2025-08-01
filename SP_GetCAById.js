// 'a2RRt000000pii9MAA', // my student worker CA in sandbox

async function SP_getCAById(id, env='prod') {
  // console.log(`getCAById.gs > 2, id: ${id}`);
  if (id) {
    const qp = new QueryParameters();
    qp.setSelect(SP_CAfieldsArray.toString());
    qp.setFrom("Higher_Ed_Strike_Pledge__c");
    qp.setWhere(`Id = \'${id}\'`);

    const records = await get(qp, '50', env);
    setCAById(id, records, spss); // this function is sheet-agnostic, campaign-agnostic
  } else {
    console.log(`SP_getCAById.gs > 17: no Id provided`);
  }
  
}
