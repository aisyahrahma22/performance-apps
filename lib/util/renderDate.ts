import { format as formatDate } from 'date-fns';

const formatDateString = (dateInput: any, dateFormat = 'dd-MM-yyyy') => {
  if (!dateInput) return '—';
  return formatDate(new Date(dateInput), dateFormat);
};

export default formatDateString;