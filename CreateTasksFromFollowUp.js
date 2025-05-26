function createTasksFromFollowUp(followUp = [ 'Set up meeting', 'Invite to Info Meeting', 'Other' ], userId = 'schneiders@seiu503.org', workerId = 'a2RRf000000Fya9MAC') {
  console.log(`createTasksFromFollowUp`);
  console.log(followUp);
  console.log(userId);
  console.log(workerId);
  const swTasks = swss.getSheetByName('Tasks'); 
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
    swTasks.appendRow(row)

  });
  
}

function createCardFollowUpTask(userId = 'schneiders@seiu503.org', workerId = 'b0180cf0') {
  const swTasks = swss.getSheetByName('Tasks'); 
  const today = new Date();
  console.log(`today: ${today}`);
  const tomorrow = new Date(`${today.getMonth() + 1}/${today.getDate() + 1}/${today.getFullYear()}`);
  console.log(`tomorrow: ${tomorrow}`);
  let id = generateUID(8);
    const row = [
      id, // TaskID	
      userId, // UserID	
      workerId, // WorkerID	
      'Check in about signing card', // Description	
      today, // Date Created
      tomorrow, // Date Due
      `Committed to sign on ${today.toLocaleDateString()}` // notes
    ]
    console.log(row);
    swTasks.appendRow(row)
}
