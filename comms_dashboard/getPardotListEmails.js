async function getPardotListEmails() {
  console.log(`getPardotListEmails.gs > 2`);

  const pardotFieldsArray = [
    'Id', 
    'Name', 
    'Subject', 
    'ScheduledDate', 
    'CampaignId',
    'Campaign.Name', 
    'TotalSent',
    'TotalDelivered', 
    'UniqueOpens', 
    'UniqueTrackedLinkClicks',
    'OpenRate',
    'ClickThroughRate',
    'ClickToOpenRatio', 
    'UniqueOptOuts'
  ]

    const qp = new QueryParameters();
    qp.setSelect(pardotFieldsArray.toString());
    qp.setFrom("ListEmail");
    qp.setWhere(`ScheduledDate = LAST_N_DAYS:365 AND TotalSent > 1`); 
    qp.setOrderBy('ScheduledDate DESC NULLS LAST, Id DESC');

    const records = await get(qp, '50', 'prod');


    console.log(`records.length = ${records.length}`);

    const dignityInRecords = records.filter(r => String(r.Name || '').startsWith('Dignity'));
    console.log(`dignity in records = ${dignityInRecords.length}`);



    if (records) {
      console.log(records[1]);

  // Format output
  const output = (records || [])
  .filter(r => {
    const name = String(r.Name || '');
    // keep everything except "Send Email..." and except missing CampaignId (if you still want that rule)
    return !name.startsWith('Send Email')
  })
  .filter(r => r.CampaignId || String(r.Name || '').startsWith('Dignity'))
  .map(record => {
    const name = String(record.Name || '').trim();

    const campaignName =
      name.startsWith('Dignity')
        ? 'Dignity'
        : (record.Campaign && record.Campaign.Name)
            ? record.Campaign.Name
            : 'Unknown Campaign';

    return [
      name,
      record.CampaignId || '',
      campaignName,
      record.Subject || '',
      record.ScheduledDate || '',
      Number(record.TotalSent || 0),
      Number(record.TotalDelivered || 0),
      Number(record.UniqueOpens || 0),
      Number(record.UniqueTrackedLinkClicks || 0),
      Number(record.OpenRate || 0),
      Number(record.ClickThroughRate || 0),
      Number(record.ClickToOpenRatio || 0),
      Number(record.UniqueOptOuts || 0)
    ];
  });


  console.log(`output.length = ${output.length}`);
  const dignityInOutput = output.filter(row => String(row[0] || '').startsWith('Dignity'));
  console.log(`dignity in output = ${dignityInOutput.length}`);
  if (dignityInOutput.length) console.log(`first dignity output row = ${JSON.stringify(dignityInOutput[0])}`);



  // Write to Sheet
  const pmetricsSheet = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1NnkJWfuLOvACvMuxyJbKgF-Pz0NHgy6dp-QmTSI5lRg/edit?gid=0#gid=0', // owned by seiu503@gmail.com
  );
  const pardot_metrics = pmetricsSheet.getSheetByName('pardot_metrics'); 
  pardot_metrics.clearContents();
  pardot_metrics.appendRow([
    'List Email Name', 
    'Campaign ID', 
    'Campaign Name', 
    'Subject', 
    'Scheduled Date',
    'Total Sent',
    'Total Delivered', 
    'Unique Opens', 
    'Unique Clicks',
    'Open Rate', 
    'Click-Through Rate',
    'Click to Open Ratio',
    'Unique Opt Outs'
  ]);

  try {
    pardot_metrics.getRange(2, 1, output.length, output[0].length).setValues(output);
    SpreadsheetApp.flush();  
    console.log('setValues succeeded');
  } catch (e) {
    console.error('setValues FAILED:', e);
    console.log(`output.length=${output.length}, cols=${output[0]?.length}`);
    console.log(`Example row: ${JSON.stringify(output[0])}`);
    throw e;
  }

  console.log(`Sheet last row after write: ${pardot_metrics.getLastRow()}`);
  console.log(`Expected last row: ${output.length + 1}`);

  // Prove that "Dignity" exists in the sheet after the write
  const found = pardot_metrics.createTextFinder('Dignity')
    .matchCase(false)
    .findNext();

  console.log(`Finder result: ${found ? `FOUND at row ${found.getRow()}, col ${found.getColumn()}` : 'NOT FOUND'}`);


    } else {
      logErrorFunctions('getPardotListEmails', null, null, 'No records returned');
    }
    
}

