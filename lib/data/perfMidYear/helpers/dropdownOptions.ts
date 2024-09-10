import { Options } from '../../../../components/InputDropdownRemoteMultiple';
import { PerfEmployeeStatusEnum } from '../../../enums/GoalSetting';
import {
  PerfSuperiorStatusEnum,
  timelineEnum,
} from '../../../enums/PerformanceEnum';

export const perfSuperiorStatusOptions: Options[] = [
  {
    key: PerfSuperiorStatusEnum.PENDING,
    value: PerfSuperiorStatusEnum.PENDING,
    text: 'Pending',
  },
  {
    key: PerfSuperiorStatusEnum.REQUESTED,
    value: PerfSuperiorStatusEnum.REQUESTED,
    text: 'Requested',
  },
  {
    key: PerfSuperiorStatusEnum.DRAFT,
    value: PerfSuperiorStatusEnum.DRAFT,
    text: 'Draft',
  },
  {
    key: PerfSuperiorStatusEnum.APPROVED,
    value: PerfSuperiorStatusEnum.APPROVED,
    text: 'Approved',
  },
  {
    key: PerfSuperiorStatusEnum.COMPLETED,
    value: PerfSuperiorStatusEnum.COMPLETED,
    text: 'Completed',
  },
  {
    key: PerfSuperiorStatusEnum.REVISED,
    value: PerfSuperiorStatusEnum.REVISED,
    text: 'Revised',
  },
  {
    key: PerfSuperiorStatusEnum.EXPIRED,
    value: PerfSuperiorStatusEnum.EXPIRED,
    text: 'Expired',
  },
];

export const perfEmployeeStatusOptions: Options[] = [
  {
    key: PerfEmployeeStatusEnum.AVAILABLE,
    value: PerfEmployeeStatusEnum.AVAILABLE,
    text: `Available`,
  },
  {
    key: PerfEmployeeStatusEnum.DRAFT,
    value: PerfEmployeeStatusEnum.DRAFT,
    text: `Draft`,
  },
  {
    key: PerfEmployeeStatusEnum.REVISED,
    value: PerfEmployeeStatusEnum.REVISED,
    text: `Revised`,
  },
  {
    key: PerfEmployeeStatusEnum.IN_PROGRESS,
    value: PerfEmployeeStatusEnum.IN_PROGRESS,
    text: `In Progress`,
  },
  {
    key: PerfEmployeeStatusEnum.COMPLETED,
    value: PerfEmployeeStatusEnum.COMPLETED,
    text: `Completed`,
  },
  {
    key: PerfEmployeeStatusEnum.EXPIRED,
    value: PerfEmployeeStatusEnum.EXPIRED,
    text: `Expired`,
  },
];

export const timelinesListOption: Options[] = [
  {
    key: timelineEnum.GOAL_SETTING_SELF,
    value: timelineEnum.GOAL_SETTING_SELF,
    text: `Goal Setting By Self`,
  },
  {
    key: timelineEnum.GOAL_SETTING_DIRECT_MANAGER,
    value: timelineEnum.GOAL_SETTING_DIRECT_MANAGER,
    text: `Goal Setting Approval By Direct Manager`,
  },
  {
    key: timelineEnum.GOAL_SETTING_ABOVE_DIRECT_MANAGER,
    value: timelineEnum.GOAL_SETTING_ABOVE_DIRECT_MANAGER,
    text: `Goal Setting Approval By Above Direct Manager`,
  },
  {
    key: timelineEnum.MID_YEAR_COACHING_SELF,
    value: timelineEnum.MID_YEAR_COACHING_SELF,
    text: `Mid Year Coaching By Appraisee`,
  },
  {
    key: timelineEnum.MID_YEAR_COACHING_DIRECT_MANAGER,
    value: timelineEnum.MID_YEAR_COACHING_DIRECT_MANAGER,
    text: `Mid Year Coaching By Direct Manager`,
  },
  {
    key: timelineEnum.MID_YEAR_COACHING_ABOVE_DIRECT_MANAGER,
    value: timelineEnum.MID_YEAR_COACHING_ABOVE_DIRECT_MANAGER,
    text: `Mid Year Coaching By Above Direct Manager`,
  },
  {
    key: timelineEnum.END_YEAR_APPRAISEE,
    value: timelineEnum.END_YEAR_APPRAISEE,
    text: `End Year Self Assessment & Comment  by Appraisee`,
  },
  {
    key: timelineEnum.END_YEAR_DIRECT_MANAGER,
    value: timelineEnum.END_YEAR_DIRECT_MANAGER,
    text: `End Year Direct Manager Evaluation & Comment`,
  },
  {
    key: timelineEnum.END_YEAR_ABOVE_DIRECT_MANAGER,
    value: timelineEnum.END_YEAR_ABOVE_DIRECT_MANAGER,
    text: `End Year Above Direct Manager Evaluation & Comment`,
  },
  {
    key: timelineEnum.PERFORMANCE_APPRAISAL_COMPLETED,
    value: timelineEnum.PERFORMANCE_APPRAISAL_COMPLETED,
    text: `Performance Appraisal Completed`,
  },
];
