const isInt = (str): boolean => {
  return !isNaN(str) && Number.isInteger(parseFloat(str));
};

export { isInt };
