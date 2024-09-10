export enum IDPRequestStatusEnum {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  VERIFIED = 'VERIFIED',
  DONE = 'DONE',
  REJECTED = 'REJECTED',
}

export enum IDPApprovalStatusEnum {
  REQUESTED = 'REQUESTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  NO_APPROVAL = 'NO_APPROVAL',
  PASSED = 'PASSED',
}

export enum IDPWorkflowTypeEnum {
  IDP_WORKFLOW_APPROVER = 'IDP_WORKFLOW_APPROVER',
  IDP_WORKFLOW_READER = 'IDP_WORKFLOW_READER',
  IDP_WORKFLOW_CHECKER = 'IDP_WORKFLOW_CHECKER',
}

export enum IDPItemTypeCodeEnum {
  STRENGTH = 'STRENGTH',
  AREA_TO_FOCUS = 'AREA_TO_FOCUS',
}

export const idpRequestColor = (idp: any) => {
  switch (idp) {
    case IDPRequestStatusEnum.DRAFT:
      return 'blue';
    case IDPRequestStatusEnum.REQUESTED:
      return 'purple';
    case IDPRequestStatusEnum.REJECTED:
      return 'red';
    case IDPRequestStatusEnum.APPROVED:
      return 'green';
    case IDPRequestStatusEnum.VERIFIED:
      return 'green';
    case IDPRequestStatusEnum.DONE:
      return 'green';
    case IDPRequestStatusEnum.IN_PROGRESS:
      return 'blue';
    default:
      return '#00000';
  }
};
