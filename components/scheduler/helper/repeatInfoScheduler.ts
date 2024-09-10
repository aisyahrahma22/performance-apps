import {
  SchedulerMonthsEnum,
  SchedulerOptionEnum,
} from '../../../lib/enums/scheduler';
import renderEnum from '../../../lib/util/renderEnum';

export const repeatInformation = (data: any) => {
  const {
    countDay,
    countWeek,
    countMonth,
    countYear,
    days,
    dates,
    monthName,
    repeat,
    time,
  } = data;

  const formattedSelectDate = dates
    ?.map((day: any) => {
      let suffix = 'th';
      if (day === 1 || day === 21 || day === 31) {
        suffix = 'st';
      } else if (day === 2 || day === 22) {
        suffix = 'nd';
      } else if (day === 3 || day === 23) {
        suffix = 'rd';
      }
      return `${day}${suffix}`;
    })
    .join(', ');

  const formattedActiveDays = days
    ?.map((day: any) => renderEnum(day))
    .join(', ');
  let note = '';
  switch (repeat) {
    case SchedulerOptionEnum.DAILY:
      note =
        countDay === 1
          ? `Every day at ${time}`
          : countDay > 1
          ? `Every ${countDay} days at ${time}`
          : '';
      break;
    case SchedulerOptionEnum.WEEKLY:
      note =
        countWeek === 1
          ? `Every week on ${formattedActiveDays} at ${time}`
          : countWeek > 1
          ? `Every ${countWeek} weeks on ${formattedActiveDays} at ${time}`
          : '';
      break;
    case SchedulerOptionEnum.MONTHLY:
      note =
        countMonth === 1
          ? `Every month${
              dates?.length ? ` on ${formattedSelectDate}` : ''
            } at ${time}`
          : countMonth > 1
          ? `Every ${countMonth} months${
              dates?.length ? ` on ${formattedSelectDate}` : ''
            } at ${time}`
          : '';
      break;
    case SchedulerOptionEnum.YEARLY:
      note =
        countYear === 1
          ? `Every year on ${renderMonthName(monthName)} ${
              dates?.length ? `${formattedSelectDate}` : ''
            } at ${time}`
          : countYear > 1
          ? `Every ${countYear} years${
              dates?.length
                ? ` on ${renderMonthName(monthName)} ${formattedSelectDate}`
                : ''
            } at ${time}`
          : '';
      break;
    default:
      break;
  }

  return note;
};

const renderMonthName = (value: any) => {
  if (value === SchedulerMonthsEnum.JANUARY) return 'January';
  if (value === SchedulerMonthsEnum.FEBRUARY) return 'February';
  if (value === SchedulerMonthsEnum.MARCH) return 'March';
  if (value === SchedulerMonthsEnum.APRIL) return 'April';
  if (value === SchedulerMonthsEnum.MAY) return 'May';
  if (value === SchedulerMonthsEnum.JUNE) return 'June';
  if (value === SchedulerMonthsEnum.JULY) return 'July';
  if (value === SchedulerMonthsEnum.AUGUST) return 'August';
  if (value === SchedulerMonthsEnum.SEPTEMBER) return 'September';
  if (value === SchedulerMonthsEnum.OCTOBER) return 'October';
  if (value === SchedulerMonthsEnum.NOVEMBER) return 'November';
  if (value === SchedulerMonthsEnum.DECEMBER) return 'December';
  return value;
};
