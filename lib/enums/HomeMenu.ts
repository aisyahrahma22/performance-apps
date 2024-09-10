export enum HomeMenuEnum {
  IDP_APPROVAL = '/idp/approver',
  IDP_VERIFICATION = '/idp/verificator',
  CA_APPROVAL = '/competency-assessment/approval',
  CA_VERIFICATION = '/competency-assessment/verification',
  LEARNING_EVAL_APPROVAL = '/learning/evaluation',
  LEARNING_BUDGET_APPROVAL = '/learning-management/learning-budget',
  LEARNING_REQUEST_APPROVAL = '/learning-management/learning-request-approval',
  LEARNING_REALIZATION_APPROVAL = '/learning/realization',
  GOAL_SETTING_APPROVAL = '/performance/goal-setting-approval',
  MID_YEAR_APPROVAL = '/performance/mid-year-approval',
  END_YEAR_APPROVAL = '/performance/end-year-approval',
}

export const thirdPartyLoginMenu = (menu: any) => {
  switch (menu) {
    case 'IDP_APPROVAL':
      return HomeMenuEnum.IDP_APPROVAL;
    case 'IDP_VERIFICATION':
      return HomeMenuEnum.IDP_VERIFICATION;
    case 'CA_APPROVAL':
      return HomeMenuEnum.CA_APPROVAL;
    case 'CA_VERIFICATION':
      return HomeMenuEnum.CA_VERIFICATION;
    case 'LEARNING_EVAL_APPROVAL':
      return HomeMenuEnum.LEARNING_EVAL_APPROVAL;
    case 'LEARNING_BUDGET_APPROVAL':
      return HomeMenuEnum.LEARNING_BUDGET_APPROVAL;
    case 'LEARNING_REQUEST_APPROVAL':
      return HomeMenuEnum.LEARNING_REQUEST_APPROVAL;
    case 'LEARNING_REALIZATION_APPROVAL':
      return HomeMenuEnum.LEARNING_REALIZATION_APPROVAL;
    case 'GOAL_SETTING_APPROVAL':
      return HomeMenuEnum.GOAL_SETTING_APPROVAL;
    case 'MID_YEAR_APPROVAL':
      return HomeMenuEnum.MID_YEAR_APPROVAL;
    case 'END_YEAR_APPROVAL':
      return HomeMenuEnum.END_YEAR_APPROVAL;
    default:
      return '/home';
  }
};
