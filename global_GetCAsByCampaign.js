async function global_getCAsByCampaign(env = 'prod', campaign = 'jacksonCounty') {
  console.log(`global_getCAsByCampaign.gs > 33: env: ${env}`);
  const config = globalConfig(campaign);
  console.log(config.fieldList.toString());

  let records;
    try {
      const qp = new QueryParameters();
      qp.setSelect(config.fieldList.toString());
      qp.setFrom(config.workerObject);
      qp.setWhere(config.qpWhere);

      records = await get(qp, '50', env);
      if (records && records.length) {
        console.log(`${records.length} records returned`);
      } else {
        console.log(`no records returned`);
      }

      global_setCAsSimple(records, workers);
      try {
        removeEmptyRows(workers);
      } catch(err) {
        logErrorFunctions('global_getCAsByCampaign: removeEmptyRows', null, records[0], err);
      }
      return {
        Success: true,
        Error: null
        }       

    } catch (err) {
      logErrorFunctions('global_getCAsByCampaign', null, records[0], err);
      return {
        Success: false,
        Error: err
      }
    }

  
}

async function global_setCAsSimple(payload, sheet) {
  console.log(`global_setCAsSimple`);
  console.log(payload[0]);
  
  console.log('clear'); 
  // clear all existing rows except header row, if there is more than one row in the sheet
  if (sheet.getMaxRows() > 1) {
    try {
    sheet.getRange('A2:W').clearContent(); // sub 'W' for last SF column if # of fields updates
    } catch(err) {
      logErrorFunctions('global_setCAsSimple: DELETE', '', '', err);
    }
  }
  
  console.log('add'); 
  // add all rows from payload
  try {
    appendNewRowsSimple(payload, sheet);
    return;
  } catch (err) {
    logErrorFunctions('global_setCAsSimple: ADD', payload[0], '', err);
  }

}