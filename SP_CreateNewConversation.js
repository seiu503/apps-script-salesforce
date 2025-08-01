async function SP_createNewConversation(
  // Campaign_Assessment__c = 'a2RRt000000pii9MAA', 
  // External_Organizer_MLDP__c = '005Rt00000H9KCFIA3',
  // Source__c = 'Tabling',
  // Assessment__c = '2',
  // Notes__c = 'Notes test',
  // Conversation_Result__c = "Card Ask: Signed",
  // Issues__c = ['Pay', 'Respect'],
  // Follow_up__c = ['Set up meeting', 'Other']) {
  Campaign_Assessment__c, 
  External_Organizer_MLDP__c,
  Source__c,
  Assessment__c,
  Notes__c,
  Conversation_Result__c,
  Issues__c,
  Follow_up__c, 
  env = 'prod') {
  console.log(`SP_createNewConversation.gs > 2, env: ${env}`);

  let today = formatSFDate(new Date());
  // const Signed_Card__c = CVRSOS__Result__c.includes('SIGNED');
  // const Refused_Application__c = CVRSOS__Result__c.includes('DECLINED');

  const body = {
    Campaign_Assessment__c, // 'a2RRt000000pii9MAA', // my student worker CA in sandbox 
    External_Organizer_MLDP__c, // '005Rt00000H9KCFIA3', // my ccl user in sandbox -- this is not working??
    Source__c, // "In Person",
    Assessment__c, // "2",
    Notes__c, // "Notes go here"
    Conversation_Result__c, // "Card Ask: Signed"
    Issues__c: arrayToSFMultiSelectPicklist(Issues__c), // "Pay; Respect"
    Follow_up__c: arrayToSFMultiSelectPicklist(Follow_up__c) // "Set up meeting; Other"
  };

  body.Conversation_Date_Time__c = today;

  console.log(`SP_createNewConversation.gs > 18}`);
  console.log(body);

  if (body) {
    try {
      await insert({ 
        sObject: 'External_Conversation__c', 
        payload: { ...body },
        env: 'prod'
        })

      // if conversation is created successfully, pull in updated CA with refreshed data from SF
      try {
        await SP_getCAById(Campaign_Assessment__c, env);
      } catch {
        logErrorFunctions('SP_createNewConversation', {body}, '', err);
        return {
            Success: false,
            Error: `There was an error updating the worker record, please contact the app administrator. ${err}`
          }
      }
      return {
        Success: true,
        Error: null
      }  

    } catch (err) {
      logErrorFunctions('SP_createNewConversation', {body}, '', err);
      return {
        Success: false,
        Error: `There was an error saving the conversation, please contact the app administrator. ${err}`
      }
    }

  } else {
    console.log(`SP_createNewConversation: no body`);
    logErrorFunctions('SP_createNewConversation', {body}, '', err);
    return {
        Success: false,
        Error: `There was an error saving the conversation, please contact the app administrator. No body provided to insert function.`
      }
  }
}
