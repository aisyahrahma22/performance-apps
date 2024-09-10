export enum SuccessionReadynessEnum {
  IMMEDIATE_SUCCESSOR = '< 1 year',
  SECOND_SUCCESSOR = '1 - 3 years',
  THIRD_SUCCESSOR = '3 - 5 years',
}

export enum EmpSuccDashboardTypeEnum {
  POPULATION = 'POPULATION',
  TALENT = 'TALENT',
  TALENT_TURN_OVER = 'TALENT_TURN_OVER',
  IMMEDIATE_SUCCESSOR = 'IMMEDIATE_SUCCESSOR',
  SECOND_SUCCESSOR = 'SECOND_SUCCESSOR',
  THIRD_SUCCESSOR = 'THIRD_SUCCESSOR',
  ALL_SUCCESSOR = 'ALL_SUCCESSOR',
}

export const successionColor = (readiness: any) => {
  switch (readiness) {
    case SuccessionReadynessEnum.IMMEDIATE_SUCCESSOR:
      return '#FE43F5';
    case SuccessionReadynessEnum.SECOND_SUCCESSOR:
      return '#80D0C7';
    case SuccessionReadynessEnum.THIRD_SUCCESSOR:
      return '#8B79F3';
    default:
      return '#00000';
  }
};
