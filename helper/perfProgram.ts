import {
  FinalResultMethodEnum,
  FormMemberEnum,
  FormTermEnum,
} from '../lib/enums/PerformanceEnum';

export const formTermOptionsDropdown = [
  {
    key: FormTermEnum.MID_END_YEAR,
    text: 'Mid Year & End Year',
    value: FormTermEnum.MID_END_YEAR,
  },
  {
    key: FormTermEnum.END_YEAR,
    text: 'End Year',
    value: FormTermEnum.END_YEAR,
  },
];
export const finalResultMethodEnumOptionsDropdown = [
  {
    key: FinalResultMethodEnum.SINGLE,
    text: 'Single',
    value: FinalResultMethodEnum.SINGLE,
  },
  {
    key: FinalResultMethodEnum.MULTIPLE,
    text: 'Multiple',
    value: FinalResultMethodEnum.MULTIPLE,
  },
];
export const formMemberEnumOptionsDropdown = [
  {
    key: FormMemberEnum.EMPLOYEE,
    text: 'Employee',
    value: FormMemberEnum.EMPLOYEE,
  },
  {
    key: FormMemberEnum.POSITION,
    text: 'Position',
    value: FormMemberEnum.POSITION,
  },
];
