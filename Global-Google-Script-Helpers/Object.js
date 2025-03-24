const isPlainObject = (input) => {
return !!input && !Array.isArray(input) && typeof input === 'object';
}