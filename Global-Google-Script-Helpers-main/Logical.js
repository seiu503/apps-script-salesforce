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
 * If the submitted value is falsy returns an empty string
 *
 * @param {any} input the value to check
 * @return {any} if the input is falsy returns an empty string otherwise returns the input value
 */
const ifFalsyThenEmptyString = (input) => {
  return ifFalsy(input, '', input);
}
Object.defineProperty(this, 'ifFalsyThenEmptyString', {value: ifFalsyThenEmptyString, enumerable : true});