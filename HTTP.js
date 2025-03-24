/**
 * Enum fetch methods.
 *
 * @enum {string}
 */
const METHODS = {
  GET: "get",
  PATCH: "patch",
  POST: "post",
};

// A base class is defined using the new reserved 'class' keyword
class FetchOptions {
  constructor() {
    this.method = METHODS.GET;
    this.apiVersion = 50;
  }

  setMethod(method) {
    this.method = method;

    return this;
  }
  setQueryParameters(queryParameters) {
    this.queryParameters = queryParameters;

    return this;
  }
  setPayload(payload) {
    this.payload = payload;

    return this;
  }
  setSObject(sObject) {
    this.sObject = sObject;

    return this;
  }
  setSObjectId(sObjectId) {
    this.sObjectId = sObjectId;

    return this;
  }
  setApiVersion(apiVersion) {
    this.apiVersion = apiVersion;

    return this;
  }
}

const fetch_ = ({
  batch = false,
  method = METHODS.GET,
  queryParameters = {},
  payload = {},
  sObject = "",
  sObjectId = "",
  apiVersion = 50,
}) => {
  try {
    const endpoint = createEndpoint_({
      batch,
      method,
      sObject,
      sObjectId,
      apiVersion,
      queryParameters,
    });
    const accessTokenResponse = requestAccessToken_();
    const accessToken = accessTokenResponse.access_token;
    const instanceUrl = accessTokenResponse.instance_url;
    const options = getOptions_({ accessToken, method, payload });
    let response = UrlFetchApp.fetch(instanceUrl + endpoint, options);
    console.log(`HTTP.gs > 74`);
    console.log(response);
    let json;

    if (method === METHODS.GET) {
      json = JSON.parse(response.toString());
      console.log(`HTTP.gs > 80`);
      console.log(json);
      let records = json["records"];
      let nextUrl = json["nextRecordsUrl"];
      console.log('HTTP.gs > 84');
      console.log(records);
      while (!!nextUrl) {
        fetchUrl = instanceUrl + nextUrl;
        response = UrlFetchApp.fetch(fetchUrl, options);
        json = JSON.parse(response.toString());
        nextUrl = json["nextRecordsUrl"];

        records = records.concat(json["records"]);
        console.log('HTTP.gs > 93');
        console.log(records);
      }
      console.log('HTTP.gs > 101');
      console.log(records);

      return records;
    } else {
      console.log('HTTP.gs > 113');
      if (Object.keys(response).length > 0) {
        console.log('HTTP.gs > 115');
        json = JSON.parse(response.toString());
        const hasEntries = json.length > 0;
        const hasErrorCode = hasEntries ? !!json[0].errorCode : false;

        if (json.hasErrors || hasErrorCode) {
          console.log("--- error1 --- HTTP.gs > 110");
          console.log(JSON.stringify(json));
        } else console.log(json);

        return json;
      } else {
        console.log("Success!!! HTTP.gs > 127");
      }
    }
  } catch (error) {
    console.log("--- error2 --- HTTP.gs > 131");
    console.log(error);
    logErrorFunctions('fetch_', '', '', error);
  }
};

const createEndpoint_ = ({
  batch,
  method,
  queryParameters,
  sObject,
  sObjectId,
  apiVersion,
}) => {
  let endpoint = URL_BEGINNING + apiVersion + ".0/";

  switch (method) {
    case METHODS.GET:
      query = createSoqlQuery_(queryParameters);
      endpoint += "query?q=" + encodeURIComponent(query);
      break;
    case METHODS.PATCH:
      endpoint +=
        (batch ? "composite/tree/" : "sobjects/") +
        sObject +
        "/" +
        sObjectId +
        ".json";
      break;
    case METHODS.POST:
      endpoint += (batch ? "composite/tree/" : "sobjects/") + sObject + "/";
      break;
    default:
      endpoint += "";
  }

  return endpoint;
};

const getOptions_ = ({
  payload,
  accessToken,
  method,
  contentType = "application/json",
}) => {
  const headers = {
    Authorization: "Bearer " + accessToken,
  };
  const options = {
    method: method,
    contentType: contentType,
    headers: headers,
    muteHttpExceptions: true,
  };

  if (method === METHODS.PATCH || method === METHODS.POST) {
    options.payload = JSON.stringify(payload);
  }

  return options;
};

/**
 * Generates the SOQL query to send to Salesforce
 *
 * @param {object} queryParameters an object specifying query parameters
 *                            must at least specify the SELECT and FROM clauses
 * @return {string} the query string
 */
const createSoqlQuery_ = (queryParameters) => {
  // Specifies the order of clauses
  const clauses = [
    "SELECT",
    "FROM",
    "WHERE",
    "GROUP BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    "HAVING",
  ];
  let query = "";

  for (let clause of clauses) {
    const prop = fromTitleCaseToCamelCase(clause);
    const parameter = queryParameters[prop];

    if (query !== "") clause = " " + clause;
    clause += " ";

    // if a parameter is not included, it is skipped
    query += ifFalsy(parameter, "", clause + parameter);
  }

  return query;
};
