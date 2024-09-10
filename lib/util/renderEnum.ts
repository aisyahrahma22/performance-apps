import { PerfEmpItemPerKPIScoreTypeEnum } from '../data/perfMidYear/enum/perfEmp.enum';
import {
  PerfEmployeeStatusEnum,
  PerfSuperiorStatusEnum,
} from '../enums/GoalSetting';
import { timelineEnum } from '../enums/PerformanceEnum';
import {
  SchedulerDaysEnum,
  SchedulerEnum,
  SchedulerOptionEnum,
} from '../enums/scheduler';

export const docStatus = {
  draft: 'Draft',
  requested: 'Requested',
};

export const renderEnum = (inputValue: any) => {
  switch (inputValue) {
    case 'MID_END_YEAR':
      return 'Mid Year & End Year';
    case 'END_YEAR':
      return 'End Year';
    case 'POSITION':
      return 'Position';
    case 'EMPLOYEE':
      return 'Employee';
    case 'SINGLE':
      return 'Single Final Result';
    case 'MULTIPLE':
      return 'Multiple Final Result';
    case PerfEmployeeStatusEnum.AVAILABLE:
      return 'Available';
    case PerfEmployeeStatusEnum.DRAFT:
      return docStatus.draft;
    case PerfEmployeeStatusEnum.IN_PROGRESS:
      return 'In Progress';
    case PerfEmployeeStatusEnum.COMPLETED:
      return 'Completed';
    case PerfSuperiorStatusEnum.PENDING:
      return 'Pending';
    case PerfSuperiorStatusEnum.REQUESTED:
      return docStatus.requested;
    case PerfSuperiorStatusEnum.REVISED:
      return 'Revised';
    case PerfSuperiorStatusEnum.PASSED:
      return 'Passed';
    case PerfSuperiorStatusEnum.APPROVED:
      return 'Approved';
    case PerfSuperiorStatusEnum.NO_APPROVAL:
      return 'No Approval';
    case timelineEnum.GOAL_SETTING_SELF:
      return 'Goal Setting By Self';
    case timelineEnum.GOAL_SETTING_DIRECT_MANAGER:
      return 'Goal Setting Approval By Direct Manager';
    case timelineEnum.GOAL_SETTING_ABOVE_DIRECT_MANAGER:
      return 'Goal Setting Approval By Above Direct Manager';
    case timelineEnum.MID_YEAR_COACHING_SELF:
      return 'Mid Year Coaching By Appraisee';
    case timelineEnum.MID_YEAR_COACHING_DIRECT_MANAGER:
      return 'Mid Year Coaching By Direct Manager';
    case timelineEnum.MID_YEAR_COACHING_ABOVE_DIRECT_MANAGER:
      return 'Mid Year Coaching By Above Direct Manager';
    case timelineEnum.END_YEAR_APPRAISEE:
      return 'End Year Self Assessment & Comment by Appraisee';
    case timelineEnum.END_YEAR_DIRECT_MANAGER:
      return 'End Year Direct Manager Evaluation & Comment';
    case timelineEnum.END_YEAR_ABOVE_DIRECT_MANAGER:
      return 'End Year Above Direct Manager Evaluation & Comment';
    case timelineEnum.PERFORMANCE_APPRAISAL_COMPLETED:
      return 'Performance Appraisal Completed';
    case PerfEmpItemPerKPIScoreTypeEnum.APPRAISEE:
      return 'Appraisee';
    case PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER:
      return 'Direct Manager';
    case PerfEmpItemPerKPIScoreTypeEnum.ABOVE_MANAGER:
      return 'Above Direct Manager';
    case SchedulerEnum.PRACTICAL_EXPERIENCE_SCHEDULER:
      return 'Practical Experience Scheduler';
    case SchedulerEnum.SUCESS_PROFILE_REMINDER:
      return 'Success Profile Reminder';
    case SchedulerEnum.JOB_NAME_SUNFISH_DATA_FEEDING:
      return 'Sunfish Data Synchronization';
    case SchedulerEnum.LOGIN_AUDIT_SYNC_SCHEDULER:
      return 'Login Audit Sync Scheduler';
    case SchedulerEnum.ACTIVITY_LOG_SYNC_SCHEDULER:
      return 'Activity Log Sync Scheduler';
    case SchedulerDaysEnum.SUNDAY:
      return 'Sunday';
    case SchedulerDaysEnum.MONDAY:
      return 'Monday';
    case SchedulerDaysEnum.TUESDAY:
      return 'Tuesday';
    case SchedulerDaysEnum.WEDNESDAY:
      return 'Wednesday';
    case SchedulerDaysEnum.THURSDAY:
      return 'Thursday';
    case SchedulerDaysEnum.FRIDAY:
      return 'Friday';
    case SchedulerDaysEnum.SATURDAY:
      return 'Saturday';
    case SchedulerOptionEnum.DAILY:
      return 'Daily';
    case SchedulerOptionEnum.MONTHLY:
      return 'Monthly';
    case SchedulerOptionEnum.WEEKLY:
      return 'Weekly';
    case SchedulerOptionEnum.YEARLY:
      return 'Yearly';
    default:
      return inputValue;
  }
};

export default renderEnum;
