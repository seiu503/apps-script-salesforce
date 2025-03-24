const daysBetweenDates = (fromDate, toDate) => {
  // To calculate the time difference of two dates 
  const Difference_In_Time = toDate.getTime() - fromDate.getTime();

  // To calculate the no. of days between two dates 
  return Math.round(Difference_In_Time / (1000 * 3600 * 24));
}
Object.defineProperty(this, 'daysBetweenDates', { value: daysBetweenDates, enumerable: true });

const endOfMonth = (date) => {
  const copiedDate = new Date(date.getTime());

  return new Date(copiedDate.getFullYear(), copiedDate.getMonth() + 1, 0)
}
Object.defineProperty(this, 'endOfMonth', { value: endOfMonth, enumerable: true });

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
}
Object.defineProperty(this, 'addDays', { value: addDays, enumerable: true });

const dateToString = (date, delimiter = '-') => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return year + delimiter + leftPadString(month) + delimiter + leftPadString(day);
}
Object.defineProperty(this, 'dateToString', { value: dateToString, enumerable: true });