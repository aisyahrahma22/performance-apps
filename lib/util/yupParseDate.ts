import { isDate, parse } from 'date-fns';

const yupParseDate =
  (format = 'yyyy-MM-dd') =>
  (_: any, originalValue: any) => {
    return isDate(originalValue)
      ? originalValue
      : parse(originalValue, format, new Date());
  };

export default yupParseDate;
