export enum LBEApprovalStatusEnum {
  REQUESTED = 'REQUESTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  NO_APPROVAL = 'NO_APPROVAL',
  PASSED = 'PASSED',
}

export enum LBEWorkflowTypeEnum {
  LBE_WORKFLOW_APPROVER = 'LBE_WORKFLOW_APPROVER',
  LBE_WORKFLOW_READER = 'LBE_WORKFLOW_READER',
  LBE_WORKFLOW_CHECKER = 'LBE_WORKFLOW_CHECKER',
}
