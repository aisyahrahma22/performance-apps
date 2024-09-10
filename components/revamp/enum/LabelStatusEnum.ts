export type LabelStatusEnum =
  | 'Requested'
  | 'Verified'
  | 'Rejected'
  | 'Approved'
  | 'In Progress'
  | 'Draft'
  | 'Revision'
  | 'REQUESTED'
  | 'REJECTED'
  | 'VERIFIED'
  | 'APPROVED'
  | 'DONE';

export enum ColorStatusEnum {
  Approved = 'rvstatus color-success',
  Requested = 'rvstatus color-requested',
  Rejected = 'rvstatus color-rejected',
  Verified = 'rvstatus color-verified',
  InProgress = 'rvstatus color-in-progress',
  Draft = 'rvstatus color-draft',
}
