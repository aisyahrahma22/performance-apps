import { format } from 'date-fns';

const renderDatetime = (date: string, formatString = 'dd-MM-yyyy HH:mm') => {
  if (!date) return '—';
  return format(new Date(date), formatString);
};

export default renderDatetime;
