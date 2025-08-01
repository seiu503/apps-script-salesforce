function global_createTasksFromFollowUp(followUp, userId, workerId, campaign="jacksonCounty") {
  console.log(`global_createTasksFromFollowUp`);
  // set config
  const config = globalConfig(campaign);
  const ss = SpreadsheetApp.openByUrl(config.sheetURL);
  console.log(`config ss: ${ss.getName()}`);
  const tasks = ss.getSheetByName('Tasks'); 
  console.log(followUp);
  console.log(userId);
  console.log(workerId);
  followUp.map((item) => {
    let id = generateUID(8);
    console.log(id);
    const row = [
      id, // TaskID	
      userId, // UserID	
      workerId, // WorkerID	
      item, // Description	
      new Date() // Date Created
    ]
    console.log(row);
    tasks.appendRow(row)
  });
  
}

function global_createCardFollowUpTask(userId, workerId, campaign="jacksonCounty") {
  console.log(`global_createCardFollowUpTask`);
  // set config
  const config = globalConfig(campaign);
  const ss = SpreadsheetApp.openByUrl(config.sheetURL);
  console.log(`config ss: ${ss.getName()}`);
  const tasks = ss.getSheetByName('Tasks'); 
  const today = new Date();
  console.log(`today: ${today}`);
  const tomorrow = new Date(`${today.getMonth() + 1}/${today.getDate() + 1}/${today.getFullYear()}`);
  console.log(`tomorrow: ${tomorrow}`);
  let id = generateUID(8);
    const row = [
      id, // TaskID	
      userId, // UserID	
      workerId, // WorkerID	-- needs to be APP SHEET ID not CAID
      'Check in about signing card', // Description	
      today, // Date Created
      tomorrow, // Date Due
      `Committed to sign on ${today.toLocaleDateString()}` // notes
    ]
    console.log(row);
    tasks.appendRow(row)
}
