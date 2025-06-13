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
    qp.setWhere(`ScheduledDate = LAST_N_DAYS:7 AND TotalSent > 1`); 

    const records = await get(qp, '50', 'prod');
    console.log(records[1]);

  // Format output
  const output = records.map(record => {
    return [
      record.Name,
      record.CampaignId || '',
      record.Campaign ? record.Campaign.Name : '',
      record.Subject || '',
      record.ScheduledDate || '',
      record.TotalSent || 0,
      record.TotalDelivered || 0,
      record.UniqueOpens || 0,
      record.UniqueTrackedLinkClicks || 0,
      record.OpenRate || 0,
      record.ClickThroughRate || 0,
      record.ClickToOpenRatio || 0, 
      record.UniqueOptOuts || 0
    ];
  });

  // Write to Sheet
  const pmetricsSheet = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1ILjn1pwFjx0CDBx0HZ6RfF9AgJ4OzEE-0wjJMtsHhFA/edit?gid=0#gid=0',
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
  pardot_metrics.getRange(2, 1, output.length, output[0].length).setValues(output);
}

