import {
  MaxKPICount,
  MaxKPIWeight,
  PerfFormEnum,
  PerfFormTypeEnum,
} from '../../enums/PerfForm';
import { timelineEnum } from '../../enums/PerformanceEnum';
import { PerfEmployeeStatusEnum } from '../../enums/TimelineStatusEnum';

export const finalResultList = [
  {
    key: PerfFormEnum.AVERAGE,
    text: 'Average',
    value: PerfFormEnum.AVERAGE,
  },
  {
    key: PerfFormEnum.USE_LAST_TERM,
    text: 'Use Last Term',
    value: PerfFormEnum.USE_LAST_TERM,
  },
];

export const perfFormTypeEnumList = [
  {
    key: PerfFormTypeEnum.CATEGORY,
    text: 'Category',
    value: PerfFormTypeEnum.CATEGORY,
  },
  {
    key: PerfFormTypeEnum.NON_CATEGORY,
    text: 'Non Cetegory',
    value: PerfFormTypeEnum.NON_CATEGORY,
  },
];

export const maxKPICountList = [
  {
    key: MaxKPICount.LIMITED,
    text: 'Limited',
    value: MaxKPICount.LIMITED,
  },
  {
    key: MaxKPICount.UNLIMITED,
    text: 'Unlimited',
    value: MaxKPICount.UNLIMITED,
  },
];

export const maxKPIWeightList = [
  {
    key: MaxKPIWeight.LIMITED,
    text: 'Limited',
    value: MaxKPIWeight.LIMITED,
  },
  {
    key: MaxKPIWeight.UNLIMITED,
    text: 'Unlimited',
    value: MaxKPIWeight.UNLIMITED,
  },
];

export const categoryWeight = [
  {
    key: true,
    text: 'Yes',
    value: true,
  },
  {
    key: false,
    text: 'No',
    value: false,
  },
];

export const KPIWeight = [
  {
    key: true,
    text: 'Yes',
    value: true,
  },
  {
    key: false,
    text: 'No',
    value: false,
  },
];

export const dropdownSyncWorkflow = [
  {
    key: true,
    text: 'All',
    value: true,
  },
  {
    key: false,
    text: 'This Page Only',
    value: false,
  },
];

export const perfEmployeeStatusList = [
  {
    key: PerfEmployeeStatusEnum.AVAILABLE,
    text: 'Available',
    value: PerfEmployeeStatusEnum.AVAILABLE,
  },
  {
    key: PerfEmployeeStatusEnum.DRAFT,
    text: 'Draft',
    value: PerfEmployeeStatusEnum.DRAFT,
  },
  {
    key: PerfEmployeeStatusEnum.IN_PROGRESS,
    text: 'In Progress',
    value: PerfEmployeeStatusEnum.IN_PROGRESS,
  },
  {
    key: PerfEmployeeStatusEnum.COMPLETED,
    text: 'Completed',
    value: PerfEmployeeStatusEnum.COMPLETED,
  },
  {
    key: PerfEmployeeStatusEnum.REVISED,
    text: 'Revised',
    value: PerfEmployeeStatusEnum.REVISED,
  },
];

export const timelineStatusList = [
  {
    key: timelineEnum.GOAL_SETTING_SELF,
    text: 'GOAL_SETTING_SELF',
    value: timelineEnum.GOAL_SETTING_SELF,
  },
  {
    key: timelineEnum.GOAL_SETTING_DIRECT_MANAGER,
    text: 'GOAL_SETTING_DIRECT_MANAGER',
    value: timelineEnum.GOAL_SETTING_DIRECT_MANAGER,
  },
  {
    key: timelineEnum.GOAL_SETTING_ABOVE_DIRECT_MANAGER,
    text: 'GOAL_SETTING_ABOVE_DIRECT_MANAGER',
    value: timelineEnum.GOAL_SETTING_ABOVE_DIRECT_MANAGER,
  },
  {
    key: timelineEnum.MID_YEAR_COACHING_SELF,
    text: 'MID_YEAR_COACHING_SELF',
    value: timelineEnum.MID_YEAR_COACHING_SELF,
  },
  {
    key: timelineEnum.MID_YEAR_COACHING_DIRECT_MANAGER,
    text: 'MID_YEAR_COACHING_DIRECT_MANAGER',
    value: timelineEnum.MID_YEAR_COACHING_DIRECT_MANAGER,
  },
  {
    key: timelineEnum.MID_YEAR_COACHING_ABOVE_DIRECT_MANAGER,
    text: 'MID_YEAR_COACHING_ABOVE_DIRECT_MANAGER',
    value: timelineEnum.MID_YEAR_COACHING_ABOVE_DIRECT_MANAGER,
  },
  {
    key: timelineEnum.END_YEAR_APPRAISEE,
    text: 'END_YEAR_APPRAISEE',
    value: timelineEnum.END_YEAR_APPRAISEE,
  },
  {
    key: timelineEnum.END_YEAR_DIRECT_MANAGER,
    text: 'END_YEAR_DIRECT_MANAGER',
    value: timelineEnum.END_YEAR_DIRECT_MANAGER,
  },
  {
    key: timelineEnum.END_YEAR_ABOVE_DIRECT_MANAGER,
    text: 'END_YEAR_ABOVE_DIRECT_MANAGER',
    value: timelineEnum.END_YEAR_ABOVE_DIRECT_MANAGER,
  },
];
