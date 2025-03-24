const arrayToObject = (keys, values) => {

  return keys.reduce((prev, curr, ix) => {
    const val = values[ix];

    if (!prev[curr]) prev[curr] = val;

    return prev;
  }, {});
  
}
Object.defineProperty(this, 'arrayToObject', {value: arrayToObject, enumerable : true});

const arraysToObjects = (keys, values) => {
  return values.reduce((prev, curr) => {
      const obj = arrayToObject(keys, curr);

      prev.push(obj);
      return prev;
    }, []);
}
Object.defineProperty(this, 'arraysToObjects', {value: arraysToObjects, enumerable : true});
