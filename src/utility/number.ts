export const toFixedNumber = (
  number: number,
  digits: number,
  base = 10) => {
  const pow = Math.pow(base ?? 10, digits);
  return Math.round(number * pow) / pow;
};

const gcd = (a: number, b: number): number => {
  if (b <= 0.0000001) {
    return a;
  } else {
    return gcd(b, a % b);
  }
};

const formatDecimalToFraction = (_decimal: number) => {
  // Prevent imprecision which causes numbers such as,
  // 0.1 to equal 0.10000000000000009
  const decimal = parseFloat(_decimal.toPrecision(8));
  if (Math.abs(Math.abs(decimal) - 0.33) < 0.011) {
    return '1/3';
  } else if (Math.abs(Math.abs(decimal) - 0.66) <= 0.011) {
    return '2/3';
  } else {
    const length = decimal.toString().length - 2;

    let denominator = Math.pow(10, length);
    let numerator = decimal * denominator;
    
    const divisor = gcd(numerator, denominator);
  
    numerator /= divisor;
    denominator /= divisor;
  
    return `${Math.floor(numerator)}/${Math.floor(denominator)}`;
  }
};

const STICKY_THRESHOLD = 0.011;
const STICKY_DECIMALS = [0.25, 0.33, 0.5, 0.66, 0.75];
const MAX_FRACTION_LENGTH = 4; // Permit 1/64 but not 1/100

export const formatNumberToFraction = (number: number) => {
  const sign = number >= 0 ? '+' : '-';

  let decimal = (1 - Math.abs(number % 1)) > STICKY_THRESHOLD
    ? number % 1
    : 0;
  if (decimal !== 0) {
    for (const stickyDecimal of STICKY_DECIMALS) {
      if (Math.abs(Math.abs(decimal) - stickyDecimal) < STICKY_THRESHOLD) {
        decimal = decimal < 0 ? -stickyDecimal : stickyDecimal;
        break;
      }
    }
  }

  let integer = Math.round(Math.abs(number - decimal));
  if (Math.abs(decimal) === 1) {
    decimal = 0;
    integer += 1;
  }

  const fraction = decimal !== 0
    ? formatDecimalToFraction(Math.abs(decimal))
    : '';

  // Ensure fractions aren't too long
  if (!fraction || fraction.length <= MAX_FRACTION_LENGTH) {
    const integerString = integer > 0
      ? fraction ? `${integer} ` : integer
      : fraction ? '' : '0';
    return `${sign}${integerString}${fraction}`;
  } else {
    const decimalFormatted = decimal.toPrecision(2).replace(/^-*0+/, '');
    return `${sign}${integer}${decimalFormatted}`;
  }
};
