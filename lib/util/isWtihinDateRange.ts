import { isWithinInterval } from 'date-fns';
import { isDate } from 'lodash';

export const isWtihinDateRange = (
  dateToCheck: Date,
  startDate: Date,
  endDate: Date,
): boolean => {
  if (!startDate || !endDate) return false;
  if (!isDate(new Date(startDate)) || !isDate(new Date(endDate))) return false;
  return isWithinInterval(dateToCheck, {
    start: new Date(startDate),
    end: new Date(endDate),
  });
};
