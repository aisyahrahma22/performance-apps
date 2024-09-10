import { formatDistanceStrict } from 'date-fns';

export const calculateDistanceStrict = (date: string) => {
  const today = new Date();
  const calcDate = new Date(date);
  return formatDistanceStrict(calcDate, today, { roundingMethod: 'floor' });
};
