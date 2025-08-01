function SP_createTasksFromFollowUp(followUp, userId, workerId) {
  console.log(`SP_createTasksFromFollowUp`);
  console.log(followUp);
  console.log(userId);
  console.log(workerId);
  const spTasks = spss.getSheetByName('Tasks'); 
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
    spTasks.appendRow(row)

  });
  
}

function SP_createCardFollowUpTask(userId, workerId) {
  const spTasks = spss.getSheetByName('Tasks'); 
  const today = new Date();
  console.log(`today: ${today}`);
  const tomorrow = new Date(`${today.getMonth() + 1}/${today.getDate() + 1}/${today.getFullYear()}`);
  console.log(`tomorrow: ${tomorrow}`);
  let id = generateUID(8);
    const row = [
      id, // TaskID	
      userId, // UserID	
      workerId, // WorkerID	-- needs to be APP SHEET ID not CAID
      'Check in about signing membership', // Description	
      today, // Date Created
      tomorrow, // Date Due
      `Committed to sign on ${today.toLocaleDateString()}` // notes
    ]
    console.log(row);
    spTasks.appendRow(row)
}
