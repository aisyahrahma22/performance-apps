import {
  SchedulerDaysEnum,
  SchedulerMonthsEnum,
  SchedulerOptionEnum,
} from '../../../enums/scheduler';

export const repeatationList = [
  {
    key: SchedulerOptionEnum.DAILY,
    text: 'Daily',
    value: SchedulerOptionEnum.DAILY,
  },
  {
    key: SchedulerOptionEnum.WEEKLY,
    text: 'Weekly',
    value: SchedulerOptionEnum.WEEKLY,
  },
  {
    key: SchedulerOptionEnum.MONTHLY,
    text: 'Monthly',
    value: SchedulerOptionEnum.MONTHLY,
  },
  {
    key: SchedulerOptionEnum.YEARLY,
    text: 'Yearly',
    value: SchedulerOptionEnum.YEARLY,
  },
];

export const monthList = [
  {
    key: SchedulerMonthsEnum.JANUARY,
    text: 'Jan',
    value: SchedulerMonthsEnum.JANUARY,
  },
  {
    key: SchedulerMonthsEnum.FEBRUARY,
    text: 'Feb',
    value: SchedulerMonthsEnum.FEBRUARY,
  },
  {
    key: SchedulerMonthsEnum.MARCH,
    text: 'Mar',
    value: SchedulerMonthsEnum.MARCH,
  },
  {
    key: SchedulerMonthsEnum.APRIL,
    text: 'Apr',
    value: SchedulerMonthsEnum.APRIL,
  },
  {
    key: SchedulerMonthsEnum.MAY,
    text: 'May',
    value: SchedulerMonthsEnum.MAY,
  },
  {
    key: SchedulerMonthsEnum.JUNE,
    text: 'Jun',
    value: SchedulerMonthsEnum.JUNE,
  },
  {
    key: SchedulerMonthsEnum.JULY,
    text: 'Jul',
    value: SchedulerMonthsEnum.JULY,
  },
  {
    key: SchedulerMonthsEnum.AUGUST,
    text: 'Aug',
    value: SchedulerMonthsEnum.AUGUST,
  },
  {
    key: SchedulerMonthsEnum.SEPTEMBER,
    text: 'Sep',
    value: SchedulerMonthsEnum.SEPTEMBER,
  },
  {
    key: SchedulerMonthsEnum.OCTOBER,
    text: 'Oct',
    value: SchedulerMonthsEnum.OCTOBER,
  },
  {
    key: SchedulerMonthsEnum.NOVEMBER,
    text: 'Nov',
    value: SchedulerMonthsEnum.NOVEMBER,
  },
  {
    key: SchedulerMonthsEnum.DECEMBER,
    text: 'Dec',
    value: SchedulerMonthsEnum.DECEMBER,
  },
];

export const dayScheduler = [
  { day: SchedulerDaysEnum.SUNDAY, label: 'Sun' },
  { day: SchedulerDaysEnum.MONDAY, label: 'Mon' },
  { day: SchedulerDaysEnum.TUESDAY, label: 'Tue' },
  { day: SchedulerDaysEnum.WEDNESDAY, label: 'Wed' },
  { day: SchedulerDaysEnum.THURSDAY, label: 'Thu' },
  { day: SchedulerDaysEnum.FRIDAY, label: 'Fri' },
  { day: SchedulerDaysEnum.SATURDAY, label: 'Sat' },
];
