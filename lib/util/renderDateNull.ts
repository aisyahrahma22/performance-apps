import { format } from 'date-fns';

const renderDateNull = (date: string, formatString = 'dd-MM-yyyy') => {
  if (!date) return null;
  return format(new Date(date), formatString);
};

export default renderDateNull;
