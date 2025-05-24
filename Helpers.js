/**
 * Converts camel case string to title case
 *
 * @param {string} string the camel case string to convert to title case
 * @param {boolean} upperCase whether or not final string is all in upper case
 * @return {string} the title case version of the input string
 */
const fromCamelCaseToTitleCase = (string, upperCase) => {
  let titleCase = '';

  for (let s of string) {
    const isUpperCase = s === s.toUpperCase();
    const isFirstLetter = titleCase === '';

    if (isFirstLetter) titleCase += s.toUpperCase();
    else if (isUpperCase) titleCase += ' ' + s.toUpperCase();
    else if (upperCase) titleCase += s.toUpperCase();
    else titleCase += s;
  }

  return titleCase;
}
Object.defineProperty(this, 'fromCamelCaseToTitleCase', {value: fromCamelCaseToTitleCase, enumerable : true});

/**
 * Converts title case string to camel case
 *
 * @param {string} string the title case string to convert to camel case
 * @return {string} the camel case version of the input string
 */
const fromTitleCaseToCamelCase = (string) => {
  let camelCase = '';
  let wasSpace = false;

  for (let s of string) {
    const isSpace = s === ' ';

    if (isSpace) wasSpace = true;
    else {
      camelCase += wasSpace ? s.toUpperCase() : s.toLowerCase();
      wasSpace = false;
    }
  }

  return camelCase;
}
Object.defineProperty(this, 'fromTitleCaseToCamelCase', {value: fromTitleCaseToCamelCase, enumerable : true});



/**
 * If the input value is falsy returns the output value
 *
 * @param {any} input the value to check
 * @param {any} falsyOutput the value to return if the input is falsy
 * @param {any} truthyOutput the value to return if the input is truthy
 * @return {any} if the input is falsy returns the falsyOutput value otherwise returns the truthyOutput value
 */
const ifFalsy = (input, falsyOutput, truthyOutput) => {
  return input ? truthyOutput : falsyOutput;
}
Object.defineProperty(this, 'ifFalsy', {value: ifFalsy, enumerable : true});


/**
 * Generates a JSON Web Token (JWT).
 *
 * @param {object} options an options object with the following properties:
 *                            privateKey the private key to use in the signature 
 *                            expiresInMinutes the duration (in minutes) of the JWT 
 *                            data the payload to embed within the JWT
 * @return {string} the JWT
 */
const createJwt = ({ privateKey, expiresInMinutes, data = {} }) => {
  // Sign token using HMAC with SHA-256 algorithm
  const header = {
    alg: 'RS256'
  };

  const now = Date.now();
  const expires = new Date(now);
  expires.setMinutes(expires.getMinutes() + expiresInMinutes);

  // iat = issued time, exp = expiration time
  const payload = {
    exp: Math.round(expires.getTime() / 1000),
    iat: Math.round(now / 1000),
    ...data
  };

  const base64Encode = (text, json = true) => {
    const data = json ? JSON.stringify(text) : text;
    return Utilities.base64EncodeWebSafe(data).replace(/=+$/, '');
  };
  
  const toSign = `${base64Encode(header)}.${base64Encode(payload)}`;
  const signatureBytes = Utilities.computeRsaSha256Signature(
    toSign,
    privateKey
  );

  const signature = base64Encode(signatureBytes, false);
  return `${toSign}.${signature}`;
};
Object.defineProperty(this, 'createJwt', {value: createJwt, enumerable : true});

/**
 * Parses a JSON Web Token (JWT).
 *
 * @param {string} jsonWebToken the encoded JWT
 * @param {string} privateKey the private key used to encode the original JWT
 * @return {void} the decoded JWT
 */
const parseJwt = (jsonWebToken, privateKey) => {
  const [header, payload, signature] = jsonWebToken.split('.');
  const signatureBytes = Utilities.computeHmacSha256Signature(
    `${header}.${payload}`,
    privateKey
  );
  const validSignature = Utilities.base64EncodeWebSafe(signatureBytes);
  if (signature === validSignature.replace(/=+$/, '')) {
    const blob = Utilities.newBlob(
      Utilities.base64Decode(payload)
    ).getDataAsString();
    const { exp, ...data } = JSON.parse(blob);
    if (new Date(exp * 1000) < new Date()) {
      throw new Error('The token has expired');
    }
    Logger.log(data);
  } else {
    Logger.log('🔴', 'Invalid Signature');
  }
};
Object.defineProperty(this, 'parseJwt', {value: parseJwt, enumerable : true});

/**
 *
 * Format error that is caused by a simple function.
 * @param {string} functionName - Function that throws the error.
 * @param {any} input - Input value of the function.
 * @param {any} output - Output potential of the function if any.
 * @param {any} error - The actual error.
 */
const logErrorFunctions = (functionName, input, output, error) => {
  const currentTimeStamp = new Date();
  const checkError = error ? error : 'Error contains nothing';
  console.log(`Error on ${currentTimeStamp} at ${functionName}, ${error}, ${error.stack}`);
  console.log('Input:');
  console.log(input);
  console.log('Output:');
  console.log(output);
  throw checkError;
  return {Success: false, Error: checkError}
};

/**
 * formats a date for submission to Salesforce.
 *
 * @param {string, object} a date expressed as a string or Date object
 * @return {string} the date converted to a string in format YYYY-MM-DD
 */
formatSFDate = date => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};


function isNullOrEmpty(value) {
  return value === null || value === "";
}

const looseDatesEqual = (first, second) => {
  const date1 = new Date(first);
  const date2 = new Date(second);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
};

function looserEqual(valA, valB) {
  if ((valA == valB) || (isNullOrEmpty(valA) && isNullOrEmpty(valB)) || looseDatesEqual(valA, valB)) {
    return true;
  } else {
    return false;
  }
}

function generateUID(len) {
  const alpha = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < len; i++) {
    id += alpha.charAt(Math.floor(Math.random() * alpha.length));
  }
  return id;
}

function arrayToSFMultiSelectPicklist(array) {
  if (!array || !array.length) {
    return '';
  };
  let outputString = '';
  array.forEach(item => {
    if (outputString === "") {
      outputString = item;
    } else {
      outputString += `; ${item}`;        
    }
  });
  // console.log(`outputString: ${outputString}`);
  return outputString;
}

function isEmpty(obj) {
  for(var i in obj) { return false; }
  return true;
}

function removeNullValues(obj) {
  for (const key in obj) {
    if (obj[key] === null) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeNullValues(obj[key]); // Recursively handle nested objects
    }
  }
  return obj;
}

function isEmptyRow(row){
  for (var columnIndex = 0; columnIndex < row.length; columnIndex++){
    var cell = row[columnIndex];
    if (cell){
      return false;
    }
  }
  return true;
}

function removeEmptyRows(sheet){
  var range = sheet.getDataRange();
  var data = range.getValues();

  for (var rowIndex = data.length - 1; rowIndex >= 0; rowIndex--){
    var row = data[rowIndex];

    if (isEmptyRow(row)){
      sheet.deleteRow(rowIndex + 1);
    }
  }

}