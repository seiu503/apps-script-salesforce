const userIds = users.getRange("A2:A").getValues().flat().filter(Boolean);

async function getUserByEmail(email, env) {
  const url = env === 'prod' ? SW_PROD_SHEET_URL : SW_DEV_SHEET_URL;
  const userSheet = SpreadsheetApp.openByUrl(url).getSheetByName('Users');
  console.log(`getUserByEmail.gs > 2, email: ${email}, env: ${env}`);
  if (email) {
    const qp = new QueryParameters();
    qp.setSelect("Id, ContactId, Salutation_Last__c, Salutation_Name__c, Email, AppSheetTurf__c");
    qp.setFrom("User");
    // qp.setWhere(`Email = \'${email}\' AND profileID__c = '00eRf000009g4rd'`); // customer community login SEIU 503 -- may need to change for production
    qp.setWhere(`Email = \'${email}\'`); 
    try {
      const records = get(qp, '50', env);
      console.log('getUser payload:');
      console.log(records);
      await setUser(records, userSheet);
      return{
        Turf: records[0].AppSheetTurf__c,
        Success: true,
        Error: null
      }
    } catch (err) {
      console.log(err);
      logErrorFunctions('getUserByEmail', email, records, err);
      return {
        Turf: null,
        Success: false,
        Error: `There was an error loading your user account, please contact the app administrator. ${err}`
      }
    }
    
  } else {
    console.log(`test.gs > 21: no email provided`);
    return {
      Turf: null,
      Success: false,
      Error: "There was an error loading your user account, please contact the app administrator. No email provided to getUserByEmail function."
    }
  }
  
}

async function appendNewRow(obj, sheet) { // expects a single object
    try {
      console.log('appendNewRow > 23');
      console.log(obj[0]);
      console.log(Object.values(obj[0]));
      const row = Object.values(obj[0]).slice(1);
      sheet.appendRow(row)
    } catch (err) {
      console.log(err);
      logErrorFunctions('appendNewRow', [obj, sheet], '', err);
    }
}

async function setUser(payload, sheet) {
  console.log('setUser > 33');

  // Check for matching rows -- has this user been pulled before?
  const allData = sheet.getDataRange().getValues();
  let userRowIndex;
  const user = allData.filter((row,index) => {
    // console.log('setUser > 39');
    // console.log(row[4]);
    // console.log('setUser > 41');
    // console.log(payload[0]);
    if(row[4] === payload[0].Email) {
      userRowIndex=index+1;
      return row;
    }
  })
  console.log(`setUser > 48`);
  console.log(user); // array? or 2D array?
  console.log(userRowIndex);

  
  // If no existing row found, create a new row for the user returned from the API call
  if (!user || !user.length || !userRowIndex) {
    // append new row with data from paylod from getUserByEmail function
    console.log(`setUser > 44: no matching user found, appending new data`);
    try {
      await appendNewRow(payload, sheet);    
    } catch (err) {
      console.log(err);
      logErrorFunctions('setUser', payload, userRowIndex, err);
    }
  } else {
    // otherwise, delete existing user and replace it with fresh data from Salesforce
    console.log(`setUser > 34: found matching user, deleting and replacing with this payload`);
    console.log(payload);
    try {
      sheet.deleteRow(userRowIndex);
      // append new rows with data from paylod from getUser function
      await appendNewRow(payload, sheet); 
    } catch (err) {
      console.log(err);
      logErrorFunctions('setUser', payload, userRowIndex, err);
    }
  }
}