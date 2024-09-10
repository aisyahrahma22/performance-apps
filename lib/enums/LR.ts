export enum LRApprovalStatusEnum {
  REQUESTED = 'REQUESTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  NO_APPROVAL = 'NO_APPROVAL',
  PASSED = 'PASSED',
}

export enum LREALWorkflowTypeEnum {
  LREAL_WORKFLOW_APPROVER = 'LREAL_WORKFLOW_APPROVER',
  LREAL_WORKFLOW_READER = 'LREAL_WORKFLOW_READER',
  LREAL_WORKFLOW_CHECKER = 'LREAL_WORKFLOW_CHECKER',
}
