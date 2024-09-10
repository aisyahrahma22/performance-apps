import { isNaN, round } from 'lodash';

export const renderNumber = (
  number: any,
  hyphenOnZero?: boolean,
  isRound?: boolean,
) => {
  if (number == 0 && hyphenOnZero) return '-';
  if (isRound) return round(number, 2);
  if (!number) return 0;
  if (isNaN(number)) return 0;
  if (number === Infinity) return 0;
  number = +number;
  return number?.toLocaleString('in') || 0;
};

export const splitCurrency = (number: any) => {
  if (!number) return 0;
  return number.split('.').join('') || 0;
};
