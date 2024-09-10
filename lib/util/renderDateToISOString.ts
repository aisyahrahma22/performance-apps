import { parse } from 'date-fns';

export function dateToISOString(date: string): string {
  if (isIsoDate(date)) return new Date(date).toISOString();
  return parse(date, 'dd-MM-yyyy', new Date()).toISOString();
}

export function isIsoDate(str: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d.toISOString() === str;
}

export function isIsoDateConv(date: any) {
  if (!date) return null;
  const converted_date = date.toISOString().split('T')[0];
  return converted_date;
}
