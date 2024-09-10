export const catalogOption = [
  {
    key: 'catalog',
    text: 'Catalog',
    value: 'Catalog',
  },
  {
    key: 'noncatalog',
    text: 'Non-Catalog',
    value: 'Non-Catalog',
  },
  {
    key: 'empty',
    text: '',
    value: undefined,
  },
];

export const organizerTypeOption = [
  {
    key: 'INTERNAL',
    text: 'INTERNAL',
    value: 'INTERNAL',
  },
  {
    key: 'EXTERNAL',
    text: 'EXTERNAL',
    value: 'EXTERNAL',
  },
  {
    key: 'empty',
    text: '',
    value: undefined,
  },
];

export enum LearningUnitEnum {
  SECONDS = 's',
  MINUTES = 'M',
  HOURS = 'h',
  DAYS = 'd',
  WEEKS = 'w',
  MONTHS = 'm',
  YEARS = 'y',
}

export const optionsInput = [
  { key: 'seconds', text: 'Seconds', value: LearningUnitEnum.SECONDS },
  { key: 'minutes', text: 'Minutes', value: LearningUnitEnum.MINUTES },
  { key: 'hours', text: 'Hours', value: LearningUnitEnum.HOURS },
  { key: 'days', text: 'Days', value: LearningUnitEnum.DAYS },
  { key: 'weeks', text: 'Weeks', value: LearningUnitEnum.WEEKS },
  { key: 'months', text: 'Months', value: LearningUnitEnum.MONTHS },
  { key: 'years', text: 'Years', value: LearningUnitEnum.YEARS },
];

export const optionsReminderInput = [
  { key: 'days', text: 'Days', value: LearningUnitEnum.DAYS },
  { key: 'weeks', text: 'Weeks', value: LearningUnitEnum.WEEKS },
  { key: 'months', text: 'Months', value: LearningUnitEnum.MONTHS },
  { key: 'years', text: 'Years', value: LearningUnitEnum.YEARS },
];

export enum CatalogEnum {
  CATALOG = 'Catalog',
  NON_CATALOG = 'Non-Catalog',
}
