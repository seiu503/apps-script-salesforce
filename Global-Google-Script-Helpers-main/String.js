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

const leftPadString = (string, desiredLength = 2, substringForPadding = '0') => {
  let padding = '';

  for (let i = 0; i < desiredLength; i++) {
    padding += substringForPadding;
  }

  string = padding + string;

  return string.slice(-2);
}
Object.defineProperty(this, 'leftPadString', {value: leftPadString, enumerable : true});