import { parse } from 'date-fns';
import { dateStringTimeFormat, isIsoDate } from '../../components/DatePicker';

const convertDateTimeFormat = (date: any) => {
  if (isIsoDate(date)) {
    return date;
  } else {
    return parse(date, dateStringTimeFormat, new Date());
  }
};

export default convertDateTimeFormat;
