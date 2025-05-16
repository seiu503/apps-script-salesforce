const insert = ({ sObject, payload, apiVersion, env }) => {
  console.log(`Insert.gs > 2`);
  console.log(sObject);
  console.log(payload);
  return fetch_({ method: METHODS.POST, payload, sObject, apiVersion, env });
}
Object.defineProperty(this, 'insert', {value: insert, enumerable : true});

const batchInsert = ({ sObject, payload, apiVersion, env }) => {
  return fetch_({ batch: true, method: METHODS.POST, payload, sObject, apiVersion, env });
}
Object.defineProperty(this, 'batchInsert', {value: batchInsert, enumerable : true});