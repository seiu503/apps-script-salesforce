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
