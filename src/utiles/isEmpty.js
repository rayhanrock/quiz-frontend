export const isEmpty = (str) => {
  return str === null || str.match(/^ *$/) !== null;
};
