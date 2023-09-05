export const toFixedNumber = (
  number: number,
  digits: number,
  base = 10) => {
  const pow = Math.pow(base ?? 10, digits);
  return Math.round(number * pow) / pow;
};
