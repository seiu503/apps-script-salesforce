const globalConfig = (campaign, turf) => {
  const configGlobal = {
    fieldList: {
      studentWorkers: [
        'Id', 
        'First_name_from_form__c', 
        'Preferred_Name_from_Form__c',
        'Last_Name_from_form__c',
        'Pronouns__c',
        'Email_from_form__c', 
        'AGENCY_from_form__c', 
        'Department__c',
        'Job_Title__c', 
        'Willing_to_Help__c', 
        'Preferred_Language_from_form__c', 
        'Phone_from_form__c', 
        'Signed_Auth_Card__c', 
        'Auth_Card_Date__c',
        'Address__c',
        'City__c',
        'State__c',
        'ZIP__c',
        'Department_Lookup__c',
        'Student_Clubs__c',
        'Student_Major__c',
        'Relationships__c',
        'Potential_Leader__c',
        'In_Unit__c',
        'AppSheet_ID__c',
        'AppSheet_Department__c',
        'Auth_Card_Date_Time__c',
        'CreatedBy_AppSheetUser__c'
      ],
      sapphireCC: [
        'Id', 
        'First_name_from_form__c', 
        'Preferred_Name_from_Form__c',
        'Last_Name_from_form__c',
        'Pronouns__c',
        'Email_from_form__c', 
        'AGENCY_from_form__c', 
        'Job_Title__c', 
        'Preferred_Language_from_form__c', 
        'Phone_from_form__c', 
        'Address__c',
        'City__c',
        'State__c',
        'ZIP__c',
        'Potential_Leader__c',
        'In_Unit__c',
        'AppSheet_ID__c',
        'Signed_Membership_Form__c',	
        'Member_Form_Signed_Date_Time__c',
        'Bargaining_Survey_Complete__c',
        'Bargaining_Survey_Completed_DATE__c',
        'Sticker_Up_Participation__c',
        'Bargaining_Team__c'
      ],
      jacksonCounty: [
        'Id',
        'First_name_from_form__c',
        'Preferred_Name_from_Form__c',
        'Last_Name_from_form__c',
        'Pronouns__c',
        'Email_from_form__c',
        'AGENCY_from_form__c',
        'Job_Title__c',
        'Preferred_Language_from_form__c',
        'Phone_from_form__c',
        'Address__c',
        'City__c',
        'State__c',	
        'ZIP__c',
        'Potential_Leader__c',
        'In_Unit__c',
        'AppSheet_ID__c',
        'Signed_Auth_Card__c',
        'Auth_Card_Date__c'
      ],
      memberLeader: [
        'Id', 
        'Salutation_Last__c', 
        'Email', 
        'Employer_Name_Text__c', 
        'Title', 
        'Preferred_Language__c', 
        'Best_Phone__c', 
        'Binary_Membership__c', 
        'Salutation_Name__c', 
        'Pre_Fill_Member_Form_Link__c', 	
        'Current_Member_Status__c'
      ]
    },
    workerObject: {
      studentWorkers: 'Higher_Ed_Strike_Pledge__c',
      sapphireCC: 'Higher_Ed_Strike_Pledge__c',
      jacksonCounty: 'Higher_Ed_Strike_Pledge__c',
      memberLeader: 'Contact'
    },
    qpWhere: {
      studentWorkers: `Campaign_Name_Picklist__c = 'Student Workers'`,
      sapphireCC: `Campaign_Name_Picklist__c = 'Sapphire'`,
      jacksonCounty: `Campaign_Name_Picklist__c = 'Jackson County Libraries'`,
      memberLeader: `Employer_Name_Text__c = \'${turf}\' AND Active_Worker__c = TRUE`
    },
    campaignPicklist: {
      studentWorkers: 'Sapphire',
      sapphireCC: 'Student Workers',
      jacksonCounty: 'Jackson County Libraries',
    },
    sheetURL: {
      studentWorkers: 'https://docs.google.com/spreadsheets/d/14a5ZRXFbAl69VQ98aJ1lCnWLcfh3mhZrKpsxAT01btA/edit',
      sapphireCC: 'https://docs.google.com/spreadsheets/d/1JktJuDesKyZMW6gcM2wRNzIs-BAfobNcC6DuvYg_itM/edit',
      jacksonCounty: 'https://docs.google.com/spreadsheets/d/1M5ceAgQIXuM19Nq-WHBJAoZu8dkOWJevto8dbL9Gglk/edit',
      memberLeader: 'https://docs.google.com/spreadsheets/d/11pYOEoAtTtxH_5y6uxzVuhUis6DvZxFJoazHnuMD4R4/edit'
    },
    workerSheetName: {
      studentWorkers: 'StudentWorkers',
      sapphireCC: 'Workers',
      jacksonCounty: 'Workers',
      memberLeader: 'MemberChartingApp'
    },
    // CAIDColumn: {
    //   studentWorkers: 'A2:A',
    //   sapphireCC: 'A2:A',
    //   jacksonCounty: 'A2:A',
    //   memberLeader: ''
    // },
    appSheetIdColumn: {
      studentWorkers: '',
      sapphireCC: 'Q2:Q',
      jacksonCounty: 'Q2:Q',
      memberLeader: ''
    },  
    lastSFColumn: {
      studentWorkers: 'AB',
      sapphireCC: 'W',
      jacksonCounty: 'U'
    },
    sheetShortVar: {
      studentWorkers: 'swss',
      sapphireCC: 'spss',
      jacksonCounty: 'jcss'
    },
    env: {
      studentWorkers: 'prod',
      sapphireCC: 'prod',
      jacksonCounty: 'prod'
    }
  }

  return {
    fieldList: configGlobal.fieldList[campaign],
    workerObject: configGlobal.workerObject[campaign],
    qpWhere: configGlobal.qpWhere[campaign],
    campaignPicklist: configGlobal.campaignPicklist[campaign],
    sheetURL: configGlobal.sheetURL[campaign],
    workerSheetName: configGlobal.workerSheetName[campaign],
    appSheetIdColumn: configGlobal.appSheetIdColumn[campaign],
    lastSFColumn: configGlobal.lastSFColumn[campaign],
    sheetShortVar: configGlobal.sheetShortVar[campaign],
    env: configGlobal.env[campaign]
  };
  
}

const config = globalConfig(campaign = 'jacksonCounty');
const ss = SpreadsheetApp.openByUrl(config.sheetURL);
console.log(`config ss: ${ss.getName()}`);
const workers = ss.getSheetByName(config.workerSheetName); 
const users = ss.getSheetByName('Users');
let globalCAIds = workers.getRange("A2:A").getValues().flat().filter(Boolean);
// console.log('globalCAIds');
// console.log(globalCAIds);

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


function appendNewRowsSimple(data, sheet) {
  const values = data.reduce((ar, obj) => {
      ar.push(Object.values(obj).slice(1));
      return ar;
    }, []);

  if (values && values.length) {

   const last = sheet.getLastRow();
   console.log(`last: ${last}`);
   console.log(`sheet.getMaxRows(): ${sheet.getMaxRows()}`);
   if (last === sheet.getMaxRows()) {
    console.log('last === sheet.getMaxRows');
    console.log('inserting row after last');
    sheet.insertRowAfter(last);
   }
   sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
    } else {
      logErrorFunctions('appendNewRowsSimple', [data[0], sheet], '', 'No data passed to appendNewRowsSimple');
    }
}