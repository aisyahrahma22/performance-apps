export enum EmpStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const empStatusList = [
  {
    key: EmpStatusEnum.ACTIVE,
    text: 'Active',
    value: EmpStatusEnum.ACTIVE,
  },
  {
    key: EmpStatusEnum.INACTIVE,
    text: 'Inactive',
    value: EmpStatusEnum.INACTIVE,
  },
];
