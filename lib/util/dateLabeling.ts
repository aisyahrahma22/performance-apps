import { format } from 'date-fns';

const dateLabeling = (endDate: any) => {
  if (!endDate) return '';
  const splitDate = endDate?.split('T')[0];
  const date = format(new Date(splitDate), 'dd-MM-yyyy');
  return date;
};

export default dateLabeling;
