const update = ({ sObject, sObjectId, payload, apiVersion, env }) => {
  return fetch_({ method: METHODS.PATCH, payload, sObject, sObjectId, apiVersion, env });
}
Object.defineProperty(this, 'update', {value: update, enumerable : true});

const batchUpdate = ({ sObject, sObjectId, payload, apiVersion, env }) => {
  return fetch_({ batch: true, method: METHODS.PATCH, payload, sObject, sObjectId, apiVersion, env });
}
Object.defineProperty(this, 'batchUpdate', {value: batchUpdate, enumerable : true});

updateApplication = (applicationId, payload, apiVersion = 50, env) => {
  return update({ sObject: 'Opportunity', sObjectId: applicationId, payload: payload, apiVersion: apiVersion, env });
}