import { format } from 'date-fns';
import { dateStringFormat } from '../../components/DatePicker';

export const formatDate = (date: any) =>
  date ? format(new Date(date), dateStringFormat) : '';
